// frontend/src/components/journal/RitualSelector.tsx

"use client";

import { rituals, Ritual } from "@/data/rituals";
import { Clock, Sparkles } from "lucide-react";

interface RitualSelectorProps {
  selectedRitual: Ritual;
  onSelect: (ritual: Ritual) => void;
  isOpen: boolean;
  onToggle: () => void;
}

export default function RitualSelector({
  selectedRitual,
  onSelect,
  isOpen,
  onToggle,
}: RitualSelectorProps) {
  return (
    <div className="card-static overflow-hidden">
      {/* Selected ritual (always visible) */}
      <button
        onClick={onToggle}
        className="w-full p-5 flex items-center gap-4 hover:bg-cream-50 transition-colors"
      >
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl shrink-0"
          style={{ backgroundColor: `${selectedRitual.emberColor}20` }}
        >
          {selectedRitual.emoji}
        </div>
        <div className="flex-1 text-left">
          <div className="flex items-center gap-2 mb-0.5">
            <h3 className="font-serif font-semibold text-coffee-800">
              {selectedRitual.name}
            </h3>
            <span className="text-xs text-warm-light flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {selectedRitual.duration}
            </span>
          </div>
          <p className="text-xs text-warm-gray">
            {selectedRitual.purpose}
          </p>
        </div>
        <span
          className={`text-warm-gray transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        >
          ▼
        </span>
      </button>

      {/* Dropdown with all rituals */}
      {isOpen && (
        <div className="border-t border-cream-200 p-4 bg-cream-50 animate-fade-in">
          <p className="text-xs text-warm-gray mb-3 px-1">
            Choose a ritual for this session:
          </p>
          <div className="space-y-2">
            {rituals.map((ritual) => {
              const isSelected = selectedRitual.id === ritual.id;
              return (
                <button
                  key={ritual.id}
                  onClick={() => {
                    onSelect(ritual);
                    onToggle();
                  }}
                  className={`
                    w-full p-3 rounded-xl text-left transition-all duration-200
                    flex items-start gap-3
                    ${
                      isSelected
                        ? "bg-white shadow-warm border-2 border-terracotta-500/30"
                        : "bg-white/60 hover:bg-white border-2 border-transparent hover:shadow-warm"
                    }
                  `}
                >
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center text-xl shrink-0"
                    style={{ backgroundColor: `${ritual.emberColor}20` }}
                  >
                    {ritual.emoji}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-0.5">
                      <h4
                        className={`font-serif font-medium text-sm ${
                          isSelected ? "text-coffee-800" : "text-coffee-700"
                        }`}
                      >
                        {ritual.name}
                      </h4>
                      <span className="text-xs text-warm-light shrink-0">
                        {ritual.duration}
                      </span>
                    </div>
                    <p className="text-xs text-warm-gray leading-relaxed">
                      {ritual.description}
                    </p>
                  </div>
                  {isSelected && (
                    <Sparkles className="w-4 h-4 text-terracotta-500 shrink-0 mt-1" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}