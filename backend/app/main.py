from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import get_settings
from app.core.firebase import init_firebase
from app.api.routes import chatbots, conversations, billing, users, support

app = FastAPI(
    title="BotForge API",
    description="API pour la plateforme de création de chatbots IA",
    version="1.0.0",
    docs_url=None,
    redoc_url=None,
)

settings = get_settings()

# Widget runs on third-party sites → must accept any origin.
# Dashboard auth uses Bearer tokens (not cookies) so credentials flag is not needed.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(chatbots.router, prefix="/api/v1")
app.include_router(conversations.router, prefix="/api/v1")
app.include_router(billing.router, prefix="/api/v1")
app.include_router(users.router, prefix="/api/v1")
app.include_router(support.router, prefix="/api/v1")


@app.on_event("startup")
async def startup():
    init_firebase()


@app.api_route("/health", methods=["GET", "HEAD"])
async def health():
    return {"status": "ok", "version": "1.0.0"}
