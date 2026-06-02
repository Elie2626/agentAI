from __future__ import annotations

import random
import string
from datetime import datetime, timezone
from typing import Optional

import re
from pydantic import BaseModel, Field
from fastapi import APIRouter, Depends, HTTPException
from app.middleware.auth import verify_firebase_token
from app.core.firebase import get_db

# IBAN: 2 letters (country) + 2 digits (check) + up to 30 alphanumeric chars
_IBAN_RE = re.compile(r'^[A-Z]{2}[0-9]{2}[A-Z0-9]{1,30}$')


class PayoutInfoBody(BaseModel):
    full_name: str = Field(min_length=2, max_length=150)
    iban: str = Field(min_length=15, max_length=34)

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


PAID_PLANS = {"basic", "starter", "pro", "business"}


def _require_paid_plan(user_data: dict):
    """Raise 403 if user doesn't have an active paid plan."""
    plan = user_data.get("plan", "free")
    status = user_data.get("subscription_status", "")
    if plan not in PAID_PLANS or status not in ("active", "trialing"):
        raise HTTPException(
            status_code=403,
            detail="Un abonnement actif est requis pour accéder au programme d'affiliation.",
        )


@router.get("")
async def get_affiliate(user: dict = Depends(verify_firebase_token)):
    """Get or create the user's referral code and link. Requires active subscription."""
    db = get_db()
    user_doc = db.collection("users").document(user["uid"]).get()
    user_data = user_doc.to_dict() if user_doc.exists else {}

    _require_paid_plan(user_data)

    referral_code = user_data.get("referral_code")

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


@router.get("/payout-info")
async def get_payout_info(user: dict = Depends(verify_firebase_token)):
    """Return the user's saved IBAN and name. Requires active subscription."""
    db = get_db()
    doc = db.collection("users").document(user["uid"]).get()
    data = doc.to_dict() if doc.exists else {}
    _require_paid_plan(data)
    return {
        "full_name": data.get("payout_name", ""),
        "iban": data.get("payout_iban", ""),
    }


@router.put("/payout-info")
async def save_payout_info(
    body: PayoutInfoBody,
    user: dict = Depends(verify_firebase_token),
):
    """Save the user's IBAN and name for commission payouts. Requires active subscription."""
    db = get_db()
    doc = db.collection("users").document(user["uid"]).get()
    _require_paid_plan(doc.to_dict() if doc.exists else {})
    iban_clean = body.iban.replace(" ", "").upper()
    if not _IBAN_RE.match(iban_clean):
        raise HTTPException(status_code=400, detail="IBAN invalide (format attendu : FR76...)")

    db = get_db()
    db.collection("users").document(user["uid"]).set(
        {
            "payout_name": body.full_name.strip(),
            "payout_iban": iban_clean,
        },
        merge=True,
    )
    return {"ok": True}


@router.get("/stats")
async def get_affiliate_stats(user: dict = Depends(verify_firebase_token)):
    """Return earnings and referral list. Requires active subscription."""
    db = get_db()
    user_doc_check = db.collection("users").document(user["uid"]).get()
    _require_paid_plan(user_doc_check.to_dict() if user_doc_check.exists else {})

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

    user_doc = db.collection("users").document(user["uid"]).get()
    user_data = user_doc.to_dict() if user_doc.exists else {}

    return {
        "total_referrals": len(result),
        "total_earned": round(total_earned, 2),
        "pending": round(pending, 2),
        "paid": round(paid, 2),
        "referrals": result,
        "payout_name": user_data.get("payout_name", ""),
        "payout_iban": user_data.get("payout_iban", ""),
    }
