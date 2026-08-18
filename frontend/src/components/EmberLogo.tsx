// frontend/src/components/EmberLogo.tsx

interface EmberLogoProps {
  className?: string;
}

// Ember's signature flame — the same silhouette as the living ember
// on the Triumph Board, sized to fit any header or footer.
export default function EmberLogo({
  className = "w-10 h-10",
}: EmberLogoProps) {
  return (
    <div
      className={`${className} bg-gradient-to-br from-terracotta-500 to-orange-500 rounded-xl flex items-center justify-center shadow-warm`}
    >
      <svg
        viewBox="0 0 64 96"
        className="h-[58%] w-auto"
        aria-hidden
        style={{ filter: "drop-shadow(0 1px 2px rgba(44, 37, 35, 0.25))" }}
      >
        <path
          d="M32 2 C 42 18, 58 28, 58 56 C 58 78, 46 94, 32 94 C 18 94, 6 78, 6 56 C 6 28, 22 18, 32 2 Z"
          fill="#FFF6E0"
        />
        <path
          d="M32 24 C 37 32, 44 38, 44 54 C 44 68, 39 78, 32 78 C 25 78, 20 68, 20 54 C 20 38, 27 32, 32 24 Z"
          fill="#FFDFA8"
          opacity="0.9"
        />
      </svg>
    </div>
  );
}