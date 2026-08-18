// frontend/src/components/dashboard/MilestoneCelebration.tsx

"use client";

import { useState } from "react";
import { X, PartyPopper } from "lucide-react";

interface MilestoneCelebrationProps {
  milestone: {
    title: string;
    description: string;
    emoji: string;
  } | null;
  onClose: () => void;
}

export default function MilestoneCelebration({
  milestone,
  onClose,
}: MilestoneCelebrationProps) {
  if (!milestone) return null;

  return (
    <div className="fixed inset-0 z-50 bg-coffee-900/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-cream-100 rounded-3xl max-w-sm w-full p-8 shadow-warm-xl text-center animate-fade-in-up">
        {/* Confetti-like particles */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-3xl">
          {Array.from({ length: 12 }).map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 rounded-full animate-confetti"
              style={{
                left: `${10 + Math.random() * 80}%`,
                top: `${-10 + Math.random() * 20}%`,
                backgroundColor: ["#E28766", "#F59E0B", "#10B981", "#8B5CF6"][
                  i % 4
                ],
                animationDelay: `${i * 0.15}s`,
              }}
            />
          ))}
        </div>

        <div className="relative">
          <div className="text-5xl mb-4">{milestone.emoji}</div>
          <h2 className="font-serif text-2xl font-bold text-coffee-800 mb-2">
            {milestone.title}
          </h2>
          <p className="text-warm-gray mb-6">{milestone.description}</p>

          <div className="bg-terracotta-500/10 rounded-xl p-4 mb-6">
            <p className="font-hand text-lg text-coffee-800">
              &ldquo;You didn&apos;t come this far to only come this far.&rdquo;
            </p>
          </div>

          <button
            onClick={onClose}
            className="btn-primary w-full flex items-center justify-center gap-2"
          >
            <PartyPopper className="w-4 h-4" />
            Keep Going
          </button>
        </div>

        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 hover:bg-cream-200 rounded-full transition-colors"
        >
          <X className="w-5 h-5 text-warm-gray" />
        </button>
      </div>
    </div>
  );
}