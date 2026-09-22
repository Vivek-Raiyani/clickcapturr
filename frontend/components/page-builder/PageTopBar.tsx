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
  onSave,
  saving = false,
  savedSuccess = false,
  mode = "production",
  onOpenExportModal,
}: PageTopBarProps) {
  return (
    <header className="h-14 border-b border-border bg-muted flex items-center justify-between px-4 z-30 shrink-0 select-none">
      {/* Left: Back Link & Page Title */}
      <div className="flex items-center gap-3 min-w-0">
        <Link
          href={backHref}
          className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/80 transition-colors"
          title="Back"
        >
          <ArrowLeft className="w-4 h-4" />
        </Link>

        <div className="h-4 w-px bg-border" />

        <div className="flex items-center gap-2 min-w-0">
          <input
            type="text"
            value={title}
            onChange={(e) => onChangeTitle(e.target.value)}
            placeholder="Page Title"
            className="bg-transparent font-medium text-xs sm:text-sm text-foreground focus:outline-none focus:bg-card px-2 py-1 rounded transition-colors border border-transparent focus:border-border max-w-[180px] sm:max-w-[260px] truncate"
          />
          {slug && (
            <span className="hidden lg:inline-block text-[11px] font-mono text-muted-foreground">
              (/public/{slug})
            </span>
          )}
        </div>

        <div className="hidden sm:flex items-center gap-1.5 text-[11px] text-muted-foreground bg-card border border-border px-2.5 py-0.5 rounded-full shrink-0">
          <span
            className={`w-2 h-2 rounded-full ${
              savedSuccess ? "bg-emerald-400" : "bg-primary"
            }`}
          />
          <span className="font-mono">
            {savedSuccess ? "Saved" : mode === "demo" ? "Sandbox" : "Draft"}
          </span>
        </div>
      </div>

      {/* Right: View Toggle, Link & Save */}
      <div className="flex items-center gap-2 sm:gap-2.5">
        <button
          type="button"
          onClick={onToggleSuccessPreview}
          className={`px-3 py-1.5 rounded-xl text-xs font-medium border flex items-center gap-1.5 transition-all cursor-pointer ${
            showSuccessPreview
              ? "bg-primary/15 border-primary text-primary shadow-xs"
              : "bg-card border-border text-muted-foreground hover:text-foreground hover:bg-muted/80"
          }`}
        >
          <Eye className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">
            {showSuccessPreview ? "Success View" : "Lead View"}
          </span>
        </button>

        {slug && (
          <Link
            href={`/public/${slug}`}
            target="_blank"
            className="hidden sm:flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground px-2 py-1.5 rounded-lg hover:bg-muted/80 transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
        )}

        <button
          type="button"
          onClick={onSave}
          disabled={saving}
          className="px-4 py-1.5 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-xs transition-all flex items-center gap-1.5 shadow-md shadow-primary/20 disabled:opacity-50 cursor-pointer"
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
      </div>
    </header>
  );
}
