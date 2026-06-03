from __future__ import annotations

import time
import hmac
from collections import defaultdict
from datetime import datetime, timezone
from typing import Optional
from fastapi import APIRouter, HTTPException, Header, Request
from google.cloud.firestore_v1.base_query import FieldFilter
from pydantic import BaseModel
from app.core.firebase import get_db
from app.core.config import get_settings, PLAN_LIMITS
from app.services.usage import get_billing_period

router = APIRouter(prefix="/admin", tags=["admin"])

# Rate limiting: max 10 attempts per IP per 60s
_admin_attempts: dict = defaultdict(list)
_MAX_ATTEMPTS = 10
_WINDOW = 60


def _require_admin(secret: Optional[str], request: Request = None):
    settings = get_settings()

    # Block entirely if not explicitly enabled (should only be true on local machine)
    if settings.admin_enabled.lower() != "true":
        raise HTTPException(status_code=404, detail="Not found")

    # Rate limit by IP
    if request:
        ip = request.headers.get("x-forwarded-for", "").split(",")[0].strip() or "unknown"
        now = time.time()
        _admin_attempts[ip] = [t for t in _admin_attempts[ip] if t > now - _WINDOW]
        if len(_admin_attempts[ip]) >= _MAX_ATTEMPTS:
            raise HTTPException(status_code=429, detail="Trop de tentatives")
        _admin_attempts[ip].append(now)

    # Constant-time comparison to prevent timing attacks
    if not settings.admin_secret or not secret:
        raise HTTPException(status_code=401, detail="Non autorisé")
    if not hmac.compare_digest(secret, settings.admin_secret):
        raise HTTPException(status_code=401, detail="Non autorisé")


@router.get("/stats")
async def admin_stats(request: Request, x_admin_secret: Optional[str] = Header(default=None)):
    _require_admin(x_admin_secret, request)
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
async def admin_list_users(request: Request, x_admin_secret: Optional[str] = Header(default=None)):
    _require_admin(x_admin_secret, request)
    import firebase_admin.auth as fb_auth
    db = get_db()

    # --- 1. Get ALL Firebase Auth users ---
    all_auth_users: dict = {}
    try:
        page = fb_auth.list_users()
        for u in page.users:
            all_auth_users[u.uid] = u.email or ""
    except Exception:
        pass

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

    # --- 2. Build result from Firestore docs ---
    result = []
    seen_uids = set()

    for doc in user_docs:
        data = doc.to_dict()
        uid = doc.id
        seen_uids.add(uid)
        email = data.get("email") or all_auth_users.get(uid, "")
        # Backfill email if missing
        if not data.get("email") and email:
            db.collection("users").document(uid).set({"email": email}, merge=True)
        result.append({
            "uid": uid,
            "email": email,
            "plan": data.get("plan", "free"),
            "created_at": data.get("created_at", ""),
            "chatbot_count": chatbot_counts.get(uid, 0),
            "messages_used": usage_map.get(uid, 0),
        })

    # --- 3. Add Firebase Auth users who have NO Firestore doc ---
    for uid, email in all_auth_users.items():
        if uid in seen_uids:
            continue
        # Create minimal Firestore doc so they appear next time too
        now_iso = datetime.now(timezone.utc).isoformat()
        db.collection("users").document(uid).set({
            "uid": uid,
            "email": email,
            "plan": "free",
            "created_at": now_iso,
        }, merge=True)
        result.append({
            "uid": uid,
            "email": email,
            "plan": "free",
            "created_at": now_iso,
            "chatbot_count": chatbot_counts.get(uid, 0),
            "messages_used": usage_map.get(uid, 0),
        })

    result.sort(key=lambda x: x["created_at"], reverse=True)
    return result


class UpdatePlanBody(BaseModel):
    plan: str


@router.patch("/users/{uid}/plan")
async def admin_update_plan(
    request: Request,
    uid: str,
    body: UpdatePlanBody,
    x_admin_secret: Optional[str] = Header(default=None),
):
    _require_admin(x_admin_secret, request)

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
async def admin_list_tickets(request: Request, x_admin_secret: Optional[str] = Header(default=None)):
    _require_admin(x_admin_secret, request)
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
    request: Request,
    ticket_id: str,
    body: UpdateTicketBody,
    x_admin_secret: Optional[str] = Header(default=None),
):
    _require_admin(x_admin_secret, request)
    if body.status not in ("open", "in_progress", "resolved"):
        raise HTTPException(status_code=400, detail="Statut invalide")
    db = get_db()
    ref = db.collection("support_tickets").document(ticket_id)
    if not ref.get().exists:
        raise HTTPException(status_code=404, detail="Ticket non trouvé")
    ref.update({"status": body.status, "updated_at": datetime.now(timezone.utc).isoformat()})
    return {"id": ticket_id, "status": body.status}


@router.get("/cookies")
async def admin_list_cookies(request: Request, x_admin_secret: Optional[str] = Header(default=None)):
    _require_admin(x_admin_secret, request)
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
async def admin_list_affiliates(request: Request, x_admin_secret: Optional[str] = Header(default=None)):
    """List all users with pending commissions + their IBAN."""
    _require_admin(x_admin_secret, request)
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
    request: Request,
    commission_id: str,
    x_admin_secret: Optional[str] = Header(default=None),
):
    """Mark a commission as paid."""
    _require_admin(x_admin_secret, request)
    db = get_db()
    ref = db.collection("commissions").document(commission_id)
    if not ref.get().exists:
        raise HTTPException(status_code=404, detail="Commission non trouvée")
    ref.update({"status": "paid", "paid_at": datetime.now(timezone.utc).isoformat()})
    return {"status": "paid"}


@router.delete("/users/{uid}")
async def admin_delete_user(
    request: Request,
    uid: str,
    x_admin_secret: Optional[str] = Header(default=None),
):
    _require_admin(x_admin_secret, request)
    db = get_db()
    ref = db.collection("users").document(uid)
    if not ref.get().exists:
        raise HTTPException(status_code=404, detail="Utilisateur non trouvé")
    ref.delete()
    return {"status": "deleted"}
