"use client";

import { useState } from "react";
import {
  Users,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Building2,
  Heart,
  Award,
  BarChart3,
  Globe,
} from "lucide-react";
import PartnerTypes from "@/components/ember-program/PartnerTypes";
import WhyJoin from "@/components/ember-program/WhyJoin";
import ApplicationForm from "@/components/ember-program/ApplicationForm";
import ImpactStats from "@/components/ember-program/ImpactStats";

export default function EmberProgramPage() {
  const [showApplication, setShowApplication] = useState(false);

  return (
    <div className="min-h-screen bg-cream-100">
      {/* Header (simple, no sidebar) */}
      <header className="bg-white border-b border-cream-200 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <a href="/" className="flex items-center gap-2">
            <span className="text-2xl">🔥</span>
            <span className="font-serif font-bold text-coffee-800">Ember</span>
          </a>
          <a
            href="/"
            className="text-sm text-warm-gray hover:text-coffee-800 transition-colors"
          >
            ← Back to app
          </a>
        </div>
      </header>

      {/* Hero */}
      <section className="max-w-4xl mx-auto px-6 py-16 text-center animate-fade-in-up">
        <div className="inline-flex items-center gap-2 bg-terracotta-500/10 text-terracotta-600 px-4 py-2 rounded-full text-sm font-medium mb-6">
          <Heart className="w-4 h-4" />
          <span>The Ember Program</span>
        </div>

        <h1 className="font-serif text-4xl md:text-6xl font-bold text-coffee-800 mb-6 leading-tight">
          Help a generation rekindle their spark and{" "}
          <span className="text-terracotta-500">
            build confidence that actually lasts
          </span>
        </h1>

        <p className="text-lg text-warm-gray max-w-2xl mx-auto mb-8 leading-relaxed">
          A generation learned to measure their value in likes, followers, and
          highlight reels. <strong>You</strong> can help them rekindle their
          spark through real-world experiences.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => setShowApplication(true)}
            className="btn-primary flex items-center justify-center gap-2 text-lg px-8 py-4"
          >
            Apply to Join
            <ArrowRight className="w-5 h-5" />
          </button>
          <a
            href="#who-can-join"
            className="btn-secondary flex items-center justify-center gap-2 text-lg px-8 py-4"
          >
            Learn More
          </a>
        </div>
      </section>

      {/* Impact Stats */}
      <ImpactStats />

      {/* The Problem */}
      <section className="bg-white py-20 border-y border-cream-200">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-coffee-800 mb-6">
            Young adults are drowning in screens.
            <br />
            <span className="text-terracotta-500">You can throw them a lifeline.</span>
          </h2>
          <p className="text-warm-gray leading-relaxed mb-8 max-w-2xl mx-auto">
            48% of young adults say social media hurts their self-worth.
            They&apos;ve learned to measure their value in likes, comparisons,
            and highlight reels. Traditional mental health apps keep them on
            their phones. Ember does the opposite — we guide them to{" "}
            <strong>real experiences</strong> that rebuild{" "}
            <strong>real confidence</strong>, with organizations like yours.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="card-static p-6">
              <div className="text-3xl mb-3">📱</div>
              <h3 className="font-serif font-semibold text-coffee-800 mb-2">
                The Problem
              </h3>
              <p className="text-sm text-warm-gray">
                Algorithms optimize for attention, not connection. Young people
                feel more alone than ever.
              </p>
            </div>
            <div className="card-static p-6">
              <div className="text-3xl mb-3">🌉</div>
              <h3 className="font-serif font-semibold text-coffee-800 mb-2">
                Our Approach
              </h3>
              <p className="text-sm text-warm-gray">
                An AI coach helps users write, reflect, and find one real-world
                step that matches their comfort level.
              </p>
            </div>
            <div className="card-static p-6">
              <div className="text-3xl mb-3">🤝</div>
              <h3 className="font-serif font-semibold text-coffee-800 mb-2">
                Your Role
              </h3>
              <p className="text-sm text-warm-gray">
                You provide real experiences where young adults can discover
                what they&apos;re actually good at — not what they look like
                doing it. We bring the right people to your door.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Who can join */}
      <section id="who-can-join" className="py-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-coffee-800 mb-4">
              Who can join the Ember Program
            </h2>
            <p className="text-warm-gray max-w-xl mx-auto">
              If you create experiences that bring people together in real life,
              we want to work with you.
            </p>
          </div>
          <PartnerTypes />
        </div>
      </section>

      {/* Why join */}
      <section className="bg-white py-20 border-y border-cream-200">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-coffee-800 mb-4">
              Why partners love Ember
            </h2>
          </div>
          <WhyJoin />
        </div>
      </section>

      {/* Longer activities = greater impact */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-6">
          <div className="bg-terracotta-500/10 rounded-3xl p-8 md:p-12 border border-terracotta-500/20">
            <div className="text-center mb-8">
              <Sparkles className="w-8 h-8 text-terracotta-500 mx-auto mb-4" />
              <h2 className="font-serif text-2xl md:text-3xl font-bold text-coffee-800 mb-4">
                Longer activities = greater impact
              </h2>
              <p className="text-warm-gray max-w-xl mx-auto leading-relaxed">
                Research shows that activities lasting 2+ hours create stronger
                bonds and more lasting confidence gains than quick interactions.
                We encourage partners to offer:
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white rounded-xl p-4 text-center">
                <div className="text-2xl mb-2">🕒</div>
                <p className="text-sm font-medium text-coffee-800">
                  Half-day workshops
                </p>
                <p className="text-xs text-warm-gray mt-1">3-4 hours</p>
              </div>
              <div className="bg-white rounded-xl p-4 text-center">
                <div className="text-2xl mb-2">🔄</div>
                <p className="text-sm font-medium text-coffee-800">
                  Weekly meetups
                </p>
                <p className="text-xs text-warm-gray mt-1">Recurring</p>
              </div>
              <div className="bg-white rounded-xl p-4 text-center">
                <div className="text-2xl mb-2">📅</div>
                <p className="text-sm font-medium text-coffee-800">
                  Multi-session
                </p>
                <p className="text-xs text-warm-gray mt-1">4-8 weeks</p>
              </div>
              <div className="bg-white rounded-xl p-4 text-center">
                <div className="text-2xl mb-2">🏕️</div>
                <p className="text-sm font-medium text-coffee-800">
                  Retreats
                </p>
                <p className="text-xs text-warm-gray mt-1">Weekends</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-coffee-800 mb-6">
            Ready to help rebuild real-world connection?
          </h2>
          <p className="text-warm-gray mb-8 max-w-xl mx-auto">
            Applications take 5 minutes. We review within 48 hours. No cost to
            join for non-profit organizations.
          </p>

          <button
            onClick={() => setShowApplication(true)}
            className="btn-primary inline-flex items-center gap-2 text-lg px-10 py-4"
          >
            Apply to the Ember Program
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-coffee-900 text-cream-100 py-8">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <div className="flex items-center justify-center gap-2 mb-3">
            <span className="text-xl">🔥</span>
            <span className="font-serif font-semibold">Ember Program</span>
          </div>
          <p className="text-sm text-cream-100/60">
            Rekindle who you are. Together.
          </p>
        </div>
      </footer>

      {/* Application modal */}
      {showApplication && (
        <ApplicationForm
          onClose={() => setShowApplication(false)}
          onSubmit={() => {
            setShowApplication(false);
            alert("🎉 Application received! We'll be in touch within 48 hours.");
          }}
        />
      )}
    </div>
  );
}