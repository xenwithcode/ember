"use client";

import { useEffect, useRef, useState } from "react";
import { Sparkles, Loader2, Volume2, VolumeX } from "lucide-react";
import EmotionChips from "./EmotionChips";
import SuggestedActions from "./SuggestedActions";
import { JournalMessage } from "@/app/journal/page";

interface CoachPanelProps {
  messages: JournalMessage[];
  isThinking: boolean;
  onViewPastEntry?: (entryId: string) => void;
}

export default function CoachPanel({
  messages,
  isThinking,
  onViewPastEntry,
}: CoachPanelProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [voiceEnabled, setVoiceEnabled] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isThinking]);

  // Speak the last agent message when voice is enabled
  useEffect(() => {
    if (voiceEnabled && messages.length > 0) {
      const lastMessage = messages[messages.length - 1];
      if (lastMessage.role === "agent") {
        speak(lastMessage.content);
      }
    }
  }, [messages, voiceEnabled]);

  const speak = (text: string) => {
    if (!window.speechSynthesis) return;

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.9;
    utterance.pitch = 1;
    utterance.volume = 0.8;

    const voices = window.speechSynthesis.getVoices();
    const preferredVoice = voices.find(
      (v) =>
        v.name.includes("Samantha") ||
        v.name.includes("Google") ||
        v.lang === "en-US"
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

  const toggleVoice = () => {
    if (isSpeaking) {
      stopSpeaking();
      setVoiceEnabled(false);
    } else {
      setVoiceEnabled(true);
    }
  };

  return (
    <div className="card-static flex flex-col h-full">
      {/* Coach Header */}
      <div className="p-6 border-b border-cream-200">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-terracotta-500 rounded-full flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1">
            <h2 className="font-serif font-semibold text-coffee-800">
              Your Coach
            </h2>
            <p className="text-xs text-warm-light">
              Here to listen, not to judge
            </p>
          </div>

          {/* Voice toggle */}
          <button
            onClick={toggleVoice}
            className={`
              p-2 rounded-full transition-colors
              ${voiceEnabled
                ? "text-terracotta-500 bg-terracotta-500/10"
                : "text-warm-light hover:text-warm-gray hover:bg-cream-200"
              }
            `}
            title={voiceEnabled ? "Voice responses on" : "Voice responses off"}
          >
            {voiceEnabled ? (
              <Volume2 className="w-5 h-5" />
            ) : (
              <VolumeX className="w-5 h-5" />
            )}
          </button>

          {/* Status indicator */}
          <div className="flex items-center gap-2">
            <div
              className={`w-2 h-2 rounded-full ${
                isThinking
                  ? "bg-terracotta-500 animate-pulse"
                  : "bg-green-500"
              }`}
            />
            <span className="text-xs text-warm-gray">
              {isThinking ? "Thinking..." : "Present"}
            </span>
          </div>
        </div>

        {/* Voice status */}
        {voiceEnabled && (
          <div className="mt-3 flex items-center gap-2 text-xs text-terracotta-500">
            <Volume2 className="w-3 h-3" />
            <span>Voice responses enabled — Coach will read aloud</span>
          </div>
        )}
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {messages.length === 0 && !isThinking && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-terracotta-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Sparkles className="w-8 h-8 text-terracotta-500" />
            </div>
            <h3 className="font-serif font-medium text-coffee-800 mb-2">
              I&apos;m here when you&apos;re ready
            </h3>
            <p className="text-sm text-warm-gray max-w-xs mx-auto">
              Write in your journal, and I&apos;ll listen. No judgment, no
              rush. Just a safe space to think out loud.
            </p>
          </div>
        )}

        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${
              message.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-[85%] rounded-2xl px-5 py-4 ${
                message.role === "user"
                  ? "bg-terracotta-500 text-white rounded-br-md"
                  : "bg-white shadow-warm border border-cream-200 rounded-bl-md"
              }`}
            >
              {/* Agent avatar */}
              {message.role === "agent" && (
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="w-4 h-4 text-terracotta-500" />
                  <span className="text-xs font-medium text-terracotta-500">
                    Coach
                  </span>
                  {/* Individual voice play button */}
                  <button
                    onClick={() => speak(message.content)}
                    className="ml-auto p-1 hover:bg-cream-100 rounded-full transition-colors"
                    title="Read aloud"
                  >
                    <Volume2 className="w-3 h-3 text-warm-light" />
                  </button>
                </div>
              )}

              {/* Message content */}
              <p className="text-sm leading-relaxed whitespace-pre-wrap">
                {message.content}
              </p>

              {/* Emotion chips for agent messages */}
              {message.role === "agent" && message.emotions && (
                <EmotionChips emotions={message.emotions} />
              )}

              {/* Suggested action for agent messages */}
              {message.role === "agent" && message.suggestedAction && (
                <SuggestedActions action={message.suggestedAction} />
              )}

              {/* Link to saved entry */}
              {message.role === "agent" && message.entryId && onViewPastEntry && (
                <button
                  onClick={() => onViewPastEntry(message.entryId!)}
                  className="mt-3 text-xs font-medium text-terracotta-500 hover:text-terracotta-600 underline underline-offset-2"
                >
                  View saved entry →
                </button>
              )}

              {/* Timestamp */}
              <p
                className={`text-xs mt-3 ${
                  message.role === "user"
                    ? "text-white/60"
                    : "text-warm-light"
                }`}
              >
                {message.timestamp.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
          </div>
        ))}

        {/* Thinking indicator */}
        {isThinking && (
          <div className="flex justify-start">
            <div className="bg-white shadow-warm border border-cream-200 rounded-2xl rounded-bl-md px-5 py-4">
              <div className="flex items-center gap-3">
                <Loader2 className="w-4 h-4 animate-spin text-terracotta-500" />
                <div className="flex items-center gap-1">
                  <span className="w-2 h-2 bg-terracotta-500 rounded-full animate-bounce" />
                  <span
                    className="w-2 h-2 bg-terracotta-500 rounded-full animate-bounce"
                    style={{ animationDelay: "0.1s" }}
                  />
                  <span
                    className="w-2 h-2 bg-terracotta-500 rounded-full animate-bounce"
                    style={{ animationDelay: "0.2s" }}
                  />
                </div>
                <span className="text-sm text-warm-gray">
                  Your coach is reading...
                </span>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>
    </div>
  );
}
