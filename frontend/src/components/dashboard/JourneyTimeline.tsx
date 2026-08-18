"use client";

import { JourneyEntry } from "@/data/dashboard";

interface JourneyTimelineProps {
  journey: JourneyEntry[];
}

const moodEmojis: Record<number, string> = {
  1: "😢",
  2: "😔",
  3: "😟",
  4: "😐",
  5: "🙂",
  6: "😊",
  7: "😄",
  8: "🌟",
  9: "✨",
  10: "🌈",
};

export default function JourneyTimeline({ journey }: JourneyTimelineProps) {
  return (
    <div className="card-static p-8">
      <div className="space-y-8">
        {journey.map((entry, index) => (
          <div key={entry.week} className="flex gap-6">
            {/* Timeline dot and line */}
            <div className="flex flex-col items-center">
              <div
                className={`
                  w-12 h-12 rounded-full flex items-center justify-center text-xl
                  ${index === journey.length - 1
                    ? "bg-terracotta-500 text-white shadow-glow"
                    : "bg-cream-200"
                  }
                `}
              >
                {moodEmojis[entry.mood]}
              </div>
              {index < journey.length - 1 && (
                <div className="w-0.5 h-full bg-cream-200 mt-2" />
              )}
            </div>

            {/* Content */}
            <div className="flex-1 pb-8">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-sm font-medium text-terracotta-600">
                  Week {entry.week}
                </span>
                <span className="text-xs text-warm-light">
                  {entry.activitiesCompleted} activities completed
                </span>
              </div>

              {/* Quote */}
              <blockquote className="font-hand text-xl text-coffee-800 mb-3">
                &ldquo;{entry.quote}&rdquo;
              </blockquote>

              {/* Key insight */}
              <div className="bg-cream-100 rounded-xl p-4 border border-cream-200">
                <p className="text-xs font-medium text-warm-gray mb-1">
                  Key insight
                </p>
                <p className="text-sm text-coffee-800">{entry.keyInsight}</p>
              </div>

              {/* Mood indicator */}
              <div className="flex items-center gap-2 mt-3">
                <span className="text-xs text-warm-gray">Mood:</span>
                <div className="flex gap-0.5">
                  {Array.from({ length: 10 }).map((_, i) => (
                    <div
                      key={i}
                      className={`w-2 h-2 rounded-full ${
                        i < entry.mood
                          ? "bg-terracotta-500"
                          : "bg-cream-200"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-xs text-warm-gray">
                  {entry.mood}/10
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}