// frontend/src/components/journal/PastEmbersView.tsx

"use client";

import { useState } from "react";
import { ArrowLeft, BookOpen, Flame, Sparkles, Calendar } from "lucide-react";
import EmberCalendar from "./EmberCalendar";
import EntryCard from "./EntryCard";
import EntryDetailModal from "./EntryDetailModal";
import { JournalEntry } from "@/hooks/useJournalStorage";

interface PastEmbersViewProps {
  entries: JournalEntry[];
  stats: {
    totalEntries: number;
    totalWords: number;
    totalWritingMinutes: number;
    currentStreak: number;
    longestStreak: number;
    uniqueRituals: number;
    daysWritten: number;
  };
  onBack: () => void;
  onDeleteEntry: (entryId: string) => void;
}

export default function PastEmbersView({
  entries,
  stats,
  onBack,
  onDeleteEntry,
}: PastEmbersViewProps) {
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedEntry, setSelectedEntry] = useState<JournalEntry | null>(null);

  // Filter entries by selected date if any
  const displayedEntries = selectedDate
    ? entries.filter((e) => e.date === selectedDate)
    : entries;

  return (
    <div className="min-h-screen bg-cream-100">
      {/* Header */}
      <header className="bg-white border-b border-cream-200 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={onBack}
              className="p-2 hover:bg-cream-200 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-warm-gray" />
            </button>
            <div className="w-10 h-10 bg-terracotta-500 rounded-xl flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="font-serif font-bold text-coffee-800 text-lg">
                Past Embers
              </h1>
              <p className="text-xs text-warm-light">
                Your journal, glowing through time
              </p>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Stats row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8 animate-fade-in-up">
          <div className="card-static p-4 text-center">
            <Flame className="w-5 h-5 text-terracotta-500 mx-auto mb-2" />
            <p className="text-2xl font-bold text-terracotta-600">
              {stats.currentStreak}
            </p>
            <p className="text-xs text-warm-gray">Current streak</p>
          </div>
          <div className="card-static p-4 text-center">
            <BookOpen className="w-5 h-5 text-terracotta-500 mx-auto mb-2" />
            <p className="text-2xl font-bold text-terracotta-600">
              {stats.totalEntries}
            </p>
            <p className="text-xs text-warm-gray">Entries written</p>
          </div>
          <div className="card-static p-4 text-center">
            <Sparkles className="w-5 h-5 text-terracotta-500 mx-auto mb-2" />
            <p className="text-2xl font-bold text-terracotta-600">
              {stats.totalWords.toLocaleString()}
            </p>
            <p className="text-xs text-warm-gray">Total words</p>
          </div>
          <div className="card-static p-4 text-center">
            <Calendar className="w-5 h-5 text-terracotta-500 mx-auto mb-2" />
            <p className="text-2xl font-bold text-terracotta-600">
              {stats.daysWritten}
            </p>
            <p className="text-xs text-warm-gray">Days journaled</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Calendar (2 cols) */}
          <div className="lg:col-span-2 animate-fade-in-up stagger-1">
            <EmberCalendar
              entries={entries}
              selectedDate={selectedDate}
              onSelectDate={(date) =>
                setSelectedDate(date === selectedDate ? null : date)
              }
            />

            {selectedDate && (
              <div className="mt-4 card-static p-4">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-medium text-coffee-800">
                    Viewing:{" "}
                    {new Date(selectedDate + "T00:00:00").toLocaleDateString(
                      "en-US",
                      {
                        weekday: "short",
                        month: "short",
                        day: "numeric",
                      }
                    )}
                  </p>
                  <button
                    onClick={() => setSelectedDate(null)}
                    className="text-xs text-terracotta-600 hover:text-terracotta-700"
                  >
                    Show all
                  </button>
                </div>
                <p className="text-xs text-warm-gray">
                  {displayedEntries.length} entr
                  {displayedEntries.length === 1 ? "y" : "ies"} on this day
                </p>
              </div>
            )}
          </div>

          {/* Entries list (3 cols) */}
          <div className="lg:col-span-3 animate-fade-in-up stagger-2">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-serif text-xl font-semibold text-coffee-800">
                {selectedDate ? "Entries on this day" : "Recent entries"}
              </h2>
              <span className="text-sm text-warm-gray">
                {displayedEntries.length} entr
                {displayedEntries.length === 1 ? "y" : "ies"}
              </span>
            </div>

            {displayedEntries.length === 0 ? (
              <div className="card-static p-12 text-center">
                <div className="w-16 h-16 bg-cream-200 rounded-full flex items-center justify-center mx-auto mb-4">
                  <BookOpen className="w-8 h-8 text-warm-light" />
                </div>
                <h3 className="font-serif text-lg font-medium text-coffee-800 mb-2">
                  {selectedDate
                    ? "No entries on this day"
                    : "Your journal is empty"}
                </h3>
                <p className="text-sm text-warm-gray max-w-sm mx-auto">
                  {selectedDate
                    ? "Try selecting another day, or write something today."
                    : "Your first ember is waiting to be lit. Start by writing in your journal."}
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {displayedEntries.map((entry) => (
                  <EntryCard
                    key={entry.id}
                    entry={entry}
                    onOpen={setSelectedEntry}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Entry detail modal */}
      <EntryDetailModal
        entry={selectedEntry}
        onClose={() => setSelectedEntry(null)}
        onDelete={onDeleteEntry}
      />
    </div>
  );
}