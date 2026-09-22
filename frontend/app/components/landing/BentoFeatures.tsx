"use client";

import { useState } from "react";
import { QrCode, Clock, Download } from "lucide-react";

export function BentoFeatures() {
  const [qrStyle, setQrStyle] = useState<"standard" | "rounded">("rounded");
  const [qrColor, setQrColor] = useState<"primary" | "dark">("primary");

  return (
    <section id="features" className="py-20 sm:py-28 bg-theme-surface border-t border-theme-border-subtle transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header with Bespoke Serif */}
        <div className="max-w-3xl mb-16 space-y-3">
          <span className="text-xs sm:text-sm font-mono uppercase tracking-widest text-theme-primary font-bold">
            Creator Architecture
          </span>
          <h2 className="text-3xl sm:text-5xl font-serif font-bold tracking-tight text-theme-text uppercase leading-tight">
            Powerful Features For Creators
          </h2>
          <p className="text-base sm:text-lg font-sans text-theme-text-muted">
            Everything you need to turn your YouTube audience into a thriving, high-value email list.
          </p>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Card 1: QR Codes & Short Links */}
          <div className="flex flex-col justify-between rounded-3xl p-6 sm:p-8 bg-theme-card border border-theme-border shadow-sm hover:shadow-md transition-shadow">
            {/* Visual Container */}
            <div className="p-6 rounded-2xl bg-theme-surface border border-theme-border mb-6 space-y-4">
              <div className="flex items-center justify-center gap-4">
                <div
                  className={`p-3 bg-theme-card shadow-md border border-theme-border ${
                    qrStyle === "rounded" ? "rounded-2xl" : "rounded-none"
                  }`}
                >
                  <QrCode
                    className={`w-16 h-16 ${
                      qrColor === "primary" ? "text-theme-primary" : "text-theme-text"
                    }`}
                  />
                </div>
              </div>

              {/* Short Link display */}
              <div className="py-2 px-3 rounded-lg bg-theme-card border border-theme-border text-center">
                <span className="text-xs font-mono text-theme-text-muted">Shortened URL:</span>
                <span className="block text-xs font-mono font-bold text-theme-primary">
                  magnet.new/m/hP0ik0v
                </span>
              </div>

              {/* Interactive Controls */}
              <div className="space-y-2 pt-2 border-t border-theme-border-subtle">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-theme-text-muted font-sans">Style:</span>
                  <div className="inline-flex gap-1 font-sans">
                    <button
                      onClick={() => setQrStyle("standard")}
                      className={`px-2 py-0.5 rounded text-[11px] font-medium ${
                        qrStyle === "standard"
                          ? "bg-theme-primary text-theme-primary-fg"
                          : "bg-theme-card text-theme-text border border-theme-border"
                      }`}
                    >
                      Standard
                    </button>
                    <button
                      onClick={() => setQrStyle("rounded")}
                      className={`px-2 py-0.5 rounded text-[11px] font-medium ${
                        qrStyle === "rounded"
                          ? "bg-theme-primary text-theme-primary-fg"
                          : "bg-theme-card text-theme-text border border-theme-border"
                      }`}
                    >
                      Rounded
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs">
                  <span className="text-theme-text-muted font-sans">Color:</span>
                  <div className="inline-flex gap-1 font-sans">
                    <button
                      onClick={() => setQrColor("primary")}
                      className={`px-2 py-0.5 rounded text-[11px] font-medium ${
                        qrColor === "primary"
                          ? "bg-theme-primary text-theme-primary-fg"
                          : "bg-theme-card text-theme-text border border-theme-border"
                      }`}
                    >
                      Accent
                    </button>
                    <button
                      onClick={() => setQrColor("dark")}
                      className={`px-2 py-0.5 rounded text-[11px] font-medium ${
                        qrColor === "dark"
                          ? "bg-theme-primary text-theme-primary-fg"
                          : "bg-theme-card text-theme-text border border-theme-border"
                      }`}
                    >
                      Dark
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Copy */}
            <div className="space-y-2">
              <h3 className="text-xl font-serif font-bold tracking-tight text-theme-text uppercase">
                QR Codes & Short Links
              </h3>
              <p className="text-sm font-sans text-theme-text-muted leading-relaxed">
                Generate custom QR codes and short links for your lead pages. Perfect for YouTube video overlays, social media, and offline marketing materials.
              </p>
            </div>
          </div>

          {/* Card 2: Lead Pages */}
          <div className="flex flex-col justify-between rounded-3xl p-6 sm:p-8 bg-theme-card border border-theme-border shadow-sm hover:shadow-md transition-shadow">
            {/* Visual Container */}
            <div className="p-5 rounded-2xl bg-theme-surface border border-theme-border mb-6 space-y-3 font-sans">
              <div className="flex items-center justify-between pb-2 border-b border-theme-border-subtle">
                <span className="text-[10px] font-mono uppercase tracking-wider text-theme-text-muted">
                  Editorial Studio
                </span>
                <span className="w-2 h-2 rounded-full bg-theme-primary" />
              </div>

              <div className="space-y-1 text-center py-2">
                <span className="text-[11px] font-mono text-theme-primary uppercase tracking-widest font-semibold">
                  Free Resource
                </span>
                <h4 className="text-sm font-serif font-bold text-theme-text leading-tight">
                  High Performance Creator Notion OS
                </h4>
              </div>

              {/* Form elements mockup */}
              <div className="space-y-2">
                <div className="h-8 rounded-lg bg-theme-card border border-theme-border px-3 flex items-center text-xs text-theme-text-muted">
                  Full Name
                </div>
                <div className="h-8 rounded-lg bg-theme-card border border-theme-border px-3 flex items-center text-xs text-theme-text-muted">
                  Email Address
                </div>
                <div className="h-9 rounded-lg bg-theme-primary text-theme-primary-fg text-xs font-bold flex items-center justify-center shadow-sm">
                  Get Free Access →
                </div>
              </div>
            </div>

            {/* Copy */}
            <div className="space-y-2">
              <h3 className="text-xl font-serif font-bold tracking-tight text-theme-text uppercase">
                Lead Pages
              </h3>
              <p className="text-sm font-sans text-theme-text-muted leading-relaxed">
                Create beautiful, branded lead capture pages that convert viewers into subscribers with customizable templates and instant QR code synchronization.
              </p>
            </div>
          </div>

          {/* Card 3: Lead Management & CRM */}
          <div className="flex flex-col justify-between rounded-3xl p-6 sm:p-8 bg-theme-card border border-theme-border shadow-sm hover:shadow-md transition-shadow">
            {/* Visual Container */}
            <div className="p-5 rounded-2xl bg-theme-surface border border-theme-border mb-6 space-y-4">
              {/* Metrics strip */}
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="p-2 rounded-lg bg-theme-card border border-theme-border">
                  <span className="text-sm sm:text-base font-serif font-bold text-theme-text block">915</span>
                  <span className="text-[10px] text-theme-text-muted uppercase font-mono">Total Leads</span>
                </div>
                <div className="p-2 rounded-lg bg-theme-card border border-theme-border">
                  <span className="text-sm sm:text-base font-serif font-bold text-theme-text block">12</span>
                  <span className="text-[10px] text-theme-text-muted uppercase font-mono">Daily Avg</span>
                </div>
                <div className="p-2 rounded-lg bg-theme-card border border-theme-border">
                  <span className="text-sm sm:text-base font-serif font-bold text-theme-primary block">87%</span>
                  <span className="text-[10px] text-theme-text-muted uppercase font-mono">Conv Rate</span>
                </div>
              </div>

              {/* Lead Table Rows */}
              <div className="space-y-1.5 pt-1 font-sans">
                {[
                  { name: "Gary Robbins", email: "gary@***.com", location: "New York, US" },
                  { name: "Radhika Thakur", email: "radhika@***.in", location: "Bangalore, IN" },
                  { name: "Stephanie Mount", email: "steph@***.com", location: "St. Louis, US" },
                ].map((lead, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between p-2 rounded-lg bg-theme-card border border-theme-border-subtle text-xs"
                  >
                    <span className="font-semibold text-theme-text">{lead.name}</span>
                    <span className="text-theme-text-muted font-mono text-[11px]">{lead.email}</span>
                    <span className="text-[10px] text-theme-text-muted font-mono hidden sm:inline">{lead.location}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Copy */}
            <div className="space-y-2">
              <h3 className="text-xl font-serif font-bold tracking-tight text-theme-text uppercase">
                Lead Management & CRM
              </h3>
              <p className="text-sm font-sans text-theme-text-muted leading-relaxed">
                Collect, organize, and export your leads with detailed analytics. Track subscriber data, country attribution, and conversion rates in one unified hub.
              </p>
            </div>
          </div>

        </div>

        {/* Row 2: Video Hook Timing & Instant Gated Delivery */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
          
          {/* Card 4: Hook / Call-to-action Timing */}
          <div className="p-6 sm:p-8 rounded-3xl bg-theme-card border border-theme-border shadow-sm flex flex-col justify-between">
            <div className="space-y-3 mb-6">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-theme-primary uppercase tracking-widest font-bold">
                  Retention Architecture
                </span>
                <Clock className="w-5 h-5 text-theme-text-muted" />
              </div>
              <h3 className="text-xl font-serif font-bold tracking-tight text-theme-text uppercase">
                Mid-Video Hook & Callout Timing
              </h3>
              <p className="text-sm font-sans text-theme-text-muted leading-relaxed">
                Don&apos;t wait until the end screen when 80% of viewers have dropped off. VueMagnet gives you tested verbal hook formulas and visual timing overlays to maximize scans.
              </p>
            </div>

            {/* Video Timeline Mockup */}
            <div className="p-4 rounded-2xl bg-theme-surface border border-theme-border space-y-2 font-sans">
              <div className="flex justify-between text-[11px] font-mono text-theme-text-muted">
                <span>00:00 (Hook)</span>
                <span className="text-theme-primary font-bold">03:42 (Optimal QR Scan Window)</span>
                <span>12:00 (End)</span>
              </div>
              <div className="relative h-2 w-full bg-theme-border rounded-full overflow-hidden">
                <div className="absolute left-0 top-0 bottom-0 w-1/3 bg-theme-text-muted opacity-40" />
                <div className="absolute left-[30%] top-0 bottom-0 w-1/4 bg-theme-primary rounded-full animate-pulse" />
              </div>
              <p className="text-[11px] font-sans text-theme-text-muted text-center pt-1">
                Scans peak between 25%–40% video progression during the core value reveal.
              </p>
            </div>
          </div>

          {/* Card 5: Instant Gated Delivery */}
          <div className="p-6 sm:p-8 rounded-3xl bg-theme-card border border-theme-border shadow-sm flex flex-col justify-between">
            <div className="space-y-3 mb-6">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-theme-primary uppercase tracking-widest font-bold">
                  Zero Delivery Friction
                </span>
                <Download className="w-5 h-5 text-theme-text-muted" />
              </div>
              <h3 className="text-xl font-serif font-bold tracking-tight text-theme-text uppercase">
                Instant Automated Asset Delivery
              </h3>
              <p className="text-sm font-sans text-theme-text-muted leading-relaxed">
                Whether it&apos;s a 30-page PDF, Notion template, Google Sheet financial model, or private video stream — deliver assets immediately on the thank-you screen while sending a backup copy to their inbox.
              </p>
            </div>

            {/* Download Confirmation Mock */}
            <div className="p-4 rounded-2xl bg-theme-surface border border-theme-border flex items-center justify-between gap-4 font-sans">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-xl bg-theme-card text-theme-primary border border-theme-border flex items-center justify-center flex-shrink-0">
                  <Download className="w-5 h-5" />
                </div>
                <div className="truncate">
                  <p className="text-xs font-bold text-theme-text truncate">executive-growth-playbook.pdf</p>
                  <p className="text-[10px] text-theme-text-muted font-mono">4.2 MB · Direct Secure Link</p>
                </div>
              </div>
              <span className="px-3 py-1.5 rounded-lg bg-theme-primary text-theme-primary-fg text-xs font-bold whitespace-nowrap shadow-sm">
                1-Click Download
              </span>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
