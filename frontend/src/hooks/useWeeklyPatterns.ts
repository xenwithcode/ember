// frontend/src/hooks/useWeeklyPatterns.ts

import { useMemo } from "react";
import { JournalEntry } from "./useJournalStorage";
import { EmotionKey, emotionLabels } from "./useEmberAnalysis";

export interface WeeklyPattern {
  id: string;
  type: "emotion" | "theme" | "ritual" | "timing" | "growth";
  title: string;
  description: string;
  emoji: string;
  confidence: number; // 0-100
  evidence: string[];
  suggestion: string;
}

export interface WeeklySummary {
  weekNumber: number;
  startDate: string;
  endDate: string;
  entriesThisWeek: number;
  totalWords: number;
  totalMinutes: number;
  dominantEmotion: EmotionKey;
  emotionBreakdown: { emotion: EmotionKey; count: number; percentage: number }[];
  ritualsUsed: { ritualId: string; ritualName: string; count: number }[];
  patterns: WeeklyPattern[];
  growthInsight: string;
  comparisonToLastWeek: {
    entriesDiff: number;
    wordsDiff: number;
    moodTrend: "improving" | "stable" | "declining" | "unknown";
  };
}

export function useWeeklyPatterns(entries: JournalEntry[]) {
  return useMemo(() => {
    const now = new Date();
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    // Get entries from this week
    const weeklyEntries = entries.filter(
      (e) => e.timestamp >= oneWeekAgo.getTime()
    );

    if (weeklyEntries.length === 0) {
      return { summary: null, hasData: false };
    }

    // === Calculate basic stats ===
    const totalWords = weeklyEntries.reduce((sum, e) => sum + e.wordCount, 0);
    const totalMinutes = Math.round(
      weeklyEntries.reduce((sum, e) => sum + e.writingTimeSeconds, 0) / 60
    );

    // === Emotion breakdown ===
    const emotionCounts: Record<EmotionKey, number> = {
      joy: 0, sadness: 0, anxiety: 0, anger: 0, hope: 0, calm: 0, neutral: 0,
    };

    weeklyEntries.forEach((entry) => {
      emotionCounts[entry.dominantEmotion]++;
    });

    const emotionBreakdown = (Object.keys(emotionCounts) as EmotionKey[])
      .filter((emotion) => emotionCounts[emotion] > 0)
      .map((emotion) => ({
        emotion,
        count: emotionCounts[emotion],
        percentage: Math.round(
          (emotionCounts[emotion] / weeklyEntries.length) * 100
        ),
      }))
      .sort((a, b) => b.count - a.count);

    const dominantEmotion =
      emotionBreakdown.length > 0 ? emotionBreakdown[0].emotion : "neutral";

    // === Rituals used ===
    const ritualCounts: Record<string, { name: string; count: number }> = {};
    weeklyEntries.forEach((entry) => {
      if (!ritualCounts[entry.ritualId]) {
        ritualCounts[entry.ritualId] = { name: entry.ritualName, count: 0 };
      }
      ritualCounts[entry.ritualId].count++;
    });

    const ritualsUsed = Object.entries(ritualCounts)
      .map(([ritualId, data]) => ({
        ritualId,
        ritualName: data.name,
        count: data.count,
      }))
      .sort((a, b) => b.count - a.count);

    // === Detect patterns ===
    const patterns: WeeklyPattern[] = [];

    // Pattern 1: Dominant emotion
    if (emotionBreakdown.length > 0 && emotionBreakdown[0].percentage >= 40) {
      const topEmotion = emotionBreakdown[0];
      patterns.push({
        id: "pattern_dominant_emotion",
        type: "emotion",
        title: `${emotionLabels[topEmotion.emotion]} has been your companion`,
        description: `${emotionLabels[topEmotion.emotion]} appeared in ${topEmotion.percentage}% of your entries this week. This emotion is asking for your attention.`,
        emoji: getEmotionEmoji(topEmotion.emotion),
        confidence: topEmotion.percentage,
        evidence: weeklyEntries
          .filter((e) => e.dominantEmotion === topEmotion.emotion)
          .slice(0, 2)
          .map((e) => e.text.substring(0, 60) + "..."),
        suggestion: getSuggestionForEmotion(topEmotion.emotion),
      });
    }

    // Pattern 2: Writing consistency
    const daysWritten = new Set(weeklyEntries.map((e) => e.date)).size;
    if (daysWritten >= 5) {
      patterns.push({
        id: "pattern_consistency",
        type: "growth",
        title: "You showed up almost every day",
        description: `You wrote on ${daysWritten} out of 7 days this week. That's remarkable consistency. Your ember is building real momentum.`,
        emoji: "🔥",
        confidence: Math.round((daysWritten / 7) * 100),
        evidence: [`${daysWritten} days of writing`, `${totalWords} words total`],
        suggestion: "Keep this rhythm. Even 2 minutes counts. Consistency beats intensity.",
      });
    }

    // Pattern 3: Depth increasing
    const avgIntensity =
      weeklyEntries.reduce((sum, e) => sum + e.intensity, 0) /
      weeklyEntries.length;
    if (avgIntensity > 50) {
      patterns.push({
        id: "pattern_depth",
        type: "growth",
        title: "Your writing is going deeper",
        description: `Your average introspection depth this week was ${Math.round(avgIntensity)}/100. You're not just writing — you're excavating.`,
        emoji: "⛏️",
        confidence: Math.round(avgIntensity),
        evidence: [`Average depth: ${Math.round(avgIntensity)}/100`],
        suggestion: "You're ready for the Deep Ember ritual. Try a 20-minute session this week.",
      });
    }

    // Pattern 4: Shift from negative to positive
    const firstHalf = weeklyEntries.slice(Math.floor(weeklyEntries.length / 2));
    const secondHalf = weeklyEntries.slice(0, Math.floor(weeklyEntries.length / 2));

    const negativeEmotions: EmotionKey[] = ["anxiety", "sadness", "anger"];
    const firstHalfNegative = firstHalf.filter((e) =>
      negativeEmotions.includes(e.dominantEmotion)
    ).length;
    const secondHalfNegative = secondHalf.filter((e) =>
      negativeEmotions.includes(e.dominantEmotion)
    ).length;

    if (firstHalfNegative > secondHalfNegative && weeklyEntries.length >= 4) {
      patterns.push({
        id: "pattern_improvement",
        type: "growth",
        title: "The storm is passing",
        description: "Your earlier entries this week carried heavier emotions than your recent ones. Something is shifting. The ember is finding air.",
        emoji: "🌤️",
        confidence: 75,
        evidence: [
          `Early week: ${firstHalfNegative} difficult entries`,
          `Late week: ${secondHalfNegative} difficult entries`,
        ],
        suggestion: "Notice what changed. Was it an activity? A conversation? A realization? Name it so you can repeat it.",
      });
    }

    // Pattern 5: Favorite ritual
    if (ritualsUsed.length > 0 && ritualsUsed[0].count >= 3) {
      patterns.push({
        id: "pattern_ritual",
        type: "ritual",
        title: `${ritualsUsed[0].ritualName} is becoming your ritual`,
        description: `You chose ${ritualsUsed[0].ritualName} ${ritualsUsed[0].count} times this week. This ritual resonates with you. It might be worth making it a daily practice.`,
        emoji: "🕯️",
        confidence: Math.round((ritualsUsed[0].count / weeklyEntries.length) * 100),
        evidence: [`${ritualsUsed[0].count} times this week`],
        suggestion: `Try doing ${ritualsUsed[0].ritualName} at the same time each day. Rituals become anchors.`,
      });
    }

    // === Growth insight ===
    const growthInsight = generateGrowthInsight(weeklyEntries, patterns);

    // === Comparison to last week ===
    const twoWeeksAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);
    const lastWeekEntries = entries.filter(
      (e) =>
        e.timestamp >= twoWeeksAgo.getTime() &&
        e.timestamp < oneWeekAgo.getTime()
    );

    const comparisonToLastWeek = {
      entriesDiff: weeklyEntries.length - lastWeekEntries.length,
      wordsDiff:
        totalWords - lastWeekEntries.reduce((sum, e) => sum + e.wordCount, 0),
      moodTrend: calculateMoodTrend(weeklyEntries, lastWeekEntries),
    };

    const summary: WeeklySummary = {
      weekNumber: getWeekNumber(now),
      startDate: oneWeekAgo.toISOString().split("T")[0],
      endDate: now.toISOString().split("T")[0],
      entriesThisWeek: weeklyEntries.length,
      totalWords,
      totalMinutes,
      dominantEmotion,
      emotionBreakdown,
      ritualsUsed,
      patterns: patterns.slice(0, 4), // Top 4 patterns
      growthInsight,
      comparisonToLastWeek,
    };

    return { summary, hasData: true };
  }, [entries]);
}

