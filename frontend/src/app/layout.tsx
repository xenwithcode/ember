import type { Metadata } from "next";
import { Inter, Playfair_Display, Caveat } from "next/font/google";
import "./globals.css";

// Fuentes optimizadas con next/font
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

const caveat = Caveat({
  subsets: ["latin"],
  variable: "--font-caveat",
  display: "swap",
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: "Ember 🔥 — Rekindle who you are",
  description:
    "A collaborative AI agent powered by Gemini 3.5 Flash Lite and a Gemma 4 privacy layer that helps young adults rebuild self-esteem through real-world actions, not digital validation.",
  keywords: [
    "mental health",
    "self-esteem",
    "AI agent",
    "wellness",
    "face to face",
    "digital detox",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${playfair.variable} ${caveat.variable}`}
      suppressHydrationWarning
    >
      <body
        className="min-h-screen bg-cream-100 antialiased font-sans"
        suppressHydrationWarning
      >
        {children}
      </body>
    </html>
  );
}