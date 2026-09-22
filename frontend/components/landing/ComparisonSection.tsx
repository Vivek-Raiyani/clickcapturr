"use client";

import { Check, X } from "lucide-react";

export function ComparisonSection() {
  const comparisons = [
    {
      feature: "Captures 53% TV Viewership",
      desc: "Viewers watching on Smart TVs and Apple TVs can point their phone and scan instantly.",
      vuemagnet: true,
      descriptionLink: false,
      linktree: false,
      drive: false,
    },
    {
      feature: "Mid-Video Attention Peak",
      desc: "Captures viewers when excitement is highest, before 80% drop-off at end screen.",
      vuemagnet: true,
      descriptionLink: false,
      linktree: false,
      drive: false,
    },
    {
      feature: "Instant Gated Asset Delivery",
      desc: "Automatically exchanges email for PDF, Notion workspace, or spreadsheet download.",
      vuemagnet: true,
      descriptionLink: false,
      linktree: false,
      drive: false,
    },
    {
      feature: "Direct Email Ownership & CRM",
      desc: "Export captured leads directly to your email provider or CRM with full attribution.",
      vuemagnet: true,
      descriptionLink: false,
      linktree: false,
      drive: false,
    },
    {
      feature: "Editorial & Bespoke Aesthetic",
      desc: "Luxury typography, glassmorphic cards, and custom palettes instead of cheap templates.",
      vuemagnet: true,
      descriptionLink: false,
      linktree: false,
      drive: false,
    },
  ];

  return (
    <section id="comparison" className="py-20 sm:py-28 bg-theme-bg text-theme-text transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header with Bespoke Serif */}
        <div className="max-w-3xl mb-16 space-y-3">
          <span className="text-xs sm:text-sm font-mono uppercase tracking-widest text-theme-primary font-bold">
            The ROI Breakdown
          </span>
          <h2 className="text-3xl sm:text-5xl font-serif font-bold tracking-tight text-theme-text uppercase leading-tight">
            Why Creators Are Switching To VueMagnet
          </h2>
          <p className="text-base sm:text-lg font-sans text-theme-text-muted">
            See how on-screen dynamic QR pages outperform outdated description links and Linktree bios.
          </p>
        </div>

        {/* Comparison Table */}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left font-sans">
            <thead>
              <tr className="border-b border-theme-border">
                <th className="py-5 px-4 sm:px-6 text-sm font-bold text-theme-text w-1/3">
                  Feature / Capability
                </th>
                <th className="py-5 px-4 sm:px-6 text-center bg-theme-surface rounded-t-2xl border-x border-t border-theme-border">
                  <div className="flex flex-col items-center">
                    <span className="px-2.5 py-0.5 rounded-full bg-theme-primary text-theme-primary-fg text-[10px] font-mono uppercase font-bold tracking-widest mb-1">
                      Recommended
                    </span>
                    <span className="text-base font-serif font-bold text-theme-text uppercase">
                      VueMagnet
                    </span>
                  </div>
                </th>
                <th className="py-5 px-4 sm:px-6 text-center text-sm font-semibold text-theme-text-muted">
                  Description Link
                </th>
                <th className="py-5 px-4 sm:px-6 text-center text-sm font-semibold text-theme-text-muted">
                  Linktree / Bio Link
                </th>
                <th className="py-5 px-4 sm:px-6 text-center text-sm font-semibold text-theme-text-muted">
                  Google Drive Folder
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-theme-border-subtle text-sm">
              {comparisons.map((row, idx) => (
                <tr key={idx} className="hover:bg-theme-surface/40 transition-colors">
                  <td className="py-5 px-4 sm:px-6 space-y-1">
                    <p className="font-bold text-theme-text text-sm sm:text-base">
                      {row.feature}
                    </p>
                    <p className="text-xs text-theme-text-muted">
                      {row.desc}
                    </p>
                  </td>
                  <td className="py-5 px-4 sm:px-6 text-center bg-theme-surface border-x border-theme-border">
                    <div className="w-8 h-8 rounded-full bg-theme-primary text-theme-primary-fg flex items-center justify-center mx-auto shadow-sm">
                      <Check className="w-5 h-5 stroke-[2.5]" />
                    </div>
                  </td>
                  <td className="py-5 px-4 sm:px-6 text-center">
                    <div className="w-7 h-7 rounded-full bg-theme-surface text-theme-text-muted flex items-center justify-center mx-auto border border-theme-border">
                      <X className="w-4 h-4" />
                    </div>
                  </td>
                  <td className="py-5 px-4 sm:px-6 text-center">
                    <div className="w-7 h-7 rounded-full bg-theme-surface text-theme-text-muted flex items-center justify-center mx-auto border border-theme-border">
                      <X className="w-4 h-4" />
                    </div>
                  </td>
                  <td className="py-5 px-4 sm:px-6 text-center">
                    <div className="w-7 h-7 rounded-full bg-theme-surface text-theme-text-muted flex items-center justify-center mx-auto border border-theme-border">
                      <X className="w-4 h-4" />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>
    </section>
  );
}
