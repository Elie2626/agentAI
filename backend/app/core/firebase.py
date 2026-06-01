import firebase_admin
from firebase_admin import credentials, firestore, auth, storage
from app.core.config import get_settings

_app = None


def init_firebase():
    global _app
    if _app:
        return
    settings = get_settings()

    # Production: use env vars directly (Railway, Render, etc.)
    if settings.firebase_private_key and settings.firebase_client_email:
        cred = credentials.Certificate({
            "type": "service_account",
            "project_id": settings.firebase_project_id,
            "private_key": settings.firebase_private_key.replace("\\n", "\n"),
            "client_email": settings.firebase_client_email,
            "token_uri": "https://oauth2.googleapis.com/token",
        })
    else:
        # Local dev: use JSON file
        cred = credentials.Certificate(settings.firebase_private_key_path)

    _app = firebase_admin.initialize_app(cred, {
        "storageBucket": f"{settings.firebase_project_id}.firebasestorage.app"
    })


def get_db():
    init_firebase()
    return firestore.client()


def get_auth():
    init_firebase()
    return auth


def get_bucket():
    init_firebase()
    return storage.bucket()
