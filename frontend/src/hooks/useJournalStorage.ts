// frontend/src/hooks/useJournalStorage.ts

import { useState, useEffect, useCallback } from "react";
import { Ritual } from "@/data/rituals";
import { EmotionKey } from "./useEmberAnalysis";
import { getOrCreateUserId } from "@/lib/journalApi";

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

// ---------------------------------------------------------------------------
// Firestore sync helpers (snake_case <-> camelCase mapping)
// ---------------------------------------------------------------------------

interface ApiEntry {
  id?: string;
  timestamp?: number;
  user_id?: string;
  text: string;
  ritual_id?: string;
  ritual_name?: string;
  ritual_emoji?: string;
  date?: string;
  word_count?: number;
  writing_time_seconds?: number;
  dominant_emotion?: string;
  emotion_scores?: Record<string, number>;
  intensity?: number;
  agent_response?: string;
  agent_emotions?: string[];
  spark_challenge_id?: string;
  privacy_info?: {
    pii_redacted?: number;
    mood_detected?: string;
    mood_score?: number;
    processing_time_ms?: number;
  };
}

function toApi(entry: JournalEntry): ApiEntry {
  return {
    id: entry.id,
    timestamp: entry.timestamp,
    text: entry.text,
    ritual_id: entry.ritualId,
    ritual_name: entry.ritualName,
    ritual_emoji: entry.ritualEmoji,
    date: entry.date,
    word_count: entry.wordCount,
    writing_time_seconds: entry.writingTimeSeconds,
    dominant_emotion: entry.dominantEmotion,
    emotion_scores: entry.emotionScores,
    intensity: entry.intensity,
    agent_response: entry.agentResponse,
    agent_emotions: entry.agentEmotions,
    spark_challenge_id: entry.sparkChallengeId,
    privacy_info: entry.privacyInfo
      ? {
          pii_redacted: entry.privacyInfo.piiRedacted,
          mood_detected: entry.privacyInfo.moodDetected,
          mood_score: entry.privacyInfo.moodScore,
          processing_time_ms: entry.privacyInfo.processingTimeMs,
        }
      : undefined,
  };
}

function fromApi(data: ApiEntry): JournalEntry {
  return {
    id: data.id || "",
    text: data.text,
    ritualId: data.ritual_id || "",
    ritualName: data.ritual_name || "",
    ritualEmoji: data.ritual_emoji || "",
    date: data.date || new Date().toISOString().split("T")[0],
    timestamp: data.timestamp || Date.now(),
    wordCount: data.word_count || 0,
    writingTimeSeconds: data.writing_time_seconds || 0,
    dominantEmotion: (data.dominant_emotion as EmotionKey) || "reflection",
    emotionScores: (data.emotion_scores as Record<EmotionKey, number>) || {},
    intensity: data.intensity || 0,
    agentResponse: data.agent_response,
    agentEmotions: data.agent_emotions,
    sparkChallengeId: data.spark_challenge_id,
    privacyInfo: data.privacy_info
      ? {
          piiRedacted: data.privacy_info.pii_redacted ?? 0,
          moodDetected: data.privacy_info.mood_detected || "neutral",
          moodScore: data.privacy_info.mood_score ?? 0,
          processingTimeMs: data.privacy_info.processing_time_ms ?? 0,
        }
      : undefined,
  };
}

export function useJournalStorage() {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const userId = getOrCreateUserId();

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

  // Sync with Firestore (Memory Bank): server is the source of truth.
  // Local-only entries (e.g. written offline) are migrated up.
  useEffect(() => {
    if (!isLoaded) return;
    (async () => {
      try {
        setIsSyncing(true);
        const response = await fetch(
          `/api/journal/entries?user_id=${encodeURIComponent(userId)}&limit=500`
        );
        if (!response.ok) return;
        const serverEntries: ApiEntry[] = await response.json();

        if (serverEntries.length > 0) {
          setEntries((prev) => {
            const merged = serverEntries.map(fromApi).sort(
              (a, b) => b.timestamp - a.timestamp
            );
            save(merged);
            return merged;
          });
        } else {
          // No server history yet — push any local entries (migration).
          setEntries((prev) => {
            if (prev.length > 0) {
              prev.forEach((entry) =>
                fetch("/api/journal/entries", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ user_id: userId, ...toApi(entry) }),
                }).catch(() => {})
              );
            }
            return prev;
          });
        }
      } catch (error) {
        console.warn("Journal sync unavailable (offline mode):", error);
      } finally {
        setIsSyncing(false);
      }
    })();
  }, [isLoaded, userId]);

  // Save to localStorage whenever entries change
  const saveEntries = useCallback((newEntries: JournalEntry[]) => {
    save(newEntries);
  }, []);

  // Add a new entry
  const addEntry = useCallback(
    (
      entry: Omit<
        JournalEntry,
        "id" | "timestamp" | "date" | "ritualId" | "ritualName" | "ritualEmoji"
      > & {
        ritual: Ritual;
      },
      skipServerSave?: boolean,
      idOverride?: string
    ) => {
      const newEntry: JournalEntry = {
        id: idOverride || `entry_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`,
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

      // Persist to Firestore (Memory Bank). When the entry already comes
      // from the agent flow (skipServerSave), it was saved by the backend.
      if (!skipServerSave) {
        fetch("/api/journal/entries", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ user_id: userId, ...toApi(newEntry) }),
        })
          .then((res) => {
            if (!res.ok) throw new Error(`Server save failed: ${res.status}`);
            return res.json();
          })
          .then((saved: ApiEntry) => {
            // Use the server's id so future deletes target the right doc.
            if (saved?.id && saved.id !== newEntry.id) {
              setEntries((prev) => {
                const updated = prev.map((e) =>
                  e.id === newEntry.id ? { ...e, id: saved.id! } : e
                );
                save(updated);
                return updated;
              });
            }
          })
          .catch((error) =>
            console.warn("Entry saved locally only (offline):", error)
          );
      }

      setEntries((prev) => {
        const updated = [newEntry, ...prev];
        saveEntries(updated);
        return updated;
      });

      return newEntry;
    },
    [saveEntries, userId]
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
      fetch(
        `/api/journal/entries/${encodeURIComponent(
          entryId
        )}?user_id=${encodeURIComponent(userId)}`,
        { method: "DELETE" }
      ).catch((error) => console.warn("Server delete failed:", error));
    },
    [saveEntries, userId]
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
    isSyncing,
    userId,
    addEntry,
    updateEntry,
    deleteEntry,
    getEntriesByDate,
    getEntriesByMonth,
    stats,
  };
}

// Persist a snapshot to localStorage
function save(newEntries: JournalEntry[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newEntries));
  } catch (error) {
    console.error("Failed to save journal entries:", error);
  }
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