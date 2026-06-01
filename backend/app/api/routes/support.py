from __future__ import annotations

import uuid
from datetime import datetime, timezone
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel, Field
from app.middleware.auth import verify_firebase_token
from app.core.firebase import get_db
from app.core.config import PLAN_LIMITS

router = APIRouter(prefix="/support", tags=["support"])


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

    docs = db.collection("support_tickets").where("user_id", "==", uid).stream()
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
