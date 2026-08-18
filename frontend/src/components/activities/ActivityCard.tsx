"use client";

import Link from "next/link";
import {
  MapPin,
  Calendar,
  Clock,
  Users,
  DollarSign,
  Star,
  ArrowRight,
} from "lucide-react";
import { Activity } from "@/data/activities";

interface ActivityCardProps {
  activity: Activity;
  isHovered?: boolean;
  onHover?: () => void;
  onHoverEnd?: () => void;
}

const categoryColors: Record<string, string> = {
  creative: "bg-purple-100 text-purple-700",
  physical: "bg-green-100 text-green-700",
  social: "bg-blue-100 text-blue-700",
  intellectual: "bg-amber-100 text-amber-700",
  volunteer: "bg-rose-100 text-rose-700",
  nature: "bg-emerald-100 text-emerald-700",
  mindfulness: "bg-indigo-100 text-indigo-700",
  student: "bg-cyan-100 text-cyan-700",
};

const anxietyLabels: Record<string, string> = {
  solo: "🌱 Solo friendly",
  low: "🌿 Low anxiety",
  moderate: "🌳 Moderate",
  high: "🔥 Brave mode",
};

export default function ActivityCard({
  activity,
  isHovered = false,
  onHover,
  onHoverEnd,
}: ActivityCardProps) {
  return (
    <Link
      href={`/activities/${activity.id}`}
      onMouseEnter={onHover}
      onMouseLeave={onHoverEnd}
      className={`card block overflow-hidden transition-all duration-300 ${
        isHovered ? "ring-2 ring-terracotta-500 shadow-warm-lg" : ""
      }`}
    >
      {/* Image */}
      <div className="relative h-40 overflow-hidden">
        <img
          src={activity.imageUrl}
          alt={activity.title}
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
        />
        {/* Price badge */}
        <div className="absolute top-3 right-3">
          {activity.price === 0 ? (
            <span className="badge bg-green-500 text-white shadow-warm">FREE</span>
          ) : (
            <span className="badge bg-white/90 text-coffee-800 shadow-warm">
              ${activity.price}
            </span>
          )}
        </div>
        {/* Category badge */}
        <div className="absolute top-3 left-3">
          <span className={`badge ${categoryColors[activity.category]}`}>
            {activity.category}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        {/* Anxiety level */}
        <div className="flex items-center gap-2 mb-2">
          <span className="badge bg-cream-200 text-warm-gray">
            {anxietyLabels[activity.anxietyLevel]}
          </span>
          {activity.certificationAvailable && (
            <span className="badge bg-terracotta-500/10 text-terracotta-600">
              🎓 Certified
            </span>
          )}
        </div>

        {/* Title */}
        <h3 className="font-serif font-semibold text-coffee-800 text-lg mb-1 leading-tight">
          {activity.title}
        </h3>
        <p className="text-warm-gray text-sm mb-4 line-clamp-2">
          {activity.description}
        </p>

        {/* Details */}
        <div className="space-y-2 text-sm text-warm-gray">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-terracotta-500 shrink-0" />
            <span className="truncate">{activity.locationName}</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-terracotta-500 shrink-0" />
            <span>
              {new Date(activity.startDate).toLocaleDateString("en-US", {
                weekday: "short",
                month: "short",
                day: "numeric",
              })}
            </span>
            <span className="text-warm-light">•</span>
            <Clock className="w-4 h-4 text-terracotta-500 shrink-0" />
            <span>{activity.startTime}</span>
          </div>
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-terracotta-500 shrink-0" />
            <span>{activity.spotsRemaining} spots left</span>
            <span className="text-warm-light">•</span>
            <span>{activity.durationMinutes} min</span>
          </div>
        </div>

        {/* CTA */}
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-cream-200">
          <span className="text-sm font-medium text-terracotta-600 flex items-center gap-1">
            View details
            <ArrowRight className="w-4 h-4" />
          </span>
          {activity.organizerVerified && (
            <span className="flex items-center gap-1 text-xs text-warm-light">
              <Star className="w-3 h-3 fill-current text-amber-500" />
              Verified
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}