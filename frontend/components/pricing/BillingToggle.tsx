"use client";

import { useMemo } from "react";
import { SegmentedControl, type SegmentOption } from "@/components/ui/SegmentedControl";
import { BILLING_PERIODS, type BillingPeriod } from "./data";

export interface BillingToggleProps {
  value: BillingPeriod;
  onChange: (period: BillingPeriod) => void;
  /** Badge label shown next to the yearly option. Defaults to "Save 35%". */
  savingsBadge?: string;
  className?: string;
}

/**
 * Monthly / Yearly pill toggle.
 * Specialization of the generic `SegmentedControl` UI primitive for billing periods.
 * Fully controlled — pass `value` and `onChange`.
 *
 * @example
 * const [billing, setBilling] = useState<BillingPeriod>("yearly");
 * <BillingToggle value={billing} onChange={setBilling} />
 */
export function BillingToggle({
  value,
  onChange,
  savingsBadge = "Save 35%",
  className = "",
}: BillingToggleProps) {
  const options = useMemo<SegmentOption<BillingPeriod>[]>(
    () =>
      BILLING_PERIODS.map((period) => ({
        value: period,
        label: period === "monthly" ? "Monthly" : "Yearly",
        badge: period === "yearly" ? savingsBadge : undefined,
      })),
    [savingsBadge]
  );

  return (
    <SegmentedControl<BillingPeriod>
      options={options}
      value={value}
      onChange={onChange}
      className={className}
    />
  );
}
