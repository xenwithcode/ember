"use client";

import { Flame, CheckCircle2, TrendingUp, Star, Users, PenLine } from "lucide-react";

interface StatsCardsProps {
  stats: {
    streakDays: number;
    activitiesCompleted: number;
    moodImprovement: string;
    categoriesExplored: number;
    friendsInvited: number;
    reflectionsWritten: number;
  };
}

export default function StatsCards({ stats }: StatsCardsProps) {
  const cards = [
    {
      icon: Flame,
      value: stats.streakDays,
      label: "Day streak",
      color: "text-terracotta-500",
      bgColor: "bg-terracotta-500/10",
    },
    {
      icon: CheckCircle2,
      value: stats.activitiesCompleted,
      label: "Activities done",
      color: "text-green-600",
      bgColor: "bg-green-500/10",
    },
    {
      icon: TrendingUp,
      value: stats.moodImprovement,
      label: "Mood boost",
      color: "text-purple-600",
      bgColor: "bg-purple-500/10",
    },
    {
      icon: Star,
      value: stats.categoriesExplored,
      label: "Categories tried",
      color: "text-amber-600",
      bgColor: "bg-amber-500/10",
    },
    {
      icon: Users,
      value: stats.friendsInvited,
      label: "Friends invited",
      color: "text-blue-600",
      bgColor: "bg-blue-500/10",
    },
    {
      icon: PenLine,
      value: stats.reflectionsWritten,
      label: "Reflections",
      color: "text-rose-600",
      bgColor: "bg-rose-500/10",
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div
            key={card.label}
            className="card-static p-4 text-center hover:shadow-warm-lg transition-shadow"
          >
            <div
              className={`w-10 h-10 ${card.bgColor} rounded-xl flex items-center justify-center mx-auto mb-3`}
            >
              <Icon className={`w-5 h-5 ${card.color}`} />
            </div>
            <p className={`text-2xl font-bold ${card.color}`}>{card.value}</p>
            <p className="text-xs text-warm-gray mt-1">{card.label}</p>
          </div>
        );
      })}
    </div>
  );
}