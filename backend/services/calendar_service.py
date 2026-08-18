"""
Calendar Service
================

Manages the user's personal calendar of activities.
Integrates with Google Calendar API for real calendar events.

Features:
- Create calendar events for activities
- Get user's upcoming activities
- Set reminders
- Cancel/reschedule activities
"""

from datetime import datetime, timedelta, timezone
from typing import Optional
from backend.database.firestore_client import db
from backend.config import config
from backend.models.activity import UserActivity, UserActivityStatus


class CalendarService:
    """Service for managing user's activity calendar."""

    def __init__(self):
        self.collection = config.FIRESTORE_COLLECTION_REGISTRATIONS

    # ========================================
    # USER CALENDAR OPERATIONS
    # ========================================

    def add_activity_to_calendar(
        self,
        user_id: str,
        activity_id: str,
        reminder_minutes: int = 60,
    ) -> dict:
        """
        Add an activity to the user's calendar.
        Creates a UserActivity record and optionally a Google Calendar event.
        """
        # Create user-activity relationship
        user_activity = UserActivity(
            user_id=user_id,
            activity_id=activity_id,
            status=UserActivityStatus.SCHEDULED,
            discovered_at=datetime.now(timezone.utc),
            reminder_set=True,
        )

        # Save to Firestore
        doc_ref = db.client.collection(self.collection).document()
        doc_ref.set(user_activity.model_dump())

        # In production: Also create Google Calendar event
        # calendar_event_id = self._create_google_calendar_event(...)

        return {
            "success": True,
            "user_activity_id": doc_ref.id,
            "message": "Activity added to your calendar!",
            "reminder": f"Reminder set for {reminder_minutes} minutes before",
        }

    def get_user_calendar(
        self,
        user_id: str,
        start_date: Optional[datetime] = None,
        end_date: Optional[datetime] = None,
        status: Optional[UserActivityStatus] = None,
    ) -> list[UserActivity]:
        """
        Get the user's calendar of activities.
        This powers the calendar view in the frontend.
        """
        query = db.client.collection(self.collection)
        query = query.where("user_id", "==", user_id)

        if status:
            query = query.where("status", "==", status.value)

        query = query.order_by("discovered_at", direction="DESCENDING")

        activities = []
        for doc in query.stream():
            user_activity = UserActivity(**doc.to_dict())

            # Load the full activity details
            from backend.services.activity_catalog import activity_catalog
            activity = activity_catalog.get_activity(user_activity.activity_id)
            if activity:
                user_activity.activity = activity
                activities.append(user_activity)

        return activities

    def get_upcoming_activities_for_user(
        self, user_id: str, limit: int = 10
    ) -> list[UserActivity]:
        """Get user's upcoming scheduled activities."""
        return self.get_user_calendar(
            user_id=user_id,
            status=UserActivityStatus.SCHEDULED,
        )[:limit]

    def update_activity_status(
        self,
        user_activity_id: str,
        new_status: UserActivityStatus,
        notes: str = "",
    ) -> bool:
        """Update the status of a user's activity."""
        db.client.collection(self.collection).document(user_activity_id).update({
            "status": new_status.value,
            "updated_at": datetime.now(timezone.utc).isoformat(),
        })
        return True

    def remove_from_calendar(self, user_activity_id: str) -> bool:
        """Remove an activity from user's calendar."""
        db.client.collection(self.collection).document(user_activity_id).delete()
        return True

    # ========================================
    # GOOGLE CALENDAR INTEGRATION
    # ========================================

    def _create_google_calendar_event(
        self,
        title: str,
        description: str,
        start_time: datetime,
        end_time: datetime,
        location: str,
        reminders: list[int] = [60, 15],
    ) -> str:
        """
        Create a real Google Calendar event.
        Requires OAuth2 authentication with Google Calendar API.

        In production, implement this with:
        from googleapiclient.discovery import build
        service = build('calendar', 'v3', credentials=creds)
        """

        event = {
            "summary": f"🌱 {title}",
            "description": description,
            "start": {
                "dateTime": start_time.isoformat(),
                "timeZone": "America/New_York",
            },
            "end": {
                "dateTime": end_time.isoformat(),
                "timeZone": "America/New_York",
            },
            "location": location,
            "reminders": {
                "useDefault": False,
                "overrides": [
                    {"method": "popup", "minutes": m} for m in reminders
                ],
            },
        }

        # In production:
        # event = service.events().insert(calendarId='primary', body=event).execute()
        # return event.get('id')

        # For hackathon demo:
        return f"event_{datetime.now().strftime('%Y%m%d%H%M%S')}"


# Singleton instance
calendar_service = CalendarService()