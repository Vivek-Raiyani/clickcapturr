"use client";

import { useState } from "react";
import Link from "next/link";
import { Play, QrCode, ArrowRight, CheckCircle2 } from "lucide-react";

interface CreatorDemo {
  id: string;
  creator: string;
  sponsor: string;
  videoTitle: string;
  hookTimestamp: string;
  thumbnail: string;
  videoFrameImg: string;
  leadTitle: string;
  leadAsset: string;
  calloutQuote: string;
  slug: string;
}

const CREATORS: CreatorDemo[] = [
  {
    id: "cleo",
    creator: "Cleo Abram",
    sponsor: "Bailly",
    videoTitle: "Why NASA Is Sending This Truck To The Moon: WHAT CAN IT DO?",
    hookTimestamp: "03:45",
    thumbnail: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=160&q=80",
    videoFrameImg: "https://images.unsplash.com/photo-1541185933-ef5d8ed016c2?auto=format&fit=crop&w=1200&q=80",
    leadTitle: "NASA Lunar Rover Tech Breakdown",
    leadAsset: "14-Page Gated PDF Dossier",
    calloutQuote: "Scan this code on your screen to get our full blueprint of the Lunar Rover specs.",
    slug: "magnet.new/m/lunar-rover-specs",
  },
  {
    id: "ali",
    creator: "Ali Abdaal",
    sponsor: "Grammarly",
    videoTitle: "How I Built a $5M/Year Passive Income Engine From My Bedroom",
    hookTimestamp: "06:12",
    thumbnail: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=160&q=80",
    videoFrameImg: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80",
    leadTitle: "The Complete Notion Productivity OS",
    leadAsset: "Notion Workspace + Video Setup Guide",
    calloutQuote: "Point your phone at the TV right now to claim the exact Notion database I use.",
    slug: "magnet.new/m/ali-notion-engine",
  },
  {
    id: "sam",
    creator: "Sam Parr",
    sponsor: "HubSpot",
    videoTitle: "The Excellence Mindset: 7 Boring Businesses Printing Cash",
    hookTimestamp: "02:18",
    thumbnail: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=160&q=80",
    videoFrameImg: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80",
    leadTitle: "7 Boring Business Breakdown Teardowns",
    leadAsset: "Spreadsheet Financial Models + P&L",
    calloutQuote: "Scan the QR code to download all 7 business models and their EBITDA breakdowns.",
    slug: "magnet.new/m/boring-biz-models",
  },
  {
    id: "codie",
    creator: "Codie Sanchez",
    sponsor: "Omnisend",
    videoTitle: "How to Buy a Laundromat with $0 Down and Cashflow in 30 Days",
    hookTimestamp: "04:50",
    thumbnail: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=160&q=80",
    videoFrameImg: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1200&q=80",
    leadTitle: "Main Street Acquisition Due Diligence Checklist",
    leadAsset: "28-Point Seller Interview Guide",
    calloutQuote: "Scan mid-video to get my actual seller negotiation questionnaire for free.",
    slug: "magnet.new/m/main-street-deals",
  },
];

const STEPS = [
  { num: "1", title: "QR appears in video", sub: "On-screen during key moment" },
  { num: "2", title: "Viewer scans", sub: "Works from any TV or phone screen" },
  { num: "3", title: "Lead page loads", sub: "Branded lead page, instant" },
  { num: "4", title: "Email captured", sub: "Yours — not YouTube's" },
];

