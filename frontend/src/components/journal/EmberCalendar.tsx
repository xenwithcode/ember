// frontend/src/components/journal/EmberCalendar.tsx

"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { JournalEntry } from "@/hooks/useJournalStorage";

interface EmberCalendarProps {
  entries: JournalEntry[];
  onSelectDate: (date: string) => void;
  selectedDate: string | null;
}

export default function EmberCalendar({
  entries,
  onSelectDate,
  selectedDate,
}: EmberCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  // Build map of date → entries for quick lookup
  const entriesByDate = new Map<string, JournalEntry[]>();
  entries.forEach((entry) => {
    const existing = entriesByDate.get(entry.date) || [];
    existing.push(entry);
    entriesByDate.set(entry.date, existing);
  });

  // Get days in current month
  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const daysInMonth = lastDay.getDate();

  // Day of week (0 = Sunday, adjust for Monday start)
  const startDayOfWeek = (firstDay.getDay() + 6) % 7;

  const today = new Date().toISOString().split("T")[0];

  const handlePrevMonth = () => {
    setCurrentMonth(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(new Date(year, month + 1, 1));
  };

  const monthName = currentMonth.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  const weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  // Calculate average intensity for a day (0-100)
  const getDayIntensity = (dateStr: string): number => {
    const dayEntries = entriesByDate.get(dateStr);
    if (!dayEntries || dayEntries.length === 0) return 0;
    const avg =
      dayEntries.reduce((sum, e) => sum + e.intensity, 0) / dayEntries.length;
    return Math.round(avg);
  };

  // Render a single day cell
  const renderDay = (dayNumber: number) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(
      dayNumber
    ).padStart(2, "0")}`;
    const dayEntries = entriesByDate.get(dateStr);
    const hasEntry = !!dayEntries && dayEntries.length > 0;
    const intensity = getDayIntensity(dateStr);
    const isToday = dateStr === today;
    const isSelected = dateStr === selectedDate;

    // Ember visual based on intensity
    // 0 = no ember, 20-40 = faint, 40-70 = warm, 70-100 = bright
    const getEmberStyle = () => {
      if (!hasEntry) {
        return {
          backgroundColor: "transparent",
          opacity: 0.3,
        };
      }
      // Color transitions from terracotta (warm) to amber (bright)
      const normalizedIntensity = intensity / 100;
      const r = Math.round(226 + (245 - 226) * normalizedIntensity);
      const g = Math.round(135 + (158 - 135) * normalizedIntensity);
      const b = Math.round(102 + (11 - 102) * normalizedIntensity);
      const color = `rgb(${r}, ${g}, ${b})`;
      const glow = 10 + normalizedIntensity * 20;

      return {
        backgroundColor: color,
        boxShadow: `0 0 ${glow}px ${color}`,
        opacity: 0.5 + normalizedIntensity * 0.5,
      };
    };

    return (
      <button
        key={dayNumber}
        onClick={() => hasEntry && onSelectDate(dateStr)}
        disabled={!hasEntry}
        className={`
          relative aspect-square flex flex-col items-center justify-center
          rounded-lg transition-all duration-200
          ${hasEntry ? "cursor-pointer hover:scale-105" : "cursor-default"}
          ${isSelected ? "ring-2 ring-terracotta-500 ring-offset-2" : ""}
          ${isToday && !hasEntry ? "ring-1 ring-terracotta-500/30" : ""}
        `}
      >
        {/* Ember circle */}
        {hasEntry && (
          <div
            className="absolute inset-2 rounded-full transition-all duration-500"
            style={getEmberStyle()}
          />
        )}

        {/* Day number */}
        <span
          className={`
            relative z-10 text-sm font-medium
            ${hasEntry ? "text-white font-semibold" : "text-warm-light"}
            ${isToday ? "font-bold" : ""}
          `}
        >
          {dayNumber}
        </span>

        {/* Entry count indicator */}
        {hasEntry && dayEntries!.length > 1 && (
          <span className="relative z-10 text-[9px] text-white/80 font-medium -mt-0.5">
            ×{dayEntries!.length}
          </span>
        )}
      </button>
    );
  };

  return (
    <div className="card-static p-6">
      {/* Month navigation */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={handlePrevMonth}
          className="p-2 hover:bg-cream-200 rounded-lg transition-colors"
        >
          <ChevronLeft className="w-5 h-5 text-warm-gray" />
        </button>
        <h3 className="font-serif text-xl font-semibold text-coffee-800">
          {monthName}
        </h3>
        <button
          onClick={handleNextMonth}
          className="p-2 hover:bg-cream-200 rounded-lg transition-colors"
        >
          <ChevronRight className="w-5 h-5 text-warm-gray" />
        </button>
      </div>

      {/* Weekday headers */}
      <div className="grid grid-cols-7 gap-2 mb-2">
        {weekDays.map((day) => (
          <div
            key={day}
            className="text-center text-xs font-medium text-warm-light py-2"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-2">
        {/* Empty cells before first day */}
        {Array.from({ length: startDayOfWeek }).map((_, i) => (
          <div key={`empty-${i}`} className="aspect-square" />
        ))}

        {/* Day cells */}
        {Array.from({ length: daysInMonth }).map((_, i) =>
          renderDay(i + 1)
        )}
      </div>

      {/* Legend */}
      <div className="mt-6 pt-4 border-t border-cream-200">
        <div className="flex items-center justify-between text-xs text-warm-gray">
          <span>Entry depth:</span>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-full bg-[#E28766] opacity-60" />
              <span>Light</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-full bg-[#E9A088]" />
              <span>Warm</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-full bg-[#F59E0B] shadow-glow" />
              <span>Bright</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}