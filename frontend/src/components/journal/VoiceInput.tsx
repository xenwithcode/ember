"use client";

import { useState, useEffect, useRef } from "react";
import { Mic, MicOff, Square } from "lucide-react";

interface VoiceInputProps {
  onTranscript: (text: string) => void;
  disabled?: boolean;
}

export default function VoiceInput({ onTranscript, disabled }: VoiceInputProps) {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [error, setError] = useState<string | null>(null);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    // Check if browser supports Speech Recognition
    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setError("Voice input not supported in this browser");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-US";

    recognition.onresult = (event: any) => {
      let finalTranscript = "";
      let interimTranscript = "";

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += transcript;
        } else {
          interimTranscript += transcript;
        }
      }

      if (finalTranscript) {
        setTranscript((prev) => prev + finalTranscript);
        onTranscript(finalTranscript);
      }
    };

    recognition.onerror = (event: any) => {
      setError(`Voice error: ${event.error}`);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current = recognition;

    return () => {
      recognition.stop();
    };
  }, [onTranscript]);

  const toggleListening = () => {
    if (!recognitionRef.current) return;

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      setTranscript("");
      setError(null);
      recognitionRef.current.start();
      setIsListening(true);
    }
  };

  return (
    <div className="flex items-center gap-3">
      {/* Voice button */}
      <button
        onClick={toggleListening}
        disabled={disabled || !!error}
        className={`
          relative w-12 h-12 rounded-full flex items-center justify-center
          transition-all duration-300
          ${isListening
            ? "bg-red-500 text-white shadow-glow animate-pulse"
            : "bg-terracotta-500 text-white hover:bg-terracotta-600"
          }
          disabled:opacity-50 disabled:cursor-not-allowed
        `}
        title={isListening ? "Stop recording" : "Start voice input"}
      >
        {isListening ? (
          <Square className="w-5 h-5" />
        ) : (
          <Mic className="w-5 h-5" />
        )}
      </button>

      {/* Status */}
      <div className="flex-1">
        {isListening && (
          <div className="flex items-center gap-2">
            <div className="flex gap-1">
              <span className="w-1 h-4 bg-red-500 rounded-full animate-bounce" />
              <span
                className="w-1 h-6 bg-red-500 rounded-full animate-bounce"
                style={{ animationDelay: "0.1s" }}
              />
              <span
                className="w-1 h-3 bg-red-500 rounded-full animate-bounce"
                style={{ animationDelay: "0.2s" }}
              />
            </div>
            <span className="text-sm text-warm-gray">Listening...</span>
          </div>
        )}
        {error && (
          <p className="text-xs text-red-500">{error}</p>
        )}
        {!isListening && !error && (
          <p className="text-xs text-warm-light">
            Tap to dictate your journal entry
          </p>
        )}
      </div>
    </div>
  );
}