// frontend/src/hooks/useOnboarding.ts

import { useState, useEffect, useCallback, useMemo } from "react";

export interface OnboardingDayContent {
  day: number;
  title: string;
  description: string;
  prompt: string;
  suggestedRitualId: string;
  goal: string;
}

export interface OnboardingProgress {
  isOnboarded: boolean;
  completedDays: number[];
  currentDay: number;
  startedAt: number;
}

const TOTAL_DAYS = 7;
const STORAGE_KEY = "ember_onboarding";

export const onboardingContent: OnboardingDayContent[] = [
  {
    day: 1,
    title: "Light Your First Ember",
    description:
      "Welcome. Ember is a bridge back to your real life — one small, real-world step at a time. Today we just write.",
    prompt:
      "Pick the Evening Ember ritual and write about how today actually felt. Honesty over eloquence.",
    suggestedRitualId: "evening",
    goal: "Complete your first journal entry",
  },
  {
    day: 2,
    title: "Meet Your Coach",
    description:
      "Your coach reads between the lines. After you write, it notices emotions, patterns, and offers one gentle suggestion.",
    prompt:
      "Try the Morning Ember ritual and write about one intention for today.",
    suggestedRitualId: "morning",
    goal: "Notice how the coach responds to your writing",
  },
  {
    day: 3,
    title: "Go a Little Deeper",
    description:
      "Not everything is surface-level. The Deep Ember ritual helps you find what's underneath the obvious.",
    prompt:
      "Use the Deep Ember ritual. What's the thing you haven't quite named yet?",
    suggestedRitualId: "deep",
    goal: "Write about something underneath",
  },
  {
    day: 4,
    title: "See Your Emotions",
    description:
      "Sometimes words are too direct. Metaphors give feelings room to breathe — and teach you a lot about yourself.",
    prompt:
      "Try Metaphor Mode. Describe your current emotion as a landscape, weather, or creature.",
    suggestedRitualId: "metaphor",
    goal: "Describe an emotion without naming it",
  },
  {
    day: 5,
    title: "Write to Future You",
    description:
      "A conversation across time. Seal a letter your future self will open — and discover how much you grow.",
    prompt:
      "Open the Letters to Future You tab and write your first letter.",
    suggestedRitualId: "letter",
    goal: "Seal your first letter",
  },
  {
    day: 6,
    title: "Find Your Pattern",
    description:
      "Your entries reveal patterns — emotions that return, themes that persist. Awareness is the first change.",
    prompt:
      "Write with the Evening Ember ritual about any pattern you suspect in your days.",
    suggestedRitualId: "evening",
    goal: "Spot one pattern in your writing",
  },
  {
    day: 7,
    title: "Take a Spark Challenge",
    description:
      "When Ember detects a pattern, it offers a Spark Challenge — one small real-world action. This is where growth happens.",
    prompt:
      "Accept your first Spark Challenge and complete it.",
    suggestedRitualId: "deep",
    goal: "Accept and complete a Spark Challenge",
  },
];

export function useOnboarding() {
  const [progress, setProgress] = useState<OnboardingProgress>({
    isOnboarded: false,
    completedDays: [],
    currentDay: 1,
    startedAt: 0,
  });

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setProgress(JSON.parse(stored));
      }
    } catch (error) {
      console.error("Failed to load onboarding:", error);
    }
  }, []);

  const saveProgress = useCallback((next: OnboardingProgress) => {
    setProgress(next);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch (error) {
      console.error("Failed to save onboarding:", error);
    }
  }, []);

  const completeDay = useCallback(
    (day: number) => {
      setProgress((prev) => {
        if (prev.completedDays.includes(day)) return prev;
        const completedDays = [...prev.completedDays, day];
        const next: OnboardingProgress = {
          ...prev,
          completedDays,
          isOnboarded:
            completedDays.length >= TOTAL_DAYS || prev.isOnboarded,
          currentDay: Math.min(
            TOTAL_DAYS,
            completedDays.length + 1
          ),
        };
        saveProgress(next);
        return next;
      });
    },
    [saveProgress]
  );

  const skipOnboarding = useCallback(() => {
    saveProgress({
      isOnboarded: true,
      completedDays: progress.completedDays,
      currentDay: progress.currentDay,
      startedAt: progress.startedAt,
    });
  }, [progress, saveProgress]);

  const isDayCompleted = useCallback(
    (day: number) => progress.completedDays.includes(day),
    [progress.completedDays]
  );

  const completionPercentage = Math.round(
    (progress.completedDays.length / TOTAL_DAYS) * 100
  );

  const todayContent = useMemo(() => {
    const content = onboardingContent.find(
      (c) => c.day === progress.currentDay
    );
    return content ?? onboardingContent[0];
  }, [progress.currentDay]);

  return {
    progress,
    todayContent,
    completeDay,
    skipOnboarding,
    isDayCompleted,
    completionPercentage,
  };
}