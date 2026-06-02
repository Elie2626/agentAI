from __future__ import annotations

import hashlib
import re
import time
from collections import defaultdict
from datetime import datetime, timezone
from urllib.parse import urlparse
from fastapi import APIRouter, HTTPException, Request
from app.core.firebase import get_db
from app.core.config import PLAN_LIMITS
from app.models.schemas import ChatMessage
from app.services.chat import generate_response
from app.services.usage import get_billing_period, get_usage_count, increment_usage

router = APIRouter(prefix="/chat", tags=["chat"])

_rate_limit_store: dict[str, list[float]] = defaultdict(list)
RATE_LIMIT_WINDOW = 60
RATE_LIMIT_MAX = 10


def _check_rate_limit(key: str):
    now = time.time()
    window_start = now - RATE_LIMIT_WINDOW
    _rate_limit_store[key] = [t for t in _rate_limit_store[key] if t > window_start]
    if len(_rate_limit_store[key]) >= RATE_LIMIT_MAX:
        raise HTTPException(
            status_code=429,
            detail="Trop de requêtes. Réessayez dans quelques instants.",
        )
    _rate_limit_store[key].append(now)


@router.post("")
async def send_message(body: ChatMessage, request: Request):
    client_ip = request.client.host if request.client else "unknown"
    _check_rate_limit(f"chat:{client_ip}:{body.chatbot_id}")

    db = get_db()

    chatbot_ref = db.collection("chatbots").document(body.chatbot_id)
    chatbot_doc = chatbot_ref.get()
    if not chatbot_doc.exists:
        raise HTTPException(status_code=404, detail="Chatbot non trouvé")

    chatbot_data = chatbot_doc.to_dict()

    allowed_domains = chatbot_data.get("allowed_domains", [])
    if allowed_domains:
        origin = request.headers.get("origin") or request.headers.get("referer", "")
        try:
            origin_host = urlparse(origin).hostname or ""
        except Exception:
            origin_host = ""
        is_localhost = origin_host in ("localhost", "127.0.0.1") or origin_host.startswith("localhost:")
        if not is_localhost and origin_host not in allowed_domains:
            raise HTTPException(
                status_code=403,
                detail="Ce domaine n'est pas autorisé à utiliser ce chatbot.",
            )

    if chatbot_data.get("status") != "active":
        raise HTTPException(status_code=403, detail="Chatbot désactivé")

    owner_id = chatbot_data["owner_id"]

    user_doc = db.collection("users").document(owner_id).get()
    user_data = {}
    plan = "free"
    if user_doc.exists:
        user_data = user_doc.to_dict()
        plan = user_data.get("plan", "free")

    limits = PLAN_LIMITS.get(plan, PLAN_LIMITS["free"])

    if not limits.get("can_deploy", False):
        raise HTTPException(
            status_code=403,
            detail="Un abonnement est requis pour utiliser ce chatbot. Rendez-vous sur BotForge pour souscrire.",
        )

    now = datetime.now(timezone.utc)

    messages_used, usage_doc_id = get_usage_count(owner_id, user_data)

    if messages_used >= limits["max_messages_per_month"]:
        raise HTTPException(
            status_code=429,
            detail="Limite de messages atteinte pour cette période. Passez à un forfait supérieur pour continuer.",
        )

    conv_ref = db.collection("conversations").document(f"{body.chatbot_id}_current")
    conv_doc = conv_ref.get()
    history = []
    if conv_doc.exists:
        history = conv_doc.to_dict().get("messages", [])

    try:
        response = await generate_response(chatbot_data, history, body.message)
    except Exception:
        raise HTTPException(status_code=500, detail="Erreur lors de la génération de la réponse")

    history.append({"role": "user", "content": body.message, "timestamp": now.isoformat()})
    history.append({"role": "assistant", "content": response, "timestamp": now.isoformat()})

    if len(history) > 40:
        history = history[-40:]

    conv_ref.set({
        "chatbot_id": body.chatbot_id,
        "messages": history,
        "updated_at": now.isoformat(),
    })

    period_key, _, _ = get_billing_period(user_data)
    increment_usage(usage_doc_id, owner_id, messages_used, period_key)

    session_hash = hashlib.sha256(
        f"{client_ip}:{body.chatbot_id}".encode()
    ).hexdigest()[:16]
    db.collection("chat_logs").document().set({
        "chatbot_id": body.chatbot_id,
        "owner_id": owner_id,
        "message": body.message[:500],
        "session_id": session_hash,
        "timestamp": now.isoformat(),
        "hour": now.hour,
        "date": now.strftime("%Y-%m-%d"),
    })

    return {
        "response": response,
        "messages_used": messages_used + 1,
        "messages_limit": limits["max_messages_per_month"],
    }


@router.post("/{chatbot_id}/reset")
async def reset_conversation(chatbot_id: str, request: Request):
    client_ip = request.client.host if request.client else "unknown"
    _check_rate_limit(f"reset:{client_ip}")

    if not re.match(r"^[a-f0-9\-]{36}$", chatbot_id):
        raise HTTPException(status_code=400, detail="ID invalide")

    db = get_db()
    chatbot_doc = db.collection("chatbots").document(chatbot_id).get()
    if not chatbot_doc.exists:
        raise HTTPException(status_code=404, detail="Chatbot non trouvé")

    conv_ref = db.collection("conversations").document(f"{chatbot_id}_current")
    conv_ref.delete()
    return {"status": "reset"}
