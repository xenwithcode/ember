// frontend/src/components/journal/LetterSealAnimation.tsx

"use client";

export default function LetterSealAnimation() {
  return (
    <div className="fixed inset-0 z-50 bg-coffee-900/80 backdrop-blur-sm flex items-center justify-center animate-fade-in">
      <div className="text-center animate-fade-in-up">
        {/* Envelope animation */}
        <div className="relative w-32 h-24 mx-auto mb-6">
          {/* Envelope body */}
          <div className="absolute inset-0 bg-cream-100 rounded-lg shadow-warm-xl transform transition-all duration-1000 animate-envelope-close">
            {/* Envelope flap */}
            <div className="absolute top-0 left-0 right-0 h-12 bg-cream-200 rounded-t-lg origin-top animate-flap-close" />
            {/* Seal */}
            <div className="absolute top-8 left-1/2 -translate-x-1/2 w-8 h-8 bg-terracotta-500 rounded-full flex items-center justify-center animate-seal-appear shadow-glow">
              <span className="text-white text-xs font-bold">🔥</span>
            </div>
          </div>
        </div>

        {/* Text */}
        <h3 className="font-serif text-2xl font-bold text-cream-100 mb-2">
          Sealing your letter...
        </h3>
        <p className="text-cream-100/70 text-sm">
          Your words are being preserved for your future self
        </p>

        {/* Floating particles */}
        <div className="absolute inset-0 pointer-events-none">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-terracotta-400 rounded-full animate-float-up"
              style={{
                left: `${20 + Math.random() * 60}%`,
                top: `${40 + Math.random() * 40}%`,
                animationDelay: `${i * 0.2}s`,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}