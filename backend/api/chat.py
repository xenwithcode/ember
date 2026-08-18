"""
Chat API Endpoint - Main interaction with the Resilience Coach agent.
"""

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field
from typing import Optional
import uuid

from google.adk.runners import Runner
from google.adk.sessions import InMemorySessionService
from google.genai import types

from backend.agent import resilience_coach
from backend.services.privacy_layer import PrivacyLayer

router = APIRouter(prefix="/api/chat", tags=["Chat"])

# Privacy Shield (Gemma 4) — runs BEFORE the agent, never breaks the core
privacy_layer = PrivacyLayer()

# Session management
session_service = InMemorySessionService()
runner = Runner(
    agent=resilience_coach,
    app_name="reset_your_mind",
    session_service=session_service,
    auto_create_session=True,
)


class ChatRequest(BaseModel):
    message: str = Field(..., min_length=1, max_length=5000)
    user_id: str = "default_user"
    session_id: Optional[str] = None
    context: Optional[dict] = None


class ChatResponse(BaseModel):
    response: str
    session_id: str
    tool_calls: list = []
    suggested_actions: list = []


@router.post("/", response_model=ChatResponse)
async def chat_with_agent(request: ChatRequest):
    """Send a message to the Resilience Coach agent."""
    try:
        session_id = request.session_id or str(uuid.uuid4())

        # Create user message
        user_message = types.Content(
            role="user",
            parts=[types.Part(text=request.message)],
        )

        # Run agent (async API — same event loop as FastAPI)
        response_text = ""
        tool_calls = []

        async for event in runner.run_async(
            user_id=request.user_id,
            session_id=session_id,
            new_message=user_message,
        ):
            if hasattr(event, "content") and event.content:
                for part in event.content.parts:
                    if hasattr(part, "text") and part.text:
                        response_text += part.text
                    elif hasattr(part, "function_call"):
                        tool_calls.append({
                            "tool": part.function_call.name,
                            "args": dict(part.function_call.args),
                        })

        if not response_text:
            response_text = "I'm here to help. What's been on your mind?"

        return ChatResponse(
            response=response_text,
            session_id=session_id,
            tool_calls=tool_calls,
        )

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/journal")
async def submit_journal_entry(request: ChatRequest):
    """
    Journal flow: user text → Privacy Layer (Gemma 4) → Agent (Gemini).

    The Privacy Layer anonymizes PII and detects crises BEFORE the text
    reaches the main agent. If it fails, the core chat flow continues
    unchanged (fallback to raw text).
    """
    # STEP 1: Privacy Layer (Gemma 4) — wrapped so the core never breaks
    privacy_result = None
    try:
        privacy_result = await privacy_layer.process(request.message)
    except Exception as e:
        print(f"Privacy Layer failed (continuing with raw text): {e}")

    # STEP 2: Crisis detection → immediate response, skip agent
    if privacy_result and privacy_result.crisis_detected:
        return {
            "response": (
                "I care about your safety, and I'm taking this seriously. "
                "Please reach out to someone right now — you don't have to "
                "face this alone."
            ),
            "session_id": request.session_id or str(uuid.uuid4()),
            "crisis_alert": privacy_result.safety_alert,
            "skip_agent": True,
            "privacy_info": {
                "shield_active": True,
                "pii_redacted": len(privacy_result.detected_pii),
                "mood_detected": privacy_result.mood_label,
                "crisis_detected": True,
            },
            "resources": [
                {"name": "988 Suicide & Crisis Lifeline", "contact": "Call or text 988"},
                {"name": "Crisis Text Line", "contact": "Text HOME to 741741"},
                {"name": "International Help", "contact": "findahelpline.com"},
            ],
        }

    # STEP 3: Use ANONYMIZED text for the main agent (Gemini)
    safe_text = (
        privacy_result.anonymized_text if privacy_result else request.message
    )

    journal_message = f"""
The user has written the following in their journal:

---
{safe_text}
---

Analyze their emotional state, then respond with empathy.
Suggest one small, achievable action they could take in the real world.
Remember: You are not a therapist. You are a collaborative partner.
"""
    modified_request = ChatRequest(
        message=journal_message,
        user_id=request.user_id,
        session_id=request.session_id,
    )
    agent_response = await chat_with_agent(modified_request)

    # STEP 4: Attach privacy info to the response
    response = agent_response.model_dump()
    if privacy_result:
        response["privacy_info"] = {
            "shield_active": True,
            "pii_redacted": len(privacy_result.detected_pii),
            "mood_detected": privacy_result.mood_label,
            "mood_score": privacy_result.mood_score,
            "processing_time_ms": privacy_result.processing_time_ms,
            "crisis_detected": False,
        }
    else:
        response["privacy_info"] = {"shield_active": False}
    return response