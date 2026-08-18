// frontend/src/components/disconnect/DisconnectButton.tsx
"use client";

import { useEffect, useState } from "react";
import { Power } from "lucide-react";

interface DisconnectButtonProps {
  onClick: () => void;
  isHidden?: boolean;
}

const INTRO_KEY = "ember_disconnect_intro_seen";

export default function DisconnectButton({
  onClick,
  isHidden,
}: DisconnectButtonProps) {
  const [showIntro, setShowIntro] = useState(false);

  useEffect(() => {
    try {
      if (!localStorage.getItem(INTRO_KEY)) setShowIntro(true);
    } catch {
      // localStorage unavailable — skip the intro bubble
    }
  }, []);

  if (isHidden) return null;

  const dismissIntro = () => {
    setShowIntro(false);
    try {
      localStorage.setItem(INTRO_KEY, "1");
    } catch {
      // ignore
    }
  };

  return (
    <div className="fixed bottom-6 left-6 z-40">
      {/* First-time intro bubble */}
      {showIntro && (
        <div className="absolute bottom-20 left-0 w-72 max-w-[calc(100vw-3rem)] bg-white rounded-2xl shadow-warm-xl border border-red-100 p-4 animate-fade-in-up">
          <div className="absolute -bottom-2 left-8 w-4 h-4 bg-white rotate-45 border-b border-r border-red-100" />
          <div className="flex items-start gap-2 mb-2">
            <span className="text-xl">🛑</span>
            <p className="text-xs font-semibold text-coffee-800">
              Disconnect Mode — escape the scroll
            </p>
          </div>
          <p className="text-xs text-warm-gray leading-relaxed mb-1">
            <strong className="text-coffee-800">One tap:</strong> Gemma 4
            reads your moment and finds real places near you — each with its own
            micro-challenge.
          </p>
          <p className="text-xs text-warm-gray leading-relaxed mb-1">
            Pick one, go outside, do the challenge. When you come back, your
            medal is waiting on the Triumph Board.
          </p>
          <p className="text-xs text-warm-gray leading-relaxed mb-3">
            <strong className="text-coffee-800">No timer, no lock-in:</strong>{" "}
            you can exit anytime — tap the red button and Ember is back to
            normal instantly.
          </p>
          <button
            onClick={dismissIntro}
            className="w-full btn-primary text-xs py-2"
          >
            Got it — show me
          </button>
        </div>
      )}

      <button
        onClick={onClick}
        className="group relative"
        title="Disconnect Mode — escape the scroll"
      >
        {/* Pulsing background */}
        <div className="absolute inset-0 bg-red-500 rounded-full blur-md opacity-40 animate-pulse" />

        {/* Main button */}
        <div className="relative w-14 h-14 bg-gradient-to-br from-red-500 to-orange-500 rounded-full flex items-center justify-center shadow-warm-xl group-hover:scale-110 transition-transform duration-200">
          <Power className="w-6 h-6 text-white" />
        </div>

        {/* Label */}
        <div className="absolute left-full ml-3 top-1/2 -translate-y-1/2 bg-coffee-900 text-white px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
          Disconnect Mode
        </div>
      </button>
    </div>
  );
}