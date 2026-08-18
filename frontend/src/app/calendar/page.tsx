"use client";

import { useState } from "react";
import { Calendar, Plus, ChevronLeft, ChevronRight } from "lucide-react";
import CalendarHeader from "@/components/calendar/CalendarHeader";
import CalendarGrid from "@/components/calendar/CalendarGrid";
import UpcomingPanel from "@/components/calendar/UpcomingPanel";
import MoodCheckIn from "@/components/calendar/MoodCheckIn";
import ProgressStats from "@/components/calendar/ProgressStats";
import { mockCalendarEvents } from "@/data/calendarEvents";
import MainLayout from "@/components/layout/MainLayout";

export default function CalendarPage() {
  const [currentMonth, setCurrentMonth] = useState(new Date(2026, 7, 1)); // August 2026
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const handlePrevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  return (
    <MainLayout>
    <div className="min-h-screen">
      {/* Header */}
      <CalendarHeader
        currentMonth={currentMonth}
        onPrevMonth={handlePrevMonth}
        onNextMonth={handleNextMonth}
      />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Calendar Grid (2 columns) */}
          <div className="lg:col-span-2">
            <CalendarGrid
              currentMonth={currentMonth}
              events={mockCalendarEvents}
              selectedDate={selectedDate}
              onSelectDate={setSelectedDate}
            />

            {/* Mood Check-in */}
            <div className="mt-6">
              <MoodCheckIn />
            </div>
          </div>

          {/* Right: Sidebar (1 column) */}
          <div className="lg:col-span-1 space-y-6">
            {/* Progress Stats */}
            <ProgressStats />

            {/* Upcoming Activities */}
            <UpcomingPanel />
          </div>
        </div>
      </div>
    </div>
    </MainLayout>
  );
}