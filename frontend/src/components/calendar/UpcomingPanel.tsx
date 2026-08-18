"use client";

import { Calendar, MapPin, Clock, ArrowRight } from "lucide-react";
import { getUpcomingEvents, CalendarEvent } from "@/data/calendarEvents";

export default function UpcomingPanel() {
  const upcomingEvents = getUpcomingEvents();

  return (
    <div className="card-static p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-serif font-semibold text-coffee-800">
          Upcoming
        </h2>
        <span className="badge bg-terracotta-500/10 text-terracotta-600">
          {upcomingEvents.length} activities
        </span>
      </div>

      <div className="space-y-4">
        {upcomingEvents.map((event) => (
          <div
            key={event.id}
            className="flex items-start gap-3 p-3 bg-cream-50 rounded-xl hover:bg-cream-100 transition-colors cursor-pointer group"
          >
            {/* Emoji */}
            <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center text-lg shadow-sm shrink-0">
              {event.emoji}
            </div>

            {/* Details */}
            <div className="flex-1 min-w-0">
              <h3 className="font-medium text-coffee-800 text-sm truncate group-hover:text-terracotta-600 transition-colors">
                {event.title}
              </h3>
              <div className="flex items-center gap-2 text-xs text-warm-gray mt-1">
                <Clock className="w-3 h-3" />
                <span>
                  {formatDate(event.date)} • {event.startTime}
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs text-warm-gray mt-0.5">
                <MapPin className="w-3 h-3" />
                <span className="truncate">{event.location}</span>
              </div>
            </div>

            {/* Arrow */}
            <ArrowRight className="w-4 h-4 text-warm-light group-hover:text-terracotta-500 transition-colors shrink-0 mt-1" />
          </div>
        ))}

        {upcomingEvents.length === 0 && (
          <div className="text-center py-8">
            <p className="text-warm-gray text-sm">No upcoming activities</p>
            <button className="text-terracotta-600 text-sm font-medium mt-2 hover:text-terracotta-700">
              Discover activities →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr + "T00:00:00");
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  if (date.toDateString() === today.toDateString()) {
    return "Today";
  } else if (date.toDateString() === tomorrow.toDateString()) {
    return "Tomorrow";
  } else {
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  }
}