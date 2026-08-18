"use client";

import { useState } from "react";
import { Sparkles } from "lucide-react";

const moods = [
  { emoji: "😔", label: "Struggling", color: "bg-blue-100 border-blue-300" },
  { emoji: "😐", label: "Okay", color: "bg-yellow-100 border-yellow-300" },
  { emoji: "🙂", label: "Good", color: "bg-green-100 border-green-300" },
  { emoji: "😊", label: "Great", color: "bg-emerald-100 border-emerald-300" },
  { emoji: "🌟", label: "Amazing", color: "bg-amber-100 border-amber-300" },
];

export default function MoodCheckIn() {
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    if (selectedMood) {
      setSubmitted(true);
    }
  };

  if (submitted) {
    return (
      <div className="card-static p-6 bg-green-50 border-green-200">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
            <span className="text-white text-lg">✓</span>
          </div>
          <div>
            <h3 className="font-medium text-green-800">Mood logged!</h3>
            <p className="text-sm text-green-600">
              Thanks for checking in with yourself today.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="card-static p-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 bg-terracotta-500/10 rounded-xl flex items-center justify-center">
          <Sparkles className="w-5 h-5 text-terracotta-500" />
        </div>
        <div>
          <h3 className="font-serif font-semibold text-coffee-800">
            How are you feeling today?
          </h3>
          <p className="text-xs text-warm-light">
            A quick check-in helps your coach understand your journey
          </p>
        </div>
      </div>

      {/* Mood selector */}
      <div className="flex gap-3 mb-4">
        {moods.map((mood) => (
          <button
            key={mood.emoji}
            onClick={() => setSelectedMood(mood.emoji)}
            className={`
              flex flex-col items-center gap-1 p-3 rounded-xl border-2 transition-all duration-200
              ${selectedMood === mood.emoji
                ? `${mood.color} scale-110 shadow-warm`
                : "border-cream-200 hover:border-cream-300 hover:bg-cream-50"
              }
            `}
          >
            <span className="text-2xl">{mood.emoji}</span>
            <span className="text-xs text-warm-gray">{mood.label}</span>
          </button>
        ))}
      </div>

      {/* Submit */}
      <button
        onClick={handleSubmit}
        disabled={!selectedMood}
        className="btn-primary w-full"
      >
        Log Mood
      </button>
    </div>
  );
}