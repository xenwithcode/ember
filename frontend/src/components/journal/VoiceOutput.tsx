"use client";

import { useState, useEffect } from "react";
import { Volume2, VolumeX } from "lucide-react";

interface VoiceOutputProps {
  text: string;
  enabled: boolean;
  onToggle: () => void;
}

export default function VoiceOutput({ text, enabled, onToggle }: VoiceOutputProps) {
  const [isSpeaking, setIsSpeaking] = useState(false);

  useEffect(() => {
    if (enabled && text) {
      speak(text);
    }
  }, [text, enabled]);

  const speak = (textToSpeak: string) => {
    if (!window.speechSynthesis) return;

    // Cancel any ongoing speech
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.rate = 0.9; // Slightly slower for calm feel
    utterance.pitch = 1;
    utterance.volume = 0.8;

    // Try to get a pleasant voice
    const voices = window.speechSynthesis.getVoices();
    const preferredVoice = voices.find(
      (v) => v.name.includes("Samantha") || v.name.includes("Google")
    );
    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  };

  const stopSpeaking = () => {
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
  };

  return (
    <button
      onClick={() => {
        if (isSpeaking) {
          stopSpeaking();
        } else {
          speak(text);
        }
        onToggle();
      }}
      className={`
        p-2 rounded-full transition-colors
        ${enabled
          ? "text-terracotta-500 bg-terracotta-500/10"
          : "text-warm-light hover:text-warm-gray"
        }
      `}
      title={enabled ? "Voice responses on" : "Voice responses off"}
    >
      {enabled ? (
        <Volume2 className="w-4 h-4" />
      ) : (
        <VolumeX className="w-4 h-4" />
      )}
    </button>
  );
}