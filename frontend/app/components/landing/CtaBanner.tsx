"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export function CtaBanner() {
  const { user, openAuthModal } = useAuth();

  return (
    <section className="py-24 sm:py-32 bg-theme-card text-theme-text text-center relative overflow-hidden border-t border-theme-border transition-colors duration-300">
      {/* Background ambient lighting */}
      <div className="absolute inset-0 bg-gradient-to-b from-theme-primary/10 via-transparent to-transparent pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-theme-primary/15 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-6">
        <h2 className="text-4xl sm:text-6xl lg:text-7xl font-serif font-bold tracking-tight uppercase leading-[0.98]">
          Don&apos;t Let Half Your Audience Slip Away
        </h2>
        <p className="text-lg sm:text-xl font-sans text-theme-text-muted max-w-2xl mx-auto font-normal">
          Start converting your video viewers today with on-screen QR codes and bespoke lead capture pages.
        </p>

        <div className="pt-4 flex flex-col items-center">
          {user ? (
            <Link
              href="/dashboard"
              className="inline-flex items-center justify-center gap-3 px-8 sm:px-10 py-4 sm:py-5 rounded-2xl bg-theme-primary hover:bg-theme-primary-hover text-theme-primary-fg font-sans font-bold text-lg sm:text-xl shadow-2xl shadow-theme-primary/25 hover:-translate-y-0.5 transition-all duration-200"
            >
              Go to Dashboard
              <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6" />
            </Link>
          ) : (
            <button
              onClick={() => openAuthModal("signup")}
              className="inline-flex items-center justify-center gap-3 px-8 sm:px-10 py-4 sm:py-5 rounded-2xl bg-theme-primary hover:bg-theme-primary-hover text-theme-primary-fg font-sans font-bold text-lg sm:text-xl shadow-2xl shadow-theme-primary/25 hover:-translate-y-0.5 transition-all duration-200 cursor-pointer"
            >
              Create Your First QR Page
              <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
          )}
          <div className="mt-4 flex items-center justify-center gap-4 text-xs font-sans text-theme-text-muted">
            <span>Instant creation</span>
            <span>·</span>
            <span>3 pages free</span>
            <span>·</span>
            <span>No credit card needed</span>
          </div>
        </div>
      </div>
    </section>
  );
}
