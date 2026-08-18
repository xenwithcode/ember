// frontend/src/components/journal/LetterDeliveryModal.tsx

"use client";

import { useState } from "react";
import { X, MailOpen, CheckCircle2 } from "lucide-react";
import { FutureLetter } from "@/hooks/useFutureLetters";

interface LetterDeliveryModalProps {
  letter: FutureLetter;
  onClose: () => void;
  onDeliver: (
    letterId: string,
    realityResponse: string,
    predictionAccuracy: FutureLetter["predictionAccuracy"],
    moodAtDelivery: string
  ) => void;
}

const accuracyOptions = [
  {
    value: "wrong" as const,
    label: "It didn't happen at all",
    emoji: "🎉",
    description: "My fear was unfounded",
  },
  {
    value: "better" as const,
    label: "It was better than I feared",
    emoji: "🌟",
    description: "Reality was kinder than my prediction",
  },
  {
    value: "partially" as const,
    label: "It happened, but differently",
    emoji: "🌤️",
    description: "Partially accurate, partially not",
  },
  {
    value: "accurate" as const,
    label: "It happened as I predicted",
    emoji: "📊",
    description: "My prediction was accurate",
  },
];

const moodOptions = [
  { emoji: "😊", label: "Happy" },
  { emoji: "😌", label: "Peaceful" },
  { emoji: "😐", label: "Okay" },
  { emoji: "😔", label: "Sad" },
  { emoji: "😰", label: "Anxious" },
];

export default function LetterDeliveryModal({
  letter,
  onClose,
  onDeliver,
}: LetterDeliveryModalProps) {
  const [realityResponse, setRealityResponse] = useState("");
  const [selectedAccuracy, setSelectedAccuracy] =
    useState<FutureLetter["predictionAccuracy"] | null>(null);
  const [selectedMood, setSelectedMood] = useState<string>("");
  const [step, setStep] = useState<"read" | "reflect">("read");

  const writtenDate = new Date(letter.writtenAt).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  const handleSubmit = () => {
    if (!selectedAccuracy || !realityResponse.trim()) return;
    onDeliver(letter.id, realityResponse, selectedAccuracy, selectedMood);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-coffee-900/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in"
      onClick={onClose}
    >
      <div
        className="bg-cream-100 rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-hidden shadow-warm-xl flex flex-col animate-fade-in-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 border-b border-cream-200 flex items-center justify-between shrink-0 bg-gradient-to-r from-terracotta-500/10 to-amber-400/10">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-terracotta-500 rounded-xl flex items-center justify-center text-2xl">
              <MailOpen className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="font-serif text-xl font-bold text-coffee-800">
                A Letter Has Arrived
              </h2>
              <p className="text-sm text-warm-gray">
                Written on {writtenDate} • {letter.timeframeLabel} ago
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

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {step === "read" ? (
            /* Step 1: Read the letter */
            <div className="animate-fade-in">
              <div className="bg-white rounded-2xl p-6 shadow-warm border border-cream-200 mb-6">
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-2xl">📜</span>
                  <h3 className="font-serif font-semibold text-coffee-800">
                    What your past self wrote
                  </h3>
                </div>
                <p className="font-serif text-coffee-800 leading-relaxed whitespace-pre-wrap">
                  {letter.fullText}
                </p>
              </div>

              <button
                onClick={() => setStep("reflect")}
                className="btn-primary w-full flex items-center justify-center gap-2"
              >
                <MailOpen className="w-4 h-4" />
                Now, tell me what actually happened
              </button>
            </div>
          ) : (
            /* Step 2: Reflect on reality */
            <div className="animate-fade-in space-y-6">
              {/* Question 1: What actually happened */}
              <div>
                <h3 className="font-serif font-semibold text-coffee-800 mb-3">
                  What actually happened?
                </h3>
                <textarea
                  value={realityResponse}
                  onChange={(e) => setRealityResponse(e.target.value)}
                  placeholder="Tell your past self what really happened. How did things actually turn out?"
                  className="textarea-journal w-full"
                  rows={4}
                />
              </div>

              {/* Question 2: Prediction accuracy */}
              <div>
                <h3 className="font-serif font-semibold text-coffee-800 mb-3">
                  How accurate was your prediction?
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {accuracyOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => setSelectedAccuracy(option.value)}
                      className={`
                        p-4 rounded-xl border-2 text-left transition-all duration-200
                        ${
                          selectedAccuracy === option.value
                            ? "border-terracotta-500 bg-terracotta-500/5 shadow-warm"
                            : "border-cream-200 hover:border-cream-300"
                        }
                      `}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xl">{option.emoji}</span>
                        <span className="font-medium text-coffee-800 text-sm">
                          {option.label}
                        </span>
                      </div>
                      <p className="text-xs text-warm-gray">
                        {option.description}
                      </p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Question 3: Current mood */}
              <div>
                <h3 className="font-serif font-semibold text-coffee-800 mb-3">
                  How are you feeling right now?
                </h3>
                <div className="flex gap-3">
                  {moodOptions.map((mood) => (
                    <button
                      key={mood.emoji}
                      onClick={() => setSelectedMood(mood.emoji)}
                      className={`
                        flex flex-col items-center gap-1 p-3 rounded-xl border-2 transition-all duration-200
                        ${
                          selectedMood === mood.emoji
                            ? "border-terracotta-500 bg-terracotta-500/5 scale-110"
                            : "border-cream-200 hover:border-cream-300"
                        }
                      `}
                    >
                      <span className="text-2xl">{mood.emoji}</span>
                      <span className="text-xs text-warm-gray">{mood.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Submit */}
              <button
                onClick={handleSubmit}
                disabled={!selectedAccuracy || !realityResponse.trim()}
                className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <CheckCircle2 className="w-4 h-4" />
                Complete This Letter's Journey
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}