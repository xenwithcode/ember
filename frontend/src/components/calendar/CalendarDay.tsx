"use client";

import { format, isToday } from "date-fns";
import { CalendarEvent } from "@/data/calendarEvents";

interface CalendarDayProps {
  date: Date;
  events: CalendarEvent[];
  isCurrentMonth: boolean;
  isToday: boolean;
  isSelected: boolean;
  onSelect: () => void;
}

const categoryColors: Record<string, string> = {
  creative: "bg-purple-400",
  physical: "bg-green-400",
  social: "bg-blue-400",
  intellectual: "bg-amber-400",
  volunteer: "bg-rose-400",
  nature: "bg-emerald-400",
  mindfulness: "bg-indigo-400",
  student: "bg-cyan-400",
};

export default function CalendarDay({
  date,
  events,
  isCurrentMonth,
  isToday,
  isSelected,
  onSelect,
}: CalendarDayProps) {
  const dayNumber = format(date, "d");

  return (
    <button
      onClick={onSelect}
      className={`
        min-h-[100px] p-2 border-b border-r border-cream-200 text-left
        transition-all duration-200 hover:bg-cream-50
        ${!isCurrentMonth ? "bg-cream-100/50" : ""}
        ${isSelected ? "bg-terracotta-500/5 ring-2 ring-inset ring-terracotta-500/30" : ""}
      `}
    >
      {/* Day number */}
      <div className="mb-2">
        <span
          className={`
            inline-flex items-center justify-center w-7 h-7 rounded-full text-sm font-serif
            ${isToday
              ? "bg-terracotta-500 text-white font-bold"
              : isCurrentMonth
              ? "text-coffee-800"
              : "text-warm-light"
            }
          `}
        >
          {dayNumber}
        </span>
      </div>

      {/* Events */}
      <div className="space-y-1">
        {events.slice(0, 3).map((event) => (
          <div
            key={event.id}
            className={`
              flex items-center gap-1 px-2 py-1 rounded-lg text-xs
              ${event.status === "completed"
                ? "bg-green-50 text-green-700"
                : "bg-white shadow-sm border border-cream-200"
              }
            `}
          >
            <span>{event.emoji}</span>
            <span className="truncate font-medium">{event.title}</span>
            {event.status === "completed" && (
              <span className="ml-auto">✓</span>
            )}
          </div>
        ))}

        {/* More events indicator */}
        {events.length > 3 && (
          <div className="text-xs text-warm-light pl-2">
            +{events.length - 3} more
          </div>
        )}
      </div>

      {/* Empty state for days with no events */}
      {events.length === 0 && isCurrentMonth && (
        <div className="opacity-0 hover:opacity-100 transition-opacity">
          <span className="text-xs text-warm-light">+ Add</span>
        </div>
      )}
    </button>
  );
}