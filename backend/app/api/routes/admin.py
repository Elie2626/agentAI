from __future__ import annotations

from datetime import datetime, timezone
from fastapi import APIRouter, HTTPException, Header
from google.cloud.firestore_v1.base_query import FieldFilter
from pydantic import BaseModel
from app.core.firebase import get_db
from app.core.config import get_settings, PLAN_LIMITS
from app.services.usage import get_billing_period

router = APIRouter(prefix="/admin", tags=["admin"])


def _require_admin(secret: str | None):
    settings = get_settings()
    if not settings.admin_secret or secret != settings.admin_secret:
        raise HTTPException(status_code=401, detail="Non autorisé")


@router.get("/stats")
async def admin_stats(x_admin_secret: str | None = Header(default=None)):
    _require_admin(x_admin_secret)
    db = get_db()

    users = list(db.collection("users").stream())
    chatbots = list(db.collection("chatbots").stream())
    logs = list(db.collection("chat_logs").stream())

    plan_distribution: dict[str, int] = {}
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
async def admin_list_users(x_admin_secret: str | None = Header(default=None)):
    _require_admin(x_admin_secret)
    db = get_db()

    user_docs = list(db.collection("users").stream())
    chatbot_docs = list(db.collection("chatbots").stream())

    chatbot_counts: dict[str, int] = {}
    for doc in chatbot_docs:
        owner = doc.to_dict().get("owner_id", "")
        chatbot_counts[owner] = chatbot_counts.get(owner, 0) + 1

    # Get current period usage for all users
    now = datetime.now(timezone.utc)
    period_key_month = now.strftime("%Y-%m")
    usage_docs = list(db.collection("usage").stream())
    usage_map: dict[str, int] = {}
    for doc in usage_docs:
        d = doc.to_dict()
        uid = d.get("user_id", "")
        period = d.get("period", "")
        if period.startswith(period_key_month):
            usage_map[uid] = usage_map.get(uid, 0) + d.get("messages", 0)

    result = []
    for doc in user_docs:
        data = doc.to_dict()
        uid = doc.id
        result.append({
            "uid": uid,
            "email": data.get("email", ""),
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
    x_admin_secret: str | None = Header(default=None),
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
async def admin_list_tickets(x_admin_secret: str | None = Header(default=None)):
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
    x_admin_secret: str | None = Header(default=None),
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


@router.delete("/users/{uid}")
async def admin_delete_user(
    uid: str,
    x_admin_secret: str | None = Header(default=None),
):
    _require_admin(x_admin_secret)
    db = get_db()
    ref = db.collection("users").document(uid)
    if not ref.get().exists:
        raise HTTPException(status_code=404, detail="Utilisateur non trouvé")
    ref.delete()
    return {"status": "deleted"}
