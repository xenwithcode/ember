// frontend/src/components/journal/LetterComposer.tsx

"use client";

import { useState } from "react";
import {
  Mail,
  ChevronRight,
  ChevronLeft,
  Lock,
  Sparkles,
} from "lucide-react";
import {
  letterPrompts,
  deliveryTimeframes,
  DeliveryTimeframe,
  generateLetterTemplate,
} from "@/data/letterPrompts";
import LetterSealAnimation from "./LetterSealAnimation";

interface LetterComposerProps {
  onSeal: (
    fullText: string,
    answers: Record<string, string>,
    timeframe: DeliveryTimeframe
  ) => void;
  onCancel: () => void;
}

export default function LetterComposer({
  onSeal,
  onCancel,
}: LetterComposerProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [selectedTimeframe, setSelectedTimeframe] =
    useState<DeliveryTimeframe>(deliveryTimeframes[1]); // Default: 1 month
  const [isSealing, setIsSealing] = useState(false);
  const [isSealed, setIsSealed] = useState(false);

  const totalSteps = letterPrompts.length + 1; // prompts + timeframe selection
  const currentPrompt = letterPrompts[currentStep];
  const isTimeframeStep = currentStep === letterPrompts.length;

  const handleNext = () => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSeal = () => {
    setIsSealing(true);

    // Generate the full letter text
    const fullText = generateLetterTemplate(answers, selectedTimeframe);

    // Show sealing animation
    setTimeout(() => {
      setIsSealing(false);
      setIsSealed(true);

      // Call the seal function after animation
      setTimeout(() => {
        onSeal(fullText, answers, selectedTimeframe);
      }, 2000);
    }, 1500);
  };

  const canProceed = isTimeframeStep || (answers[currentPrompt?.id] || "").trim().length > 0;

  if (isSealed) {
    return (
      <div className="card-static p-8 text-center animate-fade-in-up">
        <div className="text-6xl mb-4">📬</div>
        <h2 className="font-serif text-2xl font-bold text-coffee-800 mb-3">
          Your letter is sealed
        </h2>
        <p className="text-warm-gray mb-2">
          It will be delivered on{" "}
          <strong className="text-coffee-800">
            {new Date(
              Date.now() + selectedTimeframe.days * 24 * 60 * 60 * 1000
            ).toLocaleDateString("en-US", {
              month: "long",
              day: "numeric",
              year: "numeric",
            })}
          </strong>
        </p>
        <p className="text-sm text-warm-light italic">
          &ldquo;Your future self is waiting to hear from you.&rdquo;
        </p>
      </div>
    );
  }

  return (
    <div className="card-static overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-cream-200 bg-gradient-to-r from-terracotta-500/5 to-amber-400/5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-terracotta-500 rounded-xl flex items-center justify-center">
              <Mail className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="font-serif font-bold text-coffee-800 text-lg">
                Letter to Future You
              </h2>
              <p className="text-xs text-warm-light">
                A conversation across time
              </p>
            </div>
          </div>
          <button
            onClick={onCancel}
            className="text-sm text-warm-gray hover:text-coffee-800 transition-colors"
          >
            Cancel
          </button>
        </div>

        {/* Progress bar */}
        <div className="flex items-center gap-2">
          {Array.from({ length: totalSteps }).map((_, i) => (
            <div
              key={i}
              className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
                i <= currentStep ? "bg-terracotta-500" : "bg-cream-200"
              }`}
            />
          ))}
        </div>
        <p className="text-xs text-warm-light mt-2">
          Step {currentStep + 1} of {totalSteps}
        </p>
      </div>

      {/* Content */}
      <div className="p-6">
        {!isTimeframeStep ? (
          /* Prompt question */
          <div className="animate-fade-in">
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="w-4 h-4 text-terracotta-500" />
                <span className="text-xs font-medium text-terracotta-600 uppercase tracking-wide">
                  {currentPrompt.purpose}
                </span>
              </div>
              <h3 className="font-serif text-xl font-semibold text-coffee-800 mb-4">
                {currentPrompt.question}
              </h3>
            </div>

            <textarea
              value={answers[currentPrompt.id] || ""}
              onChange={(e) =>
                setAnswers({ ...answers, [currentPrompt.id]: e.target.value })
              }
              placeholder={currentPrompt.placeholder}
              className="textarea-journal w-full font-serif"
              rows={4}
              autoFocus
            />
          </div>
        ) : (
          /* Timeframe selection */
          <div className="animate-fade-in">
            <h3 className="font-serif text-xl font-semibold text-coffee-800 mb-2">
              When should this letter arrive?
            </h3>
            <p className="text-sm text-warm-gray mb-6">
              Choose how far into the future you want to send this letter.
            </p>

            <div className="grid grid-cols-2 gap-3">
              {deliveryTimeframes.map((timeframe) => (
                <button
                  key={timeframe.id}
                  onClick={() => setSelectedTimeframe(timeframe)}
                  className={`
                    p-4 rounded-xl border-2 text-left transition-all duration-200
                    ${
                      selectedTimeframe.id === timeframe.id
                        ? "border-terracotta-500 bg-terracotta-500/5 shadow-warm"
                        : "border-cream-200 hover:border-cream-300 hover:bg-cream-50"
                    }
                  `}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-2xl">{timeframe.emoji}</span>
                    <span className="font-serif font-semibold text-coffee-800">
                      {timeframe.label}
                    </span>
                  </div>
                  <p className="text-xs text-warm-gray">
                    {timeframe.description}
                  </p>
                  <p className="text-xs text-terracotta-600 mt-2 font-medium">
                    Delivers:{" "}
                    {new Date(
                      Date.now() + timeframe.days * 24 * 60 * 60 * 1000
                    ).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })}
                  </p>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="flex items-center justify-between mt-6 pt-6 border-t border-cream-200">
          <button
            onClick={handlePrev}
            disabled={currentStep === 0}
            className="btn-ghost flex items-center gap-1 disabled:opacity-50"
          >
            <ChevronLeft className="w-4 h-4" />
            Back
          </button>

          {currentStep < totalSteps - 1 ? (
            <button
              onClick={handleNext}
              disabled={!canProceed}
              className="btn-primary flex items-center gap-1 disabled:opacity-50"
            >
              Continue
              <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={handleSeal}
              disabled={isSealing}
              className="btn-primary flex items-center gap-2"
            >
              <Lock className="w-4 h-4" />
              {isSealing ? "Sealing..." : "Seal This Letter"}
            </button>
          )}
        </div>
      </div>

      {/* Sealing animation overlay */}
      {isSealing && <LetterSealAnimation />}
    </div>
  );
}