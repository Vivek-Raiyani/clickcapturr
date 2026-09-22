"use client";

import { Check, Minus } from "lucide-react";

interface FeatureCellProps {
  value: string | boolean;
}

/**
 * Renders a single cell in the pricing feature comparison table.
 * - `false`  → muted dash (feature not included)
 * - `true`   → primary-coloured check mark (included, unlabelled)
 * - `string` → the value as text (e.g. "25 pages")
 */
export function FeatureCell({ value }: FeatureCellProps) {
  if (value === false) {
    return <Minus className="w-4 h-4 text-theme-text-muted mx-auto opacity-40" />;
  }
  if (value === true) {
    return <Check className="w-4 h-4 text-theme-primary mx-auto" />;
  }
  return <span className="text-sm font-sans text-theme-text font-medium">{value}</span>;
}
