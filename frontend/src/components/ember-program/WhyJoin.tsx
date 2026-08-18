"use client";

import { Users, Award, BarChart3, Globe, Shield, Heart } from "lucide-react";

const benefits = [
  {
    icon: Users,
    title: "Reach young adults who need you",
    desc: "Connect with motivated users actively seeking real-world experiences in your area.",
    color: "text-blue-500",
    bg: "bg-blue-500/10",
  },
  {
    icon: Heart,
    title: "Be part of the solution",
    desc: "Join a movement rebuilding young adults' self-worth through evidence-based approaches and real-world action.",
    color: "text-rose-500",
    bg: "bg-rose-500/10",
  },
  {
    icon: Shield,
    title: "Verified Partner Badge",
    desc: "Stand out in the catalog with our trust badge. Users know you're vetted.",
    color: "text-amber-500",
    bg: "bg-amber-500/10",
  },
  {
    icon: BarChart3,
    title: "Impact analytics",
    desc: "See how many Ember users attend, their feedback, and mood improvements.",
    color: "text-purple-500",
    bg: "bg-purple-500/10",
  },
  {
    icon: Award,
    title: "Certification system",
    desc: "Issue digital certificates that appear on users' Identity Graphs and Triumph Boards.",
    color: "text-terracotta-500",
    bg: "bg-terracotta-500/10",
  },
  {
    icon: Globe,
    title: "Community of partners",
    desc: "Join a network of like-minded organizations sharing best practices.",
    color: "text-green-500",
    bg: "bg-green-500/10",
  },
];

export default function WhyJoin() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {benefits.map((benefit) => {
        const Icon = benefit.icon;
        return (
          <div key={benefit.title} className="card-static p-6">
            <div className={`w-12 h-12 ${benefit.bg} rounded-xl flex items-center justify-center mb-4`}>
              <Icon className={`w-6 h-6 ${benefit.color}`} />
            </div>
            <h3 className="font-serif font-semibold text-coffee-800 mb-2">
              {benefit.title}
            </h3>
            <p className="text-sm text-warm-gray leading-relaxed">{benefit.desc}</p>
          </div>
        );
      })}
    </div>
  );
}