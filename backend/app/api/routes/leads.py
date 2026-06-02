from __future__ import annotations

import uuid
from datetime import datetime, timezone
from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, Request
from pydantic import BaseModel
from app.middleware.auth import verify_firebase_token
from app.core.firebase import get_db

router = APIRouter(prefix="/leads", tags=["leads"])


class LeadBody(BaseModel):
    chatbot_id: str
    session_id: Optional[str] = ""
    name: Optional[str] = ""
    email: Optional[str] = ""
    phone: Optional[str] = ""


@router.post("/capture")
async def capture_lead(body: LeadBody, request: Request):
    """Public endpoint — called by the widget to record a lead."""
    db = get_db()

    chatbot_doc = db.collection("chatbots").document(body.chatbot_id).get()
    if not chatbot_doc.exists:
        raise HTTPException(status_code=404, detail="Chatbot introuvable")

    chatbot_data = chatbot_doc.to_dict()
    if not chatbot_data.get("lead_capture_enabled", False):
        return {"ok": True, "skipped": True}

    lead_id = str(uuid.uuid4())
    ip = request.headers.get("x-forwarded-for", "")
    if not ip and request.client:
        ip = request.client.host

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
