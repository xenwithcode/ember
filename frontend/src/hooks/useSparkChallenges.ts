// frontend/src/hooks/useSparkChallenges.ts

import { useState, useEffect, useCallback } from "react";
import {
  SparkChallengeTemplate,
  getRandomChallenge,
  ChallengeCategory,
} from "@/data/sparkChallenges";
import { DetectedPattern } from "./usePatternDetection";

export interface SparkChallenge {
  id: string;
  template: SparkChallengeTemplate;
  patternId: string;
  patternDescription: string;
  status: "suggested" | "accepted" | "completed" | "skipped";
  createdAt: number;
  acceptedAt?: number;
  completedAt?: number;
  completionNote?: string;
}

const STORAGE_KEY = "ember_spark_challenges";

export function useSparkChallenges() {
  const [challenges, setChallenges] = useState<SparkChallenge[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setChallenges(JSON.parse(stored));
      }
    } catch (error) {
      console.error("Failed to load spark challenges:", error);
    }
    setIsLoaded(true);
  }, []);

  // Save to localStorage
  const saveChallenges = useCallback((newChallenges: SparkChallenge[]) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newChallenges));
    } catch (error) {
      console.error("Failed to save spark challenges:", error);
    }
  }, []);

  // Generate a challenge from a detected pattern
  const generateChallenge = useCallback(
    (pattern: DetectedPattern): SparkChallenge | null => {
      const template = getRandomChallenge(pattern.suggestedCategory);
      if (!template) return null;

      // Check if we already have a challenge for this pattern
      const existing = challenges.find(
        (c) => c.patternId === pattern.id && c.status !== "skipped"
      );
      if (existing) return null;

      const newChallenge: SparkChallenge = {
        id: `spark_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`,
        template,
        patternId: pattern.id,
        patternDescription: pattern.description,
        status: "suggested",
        createdAt: Date.now(),
      };

      setChallenges((prev) => {
        const updated = [newChallenge, ...prev];
        saveChallenges(updated);
        return updated;
      });

      return newChallenge;
    },
    [challenges, saveChallenges]
  );

  // Accept a challenge
  const acceptChallenge = useCallback(
    (challengeId: string) => {
      setChallenges((prev) => {
        const updated = prev.map((c) =>
          c.id === challengeId
            ? { ...c, status: "accepted" as const, acceptedAt: Date.now() }
            : c
        );
        saveChallenges(updated);
        return updated;
      });
    },
    [saveChallenges]
  );

  // Complete a challenge
  const completeChallenge = useCallback(
    (challengeId: string, note?: string) => {
      setChallenges((prev) => {
        const updated = prev.map((c) =>
          c.id === challengeId
            ? {
                ...c,
                status: "completed" as const,
                completedAt: Date.now(),
                completionNote: note,
              }
            : c
        );
        saveChallenges(updated);
        return updated;
      });
    },
    [saveChallenges]
  );

  // Skip a challenge
  const skipChallenge = useCallback(
    (challengeId: string) => {
      setChallenges((prev) => {
        const updated = prev.map((c) =>
          c.id === challengeId ? { ...c, status: "skipped" as const } : c
        );
        saveChallenges(updated);
        return updated;
      });
    },
    [saveChallenges]
  );

  // Get active challenges (suggested or accepted)
  const activeChallenges = challenges.filter(
    (c) => c.status === "suggested" || c.status === "accepted"
  );

  // Get completed challenges
  const completedChallenges = challenges.filter((c) => c.status === "completed");

  // Stats
  const stats = {
    totalGenerated: challenges.length,
    totalAccepted: challenges.filter((c) => c.status === "accepted" || c.status === "completed").length,
    totalCompleted: completedChallenges.length,
    completionRate:
      challenges.length > 0
        ? Math.round(
            (completedChallenges.length /
              challenges.filter((c) => c.status !== "suggested").length) * 100
          )
        : 0,
  };

  return {
    challenges,
    isLoaded,
    generateChallenge,
    acceptChallenge,
    completeChallenge,
    skipChallenge,
    activeChallenges,
    completedChallenges,
    stats,
  };
}