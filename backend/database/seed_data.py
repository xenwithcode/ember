"""
Seed Data - Initial activities for the catalog.
Run this script to populate Firestore with sample activities for the demo.

Usage: python -m backend.database.seed_data
"""

from datetime import datetime, timedelta, timezone
from backend.database.firestore_client import db
from backend.config import config
from backend.models.activity import (
    Activity, ActivityCategory, AnxietyLevel, ActivityStatus
)


def seed_activities():
    """Populate Firestore with sample activities for the hackathon demo."""

    activities = [
        # === CREATIVE ACTIVITIES ===
        Activity(
            title="Beginner Watercolor Workshop",
            slug="beginner-watercolor-workshop",
            description=(
                "A relaxed 2-hour workshop for absolute beginners. "
                "No experience needed, all materials provided. "
                "Learn basic techniques in a supportive, judgment-free environment. "
                "Small group of 8 people max, so you'll get personal attention."
            ),
            short_description="Learn watercolor basics in a small, friendly group",
            category=ActivityCategory.CREATIVE,
            tags=["beginner", "art", "relaxing", "small-group"],
            image_url="https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=800",
            location_name="Brooklyn Art Studio",
            address="123 Creative Lane, Brooklyn, NY 11201",
            city="New York",
            state="NY",
            zip_code="11201",
            latitude=40.6892,
            longitude=-73.9857,
            start_date=datetime.now(timezone.utc) + timedelta(days=3),
            end_date=datetime.now(timezone.utc) + timedelta(days=3, hours=2),
            duration_minutes=120,
            capacity=8,
            spots_remaining=5,
            requires_registration=True,
            price=25.0,
            anxiety_level=AnxietyLevel.LOW,
            group_size_expected=8,
            beginner_friendly=True,
            organizer_name="Brooklyn Art Collective",
            organizer_verified=True,
            certification_available=True,
        ),

        # === PHYSICAL ACTIVITIES ===
        Activity(
            title="Sunrise Yoga in the Park",
            slug="sunrise-yoga-park",
            description=(
                "Gentle morning yoga session in Central Park. "
                "Perfect for beginners - focus on breathing and being present. "
                "No flexibility required. Bring a mat or towel. "
                "The session ends with 5 minutes of guided meditation."
            ),
            short_description="Gentle yoga in nature to start your day mindfully",
            category=ActivityCategory.PHYSICAL,
            tags=["yoga", "outdoor", "morning", "beginner", "meditation"],
            image_url="https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800",
            location_name="Central Park - Sheep Meadow",
            address="Central Park, New York, NY 10024",
            city="New York",
            state="NY",
            zip_code="10024",
            latitude=40.7794,
            longitude=-73.9654,
            start_date=datetime.now(timezone.utc) + timedelta(days=1, hours=6),
            end_date=datetime.now(timezone.utc) + timedelta(days=1, hours=7),
            duration_minutes=60,
            capacity=20,
            spots_remaining=12,
            requires_registration=False,
            price=0.0,
            anxiety_level=AnxietyLevel.LOW,
            group_size_expected=15,
            beginner_friendly=True,
            organizer_name="NYC Wellness Collective",
            organizer_verified=True,
        ),

        # === SOCIAL ACTIVITIES ===
        Activity(
            title="Board Game Café Night",
            slug="board-game-cafe-night",
            description=(
                "Casual board game evening at a cozy local café. "
                "Great for meeting people without pressure - the games do the talking! "
                "We'll have a variety of games from easy to moderate complexity. "
                "Come alone or with a friend. First drink is on us!"
            ),
            short_description="Meet people through fun board games at a cozy café",
            category=ActivityCategory.SOCIAL,
            tags=["board-games", "social", "casual", "cafe", "beginner"],
            image_url="https://images.unsplash.com/photo-1611371805429-8b5c1b2c34ba?w=800",
            location_name="The Game Table Café",
            address="456 Fun Street, Manhattan, NY 10012",
            city="New York",
            state="NY",
            zip_code="10012",
            latitude=40.7282,
            longitude=-73.9942,
            start_date=datetime.now(timezone.utc) + timedelta(days=5, hours=18),
            end_date=datetime.now(timezone.utc) + timedelta(days=5, hours=21),
            duration_minutes=180,
            capacity=16,
            spots_remaining=8,
            requires_registration=True,
            price=0.0,
            anxiety_level=AnxietyLevel.MODERATE,
            group_size_expected=12,
            beginner_friendly=True,
            organizer_name="NYC Social Club",
            organizer_verified=True,
        ),

        # === NATURE ACTIVITIES ===
        Activity(
            title="Beginner Bird Watching Walk",
            slug="beginner-bird-watching",
            description=(
                "A peaceful morning walk through Prospect Park with an experienced guide. "
                "Learn to identify common NYC birds by sight and sound. "
                "Binoculars provided. No experience needed - just curiosity. "
                "Perfect for clearing your mind and connecting with nature."
            ),
            short_description="Peaceful bird watching walk in Prospect Park",
            category=ActivityCategory.NATURE,
            tags=["nature", "birds", "outdoor", "peaceful", "beginner"],
            image_url="https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800",
            location_name="Prospect Park - Main Entrance",
            address="Prospect Park, Brooklyn, NY 11225",
            city="New York",
            state="NY",
            zip_code="11225",
            latitude=40.6602,
            longitude=-73.9690,
            start_date=datetime.now(timezone.utc) + timedelta(days=2, hours=7),
            end_date=datetime.now(timezone.utc) + timedelta(days=2, hours=9),
            duration_minutes=120,
            capacity=12,
            spots_remaining=7,
            requires_registration=True,
            price=10.0,
            anxiety_level=AnxietyLevel.SOLO,
            group_size_expected=10,
            beginner_friendly=True,
            organizer_name="NYC Audubon Society",
            organizer_verified=True,
        ),

        # === VOLUNTEER ACTIVITIES ===
        Activity(
            title="Volunteer at Animal Shelter",
            slug="volunteer-animal-shelter",
            description=(
                "Spend 2 hours playing with cats and dogs at a local shelter. "
                "No social pressure - just animals and kindness. "
                "You'll help socialize the animals, making them more adoptable. "
                "Perfect if you want to help others without the anxiety of big groups."
            ),
            short_description="Play with shelter animals and help them find homes",
            category=ActivityCategory.VOLUNTEER,
            tags=["volunteer", "animals", "helping", "low-pressure"],
            image_url="https://images.unsplash.com/photo-1450778869180-41d0601e046e?w=800",
            location_name="Brooklyn Animal Rescue",
            address="789 Shelter Ave, Brooklyn, NY 11215",
            city="New York",
            state="NY",
            zip_code="11215",
            latitude=40.6687,
            longitude=-73.9876,
            start_date=datetime.now(timezone.utc) + timedelta(days=4, hours=14),
            end_date=datetime.now(timezone.utc) + timedelta(days=4, hours=16),
            duration_minutes=120,
            capacity=6,
            spots_remaining=3,
            requires_registration=True,
            price=0.0,
            anxiety_level=AnxietyLevel.LOW,
            group_size_expected=5,
            beginner_friendly=True,
            organizer_name="Brooklyn Animal Rescue",
            organizer_verified=True,
            certification_available=True,
        ),

        # === INTELLECTUAL ACTIVITIES ===
        Activity(
            title="Casual Book Club: First Chapters",
            slug="casual-book-club",
            description=(
                "A book club for people who read at their own pace. "
                "This month we're only reading the FIRST CHAPTER of a book together. "
                "No pressure to finish anything. Just show up, share your thoughts, "
                "and enjoy good conversation over coffee."
            ),
            short_description="Read just one chapter together - no pressure to finish",
            category=ActivityCategory.INTELLECTUAL,
            tags=["books", "reading", "discussion", "casual", "coffee"],
            image_url="https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=800",
            location_name="The Cozy Corner Bookshop",
            address="321 Read Street, Manhattan, NY 10003",
            city="New York",
            state="NY",
            zip_code="10003",
            latitude=40.7306,
            longitude=-73.9866,
            start_date=datetime.now(timezone.utc) + timedelta(days=7, hours=17),
            end_date=datetime.now(timezone.utc) + timedelta(days=7, hours=18, minutes=30),
            duration_minutes=90,
            capacity=10,
            spots_remaining=6,
            requires_registration=True,
            price=0.0,
            anxiety_level=AnxietyLevel.MODERATE,
            group_size_expected=8,
            beginner_friendly=True,
            organizer_name="The Cozy Corner",
            organizer_verified=True,
        ),
    ]

    print("🌱 Seeding activities to Firestore...")

    for i, activity in enumerate(activities):
        activity.created_at = datetime.now(timezone.utc)
        activity.updated_at = datetime.now(timezone.utc)
        activity.status = ActivityStatus.UPCOMING

        # Stable document id = slug, so GET /api/activities/<slug> works and
        # links stay consistent between the frontend catalog and Firestore.
        activity.id = activity.slug or f"activity-{i}"
        doc_ref = db.client.collection(
            config.FIRESTORE_COLLECTION_CATALOG
        ).document(activity.id)
        doc_ref.set(activity.model_dump())
        print(f"  ✅ {i+1}/{len(activities)}: {activity.title} ({activity.id})")

    print(f"\n🎉 Done! Seeded {len(activities)} activities.")
    print("📍 All activities are set in New York City for the demo.")


if __name__ == "__main__":
    seed_activities()