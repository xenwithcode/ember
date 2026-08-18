// frontend/src/components/dashboard/EmberStatus.tsx

"use client";

import { useId } from "react";
import { Flame } from "lucide-react";

interface EmberStatusProps {
  level: number;
  title: string;
  emoji: string;
  progress: number; // 0-100
  totalPoints: number;
  mood?: number; // 0 (dim) → 1 (vibrant), from recent journal entries
  stats: {
    journalEntries: number;
    activitiesCompleted: number;
    lettersWritten: number;
    sparkChallengesCompleted: number;
  };
}

// Flame silhouettes (viewBox 0 0 64 96)
const OUTER_FLAME =
  "M32 2 C 42 18, 58 28, 58 56 C 58 78, 46 94, 32 94 C 18 94, 6 78, 6 56 C 6 28, 22 18, 32 2 Z";
const OUTER_FLAME_BIG =
  "M32 0 C 45 15, 62 28, 62 58 C 62 80, 48 96, 32 96 C 16 96, 2 80, 2 58 C 2 28, 19 15, 32 0 Z";
const INNER_FLAME =
  "M32 24 C 37 32, 44 38, 44 54 C 44 68, 39 78, 32 78 C 25 78, 20 68, 20 54 C 20 38, 27 32, 32 24 Z";

interface FlameTier {
  outer: [string, string, string];
  inner: [string, string];
  highlight: string;
}

const TIERS: FlameTier[] = [
  // levels 1-2: young ember
  {
    outer: ["#FFF0E5", "#E28766", "#C2410C"],
    inner: ["#FFE4C7", "#F59E0B"],
    highlight: "rgba(226, 135, 102, 0.55)",
  },
  // levels 3-4: growing flame
  {
    outer: ["#FFEDC4", "#F59E0B", "#C2410C"],
    inner: ["#FFF7DC", "#FBBF24"],
    highlight: "rgba(245, 158, 11, 0.55)",
  },
  // levels 5-6: full blaze
  {
    outer: ["#FFF9E8", "#FBBF24", "#EA580C"],
    inner: ["#FFFDF0", "#FCD34D"],
    highlight: "rgba(251, 191, 36, 0.6)",
  },
];

