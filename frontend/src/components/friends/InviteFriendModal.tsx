"use client";

import { useState, useEffect } from "react";
import {
  X,
  Mail,
  MessageSquare,
  Sparkles,
  Copy,
  RefreshCw,
  Send,
} from "lucide-react";
import { Friend, generateInvitationMessage, Invitation } from "@/data/friends";
import { mockActivities } from "@/data/activities";

interface InviteFriendModalProps {
  friend: Friend;
  onClose: () => void;
  onSend: (invitation: Omit<Invitation, "id" | "sentAt">) => void;
}

export default function InviteFriendModal({
  friend,
  onClose,
  onSend,
}: InviteFriendModalProps) {
  const [selectedActivityId, setSelectedActivityId] = useState<string>(
    mockActivities[0].id
  );
  const [channel, setChannel] = useState<"email" | "sms">("email");
  const [message, setMessage] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  const selectedActivity = mockActivities.find((a) => a.id === selectedActivityId)!;

  // Generate initial message when activity or channel changes
  const generateMessage = () => {
    setIsGenerating(true);
    // Simulate AI generation delay
    setTimeout(() => {
      const generated = generateInvitationMessage(friend, selectedActivity, channel);
      setMessage(generated);
      setIsGenerating(false);
    }, 800);
  };

  useEffect(() => {
    generateMessage();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedActivityId, channel]);

  const handleSend = () => {
    onSend({
      activityId: selectedActivity.id,
      activityTitle: selectedActivity.title,
      status: "pending",
      channel,
      message,
    });
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(message);
    alert("Message copied! Paste it in your email app or SMS.");
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-coffee-900/70 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in"
      onClick={onClose}
    >
      <div
        className="bg-cream-100 rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-warm-xl animate-fade-in-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 border-b border-cream-200 flex items-center justify-between sticky top-0 bg-cream-100 z-10">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-terracotta-500/10 rounded-full flex items-center justify-center text-2xl">
              {friend.avatar || "👤"}
            </div>
            <div>
              <h2 className="font-serif font-bold text-coffee-800 text-lg">
                Invite {friend.name}
              </h2>
              <p className="text-xs text-warm-light">
                Ember will draft the message for you
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-cream-200 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-warm-gray" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          {/* Step 1: Choose activity */}
          <div>
            <label className="text-sm font-semibold text-coffee-800 block mb-3">
              1. Choose an activity to invite them to
            </label>
            <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
              {mockActivities.slice(0, 6).map((activity) => (
                <button
                  key={activity.id}
                  onClick={() => setSelectedActivityId(activity.id)}
                  className={`w-full text-left p-3 rounded-xl border-2 transition-all flex items-center gap-3 ${
                    selectedActivityId === activity.id
                      ? "border-terracotta-500 bg-terracotta-500/5"
                      : "border-cream-200 hover:border-cream-300"
                  }`}
                >
                  <img
                    src={activity.imageUrl}
                    alt={activity.title}
                    className="w-12 h-12 rounded-lg object-cover shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-coffee-800 text-sm truncate">
                      {activity.title}
                    </p>
                    <p className="text-xs text-warm-gray truncate">
                      {activity.locationName} • {activity.category}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Step 2: Choose channel */}
          <div>
            <label className="text-sm font-semibold text-coffee-800 block mb-3">
              2. Choose how to send
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setChannel("email")}
                disabled={!friend.email}
                className={`p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-2 disabled:opacity-40 ${
                  channel === "email"
                    ? "border-terracotta-500 bg-terracotta-500/5"
                    : "border-cream-200 hover:border-cream-300"
                }`}
              >
                <Mail className="w-6 h-6 text-blue-500" />
                <span className="font-medium text-coffee-800 text-sm">Email</span>
                <span className="text-xs text-warm-gray">
                  {friend.email || "No email on file"}
                </span>
              </button>
              <button
                onClick={() => setChannel("sms")}
                disabled={!friend.phone}
                className={`p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-2 disabled:opacity-40 ${
                  channel === "sms"
                    ? "border-terracotta-500 bg-terracotta-500/5"
                    : "border-cream-200 hover:border-cream-300"
                }`}
              >
                <MessageSquare className="w-6 h-6 text-green-500" />
                <span className="font-medium text-coffee-800 text-sm">SMS</span>
                <span className="text-xs text-warm-gray">
                  {friend.phone || "No phone on file"}
                </span>
              </button>
            </div>
          </div>

          {/* Step 3: AI-drafted message */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="text-sm font-semibold text-coffee-800 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-terracotta-500" />
                3. Your personalized message
              </label>
              <button
                onClick={generateMessage}
                disabled={isGenerating}
                className="text-xs text-terracotta-600 hover:text-terracotta-700 flex items-center gap-1 disabled:opacity-50"
              >
                <RefreshCw className={`w-3 h-3 ${isGenerating ? "animate-spin" : ""}`} />
                Regenerate
              </button>
            </div>

            <div className="relative">
              {isGenerating ? (
                <div className="bg-white rounded-xl p-4 min-h-[200px] flex items-center justify-center border border-cream-200">
                  <div className="text-center">
                    <Sparkles className="w-6 h-6 text-terracotta-500 mx-auto mb-2 animate-pulse" />
                    <p className="text-sm text-warm-gray">
                      Ember is crafting your message...
                    </p>
                  </div>
                </div>
              ) : (
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="input-warm font-serif resize-none leading-relaxed"
                  rows={12}
                />
              )}
            </div>

            <p className="text-xs text-warm-light mt-2 italic">
              💡 Tone: {RELATIONSHIP_TONES[friend.relationship].tone}. Edit freely —
              it&apos;s your message now.
            </p>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-2 pt-4 border-t border-cream-200">
            <button
              onClick={handleCopy}
              disabled={isGenerating}
              className="btn-secondary flex-1 flex items-center justify-center gap-2 text-sm disabled:opacity-50"
            >
              <Copy className="w-4 h-4" />
              Copy Message
            </button>
            <button
              onClick={handleSend}
              disabled={isGenerating || !message.trim()}
              className="btn-primary flex-1 flex items-center justify-center gap-2 text-sm disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
              {channel === "email" ? "Send Email" : "Send SMS"}
            </button>
          </div>

          <p className="text-xs text-warm-light text-center">
            In production, Ember sends this directly via email/SMS API.
            <br />
            For now, copy and paste into your app of choice.
          </p>
        </div>
      </div>
    </div>
  );
}

// Import for the tone text
import { RELATIONSHIP_TONES } from "@/data/friends";