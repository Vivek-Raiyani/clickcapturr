/**
 * StatCard — metric summary card used across overview and analytics dashboards.
 * Displays title, numeric value, optional Lucide icon, trend delta indicator,
 * and optional compact mode.
 */
import React from "react";
import { TrendingUp, TrendingDown } from "lucide-react";

export interface StatCardProps {
  label: string;
  value: string | number;
  icon?: React.ReactNode;
  delta?: { value: number; label: string };
  className?: string;
  compact?: boolean;
}

export function StatCard({
  label,
  value,
  icon,
  delta,
  className = "",
  compact = false,
}: StatCardProps) {
  const isPositive = delta ? delta.value >= 0 : null;

  return (
    <div
      className={`bg-theme-card border border-theme-border rounded-xl flex flex-col justify-between shadow-xs transition-colors hover:border-theme-border/80 ${
        compact ? "p-3.5" : "p-5"
      } ${className}`}
    >
      <div className="flex items-center justify-between gap-2">
        <span
          className={`font-medium text-theme-text-muted tracking-wider uppercase truncate ${
            compact ? "text-[10px]" : "text-xs"
          }`}
        >
          {label}
        </span>
        {icon && (
          <div
            className={`rounded-lg bg-theme-surface flex items-center justify-center text-theme-primary border border-theme-border shrink-0 ${
              compact ? "w-6 h-6 [&>svg]:w-3.5 [&>svg]:h-3.5" : "w-8 h-8"
            }`}
          >
            {icon}
          </div>
        )}
      </div>

      <div
        className={`flex items-baseline justify-between gap-2 ${
          compact ? "mt-2" : "mt-4"
        }`}
      >
        <span
          className={`font-bold tracking-tight text-theme-text ${
            compact ? "text-xl leading-none" : "text-2xl"
          }`}
        >
          {value}
        </span>

        {delta && (
          <div
            className={`inline-flex items-center gap-1 font-medium rounded-full shrink-0 ${
              compact ? "text-[10px] px-1.5 py-0.2" : "text-xs px-2 py-0.5"
            } ${
              isPositive
                ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                : "bg-red-500/10 text-red-400 border border-red-500/20"
            }`}
          >
            {isPositive ? (
              <TrendingUp className={compact ? "w-2.5 h-2.5" : "w-3 h-3"} />
            ) : (
              <TrendingDown className={compact ? "w-2.5 h-2.5" : "w-3 h-3"} />
            )}
            <span>
              {isPositive ? "+" : ""}
              {delta.value}% {delta.label}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
