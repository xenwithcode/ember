export interface Achievement {
  id: string;
  title: string;
  description: string;
  emoji: string;
  unlocked: boolean;
  unlockedDate?: string;
  progress?: number; // 0-100 for locked achievements
}

export interface JourneyEntry {
  week: number;
  quote: string;
  mood: number; // 1-10
  activitiesCompleted: number;
  keyInsight: string;
}

export interface IdentityNode {
  label: string;
  week: number;
  type: "negative" | "neutral" | "positive";
}

export const mockAchievements: Achievement[] = [
  {
    id: "1",
    title: "First Step",
    description: "Completed your first activity",
    emoji: "👣",
    unlocked: true,
    unlockedDate: "2026-08-03",
  },
  {
    id: "2",
    title: "Creative Soul",
    description: "Completed 3 creative activities",
    emoji: "🎨",
    unlocked: true,
    unlockedDate: "2026-08-10",
  },
  {
    id: "3",
    title: "Nature Lover",
    description: "Spent time in nature 3 times",
    emoji: "🌿",
    unlocked: true,
    unlockedDate: "2026-08-12",
  },
  {
    id: "4",
    title: "Social Butterfly",
    description: "Attended 5 social activities",
    emoji: "🦋",
    unlocked: false,
    progress: 60,
  },
  {
    id: "5",
    title: "Streak Master",
    description: "7-day activity streak",
    emoji: "🔥",
    unlocked: true,
    unlockedDate: "2026-08-13",
  },
  {
    id: "6",
    title: "Community Champion",
    description: "Volunteered 3 times",
    emoji: "🤝",
    unlocked: false,
    progress: 33,
  },
  {
    id: "7",
    title: "Mindful Moment",
    description: "Completed 5 mindfulness sessions",
    emoji: "🧘",
    unlocked: false,
    progress: 40,
  },
  {
    id: "8",
    title: "Bridge Builder",
    description: "Invited a friend to an activity",
    emoji: "🌉",
    unlocked: true,
    unlockedDate: "2026-08-11",
  },
];

export const mockJourney: JourneyEntry[] = [
  {
    week: 1,
    quote: "I'm scared to try anything. What if I'm bad at it?",
    mood: 3,
    activitiesCompleted: 0,
    keyInsight: "Fear of judgment is keeping me stuck",
  },
  {
    week: 2,
    quote: "I went to a watercolor workshop. It was... actually okay.",
    mood: 5,
    activitiesCompleted: 2,
    keyInsight: "Small groups feel safe. Creating > performing.",
  },
  {
    week: 3,
    quote: "I actually looked forward to the hiking group this week.",
    mood: 7,
    activitiesCompleted: 3,
    keyInsight: "Nature and movement help my anxiety.",
  },
  {
    week: 4,
    quote: "I invited a friend to board game night. I feel like myself again.",
    mood: 8,
    activitiesCompleted: 4,
    keyInsight: "Connection is what I was missing, not validation.",
  },
];

export const mockIdentityGraph: IdentityNode[] = [
  { label: "anxious", week: 1, type: "negative" },
  { label: "isolated", week: 1, type: "negative" },
  { label: "curious", week: 2, type: "neutral" },
  { label: "creative", week: 2, type: "positive" },
  { label: "hopeful", week: 3, type: "positive" },
  { label: "connected", week: 3, type: "positive" },
  { label: "confident", week: 4, type: "positive" },
  { label: "authentic", week: 4, type: "positive" },
];

export const mockStats = {
  streakDays: 7,
  activitiesCompleted: 12,
  moodImprovement: "+34%",
  categoriesExplored: 5,
  friendsInvited: 2,
  reflectionsWritten: 8,
};