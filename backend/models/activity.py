"""
Activity Model - The core of Ember's Face to Face experience.

This model represents REAL-WORLD activities that users can:
- Discover (with geolocation)
- View details (address, description, dates, capacity)
- Register for
- Schedule in their calendar
- Reflect on after completion

This is what makes the agent's suggestions CONCRETE and ACTIONABLE.
"""

from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime
from enum import Enum


class ActivityStatus(str, Enum):
    """Status of the activity in the catalog."""
    UPCOMING = "upcoming"
    ONGOING = "ongoing"
    COMPLETED = "completed"
    CANCELLED = "cancelled"
    FULL = "full"


class UserActivityStatus(str, Enum):
    """User's relationship with this activity."""
    DISCOVERED = "discovered"
    INTERESTED = "interested"
    REGISTERED = "registered"
    SCHEDULED = "scheduled"
    ATTENDED = "attended"
    SKIPPED = "skipped"


class ActivityCategory(str, Enum):
    """Categories that map to user interests and anxiety levels."""
    CREATIVE = "creative"
    PHYSICAL = "physical"
    SOCIAL = "social"
    INTELLECTUAL = "intellectual"
    VOLUNTEER = "volunteer"
    NATURE = "nature"
    MUSIC = "music"
    CULINARY = "culinary"


class AnxietyLevel(str, Enum):
    """How socially demanding this activity is."""
    SOLO = "solo"              # No interaction needed (museum, solo hike)
    LOW = "low"                # Minimal interaction (yoga class, workshop)
    MODERATE = "moderate"      # Some interaction (small group, board games)
    HIGH = "high"              # Significant interaction (team sports, networking)


class Activity(BaseModel):
    """
    Complete model for a real-world activity.
    Includes everything needed for discovery, registration, and calendar.
    """

    # === IDENTIFICATION ===
    id: Optional[str] = None
    title: str = Field(
        ...,
        description="Name of the activity",
        examples=["Beginner Watercolor Workshop", "Sunrise Yoga in the Park"]
    )
    slug: str = Field(
        default="",
        description="URL-friendly identifier"
    )

    # === DESCRIPTION & DETAILS ===
    description: str = Field(
        ...,
        description="What the activity is about, what to expect"
    )
    short_description: str = Field(
        default="",
        description="One-line summary for cards/lists"
    )
    category: ActivityCategory = ActivityCategory.SOCIAL
    tags: list[str] = Field(
        default_factory=list,
        description="Searchable tags",
        examples=["beginner", "outdoor", "relaxing"]
    )

    # === IMAGES & MEDIA ===
    image_url: str = Field(
        default="",
        description="Main image for the activity card"
    )
    gallery_urls: list[str] = Field(
        default_factory=list,
        description="Additional images"
    )

    # === LOCATION & GEOLOCATION ===
    location_name: str = Field(
        default="",
        description="Name of the venue",
        examples=["Central Park", "Brooklyn Art Studio"]
    )
    address: str = Field(
        default="",
        description="Full street address"
    )
    city: str = Field(
        default="",
        description="City where the activity takes place"
    )
    state: str = Field(
        default="",
        description="State/Province"
    )
    zip_code: str = Field(
        default="",
        description="ZIP/Postal code"
    )
    latitude: float = Field(
        default=0.0,
        description="GPS latitude for map display"
    )
    longitude: float = Field(
        default=0.0,
        description="GPS longitude for map display"
    )
    directions_url: str = Field(
        default="",
        description="Google Maps directions link"
    )
    is_virtual: bool = Field(
        default=False,
        description="Whether this is an online activity"
    )
    virtual_url: str = Field(
        default="",
        description="URL for virtual activities"
    )

    # === DATE & TIME ===
    start_date: datetime = Field(
        ...,
        description="When the activity starts"
    )
    end_date: datetime = Field(
        ...,
        description="When the activity ends"
    )
    duration_minutes: int = Field(
        default=60,
        description="Duration in minutes"
    )
    recurrence: str = Field(
        default="one_time",
        description="one_time, weekly, biweekly, monthly"
    )
    registration_deadline: Optional[datetime] = Field(
        default=None,
        description="Last date to register"
    )

    # === CAPACITY & REGISTRATION ===
    capacity: int = Field(
        default=20,
        description="Maximum number of participants"
    )
    spots_remaining: int = Field(
        default=20,
        description="How many spots are left"
    )
    requires_registration: bool = Field(
        default=True,
        description="Whether user needs to register beforehand"
    )
    registration_url: str = Field(
        default="",
        description="External registration link (Eventbrite, Meetup, etc.)"
    )
    price: float = Field(
        default=0.0,
        description="Cost to participate (0 = free)"
    )
    currency: str = Field(
        default="USD",
        description="Currency for the price"
    )

    # === ANXIETY & ACCESSIBILITY ===
    anxiety_level: AnxietyLevel = Field(
        default=AnxietyLevel.LOW,
        description="How socially demanding this activity is"
    )
    group_size_expected: int = Field(
        default=10,
        description="Expected number of people"
    )
    beginner_friendly: bool = Field(
        default=True,
        description="Whether beginners are welcome"
    )
    accessibility_notes: str = Field(
        default="",
        description="Accessibility information"
    )

    # === ORGANIZER INFO ===
    organizer_name: str = Field(
        default="",
        description="Who organizes this activity"
    )
    organizer_contact: str = Field(
        default="",
        description="Contact email or phone"
    )
    organizer_verified: bool = Field(
        default=False,
        description="Whether the organizer is verified by Ember"
    )

    # === STATUS ===
    status: ActivityStatus = ActivityStatus.UPCOMING

    # === COMMUNITY VALIDATION ===
    certification_available: bool = Field(
        default=False,
        description="Whether completion can be certified by the organizer"
    )

    # === METADATA ===
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None


class UserActivity(BaseModel):
    """
    Represents a user's relationship with an activity.
    Tracks their journey from discovery to reflection.
    """

    id: Optional[str] = None
    user_id: str
    activity_id: str
    activity: Optional[Activity] = None

    # User's journey with this activity
    status: UserActivityStatus = UserActivityStatus.DISCOVERED

    # Registration details
    registered_at: Optional[datetime] = None
    registration_confirmation: str = Field(
        default="",
        description="Confirmation code or email"
    )

    # Calendar integration
    calendar_event_id: str = Field(
        default="",
        description="Google Calendar event ID"
    )
    reminder_set: bool = Field(
        default=False,
        description="Whether user set a reminder"
    )

    # Invitation
    invited_friends: list[str] = Field(
        default_factory=list,
        description="Emails of friends invited"
    )

    # Post-activity reflection
    attended: bool = False
    mood_before: Optional[str] = None
    mood_after: Optional[str] = None
    reflection_text: Optional[str] = None
    would_recommend: Optional[bool] = None

    # Timestamps
    discovered_at: Optional[datetime] = None
    completed_at: Optional[datetime] = None