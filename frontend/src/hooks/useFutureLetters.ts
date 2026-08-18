// frontend/src/hooks/useFutureLetters.ts

import { useState, useEffect, useCallback } from "react";
import { DeliveryTimeframe } from "@/data/letterPrompts";

export interface FutureLetter {
  id: string;
  // Content
  fullText: string;
  answers: Record<string, string>;
  timeframeId: string;
  timeframeLabel: string;

  // Dates
  writtenAt: number; // timestamp
  deliveryDate: string; // ISO date (YYYY-MM-DD)
  deliveredAt?: number;
  reflectedAt?: number;

  // Status
  status: "sealed" | "ready" | "delivered" | "reflected";

  // Reflection (filled after delivery)
  realityResponse?: string;
  predictionAccuracy?: "accurate" | "partially" | "wrong" | "better";
  moodAtDelivery?: string;
  insight?: string;

  // Metadata
  wordCount: number;
  dominantEmotionAtWriting?: string;
}

const STORAGE_KEY = "ember_future_letters";

export function useFutureLetters() {
  const [letters, setLetters] = useState<FutureLetter[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as FutureLetter[];

        // Check if any sealed letters are now ready for delivery
        const today = new Date().toISOString().split("T")[0];
        const updated = parsed.map((letter) => {
          if (letter.status === "sealed" && letter.deliveryDate <= today) {
            return { ...letter, status: "ready" as const };
          }
          return letter;
        });

        setLetters(updated.sort((a, b) => b.writtenAt - a.writtenAt));
        saveLetters(updated);
      }
    } catch (error) {
      console.error("Failed to load letters:", error);
    }
    setIsLoaded(true);
  }, []);

  // Save to localStorage
  const saveLetters = useCallback((newLetters: FutureLetter[]) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newLetters));
    } catch (error) {
      console.error("Failed to save letters:", error);
    }
  }, []);

  // Write and seal a new letter
  const sealLetter = useCallback(
    (
      fullText: string,
      answers: Record<string, string>,
      timeframe: DeliveryTimeframe,
      dominantEmotion?: string
    ): FutureLetter => {
      const deliveryDate = new Date();
      deliveryDate.setDate(deliveryDate.getDate() + timeframe.days);

      const newLetter: FutureLetter = {
        id: `letter_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`,
        fullText,
        answers,
        timeframeId: timeframe.id,
        timeframeLabel: timeframe.label,
        writtenAt: Date.now(),
        deliveryDate: deliveryDate.toISOString().split("T")[0],
        status: "sealed",
        wordCount: fullText.trim().split(/\s+/).length,
        dominantEmotionAtWriting: dominantEmotion,
      };

      setLetters((prev) => {
        const updated = [newLetter, ...prev];
        saveLetters(updated);
        return updated;
      });

      return newLetter;
    },
    [saveLetters]
  );

  // Deliver a letter (mark as delivered and add reflection)
  const deliverLetter = useCallback(
    (
      letterId: string,
      realityResponse: string,
      predictionAccuracy: FutureLetter["predictionAccuracy"],
      moodAtDelivery: string
    ) => {
      setLetters((prev) => {
        const updated = prev.map((letter) =>
          letter.id === letterId
            ? {
                ...letter,
                status: "reflected" as const,
                deliveredAt: Date.now(),
                reflectedAt: Date.now(),
                realityResponse,
                predictionAccuracy,
                moodAtDelivery,
              }
            : letter
        );
        saveLetters(updated);
        return updated;
      });
    },
    [saveLetters]
  );

  // Get letters ready for delivery
  const readyLetters = letters.filter((l) => l.status === "ready");

  // Get sealed letters (waiting)
  const sealedLetters = letters.filter((l) => l.status === "sealed");

  // Get reflected letters (completed)
  const reflectedLetters = letters.filter((l) => l.status === "reflected");

  // Calculate prediction accuracy stats
  const predictionStats = {
    totalReflected: reflectedLetters.length,
    accurateCount: reflectedLetters.filter(
      (l) => l.predictionAccuracy === "accurate"
    ).length,
    wrongCount: reflectedLetters.filter(
      (l) => l.predictionAccuracy === "wrong"
    ).length,
    betterCount: reflectedLetters.filter(
      (l) => l.predictionAccuracy === "better"
    ).length,
    partiallyCount: reflectedLetters.filter(
      (l) => l.predictionAccuracy === "partially"
    ).length,
    // The key insight: what % of feared predictions didn't come true
    fearNotRealizedRate:
      reflectedLetters.length > 0
        ? Math.round(
            ((reflectedLetters.filter(
              (l) =>
                l.predictionAccuracy === "wrong" ||
                l.predictionAccuracy === "better"
            ).length /
              reflectedLetters.length) *
              100)
          )
        : 0,
  };

  // Stats
  const stats = {
    totalLetters: letters.length,
    sealedCount: sealedLetters.length,
    readyCount: readyLetters.length,
    reflectedCount: reflectedLetters.length,
    totalWords: letters.reduce((sum, l) => sum + l.wordCount, 0),
    predictionStats,
  };

  return {
    letters,
    isLoaded,
    sealLetter,
    deliverLetter,
    readyLetters,
    sealedLetters,
    reflectedLetters,
    stats,
  };
}