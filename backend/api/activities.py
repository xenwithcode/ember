"""
Activities API Endpoints
========================

REST endpoints for discovering, viewing, and registering for activities.
These power the frontend's activity discovery and calendar views.
"""

from fastapi import APIRouter, HTTPException, Query
from typing import Optional
from datetime import datetime

from backend.models.activity import Activity, ActivityCategory, AnxietyLevel
from backend.services.activity_catalog import activity_catalog
from backend.services.geolocation import geolocation_service
from backend.services.registration_service import registration_service
from backend.services.calendar_service import calendar_service

router = APIRouter(prefix="/api/activities", tags=["Activities"])


# ========================================
# DISCOVERY ENDPOINTS
# ========================================

@router.get("/", summary="Get upcoming activities")
async def get_activities(
    category: Optional[str] = Query(None, description="Filter by category"),
    anxiety_level: Optional[str] = Query(None, description="Filter by anxiety level"),
    city: Optional[str] = Query(None, description="Filter by city"),
    max_price: Optional[float] = Query(None, description="Maximum price"),
    limit: int = Query(20, ge=1, le=50, description="Number of results"),
):
    """
    Get a list of upcoming activities with optional filters.
    This is the main discovery endpoint for the frontend activity feed.
    """
    try:
        cat = ActivityCategory(category) if category else None
        anxiety = AnxietyLevel(anxiety_level) if anxiety_level else None

        activities = activity_catalog.get_upcoming_activities(
            limit=limit,
            category=cat,
            anxiety_level=anxiety,
            city=city,
            max_price=max_price,
        )

        return {
            "activities": [a.model_dump() for a in activities],
            "count": len(activities),
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/nearby", summary="Find activities near a location")
async def get_nearby_activities(
    latitude: float = Query(..., description="User's latitude"),
    longitude: float = Query(..., description="User's longitude"),
    radius_km: float = Query(10.0, description="Search radius in km"),
    category: Optional[str] = Query(None),
    anxiety_level: Optional[str] = Query(None),
    limit: int = Query(10, ge=1, le=20),
):
    """
    Find activities near the user's current location.
    Uses GPS coordinates for geolocation-based discovery.
    """
    try:
        cat = ActivityCategory(category) if category else None
        anxiety = AnxietyLevel(anxiety_level) if anxiety_level else None

        activities = activity_catalog.find_activities_near_location(
            latitude=latitude,
            longitude=longitude,
            radius_km=radius_km,
            category=cat,
            anxiety_level=anxiety,
            limit=limit,
        )

        # Add distance information to each activity
        results = []
        for activity in activities:
            activity_dict = activity.model_dump()
            distance = geolocation_service.calculate_distance(
                latitude, longitude,
                activity.latitude, activity.longitude
            )
            activity_dict["distance_km"] = round(distance, 1)
            activity_dict["distance_display"] = geolocation_service.format_distance(distance)
            activity_dict["directions_url"] = geolocation_service.generate_directions_link(
                latitude, longitude,
                activity.latitude, activity.longitude
            )
            results.append(activity_dict)

        return {
            "activities": results,
            "count": len(results),
            "search_center": {"latitude": latitude, "longitude": longitude},
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/recommended/{user_id}", summary="Get personalized recommendations")
async def get_recommended_activities(
    user_id: str,
    limit: int = Query(5, ge=1, le=10),
):
    """
    Get activities recommended for a specific user based on their
    Identity Graph (interests, anxiety level, past activities).
    """
    try:
        activities = activity_catalog.get_recommended_activities(
            user_id=user_id,
            limit=limit,
        )
        return {
            "activities": [a.model_dump() for a in activities],
            "count": len(activities),
            "based_on": "Your interests and comfort level",
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/search", summary="Search activities")
async def search_activities(
    q: str = Query(..., min_length=2, description="Search query"),
    limit: int = Query(10, ge=1, le=20),
):
    """Search activities by text (title, description, tags, location)."""
    try:
        activities = activity_catalog.search_activities(query_text=q, limit=limit)
        return {
            "activities": [a.model_dump() for a in activities],
            "count": len(activities),
            "query": q,
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# ========================================
# SINGLE ACTIVITY ENDPOINTS
# ========================================

@router.get("/{activity_id}", summary="Get activity details")
async def get_activity_details(activity_id: str):
    """Get full details of a single activity."""
    activity = activity_catalog.get_activity(activity_id)
    if not activity:
        raise HTTPException(status_code=404, detail="Activity not found")

    # Add maps link
    activity_dict = activity.model_dump()
    activity_dict["maps_link"] = geolocation_service.generate_maps_link(
        activity.latitude, activity.longitude, activity.location_name
    )

    return activity_dict


# ========================================
# REGISTRATION ENDPOINTS
# ========================================

@router.post("/{activity_id}/register", summary="Register for an activity")
async def register_for_activity(
    activity_id: str,
    user_id: str = Query(..., description="User ID"),
    user_email: str = Query("", description="User email"),
    user_name: str = Query("", description="User name"),
):
    """Register the user for a specific activity."""
    result = registration_service.register_user(
        user_id=user_id,
        activity_id=activity_id,
        user_email=user_email,
        user_name=user_name,
    )

    if not result["success"]:
        raise HTTPException(status_code=400, detail=result["error"])

    return result


@router.delete("/{activity_id}/register", summary="Cancel registration")
async def cancel_registration(
    activity_id: str,
    user_id: str = Query(..., description="User ID"),
):
    """Cancel the user's registration for an activity."""
    result = registration_service.cancel_registration(
        user_id=user_id,
        activity_id=activity_id,
    )

    if not result["success"]:
        raise HTTPException(status_code=400, detail=result["error"])

    return result