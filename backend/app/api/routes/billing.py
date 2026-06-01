from __future__ import annotations

import stripe
from datetime import datetime, timezone
from fastapi import APIRouter, Depends, HTTPException, Request
from app.middleware.auth import verify_firebase_token
from app.core.firebase import get_db
from app.core.config import get_settings, PLAN_LIMITS
from app.models.schemas import CreateCheckoutRequest
from app.services.usage import get_usage_count, get_billing_period

router = APIRouter(prefix="/billing", tags=["billing"])


def _get_stripe():
    settings = get_settings()
    stripe.api_key = settings.stripe_secret_key
    return stripe


def _get_price_id(plan: str) -> str:
    settings = get_settings()
    mapping = {
        "basic": settings.stripe_price_basic,
        "starter": settings.stripe_price_starter,
        "pro": settings.stripe_price_pro,
        "business": settings.stripe_price_business,
    }
    price_id = mapping.get(plan)
    if not price_id:
        raise HTTPException(status_code=400, detail="Plan invalide")
    return price_id


def _price_to_plan_map() -> dict:
    settings = get_settings()
    return {
        settings.stripe_price_basic: "basic",
        settings.stripe_price_starter: "starter",
        settings.stripe_price_pro: "pro",
        settings.stripe_price_business: "business",
    }


@router.post("/checkout")
async def create_checkout_session(
    body: CreateCheckoutRequest,
    user: dict = Depends(verify_firebase_token),
):
    s = _get_stripe()
    settings = get_settings()
    db = get_db()

    user_doc = db.collection("users").document(user["uid"]).get()
    customer_id = None
    if user_doc.exists:
        customer_id = user_doc.to_dict().get("stripe_customer_id")

    if not customer_id:
        customer = s.Customer.create(
            email=user.get("email", ""),
            metadata={"firebase_uid": user["uid"]},
        )
        customer_id = customer.id
        db.collection("users").document(user["uid"]).set(
            {"stripe_customer_id": customer_id}, merge=True
        )

    price_id = _get_price_id(body.plan.value)

    session = s.checkout.Session.create(
        customer=customer_id,
        payment_method_types=["card"],
        line_items=[{"price": price_id, "quantity": 1}],
        mode="subscription",
        success_url=f"{settings.frontend_url}/dashboard/billing?success=true",
        cancel_url=f"{settings.frontend_url}/dashboard/billing?canceled=true",
        metadata={"firebase_uid": user["uid"], "plan": body.plan.value},
    )

    return {"checkout_url": session.url}


@router.post("/portal")
async def create_portal_session(user: dict = Depends(verify_firebase_token)):
    s = _get_stripe()
    settings = get_settings()
    db = get_db()

    user_doc = db.collection("users").document(user["uid"]).get()
    if not user_doc.exists:
        raise HTTPException(status_code=404, detail="Utilisateur non trouvé")

    customer_id = user_doc.to_dict().get("stripe_customer_id")
    if not customer_id:
        raise HTTPException(status_code=400, detail="Aucun abonnement actif")

    session = s.billing_portal.Session.create(
        customer=customer_id,
        return_url=f"{settings.frontend_url}/dashboard/billing",
    )

    return {"portal_url": session.url}


