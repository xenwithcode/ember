"use client";

import { useState, useEffect, useMemo } from "react";
import { Trophy, Sparkles, TrendingUp, Power } from "lucide-react";
import MainLayout from "@/components/layout/MainLayout";
import EmberStatus from "@/components/dashboard/EmberStatus";
import WeeklyPatternsSummary from "@/components/dashboard/WeeklyPatternsSummary";
import AchievementsGrid from "@/components/dashboard/AchievementsGrid";
import JourneyTimeline from "@/components/dashboard/JourneyTimeline";
import RecentActivityFeed from "@/components/dashboard/RecentActivityFeed";
import MilestoneCelebration from "@/components/dashboard/MilestoneCelebration";
import { useDashboardData } from "@/hooks/useDashboardData";
import { useDisconnectMode } from "@/hooks/useDisconnectMode";
import { mockAchievements, mockJourney } from "@/data/dashboard";

export default function DashboardPage() {
  const {
    emberLevel,
    emberTitle,
    emberEmoji,
    emberProgress,
    totalPoints,
    journalEntries,
    totalWords,
    activitiesCompleted,
    lettersWritten,
    lettersDelivered,
    sparkChallengesCompleted,
    daysJournaled,
    currentStreak,
    weeklyPatterns,
    entries,
    challenges,
    letters,
  } = useDashboardData();

  // Average mood from the last 7 entries (0-1) — drives the ember's flame
  const emberMood = useMemo(() => {
    const recent = entries.slice(0, 7);
    if (recent.length === 0) return 0.5;
    const avg =
      recent.reduce((sum, e) => {
        const raw = e.privacyInfo?.moodScore ?? 50;
        return sum + (raw > 1 ? raw / 100 : raw);
      }, 0) / recent.length;
    return Math.min(Math.max(avg, 0.1), 1);
  }, [entries]);

  const [showMilestone, setShowMilestone] = useState(false);
  const [milestone, setMilestone] = useState<any>(null);

  // Disconnect Mode medals
  const { medals } = useDisconnectMode();

  // Check for milestones on mount
  useEffect(() => {
    if (journalEntries === 10) {
      setMilestone({
        title: "10 Entries Written!",
        description:
          "You've written 10 journal entries. That's 10 moments of courage, 10 times you chose to look inward.",
        emoji: "📖",
      });
      setShowMilestone(true);
    } else if (sparkChallengesCompleted === 1) {
      setMilestone({
        title: "First Spark Completed!",
        description:
          "You took a real-world action based on your insight. That's the bridge in action.",
        emoji: "⚡",
      });
      setShowMilestone(true);
    } else if (lettersWritten === 1) {
      setMilestone({
        title: "First Letter Sent!",
        description:
          "You wrote to your future self. They'll thank you when the letter arrives.",
        emoji: "📬",
      });
      setShowMilestone(true);
    }
  }, [journalEntries, sparkChallengesCompleted, lettersWritten]);

  return (
    <MainLayout>
      <div className="page-section">
        {/* Page Header */}
        <div className="mb-8 animate-fade-in-up">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-terracotta-500 rounded-xl flex items-center justify-center">
              <Trophy className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="font-serif font-bold text-coffee-800 text-2xl">
                Your Triumph Board
              </h1>
              <p className="text-sm text-warm-light">
                Every small step is a victory worth celebrating
              </p>
            </div>
          </div>
        </div>

        {/* Ember Status - Hero */}
        <section className="mb-8 animate-fade-in-up">
          <EmberStatus
            level={emberLevel}
            title={emberTitle}
            emoji={emberEmoji}
            progress={emberProgress}
            totalPoints={totalPoints}
            mood={emberMood}
            stats={{
              journalEntries,
              activitiesCompleted,
              lettersWritten,
              sparkChallengesCompleted,
            }}
          />
        </section>

        {/* Stats row */}
        <section className="mb-8 animate-fade-in-up stagger-1">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            <div className="card-static p-4 text-center">
              <p className="text-2xl font-bold text-terracotta-600">
                {journalEntries}
              </p>
              <p className="text-xs text-warm-gray">Entries</p>
            </div>
            <div className="card-static p-4 text-center">
              <p className="text-2xl font-bold text-terracotta-600">
                {totalWords.toLocaleString()}
              </p>
              <p className="text-xs text-warm-gray">Words</p>
            </div>
            <div className="card-static p-4 text-center">
              <p className="text-2xl font-bold text-terracotta-600">
                {currentStreak}🔥
              </p>
              <p className="text-xs text-warm-gray">Streak</p>
            </div>
            <div className="card-static p-4 text-center">
              <p className="text-2xl font-bold text-terracotta-600">
                {daysJournaled}
              </p>
              <p className="text-xs text-warm-gray">Days</p>
            </div>
            <div className="card-static p-4 text-center">
              <p className="text-2xl font-bold text-terracotta-600">
                {lettersWritten}
              </p>
              <p className="text-xs text-warm-gray">Letters</p>
            </div>
            <div className="card-static p-4 text-center">
              <p className="text-2xl font-bold text-terracotta-600">
                {sparkChallengesCompleted}
              </p>
              <p className="text-xs text-warm-gray">Sparks</p>
            </div>
          </div>
        </section>

        {/* Two column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Weekly Patterns */}
          <section className="animate-fade-in-up stagger-2">
            {weeklyPatterns && (
              <WeeklyPatternsSummary summary={weeklyPatterns} />
            )}
          </section>

          {/* Recent Activity */}
          <section className="animate-fade-in-up stagger-3">
            <RecentActivityFeed
              entries={entries}
              challenges={challenges}
              letters={letters}
            />
          </section>
        </div>

        {/* Achievements */}
        <section className="mb-8 animate-fade-in-up stagger-4">
          <div className="flex items-center gap-3 mb-6">
            <Trophy className="w-6 h-6 text-terracotta-500" />
            <h2 className="font-serif text-2xl font-semibold text-coffee-800">
              Achievements Unlocked
            </h2>
          </div>
          <AchievementsGrid achievements={mockAchievements} />
        </section>

        {/* Disconnect Medals */}
        <section className="mb-8 animate-fade-in-up stagger-4">
          <div className="flex items-center gap-3 mb-6">
            <Power className="w-6 h-6 text-orange-500" />
            <h2 className="font-serif text-2xl font-semibold text-coffee-800">
              Disconnect Medals 🏅
            </h2>
          </div>

          {medals.length === 0 ? (
            <div className="card-static p-8 text-center">
              <p className="text-warm-gray">
                No disconnect medals yet. Hit the red Disconnect button when
                you feel stuck, and go explore the real world.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {medals.map((medal) => (
                <div key={medal.id} className="card-static p-4 text-center">
                  <div className="text-3xl mb-2">{medal.emoji}</div>
                  <p className="text-xs font-medium text-coffee-800 line-clamp-2">
                    {medal.placeName}
                  </p>
                  <p className="text-[10px] text-warm-light mt-1">
                    {new Date(medal.earnedAt).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Journey Timeline */}
        <section className="mb-8 animate-fade-in-up stagger-5">
          <div className="flex items-center gap-3 mb-6">
            <TrendingUp className="w-6 h-6 text-terracotta-500" />
            <h2 className="font-serif text-2xl font-semibold text-coffee-800">
              Your Journey
            </h2>
          </div>
          <JourneyTimeline journey={mockJourney} />
        </section>

        {/* Motivational footer */}
        <div className="text-center bg-terracotta-500/10 rounded-3xl p-10 border border-terracotta-500/20">
          <Sparkles className="w-8 h-8 text-terracotta-500 mx-auto mb-4" />
          <p className="font-hand text-2xl text-coffee-800 mb-2">
            &ldquo;You don&apos;t write to be understood by others. You write
            to finally understand yourself.&rdquo;
          </p>
          <p className="text-sm text-warm-gray">
            Keep building your bridge to the real world, one step at a time.
          </p>
        </div>
      </div>

      {/* Milestone celebration */}
      <MilestoneCelebration
        milestone={milestone}
        onClose={() => setShowMilestone(false)}
      />
    </MainLayout>
  );
}