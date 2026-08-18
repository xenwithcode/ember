"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import {
  X,
  Play,
  Pause,
  RotateCcw,
  ArrowRight,
  SkipForward,
  MapPin,
  Calendar,
  Users,
  CheckCircle2,
  Flame,
  Trophy,
  Mail,
  Volume2,
  VolumeX,
  Sparkles,
  Footprints,
  ShieldCheck,
} from "lucide-react";
import { mockActivities, Activity } from "@/data/activities";
import {
  mockStats,
  mockAchievements,
  mockIdentityGraph,
} from "@/data/dashboard";
import { speakText } from "@/hooks/useElevenLabs";

interface EmberJourneyProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Scenario {
  id: string;
  title: string;
  emoji: string;
  description: string;
  journalEntry: string;
  agentResponse: string;
  emotions: string[];
  activityId: string;
  outcome: string;
}

const scenarios: Scenario[] = [
  {
    id: "comparison",
    title: "Comparison Anxiety",
    emoji: "😰",
    description: "Feeling behind after seeing a friend's success",
    journalEntry:
      "I saw my friend got an internship at Google. I feel like I'm falling behind. Everyone else has their life figured out and I'm just... here. What's wrong with me?",
    agentResponse:
      "I hear you. That comparison hit hard, didn't it?\n\nHere's what I notice: you're measuring your behind-the-scenes against someone else's highlight reel. That's not a fair comparison.\n\nYou mentioned drawing used to make you happy. When did you last draw just for yourself? No audience, no posting?",
    emotions: ["comparison", "anxiety"],
    activityId: "watercolor-workshop",
    outcome:
      "2 weeks later: Completed 3 creative activities. Mood improved from 4/10 to 7/10. Identity Graph updated: 'Creating without posting feels liberating.'",
  },
  {
    id: "isolation",
    title: "Social Isolation",
    emoji: "🫥",
    description: "Haven't talked to anyone in days",
    journalEntry:
      "I haven't talked to anyone in 4 days. I keep canceling plans because I feel like I'm too much trouble. My phone is full of contacts but I feel completely alone.",
    agentResponse:
      "Thank you for sharing that. Loneliness in a crowded world is one of the heaviest feelings.\n\nI want you to know: reaching out isn't being 'too much trouble.' It's being human.\n\nWhat if we started really small? Not a party, not a big hangout. Just one low-pressure interaction where you don't have to perform?",
    emotions: ["sadness", "isolation"],
    activityId: "board-game-cafe",
    outcome:
      "2 weeks later: Attended 2 social events. Made one friend at the board game café. Mood improved from 3/10 to 6/10. Identity Graph updated: 'Connection is what I was missing.'",
  },
  {
    id: "imposter",
    title: "Imposter Syndrome",
    emoji: "🎭",
    description: "Got the job but feels like a fraud",
    journalEntry:
      "I got the job I applied for, but now I'm terrified. Everyone is going to realize I'm not as smart as they think. I got lucky, that's all. Any day now they'll find out I'm a fraud.",
    agentResponse:
      "First: congratulations on the job. That wasn't luck — you earned it.\n\nImposter syndrome is your brain trying to protect you from disappointment. But here's the truth: you were chosen because they saw something real in you.\n\nLet's build evidence against the 'fraud' narrative. What's one small thing you did well this week? Doesn't have to be impressive, just real.",
    emotions: ["anxiety", "self-doubt"],
    activityId: "book-club-first-chapters",
    outcome:
      "2 weeks later: Spoke up in 3 meetings. Completed 2 intellectual activities. Mood improved from 4/10 to 7/10. Identity Graph updated: 'I belong in rooms I've earned.'",
  },
  {
    id: "scroll",
    title: "Stuck in the Scroll",
    emoji: "📱",
    description: "Trapped in the feed — Ember points you outside",
    journalEntry:
      "Three hours. I've been scrolling for three hours. Everyone's life looks better than mine. My brother Jake from Lincoln High just posted about his scholarship. I hate this feeling but I can't stop. I need to get out of here.",
    agentResponse:
      "I know that loop — it was designed to keep you in it. Your brain isn't broken, it's just hooked. And the fastest way out isn't more willpower, it's changing your physical space.\n\nLet's find a place near you, right now.",
    emotions: ["scroll-trap", "restlessness"],
    activityId: "bird-watching-walk",
    outcome:
      "Same day: 20 minutes by the riverside, zero screens. Medal claimed: 'Disconnected at Riverside Walk Trail'. Mood improved from 3/10 to 6/10.",
  },
];

const curatedActivities: Activity[] = mockActivities.filter((a) =>
  [
    "watercolor-workshop",
    "sunrise-yoga-park",
    "board-game-cafe",
    "bird-watching-walk",
    "animal-shelter-volunteer",
  ].includes(a.id)
);

const activityEmojis: Record<string, string> = {
  "watercolor-workshop": "🎨",
  "sunrise-yoga-park": "🧘",
  "board-game-cafe": "🎲",
  "bird-watching-walk": "🐦",
  "animal-shelter-volunteer": "🐾",
};

type Step =
  | { type: "journal"; content: string; duration: number; narration?: string }
  | { type: "privacy"; rawText: string; duration: number; narration?: string }
  | { type: "thinking"; label: string; duration: number; narration?: string }
  | { type: "agent"; content: string; emotions: string[]; duration: number; narration?: string }
  | { type: "activity"; activityId: string; duration: number; narration?: string }
  | { type: "map"; activityId: string; duration: number; narration?: string }
  | { type: "register"; activityId: string; inviteFriend: boolean; duration: number; narration?: string }
  | { type: "attend"; duration: number; narration?: string }
  | { type: "disconnect"; gemmaInsight: string; duration: number; narration?: string }
  | { type: "places"; duration: number; narration?: string }
  | { type: "claim"; duration: number; narration?: string };

