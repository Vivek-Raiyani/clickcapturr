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
 * (`theme-surface`, `theme-card`, `theme-border`, `theme-text`, `theme-primary`).
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
            <div className="flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider text-theme-text-muted font-semibold">
              <LayoutTemplate className="w-3.5 h-3.5 text-theme-primary" />
              <span>Layout Architecture</span>
            </div>
            <span className="text-[10px] font-mono text-theme-text-muted">
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
                      ? "bg-theme-primary/15 border-theme-primary text-theme-text shadow-xs ring-1 ring-theme-primary/40"
                      : "bg-theme-card border-theme-border text-theme-text-muted hover:border-theme-border hover:text-theme-text hover:bg-theme-surface-hover"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-theme-text">
                        {tmpl.name}
                      </span>
                      {tmpl.badge && (
                        <span className="text-[9px] font-mono font-medium px-1.5 py-0.5 rounded-full bg-theme-primary/20 text-theme-primary">
                          {tmpl.badge}
                        </span>
                      )}
                    </div>
                    {isSelected && (
                      <div className="w-4 h-4 rounded-full bg-theme-primary text-theme-primary-fg flex items-center justify-center shrink-0">
                        <Check className="w-2.5 h-2.5 stroke-[3]" />
                      </div>
                    )}
                  </div>

                  <p className="text-[11px] text-theme-text-muted leading-snug mb-2">
                    {tmpl.description}
                  </p>

                  <div className="space-y-1 text-[10px] pt-1.5 border-t border-theme-border/60">
                    <div className="flex items-baseline gap-1 text-theme-text-muted">
                      <span className="font-semibold text-theme-text/80 shrink-0">Feel:</span>
                      <span className="italic truncate">{tmpl.feel}</span>
                    </div>
                    <div className="flex items-baseline gap-1 text-theme-text-muted">
                      <span className="font-semibold text-theme-text/80 shrink-0">Best for:</span>
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
          <div className="flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider text-theme-text-muted font-semibold">
            <Shield className="w-3.5 h-3.5 text-theme-primary" />
            <span>Logo & Header Brand</span>
          </div>

          <div>
            <label className="block text-xs text-theme-text font-medium mb-1.5">
              Brand Wordmark (Text Logo)
            </label>
            <input
              type="text"
              value={theme.logoText || ""}
              onChange={(e) =>
                onChange((prev) => ({ ...prev, logoText: e.target.value || null }))
              }
              placeholder="e.g. Zenith Media"
              className="w-full bg-theme-card border border-theme-border rounded-lg px-3 py-2 text-xs text-theme-text focus:outline-none focus:border-theme-primary transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs text-theme-text font-medium mb-1.5">
              Logo Image URL (Optional)
            </label>
            <input
              type="url"
              value={theme.logoUrl || ""}
              onChange={(e) =>
                onChange((prev) => ({ ...prev, logoUrl: e.target.value || null }))
              }
              placeholder="https://..."
              className="w-full bg-theme-card border border-theme-border rounded-lg px-3 py-2 text-xs text-theme-text focus:outline-none focus:border-theme-primary transition-colors"
            />
            <p className="text-[10px] text-theme-text-muted mt-1">
              If set, the logo image will be rendered instead of the text wordmark.
            </p>
          </div>
        </div>
      )}

      {/* 3. COLOR PALETTES */}
      {activeSection === "colors" && (
        <div className="space-y-4">
          <div className="flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider text-theme-text-muted font-semibold">
            <Palette className="w-3.5 h-3.5 text-theme-primary" />
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
                      ? "bg-theme-card border-theme-primary text-theme-text shadow-xs"
                      : "bg-theme-card border-theme-border text-theme-text-muted hover:border-theme-border hover:text-theme-text"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span
                      className="w-4 h-4 rounded-full border border-white/20"
                      style={{ backgroundColor: th.primary }}
                    />
                    <span>{th.name}</span>
                  </div>
                  {isSelected && <Check className="w-3.5 h-3.5 text-theme-primary" />}
                </button>
              );
            })}
          </div>

          {/* Custom Accents */}
          <div className="pt-3 border-t border-theme-border space-y-3">
            <span className="text-[11px] font-mono text-theme-text-muted uppercase block font-semibold">
              Custom Colors
            </span>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[10.5px] text-theme-text-muted mb-1">
                  Primary Brand
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={theme.primaryColor}
                    onChange={(e) =>
                      onChange((prev) => ({ ...prev, primaryColor: e.target.value }))
                    }
                    className="w-7 h-7 rounded border-none cursor-pointer bg-transparent"
                  />
                  <input
                    type="text"
                    value={theme.primaryColor}
                    onChange={(e) =>
                      onChange((prev) => ({ ...prev, primaryColor: e.target.value }))
                    }
                    className="w-full bg-theme-surface border border-theme-border rounded px-2 py-1 text-xs text-theme-text font-mono focus:outline-none focus:border-theme-primary"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10.5px] text-theme-text-muted mb-1">
                  Button Accent
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={theme.accentColor}
                    onChange={(e) =>
                      onChange((prev) => ({ ...prev, accentColor: e.target.value }))
                    }
                    className="w-7 h-7 rounded border-none cursor-pointer bg-transparent"
                  />
                  <input
                    type="text"
                    value={theme.accentColor}
                    onChange={(e) =>
                      onChange((prev) => ({ ...prev, accentColor: e.target.value }))
                    }
                    className="w-full bg-theme-surface border border-theme-border rounded px-2 py-1 text-xs text-theme-text font-mono focus:outline-none focus:border-theme-primary"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 4. TYPOGRAPHY STUDIO */}
      {activeSection === "fonts" && (
        <div className="space-y-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider text-theme-text-muted font-semibold">
              <Type className="w-3.5 h-3.5 text-theme-primary" />
              <span>Typography Studio</span>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-theme-primary/10 text-theme-primary border border-theme-primary/20">
              Live Preview
            </span>
          </div>

          {/* Curated Typography Pairings */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-theme-text">
              Curated Font Pairings
            </label>
            <div className="grid grid-cols-1 gap-1.5">
              {[
                {
                  id: "editorial",
                  name: "Editorial Luxury",
                  headline: "Playfair Display",
                  body: "Inter Sans",
                  badge: "Classic",
                  sample: "The High-Leverage Playbook",
                },
                {
                  id: "modern",
                  name: "Clean Modernist",
                  headline: "Outfit Clean",
                  body: "Inter Sans",
                  badge: "SaaS",
                  sample: "Streamlined Architecture & Logic",
                },
                {
                  id: "literary",
                  name: "Classical Literature",
                  headline: "Cormorant Garamond",
                  body: "Cormorant Garamond",
                  badge: "Scholarly",
                  sample: "Antiquarian Wisdom & Heritage",
                },
                {
                  id: "universal",
                  name: "Universal Sans",
                  headline: "Inter Sans",
                  body: "Inter Sans",
                  badge: "Balanced",
                  sample: "Maximum Conversion Clarity",
                },
                {
                  id: "terminal",
                  name: "Tactical Terminal",
                  headline: "JetBrains Mono",
                  body: "JetBrains Mono",
                  badge: "Cyber",
                  sample: "SYSTEM_NOMINAL // RUN_CODE",
                },
              ].map((pairing) => {
                const isPairingActive =
                  theme.fonts.headlineFont === pairing.headline &&
                  theme.fonts.formFont === pairing.body;
                return (
                  <button
                    key={pairing.id}
                    type="button"
                    onClick={() =>
                      onChange((prev) => ({
                        ...prev,
                        fonts: {
                          ...prev.fonts,
                          headlineFont: pairing.headline,
                          formFont: pairing.body,
                          subtitleFont: pairing.body,
                          buttonFont: pairing.body,
                        },
                      }))
                    }
                    className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer flex items-center justify-between ${
                      isPairingActive
                        ? "bg-theme-primary/15 border-theme-primary text-theme-text shadow-xs ring-1 ring-theme-primary/40"
                        : "bg-theme-card border-theme-border text-theme-text-muted hover:border-theme-border hover:text-theme-text hover:bg-theme-surface-hover"
                    }`}
                  >
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-theme-text">
                          {pairing.name}
                        </span>
                        <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-theme-primary/10 text-theme-primary border border-theme-primary/20">
                          {pairing.badge}
                        </span>
                      </div>
                      <div className="text-[10.5px] text-theme-text-muted truncate mt-0.5">
                        {pairing.headline} + {pairing.body}
                      </div>
                    </div>
                    {isPairingActive && (
                      <Check className="w-3.5 h-3.5 text-theme-primary shrink-0 ml-2" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Headline Font Selector with Real Specimen Cards */}
          <div className="space-y-2.5 pt-2 border-t border-theme-border">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-semibold text-theme-text">
                Headline Font
              </label>
              <span className="text-[10px] font-mono text-theme-primary font-semibold">
                {theme.fonts.headlineFont}
              </span>
            </div>

            <div className="space-y-2">
              {FONT_OPTIONS.map((font) => {
                const isSelected = theme.fonts.headlineFont === font.name;
                return (
                  <button
                    key={font.id}
                    type="button"
                    onClick={() =>
                      onChange((prev) => ({
                        ...prev,
                        fonts: { ...prev.fonts, headlineFont: font.name },
                      }))
                    }
                    className={`w-full p-3 rounded-xl border text-left transition-all cursor-pointer ${
                      isSelected
                        ? "bg-theme-primary/15 border-theme-primary text-theme-text shadow-xs ring-1 ring-theme-primary/40"
                        : "bg-theme-card border-theme-border text-theme-text-muted hover:border-theme-border hover:text-theme-text hover:bg-theme-surface-hover"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-theme-text">
                          {font.name}
                        </span>
                        <span className="text-[9px] font-mono uppercase px-1.5 py-0.5 rounded bg-theme-surface text-theme-text-muted border border-theme-border">
                          {font.category}
                        </span>
                      </div>
                      {isSelected && (
                        <Check className="w-3.5 h-3.5 text-theme-primary shrink-0" />
                      )}
                    </div>

                    {/* Real Font Specimen Rendering */}
                    <div
                      className="text-sm font-semibold tracking-tight text-theme-text truncate my-1"
                      style={{ fontFamily: font.fontFamily }}
                    >
                      {font.previewSample}
                    </div>

                    <div
                      className="text-[11px] text-theme-text-muted tracking-widest uppercase"
                      style={{ fontFamily: font.fontFamily }}
                    >
                      Aa Bb Gg 123
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Headline Weight Controls */}
          <div className="space-y-1.5 pt-2 border-t border-theme-border">
            <label className="block text-xs font-semibold text-theme-text">
              Headline Weight
            </label>
            <div className="grid grid-cols-4 gap-1.5">
              {[
                { label: "Regular", val: "400" },
                { label: "Medium", val: "500" },
                { label: "Bold", val: "700" },
                { label: "Black", val: "900" },
              ].map((wt) => {
                const isSelected = (theme.fonts.headlineWeight || "700") === wt.val;
                return (
                  <button
                    key={wt.val}
                    type="button"
                    onClick={() =>
                      onChange((prev) => ({
                        ...prev,
                        fonts: { ...prev.fonts, headlineWeight: wt.val },
                      }))
                    }
                    className={`py-1.5 px-2 rounded-lg text-xs font-medium text-center transition-all cursor-pointer border ${
                      isSelected
                        ? "bg-theme-primary text-theme-primary-fg border-theme-primary font-bold shadow-xs"
                        : "bg-theme-card border-theme-border text-theme-text-muted hover:text-theme-text"
                    }`}
                  >
                    {wt.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Body & Form Font */}
          <div className="space-y-2 pt-2 border-t border-theme-border">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-semibold text-theme-text">
                Body & Form Font
              </label>
              <span className="text-[10px] font-mono text-theme-primary font-semibold">
                {theme.fonts.formFont}
              </span>
            </div>

            <div className="grid grid-cols-1 gap-1.5">
              {FONT_OPTIONS.map((font) => {
                const isSelected = theme.fonts.formFont === font.name;
                return (
                  <button
                    key={font.id}
                    type="button"
                    onClick={() =>
                      onChange((prev) => ({
                        ...prev,
                        fonts: {
                          ...prev.fonts,
                          formFont: font.name,
                          subtitleFont: font.name,
                          buttonFont: font.name,
                        },
                      }))
                    }
                    className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer flex items-center justify-between ${
                      isSelected
                        ? "bg-theme-primary/15 border-theme-primary text-theme-text shadow-xs ring-1 ring-theme-primary/40"
                        : "bg-theme-card border-theme-border text-theme-text-muted hover:border-theme-border hover:text-theme-text hover:bg-theme-surface-hover"
                    }`}
                  >
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-theme-text">
                          {font.name}
                        </span>
                        <span className="text-[9px] font-mono uppercase px-1.5 py-0.5 rounded bg-theme-surface text-theme-text-muted border border-theme-border">
                          {font.category}
                        </span>
                      </div>
                      <div
                        className="text-[11px] text-theme-text-muted truncate mt-1"
                        style={{ fontFamily: font.fontFamily }}
                      >
                        Designed for high readability and optimal conversion flow.
                      </div>
                    </div>
                    {isSelected && (
                      <Check className="w-3.5 h-3.5 text-theme-primary shrink-0 ml-2" />
                    )}
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
          <div className="flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider text-theme-text-muted font-semibold">
            <ImageIcon className="w-3.5 h-3.5 text-theme-primary" />
            <span>Full-Page Background</span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => onChange((prev) => ({ ...prev, background: null }))}
              className={`p-2.5 rounded-xl border text-xs font-medium cursor-pointer transition-colors ${
                !theme.background
                  ? "bg-theme-primary/15 border-theme-primary text-theme-text shadow-xs"
                  : "bg-theme-card border-theme-border text-theme-text-muted hover:text-theme-text"
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
                  ? "bg-theme-primary/15 border-theme-primary text-theme-text shadow-xs"
                  : "bg-theme-card border-theme-border text-theme-text-muted hover:text-theme-text"
              }`}
            >
              Ambient Image
            </button>
          </div>

          {theme.background && (
            <div className="space-y-3 pt-2">
              <div>
                <label className="block text-xs text-theme-text font-medium mb-1">
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
                  className="w-full bg-theme-card border border-theme-border rounded-lg px-2.5 py-1.5 text-xs text-theme-text focus:outline-none focus:border-theme-primary"
                />
              </div>

              <div>
                <label className="block text-xs text-theme-text font-medium mb-1">
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
