"use client";

import { Mail, MessageSquare, Trash2, UserPlus, CheckCircle2, Clock, X } from "lucide-react";
import { Friend } from "@/data/friends";

interface FriendCardProps {
  friend: Friend;
  onInvite: () => void;
  onDelete: () => void;
}

const relationshipColors: Record<string, string> = {
  family: "bg-rose-100 text-rose-700",
  close_friend: "bg-purple-100 text-purple-700",
  friend: "bg-blue-100 text-blue-700",
  colleague: "bg-amber-100 text-amber-700",
  acquaintance: "bg-gray-100 text-gray-700",
};

const relationshipLabels: Record<string, string> = {
  family: "Family",
  close_friend: "Close friend",
  friend: "Friend",
  colleague: "Colleague",
  acquaintance: "Acquaintance",
};

export default function FriendCard({ friend, onInvite, onDelete }: FriendCardProps) {
  const acceptedCount = friend.invitations.filter((i) => i.status === "accepted").length;
  const pendingCount = friend.invitations.filter((i) => i.status === "pending").length;

  return (
    <div className="card-static p-5">
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-terracotta-500/10 rounded-full flex items-center justify-center text-2xl shrink-0">
            {friend.avatar || "👤"}
          </div>
          <div>
            <h3 className="font-serif font-semibold text-coffee-800">
              {friend.name}
            </h3>
            <span
              className={`inline-block text-xs px-2 py-0.5 rounded-full font-medium ${
                relationshipColors[friend.relationship]
              }`}
            >
              {relationshipLabels[friend.relationship]}
            </span>
          </div>
        </div>

        <button
          onClick={onDelete}
          className="p-2 text-warm-light hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
          title="Remove"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      {/* Contact info */}
      <div className="space-y-1 mb-3 text-sm text-warm-gray">
        {friend.email && (
          <div className="flex items-center gap-2 truncate">
            <Mail className="w-3.5 h-3.5 text-warm-light shrink-0" />
            <span className="truncate">{friend.email}</span>
          </div>
        )}
        {friend.phone && (
          <div className="flex items-center gap-2">
            <MessageSquare className="w-3.5 h-3.5 text-warm-light shrink-0" />
            <span>{friend.phone}</span>
          </div>
        )}
      </div>

      {/* Tags */}
      <div className="flex flex-wrap gap-1 mb-3">
        {friend.tags.map((tag) => (
          <span
            key={tag}
            className="text-xs bg-cream-200 text-warm-gray px-2 py-0.5 rounded-full"
          >
            {tag}
          </span>
        ))}
      </div>

      {/* Notes */}
      {friend.notes && (
        <p className="text-xs text-warm-gray italic mb-3 line-clamp-2 bg-cream-100 p-2 rounded-lg">
          {friend.notes}
        </p>
      )}

      {/* Invitation stats */}
      {friend.invitations.length > 0 && (
        <div className="flex items-center gap-3 text-xs mb-3 pb-3 border-b border-cream-200">
          <span className="text-warm-gray">
            Invited to: <strong className="text-coffee-800">{friend.invitations.length}</strong>
          </span>
          {acceptedCount > 0 && (
            <span className="flex items-center gap-1 text-green-600">
              <CheckCircle2 className="w-3 h-3" />
              {acceptedCount} accepted
            </span>
          )}
          {pendingCount > 0 && (
            <span className="flex items-center gap-1 text-amber-600">
              <Clock className="w-3 h-3" />
              {pendingCount} pending
            </span>
          )}
        </div>
      )}

      {/* Actions */}
      <button
        onClick={onInvite}
        className="btn-primary w-full flex items-center justify-center gap-2 text-sm"
      >
        <UserPlus className="w-4 h-4" />
        Invite to Activity
      </button>
    </div>
  );
}