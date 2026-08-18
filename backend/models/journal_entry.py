"""
Journal Entry Models - the persisted core of Ember's Living Journal.

Each journal entry is stored in Firestore and feeds:
- Past Embers (history view)
- The agent's long-term memory (memory block)
- Progress stats (streaks, words, emotional trend)
"""

from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any


class JournalEntryBase(BaseModel):
    """Fields sent by the client when saving an entry."""

    text: str = Field(..., description="Anonymized journal text")
    ritual_id: str = ""
    ritual_name: str = ""
    ritual_emoji: str = ""
    date: str = Field(..., description="ISO date (YYYY-MM-DD)")
    word_count: int = 0
    writing_time_seconds: int = 0
    dominant_emotion: str = "reflection"
    emotion_scores: Dict[str, float] = Field(default_factory=dict)
    intensity: float = Field(default=0.0, ge=0.0, le=100.0)
    agent_response: str = Field(default="", description="Coach reply text")
    agent_emotions: List[str] = Field(default_factory=list)
    spark_challenge_id: str = ""
    privacy_info: Optional[Dict[str, Any]] = Field(
        default=None,
        description="Privacy Shield metadata (pii_redacted, mood_detected, mood_score)",
    )


class JournalEntryCreate(JournalEntryBase):
    """Entry creation payload."""

    user_id: str = Field(..., min_length=1, max_length=128)
    id: Optional[str] = Field(
        default=None, description="Client-provided id (kept as-is)"
    )


class JournalEntryOut(JournalEntryBase):
    """Entry as persisted, with server-side id and timestamp."""

    id: str
    timestamp: float
    user_id: str = ""


class JournalStats(BaseModel):
    """Longitudinal stats for the agent's memory and the dashboard."""

    total_entries: int = 0
    total_words: int = 0
    total_writing_minutes: int = 0
    current_streak: int = 0
    longest_streak: int = 0
    days_written: int = 0
    unique_rituals: int = 0

    # Weekly comparison (memory block)
    this_week_entries: int = 0
    last_week_entries: int = 0
    this_week_words: int = 0
    last_week_words: int = 0
    this_week_emotion: str = "reflection"
    last_week_emotion: str = "reflection"
    this_week_mood_score: float = 0.0
    last_week_mood_score: float = 0.0
    mood_trend: str = "unknown"  # improving | stable | declining | unknown

    first_entry_date: str = ""
    last_entry_date: str = ""

    # Digests of recent entries (agent memory)
    recent_summaries: List[Dict[str, Any]] = Field(default_factory=list)