// frontend/src/components/dashboard/RecentActivityFeed.tsx

"use client";

import { PenLine, Flame, Mail, Sparkles, GraduationCap } from "lucide-react";
import { JournalEntry } from "@/hooks/useJournalStorage";
import { SparkChallenge } from "@/hooks/useSparkChallenges";
import { FutureLetter } from "@/hooks/useFutureLetters";

interface RecentActivityFeedProps {
  entries: JournalEntry[];
  challenges: SparkChallenge[];
  letters: FutureLetter[];
}

interface ActivityItem {
  id: string;
  type: "journal" | "challenge" | "letter" | "onboarding";
  title: string;
  description: string;
  emoji: string;
  timestamp: number;
}

export default function RecentActivityFeed({
  entries,
  challenges,
  letters,
}: RecentActivityFeedProps) {
  // Build unified activity feed
  const activities: ActivityItem[] = [];

  // Journal entries
  entries.slice(0, 5).forEach((entry) => {
    activities.push({
      id: entry.id,
      type: "journal",
      title: `${entry.ritualEmoji} ${entry.ritualName}`,
      description: entry.text.substring(0, 60) + "...",
      emoji: "📖",
      timestamp: entry.timestamp,
    });
  });

  // Completed challenges
  challenges
    .filter((c) => c.status === "completed")
    .slice(0, 3)
    .forEach((challenge) => {
      activities.push({
        id: challenge.id,
        type: "challenge",
        title: `${challenge.template.emoji} ${challenge.template.title}`,
        description: "Spark Challenge completed",
        emoji: "⚡",
        timestamp: challenge.completedAt || challenge.createdAt,
      });
    });

  // Letters written
  letters.slice(0, 3).forEach((letter) => {
    activities.push({
      id: letter.id,
      type: "letter",
      title: `📬 Letter to Future You`,
      description: `${letter.timeframeLabel} • ${letter.wordCount} words`,
      emoji: "✉️",
      timestamp: letter.writtenAt,
    });
  });

  // Sort by timestamp (newest first)
  activities.sort((a, b) => b.timestamp - a.timestamp);

  const timeAgo = (timestamp: number) => {
    const diff = Date.now() - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return "Just now";
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days === 1) return "Yesterday";
    return `${days} days ago`;
  };

  return (
    <div className="card-static p-6">
      <h3 className="font-serif font-semibold text-coffee-800 mb-4">
        Recent Activity
      </h3>

      {activities.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-warm-gray text-sm">
            Your journey is just beginning. Write your first entry to get
            started.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {activities.slice(0, 8).map((activity) => (
            <div
              key={activity.id}
              className="flex items-start gap-3 p-3 rounded-xl hover:bg-cream-50 transition-colors"
            >
              <div className="w-9 h-9 bg-cream-100 rounded-lg flex items-center justify-center text-lg shrink-0">
                {activity.emoji}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-coffee-800 truncate">
                  {activity.title}
                </p>
                <p className="text-xs text-warm-gray truncate">
                  {activity.description}
                </p>
              </div>
              <span className="text-xs text-warm-light shrink-0">
                {timeAgo(activity.timestamp)}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}