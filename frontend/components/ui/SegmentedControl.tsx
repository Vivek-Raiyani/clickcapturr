"use client";

import { type ReactNode } from "react";

export interface SegmentOption<T extends string> {
  value: T;
  label: ReactNode;
  /** Optional badge rendered alongside label (e.g. "Save 35%", "New", count) */
  badge?: ReactNode;
  disabled?: boolean;
}

export interface SegmentedControlProps<T extends string> {
  options: SegmentOption<T>[];
  value: T;
  onChange: (value: T) => void;
  size?: "sm" | "md";
  className?: string;
}

/**
 * Generic pill-style segmented control / switch.
 * Fully controlled — accepts any string union type for options.
 */
export function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
  size = "md",
  className = "",
}: SegmentedControlProps<T>) {
  const sizeStyles = {
    sm: "px-3 py-1.5 text-xs",
    md: "px-5 py-2 text-sm",
  };

  return (
    <div
      role="group"
      className={[
        "inline-flex items-center gap-1 p-1 rounded-full bg-muted border border-border",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {options.map((option) => {
        const isSelected = value === option.value;
        return (
          <button
            key={option.value}
            type="button"
            disabled={option.disabled}
            onClick={() => onChange(option.value)}
            className={[
              "rounded-full font-sans font-semibold transition-all duration-200 cursor-pointer flex items-center justify-center",
              sizeStyles[size],
              isSelected
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground",
              option.disabled ? "opacity-50 cursor-not-allowed" : "",
            ]
              .filter(Boolean)
              .join(" ")}
          >
            <span>{option.label}</span>
            {option.badge && (
              <span
                className={[
                  "ml-1.5 font-mono px-1.5 py-0.5 rounded-full",
                  size === "sm" ? "text-[9px]" : "text-[10px]",
                  isSelected
                    ? "bg-primary-foreground/20 text-primary-foreground"
                    : "bg-primary/15 text-primary",
                ].join(" ")}
              >
                {option.badge}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
