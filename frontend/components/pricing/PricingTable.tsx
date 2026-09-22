"use client";

import { PLANS as DEFAULT_PLANS, FEATURES as DEFAULT_FEATURES, type Plan, type PlanFeature } from "./data";
import { FeatureCell } from "./FeatureCell";

export interface PricingTableProps {
  plans?: Plan[];
  features?: PlanFeature[];
}

/**
 * Full-width feature comparison table across plans.
 * Accepts optional dynamic `plans` and `features` passed from the database,
 * falling back to static constants when omitted.
 */
export function PricingTable({
  plans = DEFAULT_PLANS,
  features = DEFAULT_FEATURES,
}: PricingTableProps) {
  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
      <h2 className="text-3xl sm:text-4xl font-serif font-bold uppercase tracking-tight text-center mb-10 text-theme-text">
        Compare All Features
      </h2>

      <div className="rounded-2xl border border-theme-border overflow-hidden bg-theme-card">
        {/* Header row */}
        <div
          className="grid bg-theme-surface border-b border-theme-border"
          style={{ gridTemplateColumns: `minmax(140px, 1.4fr) repeat(${plans.length}, minmax(90px, 1fr))` }}
        >
          <div className="py-4 px-5 text-xs font-mono uppercase tracking-widest text-theme-text-muted">
            Feature
          </div>
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={[
                "py-4 px-4 text-center",
                plan.ctaVariant === "primary" ? "bg-theme-primary/5" : "",
              ].join(" ")}
            >
              <span
                className={[
                  "text-sm font-serif font-bold uppercase tracking-tight",
                  plan.ctaVariant === "primary" ? "text-theme-primary" : "text-theme-text",
                ].join(" ")}
              >
                {plan.name}
              </span>
            </div>
          ))}
        </div>

        {/* Feature rows */}
        {features.map((feature, i) => (
          <div
            key={feature.label}
            className={[
              "grid border-b last:border-b-0 border-theme-border-subtle",
              "hover:bg-theme-surface/50 transition-colors duration-150",
              i % 2 !== 0 ? "bg-theme-surface/30" : "",
            ].join(" ")}
            style={{ gridTemplateColumns: `minmax(140px, 1.4fr) repeat(${plans.length}, minmax(90px, 1fr))` }}
          >
            {/* Feature label */}
            <div className="py-3.5 px-5 text-sm font-sans text-theme-text-muted">
              {feature.label}
            </div>

            {/* Per-plan value cells */}
            {plans.map((plan) => (
              <div
                key={plan.id}
                className={[
                  "py-3.5 px-4 text-center flex items-center justify-center",
                  plan.ctaVariant === "primary" ? "bg-theme-primary/5" : "",
                ].join(" ")}
              >
                <FeatureCell value={feature[plan.id as keyof PlanFeature] ?? false} />
              </div>
            ))}
          </div>
        ))}
      </div>
    </section>
  );
}
