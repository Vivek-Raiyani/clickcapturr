"use client";

import * as React from "react";
import { useState } from "react";
import { Sparkles, X, Copy, Check } from "lucide-react";
import {
  DEFAULT_PAGE_BUILDER_STATE,
  SAMPLE_AI_PRESETS,
  type PageBuilderState,
  type BuilderTab,
  type BuilderSection,
  type DeviceMode,
} from "./types";
import { PageTopBar } from "./PageTopBar";
import { PageNavPanel } from "./PageNavPanel";
import { PagePreview } from "./PagePreview";
import { PageInspectorPanel } from "./PageInspectorPanel";

export interface PageBuilderProps {
  /** Mode: 'production' for saved database pages, or 'demo' for interactive sandbox */
  mode?: "production" | "demo";
  /** Initial page builder state */
  initialState?: PageBuilderState;
  /** Back navigation URL */
  backHref?: string;
  /** Save callback for production mode */
  onSave?: (state: PageBuilderState) => Promise<void> | void;
  /** Optional callback to delete the page */
  onDeletePage?: () => void;
  /** Saving state indicator */
  saving?: boolean;
  /** Saved successfully indicator */
  savedSuccess?: boolean;
}

/**
 * PageBuilder is the unified visual landing page builder component.
 * Allows creators to configure themes, content, form fields, and view live previews.
 */
export function PageBuilder({
  mode = "production",
  initialState = DEFAULT_PAGE_BUILDER_STATE,
  backHref = "/dashboard/pages",
  onSave,
  onDeletePage,
  saving = false,
  savedSuccess = false,
}: PageBuilderProps) {
  const [state, setState] = useState<PageBuilderState>(initialState);
  const [deviceMode, setDeviceMode] = useState<DeviceMode>("desktop");
  const [activeTab, setActiveTab] = useState<BuilderTab>("content");
  const [activeSection, setActiveSection] = useState<BuilderSection>("headline");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Demo export modal state
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);

  // Sync if initialState changes from outside
  const [prevInitialState, setPrevInitialState] = useState(initialState);
  if (initialState !== prevInitialState) {
    setPrevInitialState(initialState);
    setState(initialState);
  }

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  return (
    <div className="flex flex-col h-screen bg-background text-foreground font-sans select-none overflow-hidden">
      {/* 1. TOP APP BAR */}
      <PageTopBar
        title={state.title}
        slug={state.slug}
        onChangeTitle={(title) => setState((prev) => ({ ...prev, title }))}
        backHref={backHref}
        showSuccessPreview={state.showSuccessPreview}
        onToggleSuccessPreview={() =>
          setState((prev) => ({
            ...prev,
            showSuccessPreview: !prev.showSuccessPreview,
          }))
        }
        onSave={() => onSave?.(state)}
        saving={saving}
        savedSuccess={savedSuccess}
        mode={mode}
        onOpenExportModal={() => setIsExportModalOpen(true)}
      />

      {/* 2. THREE-PANEL BODY */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left: Navigation Categories */}
        <PageNavPanel
          activeTab={activeTab}
          onTabChange={setActiveTab}
          activeSection={activeSection}
          onSectionChange={setActiveSection}
          state={state}
        />

        {/* Center: Live Mockup Canvas & AI Prompt */}
        <PagePreview
          state={state}
          onUpdateState={setState}
          deviceMode={deviceMode}
          onDeviceModeChange={setDeviceMode}
        />

        {/* Right: Contextual Inspector */}
        <PageInspectorPanel
          activeSection={activeSection}
          state={state}
          onUpdateTheme={(updater) =>
            setState((prev) => ({ ...prev, theme: updater(prev.theme) }))
          }
          onUpdateContent={(updater) =>
            setState((prev) => ({ ...prev, content: updater(prev.content) }))
          }
          onUpdateFormFields={(formFields) =>
            setState((prev) => ({ ...prev, formFields }))
          }
        />
      </div>

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-primary text-primary-foreground font-semibold text-xs px-4 py-2.5 rounded-xl shadow-xl shadow-primary/20 flex items-center gap-2 animate-bounce">
          <Sparkles className="w-4 h-4" />
          {toastMessage}
        </div>
      )}

      {/* Export / Template Modal (Demo Mode) */}
      {isExportModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs">
          <div className="relative w-full max-w-lg rounded-2xl bg-card border border-border p-6 shadow-2xl">
            <button
              type="button"
              onClick={() => setIsExportModalOpen(false)}
              className="absolute top-4 right-4 text-muted-foreground hover:text-foreground cursor-pointer transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
            <h3 className="font-serif text-lg font-bold text-foreground mb-2">
              Ready to Publish Your Page?
            </h3>
            <p className="text-xs text-muted-foreground mb-4">
              Sign in or connect this configuration directly to your VueMagnet workspace to generate instant QR codes and track email conversions.
            </p>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard.writeText(JSON.stringify(state, null, 2));
                  setCopiedCode(true);
                  setTimeout(() => setCopiedCode(false), 2000);
                }}
                className="px-3 py-1.5 rounded-xl bg-muted hover:bg-muted/80 border border-border text-xs text-foreground font-medium flex items-center gap-1.5 cursor-pointer transition-colors"
              >
                {copiedCode ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedCode ? "Copied JSON" : "Copy Config"}</span>
              </button>
              <a
                href="/dashboard/pages"
                className="px-4 py-1.5 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-colors shadow-sm"
              >
                Go to Pages
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
