from __future__ import annotations

from datetime import datetime, timezone, timedelta
from app.core.firebase import get_db


def get_billing_period(user_data: dict) -> tuple[str, datetime, datetime]:
    now = datetime.now(timezone.utc)

    anchor_day = user_data.get("billing_anchor_day")
    if not anchor_day:
        period_start = now.replace(day=1, hour=0, minute=0, second=0, microsecond=0)
        if now.month == 12:
            period_end = period_start.replace(year=now.year + 1, month=1)
        else:
            period_end = period_start.replace(month=now.month + 1)
        key = f"{now.strftime('%Y-%m')}-01"
        return key, period_start, period_end

    anchor_day = min(int(anchor_day), 28)

    if now.day >= anchor_day:
        period_start = now.replace(day=anchor_day, hour=0, minute=0, second=0, microsecond=0)
    else:
        first_of_month = now.replace(day=1)
        prev_month = first_of_month - timedelta(days=1)
        period_start = prev_month.replace(day=anchor_day, hour=0, minute=0, second=0, microsecond=0)

    if period_start.month == 12:
        period_end = period_start.replace(year=period_start.year + 1, month=1)
    else:
        period_end = period_start.replace(month=period_start.month + 1)

    key = period_start.strftime("%Y-%m-%d")
    return key, period_start, period_end


def get_usage_count(user_id: str, user_data: dict) -> tuple[int, str]:
    db = get_db()
    period_key, _, _ = get_billing_period(user_data)
    usage_doc_id = f"{user_id}_{period_key}"

    usage_doc = db.collection("usage").document(usage_doc_id).get()
    if usage_doc.exists:
        return usage_doc.to_dict().get("messages", 0), usage_doc_id

    return 0, usage_doc_id


def increment_usage(usage_doc_id: str, user_id: str, current_count: int, period_key: str):
    db = get_db()
    db.collection("usage").document(usage_doc_id).set(
        {"user_id": user_id, "messages": current_count + 1, "period": period_key},
        merge=True,
    )
