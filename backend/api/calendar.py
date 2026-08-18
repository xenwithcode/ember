"""
Calendar API Endpoints
======================

REST endpoints for managing the user's activity calendar.
Powers the calendar view in the frontend.
"""

from fastapi import APIRouter, HTTPException, Query
from typing import Optional
from datetime import datetime

from backend.models.activity import UserActivityStatus
from backend.services.calendar_service import calendar_service
from backend.services.activity_catalog import activity_catalog

router = APIRouter(prefix="/api/calendar", tags=["Calendar"])


@router.get("/{user_id}", summary="Get user's calendar")
async def get_user_calendar(
    user_id: str,
    status: Optional[str] = Query(None, description="Filter by status"),
    limit: int = Query(20, ge=1, le=50),
):
    """
    Get the user's calendar of activities.
    Returns all activities the user has discovered, registered for,
    scheduled, or completed.
    """
    try:
        user_status = UserActivityStatus(status) if status else None

        activities = calendar_service.get_user_calendar(
            user_id=user_id,
            status=user_status,
        )

        return {
            "calendar": [a.model_dump() for a in activities[:limit]],
            "count": len(activities),
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/{user_id}/upcoming", summary="Get upcoming activities")
async def get_upcoming_activities(
    user_id: str,
    limit: int = Query(10, ge=1, le=20),
):
    """Get user's upcoming scheduled activities."""
    try:
        activities = calendar_service.get_upcoming_activities_for_user(
            user_id=user_id,
            limit=limit,
        )
        return {
            "upcoming": [a.model_dump() for a in activities],
            "count": len(activities),
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/{user_id}/add", summary="Add activity to calendar")
async def add_to_calendar(
    user_id: str,
    activity_id: str = Query(..., description="Activity to add"),
    reminder_minutes: int = Query(60, description="Reminder time before event"),
):
    """Add an activity to the user's calendar."""
    result = calendar_service.add_activity_to_calendar(
        user_id=user_id,
        activity_id=activity_id,
        reminder_minutes=reminder_minutes,
    )

    if not result["success"]:
        raise HTTPException(status_code=400, detail=result.get("error", "Failed"))

    return result


@router.delete("/{user_id}/remove/{activity_id}", summary="Remove from calendar")
async def remove_from_calendar(
    user_id: str,
    activity_id: str,
):
    """Remove an activity from user's calendar."""
    # Find the user-activity record
    calendar_items = calendar_service.get_user_calendar(user_id=user_id)
    for item in calendar_items:
        if item.activity_id == activity_id:
            calendar_service.remove_from_calendar(item.id)
            return {"success": True, "message": "Removed from calendar"}

    raise HTTPException(status_code=404, detail="Activity not in calendar")


@router.get("/{user_id}/stats", summary="Get activity statistics")
async def get_activity_stats(user_id: str):
    """
    Get user's activity statistics.
    Powers the progress/achievement view.
    """
    try:
        all_activities = calendar_service.get_user_calendar(user_id=user_id)

        stats = {
            "total_discovered": len(all_activities),
            "total_registered": sum(
                1 for a in all_activities
                if a.status == UserActivityStatus.REGISTERED
            ),
            "total_attended": sum(
                1 for a in all_activities
                if a.status == UserActivityStatus.ATTENDED
            ),
            "categories_explored": list(set(
                a.activity.category.value for a in all_activities
                if a.activity
            )),
            "streak_days": 0,  # Calculate from activity dates
        }

        return stats
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))