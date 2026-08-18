// frontend/src/components/journal/SparkChallengeModal.tsx

"use client";

import { useState, useEffect } from "react";
import { X, CheckCircle2, Calendar, Flame } from "lucide-react";
import { SparkChallenge } from "@/hooks/useSparkChallenges";

interface SparkChallengeModalProps {
  challenge: SparkChallenge | null;
  onClose: () => void;
  onAccept: (challengeId: string) => void;
  onComplete: (challengeId: string, note?: string) => void;
  onSkip: (challengeId: string) => void;
  onAddToCalendar: (challenge: SparkChallenge) => void;
}

export default function SparkChallengeModal({
  challenge,
  onClose,
  onAccept,
  onComplete,
  onSkip,
  onAddToCalendar,
}: SparkChallengeModalProps) {
  const [completionNote, setCompletionNote] = useState("");
  const [showCompletionForm, setShowCompletionForm] = useState(false);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (challenge) {
      window.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }
    return () => {
      window.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "";
    };
  }, [challenge, onClose]);

  if (!challenge) return null;

  const { template } = challenge;

  const handleComplete = () => {
    onComplete(challenge.id, completionNote);
    setCompletionNote("");
    setShowCompletionForm(false);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-coffee-900/70 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in"
      onClick={onClose}
    >
      <div
        className="bg-cream-100 rounded-3xl max-w-lg w-full max-h-[85vh] overflow-y-auto shadow-warm-xl animate-fade-in-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 border-b border-cream-200 flex items-start justify-between sticky top-0 bg-cream-100 z-10">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-terracotta-500 rounded-xl flex items-center justify-center text-2xl">
              {template.emoji}
            </div>
            <div>
              <h2 className="font-serif text-xl font-semibold text-coffee-800">
                {template.title}
              </h2>
              <p className="text-sm text-warm-gray">
                {template.duration} • {template.difficulty}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-cream-200 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-warm-gray" />
          </button>
        </div>

        <div className="p-6">
          {/* Pattern description */}
          <div className="bg-cream-200/50 rounded-xl p-4 mb-6">
            <p className="text-sm text-warm-gray">
              <strong className="text-coffee-800">Why this challenge?</strong>
              <br />
              {challenge.patternDescription}
            </p>
          </div>

          {/* Description */}
          <p className="text-coffee-800 leading-relaxed mb-6">
            {template.description}
          </p>

          {/* The action */}
          <div className="bg-white rounded-2xl p-5 border border-cream-200 mb-6">
            <div className="flex items-center gap-2 mb-3">
              <Flame className="w-5 h-5 text-terracotta-500" />
              <h3 className="font-serif font-semibold text-coffee-800">
                Your Challenge
              </h3>
            </div>
            <p className="text-coffee-800 leading-relaxed">
              {template.action}
            </p>
          </div>

          {/* Completion form (if accepted) */}
          {challenge.status === "accepted" && showCompletionForm && (
            <div className="bg-green-50 rounded-2xl p-5 border border-green-200 mb-6">
              <h3 className="font-serif font-semibold text-green-800 mb-3">
                🎉 How did it go?
              </h3>
              <textarea
                value={completionNote}
                onChange={(e) => setCompletionNote(e.target.value)}
                placeholder={template.followUpPrompt}
                className="w-full bg-white border border-green-200 rounded-xl p-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-green-500/30"
                rows={3}
              />
              <div className="flex gap-2 mt-3">
                <button
                  onClick={handleComplete}
                  className="btn-primary text-sm flex-1 flex items-center justify-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  Complete Challenge
                </button>
                <button
                  onClick={() => setShowCompletionForm(false)}
                  className="btn-ghost text-sm"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {/* Actions */}
          {challenge.status === "suggested" && (
            <div className="space-y-2">
              <button
                onClick={() => {
                  onAccept(challenge.id);
                  onClose();
                }}
                className="btn-primary w-full flex items-center justify-center gap-2"
              >
                <Flame className="w-4 h-4" />
                Accept This Challenge
              </button>
              <button
                onClick={() => onAddToCalendar(challenge)}
                className="btn-secondary w-full flex items-center justify-center gap-2"
              >
                <Calendar className="w-4 h-4" />
                Add to Calendar
              </button>
              <button
                onClick={() => {
                  onSkip(challenge.id);
                  onClose();
                }}
                className="btn-ghost w-full text-sm"
              >
                Not right now
              </button>
            </div>
          )}

          {challenge.status === "accepted" && !showCompletionForm && (
            <div className="space-y-2">
              <button
                onClick={() => setShowCompletionForm(true)}
                className="btn-primary w-full flex items-center justify-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4" />
                I Completed This
              </button>
              <button
                onClick={() => {
                  onSkip(challenge.id);
                  onClose();
                }}
                className="btn-ghost w-full text-sm"
              >
                Skip for now
              </button>
            </div>
          )}

          {challenge.status === "completed" && (
            <div className="bg-green-50 border border-green-200 rounded-2xl p-6 text-center">
              <div className="text-4xl mb-3">🔥</div>
              <h3 className="font-serif text-lg font-semibold text-green-800 mb-2">
                Challenge Completed!
              </h3>
              <p className="text-sm text-green-700">
                You showed up for yourself. Your Identity Graph just grew stronger.
              </p>
              {challenge.completionNote && (
                <div className="mt-4 bg-white rounded-xl p-3 text-left">
                  <p className="text-xs text-warm-gray mb-1">Your reflection:</p>
                  <p className="text-sm text-coffee-800 italic">
                    &ldquo;{challenge.completionNote}&rdquo;
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}