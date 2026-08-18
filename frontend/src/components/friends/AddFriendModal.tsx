"use client";

import { useState } from "react";
import { X, UserPlus } from "lucide-react";
import { Friend, FRIEND_TAGS, RELATIONSHIP_TONES } from "@/data/friends";

interface AddFriendModalProps {
  onClose: () => void;
  onSave: (friend: Omit<Friend, "id" | "invitations" | "addedAt">) => void;
}

const avatars = ["👤", "👩", "👨", "🧑", "👩‍🎨", "👨‍💼", "👩‍🏫", "🧑‍🎤", "👵", "👴"];

export default function AddFriendModal({ onClose, onSave }: AddFriendModalProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [relationship, setRelationship] = useState<Friend["relationship"]>("friend");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [interests, setInterests] = useState("");
  const [notes, setNotes] = useState("");
  const [avatar, setAvatar] = useState("👤");

  const handleSave = () => {
    if (!name.trim()) return;
    onSave({
      name: name.trim(),
      email: email.trim() || undefined,
      phone: phone.trim() || undefined,
      relationship,
      tags: selectedTags,
      interests: interests.split(",").map((i) => i.trim()).filter(Boolean),
      notes: notes.trim() || undefined,
      avatar,
    });
  };

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-coffee-900/70 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in"
      onClick={onClose}
    >
      <div
        className="bg-cream-100 rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-warm-xl animate-fade-in-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 border-b border-cream-200 flex items-center justify-between sticky top-0 bg-cream-100 z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-terracotta-500 rounded-xl flex items-center justify-center">
              <UserPlus className="w-5 h-5 text-white" />
            </div>
            <h2 className="font-serif font-bold text-coffee-800 text-lg">
              Add to Your Inner Circle
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-cream-200 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-warm-gray" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          {/* Avatar picker */}
          <div>
            <label className="text-sm font-medium text-coffee-800 block mb-2">
              Avatar
            </label>
            <div className="flex gap-2 flex-wrap">
              {avatars.map((a) => (
                <button
                  key={a}
                  onClick={() => setAvatar(a)}
                  className={`w-10 h-10 rounded-full text-xl flex items-center justify-center transition-all ${
                    avatar === a
                      ? "bg-terracotta-500 ring-2 ring-terracotta-500 ring-offset-2"
                      : "bg-cream-200 hover:bg-cream-300"
                  }`}
                >
                  {a}
                </button>
              ))}
            </div>
          </div>

          {/* Name */}
          <div>
            <label className="text-sm font-medium text-coffee-800 block mb-2">
              Name *
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Alex Chen"
              className="input-warm"
              autoFocus
            />
          </div>

          {/* Email */}
          <div>
            <label className="text-sm font-medium text-coffee-800 block mb-2">
              Email (optional)
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="alex@example.com"
              className="input-warm"
            />
          </div>

          {/* Phone */}
          <div>
            <label className="text-sm font-medium text-coffee-800 block mb-2">
              Phone (optional, for SMS invites)
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+1 (555) 123-4567"
              className="input-warm"
            />
          </div>

          {/* Relationship */}
          <div>
            <label className="text-sm font-medium text-coffee-800 block mb-2">
              Relationship
            </label>
            <div className="grid grid-cols-2 gap-2">
              {(Object.keys(RELATIONSHIP_TONES) as Array<keyof typeof RELATIONSHIP_TONES>).map(
                (key) => (
                  <button
                    key={key}
                    onClick={() => setRelationship(key as Friend["relationship"])}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                      relationship === key
                        ? "bg-terracotta-500 text-white"
                        : "bg-cream-200 text-warm-gray hover:bg-cream-300"
                    }`}
                  >
                    {RELATIONSHIP_TONES[key].label}
                  </button>
                )
              )}
            </div>
            <p className="text-xs text-warm-light mt-2 italic">
              This affects the tone of invitation messages.
            </p>
          </div>

          {/* Tags */}
          <div>
            <label className="text-sm font-medium text-coffee-800 block mb-2">
              Tags
            </label>
            <div className="flex flex-wrap gap-2">
              {FRIEND_TAGS.map((tag) => (
                <button
                  key={tag}
                  onClick={() => toggleTag(tag)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                    selectedTags.includes(tag)
                      ? "bg-terracotta-500 text-white"
                      : "bg-cream-200 text-warm-gray hover:bg-cream-300"
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          {/* Interests */}
          <div>
            <label className="text-sm font-medium text-coffee-800 block mb-2">
              Interests (comma-separated)
            </label>
            <input
              type="text"
              value={interests}
              onChange={(e) => setInterests(e.target.value)}
              placeholder="hiking, art, music"
              className="input-warm"
            />
            <p className="text-xs text-warm-light mt-1">
              Helps Ember suggest the right activities to invite them to.
            </p>
          </div>

          {/* Notes */}
          <div>
            <label className="text-sm font-medium text-coffee-800 block mb-2">
              Notes
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Recently moved to Brooklyn. Loves outdoor activities..."
              className="input-warm resize-none"
              rows={3}
            />
          </div>

          {/* Save button */}
          <button
            onClick={handleSave}
            disabled={!name.trim()}
            className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <UserPlus className="w-4 h-4" />
            Add to Inner Circle
          </button>
        </div>
      </div>
    </div>
  );
}