export default function EmberStatus({
  level,
  title,
  emoji,
  progress,
  totalPoints,
  mood = 0.5,
  stats,
}: EmberStatusProps) {
  const clampLevel = Math.min(Math.max(level, 1), 6);
  const gradientId = useId().replace(/[^a-zA-Z0-9]/g, "");
  const tier = TIERS[Math.min(Math.floor((clampLevel - 1) / 2), 2)];

  // Mood (0-1) shapes the flame: dim + desaturated on tough weeks,
  // saturated + glowing after good ones
  const moodV = Math.min(Math.max(mood, 0), 1);
  const showSparks = clampLevel >= 3 || moodV >= 0.6;

  // Growth by level: small warm ember → tall golden flame
  const flameH = 62 + clampLevel * 10; // 72 → 122 px
  const flameW = Math.round(flameH * 0.66);
  const glow = 10 + clampLevel * 4;

  // Progress ring at the flame's base
  const ringR = Math.round(flameH * 0.3);
  const ringStroke = Math.max(5, Math.round(ringR * 0.18));
  const ringSize = (ringR + ringStroke) * 2;
  const ringC = 2 * Math.PI * ringR;

  return (
    <div className="card-static overflow-hidden">
      {/* Background gradient */}
      <div
        className="absolute inset-0 opacity-5"
        style={{
          background: `radial-gradient(ellipse at center, #E28766 0%, transparent 70%)`,
        }}
      />

      <div className="relative p-8 md:p-12 text-center">
        {/* Level badge */}
        <div className="inline-flex items-center gap-2 bg-terracotta-500/10 px-4 py-2 rounded-full mb-8">
          <Flame className="w-4 h-4 text-terracotta-500" />
          <span className="text-sm font-semibold text-terracotta-600">
            Ember Level {clampLevel}
          </span>
        </div>

        {/* The ember — a living flame, always contained within its area */}
        <div className="group relative flex items-center justify-center h-36 sm:h-44 mb-6">
          {/* Ambient glow: brighter when the week was good */}
          <div
            className="absolute rounded-full blur-2xl animate-pulse-soft transition-opacity duration-1000"
            style={{
              width: flameW * 2,
              height: flameW * 1.5,
              background: `radial-gradient(circle, ${tier.highlight} 0%, transparent 70%)`,
              opacity: 0.45 + moodV * 0.55,
            }}
          />

          {/* Outer flame layer: slower flicker → depth and volume */}
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

          {/* Progress ring seated at the flame's base (visual % to next level) */}
          <div
            className="absolute"
            style={{
              left: "50%",
              top: `calc(50% + ${Math.round(flameH * 0.26)}px)`,
              transform: "translate(-50%, -50%)",
            }}
          >
            <svg
              width={ringSize}
              height={ringSize}
              viewBox={`0 0 ${ringSize} ${ringSize}`}
              style={{ transform: "rotate(-90deg)" }}
            >
              <defs>
                <linearGradient id={`${gradientId}-ring`} x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#E28766" />
                  <stop offset="100%" stopColor="#FBBF24" />
                </linearGradient>
              </defs>
              <circle
                cx={ringR + ringStroke}
                cy={ringR + ringStroke}
                r={ringR}
                fill="none"
                stroke="#EFE3D6"
                strokeWidth={ringStroke}
                opacity="0.6"
              />
              <circle
                cx={ringR + ringStroke}
                cy={ringR + ringStroke}
                r={ringR}
                fill="none"
                stroke={`url(#${gradientId}-ring)`}
                strokeWidth={ringStroke}
                strokeLinecap="round"
                strokeDasharray={ringC}
                strokeDashoffset={ringC * (1 - progress / 100)}
                style={{
                  transition: "stroke-dashoffset 1s ease-out",
                  filter: `drop-shadow(0 0 4px rgba(226, 135, 102, 0.5))`,
                }}
              />
            </svg>
          </div>

          {/* Rising sparks: higher levels, or good mood weeks */}
          {showSparks && (
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

          {/* Main flame: flickers at rest, wobbles when you hover it */}
          <svg
            width={flameW}
            height={flameH}
            viewBox="0 0 64 96"
            className="relative animate-flicker group-hover:animate-flame-hover transition-transform duration-500"
            style={{
              filter: `saturate(${(0.65 + moodV * 0.75).toFixed(2)}) brightness(${(0.8 + moodV * 0.35).toFixed(2)}) drop-shadow(0 0 ${glow}px ${tier.highlight})`,
            }}
          >
            <defs>
              <linearGradient id={gradientId} x1="0" y1="1" x2="0" y2="0">
                <stop offset="0%" stopColor={tier.outer[0]} />
                <stop offset="50%" stopColor={tier.outer[1]} />
                <stop offset="100%" stopColor={tier.outer[2]} />
              </linearGradient>
              <linearGradient id={`${gradientId}-inner`} x1="0" y1="1" x2="0" y2="0">
                <stop offset="0%" stopColor={tier.inner[0]} />
                <stop offset="100%" stopColor={tier.inner[1]} />
              </linearGradient>
            </defs>
            <path d={OUTER_FLAME} fill={`url(#${gradientId})`} />
            <path d={INNER_FLAME} fill={`url(#${gradientId}-inner)`} />
            {/* Level number in the bright core of the flame */}
            <text
              x="32"
              y="80"
              textAnchor="middle"
              fontSize="22"
              fontWeight="700"
              fill="#7C2D12"
              style={{ fontFamily: "var(--font-serif, serif)" }}
            >
              {clampLevel}
            </text>
          </svg>
        </div>

        {/* Title */}
        <h2 className="font-serif text-2xl md:text-3xl font-bold text-coffee-800 mb-2">
          {emoji} {title}
        </h2>

        {/* Progress to next level */}
        <div className="max-w-xs mx-auto mb-8">
          <div className="h-2 bg-cream-200 rounded-full overflow-hidden mb-2">
            <div
              className="h-full bg-gradient-to-r from-terracotta-500 to-amber-400 rounded-full transition-all duration-1000 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-xs text-warm-light">
            {totalPoints} points • {Math.round(progress)}% to next level
          </p>
        </div>

        {/* Quick stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-lg mx-auto">
          <div className="text-center">
            <p className="text-2xl font-bold text-terracotta-600">
              {stats.journalEntries}
            </p>
            <p className="text-xs text-warm-gray">Journal entries</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-green-600">
              {stats.activitiesCompleted}
            </p>
            <p className="text-xs text-warm-gray">Real-world acts</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-blue-600">
              {stats.lettersWritten}
            </p>
            <p className="text-xs text-warm-gray">Letters written</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-purple-600">
              {stats.sparkChallengesCompleted}
            </p>
            <p className="text-xs text-warm-gray">Sparks completed</p>
          </div>
        </div>
      </div>
    </div>
  );
}