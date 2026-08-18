"""
Journal Service - persists journal entries in Firestore and computes
longitudinal stats. This is Ember's Memory Bank: it powers Past Embers,
the dashboard, and the agent's long-term memory block.

The in-memory stub keeps local dev working without GCP credentials.
"""

import random
import string
import time
from datetime import datetime, timedelta, timezone
from typing import Any, Dict, List, Optional

from backend.config import config
from backend.database.firestore_client import db
from backend.models.journal_entry import (
    JournalEntryCreate,
    JournalEntryOut,
    JournalStats,
)

_WEEK_SECONDS = 7 * 24 * 60 * 60


def _normalize(doc: Any) -> Optional[dict]:
    """Handle both real Firestore snapshots and the in-memory stub (dicts)."""
    if doc is None:
        return None
    if hasattr(doc, "to_dict"):
        data = doc.to_dict()
        return data if data is not None else None
    if isinstance(doc, dict):
        return doc
    return None


class JournalService:
    """Firestore-backed journal storage + longitudinal stats."""

    def __init__(self):
        self.collection = config.FIRESTORE_COLLECTION_JOURNAL

    # ========================================
    # CRUD
    # ========================================

    def save_entry(self, entry: JournalEntryCreate) -> JournalEntryOut:
        """Persist an entry. Uses the client id when provided."""
        entry_id = entry.id or self._gen_id()
        data = entry.model_dump(exclude={"id"})
        data["id"] = entry_id  # stored inside the doc so reads work everywhere
        data["timestamp"] = time.time()
        data["user_id"] = entry.user_id
        db.client.collection(self.collection).document(entry_id).set(data)
        return JournalEntryOut(**data)

    def list_entries(
        self, user_id: str, limit: int = 200
    ) -> List[JournalEntryOut]:
        """List a user's entries, newest first."""
        try:
            if db.using_stub:
                docs = db.client.collection(self.collection).stream()
            else:
                docs = (
                    db.client.collection(self.collection)
                    .where("user_id", "==", user_id)
                    .limit(max(limit, 500))
                    .stream()
                )
        except Exception:
            docs = db.client.collection(self.collection).stream()

        entries = []
        for doc in docs:
            data = _normalize(doc)
            if not data:
                continue
            if data.get("user_id") != user_id:
                continue
            entries.append(JournalEntryOut(**data))
        entries.sort(key=lambda e: e.timestamp, reverse=True)
        return entries[:limit]

    def delete_entry(self, user_id: str, entry_id: str) -> bool:
        """Delete an entry if it belongs to the user."""
        doc = db.client.collection(self.collection).document(entry_id).get()
        data = _normalize(doc)
        if not data or data.get("user_id") != user_id:
            return False
        db.client.collection(self.collection).document(entry_id).delete()
        return True

    # ========================================
    # Stats & memory
    # ========================================

    def get_stats(self, user_id: str) -> JournalStats:
        """Compute longitudinal stats for the agent's memory block."""
        entries = self.list_entries(user_id, limit=1000)
        entries.sort(key=lambda e: e.timestamp)  # oldest first

        if not entries:
            return JournalStats()

        now = time.time()
        week_cutoff = now - _WEEK_SECONDS
        last_week_cutoff = now - 2 * _WEEK_SECONDS

        this_week = [e for e in entries if e.timestamp >= week_cutoff]
        last_week = [
            e
            for e in entries
            if last_week_cutoff <= e.timestamp < week_cutoff
        ]

        def _avg_mood(es: List[JournalEntryOut]) -> float:
            scores = [
                e.privacy_info.get("mood_score", 0.0)
                for e in es
                if e.privacy_info and e.privacy_info.get("mood_score") is not None
            ]
            return sum(scores) / len(scores) if scores else 0.0

        def _dominant(es: List[JournalEntryOut]) -> str:
            counts: Dict[str, int] = {}
            for e in es:
                counts[e.dominant_emotion] = counts.get(e.dominant_emotion, 0) + 1
            return max(counts, key=counts.get) if counts else "reflection"

        this_mood = _avg_mood(this_week)
        last_mood = _avg_mood(last_week)
        if last_week and not this_week:
            trend = "stable"
        elif not last_week:
            trend = "unknown"
        elif this_mood - last_mood >= 0.15:
            trend = "improving"
        elif last_mood - this_mood >= 0.15:
            trend = "declining"
        else:
            trend = "stable"

        dates = {e.date for e in entries}

        summaries = []
        for e in reversed(entries[-8:]):
            excerpt = e.text[:140] + ("…" if len(e.text) > 140 else "")
            summaries.append(
                {
                    "date": e.date,
                    "emotion": e.dominant_emotion,
                    "ritual": e.ritual_name,
                    "words": e.word_count,
                    "excerpt": excerpt,
                }
            )

        return JournalStats(
            total_entries=len(entries),
            total_words=sum(e.word_count for e in entries),
            total_writing_minutes=round(
                sum(e.writing_time_seconds for e in entries) / 60
            ),
            current_streak=self._current_streak(dates),
            longest_streak=self._longest_streak(dates),
            days_written=len(dates),
            unique_rituals=len({e.ritual_id for e in entries if e.ritual_id}),
            this_week_entries=len(this_week),
            last_week_entries=len(last_week),
            this_week_words=sum(e.word_count for e in this_week),
            last_week_words=sum(e.word_count for e in last_week),
            this_week_emotion=_dominant(this_week),
            last_week_emotion=_dominant(last_week),
            this_week_mood_score=round(this_mood, 2),
            last_week_mood_score=round(last_mood, 2),
            mood_trend=trend,
            first_entry_date=entries[0].date,
            last_entry_date=entries[-1].date,
            recent_summaries=summaries,
        )

    def build_memory_block(self, user_id: str) -> str:
        """Human-readable long-term memory block injected into the agent prompt."""
        s = self.get_stats(user_id)
        if s.total_entries == 0:
            return (
                "This user has no past journal entries yet — this is their "
                "first writing session. Welcome them warmly."
            )

        lines = [
            "## LONG-TERM MEMORY (from the user's journal history)",
            f"- Written entries: {s.total_entries} since {s.first_entry_date} "
            f"(last: {s.last_entry_date})",
            f"- Writing streak: {s.current_streak} day(s) current, "
            f"{s.longest_streak} longest; {s.days_written} day(s) total",
            f"- Total words: {s.total_words} across {s.total_writing_minutes} min",
            f"- This week: {s.this_week_entries} entry/entries ({s.this_week_words} words, "
            f"dominant emotion: {s.this_week_emotion})",
            f"- Last week: {s.last_week_entries} entry/entries ({s.last_week_words} words, "
            f"dominant emotion: {s.last_week_emotion})",
            f"- Emotional trend: {s.mood_trend}" if s.mood_trend != "unknown" else "",
            "",
            "Recent entries (date • emotion • excerpt):",
        ]
        for r in s.recent_summaries:
            lines.append(
                f"- {r['date']} • {r['emotion']} ({r['ritual'] or 'no ritual'}, "
                f"{r['words']} words): {r['excerpt']}"
            )
        lines.append("")
        lines.append(
            "Use this memory: reference their real history when relevant "
            "(e.g. 'This is your 4th entry this week', 'You wrote about anxiety "
            "on Monday — is that still with you?', 'Your mood trend is improving'). "
            "Never invent facts beyond these; keep it brief and natural."
        )
        return "\n".join(lines)

    # ========================================
    # Helpers
    # ========================================

    @staticmethod
    def _gen_id() -> str:
        suffix = "".join(random.choices(string.ascii_lowercase + string.digits, k=8))
        return f"e_{int(time.time())}_{suffix}"

    @staticmethod
    def _current_streak(dates: set) -> int:
        if not dates:
            return 0
        day = datetime.now(timezone.utc).date()
        if _dstr(day) not in dates:
            day -= timedelta(days=1)
        streak = 0
        while _dstr(day) in dates:
            streak += 1
            day -= timedelta(days=1)
        return streak

    @staticmethod
    def _longest_streak(dates: set) -> int:
        if not dates:
            return 0
        ordered = sorted(dates)
        longest = current = 1
        for prev, curr in zip(ordered, ordered[1:]):
            if _diff_days(prev, curr) == 1:
                current += 1
                longest = max(longest, current)
            else:
                current = 1
        return longest


def _dstr(day) -> str:
    return day.isoformat()


def _diff_days(a: str, b: str) -> int:
    da = datetime.strptime(a, "%Y-%m-%d").date()
    db_ = datetime.strptime(b, "%Y-%m-%d").date()
    return (db_ - da).days


journal_service = JournalService()