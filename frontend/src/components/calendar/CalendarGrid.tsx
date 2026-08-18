"use client";

import { useState } from "react";
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  isToday,
} from "date-fns";
import CalendarDay from "./CalendarDay";
import { CalendarEvent } from "@/data/calendarEvents";

interface CalendarGridProps {
  currentMonth: Date;
  events: CalendarEvent[];
  selectedDate: string | null;
  onSelectDate: (date: string | null) => void;
}

const weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export default function CalendarGrid({
  currentMonth,
  events,
  selectedDate,
  onSelectDate,
}: CalendarGridProps) {
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const calendarStart = startOfWeek(monthStart, { weekStartsOn: 1 });
  const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });

  const days = eachDayOfInterval({ start: calendarStart, end: calendarEnd });

  return (
    <div className="card-static overflow-hidden">
      {/* Week day headers */}
      <div className="grid grid-cols-7 border-b border-cream-200">
        {weekDays.map((day) => (
          <div
            key={day}
            className="py-3 text-center text-sm font-medium text-warm-gray"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Days grid */}
      <div className="grid grid-cols-7">
        {days.map((day) => {
          const dateStr = format(day, "yyyy-MM-dd");
          const dayEvents = events.filter((event) => event.date === dateStr);
          const isCurrentMonth = isSameMonth(day, currentMonth);
          const isTodayDate = isToday(day);
          const isSelected = selectedDate === dateStr;

          return (
            <CalendarDay
              key={dateStr}
              date={day}
              events={dayEvents}
              isCurrentMonth={isCurrentMonth}
              isToday={isTodayDate}
              isSelected={isSelected}
              onSelect={() => onSelectDate(isSelected ? null : dateStr)}
            />
          );
        })}
      </div>
    </div>
  );
}