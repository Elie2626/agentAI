from datetime import datetime, timezone
from fastapi import APIRouter, Depends
from app.middleware.auth import verify_firebase_token
from app.core.firebase import get_db

router = APIRouter(prefix="/users", tags=["users"])


@router.get("/me")
async def get_current_user(user: dict = Depends(verify_firebase_token)):
    db = get_db()
    user_ref = db.collection("users").document(user["uid"])
    user_doc = user_ref.get()

    if not user_doc.exists:
        now = datetime.now(timezone.utc).isoformat()
        user_data = {
            "uid": user["uid"],
            "email": user.get("email", ""),
            "plan": "free",
            "created_at": now,
        }
        user_ref.set(user_data)
        return user_data

    return user_doc.to_dict()


@router.patch("/me")
async def update_user(
    updates: dict,
    user: dict = Depends(verify_firebase_token),
):
    db = get_db()
    allowed_fields = {"display_name", "company_name", "website"}
    filtered = {k: v for k, v in updates.items() if k in allowed_fields}

    if filtered:
        filtered["updated_at"] = datetime.now(timezone.utc).isoformat()
        db.collection("users").document(user["uid"]).set(filtered, merge=True)

    doc = db.collection("users").document(user["uid"]).get()
    return doc.to_dict()
