"use client";

import { useState, useCallback, useEffect } from "react";
import { History, Flame, Mail, ArrowLeft, GraduationCap, Sparkles } from "lucide-react";
import JournalHeader from "@/components/journal/JournalHeader";
import JournalEditor from "@/components/journal/JournalEditor";
import CoachPanel from "@/components/journal/CoachPanel";
import BreathingExercise from "@/components/wellness/BreathingExercise";
import PastEmbersView from "@/components/journal/PastEmberViews";
import SparkNotification from "@/components/journal/SparkNotification";
import SparkChallengeCard from "@/components/journal/SparkChallengeCard";
import SparkChallengeModal from "@/components/journal/SparkChallengeModal";
import LetterComposer from "@/components/journal/LetterComposer";
import LetterMailbox from "@/components/journal/LetterMailBox";
import OnboardingView from "@/components/journal/OnboardingView";
import OnboardingProgress from "@/components/journal/OnboardingProgress";
import { useJournalStorage } from "@/hooks/useJournalStorage";
import { usePatternDetection } from "@/hooks/usePatternDetection";
import { useWeeklyPatterns } from "@/hooks/useWeeklyPatterns";
import { useSparkChallenges } from "@/hooks/useSparkChallenges";
import { useFutureLetters } from "@/hooks/useFutureLetters";
import { useOnboarding } from "@/hooks/useOnboarding";
import PatternRevealView from "@/components/journal/PatternRevealView";
import MainLayout from "@/components/layout/MainLayout";
import PrivacyShield from "@/components/journal/PrivacyShield";
import { usePrivacyLayer, PrivacyCheckResult } from "@/hooks/usePrivacyLayer";
import DisconnectButton from "@/components/disconnect/DisconnectButton";
import DisconnectModal from "@/components/disconnect/DisconnectModal";
import { useDisconnectMode } from "@/hooks/useDisconnectMode";
import { Ritual } from "@/data/rituals";

export interface JournalMessage {
  id: string;
  role: "user" | "agent";
  content: string;
  timestamp: Date;
  emotions?: string[];
  suggestedAction?: {
    title: string;
    description: string;
    link: string;
  };
  entryId?: string; // Link to the saved journal entry
}

