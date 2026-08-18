"use client";

import Sidebar from "./Sidebar";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-cream-100">
      <Sidebar />
      <main className="min-h-screen">{children}</main>
    </div>
  );
}