"use client";

import * as React from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Sparkles,
  Eye,
  ExternalLink,
  Loader2,
  Check,
  Save,
  Trash2,
} from "lucide-react";
import { SAMPLE_AI_PRESETS } from "./types";

export interface PageTopBarProps {
  title: string;
  slug?: string;
  onChangeTitle: (title: string) => void;
  backHref: string;
  showSuccessPreview?: boolean;
  onToggleSuccessPreview: () => void;
  onSelectAIPreset: (presetKey: string) => void;
  onSave?: () => void;
  onDeletePage?: () => void;
  saving?: boolean;
  savedSuccess?: boolean;
  mode?: "production" | "demo";
  onOpenExportModal?: () => void;
}

/**
 * Top bar navigation for PageBuilder.
 * Houses page title editing, live slug preview, AI presets, view toggles, and save actions.
 */
export function PageTopBar({
  title,
  slug,
  onChangeTitle,
  backHref,
  showSuccessPreview = false,
  onToggleSuccessPreview,
  onSelectAIPreset,
  onSave,
  onDeletePage,
  saving = false,
  savedSuccess = false,
  mode = "production",
  onOpenExportModal,
}: PageTopBarProps) {
  return (
    <header className="h-14 border-b border-theme-border bg-theme-surface flex items-center justify-between px-4 z-30 shrink-0 select-none">
      {/* Left: Back Link & Page Title */}
      <div className="flex items-center gap-3 min-w-0">
        <Link
          href={backHref}
          className="p-1.5 rounded-lg text-theme-text-muted hover:text-theme-text hover:bg-theme-surface-hover transition-colors"
          title="Back"
        >
          <ArrowLeft className="w-4 h-4" />
        </Link>

        <div className="h-4 w-px bg-theme-border" />

        <div className="flex items-center gap-2 min-w-0">
          <input
            type="text"
            value={title}
            onChange={(e) => onChangeTitle(e.target.value)}
            placeholder="Page Title"
            className="bg-transparent font-medium text-xs sm:text-sm text-theme-text focus:outline-none focus:bg-theme-card px-2 py-1 rounded transition-colors border border-transparent focus:border-theme-border max-w-[180px] sm:max-w-[260px] truncate"
          />
          {slug && (
            <span className="hidden lg:inline-block text-[11px] font-mono text-theme-text-muted">
              (/p/{slug})
            </span>
          )}
        </div>

        <div className="hidden sm:flex items-center gap-1.5 text-[11px] text-theme-text-muted bg-theme-card border border-theme-border px-2.5 py-0.5 rounded-full shrink-0">
          <span
            className={`w-2 h-2 rounded-full ${
              savedSuccess ? "bg-emerald-400" : "bg-theme-primary"
            }`}
          />
          <span className="font-mono">
            {savedSuccess ? "Saved" : mode === "demo" ? "Sandbox" : "Draft"}
          </span>
        </div>
      </div>

      {/* Center: AI Presets */}
      <div className="hidden md:flex items-center gap-1.5 bg-theme-card/90 border border-theme-border px-2.5 py-1 rounded-xl shadow-xs">
        <span className="text-[11px] text-theme-text-muted font-medium mr-1 flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-theme-primary" /> AI Presets:
        </span>
        {Object.keys(SAMPLE_AI_PRESETS).map((key) => (
          <button
            key={key}
            type="button"
            onClick={() => onSelectAIPreset(key)}
            className="px-2 py-0.5 text-[11px] rounded-lg bg-theme-surface hover:bg-theme-surface-hover text-theme-text-muted hover:text-theme-text border border-theme-border-subtle transition-colors cursor-pointer capitalize font-sans"
          >
            {key.split("-")[1] || key}
          </button>
        ))}
      </div>

      {/* Right: View Toggle, Link & Save */}
      <div className="flex items-center gap-2 sm:gap-2.5">
        <button
          type="button"
          onClick={onToggleSuccessPreview}
          className={`px-3 py-1.5 rounded-xl text-xs font-medium border flex items-center gap-1.5 transition-all cursor-pointer ${
            showSuccessPreview
              ? "bg-theme-primary/15 border-theme-primary text-theme-primary shadow-xs"
              : "bg-theme-card border-theme-border text-theme-text-muted hover:text-theme-text hover:bg-theme-surface-hover"
          }`}
        >
          <Eye className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">
            {showSuccessPreview ? "Success View" : "Lead View"}
          </span>
        </button>

        {slug && (
          <Link
            href={`/p/${slug}`}
            target="_blank"
            className="hidden sm:flex items-center gap-1 text-xs text-theme-text-muted hover:text-theme-text px-2 py-1.5 rounded-lg hover:bg-theme-surface-hover transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
        )}

        {mode === "demo" ? (
          <button
            type="button"
            onClick={onOpenExportModal}
            className="px-4 py-1.5 rounded-xl bg-theme-primary hover:bg-theme-primary-hover text-theme-primary-fg font-semibold text-xs transition-all shadow-md shadow-theme-primary/20 cursor-pointer"
          >
            Export Page
          </button>
        ) : (
          <button
            type="button"
            onClick={onSave}
            disabled={saving}
            className="px-4 py-1.5 rounded-xl bg-theme-primary hover:bg-theme-primary-hover text-theme-primary-fg font-semibold text-xs transition-all flex items-center gap-1.5 shadow-md shadow-theme-primary/20 disabled:opacity-50 cursor-pointer"
          >
            {saving ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Saving...</span>
              </>
            ) : savedSuccess ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>Saved</span>
              </>
            ) : (
              <>
                <Save className="w-3.5 h-3.5" />
                <span>Save Page</span>
              </>
            )}
          </button>
        )}

        {onDeletePage && (
          <button
            type="button"
            onClick={onDeletePage}
            className="p-2 rounded-xl text-theme-text-muted hover:text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer"
            title="Delete Page"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        )}
      </div>
    </header>
  );
}
