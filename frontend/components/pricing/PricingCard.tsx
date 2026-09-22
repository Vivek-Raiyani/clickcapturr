"use client";

import { Check, Sparkles, ArrowRight, Zap, Crown } from "lucide-react";
import { FEATURES, type Plan, type BillingPeriod, type PlanId } from "./data";

/** Maps plan IDs to their icon elements — kept here so data.ts stays JSX-free. */
const PLAN_ICONS: Record<PlanId, React.ReactNode> = {
  free:     <Zap      className="w-5 h-5" />,
  pro:      <Sparkles className="w-5 h-5" />,
  business: <Crown    className="w-5 h-5" />,
};

interface PricingCardProps {
  plan: Plan;
  billing: BillingPeriod;
  onCtaClick: () => void;
}

/**
 * A single pricing tier card.
 *
 * Appearance is driven by `plan.ctaVariant`:
 * - `"primary"`  → filled with the brand primary colour (the highlighted / recommended plan)
 * - `"premium"`  → card with a subtle primary border
 * - `"outline"`  → neutral surface card
 */
export function PricingCard({ plan, billing, onCtaClick }: PricingCardProps) {
  const price = billing === "yearly" ? plan.yearlyPrice : plan.monthlyPrice;
  const isPrimary = plan.ctaVariant === "primary";
  const isPremium = plan.ctaVariant === "premium";

  return (
    <div
      className={[
        "relative flex flex-col rounded-2xl p-7 transition-all duration-300",
        isPrimary
          ? "bg-theme-primary text-theme-primary-fg shadow-2xl shadow-theme-primary/30 scale-[1.02] ring-2 ring-theme-primary"
          : isPremium
          ? "bg-theme-card border border-theme-primary/30 shadow-xl"
          : "bg-theme-surface border border-theme-border",
      ].join(" ")}
    >
      {/* ── Badge ── */}
      {plan.badge && (
        <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-theme-primary text-theme-primary-fg text-[11px] font-mono font-bold uppercase tracking-widest shadow-md border border-theme-primary-fg/20">
            <Sparkles className="w-3 h-3" />
            {plan.badge}
          </span>
        </div>
      )}

      {/* ── Plan header ── */}
      <div className="space-y-1 mb-6">
        <div
          className={[
            "inline-flex items-center justify-center w-10 h-10 rounded-xl mb-3",
            isPrimary ? "bg-theme-primary-fg/15" : "bg-theme-primary/10 text-theme-primary",
          ].join(" ")}
        >
          {PLAN_ICONS[plan.id]}
        </div>

        <h3
          className={[
            "text-xl font-serif font-bold uppercase tracking-tight",
            isPrimary ? "text-theme-primary-fg" : "text-theme-text",
          ].join(" ")}
        >
          {plan.name}
        </h3>

        <p
          className={[
            "text-xs font-sans leading-snug",
            isPrimary ? "text-theme-primary-fg/70" : "text-theme-text-muted",
          ].join(" ")}
        >
          {plan.tagline}
        </p>
      </div>

      {/* ── Price ── */}
      <div className="mb-6">
        <div className="flex items-end gap-1.5">
          <span
            className={[
              "text-5xl font-serif font-bold tracking-tight",
              isPrimary ? "text-theme-primary-fg" : "text-theme-text",
            ].join(" ")}
          >
            ${price}
          </span>
          <span
            className={[
              "text-sm font-sans mb-2",
              isPrimary ? "text-theme-primary-fg/70" : "text-theme-text-muted",
            ].join(" ")}
          >
            / mo
          </span>
        </div>

        {billing === "yearly" && price > 0 && (
          <p
            className={[
              "text-[11px] font-mono mt-0.5",
              isPrimary ? "text-theme-primary-fg/60" : "text-theme-text-muted",
            ].join(" ")}
          >
            Billed ${price * 12}/yr · Save{" "}
            {Math.round(100 - (price / (plan.monthlyPrice || 1)) * 100)}%
          </p>
        )}

        {price === 0 && (
          <p
            className={[
              "text-[11px] font-mono mt-0.5",
              isPrimary ? "text-theme-primary-fg/60" : "text-theme-text-muted",
            ].join(" ")}
          >
            Forever free · No credit card
          </p>
        )}
      </div>

      {/* ── CTA ── */}
      <button
        onClick={onCtaClick}
        className={[
          "w-full py-3 rounded-xl font-sans font-bold text-sm flex items-center justify-center gap-2 transition-all duration-200 cursor-pointer",
          isPrimary
            ? "bg-theme-primary-fg/15 hover:bg-theme-primary-fg/25 text-theme-primary-fg border border-theme-primary-fg/20"
            : isPremium
            ? "bg-theme-primary hover:bg-theme-primary-hover text-theme-primary-fg shadow-md shadow-theme-primary/20"
            : "border border-theme-border hover:border-theme-primary hover:text-theme-primary text-theme-text",
        ].join(" ")}
      >
        {plan.ctaLabel}
        <ArrowRight className="w-4 h-4" />
      </button>

      {/* ── Divider ── */}
      <div
        className={[
          "my-6 border-t",
          isPrimary ? "border-theme-primary-fg/20" : "border-theme-border",
        ].join(" ")}
      />

      {/* ── Feature list ── */}
      <ul className="space-y-3">
        {FEATURES.map((f) => {
          const val = f[plan.id];
          if (val === false) return null;
          return (
            <li key={f.label} className="flex items-center gap-2.5 text-sm font-sans">
              <Check
                className={[
                  "w-4 h-4 shrink-0",
                  isPrimary ? "text-theme-primary-fg" : "text-theme-primary",
                ].join(" ")}
              />
              <span className={isPrimary ? "text-theme-primary-fg/85" : "text-theme-text-muted"}>
                {typeof val === "string" && (
                  <span
                    className={[
                      "font-medium",
                      isPrimary ? "text-theme-primary-fg" : "text-theme-text",
                    ].join(" ")}
                  >
                    {val}{" "}
                  </span>
                )}
                {typeof val === "string" ? f.label.toLowerCase() : f.label}
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
