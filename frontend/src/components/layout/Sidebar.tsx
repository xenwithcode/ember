"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Menu, X, Home, BookOpen, Compass, Users, Calendar, Trophy, Heart } from "lucide-react";
import EmberLogo from "@/components/EmberLogo";

const navItems = [
  { label: "Home", href: "/", icon: Home, description: "Back to start" },
  { label: "Journal", href: "/journal", icon: BookOpen, description: "Write & reflect" },
  { label: "Discover", href: "/activities", icon: Compass, description: "Find activities" },
  { label: "Inner Circle", href: "/friends", icon: Users, description: "Your people" },
  { label: "Calendar", href: "/calendar", icon: Calendar, description: "Your schedule" },
  { label: "Triumph Board", href: "/dashboard", icon: Trophy, description: "Your progress" },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white/85 backdrop-blur-md border-b border-cream-200 shadow-warm">
      {/* Top bar */}
      <div className="flex items-center justify-between px-4 sm:px-6 py-3">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="group-hover:scale-110 transition-transform">
            <EmberLogo className="w-10 h-10" />
          </div>
          <div>
            <h1 className="font-serif font-semibold text-coffee-800 text-lg leading-tight">
              Ember
            </h1>
            <p className="text-xs text-warm-light">Rekindle who you are</p>
          </div>
        </Link>

        {/* Menu toggle */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          aria-label={isOpen ? "Close menu" : "Open menu"}
          className={`
            p-2.5 rounded-xl transition-all duration-200
            ${
              isOpen
                ? "bg-terracotta-500 text-white shadow-warm"
                : "bg-terracotta-500/10 text-terracotta-600 hover:bg-terracotta-500/20"
            }
          `}
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Accordion nav */}
      <div
        className={`
          overflow-hidden transition-all duration-300 ease-in-out
          ${isOpen ? "max-h-[620px]" : "max-h-0"}
        `}
      >
        <nav className="px-4 pb-4 space-y-1">
          {navItems.map((item) => {
            const isActive =
              item.href === "/"
                ? pathname === "/"
                : pathname?.startsWith(item.href);
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className={isActive ? "nav-link-active" : "nav-link"}
              >
                <Icon className="w-5 h-5" />
                <div>
                  <span className="block">{item.label}</span>
                  <span className="block text-xs opacity-60">
                    {item.description}
                  </span>
                </div>
              </Link>
            );
          })}

          {/* User section */}
          <div className="pt-4 mt-2 border-t border-cream-200 space-y-1">
            <p className="text-xs font-semibold uppercase tracking-wide text-warm-light px-4 pb-1">
              Your Profile
            </p>
            <Link
              href="/ember-program"
              onClick={() => setIsOpen(false)}
              className="nav-link text-xs"
            >
              <div className="w-8 h-8 bg-terracotta-500/10 rounded-full flex items-center justify-center">
                <Heart className="w-4 h-4 text-terracotta-600" />
              </div>
              <div>
                <span className="block text-sm font-medium">Ember Program</span>
                <span className="block text-xs text-warm-light">Join as partner</span>
              </div>
            </Link>
          </div>

          {/* Disclaimer */}
          <p className="text-xs text-warm-light leading-relaxed pt-3">
            Self-help tool, not a replacement for professional care.
          </p>
        </nav>
      </div>
    </header>
  );
}