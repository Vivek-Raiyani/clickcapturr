"use client";

import React, { useState } from "react";
import type { Page, FormField } from "@/types";
import { PagePreview } from "./PagePreview";
import { submitFormAction } from "@/actions/form.actions";
import { DEFAULT_PAGE_BUILDER_STATE, type PageBuilderState, type DeviceMode } from "./types";

export interface PublicPageViewerProps {
  page: Page;
  formFields?: FormField[];
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

  const [state, setState] = useState<PageBuilderState>({
    ...DEFAULT_PAGE_BUILDER_STATE,
    title: page.title,
    slug: page.slug,
    formFields: finalFormFields,
    ...(page.themeJson ? { theme: page.themeJson } : {}),
    ...(page.contentJson ? { content: page.contentJson } : {}),
  });

  const handleSubmit = async (data: Record<string, unknown>) => {
    try {
      const res = await submitFormAction(page.id, data);
      return res.success;
    } catch (err) {
      console.error(err);
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
