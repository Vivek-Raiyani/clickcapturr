"use client";

import { Tv, TrendingUp, DollarSign } from "lucide-react";

interface StatItem {
  value: string;
  label: string;
  highlight?: string;
  icon: React.ReactNode;
}

const STATS: StatItem[] = [
  {
    value: "53%",
    label: "YouTube watching happens on TV, where viewers can't click links in descriptions.",
    highlight: "Connected TV Shift",
    icon: <Tv className="w-5 h-5 text-theme-primary" />,
  },
  {
    value: "5x",
    label: "QR scans convert ~5x better than traditional 'click the link in description' callouts in videos.",
    highlight: "Mid-Video Attention",
    icon: <TrendingUp className="w-5 h-5 text-theme-primary" />,
  },
  {
    value: "$3.45B",
    label: "Payouts made to YouTube creators in the US from brands for sponsored content and lead campaigns.",
    highlight: "High-Intent Value",
    icon: <DollarSign className="w-5 h-5 text-theme-primary" />,
  },
];

export function StatsCards() {
  return (
    <section className="py-12 sm:py-16 bg-theme-surface border-y border-theme-border-subtle transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {STATS.map((stat, idx) => (
            <div
              key={idx}
              className="p-6 sm:p-8 rounded-2xl bg-theme-card border border-theme-border shadow-sm hover:shadow-md transition-all duration-200 space-y-4"
            >
              <div className="flex items-center justify-between">
                <span className="text-4xl sm:text-5xl font-serif font-bold tracking-tight text-theme-text">
                  {stat.value}
                </span>
                <div className="w-10 h-10 rounded-xl bg-theme-surface flex items-center justify-center">
                  {stat.icon}
                </div>
              </div>
              <p className="text-sm sm:text-base font-sans text-theme-text-muted leading-relaxed">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
