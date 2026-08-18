"""
Registration Service
====================

Handles user registration for activities.
Tracks spots remaining, sends confirmations, manages waitlists.
"""

from datetime import datetime, timezone
from typing import Optional
from backend.database.firestore_client import db
from backend.config import config
from backend.models.activity import Activity, UserActivity, UserActivityStatus
from backend.services.activity_catalog import activity_catalog


class RegistrationService:
    """Service for managing activity registrations."""

    def __init__(self):
        self.registrations_collection = config.FIRESTORE_COLLECTION_REGISTRATIONS
        self.catalog_collection = config.FIRESTORE_COLLECTION_CATALOG

    def register_user(
        self,
        user_id: str,
        activity_id: str,
        user_email: str = "",
        user_name: str = "",
    ) -> dict:
        """
        Register a user for an activity.
        Decrements spots remaining and creates registration record.
        """
        # Get activity
        activity = activity_catalog.get_activity(activity_id)
        if not activity:
            return {"success": False, "error": "Activity not found"}

        # Check availability
        if activity.spots_remaining <= 0:
            return {"success": False, "error": "Activity is full"}

        if activity.status != "upcoming":
            return {"success": False, "error": "Activity is not open for registration"}

        # Check if already registered
        existing = self._check_existing_registration(user_id, activity_id)
        if existing:
            return {"success": False, "error": "Already registered for this activity"}

        # Create registration
        registration = UserActivity(
            user_id=user_id,
            activity_id=activity_id,
            status=UserActivityStatus.REGISTERED,
            registered_at=datetime.now(timezone.utc),
            registration_confirmation=f"REG-{activity_id[:8]}-{user_id[:8]}",
        )

        # Save registration
        doc_ref = db.client.collection(self.registrations_collection).document()
        doc_ref.set(registration.model_dump())

        # Decrement spots
        db.client.collection(self.catalog_collection).document(activity_id).update({
            "spots_remaining": activity.spots_remaining - 1,
        })

        return {
            "success": True,
            "registration_id": doc_ref.id,
            "confirmation_code": registration.registration_confirmation,
            "message": f"You're registered for '{activity.title}'!",
            "next_steps": [
                "Check your email for confirmation",
                "Add it to your calendar",
                "Consider inviting a friend for support",
            ],
        }

    def cancel_registration(
        self, user_id: str, activity_id: str
    ) -> dict:
        """Cancel a user's registration and free up the spot."""
        existing = self._check_existing_registration(user_id, activity_id)
        if not existing:
            return {"success": False, "error": "No registration found"}

        # Delete registration
        db.client.collection(self.registrations_collection).document(
            existing["id"]
        ).delete()

        # Increment spots
        activity = activity_catalog.get_activity(activity_id)
        if activity:
            db.client.collection(self.catalog_collection).document(activity_id).update({
                "spots_remaining": activity.spots_remaining + 1,
            })

        return {
            "success": True,
            "message": "Registration cancelled. Spot freed up for others.",
        }

    def get_registration_details(
        self, user_id: str, activity_id: str
    ) -> Optional[dict]:
        """Get details of a user's registration."""
        return self._check_existing_registration(user_id, activity_id)

    def _check_existing_registration(
        self, user_id: str, activity_id: str
    ) -> Optional[dict]:
        """Check if user is already registered for an activity."""
        query = (
            db.client.collection(self.registrations_collection)
            .where("user_id", "==", user_id)
            .where("activity_id", "==", activity_id)
            .limit(1)
        )

        for doc in query.stream():
            data = doc.to_dict()
            data["id"] = doc.id
            return data

        return None


# Singleton instance
registration_service = RegistrationService()