interface StepNarration {
  journal: string;
  privacy?: string;
  thinking: string;
  agent: string;
  activity?: string;
  map?: string;
  register?: string;
  attend?: string;
  reveal: string;
  disconnect?: string;
  places?: string;
  claim?: string;
}

// Places surfaced by Disconnect Mode (geolocated, demo version)
const disconnectPlaces = [
  {
    emoji: "🌳",
    name: "Riverside Walk Trail",
    distance: "450m",
    walkTime: "6 min walk",
    description:
      "Flat riverside path, mostly empty in the afternoons. Bring headphones if you want.",
    challenge:
      "Take a photo of something you find beautiful. No people, just nature.",
  },
  {
    emoji: "📚",
    name: "Community Library - Williamsburg",
    distance: "800m",
    walkTime: "10 min walk",
    description:
      "Small community library with cozy reading nooks and free WiFi.",
    challenge:
      "Pick up a book you'd never normally read. Read one chapter.",
  },
];

const scenarioNarrations: Record<string, StepNarration> = {
  comparison: {
    journal:
      "She just watched a friend's post about a new internship, and the spiral has begun. Instead of doom-scrolling, she opens Ember and writes what she actually feels.",
    thinking:
      "Ember's coach reads between the lines, detecting comparison and anxiety in real time.",
    agent:
      "No judgment. No advice dump. Just recognition, and one honest question: when did you last draw just for yourself?",
    activity:
      "Insight is only half of it. Ember finds something concrete — a watercolor workshop nearby, matched to her comfort level and her old love of drawing.",
    map:
      "Here it is on the map. Twenty minutes from her place. Low pressure, beginner friendly.",
    register:
      "One tap and it's done. Spot reserved, added to her calendar, and an invitation drafted to bring a friend along.",
    attend:
      "On Saturday, she shows up. No phone. No audience. Just creating something with her own hands.",
    reveal:
      "Two weeks later, here's her Triumph Board. The streak, the activities, and an Identity Graph that no longer says not enough.",
  },
  isolation: {
    journal:
      "Four days without a real conversation. The phone is full of contacts, but the silence is deafening. He writes what he can't say out loud.",
    thinking:
      "The coach spots what he can't see: the sadness, the isolation, the fear of being a burden.",
    agent:
      "The response is warm and direct — reaching out isn't being too much trouble, it's being human. And it suggests starting impossibly small.",
    activity:
      "Small means somewhere low pressure: a board game café for beginners.",
    map: "Just a few blocks away. Walkable. Doable.",
    register:
      "Spot reserved, reminder set, and an invitation drafted for a friend — because the first step is easier with company.",
    attend: "He goes. He plays. And he laughs, actually.",
    reveal:
      "Here's his Triumph Board two weeks later. A new streak, a new connection, and the graph shows what he learned: connection was what he was missing.",
  },
  imposter: {
    journal:
      "She just landed the job she wanted — and now she's terrified she'll be exposed as a fraud. She takes it to the journal.",
    thinking:
      "The coach recognizes the signature of imposter syndrome: anxiety wearing a mask of humility.",
    agent:
      "First, congratulations — that wasn't luck. Then a gentle challenge: build evidence against the fraud narrative, one small thing done well at a time.",
    activity:
      "Evidence needs a place to grow. A book club where she can practice speaking up in real conversations.",
    map: "Here it is — a quiet library branch, ten minutes away.",
    register: "Scheduled, reminded, and she's in. One tap.",
    attend:
      "She shows up. And she speaks up — in a room full of strangers, for the first time in weeks.",
    reveal:
      "Her Triumph Board, two weeks later. The graph says it all: I belong in rooms I've earned.",
  },
  scroll: {
    journal:
      "Three hours deep in the scroll — the feed feels endless and everything on it outshines his own life. But instead of staying trapped, he opens Ember and writes what he actually feels.",
    privacy:
      "But here's what makes Ember's architecture truly unique. This entry never goes straight to the cloud. First, it passes through the Privacy Layer — Gemma 4 — which anonymizes everything in seconds: Jake becomes a person placeholder, his school becomes a school placeholder.",
    thinking:
      "Only the anonymized text reaches Gemini 3.5 for the deep emotional coaching. And if Gemma had detected crisis keywords, Ember triggers its safety protocol with the 988 lifeline — instantly.",
    agent:
      "The coach doesn't lecture. It names the loop and offers the fastest exit: change your physical space.",
    disconnect:
      "One tap on the red button and Disconnect Mode activates. Gemma 4 reads the moment and generates a persuasive insight in under a second.",
    places:
      "Ember surfaces two real places near him right now — each with its own micro-challenge. Distance, walk time, and exactly what to do when he gets there.",
    claim:
      "He picks one, accepts the mission, and the medal is his. No advice, no lecture. Action — geolocated, personalized, real.",
    reveal:
      "And when he comes back, his medal is waiting on the Triumph Board. This is what an agent doing things looks like. Not advice. Action — geolocated, personalized, real.",
  },
};

const activityNarrations: StepNarration = {
  journal: "",
  thinking: "",
  agent: "",
  activity:
    "Let's follow a real activity. Here's what Ember shows when a user finds something they like — full details, schedule, and what to expect.",
  map: "Here it is on the map. A verified location, close by, exactly where the user expects it.",
  register:
    "Ember handles the rest: registration, calendar invite, reminder, and an invitation drafted for a friend.",
  attend:
    "And when the day arrives, the user just shows up. No logistics, no friction — that's the whole point. Small steps, real world.",
  reveal:
    "Here's the payoff, two weeks later: the Triumph Board. Every small step counted.",
};

