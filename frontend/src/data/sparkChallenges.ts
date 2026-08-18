// frontend/src/data/sparkChallenges.ts

export interface SparkChallengeTemplate {
  id: string;
  category: ChallengeCategory;
  title: string;
  description: string;
  triggerPattern: string; // Qué patrón lo activa
  action: string; // Qué debe hacer el usuario
  duration: string;
  difficulty: "easy" | "medium" | "brave";
  emoji: string;
  followUpPrompt: string; // Pregunta para después de completarlo
}

export type ChallengeCategory =
  | "anxiety"
  | "comparison"
  | "isolation"
  | "perfectionism"
  | "procrastination"
  | "self-care"
  | "creativity"
  | "connection";

export const sparkChallengeTemplates: SparkChallengeTemplate[] = [
  // === ANXIETY ===
  {
    id: "anxiety_breath",
    category: "anxiety",
    title: "The 3-Breath Reset",
    description:
      "Your entries show anxiety appearing frequently. Let's give your nervous system a small gift.",
    triggerPattern: "anxiety mentioned 3+ times in 7 days",
    action:
      "Before your next stressful moment, pause and take 3 deep breaths using the 4-7-8 technique. Then write one sentence about how your body feels.",
    duration: "2 minutes",
    difficulty: "easy",
    emoji: "🫁",
    followUpPrompt:
      "How did the 3 breaths feel? Did your body respond differently than your mind expected?",
  },
  {
    id: "anxiety_worry_time",
    category: "anxiety",
    title: "Scheduled Worry Time",
    description:
      "Your anxiety seems to pop up at random moments. Let's give it a specific appointment.",
    triggerPattern: "anxiety with no specific trigger mentioned",
    action:
      "Set a 10-minute timer for tomorrow. During those 10 minutes, write down every worry you have. When the timer ends, close the notebook and say: 'Worry time is over.'",
    duration: "10 minutes",
    difficulty: "medium",
    emoji: "⏰",
    followUpPrompt:
      "Did containing your worries in 10 minutes make them feel more manageable?",
  },

  // === COMPARISON ===
  {
    id: "comparison_unplug",
    category: "comparison",
    title: "The 24-Hour Unplug",
    description:
      "Your entries show you comparing yourself to others. The comparison engine needs a break.",
    triggerPattern: "comparison or 'behind' mentioned 2+ times",
    action:
      "For the next 24 hours, don't open Instagram, TikTok, or LinkedIn. If you feel the urge, write down what you were about to look at.",
    duration: "24 hours",
    difficulty: "brave",
    emoji: "📵",
    followUpPrompt:
      "What did you notice about your thoughts when the comparison feed was off?",
  },
  {
    id: "comparison_create",
    category: "comparison",
    title: "Create Without Posting",
    description:
      "You've been measuring your worth against others' highlights. Let's create something that's just for you.",
    triggerPattern: "comparison with social media context",
    action:
      "Create something today — a sketch, a poem, a playlist, a meal. Do NOT post it. Do NOT show anyone. It exists only for you.",
    duration: "15-30 minutes",
    difficulty: "easy",
    emoji: "🎨",
    followUpPrompt:
      "How did it feel to create something with zero audience? What surprised you?",
  },

  // === ISOLATION ===
  {
    id: "isolation_small_talk",
    category: "isolation",
    title: "The 2-Minute Connection",
    description:
      "Your entries mention feeling alone or disconnected. Connection doesn't require grand gestures.",
    triggerPattern: "loneliness or isolation mentioned",
    action:
      "Today, have one 2-minute conversation with someone. A barista, a neighbor, a coworker. Just say hello and ask one genuine question.",
    duration: "2 minutes",
    difficulty: "medium",
    emoji: "💬",
    followUpPrompt:
      "How did the small conversation feel? Did it change your sense of isolation, even slightly?",
  },
  {
    id: "isolation_reach_out",
    category: "isolation",
    title: "The Honest Text",
    description:
      "You've been carrying loneliness quietly. Let's send one small signal.",
    triggerPattern: "loneliness with mention of friends/family",
    action:
      "Text one person you haven't talked to in a while. Keep it simple: 'Hey, thinking of you. How are you really doing?'",
    duration: "1 minute",
    difficulty: "medium",
    emoji: "📱",
    followUpPrompt:
      "How did it feel to reach out? What happened when you did?",
  },

  // === PERFECTIONISM ===
  {
    id: "perfectionism_imperfect",
    category: "perfectionism",
    title: "Do It Badly On Purpose",
    description:
      "Your entries show pressure to be perfect. Let's rebel against that.",
    triggerPattern: "perfectionism or 'not good enough' mentioned",
    action:
      "Do one thing today badly on purpose. Send the email with a typo. Leave the dishes. Submit the draft without polishing. Notice that the world doesn't end.",
    duration: "Varies",
    difficulty: "brave",
    emoji: "🎯",
    followUpPrompt:
      "What happened when you did it imperfectly? Did anyone notice? Did it matter?",
  },

  // === SELF-CARE ===
  {
    id: "selfcare_walk",
    category: "self-care",
    title: "The Mindful Walk",
    description:
      "Your entries show you've been running on empty. Your body needs a moment.",
    triggerPattern: "exhaustion or burnout mentioned",
    action:
      "Take a 10-minute walk outside. No phone, no music. Just notice 3 things you've never seen before on your usual route.",
    duration: "10 minutes",
    difficulty: "easy",
    emoji: "🚶",
    followUpPrompt:
      "What did you notice on your walk? Did being outside change your internal weather?",
  },
  {
    id: "selfcare_sensory",
    category: "self-care",
    title: "The 5-Senses Grounding",
    description:
      "You've been living in your head. Let's bring you back to your body.",
    triggerPattern: "overthinking or rumination mentioned",
    action:
      "Right now, name: 5 things you can see, 4 you can touch, 3 you can hear, 2 you can smell, 1 you can taste. Write them down.",
    duration: "3 minutes",
    difficulty: "easy",
    emoji: "🌿",
    followUpPrompt:
      "How did grounding in your senses feel compared to being in your thoughts?",
  },

  // === CREATIVITY ===
  {
    id: "creativity_express",
    category: "creativity",
    title: "The Unfiltered Page",
    description:
      "Your entries hint at creative energy that's been blocked. Let's unblock it.",
    triggerPattern: "creative interests mentioned with hesitation",
    action:
      "Set a timer for 10 minutes. Write, draw, or build something without stopping. No editing. No judging. Just flow.",
    duration: "10 minutes",
    difficulty: "easy",
    emoji: "✨",
    followUpPrompt:
      "What came out when you stopped editing yourself?",
  },

  // === CONNECTION ===
  {
    id: "connection_face_to_face",
    category: "connection",
    title: "The Face-to-Face Step",
    description:
      "Your entries show you craving real connection. Let's make it happen.",
    triggerPattern: "desire for connection or friendship mentioned",
    action:
      "Find one local activity this week that interests you. Register for it. Show up. You don't have to talk to anyone — just be there.",
    duration: "1 hour",
    difficulty: "brave",
    emoji: "🤝",
    followUpPrompt:
      "How did it feel to show up? What was different about being in a room with real people?",
  },
];

// Get challenges by category
export function getChallengesByCategory(
  category: ChallengeCategory
): SparkChallengeTemplate[] {
  return sparkChallengeTemplates.filter((c) => c.category === category);
}

// Get a random challenge from a category
export function getRandomChallenge(
  category: ChallengeCategory
): SparkChallengeTemplate | undefined {
  const challenges = getChallengesByCategory(category);
  if (challenges.length === 0) return undefined;
  return challenges[Math.floor(Math.random() * challenges.length)];
}