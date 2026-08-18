"use client";

import { Search, SlidersHorizontal } from "lucide-react";
import { ActivityCategory } from "@/data/activities";

interface CategoryFiltersProps {
  selectedCategory: ActivityCategory | "all";
  onCategoryChange: (category: ActivityCategory | "all") => void;
  selectedAnxiety: string;
  onAnxietyChange: (level: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

const categories: { value: ActivityCategory | "all"; label: string; icon: string }[] = [
  { value: "all", label: "All", icon: "🌟" },
  { value: "creative", label: "Creative", icon: "🎨" },
  { value: "physical", label: "Physical", icon: "🧘" },
  { value: "social", label: "Social", icon: "👥" },
  { value: "intellectual", label: "Intellectual", icon: "📚" },
  { value: "volunteer", label: "Volunteer", icon: "🤝" },
  { value: "nature", label: "Nature", icon: "🌿" },
  { value: "mindfulness", label: "Mindfulness", icon: "🧠" },
  { value: "student", label: "Student", icon: "🎓" },
];

const anxietyLevels = [
  { value: "all", label: "All levels" },
  { value: "solo", label: "🌱 Solo friendly" },
  { value: "low", label: "🌿 Low anxiety" },
  { value: "moderate", label: "🌳 Moderate" },
  { value: "high", label: "🔥 Brave mode" },
];

export default function CategoryFilters({
  selectedCategory,
  onCategoryChange,
  selectedAnxiety,
  onAnxietyChange,
  searchQuery,
  onSearchChange,
}: CategoryFiltersProps) {
  return (
    <div className="space-y-4 mb-6">
      {/* Search bar */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-warm-light" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search activities... (e.g., art, yoga, books)"
          className="input-warm pl-12"
        />
      </div>

      {/* Category filters */}
      <div className="flex flex-wrap gap-2">
        {categories.map((category) => (
          <button
            key={category.value}
            onClick={() => onCategoryChange(category.value)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
              selectedCategory === category.value
                ? "bg-terracotta-500 text-white shadow-warm"
                : "bg-white text-warm-gray hover:bg-cream-200 border border-cream-200"
            }`}
          >
            {category.icon} {category.label}
          </button>
        ))}
      </div>

      {/* Anxiety level filters */}
      <div className="flex flex-wrap gap-2">
        {anxietyLevels.map((level) => (
          <button
            key={level.value}
            onClick={() => onAnxietyChange(level.value)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 ${
              selectedAnxiety === level.value
                ? "bg-coffee-800 text-white"
                : "bg-cream-200 text-warm-gray hover:bg-cream-300"
            }`}
          >
            {level.label}
          </button>
        ))}
      </div>
    </div>
  );
}