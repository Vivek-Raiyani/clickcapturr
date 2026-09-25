"use server";

/**
 * page.actions.ts
 * ---------------
 * Server-side actions for page CRUD operations.
 *
 * Two overloads:
 *  - updatePageAction(pageId, PageBuilderState)  — full visual-builder save
 *  - updatePageAction(pageId, partial object)    — partial dashboard updates
 *                                                  (e.g. toggle isActive)
 */

import { fetchApi } from "@/lib/api";
import { mapStateToPayload } from "@/lib/api/pages";
import type { PageBuilderState } from "@/components/page-builder/types";
import type { Page } from "@/types";

interface ActionResult<T> {
  success: boolean;
  data?: T;
  error?: string;
}

type PagePatch = Partial<{
  title:       string;
  slug:        string;
  description: string;
  isActive:    boolean;
  themeJson:   unknown;
  contentJson: unknown;
}>;

/**
 * Save page changes.
 *
 * When a full ``PageBuilderState`` is passed the payload is converted via
 * ``mapStateToPayload`` before being sent.  When a plain patch object is
 * passed it is sent directly (used by the overview tab toggle / quick edits).
 */
export async function updatePageAction(
  pageId: string,
  stateOrPatch: PageBuilderState | PagePatch
): Promise<ActionResult<Page>> {
  try {
    let payload: unknown;

    // Detect PageBuilderState by the presence of the `theme` key
    if ("theme" in stateOrPatch && "content" in stateOrPatch && "formFields" in stateOrPatch) {
      payload = mapStateToPayload(stateOrPatch as PageBuilderState);
    } else {
      // Plain patch — map camelCase frontend keys to snake_case backend keys
      const patch = stateOrPatch as PagePatch;
      payload = {
        ...(patch.title       !== undefined && { name:         patch.title }),
        ...(patch.slug        !== undefined && { slug:         patch.slug }),
        ...(patch.description !== undefined && { description:  patch.description }),
        ...(patch.themeJson   !== undefined && { theme_json:   patch.themeJson }),
        ...(patch.contentJson !== undefined && { content_json: patch.contentJson }),
        // isActive isn't a backend field yet — skip gracefully
      };
    }

    const res = await fetchApi(`/pages/${pageId}`, {
      method: "PUT",
      body: JSON.stringify(payload),
    });
    return { success: true, data: res.data };
  } catch (err: unknown) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Save failed",
    };
  }
}
