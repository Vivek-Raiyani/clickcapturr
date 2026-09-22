"use client";

import { AccordionItem } from "@/components/ui/Accordion";
import type { FaqEntry } from "./data";

export interface FaqAccordionProps extends FaqEntry {
  /** Unique index or identifier for aria attributes */
  index?: number;
  className?: string;
}

/**
 * FAQ item adapter that wraps the generic `AccordionItem` UI primitive.
 *
 * @example
 * <FaqAccordion q="Can I cancel?" a="Yes, anytime." index={0} />
 */
export function FaqAccordion({ q, a, index, className }: FaqAccordionProps) {
  return (
    <AccordionItem
      id={index !== undefined ? `faq-${index}` : undefined}
      title={q}
      className={className}
    >
      {a}
    </AccordionItem>
  );
}
