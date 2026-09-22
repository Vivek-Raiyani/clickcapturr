"use client";

import { useState } from "react";
import { Check, Sparkles, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import {
  PLANS as DEFAULT_PLANS,
  TRUST_ITEMS as DEFAULT_TRUST_ITEMS,
  type BillingPeriod,
  type Plan,
  type PlanFeature,
  type FaqEntry,
} from "@/components/pricing";
import { BillingToggle } from "@/components/pricing/BillingToggle";
import { PricingCard } from "@/components/pricing/PricingCard";
import { PricingTable } from "@/components/pricing/PricingTable";
import { FaqSection } from "@/components/pricing/FaqSection";
import type { PricingPageData } from "@/lib/services/PricingService";

export interface PricingSectionProps {
  /**
   * Server-provided dynamic pricing data fetched from the database.
   * If omitted or partially empty, safely falls back to standard static defaults.
   */
  initialData?: Partial<PricingPageData>;
}

/**
 * Full pricing page body — assembles all pricing sub-components.
 *
 * Implements Server-Driven UI:
 * - Content, pricing plans, FAQs, and trust badges can be fed dynamically from the database.
 * - Manages interactive client state for monthly/yearly billing period selection.
 * - Handles authentication-aware sign-up and checkout routing.
 */
export function PricingSection({ initialData }: PricingSectionProps) {
  const { user, openAuthModal } = useAuth();
  const [billing, setBilling] = useState<BillingPeriod>("yearly");

  // Merge server data with fallback defaults
  const plans: Plan[] = initialData?.plans ?? DEFAULT_PLANS;
  const features: PlanFeature[] = initialData?.features ?? undefined!;
  const faqItems: FaqEntry[] = initialData?.faqItems ?? undefined!;
  const trustItems: readonly string[] = initialData?.trustItems ?? DEFAULT_TRUST_ITEMS;
  const headline = initialData?.headline ?? "Invest Once.\nConvert Forever.";
  const subheadline =
    initialData?.subheadline ??
    "Start free — no credit card required. Upgrade when your audience is ready to grow faster.";

  function handlePlanCta(plan: Plan) {
    if (plan.id === "free") {
      user ? (window.location.href = "/dashboard") : openAuthModal("signup");
    } else {
      user ? (window.location.href = "/dashboard/upgrade") : openAuthModal("signup");
    }
  }

  return (
    <div className="bg-theme-bg text-theme-text transition-colors duration-300">
      {/* ── Hero ── */}
      <section className="pt-20 pb-4 px-4 sm:px-6 lg:px-8 text-center max-w-3xl mx-auto">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-theme-primary/10 text-theme-primary text-[11px] font-mono font-semibold uppercase tracking-widest mb-6 border border-theme-primary/20">
          <Sparkles className="w-3 h-3" />
          Simple, transparent pricing
        </span>
        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-serif font-bold uppercase tracking-tight leading-[0.95] mb-5 text-theme-text whitespace-pre-line">
          {headline}
        </h1>
        <p className="text-lg sm:text-xl font-sans text-theme-text-muted max-w-xl mx-auto leading-relaxed">
          {subheadline}
        </p>
        <div className="mt-8">
          <BillingToggle value={billing} onChange={setBilling} />
        </div>
      </section>

      {/* ── Plan cards ── */}
      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-5 items-start">
          {plans.map((plan) => (
            <PricingCard
              key={plan.id}
              plan={plan}
              billing={billing}
              onCtaClick={() => handlePlanCta(plan)}
            />
          ))}
        </div>
        <p className="text-center text-xs text-theme-text-muted font-mono mt-6">
          All plans include SSL, 99.9% uptime SLA, and instant page delivery via CDN.
        </p>
      </section>

      {/* ── Comparison table ── */}
      <PricingTable plans={plans} features={features} />

      {/* ── Trust strip ── */}
      <section className="py-10 px-4 border-y border-theme-border bg-theme-surface">
        <div className="max-w-4xl mx-auto flex flex-wrap justify-center gap-x-10 gap-y-4 text-xs font-mono text-theme-text-muted uppercase tracking-widest">
          {trustItems.map((item) => (
            <span key={item} className="flex items-center gap-1.5">
              <Check className="w-3.5 h-3.5 text-theme-primary" />
              {item}
            </span>
          ))}
        </div>
      </section>

      {/* ── FAQ ── */}
      <FaqSection items={faqItems} />

      {/* ── Bottom CTA ── */}
      <section className="py-24 sm:py-32 px-4 text-center relative overflow-hidden bg-theme-card border-t border-theme-border">
        <div className="absolute inset-0 bg-gradient-to-b from-theme-primary/10 via-transparent to-transparent pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-theme-primary/15 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-2xl mx-auto space-y-5">
          <h2 className="text-4xl sm:text-6xl font-serif font-bold uppercase tracking-tight leading-[0.95] text-theme-text">
            Your First Page.<br />Live in 3 Minutes.
          </h2>
          <p className="text-lg font-sans text-theme-text-muted">
            Join creators already converting viewers into subscribers.
          </p>
          <div className="pt-4 flex flex-col items-center gap-3">
            {user ? (
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-3 px-9 py-4 rounded-2xl bg-theme-primary hover:bg-theme-primary-hover text-theme-primary-fg font-sans font-bold text-lg shadow-2xl shadow-theme-primary/25 hover:-translate-y-0.5 transition-all duration-200"
              >
                Go to Dashboard
                <ArrowRight className="w-5 h-5" />
              </Link>
            ) : (
              <button
                onClick={() => openAuthModal("signup")}
                className="inline-flex items-center gap-3 px-9 py-4 rounded-2xl bg-theme-primary hover:bg-theme-primary-hover text-theme-primary-fg font-sans font-bold text-lg shadow-2xl shadow-theme-primary/25 hover:-translate-y-0.5 transition-all duration-200 cursor-pointer"
              >
                Start Free — No Card Needed
                <ArrowRight className="w-5 h-5" />
              </button>
            )}
            <p className="text-xs font-mono text-theme-text-muted">
              Free forever · Upgrade when you&apos;re ready
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
