from __future__ import annotations

import uuid
from collections import Counter, defaultdict
from datetime import datetime, timezone, timedelta
from fastapi import APIRouter, Depends, HTTPException
from google.cloud.firestore_v1.base_query import FieldFilter
from app.middleware.auth import verify_firebase_token
from app.core.firebase import get_db
from app.core.config import get_settings, PLAN_LIMITS
from app.models.schemas import (
    CreateChatbotRequest,
    UpdateChatbotRequest,
    ChatbotResponse,
)
from app.services.scraper import analyze_website, crawl_website

router = APIRouter(prefix="/chatbots", tags=["chatbots"])


def _build_embed_code(chatbot_id: str) -> str:
    settings = get_settings()
    return (
        f'<script src="{settings.frontend_url}/widget.js" '
        f'data-chatbot-id="{chatbot_id}" '
        f'data-api-url="{settings.api_url}"></script>'
    )


def _chatbot_to_response(doc_id: str, data: dict) -> ChatbotResponse:
    return ChatbotResponse(
        id=doc_id,
        name=data.get("name", ""),
        chatbot_type=data.get("chatbot_type", "other"),
        website_url=data.get("website_url", ""),
        logo_url=data.get("logo_url", ""),
        favicon_url=data.get("favicon_url", ""),
        primary_color=data.get("primary_color", "#6366f1"),
        secondary_color=data.get("secondary_color", "#818cf8"),
        text_color=data.get("text_color", "auto"),
        font_family=data.get("font_family", "Inter"),
        industry=data.get("industry", ""),
        welcome_message=data.get("welcome_message", ""),
        placeholder_text=data.get("placeholder_text", ""),
        position=data.get("position", "bottom-right"),
        widget_size=data.get("widget_size", "medium"),
        status=data.get("status", "active"),
        created_at=data.get("created_at", ""),
        embed_code=_build_embed_code(doc_id),
    )


WELCOME_MESSAGES = {
    "support": "Bonjour ! Comment puis-je vous aider aujourd'hui ?",
    "sales": "Bienvenue ! Je suis là pour vous aider à trouver ce qu'il vous faut.",
    "booking": "Bonjour ! Souhaitez-vous prendre rendez-vous ?",
    "restaurant": "Bienvenue ! Puis-je vous aider avec notre menu ou une réservation ?",
    "real_estate": "Bonjour ! Recherchez-vous un bien immobilier ?",
    "ecommerce": "Bienvenue ! Comment puis-je vous aider dans vos achats ?",
    "other": "Bonjour ! Comment puis-je vous aider ?",
}


@router.post("", response_model=ChatbotResponse)
async def create_chatbot(
    body: CreateChatbotRequest,
    user: dict = Depends(verify_firebase_token),
):
    db = get_db()
    uid = user["uid"]

    user_ref = db.collection("users").document(uid)
    user_doc = user_ref.get()
    plan = "free"
    if user_doc.exists:
        plan = user_doc.to_dict().get("plan", "free")

    limits = PLAN_LIMITS.get(plan, PLAN_LIMITS["free"])

    existing = list(
        db.collection("chatbots")
        .where(filter=FieldFilter("owner_id", "==", uid))
        .stream()
    )
    count = len(existing)
    if count >= limits["max_chatbots"]:
        raise HTTPException(
            status_code=403,
            detail=f"Limite de {limits['max_chatbots']} chatbot(s) atteinte pour le plan {plan}",
        )

    try:
        analysis = await analyze_website(str(body.website_url))
    except Exception as e:
        raise HTTPException(status_code=422, detail=f"Impossible d'analyser le site : {str(e)}")

    max_pages = limits.get("max_pages_scraped", 5)
    try:
        site_content, pages_scraped = await crawl_website(
            str(body.website_url), max_pages=max_pages
        )
    except Exception:
        site_content = analysis.content_summary
        pages_scraped = 1

    chatbot_id = str(uuid.uuid4())
    now = datetime.now(timezone.utc).isoformat()

    chatbot_data = {
        "owner_id": uid,
        "name": body.name,
        "chatbot_type": body.chatbot_type.value,
        "website_url": str(body.website_url),
        "logo_url": analysis.logo_url,
        "favicon_url": analysis.favicon_url,
        "primary_color": analysis.primary_color,
        "secondary_color": analysis.secondary_color,
        "font_family": analysis.font_family,
        "industry": analysis.industry,
        "content_summary": analysis.content_summary,
        "site_content": site_content,
        "pages_scraped": pages_scraped,
        "tone": analysis.tone,
        "welcome_message": WELCOME_MESSAGES.get(body.chatbot_type.value, WELCOME_MESSAGES["other"]),
        "placeholder_text": "Écrivez votre message...",
        "position": "bottom-right",
        "status": "active",
        "created_at": now,
        "updated_at": now,
    }

    db.collection("chatbots").document(chatbot_id).set(chatbot_data)

    return _chatbot_to_response(chatbot_id, chatbot_data)


