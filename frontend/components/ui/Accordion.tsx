"use client";

import { useState, useId, type ReactNode } from "react";

export interface AccordionItemProps {
  /** The clickable title/header text or custom node */
  title: ReactNode;
  /** The expandable body content */
  children: ReactNode;
  /** Initial open state when used in uncontrolled mode */
  defaultOpen?: boolean;
  /** Controlled open state */
  isOpen?: boolean;
  /** Controlled toggle handler */
  onToggle?: () => void;
  /** Optional custom id for aria attributes */
  id?: string;
  /** Container CSS classes */
  className?: string;
  /** Header button CSS classes */
  headerClassName?: string;
  /** Content panel CSS classes */
  contentClassName?: string;
}

/**
 * Collapsible Accordion Item.
 * Supports both controlled and uncontrolled usage with full accessibility.
 */
export function AccordionItem({
  title,
  children,
  defaultOpen = false,
  isOpen,
  onToggle,
  id,
  className = "",
  headerClassName = "",
  contentClassName = "",
}: AccordionItemProps) {
  const [internalOpen, setInternalOpen] = useState(defaultOpen);
  const autoId = useId();
  const elementId = id ?? autoId;

  const isControlled = isOpen !== undefined;
  const open = isControlled ? isOpen : internalOpen;

  const handleToggle = () => {
    if (isControlled) {
      onToggle?.();
    } else {
      setInternalOpen((prev) => !prev);
    }
  };

  return (
    <div
      className={[
        "border rounded-xl overflow-hidden transition-colors duration-200",
        open
          ? "border-theme-primary/40 bg-theme-card"
          : "border-theme-border bg-theme-surface",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <button
        id={`accordion-btn-${elementId}`}
        type="button"
        aria-expanded={open}
        aria-controls={`accordion-panel-${elementId}`}
        onClick={handleToggle}
        className={[
          "w-full flex items-center justify-between px-5 py-4 text-left gap-4 cursor-pointer",
          headerClassName,
        ]
          .filter(Boolean)
          .join(" ")}
      >
        <div className="text-sm font-sans font-semibold text-theme-text">{title}</div>

        {/* Animated +/x icon */}
        <span
          aria-hidden
          className={[
            "shrink-0 w-6 h-6 rounded-full border flex items-center justify-center",
            "transition-all duration-200 text-theme-text-muted",
            open ? "border-theme-primary rotate-45" : "border-theme-border",
          ].join(" ")}
        >
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden>
            <path
              d="M6 1v10M1 6h10"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
        </span>
      </button>

      {open && (
        <div
          id={`accordion-panel-${elementId}`}
          role="region"
          aria-labelledby={`accordion-btn-${elementId}`}
          className={[
            "px-5 pb-5 text-sm font-sans text-theme-text-muted leading-relaxed",
            contentClassName,
          ]
            .filter(Boolean)
            .join(" ")}
        >
          {children}
        </div>
      )}
    </div>
  );
}

export interface AccordionProps {
  children: ReactNode;
  className?: string;
}

/**
 * Container wrapper for a list of AccordionItems.
 */
export function Accordion({ children, className = "space-y-3" }: AccordionProps) {
  return <div className={className}>{children}</div>;
}
