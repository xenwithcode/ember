"use client";

import { Calendar, Plus, ChevronLeft, ChevronRight } from "lucide-react";

interface CalendarHeaderProps {
  currentMonth: Date;
  onPrevMonth: () => void;
  onNextMonth: () => void;
}

export default function CalendarHeader({
  currentMonth,
  onPrevMonth,
  onNextMonth,
}: CalendarHeaderProps) {
  const monthName = currentMonth.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  return (
    <header className="bg-white border-b border-cream-200">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Left: Title */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-terracotta-500 rounded-xl flex items-center justify-center">
              <Calendar className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="font-serif font-bold text-coffee-800 text-lg">
                Your Calendar
              </h1>
              <p className="text-xs text-warm-light">
                Every checkmark is a victory
              </p>
            </div>
          </div>

          {/* Right: Month navigation + Add */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <button
                onClick={onPrevMonth}
                className="p-2 hover:bg-cream-200 rounded-lg transition-colors"
              >
                <ChevronLeft className="w-5 h-5 text-warm-gray" />
              </button>
              <span className="font-serif font-semibold text-coffee-800 min-w-[140px] text-center">
                {monthName}
              </span>
              <button
                onClick={onNextMonth}
                className="p-2 hover:bg-cream-200 rounded-lg transition-colors"
              >
                <ChevronRight className="w-5 h-5 text-warm-gray" />
              </button>
            </div>

            <button className="btn-primary flex items-center gap-2 text-sm">
              <Plus className="w-4 h-4" />
              Add Activity
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}