@router.get("", response_model=list[ChatbotResponse])
async def list_chatbots(user: dict = Depends(verify_firebase_token)):
    db = get_db()
    docs = (
        db.collection("chatbots")
        .where(filter=FieldFilter("owner_id", "==", user["uid"]))
        .stream()
    )
    results = [_chatbot_to_response(doc.id, doc.to_dict()) for doc in docs]
    results.sort(key=lambda x: x.created_at, reverse=True)
    return results


@router.get("/{chatbot_id}", response_model=ChatbotResponse)
async def get_chatbot(
    chatbot_id: str,
    user: dict = Depends(verify_firebase_token),
):
    db = get_db()
    doc = db.collection("chatbots").document(chatbot_id).get()
    if not doc.exists:
        raise HTTPException(status_code=404, detail="Chatbot non trouvé")

    data = doc.to_dict()
    if data["owner_id"] != user["uid"]:
        raise HTTPException(status_code=403, detail="Accès non autorisé")

    return _chatbot_to_response(doc.id, data)


@router.patch("/{chatbot_id}", response_model=ChatbotResponse)
async def update_chatbot(
    chatbot_id: str,
    body: UpdateChatbotRequest,
    user: dict = Depends(verify_firebase_token),
):
    db = get_db()
    ref = db.collection("chatbots").document(chatbot_id)
    doc = ref.get()
    if not doc.exists:
        raise HTTPException(status_code=404, detail="Chatbot non trouvé")

    data = doc.to_dict()
    if data["owner_id"] != user["uid"]:
        raise HTTPException(status_code=403, detail="Accès non autorisé")

    updates = body.model_dump(exclude_none=True)

    user_doc = db.collection("users").document(user["uid"]).get()
    plan = "free"
    if user_doc.exists:
        plan = user_doc.to_dict().get("plan", "free")
    limits = PLAN_LIMITS.get(plan, PLAN_LIMITS["free"])

    if not limits.get("custom_branding", False):
        branding_fields = {"primary_color", "secondary_color", "text_color", "font_family", "widget_size", "avatar_url"}
        blocked = [f for f in branding_fields if f in updates]
        if blocked:
            raise HTTPException(
                status_code=403,
                detail="La personnalisation du branding nécessite un plan Starter ou supérieur.",
            )

    updates["updated_at"] = datetime.now(timezone.utc).isoformat()
    ref.update(updates)

    data.update(updates)
    return _chatbot_to_response(chatbot_id, data)


@router.delete("/{chatbot_id}")
async def delete_chatbot(
    chatbot_id: str,
    user: dict = Depends(verify_firebase_token),
):
    db = get_db()
    ref = db.collection("chatbots").document(chatbot_id)
    doc = ref.get()
    if not doc.exists:
        raise HTTPException(status_code=404, detail="Chatbot non trouvé")

    data = doc.to_dict()
    if data["owner_id"] != user["uid"]:
        raise HTTPException(status_code=403, detail="Accès non autorisé")

    ref.delete()
    return {"status": "deleted"}


