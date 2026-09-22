"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowRight, QrCode, Sparkles, CheckCircle2, ShieldCheck } from "lucide-react";
import QRCode from "qrcode";
import { useAuth } from "@/context/AuthContext";

interface PresetItem {
  id: string;
  name: string;
  creator: string;
  slug: string;
  headline: string;
  speechBubble: string;
  offerType: string;
  heroImg: string;
}

const PRESETS: PresetItem[] = [
  {
    id: "creator-os",
    name: "Creator OS",
    creator: "Elena Vance",
    slug: "vuemagnet.com/m/elena-os",
    headline: "THE CALM BUSINESS SYSTEM",
    speechBubble: "Scan the code to get my operating system template and 10x your business.",
    offerType: "Notion Architecture + Video Walkthrough",
    heroImg: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "saas-scale",
    name: "SaaS Playbook",
    creator: "Marcus Thorne",
    slug: "vuemagnet.com/m/saas-zero-one",
    headline: "ZERO TO $1M ARR ARCHITECTURE",
    speechBubble: "Grab my 32-page B2B onboarding funnel blueprint right now from your screen.",
    offerType: "32-Page Gated PDF & Teardowns",
    heroImg: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "luxury-watch",
    name: "Luxury Compendium",
    creator: "Julian Belmont",
    slug: "vuemagnet.com/m/haute-horology",
    headline: "THE 2026 COLLECTOR COMPENDIUM",
    speechBubble: "Scan to download the unreleased independent watchmaker allocation index.",
    offerType: "Master Collector PDF + Allocation Guide",
    heroImg: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=1200&q=80",
  },
];

