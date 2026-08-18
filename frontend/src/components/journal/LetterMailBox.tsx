// frontend/src/components/journal/LetterMailbox.tsx

"use client";

import { useState } from "react";
import {
  Mail,
  MailOpen,
  Lock,
  Clock,
  CheckCircle2,
  Sparkles,
} from "lucide-react";
import { FutureLetter } from "@/hooks/useFutureLetters";
import LetterDeliveryModal from "./LetterDeliveryModal";

interface LetterMailboxProps {
  letters: FutureLetter[];
  readyLetters: FutureLetter[];
  sealedLetters: FutureLetter[];
  reflectedLetters: FutureLetter[];
  stats: any;
  onDeliver: (
    letterId: string,
    realityResponse: string,
    predictionAccuracy: FutureLetter["predictionAccuracy"],
    moodAtDelivery: string
  ) => void;
}

export default function LetterMailbox({
  letters,
  readyLetters,
  sealedLetters,
  reflectedLetters,
  stats,
  onDeliver,
}: LetterMailboxProps) {
  const [selectedLetter, setSelectedLetter] = useState<FutureLetter | null>(
    null
  );

  const formatDate = (dateStr: string) => {
    return new Date(dateStr + "T00:00:00").toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const getStatusIcon = (status: FutureLetter["status"]) => {
    switch (status) {
      case "sealed":
        return <Lock className="w-4 h-4 text-amber-500" />;
      case "ready":
        return <MailOpen className="w-4 h-4 text-terracotta-500 animate-pulse" />;
      case "delivered":
        return <Mail className="w-4 h-4 text-blue-500" />;
      case "reflected":
        return <CheckCircle2 className="w-4 h-4 text-green-500" />;
    }
  };

  const getStatusLabel = (status: FutureLetter["status"]) => {
    switch (status) {
      case "sealed":
        return "Sealed";
      case "ready":
        return "Ready to open!";
      case "delivered":
        return "Delivered";
      case "reflected":
        return "Reflected";
    }
  };

  return (
    <div className="space-y-6">
      {/* Stats row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="card-static p-4 text-center">
          <Mail className="w-5 h-5 text-terracotta-500 mx-auto mb-2" />
          <p className="text-2xl font-bold text-coffee-800">
            {stats.totalLetters}
          </p>
          <p className="text-xs text-warm-gray">Letters written</p>
        </div>
        <div className="card-static p-4 text-center">
          <Lock className="w-5 h-5 text-amber-500 mx-auto mb-2" />
          <p className="text-2xl font-bold text-coffee-800">
            {stats.sealedCount}
          </p>
          <p className="text-xs text-warm-gray">Waiting to arrive</p>
        </div>
        <div className="card-static p-4 text-center">
          <MailOpen className="w-5 h-5 text-terracotta-500 mx-auto mb-2" />
          <p className="text-2xl font-bold text-coffee-800">
            {stats.readyCount}
          </p>
          <p className="text-xs text-warm-gray">Ready to open</p>
        </div>
        <div className="card-static p-4 text-center">
          <Sparkles className="w-5 h-5 text-green-500 mx-auto mb-2" />
          <p className="text-2xl font-bold text-coffee-800">
            {stats.predictionStats.fearNotRealizedRate}%
          </p>
          <p className="text-xs text-warm-gray">Fears that didn't come true</p>
        </div>
      </div>

      {/* Ready letters (urgent) */}
      {readyLetters.length > 0 && (
        <div className="bg-terracotta-500/10 rounded-2xl p-5 border border-terracotta-500/30">
          <div className="flex items-center gap-2 mb-3">
            <MailOpen className="w-5 h-5 text-terracotta-500 animate-pulse" />
            <h3 className="font-serif font-semibold text-coffee-800">
              📬 You have {readyLetters.length} letter
              {readyLetters.length !== 1 ? "s" : ""} ready to open!
            </h3>
          </div>
          <p className="text-sm text-warm-gray mb-4">
            Your past self wrote to you. It's time to read what they said and
            see how reality compared.
          </p>
          {readyLetters.map((letter) => (
            <button
              key={letter.id}
              onClick={() => setSelectedLetter(letter)}
              className="btn-primary w-full flex items-center justify-center gap-2"
            >
              <MailOpen className="w-4 h-4" />
              Open Letter from{" "}
              {new Date(letter.writtenAt).toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
              })}
            </button>
          ))}
        </div>
      )}

      {/* All letters list */}
      <div>
        <h3 className="font-serif text-lg font-semibold text-coffee-800 mb-4">
          Your Mailbox
        </h3>

        {letters.length === 0 ? (
          <div className="card-static p-12 text-center">
            <div className="text-5xl mb-4">📭</div>
            <h4 className="font-serif text-lg font-medium text-coffee-800 mb-2">
              Your mailbox is empty
            </h4>
            <p className="text-sm text-warm-gray max-w-sm mx-auto">
              Write a letter to your future self. In a week, a month, or a year
              — you'll be glad you did.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {letters.map((letter) => (
              <div
                key={letter.id}
                className={`
                  card p-4 flex items-center gap-4 transition-all duration-200
                  ${
                    letter.status === "ready"
                      ? "border-2 border-terracotta-500/50 shadow-warm-lg cursor-pointer"
                      : "hover:shadow-warm"
                  }
                `}
                onClick={() =>
                  letter.status === "ready" && setSelectedLetter(letter)
                }
              >
                {/* Status icon */}
                <div className="w-10 h-10 rounded-xl bg-cream-100 flex items-center justify-center shrink-0">
                  {getStatusIcon(letter.status)}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-medium text-terracotta-600">
                      {letter.timeframeLabel}
                    </span>
                    <span className="text-xs text-warm-light">•</span>
                    <span className="text-xs text-warm-light">
                      {letter.wordCount} words
                    </span>
                  </div>
                  <p className="font-serif text-sm text-coffee-800 truncate">
                    {letter.fullText.substring(0, 80)}...
                  </p>
                </div>

                {/* Right side */}
                <div className="text-right shrink-0">
                  <div className="flex items-center gap-1 justify-end mb-1">
                    {getStatusIcon(letter.status)}
                    <span className="text-xs font-medium text-coffee-800">
                      {getStatusLabel(letter.status)}
                    </span>
                  </div>
                  <p className="text-xs text-warm-light">
                    {letter.status === "sealed" || letter.status === "ready"
                      ? `Opens: ${formatDate(letter.deliveryDate)}`
                      : `Written: ${formatDate(
                          new Date(letter.writtenAt)
                            .toISOString()
                            .split("T")[0]
                        )}`}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Key insight (if enough reflected letters) */}
      {stats.predictionStats.totalReflected >= 3 && (
        <div className="bg-green-50 rounded-2xl p-5 border border-green-200">
          <div className="flex items-start gap-3">
            <Sparkles className="w-5 h-5 text-green-600 mt-0.5 shrink-0" />
            <div>
              <h4 className="font-serif font-semibold text-green-800 mb-1">
                💡 Your Prediction Pattern
              </h4>
              <p className="text-sm text-green-700 leading-relaxed">
                In {stats.predictionStats.totalReflected} letters you've
                written, <strong>{stats.predictionStats.fearNotRealizedRate}%</strong> of
                your feared predictions never came true. Your anxiety is a
                storyteller, not a prophet.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Delivery modal */}
      {selectedLetter && (
        <LetterDeliveryModal
          letter={selectedLetter}
          onClose={() => setSelectedLetter(null)}
          onDeliver={onDeliver}
        />
      )}
    </div>
  );
}