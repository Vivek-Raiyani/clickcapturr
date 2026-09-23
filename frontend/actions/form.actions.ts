"use server";

/**
 * form.actions.ts
 * ---------------
 * Server-side actions for form submissions and lead management.
 *
 * submitFormAction  — post a form submission to the backend (public endpoint)
 * listSubmissionsAction — fetch all submissions for a page (authenticated)
 * exportLeadsCsvAction  — download a CSV blob of all leads (authenticated)
 */

import { FormSubmission } from "@/types";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

/** Shape returned from every action */
interface ActionResult<T> {
  success: boolean;
  data?: T;
  error?: string;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function getToken(): string | null {
  // In server actions we can't access localStorage, so we rely on the
  // cookie / header that Next.js forwards, or the caller passes it via
  // the data object. For now we read from the request cookie store.
  // If a token cookie is set it will be forwarded automatically.
  return null; // auth header injected via fetchApi on the client side instead
}

async function apiFetch(path: string, init?: RequestInit) {
  return fetch(`${API_URL}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers || {}),
    },
  });
}

// ---------------------------------------------------------------------------
// submitFormAction — PUBLIC (no auth required)
// ---------------------------------------------------------------------------

export interface LocationInfo {
  country?:      string;
  country_name?: string;
  state?:        string;
  city?:         string;
}

export interface SubmitFormPayload {
  fields:      Record<string, string>;
  location?:   LocationInfo | null;
  link_id?:    string | null;
  campaign_id?: string | null;
}

export async function submitFormAction(
  pageId: string,
  payload: SubmitFormPayload
): Promise<ActionResult<{ contact_id: string }>> {
  try {
    console.log("EXECUTING submitFormAction Server Action", { pageId, payload });
    const res = await apiFetch(`/contacts/submit/${pageId}`, {
      method: "POST",
      body: JSON.stringify(payload),
    });
    console.log("submitFormAction fetch status:", res.status);
    const json = await res.json();
    console.log("submitFormAction fetch json:", json);
    if (!res.ok) {
      return { success: false, error: json.detail || "Submission failed" };
    }
    return { success: true, data: json };
  } catch (err: unknown) {
    console.error("submitFormAction error:", err);
    return { success: false, error: err instanceof Error ? err.message : "Network error" };
  }
}

// ---------------------------------------------------------------------------
// listSubmissionsAction — authenticated
// ---------------------------------------------------------------------------

export async function listSubmissionsAction(
  pageId: string,
  token?: string
): Promise<ActionResult<FormSubmission[]>> {
  try {
    const res = await apiFetch(`/contacts/page/${pageId}`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
    const json = await res.json();
    if (!res.ok) {
      return { success: false, error: json.detail || "Failed to load submissions" };
    }
    // Map snake_case to camelCase for frontend consistency
    const submissions: FormSubmission[] = (json.data || []).map((s: FormSubmission & { data_json?: Record<string, string>, page_name?: string, campaign_name?: string }) => ({
      ...s,
      dataJson: s.data_json || s.dataJson || null,
      pageName: s.page_name || s.pageName || null,
      campaign_name: s.campaign_name || null,
    }));
    return { success: true, data: submissions };
  } catch (err: unknown) {
    return { success: false, error: err instanceof Error ? err.message : "Network error" };
  }
}

// ---------------------------------------------------------------------------
// listAllSubmissionsAction — authenticated
// ---------------------------------------------------------------------------

export async function listAllSubmissionsAction(
  token?: string
): Promise<ActionResult<FormSubmission[]>> {
  try {
    const res = await apiFetch(`/contacts`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
    const json = await res.json();
    if (!res.ok) {
      return { success: false, error: json.detail || "Failed to load submissions" };
    }
    // Map snake_case to camelCase for frontend consistency
    const submissions: FormSubmission[] = (json.data || []).map((s: any) => ({
      ...s,
      dataJson: s.data_json || s.dataJson || null,
      pageName: s.page_name || s.pageName || null,
      campaign_name: s.campaign_name || null,
      submittedAt: s.created_at,
    }));
    return { success: true, data: submissions };
  } catch (err: unknown) {
    return { success: false, error: err instanceof Error ? err.message : "Network error" };
  }
}

// ---------------------------------------------------------------------------
// exportLeadsCsvAction — authenticated, returns a Blob URL for download
// ---------------------------------------------------------------------------

export async function exportLeadsCsvAction(
  pageId: string,
  token?: string
): Promise<ActionResult<string>> {
  try {
    const res = await apiFetch(`/contacts/page/${pageId}/export`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
    if (!res.ok) {
      const json = await res.json().catch(() => ({}));
      return { success: false, error: (json as { detail?: string }).detail || "Export failed" };
    }
    // Return the CSV text — the caller creates a Blob + download link
    const csvText = await res.text();
    return { success: true, data: csvText };
  } catch (err: unknown) {
    return { success: false, error: err instanceof Error ? err.message : "Network error" };
  }
}
