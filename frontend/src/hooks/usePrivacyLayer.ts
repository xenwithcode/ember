// frontend/src/hooks/usePrivacyLayer.ts
import { useState, useCallback } from "react";

export interface PrivacyCheckResult {
  anonymizedText: string;
  piiRedacted: number;
  moodDetected: string;
  moodScore: number;
  crisisDetected: boolean;
  crisisAlert: string | null;
  processingTimeMs: number;
  shieldActive: boolean;
}

/**
 * Privacy Shield hook — calls the backend Privacy Layer
 * (Gemma 4 via Vertex AI). Never blocks the user: if the
 * service is unreachable, the text passes through untouched
 * and the shield is simply hidden.
 */
export function usePrivacyLayer() {
  const [isChecking, setIsChecking] = useState(false);
  const [lastResult, setLastResult] = useState<PrivacyCheckResult | null>(null);

  const checkPrivacy = useCallback(
    async (text: string): Promise<PrivacyCheckResult | null> => {
      setIsChecking(true);
      try {
        const response = await fetch("/api/privacy/process", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text }),
        });

        if (!response.ok) throw new Error("Privacy check failed");

        const data = await response.json();
        const result: PrivacyCheckResult = {
          anonymizedText: data.anonymized_text || text,
          piiRedacted: data.detected_pii?.length || 0,
          moodDetected: data.mood_label || "neutral",
          moodScore: data.mood_score || 0,
          crisisDetected: data.crisis_detected || false,
          crisisAlert: data.safety_alert || null,
          processingTimeMs: data.processing_time_ms || 0,
          shieldActive: true,
        };

        setLastResult(result);
        return result;
      } catch (error) {
        console.warn(
          "Privacy Layer unavailable (showing without shield):",
          error
        );
        // Fallback: pass through without privacy processing
        const fallback: PrivacyCheckResult = {
          anonymizedText: text,
          piiRedacted: 0,
          moodDetected: "neutral",
          moodScore: 0,
          crisisDetected: false,
          crisisAlert: null,
          processingTimeMs: 0,
          shieldActive: false,
        };
        setLastResult(fallback);
        return fallback;
      } finally {
        setIsChecking(false);
      }
    },
    []
  );

  return { checkPrivacy, isChecking, lastResult };
}