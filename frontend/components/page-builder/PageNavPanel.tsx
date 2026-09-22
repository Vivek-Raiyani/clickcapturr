"use client";

import * as React from "react";
import {
  Type,
  AlignLeft,
  Image as ImageIcon,
  MousePointerClick,
  PackageCheck,
  CheckCircle2,
  ListFilter,
  Sparkles,
  LayoutTemplate,
  Shield,
  Palette,
  Check,
  Layers,
  DollarSign,
} from "lucide-react";
import type {
  BuilderTab,
  BuilderSection,
  PageBuilderState,
} from "./types";

interface NavButtonProps {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  active: boolean;
  onClick: () => void;
  badge?: string;
}

function NavButton({
  icon,
  title,
  subtitle,
  active,
  onClick,
  badge,
}: NavButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full flex items-center justify-between p-2.5 rounded-xl border text-left transition-all duration-150 cursor-pointer ${
        active
          ? "bg-theme-primary/15 border-theme-primary/70 text-theme-text shadow-xs"
          : "bg-theme-card border-theme-border text-theme-text-muted hover:bg-theme-surface-hover hover:border-theme-border hover:text-theme-text"
      }`}
    >
      <div className="flex items-center gap-2.5 min-w-0">
        <div
          className={`p-1.5 rounded-lg shrink-0 ${
            active
              ? "bg-theme-primary text-theme-primary-fg shadow-xs font-semibold"
              : "bg-theme-surface text-theme-text-muted"
          }`}
        >
          {icon}
        </div>
        <div className="min-w-0">
          <div className="text-xs font-medium truncate leading-tight flex items-center gap-1.5">
            <span className={active ? "text-theme-text font-semibold" : "text-theme-text"}>
              {title}
            </span>
            {badge && (
              <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-theme-primary/20 text-theme-primary font-normal">
                {badge}
              </span>
            )}
          </div>
          <div className="text-[10px] text-theme-text-muted truncate mt-0.5">{subtitle}</div>
        </div>
      </div>
      {active && <Check className="w-3.5 h-3.5 text-theme-primary shrink-0 ml-1" />}
    </button>
  );
}

export interface PageNavPanelProps {
  activeTab: BuilderTab;
  onTabChange: (tab: BuilderTab) => void;
  activeSection: BuilderSection;
  onSectionChange: (section: BuilderSection) => void;
  state: PageBuilderState;
}

/**
 * Left sidebar navigation for configuring landing page content, design system, and form fields.
 */
export function PageNavPanel({
  activeTab,
  onTabChange,
  activeSection,
  onSectionChange,
  state,
}: PageNavPanelProps) {
  return (
    <aside className="w-60 sm:w-64 border-r border-theme-border bg-theme-surface flex flex-col shrink-0">
      {/* Tab Switcher: 2 primary tabs (Content and Design) */}
      <div className="grid grid-cols-2 p-1.5 border-b border-theme-border gap-1 bg-theme-bg">
        <button
          type="button"
          onClick={() => {
            onTabChange("content");
            onSectionChange("headline");
          }}
          className={`py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
            activeTab === "content"
              ? "bg-theme-card text-theme-text shadow-xs"
              : "text-theme-text-muted hover:text-theme-text"
          }`}
        >
          Content
        </button>
        <button
          type="button"
          onClick={() => {
            onTabChange("design");
            onSectionChange("template");
          }}
          className={`py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
            activeTab === "design"
              ? "bg-theme-card text-theme-text shadow-xs"
              : "text-theme-text-muted hover:text-theme-text"
          }`}
        >
          Design
        </button>
      </div>

      {/* Sections List */}
      <div className="flex-1 overflow-y-auto p-3 space-y-4">
        {activeTab === "content" && (
          <>
            <div>
              <div className="text-[10px] font-mono uppercase tracking-wider text-theme-text-muted font-semibold px-2 mb-1.5">
                PAGE COPY
              </div>
              <div className="space-y-1">
                <NavButton
                  icon={<Type className="w-4 h-4" />}
                  title="Headline"
                  subtitle={state.content.headline ? state.content.headline.slice(0, 18) + "..." : "Add headline"}
                  active={activeSection === "headline"}
                  onClick={() => onSectionChange("headline")}
                />
                <NavButton
                  icon={<AlignLeft className="w-4 h-4" />}
                  title="Description"
                  subtitle={state.content.description ? state.content.description.slice(0, 18) + "..." : "Add description"}
                  active={activeSection === "description"}
                  onClick={() => onSectionChange("description")}
                />
                <NavButton
                  icon={<ImageIcon className="w-4 h-4" />}
                  title="Hero Media"
                  subtitle={state.content.hero?.type === "video" ? "Video visual" : "Hero visual"}
                  active={activeSection === "hero"}
                  onClick={() => onSectionChange("hero")}
                />
                <NavButton
                  icon={<MousePointerClick className="w-4 h-4" />}
                  title="CTA Button"
                  subtitle={state.content.buttonText || "Claim Access"}
                  active={activeSection === "button"}
                  onClick={() => onSectionChange("button")}
                />
              </div>
            </div>

            <div>
              <div className="text-[10px] font-mono uppercase tracking-wider text-theme-text-muted font-semibold px-2 mb-1.5">
                LEAD CAPTURE FORM
              </div>
              <div className="space-y-1">
                <NavButton
                  icon={<ListFilter className="w-4 h-4" />}
                  title="Lead Fields"
                  subtitle={`${state.formFields.length} inputs defined`}
                  active={activeSection === "form"}
                  onClick={() => onSectionChange("form")}
                  badge={state.content.formEnabled ? "Active" : "Disabled"}
                />
              </div>
            </div>

            <div>
              <div className="text-[10px] font-mono uppercase tracking-wider text-theme-text-muted font-semibold px-2 mb-1.5">
                OFFER & CONTENT
              </div>
              <div className="space-y-1">
                <NavButton
                  icon={<PackageCheck className="w-4 h-4" />}
                  title="Offer Deliverable"
                  subtitle={
                    state.content.offer?.type === "text"
                      ? state.content.offer.textContent || "Access Code"
                      : state.content.offer?.type === "link"
                      ? state.content.offer.linkTitle || "Resource Link"
                      : state.content.offer?.fileName || "Downloadable file"
                  }
                  active={activeSection === "offer"}
                  onClick={() => onSectionChange("offer")}
                />
                <NavButton
                  icon={<Sparkles className="w-4 h-4" />}
                  title="Social Proof"
                  subtitle={`${state.content.testimonials?.length || 0} testimonials`}
                  active={activeSection === "socialProof"}
                  onClick={() => onSectionChange("socialProof")}
                />
                <NavButton
                  icon={<Layers className="w-4 h-4" />}
                  title="Additional Content"
                  subtitle={`${state.content.contentBlocks?.length || 0} blocks (Embeds, FAQs, Text)`}
                  active={activeSection === "additionalContent"}
                  onClick={() => onSectionChange("additionalContent")}
                  badge={state.content.contentBlocks?.length ? `${state.content.contentBlocks.length}` : undefined}
                />
                <NavButton
                  icon={<CheckCircle2 className="w-4 h-4" />}
                  title="Success Screen"
                  subtitle="Post-optin screen"
                  active={activeSection === "success"}
                  onClick={() => onSectionChange("success")}
                />
              </div>
            </div>

            <div>
              <div className="text-[10px] font-mono uppercase tracking-wider text-theme-text-muted font-semibold px-2 mb-1.5">
                MONETIZE
              </div>
              <div className="space-y-1">
                <NavButton
                  icon={<DollarSign className="w-4 h-4 text-amber-400" />}
                  title="Sponsor Cards"
                  subtitle={`${state.content.sponsors?.length || 0} sponsors`}
                  active={activeSection === "sponsors"}
                  onClick={() => onSectionChange("sponsors")}
                  badge={state.content.sponsorsEnabled ? "Active" : undefined}
                />
              </div>
            </div>
          </>
        )}

        {activeTab === "design" && (
          <div>
            <div className="text-[10px] font-mono uppercase tracking-wider text-theme-text-muted font-semibold px-2 mb-1.5">
              THEME & STYLING
            </div>
            <div className="space-y-1">
              <NavButton
                icon={<LayoutTemplate className="w-4 h-4" />}
                title="Layout Architecture"
                subtitle={`Style: ${state.theme.template}`}
                active={activeSection === "template"}
                onClick={() => onSectionChange("template")}
              />
              <NavButton
                icon={<Shield className="w-4 h-4" />}
                title="Logo & Wordmark"
                subtitle={state.theme.logoText || "Brand Logo"}
                active={activeSection === "logo"}
                onClick={() => onSectionChange("logo")}
              />
              <NavButton
                icon={<Palette className="w-4 h-4" />}
                title="Color Palette"
                subtitle="Luxury Themes"
                active={activeSection === "colors"}
                onClick={() => onSectionChange("colors")}
              />
              <NavButton
                icon={<Type className="w-4 h-4" />}
                title="Typography"
                subtitle={state.theme.fonts.headlineFont}
                active={activeSection === "fonts"}
                onClick={() => onSectionChange("fonts")}
              />
              <NavButton
                icon={<Layers className="w-4 h-4" />}
                title="Background"
                subtitle={state.theme.background ? "Ambient Backdrop" : "Solid Canvas"}
                active={activeSection === "background"}
                onClick={() => onSectionChange("background")}
              />
            </div>
          </div>
        )}
      </div>

      {/* Footer Info */}
      <div className="p-3 border-t border-theme-border text-[11px] text-theme-text-muted flex items-center justify-between">
        <span>Page Builder</span>
        <span className="font-mono text-theme-text-muted">v3.0</span>
      </div>
    </aside>
  );
}