@router.get("/{chatbot_id}/embed")
async def get_embed_code(chatbot_id: str):
    import re
    if not re.match(r"^[a-f0-9\-]{36}$", chatbot_id):
        raise HTTPException(status_code=400, detail="ID invalide")

    db = get_db()
    doc = db.collection("chatbots").document(chatbot_id).get()
    if not doc.exists:
        raise HTTPException(status_code=404, detail="Chatbot non trouvé")

    data = doc.to_dict()
    return {
        "embed_code": _build_embed_code(chatbot_id),
        "chatbot_id": chatbot_id,
        "config": {
            "name": data.get("name"),
            "primary_color": data.get("primary_color"),
            "secondary_color": data.get("secondary_color"),
            "text_color": data.get("text_color", "auto"),
            "font_family": data.get("font_family"),
            "logo_url": data.get("logo_url"),
            "welcome_message": data.get("welcome_message"),
            "placeholder_text": data.get("placeholder_text"),
            "position": data.get("position"),
            "widget_size": data.get("widget_size", "medium"),
        },
    }


@router.get("/{chatbot_id}/analytics")
async def get_chatbot_analytics(
    chatbot_id: str,
    user: dict = Depends(verify_firebase_token),
):
    db = get_db()

    doc = db.collection("chatbots").document(chatbot_id).get()
    if not doc.exists:
        raise HTTPException(status_code=404, detail="Chatbot non trouvé")
    if doc.to_dict()["owner_id"] != user["uid"]:
        raise HTTPException(status_code=403, detail="Accès non autorisé")

    now = datetime.now(timezone.utc)
    cutoff = (now - timedelta(days=30)).isoformat()

    logs = list(
        db.collection("chat_logs")
        .where(filter=FieldFilter("chatbot_id", "==", chatbot_id))
        .stream()
    )

    recent_logs = []
    all_logs_count = len(logs)
    all_sessions: set[str] = set()

    hourly: dict[int, int] = defaultdict(int)
    daily: dict[str, int] = defaultdict(int)
    questions: list[str] = []

    for log_doc in logs:
        d = log_doc.to_dict()
        sid = d.get("session_id", "")
        ts = d.get("timestamp", "")
        if sid:
            all_sessions.add(sid)

        if ts >= cutoff:
            recent_logs.append(d)
            hourly[d.get("hour", 0)] += 1
            daily[d.get("date", "")] += 1
            msg = d.get("message", "").strip()
            if msg:
                questions.append(msg)

    hourly_distribution = [hourly.get(h, 0) for h in range(24)]

    today = now.date()
    daily_activity = []
    for i in range(29, -1, -1):
        day = (today - timedelta(days=i)).isoformat()
        daily_activity.append({"date": day, "count": daily.get(day, 0)})

    question_counts = Counter()
    for q in questions:
        normalized = q.lower().strip().rstrip("?!. ")
        if len(normalized) > 5:
            question_counts[normalized] += 1

    top_questions = []
    for original_q in questions:
        norm = original_q.lower().strip().rstrip("?!. ")
        if norm in {tq["normalized"] for tq in top_questions}:
            continue
        count = question_counts.get(norm, 0)
        if count >= 1:
            top_questions.append({
                "question": original_q,
                "normalized": norm,
                "count": count,
            })

    top_questions.sort(key=lambda x: x["count"], reverse=True)
    top_questions_clean = [
        {"question": tq["question"], "count": tq["count"]}
        for tq in top_questions[:15]
    ]

    total_sessions = len(all_sessions)
    recent_count = len(recent_logs)

    return {
        "total_messages": all_logs_count,
        "total_sessions": total_sessions,
        "recent_messages": recent_count,
        "avg_messages_per_session": round(all_logs_count / max(total_sessions, 1), 1),
        "hourly_distribution": hourly_distribution,
        "daily_activity": daily_activity,
        "top_questions": top_questions_clean,
        "period_days": 30,
    }
