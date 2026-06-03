from __future__ import annotations

from datetime import datetime, timezone
from typing import Optional
from fastapi import APIRouter, HTTPException, Header
from google.cloud.firestore_v1.base_query import FieldFilter
from pydantic import BaseModel
from app.core.firebase import get_db
from app.core.config import get_settings, PLAN_LIMITS
from app.services.usage import get_billing_period

router = APIRouter(prefix="/admin", tags=["admin"])


def _require_admin(secret: Optional[str]):
    settings = get_settings()
    if not settings.admin_secret or secret != settings.admin_secret:
        raise HTTPException(status_code=401, detail="Non autorisé")


@router.get("/stats")
async def admin_stats(x_admin_secret: Optional[str] = Header(default=None)):
    _require_admin(x_admin_secret)
    db = get_db()

    users = list(db.collection("users").stream())
    chatbots = list(db.collection("chatbots").stream())
    logs = list(db.collection("chat_logs").stream())

    plan_distribution: dict = {}
    for doc in users:
        plan = doc.to_dict().get("plan", "free")
        plan_distribution[plan] = plan_distribution.get(plan, 0) + 1

    return {
        "total_users": len(users),
        "total_chatbots": len(chatbots),
        "total_messages": len(logs),
        "plan_distribution": plan_distribution,
    }


@router.get("/users")
async def admin_list_users(x_admin_secret: Optional[str] = Header(default=None)):
    _require_admin(x_admin_secret)
    import firebase_admin.auth as fb_auth
    db = get_db()

    user_docs = list(db.collection("users").stream())
    chatbot_docs = list(db.collection("chatbots").stream())

    chatbot_counts: dict = {}
    for doc in chatbot_docs:
        owner = doc.to_dict().get("owner_id", "")
        chatbot_counts[owner] = chatbot_counts.get(owner, 0) + 1

    # Get current period usage for all users
    now = datetime.now(timezone.utc)
    period_key_month = now.strftime("%Y-%m")
    usage_docs = list(db.collection("usage").stream())
    usage_map: dict = {}
    for doc in usage_docs:
        d = doc.to_dict()
        uid = d.get("user_id", "")
        period = d.get("period", "")
        if period.startswith(period_key_month):
            usage_map[uid] = usage_map.get(uid, 0) + d.get("messages", 0)

    # Collect UIDs missing email in Firestore and fetch from Firebase Auth
    missing_email_uids = []
    firestore_data = {}
    for doc in user_docs:
        data = doc.to_dict()
        firestore_data[doc.id] = data
        if not data.get("email"):
            missing_email_uids.append(doc.id)

    # Batch fetch from Firebase Auth for users without email in Firestore
    auth_emails: dict = {}
    for i in range(0, len(missing_email_uids), 100):
        batch = missing_email_uids[i:i+100]
        try:
            identifiers = [fb_auth.UidIdentifier(uid) for uid in batch]
            result_batch = fb_auth.get_users(identifiers)
            for u in result_batch.users:
                if u.email:
                    auth_emails[u.uid] = u.email
                    # Backfill email in Firestore so next call doesn't need Auth lookup
                    db.collection("users").document(u.uid).set(
                        {"email": u.email}, merge=True
                    )
        except Exception:
            pass

    result = []
    for uid, data in firestore_data.items():
        email = data.get("email") or auth_emails.get(uid, "")
        result.append({
            "uid": uid,
            "email": email,
            "plan": data.get("plan", "free"),
            "created_at": data.get("created_at", ""),
            "chatbot_count": chatbot_counts.get(uid, 0),
            "messages_used": usage_map.get(uid, 0),
        })

    result.sort(key=lambda x: x["created_at"], reverse=True)
    return result


class UpdatePlanBody(BaseModel):
    plan: str


@router.patch("/users/{uid}/plan")
async def admin_update_plan(
    uid: str,
    body: UpdatePlanBody,
    x_admin_secret: Optional[str] = Header(default=None),
):
    _require_admin(x_admin_secret)

    if body.plan not in PLAN_LIMITS:
        raise HTTPException(status_code=400, detail="Plan invalide")

    db = get_db()
    ref = db.collection("users").document(uid)
    if not ref.get().exists:
        raise HTTPException(status_code=404, detail="Utilisateur non trouvé")

    ref.update({"plan": body.plan})
    return {"uid": uid, "plan": body.plan}


class UpdateTicketBody(BaseModel):
    status: str


