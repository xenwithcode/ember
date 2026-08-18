"use client";

import { useState, useEffect } from "react";
import { Wind, Play, Pause, RotateCcw } from "lucide-react";

type BreathPhase = "inhale" | "hold" | "exhale" | "rest";

const phases: { phase: BreathPhase; duration: number; label: string }[] = [
  { phase: "inhale", duration: 4, label: "Breathe in..." },
  { phase: "hold", duration: 7, label: "Hold..." },
  { phase: "exhale", duration: 8, label: "Breathe out..." },
];

export default function BreathingExercise() {
  const [isActive, setIsActive] = useState(false);
  const [currentPhase, setCurrentPhase] = useState(0);
  const [secondsLeft, setSecondsLeft] = useState(phases[0].duration);
  const [cycles, setCycles] = useState(0);

  useEffect(() => {
    if (!isActive) return;

    const timer = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          // Move to next phase
          const nextPhase = (currentPhase + 1) % phases.length;
          setCurrentPhase(nextPhase);

          // Speak the next phase
          if (window.speechSynthesis) {
            const utterance = new SpeechSynthesisUtterance(
              phases[nextPhase].label
            );
            utterance.rate = 0.8;
            window.speechSynthesis.speak(utterance);
          }

          // Count cycles
          if (nextPhase === 0) {
            setCycles((prev) => prev + 1);
          }

          return phases[nextPhase].duration;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isActive, currentPhase]);

  const phase = phases[currentPhase];
  const progress = 1 - secondsLeft / phase.duration;

  // Circle scale based on phase
  const getScale = () => {
    if (phase.phase === "inhale") return 1 + progress * 0.5;
    if (phase.phase === "hold") return 1.5;
    if (phase.phase === "exhale") return 1.5 - progress * 0.5;
    return 1;
  };

  return (
    <div className="card-static p-8 text-center">
      <div className="flex items-center justify-center gap-3 mb-6">
        <div className="w-10 h-10 bg-indigo-500/10 rounded-xl flex items-center justify-center">
          <Wind className="w-5 h-5 text-indigo-600" />
        </div>
        <div className="text-left">
          <h3 className="font-serif font-semibold text-coffee-800">
            4-7-8 Breathing
          </h3>
          <p className="text-xs text-warm-light">
            Calm your nervous system in 1 minute
          </p>
        </div>
      </div>

      {/* Breathing circle */}
      <div className="relative w-40 h-40 mx-auto mb-6">
        <div
          className="absolute inset-0 bg-terracotta-500/20 rounded-full transition-transform duration-1000 ease-in-out"
          style={{ transform: `scale(${getScale()})` }}
        />
        <div
          className="absolute inset-4 bg-terracotta-500/40 rounded-full transition-transform duration-1000 ease-in-out"
          style={{ transform: `scale(${getScale() * 0.9})` }}
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <p className="font-serif text-lg font-semibold text-coffee-800">
              {isActive ? phase.label : "Ready?"}
            </p>
            {isActive && (
              <p className="text-3xl font-bold text-terracotta-500 mt-1">
                {secondsLeft}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center gap-4">
        <button
          onClick={() => setIsActive(!isActive)}
          className="btn-primary flex items-center gap-2"
        >
          {isActive ? (
            <>
              <Pause className="w-4 h-4" />
              Pause
            </>
          ) : (
            <>
              <Play className="w-4 h-4" />
              Start
            </>
          )}
        </button>
        <button
          onClick={() => {
            setIsActive(false);
            setCurrentPhase(0);
            setSecondsLeft(phases[0].duration);
            setCycles(0);
            window.speechSynthesis?.cancel();
          }}
          className="btn-secondary flex items-center gap-2"
        >
          <RotateCcw className="w-4 h-4" />
          Reset
        </button>
      </div>

      {/* Cycles counter */}
      {cycles > 0 && (
        <p className="text-sm text-warm-gray mt-4">
          {cycles} cycle{cycles !== 1 ? "s" : ""} completed 🌟
        </p>
      )}
    </div>
  );
}