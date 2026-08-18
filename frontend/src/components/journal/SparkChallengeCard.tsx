// frontend/src/components/journal/SparkChallengeCard.tsx

"use client";

import { CheckCircle2, Clock, Flame, Target } from "lucide-react";
import { SparkChallenge } from "@/hooks/useSparkChallenges";

interface SparkChallengeCardProps {
  challenge: SparkChallenge;
  onAccept: () => void;
  onComplete: () => void;
  onSkip: () => void;
}

const difficultyColors = {
  easy: "bg-green-100 text-green-700",
  medium: "bg-amber-100 text-amber-700",
  brave: "bg-purple-100 text-purple-700",
};

const difficultyLabels = {
  easy: "🌱 Easy",
  medium: "🌿 Moderate",
  brave: "🔥 Brave",
};

export default function SparkChallengeCard({
  challenge,
  onAccept,
  onComplete,
  onSkip,
}: SparkChallengeCardProps) {
  const { template, status, patternDescription } = challenge;

  return (
    <div className="card-static overflow-hidden">
      {/* Header with category color */}
      <div
        className="px-5 py-3 flex items-center justify-between"
        style={{
          background: `linear-gradient(135deg, #E2876615 0%, #F59E0B15 100%)`,
        }}
      >
        <div className="flex items-center gap-2">
          <Flame className="w-4 h-4 text-terracotta-500" />
          <span className="text-sm font-semibold text-coffee-800">
            Spark Challenge
          </span>
        </div>
        <span
          className={`text-xs px-2 py-0.5 rounded-full font-medium ${
            difficultyColors[template.difficulty]
          }`}
        >
          {difficultyLabels[template.difficulty]}
        </span>
      </div>

      <div className="p-5">
        {/* Pattern that triggered this */}
        <div className="bg-cream-100 rounded-lg p-3 mb-4">
          <p className="text-xs text-warm-gray italic">
            💡 Triggered by: {patternDescription}
          </p>
        </div>

        {/* Challenge content */}
        <div className="flex items-start gap-4 mb-4">
          <div className="w-12 h-12 bg-terracotta-500/10 rounded-xl flex items-center justify-center text-2xl shrink-0">
            {template.emoji}
          </div>
          <div className="flex-1">
            <h3 className="font-serif font-semibold text-coffee-800 mb-1">
              {template.title}
            </h3>
            <p className="text-sm text-warm-gray leading-relaxed mb-3">
              {template.description}
            </p>

            {/* The action */}
            <div className="bg-white rounded-xl p-4 border border-cream-200 mb-3">
              <div className="flex items-start gap-2">
                <Target className="w-4 h-4 text-terracotta-500 mt-0.5 shrink-0" />
                <p className="text-sm text-coffee-800 leading-relaxed">
                  {template.action}
                </p>
              </div>
            </div>

            {/* Duration */}
            <div className="flex items-center gap-2 text-xs text-warm-gray">
              <Clock className="w-3 h-3" />
              <span>{template.duration}</span>
            </div>
          </div>
        </div>

        {/* Actions based on status */}
        {status === "suggested" && (
          <div className="flex gap-2">
            <button
              onClick={onAccept}
              className="btn-primary flex-1 text-sm flex items-center justify-center gap-2"
            >
              <Flame className="w-4 h-4" />
              Accept Challenge
            </button>
            <button onClick={onSkip} className="btn-ghost text-sm">
              Not now
            </button>
          </div>
        )}

        {status === "accepted" && (
          <div className="flex gap-2">
            <button
              onClick={onComplete}
              className="btn-primary flex-1 text-sm flex items-center justify-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4" />
              Mark as Completed
            </button>
          </div>
        )}

        {status === "completed" && (
          <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-center">
            <CheckCircle2 className="w-6 h-6 text-green-500 mx-auto mb-2" />
            <p className="text-sm font-medium text-green-700">
              Challenge completed! 🔥
            </p>
            <p className="text-xs text-green-600 mt-1">
              Your Identity Graph has been updated.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}