export interface CalendarEvent {
  id: string;
  title: string;
  date: string; // ISO format: YYYY-MM-DD
  startTime: string;
  endTime: string;
  category: string;
  emoji: string;
  location: string;
  status: "upcoming" | "today" | "completed" | "missed";
  mood?: string;
  reflection?: string;
}

export const mockCalendarEvents: CalendarEvent[] = [
  // Upcoming
  {
    id: "1",
    title: "Sunrise Meditation",
    date: "2026-08-14",
    startTime: "06:30",
    endTime: "07:00",
    category: "mindfulness",
    emoji: "🧘",
    location: "Prospect Park",
    status: "upcoming",
  },
  {
    id: "2",
    title: "Beginner Watercolor",
    date: "2026-08-16",
    startTime: "10:00",
    endTime: "12:00",
    category: "creative",
    emoji: "🎨",
    location: "Brooklyn Art Studio",
    status: "upcoming",
  },
  {
    id: "3",
    title: "Board Game Night",
    date: "2026-08-21",
    startTime: "18:00",
    endTime: "21:00",
    category: "social",
    emoji: "🎲",
    location: "The Game Table Café",
    status: "upcoming",
  },
  {
    id: "4",
    title: "Beginner Hiking",
    date: "2026-08-17",
    startTime: "09:00",
    endTime: "12:00",
    category: "physical",
    emoji: "🥾",
    location: "Harriman State Park",
    status: "upcoming",
  },
  
  // Completed (past)
  {
    id: "5",
    title: "Community Garden",
    date: "2026-08-10",
    startTime: "09:00",
    endTime: "12:00",
    category: "volunteer",
    emoji: "🌱",
    location: "Green Thumb Garden",
    status: "completed",
    mood: "😊",
    reflection: "Felt peaceful working with the soil. Met a nice elderly gardener.",
  },
  {
    id: "6",
    title: "Book Club: First Chapters",
    date: "2026-08-08",
    startTime: "17:00",
    endTime: "18:30",
    category: "intellectual",
    emoji: "📚",
    location: "The Cozy Corner",
    status: "completed",
    mood: "😌",
    reflection: "Enjoyed discussing the opening. No pressure to finish the book.",
  },
  {
    id: "7",
    title: "Morning Walk & Coffee",
    date: "2026-08-05",
    startTime: "08:00",
    endTime: "09:00",
    category: "physical",
    emoji: "☕",
    location: "Central Park",
    status: "completed",
    mood: "🙂",
    reflection: "Nice to just be present without my phone.",
  },
];

// Helper: Get events for a specific date
export function getEventsForDate(date: string): CalendarEvent[] {
  return mockCalendarEvents.filter((event) => event.date === date);
}

// Helper: Get upcoming events
export function getUpcomingEvents(): CalendarEvent[] {
  return mockCalendarEvents
    .filter((event) => event.status === "upcoming" || event.status === "today")
    .sort((a, b) => a.date.localeCompare(b.date));
}

// Helper: Get completed events
export function getCompletedEvents(): CalendarEvent[] {
  return mockCalendarEvents.filter((event) => event.status === "completed");
}