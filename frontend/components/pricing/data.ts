/**
 * Shared data and types for pricing components.
 * Import from here so all sub-components stay in sync with a single source of truth.
 *
 * NOTE: Icons are NOT stored here (JSX can't live in a .ts file).
 * `PricingCard` maps `plan.id` to the correct icon internally.
 */

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export const BILLING_PERIODS = ["monthly", "yearly"] as const;
export type BillingPeriod = (typeof BILLING_PERIODS)[number];

export type PlanId = "free" | "pro" | "business";
export type CtaVariant = "outline" | "primary" | "premium";

export interface Plan {
  id: PlanId;
  name: string;
  tagline: string;
  monthlyPrice: number;
  yearlyPrice: number;
  badge?: string;
  ctaLabel: string;
  ctaVariant: CtaVariant;
}

export interface PlanFeature {
  label: string;
  free: string | boolean;
  pro: string | boolean;
  business: string | boolean;
}

export interface FaqEntry {
  q: string;
  a: string;
}

// ---------------------------------------------------------------------------
// Plans
// ---------------------------------------------------------------------------

export const PLANS: Plan[] = [
  {
    id: "free",
    name: "Free",
    tagline: "Start building your audience.",
    monthlyPrice: 0,
    yearlyPrice: 0,
    ctaLabel: "Start for Free",
    ctaVariant: "outline",
  },
  {
    id: "pro",
    name: "Pro",
    tagline: "For creators serious about growth.",
    monthlyPrice: 29,
    yearlyPrice: 19,
    badge: "Most Popular",
    ctaLabel: "Start Pro Trial",
    ctaVariant: "primary",
  },
  {
    id: "business",
    name: "Business",
    tagline: "Scale with data, teams & custom brand.",
    monthlyPrice: 79,
    yearlyPrice: 59,
    ctaLabel: "Start Business Trial",
    ctaVariant: "premium",
  },
];

// ---------------------------------------------------------------------------
// Features
// ---------------------------------------------------------------------------

export const FEATURES: PlanFeature[] = [
  { label: "Landing pages",                    free: "3",      pro: "25",      business: "Unlimited" },
  { label: "Short links / QR codes",           free: "10",     pro: "200",     business: "Unlimited" },
  { label: "Analytics retention",              free: "7 days", pro: "90 days", business: "1 year"    },
  { label: "Custom domain",                    free: false,    pro: true,      business: true        },
  { label: "Remove VueMagnet branding",        free: false,    pro: true,      business: true        },
  { label: "QR code styling",                  free: false,    pro: true,      business: true        },
  { label: "Success effects (confetti, etc.)", free: false,    pro: true,      business: true        },
  { label: "Data export (CSV)",                free: false,    pro: false,     business: true        },
  { label: "YouTube video stats",              free: false,    pro: true,      business: true        },
  { label: "Campaign analytics",               free: false,    pro: false,     business: true        },
  { label: "Webhook integrations",             free: false,    pro: false,     business: true        },
  { label: "Priority support",                 free: false,    pro: false,     business: true        },
];

// ---------------------------------------------------------------------------
// FAQ
// ---------------------------------------------------------------------------

export const FAQ_ITEMS: FaqEntry[] = [
  {
    q: "Can I switch plans at any time?",
    a: "Yes — you can upgrade, downgrade, or cancel at any time. Upgrades take effect immediately. Downgrades apply at the end of your current billing cycle.",
  },
  {
    q: "What happens to my pages if I downgrade?",
    a: "Your pages stay live. If you exceed the free tier limit (3 pages), older pages are hidden (not deleted) until you upgrade again or archive extras.",
  },
  {
    q: "Is there a free trial on paid plans?",
    a: "Yes — Pro and Business plans include a 14-day free trial. No credit card required to start.",
  },
  {
    q: "Do you offer refunds?",
    a: "We offer a full refund within 7 days of your first paid charge, no questions asked.",
  },
  {
    q: "What counts as a 'short link / QR code'?",
    a: "Each unique destination URL you create — whether you add a QR style to it or not — counts as one link toward your plan limit.",
  },
  {
    q: "Can I use my own domain on the Pro plan?",
    a: "Yes. Pro and Business plans support a single custom domain. Business supports multiple domains for team use.",
  },
];

// ---------------------------------------------------------------------------
// Trust strip
// ---------------------------------------------------------------------------

export const TRUST_ITEMS = [
  "14-day free trial",
  "No credit card required",
  "Cancel anytime",
  "99.9% uptime SLA",
  "SOC 2 compliant",
] as const;
