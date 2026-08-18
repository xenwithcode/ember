// frontend/src/data/rituals.ts

export interface Ritual {
  id: string;
  name: string;
  emoji: string;
  duration: string;
  purpose: string;
  prompt: string;
  description: string;
  emberColor: string; // Color dominante de la brasa para este ritual
  emberIntensity: "gentle" | "warm" | "bright" | "intense";
  followUpQuestions: string[];
}

export const rituals: Ritual[] = [
  {
    id: "morning",
    name: "Morning Ember",
    emoji: "🌅",
    duration: "~5 min",
    purpose: "Set intentions for the day",
    prompt: "What matters most to you today? What would make this day feel meaningful, regardless of what happens around you?",
    description: "A gentle start. Light the ember with intention before the world demands your attention.",
    emberColor: "#F59E0B", // amber/warm gold
    emberIntensity: "gentle",
    followUpQuestions: [
      "What's one small thing you can do today that aligns with this intention?",
      "How will you know the day was meaningful?",
    ],
  },
  {
    id: "evening",
    name: "Evening Ember",
    emoji: "🌙",
    duration: "~10 min",
    purpose: "Process the day honestly",
    prompt: "What surprised you today? What moment — big or small — would you want to remember a year from now?",
    description: "The day is done. Let the ember reveal what it captured.",
    emberColor: "#E28766", // terracotta (default)
    emberIntensity: "warm",
    followUpQuestions: [
      "What did you learn about yourself today?",
      "What would you do differently tomorrow?",
    ],
  },
  {
    id: "deep",
    name: "Deep Ember",
    emoji: "🔥",
    duration: "~20 min",
    purpose: "Explore what's underneath",
    prompt: "What's been weighing on your mind? Not the surface — the thing underneath. The one you haven't quite named yet.",
    description: "Go deep. This ember burns long and slow. No rush, no judgment.",
    emberColor: "#DC2626", // deep red
    emberIntensity: "intense",
    followUpQuestions: [
      "When was the last time you felt this way?",
      "What would you say to someone you love if they felt this way?",
      "What part of this is within your control?",
    ],
  },
  {
    id: "metaphor",
    name: "Metaphor Mode",
    emoji: "🎭",
    duration: "~10 min",
    purpose: "Describe emotions as images",
    prompt: "If your current emotion were a landscape, a weather pattern, or a creature — what would it look like? Describe it in detail. (Don't name the emotion directly.)",
    description: "Sometimes words are too direct. Metaphors give your feelings room to breathe.",
    emberColor: "#8B5CF6", // purple
    emberIntensity: "bright",
    followUpQuestions: [
      "What part of this image feels most alive?",
      "If you could change one thing about this landscape, what would it be?",
      "What would it look like after the storm passes?",
    ],
  },
  {
    id: "letter",
    name: "Letter to Future You",
    emoji: "📬",
    duration: "~15 min",
    purpose: "Write to who you're becoming",
    prompt: "Dear me, one month from today... What do you hope is different? What are you afraid might stay the same? What do you want your future self to remember about right now?",
    description: "A conversation across time. Your future self will thank you.",
    emberColor: "#0891B2", // cyan
    emberIntensity: "warm",
    followUpQuestions: [
      "What's one thing you'd tell your future self to never forget?",
      "What fear do you hope they've overcome?",
    ],
  },
];

export const defaultRitual = rituals[1]; // Evening Ember as default