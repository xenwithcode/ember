// frontend/src/components/journal/LivingEmber.tsx

"use client";

import { useMemo } from "react";
import EmberFlame from "@/components/EmberFlame";
import { EmberState, emotionColors } from "@/hooks/useEmberAnalysis";

interface LivingEmberProps {
  emberState: EmberState;
  isActive: boolean;
}

function hexToRgb(hex: string): [number, number, number] {
  const clean = hex.replace("#", "");
  const value = parseInt(clean, 16);
  return [(value >> 16) & 255, (value >> 8) & 255, value & 255];
}

function mix(hex: string, target: string, amount: number): string {
  const from = hexToRgb(hex);
  const to = hexToRgb(target);
  const blended = from.map((c, i) => Math.round(c + (to[i] - c) * amount));
  return `rgb(${blended[0]}, ${blended[1]}, ${blended[2]})`;
}

export default function LivingEmber({ emberState, isActive }: LivingEmberProps) {
  const { intensity, dominantEmotion, wordCount, isDeepening } = emberState;

  // Scale: 0.4 (dim) to 1.0 (full brightness)
  const scale = 0.4 + (intensity / 100) * 0.6;

  // Flame grows with intensity: 56 px dim → 128 px vibrant
  const flameH = Math.round(56 + intensity * 0.72);

  // Color based on dominant emotion
  const color = emotionColors[dominantEmotion];

  // Derive a warm flame palette from the emotion color
  const outer: [string, string, string] = [
    mix(color, "#FFFFFF", 0.55),
    color,
    mix(color, "#1C100B", 0.55),
  ];
  const inner: [string, string] = [
    mix(color, "#FFFFFF", 0.75),
    mix(color, "#FFFFFF", 0.25),
  ];
  const [r, g, b] = hexToRgb(color);
  const glowColor = `rgba(${r}, ${g}, ${b}, 0.55)`;

  // Flame flicker based on depth
  const flicker = isActive || isDeepening;

  // Status message
  const statusMessage = useMemo(() => {
    if (wordCount === 0) return "Your ember is waiting...";
    if (wordCount < 10) return "A gentle spark...";
    if (wordCount < 30) return "Your ember is warming...";
    if (isDeepening) return "✨ The flame is deepening...";
    if (intensity > 70) return "🔥 Your ember burns bright";
    if (intensity > 40) return "Your ember is glowing...";
    return "Keep going...";
  }, [wordCount, intensity, isDeepening]);

  return (
    <div className="flex flex-col items-center justify-center py-8 relative">
      {/* The ember — a living flame tinted by your emotion */}
      <div className="relative flex items-center justify-center h-44">
        <EmberFlame
          height={flameH}
          outer={outer}
          inner={inner}
          glowColor={glowColor}
          mood={scale}
          sparks={isDeepening}
          flicker={flicker}
          backLayer={intensity > 30}
        />
      </div>

      {/* Tiny sparks when writing */}
      {isActive && wordCount > 0 && (
        <>
          <div
            className="absolute w-1 h-1 bg-amber-200 rounded-full animate-spark-1"
            style={{ top: "34%", left: "24%" }}
          />
          <div
            className="absolute w-1 h-1 bg-orange-200 rounded-full animate-spark-2"
            style={{ top: "42%", right: "23%" }}
          />
          <div
            className="absolute w-1 h-1 bg-yellow-200 rounded-full animate-spark-3"
            style={{ bottom: "38%", left: "18%" }}
          />
        </>
      )}

      {/* Status message */}
      <div className="mt-8 text-center">
        <p className="text-sm font-serif italic text-warm-gray transition-opacity duration-500">
          {statusMessage}
        </p>
        {wordCount > 0 && (
          <p className="text-xs text-warm-light mt-1">
            {wordCount} word{wordCount !== 1 ? "s" : ""}
          </p>
        )}
      </div>
    </div>
  );
}