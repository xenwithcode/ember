"""
Geolocation Service
===================

Handles all location-related functionality:
- Get user's current location (from IP or GPS)
- Geocode addresses to coordinates
- Calculate distances
- Generate Google Maps links
- Find nearby activities
"""

import os
import httpx
from typing import Optional, Tuple
from backend.config import config


class GeolocationService:
    """Service for all geolocation needs."""

    def __init__(self):
        self.maps_api_key = os.getenv("GOOGLE_MAPS_API_KEY", "")
        self.default_lat = float(os.getenv("DEFAULT_LATITUDE", "40.7128"))
        self.default_lng = float(os.getenv("DEFAULT_LONGITUDE", "-74.0060"))
        self.default_city = os.getenv("DEFAULT_CITY", "New York")

    # ========================================
    # USER LOCATION
    # ========================================

    def get_user_location_from_ip(self, ip_address: str) -> dict:
        """
        Get approximate user location from their IP address.
        Uses ip-api.com (free tier) for the hackathon.
        In production, use Google Maps Geolocation API.
        """
        try:
            response = httpx.get(f"http://ip-api.com/json/{ip_address}")
            data = response.json()

            if data.get("status") == "success":
                return {
                    "latitude": data["lat"],
                    "longitude": data["lon"],
                    "city": data["city"],
                    "region": data["regionName"],
                    "country": data["country"],
                    "zip_code": data["zip"],
                }
        except Exception:
            pass

        # Fallback to default location
        return self.get_default_location()

    def get_default_location(self) -> dict:
        """Return default location (for demo/testing)."""
        return {
            "latitude": self.default_lat,
            "longitude": self.default_lng,
            "city": self.default_city,
            "region": "",
            "country": "USA",
            "zip_code": "",
        }

    def get_location_from_coordinates(
        self, latitude: float, longitude: float
    ) -> dict:
        """
        Reverse geocode coordinates to an address.
        Uses Google Maps Geocoding API.
        """
        if not self.maps_api_key:
            return {"address": "Location not available", "city": self.default_city}

        try:
            url = (
                f"https://maps.googleapis.com/maps/api/geocode/json"
                f"?latlng={latitude},{longitude}&key={self.maps_api_key}"
            )
            response = httpx.get(url)
            data = response.json()

            if data["status"] == "OK" and data["results"]:
                result = data["results"][0]
                return {
                    "address": result["formatted_address"],
                    "latitude": latitude,
                    "longitude": longitude,
                    "city": self._extract_city(result),
                }
        except Exception:
            pass

        return {"address": "Unknown location", "city": self.default_city}

    # ========================================
    # GEOCODING
    # ========================================

    def geocode_address(self, address: str) -> Optional[Tuple[float, float]]:
        """
        Convert an address to GPS coordinates.
        Uses Google Maps Geocoding API.
        """
        if not self.maps_api_key:
            return None

        try:
            url = (
                f"https://maps.googleapis.com/maps/api/geocode/json"
                f"?address={address}&key={self.maps_api_key}"
            )
            response = httpx.get(url)
            data = response.json()

            if data["status"] == "OK" and data["results"]:
                location = data["results"][0]["geometry"]["location"]
                return (location["lat"], location["lng"])
        except Exception:
            pass

        return None

    # ========================================
    # MAPS LINKS
    # ========================================

    def generate_maps_link(
        self, latitude: float, longitude: float, label: str = ""
    ) -> str:
        """Generate a Google Maps link for an activity location."""
        if label:
            return f"https://www.google.com/maps/search/?api=1&query={label}+{latitude},{longitude}"
        return f"https://www.google.com/maps/search/?api=1&query={latitude},{longitude}"

    def generate_directions_link(
        self,
        origin_lat: float,
        origin_lng: float,
        dest_lat: float,
        dest_lng: float,
    ) -> str:
        """Generate a Google Maps directions link."""
        return (
            f"https://www.google.com/maps/dir/?api=1"
            f"&origin={origin_lat},{origin_lng}"
            f"&destination={dest_lat},{dest_lng}"
        )

    # ========================================
    # DISTANCE CALCULATION
    # ========================================

    def calculate_distance(
        self,
        lat1: float, lon1: float,
        lat2: float, lon2: float,
    ) -> float:
        """Calculate distance between two points in km."""
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

    def format_distance(self, distance_km: float) -> str:
        """Format distance for display."""
        if distance_km < 1:
            return f"{int(distance_km * 1000)}m away"
        elif distance_km < 10:
            return f"{distance_km:.1f}km away"
        else:
            return f"{int(distance_km)}km away"

    # ========================================
    # HELPER METHODS
    # ========================================

    @staticmethod
    def _extract_city(geocode_result: dict) -> str:
        """Extract city name from geocoding result."""
        for component in geocode_result.get("address_components", []):
            if "locality" in component.get("types", []):
                return component["long_name"]
        return ""


# Singleton instance
geolocation_service = GeolocationService()