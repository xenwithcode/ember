"""
Activity Catalog Service
========================

Manages the catalog of real-world activities available to users.
This is the "world" that the agent draws from when making suggestions.

Features:
- Store and retrieve activities from Firestore
- Filter by category, anxiety level, location, date
- Search with geolocation (find activities near user)
- Track capacity and availability
"""

from datetime import datetime, timedelta, timezone
from typing import Optional
from backend.database.firestore_client import db
from backend.config import config
from backend.models.activity import (
    Activity, ActivityCategory, AnxietyLevel, ActivityStatus
)


class ActivityCatalogService:
    """Service for managing the activity catalog."""

    def __init__(self):
        self.collection = config.FIRESTORE_COLLECTION_CATALOG

    # ========================================
    # CRUD OPERATIONS
    # ========================================

    def create_activity(self, activity: Activity) -> str:
        """Add a new activity to the catalog."""
        activity.created_at = datetime.now(timezone.utc)
        activity.updated_at = datetime.now(timezone.utc)
        activity.status = ActivityStatus.UPCOMING

        doc_ref = db.client.collection(self.collection).document()
        doc_ref.set(activity.model_dump())
        return doc_ref.id

    def get_activity(self, activity_id: str) -> Optional[Activity]:
        """Get a single activity by ID."""
        doc = db.client.collection(self.collection).document(activity_id).get()
        if doc.exists:
            return Activity(**doc.to_dict())
        return None

    def update_activity(self, activity_id: str, updates: dict) -> bool:
        """Update an activity in the catalog."""
        updates["updated_at"] = datetime.now(timezone.utc).isoformat()
        db.client.collection(self.collection).document(activity_id).update(updates)
        return True

    def delete_activity(self, activity_id: str) -> bool:
        """Remove an activity from the catalog."""
        db.client.collection(self.collection).document(activity_id).delete()
        return True

    # ========================================
    # DISCOVERY & FILTERING
    # ========================================

    def get_upcoming_activities(
        self,
        limit: int = 20,
        category: Optional[ActivityCategory] = None,
        anxiety_level: Optional[AnxietyLevel] = None,
        city: Optional[str] = None,
        max_price: Optional[float] = None,
        beginner_friendly: bool = True,
    ) -> list[Activity]:
        """
        Get upcoming activities with optional filters.
        This is the main discovery endpoint for the frontend.
        """
        query = db.client.collection(self.collection)

        # Filter by status
        query = query.where("status", "==", ActivityStatus.UPCOMING.value)

        # Filter by category
        if category:
            query = query.where("category", "==", category.value)

        # Filter by anxiety level
        if anxiety_level:
            query = query.where("anxiety_level", "==", anxiety_level.value)

        # Filter by city
        if city:
            query = query.where("city", "==", city)

        # Filter by price
        if max_price is not None:
            query = query.where("price", "<=", max_price)

        # Filter beginner friendly
        if beginner_friendly:
            query = query.where("beginner_friendly", "==", True)

        # Order by start date
        query = query.order_by("start_date")

        # Limit results
        query = query.limit(limit)

        activities = []
        for doc in query.stream():
            activities.append(Activity(**doc.to_dict()))

        return activities

    def find_activities_near_location(
        self,
        latitude: float,
        longitude: float,
        radius_km: float = 10.0,
        category: Optional[ActivityCategory] = None,
        anxiety_level: Optional[AnxietyLevel] = None,
        limit: int = 10,
    ) -> list[Activity]:
        """
        Find activities near a specific GPS location.
        Uses simple bounding box calculation for Firestore compatibility.

        For production, consider using Google Places API or
        Firestore geospatial queries.
        """
        # Calculate bounding box (approximate)
        # 1 degree latitude ≈ 111 km
        # 1 degree longitude ≈ 111 km * cos(latitude)
        lat_delta = radius_km / 111.0
        lng_delta = radius_km / (111.0 * abs(latitude) * 3.14159 / 180) if latitude != 0 else radius_km / 111.0

        min_lat = latitude - lat_delta
        max_lat = latitude + lat_delta
        min_lng = longitude - lng_delta
        max_lng = longitude + lng_delta

        query = db.client.collection(self.collection)
        query = query.where("status", "==", ActivityStatus.UPCOMING.value)
        query = query.where("latitude", ">=", min_lat)
        query = query.where("latitude", "<=", max_lat)
        query = query.order_by("start_date")
        query = query.limit(limit * 3)  # Get more, filter by distance later

        activities = []
        for doc in query.stream():
            activity = Activity(**doc.to_dict())

            # Check longitude bounds
            if min_lng <= activity.longitude <= max_lng:
                # Check category filter
                if category and activity.category != category:
                    continue
                # Check anxiety level filter
                if anxiety_level and activity.anxiety_level != anxiety_level:
                    continue
                activities.append(activity)

        # Sort by distance
        activities.sort(
            key=lambda a: self._haversine_distance(
                latitude, longitude, a.latitude, a.longitude
            )
        )

        return activities[:limit]

    def search_activities(
        self,
        query_text: str,
        user_id: str = "",
        limit: int = 10,
    ) -> list[Activity]:
        """
        Full-text search across activity titles, descriptions, and tags.
        For the hackathon, uses simple string matching.
        In production, use Algolia or Elasticsearch.
        """
        all_activities = self.get_upcoming_activities(limit=100)
        query_lower = query_text.lower()

        results = []
        for activity in all_activities:
            searchable = (
                f"{activity.title} {activity.description} "
                f"{' '.join(activity.tags)} {activity.category.value} "
                f"{activity.location_name} {activity.city}"
            ).lower()

            if query_lower in searchable:
                results.append(activity)

        return results[:limit]

    # ========================================
    # RECOMMENDATION ENGINE
    # ========================================

    def get_recommended_activities(
        self,
        user_id: str,
        limit: int = 5,
    ) -> list[Activity]:
        """
        Get activities recommended for a specific user based on their
        Identity Graph (interests, anxiety level, past activities).

        This is what the agent uses when suggesting activities.
        """
        # Get user profile
        profile = db.get_user_profile(user_id)

        if not profile:
            # New user: return beginner-friendly, low-anxiety activities
            return self.get_upcoming_activities(
                limit=limit,
                anxiety_level=AnxietyLevel.LOW,
                beginner_friendly=True,
            )

        # Extract user preferences
        user_interests = profile.get("interests", [])
        user_anxiety = profile.get("anxiety_level", "moderate")
        preferred_type = profile.get("preferred_activity_type", "creative")

        # Map interests to categories
        interest_to_category = {
            "creative": ActivityCategory.CREATIVE,
            "physical": ActivityCategory.PHYSICAL,
            "social": ActivityCategory.SOCIAL,
            "intellectual": ActivityCategory.INTELLECTUAL,
            "nature": ActivityCategory.NATURE,
            "music": ActivityCategory.MUSIC,
        }

        # Determine anxiety level filter
        anxiety_map = {
            "low": AnxietyLevel.LOW,
            "moderate": AnxietyLevel.MODERATE,
            "high": AnxietyLevel.HIGH,
        }
        anxiety_filter = anxiety_map.get(user_anxiety, AnxietyLevel.MODERATE)

        # Get activities matching user's interests
        recommended = []
        for interest in user_interests:
            category = interest_to_category.get(interest)
            if category:
                matches = self.get_upcoming_activities(
                    limit=3,
                    category=category,
                    anxiety_level=anxiety_filter,
                    beginner_friendly=True,
                )
                recommended.extend(matches)

        # Remove duplicates and limit
        seen_ids = set()
        unique_recommended = []
        for activity in recommended:
            if activity.id not in seen_ids:
                seen_ids.add(activity.id)
                unique_recommended.append(activity)

        return unique_recommended[:limit]

    # ========================================
    # UTILITY METHODS
    # ========================================

    @staticmethod
    def _haversine_distance(
        lat1: float, lon1: float, lat2: float, lon2: float
    ) -> float:
        """Calculate distance between two GPS points in km."""
        import math

        R = 6371  # Earth's radius in km
        dlat = math.radians(lat2 - lat1)
        dlon = math.radians(lon2 - lon1)

        a = (
            math.sin(dlat / 2) ** 2
            + math.cos(math.radians(lat1))
            * math.cos(math.radians(lat2))
            * math.sin(dlon / 2) ** 2
        )
        c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))

        return R * c


# Singleton instance
activity_catalog = ActivityCatalogService()