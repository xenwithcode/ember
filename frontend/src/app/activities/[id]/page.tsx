"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ArrowLeft,
  Calendar,
  Clock,
  DollarSign,
  MapPin,
  Star,
  Users,
  Check,
  Copy,
  Send,
  Sparkles,
  ShieldCheck,
  LayoutGrid,
} from "lucide-react";
import { mockActivities, Activity } from "@/data/activities";
import {
  fetchActivity,
  getExpectationInfo,
  registerForActivity,
} from "@/lib/activityApi";
import { getOrCreateUserId } from "@/lib/journalApi";
import { useFriends } from "@/hooks/useFriends";
import { generateInvitationMessage } from "@/data/friends";
import MainLayout from "@/components/layout/MainLayout";

const categoryColors: Record<string, string> = {
  creative: "bg-purple-100 text-purple-700",
  physical: "bg-green-100 text-green-700",
  social: "bg-blue-100 text-blue-700",
  intellectual: "bg-amber-100 text-amber-700",
  volunteer: "bg-rose-100 text-rose-700",
  nature: "bg-emerald-100 text-emerald-700",
  mindfulness: "bg-indigo-100 text-indigo-700",
  student: "bg-cyan-100 text-cyan-700",
};

const anxietyLabels: Record<string, string> = {
  solo: "🌱 Solo friendly",
  low: "🌿 Low anxiety",
  moderate: "🌳 Moderate",
  high: "🔥 Brave mode",
};

type ActivityStatus = "loading" | "ready" | "notfound";

interface InviteState {
  friendId: string;
  friendName: string;
  message: string;
  copied: boolean;
}

