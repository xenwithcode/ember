// frontend/src/hooks/useDashboardData.ts

import { useMemo } from "react";
import { useJournalStorage } from "./useJournalStorage";
import { useSparkChallenges } from "./useSparkChallenges";
import { useFutureLetters } from "./useFutureLetters";
import { useOnboarding } from "./useOnboarding";
import { useWeeklyPatterns } from "./useWeeklyPatterns";

export interface DashboardData {
  // Ember Level
  emberLevel: number;
  emberTitle: string;
  emberProgress: number; // 0-100 to next level
  totalPoints: number;

  // Stats
  journalEntries: number;
  totalWords: number;
  activitiesCompleted: number;
  lettersWritten: number;
  lettersDelivered: number;
  sparkChallengesCompleted: number;
  daysJournaled: number;
  currentStreak: number;

  // Weekly
  weeklyPatterns: any;

  // Onboarding
  onboardingComplete: boolean;
  onboardingProgress: number;

  // Journey
  journeyWeeks: number;
  firstEntryDate: string | null;
}

// Ember levels based on total engagement
const EMBER_LEVELS = [
  { level: 1, title: "The First Spark", minPoints: 0, emoji: "✨" },
  { level: 2, title: "The Ember Glows", minPoints: 50, emoji: "🔥" },
  { level: 3, title: "The Flame Grows", minPoints: 150, emoji: "🔥" },
  { level: 4, title: "The Fire Spreads", minPoints: 300, emoji: "🔥" },
  { level: 5, title: "The Blaze", minPoints: 500, emoji: "🌟" },
  { level: 6, title: "The Wildfire", minPoints: 800, emoji: "🌟" },
];

export function useDashboardData() {
  const { entries, stats: journalStats } = useJournalStorage();
  const { challenges, stats: challengeStats } = useSparkChallenges();
  const { letters, stats: letterStats } = useFutureLetters();
  const { progress: onboardingProgress } = useOnboarding();
  const { summary: weeklySummary } = useWeeklyPatterns(entries);

  return useMemo(() => {
    // Calculate total points
    const journalPoints = entries.length * 10; // 10 pts per entry
    const wordPoints = Math.floor(journalStats.totalWords / 100) * 5; // 5 pts per 100 words
    const streakPoints = journalStats.currentStreak * 15; // 15 pts per streak day
    const challengePoints = challengeStats.totalCompleted * 25; // 25 pts per challenge
    const letterPoints = letterStats.totalLetters * 20; // 20 pts per letter
    const onboardingPoints = onboardingProgress.completedDays.length * 5; // 5 pts per day

    const totalPoints =
      journalPoints +
      wordPoints +
      streakPoints +
      challengePoints +
      letterPoints +
      onboardingPoints;

    // Determine ember level
    let currentLevel = EMBER_LEVELS[0];
    let nextLevel = EMBER_LEVELS[1];

    for (let i = 0; i < EMBER_LEVELS.length; i++) {
      if (totalPoints >= EMBER_LEVELS[i].minPoints) {
        currentLevel = EMBER_LEVELS[i];
        nextLevel = EMBER_LEVELS[i + 1] || EMBER_LEVELS[i];
      }
    }

    // Progress to next level
    const levelRange = nextLevel.minPoints - currentLevel.minPoints;
    const progressInLevel = totalPoints - currentLevel.minPoints;
    const emberProgress =
      levelRange > 0 ? Math.min((progressInLevel / levelRange) * 100, 100) : 100;

    // First entry date
    const firstEntryDate =
      entries.length > 0
        ? new Date(entries[entries.length - 1].timestamp).toLocaleDateString(
            "en-US",
            { month: "short", day: "numeric", year: "numeric" }
          )
        : null;

    // Journey weeks
    const journeyWeeks = firstEntryDate
      ? Math.max(
          1,
          Math.ceil(
            (Date.now() - entries[entries.length - 1].timestamp) /
              (7 * 24 * 60 * 60 * 1000)
          )
        )
      : 0;

    return {
      emberLevel: currentLevel.level,
      emberTitle: currentLevel.title,
      emberEmoji: currentLevel.emoji,
      emberProgress,
      totalPoints,

      journalEntries: entries.length,
      totalWords: journalStats.totalWords,
      activitiesCompleted: 0, // Will connect to activities later
      lettersWritten: letterStats.totalLetters,
      lettersDelivered: letterStats.reflectedCount,
      sparkChallengesCompleted: challengeStats.totalCompleted,
      daysJournaled: journalStats.daysWritten,
      currentStreak: journalStats.currentStreak,

      weeklyPatterns: weeklySummary,

      onboardingComplete: onboardingProgress.isOnboarded,
      onboardingProgress: onboardingProgress.completedDays.length,

      journeyWeeks,
      firstEntryDate,

      // For the identity graph
      entries,
      challenges,
      letters,
    };
  }, [
    entries,
    journalStats,
    challengeStats,
    letterStats,
    onboardingProgress,
    weeklySummary,
  ]);
}