import { Accordion, AccordionItem } from "@/components/ui/Accordion";
import { FAQ_ITEMS, type FaqEntry } from "./data";

export interface FaqSectionProps {
  /**
   * Custom list of FAQ entries.
   * Defaults to the pricing FAQ from `data.ts` when omitted.
   */
  items?: FaqEntry[];
  heading?: string;
  className?: string;
}

/**
 * A titled FAQ section that renders a list of `AccordionItem` components.
 *
 * Can be used with the default pricing FAQ or fed a custom `items` array
 * for other parts of the app (help center, support page, etc.).
 *
 * @example
 * // Default pricing FAQ
 * <FaqSection />
 *
 * // Custom FAQ on a different page
 * <FaqSection
 *   heading="Billing Questions"
 *   items={[{ q: "Do you offer refunds?", a: "Yes — within 7 days." }]}
 * />
 */
export function FaqSection({
  items = FAQ_ITEMS,
  heading = "Questions & Answers",
  className = "",
}: FaqSectionProps) {
  return (
    <section
      className={[
        "py-20 px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <h2 className="text-3xl sm:text-4xl font-serif font-bold uppercase tracking-tight text-center mb-10 text-theme-text">
        {heading}
      </h2>

      <Accordion className="space-y-3">
        {items.map((item, i) => (
          <AccordionItem key={i} title={item.q} id={`faq-${i}`}>
            {item.a}
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  );
}
