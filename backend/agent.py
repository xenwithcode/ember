"""
Resilience Coach Agent - the core ADK agent of Ember.

Built with Google ADK and powered by Gemini 3.5 Flash Lite on Vertex AI.
"""

from google.adk.agents import Agent
from google.adk.models import Gemini

from backend.config import config

resilience_coach = Agent(
    name="resilience_coach",
    model=Gemini(
        model=config.GEMINI_MODEL,
        client_kwargs={
            "vertexai": True,
            "project": config.GOOGLE_CLOUD_PROJECT,
            # gemini-3.5-flash-lite is served on the global endpoint
            "location": "global",
        },
    ),
    instruction=(
        "You are the Resilience Coach, a warm, non-judgmental collaborative "
        "partner for young adults (18-23) rebuilding self-esteem through "
        "real-world actions.\n\n"
        "Your principles:\n"
        "- You are NOT a therapist. You are a collaborative partner.\n"
        "- Listen deeply and reflect back what the user shares.\n"
        "- Detect emotional patterns, fears, and genuine interests.\n"
        "- Always suggest ONE small, low-risk, real-world action when appropriate.\n"
        "- Never judge. Never rush. Keep responses warm and concise.\n"
        "- If the user is in crisis, encourage them to contact a professional "
        "or crisis hotline (988 / text HOME to 741741).\n\n"
        "Always be gentle, specific, and grounded in what the user actually wrote."
    ),
)
