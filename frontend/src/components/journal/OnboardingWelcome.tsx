// frontend/src/components/journal/OnboardingWelcome.tsx

"use client";

import { useState } from "react";
import { PenLine, Mic, Sparkles, ChevronRight } from "lucide-react";
import Sidebar from "@/components/layout/Sidebar";

interface OnboardingWelcomeProps {
  onChooseWrite: () => void;
  onChooseSpeak: () => void;
}

export default function OnboardingWelcome({
  onChooseWrite,
  onChooseSpeak,
}: OnboardingWelcomeProps) {
  const [isChoosing, setIsChoosing] = useState(false);

  return (
    <div className="min-h-screen bg-cream-100">
      <Sidebar />
      <div className="flex items-center justify-center px-6 py-12">
        <div className="max-w-2xl w-full animate-fade-in-up">
        {/* The ember */}
        <div className="text-center mb-10">
          <div className="relative inline-block">
            <div className="w-16 h-16 bg-terracotta-500 rounded-full flex items-center justify-center text-3xl shadow-glow animate-pulse-soft">
              🔥
            </div>
            <div className="absolute inset-0 rounded-full bg-terracotta-500 blur-2xl opacity-30 -z-10" />
          </div>
        </div>

        {/* The welcome letter */}
        <div className="text-center mb-10">
          <h1 className="font-serif text-3xl md:text-4xl font-bold text-coffee-800 mb-6">
            Welcome, friend.
          </h1>

          <p className="font-serif text-lg text-coffee-800 leading-relaxed mb-4">
            You&apos;ve just lit your first ember.
          </p>

          <div className="space-y-4 text-warm-gray leading-relaxed max-w-lg mx-auto">
            <p>
              Here&apos;s what we believe: Writing isn&apos;t about grammar.
              It isn&apos;t about style. It isn&apos;t about being &quot;good
              at journaling.&quot;
            </p>

            <p>
              Writing is the act of taking the swirling, invisible chaos
              inside you and giving it shape. Words. Weight. Something you can
              actually <em className="text-coffee-800">look at</em>.
            </p>

            <p>
              And in that looking — that&apos;s where you meet yourself. Not
              the version you perform for others. Not the version the algorithm
              wants you to be.
            </p>

            <p className="font-serif text-xl text-coffee-800 font-medium">
              The real one.
            </p>

            <p>
              This 7-day journey will teach you how. One gentle step at a
              time. No pressure. No judgment. No streaks to maintain.
            </p>

            <p className="font-serif italic text-coffee-800">
              Just you, a warm space, and the gradual discovery of who you are
              when you put your thoughts into words.
            </p>
          </div>

          <p className="font-hand text-2xl text-terracotta-600 mt-8">
            Your ember is waiting. Let&apos;s light it together.
          </p>
        </div>

        {/* The choice */}
        <div className="mb-8">
          <h2 className="font-serif text-xl font-semibold text-coffee-800 text-center mb-6">
            How would you like to begin?
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Write option */}
            <button
              onClick={onChooseWrite}
              className="card p-6 text-center hover:shadow-warm-lg hover:-translate-y-1 transition-all duration-300 group"
            >
              <div className="w-14 h-14 bg-terracotta-500/10 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <PenLine className="w-7 h-7 text-terracotta-500" />
              </div>
              <h3 className="font-serif font-semibold text-coffee-800 mb-1">
                Write it down
              </h3>
              <p className="text-sm text-warm-gray mb-4">
                &ldquo;I&apos;ll type my thoughts&rdquo;
              </p>
              <span className="btn-primary text-sm px-6 py-2 inline-flex items-center gap-1">
                Start Writing
                <ChevronRight className="w-4 h-4" />
              </span>
            </button>

            {/* Speak option */}
            <button
              onClick={onChooseSpeak}
              className="card p-6 text-center hover:shadow-warm-lg hover:-translate-y-1 transition-all duration-300 group"
            >
              <div className="w-14 h-14 bg-purple-500/10 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <Mic className="w-7 h-7 text-purple-500" />
              </div>
              <h3 className="font-serif font-semibold text-coffee-800 mb-1">
                Speak it out
              </h3>
              <p className="text-sm text-warm-gray mb-4">
                &ldquo;I&apos;ll talk and Ember writes&rdquo;
              </p>
              <span className="inline-flex items-center gap-1 px-6 py-2 rounded-full text-sm font-medium bg-purple-500 text-white hover:bg-purple-600 transition-colors">
                Start Speaking
                <ChevronRight className="w-4 h-4" />
              </span>
            </button>
          </div>
        </div>

        {/* Accessibility note */}
        <div className="text-center">
          <div className="inline-flex items-start gap-2 bg-cream-200/50 rounded-xl px-4 py-3 max-w-md">
            <Sparkles className="w-4 h-4 text-terracotta-500 mt-0.5 shrink-0" />
            <p className="text-xs text-warm-gray text-left leading-relaxed">
              You can switch between writing and speaking at any time. Your
              words are yours, however they come.
            </p>
          </div>
        </div>
        </div>
      </div>
    </div>
  );
}