// frontend/src/components/journal/EntryCard.tsx

"use client";

import { Clock, FileText, Sparkles } from "lucide-react";
import { JournalEntry } from "@/hooks/useJournalStorage";
import { emotionLabels, emotionColors } from "@/hooks/useEmberAnalysis";

interface EntryCardProps {
  entry: JournalEntry;
  onOpen: (entry: JournalEntry) => void;
}

export default function EntryCard({ entry, onOpen }: EntryCardProps) {
  const formattedDate = new Date(entry.timestamp).toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  const formattedTime = new Date(entry.timestamp).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });

  // Preview of the text (first 120 chars)
  const preview =
    entry.text.length > 120
      ? entry.text.substring(0, 120).trim() + "..."
      : entry.text;

  // Get top 2 emotions
  const topEmotions = (
    Object.entries(entry.emotionScores) as [keyof typeof entry.emotionScores, number][]
  )
    .filter(([, score]) => score > 0)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 2)
    .map(([emotion]) => emotion as keyof typeof entry.emotionScores);

  return (
    <button
      onClick={() => onOpen(entry)}
      className="w-full card p-5 text-left hover:shadow-warm-lg hover:-translate-y-1 transition-all duration-300"
    >
      {/* Header: Ritual + Date */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-terracotta-500/10 flex items-center justify-center text-lg shrink-0">
            {entry.ritualEmoji}
          </div>
          <div>
            <h3 className="font-serif font-semibold text-coffee-800 text-sm">
              {entry.ritualName}
            </h3>
            <p className="text-xs text-warm-light">
              {formattedDate} • {formattedTime}
            </p>
          </div>
        </div>

        {/* Intensity indicator */}
        <div
          className="w-8 h-8 rounded-full shrink-0"
          style={{
            background: `radial-gradient(circle, #F59E0B 0%, #E28766 70%, transparent 100%)`,
            opacity: 0.4 + (entry.intensity / 100) * 0.6,
            boxShadow: `0 0 ${entry.intensity / 5}px #E28766`,
          }}
          title={`Depth: ${entry.intensity}/100`}
        />
      </div>

      {/* Text preview */}
      <p className="font-serif italic text-coffee-800 text-sm leading-relaxed mb-4 line-clamp-3">
        &ldquo;{preview}&rdquo;
      </p>

      {/* Footer: emotions + stats */}
      <div className="flex items-center justify-between pt-3 border-t border-cream-200">
        <div className="flex items-center gap-2 flex-wrap">
          {topEmotions.map((emotion) => (
            <span
              key={emotion}
              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium"
              style={{
                backgroundColor: `${emotionColors[emotion]}20`,
                color: emotionColors[emotion],
              }}
            >
              {emotionLabels[emotion]}
            </span>
          ))}
          {entry.sparkChallengeId && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-amber-100 text-amber-700">
              <Sparkles className="w-2.5 h-2.5" />
              Spark
            </span>
          )}
        </div>

        <div className="flex items-center gap-3 text-xs text-warm-light shrink-0">
          <span className="flex items-center gap-1">
            <FileText className="w-3 h-3" />
            {entry.wordCount}
          </span>
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {Math.floor(entry.writingTimeSeconds / 60)}m
          </span>
        </div>
      </div>
    </button>
  );
}