export default function ActivityDetailPage() {
  const params = useParams<{ id: string }>();
  const activityId = params.id;

  const [status, setStatus] = useState<ActivityStatus>("loading");
  const [activity, setActivity] = useState<Activity | null>(null);
  const [fromLiveCatalog, setFromLiveCatalog] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [registered, setRegistered] = useState(false);
  const [registerNote, setRegisterNote] = useState("");
  const [invite, setInvite] = useState<InviteState | null>(null);
  const [showInvites, setShowInvites] = useState(false);
  const { friends } = useFriends();

  useEffect(() => {
    let cancelled = false;

    async function load() {
      const live = await fetchActivity(activityId);
      if (cancelled) return;
      if (live) {
        setActivity(live);
        setFromLiveCatalog(true);
        setStatus("ready");
        return;
      }
      const mock = mockActivities.find((a) => a.id === activityId) ?? null;
      if (cancelled) return;
      if (mock) {
        setActivity(mock);
        setStatus("ready");
        return;
      }
      setStatus("notfound");
    }

    void load();
    return () => {
      cancelled = true;
    };
  }, [activityId]);

  const expectations = useMemo(
    () => (activity ? getExpectationInfo(activity) : null),
    [activity]
  );

  const handleRegister = async () => {
    if (!activity) return;
    setIsRegistering(true);
    const userId = getOrCreateUserId();
    const ok = await registerForActivity(activity.id, userId);
    setRegistered(true);
    setRegisterNote(
      ok
        ? "You're registered! The coordinator will confirm shortly."
        : "Registration saved locally (demo mode — live sync once the backend is online)."
    );
    setIsRegistering(false);
  };

  const handleInviteClick = (friendId: string) => {
    if (!activity) return;
    const friend = friends.find((f) => f.id === friendId);
    if (!friend) return;
    const message = generateInvitationMessage(friend, activity, "email");
    setInvite({
      friendId,
      friendName: friend.name,
      message,
      copied: false,
    });
    setShowInvites(false);
  };

  const handleCopyInvite = async () => {
    if (!invite) return;
    try {
      await navigator.clipboard.writeText(invite.message);
    } catch {
      /* clipboard unavailable — message stays visible for manual copy */
    }
    setInvite({ ...invite, copied: true });
  };

  const dateLabel = activity
    ? new Date(activity.startDate).toLocaleDateString("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
      })
    : "";

  return (
    <MainLayout>
      <div className="min-h-screen">
        <div className="max-w-5xl mx-auto px-6 py-6">
          <Link
            href="/activities"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-terracotta-600 hover:text-terracotta-700 mb-5"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to activities
          </Link>

          {status === "loading" && (
            <div className="animate-pulse space-y-6">
              <div className="h-72 w-full bg-cream-200 rounded-2xl" />
              <div className="h-8 w-1/2 bg-cream-200 rounded-lg" />
              <div className="h-4 w-3/4 bg-cream-200 rounded-lg" />
              <div className="h-32 w-full bg-cream-200 rounded-xl" />
            </div>
          )}

          {status === "notfound" && (
            <div className="text-center py-20 card">
              <LayoutGrid className="w-12 h-12 mx-auto text-warm-light mb-4" />
              <h1 className="font-serif font-bold text-coffee-800 text-2xl mb-2">
                Activity not found
              </h1>
              <p className="text-warm-gray mb-6">
                We couldn't find this activity in the catalog.
              </p>
              <Link
                href="/activities"
                className="inline-flex items-center gap-2 bg-terracotta-500 text-white px-6 py-2.5 rounded-xl text-sm font-semibold hover:bg-terracotta-600"
              >
                <LayoutGrid className="w-4 h-4" />
                Browse all activities
              </Link>
            </div>
          )}

          {status === "ready" && activity && (
            <>
              {/* Hero */}
              <div className="relative h-72 md:h-80 rounded-2xl overflow-hidden shadow-warm mb-6">
                <img
                  src={activity.imageUrl}
                  alt={activity.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <div className="flex flex-wrap items-center gap-2 mb-3">
                    <span className={`badge ${categoryColors[activity.category]}`}>
                      {activity.category}
                    </span>
                    <span className="badge bg-white/20 text-white backdrop-blur">
                      {anxietyLabels[activity.anxietyLevel]}
                    </span>
                    {activity.organizerVerified && (
                      <span className="badge bg-amber-400/90 text-coffee-900">
                        <Star className="w-3 h-3 fill-current mr-1 inline" />
                        Verified organizer
                      </span>
                    )}
                    {fromLiveCatalog && (
                      <span className="badge bg-emerald-400/90 text-emerald-950">
                        <ShieldCheck className="w-3 h-3 mr-1 inline" />
                        Live from the Firestore catalog
                      </span>
                    )}
                  </div>
                  <div className="flex flex-wrap items-end justify-between gap-4">
                    <div>
                      <h1 className="font-serif font-bold text-white text-3xl md:text-4xl leading-tight">
                        {activity.title}
                      </h1>
                      <p className="text-white/80 text-sm mt-2 flex items-center gap-1.5">
                        <MapPin className="w-4 h-4" />
                        {activity.locationName}
                      </p>
                    </div>
                    <div className="text-right">
                      {activity.price === 0 ? (
                        <span className="text-2xl font-bold text-emerald-300">FREE</span>
                      ) : (
                        <span className="text-2xl font-bold text-white">
                          ${activity.price}
                        </span>
                      )}
                      <p className="text-white/70 text-xs">
                        {activity.spotsRemaining} spots left
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Info grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <div className="card p-4">
                  <Calendar className="w-5 h-5 text-terracotta-500 mb-2" />
                  <p className="text-xs text-warm-light uppercase tracking-wide">Date</p>
                  <p className="text-sm font-semibold text-coffee-800">{dateLabel}</p>
                </div>
                <div className="card p-4">
                  <Clock className="w-5 h-5 text-terracotta-500 mb-2" />
                  <p className="text-xs text-warm-light uppercase tracking-wide">Time</p>
                  <p className="text-sm font-semibold text-coffee-800">
                    {activity.startTime}
                  </p>
                </div>
                <div className="card p-4">
                  <Users className="w-5 h-5 text-terracotta-500 mb-2" />
                  <p className="text-xs text-warm-light uppercase tracking-wide">Duration</p>
                  <p className="text-sm font-semibold text-coffee-800">
                    {activity.durationMinutes} min
                  </p>
                </div>
                <div className="card p-4">
                  <DollarSign className="w-5 h-5 text-terracotta-500 mb-2" />
                  <p className="text-xs text-warm-light uppercase tracking-wide">Price</p>
                  <p className="text-sm font-semibold text-coffee-800">
                    {activity.price === 0 ? "Free" : `$${activity.price}`}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main column */}
                <div className="lg:col-span-2 space-y-8">
                  <section>
                    <h2 className="font-serif font-semibold text-coffee-800 text-xl mb-3">
                      About this activity
                    </h2>
                    <p className="text-coffee-700 leading-relaxed">
                      {activity.description}
                    </p>
                  </section>

                  {expectations && (
                    <>
                      <section>
                        <h2 className="font-serif font-semibold text-coffee-800 text-xl mb-3">
                          What to expect
                        </h2>
                        <ul className="space-y-2">
                          {expectations.whatToExpect.map((item) => (
                            <li key={item} className="flex items-start gap-3 card p-3">
                              <Sparkles className="w-4 h-4 text-terracotta-500 mt-0.5 shrink-0" />
                              <span className="text-sm text-coffee-700">{item}</span>
                            </li>
                          ))}
                        </ul>
                      </section>

                      <section>
                        <h2 className="font-serif font-semibold text-coffee-800 text-xl mb-3">
                          What to bring
                        </h2>
                        <div className="flex flex-wrap gap-2">
                          {expectations.whatToBring.map((item) => (
                            <span key={item} className="badge bg-cream-200 text-coffee-700">
                              {item}
                            </span>
                          ))}
                        </div>
                      </section>
                    </>
                  )}

                  {/* Location */}
                  <section>
                    <h2 className="font-serif font-semibold text-coffee-800 text-xl mb-3">
                      Location
                    </h2>
                    <div className="rounded-2xl overflow-hidden shadow-warm border border-cream-200">
                      <iframe
                        title={`Map of ${activity.locationName}`}
                        src={`https://maps.google.com/maps?q=${activity.latitude},${activity.longitude}&z=15&output=embed`}
                        className="w-full h-64"
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                      />
                    </div>
                    <p className="text-sm text-warm-gray mt-2 flex items-center gap-1.5">
                      <MapPin className="w-4 h-4 text-terracotta-500" />
                      {activity.locationName} · New York, NY
                    </p>
                  </section>
                </div>

                {/* Sidebar */}
                <aside className="space-y-6">
                  <div className="card p-6">
                    <h3 className="font-serif font-semibold text-coffee-800 text-lg mb-4">
                      Register
                    </h3>
                    {registered ? (
                      <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4">
                        <p className="text-emerald-800 text-sm font-medium mb-1 flex items-center gap-1.5">
                          <Check className="w-4 h-4" />
                          You're on the list!
                        </p>
                        <p className="text-sm text-emerald-700">{registerNote}</p>
                      </div>
                    ) : (
                      <>
                        <button
                          onClick={handleRegister}
                          disabled={isRegistering || activity.spotsRemaining === 0}
                          className="w-full bg-terracotta-500 text-white font-semibold py-3 rounded-xl hover:bg-terracotta-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed mb-3"
                        >
                          {isRegistering
                            ? "Registering…"
                            : activity.spotsRemaining === 0
                              ? "Sold out"
                              : `Register now${activity.price === 0 ? " (free)" : ""}`}
                        </button>
                        <p className="text-xs text-warm-gray text-center">
                          {activity.spotsRemaining} spots remaining
                        </p>
                      </>
                    )}
                  </div>

                  <div className="card p-6">
                    <h3 className="font-serif font-semibold text-coffee-800 text-lg mb-2">
                      Invite a friend
                    </h3>
                    <p className="text-sm text-warm-gray mb-4">
                      Sharing plans makes them easier — invite someone to join you.
                    </p>
                    {invite ? (
                      <div className="space-y-3">
                        <div className="bg-cream-50 border border-cream-200 rounded-xl p-3 text-sm text-coffee-700 leading-relaxed">
                          {invite.message}
                        </div>
                        <button
                          onClick={handleCopyInvite}
                          className="w-full flex items-center justify-center gap-2 border border-terracotta-500 text-terracotta-600 font-semibold py-2.5 rounded-xl hover:bg-terracotta-50 transition-colors"
                        >
                          {invite.copied ? (
                            <>
                              <Check className="w-4 h-4" /> Copied to clipboard
                            </>
                          ) : (
                            <>
                              <Copy className="w-4 h-4" /> Copy invitation
                            </>
                          )}
                        </button>
                        <Link
                          href="/friends"
                          className="block text-center text-xs text-terracotta-600 hover:underline"
                        >
                          Manage friends →
                        </Link>
                      </div>
                    ) : (
                      <>
                        <button
                          onClick={() => setShowInvites((v) => !v)}
                          className="w-full flex items-center justify-center gap-2 border border-terracotta-500 text-terracotta-600 font-semibold py-2.5 rounded-xl hover:bg-terracotta-50 transition-colors mb-3"
                        >
                          <Send className="w-4 h-4" />
                          Choose a friend
                        </button>
                        {showInvites && (
                          <ul className="space-y-1.5 max-h-56 overflow-y-auto">
                            {friends.length === 0 && (
                              <li className="text-sm text-warm-gray py-2">
                                No friends yet —{" "}
                                <Link href="/friends" className="text-terracotta-600 underline">
                                  add some first
                                </Link>
                                .
                              </li>
                            )}
                            {friends.map((friend) => (
                              <li key={friend.id}>
                                <button
                                  onClick={() => handleInviteClick(friend.id)}
                                  className="w-full flex items-center gap-3 p-2.5 rounded-lg hover:bg-cream-100 transition-colors text-left"
                                >
                                  <span className="w-9 h-9 rounded-full bg-terracotta-500/10 flex items-center justify-center text-sm">
                                    {friend.avatar ?? friend.name.charAt(0)}
                                  </span>
                                  <span className="text-sm font-medium text-coffee-800">
                                    {friend.name}
                                  </span>
                                  <span className="ml-auto text-xs text-warm-light">
                                    {friend.relationship.replace("_", " ")}
                                  </span>
                                </button>
                              </li>
                            ))}
                          </ul>
                        )}
                      </>
                    )}
                  </div>
                </aside>
              </div>
            </>
          )}
        </div>
      </div>
    </MainLayout>
  );
}