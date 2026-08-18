// frontend/src/hooks/useJournalStorage.ts

import { useState, useEffect, useCallback } from "react";
import { Ritual } from "@/data/rituals";
import { EmotionKey } from "./useEmberAnalysis";

export interface JournalEntry {
  id: string;
  text: string;
  ritualId: string;
  ritualName: string;
  ritualEmoji: string;
  date: string; // ISO date (YYYY-MM-DD)
  timestamp: number; // Unix timestamp for sorting
  wordCount: number;
  writingTimeSeconds: number;
  dominantEmotion: EmotionKey;
  emotionScores: Record<EmotionKey, number>;
  intensity: number; // 0-100 (depth of introspection)
  agentResponse?: string;
  agentEmotions?: string[];
  sparkChallengeId?: string;
  hasReflection?: boolean;
  privacyInfo?: {
    piiRedacted: number;
    moodDetected: string;
    moodScore: number;
    processingTimeMs: number;
  };
}

const STORAGE_KEY = "ember_journal_entries";

export function useJournalStorage() {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as JournalEntry[];
        // Sort by timestamp descending (newest first)
        setEntries(parsed.sort((a, b) => b.timestamp - a.timestamp));
      }
    } catch (error) {
      console.error("Failed to load journal entries:", error);
    }
    setIsLoaded(true);
  }, []);

  // Save to localStorage whenever entries change
  const saveEntries = useCallback((newEntries: JournalEntry[]) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newEntries));
    } catch (error) {
      console.error("Failed to save journal entries:", error);
    }
  }, []);

  // Add a new entry
  const addEntry = useCallback(
    (
      entry: Omit<
        JournalEntry,
        "id" | "timestamp" | "date" | "ritualId" | "ritualName" | "ritualEmoji"
      > & {
        ritual: Ritual;
      }
    ) => {
      const newEntry: JournalEntry = {
        id: `entry_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`,
        timestamp: Date.now(),
        date: new Date().toISOString().split("T")[0],
        ritualId: entry.ritual.id,
        ritualName: entry.ritual.name,
        ritualEmoji: entry.ritual.emoji,
        text: entry.text,
        wordCount: entry.wordCount,
        writingTimeSeconds: entry.writingTimeSeconds,
        dominantEmotion: entry.dominantEmotion,
        emotionScores: entry.emotionScores,
        intensity: entry.intensity,
        agentResponse: entry.agentResponse,
        agentEmotions: entry.agentEmotions,
        privacyInfo: entry.privacyInfo,
      };

      setEntries((prev) => {
        const updated = [newEntry, ...prev];
        saveEntries(updated);
        return updated;
      });

      return newEntry;
    },
    [saveEntries]
  );

  // Update an existing entry (e.g., add agent response or reflection)
  const updateEntry = useCallback(
    (entryId: string, updates: Partial<JournalEntry>) => {
      setEntries((prev) => {
        const updated = prev.map((entry) =>
          entry.id === entryId ? { ...entry, ...updates } : entry
        );
        saveEntries(updated);
        return updated;
      });
    },
    [saveEntries]
  );

  // Delete an entry
  const deleteEntry = useCallback(
    (entryId: string) => {
      setEntries((prev) => {
        const updated = prev.filter((entry) => entry.id !== entryId);
        saveEntries(updated);
        return updated;
      });
    },
    [saveEntries]
  );

  // Get entries for a specific date
  const getEntriesByDate = useCallback(
    (date: string) => {
      return entries.filter((entry) => entry.date === date);
    },
    [entries]
  );

  // Get entries for a specific month (YYYY-MM)
  const getEntriesByMonth = useCallback(
    (yearMonth: string) => {
      return entries.filter((entry) => entry.date.startsWith(yearMonth));
    },
    [entries]
  );

  // Get stats
  const stats = {
    totalEntries: entries.length,
    totalWords: entries.reduce((sum, e) => sum + e.wordCount, 0),
    totalWritingMinutes: Math.round(
      entries.reduce((sum, e) => sum + e.writingTimeSeconds, 0) / 60
    ),
    currentStreak: calculateStreak(entries),
    longestStreak: calculateLongestStreak(entries),
    uniqueRituals: new Set(entries.map((e) => e.ritualId)).size,
    daysWritten: new Set(entries.map((e) => e.date)).size,
  };

  return {
    entries,
    isLoaded,
    addEntry,
    updateEntry,
    deleteEntry,
    getEntriesByDate,
    getEntriesByMonth,
    stats,
  };
}

// Calculate current consecutive writing streak
function calculateStreak(entries: JournalEntry[]): number {
  if (entries.length === 0) return 0;

  const dates = new Set(entries.map((e) => e.date));
  let streak = 0;
  const today = new Date();

  // Check if wrote today
  const todayStr = today.toISOString().split("T")[0];
  if (!dates.has(todayStr)) {
    // Check yesterday instead
    today.setDate(today.getDate() - 1);
  }

  // Count backwards
  while (true) {
    const dateStr = today.toISOString().split("T")[0];
    if (dates.has(dateStr)) {
      streak++;
      today.setDate(today.getDate() - 1);
    } else {
      break;
    }
  }

  return streak;
}

function calculateLongestStreak(entries: JournalEntry[]): number {
  if (entries.length === 0) return 0;

  const sortedDates = Array.from(new Set(entries.map((e) => e.date))).sort();
  let longestStreak = 1;
  let currentStreak = 1;

  for (let i = 1; i < sortedDates.length; i++) {
    const prev = new Date(sortedDates[i - 1]);
    const curr = new Date(sortedDates[i]);
    const diffDays =
      (curr.getTime() - prev.getTime()) / (1000 * 60 * 60 * 24);

    if (diffDays === 1) {
      currentStreak++;
      longestStreak = Math.max(longestStreak, currentStreak);
    } else {
      currentStreak = 1;
    }
  }

  return longestStreak;
}