// Helper functions
function getEmotionEmoji(emotion: EmotionKey): string {
  const map: Record<EmotionKey, string> = {
    joy: "😊",
    sadness: "😔",
    anxiety: "😰",
    anger: "😤",
    hope: "🌱",
    calm: "😌",
    neutral: "💭",
  };
  return map[emotion] || "💭";
}

function getSuggestionForEmotion(emotion: EmotionKey): string {
  const suggestions: Record<EmotionKey, string> = {
    anxiety: "Try the 4-7-8 breathing exercise before your next writing session. It calms the nervous system.",
    sadness: "Consider a gentle physical activity this week. Movement shifts chemistry.",
    anger: "Try the Metaphor Mode ritual. Describe the anger as a landscape. It creates distance.",
    joy: "Capture this joy in a Letter to Future You. Future you will need to remember this feeling.",
    hope: "Channel this hope into a Spark Challenge. Momentum builds on momentum.",
    calm: "This calm is a resource. Write about what created it so you can return to it.",
    neutral: "Keep showing up. Even 'neutral' days build the habit.",
  };
  return suggestions[emotion] || "Keep writing. The patterns will reveal themselves.";
}

function generateGrowthInsight(
  entries: JournalEntry[],
  patterns: WeeklyPattern[]
): string {
  if (entries.length >= 7) {
    return "Seven days of showing up. You're not just journaling — you're building a relationship with yourself. That's the foundation everything else is built on.";
  }
  if (patterns.some((p) => p.type === "growth")) {
    return "You're growing. Not in the loud, visible way social media celebrates. In the quiet, steady way that actually lasts.";
  }
  if (entries.length >= 3) {
    return "Three entries is where patterns start to emerge. You're past the 'trying it out' phase. This is becoming real.";
  }
  return "Every word you write is a brick in the bridge back to yourself. Keep building.";
}

function calculateMoodTrend(
  thisWeek: JournalEntry[],
  lastWeek: JournalEntry[]
): "improving" | "stable" | "declining" | "unknown" {
  if (lastWeek.length === 0) return "unknown";

  const negativeEmotions: EmotionKey[] = ["anxiety", "sadness", "anger"];

  const thisWeekNegative = thisWeek.filter((e) =>
    negativeEmotions.includes(e.dominantEmotion)
  ).length / Math.max(thisWeek.length, 1);

  const lastWeekNegative = lastWeek.filter((e) =>
    negativeEmotions.includes(e.dominantEmotion)
  ).length / Math.max(lastWeek.length, 1);

  if (thisWeekNegative < lastWeekNegative - 0.2) return "improving";
  if (thisWeekNegative > lastWeekNegative + 0.2) return "declining";
  return "stable";
}

function getWeekNumber(date: Date): number {
  const start = new Date(date.getFullYear(), 0, 1);
  const diff = date.getTime() - start.getTime();
  return Math.ceil((diff / 86400000 + start.getDay() + 1) / 7);
}