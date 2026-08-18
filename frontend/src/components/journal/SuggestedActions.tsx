"use client";

import Link from "next/link";
import { ArrowRight, Compass } from "lucide-react";

interface SuggestedActionsProps {
  action: {
    title: string;
    description: string;
    link: string;
  };
}

export default function SuggestedActions({ action }: SuggestedActionsProps) {
  return (
    <div className="mt-4 pt-4 border-t border-cream-200">
      <div className="bg-cream-100 rounded-xl p-4 border border-cream-200">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 bg-green-500/10 rounded-lg flex items-center justify-center shrink-0">
            <Compass className="w-4 h-4 text-green-600" />
          </div>
          <div className="flex-1">
            <h4 className="font-medium text-coffee-800 text-sm mb-1">
              {action.title}
            </h4>
            <p className="text-xs text-warm-gray mb-3">{action.description}</p>
            <Link
              href={action.link}
              className="inline-flex items-center gap-1 text-xs font-medium text-terracotta-600 hover:text-terracotta-700 transition-colors"
            >
              Explore activities
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}