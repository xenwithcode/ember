// frontend/src/components/journal/OnboardingProgress.tsx

"use client";

import { Flame } from "lucide-react";

interface OnboardingProgressProps {
  currentDay: number;
  totalDays: number;
  completedDays: number[];
}

export default function OnboardingProgress({
  currentDay,
  totalDays,
  completedDays,
}: OnboardingProgressProps) {
  const days = Array.from({ length: totalDays }, (_, i) => i + 1);

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm font-medium text-coffee-800">
          Day {currentDay} of {totalDays}
        </span>
        <span className="text-xs text-warm-light">
          {completedDays.length}/{totalDays} completed
        </span>
      </div>

      <div className="flex items-center gap-2">
        {days.map((day) => {
          const isCompleted = completedDays.includes(day);
          const isCurrent = day === currentDay;
          return (
            <div
              key={day}
              className="flex-1 flex flex-col items-center gap-1"
            >
              <div
                className={`
                  w-full h-2 rounded-full transition-all duration-300
                  ${isCompleted
                    ? "bg-terracotta-500"
                    : isCurrent
                      ? "bg-terracotta-500/40"
                      : "bg-cream-200"
                  }
                `}
              />
              <div
                className={`
                  w-7 h-7 rounded-full flex items-center justify-center text-xs font-medium
                  transition-all duration-300
                  ${isCompleted
                    ? "bg-terracotta-500 text-white"
                    : isCurrent
                      ? "bg-terracotta-500/15 text-terracotta-600 border border-terracotta-500/40"
                      : "bg-cream-100 text-warm-light border border-cream-300"
                  }
                `}
              >
                {isCompleted ? (
                  <Flame className="w-3.5 h-3.5" />
                ) : (
                  day
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}