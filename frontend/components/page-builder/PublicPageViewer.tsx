"use client";

import React, { useState, useEffect, useRef } from "react";
import type { Page, FormField } from "@/types";
import { PagePreview } from "./PagePreview";
import { submitFormAction, type LocationInfo, type SubmitFormPayload } from "@/actions/form.actions";
import { DEFAULT_PAGE_BUILDER_STATE, type PageBuilderState, type DeviceMode } from "./types";
import { mapPayloadToState, type PageResponse } from "@/lib/api/pages";

export interface PublicPageViewerProps {
  page: Page;
  formFields?: FormField[];
}

/**
 * Resolves approximate location (country, state, city) from the visitor's
 * IP address using the free ipapi.co service.  Called once on mount, result
 * cached in a ref so it doesn't trigger re-renders.
 */
async function resolveLocation(): Promise<LocationInfo | null> {
  try {
    console.log("Resolving location via get.geojs.io...");
    const res = await fetch("https://get.geojs.io/v1/ip/geo.json", { signal: AbortSignal.timeout(4000) });
    if (!res.ok) {
      console.error("Location fetch failed with status:", res.status);
      return null;
    }
    const json = await res.json();
    console.log("Location resolved:", json);
    return {
      country:      json.country_code  || null,
      country_name: json.country       || null,
      state:        json.region        || null,
      city:         json.city          || null,
    };
  } catch (err) {
    console.error("Error during location resolution:", err);
    return null;
  }
}

/**
 * PublicPageViewer — renders the public view of a creator landing page
 * in full-screen responsive mode.
 */
export function PublicPageViewer({ page, formFields = [] }: PublicPageViewerProps) {
  let finalFormFields = page.contentJson?.formFields || formFields;
  if (!finalFormFields || finalFormFields.length === 0) {
    finalFormFields = [...DEFAULT_PAGE_BUILDER_STATE.formFields];
  }

  const [deviceMode, setDeviceMode] = useState<DeviceMode>("desktop");
  // Location resolved in background on mount — stored in a ref to avoid
  // triggering re-renders while keeping it available for form submit.
  const locationRef = useRef<LocationInfo | null>(null);

  React.useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width < 640) setDeviceMode("mobile");
      else if (width < 1024) setDeviceMode("tablet");
      else setDeviceMode("desktop");
    };
    handleResize(); // Initial check
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Kick off geo-lookup in the background as soon as the page loads
  useEffect(() => {
    resolveLocation().then((loc) => {
      locationRef.current = loc;
    });
  }, []);

  const [state, setState] = useState<PageBuilderState>(() => {
    if (page.content_json) {
      const mapped = mapPayloadToState(page as unknown as PageResponse, DEFAULT_PAGE_BUILDER_STATE);
      return { ...mapped, formFields: finalFormFields };
    }
    return {
      ...DEFAULT_PAGE_BUILDER_STATE,
      title: page.title || page.name,
      slug: page.slug,
      formFields: finalFormFields,
      ...(page.themeJson ? { theme: page.themeJson as any } : {}),
      ...(page.contentJson ? { content: page.contentJson as any } : {}),
    };
  });

  const handleSubmit = async (data: Record<string, unknown>) => {
    try {
      console.log("Submitting form data:", data);
      
      const searchParams = new URLSearchParams(window.location.search);
      let linkId = searchParams.get("link_id") || searchParams.get("link");
      const campaignId = searchParams.get("campaign_id") || searchParams.get("campaign");
      let method = "direct";

      // Fallback: check cookie for link_id if not in URL
      if (!linkId && typeof document !== "undefined") {
        const match = document.cookie.match(/(?:^|; )cc_source_link=([^;]*)/);
        if (match) {
          linkId = match[1];
        }
      }

      if (typeof document !== "undefined") {
        const methodMatch = document.cookie.match(/(?:^|; )cc_source_method=([^;]*)/);
        if (methodMatch) {
          method = methodMatch[1];
        } else if (linkId) {
          method = "click"; // default to click if link_id exists but method doesn't
        }
      }

      const submitData = { ...data, _method: method };

      const payload: SubmitFormPayload = {
        fields:   submitData as Record<string, string>,
        location: locationRef.current,
        link_id:  linkId,
        campaign_id: campaignId,
      };
      console.log("Calling submitFormAction with:", page.id, payload);
      const res = await submitFormAction(page.id, payload);
      console.log("Response from submitFormAction:", res);
      if (!res.success) {
        alert("Form submission failed: " + res.error);
      }
      return res.success;
    } catch (err: any) {
      console.error("handleSubmit caught error:", err);
      alert("Error submitting form: " + err.message);
      return false;
    }
  };

  return (
    <div className="min-h-screen w-full bg-background text-foreground">
      <PagePreview
        state={state}
        onUpdateState={setState}
        deviceMode={deviceMode}
        onDeviceModeChange={() => {}}
        isPublicView={true}
        onSubmitForm={handleSubmit}
      />
    </div>
  );
}
