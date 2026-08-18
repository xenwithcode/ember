// frontend/src/components/journal/SparkNotification.tsx

"use client";

import { useState } from "react";
import { Sparkles, X, ChevronRight } from "lucide-react";
import { DetectedPattern } from "@/hooks/usePatternDetection";
import { SparkChallenge } from "@/hooks/useSparkChallenges";

interface SparkNotificationProps {
  pattern: DetectedPattern;
  challenge: SparkChallenge;
  onViewChallenge: () => void;
  onDismiss: () => void;
}

export default function SparkNotification({
  pattern,
  challenge,
  onViewChallenge,
  onDismiss,
}: SparkNotificationProps) {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 max-w-sm animate-fade-in-up">
      <div className="bg-white rounded-2xl shadow-warm-xl border border-terracotta-500/30 overflow-hidden">
        {/* Gradient accent */}
        <div className="h-1 bg-gradient-to-r from-terracotta-500 via-amber-400 to-terracotta-500" />

        <div className="p-5">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-terracotta-500/10 rounded-xl flex items-center justify-center shrink-0">
              <Sparkles className="w-5 h-5 text-terracotta-500" />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-serif font-semibold text-coffee-800 text-sm">
                  🔥 Pattern Detected
                </h3>
              </div>

              <p className="text-xs text-warm-gray leading-relaxed mb-3">
                {pattern.description}
              </p>

              <div className="bg-cream-100 rounded-lg p-3 mb-3">
                <p className="text-xs font-medium text-coffee-800 mb-1">
                  {challenge.template.emoji} {challenge.template.title}
                </p>
                <p className="text-xs text-warm-gray line-clamp-2">
                  {challenge.template.description}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    onViewChallenge();
                    setIsVisible(false);
                  }}
                  className="btn-primary text-xs px-4 py-2 flex items-center gap-1"
                >
                  View Challenge
                  <ChevronRight className="w-3 h-3" />
                </button>
                <button
                  onClick={() => {
                    onDismiss();
                    setIsVisible(false);
                  }}
                  className="btn-ghost text-xs px-3 py-2"
                >
                  Not now
                </button>
              </div>
            </div>

            <button
              onClick={() => setIsVisible(false)}
              className="p-1 hover:bg-cream-200 rounded-lg transition-colors shrink-0"
            >
              <X className="w-4 h-4 text-warm-light" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}