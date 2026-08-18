"""
Ember - FastAPI Server (UPDATED)
===========================================

Now includes:
- Agent chat endpoints
- Activity discovery endpoints
- Calendar management endpoints
- User profile endpoints

All running on Cloud Run (Hackathon requirement #3)
"""

from fastapi import Depends, FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware

from backend.api.activities import router as activities_router
from backend.api.calendar import router as calendar_router
from backend.api.chat import router as chat_router
from backend.api.journal import router as journal_router
from backend.api.privacy import router as privacy_router
from backend.config import config


def api_key_dependency(request: Request) -> None:
    """Require X-API-Key only when EMBER_API_KEY is configured.

    Local dev (no key set) keeps working exactly as before.
    """
    if not config.EMBER_API_KEY:
        return
    provided = request.headers.get("X-API-Key", "")
    if provided != config.EMBER_API_KEY:
        raise HTTPException(status_code=401, detail="Missing or invalid API key")


from contextlib import asynccontextmanager

from backend.database.seed_data import seed_activities


@asynccontextmanager
async def lifespan(_: FastAPI):
    # Idempotent catalog sync: (re)seeds activities keyed by stable slug
    # every boot so the demo always has a consistent, linkable catalog.
    try:
        seed_activities()
    except Exception as exc:  # never block boot on seed issues
        print(f"[startup] catalog seed skipped: {exc}")
    yield


app = FastAPI(
    title="Ember API",
    description=(
        "Backend API for Ember - a collaborative AI agent that helps "
        "young adults rebuild self-esteem through real-world actions.\n\n"
        "Built with Google ADK, Gemini 3.5 Flash, and Google Cloud Firestore."
    ),
    version="1.0.0",
    lifespan=lifespan,
)

# CORS — explicit origins only (never "*" with credentials)
app.add_middleware(
    CORSMiddleware,
    allow_origins=config.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers (all API endpoints are protected by the API key when set)
for router in (
    chat_router,
    activities_router,
    calendar_router,
    privacy_router,
    journal_router,
):
    app.include_router(router, dependencies=[Depends(api_key_dependency)])


@app.get("/")
async def root():
    """Health check and API info."""
    return {
        "status": "healthy",
        "app": "Ember",
        "version": "1.0.0",
        "message": "Helping young adults rebuild self-esteem through real-world actions",
        "endpoints": {
            "chat": "/api/chat",
            "journal": "/api/journal",
            "activities": "/api/activities",
            "calendar": "/api/calendar",
            "privacy": "/api/privacy",
            "docs": "/docs",
        },
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("backend.main:app", host=config.HOST, port=config.PORT, reload=True)