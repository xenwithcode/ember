// frontend/src/components/journal/JournalEditor.tsx

"use client";

import { useState, useEffect } from "react";
import { PenLine, Send, Leaf, Mic } from "lucide-react";
import VoiceInput from "./VoiceInput";
import LivingEmber from "./LivingEmber";
import RitualSelector from "./RitualSelector";
import { useEmberAnalysis, EmberState } from "@/hooks/useEmberAnalysis";
import { defaultRitual, Ritual } from "@/data/rituals";

interface JournalEditorProps {
  onSubmit: (
    text: string,
    ritual: Ritual,
    emberAnalysis: {
      wordCount: number;
      writingTimeSeconds: number;
      dominantEmotion: any;
      emotionScores: any;
      intensity: number;
    }
  ) => void;
  isDisabled: boolean;
}

export default function JournalEditor({
  onSubmit,
  isDisabled,
}: JournalEditorProps) {
  const [text, setText] = useState("");
  const [selectedRitual, setSelectedRitual] = useState<Ritual>(defaultRitual);
  const [isRitualSelectorOpen, setIsRitualSelectorOpen] = useState(false);
  const [writingStartTime, setWritingStartTime] = useState<number | null>(null);
  const [inputMode, setInputMode] = useState<"text" | "voice">("text");

  // Analyze the ember state in real-time
  const emberState = useEmberAnalysis(text, writingStartTime);

  // Track when user starts writing
  useEffect(() => {
    if (text && !writingStartTime) {
      setWritingStartTime(Date.now());
    } else if (!text) {
      setWritingStartTime(null);
    }
  }, [text, writingStartTime]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim() || isDisabled) return;
    onSubmit(text, selectedRitual, emberState);
    setText("");
    setWritingStartTime(null);
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Ritual Selector at the top */}
      <RitualSelector
        selectedRitual={selectedRitual}
        onSelect={setSelectedRitual}
        isOpen={isRitualSelectorOpen}
        onToggle={() => setIsRitualSelectorOpen(!isRitualSelectorOpen)}
      />

      {/* Main editor card */}
      <div className="card-static flex flex-col">
        {/* Header with mode toggle */}
        <div className="flex items-center justify-between mb-4 px-6 pt-6">
          <div className="flex items-center gap-2">
            <PenLine className="w-5 h-5 text-terracotta-500" />
            <h2 className="font-serif font-semibold text-coffee-800">
              Today&apos;s Entry
            </h2>
          </div>

          {/* Mode toggle */}
          <div className="flex items-center gap-1 bg-cream-200 rounded-full p-1">
            <button
              onClick={() => setInputMode("text")}
              className={`
                flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium
                transition-all duration-200
                ${inputMode === "text"
                  ? "bg-white text-coffee-800 shadow-warm"
                  : "text-warm-gray hover:text-coffee-800"
                }
              `}
              aria-label="Switch to writing mode"
            >
              <PenLine className="w-3 h-3" />
              Write
            </button>
            <button
              onClick={() => setInputMode("voice")}
              className={`
                flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium
                transition-all duration-200
                ${inputMode === "voice"
                  ? "bg-white text-coffee-800 shadow-warm"
                  : "text-warm-gray hover:text-coffee-800"
                }
              `}
              aria-label="Switch to voice mode"
            >
              <Mic className="w-3 h-3" />
              Speak
            </button>
          </div>
        </div>

        {/* Living Ember visualization */}
        <LivingEmber
          emberState={emberState}
          isActive={!!text && !isDisabled}
        />

        {/* Prompt display */}
        <div className="px-6 pb-4">
          <div
            className="rounded-xl p-4 border"
            style={{
              backgroundColor: `${selectedRitual.emberColor}08`,
              borderColor: `${selectedRitual.emberColor}30`,
            }}
          >
            <div className="flex items-start gap-2">
              <PenLine
                className="w-4 h-4 mt-1 shrink-0"
                style={{ color: selectedRitual.emberColor }}
              />
              <p
                className="text-sm font-serif italic leading-relaxed"
                style={{ color: selectedRitual.emberColor }}
              >
                {selectedRitual.prompt}
              </p>
            </div>
          </div>
        </div>

        {/* Writing area */}
        <form onSubmit={handleSubmit} className="flex flex-col flex-1 px-6 pb-6">
          {inputMode === "text" ? (
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Begin writing. Watch your ember respond..."
              className="textarea-journal flex-1 font-serif text-lg leading-relaxed"
              disabled={isDisabled}
              style={{ minHeight: "200px" }}
            />
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center py-8">
              {/* Voice recording UI (simplified version) */}
              <VoiceInput
                onTranscript={(t) =>
                  setText((prev) => {
                    const newText = prev ? `${prev} ${t}` : t;
                    return newText;
                  })
                }
                disabled={isDisabled}
              />
              <p className="text-sm text-warm-gray mt-4 text-center">
                Speak your thoughts. Ember will write them down.
                <br />
                <button
                  onClick={() => setInputMode("text")}
                  className="text-terracotta-600 hover:text-terracotta-700 underline"
                >
                  Switch to writing
                </button>
              </p>
            </div>
          )}

          {/* Submit button */}
          <div className="flex items-center justify-between mt-4">
            <div className="flex items-center gap-2 text-warm-light text-sm">
              <Leaf className="w-4 h-4" />
              <span>
                {emberState.wordCount} word{emberState.wordCount !== 1 ? "s" : ""}
              </span>
              {emberState.writingTimeSeconds > 0 && (
                <>
                  <span className="text-warm-light/40">•</span>
                  <span>
                    {Math.floor(emberState.writingTimeSeconds / 60)}:
                    {String(emberState.writingTimeSeconds % 60).padStart(2, "0")}
                  </span>
                </>
              )}
            </div>

            <button
              type="submit"
              disabled={!text.trim() || isDisabled}
              className="btn-primary flex items-center gap-2"
            >
              <Send className="w-4 h-4" />
              Share with Coach
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}