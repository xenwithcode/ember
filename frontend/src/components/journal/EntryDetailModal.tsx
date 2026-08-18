// frontend/src/components/journal/EntryDetailModal.tsx

"use client";

import { useEffect } from "react";
import { X, Clock, FileText, Trash2 } from "lucide-react";
import { JournalEntry } from "@/hooks/useJournalStorage";
import { emotionLabels, emotionColors } from "@/hooks/useEmberAnalysis";

interface EntryDetailModalProps {
  entry: JournalEntry | null;
  onClose: () => void;
  onDelete: (entryId: string) => void;
}

export default function EntryDetailModal({
  entry,
  onClose,
  onDelete,
}: EntryDetailModalProps) {
  // Close on ESC key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (entry) {
      window.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }
    return () => {
      window.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "";
    };
  }, [entry, onClose]);

  if (!entry) return null;

  const formattedDate = new Date(entry.timestamp).toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  const formattedTime = new Date(entry.timestamp).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });

  // All emotions with scores
  const emotions = (
    Object.entries(entry.emotionScores) as [keyof typeof entry.emotionScores, number][]
  )
    .filter(([, score]) => score > 0)
    .sort(([, a], [, b]) => b - a);

  const handleDelete = () => {
    if (
      confirm(
        "Are you sure you want to delete this entry? This cannot be undone."
      )
    ) {
      onDelete(entry.id);
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-coffee-900/70 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in"
      onClick={onClose}
    >
      <div
        className="bg-cream-100 rounded-3xl max-w-2xl w-full max-h-[85vh] overflow-hidden shadow-warm-xl flex flex-col animate-fade-in-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 border-b border-cream-200 flex items-start justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-terracotta-500/10 flex items-center justify-center text-2xl">
              {entry.ritualEmoji}
            </div>
            <div>
              <h2 className="font-serif text-xl font-semibold text-coffee-800">
                {entry.ritualName}
              </h2>
              <p className="text-sm text-warm-gray">
                {formattedDate} at {formattedTime}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleDelete}
              className="p-2 text-warm-light hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
              title="Delete entry"
            >
              <Trash2 className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-2 hover:bg-cream-200 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-warm-gray" />
            </button>
          </div>
        </div>

        {/* Content (scrollable) */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* The entry text */}
          <div className="bg-white rounded-2xl p-6 shadow-warm border border-cream-200 mb-6">
            <p className="font-serif text-lg leading-relaxed text-coffee-800 whitespace-pre-wrap">
              {entry.text}
            </p>
          </div>

          {/* Stats grid */}
          <div className="grid grid-cols-3 gap-3 mb-6">
            <div className="bg-white rounded-xl p-3 text-center border border-cream-200">
              <FileText className="w-4 h-4 text-terracotta-500 mx-auto mb-1" />
              <p className="text-lg font-bold text-coffee-800">
                {entry.wordCount}
              </p>
              <p className="text-xs text-warm-light">words</p>
            </div>
            <div className="bg-white rounded-xl p-3 text-center border border-cream-200">
              <Clock className="w-4 h-4 text-terracotta-500 mx-auto mb-1" />
              <p className="text-lg font-bold text-coffee-800">
                {Math.floor(entry.writingTimeSeconds / 60)}:
                {String(entry.writingTimeSeconds % 60).padStart(2, "0")}
              </p>
              <p className="text-xs text-warm-light">minutes</p>
            </div>
            <div className="bg-white rounded-xl p-3 text-center border border-cream-200">
              <div
                className="w-4 h-4 rounded-full mx-auto mb-1"
                style={{
                  background:
                    "radial-gradient(circle, #F59E0B 0%, #E28766 100%)",
                  boxShadow: `0 0 8px #E28766`,
                }}
              />
              <p className="text-lg font-bold text-coffee-800">
                {entry.intensity}
              </p>
              <p className="text-xs text-warm-light">depth</p>
            </div>
          </div>

          {/* Emotions detected */}
          {emotions.length > 0 && (
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-coffee-800 mb-3">
                Emotions detected
              </h3>
              <div className="space-y-2">
                {emotions.map(([emotion, score]) => {
                  const maxScore = Math.max(...emotions.map(([, s]) => s));
                  const percentage = (score / maxScore) * 100;
                  return (
                    <div key={emotion} className="flex items-center gap-3">
                      <span className="text-sm text-warm-gray w-20 shrink-0">
                        {emotionLabels[emotion as keyof typeof emotionLabels]}
                      </span>
                      <div className="flex-1 h-2 bg-cream-200 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-500"
                          style={{
                            width: `${percentage}%`,
                            backgroundColor:
                              emotionColors[emotion as keyof typeof emotionColors],
                          }}
                        />
                      </div>
                      <span className="text-xs text-warm-light w-8 text-right">
                        {score}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Agent response (if available) */}
          {entry.agentResponse && (
            <div className="bg-terracotta-500/5 rounded-2xl p-5 border border-terracotta-500/20">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 bg-terracotta-500 rounded-full flex items-center justify-center text-white text-sm">
                  ✨
                </div>
                <span className="text-sm font-medium text-terracotta-600">
                  Coach responded
                </span>
              </div>
              <p className="font-serif text-coffee-800 leading-relaxed whitespace-pre-wrap">
                {entry.agentResponse}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}