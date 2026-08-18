"use client";

import { useState, useMemo } from "react";
import {
  Compass,
  MapPin,
  Search,
  SlidersHorizontal,
  List,
  Map,
} from "lucide-react";
import { mockActivities, Activity, ActivityCategory } from "@/data/activities";
import CategoryFilters from "@/components/activities/CategoryFilters";
import ActivityCard from "@/components/activities/ActivityCard";
import ActivityMap from "@/components/activities/ActivityMap";
import MainLayout from "@/components/layout/MainLayout";

export default function ActivitiesPage() {
  const [selectedCategory, setSelectedCategory] = useState<ActivityCategory | "all">("all");
  const [selectedAnxiety, setSelectedAnxiety] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"list" | "split">("split");
  const [hoveredActivityId, setHoveredActivityId] = useState<string | null>(null);

  // Filter activities
  const filteredActivities = useMemo(() => {
    return mockActivities.filter((activity) => {
      const matchesCategory =
        selectedCategory === "all" || activity.category === selectedCategory;
      const matchesAnxiety =
        selectedAnxiety === "all" || activity.anxietyLevel === selectedAnxiety;
      const matchesSearch =
        !searchQuery ||
        activity.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        activity.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        activity.tags.some((tag) => tag.includes(searchQuery.toLowerCase()));

      return matchesCategory && matchesAnxiety && matchesSearch;
    });
  }, [selectedCategory, selectedAnxiety, searchQuery]);

  return (
    <MainLayout>
    <div className="min-h-screen">
      {/* Header */}
      <header className="bg-white border-b border-cream-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-terracotta-500 rounded-xl flex items-center justify-center">
                <Compass className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="font-serif font-bold text-coffee-800 text-lg">
                  Discover Activities
                </h1>
                <p className="text-xs text-warm-light">
                  Real-world experiences, curated for you
                </p>
              </div>
            </div>

            {/* View toggle */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === "list"
                    ? "bg-terracotta-500 text-white"
                    : "text-warm-gray hover:bg-cream-200"
                }`}
              >
                <List className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode("split")}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === "split"
                    ? "bg-terracotta-500 text-white"
                    : "text-warm-gray hover:bg-cream-200"
                }`}
              >
                <Map className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Filters */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        <CategoryFilters
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
          selectedAnxiety={selectedAnxiety}
          onAnxietyChange={setSelectedAnxiety}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />

        {/* Results count */}
        <p className="text-sm text-warm-gray mb-6">
          Showing {filteredActivities.length} activities near{" "}
          <span className="font-medium text-coffee-800">New York, NY</span>
        </p>

        {/* Main content */}
        {viewMode === "split" ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Activity list */}
            <div className="space-y-4 max-h-[calc(100vh-250px)] overflow-y-auto pr-2">
              {filteredActivities.map((activity) => (
                <ActivityCard
                  key={activity.id}
                  activity={activity}
                  isHovered={hoveredActivityId === activity.id}
                  onHover={() => setHoveredActivityId(activity.id)}
                  onHoverEnd={() => setHoveredActivityId(null)}
                />
              ))}

              {filteredActivities.length === 0 && (
                <div className="text-center py-16">
                  <p className="text-warm-gray">No activities found. Try adjusting your filters.</p>
                </div>
              )}
            </div>

            {/* Map */}
            <div className="sticky top-20 h-[calc(100vh-250px)] rounded-2xl overflow-hidden shadow-warm">
              <ActivityMap
                activities={filteredActivities}
                hoveredActivityId={hoveredActivityId}
              />
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredActivities.map((activity) => (
              <ActivityCard key={activity.id} activity={activity} />
            ))}
          </div>
        )}
      </div>
    </div>
    </MainLayout>
  );
}