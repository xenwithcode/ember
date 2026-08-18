// frontend/src/components/EmberFlame.tsx

"use client";

import { useId } from "react";

interface EmberFlameProps {
  /** Total flame height in px (width follows 0.66 ratio) */
  height?: number;
  /** Outer gradient stops: [base(light), mid, tip(burn)] */
  outer: [string, string, string];
  /** Inner core gradient stops: [bottom, top] */
  inner: [string, string];
  /** Ambient + drop-shadow color (rgba string advised) */
  glowColor: string;
  /** 0 (dim) → 1 (vibrant): controls saturation/brightness + glow opacity */
  mood?: number;
  /** Optional number rendered in the bright core */
  levelNumber?: number;
  /** Volume layer behind the main flame (dashboard look) */
  backLayer?: boolean;
  /** Rising sparks at the flame tip */
  sparks?: boolean;
  /** Flicker animation (idle) */
  flicker?: boolean;
  /** Wobble on hover (requires `group` ancestor) */
  wobble?: boolean;
}

// Flame silhouettes (viewBox 0 0 64 96)
const OUTER_FLAME =
  "M32 2 C 42 18, 58 28, 58 56 C 58 78, 46 94, 32 94 C 18 94, 6 78, 6 56 C 6 28, 22 18, 32 2 Z";
const OUTER_FLAME_BIG =
  "M32 0 C 45 15, 62 28, 62 58 C 62 80, 48 96, 32 96 C 16 96, 2 80, 2 58 C 2 28, 19 15, 32 0 Z";
const INNER_FLAME =
  "M32 24 C 37 32, 44 38, 44 54 C 44 68, 39 78, 32 78 C 25 78, 20 68, 20 54 C 20 38, 27 32, 32 24 Z";

export default function EmberFlame({
  height = 96,
  outer,
  inner,
  glowColor,
  mood = 0.5,
  levelNumber,
  backLayer = false,
  sparks = false,
  flicker = true,
  wobble = false,
}: EmberFlameProps) {
  const gradientId = useId().replace(/[^a-zA-Z0-9]/g, "");
  const moodV = Math.min(Math.max(mood, 0), 1);

  const flameH = height;
  const flameW = Math.round(flameH * 0.66);
  const glow = 10 + Math.round(flameH * 0.14);

  return (
    <div className="relative flex items-center justify-center">
      {/* Ambient glow: brighter when the week was good */}
      <div
        className="absolute rounded-full blur-2xl animate-pulse-soft transition-opacity duration-1000"
        style={{
          width: flameW * 2,
          height: flameW * 1.5,
          background: `radial-gradient(circle, ${glowColor} 0%, transparent 70%)`,
          opacity: 0.35 + moodV * 0.6,
        }}
      />

      {/* Volume layer behind the main flame */}
      {backLayer && (
        <svg
          width={Math.round(flameW * 1.14)}
          height={Math.round(flameH * 1.14)}
          viewBox="0 0 64 96"
          aria-hidden
          className="absolute animate-flicker-slow"
          style={{
            filter: `drop-shadow(0 0 ${glow}px rgba(196, 92, 44, 0.4))`,
            opacity: 0.7,
          }}
        >
          <path d={OUTER_FLAME_BIG} fill="#A63A1E" opacity="0.45" />
        </svg>
      )}

      {/* Rising sparks */}
      {sparks && (
        <>
          <div
            className="absolute left-1/2 -translate-x-1/2 w-1.5 h-4 bg-amber-300 rounded-full animate-flame-rise opacity-70"
            style={{ bottom: `calc(50% + ${flameH / 2 + 4}px)` }}
          />
          <div
            className="absolute left-1/2 -translate-x-3 w-1 h-5 bg-orange-300 rounded-full animate-flame-rise opacity-60"
            style={{
              bottom: `calc(50% + ${flameH / 2 + 8}px)`,
              animationDelay: "0.3s",
            }}
          />
          <div
            className="absolute left-1/2 translate-x-2.5 w-1.5 h-3 bg-yellow-200 rounded-full animate-flame-rise opacity-70"
            style={{
              bottom: `calc(50% + ${flameH / 2 + 2}px)`,
              animationDelay: "0.6s",
            }}
          />
        </>
      )}

      {/* Main flame: flickers at rest, wobbles on hover */}
      <svg
        width={flameW}
        height={flameH}
        viewBox="0 0 64 96"
        className={`relative transition-transform duration-500 ${
          flicker ? "animate-flicker" : ""
        } ${wobble ? "group-hover:animate-flame-hover" : ""}`}
        style={{
          filter: `saturate(${(0.65 + moodV * 0.75).toFixed(2)}) brightness(${(0.8 + moodV * 0.35).toFixed(2)}) drop-shadow(0 0 ${glow}px ${glowColor})`,
        }}
      >
        <defs>
          <linearGradient id={gradientId} x1="0" y1="1" x2="0" y2="0">
            <stop offset="0%" stopColor={outer[0]} />
            <stop offset="50%" stopColor={outer[1]} />
            <stop offset="100%" stopColor={outer[2]} />
          </linearGradient>
          <linearGradient id={`${gradientId}-inner`} x1="0" y1="1" x2="0" y2="0">
            <stop offset="0%" stopColor={inner[0]} />
            <stop offset="100%" stopColor={inner[1]} />
          </linearGradient>
        </defs>
        <path d={OUTER_FLAME} fill={`url(#${gradientId})`} />
        <path d={INNER_FLAME} fill={`url(#${gradientId}-inner)`} />
        {levelNumber !== undefined && (
          <text
            x="32"
            y="80"
            textAnchor="middle"
            fontSize="22"
            fontWeight="700"
            fill="#7C2D12"
            style={{ fontFamily: "var(--font-serif, serif)" }}
          >
            {levelNumber}
          </text>
        )}
      </svg>
    </div>
  );
}