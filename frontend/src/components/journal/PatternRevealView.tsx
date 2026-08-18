// frontend/src/components/journal/PatternRevealView.tsx

"use client";

import { useState } from "react";
import { ArrowLeft, Sparkles, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { WeeklySummary } from "@/hooks/useWeeklyPatterns";
import { emotionColors, emotionLabels } from "@/hooks/useEmberAnalysis";
import PatternRevealCard from "./PatternRevealCard";

interface PatternRevealViewProps {
  summary: WeeklySummary;
  onBack: () => void;
}

export default function PatternRevealView({ summary, onBack }: PatternRevealViewProps) {
  const [revealedPatterns, setRevealedPatterns] = useState<number>(0);

  const handleRevealNext = () => {
    if (revealedPatterns < summary.patterns.length) {
      setRevealedPatterns(revealedPatterns + 1);
    }
  };

  const moodTrendIcon = {
    improving: <TrendingUp className="w-4 h-4 text-green-500" />,
    stable: <Minus className="w-4 h-4 text-amber-500" />,
    declining: <TrendingDown className="w-4 h-4 text-red-500" />,
    unknown: <Minus className="w-4 h-4 text-warm-light" />,
  };

  return (
    <div className="min-h-screen bg-cream-100">
      {/* Header */}
      <header className="bg-white border-b border-cream-200 sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-2 hover:bg-cream-200 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-warm-gray" />
          </button>
          <div className="w-10 h-10 bg-terracotta-500 rounded-xl flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="font-serif font-bold text-coffee-800 text-lg">
              Pattern Reveal
            </h1>
            <p className="text-xs text-warm-light">
              Week {summary.weekNumber} • {summary.entriesThisWeek} entries
            </p>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Weekly stats */}
        <div className="grid grid-cols-3 gap-4 mb-8 animate-fade-in-up">
          <div className="card-static p-5 text-center">
            <p className="text-3xl font-bold text-terracotta-600">
              {summary.entriesThisWeek}
            </p>
            <p className="text-xs text-warm-gray mt-1">Entries written</p>
          </div>
          <div className="card-static p-5 text-center">
            <p className="text-3xl font-bold text-terracotta-600">
              {summary.totalWords.toLocaleString()}
            </p>
            <p className="text-xs text-warm-gray mt-1">Words written</p>
          </div>
          <div className="card-static p-5 text-center">
            <p className="text-3xl font-bold text-terracotta-600">
              {summary.totalMinutes}
            </p>
            <p className="text-xs text-warm-gray mt-1">Minutes of reflection</p>
          </div>
        </div>

        {/* Mood trend comparison */}
        <div className="card-static p-5 mb-8 animate-fade-in-up stagger-1">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-serif font-semibold text-coffee-800 mb-1">
                Compared to last week
              </h3>
              <p className="text-sm text-warm-gray">
                {summary.comparisonToLastWeek.entriesDiff > 0
                  ? `You wrote ${summary.comparisonToLastWeek.entriesDiff} more entries this week.`
                  : summary.comparisonToLastWeek.entriesDiff < 0
                  ? `You wrote ${Math.abs(summary.comparisonToLastWeek.entriesDiff)} fewer entries this week. That's okay — quality over quantity.`
                  : "Same number of entries as last week. Steady."}
              </p>
            </div>
            <div className="flex items-center gap-2">
              {moodTrendIcon[summary.comparisonToLastWeek.moodTrend]}
              <span className="text-sm font-medium text-coffee-800 capitalize">
                {summary.comparisonToLastWeek.moodTrend}
              </span>
            </div>
          </div>
        </div>

        {/* Emotion breakdown */}
        <div className="card-static p-6 mb-8 animate-fade-in-up stagger-2">
          <h3 className="font-serif font-semibold text-coffee-800 mb-4">
            Your emotional landscape this week
          </h3>
          <div className="space-y-3">
            {summary.emotionBreakdown.map(({ emotion, count, percentage }) => (
              <div key={emotion} className="flex items-center gap-3">
                <span className="text-sm text-warm-gray w-24 shrink-0">
                  {emotionLabels[emotion]}
                </span>
                <div className="flex-1 h-3 bg-cream-200 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-700 ease-out"
                    style={{
                      width: `${percentage}%`,
                      backgroundColor: emotionColors[emotion],
                    }}
                  />
                </div>
                <span className="text-xs text-warm-light w-12 text-right">
                  {percentage}%
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Pattern reveals */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6 animate-fade-in-up stagger-3">
            <h3 className="font-serif text-xl font-semibold text-coffee-800">
              Patterns revealed
            </h3>
            <span className="text-sm text-warm-gray">
              {Math.min(revealedPatterns, summary.patterns.length)} of{" "}
              {summary.patterns.length} revealed
            </span>
          </div>

          <div className="space-y-4">
            {summary.patterns.slice(0, revealedPatterns).map((pattern, index) => (
              <PatternRevealCard key={pattern.id} pattern={pattern} index={index} />
            ))}
          </div>

          {revealedPatterns < summary.patterns.length && (
            <button
              onClick={handleRevealNext}
              className="btn-primary w-full mt-6 flex items-center justify-center gap-2 animate-fade-in-up"
            >
              <Sparkles className="w-4 h-4" />
              {revealedPatterns === 0
                ? "Reveal My Patterns"
                : "Reveal Next Pattern"}
            </button>
          )}

          {revealedPatterns >= summary.patterns.length && summary.patterns.length > 0 && (
            <div className="bg-terracotta-500/10 rounded-2xl p-6 text-center mt-6 animate-fade-in-up">
              <p className="font-hand text-xl text-coffee-800">
                &ldquo;You are not the same person who started this week.&rdquo;
              </p>
            </div>
          )}
        </div>

        {/* Growth insight */}
        <div className="bg-white rounded-2xl p-6 border border-cream-200 shadow-warm animate-fade-in-up stagger-4">
          <div className="flex items-start gap-3">
            <span className="text-2xl">🌱</span>
            <div>
              <h4 className="font-serif font-semibold text-coffee-800 mb-2">
                This week&apos;s insight
              </h4>
              <p className="text-coffee-800 leading-relaxed font-serif italic">
                {summary.growthInsight}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}