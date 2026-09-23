"use server";

/**
 * analytics.actions.ts
 * --------------------
 * Server-side actions for analytics data.
 *
 * getAnalyticsSummaryAction — derives an AnalyticsSummary from contact_links
 *   and page stats. This is a lightweight aggregation on the client; a
 *   dedicated /analytics endpoint can replace it later.
 */

import { fetchApi } from "@/lib/api";
import type { AnalyticsSummary, FormSubmission } from "@/types";

interface ActionResult<T> {
  success: boolean;
  data?: T;
  error?: string;
}

interface GetSummaryArgs {
  pageId: string;
}

/**
 * Fetches the page's total_visits + total_lead_captures from the backend
 * and derives a basic AnalyticsSummary. Country/device breakdown is built
 * from the contact_links submissions list.
 */
export async function getAnalyticsSummaryAction(
  args: GetSummaryArgs
): Promise<ActionResult<AnalyticsSummary>> {
  try {
    // Fetch page stats
    const pageRes = await fetchApi(`/pages/${args.pageId}`);
    const page = pageRes.data;

    // Fetch submissions to compute country breakdown
    const subRes = await fetchApi(`/contacts/page/${args.pageId}`);
    const submissions: FormSubmission[] = subRes.data || [];

    // Aggregate country counts from contact_links
    const byCountry: Record<string, number> = {};
    for (const sub of submissions) {
      if (sub.country) {
        byCountry[sub.country] = (byCountry[sub.country] || 0) + 1;
      }
    }

    const summary: AnalyticsSummary = {
      totalViews:  page?.total_visits         || 0,
      totalClicks: page?.total_lead_captures  || 0,  // proxy until click tracking is separate
      totalScans:  0,   // populated by link analytics later
      totalLeads:  submissions.length,
      byCountry,
      byDevice: {
        desktop: 0,
        mobile:  0,
        tablet:  0,
        unknown: 0,
      },
    };

    return { success: true, data: summary };
  } catch (err: unknown) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Analytics fetch failed",
    };
  }
}
