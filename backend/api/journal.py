"""
Journal API Endpoints - persistence and longitudinal stats for the Living Journal.

Serves as Ember's Memory Bank: entries saved here are used by Past Embers,
the dashboard, and the agent's long-term memory block.
"""

from fastapi import APIRouter, HTTPException, Query
from pydantic import BaseModel

from backend.models.journal_entry import (
    JournalEntryCreate,
    JournalEntryOut,
    JournalStats,
)
from backend.services.journal_service import journal_service

router = APIRouter(prefix="/api/journal", tags=["Journal"])


class MemoryBlockOut(BaseModel):
    user_id: str
    memory_block: str
    stats: JournalStats


@router.post("/entries", response_model=JournalEntryOut)
async def create_entry(entry: JournalEntryCreate):
    """Save a journal entry (anonymized text + analysis + coach reply)."""
    if not entry.text.strip():
        raise HTTPException(status_code=400, detail="Text cannot be empty")
    try:
        return journal_service.save_entry(entry)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/entries", response_model=list[JournalEntryOut])
async def list_entries(
    user_id: str = Query(..., min_length=1, max_length=128),
    limit: int = Query(200, ge=1, le=1000),
):
    """List a user's journal entries, newest first."""
    try:
        return journal_service.list_entries(user_id, limit=limit)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.delete("/entries/{entry_id}")
async def delete_entry(entry_id: str, user_id: str = Query(...)):
    """Delete a journal entry (only if it belongs to the user)."""
    try:
        deleted = journal_service.delete_entry(user_id, entry_id)
        if not deleted:
            raise HTTPException(status_code=404, detail="Entry not found")
        return {"deleted": True, "id": entry_id}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/stats", response_model=JournalStats)
async def get_stats(user_id: str = Query(..., min_length=1, max_length=128)):
    """Longitudinal stats: streaks, words, weekly comparison, mood trend."""
    try:
        return journal_service.get_stats(user_id)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/memory", response_model=MemoryBlockOut)
async def get_memory_block(
    user_id: str = Query(..., min_length=1, max_length=128)
):
    """The long-term memory block injected into the coach's context."""
    try:
        return {
            "user_id": user_id,
            "memory_block": journal_service.build_memory_block(user_id),
            "stats": journal_service.get_stats(user_id),
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))