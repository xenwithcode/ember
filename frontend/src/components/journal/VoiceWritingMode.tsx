// frontend/src/components/journal/VoiceWritingMode.tsx

"use client";

import { useState, useEffect, useRef } from "react";
import {
  Mic,
  MicOff,
  Square,
  PenLine,
  Pause,
  Play,
  CheckCircle2,
} from "lucide-react";

interface VoiceWritingModeProps {
  prompt: string;
  onComplete: (transcript: string) => void;
  onSwitchToText: () => void;
  onCancel: () => void;
}

export default function VoiceWritingMode({
  prompt,
  onComplete,
  onSwitchToText,
  onCancel,
}: VoiceWritingModeProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [interimTranscript, setInterimTranscript] = useState("");
  const [recordingTime, setRecordingTime] = useState(0);
  const recognitionRef = useRef<any>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize speech recognition
  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Voice input is not supported in this browser. Please use writing mode.");
      onSwitchToText();
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-US";

    recognition.onresult = (event: any) => {
      let finalTranscript = "";
      let interim = "";

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const text = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += text + " ";
        } else {
          interim += text;
        }
      }

      if (finalTranscript) {
        setTranscript((prev) => prev + finalTranscript);
      }
      setInterimTranscript(interim);
    };

    recognition.onerror = (event: any) => {
      console.error("Speech recognition error:", event.error);
      setIsRecording(false);
    };

    recognition.onend = () => {
      if (isRecording && !isPaused) {
        // Restart if it ended unexpectedly
        try {
          recognition.start();
        } catch (e) {
          setIsRecording(false);
        }
      }
    };

    recognitionRef.current = recognition;

    return () => {
      recognition.stop();
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRecording, isPaused, onSwitchToText]);

  // Timer for recording duration
  useEffect(() => {
    if (isRecording && !isPaused) {
      timerRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRecording, isPaused]);

  const startRecording = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.start();
        setIsRecording(true);
        setIsPaused(false);
      } catch (e) {
        console.error("Failed to start recording:", e);
      }
    }
  };

  const pauseRecording = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsPaused(true);
    }
  };

  const resumeRecording = () => {
    if (recognitionRef.current) {
      recognitionRef.current.start();
      setIsPaused(false);
      setIsRecording(true);
    }
  };

  const stopRecording = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setIsRecording(false);
    setIsPaused(false);
  };

  const handleComplete = () => {
    stopRecording();
    const fullText = (transcript + interimTranscript).trim();
    if (fullText) {
      onComplete(fullText);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const hasContent = transcript.trim().length > 0 || interimTranscript.length > 0;

  return (
    <div className="card-static p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center ${
              isRecording
                ? "bg-red-500 animate-pulse"
                : "bg-purple-500/10"
            }`}
          >
            {isRecording ? (
              <Mic className="w-5 h-5 text-white" />
            ) : (
              <Mic className="w-5 h-5 text-purple-500" />
            )}
          </div>
          <div>
            <h3 className="font-serif font-semibold text-coffee-800">
              {isRecording ? "Ember is listening..." : "Ready when you are"}
            </h3>
            <p className="text-xs text-warm-light">
              {isRecording
                ? `Recording: ${formatTime(recordingTime)}`
                : "Speak your thoughts freely"}
            </p>
          </div>
        </div>

        {/* Switch to writing */}
        <button
          onClick={() => {
            stopRecording();
            onSwitchToText();
          }}
          className="btn-secondary flex items-center gap-2 text-sm py-2 px-4"
        >
          <PenLine className="w-4 h-4" />
          Switch to Writing
        </button>
      </div>

      {/* Prompt */}
      <div className="bg-cream-100 rounded-xl p-4 mb-6 border border-cream-200">
        <p className="text-sm font-serif italic text-coffee-800 leading-relaxed">
          💭 {prompt}
        </p>
      </div>

      {/* Recording visualization */}
      <div className="flex items-center justify-center py-8 mb-6">
        {isRecording && !isPaused ? (
          /* Active recording - waveform animation */
          <div className="flex items-center gap-1">
            {Array.from({ length: 12 }).map((_, i) => (
              <div
                key={i}
                className="w-1 bg-purple-500 rounded-full animate-waveform"
                style={{
                  height: `${12 + Math.random() * 24}px`,
                  animationDelay: `${i * 0.1}s`,
                }}
              />
            ))}
          </div>
        ) : isPaused ? (
          <div className="flex items-center gap-3 text-warm-gray">
            <Pause className="w-5 h-5" />
            <span className="text-sm">Paused. Take your time.</span>
          </div>
        ) : (
          <div className="text-center">
            <div className="w-16 h-16 bg-purple-500/10 rounded-full flex items-center justify-center mx-auto mb-3">
              <Mic className="w-8 h-8 text-purple-500" />
            </div>
            <p className="text-sm text-warm-gray">
              Tap the button below to start speaking
            </p>
          </div>
        )}
      </div>

      {/* Live transcription */}
      {hasContent && (
        <div className="bg-white rounded-xl p-4 border border-cream-200 mb-6 max-h-48 overflow-y-auto">
          <p className="font-serif text-coffee-800 leading-relaxed">
            {transcript}
            {interimTranscript && (
              <span className="text-warm-light italic">
                {interimTranscript}
              </span>
            )}
            {isRecording && (
              <span className="inline-block w-0.5 h-4 bg-terracotta-500 ml-0.5 animate-pulse" />
            )}
          </p>
        </div>
      )}

      {/* Controls */}
      <div className="flex items-center justify-center gap-4">
        {!isRecording ? (
          <button
            onClick={startRecording}
            className="w-16 h-16 bg-purple-500 rounded-full flex items-center justify-center text-white shadow-warm-lg hover:bg-purple-600 hover:scale-105 transition-all"
            aria-label="Start recording"
          >
            <Mic className="w-7 h-7" />
          </button>
        ) : (
          <>
            {/* Pause/Resume */}
            <button
              onClick={isPaused ? resumeRecording : pauseRecording}
              className="w-12 h-12 bg-cream-200 rounded-full flex items-center justify-center text-warm-gray hover:bg-cream-300 transition-colors"
              aria-label={isPaused ? "Resume recording" : "Pause recording"}
            >
              {isPaused ? (
                <Play className="w-5 h-5" />
              ) : (
                <Pause className="w-5 h-5" />
              )}
            </button>

            {/* Stop */}
            <button
              onClick={stopRecording}
              className="w-14 h-14 bg-red-500 rounded-full flex items-center justify-center text-white shadow-warm hover:bg-red-600 transition-colors"
              aria-label="Stop recording"
            >
              <Square className="w-6 h-6" />
            </button>
          </>
        )}
      </div>

      {/* Bottom actions */}
      <div className="flex items-center justify-between mt-8 pt-6 border-t border-cream-200">
        <button
          onClick={() => {
            stopRecording();
            onCancel();
          }}
          className="btn-ghost text-sm"
        >
          Cancel
        </button>

        <button
          onClick={handleComplete}
          disabled={!hasContent}
          className="btn-primary flex items-center gap-2 disabled:opacity-50"
        >
          <CheckCircle2 className="w-4 h-4" />
          Save & Continue
        </button>
      </div>

      {/* Helper text */}
      <p className="text-center text-xs text-warm-light mt-4">
        💡 Speak as if you&apos;re talking to a trusted friend. No need to be
        perfect. Your words are yours.
      </p>
    </div>
  );
}