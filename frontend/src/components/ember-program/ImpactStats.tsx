"use client";

import { Users, Calendar, Award, TrendingUp } from "lucide-react";

export default function ImpactStats() {
  // Mock stats — update with real data
  const stats = [
    { icon: Users, value: "2,400+", label: "Young adults reached", color: "text-terracotta-500" },
    { icon: Calendar, value: "850+", label: "Activities completed", color: "text-green-500" },
    { icon: Award, value: "47", label: "Partner organizations", color: "text-purple-500" },
    { icon: TrendingUp, value: "+34%", label: "Average mood improvement", color: "text-blue-500" },
  ];

  return (
    <section className="max-w-6xl mx-auto px-6 -mt-8 mb-16">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className="card-static p-5 text-center hover:shadow-warm-lg transition-shadow"
            >
              <Icon className={`w-6 h-6 ${stat.color} mx-auto mb-2`} />
              <p className="text-2xl md:text-3xl font-bold text-coffee-800">
                {stat.value}
              </p>
              <p className="text-xs text-warm-gray mt-1">{stat.label}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
}