// frontend/src/components/journal/OnboardingDayCard.tsx

"use client";

import { useState } from "react";
import {
  BookOpen,
  Lightbulb,
  Quote,
  Sparkles,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
} from "lucide-react";
import { OnboardingDay } from "@/data/onboardingDays";

interface OnboardingDayCardProps {
  day: OnboardingDay;
  isCompleted: boolean;
  onStartWriting: () => void;
}

export default function OnboardingDayCard({
  day,
  isCompleted,
  onStartWriting,
}: OnboardingDayCardProps) {
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <div className="card-static overflow-hidden">
      {/* Header */}
      <div className="p-5 bg-gradient-to-r from-terracotta-500/5 to-amber-400/5 border-b border-cream-200">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-terracotta-500 rounded-xl flex items-center justify-center text-2xl">
              {day.emoji}
            </div>
            <div>
              <div className="flex items-center gap-2 mb-0.5">
                <span className="text-xs font-medium text-terracotta-600 uppercase tracking-wide">
                  Day {day.day} of 7
                </span>
                {isCompleted && (
                  <span className="flex items-center gap-1 text-xs text-green-600">
                    <CheckCircle2 className="w-3 h-3" />
                    Completed
                  </span>
                )}
              </div>
              <h2 className="font-serif text-xl font-bold text-coffee-800">
                {day.title}
              </h2>
              <p className="text-sm text-warm-gray">{day.subtitle}</p>
            </div>
          </div>

          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-2 hover:bg-cream-200 rounded-lg transition-colors"
          >
            {isExpanded ? (
              <ChevronUp className="w-5 h-5 text-warm-gray" />
            ) : (
              <ChevronDown className="w-5 h-5 text-warm-gray" />
            )}
          </button>
        </div>
      </div>

      {isExpanded && (
        <div className="p-5 space-y-5 animate-fade-in">
          {/* The Concept */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Lightbulb className="w-4 h-4 text-terracotta-500" />
              <h3 className="text-sm font-semibold text-coffee-800">
                The Concept
              </h3>
            </div>
            <p className="text-sm text-warm-gray leading-relaxed">
              {day.concept}
            </p>
          </div>

          {/* The Science */}
          <div className="bg-cream-100 rounded-xl p-4 border border-cream-200">
            <div className="flex items-center gap-2 mb-2">
              <BookOpen className="w-4 h-4 text-blue-500" />
              <h3 className="text-sm font-semibold text-coffee-800">
                The Science
              </h3>
            </div>
            <p className="text-sm text-warm-gray leading-relaxed">
              {day.science}
            </p>
          </div>

          {/* The Quote */}
          <div className="bg-terracotta-500/5 rounded-xl p-4 border border-terracotta-500/20">
            <div className="flex items-start gap-3">
              <Quote className="w-5 h-5 text-terracotta-500 mt-0.5 shrink-0" />
              <div>
                <p className="font-hand text-lg text-coffee-800 leading-relaxed mb-1">
                  &ldquo;{day.quote}&rdquo;
                </p>
                <p className="text-xs text-warm-gray">— {day.quoteAuthor}</p>
              </div>
            </div>
          </div>

          {/* Today's Practice */}
          <div className="bg-white rounded-xl p-4 border border-cream-200">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-4 h-4 text-terracotta-500" />
              <h3 className="text-sm font-semibold text-coffee-800">
                Today&apos;s Practice
              </h3>
              <span className="text-xs text-warm-light ml-auto">
                {day.estimatedTime}
              </span>
            </div>

            <p className="text-sm text-coffee-800 leading-relaxed mb-4 font-serif italic">
              {day.prompt}
            </p>

            <button
              onClick={onStartWriting}
              className="btn-primary w-full flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              {isCompleted ? "Write Again" : "Start Writing"}
            </button>
          </div>

          {/* Key Insight */}
          <div className="flex items-start gap-3 p-3 bg-amber-50 rounded-xl border border-amber-200">
            <span className="text-lg">💡</span>
            <p className="text-xs text-amber-800 leading-relaxed">
              <strong>Remember:</strong> {day.keyInsight}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}