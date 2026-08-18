// frontend/src/components/dashboard/WeeklyPatternsSummary.tsx

"use client";

import { Sparkles, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { WeeklySummary } from "@/hooks/useWeeklyPatterns";
import { emotionColors, emotionLabels } from "@/hooks/useEmberAnalysis";

interface WeeklyPatternsSummaryProps {
  summary: WeeklySummary;
}

export default function WeeklyPatternsSummary({ summary }: WeeklyPatternsSummaryProps) {
  const moodTrendConfig = {
    improving: { icon: TrendingUp, color: "text-green-500", label: "Improving" },
    stable: { icon: Minus, color: "text-amber-500", label: "Stable" },
    declining: { icon: TrendingDown, color: "text-red-500", label: "Needs care" },
    unknown: { icon: Minus, color: "text-warm-light", label: "New journey" },
  };

  const trend = moodTrendConfig[summary.comparisonToLastWeek.moodTrend];
  const TrendIcon = trend.icon;

  return (
    <div className="card-static p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-serif font-semibold text-coffee-800 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-terracotta-500" />
          This Week&apos;s Patterns
        </h3>
        <div className={`flex items-center gap-1 ${trend.color}`}>
          <TrendIcon className="w-4 h-4" />
          <span className="text-xs font-medium">{trend.label}</span>
        </div>
      </div>

      {/* Top patterns (compact) */}
      <div className="space-y-3 mb-4">
        {summary.patterns.slice(0, 3).map((pattern) => (
          <div
            key={pattern.id}
            className="flex items-start gap-3 bg-cream-100 rounded-lg p-3"
          >
            <span className="text-lg shrink-0">{pattern.emoji}</span>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-coffee-800 truncate">
                {pattern.title}
              </p>
              <p className="text-xs text-warm-gray line-clamp-1">
                {pattern.description}
              </p>
            </div>
            <span className="text-xs text-warm-light shrink-0">
              {pattern.confidence}%
            </span>
          </div>
        ))}
      </div>

      {/* Emotion mini-chart */}
      <div className="flex items-center gap-1 h-3 rounded-full overflow-hidden">
        {summary.emotionBreakdown.map(({ emotion, percentage }) => (
          <div
            key={emotion}
            className="h-full transition-all duration-500"
            style={{
              width: `${percentage}%`,
              backgroundColor: emotionColors[emotion],
            }}
            title={`${emotionLabels[emotion]}: ${percentage}%`}
          />
        ))}
      </div>
      <div className="flex items-center justify-center gap-4 mt-2">
        {summary.emotionBreakdown.slice(0, 3).map(({ emotion, percentage }) => (
          <div key={emotion} className="flex items-center gap-1">
            <div
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: emotionColors[emotion] }}
            />
            <span className="text-[10px] text-warm-gray">
              {emotionLabels[emotion]} {percentage}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}