export function MidVideoShowcase() {
  const [activeCreator, setActiveCreator] = useState<CreatorDemo>(CREATORS[0]);
  const [activeStep, setActiveStep] = useState<number>(0);

  return (
    <section id="creators" className="py-20 sm:py-28 bg-theme-bg text-theme-text transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header with Bespoke Serif */}
        <div className="max-w-3xl mb-12 sm:mb-16 space-y-3">
          <span className="text-xs sm:text-sm font-mono uppercase tracking-widest text-theme-primary font-bold">
            Real Creators. Real Results.
          </span>
          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-serif font-bold tracking-tight text-theme-text uppercase leading-[1.05]">
            The Biggest Creators Use QR Codes To Capture Leads Mid-Video
          </h2>
          <p className="text-base sm:text-lg font-sans text-theme-text-muted font-normal">
            One scan turns a viewer into an email subscriber. Here&apos;s what it looks like in practice.
          </p>
        </div>

        {/* 4-Step Progression Tabs Header */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-8">
          {STEPS.map((step, idx) => (
            <button
              key={idx}
              onClick={() => setActiveStep(idx)}
              className={`p-4 rounded-xl text-left border transition-all duration-200 ${
                activeStep === idx
                  ? "bg-theme-primary text-theme-primary-fg border-theme-primary shadow-md"
                  : "bg-theme-surface text-theme-text border-theme-border hover:bg-theme-surface-hover"
              }`}
            >
              <div className="flex items-center gap-2 mb-1">
                <span
                  className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold ${
                    activeStep === idx
                      ? "bg-white text-zinc-950"
                      : "bg-theme-surface border border-theme-border text-theme-text"
                  }`}
                >
                  {step.num}
                </span>
                <h4 className="text-xs sm:text-sm font-bold font-sans truncate">{step.title}</h4>
              </div>
              <p
                className={`text-[11px] font-sans truncate ${
                  activeStep === idx ? "opacity-90" : "text-theme-text-muted"
                }`}
              >
                {step.sub}
              </p>
            </button>
          ))}
        </div>

        {/* The Interactive Showcase Container */}
        <div className="rounded-3xl border border-theme-border bg-theme-card overflow-hidden shadow-2xl">
          <div className="grid grid-cols-1 lg:grid-cols-12">
            
            {/* Left Sidebar: Creator List */}
            <div className="lg:col-span-4 border-b lg:border-b-0 lg:border-r border-theme-border p-4 sm:p-6 space-y-2 bg-theme-surface/50">
              <span className="text-[11px] font-mono uppercase tracking-widest text-theme-text-muted font-semibold px-2 mb-2 block">
                Top Creator Collaborations
              </span>
              {CREATORS.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveCreator(item)}
                  className={`w-full p-3 rounded-xl flex items-center gap-3 text-left transition-all duration-150 ${
                    activeCreator.id === item.id
                      ? "bg-theme-card text-theme-text shadow-sm border border-theme-border"
                      : "text-theme-text-muted hover:text-theme-text hover:bg-theme-surface"
                  }`}
                >
                  <img
                    src={item.thumbnail}
                    alt={item.creator}
                    className="w-12 h-12 rounded-lg object-cover border border-theme-border"
                  />
                  <div className="min-w-0 flex-1 font-sans">
                    <p className="text-sm font-bold text-theme-text truncate">{item.creator}</p>
                    <p className="text-xs text-theme-primary truncate">× {item.sponsor}</p>
                  </div>
                  {activeCreator.id === item.id && (
                    <span className="w-2 h-2 rounded-full bg-theme-primary" />
                  )}
                </button>
              ))}
            </div>

            {/* Center/Right: Video Player Simulation */}
            <div className="lg:col-span-8 p-4 sm:p-8 flex flex-col justify-between space-y-6">
              {/* Simulated YouTube Player Frame */}
              <div className="relative rounded-2xl overflow-hidden border border-theme-border aspect-[16/9] w-full bg-theme-surface shadow-inner group">
                <img
                  src={activeCreator.videoFrameImg}
                  alt={activeCreator.videoTitle}
                  className="w-full h-full object-cover filter brightness-75"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/60" />

                {/* Top Video Header */}
                <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10">
                  <div className="flex items-center gap-3">
                    <img
                      src={activeCreator.thumbnail}
                      alt={activeCreator.creator}
                      className="w-8 h-8 rounded-full border border-white"
                    />
                    <div className="text-white">
                      <p className="text-xs sm:text-sm font-bold leading-tight flex items-center gap-1.5 font-sans">
                        {activeCreator.creator}
                        <CheckCircle2 className="w-3.5 h-3.5 text-zinc-300" />
                      </p>
                      <p className="text-[10px] sm:text-xs text-zinc-300 max-w-md truncate font-sans">
                        {activeCreator.videoTitle}
                      </p>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded bg-theme-primary text-theme-primary-fg text-[10px] font-mono font-bold tracking-wider uppercase">
                    HD 4K
                  </span>
                </div>

                {/* Central Play Icon overlay */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-theme-primary/90 text-theme-primary-fg flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform duration-200">
                    <Play className="w-8 h-8 fill-current translate-x-0.5" />
                  </div>
                </div>

                {/* Mid-Video Floating QR Code Banner Overlay */}
                <div className="absolute bottom-6 left-6 right-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-xl bg-theme-card/95 backdrop-blur-md border border-theme-border">
                  <div className="flex items-center gap-4">
                    {/* On-screen QR */}
                    <div className="p-2 rounded-lg bg-theme-surface border border-theme-border shadow-md flex-shrink-0">
                      <div className="w-14 h-14 bg-theme-card flex items-center justify-center rounded">
                        <QrCode className="w-10 h-10 text-theme-primary" />
                      </div>
                    </div>
                    <div>
                      <span className="text-[10px] font-mono uppercase tracking-widest text-theme-primary font-bold">
                        MID-VIDEO HOOK ({activeCreator.hookTimestamp})
                      </span>
                      <p className="text-xs sm:text-sm font-sans font-medium text-theme-text leading-snug">
                        “{activeCreator.calloutQuote}”
                      </p>
                    </div>
                  </div>

                  <div className="text-right flex-shrink-0 hidden sm:block">
                    <span className="text-[10px] font-mono text-theme-text-muted block">DESTINATION URL</span>
                    <span className="text-xs font-mono text-theme-primary font-semibold">{activeCreator.slug}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons Below the Player */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
                <Link
                  href="/demo"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-theme-primary hover:bg-theme-primary-hover text-theme-primary-fg text-sm font-sans font-bold transition-colors shadow-md"
                >
                  Create your free lead page
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/demo"
                  className="text-xs sm:text-sm font-sans font-medium text-theme-text-muted hover:text-theme-text flex items-center gap-1 transition-colors"
                >
                  See 20+ more creator templates →
                </Link>
              </div>

            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
