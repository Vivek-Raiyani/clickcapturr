"use client";

import * as React from "react";
import { Check, LayoutTemplate, Shield, Palette, Type, Image as ImageIcon } from "lucide-react";
import type { PageTheme, TemplateStyle } from "@/types/page";
import {
  COLOR_THEMES,
  TEMPLATE_STYLES,
  FONT_OPTIONS,
  type BuilderSection,
} from "./types";

export interface PageThemeEditorProps {
  theme: PageTheme;
  onChange: (updater: (prev: PageTheme) => PageTheme) => void;
  activeSection?: BuilderSection;
}

/**
 * PageThemeEditor manages template layout, branding, luxury color schemes,
 * typography hierarchy, and backdrop media.
 *
 * Fully styled with the application's unified theme design tokens
 * (`muted`, `card`, `border`, `foreground`, `primary`).
 */
export function PageThemeEditor({
  theme,
  onChange,
  activeSection = "template",
}: PageThemeEditorProps) {
  // Dynamic templates state (initialized with TEMPLATE_STYLES for instant zero-flicker render)
  const [templateList, setTemplateList] = React.useState(TEMPLATE_STYLES);

  React.useEffect(() => {
    let isMounted = true;
    fetch("/api/builder/templates")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (isMounted && data?.templates && Array.isArray(data.templates) && data.templates.length > 0) {
          setTemplateList(data.templates);
        }
      })
      .catch((err) => {
        // Silent fallback to TEMPLATE_STYLES
        console.debug("Using fallback static templates:", err);
      });
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="space-y-6">
      {/* 1. TEMPLATE STYLES */}
      {activeSection === "template" && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider text-muted-foreground font-semibold">
              <LayoutTemplate className="w-3.5 h-3.5 text-primary" />
              <span>Layout Architecture</span>
            </div>
            <span className="text-[10px] font-mono text-muted-foreground">
              {templateList.length} styles
            </span>
          </div>

          <div className="grid grid-cols-1 gap-2.5">
            {templateList.map((tmpl) => {
              const isSelected = theme.template === tmpl.id;
              return (
                <button
                  key={tmpl.id}
                  type="button"
                  onClick={() =>
                    onChange((prev) => ({ ...prev, template: tmpl.id }))
                  }
                  className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                    isSelected
                      ? "bg-primary/15 border-primary text-foreground shadow-xs ring-1 ring-primary/40"
                      : "bg-card border-border text-muted-foreground hover:border-border hover:text-foreground hover:bg-muted/80"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-foreground">
                        {tmpl.name}
                      </span>
                      {tmpl.badge && (
                        <span className="text-[9px] font-mono font-medium px-1.5 py-0.5 rounded-full bg-primary/20 text-primary">
                          {tmpl.badge}
                        </span>
                      )}
                    </div>
                    {isSelected && (
                      <div className="w-4 h-4 rounded-full bg-primary text-primary-foreground flex items-center justify-center shrink-0">
                        <Check className="w-2.5 h-2.5 stroke-[3]" />
                      </div>
                    )}
                  </div>

                  <p className="text-[11px] text-muted-foreground leading-snug mb-2">
                    {tmpl.description}
                  </p>

                  <div className="space-y-1 text-[10px] pt-1.5 border-t border-border/60">
                    <div className="flex items-baseline gap-1 text-muted-foreground">
                      <span className="font-semibold text-foreground/80 shrink-0">Feel:</span>
                      <span className="italic truncate">{tmpl.feel}</span>
                    </div>
                    <div className="flex items-baseline gap-1 text-muted-foreground">
                      <span className="font-semibold text-foreground/80 shrink-0">Best for:</span>
                      <span className="truncate">{tmpl.bestFor}</span>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* 2. LOGO & BRAND */}
      {activeSection === "logo" && (
        <div className="space-y-4">
          <div className="flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider text-muted-foreground font-semibold">
            <Shield className="w-3.5 h-3.5 text-primary" />
            <span>Logo & Header Brand</span>
          </div>

          <div>
            <label className="block text-xs text-foreground font-medium mb-1.5">
              Brand Wordmark (Text Logo)
            </label>
            <input
              type="text"
              value={theme.logoText || ""}
              onChange={(e) =>
                onChange((prev) => ({ ...prev, logoText: e.target.value || null }))
              }
              placeholder="e.g. Zenith Media"
              className="w-full bg-card border border-border rounded-lg px-3 py-2 text-xs text-foreground focus:outline-none focus:border-primary transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs text-foreground font-medium mb-1.5">
              Logo Image URL (Optional)
            </label>
            <input
              type="url"
              value={theme.logoUrl || ""}
              onChange={(e) =>
                onChange((prev) => ({ ...prev, logoUrl: e.target.value || null }))
              }
              placeholder="https://..."
              className="w-full bg-card border border-border rounded-lg px-3 py-2 text-xs text-foreground focus:outline-none focus:border-primary transition-colors"
            />
            <p className="text-[10px] text-muted-foreground mt-1">
              If set, the logo image will be rendered instead of the text wordmark.
            </p>
          </div>
        </div>
      )}

      {/* 3. COLOR PALETTES */}
      {activeSection === "colors" && (
        <div className="space-y-4">
          <div className="flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider text-muted-foreground font-semibold">
            <Palette className="w-3.5 h-3.5 text-primary" />
            <span>Curated Luxury Palettes</span>
          </div>

          <div className="space-y-2">
            {COLOR_THEMES.map((th) => {
              const isSelected =
                theme.primaryColor.toLowerCase() === th.primary.toLowerCase() &&
                theme.bgColor.toLowerCase() === th.bg.toLowerCase();
              return (
                <button
                  key={th.id}
                  type="button"
                  onClick={() =>
                    onChange((prev) => ({
                      ...prev,
                      primaryColor: th.primary,
                      accentColor: th.accent,
                      bgColor: th.bg,
                      textColor: th.text,
                    }))
                  }
                  className={`w-full p-2.5 rounded-xl border flex items-center justify-between text-xs transition-all cursor-pointer ${
                    isSelected
                      ? "bg-card border-primary text-foreground shadow-xs"
                      : "bg-card border-border text-muted-foreground hover:border-border hover:text-foreground"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span
                      className="w-4 h-4 rounded-full border border-white/20"
                      style={{ backgroundColor: th.primary }}
                    />
                    <span>{th.name}</span>
                  </div>
                  {isSelected && <Check className="w-3.5 h-3.5 text-primary" />}
                </button>
              );
            })}
          </div>


        </div>
      )}

      {/* 4. TYPOGRAPHY STUDIO */}
      {activeSection === "fonts" && (
        <div className="space-y-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider text-muted-foreground font-semibold">
              <Type className="w-3.5 h-3.5 text-primary" />
              <span>Typography Studio</span>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
              Live Preview
            </span>
          </div>

          {/* Global Font Selector */}
          <div className="space-y-2 pt-2">
            <label className="block text-xs font-semibold text-foreground mb-2">
              Font Family
            </label>
            <div className="grid grid-cols-1 gap-2">
              {FONT_OPTIONS.map((font) => {
                const isSelected = theme.fonts.headlineFont === font.name;
                return (
                  <button
                    key={font.id}
                    type="button"
                    onClick={() =>
                      onChange((prev) => ({
                        ...prev,
                        fonts: {
                          ...prev.fonts,
                          headlineFont: font.name,
                          subtitleFont: font.name,
                          formFont: font.name,
                          buttonFont: font.name,
                        },
                      }))
                    }
                    className={`w-full p-3 rounded-xl border text-left transition-all cursor-pointer ${
                      isSelected
                        ? "bg-primary/15 border-primary text-foreground shadow-xs ring-1 ring-primary/40"
                        : "bg-card border-border text-muted-foreground hover:border-border hover:text-foreground hover:bg-muted/80"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-foreground">
                          {font.name}
                        </span>
                        <span className="text-[9px] font-mono uppercase px-1.5 py-0.5 rounded bg-muted text-muted-foreground border border-border">
                          {font.category}
                        </span>
                      </div>
                      {isSelected && (
                        <Check className="w-3.5 h-3.5 text-primary shrink-0" />
                      )}
                    </div>

                    {/* Real Font Specimen Rendering */}
                    <div
                      className="text-sm font-semibold tracking-tight text-foreground truncate my-1"
                      style={{ fontFamily: font.fontFamily }}
                    >
                      {font.previewSample}
                    </div>

                    <div
                      className="text-[11px] text-muted-foreground tracking-widest uppercase"
                      style={{ fontFamily: font.fontFamily }}
                    >
                      Aa Bb Gg 123
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* 5. BACKGROUND */}
      {activeSection === "background" && (
        <div className="space-y-4">
          <div className="flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider text-muted-foreground font-semibold">
            <ImageIcon className="w-3.5 h-3.5 text-primary" />
            <span>Full-Page Background</span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => onChange((prev) => ({ ...prev, background: null }))}
              className={`p-2.5 rounded-xl border text-xs font-medium cursor-pointer transition-colors ${
                !theme.background
                  ? "bg-primary/15 border-primary text-foreground shadow-xs"
                  : "bg-card border-border text-muted-foreground hover:text-foreground"
              }`}
            >
              Solid Canvas
            </button>
            <button
              type="button"
              onClick={() =>
                onChange((prev) => ({
                  ...prev,
                  background: {
                    type: "image",
                    url: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1600&q=80",
                    overlay: 0.6,
                  },
                }))
              }
              className={`p-2.5 rounded-xl border text-xs font-medium cursor-pointer transition-colors ${
                theme.background
                  ? "bg-primary/15 border-primary text-foreground shadow-xs"
                  : "bg-card border-border text-muted-foreground hover:text-foreground"
              }`}
            >
              Ambient Image
            </button>
          </div>

          {theme.background && (
            <div className="space-y-3 pt-2">
              <div>
                <label className="block text-xs text-foreground font-medium mb-1">
                  Background Media URL
                </label>
                <input
                  type="url"
                  value={theme.background.url}
                  onChange={(e) =>
                    onChange((prev) => ({
                      ...prev,
                      background: prev.background
                        ? { ...prev.background, url: e.target.value }
                        : null,
                    }))
                  }
                  className="w-full bg-card border border-border rounded-lg px-2.5 py-1.5 text-xs text-foreground focus:outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="block text-xs text-foreground font-medium mb-1">
                  Darkness Overlay: {Math.round((theme.background.overlay ?? 0.5) * 100)}%
                </label>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={theme.background.overlay ?? 0.5}
                  onChange={(e) =>
                    onChange((prev) => ({
                      ...prev,
                      background: prev.background
                        ? { ...prev.background, overlay: parseFloat(e.target.value) }
                        : null,
                    }))
                  }
                  className="w-full accent-amber-500 cursor-pointer"
                />
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