const getActivity = (id: string) =>
  mockActivities.find((a) => a.id === id) ?? mockActivities[0];

// Plays a pre-generated narration MP3; falls back to live TTS if the
// file is missing, and resolves immediately when aborted.
const playNarration = (
  key: string,
  text: string,
  signal: AbortSignal
): Promise<void> => {
  if (typeof window === "undefined") return Promise.resolve();
  return new Promise((resolve) => {
    const audio = new Audio(`/narration/${key}.mp3`);
    const cleanup = () => {
      audio.onended = audio.onerror = audio.onabort = null;
    };
    const fallback = () => {
      cleanup();
      speakText(text, { signal }).then(resolve).catch(resolve);
    };
    audio.onended = () => {
      cleanup();
      resolve();
    };
    audio.onerror = fallback;
    signal.addEventListener(
      "abort",
      () => {
        cleanup();
        audio.pause();
        resolve();
      },
      { once: true }
    );
    audio.play().catch(fallback);
  });
};

export default function EmberJourney({ isOpen, onClose }: EmberJourneyProps) {
  const [track, setTrack] = useState<"scenario" | "activity" | null>(null);
  const [selectedScenario, setSelectedScenario] = useState<Scenario | null>(null);
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);
  const [steps, setSteps] = useState<Step[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [typedText, setTypedText] = useState("");
  const [isPlaying, setIsPlaying] = useState(true);
  const [showReveal, setShowReveal] = useState(false);
  const [isVoiceEnabled, setIsVoiceEnabled] = useState(true);
  const voiceAbortRef = useRef<AbortController | null>(null);

  const resetAll = useCallback(() => {
    setTrack(null);
    setSelectedScenario(null);
    setSelectedActivity(null);
    setSteps([]);
    setCurrentStep(0);
    setTypedText("");
    setIsPlaying(true);
    setShowReveal(false);
  }, []);

  useEffect(() => {
    if (!isOpen) {
      resetAll();
      voiceAbortRef.current?.abort();
      voiceAbortRef.current = null;
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
    }
  }, [isOpen, resetAll]);

  // Muting aborts any active narration
  useEffect(() => {
    if (!isVoiceEnabled) {
      voiceAbortRef.current?.abort();
      voiceAbortRef.current = null;
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
    }
  }, [isVoiceEnabled]);

  // Auto-play engine: each step advances only when its narration has finished
  useEffect(() => {
    if (!isOpen || !isPlaying) return;
    if (steps.length === 0) return;

    if (showReveal) {
      if (isVoiceEnabled) {
        const narration =
          track === "scenario" && selectedScenario
            ? scenarioNarrations[selectedScenario.id]?.reveal
            : activityNarrations.reveal;
        if (narration) {
          const controller = new AbortController();
          voiceAbortRef.current = controller;
          const audioKey =
            track === "scenario" && selectedScenario
              ? `${selectedScenario.id}-reveal`
              : "activity-reveal";
          playNarration(audioKey, narration, controller.signal).catch(() => {});
        }
      }
      return () => {
        voiceAbortRef.current?.abort();
        voiceAbortRef.current = null;
      };
    }

    if (currentStep >= steps.length) {
      setShowReveal(true);
      return;
    }

    const step = steps[currentStep];
    if (!step) return;

    let cancelled = false;
    const controller = new AbortController();
    voiceAbortRef.current = controller;

    let speechDone = !step.narration || !isVoiceEnabled;
    let minElapsed = false;
    let typingDone = !(step.type === "journal" || step.type === "agent");

    const tryAdvance = () => {
      if (cancelled || !(speechDone && minElapsed && typingDone)) return;
      cancelled = true;
      setTypedText("");
      setCurrentStep((p) => p + 1);
    };

    if (step.narration && isVoiceEnabled) {
      const audioKey = `${track === "scenario" && selectedScenario ? selectedScenario.id : "activity"}-${step.type}`;
      playNarration(audioKey, step.narration, controller.signal)
        .then(() => {
          speechDone = true;
          tryAdvance();
        })
        .catch(() => {
          speechDone = true;
          tryAdvance();
        });
    }

    const minTimer = setTimeout(() => {
      minElapsed = true;
      tryAdvance();
    }, step.duration);

    // Safety cap: never let a hung voice block the demo forever
    const capTimer = setTimeout(() => {
      if (cancelled) return;
      cancelled = true;
      setTypedText("");
      setCurrentStep((p) => p + 1);
    }, Math.max(step.duration + 60000, 60000));

    let typingInterval: ReturnType<typeof setInterval> | null = null;
    if (step.type === "journal" || step.type === "agent") {
      let index = 0;
      typingInterval = setInterval(() => {
        index++;
        setTypedText(step.content.slice(0, index));
        if (index >= step.content.length) {
          if (typingInterval) clearInterval(typingInterval);
          typingDone = true;
          tryAdvance();
        }
      }, 22);
    }

    return () => {
      cancelled = true;
      if (voiceAbortRef.current === controller) {
        voiceAbortRef.current.abort();
        voiceAbortRef.current = null;
      }
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
      clearTimeout(minTimer);
      clearTimeout(capTimer);
      if (typingInterval) clearInterval(typingInterval);
    };
  }, [
    currentStep,
    isOpen,
    isPlaying,
    steps,
    showReveal,
    isVoiceEnabled,
    track,
    selectedScenario,
  ]);

  const startScenario = (scenario: Scenario) => {
    const activity = getActivity(scenario.activityId);
    const narration = scenarioNarrations[scenario.id];
    setSelectedScenario(scenario);
    setSelectedActivity(activity);
    setTrack("scenario");

    if (scenario.id === "scroll") {
      // Disconnect Mode journey: journal → privacy → Gemma insight → places → medal
      setSteps([
        { type: "journal", content: scenario.journalEntry, duration: 3500, narration: narration.journal },
        {
          type: "privacy",
          rawText: scenario.journalEntry,
          duration: 4500,
          narration: narration.privacy,
        },
        { type: "thinking", label: "Only anonymized text reaches Gemini 3.5", duration: 2000, narration: narration.thinking },
        { type: "agent", content: scenario.agentResponse, emotions: scenario.emotions, duration: 2800, narration: narration.agent },
        {
          type: "disconnect",
          gemmaInsight:
            "Pattern detected: 3+ hours of continuous screen time. A change of physical space resets dopamine levels in 20 minutes.",
          duration: 3600,
          narration: narration.disconnect,
        },
        { type: "places", duration: 4500, narration: narration.places },
        { type: "claim", duration: 3500, narration: narration.claim },
      ]);
    } else {
      setSteps([
        { type: "journal", content: scenario.journalEntry, duration: 3500, narration: narration.journal },
        { type: "thinking", label: "Coach analyzes your emotions...", duration: 2000, narration: narration.thinking },
        { type: "agent", content: scenario.agentResponse, emotions: scenario.emotions, duration: 2800, narration: narration.agent },
        { type: "activity", activityId: activity.id, duration: 3800, narration: narration.activity },
        { type: "map", activityId: activity.id, duration: 3800, narration: narration.map },
        { type: "register", activityId: activity.id, inviteFriend: true, duration: 3800, narration: narration.register },
        { type: "attend", duration: 3300, narration: narration.attend },
      ]);
    }

    setCurrentStep(0);
    setTypedText("");
    setShowReveal(false);
    setIsPlaying(true);
  };

  const startActivity = (activity: Activity) => {
    setSelectedActivity(activity);
    setTrack("activity");
    setSteps([
      { type: "activity", activityId: activity.id, duration: 4300, narration: activityNarrations.activity },
      { type: "map", activityId: activity.id, duration: 4300, narration: activityNarrations.map },
      { type: "register", activityId: activity.id, inviteFriend: true, duration: 4300, narration: activityNarrations.register },
      { type: "attend", duration: 3300, narration: activityNarrations.attend },
    ]);
    setCurrentStep(0);
    setTypedText("");
    setShowReveal(false);
    setIsPlaying(true);
  };

  if (!isOpen) return null;

  const step = steps[currentStep];
  const totalSteps = steps.length + 1; // +1 for the dashboard reveal
  const progress = ((Math.min(currentStep, steps.length) + 1) / totalSteps) * 100;
  const activity = selectedActivity;
  const isTypingStep = step?.type === "journal" || step?.type === "agent";
  const displayText = isTypingStep ? typedText : "";

  const handleSkip = () => {
    if (currentStep < steps.length) {
      setCurrentStep((p) => p + 1);
      setTypedText("");
    } else {
      setShowReveal(true);
    }
  };

  const handleReplay = () => {
    if (track === "scenario" && selectedScenario) {
      startScenario(selectedScenario);
    } else if (selectedActivity) {
      startActivity(selectedActivity);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-coffee-900/95 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6">
      <div className="bg-cream-100 rounded-3xl max-w-3xl w-full max-h-[92vh] overflow-hidden shadow-warm-xl flex flex-col">
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-cream-200 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-terracotta-500 rounded-xl flex items-center justify-center">
              <span className="text-lg">🔥</span>
            </div>
            <div>
              <h2 className="font-serif font-bold text-coffee-800">
                {showReveal
                  ? "Your Triumph Board"
                  : track
                  ? track === "scenario"
                    ? `${selectedScenario?.emoji} ${selectedScenario?.title}`
                    : "Real-world Activity"
                  : "Try Ember"}
              </h2>
              <p className="text-xs text-warm-light">
                {showReveal
                  ? "What 2 weeks with Ember looks like"
                  : track
                  ? "Watch the full journey — it plays by itself"
                  : "Pick a journey and watch it unfold"}
              </p>
            </div>
          </div>
          {/* Narration toggle + close */}
          <div className="flex items-center gap-1">
            <button
              onClick={() => setIsVoiceEnabled(!isVoiceEnabled)}
              className={`p-2 rounded-full transition-colors ${
                isVoiceEnabled
                  ? "text-terracotta-500 bg-terracotta-500/10"
                  : "text-warm-light hover:text-warm-gray"
              }`}
              title={isVoiceEnabled ? "Voice narration on" : "Voice narration off"}
              aria-label={isVoiceEnabled ? "Mute voice narration" : "Unmute voice narration"}
            >
              {isVoiceEnabled ? (
                <Volume2 className="w-5 h-5" />
              ) : (
                <VolumeX className="w-5 h-5" />
              )}
            </button>
            <button
              onClick={() => {
                onClose();
                resetAll();
              }}
              className="p-2 hover:bg-cream-200 rounded-full transition-colors"
            >
              <X className="w-5 h-5 text-warm-gray" />
            </button>
          </div>
        </div>

        {/* Progress bar */}
        <div className="h-1 bg-cream-200 shrink-0">
          <div
            className="h-full bg-terracotta-500 transition-all duration-700"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6">
          {!track && (
            /* ============ SELECTION ============ */
            <div className="space-y-8 animate-fade-in-up">
              {/* Track 1: Scenarios */}
              <div>
                <h3 className="font-serif text-lg font-semibold text-coffee-800 mb-1 flex items-center gap-2">
                  <span className="text-xl">😰</span> Scenario Journeys
                </h3>
                <p className="text-sm text-warm-light mb-4">
                  Follow a real struggle end-to-end: journal → coach → activity → growth
                </p>
                <div className="grid sm:grid-cols-3 gap-3">
                  {scenarios.map((scenario) => (
                    <button
                      key={scenario.id}
                      onClick={() => startScenario(scenario)}
                      className="card p-4 text-left hover:shadow-warm-lg transition-all duration-300 hover:-translate-y-1 group"
                    >
                      <span className="text-2xl block mb-2">{scenario.emoji}</span>
                      <h4 className="font-serif font-semibold text-coffee-800 text-sm mb-1">
                        {scenario.title}
                      </h4>
                      <p className="text-xs text-warm-gray leading-relaxed">
                        {scenario.description}
                      </p>
                      <span className="inline-flex items-center gap-1 text-xs font-medium text-terracotta-500 mt-3 group-hover:gap-2 transition-all">
                        Auto-play <ArrowRight className="w-3 h-3" />
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Track 2: Activities */}
              <div>
                <h3 className="font-serif text-lg font-semibold text-coffee-800 mb-1 flex items-center gap-2">
                  <span className="text-xl">🎨</span> Activity Journeys
                </h3>
                <p className="text-sm text-warm-light mb-4">
                  Pick a real-world activity: see it, locate it on the map, and register
                </p>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {curatedActivities.map((act) => (
                    <button
                      key={act.id}
                      onClick={() => startActivity(act)}
                      className="card p-4 text-left hover:shadow-warm-lg transition-all duration-300 hover:-translate-y-1 group"
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-2xl">{activityEmojis[act.id] ?? "🌱"}</span>
                        <span className="text-xs font-medium text-warm-light uppercase tracking-wide">
                          {act.category}
                        </span>
                      </div>
                      <h4 className="font-serif font-semibold text-coffee-800 text-sm mb-1">
                        {act.title}
                      </h4>
                      <p className="text-xs text-warm-gray leading-relaxed line-clamp-2">
                        {act.description}
                      </p>
                      <div className="flex items-center gap-3 mt-3 text-xs text-warm-light">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3" /> {act.locationName}
                        </span>
                        <span>{act.price === 0 ? "Free" : `$${act.price}`}</span>
                      </div>
                      <span className="inline-flex items-center gap-1 text-xs font-medium text-terracotta-500 mt-3 group-hover:gap-2 transition-all">
                        Auto-play <ArrowRight className="w-3 h-3" />
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {track && !showReveal && (
            /* ============ AUTO-PLAY STEPS ============ */
            <div>
              {/* Step dots */}
              <div className="flex items-center gap-2 mb-6">
                {Array.from({ length: totalSteps }).map((_, index) => (
                  <div
                    key={index}
                    className={`w-2 h-2 rounded-full transition-all ${
                      index === Math.min(currentStep, steps.length)
                        ? "bg-terracotta-500 w-6"
                        : index < currentStep
                        ? "bg-terracotta-500/50"
                        : "bg-cream-200"
                    }`}
                  />
                ))}
              </div>

              {/* Journal entry */}
              {step?.type === "journal" && (
                <div className="animate-fade-in-up">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-8 h-8 bg-coffee-800 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm">U</span>
                    </div>
                    <span className="text-sm font-medium text-coffee-800">
                      {track === "scenario" ? "User writes in journal" : "Journaling"}
                    </span>
                  </div>
                  <div className="bg-white rounded-2xl p-6 border border-cream-200 shadow-warm">
                    <p className="font-serif text-lg text-coffee-800 leading-relaxed italic">
                      &ldquo;{displayText}
                      <span className="animate-pulse">|</span>&rdquo;
                    </p>
                  </div>
                </div>
              )}

              {/* Privacy Shield: Gemma redacts before the cloud */}
              {step?.type === "privacy" && (
                <div className="animate-fade-in-up">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
                      <ShieldCheck className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-sm font-medium text-purple-600">
                      Privacy Shield — Gemma 4 runs before anything reaches the coach
                    </span>
                  </div>

                  <div className="relative">
                    <div className="bg-white rounded-2xl p-5 border border-cream-200 shadow-warm">
                      <div className="flex items-center gap-2 mb-3">
                        <span className="text-xs font-semibold uppercase tracking-wide text-warm-light">
                          Raw — stays on device
                        </span>
                        <span className="ml-auto text-[10px] bg-red-50 text-red-600 border border-red-200 rounded-full px-2 py-0.5">
                          PII detected
                        </span>
                      </div>
                      <p className="text-sm text-coffee-800 leading-relaxed">{step.rawText}</p>
                    </div>

                    <div className="flex justify-center -my-2 relative z-10">
                      <span className="bg-purple-500 text-white text-xs font-medium rounded-full px-3 py-1 shadow-warm">
                        🔒 Gemma 4 · anonymized before the coach
                      </span>
                    </div>

                    <div className="bg-gradient-to-br from-purple-500 to-indigo-500 rounded-2xl p-5 shadow-warm">
                      <div className="flex items-center gap-2 mb-3">
                        <span className="text-xs font-semibold uppercase tracking-wide text-white/80">
                          Anonymized — sent to Gemini 3.5
                        </span>
                        <CheckCircle2 className="w-4 h-4 text-white/80 ml-auto" />
                      </div>
                      <p className="text-sm text-white leading-relaxed">
                        Three hours. I&apos;ve been scrolling for three hours. Everyone&apos;s life
                        looks better than mine. My brother{" "}
                        <span className="bg-white/25 rounded-md px-1.5 py-0.5 font-medium">
                          [PERSON]
                        </span>{" "}
                        from{" "}
                        <span className="bg-white/25 rounded-md px-1.5 py-0.5 font-medium">
                          [SCHOOL]
                        </span>{" "}
                        just posted about his scholarship. I hate this feeling but I can&apos;t stop.
                        I need to get out of here.
                      </p>
                      <div className="mt-4 flex flex-wrap items-center gap-2 text-[10px] text-white/90">
                        <span className="px-2 py-1 bg-white/15 rounded-full">
                          🧠 Gemma 4 — open, auditable privacy
                        </span>
                        <span className="px-2 py-1 bg-white/15 rounded-full">
                          ✅ Safety check passed
                        </span>
                        <span className="px-2 py-1 bg-white/15 rounded-full">
                          0 raw bytes left the device
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Thinking */}
              {step?.type === "thinking" && (
                <div className="animate-fade-in-up text-center py-12">
                  <div className="flex items-center justify-center gap-2 mb-4">
                    <div className="w-2 h-2 bg-terracotta-500 rounded-full animate-bounce" />
                    <div
                      className="w-2 h-2 bg-terracotta-500 rounded-full animate-bounce"
                      style={{ animationDelay: "0.1s" }}
                    />
                    <div
                      className="w-2 h-2 bg-terracotta-500 rounded-full animate-bounce"
                      style={{ animationDelay: "0.2s" }}
                    />
                  </div>
                  <p className="text-warm-gray">{step.label}</p>
                </div>
              )}

              {/* Agent response */}
              {step?.type === "agent" && (
                <div className="animate-fade-in-up">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-8 h-8 bg-terracotta-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm">AI</span>
                    </div>
                    <span className="text-sm font-medium text-terracotta-600">
                      {track === "scenario" && selectedScenario?.id === "scroll"
                        ? "Gemini 3.5 — deep emotional coaching"
                        : "Coach responds"}
                    </span>
                  </div>
                  <div className="bg-white rounded-2xl p-6 border border-cream-200 shadow-warm">
                    <p className="text-coffee-800 leading-relaxed whitespace-pre-wrap">
                      {displayText}
                    </p>
                    {typedText.length > 50 && (
                      <div className="mt-4 pt-4 border-t border-cream-200 flex gap-2">
                        {step.emotions.map((emotion) => (
                          <span
                            key={emotion}
                            className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-medium"
                          >
                            {emotion}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Activity detail */}
              {step?.type === "activity" && activity && (
                <div className="animate-fade-in-up">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                      <CheckCircle2 className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-sm font-medium text-green-600">
                      {track === "scenario" ? "Agent finds the right activity" : "Your chosen activity"}
                    </span>
                  </div>
                  <div className="bg-white rounded-2xl overflow-hidden border border-cream-200 shadow-warm">
                    <div className="flex flex-col sm:flex-row">
                      <img
                        src={activity.imageUrl}
                        alt={activity.title}
                        className="w-full sm:w-40 h-32 sm:h-auto object-cover"
                      />
                      <div className="p-6 flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-2xl">{activityEmojis[activity.id] ?? "🌱"}</span>
                          <h3 className="font-serif font-semibold text-coffee-800">
                            {activity.title}
                          </h3>
                        </div>
                        <p className="text-sm text-warm-gray leading-relaxed mb-4">
                          {activity.description}
                        </p>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                          <div className="bg-cream-100 rounded-xl p-3">
                            <div className="text-warm-light mb-1">When</div>
                            <div className="font-medium text-coffee-800">
                              {activity.startDate.slice(0, 10)}, {activity.startTime}
                            </div>
                          </div>
                          <div className="bg-cream-100 rounded-xl p-3">
                            <div className="text-warm-light mb-1">Duration</div>
                            <div className="font-medium text-coffee-800">
                              {activity.durationMinutes} min
                            </div>
                          </div>
                          <div className="bg-cream-100 rounded-xl p-3">
                            <div className="text-warm-light mb-1">Price</div>
                            <div className="font-medium text-coffee-800">
                              {activity.price === 0 ? "Free" : `$${activity.price}`}
                            </div>
                          </div>
                          <div className="bg-cream-100 rounded-xl p-3">
                            <div className="text-warm-light mb-1">Spots left</div>
                            <div className="font-medium text-coffee-800">
                              {activity.spotsRemaining} of 10
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Map */}
              {step?.type === "map" && activity && (
                <div className="animate-fade-in-up">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                      <MapPin className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-sm font-medium text-blue-600">
                      Location: {activity.locationName}
                    </span>
                  </div>
                  <div className="rounded-2xl overflow-hidden border border-cream-200 shadow-warm">
                    <iframe
                      title={`Map of ${activity.locationName}`}
                      src={`https://www.google.com/maps?q=${activity.latitude},${activity.longitude}&z=15&output=embed`}
                      className="w-full h-64 sm:h-72"
                      loading="lazy"
                    />
                  </div>
                  <p className="text-xs text-warm-light mt-2 text-center">
                    Real-time Google Maps — Ember handles the logistics
                  </p>
                </div>
              )}

              {/* Register */}
              {step?.type === "register" && activity && (
                <div className="animate-fade-in-up">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-8 h-8 bg-terracotta-500 rounded-full flex items-center justify-center">
                      <Calendar className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-sm font-medium text-terracotta-600">
                      Ember handles the logistics
                    </span>
                  </div>
                  <div className="bg-white rounded-2xl p-6 border border-cream-200 shadow-warm space-y-4">
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
                      <div>
                        <div className="font-medium text-coffee-800 text-sm">
                          Spot reserved at {activity.title}
                        </div>
                        <p className="text-xs text-warm-gray">
                          {activity.startDate.slice(0, 10)} at {activity.startTime} — confirmed,
                          {activity.spotsRemaining - 1} spots left
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Calendar className="w-5 h-5 text-terracotta-500 shrink-0 mt-0.5" />
                      <div>
                        <div className="font-medium text-coffee-800 text-sm">
                          Added to your calendar
                        </div>
                        <p className="text-xs text-warm-gray">
                          Reminder set 1 hour before. You&apos;re all set.
                        </p>
                      </div>
                    </div>
                    {step.inviteFriend && (
                      <div className="flex items-start gap-3">
                        <Mail className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
                        <div>
                          <div className="font-medium text-coffee-800 text-sm">
                            Invitation drafted for Alex
                          </div>
                          <p className="text-xs text-warm-gray">
                            &ldquo;Hey Alex, I&apos;m going to {activity.title} on{" "}
                            {activity.startDate.slice(0, 10)}. Want to come?&rdquo;
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Attend */}
              {step?.type === "attend" && (
                <div className="animate-fade-in-up text-center py-10">
                  <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-4xl">🌍</span>
                  </div>
                  <h3 className="font-serif text-xl font-semibold text-coffee-800 mb-2">
                    User attends in the real world
                  </h3>
                  <p className="text-warm-gray max-w-md mx-auto text-sm">
                    No phone. No audience. Just showing up and being present.
                    Ember tracks the victory and updates the Identity Graph.
                  </p>
                </div>
              )}

              {/* Disconnect: Gemma insight */}
              {step?.type === "disconnect" && (
                <div className="animate-fade-in-up">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
                      <span className="text-sm">🛡️</span>
                    </div>
                    <span className="text-sm font-medium text-red-600">
                      Disconnect Mode — Gemma 4 insight
                    </span>
                  </div>
                  <div className="bg-gradient-to-br from-red-500 to-orange-500 rounded-2xl p-6 shadow-warm">
                    <div className="flex items-start gap-3">
                      <Sparkles className="w-5 h-5 text-white shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-white/80 mb-1 uppercase tracking-wide">
                          Pattern detected in real time
                        </p>
                        <p className="text-white leading-relaxed">
                          {step.gemmaInsight}
                        </p>
                        <div className="mt-4 pt-3 border-t border-white/20 flex items-center gap-2 text-xs text-white/90">
                          <span className="px-2 py-1 bg-white/15 rounded-full">
                            🧠 Gemma 4
                          </span>
                          <span className="px-2 py-1 bg-white/15 rounded-full">
                            ~400ms
                          </span>
                          <span className="px-2 py-1 bg-white/15 rounded-full">
                            On-device safe
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Disconnect: nearby places */}
              {step?.type === "places" && (
                <div className="animate-fade-in-up">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                      <MapPin className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-sm font-medium text-blue-600">
                      Real places near you, right now
                    </span>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-3">
                    {disconnectPlaces.map((place) => (
                      <div
                        key={place.name}
                        className="bg-white rounded-2xl p-5 border-2 border-red-200 shadow-warm"
                      >
                        <div className="flex items-start gap-3 mb-3">
                          <div className="w-11 h-11 bg-red-50 rounded-xl flex items-center justify-center text-xl shrink-0">
                            {place.emoji}
                          </div>
                          <div>
                            <h4 className="font-serif font-semibold text-coffee-800 text-sm leading-snug">
                              {place.name}
                            </h4>
                            <div className="flex items-center gap-3 text-xs text-warm-light mt-1">
                              <span className="flex items-center gap-1">
                                <MapPin className="w-3 h-3" />
                                {place.distance}
                              </span>
                              <span className="flex items-center gap-1">
                                <Footprints className="w-3 h-3" />
                                {place.walkTime}
                              </span>
                            </div>
                          </div>
                        </div>
                        <p className="text-xs text-warm-gray leading-relaxed mb-3">
                          {place.description}
                        </p>
                        <div className="bg-amber-50 rounded-lg p-3 border border-amber-200">
                          <p className="text-xs font-semibold text-amber-800 mb-1">
                            🎯 Micro-challenge
                          </p>
                          <p className="text-xs text-amber-700 leading-relaxed">
                            {place.challenge}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Disconnect: medal claimed */}
              {step?.type === "claim" && (
                <div className="animate-fade-in-up text-center py-10">
                  <div className="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
                    <span className="text-4xl">🏅</span>
                  </div>
                  <h3 className="font-serif text-xl font-semibold text-coffee-800 mb-2">
                    Mission Accepted — Medal Earned
                  </h3>
                  <p className="text-warm-gray max-w-md mx-auto text-sm">
                    One tap. One place. One real-world step. The medal is
                    waiting on the Triumph Board.
                  </p>
                  <div className="inline-flex items-center gap-2 bg-green-50 border border-green-200 rounded-xl px-4 py-2 mt-4 text-sm text-green-700">
                    <CheckCircle2 className="w-4 h-4" />
                    Disconnected at Riverside Walk Trail
                  </div>
                </div>
              )}
            </div>
          )}

          {track && showReveal && (
            /* ============ DASHBOARD REVEAL ============ */
            <div className="animate-fade-in-up">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-terracotta-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Trophy className="w-8 h-8 text-white" />
                </div>
                <h3 className="font-serif text-2xl font-bold text-coffee-800 mb-2">
                  2 weeks later — Your Triumph Board
                </h3>
                <p className="text-sm text-warm-gray max-w-md mx-auto">
                  Every small step became a victory. This is what Ember
                  accumulates over time.
                </p>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
                <div className="bg-white rounded-2xl p-4 border border-cream-200 shadow-warm text-center">
                  <Flame className="w-5 h-5 text-terracotta-500 mx-auto mb-1" />
                  <div className="font-serif text-2xl font-bold text-coffee-800">
                    {mockStats.streakDays} days
                  </div>
                  <div className="text-xs text-warm-light">streak</div>
                </div>
                <div className="bg-white rounded-2xl p-4 border border-cream-200 shadow-warm text-center">
                  <CheckCircle2 className="w-5 h-5 text-green-600 mx-auto mb-1" />
                  <div className="font-serif text-2xl font-bold text-coffee-800">
                    {mockStats.activitiesCompleted}
                  </div>
                  <div className="text-xs text-warm-light">activities done</div>
                </div>
                <div className="bg-white rounded-2xl p-4 border border-cream-200 shadow-warm text-center">
                  <Trophy className="w-5 h-5 text-purple-500 mx-auto mb-1" />
                  <div className="font-serif text-2xl font-bold text-coffee-800">
                    {mockStats.moodImprovement}
                  </div>
                  <div className="text-xs text-warm-light">mood</div>
                </div>
              </div>

              {/* Identity graph */}
              <div className="bg-white rounded-2xl p-5 border border-cream-200 shadow-warm mb-6">
                <div className="text-sm font-medium text-coffee-800 mb-3">
                  Identity Graph evolution
                </div>
                <div className="flex flex-wrap gap-2">
                  {mockIdentityGraph.map((node) => (
                    <span
                      key={node.label}
                      className={`px-3 py-1 rounded-full text-xs font-medium border ${
                        node.type === "negative"
                          ? "bg-red-50 text-red-700 border-red-200"
                          : node.type === "neutral"
                          ? "bg-amber-50 text-amber-700 border-amber-200"
                          : "bg-green-50 text-green-700 border-green-200"
                      }`}
                    >
                      {node.type === "negative" ? "—" : "+"} {node.label}
                    </span>
                  ))}
                </div>
              </div>

              {/* Disconnect medals (scroll scenario) */}
              {track === "scenario" && selectedScenario?.id === "scroll" && (
                <div className="bg-white rounded-2xl p-5 border border-amber-200 shadow-warm mb-6">
                  <div className="text-sm font-medium text-coffee-800 mb-3 flex items-center gap-2">
                    <span className="text-xl">🏅</span> Medals earned — Disconnect Mode
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    {[
                      {
                        emoji: "🚶",
                        title: "Disconnected at Riverside Walk Trail",
                        desc: "Micro-challenge: photo of something beautiful, no people",
                      },
                      {
                        emoji: "📵",
                        title: "Screen-Free Hour",
                        desc: "Phone in another room, 60 full minutes",
                      },
                      {
                        emoji: "🌿",
                        title: "Fresh Air First",
                        desc: "Walked 20 minutes before opening the feed",
                      },
                    ].map((medal) => (
                      <div
                        key={medal.title}
                        className="bg-amber-50 rounded-xl p-3 border border-amber-200"
                      >
                        <div className="text-2xl mb-1">{medal.emoji}</div>
                        <div className="text-sm font-semibold text-coffee-800 leading-snug">
                          {medal.title}
                        </div>
                        <div className="text-xs text-warm-gray mt-1">{medal.desc}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Achievements */}
              <div className="bg-white rounded-2xl p-5 border border-cream-200 shadow-warm mb-6">
                <div className="text-sm font-medium text-coffee-800 mb-3">
                  Achievements unlocked
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {mockAchievements
                    .filter((a) => a.unlocked)
                    .map((a) => (
                      <div
                        key={a.id}
                        className="bg-cream-100 rounded-xl p-3 flex items-center gap-2"
                      >
                        <span className="text-xl">{a.emoji}</span>
                        <div className="min-w-0">
                          <div className="text-xs font-medium text-coffee-800 truncate">
                            {a.title}
                          </div>
                          <div className="text-[10px] text-warm-light truncate">
                            {a.description}
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </div>

              {/* CTA */}
              <div className="text-center space-y-4">
                <p className="font-hand text-xl text-coffee-800">
                  This is what Ember does.
                </p>
                <div className="flex flex-wrap gap-3 justify-center">
                  <Link
                    href="/dashboard"
                    className="btn-primary flex items-center gap-2"
                    onClick={onClose}
                  >
                    <Trophy className="w-4 h-4" />
                    Open full Triumph Board
                  </Link>
                  <Link
                    href="/journal"
                    className="btn-secondary flex items-center gap-2"
                    onClick={onClose}
                  >
                    <Users className="w-4 h-4" />
                    Try it yourself
                  </Link>
                  <button
                    onClick={handleReplay}
                    className="btn-ghost flex items-center gap-2"
                  >
                    <RotateCcw className="w-4 h-4" />
                    Replay
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer controls */}
        {track && (
          <div className="p-4 border-t border-cream-200 flex items-center justify-between shrink-0">
            <button
              onClick={() => {
                onClose();
                resetAll();
              }}
              className="btn-ghost text-sm"
            >
              ← Exit
            </button>
            <div className="flex items-center gap-2">
              {!showReveal && (
                <button
                  onClick={handleSkip}
                  className="p-2 hover:bg-cream-200 rounded-full transition-colors"
                  title="Skip step"
                >
                  <SkipForward className="w-4 h-4 text-warm-gray" />
                </button>
              )}
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="p-2 hover:bg-cream-200 rounded-full transition-colors"
                title={isPlaying ? "Pause" : "Play"}
              >
                {isPlaying && !showReveal ? (
                  <Pause className="w-4 h-4 text-warm-gray" />
                ) : (
                  <Play className="w-4 h-4 text-warm-gray" />
                )}
              </button>
              <button
                onClick={handleReplay}
                className="p-2 hover:bg-cream-200 rounded-full transition-colors"
                title="Replay"
              >
                <RotateCcw className="w-4 h-4 text-warm-gray" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
