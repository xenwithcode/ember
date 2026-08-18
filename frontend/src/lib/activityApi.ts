import type {
  Activity,
  ActivityCategory,
  AnxietyLevel,
} from "@/data/activities";

/**
 * Wire format of the backend activity catalog (snake_case, full model).
 */
export interface ApiActivity {
  id: string;
  slug: string;
  title: string;
  description: string;
  short_description: string;
  category: string;
  tags: string[];
  image_url: string;
  location_name: string;
  address: string;
  city: string;
  state: string;
  latitude: number;
  longitude: number;
  start_date: string;
  duration_minutes: number;
  price: number;
  spots_remaining: number;
  capacity: number;
  organizer_name: string;
  organizer_verified: boolean;
  certification_available: boolean;
  requires_registration: boolean;
  beginner_friendly: boolean;
  group_size_expected: number;
  anxiety_level: string;
  accessibility_notes: string;
  maps_link?: string;
}

const CATEGORY_SET: ReadonlySet<string> = new Set([
  "creative",
  "physical",
  "social",
  "intellectual",
  "volunteer",
  "nature",
  "mindfulness",
  "student",
]);

const ANXIETY_SET: ReadonlySet<string> = new Set([
  "solo",
  "low",
  "moderate",
  "high",
]);

/**
 * Maps a backend catalog activity (snake_case) to the frontend Activity shape.
 * Falls back to the mock shape defaults when a field is missing.
 */
export function mapServerActivity(api: ApiActivity): Activity {
  const start = new Date(api.start_date);
  const category: ActivityCategory = CATEGORY_SET.has(api.category)
    ? (api.category as ActivityCategory)
    : "social";
  const anxietyLevel: AnxietyLevel = ANXIETY_SET.has(api.anxiety_level)
    ? (api.anxiety_level as AnxietyLevel)
    : "moderate";

  return {
    id: api.id || api.slug,
    title: api.title,
    description: api.description || api.short_description || "",
    category,
    anxietyLevel,
    tags: api.tags ?? [],
    imageUrl: api.image_url || "",
    locationName: api.location_name || [api.city, api.state].filter(Boolean).join(", "),
    latitude: api.latitude,
    longitude: api.longitude,
    startDate: start.toISOString(),
    startTime: isNaN(start.getTime())
      ? ""
      : start.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" }),
    durationMinutes: api.duration_minutes ?? 60,
    price: api.price ?? 0,
    spotsRemaining: api.spots_remaining ?? api.capacity ?? 0,
    organizerVerified: api.organizer_verified ?? false,
    certificationAvailable: api.certification_available ?? false,
  };
}

export interface ActivityExpectations {
  whatToExpect: string[];
  whatToBring: string[];
  accessibilityNotes: string[];
}

const CATEGORY_EXPECTATIONS: Record<
  ActivityCategory,
  { expect: string[]; bring: string[] }
> = {
  creative: {
    expect: [
      "A calm, judgment-free space led by a supportive facilitator",
      "Step-by-step instruction — no prior experience needed",
      "Plenty of time to ask questions at your own pace",
    ],
    bring: ["Comfortable clothes you don't mind getting a little messy"],
  },
  physical: {
    expect: [
      "A gentle, guided session paced for beginners",
      "A certified facilitator who checks in with everyone",
      "Low-pressure movement — go at your own comfort level",
    ],
    bring: ["Comfortable shoes", "A water bottle", "A small towel"],
  },
  social: {
    expect: [
      "A relaxed atmosphere designed for natural conversation",
      "Icebreakers and low-pressure games (no one is put on the spot)",
      "Great for starting a conversation or just being around people",
    ],
    bring: ["A smile — everything else is provided"],
  },
  intellectual: {
    expect: [
      "Thought-provoking content with zero pressure to speak",
      "A welcoming group that values curiosity over expertise",
      "Q&A sections, but listening is always allowed",
    ],
    bring: ["A notebook and pen to jot down ideas"],
  },
  volunteer: {
    expect: [
      "A structured shift with clear, simple tasks",
      "A friendly coordinator who will show you the ropes",
      "A rewarding feeling — helping others is proven to ease anxiety",
    ],
    bring: ["Comfortable clothes you can move in"],
  },
  nature: {
    expect: [
      "Gentle outdoor time at a relaxed walking pace",
      "A small, supportive group with a patient guide",
      "Beautiful scenery and opportunities to pause and breathe",
    ],
    bring: ["Comfortable walking shoes", "A water bottle"],
  },
  mindfulness: {
    expect: [
      "A quiet, serene space to slow down",
      "Guided practices for breathing and presence",
      "No props needed — beginners are welcomed warmly",
    ],
    bring: ["Comfortable clothing", "An open mind"],
  },
  student: {
    expect: [
      "A relaxed, low-stakes way to meet other students",
      "Campus-friendly location and scheduling",
      "No pressure to perform — just show up and be yourself",
    ],
    bring: ["Your student ID", "Any questions you'd like to ask"],
  },
};

/**
 * Deterministic expectation list for an activity, mixing category guidance
 * with the real catalog values (group size, duration, accessibility notes).
 */
export function getExpectationInfo(activity: Activity): ActivityExpectations {
  const base = CATEGORY_EXPECTATIONS[activity.category] ?? CATEGORY_EXPECTATIONS.social;
  const whatToExpect = [...base.expect];
  if (activity.spotsRemaining > 0 && activity.spotsRemaining <= 3) {
    whatToExpect.push("Only a few spots left — the group stays small and personal");
  }
  const whatToBring = [...base.bring];
  const accessibilityNotes: string[] = [];
  if (activity.certificationAvailable) {
    whatToExpect.push("Participants can earn a certification — great for your resume");
  }
  return { whatToExpect, whatToBring, accessibilityNotes };
}

/**
 * Fetches the live catalog from the backend through the /api proxy.
 * Returns null when the backend is unreachable so callers can fall back
 * to the local mock catalog.
 */
export async function fetchActivities(): Promise<Activity[] | null> {
  try {
    const response = await fetch("/api/activities?limit=50", {
      headers: { Accept: "application/json" },
    });
    if (!response.ok) return null;
    const data: { activities?: ApiActivity[]; count?: number } =
      await response.json();
    if (!data.activities?.length) return null;
    return data.activities.map(mapServerActivity);
  } catch (error) {
    console.warn("Activity catalog fetch failed:", error);
    return null;
  }
}

/**
 * Fetches a single activity from the live catalog by id or slug.
 * Returns null on 404 or network failure.
 */
export async function fetchActivity(id: string): Promise<Activity | null> {
  try {
    const response = await fetch(`/api/activities/${encodeURIComponent(id)}`, {
      headers: { Accept: "application/json" },
    });
    if (!response.ok) return null;
    const data: ApiActivity = await response.json();
    return mapServerActivity(data);
  } catch (error) {
    console.warn(`Activity fetch failed for ${id}:`, error);
    return null;
  }
}

/**
 * Registers the user for an activity. Falls back gracefully (returns false)
 * so the UI can still show a local confirmation in demo mode.
 */
export async function registerForActivity(
  activityId: string,
  userId: string
): Promise<boolean> {
  try {
    const response = await fetch(
      `/api/activities/${encodeURIComponent(activityId)}/register?user_id=${encodeURIComponent(userId)}`,
      { method: "POST", headers: { Accept: "application/json" } }
    );
    if (!response.ok) return false;
    const data: { success?: boolean } = await response.json();
    return data.success ?? false;
  } catch (error) {
    console.warn(`Registration failed for ${activityId}:`, error);
    return false;
  }
}