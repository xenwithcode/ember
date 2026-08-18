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

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from backend.api.activities import router as activities_router
from backend.api.calendar import router as calendar_router
from backend.api.chat import router as chat_router
from backend.api.privacy import router as privacy_router
from backend.config import config


app = FastAPI(
    title="Ember API",
    description=(
        "Backend API for Ember - a collaborative AI agent that helps "
        "young adults rebuild self-esteem through real-world actions.\n\n"
        "Built with Google ADK, Gemini 3.5 Flash, and Google Cloud Firestore."
    ),
    version="1.0.0",
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(chat_router)
app.include_router(activities_router)
app.include_router(calendar_router)
app.include_router(privacy_router)


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
            "activities": "/api/activities",
            "calendar": "/api/calendar",
            "privacy": "/api/privacy",
            "docs": "/docs",
        },
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("backend.main:app", host=config.HOST, port=config.PORT, reload=True)