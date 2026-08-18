"use client";

import { IdentityNode } from "@/data/dashboard";
import { ArrowRight } from "lucide-react";

interface IdentityGraphProps {
  nodes: IdentityNode[];
}

const typeColors: Record<string, string> = {
  negative: "bg-red-100 text-red-700 border-red-200",
  neutral: "bg-amber-100 text-amber-700 border-amber-200",
  positive: "bg-green-100 text-green-700 border-green-200",
};

export default function IdentityGraph({ nodes }: IdentityGraphProps) {
  // Group by week
  const weeks = [1, 2, 3, 4];
  const nodesByWeek = weeks.map((week) =>
    nodes.filter((node) => node.week === week)
  );

  return (
    <div className="card-static p-8">
      <div className="text-center mb-8">
        <h2 className="font-serif text-2xl font-semibold text-coffee-800 mb-2">
          Your Identity Graph
        </h2>
        <p className="text-warm-gray">
          How you see yourself has evolved. That&apos;s real growth.
        </p>
      </div>

      {/* Timeline visualization */}
      <div className="flex items-start justify-between gap-4 overflow-x-auto pb-4">
        {nodesByWeek.map((weekNodes, weekIndex) => (
          <div key={weekIndex} className="flex items-center">
            {/* Week column */}
            <div className="text-center min-w-[120px]">
              <div className="text-xs font-medium text-warm-gray mb-3">
                Week {weekIndex + 1}
              </div>
              <div className="space-y-2">
                {weekNodes.map((node) => (
                  <div
                    key={node.label}
                    className={`
                      px-4 py-2 rounded-full border text-sm font-medium
                      transition-all duration-300 hover:scale-105
                      ${typeColors[node.type]}
                    `}
                  >
                    {node.label}
                  </div>
                ))}
              </div>
            </div>

            {/* Arrow between weeks */}
            {weekIndex < nodesByWeek.length - 1 && (
              <div className="flex items-center px-2">
                <ArrowRight className="w-6 h-6 text-terracotta-500/50" />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center gap-6 mt-6 pt-6 border-t border-cream-200">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-red-400" />
          <span className="text-xs text-warm-gray">Starting point</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-amber-400" />
          <span className="text-xs text-warm-gray">Exploring</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-green-400" />
          <span className="text-xs text-warm-gray">Growing</span>
        </div>
      </div>
    </div>
  );
}