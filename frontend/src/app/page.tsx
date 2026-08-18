"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  Compass,
  Heart,
  Brain,
  Users,
  TrendingDown,
  AlertTriangle,
  PenLine,
  MapPin,
  Calendar,
  MessageCircle,
  Leaf,
  Smartphone,
  Sun,
  Play,
  Mic,
  ShieldCheck,
} from "lucide-react";
import EmberJourney from "@/components/demo/EmberJourney";
import EmberLogo from "@/components/EmberLogo";

export default function Home() {
  const [isJourneyOpen, setIsJourneyOpen] = useState(false);

  return (
    <div className="min-h-screen bg-cream-100">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-cream-100/80 backdrop-blur-md border-b border-cream-200">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <EmberLogo className="w-10 h-10" />
            <div>
              <h1 className="font-serif font-bold text-coffee-800 text-lg leading-tight">
                Ember
              </h1>
              <p className="text-xs text-warm-light">Rekindle who you are</p>
            </div>
          </div>
          <Link href="/journal" className="btn-primary text-sm px-5 py-2">
            Start Now
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-4xl mx-auto px-6 pt-20 pb-16 text-center animate-fade-in-up">
        <div className="inline-flex items-center gap-2 bg-terracotta-500/10 text-terracotta-600 px-4 py-2 rounded-full text-sm font-medium mb-8">
          <Leaf className="w-4 h-4" />
          <span>Built for the All Things Agentic Hackathon</span>
        </div>

        <h2 className="font-serif text-5xl md:text-7xl font-bold text-coffee-800 leading-tight mb-6">
          <span className="text-terracotta-500">Ember</span>
        </h2>

        <p className="text-xl md:text-2xl text-warm-gray leading-relaxed mb-4 max-w-2xl mx-auto">
          The scroll buried your spark.
          <br />
          We help you{" "}
          <span className="text-terracotta-500 font-semibold">rekindle</span>{" "}
          it.
        </p>

        <p className="text-base text-warm-light mb-10 max-w-xl mx-auto">
          A collaborative AI agent that transforms screen time into real-world
          confidence — through smart journaling and face-to-face experiences.
          One real step at a time.
        </p>

        {/* CTA Buttons - ACTUALIZADO */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/journal"
            className="btn-primary flex items-center justify-center gap-2 text-lg px-8 py-4"
          >
            <PenLine className="w-5 h-5" />
            Start Your Journey
            <ArrowRight className="w-5 h-5" />
          </Link>
          <button
            onClick={() => setIsJourneyOpen(true)}
            className="btn-secondary flex items-center justify-center gap-2 text-lg px-8 py-4"
          >
            <Play className="w-5 h-5" />
            Try a Scenario
          </button>
        </div>
      </section>

      {/* ============================================
    PROBLEM SECTION - THE CRISIS
    ============================================ */}
      <section className="bg-white py-20 border-y border-cream-200">
        <div className="max-w-6xl mx-auto px-6">
          {/* Section header with urgency */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-red-50 text-red-600 px-4 py-2 rounded-full text-sm font-medium mb-4">
              <AlertTriangle className="w-4 h-4" />
              <span>The Crisis</span>
            </div>
            <h3 className="font-serif text-3xl md:text-5xl font-bold text-coffee-800 mb-6 leading-tight">
              A generation is losing itself
              <br />
              <span className="text-terracotta-500">one scroll at a time</span>
            </h3>
            <p className="text-warm-gray max-w-2xl mx-auto text-lg leading-relaxed">
              They&apos;re the most connected generation in human history.
              <br />
              And the most alone.
            </p>
          </div>

          {/* The human cost - narrative block */}
          <div className="max-w-3xl mx-auto mb-12">
            <div className="bg-cream-100 rounded-2xl p-8 border-l-4 border-l-terracotta-500">
              <p className="font-serif text-lg text-coffee-800 leading-relaxed italic mb-4">
                &ldquo;I have 2,000 followers and no one to call when I&apos;m
                falling apart. I post my best self every day and I don&apos;t even
                recognize her anymore.&rdquo;
              </p>
              <p className="text-sm text-warm-gray text-right">
                — A 19-year-old, from our research interviews
              </p>
            </div>
          </div>

          {/* Stats grid - more impactful layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            {/* Left column: The numbers */}
            <div className="space-y-6">
              <div className="card-static p-6 border-l-4 border-l-red-500">
                <div className="font-serif text-5xl font-bold text-red-500 mb-2">
                  48%
                </div>
                <p className="text-coffee-800 font-medium mb-1">
                  of young adults say social media <strong>hurts their self-worth</strong>
                </p>
                <p className="text-sm text-warm-gray">
                  Nearly half of a generation is learning to hate themselves through
                  a screen.
                </p>
              </div>

              <div className="card-static p-6 border-l-4 border-l-red-500">
                <div className="font-serif text-5xl font-bold text-red-500 mb-2">
                  1 in 3
                </div>
                <p className="text-coffee-800 font-medium mb-1">
                  teenage girls has <strong>seriously considered suicide</strong>
                </p>
                <p className="text-sm text-warm-gray">
                  This isn&apos;t a statistic. These are daughters, sisters, friends.
                </p>
              </div>

              <div className="card-static p-6 border-l-4 border-l-red-500">
                <div className="font-serif text-5xl font-bold text-red-500 mb-2">
                  81%
                </div>
                <p className="text-coffee-800 font-medium mb-1">
                  feel crushing pressure to have a <strong>&quot;perfect life plan&quot;</strong> by 25
                </p>
                <p className="text-sm text-warm-gray">
                  A generation paralyzed by the fear of being &quot;behind.&quot;
                </p>
              </div>
            </div>

            {/* Right column: The invisible gap */}
            <div className="space-y-6">
              <div className="card-static p-6 bg-cream-100">
                <h4 className="font-serif text-xl font-semibold text-coffee-800 mb-4">
                  The Invisible Gap
                </h4>
                <div className="space-y-4 mb-6">
                  <div>
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span className="text-warm-gray">
                        Teens who feel emotionally supported
                      </span>
                      <span className="font-bold text-red-500">58.5%</span>
                    </div>
                    <div className="h-3 bg-cream-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-red-500 rounded-full"
                        style={{ width: "58.5%" }}
                      />
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span className="text-warm-gray">
                        Parents who <em>think</em> they&apos;re providing support
                      </span>
                      <span className="font-bold text-coffee-800">93%</span>
                    </div>
                    <div className="h-3 bg-cream-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-coffee-800 rounded-full"
                        style={{ width: "93%" }}
                      />
                    </div>
                  </div>
                </div>
                <p className="text-sm text-warm-gray leading-relaxed">
                  <strong className="text-coffee-800">
                    A 34.5-point disconnect.
                  </strong>{" "}
                  Young people are suffering in silence while the adults who love
                  them believe everything is fine. That gap is where Ember enters.
                </p>
              </div>

              {/* The economic cost */}
              <div className="card-static p-6">
                <h4 className="font-serif text-xl font-semibold text-coffee-800 mb-4">
                  The Economic Emergency
                </h4>
                <div className="space-y-3">
                  <div className="flex items-baseline gap-3">
                    <span className="font-serif text-2xl font-bold text-terracotta-500">
                      $185B
                    </span>
                    <span className="text-sm text-warm-gray">
                      in lifetime medical costs per generation
                    </span>
                  </div>
                  <div className="flex items-baseline gap-3">
                    <span className="font-serif text-2xl font-bold text-terracotta-500">
                      $3T
                    </span>
                    <span className="text-sm text-warm-gray">
                      in lost productivity and wages
                    </span>
                  </div>
                  <div className="flex items-baseline gap-3">
                    <span className="font-serif text-2xl font-bold text-terracotta-500">
                      $300K
                    </span>
                    <span className="text-sm text-warm-gray">
                      lost income per affected individual
                    </span>
                  </div>
                </div>
                <p className="text-xs text-warm-light mt-4 italic">
                  This isn&apos;t just a mental health crisis. It&apos;s an economic
                  emergency hiding in plain sight.
                </p>
              </div>
            </div>
          </div>

          {/* The Comparison Machine */}
          <div className="max-w-3xl mx-auto mb-12">
            <div className="text-center mb-8">
              <h4 className="font-serif text-2xl font-semibold text-coffee-800 mb-3 flex items-center justify-center gap-2">
                <Smartphone className="w-6 h-6 text-red-500" />
                The Validation Trap
              </h4>
            </div>

            <div className="bg-cream-100 rounded-2xl p-8 border border-cream-200">
              <p className="text-warm-gray leading-relaxed mb-6 text-center">
                A generation has learned to measure their value in{" "}
                <strong className="text-coffee-800">likes, followers, and highlight reels</strong>.
                They&apos;ve built <em>performative identities</em> instead of real ones.
                And every time they scroll, they measure their behind-the-scenes
                against everyone else&apos;s curated best.
              </p>

              {/* The cycle visualization */}
              <div className="flex flex-wrap items-center justify-center gap-3 text-sm mb-6">
                <span className="bg-white px-3 py-1.5 rounded-full border border-cream-200">
                  📱 Scroll
                </span>
                <span className="text-warm-light">→</span>
                <span className="bg-white px-3 py-1.5 rounded-full border border-cream-200">
                  🪞 Compare
                </span>
                <span className="text-warm-light">→</span>
                <span className="bg-white px-3 py-1.5 rounded-full border border-cream-200">
                  😔 Feel less
                </span>
                <span className="text-warm-light">→</span>
                <span className="bg-white px-3 py-1.5 rounded-full border border-cream-200">
                  🎭 Perform more
                </span>
                <span className="text-warm-light">→</span>
                <span className="bg-white px-3 py-1.5 rounded-full border border-cream-200">
                  📱 Scroll again
                </span>
              </div>

              <p className="text-center font-serif italic text-coffee-800">
                The result? Imposter syndrome. Social withdrawal. And a generation
                that&apos;s forgotten how to build confidence through{" "}
                <strong>real experiences</strong>.
              </p>
            </div>
          </div>

          {/* Why existing solutions fail */}
          <div className="max-w-3xl mx-auto">
            <div className="bg-red-50 rounded-2xl p-8 border border-red-200">
              <h4 className="font-serif text-xl font-semibold text-red-800 mb-4 flex items-center gap-2">
                <TrendingDown className="w-5 h-5 text-red-500" />
                Why existing solutions fail
              </h4>
              <p className="text-red-700 leading-relaxed mb-4">
                Traditional mental health apps keep users{" "}
                <strong>in the digital world</strong> — more notifications, more
                tracking, more screen time. They treat the symptom (scrolling) with
                more of the cause (screens).
              </p>
              <p className="font-serif text-lg text-red-800 italic text-center">
                It&apos;s like trying to cure a hangover with more alcohol.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================
    BRIDGE: From problem to solution
    ============================================ */}
      <section className="py-16 bg-cream-100">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <div className="font-hand text-3xl text-coffee-800 mb-6">
            But what if technology could be part of the solution?
          </div>
          <p className="text-warm-gray leading-relaxed mb-6">
            Not another app that keeps you scrolling. Not another tracker that
            gamifies your anxiety. Not another notification pulling you back in.
          </p>
          <p className="font-serif text-xl text-coffee-800 font-semibold">
            What if the device in your pocket could be the thing
            <br />
            that helps you <span className="text-terracotta-500">put it down</span>?
          </p>
        </div>
      </section>

      {/* Solution Section */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-green-50 text-green-600 px-4 py-2 rounded-full text-sm font-medium mb-4">
              <Sun className="w-4 h-4" />
              <span>Our Solution</span>
            </div>
            <h3 className="font-serif text-3xl md:text-4xl font-bold text-coffee-800 mb-4">
              From Scroll to Soul
            </h3>
            <p className="text-warm-gray max-w-2xl mx-auto text-lg leading-relaxed">
              Ember is a collaborative AI agent that guides young adults from
              performative identity to <strong className="text-coffee-800">authentic self-worth</strong> —
              through structured introspection and real-world action.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="card p-8">
              <div className="w-14 h-14 bg-terracotta-500/10 rounded-2xl flex items-center justify-center mb-6">
                <BookOpen className="w-7 h-7 text-terracotta-500" />
              </div>
              <h4 className="font-serif text-2xl font-semibold text-coffee-800 mb-3">
                Pillar 1: The Living Journal
              </h4>
              <p className="text-warm-gray leading-relaxed mb-4">
                A private, AI-guided journal that transforms the act of writing into
                a practice of self-discovery.
              </p>

              {/* Why writing works - science block */}
              <div className="bg-cream-100 rounded-xl p-4 mb-4 border border-cream-200">
                <div className="flex items-start gap-3 mb-3">
                  <span className="text-xl">🧠</span>
                  <div>
                    <h5 className="font-semibold text-coffee-800 text-sm mb-1">
                      Why writing works
                    </h5>
                    <p className="text-xs text-warm-gray leading-relaxed">
                      Writing is not just recording thoughts — it&apos;s{" "}
                      <strong>translating the invisible into the visible</strong>. When you
                      put a feeling into words, you activate your prefrontal cortex
                      (rational brain) and calm your amygdala (fear center). The chaos
                      becomes concrete. The abstract becomes something you can actually{" "}
                      <em>look at</em>.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="bg-white rounded-lg p-3 text-center">
                    <p className="font-serif text-xl font-bold text-terracotta-500">50%</p>
                    <p className="text-xs text-warm-gray">
                      reduction in doctor visits after 4 days of expressive writing
                    </p>
                    <p className="text-[10px] text-warm-light mt-1">
                      Pennebaker, 1986
                    </p>
                  </div>
                  <div className="bg-white rounded-lg p-3 text-center">
                    <p className="font-serif text-xl font-bold text-terracotta-500">27%</p>
                    <p className="text-xs text-warm-gray">
                      reduction in emotional reactivity when writing in third person
                    </p>
                    <p className="text-[10px] text-warm-light mt-1">
                      Psychological distance research
                    </p>
                  </div>
                  <div className="bg-white rounded-lg p-3 text-center">
                    <p className="font-serif text-xl font-bold text-terracotta-500">38%</p>
                    <p className="text-xs text-warm-gray">
                      increase in self-awareness with weekly reflection
                    </p>
                    <p className="text-[10px] text-warm-light mt-1">
                      Meta-cognition studies
                    </p>
                  </div>
                </div>
              </div>

              {/* The metaphor */}
              <div className="bg-terracotta-500/5 rounded-xl p-4 mb-4 border border-terracotta-500/20">
                <p className="text-sm text-coffee-800 leading-relaxed italic font-serif">
                  &ldquo;Your thoughts are a storm. Writing is the act of naming each
                  raindrop. And in the naming, the storm becomes weather — observable,
                  manageable, temporary.&rdquo;
                </p>
              </div>

              {/* Features list */}
              <ul className="space-y-3">
                <li className="flex items-start gap-3 text-sm text-warm-gray">
                  <Brain className="w-5 h-5 text-terracotta-500 shrink-0 mt-0.5" />
                  <span>
                    <strong className="text-coffee-800">Living Ember</strong> — a visual
                    representation of your inner state that breathes and changes color as
                    you write
                  </span>
                </li>
                <li className="flex items-start gap-3 text-sm text-warm-gray">
                  <MessageCircle className="w-5 h-5 text-terracotta-500 shrink-0 mt-0.5" />
                  <span>
                    <strong className="text-coffee-800">AI Coach</strong> — asks
                    clarifying questions, never judges, detects patterns across entries
                  </span>
                </li>
                <li className="flex items-start gap-3 text-sm text-warm-gray">
                  <Heart className="w-5 h-5 text-terracotta-500 shrink-0 mt-0.5" />
                  <span>
                    <strong className="text-coffee-800">Identity Graph</strong> — builds
                    a map of who you actually are, not who you perform for others
                  </span>
                </li>
                <li className="flex items-start gap-3 text-sm text-warm-gray">
                  <Mic className="w-5 h-5 text-terracotta-500 shrink-0 mt-0.5" />
                  <span>
                    <strong className="text-coffee-800">Multimodal</strong> — write with
                    your hands or speak with your voice. Switch anytime.
                  </span>
                </li>
              </ul>

              {/* Privacy guarantee */}
              <div className="bg-green-50 rounded-xl p-4 border border-green-200 mt-5">
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 bg-green-500/10 rounded-lg flex items-center justify-center shrink-0">
                    <ShieldCheck className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <h5 className="font-semibold text-coffee-800 text-sm mb-1">
                      What you write stays yours
                    </h5>
                    <p className="text-xs text-warm-gray leading-relaxed">
                      Ember is a <strong className="text-coffee-800">private by design</strong>{" "}
                      journal. Your entries never reach the coach as raw text — a privacy layer
                      powered by <strong className="text-coffee-800">Gemma 4</strong> runs first,
                      so names, places, and anything personal are anonymized
                      <em> before</em> the coaching AI ever sees them. Your diary stays
                      your diary: <strong className="text-coffee-800">safe, even from us</strong>.
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-3">
                      <div className="flex items-center gap-2 bg-white rounded-lg px-3 py-2 border border-green-100">
                        <span className="text-base">🔒</span>
                        <span className="text-xs text-warm-gray">
                          <strong className="text-coffee-800">0 bytes</strong> of raw
                          personal data ever reach the coach
                        </span>
                      </div>
                      <div className="flex items-center gap-2 bg-white rounded-lg px-3 py-2 border border-green-100">
                        <span className="text-base">🛡️</span>
                        <span className="text-xs text-warm-gray">
                          <strong className="text-coffee-800">Anonymized first</strong> —
                          names &amp; places become placeholders before the coach sees them
                        </span>
                      </div>
                      <div className="flex items-center gap-2 bg-white rounded-lg px-3 py-2 border border-green-100">
                        <span className="text-base">🧠</span>
                        <span className="text-xs text-warm-gray">
                          <strong className="text-coffee-800">Gemma 4</strong> — Google's
                          open-weight model, 4B active params, privacy-first
                        </span>
                      </div>
                      <div className="flex items-center gap-2 bg-white rounded-lg px-3 py-2 border border-green-100">
                        <span className="text-base">💚</span>
                        <span className="text-xs text-warm-gray">
                          <strong className="text-coffee-800">Safety first</strong> — crisis
                          signals are caught by Gemma and linked to help, privately
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="card p-8">
              <div className="w-14 h-14 bg-green-500/10 rounded-2xl flex items-center justify-center mb-6">
                <Users className="w-7 h-7 text-green-600" />
              </div>
              <h4 className="font-serif text-2xl font-semibold text-coffee-800 mb-3">
                Pillar 2: Face-to-Face
              </h4>
              <p className="text-warm-gray leading-relaxed mb-4">
                A curated catalog of low-pressure, real-world activities matched to your
                anxiety level and interests. Because confidence isn&apos;t built on screens —
                it&apos;s built by <strong className="text-coffee-800">showing up</strong>.
              </p>

              {/* Why real-world action works - science block */}
              <div className="bg-cream-100 rounded-xl p-4 mb-4 border border-cream-200">
                <div className="flex items-start gap-3 mb-3">
                  <span className="text-xl">🌱</span>
                  <div>
                    <h5 className="font-semibold text-coffee-800 text-sm mb-1">
                      Why real-world action works
                    </h5>
                    <p className="text-xs text-warm-gray leading-relaxed">
                      Behavioral activation research shows that <strong>action precedes
                      motivation</strong>, not the other way around. You don&apos;t wait to
                      feel confident. You act, and the confidence follows. Each real-world
                      experience becomes <strong>evidence against the &quot;I&apos;m not
                      enough&quot; narrative</strong> — proof you can show up, belong, and
                      grow.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="bg-white rounded-lg p-3 text-center">
                    <p className="font-serif text-xl font-bold text-green-600">67%</p>
                    <p className="text-xs text-warm-gray">
                      improvement in self-efficacy after 4 weeks of behavioral activation
                    </p>
                    <p className="text-[10px] text-warm-light mt-1">
                      CBT meta-analysis, 2019
                    </p>
                  </div>
                  <div className="bg-white rounded-lg p-3 text-center">
                    <p className="font-serif text-xl font-bold text-green-600">20 min</p>
                    <p className="text-xs text-warm-gray">
                      in nature reduces cortisol levels by 21%
                    </p>
                    <p className="text-[10px] text-warm-light mt-1">
                      Frontiers in Psychology, 2019
                    </p>
                  </div>
                  <div className="bg-white rounded-lg p-3 text-center">
                    <p className="font-serif text-xl font-bold text-green-600">2x</p>
                    <p className="text-xs text-warm-gray">
                      stronger social bonds from in-person vs. digital interaction
                    </p>
                    <p className="text-[10px] text-warm-light mt-1">
                      Journal of Social Psychology
                    </p>
                  </div>
                </div>
              </div>

              {/* The metaphor */}
              <div className="bg-green-500/5 rounded-xl p-4 mb-4 border border-green-500/20">
                <p className="text-sm text-coffee-800 leading-relaxed italic font-serif">
                  &ldquo;You can&apos;t think your way into confidence. You have to{" "}
                  <strong>act</strong> your way into it. One small, real-world step at a
                  time. Each activity is a brick in the bridge back to who you are.&rdquo;
                </p>
              </div>

              {/* The flow visualization */}
              <div className="bg-white rounded-xl p-4 mb-4 border border-cream-200">
                <h5 className="font-semibold text-coffee-800 text-sm mb-3 text-center">
                  How the agent guides you
                </h5>
                <div className="flex flex-wrap items-center justify-center gap-2 text-xs">
                  <span className="bg-terracotta-500/10 text-terracotta-600 px-2.5 py-1 rounded-full font-medium">
                    📖 You write
                  </span>
                  <span className="text-warm-light">→</span>
                  <span className="bg-terracotta-500/10 text-terracotta-600 px-2.5 py-1 rounded-full font-medium">
                    🧠 Agent listens
                  </span>
                  <span className="text-warm-light">→</span>
                  <span className="bg-terracotta-500/10 text-terracotta-600 px-2.5 py-1 rounded-full font-medium">
                    🎯 Suggests 1 activity
                  </span>
                  <span className="text-warm-light">→</span>
                  <span className="bg-terracotta-500/10 text-terracotta-600 px-2.5 py-1 rounded-full font-medium">
                    📅 Schedules it
                  </span>
                  <span className="text-warm-light">→</span>
                  <span className="bg-terracotta-500/10 text-terracotta-600 px-2.5 py-1 rounded-full font-medium">
                    👥 Invites a friend
                  </span>
                  <span className="text-warm-light">→</span>
                  <span className="bg-green-500/10 text-green-600 px-2.5 py-1 rounded-full font-medium">
                    🌍 You show up
                  </span>
                  <span className="text-warm-light">→</span>
                  <span className="bg-green-500/10 text-green-600 px-2.5 py-1 rounded-full font-medium">
                    💭 You reflect
                  </span>
                  <span className="text-warm-light">→</span>
                  <span className="bg-green-500/10 text-green-600 px-2.5 py-1 rounded-full font-medium">
                    🌱 You grow
                  </span>
                </div>
              </div>

              {/* Categories preview */}
              <div className="mb-4">
                <h5 className="font-semibold text-coffee-800 text-sm mb-3">
                  8 categories of real-world experiences
                </h5>
                <div className="flex flex-wrap gap-2">
                  <span className="text-xs bg-purple-100 text-purple-700 px-2.5 py-1 rounded-full">
                    🎨 Creative
                  </span>
                  <span className="text-xs bg-green-100 text-green-700 px-2.5 py-1 rounded-full">
                    🧘 Physical
                  </span>
                  <span className="text-xs bg-blue-100 text-blue-700 px-2.5 py-1 rounded-full">
                    👥 Social
                  </span>
                  <span className="text-xs bg-amber-100 text-amber-700 px-2.5 py-1 rounded-full">
                    📚 Intellectual
                  </span>
                  <span className="text-xs bg-rose-100 text-rose-700 px-2.5 py-1 rounded-full">
                    🤝 Volunteer
                  </span>
                  <span className="text-xs bg-emerald-100 text-emerald-700 px-2.5 py-1 rounded-full">
                    🌿 Nature
                  </span>
                  <span className="text-xs bg-indigo-100 text-indigo-700 px-2.5 py-1 rounded-full">
                    🧠 Mindfulness
                  </span>
                  <span className="text-xs bg-cyan-100 text-cyan-700 px-2.5 py-1 rounded-full">
                    🎓 Student
                  </span>
                </div>
              </div>

              {/* Features list */}
              <ul className="space-y-3">
                <li className="flex items-start gap-3 text-sm text-warm-gray">
                  <MapPin className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
                  <span>
                    <strong className="text-coffee-800">Geolocation-based discovery</strong>{" "}
                    — activities near you, matched to your anxiety level and interests
                  </span>
                </li>
                <li className="flex items-start gap-3 text-sm text-warm-gray">
                  <Calendar className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
                  <span>
                    <strong className="text-coffee-800">Agent handles logistics</strong> —
                    scheduling, reminders, friend invitations with AI-drafted messages
                  </span>
                </li>
                <li className="flex items-start gap-3 text-sm text-warm-gray">
                  <Users className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
                  <span>
                    <strong className="text-coffee-800">Anxiety-matched</strong> — from
                    solo-friendly nature walks to moderate group activities. You choose
                    your comfort level.
                  </span>
                </li>
                <li className="flex items-start gap-3 text-sm text-warm-gray">
                  <Heart className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
                  <span>
                    <strong className="text-coffee-800">Community-verified</strong> — every
                    experience is curated for low pressure and genuine connection
                  </span>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-12 bg-terracotta-500/10 rounded-2xl p-8 text-center border border-terracotta-500/20">
            <p className="font-hand text-2xl text-coffee-800 mb-2">
              &quot;Your spark is still there. We just help you find the
              air.&quot;
            </p>
            <p className="text-sm text-warm-gray">
              Every interaction leads to a concrete action in the physical
              world.
            </p>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-white py-20 border-y border-cream-200">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <h3 className="font-serif text-3xl md:text-4xl font-bold text-coffee-800 mb-4">
              How It Works
            </h3>
            <p className="text-warm-gray max-w-xl mx-auto">
              A simple 4-step cycle that turns introspection into real-world
              growth.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-terracotta-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-warm">
                <PenLine className="w-8 h-8 text-white" />
              </div>
              <div className="text-xs font-semibold text-terracotta-500 mb-2">
                STEP 1
              </div>
              <h4 className="font-serif font-semibold text-coffee-800 mb-2">
                Write
              </h4>
              <p className="text-sm text-warm-gray">
                Journal freely. Your AI coach listens and understands your
                emotional state.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-terracotta-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-warm">
                <Compass className="w-8 h-8 text-white" />
              </div>
              <div className="text-xs font-semibold text-terracotta-500 mb-2">
                STEP 2
              </div>
              <h4 className="font-serif font-semibold text-coffee-800 mb-2">
                Discover
              </h4>
              <p className="text-sm text-warm-gray">
                Get one low-risk, real-world activity matched to your comfort
                level.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-terracotta-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-warm">
                <Users className="w-8 h-8 text-white" />
              </div>
              <div className="text-xs font-semibold text-terracotta-500 mb-2">
                STEP 3
              </div>
              <h4 className="font-serif font-semibold text-coffee-800 mb-2">
                Show Up
              </h4>
              <p className="text-sm text-warm-gray">
                Attend the activity. The agent handles scheduling, invites, and
                reminders.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-terracotta-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-warm">
                <Heart className="w-8 h-8 text-white" />
              </div>
              <div className="text-xs font-semibold text-terracotta-500 mb-2">
                STEP 4
              </div>
              <h4 className="font-serif font-semibold text-coffee-800 mb-2">
                Reflect
              </h4>
              <p className="text-sm text-warm-gray">
                Share how it felt. Your coach adapts and suggests the next
                right step.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h3 className="font-serif text-3xl md:text-4xl font-bold text-coffee-800 mb-4">
            Ready to rekindle?
          </h3>
          <p className="text-warm-gray mb-8 max-w-xl mx-auto">
            Start with one honest sentence. Your journey back to real-world
            confidence begins today.
          </p>

          <Link
            href="/journal"
            className="btn-primary inline-flex items-center gap-2 text-lg px-10 py-4"
          >
            <PenLine className="w-5 h-5" />
            Start Your Journey
            <ArrowRight className="w-5 h-5" />
          </Link>

          <div className="mt-12 bg-cream-100 rounded-2xl p-6 border border-cream-200">
            <p className="text-xs text-warm-light leading-relaxed">
              <strong className="text-warm-gray">Important:</strong> Ember is a
              self-help tool for personal growth. It is not a substitute for
              professional mental health care. If you&apos;re in crisis, call
              988 (Suicide &amp; Crisis Lifeline) or text HOME to 741741
              (Crisis Text Line).
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-coffee-900 text-cream-100 py-8">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <div className="flex items-center justify-center gap-2 mb-3">
            <span className="text-2xl">🔥</span>
            <span className="font-serif font-semibold">Ember</span>
          </div>
          <p className="text-sm text-cream-100/60">
            Rekindle who you are • Built for the All Things Agentic Hackathon
          </p>
          <p className="text-xs text-cream-100/40 mt-1">
            Powered by <strong className="text-cream-100/70">Gemma 4</strong> (privacy-first
            privacy) • <strong className="text-cream-100/70">Gemini 3.5 Flash Lite</strong> (deep
            emotional coaching) • Google ADK &amp; Google Cloud
          </p>
        </div>
      </footer>

      {/* Scenario Selector Modal - AGREGADO */}
      <EmberJourney
        isOpen={isJourneyOpen}
        onClose={() => setIsJourneyOpen(false)}
      />
    </div>
  );
}
