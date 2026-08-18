// frontend/src/data/friends.ts

export interface Friend {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  tags: string[];
  avatar?: string; // emoji fallback
  relationship: "family" | "close_friend" | "friend" | "colleague" | "acquaintance";
  interests: string[]; // Para smart suggestions
  notes?: string;
  invitations: Invitation[];
  addedAt: number;
}

export interface Invitation {
  id: string;
  activityId: string;
  activityTitle: string;
  sentAt: number;
  status: "pending" | "accepted" | "declined" | "expired";
  channel: "email" | "sms" | "manual";
  message: string;
}

export const FRIEND_TAGS = [
  "Family",
  "College",
  "Work",
  "Gym buddy",
  "Neighbor",
  "High school",
  "Creative",
  "Adventure",
];

export const RELATIONSHIP_TONES = {
  family: { label: "Family", tone: "warm and caring" },
  close_friend: { label: "Close friend", tone: "casual and fun" },
  friend: { label: "Friend", tone: "friendly and inviting" },
  colleague: { label: "Colleague", tone: "professional but warm" },
  acquaintance: { label: "Acquaintance", tone: "polite and welcoming" },
};

export const mockFriends: Friend[] = [
  {
    id: "f1",
    name: "Alex Chen",
    email: "alex@example.com",
    phone: "+15551234567",
    tags: ["College", "Adventure"],
    avatar: "🧑",
    relationship: "close_friend",
    interests: ["hiking", "art", "music"],
    notes: "Loves outdoor activities. Recently moved to Brooklyn.",
    invitations: [
      {
        id: "i1",
        activityId: "a4",
        activityTitle: "Beginner Hiking Group",
        sentAt: Date.now() - 86400000,
        status: "accepted",
        channel: "email",
        message: "Hey! Want to join me for a hike this Saturday?",
      },
    ],
    addedAt: Date.now() - 2592000000,
  },
  {
    id: "f2",
    name: "Mom",
    phone: "+15559876543",
    tags: ["Family"],
    avatar: "👩",
    relationship: "family",
    interests: ["gardening", "cooking", "reading"],
    invitations: [],
    addedAt: Date.now() - 86400000,
  },
  {
    id: "f3",
    name: "Sarah Williams",
    email: "sarah.w@example.com",
    tags: ["Work", "Creative"],
    avatar: "👩‍🎨",
    relationship: "colleague",
    interests: ["watercolor", "pottery", "book clubs"],
    invitations: [
      {
        id: "i2",
        activityId: "a1",
        activityTitle: "Beginner Watercolor Workshop",
        sentAt: Date.now() - 172800000,
        status: "pending",
        channel: "email",
        message: "Thought you might like this!",
      },
    ],
    addedAt: Date.now() - 604800000,
  },
];

// Generate invitation email/SMS based on friend + activity + relationship
export function generateInvitationMessage(
  friend: Friend,
  activity: {
    title: string;
    locationName: string;
    startDate: string;
    startTime: string;
    description: string;
    category: string;
  },
  channel: "email" | "sms"
): string {
  const tone = RELATIONSHIP_TONES[friend.relationship].tone;
  const firstName = friend.name.split(" ")[0];

  const date = new Date(activity.startDate + "T00:00:00");
  const formattedDate = date.toLocaleDateString("en-US", {
    weekday: "long",
    month: "short",
    day: "numeric",
  });

  // Different templates based on relationship
  const greetings: Record<string, string[]> = {
    family: [`Hey ${firstName}!`, `Hi ${firstName}, hope you're doing well 💛`],
    close_friend: [`Hey ${firstName}!`, `Yo ${firstName}!`, `${firstName}!! 👋`],
    friend: [`Hey ${firstName}!`, `Hi ${firstName},`],
    colleague: [`Hi ${firstName},`, `Hey ${firstName}!`],
    acquaintance: [`Hi ${firstName},`, `Hello ${firstName},`],
  };

  const greeting =
    greetings[friend.relationship][
      Math.floor(Math.random() * greetings[friend.relationship].length)
    ];

  if (channel === "sms") {
    return `${greeting} I'm trying to do more things in the real world lately 🌱 Found this: ${activity.title} at ${activity.locationName} on ${formattedDate} at ${activity.startTime}. Want to come with me? No pressure! - Sent via Ember 🔥`;
  }

  // Email version (more detailed)
  return `Subject: Want to join me for ${activity.title.toLowerCase()}? 🌱

${greeting}

I've been trying to get out more and do things in the real world instead of just scrolling through my phone 😅.

I found this ${activity.category} experience and immediately thought of you:

${activity.title}
📍 ${activity.locationName}
📅 ${formattedDate}
⏰ ${activity.startTime}

${activity.description}

No pressure at all — just thought it could be fun to do something together in person. Let me know if you're interested!

Hope to see you there,
[Your name]

—
Sent via Ember 🔥 — helping me build real connections, one small step at a time.`;
}