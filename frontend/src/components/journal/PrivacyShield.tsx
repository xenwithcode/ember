// frontend/src/components/journal/PrivacyShield.tsx
"use client";

import { Shield, Check, AlertTriangle, Zap, Clock } from "lucide-react";

export interface PrivacyInfo {
  piiRedacted: number;
  moodDetected: string;
  moodScore: number;
  shieldActive: boolean;
  processingTimeMs?: number;
  crisisAlert?: string | null;
}

interface PrivacyShieldProps {
  info: PrivacyInfo;
  onDismissCrisis?: () => void;
}

export default function PrivacyShield({
  info,
  onDismissCrisis,
}: PrivacyShieldProps) {
  if (!info.shieldActive && !info.crisisAlert) return null;

  // Crisis alert takes priority
  if (info.crisisAlert) {
    return (
      <div className="bg-red-50 border-2 border-red-300 rounded-xl p-5 mb-4 animate-fade-in shadow-warm">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center shrink-0 animate-pulse">
            <AlertTriangle className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1">
            <h4 className="font-semibold text-red-900 text-sm mb-2">
              🚨 We detected something serious
            </h4>
            <p className="text-sm text-red-800 leading-relaxed whitespace-pre-line mb-3">
              {info.crisisAlert}
            </p>
            <div className="flex gap-2 flex-wrap">
              <a
                href="tel:988"
                className="btn-primary text-xs flex items-center gap-1"
              >
                Call 988 Now
              </a>
              <a
                href="sms:741741?body=HOME"
                className="btn-secondary text-xs flex items-center gap-1"
              >
                Text HOME to 741741
              </a>
              <a
                href="https://findahelpline.com"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary text-xs flex items-center gap-1"
              >
                Find help worldwide
              </a>
              {onDismissCrisis && (
                <button onClick={onDismissCrisis} className="btn-ghost text-xs">
                  I&apos;m safe
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Normal privacy shield display
  const moodEmoji: Record<string, string> = {
    happy: "😊",
    sad: "😔",
    anxious: "😰",
    angry: "😤",
    calm: "😌",
    hopeful: "🌱",
    neutral: "💭",
  };

  return (
    <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-4 mb-4 animate-fade-in">
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center shrink-0 shadow-warm">
          <Shield className="w-5 h-5 text-white" />
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between mb-1 flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <h4 className="font-semibold text-green-900 text-sm">
                🔒 Privacy Shield Active
              </h4>
              <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium flex items-center gap-1">
                <Zap className="w-3 h-3" />
                Gemma 4
              </span>
            </div>
            {info.processingTimeMs && (
              <span className="text-xs text-green-600 flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {info.processingTimeMs}ms
              </span>
            )}
          </div>

          <p className="text-xs text-green-800 leading-relaxed mb-3">
            Your journal was processed <strong>locally</strong> before reaching
            the cloud.{" "}
            {info.piiRedacted > 0
              ? `We anonymized ${info.piiRedacted} personal detail${
                  info.piiRedacted !== 1 ? "s" : ""
                } (names, locations) to protect your privacy.`
              : "No personal details detected — your text was safe as written."}{" "}
            Only the emotional content reached your coach.
          </p>

          <div className="flex items-center gap-4 flex-wrap text-xs">
            <span className="flex items-center gap-1 text-green-700">
              <Check className="w-3 h-3" />
              PII redacted: <strong>{info.piiRedacted}</strong>
            </span>
            <span className="flex items-center gap-1 text-green-700">
              <Check className="w-3 h-3" />
              Mood:{" "}
              <strong>
                {moodEmoji[info.moodDetected] || "💭"} {info.moodDetected}
              </strong>
            </span>
            <span className="flex items-center gap-1 text-green-700">
              <Check className="w-3 h-3" />
              Crisis check: <strong className="text-green-800">clear</strong>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}