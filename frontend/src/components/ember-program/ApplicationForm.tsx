"use client";

import { useState } from "react";
import { X, Send } from "lucide-react";

interface ApplicationFormProps {
  onClose: () => void;
  onSubmit: () => void;
}

export default function ApplicationForm({ onClose, onSubmit }: ApplicationFormProps) {
  const [form, setForm] = useState({
    orgName: "",
    contactName: "",
    email: "",
    category: "",
    description: "",
    location: "",
    activityType: "",
    isNonProfit: false,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit();
  };

  const categories = [
    "Art & Creative",
    "Yoga & Meditation",
    "Sports & Recreation",
    "Libraries & Education",
    "Nature & Outdoors",
    "Music & Performance",
    "Food & Cooking",
    "Volunteer & Service",
    "Community Center",
    "Other",
  ];

  return (
    <div
      className="fixed inset-0 z-50 bg-coffee-900/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in"
      onClick={onClose}
    >
      <div
        className="bg-cream-100 rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-warm-xl animate-fade-in-up"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 border-b border-cream-200 flex items-center justify-between sticky top-0 bg-cream-100 z-10">
          <div>
            <h2 className="font-serif font-bold text-coffee-800 text-xl">
              Apply to the Ember Program
            </h2>
            <p className="text-xs text-warm-light">Takes about 5 minutes</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-cream-200 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-warm-gray" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-coffee-800 block mb-2">
                Organization Name *
              </label>
              <input
                type="text"
                required
                value={form.orgName}
                onChange={(e) => setForm({ ...form, orgName: e.target.value })}
                className="input-warm"
                placeholder="Brooklyn Art Collective"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-coffee-800 block mb-2">
                Your Name *
              </label>
              <input
                type="text"
                required
                value={form.contactName}
                onChange={(e) => setForm({ ...form, contactName: e.target.value })}
                className="input-warm"
                placeholder="Jane Smith"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-coffee-800 block mb-2">
                Email *
              </label>
              <input
                type="email"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="input-warm"
                placeholder="jane@org.com"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-coffee-800 block mb-2">
                Location *
              </label>
              <input
                type="text"
                required
                value={form.location}
                onChange={(e) => setForm({ ...form, location: e.target.value })}
                className="input-warm"
                placeholder="Brooklyn, NY"
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-coffee-800 block mb-2">
              Category *
            </label>
            <select
              required
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              className="input-warm"
            >
              <option value="">Select a category</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-sm font-medium text-coffee-800 block mb-2">
              Describe your organization & activities *
            </label>
            <textarea
              required
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="input-warm resize-none"
              rows={4}
              placeholder="Tell us about your organization, the experiences you offer, and how you create real-world connection..."
            />
          </div>

          <div>
            <label className="text-sm font-medium text-coffee-800 block mb-2">
              Typical activity format
            </label>
            <input
              type="text"
              value={form.activityType}
              onChange={(e) => setForm({ ...form, activityType: e.target.value })}
              className="input-warm"
              placeholder="e.g., Weekly 3-hour watercolor workshops"
            />
          </div>

          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="nonprofit"
              checked={form.isNonProfit}
              onChange={(e) => setForm({ ...form, isNonProfit: e.target.checked })}
              className="w-4 h-4 accent-terracotta-500"
            />
            <label htmlFor="nonprofit" className="text-sm text-warm-gray">
              We are a non-profit organization (free to join the program)
            </label>
          </div>

          <div className="flex gap-3 pt-4 border-t border-cream-200">
            <button
              type="button"
              onClick={onClose}
              className="btn-ghost flex-1"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary flex-1 flex items-center justify-center gap-2"
            >
              <Send className="w-4 h-4" />
              Submit Application
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}