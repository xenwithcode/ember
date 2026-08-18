"use client";

import { Flame, CheckCircle2, TrendingUp, Star } from "lucide-react";
import { getCompletedEvents } from "@/data/calendarEvents";

export default function ProgressStats() {
  const completedEvents = getCompletedEvents();

  const stats = {
    streakDays: 3,
    completedCount: completedEvents.length,
    moodImprovement: "+23%",
    categoriesExplored: 4,
  };

  return (
    <div className="card-static p-6">
      <h2 className="font-serif font-semibold text-coffee-800 mb-4">
        Your Progress
      </h2>

      <div className="grid grid-cols-2 gap-4">
        {/* Streak */}
        <div className="bg-terracotta-500/10 rounded-xl p-4 text-center">
          <Flame className="w-6 h-6 text-terracotta-500 mx-auto mb-2" />
          <p className="text-2xl font-bold text-terracotta-600">
            {stats.streakDays}
          </p>
          <p className="text-xs text-warm-gray mt-1">Day streak</p>
        </div>

        {/* Completed */}
        <div className="bg-green-500/10 rounded-xl p-4 text-center">
          <CheckCircle2 className="w-6 h-6 text-green-600 mx-auto mb-2" />
          <p className="text-2xl font-bold text-green-600">
            {stats.completedCount}
          </p>
          <p className="text-xs text-warm-gray mt-1">Activities done</p>
        </div>

        {/* Mood improvement */}
        <div className="bg-purple-500/10 rounded-xl p-4 text-center">
          <TrendingUp className="w-6 h-6 text-purple-600 mx-auto mb-2" />
          <p className="text-2xl font-bold text-purple-600">
            {stats.moodImprovement}
          </p>
          <p className="text-xs text-warm-gray mt-1">Mood boost</p>
        </div>

        {/* Categories */}
        <div className="bg-amber-500/10 rounded-xl p-4 text-center">
          <Star className="w-6 h-6 text-amber-600 mx-auto mb-2" />
          <p className="text-2xl font-bold text-amber-600">
            {stats.categoriesExplored}
          </p>
          <p className="text-xs text-warm-gray mt-1">Categories tried</p>
        </div>
      </div>

      {/* Motivational quote */}
      <div className="mt-6 bg-cream-100 rounded-xl p-4 text-center">
        <p className="font-hand text-lg text-coffee-800">
          &ldquo;Small steps every day add up to big changes.&rdquo;
        </p>
      </div>
    </div>
  );
}