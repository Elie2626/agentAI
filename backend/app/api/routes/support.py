from __future__ import annotations

import asyncio
import uuid
from datetime import datetime, timezone
from fastapi import APIRouter, Depends, HTTPException
import resend
from google.cloud.firestore_v1.base_query import FieldFilter
from pydantic import BaseModel, Field
from app.middleware.auth import verify_firebase_token
from app.core.firebase import get_db
from app.core.config import PLAN_LIMITS, get_settings

router = APIRouter(prefix="/support", tags=["support"])

CATEGORY_LABELS = {
    "general": "Question générale",
    "bug": "Bug",
    "billing": "Facturation",
    "feature": "Demande de fonctionnalité",
    "other": "Autre",
}


class CreateTicketRequest(BaseModel):
    subject: str = Field(min_length=3, max_length=200)
    message: str = Field(min_length=10, max_length=5000)
    category: str = Field(default="general")


class TicketResponse(BaseModel):
    id: str
    subject: str
    message: str
    category: str
    status: str
    created_at: str


ALLOWED_CATEGORIES = {"general", "bug", "billing", "feature", "other"}


async def _send_ticket_email(ticket: dict) -> None:
    settings = get_settings()
    if not settings.resend_api_key:
        return

    resend.api_key = settings.resend_api_key
    cat = CATEGORY_LABELS.get(ticket["category"], ticket["category"])
    html = f"""
    <div style="font-family:system-ui,sans-serif;max-width:600px;margin:0 auto;padding:24px">
      <h2 style="color:#6366f1;margin:0 0 16px">Nouveau ticket de support</h2>
      <table style="width:100%;border-collapse:collapse;margin-bottom:20px">
        <tr><td style="padding:6px 0;color:#64748b;width:120px">De</td><td style="padding:6px 0;font-weight:600">{ticket['user_email']}</td></tr>
        <tr><td style="padding:6px 0;color:#64748b">Plan</td><td style="padding:6px 0">{ticket['plan']}</td></tr>
        <tr><td style="padding:6px 0;color:#64748b">Catégorie</td><td style="padding:6px 0">{cat}</td></tr>
        <tr><td style="padding:6px 0;color:#64748b">Sujet</td><td style="padding:6px 0;font-weight:600">{ticket['subject']}</td></tr>
      </table>
      <div style="background:#f8fafc;border-radius:8px;padding:16px;white-space:pre-wrap;line-height:1.6">{ticket['message']}</div>
      <p style="margin-top:20px;color:#94a3b8;font-size:13px">botexpress Admin Panel → http://localhost:4000</p>
    </div>
    """

    def _send():
        resend.Emails.send({
            "from": "botexpress Support <onboarding@resend.dev>",
            "to": [settings.support_email],
            "subject": f"[botexpress Support] {ticket['subject']}",
            "html": html,
        })

    try:
        await asyncio.to_thread(_send)
    except Exception as e:
        print(f"[support] email failed: {e}")


@router.post("", response_model=TicketResponse)
async def create_ticket(
    body: CreateTicketRequest,
    user: dict = Depends(verify_firebase_token),
):
    db = get_db()
    uid = user["uid"]

    user_doc = db.collection("users").document(uid).get()
    plan = "free"
    if user_doc.exists:
        plan = user_doc.to_dict().get("plan", "free")

    limits = PLAN_LIMITS.get(plan, PLAN_LIMITS["free"])
    if not limits.get("email_support", False):
        raise HTTPException(
            status_code=403,
            detail="Le support email est disponible à partir du plan Starter.",
        )

    if body.category not in ALLOWED_CATEGORIES:
        raise HTTPException(status_code=400, detail="Catégorie invalide")

    ticket_id = str(uuid.uuid4())
    now = datetime.now(timezone.utc).isoformat()

    ticket_data = {
        "user_id": uid,
        "user_email": user.get("email", ""),
        "plan": plan,
        "subject": body.subject,
        "message": body.message,
        "category": body.category,
        "status": "open",
        "created_at": now,
        "updated_at": now,
    }

    db.collection("support_tickets").document(ticket_id).set(ticket_data)

    asyncio.create_task(_send_ticket_email(ticket_data))

    return TicketResponse(
        id=ticket_id,
        subject=body.subject,
        message=body.message,
        category=body.category,
        status="open",
        created_at=now,
    )


@router.get("", response_model=list[TicketResponse])
async def list_tickets(user: dict = Depends(verify_firebase_token)):
    db = get_db()
    uid = user["uid"]

    user_doc = db.collection("users").document(uid).get()
    plan = "free"
    if user_doc.exists:
        plan = user_doc.to_dict().get("plan", "free")

    limits = PLAN_LIMITS.get(plan, PLAN_LIMITS["free"])
    if not limits.get("email_support", False):
        raise HTTPException(
            status_code=403,
            detail="Le support email est disponible à partir du plan Starter.",
        )

    docs = db.collection("support_tickets").where(filter=FieldFilter("user_id", "==", uid)).stream()
    results = []
    for doc in docs:
        d = doc.to_dict()
        results.append(TicketResponse(
            id=doc.id,
            subject=d.get("subject", ""),
            message=d.get("message", ""),
            category=d.get("category", "general"),
            status=d.get("status", "open"),
            created_at=d.get("created_at", ""),
        ))
    results.sort(key=lambda x: x.created_at, reverse=True)
    return results
