// frontend/src/components/journal/LivingEmber.tsx

"use client";

import { useMemo } from "react";
import { EmberState, emotionColors } from "@/hooks/useEmberAnalysis";

interface LivingEmberProps {
  emberState: EmberState;
  isActive: boolean;
}

export default function LivingEmber({ emberState, isActive }: LivingEmberProps) {
  const { intensity, dominantEmotion, wordCount, isDeepening } = emberState;

  // Scale: 0.4 (dim) to 1.0 (full brightness)
  const scale = 0.4 + (intensity / 100) * 0.6;

  // Color based on dominant emotion
  const color = emotionColors[dominantEmotion];

  // Glow intensity (shadow spread)
  const glowSize = 20 + intensity * 0.8;
  const glowOpacity = 0.3 + (intensity / 100) * 0.5;

  // Flame flicker based on depth
  const flickerIntensity = isDeepening ? "strong" : "gentle";

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
      {/* The ember itself */}
      <div className="relative flex items-center justify-center">
        {/* Outer glow */}
        <div
          className="absolute rounded-full blur-3xl transition-all duration-1000 ease-out"
          style={{
            width: `${120 + glowSize}px`,
            height: `${120 + glowSize}px`,
            backgroundColor: color,
            opacity: glowOpacity * 0.4,
            transform: `scale(${scale})`,
          }}
        />

        {/* Middle glow */}
        <div
          className="absolute rounded-full blur-2xl transition-all duration-700 ease-out"
          style={{
            width: `${80 + glowSize * 0.7}px`,
            height: `${80 + glowSize * 0.7}px`,
            backgroundColor: color,
            opacity: glowOpacity * 0.6,
            transform: `scale(${scale})`,
          }}
        />

        {/* Inner core */}
        <div
          className={`
            relative rounded-full transition-all duration-500 ease-out
            ${isActive ? "animate-pulse-soft" : ""}
            ${isDeepening ? "animate-flicker" : ""}
          `}
          style={{
            width: `${60 + intensity * 0.4}px`,
            height: `${60 + intensity * 0.4}px`,
            background: `radial-gradient(circle at 35% 35%, 
              #FFF 0%, 
              ${color} 40%, 
              #C66A4D 80%,
              #7C2D12 100%)`,
            boxShadow: `
              0 0 ${glowSize}px ${color},
              inset 0 0 20px rgba(255, 255, 255, 0.3)
            `,
            transform: `scale(${scale})`,
          }}
        >
          {/* Flame particles when deep */}
          {isDeepening && (
            <>
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-1 h-3 bg-amber-300 rounded-full animate-flame-rise opacity-70" />
              <div
                className="absolute -top-6 left-1/2 -translate-x-2 w-1 h-4 bg-orange-300 rounded-full animate-flame-rise opacity-60"
                style={{ animationDelay: "0.3s" }}
              />
              <div
                className="absolute -top-5 left-1/2 translate-x-1 w-1 h-3 bg-amber-200 rounded-full animate-flame-rise opacity-70"
                style={{ animationDelay: "0.6s" }}
              />
            </>
          )}
        </div>

        {/* Tiny sparks when writing */}
        {isActive && wordCount > 0 && (
          <>
            <div
              className="absolute w-1 h-1 bg-amber-200 rounded-full animate-spark-1"
              style={{ top: "20%", left: "25%" }}
            />
            <div
              className="absolute w-1 h-1 bg-orange-200 rounded-full animate-spark-2"
              style={{ top: "30%", right: "25%" }}
            />
            <div
              className="absolute w-1 h-1 bg-yellow-200 rounded-full animate-spark-3"
              style={{ bottom: "30%", left: "20%" }}
            />
          </>
        )}
      </div>

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