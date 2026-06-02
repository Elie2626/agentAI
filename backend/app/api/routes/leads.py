from __future__ import annotations

import uuid
from collections import defaultdict
from datetime import datetime, timezone
from time import time
from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, Request
from pydantic import BaseModel, Field
from app.middleware.auth import verify_firebase_token
from app.core.firebase import get_db

router = APIRouter(prefix="/leads", tags=["leads"])

# Rate limiting: max 10 leads per chatbot_id per 60s
_lead_rate: dict = defaultdict(list)
_LEAD_LIMIT = 10
_LEAD_WINDOW = 60


def _check_lead_rate(key: str):
    now = time()
    _lead_rate[key] = [t for t in _lead_rate[key] if t > now - _LEAD_WINDOW]
    if len(_lead_rate[key]) >= _LEAD_LIMIT:
        raise HTTPException(status_code=429, detail="Trop de requêtes")
    _lead_rate[key].append(now)


class LeadBody(BaseModel):
    chatbot_id: str = Field(max_length=64)
    session_id: Optional[str] = Field(default="", max_length=128)
    name: Optional[str] = Field(default="", max_length=200)
    email: Optional[str] = Field(default="", max_length=254)
    phone: Optional[str] = Field(default="", max_length=30)


@router.post("/capture")
async def capture_lead(body: LeadBody, request: Request):
    client_ip = request.headers.get("x-forwarded-for", "").split(",")[0].strip() or (
        request.client.host if request.client else "unknown"
    )
    # Rate limit per chatbot AND per IP to prevent abuse
    _check_lead_rate(f"bot:{body.chatbot_id}")
    _check_lead_rate(f"ip:{client_ip}")
    """Public endpoint — called by the widget to record a lead."""
    db = get_db()

    chatbot_doc = db.collection("chatbots").document(body.chatbot_id).get()
    if not chatbot_doc.exists:
        raise HTTPException(status_code=404, detail="Chatbot introuvable")

    chatbot_data = chatbot_doc.to_dict()
    if not chatbot_data.get("lead_capture_enabled", False):
        return {"ok": True, "skipped": True}

    lead_id = str(uuid.uuid4())
    ip = client_ip

    db.collection("leads").document(lead_id).set({
        "id": lead_id,
        "chatbot_id": body.chatbot_id,
        "owner_id": chatbot_data.get("owner_id", ""),
        "session_id": body.session_id or "",
        "name": body.name or "",
        "email": body.email or "",
        "phone": body.phone or "",
        "ip": ip,
        "created_at": datetime.now(timezone.utc).isoformat(),
    })

    return {"ok": True, "lead_id": lead_id}


@router.get("/{chatbot_id}")
async def list_leads(chatbot_id: str, user: dict = Depends(verify_firebase_token)):
    """Return all leads for a chatbot (owner only)."""
    db = get_db()

    chatbot_doc = db.collection("chatbots").document(chatbot_id).get()
    if not chatbot_doc.exists:
        raise HTTPException(status_code=404, detail="Chatbot introuvable")

    if chatbot_doc.to_dict().get("owner_id") != user["uid"]:
        raise HTTPException(status_code=403, detail="Accès refusé")

    docs = list(db.collection("leads").where("chatbot_id", "==", chatbot_id).stream())

    leads = []
    for doc in docs:
        d = doc.to_dict()
        leads.append({
            "id": d.get("id", doc.id),
            "name": d.get("name", ""),
            "email": d.get("email", ""),
            "phone": d.get("phone", ""),
            "session_id": d.get("session_id", ""),
            "created_at": d.get("created_at", ""),
        })

    leads.sort(key=lambda x: x["created_at"], reverse=True)

    return {"total": len(leads), "leads": leads}
