from __future__ import annotations

from datetime import datetime, timezone
from typing import Optional
from fastapi import APIRouter, Request
from pydantic import BaseModel
from app.core.firebase import get_db

router = APIRouter(prefix="/cookies", tags=["cookies"])


class ConsentBody(BaseModel):
    session_id: str
    accepted: bool
    user_agent: Optional[str] = ""
    page: Optional[str] = ""


@router.post("/consent")
async def record_consent(body: ConsentBody, request: Request):
    db = get_db()
    db.collection("cookie_consents").document(body.session_id).set({
        "session_id": body.session_id,
        "accepted": body.accepted,
        "user_agent": body.user_agent or "",
        "page": body.page or "",
        "ip": request.headers.get("x-forwarded-for", request.client.host if request.client else ""),
        "timestamp": datetime.now(timezone.utc).isoformat(),
    })
    return {"ok": True}
