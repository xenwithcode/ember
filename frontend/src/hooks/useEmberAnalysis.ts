// frontend/src/hooks/useEmberAnalysis.ts

import { useMemo } from "react";

export interface EmberState {
  intensity: number; // 0-100 (how bright the ember burns)
  dominantEmotion: EmotionKey;
  emotionScores: Record<EmotionKey, number>;
  wordCount: number;
  writingTimeSeconds: number;
  isDeepening: boolean; // true if user is writing deeply
}

export type EmotionKey =
  | "joy"
  | "sadness"
  | "anxiety"
  | "anger"
  | "hope"
  | "calm"
  | "neutral";

// Emotional keyword dictionaries with weights
const emotionDictionary: Record<EmotionKey, string[]> = {
  joy: [
    "happy", "excited", "grateful", "proud", "amazing", "wonderful",
    "joy", "delighted", "thrilled", "love", "celebrate", "accomplished",
    "success", "beautiful", "blessed", "content", "elated",
  ],
  sadness: [
    "sad", "lonely", "empty", "lost", "miss", "grief", "heartbroken",
    "tears", "cry", "hurt", "alone", "disappointed", "broken",
    "hopeless", "despair", "mourning",
  ],
  anxiety: [
    "anxious", "worried", "nervous", "scared", "fear", "overwhelmed",
    "stressed", "panic", "dread", "uncertain", "restless", "tense",
    "racing", "can't sleep", "spiraling",
  ],
  anger: [
    "angry", "frustrated", "annoyed", "irritated", "mad", "furious",
    "rage", "resentment", "unfair", "hate", "bitter",
  ],
  hope: [
    "hope", "maybe", "try", "learn", "grow", "believe", "faith",
    "possibility", "curious", "looking forward", "dream", "wish",
  ],
  calm: [
    "peace", "calm", "quiet", "still", "gentle", "soft", "breathe",
    "slow", "rest", "okay", "enough", "accept",
  ],
  neutral: [],
};

// Depth indicators (words that suggest deep introspection)
const depthIndicators = [
  "because", "realize", "understand", "feel like", "actually",
  "truth", "honestly", "deep down", "always", "never",
  "pattern", "again", "every time", "reminds me",
  "childhood", "remember", "always been",
];

export function useEmberAnalysis(
  text: string,
  startTime: number | null
): EmberState {
  return useMemo(() => {
    const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0;
    const textLower = text.toLowerCase();
    const words = textLower.split(/\s+/);

    // Calculate emotion scores
    const emotionScores: Record<EmotionKey, number> = {
      joy: 0,
      sadness: 0,
      anxiety: 0,
      anger: 0,
      hope: 0,
      calm: 0,
      neutral: 0,
    };

    (Object.keys(emotionDictionary) as EmotionKey[]).forEach((emotion) => {
      const keywords = emotionDictionary[emotion];
      let score = 0;
      keywords.forEach((keyword) => {
        // Count occurrences, including as part of phrases
        const regex = new RegExp(`\\b${keyword}\\b`, "gi");
        const matches = textLower.match(regex);
        if (matches) {
          score += matches.length;
        }
      });
      emotionScores[emotion] = score;
    });

    // Find dominant emotion
    let dominantEmotion: EmotionKey = "neutral";
    let maxScore = 0;
    (Object.keys(emotionScores) as EmotionKey[]).forEach((emotion) => {
      if (emotionScores[emotion] > maxScore) {
        maxScore = emotionScores[emotion];
        dominantEmotion = emotion;
      }
    });

    // Calculate depth (how introspective the writing is)
    const depthScore = depthIndicators.reduce((score, indicator) => {
      return score + (textLower.includes(indicator) ? 1 : 0);
    }, 0);
    const isDeepening = depthScore >= 2 && wordCount > 30;

    // Calculate intensity (0-100)
    // Factors: word count, depth, emotion presence
    const wordIntensity = Math.min(wordCount / 2, 50); // up to 50 from words
    const emotionIntensity = maxScore * 8; // up to ~40 from emotions
    const depthIntensity = depthScore * 5; // up to ~25 from depth
    const rawIntensity = wordIntensity + emotionIntensity + depthIntensity;
    const intensity = Math.min(Math.round(rawIntensity), 100);

    // Writing time
    const writingTimeSeconds = startTime
      ? Math.floor((Date.now() - startTime) / 1000)
      : 0;

    return {
      intensity,
      dominantEmotion,
      emotionScores,
      wordCount,
      writingTimeSeconds,
      isDeepening,
    };
  }, [text, startTime]);
}

// Color mapping for emotions
export const emotionColors: Record<EmotionKey, string> = {
  joy: "#F59E0B", // amber
  sadness: "#3B82F6", // blue
  anxiety: "#A855F7", // purple
  anger: "#DC2626", // red
  hope: "#10B981", // emerald
  calm: "#0891B2", // cyan
  neutral: "#E28766", // terracotta (default)
};

export const emotionLabels: Record<EmotionKey, string> = {
  joy: "Joy",
  sadness: "Sadness",
  anxiety: "Anxiety",
  anger: "Anger",
  hope: "Hope",
  calm: "Calm",
  neutral: "Reflection",
};