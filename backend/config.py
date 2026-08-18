"""
Application configuration - loaded from environment variables.
"""

import os
from dotenv import load_dotenv

# Load backend/.env (local development; Cloud Run injects its own env vars)
load_dotenv(os.path.join(os.path.dirname(__file__), ".env"))


class Config:
    """Centralized configuration for the Ember backend."""

    # Google Cloud
    GOOGLE_CLOUD_PROJECT: str = os.getenv("GOOGLE_CLOUD_PROJECT", "")
    GOOGLE_CLOUD_REGION: str = os.getenv("GOOGLE_CLOUD_REGION", "us-central1")
    GOOGLE_APPLICATION_CREDENTIALS: str = os.getenv(
        "GOOGLE_APPLICATION_CREDENTIALS", ""
    )

    # Gemini model
    GEMINI_MODEL: str = os.getenv("GEMINI_MODEL", "gemini-3.5-flash-lite")

    # Gemma model (privacy layer, Vertex global endpoint)
    GEMMA_MODEL: str = os.getenv("GEMMA_MODEL", "gemma-4-26b-a4b-it-maas")

    # Firestore collections
    FIRESTORE_COLLECTION_USERS: str = os.getenv(
        "FIRESTORE_COLLECTION_USERS", "users"
    )
    FIRESTORE_COLLECTION_JOURNAL: str = os.getenv(
        "FIRESTORE_COLLECTION_JOURNAL", "journal_entries"
    )
    FIRESTORE_COLLECTION_ACTIVITIES: str = os.getenv(
        "FIRESTORE_COLLECTION_ACTIVITIES", "activities"
    )
    FIRESTORE_COLLECTION_CATALOG: str = os.getenv(
        "FIRESTORE_COLLECTION_CATALOG", "activity_catalog"
    )
    FIRESTORE_COLLECTION_REGISTRATIONS: str = os.getenv(
        "FIRESTORE_COLLECTION_REGISTRATIONS", "registrations"
    )
    FIRESTORE_COLLECTION_REFLECTIONS: str = os.getenv(
        "FIRESTORE_COLLECTION_REFLECTIONS", "reflections"
    )

    # Server
    HOST: str = os.getenv("HOST", "0.0.0.0")
    PORT: int = int(os.getenv("PORT", "8080"))


config = Config()