export function HeroSection() {
  const { user, openAuthModal } = useAuth();
  const [activePreset, setActivePreset] = useState<PresetItem>(PRESETS[0]);
  const [qrUrl, setQrUrl] = useState<string>("");
  const [emailInput, setEmailInput] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    QRCode.toDataURL(activePreset.slug, {
      width: 220,
      margin: 1,
      color: {
        dark: "#18181b",
        light: "#ffffff",
      },
    })
      .then((url) => setQrUrl(url))
      .catch((err) => console.error(err));
  }, [activePreset]);

  return (
    <section className="relative pt-8 pb-20 sm:pt-14 sm:pb-28 overflow-hidden bg-theme-bg transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Two-Column Header matching the competitor screenshot */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start mb-12 lg:mb-16">
          {/* Left: Giant Bold Headline using Bespoke Serif */}
          <div className="lg:col-span-7 space-y-3">
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-serif font-bold tracking-tight text-theme-text uppercase leading-[0.98] max-w-2xl">
              Turn YouTube Viewers Into An Email List
            </h1>
          </div>

          {/* Right: Paragraph + High-Converting CTA */}
          <div className="lg:col-span-5 flex flex-col justify-between pt-2 space-y-6">
            <p className="text-lg sm:text-xl font-sans text-theme-text-muted leading-relaxed font-normal">
              VueMagnet helps creators convert viewers into leads using trackable links and
              on-screen QR codes that work, even for the{" "}
              <span className="font-semibold text-theme-text underline decoration-theme-primary/60 decoration-2 underline-offset-4">
                53% watching on TV
              </span>
              .
            </p>

            <div>
              {user ? (
                <Link
                  href="/dashboard"
                  className="inline-flex items-center justify-center gap-3 px-8 py-4 rounded-xl bg-theme-primary hover:bg-theme-primary-hover text-theme-primary-fg font-sans font-bold text-base shadow-lg shadow-theme-primary/20 hover:-translate-y-0.5 transition-all duration-200"
                >
                  Go to Dashboard
                  <ArrowRight className="w-5 h-5" />
                </Link>
              ) : (
                <button
                  onClick={() => openAuthModal("signup")}
                  className="inline-flex items-center justify-center gap-3 px-8 py-4 rounded-xl bg-theme-primary hover:bg-theme-primary-hover text-theme-primary-fg font-sans font-bold text-base shadow-lg shadow-theme-primary/20 hover:-translate-y-0.5 transition-all duration-200 cursor-pointer"
                >
                  Create Your First Page
                  <ArrowRight className="w-5 h-5" />
                </button>
              )}
              <p className="mt-2.5 text-xs text-theme-text-muted font-sans tracking-wide">
                Instant creation · 3 pages free · No credit card needed
              </p>
            </div>
          </div>
        </div>


        {/* Hero Visual Mockup Stage */}
        <div className="relative mx-auto max-w-5xl rounded-3xl overflow-hidden border border-theme-border shadow-2xl bg-theme-card">
          {/* Creator Studio Scene Background */}
          <div className="relative aspect-[16/9] sm:aspect-[16/8] w-full overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&w=1920&q=80"
              alt="Studio Creator Recording with Mic"
              className="w-full h-full object-cover opacity-85 scale-105 filter brightness-90"
            />
            {/* Ambient Lighting Gradient Overlays */}
            <div className="absolute inset-0 bg-gradient-to-t from-theme-card via-theme-card/30 to-transparent" />

            {/* Creator Microphone & Studio Focal point overlay info */}
            <div className="absolute bottom-6 left-6 sm:bottom-10 sm:left-10 z-10 max-w-md space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-theme-card/85 backdrop-blur-md border border-theme-border text-theme-text text-xs font-mono">
                <span className="w-2 h-2 rounded-full bg-theme-primary animate-pulse" />
                Mid-Video Callout (04:12)
              </div>
              
              {/* Creator Speech Callout Bubble matching screenshot */}
              <div className="relative p-4 sm:p-5 rounded-2xl bg-theme-card/95 backdrop-blur-md border border-theme-border text-theme-text shadow-xl">
                <p className="text-sm sm:text-base font-sans font-medium leading-snug">
                  “{activePreset.speechBubble}”
                </p>
                <div className="mt-2 flex items-center gap-2 text-xs text-theme-text-muted font-sans">
                  <span className="font-semibold text-theme-text">{activePreset.creator}</span>
                  <span>·</span>
                  <span>Featured Lead Offer</span>
                </div>
                {/* Speech Bubble Arrow */}
                <div className="absolute -top-2 left-8 w-4 h-4 bg-theme-card/95 border-t border-l border-theme-border rotate-45" />
              </div>
            </div>

            {/* On-Screen Floating QR Code Badge */}
            <div className="absolute top-6 right-6 sm:top-8 sm:right-8 z-20 flex flex-col items-center">
              <div className="p-3 sm:p-4 rounded-2xl bg-theme-card text-theme-text shadow-2xl border-2 border-theme-primary flex flex-col items-center transition-transform hover:scale-105 duration-200">
                {qrUrl ? (
                  <img src={qrUrl} alt="On-Screen QR Code" className="w-24 h-24 sm:w-28 sm:h-28 rounded-lg" />
                ) : (
                  <div className="w-24 h-24 sm:w-28 sm:h-28 bg-theme-surface rounded-lg animate-pulse" />
                )}
                <div className="mt-1.5 flex items-center gap-1 text-[11px] font-sans font-black tracking-wider uppercase text-theme-primary">
                  <QrCode className="w-3 h-3" />
                  Scan On TV
                </div>
              </div>
            </div>

            {/* Floating Mobile Phone Preview */}
            <div className="absolute -bottom-8 right-6 sm:right-12 sm:bottom-0 w-64 sm:w-76 z-30 shadow-2xl rounded-t-3xl border-4 border-b-0 border-theme-border bg-theme-surface transform translate-y-8 sm:translate-y-4 hover:translate-y-0 transition-transform duration-300">
              {/* Phone Speaker Notch */}
              <div className="w-full pt-3 pb-2 flex justify-center bg-theme-surface rounded-t-3xl">
                <div className="w-16 h-3 bg-theme-card rounded-full" />
              </div>

              {/* Phone Screen Mockup */}
              <div className="p-4 bg-theme-card text-theme-text rounded-t-2xl space-y-3 font-sans border-t border-theme-border">
                {/* URL Bar */}
                <div className="w-full py-1 px-2.5 rounded-full bg-theme-surface border border-theme-border text-[10px] font-mono text-theme-text-muted text-center truncate">
                  {activePreset.slug}
                </div>

                {/* Lead Page Header */}
                <div className="text-center pt-2 space-y-1">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-theme-primary font-semibold">
                    Instant Access
                  </span>
                  <h3 className="text-base font-serif font-bold tracking-tight text-theme-text leading-tight">
                    {activePreset.headline}
                  </h3>
                  <p className="text-[11px] text-theme-text-muted leading-tight font-sans">
                    {activePreset.offerType}
                  </p>
                </div>

                {/* Form Simulation */}
                {!isSubmitted ? (
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      if (emailInput) setIsSubmitted(true);
                    }}
                    className="space-y-2 pt-1"
                  >
                    <input
                      type="email"
                      required
                      placeholder="Enter your best email..."
                      value={emailInput}
                      onChange={(e) => setEmailInput(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-theme-surface border border-theme-border text-xs text-theme-text placeholder:text-theme-text-muted focus:outline-none focus:border-theme-primary transition-colors font-sans"
                    />
                    <button
                      type="submit"
                      className="w-full py-2.5 rounded-lg bg-theme-primary hover:bg-theme-primary-hover text-theme-primary-fg text-xs font-sans font-bold uppercase tracking-wider transition-colors shadow-sm"
                    >
                      Get Instant Access →
                    </button>
                  </form>
                ) : (
                  <div className="p-3 rounded-lg bg-theme-surface border border-theme-border text-center space-y-1">
                    <CheckCircle2 className="w-5 h-5 text-theme-primary mx-auto" />
                    <p className="text-xs font-bold text-theme-text">Asset Ready!</p>
                    <p className="text-[10px] text-theme-text-muted">Download link sent to email.</p>
                  </div>
                )}

                <div className="flex items-center justify-center gap-1.5 text-[10px] text-theme-text-muted pt-1">
                  <ShieldCheck className="w-3 h-3 text-theme-text-muted" />
                  <span>No spam · 1-click unsubscribe</span>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
