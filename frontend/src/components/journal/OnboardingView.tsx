// frontend/src/components/journal/OnboardingView.tsx

"use client";

import { useState } from "react";
import { Flame, Sparkles, PenLine, X } from "lucide-react";
import OnboardingProgress from "./OnboardingProgress";
import OnboardingWelcome from "./OnboardingWelcome";
import VoiceWritingMode from "./VoiceWritingMode";
import {
  OnboardingProgress as OnboardingProgressType,
  OnboardingDayContent,
} from "@/hooks/useOnboarding";
import { rituals } from "@/data/rituals";

interface OnboardingViewProps {
  progress: OnboardingProgressType;
  todayContent: OnboardingDayContent;
  isDayCompleted: (day: number) => boolean;
  onBack: () => void;
  onStartWriting: () => void;
  onSkip: () => void;
}

export default function OnboardingView({
  progress,
  todayContent,
  isDayCompleted,
  onBack,
  onStartWriting,
  onSkip,
}: OnboardingViewProps) {
  const [showWelcome, setShowWelcome] = useState(true);
  const [writingMode, setWritingMode] = useState<"text" | "voice" | null>(null);

  const suggestedRitual = rituals.find(
    (r) => r.id === todayContent.suggestedRitualId
  );
  const dayCompleted = isDayCompleted(todayContent.day);

  if (showWelcome && progress.completedDays.length === 0) {
    return (
      <OnboardingWelcome
        onChooseWrite={() => {
          setShowWelcome(false);
          setWritingMode("text");
        }}
        onChooseSpeak={() => {
          setShowWelcome(false);
          setWritingMode("voice");
        }}
      />
    );
  }

  if (writingMode === "voice" && todayContent) {
    return (
      <div className="min-h-screen bg-cream-100">
        <div className="max-w-2xl mx-auto px-6 py-8">
          <VoiceWritingMode
            prompt={todayContent.prompt}
            onComplete={(transcript) => {
              // Submit the transcript as the journal entry
              // Then complete the onboarding day
              setWritingMode(null);
              // Call the same submit function with the transcript
              onStartWriting();
            }}
            onSwitchToText={() => setWritingMode("text")}
            onCancel={() => setWritingMode(null)}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream-100">
      {/* Header */}
      <header className="bg-white border-b border-cream-200 sticky top-0 z-40">
        <div className="max-w-3xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={onBack}
              className="p-2 hover:bg-cream-200 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-warm-gray" />
            </button>
            <div className="w-10 h-10 bg-terracotta-500 rounded-xl flex items-center justify-center">
              <Flame className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="font-serif font-bold text-coffee-800 text-lg">
                Rekindle, Step by Step
              </h1>
              <p className="text-xs text-warm-light">
                A 7-day gentle onboarding
              </p>
            </div>
          </div>
          <button
            onClick={onSkip}
            className="text-sm text-warm-light hover:text-warm-gray transition-colors"
          >
            Skip onboarding
          </button>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-6 py-10">
        {/* Progress */}
        <div className="card-static p-6 mb-6">
          <OnboardingProgress
            currentDay={progress.currentDay}
            totalDays={7}
            completedDays={progress.completedDays}
          />
        </div>

        {/* Today's content */}
        <div className="card-static overflow-hidden">
          <div className="h-1.5 bg-gradient-to-r from-terracotta-500 via-amber-400 to-terracotta-500" />

          <div className="p-8">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-4 h-4 text-terracotta-500" />
              <span className="text-xs font-semibold uppercase tracking-wide text-terracotta-500">
                Day {todayContent.day} of 7
              </span>
            </div>

            <h2 className="font-serif text-2xl font-semibold text-coffee-800 mb-3">
              {todayContent.title}
            </h2>
            <p className="text-warm-gray leading-relaxed mb-6">
              {todayContent.description}
            </p>

            {/* Today's goal */}
            <div className="bg-cream-200/60 rounded-xl p-4 mb-6">
              <p className="text-sm text-coffee-800">
                <strong>Today&apos;s goal:</strong> {todayContent.goal}
              </p>
            </div>

            {/* Suggested ritual */}
            {suggestedRitual && (
              <div className="bg-white rounded-xl border border-cream-200 p-4 mb-6">
                <p className="text-xs font-medium text-warm-light uppercase tracking-wide mb-2">
                  Suggested ritual
                </p>
                <div className="flex items-center gap-3">
                  <span
                    className="w-10 h-10 rounded-xl flex items-center justify-center text-xl"
                    style={{ backgroundColor: `${suggestedRitual.emberColor}20` }}
                  >
                    {suggestedRitual.emoji}
                  </span>
                  <div>
                    <p className="font-medium text-coffee-800 text-sm">
                      {suggestedRitual.name}
                    </p>
                    <p className="text-xs text-warm-light">
                      {suggestedRitual.duration} • {suggestedRitual.purpose}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Prompt */}
            <div
              className="rounded-xl p-4 border mb-8"
              style={{
                backgroundColor: `${suggestedRitual?.emberColor ?? "#E28766"}08`,
                borderColor: `${suggestedRitual?.emberColor ?? "#E28766"}30`,
              }}
            >
              <div className="flex items-start gap-2">
                <PenLine
                  className="w-4 h-4 mt-1 shrink-0"
                  style={{ color: suggestedRitual?.emberColor ?? "#E28766" }}
                />
                <p
                  className="text-sm font-serif italic leading-relaxed"
                  style={{ color: suggestedRitual?.emberColor ?? "#E28766" }}
                >
                  {todayContent.prompt}
                </p>
              </div>
            </div>

            <button
              onClick={onStartWriting}
              className="btn-primary w-full flex items-center justify-center gap-2 py-4"
            >
              <PenLine className="w-4 h-4" />
              {dayCompleted ? "Continue Your Journey" : "Start Writing"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}