@router.get("/tickets")
async def admin_list_tickets(x_admin_secret: Optional[str] = Header(default=None)):
    _require_admin(x_admin_secret)
    db = get_db()
    docs = list(db.collection("support_tickets").stream())
    result = []
    for doc in docs:
        d = doc.to_dict()
        result.append({
            "id": doc.id,
            "user_email": d.get("user_email", ""),
            "plan": d.get("plan", "free"),
            "subject": d.get("subject", ""),
            "message": d.get("message", ""),
            "category": d.get("category", "general"),
            "status": d.get("status", "open"),
            "created_at": d.get("created_at", ""),
        })
    result.sort(key=lambda x: x["created_at"], reverse=True)
    return result


@router.patch("/tickets/{ticket_id}/status")
async def admin_update_ticket_status(
    ticket_id: str,
    body: UpdateTicketBody,
    x_admin_secret: Optional[str] = Header(default=None),
):
    _require_admin(x_admin_secret)
    if body.status not in ("open", "in_progress", "resolved"):
        raise HTTPException(status_code=400, detail="Statut invalide")
    db = get_db()
    ref = db.collection("support_tickets").document(ticket_id)
    if not ref.get().exists:
        raise HTTPException(status_code=404, detail="Ticket non trouvé")
    ref.update({"status": body.status, "updated_at": datetime.now(timezone.utc).isoformat()})
    return {"id": ticket_id, "status": body.status}


@router.get("/cookies")
async def admin_list_cookies(x_admin_secret: Optional[str] = Header(default=None)):
    _require_admin(x_admin_secret)
    db = get_db()
    docs = list(db.collection("cookie_consents").stream())
    result = []
    for doc in docs:
        d = doc.to_dict()
        result.append({
            "session_id": d.get("session_id", ""),
            "accepted": d.get("accepted", False),
            "page": d.get("page", ""),
            "user_agent": d.get("user_agent", ""),
            "ip": d.get("ip", ""),
            "timestamp": d.get("timestamp", ""),
        })
    result.sort(key=lambda x: x["timestamp"], reverse=True)
    accepted = sum(1 for r in result if r["accepted"])
    return {
        "total": len(result),
        "accepted": accepted,
        "declined": len(result) - accepted,
        "rate": round(accepted / len(result) * 100) if result else 0,
        "consents": result,
    }


@router.get("/affiliates")
async def admin_list_affiliates(x_admin_secret: Optional[str] = Header(default=None)):
    """List all users with pending commissions + their IBAN."""
    _require_admin(x_admin_secret)
    db = get_db()

    commissions = list(db.collection("commissions").stream())

    # Group by referrer
    referrer_data: dict = {}
    for c in commissions:
        d = c.to_dict()
        uid = d.get("referrer_uid", "")
        if not uid:
            continue
        if uid not in referrer_data:
            referrer_data[uid] = {"pending": 0.0, "paid": 0.0, "total": 0.0, "count": 0}
        amount = d.get("commission", 0.0)
        referrer_data[uid]["total"] += amount
        referrer_data[uid]["count"] += 1
        if d.get("status") == "pending":
            referrer_data[uid]["pending"] += amount
        else:
            referrer_data[uid]["paid"] += amount

    result = []
    for uid, stats in referrer_data.items():
        user_doc = db.collection("users").document(uid).get()
        user_info = user_doc.to_dict() if user_doc.exists else {}
        result.append({
            "uid": uid,
            "email": user_info.get("email", ""),
            "full_name": user_info.get("payout_name", ""),
            "iban": user_info.get("payout_iban", ""),
            "referral_code": user_info.get("referral_code", ""),
            "total_referrals": stats["count"],
            "pending": round(stats["pending"], 2),
            "paid": round(stats["paid"], 2),
            "total": round(stats["total"], 2),
        })

    result.sort(key=lambda x: x["pending"], reverse=True)
    return {"affiliates": result}


@router.patch("/commissions/{commission_id}/mark-paid")
async def admin_mark_commission_paid(
    commission_id: str,
    x_admin_secret: Optional[str] = Header(default=None),
):
    """Mark a commission as paid."""
    _require_admin(x_admin_secret)
    db = get_db()
    ref = db.collection("commissions").document(commission_id)
    if not ref.get().exists:
        raise HTTPException(status_code=404, detail="Commission non trouvée")
    ref.update({"status": "paid", "paid_at": datetime.now(timezone.utc).isoformat()})
    return {"status": "paid"}


@router.delete("/users/{uid}")
async def admin_delete_user(
    uid: str,
    x_admin_secret: Optional[str] = Header(default=None),
):
    _require_admin(x_admin_secret)
    db = get_db()
    ref = db.collection("users").document(uid)
    if not ref.get().exists:
        raise HTTPException(status_code=404, detail="Utilisateur non trouvé")
    ref.delete()
    return {"status": "deleted"}
