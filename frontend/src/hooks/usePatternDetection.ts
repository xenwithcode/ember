// frontend/src/hooks/usePatternDetection.ts

import { useMemo } from "react";
import { JournalEntry } from "./useJournalStorage";
import { EmotionKey } from "./useEmberAnalysis";
import { ChallengeCategory } from "@/data/sparkChallenges";

export interface DetectedPattern {
  id: string;
  type: "emotion" | "theme" | "timing";
  description: string;
  confidence: number; // 0-100
  suggestedCategory: ChallengeCategory;
  evidence: string[]; // Sample phrases from entries
  firstDetected: number; // timestamp
}

// Keywords that map to challenge categories
const categoryKeywords: Record<ChallengeCategory, string[]> = {
  anxiety: [
    "anxious", "anxiety", "worried", "worry", "nervous", "panic",
    "overwhelmed", "stressed", "stress", "can't sleep", "racing thoughts",
  ],
  comparison: [
    "compare", "comparing", "behind", "everyone else", "they have",
    "they got", "better than", "not as good", "jealous", "envy",
    "linkedin", "instagram", "social media",
  ],
  isolation: [
    "lonely", "alone", "isolated", "no friends", "no one", "disconnected",
    "haven't talked", "nobody", "by myself",
  ],
  perfectionism: [
    "perfect", "perfectionist", "not good enough", "failure", "fail",
    "imposter", "fraud", "should have", "must", "have to be",
  ],
  procrastination: [
    "procrastinate", "procrastinating", "put off", "delay", "avoid",
    "can't start", "stuck", "later",
  ],
  "self-care": [
    "exhausted", "burnout", "burned out", "tired", "no energy",
    "running on empty", "overworked",
  ],
  creativity: [
    "create", "creative", "art", "draw", "paint", "write", "music",
    "make", "build", "design",
  ],
  connection: [
    "friend", "friends", "connect", "connection", "belong", "community",
    "people", "relationship",
  ],
};

// Timing patterns (day of week → emotional association)
const dayNames = [
  "sunday", "monday", "tuesday", "wednesday", "thursday",
  "friday", "saturday",
];

export function usePatternDetection(entries: JournalEntry[]) {
  return useMemo(() => {
    if (entries.length < 3) {
      return { patterns: [], hasEnoughData: false };
    }

    const patterns: DetectedPattern[] = [];
    const recentEntries = entries.slice(0, 10); // Analyze last 10 entries

    // === 1. Detect emotion recurrence ===
    const emotionCounts: Record<EmotionKey, number> = {
      joy: 0, sadness: 0, anxiety: 0, anger: 0, hope: 0, calm: 0, neutral: 0,
    };

    recentEntries.forEach((entry) => {
      emotionCounts[entry.dominantEmotion]++;
    });

    // Flag emotions that appear 3+ times
    (Object.keys(emotionCounts) as EmotionKey[]).forEach((emotion) => {
      const count = emotionCounts[emotion];
      if (count >= 3 && emotion !== "neutral" && emotion !== "calm" && emotion !== "joy") {
        const categoryMap: Record<EmotionKey, ChallengeCategory> = {
          anxiety: "anxiety",
          sadness: "self-care",
          anger: "self-care",
          hope: "creativity",
          joy: "creativity",
          calm: "self-care",
          neutral: "self-care",
        };

        patterns.push({
          id: `pattern_emotion_${emotion}`,
          type: "emotion",
          description: `You've been feeling ${emotion} in ${count} of your last ${recentEntries.length} entries.`,
          confidence: Math.min(count * 25, 90),
          suggestedCategory: categoryMap[emotion],
          evidence: recentEntries
            .filter((e) => e.dominantEmotion === emotion)
            .slice(0, 2)
            .map((e) => e.text.substring(0, 80) + "..."),
          firstDetected: Date.now(),
        });
      }
    });

    // === 2. Detect theme recurrence (keyword analysis) ===
    const allText = recentEntries.map((e) => e.text.toLowerCase()).join(" ");

    (Object.keys(categoryKeywords) as ChallengeCategory[]).forEach((category) => {
      const keywords = categoryKeywords[category];
      let matchCount = 0;
      const matchedPhrases: string[] = [];

      keywords.forEach((keyword) => {
        const regex = new RegExp(`\\b${keyword}\\b`, "gi");
        const matches = allText.match(regex);
        if (matches) {
          matchCount += matches.length;
          if (matches.length >= 2) {
            matchedPhrases.push(keyword);
          }
        }
      });

      if (matchCount >= 4) {
        patterns.push({
          id: `pattern_theme_${category}`,
          type: "theme",
          description: `The theme of ${category} appears ${matchCount} times across your recent entries.`,
          confidence: Math.min(matchCount * 15, 85),
          suggestedCategory: category,
          evidence: matchedPhrases.slice(0, 3),
          firstDetected: Date.now(),
        });
      }
    });

    // === 3. Detect timing patterns ===
    const entriesByDayOfWeek: Record<number, JournalEntry[]> = {};
    recentEntries.forEach((entry) => {
      const day = new Date(entry.timestamp).getDay();
      if (!entriesByDayOfWeek[day]) entriesByDayOfWeek[day] = [];
      entriesByDayOfWeek[day].push(entry);
    });

    // Check if a specific day has predominantly negative emotions
    Object.entries(entriesByDayOfWeek).forEach(([dayStr, dayEntries]) => {
      if (dayEntries.length >= 2) {
        const negativeEmotions = dayEntries.filter(
          (e) =>
            e.dominantEmotion === "anxiety" ||
            e.dominantEmotion === "sadness" ||
            e.dominantEmotion === "anger"
        );

        if (negativeEmotions.length >= 2 && negativeEmotions.length === dayEntries.length) {
          const dayName = dayNames[parseInt(dayStr)];
          patterns.push({
            id: `pattern_timing_${dayName}`,
            type: "timing",
            description: `Your entries on ${dayName}s consistently show difficult emotions. There might be something about this day.`,
            confidence: 70,
            suggestedCategory: "anxiety",
            evidence: [`${dayName} appears to be a trigger day`],
            firstDetected: Date.now(),
          });
        }
      }
    });

    // Sort by confidence (highest first)
    patterns.sort((a, b) => b.confidence - a.confidence);

    return {
      patterns: patterns.slice(0, 3), // Return top 3 patterns
      hasEnoughData: entries.length >= 3,
    };
  }, [entries]);
}