export default function JournalPage() {
  const [messages, setMessages] = useState<JournalMessage[]>([]);
  const [isAgentThinking, setIsAgentThinking] = useState(false);
  const [showBreathing, setShowBreathing] = useState(false);
  const [viewMode, setViewMode] = useState<"write" | "archive" | "letters" | "compose" | "patterns">("write");

  // Future letters (Letters to Future You)
  const {
    letters,
    sealLetter,
    deliverLetter,
    readyLetters,
    sealedLetters,
    reflectedLetters,
    stats: letterStats,
  } = useFutureLetters();

  // Persistencia del diario
  const {
    entries,
    addEntry,
    deleteEntry,
    stats,
  } = useJournalStorage();

  // Pattern detection & spark challenges
  const { patterns, hasEnoughData } = usePatternDetection(entries);
  const { summary: weeklySummary, hasData: hasWeeklyData } = useWeeklyPatterns(entries);
  const {
    challenges,
    generateChallenge,
    acceptChallenge,
    completeChallenge,
    skipChallenge,
    activeChallenges,
    completedChallenges,
  } = useSparkChallenges();

  const [showChallengeModal, setShowChallengeModal] = useState(false);
  const [selectedChallenge, setSelectedChallenge] = useState<any>(null);
  const [notificationChallenge, setNotificationChallenge] = useState<any>(null);

  // Onboarding
  const {
    progress: onboardingProgress,
    todayContent,
    completeDay,
    skipOnboarding,
    isDayCompleted,
    completionPercentage,
  } = useOnboarding();

  const [showOnboarding, setShowOnboarding] = useState(false);

  // Privacy Shield (Gemma 4 via backend)
  const { checkPrivacy, isChecking: isPrivacyChecking } = usePrivacyLayer();
  const [privacyInfo, setPrivacyInfo] = useState<PrivacyCheckResult | null>(null);
  const [showCrisis, setShowCrisis] = useState(false);

  // Disconnect Mode (escape the scroll → real world)
  const {
    isActive: isDisconnectActive,
    isLoading: isDisconnectLoading,
    result: disconnectResult,
    activate: activateDisconnect,
    deactivate: deactivateDisconnect,
    claimMedal,
  } = useDisconnectMode();

  // Verifica si es la primera vez (mostrar onboarding automáticamente)
  useEffect(() => {
    if (!onboardingProgress.isOnboarded && onboardingProgress.completedDays.length === 0) {
      setShowOnboarding(true);
    }
  }, [onboardingProgress]);

  // Detect patterns and generate challenges when entries change
  useEffect(() => {
    if (hasEnoughData && patterns.length > 0) {
      const topPattern = patterns[0];
      const existingChallenge = challenges.find(
        (c) => c.patternId === topPattern.id && c.status !== "skipped"
      );

      if (!existingChallenge) {
        const newChallenge = generateChallenge(topPattern);
        if (newChallenge) {
          setNotificationChallenge({ pattern: topPattern, challenge: newChallenge });
        }
      }
    }
  }, [entries, patterns, hasEnoughData, challenges, generateChallenge]);

  const handleJournalSubmit = useCallback(
    async (
      text: string,
      ritual: Ritual,
      emberAnalysis: {
        wordCount: number;
        writingTimeSeconds: number;
        dominantEmotion: any;
        emotionScores: any;
        intensity: number;
      }
    ) => {
      // 🛡️ STEP 1: Privacy Layer check FIRST (Gemma 4)
      const privacyResult = await checkPrivacy(text);
      if (!privacyResult) return;

      // 🚨 STEP 2: If crisis detected, show alert and skip the agent
      if (privacyResult.crisisDetected) {
        setPrivacyInfo(privacyResult);
        setShowCrisis(true);
        return;
      }

      // 🤖 STEP 3: Use ANONYMIZED text for the chat + storage
      const safeText = privacyResult.anonymizedText;
      setPrivacyInfo(privacyResult);

      // 1. Add user message to chat (anonymized)
      const userMessage: JournalMessage = {
        id: Date.now().toString(),
        role: "user",
        content: safeText,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, userMessage]);
      setIsAgentThinking(true);

      // 2. Simulate agent thinking
      setTimeout(() => {
        const agentResponse = generateAgentResponse(safeText, ritual);

        // 3. Save entry to storage (persistencia) — ANONYMIZED + privacy info
        const savedEntry = addEntry({
          text: safeText,
          ritual,
          wordCount: emberAnalysis.wordCount,
          writingTimeSeconds: emberAnalysis.writingTimeSeconds,
          dominantEmotion: emberAnalysis.dominantEmotion,
          emotionScores: emberAnalysis.emotionScores,
          intensity: emberAnalysis.intensity,
          agentResponse: agentResponse.content,
          agentEmotions: agentResponse.emotions,
          privacyInfo: {
            piiRedacted: privacyResult.piiRedacted,
            moodDetected: privacyResult.moodDetected,
            moodScore: privacyResult.moodScore,
            processingTimeMs: privacyResult.processingTimeMs,
          },
        });

        // 4. Add agent response to chat with link to saved entry
        const agentMessage: JournalMessage = {
          ...agentResponse,
          entryId: savedEntry.id,
        };
        setMessages((prev) => [...prev, agentMessage]);
        setIsAgentThinking(false);

        // After saving the entry, check if it completes an onboarding day
        if (
          !onboardingProgress.isOnboarded &&
          todayContent &&
          !isDayCompleted(todayContent.day)
        ) {
          completeDay(todayContent.day);
        }
      }, 2000);
    },
    [addEntry, checkPrivacy, onboardingProgress, todayContent, isDayCompleted, completeDay]
  );

  // Show archive view
  if (viewMode === "archive") {
    return (
      <PastEmbersView
        entries={entries}
        stats={stats}
        onBack={() => setViewMode("write")}
        onDeleteEntry={deleteEntry}
      />
    );
  }

  if (viewMode === "letters") {
    return (
      <div className="min-h-screen bg-cream-100">
        <header className="bg-white border-b border-cream-200 sticky top-0 z-40">
          <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setViewMode("write")}
                className="p-2 hover:bg-cream-200 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-warm-gray" />
              </button>
              <div className="w-10 h-10 bg-terracotta-500 rounded-xl flex items-center justify-center">
                <Mail className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="font-serif font-bold text-coffee-800 text-lg">
                  Letters to Future You
                </h1>
                <p className="text-xs text-warm-light">
                  Conversations across time
                </p>
              </div>
            </div>
            <button
              onClick={() => setViewMode("compose")}
              className="btn-primary flex items-center gap-2"
            >
              <Mail className="w-4 h-4" />
              Write a Letter
            </button>
          </div>
        </header>

        <div className="max-w-6xl mx-auto px-6 py-8">
          <LetterMailbox
            letters={letters}
            readyLetters={readyLetters}
            sealedLetters={sealedLetters}
            reflectedLetters={reflectedLetters}
            stats={letterStats}
            onDeliver={deliverLetter}
          />
        </div>
      </div>
    );
  }

  if (viewMode === "compose") {
    return (
      <div className="min-h-screen bg-cream-100">
        <div className="max-w-2xl mx-auto px-6 py-8">
          <LetterComposer
            onSeal={(fullText, answers, timeframe) => {
              sealLetter(fullText, answers, timeframe);
              setViewMode("letters");
            }}
            onCancel={() => setViewMode("letters")}
          />
        </div>
      </div>
    );
  }

  if (viewMode === "patterns" && weeklySummary) {
    return (
      <PatternRevealView
        summary={weeklySummary}
        onBack={() => setViewMode("write")}
      />
    );
  }

  // Show onboarding (first-time experience)
  if (showOnboarding) {
    return (
      <OnboardingView
        progress={onboardingProgress}
        todayContent={todayContent}
        isDayCompleted={isDayCompleted}
        onBack={() => setShowOnboarding(false)}
        onStartWriting={() => {
          setShowOnboarding(false);
          // Auto-select the suggested ritual for today
          // (you can set the ritual here based on todayContent.suggestedRitual)
        }}
        onSkip={() => {
          skipOnboarding();
          setShowOnboarding(false);
        }}
      />
    );
  }

  return (
    <MainLayout>
      <div className="min-h-screen bg-cream-100 flex flex-col">
      <JournalHeader streakDays={stats.currentStreak} entryCount={entries.length} />

      {/* Past Embers + Letters buttons (top right floating) */}
      <div className="fixed top-20 right-6 z-30 flex flex-col gap-2">
        <button
          onClick={() => setViewMode("archive")}
          className="btn-secondary flex items-center gap-2 shadow-warm-lg"
        >
          <History className="w-4 h-4" />
          Past Embers
          {entries.length > 0 && (
            <span className="bg-terracotta-500 text-white text-xs px-2 py-0.5 rounded-full">
              {entries.length}
            </span>
          )}
        </button>

        <button
          onClick={() => setViewMode("letters")}
          className="btn-secondary flex items-center gap-2 shadow-warm-lg"
        >
          <Mail className="w-4 h-4" />
          Letters
          {readyLetters.length > 0 && (
            <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full animate-pulse">
              {readyLetters.length}
            </span>
          )}
        </button>

        {hasWeeklyData && (
          <button
            onClick={() => setViewMode("patterns")}
            className="btn-secondary flex items-center gap-2 shadow-warm-lg"
          >
            <Sparkles className="w-4 h-4" />
            Pattern Reveal
          </button>
        )}

        <button
          onClick={() => setShowOnboarding(true)}
          className="btn-secondary flex items-center gap-2 shadow-warm-lg"
        >
          <GraduationCap className="w-4 h-4" />
          {onboardingProgress.isOnboarded
            ? "7-Day Challenge"
            : `Day ${onboardingProgress.currentDay}/7`}
          <span className="bg-terracotta-500 text-white text-xs px-2 py-0.5 rounded-full">
            {completionPercentage}%
          </span>
        </button>
      </div>

      {/* Main Content: Split View */}
      <div className="flex-1 flex flex-col lg:flex-row max-w-7xl mx-auto w-full px-6 py-6 gap-6">
        {/* Left: Writing Zone */}
        <div className="lg:w-1/2 flex flex-col gap-6">
          {/* Privacy Shield - appears after submission */}
          {privacyInfo && privacyInfo.shieldActive && (
            <PrivacyShield
              info={{
                piiRedacted: privacyInfo.piiRedacted,
                moodDetected: privacyInfo.moodDetected,
                moodScore: privacyInfo.moodScore,
                shieldActive: true,
                processingTimeMs: privacyInfo.processingTimeMs,
                crisisAlert: showCrisis ? privacyInfo.crisisAlert : null,
              }}
              onDismissCrisis={() => setShowCrisis(false)}
            />
          )}

          <JournalEditor
            onSubmit={handleJournalSubmit}
            isDisabled={isAgentThinking || isPrivacyChecking}
          />

          {/* Active Challenges Section (between editor and breathing) */}
          {activeChallenges.length > 0 && (
            <div className="card-static p-5">
              <h3 className="font-serif font-semibold text-coffee-800 mb-4 flex items-center gap-2">
                <Flame className="w-5 h-5 text-terracotta-500" />
                Active Spark Challenges
              </h3>
              <div className="space-y-4">
                {activeChallenges.slice(0, 2).map((challenge) => (
                  <SparkChallengeCard
                    key={challenge.id}
                    challenge={challenge}
                    onAccept={() => acceptChallenge(challenge.id)}
                    onComplete={() => {
                      setSelectedChallenge(challenge);
                      setShowChallengeModal(true);
                    }}
                    onSkip={() => skipChallenge(challenge.id)}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Breathing Exercise - Collapsible */}
          <div className="card-static p-4">
            <button
              onClick={() => setShowBreathing(!showBreathing)}
              className="w-full flex items-center justify-between text-left"
            >
              <div className="flex items-center gap-3">
                <span className="text-xl">🫁</span>
                <div>
                  <h3 className="font-medium text-coffee-800 text-sm">
                    Need a moment? Try 4-7-8 Breathing
                  </h3>
                  <p className="text-xs text-warm-light">
                    Calm your nervous system in 60 seconds
                  </p>
                </div>
              </div>
              <span className="text-warm-gray">
                {showBreathing ? "▲" : "▼"}
              </span>
            </button>

            {showBreathing && (
              <div className="mt-4 pt-4 border-t border-cream-200">
                <BreathingExercise />
              </div>
            )}
          </div>
        </div>

        {/* Right: Coach Zone */}
        <div className="lg:w-1/2 flex flex-col">
          <CoachPanel
            messages={messages}
            isThinking={isAgentThinking}
            onViewPastEntry={(entryId) => {
              // Switch to archive view and open that entry
              setViewMode("archive");
            }}
          />
        </div>
      </div>

      {/* Spark Notification (fixed bottom right) */}
      {notificationChallenge && (
        <SparkNotification
          pattern={notificationChallenge.pattern}
          challenge={notificationChallenge.challenge}
          onViewChallenge={() => {
            setSelectedChallenge(notificationChallenge.challenge);
            setShowChallengeModal(true);
            setNotificationChallenge(null);
          }}
          onDismiss={() => setNotificationChallenge(null)}
        />
      )}

      {/* Challenge Modal */}
      {showChallengeModal && (
        <SparkChallengeModal
          challenge={selectedChallenge}
          onClose={() => {
            setShowChallengeModal(false);
            setSelectedChallenge(null);
          }}
          onAccept={acceptChallenge}
          onComplete={completeChallenge}
          onSkip={skipChallenge}
          onAddToCalendar={(challenge) => {
            window.location.href = "/calendar";
          }}
        />
      )}

      {/* Floating Disconnect Button */}
      <DisconnectButton
        onClick={activateDisconnect}
        isHidden={isAgentThinking || isDisconnectLoading}
      />

      {/* Disconnect Modal */}
      {disconnectResult && isDisconnectActive && (
        <DisconnectModal
          result={disconnectResult}
          onClose={deactivateDisconnect}
          onClaimMedal={claimMedal}
        />
      )}
      </div>
    </MainLayout>
  );
}

// (generateAgentResponse function remains the same as before)
function generateAgentResponse(userText: string, ritual: Ritual): any {
  const textLower = userText.toLowerCase();

  const emotions: string[] = [];
  if (textLower.match(/anxious|worried|nervous|scared|overwhelmed/))
    emotions.push("anxiety");
  if (textLower.match(/sad|lonely|empty|lost/)) emotions.push("sadness");
  if (textLower.match(/compare|behind|everyone else/))
    emotions.push("comparison");
  if (textLower.match(/proud|happy|excited|grateful/)) emotions.push("hope");
  if (textLower.match(/peace|calm|quiet|gentle/)) emotions.push("calm");
  if (emotions.length === 0) emotions.push("reflection");

  let response = "";
  let suggestedAction = undefined;

  if (emotions.includes("comparison")) {
    response = `I hear you. That comparison is heavy, isn't it?\n\nHere's what I notice: you're measuring your behind-the-scenes against someone else's highlight reel. That's not a fair comparison.\n\n${ritual.followUpQuestions[0] || "What's ONE thing you did this week that mattered to you? Not impressive, just meaningful."}`;
    suggestedAction = {
      title: "Try a creative reset",
      description:
        "A beginner-friendly art workshop near you. No audience, no posting — just creating.",
      link: "/activities",
    };
  } else if (emotions.includes("anxiety")) {
    response = `Thank you for sharing that. Anxiety can feel so isolating, even when we're surrounded by people.\n\n${ritual.followUpQuestions[0] || "What would you do today if the anxiety wasn't speaking so loudly? Even something tiny."}`;
    suggestedAction = {
      title: "A gentle first step",
      description:
        "A quiet morning walk in the park. Just you, your thoughts, and some fresh air.",
      link: "/activities",
    };
  } else if (emotions.includes("sadness")) {
    response = `I'm glad you felt safe enough to write that. Sadness deserves space, not judgment.\n\n${ritual.followUpQuestions[0] || "When you're ready, what small thing brings even 1% of light?"}`;
    suggestedAction = {
      title: "Volunteer with animals",
      description:
        "Sometimes helping others (even furry ones) helps us feel connected again.",
      link: "/activities",
    };
  } else if (emotions.includes("hope")) {
    response = `I love reading this! Hold onto that feeling — it's real, and it's yours.\n\n${ritual.followUpQuestions[0] || "What made this moment feel so good?"}`;
  } else {
    response = `Thank you for writing. Every word is a step toward understanding yourself better.\n\n${ritual.followUpQuestions[0] || "What's underneath these words?"}`;
  }

  return {
    id: (Date.now() + 1).toString(),
    role: "agent",
    content: response,
    timestamp: new Date(),
    emotions,
    suggestedAction,
  };
}