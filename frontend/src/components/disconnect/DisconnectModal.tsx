// frontend/src/components/disconnect/DisconnectModal.tsx
"use client";

import { useState } from "react";
import {
  X,
  MapPin,
  Footprints,
  Trophy,
  CheckCircle2,
  Sparkles,
  Power,
} from "lucide-react";
import { DisconnectResult, NearbyPlace } from "@/hooks/useDisconnectMode";

interface DisconnectModalProps {
  result: DisconnectResult;
  onClose: () => void;
  onClaimMedal: (place: NearbyPlace) => void;
}

export default function DisconnectModal({
  result,
  onClose,
  onClaimMedal,
}: DisconnectModalProps) {
  const [selectedPlaceId, setSelectedPlaceId] = useState<string | null>(null);
  const [claimed, setClaimed] = useState(false);

  const handleClaim = () => {
    const place = result.nearbyPlaces.find((p) => p.id === selectedPlaceId);
    if (place) {
      onClaimMedal(place); // ← Pasamos el lugar completo, no solo strings
      setClaimed(true);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-coffee-900/90 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="bg-cream-100 rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-warm-xl animate-fade-in-up my-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 bg-gradient-to-br from-red-500 to-orange-500 text-white rounded-t-3xl relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 hover:bg-white/10 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
              <Power className="w-6 h-6" />
            </div>
            <div>
              <h2 className="font-serif text-2xl font-bold">
                Disconnect Mode Activated
              </h2>
              <div className="flex items-center gap-2 text-sm text-white/80">
                <span>
                  Step away from the screen. Step into the real world.
                </span>
                {result.usingRealData && (
                  <span className="bg-white/20 px-2 py-0.5 rounded-full text-[10px] font-semibold flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    LIVE
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Gemma insight */}
          <div className="bg-white/10 backdrop-blur rounded-xl p-3 mt-4 border border-white/20">
            <div className="flex items-start gap-2">
              <Sparkles className="w-4 h-4 shrink-0 mt-0.5" />
              <p className="text-sm leading-relaxed">
                <strong>Gemma 4:</strong> {result.gemmaInsight}
              </p>
            </div>
          </div>
        </div>

        <div className="p-6">
          {claimed ? (
            /* Success state */
            <div className="text-center py-8 animate-fade-in">
              <div className="text-6xl mb-4 animate-bounce">🏅</div>
              <h3 className="font-serif text-2xl font-bold text-coffee-800 mb-2">
                Mission Accepted!
              </h3>
              <p className="text-warm-gray mb-6">
                Your medal has been added to your Triumph Board. Now go do it.
                <br />
                <strong className="text-coffee-800">
                  The real world is waiting.
                </strong>
              </p>
              <div className="bg-cream-100 rounded-xl p-3 mb-6 max-w-sm mx-auto">
                <p className="text-xs text-warm-gray leading-relaxed">
                  📵 Your screen is off-limits until you complete the
                  challenge. When you&apos;re back, the medal is yours — and
                  Ember returns to normal the moment you tap it.
                </p>
              </div>
              <button
                onClick={onClose}
                className="btn-primary inline-flex items-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4" />
                Let&apos;s Go
              </button>
              <button
                onClick={onClose}
                className="btn-ghost w-full mt-2 text-sm"
              >
                Wait — I want to exit Disconnect Mode
              </button>
            </div>
          ) : (
            /* Selection state */
            <>
              <div className="mb-6">
                <h3 className="font-serif text-xl font-semibold text-coffee-800 mb-2">
                  {result.challengeTitle}
                </h3>
                <p className="text-sm text-warm-gray">
                  {result.challengeDescription}
                </p>
              </div>

              {/* How it works */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-6">
                {[
                  { emoji: "🧠", label: "Gemma reads the moment" },
                  { emoji: "📍", label: "Pick a place near you" },
                  { emoji: "🎯", label: "Complete the micro-challenge" },
                  { emoji: "🏅", label: "Return → medal earned" },
                ].map((step) => (
                  <div
                    key={step.label}
                    className="bg-cream-100 rounded-xl p-3 text-center"
                  >
                    <div className="text-xl mb-1">{step.emoji}</div>
                    <div className="text-[11px] text-warm-gray leading-tight">
                      {step.label}
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-3 mb-6">
                {result.nearbyPlaces.map((place) => (
                  <div
                    key={place.id}
                    role="button"
                    tabIndex={0}
                    onClick={() => setSelectedPlaceId(place.id)}
                    className={`w-full text-left p-4 rounded-2xl border-2 transition-all duration-200 cursor-pointer ${
                      selectedPlaceId === place.id
                        ? "border-terracotta-500 bg-terracotta-500/5 shadow-warm"
                        : "border-cream-200 bg-white hover:border-cream-300"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-12 h-12 bg-cream-100 rounded-xl flex items-center justify-center text-2xl shrink-0">
                        {place.emoji}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <h4 className="font-serif font-semibold text-coffee-800">
                            {place.name}
                          </h4>
                          {selectedPlaceId === place.id && (
                            <CheckCircle2 className="w-5 h-5 text-terracotta-500 shrink-0" />
                          )}
                        </div>
                        <p className="text-xs text-warm-gray leading-relaxed mb-2">
                          {place.description}
                        </p>
                        <div className="flex items-center gap-3 text-xs text-warm-light">
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

                    {/* Challenge preview */}
                    {selectedPlaceId === place.id && (
                      <div className="mt-3 pt-3 border-t border-cream-200 animate-fade-in">
                        <div className="flex items-start gap-2 bg-amber-50 rounded-lg p-3 border border-amber-200">
                          <Trophy className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
                          <div>
                            <p className="text-xs font-semibold text-amber-800 mb-1">
                              Your micro-challenge:
                            </p>
                            <p className="text-xs text-amber-700 leading-relaxed">
                              {place.challenge}
                            </p>
                          </div>
                        </div>

                        {/* Botón para abrir Google Maps (solo si hay mapsUrl) */}
                        {place.mapsUrl && (
                          <a
                            href={place.mapsUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mt-3 btn-secondary text-xs flex items-center justify-center gap-2"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <MapPin className="w-3 h-3" />
                            Open in Google Maps
                          </a>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <button
                onClick={handleClaim}
                disabled={!selectedPlaceId}
                className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <Trophy className="w-4 h-4" />
                Accept Mission
              </button>

              <p className="text-center text-[11px] text-warm-light mt-3">
                No timer, no lock-in — Disconnect Mode stays on until you get
                back. Exit anytime: tap the red button and Ember returns to
                normal instantly.
              </p>

              <button
                onClick={onClose}
                className="btn-ghost w-full mt-2 text-sm"
              >
                I&apos;m not ready yet
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}