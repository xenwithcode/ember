"use client";

import { Sparkles } from "lucide-react";

interface PromptSuggestionsProps {
  prompt: string;
}

export default function PromptSuggestions({ prompt }: PromptSuggestionsProps) {
  return (
    <div className="bg-cream-100 rounded-xl p-4 border border-cream-200">
      <div className="flex items-start gap-3">
        <div className="w-8 h-8 bg-terracotta-500/10 rounded-lg flex items-center justify-center shrink-0">
          <Sparkles className="w-4 h-4 text-terracotta-500" />
        </div>
        <div>
          <p className="text-xs font-medium text-warm-gray mb-1">
            Today&apos;s reflection prompt
          </p>
          <p className="font-hand text-lg text-coffee-800 leading-relaxed">
            &ldquo;{prompt}&rdquo;
          </p>
        </div>
      </div>
    </div>
  );
}