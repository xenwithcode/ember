"""
Chat API Endpoint - Main interaction with the Resilience Coach agent.

Flow (journal):
1. Privacy Shield (Gemma 4) anonymizes + crisis-checks the text
2. Long-term memory block is loaded from Firestore (Memory Bank)
3. Agent (Gemini) responds with the user's real history in context
4. The entry is persisted to Firestore (anonymized)
5. Response returns everything the frontend needs (anonymized text,
   privacy info, saved entry, session id)
"""

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field
from typing import Optional
import time
import uuid

from google.adk.runners import Runner
from google.adk.sessions import InMemorySessionService
from google.genai import types

from backend.agent import resilience_coach
from backend.models.journal_entry import JournalEntryCreate, JournalEntryOut
from backend.services.journal_service import journal_service
from backend.services.privacy_layer import PrivacyLayer

router = APIRouter(prefix="/api/chat", tags=["Chat"])

# Privacy Shield (Gemma 4) — runs BEFORE the agent, never breaks the core
privacy_layer = PrivacyLayer()

# Session management: in-memory for the live conversation, Firestore for the
# long-term memory block. Sessions keep accumulating while the process lives;
# even after a restart the coach still knows the user's history via
# journal_service.build_memory_block().
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

    # Journal metadata (only used by the /journal flow)
    ritual_id: str = ""
    ritual_name: str = ""
    ritual_emoji: str = ""
    word_count: int = 0
    writing_time_seconds: int = 0
    dominant_emotion: str = "reflection"
    emotion_scores: dict = {}
    intensity: float = 0.0


class ChatResponse(BaseModel):
    response: str
    session_id: str
    tool_calls: list = []
    suggested_actions: list = []


JOURNAL_AGENT_PROMPT = """The user has just written a journal entry:

---
{entry_text}
---

{RITUAL_CONTEXT}

You are their Ember coach, responding to THIS entry. Your task:
1. Read the entry and acknowledge what they actually shared — be specific.
2. Reference their history from the MEMORY BLOCK below when it is relevant
   (streak, recent entries, emotional trend). For example: "This is your
   4th entry this week", "You mentioned the same worry last Monday — has it
   shifted?", "Your mood trend is improving". Never invent details that are
   not in the memory block or the current entry.
3. Respond with warmth and specificity. Keep it concise (2-4 short paragraphs).
4. End with ONE small, low-risk, real-world action they could take today.

{MEMORY_BLOCK}
"""


@router.post("/", response_model=ChatResponse)
async def chat_with_agent(request: ChatRequest):
    """Send a message to the Resilience Coach agent (plain conversation)."""
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
    Journal flow: user text → Privacy Layer (Gemma 4) → Memory Block →
    Agent (Gemini) → Entry persisted to Firestore.

    The Privacy Layer anonymizes PII and detects crises BEFORE the text
    reaches the main agent. If it fails, the core chat flow continues
    unchanged (fallback to raw text).
    """
    user_id = request.user_id or "default_user"

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
            "anonymized_text": privacy_result.anonymized_text,
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

    # STEP 4: Build the agent prompt with the user's LONG-TERM MEMORY
    ritual_context = ""
    if request.ritual_name:
        ritual_context = f"The user wrote this as part of the '{request.ritual_name}' ritual."
    memory_block = journal_service.build_memory_block(user_id)

    journal_message = JOURNAL_AGENT_PROMPT.format(
        entry_text=safe_text,
        RITUAL_CONTEXT=ritual_context,
        MEMORY_BLOCK=memory_block,
    )

    # STEP 5: Run agent within the user's session (multi-turn while live)
    session_id = request.session_id
    run_request = ChatRequest(
        message=journal_message,
        user_id=user_id,
        session_id=session_id,
    )
    agent_response = await chat_with_agent(run_request)

    # STEP 6: Persist the entry to Firestore (anonymized) — Memory Bank
    saved_entry = None
    try:
        saved_entry = journal_service.save_entry(
            JournalEntryCreate(
                id=None,
                user_id=user_id,
                text=safe_text,
                ritual_id=request.ritual_id,
                ritual_name=request.ritual_name,
                ritual_emoji=request.ritual_emoji,
                date=time.strftime("%Y-%m-%d"),
                word_count=request.word_count,
                writing_time_seconds=request.writing_time_seconds,
                dominant_emotion=request.dominant_emotion,
                emotion_scores=request.emotion_scores or {},
                intensity=request.intensity,
                agent_response=agent_response.response,
                privacy_info=(
                    {
                        "pii_redacted": len(privacy_result.detected_pii),
                        "mood_detected": privacy_result.mood_label,
                        "mood_score": privacy_result.mood_score,
                        "processing_time_ms": privacy_result.processing_time_ms,
                    }
                    if privacy_result
                    else None
                ),
            )
        )
    except Exception as e:
        print(f"⚠️  Failed to persist journal entry: {e}")

    # STEP 7: Assemble response
    response = agent_response.model_dump()
    response["entry"] = saved_entry.model_dump() if saved_entry else None
    response["anonymized_text"] = safe_text
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