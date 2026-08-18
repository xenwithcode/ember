// frontend/src/components/journal/PatternRevealCard.tsx

"use client";

import { Lightbulb } from "lucide-react";
import { WeeklyPattern } from "@/hooks/useWeeklyPatterns";

interface PatternRevealCardProps {
  pattern: WeeklyPattern;
  index: number;
}

export default function PatternRevealCard({ pattern, index }: PatternRevealCardProps) {
  return (
    <div
      className="card-static p-6 animate-fade-in-up"
      style={{ animationDelay: `${index * 0.15}s` }}
    >
      <div className="flex items-start gap-4">
        {/* Emoji */}
        <div className="w-12 h-12 bg-terracotta-500/10 rounded-xl flex items-center justify-center text-2xl shrink-0">
          {pattern.emoji}
        </div>

        {/* Content */}
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-serif font-semibold text-coffee-800">
              {pattern.title}
            </h3>
            <span className="text-xs bg-cream-200 text-warm-gray px-2 py-0.5 rounded-full">
              {pattern.confidence}% confidence
            </span>
          </div>

          <p className="text-sm text-warm-gray leading-relaxed mb-4">
            {pattern.description}
          </p>

          {/* Evidence */}
          {pattern.evidence.length > 0 && (
            <div className="bg-cream-100 rounded-lg p-3 mb-4">
              <p className="text-xs font-medium text-warm-gray mb-2">
                Evidence:
              </p>
              <ul className="space-y-1">
                {pattern.evidence.map((e, i) => (
                  <li key={i} className="text-xs text-warm-gray flex items-start gap-2">
                    <span className="text-terracotta-500 mt-0.5">•</span>
                    <span className="italic">{e}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Suggestion */}
          <div className="flex items-start gap-2 bg-amber-50 rounded-lg p-3 border border-amber-200">
            <Lightbulb className="w-4 h-4 text-amber-500 mt-0.5 shrink-0" />
            <p className="text-xs text-amber-800 leading-relaxed">
              {pattern.suggestion}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}