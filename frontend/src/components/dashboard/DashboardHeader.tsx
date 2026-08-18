"use client";

import { Trophy, Flame } from "lucide-react";

export default function DashboardHeader() {
  const userName = "Alex"; // In production, get from auth

  return (
    <header className="bg-white border-b border-cream-200 sticky top-0 z-40">
      <div className="max-w-6xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Left: Title */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-terracotta-500 rounded-xl flex items-center justify-center">
              <Trophy className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="font-serif font-bold text-coffee-800 text-lg">
                Your Triumph Board
              </h1>
              <p className="text-xs text-warm-light">
                Every small step is a victory worth celebrating
              </p>
            </div>
          </div>

          {/* Right: Streak */}
          <div className="flex items-center gap-2 bg-terracotta-500/10 px-4 py-2 rounded-full">
            <Flame className="w-5 h-5 text-terracotta-500" />
            <span className="font-bold text-terracotta-600">7 days</span>
          </div>
        </div>
      </div>
    </header>
  );
}