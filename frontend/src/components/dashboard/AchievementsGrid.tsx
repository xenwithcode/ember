"use client";

import { Lock, CheckCircle2 } from "lucide-react";
import { Achievement } from "@/data/dashboard";

interface AchievementsGridProps {
  achievements: Achievement[];
}

export default function AchievementsGrid({ achievements }: AchievementsGridProps) {
  const unlockedCount = achievements.filter((a) => a.unlocked).length;

  return (
    <div>
      {/* Progress bar */}
      <div className="mb-6">
        <div className="flex items-center justify-between text-sm mb-2">
          <span className="text-warm-gray">
            {unlockedCount} of {achievements.length} unlocked
          </span>
          <span className="font-medium text-terracotta-600">
            {Math.round((unlockedCount / achievements.length) * 100)}%
          </span>
        </div>
        <div className="h-2 bg-cream-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-terracotta-500 rounded-full transition-all duration-500"
            style={{ width: `${(unlockedCount / achievements.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Achievements grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {achievements.map((achievement) => (
          <div
            key={achievement.id}
            className={`
              card-static p-4 text-center transition-all duration-300
              ${achievement.unlocked
                ? "hover:shadow-warm-lg hover:-translate-y-1"
                : "opacity-60 grayscale"
              }
            `}
          >
            {/* Emoji */}
            <div className="text-4xl mb-3">
              {achievement.unlocked ? achievement.emoji : "🔒"}
            </div>

            {/* Title */}
            <h3 className="font-serif font-semibold text-coffee-800 text-sm mb-1">
              {achievement.title}
            </h3>

            {/* Description */}
            <p className="text-xs text-warm-gray mb-3">
              {achievement.description}
            </p>

            {/* Status */}
            {achievement.unlocked ? (
              <div className="flex items-center justify-center gap-1 text-green-600">
                <CheckCircle2 className="w-4 h-4" />
                <span className="text-xs font-medium">
                  {achievement.unlockedDate
                    ? new Date(achievement.unlockedDate).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })
                    : "Unlocked"}
                </span>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="h-1.5 bg-cream-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-terracotta-500/50 rounded-full"
                    style={{ width: `${achievement.progress || 0}%` }}
                  />
                </div>
                <span className="text-xs text-warm-light">
                  {achievement.progress || 0}% complete
                </span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}