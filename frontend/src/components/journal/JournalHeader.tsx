"use client";

import { Sparkles, Flame, BookOpen } from "lucide-react";

interface JournalHeaderProps {
  streakDays: number;
  entryCount: number;
}

export default function JournalHeader({
  streakDays,
  entryCount,
}: JournalHeaderProps) {
  return (
    <header className="bg-white border-b border-cream-200">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Left: Title */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-terracotta-500 rounded-xl flex items-center justify-center">
            <BookOpen className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="font-serif font-bold text-coffee-800 text-lg leading-tight">
              Your Journal
            </h1>
            <p className="text-xs text-warm-light">
              Private. Safe. Just for you.
            </p>
          </div>
        </div>

        {/* Right: Stats */}
        <div className="flex items-center gap-4">
          {/* Streak */}
          <div className="flex items-center gap-2 bg-terracotta-500/10 px-4 py-2 rounded-full">
            <Flame className="w-4 h-4 text-terracotta-500" />
            <span className="text-sm font-medium text-coffee-800">
              {streakDays} day{streakDays !== 1 ? "s" : ""} streak
            </span>
          </div>

          {/* Entry count */}
          <div className="hidden sm:flex items-center gap-2 text-warm-gray text-sm">
            <BookOpen className="w-4 h-4" />
            <span>{entryCount} entries this session</span>
          </div>
        </div>
      </div>
    </header>
  );
}