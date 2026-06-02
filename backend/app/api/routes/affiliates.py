from __future__ import annotations

import random
import string
from datetime import datetime, timezone
from typing import Optional

from fastapi import APIRouter, Depends, HTTPException
from app.middleware.auth import verify_firebase_token
from app.core.firebase import get_db

router = APIRouter(prefix="/affiliate", tags=["affiliate"])


def _generate_code(db) -> str:
    """Generate a unique 8-char referral code prefixed with BE."""
    for _ in range(20):
        code = "BE" + "".join(random.choices(string.ascii_uppercase + string.digits, k=6))
        existing = list(
            db.collection("users").where("referral_code", "==", code).limit(1).stream()
        )
        if not existing:
            return code
    raise RuntimeError("Could not generate unique referral code")


@router.get("")
async def get_affiliate(user: dict = Depends(verify_firebase_token)):
    """Get or create the user's referral code and link."""
    db = get_db()
    user_doc = db.collection("users").document(user["uid"]).get()

    referral_code = None
    if user_doc.exists:
        referral_code = user_doc.to_dict().get("referral_code")

    if not referral_code:
        referral_code = _generate_code(db)
        db.collection("users").document(user["uid"]).set(
            {"referral_code": referral_code}, merge=True
        )

    from app.core.config import get_settings
    settings = get_settings()
    base = settings.frontend_url or "https://www.botexpress.fr"

    return {
        "referral_code": referral_code,
        "referral_link": f"{base}/auth/register?ref={referral_code}",
    }


@router.get("/stats")
async def get_affiliate_stats(user: dict = Depends(verify_firebase_token)):
    """Return earnings and referral list for the authenticated user."""
    db = get_db()

    commissions = list(
        db.collection("commissions")
        .where("referrer_uid", "==", user["uid"])
        .stream()
    )

    result = []
    for c in commissions:
        d = c.to_dict()
        result.append({
            "id": c.id,
            "plan": d.get("plan", ""),
            "commission": d.get("commission", 0.0),
            "status": d.get("status", "pending"),
            "created_at": d.get("created_at", ""),
        })

    result.sort(key=lambda x: x["created_at"], reverse=True)

    total_earned = sum(r["commission"] for r in result)
    pending = sum(r["commission"] for r in result if r["status"] == "pending")
    paid = sum(r["commission"] for r in result if r["status"] == "paid")

    return {
        "total_referrals": len(result),
        "total_earned": round(total_earned, 2),
        "pending": round(pending, 2),
        "paid": round(paid, 2),
        "referrals": result,
    }