@router.post("/webhook")
async def stripe_webhook(request: Request):
    s = _get_stripe()
    settings = get_settings()
    payload = await request.body()
    sig_header = request.headers.get("stripe-signature")

    try:
        event = s.Webhook.construct_event(
            payload, sig_header, settings.stripe_webhook_secret
        )
    except ValueError:
        raise HTTPException(status_code=400, detail="Payload invalide")
    except s.error.SignatureVerificationError:
        raise HTTPException(status_code=400, detail="Signature invalide")

    db = get_db()
    now = datetime.now(timezone.utc)

    if event["type"] == "checkout.session.completed":
        session = event["data"]["object"]
        uid = session["metadata"].get("firebase_uid")
        plan = session["metadata"].get("plan")
        if uid and plan:
            db.collection("users").document(uid).set(
                {
                    "plan": plan,
                    "stripe_subscription_id": session.get("subscription"),
                    "billing_anchor_day": now.day,
                },
                merge=True,
            )
            db.collection("subscriptions").document(uid).set({
                "user_id": uid,
                "stripe_customer_id": session["customer"],
                "stripe_subscription_id": session.get("subscription"),
                "plan": plan,
                "status": "active",
                "billing_anchor_day": now.day,
            }, merge=True)

    elif event["type"] == "customer.subscription.updated":
        subscription = event["data"]["object"]
        customer_id = subscription["customer"]
        status = subscription["status"]

        users = (
            db.collection("users")
            .where("stripe_customer_id", "==", customer_id)
            .limit(1)
            .stream()
        )
        for user_doc in users:
            update_data = {"subscription_status": status}
            if status == "canceled":
                update_data["plan"] = "free"
            db.collection("users").document(user_doc.id).update(update_data)

    elif event["type"] == "customer.subscription.deleted":
        subscription = event["data"]["object"]
        customer_id = subscription["customer"]

        users = (
            db.collection("users")
            .where("stripe_customer_id", "==", customer_id)
            .limit(1)
            .stream()
        )
        for user_doc in users:
            db.collection("users").document(user_doc.id).update({
                "plan": "free",
                "subscription_status": "canceled",
            })

    return {"status": "ok"}


@router.post("/sync")
async def sync_subscription(user: dict = Depends(verify_firebase_token)):
    s = _get_stripe()
    db = get_db()
    now = datetime.now(timezone.utc)

    user_doc = db.collection("users").document(user["uid"]).get()
    if not user_doc.exists:
        return {"plan": "free", "synced": False}

    customer_id = user_doc.to_dict().get("stripe_customer_id")
    if not customer_id:
        return {"plan": "free", "synced": False}

    subscriptions = s.Subscription.list(customer=customer_id, status="active", limit=1)

    if not subscriptions.data:
        db.collection("users").document(user["uid"]).set(
            {"plan": "free", "subscription_status": "none"}, merge=True
        )
        return {"plan": "free", "synced": True}

    sub = subscriptions.data[0]
    price_id = sub["items"]["data"][0]["price"]["id"]
    plan = _price_to_plan_map().get(price_id, "free")

    db.collection("users").document(user["uid"]).set(
        {
            "plan": plan,
            "stripe_subscription_id": sub["id"],
            "subscription_status": "active",
            "billing_anchor_day": now.day,
        },
        merge=True,
    )
    db.collection("subscriptions").document(user["uid"]).set({
        "user_id": user["uid"],
        "stripe_customer_id": customer_id,
        "stripe_subscription_id": sub["id"],
        "plan": plan,
        "status": "active",
        "billing_anchor_day": now.day,
    }, merge=True)

    return {"plan": plan, "synced": True}


@router.get("/usage")
async def get_usage(user: dict = Depends(verify_firebase_token)):
    db = get_db()

    user_doc = db.collection("users").document(user["uid"]).get()
    user_data = {}
    plan = "free"
    if user_doc.exists:
        user_data = user_doc.to_dict()
        plan = user_data.get("plan", "free")

    limits = PLAN_LIMITS.get(plan, PLAN_LIMITS["free"])

    messages_used, _ = get_usage_count(user["uid"], user_data)

    _, period_start, period_end = get_billing_period(user_data)

    chatbots_list = list(
        db.collection("chatbots")
        .where("owner_id", "==", user["uid"])
        .stream()
    )

    return {
        "plan": plan,
        "messages_used": messages_used,
        "messages_limit": limits["max_messages_per_month"],
        "chatbots_used": len(chatbots_list),
        "chatbots_limit": limits["max_chatbots"],
        "can_deploy": limits.get("can_deploy", False),
        "period_start": period_start.isoformat(),
        "period_end": period_end.isoformat(),
        "features": {
            "custom_branding": limits["custom_branding"],
            "analytics": limits["analytics"],
            "email_support": limits.get("email_support", False),
            "priority_support": limits["priority_support"],
        },
    }
