// frontend/src/lib/journalApi.ts
// Thin client for the backend Journal + Chat APIs (proxied via /api).

export interface SavedJournalEntry {
  id?: string;
  text: string;
  timestamp: number;
  dominant_emotion?: string;
  privacy_info?: Record<string, unknown>;
}

export interface AgentJournalResult {
  response: string;
  sessionId: string;
  anonymizedText: string;
  entry: SavedJournalEntry | null;
  crisisAlert: string | null;
  skipAgent: boolean;
  resources: { name: string; contact: string }[];
  privacyInfo: {
    shieldActive: boolean;
    piiRedacted: number;
    moodDetected: string;
    moodScore: number;
    processingTimeMs: number;
    crisisDetected: boolean;
  };
}

export interface JournalSubmitPayload {
  message: string;
  user_id: string;
  session_id?: string | null;
  ritual_id?: string;
  ritual_name?: string;
  ritual_emoji?: string;
  word_count?: number;
  writing_time_seconds?: number;
  dominant_emotion?: string;
  emotion_scores?: Record<string, number>;
  intensity?: number;
}

/**
 * Full journal flow in one call: Privacy Shield (Gemma) → Memory Block →
 * Coach agent (Gemini) → entry persisted in Firestore.
 * Returns null if the backend is unreachable (caller falls back locally).
 */
export async function submitJournalEntry(
  payload: JournalSubmitPayload
): Promise<AgentJournalResult | null> {
  try {
    const response = await fetch("/api/chat/journal", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      console.warn("Agent journal call failed:", response.status);
      return null;
    }

    const data = await response.json();
    return {
      response: data.response || "",
      sessionId: data.session_id,
      anonymizedText: data.anonymized_text || payload.message,
      entry: data.entry || null,
      crisisAlert: data.crisis_alert || null,
      skipAgent: !!data.skip_agent,
      resources: data.resources || [],
      privacyInfo: {
        shieldActive: data.privacy_info?.shield_active ?? false,
        piiRedacted: data.privacy_info?.pii_redacted ?? 0,
        moodDetected: data.privacy_info?.mood_detected ?? "neutral",
        moodScore: data.privacy_info?.mood_score ?? 0,
        processingTimeMs: data.privacy_info?.processing_time_ms ?? 0,
        crisisDetected: !!data.crisis_alert,
      },
    };
  } catch (error) {
    console.warn("Agent journal call failed (backend unreachable):", error);
    return null;
  }
}

// Stable ids (per browser) for user + ADK conversation session.
// SSR-safe: during prerendering (no window) return fixed placeholders.
export function getOrCreateUserId(): string {
  if (typeof window === "undefined") return "default_user";
  const key = "ember_user_id";
  let id = localStorage.getItem(key);
  if (!id) {
    id = `user_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`;
    localStorage.setItem(key, id);
  }
  return id;
}

export function getOrCreateSessionId(): string {
  if (typeof window === "undefined") return "default_session";
  const key = "ember_session_id";
  let id = localStorage.getItem(key);
  if (!id) {
    id = `session_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`;
    localStorage.setItem(key, id);
  }
  return id;
}
