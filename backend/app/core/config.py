from pathlib import Path
from pydantic_settings import BaseSettings, SettingsConfigDict
from functools import lru_cache

_ENV_FILE = Path(__file__).resolve().parent.parent.parent / ".env"


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=str(_ENV_FILE), extra="ignore")

    firebase_project_id: str = ""
    # Legacy: path to service account JSON (local dev only)
    firebase_private_key_path: str = "./firebase-service-account.json"
    # Production: pass credentials as env vars directly
    firebase_private_key: str = ""       # -----BEGIN PRIVATE KEY-----\n...
    firebase_client_email: str = ""      # firebase-adminsdk@project.iam.gserviceaccount.com
    stripe_secret_key: str = ""
    stripe_webhook_secret: str = ""
    stripe_price_basic: str = ""
    stripe_price_starter: str = ""
    stripe_price_pro: str = ""
    stripe_price_business: str = ""
    # Annual prices (create them in Stripe at 20% discount)
    stripe_price_basic_yearly: str = ""
    stripe_price_starter_yearly: str = ""
    stripe_price_pro_yearly: str = ""
    stripe_price_business_yearly: str = ""
    frontend_url: str = "http://localhost:3000"
    api_url: str = "http://localhost:8000"
    anthropic_api_key: str = ""
    admin_secret: str = ""
    admin_enabled: str = "false"  # Set to "true" only in local .env
    resend_api_key: str = ""
    support_email: str = "elieamar2007@gmail.com"


@lru_cache()
def get_settings() -> Settings:
    return Settings()


PLAN_LIMITS = {
    "free": {
        "max_chatbots": 5,
        "max_messages_per_month": 0,
        "max_pages_scraped": 5,
        "custom_branding": False,
        "analytics": False,
        "email_support": False,
        "priority_support": False,
        "can_deploy": False,
    },
    "basic": {
        "max_chatbots": 1,
        "max_messages_per_month": 100,
        "max_pages_scraped": 5,
        "custom_branding": False,
        "analytics": False,
        "email_support": False,
        "priority_support": False,
        "can_deploy": True,
    },
    "starter": {
        "max_chatbots": 3,
        "max_messages_per_month": 1000,
        "max_pages_scraped": 50,
        "custom_branding": True,
        "analytics": False,
        "email_support": True,
        "priority_support": False,
        "can_deploy": True,
    },
    "pro": {
        "max_chatbots": 10,
        "max_messages_per_month": 10000,
        "max_pages_scraped": 200,
        "custom_branding": True,
        "analytics": True,
        "email_support": True,
        "priority_support": True,
        "can_deploy": True,
    },
    "business": {
        "max_chatbots": 50,
        "max_messages_per_month": 100000,
        "max_pages_scraped": 1000,
        "custom_branding": True,
        "analytics": True,
        "email_support": True,
        "priority_support": True,
        "can_deploy": True,
    },
}
