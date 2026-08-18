"use client";

interface EmotionChipsProps {
  emotions: string[];
}

const emotionConfig: Record<
  string,
  { label: string; className: string; emoji: string }
> = {
  anxiety: {
    label: "Anxiety",
    className: "bg-purple-100 text-purple-700",
    emoji: "😰",
  },
  sadness: {
    label: "Sadness",
    className: "bg-blue-100 text-blue-700",
    emoji: "😔",
  },
  comparison: {
    label: "Comparison",
    className: "bg-orange-100 text-orange-700",
    emoji: "🪞",
  },
  hope: {
    label: "Hope",
    className: "bg-green-100 text-green-700",
    emoji: "🌱",
  },
  reflection: {
    label: "Reflection",
    className: "bg-cream-200 text-warm-gray",
    emoji: "💭",
  },
};

export default function EmotionChips({ emotions }: EmotionChipsProps) {
  if (emotions.length === 0) return null;

  return (
    <div className="mt-3 pt-3 border-t border-cream-200">
      <p className="text-xs text-warm-light mb-2">Emotions detected:</p>
      <div className="flex flex-wrap gap-2">
        {emotions.map((emotion) => {
          const config = emotionConfig[emotion] || emotionConfig.reflection;
          return (
            <span
              key={emotion}
              className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${config.className}`}
            >
              <span>{config.emoji}</span>
              {config.label}
            </span>
          );
        })}
      </div>
    </div>
  );
}