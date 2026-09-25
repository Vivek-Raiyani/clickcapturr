"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import confetti from "canvas-confetti";
import {
  Sparkles,
  Loader2,
  Monitor,
  Tablet,
  Smartphone,
  CheckCircle2,
  Download,
  ExternalLink,
  PackageCheck,
  Quote,
  ArrowRight,
  FileText,
  Video,
  Image as ImageIcon,
  Copy,
  Check,
  ShieldCheck,
  Clock,
  KeyRound,
  Globe,
  HelpCircle,
} from "lucide-react";
import {
  type PageBuilderState,
  type DeviceMode,
  TEMPLATE_STYLES,
  type TemplateDefinition,
} from "./types";

export interface PagePreviewProps {
  state: PageBuilderState;
  onUpdateState: (updater: (prev: PageBuilderState) => PageBuilderState) => void;
  deviceMode: DeviceMode;
  onDeviceModeChange: (mode: DeviceMode) => void;
  isPublicView?: boolean;
  onSubmitForm?: (data: Record<string, unknown>) => Promise<boolean>;
}

/**
 * Safely transforms YouTube/Vimeo/Calendly URLs into responsive embed iframe sources.
 */
function getEmbedIframeSrc(url?: string): string | null {
  if (!url) return null;
  const trimmed = url.trim();
  // YouTube watch, short links, or embed
  const ytMatch = trimmed.match(
    /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i
  );
  if (ytMatch && ytMatch[1]) {
    return `https://www.youtube-nocookie.com/embed/${ytMatch[1]}`;
  }
  // Vimeo
  const vimeoMatch = trimmed.match(/vimeo\.com\/(?:channels\/(?:\w+\/)?|groups\/([^\/]*)\/videos\/|album\/(\d+)\/video\/|video\/|)(\d+)/i);
  if (vimeoMatch && vimeoMatch[3]) {
    return `https://player.vimeo.com/video/${vimeoMatch[3]}`;
  }
  // Calendly or other HTTPS embed
  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
    return trimmed;
  }
  return null;
}

export function PagePreview({
  state,
  onUpdateState,
  deviceMode,
  onDeviceModeChange,
  isPublicView = false,
  onSubmitForm,
}: PagePreviewProps) {
  const { title, slug, theme, content, formFields, showSuccessPreview } = state;
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);
  const isViewingSuccess = showSuccessPreview || formSubmitted;

  useEffect(() => {
    if (isViewingSuccess && content.successEffect?.type && content.successEffect.type !== "none") {
      const type = content.successEffect.type;
      const colors = [theme.primaryColor, theme.accentColor || "#ffffff", "#ffffff"];
      
      if (type === "confetti") {
        confetti({
          particleCount: 150,
          spread: 80,
          origin: { y: 0.6 },
          colors,
          zIndex: 9999,
        });
      } else if (type === "fireworks") {
        const duration = 2500;
        const animationEnd = Date.now() + duration;
        const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 9999 };
        const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

        const interval: any = setInterval(function() {
          const timeLeft = animationEnd - Date.now();
          if (timeLeft <= 0) return clearInterval(interval);
          const particleCount = 50 * (timeLeft / duration);
          confetti(Object.assign({}, defaults, {
            particleCount,
            origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
            colors
          }));
          confetti(Object.assign({}, defaults, {
            particleCount,
            origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
            colors
          }));
        }, 250);
      } else if (type === "sparkles") {
        confetti({
          particleCount: 100,
          spread: 120,
          origin: { y: 0.5 },
          colors: ["#FFD700", "#FFA500", "#FFFFFF"],
          zIndex: 9999,
        });
      }
    }
  }, [isViewingSuccess, content.successEffect?.type, theme.primaryColor, theme.accentColor]);

  // Active template definition containing DB/preset styleConfig and customCss
  const activeTemplate = TEMPLATE_STYLES.find((t) => t.id === theme.template);

  // Responsive device view flags
  const isDesktop = deviceMode === "desktop";
  const isTablet = deviceMode === "tablet";
  const isMobile = deviceMode === "mobile";

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("PagePreview handleSubmit triggered!", { isPublicView, hasOnSubmitForm: !!onSubmitForm });
    if (isPublicView && onSubmitForm) {
      const formData = new FormData(e.currentTarget);
      const data = Object.fromEntries(formData.entries());
      console.log("Extracted form data:", data);
      const success = await onSubmitForm(data);
      console.log("onSubmitForm returned:", success);
      if (success) {
        setFormSubmitted(true);
      }
    } else {
      setFormSubmitted(true);
    }
  };

  const getHeadlineFontFamily = () => {
    const name = theme.fonts?.headlineFont;
    if (name?.includes("Cormorant")) return "var(--font-cormorant, 'Cormorant Garamond', Georgia, serif)";
    if (name?.includes("Playfair")) return "var(--font-playfair, 'Playfair Display', Georgia, serif)";
    if (name?.includes("JetBrains") || name?.includes("Mono")) return "var(--font-jetbrains, 'JetBrains Mono', monospace)";
    if (name?.includes("Outfit")) return "var(--font-outfit, 'Outfit', sans-serif)";
    return "var(--font-inter, 'Inter', -apple-system, sans-serif)";
  };

  const getBodyFontFamily = () => {
    const name = theme.fonts?.formFont;
    if (name?.includes("Cormorant")) return "var(--font-cormorant, 'Cormorant Garamond', Georgia, serif)";
    if (name?.includes("Playfair")) return "var(--font-playfair, 'Playfair Display', Georgia, serif)";
    if (name?.includes("JetBrains") || name?.includes("Mono")) return "var(--font-jetbrains, 'JetBrains Mono', monospace)";
    if (name?.includes("Outfit")) return "var(--font-outfit, 'Outfit', sans-serif)";
    return "var(--font-inter, 'Inter', -apple-system, sans-serif)";
  };

  const getOfferIcon = (type?: string) => {
    switch (type) {
      case "link":
        return <Globe className="w-5 h-5 shrink-0" style={{ color: theme.primaryColor }} />;
      case "text":
        return <KeyRound className="w-5 h-5 shrink-0" style={{ color: theme.primaryColor }} />;
      case "video":
        return <Video className="w-5 h-5 shrink-0" style={{ color: theme.primaryColor }} />;
      case "image":
        return <ImageIcon className="w-5 h-5 shrink-0" style={{ color: theme.primaryColor }} />;
      default:
        return <FileText className="w-5 h-5 shrink-0" style={{ color: theme.primaryColor }} />;
    }
  };

  const getOfferBadge = (type?: string) => {
    switch (type) {
      case "link":
        return "Resource Hub";
      case "text":
        return "Exclusive Code";
      case "video":
        return "Video Masterclass";
      case "image":
        return "Graphic Asset";
      default:
        return "Downloadable File";
    }
  };

  /**
   * Renders input elements and submit button styled to match the selected architectural template.
   * Prioritizes dynamic `styleConfig` classes defined in `types.ts` or fetched from `page_templates`.
   */
  const renderFormInputs = (style: string) => {
    const config = activeTemplate?.styleConfig;

    return (
      <form onSubmit={handleSubmit} className="space-y-3.5 text-left w-full">
        {formFields.map((field) => {
          const isRequired = field.isRequired;
          return (
            <div key={field.id} className="space-y-1">
              <label
                className={`block text-xs font-medium ${
                  style === "brutalist"
                    ? "font-mono uppercase text-white font-bold text-[11px]"
                    : style === "y2k"
                    ? "font-mono text-cyan-300 text-[11px]"
                    : style === "editorial" || style === "dark-academia"
                    ? "font-serif text-[#d4a373] text-xs"
                    : style === "diegetic"
                    ? "font-mono text-emerald-400 text-[11px] uppercase tracking-wider"
                    : style === "comic"
                    ? "font-sans font-black uppercase text-black text-[11px] tracking-wide"
                    : style === "riso"
                    ? "font-mono font-bold uppercase text-[#1d3557] text-[11px]"
                    : style === "memphis"
                    ? "font-sans font-black uppercase text-black text-[11px]"
                    : style === "skeuomorphic"
                    ? "font-sans text-zinc-300 text-xs font-semibold drop-shadow-sm"
                    : "text-zinc-300"
                }`}
              >
                {field.label} {isRequired && <span className="text-red-400">*</span>}
              </label>

              {field.fieldType === "select" ? (
                <select
                  name={field.id}
                  required={isRequired}
                  className={`w-full text-xs transition-all focus:outline-none ${
                    config?.inputClass ||
                    (style === "brutalist"
                      ? "bg-black border-2 border-white rounded-none px-3 py-2 text-white font-mono shadow-[2px_2px_0px_0px_#fff]"
                      : style === "neumorphic"
                      ? "bg-[#13141a] border-0 rounded-xl px-3 py-2.5 text-white shadow-[inset_3px_3px_6px_rgba(0,0,0,0.8),inset_-2px_-2px_6px_rgba(255,255,255,0.04)]"
                      : style === "glass"
                      ? "bg-white/[0.06] border border-white/20 rounded-xl px-3 py-2 text-white backdrop-blur-md focus:border-white/50"
                      : style === "minimal"
                      ? "bg-transparent border-b border-white/25 rounded-none px-1 py-2 text-white focus:border-white"
                      : style === "y2k"
                      ? "bg-black border border-cyan-400 rounded-none px-3 py-2 font-mono text-cyan-300 shadow-[0_0_8px_rgba(0,240,255,0.2)]"
                      : style === "editorial"
                      ? "bg-zinc-900/90 border border-zinc-700 rounded-sm px-3 py-2 font-serif text-white focus:border-amber-500"
                      : "bg-[#1c1c22] border border-neutral-700/80 rounded-xl px-3 py-2 text-white focus:border-amber-500")
                  }`}
                >
                  {(field.optionsJson || []).map((opt, i) => (
                    <option key={i} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  name={field.id}
                  type={field.fieldType === "email" ? "email" : field.fieldType === "phone" ? "tel" : "text"}
                  required={isRequired}
                  placeholder={
                    field.fieldType === "email"
                      ? "you@company.com"
                      : `Enter ${field.label.toLowerCase()}`
                  }
                  className={`w-full text-xs transition-all focus:outline-none ${
                    config?.inputClass ||
                    (style === "brutalist"
                      ? "bg-black border-2 border-white rounded-none px-3 py-2 text-white font-mono shadow-[2px_2px_0px_0px_#fff]"
                      : style === "neumorphic"
                      ? "bg-[#13141a] border-0 rounded-xl px-3 py-2.5 text-white shadow-[inset_3px_3px_6px_rgba(0,0,0,0.8),inset_-2px_-2px_6px_rgba(255,255,255,0.04)]"
                      : style === "glass"
                      ? "bg-white/[0.06] border border-white/20 rounded-xl px-3 py-2 text-white placeholder-white/40 backdrop-blur-md focus:border-white/50"
                      : style === "minimal"
                      ? "bg-transparent border-b border-white/25 rounded-none px-1 py-2 text-white placeholder-zinc-500 focus:border-white"
                      : style === "y2k"
                      ? "bg-black border border-cyan-400 rounded-none px-3 py-2 font-mono text-cyan-300 placeholder-cyan-600 shadow-[0_0_8px_rgba(0,240,255,0.2)]"
                      : style === "editorial"
                      ? "bg-zinc-900/90 border border-zinc-700 rounded-sm px-3 py-2 font-serif text-white placeholder-zinc-500 focus:border-amber-500"
                      : "bg-[#1c1c22] border border-neutral-700/80 rounded-xl px-3 py-2 text-white placeholder-zinc-500 focus:border-amber-500")
                  }`}
                />
              )}
            </div>
          );
        })}

        <button
          type="submit"
          className={`w-full py-3 flex items-center justify-center gap-2 cursor-pointer transition-all mt-2 ${
            config?.buttonClass ||
            (style === "brutalist"
              ? "bg-white text-black font-mono font-black text-xs uppercase rounded-none border-2 border-white shadow-[4px_4px_0px_0px_rgba(255,255,255,0.8)] active:translate-x-1 active:translate-y-1 active:shadow-none"
              : style === "neumorphic"
              ? "rounded-xl text-xs font-bold uppercase shadow-[-4px_-4px_10px_rgba(255,255,255,0.08),4px_4px_12px_rgba(0,0,0,0.7)] active:shadow-[inset_2px_2px_4px_rgba(0,0,0,0.6)]"
              : style === "glass"
              ? "rounded-xl text-xs font-bold uppercase backdrop-blur-md border border-white/25 shadow-lg shadow-black/40"
              : style === "minimal"
              ? "rounded-full text-xs font-medium uppercase tracking-widest py-2.5 shadow-sm"
              : style === "y2k"
              ? "rounded-none text-xs font-mono font-black uppercase bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-400 text-black shadow-[0_0_15px_rgba(255,0,127,0.4)] hover:brightness-110 active:scale-98"
              : style === "editorial"
              ? "rounded-sm text-xs font-serif uppercase tracking-widest py-3 shadow-md"
              : "rounded-xl text-xs font-bold font-sans tracking-wide uppercase shadow-lg")
          }`}
          style={{
            ...(style === "brutalist" || style === "y2k" || config?.buttonClass
              ? undefined
              : {
                  backgroundColor: theme.primaryColor,
                  color: "#000000",
                }),
            fontFamily: getHeadlineFontFamily(),
            fontWeight: theme.fonts?.buttonWeight || "600",
          }}
        >
          <span>{content.buttonText || "Get Instant Access"}</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>

        {content.offer?.type === "text" ? (
          <div className="pt-2 text-center text-[10px] text-zinc-400 flex items-center justify-center gap-1">
            <KeyRound className="w-3.5 h-3.5 text-amber-400" />
            <span>Delivers: Exclusive Access Voucher Code</span>
          </div>
        ) : content.offer?.type === "link" ? (
          <div className="pt-2 text-center text-[10px] text-zinc-400 flex items-center justify-center gap-1">
            <ExternalLink className="w-3.5 h-3.5 text-blue-400" />
            <span>Delivers Access: {content.offer.linkTitle || "Private Resource Hub"}</span>
          </div>
        ) : content.offer?.fileName || content.offer?.type === "pdf" || content.offer?.type === "file" ? (
          <div className="pt-2 text-center text-[10px] text-zinc-400 flex items-center justify-center gap-1">
            <PackageCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Delivers: {content.offer?.fileName || "Downloadable resource"}</span>
          </div>
        ) : null}
      </form>
    );
  };

  return (
    <main className={`flex-1 overflow-y-auto bg-background flex flex-col items-center relative ${isPublicView ? "" : "p-4 sm:p-6 lg:p-8"}`}>

      {/* Device Switcher */}
      {!isPublicView && (
        <div className="mb-4 flex items-center gap-1 bg-muted border border-border p-1 rounded-xl shadow-md">
          <button
            type="button"
            onClick={() => onDeviceModeChange("desktop")}
            className={`px-3 py-1 text-xs font-medium rounded-lg flex items-center gap-1.5 transition-all cursor-pointer ${
              deviceMode === "desktop"
                ? "bg-card text-foreground shadow-xs"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Monitor className="w-3.5 h-3.5" />
            <span>Desktop</span>
          </button>
          <button
            type="button"
            onClick={() => onDeviceModeChange("tablet")}
            className={`px-3 py-1 text-xs font-medium rounded-lg flex items-center gap-1.5 transition-all cursor-pointer ${
              deviceMode === "tablet"
                ? "bg-card text-foreground shadow-xs"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Tablet className="w-3.5 h-3.5" />
            <span>Tablet</span>
          </button>
          <button
            type="button"
            onClick={() => onDeviceModeChange("mobile")}
            className={`px-3 py-1 text-xs font-medium rounded-lg flex items-center gap-1.5 transition-all cursor-pointer ${
              deviceMode === "mobile"
                ? "bg-card text-foreground shadow-xs"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>Mobile</span>
          </button>
        </div>
      )}

      {/* Mockup Frame */}
      <div
        className={`w-full transition-all duration-300 ${
          isPublicView
            ? "min-h-screen bg-background"
            : `shadow-2xl rounded-2xl overflow-hidden border border-border bg-card flex flex-col ${
                deviceMode === "mobile"
                  ? "max-w-[390px] min-h-[844px]"
                  : deviceMode === "tablet"
                  ? "max-w-[768px] min-h-[920px]"
                  : "max-w-5xl min-h-[720px]"
              }`
        }`}
      >
        {/* Browser Chrome Bar */}
        {!isPublicView && (
          <div className="h-9 bg-muted border-b border-border px-3 flex items-center justify-between shrink-0 select-none">
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
              <div className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
            </div>

            <div className="bg-background border border-border/50 rounded-md px-3 py-0.5 text-[11px] font-mono text-muted-foreground truncate max-w-xs sm:max-w-md">
              https://vuemagnet.com/p/{slug || "my-page"}
            </div>

            <div className="w-16 text-right text-[10px] font-mono text-muted-foreground">
              {deviceMode === "mobile"
                ? "390 × 844"
                : deviceMode === "tablet"
                ? "768 × 1024"
                : "1280 × 800"}
            </div>
          </div>
        )}

        {/* Live Rendered Canvas with Dynamic Typography */}
        <div
          className={`relative overflow-y-auto preview-canvas-root ${isPublicView ? "min-h-screen w-full" : "flex-1"}`}
          style={{
            backgroundColor: theme.bgColor,
            color: theme.textColor,
            fontFamily: getBodyFontFamily(),
            backgroundImage: theme.background
              ? `linear-gradient(rgba(0,0,0,${theme.background.overlay ?? 0.6}), rgba(0,0,0,${theme.background.overlay ?? 0.6})), url(${theme.background.url})`
              : undefined,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          {/* Custom Template CSS & Scoped Dynamic Typography */}
          <style
            dangerouslySetInnerHTML={{
              __html: `
                .preview-canvas-root h1,
                .preview-canvas-root h2 {
                  font-family: ${getHeadlineFontFamily()} !important;
                  font-weight: ${theme.fonts?.headlineWeight || "700"} !important;
                }
                .preview-canvas-root p,
                .preview-canvas-root input,
                .preview-canvas-root select,
                .preview-canvas-root label {
                  font-family: ${getBodyFontFamily()} !important;
                }
                ${activeTemplate?.customCss || ""}
              `,
            }}
          />
          {/* Header Brand */}
          <header className="p-4 sm:p-5 lg:p-6 flex items-center justify-between border-b border-white/5">
            {theme.logoUrl ? (
              <img
                src={theme.logoUrl}
                alt="Logo"
                className="h-6 sm:h-7 w-auto object-contain"
              />
            ) : (
              <span
                className="font-bold text-xs sm:text-sm tracking-wider uppercase font-serif"
                style={{ color: theme.primaryColor }}
              >
                {theme.logoText || "VueMagnet"}
              </span>
            )}
          </header>

          {/* Canvas Content Body */}
          <div
            className={`max-w-4xl mx-auto w-full transition-all duration-200 ${
              isPublicView
                ? "p-6 sm:p-10 space-y-8"
                : deviceMode === "mobile"
                ? "p-4 space-y-4"
                : deviceMode === "tablet"
                ? "p-6 sm:p-8 space-y-6"
                : "p-6 sm:p-10 space-y-8"
            }`}
          >
            {isViewingSuccess ? (
              /* SUCCESS STATE PREVIEW: FULLY RESPONSIVE & CONFIG-AWARE ACROSS DESKTOP, TABLET & MOBILE */
              <div
                className={`mx-auto w-full transition-all duration-300 ${
                  isMobile
                    ? "max-w-md py-4 space-y-5"
                    : isTablet
                    ? "max-w-xl py-8 space-y-6"
                    : "max-w-2xl py-10 lg:py-14 space-y-7"
                }`}
              >
                <div
                  className={`text-center space-y-6 ${
                    !isMobile
                      ? "p-8 sm:p-10 rounded-3xl bg-white/[0.025] border border-white/10 shadow-2xl backdrop-blur-xl relative overflow-hidden"
                      : "space-y-5"
                  }`}
                >
                  {/* Subtle top highlight gradient on card for desktop/tablet */}
                  {!isMobile && (
                    <div
                      className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-[1px] bg-gradient-to-r from-transparent via-white/30 to-transparent pointer-events-none"
                    />
                  )}

                  {/* 1. Celebration Icon with Ambient Halo */}
                  <div className="relative inline-block mx-auto">
                    <div
                      className="w-16 h-16 sm:w-20 sm:h-20 rounded-full mx-auto flex items-center justify-center border-2 shadow-2xl relative z-10"
                      style={{
                        backgroundColor: `${theme.primaryColor}22`,
                        borderColor: theme.primaryColor,
                        color: theme.primaryColor,
                      }}
                    >
                      <CheckCircle2 className="w-8 h-8 sm:w-10 sm:h-10 stroke-[2.5]" />
                    </div>
                    <div
                      className="absolute inset-0 rounded-full blur-xl opacity-40 pointer-events-none"
                      style={{ backgroundColor: theme.primaryColor }}
                    />
                  </div>

                  {/* 2. Message Above The Button */}
                  <div className="space-y-2 px-2">
                    {content.successEffect?.type && content.successEffect.type !== "none" && (
                      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] sm:text-[11px] font-mono font-bold uppercase tracking-wider bg-emerald-400/15 text-emerald-300 border border-emerald-400/30 shadow-xs mb-1">
                        <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Access Confirmed</span>
                      </div>
                    )}
                    <h2
                      className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-white"
                      style={{ fontFamily: getHeadlineFontFamily() }}
                    >
                      {content.successTitle || "You're In!"}
                    </h2>
                    <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed max-w-md mx-auto">
                      {content.successSubtitle || "Your resources are ready for immediate download below."}
                    </p>
                  </div>

                  {/* 3. Deliverable Showcase & Action Module (Responsive & Config-Aware) */}
                  <div className="w-full space-y-3.5">
                    {/* Case A: Reveal Promo / Discount / Access Code */}
                    {content.successAction?.type === "reveal_code" || content.offer?.type === "text" ? (
                      <div className="p-4 sm:p-6 rounded-2xl bg-white/[0.04] border border-dashed border-amber-400/40 shadow-xl text-left space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] sm:text-xs font-mono uppercase tracking-widest text-amber-400 font-bold">
                            Exclusive Access Voucher
                          </span>
                          <span className="text-[10px] sm:text-xs text-emerald-400 font-semibold flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" /> Ready To Use
                          </span>
                        </div>

                        <div className="bg-black/60 border border-white/15 rounded-xl p-3 sm:p-4 text-center">
                          <div className="text-[10px] uppercase font-mono text-zinc-400 mb-1">Your Access Code</div>
                          <div className="font-mono text-lg sm:text-2xl font-black text-white tracking-widest select-all">
                            {content.offer?.textContent || content.successAction?.code || "VIP-ACCESS-2024"}
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => {
                            const codeToCopy = content.offer?.textContent || content.successAction?.code || "VIP-ACCESS-2024";
                            if (typeof navigator !== "undefined" && navigator.clipboard) {
                              navigator.clipboard.writeText(codeToCopy);
                              setCopiedCode(true);
                              setTimeout(() => setCopiedCode(false), 2500);
                            }
                          }}
                          className="w-full py-3.5 sm:py-4 px-6 rounded-xl text-xs sm:text-sm font-bold uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer shadow-lg transition-all active:scale-[0.98] hover:brightness-110"
                          style={{
                            backgroundColor: theme.primaryColor,
                            color: "#000000",
                          }}
                        >
                          {copiedCode ? (
                            <>
                              <Check className="w-4 h-4" />
                              <span>Copied to Clipboard!</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-4 h-4" />
                              <span>Copy Access Code</span>
                            </>
                          )}
                        </button>

                        {(content.offer?.textDescription || content.successAction?.codeDescription) && (
                          <p className="text-[11px] sm:text-xs text-zinc-400 leading-relaxed text-center">
                            {content.offer?.textDescription || content.successAction?.codeDescription}
                          </p>
                        )}
                      </div>
                    ) : content.successAction?.type === "redirect" || content.offer?.type === "link" ? (
                      /* Case B: Redirect / Resource Link Action */
                      <div className="p-4 sm:p-6 rounded-2xl bg-white/[0.04] border border-white/10 shadow-xl text-left space-y-4">
                        <div className="flex items-center gap-2 text-xs sm:text-sm text-amber-400 font-mono font-semibold">
                          <Globe className="w-4 h-4" />
                          <span>Private Resource Access Ready</span>
                        </div>
                        <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
                          Click the button below to immediately access your unlocked private resource:
                        </p>
                        <a
                          href={content.offer?.linkUrl || content.offer?.fileUrl || content.successAction?.redirectUrl || "#"}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex w-full py-3.5 sm:py-4 px-6 rounded-xl text-xs sm:text-sm font-bold uppercase tracking-wider items-center justify-center gap-2.5 cursor-pointer shadow-xl active:scale-[0.98] hover:brightness-110 transition-all"
                          style={{
                            backgroundColor: theme.primaryColor,
                            color: "#000000",
                            fontFamily: getHeadlineFontFamily(),
                          }}
                        >
                          <span>{content.offer?.linkTitle ? `Open ${content.offer.linkTitle}` : "Open Resource Hub"}</span>
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      </div>
                    ) : (content.offer?.fileName || content.offer?.type === "pdf" || content.offer?.type === "file" || content.successAction?.type === "download") ? (
                      /* Case C: Deliverable File Download (Harmonious layout on Desktop, Tablet, and Mobile) */
                      <div className="p-4 sm:p-5 rounded-2xl bg-white/[0.04] border border-white/10 shadow-xl space-y-3.5 sm:space-y-4">
                        {(content.offer?.autoDownload || content.successAction?.autoDownload) && (
                          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-mono font-medium text-amber-300 bg-amber-400/10 border border-amber-400/20">
                            <Clock className="w-3 h-3 animate-spin" />
                            <span>Download triggered automatically</span>
                          </div>
                        )}

                        {/* Top: Deliverable Metadata Banner */}
                        <div className="flex items-center gap-3.5 text-left p-3 rounded-xl bg-white/[0.03] border border-white/8">
                          <div className="p-3 rounded-xl bg-white/[0.06] border border-white/10 shrink-0">
                            {getOfferIcon(content.offer?.type)}
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="text-xs sm:text-sm font-semibold text-white truncate">
                              {content.offer?.fileName || content.successAction?.downloadFileName || "exclusive-guide.pdf"}
                            </div>
                            <div className="text-[11px] sm:text-xs text-zinc-400 font-mono mt-0.5 flex flex-wrap items-center gap-2">
                              <span>{getOfferBadge(content.offer?.type)}</span>
                              {content.offer?.fileSize && (
                                <>
                                  <span>•</span>
                                  <span>{content.offer.fileSize}</span>
                                </>
                              )}
                              <span>•</span>
                              <span className="text-emerald-400 font-semibold uppercase text-[10px] sm:text-[11px] flex items-center gap-1">
                                <CheckCircle2 className="w-3 h-3" /> Ready
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Action Button: Clear, prominent, full-width across all devices */}
                        <button
                          type="button"
                          className="w-full py-3.5 sm:py-4 px-6 rounded-xl text-xs sm:text-sm font-bold uppercase tracking-wider flex items-center justify-center gap-2.5 cursor-pointer shadow-xl transition-all duration-200 hover:brightness-110 active:scale-[0.98] whitespace-nowrap"
                          style={{
                            backgroundColor: theme.primaryColor,
                            color: "#000000",
                            fontFamily: getHeadlineFontFamily(),
                          }}
                        >
                          <Download className="w-4 h-4 shrink-0" />
                          <span>{content.successButtonText || "Download Resource Now"}</span>
                        </button>
                      </div>
                    ) : (
                      /* Case D: Confirmation Message */
                      <div className="p-4 sm:p-6 rounded-2xl bg-white/[0.04] border border-white/10 shadow-xl text-left space-y-2.5">
                        <div className="flex items-center gap-2 text-emerald-400 text-xs sm:text-sm font-semibold">
                          <CheckCircle2 className="w-4 h-4" />
                          <span>Registration Confirmed</span>
                        </div>
                        <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
                          {content.successAction?.message || "Your spot has been reserved. Check your inbox for access details."}
                        </p>
                      </div>
                    )}

                    {/* 4. Message Below The Button: Reassurance & Backup Delivery Info */}
                    <div className="p-3 sm:p-3.5 rounded-xl bg-white/[0.03] border border-white/8 text-left flex items-start gap-3 text-[11px] sm:text-xs text-zinc-300">
                      <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <div className="space-y-0.5 min-w-0">
                        <div className="font-semibold text-white">Instant Delivery Dispatched</div>
                        <div className="text-zinc-400 text-[10.5px] sm:text-[11px] leading-relaxed">
                          A secure backup copy and transaction receipt have also been sent directly to your email address.
                        </div>
                      </div>
                    </div>
                  </div>

                </div>
              </div>
            ) : (
              /* LEAD CAPTURE PREVIEWS: 10 DISTINCT ARCHITECTURAL STYLES */
              <div className="w-full">
                {/* 1. BENTO GRID */}
                {theme.template === "bento" && (
                  <div
                    className={`gap-4 items-stretch ${
                      isDesktop
                        ? "grid grid-cols-12"
                        : isTablet
                        ? "grid grid-cols-2"
                        : "flex flex-col"
                    }`}
                  >
                    {/* Bento Card 1: Headline & Copy */}
                    <div
                      className={`${
                        isDesktop
                          ? "col-span-7"
                          : isTablet
                          ? "col-span-2"
                          : "w-full"
                      } p-5 sm:p-7 lg:p-8 rounded-3xl bg-white/[0.04] border border-white/10 shadow-2xl flex flex-col justify-between space-y-4`}
                    >
                      <div className="space-y-2.5 sm:space-y-3">
                        {content.eyebrow && (
                          <span
                            className="inline-block px-3 py-1 rounded-full text-[10px] font-mono uppercase tracking-wider font-semibold border"
                            style={{
                              backgroundColor: `${theme.primaryColor}15`,
                              borderColor: `${theme.primaryColor}40`,
                              color: theme.primaryColor,
                            }}
                          >
                            {content.eyebrow}
                          </span>
                        )}
                        <h1
                          className={`font-serif font-bold tracking-tight leading-tight ${
                            isMobile ? "text-xl sm:text-2xl" : isTablet ? "text-2xl sm:text-3xl" : "text-3xl sm:text-4xl"
                          }`}
                        >
                          {content.headline}
                        </h1>
                        <p className="text-zinc-300 text-xs sm:text-sm leading-relaxed">
                          {content.description}
                        </p>
                      </div>

                      {content.offer?.fileName && (
                        <div className="p-3.5 rounded-2xl bg-white/[0.06] border border-white/10 flex items-center gap-3">
                          <PackageCheck
                            className="w-5 h-5 shrink-0"
                            style={{ color: theme.primaryColor }}
                          />
                          <div className="min-w-0">
                            <div className="text-xs font-semibold text-white truncate">
                              {content.offer.fileName}
                            </div>
                            <div className="text-[10px] text-zinc-400 font-mono">Instant delivery on signup</div>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Bento Card 2: Interactive Form */}
                    <div
                      className={`${
                        isDesktop
                          ? "col-span-5"
                          : isTablet
                          ? "col-span-1"
                          : "w-full"
                      } p-5 sm:p-6 rounded-3xl bg-[#121216]/95 border border-white/15 shadow-2xl flex flex-col justify-center`}
                    >
                      <div className="text-xs font-mono uppercase tracking-wider text-zinc-400 font-semibold mb-3 flex items-center justify-between">
                        <span>Access Pass</span>
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                      </div>
                      {renderFormInputs("bento")}
                    </div>

                    {/* Bento Card 3: Hero Media */}
                    {content.hero && (
                      <div
                        className={`${
                          isDesktop
                            ? "col-span-7"
                            : isTablet
                            ? "col-span-1"
                            : "w-full"
                        } rounded-3xl overflow-hidden border border-white/10 shadow-2xl bg-black/50 min-h-[180px] sm:min-h-[220px]`}
                      >
                        {content.hero.type === "video" ? (
                          <video
                            src={content.hero.url}
                            autoPlay
                            muted
                            loop
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <img
                            src={content.hero.url}
                            alt="Hero Preview"
                            className="w-full h-full object-cover"
                          />
                        )}
                      </div>
                    )}

                    {/* Bento Card 4: Social Proof Snippet */}
                    <div
                      className={`${
                        isDesktop
                          ? "col-span-5"
                          : isTablet
                          ? "col-span-2"
                          : "w-full"
                      } p-5 rounded-3xl bg-white/[0.03] border border-white/10 shadow-xl flex flex-col justify-between`}
                    >
                      <div className="text-[10px] font-mono uppercase tracking-wider text-zinc-400 font-semibold mb-2">
                        Proof of Excellence
                      </div>
                      {content.testimonials && content.testimonials.length > 0 ? (
                        <div className="space-y-2">
                          <p className="text-xs text-zinc-300 italic">
                            &ldquo;{content.testimonials[0].quote}&rdquo;
                          </p>
                          <div className="text-[11px] font-semibold text-white">
                            — {content.testimonials[0].name}
                          </div>
                        </div>
                      ) : (
                        <p className="text-xs text-zinc-400 italic">
                          Join hundreds of elite creators accelerating their reach.
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {/* 2. GLASSMORPHISM */}
                {theme.template === "glass" && (
                  <div className="relative my-2 sm:my-4">
                    {/* Glowing ambient orbs responsive sizing */}
                    <div
                      className={`absolute rounded-full blur-3xl opacity-30 pointer-events-none -top-6 -left-6 ${
                        isMobile ? "w-36 h-36" : "w-64 h-64"
                      }`}
                      style={{ backgroundColor: theme.primaryColor }}
                    />
                    <div
                      className={`absolute rounded-full bg-cyan-500/25 blur-3xl pointer-events-none -bottom-6 -right-6 ${
                        isMobile ? "w-36 h-36" : "w-64 h-64"
                      }`}
                    />

                    <div
                      className={`relative rounded-3xl backdrop-blur-2xl bg-white/[0.07] border border-white/20 shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] space-y-6 sm:space-y-8 ${
                        isMobile ? "p-4 sm:p-5" : isTablet ? "p-6 sm:p-8" : "p-8 sm:p-10"
                      }`}
                    >
                      <div className="text-center max-w-xl mx-auto space-y-3">
                        {content.eyebrow && (
                          <span className="inline-block px-3 py-1 rounded-full text-[10px] font-mono tracking-wider font-semibold bg-white/10 border border-white/25 text-white shadow-xs backdrop-blur-md">
                            {content.eyebrow}
                          </span>
                        )}
                        <h1
                          className={`font-serif font-bold tracking-tight leading-tight text-white drop-shadow-sm ${
                            isMobile ? "text-2xl sm:text-3xl" : "text-3xl sm:text-4xl"
                          }`}
                        >
                          {content.headline}
                        </h1>
                        <p className="text-zinc-200 text-xs sm:text-sm leading-relaxed">
                          {content.description}
                        </p>
                      </div>

                      {content.hero && (
                        <div className="max-w-2xl mx-auto rounded-2xl overflow-hidden border border-white/20 shadow-2xl backdrop-blur-md">
                          {content.hero.type === "video" ? (
                            <video src={content.hero.url} autoPlay muted loop className="w-full h-auto object-cover" />
                          ) : (
                            <img src={content.hero.url} alt="Hero" className="w-full h-auto object-cover" />
                          )}
                        </div>
                      )}

                      <div className="max-w-md mx-auto p-5 sm:p-6 rounded-2xl backdrop-blur-xl bg-black/40 border border-white/20 shadow-2xl">
                        {renderFormInputs("glass")}
                      </div>
                    </div>
                  </div>
                )}

                {/* 3. SPLIT SCREEN */}
                {theme.template === "split" && (
                  <div
                    className={`gap-6 sm:gap-8 items-center ${
                      isDesktop
                        ? "grid grid-cols-2 text-left"
                        : isTablet
                        ? "flex flex-col text-left gap-6"
                        : "flex flex-col text-center gap-5"
                    }`}
                  >
                    <div className="space-y-4 w-full">
                      {content.eyebrow && (
                        <span
                          className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase tracking-wider font-semibold border"
                          style={{
                            backgroundColor: `${theme.primaryColor}15`,
                            borderColor: `${theme.primaryColor}40`,
                            color: theme.primaryColor,
                          }}
                        >
                          {content.eyebrow}
                        </span>
                      )}
                      <h1
                        className={`font-serif font-bold tracking-tight leading-tight ${
                          isMobile ? "text-xl sm:text-2xl" : isTablet ? "text-2xl sm:text-3xl" : "text-2xl sm:text-4xl"
                        }`}
                      >
                        {content.headline}
                      </h1>
                      <p className="text-zinc-300 text-xs sm:text-sm leading-relaxed">
                        {content.description}
                      </p>

                      {content.hero && (
                        <div className="rounded-2xl overflow-hidden border border-white/10 shadow-2xl my-4">
                          {content.hero.type === "video" ? (
                            <video src={content.hero.url} autoPlay muted loop className="w-full h-auto object-cover" />
                          ) : (
                            <img src={content.hero.url} alt="Hero" className="w-full h-auto object-cover" />
                          )}
                        </div>
                      )}
                    </div>

                    <div className="w-full max-w-md mx-auto">
                      <div
                        className={`rounded-2xl bg-[#121216]/95 border border-white/10 shadow-2xl ${
                          isMobile ? "p-4 sm:p-5" : "p-6"
                        }`}
                      >
                        {renderFormInputs("split")}
                      </div>
                    </div>
                  </div>
                )}

                {/* 4. EDITORIAL / MAGAZINE */}
                {theme.template === "editorial" && (
                  <div className="space-y-5 sm:space-y-6">
                    {/* Magazine Header Masthead */}
                    <div
                      className={`border-t-2 border-b border-zinc-700/80 py-2.5 font-serif uppercase tracking-widest text-zinc-400 text-[10px] ${
                        isMobile ? "flex flex-col gap-1 text-center" : "flex items-center justify-between"
                      }`}
                    >
                      <span>Vol. IX — Special Edition</span>
                      {!isMobile && <span>The Creator Monograph</span>}
                      <span>Published {new Date().getFullYear()}</span>
                    </div>

                    <div
                      className={`gap-6 sm:gap-8 items-start pt-2 sm:pt-4 ${
                        isDesktop ? "grid grid-cols-12" : "flex flex-col"
                      }`}
                    >
                      <div className={`${isDesktop ? "col-span-7" : "w-full"} space-y-4 text-left`}>
                        {content.eyebrow && (
                          <div className="text-xs font-mono uppercase tracking-widest font-semibold text-amber-400">
                            § {content.eyebrow}
                          </div>
                        )}
                        <h1
                          className={`font-serif italic font-bold tracking-tight leading-[1.12] ${
                            isMobile ? "text-2xl sm:text-3xl" : isTablet ? "text-3xl sm:text-4xl" : "text-3xl sm:text-5xl"
                          }`}
                        >
                          &ldquo;{content.headline}&rdquo;
                        </h1>
                        <div className="h-0.5 w-16 bg-amber-500/60 my-3" />
                        <p className="text-zinc-300 font-serif text-xs sm:text-sm md:text-base leading-relaxed">
                          {content.description}
                        </p>

                        {content.hero && (
                          <div className="rounded-sm overflow-hidden border border-zinc-700 shadow-xl my-4 grayscale contrast-125 hover:grayscale-0 transition-all duration-500">
                            {content.hero.type === "video" ? (
                              <video src={content.hero.url} autoPlay muted loop className="w-full h-auto object-cover" />
                            ) : (
                              <img src={content.hero.url} alt="Hero" className="w-full h-auto object-cover" />
                            )}
                          </div>
                        )}
                      </div>

                      <div className={`${isDesktop ? "col-span-5" : "w-full"} p-5 sm:p-6 rounded-sm bg-zinc-900/90 border border-zinc-700 shadow-xl`}>
                        <div className="text-[11px] font-serif uppercase tracking-widest text-zinc-400 border-b border-zinc-800 pb-2 mb-4">
                          Request Manuscript Access
                        </div>
                        {renderFormInputs("editorial")}
                      </div>
                    </div>
                  </div>
                )}

                {/* 5. MINIMALISM */}
                {theme.template === "minimal" && (
                  <div
                    className={`max-w-xl mx-auto text-center ${
                      isMobile ? "py-4 space-y-4" : isTablet ? "py-8 space-y-6" : "py-12 space-y-7"
                    }`}
                  >
                    {content.eyebrow && (
                      <span className="text-[10px] font-mono tracking-widest uppercase text-zinc-500">
                        {content.eyebrow}
                      </span>
                    )}
                    <h1
                      className={`font-sans font-medium tracking-tight leading-snug ${
                        isMobile ? "text-xl sm:text-2xl" : "text-2xl sm:text-3xl"
                      }`}
                    >
                      {content.headline}
                    </h1>
                    <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed max-w-md mx-auto">
                      {content.description}
                    </p>

                    {content.hero && (
                      <div className="rounded-xl overflow-hidden shadow-lg my-5 max-w-sm mx-auto">
                        <img src={content.hero.url} alt="Hero" className="w-full h-auto object-cover" />
                      </div>
                    )}

                    <div className="pt-2 max-w-md mx-auto">
                      {renderFormInputs("minimal")}
                    </div>
                  </div>
                )}

                {/* 6. BRUTALISM */}
                {theme.template === "brutalist" && (
                  <div className="space-y-6 sm:space-y-8 text-left">
                    <div className="space-y-3 sm:space-y-4">
                      {content.eyebrow && (
                        <div className="inline-block bg-white text-black font-mono font-black text-xs px-3 py-1 uppercase border-2 border-white shadow-[3px_3px_0px_0px_#000]">
                          {content.eyebrow}
                        </div>
                      )}
                      <h1
                        className={`font-mono font-black uppercase tracking-tighter leading-none border-b-4 border-white ${
                          isMobile ? "text-2xl sm:text-3xl pb-3" : "text-3xl sm:text-5xl pb-4"
                        }`}
                      >
                        {content.headline}
                      </h1>
                      <p className="font-mono text-xs sm:text-sm text-zinc-300 leading-relaxed max-w-2xl">
                        {content.description}
                      </p>
                    </div>

                    <div
                      className={`gap-6 items-start ${
                        isDesktop ? "grid grid-cols-12" : "flex flex-col"
                      }`}
                    >
                      {content.hero && (
                        <div
                          className={`${
                            isDesktop ? "col-span-7" : "w-full"
                          } border-3 border-white ${
                            isMobile
                              ? "shadow-[4px_4px_0px_0px_#ffffff]"
                              : "shadow-[6px_6px_0px_0px_#ffffff]"
                          } rounded-none bg-black`}
                        >
                          <img src={content.hero.url} alt="Hero" className="w-full h-auto object-cover rounded-none" />
                        </div>
                      )}
                      <div
                        className={`${
                          isDesktop ? "col-span-5" : "w-full"
                        } p-5 sm:p-6 border-3 border-white bg-black ${
                          isMobile
                            ? "shadow-[4px_4px_0px_0px_#ffffff]"
                            : "shadow-[6px_6px_0px_0px_#ffffff]"
                        } rounded-none`}
                      >
                        <div className="font-mono font-black text-xs uppercase mb-4 text-white border-b-2 border-white pb-1">
                          [ OPT-IN ENTRY ]
                        </div>
                        {renderFormInputs("brutalist")}
                      </div>
                    </div>
                  </div>
                )}

                {/* 7. NEUMORPHISM */}
                {theme.template === "neumorphic" && (
                  <div
                    className={`max-w-2xl mx-auto rounded-3xl bg-[#161820] border border-white/[0.04] shadow-[-10px_-10px_24px_rgba(255,255,255,0.03),10px_10px_30px_rgba(0,0,0,0.8)] ${
                      isMobile ? "p-5 space-y-4" : isTablet ? "p-7 space-y-6" : "p-8 sm:p-10 space-y-6"
                    }`}
                  >
                    <div className="text-center space-y-2.5 sm:space-y-3">
                      {content.eyebrow && (
                        <span className="inline-block px-3 py-1 rounded-full text-[10px] font-mono tracking-wider font-semibold text-zinc-400 shadow-[inset_2px_2px_4px_rgba(0,0,0,0.7),inset_-2px_-2px_4px_rgba(255,255,255,0.03)] bg-[#13141a]">
                          {content.eyebrow}
                        </span>
                      )}
                      <h1
                        className={`font-serif font-bold tracking-tight leading-tight ${
                          isMobile ? "text-xl sm:text-2xl" : "text-2xl sm:text-3xl"
                        }`}
                      >
                        {content.headline}
                      </h1>
                      <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed max-w-lg mx-auto">
                        {content.description}
                      </p>
                    </div>

                    {content.hero && (
                      <div className="rounded-2xl overflow-hidden shadow-[inset_3px_3px_8px_rgba(0,0,0,0.9)] p-1 bg-[#13141a]">
                        <img src={content.hero.url} alt="Hero" className="w-full h-auto object-cover rounded-xl" />
                      </div>
                    )}

                    <div className="max-w-md mx-auto pt-2">
                      {renderFormInputs("neumorphic")}
                    </div>
                  </div>
                )}

                {/* 8. AURORA / GRADIENT MESH */}
                {theme.template === "aurora" && (
                  <div
                    className={`relative rounded-3xl border border-indigo-400/30 bg-black/40 backdrop-blur-xl shadow-[0_0_60px_-15px_rgba(99,102,241,0.35)] overflow-hidden ${
                      isMobile ? "p-5 space-y-5" : isTablet ? "p-7 space-y-6" : "p-8 sm:p-10 space-y-8"
                    }`}
                  >
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-500/25 via-purple-500/15 to-transparent pointer-events-none" />

                    <div className="relative text-center max-w-xl mx-auto space-y-2.5 sm:space-y-3">
                      {content.eyebrow && (
                        <span className="inline-block px-3 py-1 rounded-full text-[10px] font-mono tracking-wider uppercase font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 shadow-xs">
                          {content.eyebrow}
                        </span>
                      )}
                      <h1
                        className={`font-bold tracking-tight leading-tight bg-gradient-to-r from-white via-indigo-100 to-purple-200 bg-clip-text text-transparent ${
                          isMobile ? "text-2xl sm:text-3xl" : "text-3xl sm:text-4xl"
                        }`}
                      >
                        {content.headline}
                      </h1>
                      <p className="text-zinc-300 text-xs sm:text-sm leading-relaxed">
                        {content.description}
                      </p>
                    </div>

                    {content.hero && (
                      <div className="relative max-w-xl mx-auto rounded-2xl overflow-hidden border border-indigo-400/30 shadow-2xl">
                        <img src={content.hero.url} alt="Hero" className="w-full h-auto object-cover" />
                      </div>
                    )}

                    <div className="relative max-w-md mx-auto p-5 sm:p-6 rounded-2xl bg-black/60 border border-indigo-400/30 shadow-2xl">
                      {renderFormInputs("aurora")}
                    </div>
                  </div>
                )}

                {/* 9. Y2K CYBER RETRO */}
                {theme.template === "y2k" && (
                  <div
                    className={`relative border-2 border-cyan-400 shadow-[0_0_25px_rgba(0,240,255,0.25)] bg-black/90 bg-[linear-gradient(to_right,#ffffff0c_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0c_1px,transparent_1px)] bg-[size:20px_20px] ${
                      isMobile ? "p-4 space-y-4" : "p-6 sm:p-8 space-y-6"
                    }`}
                  >
                    <div className="flex items-center justify-between border-b border-cyan-400/40 pb-2">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 bg-pink-500 shadow-[0_0_8px_#ff007f]" />
                        <span className="text-[10px] font-mono font-bold text-cyan-300 uppercase tracking-widest">
                          Y2K.NET // PORTAL v2.0
                        </span>
                      </div>
                      <span className="px-2 py-0.5 rounded-xs text-[9px] font-mono font-black bg-gradient-to-r from-pink-500 to-cyan-400 text-black">
                        CYBER READY
                      </span>
                    </div>

                    <div className="space-y-2.5 sm:space-y-3 text-left">
                      {content.eyebrow && (
                        <span className="inline-block px-2.5 py-0.5 text-[10px] font-mono uppercase tracking-widest bg-pink-500/20 text-pink-400 border border-pink-500">
                          {content.eyebrow}
                        </span>
                      )}
                      <h1
                        className={`font-mono font-black uppercase tracking-wide text-cyan-300 drop-shadow-[0_0_10px_rgba(0,240,255,0.5)] ${
                          isMobile ? "text-xl sm:text-2xl" : "text-2xl sm:text-4xl"
                        }`}
                      >
                        {content.headline}
                      </h1>
                      <p className="font-mono text-xs text-zinc-300 leading-relaxed">
                        {content.description}
                      </p>
                    </div>

                    <div
                      className={`gap-5 sm:gap-6 items-center pt-2 ${
                        isDesktop ? "grid grid-cols-2" : "flex flex-col"
                      }`}
                    >
                      {content.hero && (
                        <div className="w-full border-2 border-pink-500 shadow-[0_0_15px_rgba(255,0,127,0.3)]">
                          <img src={content.hero.url} alt="Hero" className="w-full h-auto object-cover" />
                        </div>
                      )}
                      <div className="w-full p-4 border border-cyan-400/60 bg-black/80">
                        {renderFormInputs("y2k")}
                      </div>
                    </div>
                  </div>
                )}

                {/* 10. ASYMMETRIC LAYOUT (Default fallback for unrecognized/legacy) */}
                {(theme.template === "asymmetric" ||
                  theme.template === "card" ||
                  theme.template === "immersive" ||
                  theme.template === "letter" ||
                  theme.template === "overlay") && (
                  <div className="space-y-6 sm:space-y-8">
                    <div className="text-left space-y-3 sm:space-y-4 max-w-2xl">
                      {content.eyebrow && (
                        <span className="inline-block -rotate-1 px-3 py-1 rounded-sm text-[10px] font-mono uppercase tracking-wider font-bold bg-amber-400 text-black shadow-md">
                          {content.eyebrow}
                        </span>
                      )}
                      <h1
                        className={`font-serif font-bold tracking-tight leading-[1.08] ${
                          isMobile ? "text-2xl sm:text-3xl" : "text-3xl sm:text-5xl"
                        }`}
                      >
                        {content.headline}
                      </h1>
                      <p className="text-zinc-300 text-xs sm:text-sm leading-relaxed">
                        {content.description}
                      </p>
                    </div>

                    <div className={`relative pt-2 sm:pt-4 ${isDesktop ? "" : "flex flex-col gap-4"}`}>
                      {content.hero && (
                        <div
                          className={`rounded-3xl overflow-hidden border border-white/15 shadow-2xl ${
                            isDesktop ? "md:w-5/6" : "w-full"
                          }`}
                        >
                          <img src={content.hero.url} alt="Hero" className="w-full h-auto object-cover max-h-[360px]" />
                        </div>
                      )}
                      <div
                        className={`rounded-3xl bg-[#131317]/95 border border-white/20 shadow-2xl backdrop-blur-md ${
                          isDesktop
                            ? "md:-mt-24 md:ml-auto md:w-1/2 p-6 sm:p-8 relative z-10"
                            : "w-full p-5 sm:p-6"
                        }`}
                      >
                        <div className="text-xs font-mono uppercase tracking-wider text-amber-400 font-semibold mb-3">
                          Exclusive Reservation
                        </div>
                        {renderFormInputs("asymmetric")}
                      </div>
                    </div>
                  </div>
                )}

                {/* 11. DARK ACADEMIA */}
                {theme.template === "dark-academia" && (
                  <div className="space-y-6 sm:space-y-8 text-left">
                    {/* Classical Roman Header Plate */}
                    <div className="border-t border-b border-[#8c6d48]/40 py-2 flex items-center justify-between font-serif text-[10px] tracking-widest text-[#d4a373] uppercase">
                      <span>Liber Primus // Folio 104</span>
                      <span className="hidden sm:inline">Scholarly Monograph & Archive</span>
                      <span>Anno Domini MMXXIV</span>
                    </div>

                    <div
                      className={`gap-6 sm:gap-8 items-start pt-2 ${
                        isDesktop ? "grid grid-cols-12" : "flex flex-col"
                      }`}
                    >
                      <div className={`${isDesktop ? "col-span-7" : "w-full"} space-y-4`}>
                        {content.eyebrow && (
                          <div className="inline-block px-2.5 py-0.5 font-serif uppercase tracking-widest text-[9px] border border-[#8c6d48] text-[#d4a373] bg-[#1a130e]">
                            § {content.eyebrow}
                          </div>
                        )}
                        <h1
                          className={`font-serif italic font-bold tracking-tight text-[#f5ebd7] leading-[1.15] ${
                            isMobile ? "text-2xl sm:text-3xl" : isTablet ? "text-3xl sm:text-4xl" : "text-3xl sm:text-5xl"
                          }`}
                        >
                          &ldquo;{content.headline}&rdquo;
                        </h1>
                        <div className="w-16 h-0.5 bg-[#8c6d48]/60 my-2" />
                        <p className="text-[#c8b8a6] font-serif text-xs sm:text-sm leading-relaxed">
                          {content.description}
                        </p>

                        {content.hero && (
                          <div className="rounded-none overflow-hidden border-2 border-[#8c6d48]/50 shadow-2xl my-4 sepia contrast-110">
                            {content.hero.type === "video" ? (
                              <video src={content.hero.url} autoPlay muted loop className="w-full h-auto object-cover" />
                            ) : (
                              <img src={content.hero.url} alt="Hero" className="w-full h-auto object-cover" />
                            )}
                          </div>
                        )}
                      </div>

                      <div className={`${isDesktop ? "col-span-5" : "w-full"} p-5 sm:p-6 rounded-none bg-[#140f0c]/95 border border-[#8c6d48]/50 shadow-2xl relative`}>
                        <div className="text-[11px] font-serif uppercase tracking-widest text-[#d4a373] border-b border-[#8c6d48]/30 pb-2 mb-4 flex items-center justify-between">
                          <span>Ex Libris Opt-in</span>
                          <span className="text-[#8c6d48]">✦</span>
                        </div>
                        {renderFormInputs("dark-academia")}
                      </div>
                    </div>
                  </div>
                )}

                {/* 12. FAIRYCORE / DREAMCORE */}
                {theme.template === "fairycore" && (
                  <div className="relative my-2 sm:my-4">
                    {/* Dreamy Pastel Glow Halos */}
                    <div
                      className={`absolute rounded-full blur-3xl opacity-35 pointer-events-none -top-8 -left-8 bg-gradient-to-tr from-pink-300 via-purple-300 to-indigo-300 ${
                        isMobile ? "w-40 h-40" : "w-72 h-72"
                      }`}
                    />
                    <div
                      className={`absolute rounded-full blur-3xl opacity-35 pointer-events-none -bottom-8 -right-8 bg-gradient-to-br from-cyan-200 via-pink-200 to-purple-300 ${
                        isMobile ? "w-40 h-40" : "w-72 h-72"
                      }`}
                    />

                    <div
                      className={`relative rounded-3xl backdrop-blur-2xl bg-white/[0.08] border border-pink-200/30 shadow-[0_0_50px_rgba(230,190,250,0.25)] space-y-6 sm:space-y-8 ${
                        isMobile ? "p-4 sm:p-5" : isTablet ? "p-6 sm:p-8" : "p-8 sm:p-10"
                      }`}
                    >
                      <div className="text-center max-w-xl mx-auto space-y-3">
                        {content.eyebrow && (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-mono tracking-widest bg-pink-400/20 text-pink-200 border border-pink-300/40 shadow-xs">
                            <Sparkles className="w-3 h-3 text-pink-300" />
                            <span>{content.eyebrow}</span>
                          </span>
                        )}
                        <h1
                          className={`font-serif font-bold tracking-tight leading-tight text-white drop-shadow-[0_0_15px_rgba(244,194,244,0.4)] ${
                            isMobile ? "text-2xl sm:text-3xl" : "text-3xl sm:text-4xl"
                          }`}
                        >
                          {content.headline}
                        </h1>
                        <p className="text-pink-100/90 text-xs sm:text-sm leading-relaxed">
                          {content.description}
                        </p>
                      </div>

                      {content.hero && (
                        <div className="max-w-xl mx-auto rounded-3xl overflow-hidden border border-pink-200/30 shadow-[0_0_30px_rgba(244,194,244,0.3)]">
                          <img src={content.hero.url} alt="Hero" className="w-full h-auto object-cover" />
                        </div>
                      )}

                      <div className="max-w-md mx-auto p-5 sm:p-6 rounded-3xl backdrop-blur-xl bg-black/40 border border-purple-200/30 shadow-2xl">
                        {renderFormInputs("fairycore")}
                      </div>
                    </div>
                  </div>
                )}

                {/* 13. DIEGETIC UI (Sci-Fi / Tactical Terminal HUD) */}
                {theme.template === "diegetic" && (
                  <div
                    className={`relative border border-emerald-500/50 bg-[#04100c]/95 shadow-[0_0_30px_rgba(16,185,129,0.2)] ${
                      isMobile ? "p-4 space-y-4" : "p-6 sm:p-8 space-y-6"
                    }`}
                  >
                    {/* Top Tactical Telemetry Bar */}
                    <div className="flex items-center justify-between border-b border-emerald-500/40 pb-2 text-[10px] font-mono text-emerald-400 uppercase tracking-widest">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                        <span>[TERMINAL.HUD_v4.2]</span>
                      </div>
                      <div className="hidden sm:flex items-center gap-4 text-emerald-500/80">
                        <span>LAT: 37.7749° N</span>
                        <span>LINK: ENCRYPTED</span>
                      </div>
                      <span>SYS: NOMINAL</span>
                    </div>

                    <div className="space-y-3 text-left">
                      {content.eyebrow && (
                        <span className="inline-block px-2 py-0.5 font-mono text-[9px] uppercase tracking-widest bg-emerald-950/80 text-emerald-400 border border-emerald-500/70">
                          &gt; {content.eyebrow}
                        </span>
                      )}
                      <h1
                        className={`font-mono font-bold uppercase tracking-tight text-emerald-300 drop-shadow-[0_0_12px_rgba(16,185,129,0.4)] ${
                          isMobile ? "text-xl sm:text-2xl" : "text-2xl sm:text-4xl"
                        }`}
                      >
                        {content.headline}
                      </h1>
                      <p className="font-mono text-xs text-emerald-200/80 leading-relaxed max-w-2xl">
                        {content.description}
                      </p>
                    </div>

                    <div
                      className={`gap-5 sm:gap-6 items-stretch pt-2 ${
                        isDesktop ? "grid grid-cols-12" : "flex flex-col"
                      }`}
                    >
                      {content.hero && (
                        <div
                          className={`${
                            isDesktop ? "col-span-7" : "w-full"
                          } border border-emerald-500/40 relative overflow-hidden bg-black/60`}
                        >
                          <div className="absolute top-2 left-2 text-[9px] font-mono text-emerald-400/70 z-10">
                            CAM_FEED // 01
                          </div>
                          <img src={content.hero.url} alt="Feed" className="w-full h-full object-cover opacity-90" />
                        </div>
                      )}
                      <div
                        className={`${
                          isDesktop ? "col-span-5" : "w-full"
                        } p-4 sm:p-5 border border-emerald-500/60 bg-[#020b08]/90 relative`}
                      >
                        <div className="text-[10px] font-mono uppercase tracking-widest text-emerald-400 border-b border-emerald-500/30 pb-1.5 mb-3 flex items-center justify-between">
                          <span>OPERATOR AUTHENTICATION</span>
                          <span>[OK]</span>
                        </div>
                        {renderFormInputs("diegetic")}
                      </div>
                    </div>
                  </div>
                )}

                {/* 14. COMIC / COMIC-BOOK UI */}
                {theme.template === "comic" && (
                  <div className="space-y-5 sm:space-y-6 text-left">
                    {/* Comic Header Masthead */}
                    <div className="border-4 border-black bg-yellow-400 p-2 sm:p-3 flex items-center justify-between shadow-[4px_4px_0px_#000]">
                      <span className="font-black uppercase tracking-wider text-black text-xs sm:text-sm -rotate-1">
                        ★ ISSUE NO. 1: SPECIAL HERO EDITION ★
                      </span>
                      <span className="px-2 py-0.5 bg-red-600 text-white font-black text-[10px] uppercase border-2 border-black rotate-2 shadow-[2px_2px_0px_#000]">
                        ACTION PACKED!
                      </span>
                    </div>

                    <div
                      className={`gap-6 items-start pt-2 ${
                        isDesktop ? "grid grid-cols-12" : "flex flex-col"
                      }`}
                    >
                      <div className={`${isDesktop ? "col-span-7" : "w-full"} space-y-4`}>
                        {content.eyebrow && (
                          <div className="inline-block font-black uppercase text-xs px-3 py-1 bg-cyan-400 text-black border-3 border-black shadow-[3px_3px_0px_#000] -rotate-1">
                            {content.eyebrow}
                          </div>
                        )}
                        <h1
                          className={`font-black uppercase tracking-tight text-black bg-yellow-300 border-4 border-black p-4 shadow-[6px_6px_0px_#000] leading-tight ${
                            isMobile ? "text-xl sm:text-2xl" : isTablet ? "text-2xl sm:text-3xl" : "text-3xl sm:text-4xl"
                          }`}
                        >
                          &ldquo;{content.headline}&rdquo;
                        </h1>
                        <div className="p-3 bg-white border-3 border-black shadow-[4px_4px_0px_#000] font-bold text-xs sm:text-sm text-black leading-relaxed">
                          {content.description}
                        </div>

                        {content.hero && (
                          <div className="border-4 border-black shadow-[6px_6px_0px_#000] overflow-hidden my-3 rotate-1 bg-white">
                            <img src={content.hero.url} alt="Comic Panel" className="w-full h-auto object-cover" />
                          </div>
                        )}
                      </div>

                      <div className={`${isDesktop ? "col-span-5" : "w-full"} p-5 sm:p-6 border-4 border-black bg-amber-50 shadow-[6px_6px_0px_#000]`}>
                        <div className="font-black text-xs uppercase mb-3 text-black border-b-3 border-black pb-1.5 flex items-center justify-between">
                          <span>MISSION ENROLLMENT</span>
                          <span className="text-red-500 font-black">POW!</span>
                        </div>
                        {renderFormInputs("comic")}
                      </div>
                    </div>
                  </div>
                )}

                {/* 15. RISO / RISOGRAPH */}
                {theme.template === "riso" && (
                  <div className="space-y-6 text-left relative bg-[#fbf8f3] text-[#1d3557] p-5 sm:p-7 border-2 border-[#1d3557] shadow-[6px_6px_0px_#ff4081]">
                    {/* Riso Registration Marks */}
                    <div className="flex items-center justify-between border-b-2 border-[#1d3557] pb-2 font-mono text-[10px] text-[#1d3557]">
                      <span className="font-bold">PRINT EDITION // COLOR SEPARATION [C, M, Y, K]</span>
                      <span className="font-bold">+ REG_MARK +</span>
                    </div>

                    <div
                      className={`gap-6 items-start pt-2 ${
                        isDesktop ? "grid grid-cols-12" : "flex flex-col"
                      }`}
                    >
                      <div className={`${isDesktop ? "col-span-7" : "w-full"} space-y-4`}>
                        {content.eyebrow && (
                          <div className="inline-block font-mono font-bold uppercase text-[9px] px-2 py-0.5 bg-[#ffb703] text-[#1d3557] border border-[#1d3557]">
                            {content.eyebrow}
                          </div>
                        )}
                        <h1
                          className={`font-serif font-black tracking-tight text-[#1d3557] leading-tight ${
                            isMobile ? "text-2xl sm:text-3xl" : "text-3xl sm:text-5xl"
                          }`}
                        >
                          {content.headline}
                        </h1>
                        <p className="font-mono text-xs sm:text-sm text-[#1d3557]/90 leading-relaxed">
                          {content.description}
                        </p>

                        {content.hero && (
                          <div className="border-2 border-[#1d3557] shadow-[4px_4px_0px_#1d3557] overflow-hidden my-3">
                            <img src={content.hero.url} alt="Riso Hero" className="w-full h-auto object-cover" />
                          </div>
                        )}
                      </div>

                      <div className={`${isDesktop ? "col-span-5" : "w-full"} p-5 border-2 border-[#1d3557] bg-white shadow-[5px_5px_0px_#ff4081]`}>
                        <div className="font-mono font-bold text-xs uppercase mb-3 text-[#1d3557] border-b border-[#1d3557] pb-1">
                          ARCHIVE SIGNUP
                        </div>
                        {renderFormInputs("riso")}
                      </div>
                    </div>
                  </div>
                )}

                {/* 16. SKEUOMORPHISM */}
                {theme.template === "skeuomorphic" && (
                  <div
                    className={`relative rounded-2xl bg-gradient-to-b from-[#2a2c33] to-[#1c1d22] border border-[#444855] shadow-[0_12px_32px_rgba(0,0,0,0.8),inset_0_1px_1px_rgba(255,255,255,0.25)] ${
                      isMobile ? "p-5 space-y-5" : isTablet ? "p-7 space-y-6" : "p-8 sm:p-10 space-y-7"
                    }`}
                  >
                    {/* Metallic Screws in Corners */}
                    <div className="w-2.5 h-2.5 rounded-full bg-[#3d414d] border border-[#1e2025] shadow-[inset_1px_1px_1px_rgba(255,255,255,0.3)] absolute top-3 left-3" />
                    <div className="w-2.5 h-2.5 rounded-full bg-[#3d414d] border border-[#1e2025] shadow-[inset_1px_1px_1px_rgba(255,255,255,0.3)] absolute top-3 right-3" />
                    <div className="w-2.5 h-2.5 rounded-full bg-[#3d414d] border border-[#1e2025] shadow-[inset_1px_1px_1px_rgba(255,255,255,0.3)] absolute bottom-3 left-3" />
                    <div className="w-2.5 h-2.5 rounded-full bg-[#3d414d] border border-[#1e2025] shadow-[inset_1px_1px_1px_rgba(255,255,255,0.3)] absolute bottom-3 right-3" />

                    <div className="text-center max-w-xl mx-auto space-y-3">
                      {content.eyebrow && (
                        <span className="inline-block rounded-md font-mono text-[9px] uppercase px-2.5 py-0.5 bg-[#141519] text-amber-400 border border-amber-500/30 shadow-[inset_1px_1px_2px_rgba(0,0,0,0.9)]">
                          {content.eyebrow}
                        </span>
                      )}
                      <h1
                        className={`font-sans font-bold tracking-tight leading-tight text-zinc-100 drop-shadow-[0_2px_3px_rgba(0,0,0,0.9)] ${
                          isMobile ? "text-xl sm:text-2xl" : "text-2xl sm:text-3xl"
                        }`}
                      >
                        {content.headline}
                      </h1>
                      <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed">
                        {content.description}
                      </p>
                    </div>

                    {content.hero && (
                      <div className="max-w-md mx-auto rounded-xl p-1 bg-[#141519] border border-[#353842] shadow-[inset_3px_3px_8px_rgba(0,0,0,0.9)] overflow-hidden">
                        <img src={content.hero.url} alt="Hero" className="w-full h-auto object-cover rounded-lg" />
                      </div>
                    )}

                    <div className="max-w-md mx-auto p-5 sm:p-6 rounded-xl bg-[#141519] border border-[#2e313b] shadow-[inset_3px_3px_10px_rgba(0,0,0,0.9)]">
                      {renderFormInputs("skeuomorphic")}
                    </div>
                  </div>
                )}

                {/* 17. MEMPHIS DESIGN */}
                {theme.template === "memphis" && (
                  <div
                    className={`space-y-6 text-left bg-amber-50 border-4 border-black p-5 sm:p-7 shadow-[8px_8px_0px_#ff6b8b] relative ${
                      isMobile ? "p-4 space-y-4" : "p-6 sm:p-8 space-y-6"
                    }`}
                  >
                    {/* Postmodern Floating Shapes */}
                    <div className="flex items-center justify-between border-b-3 border-black pb-2">
                      <div className="flex items-center gap-2">
                        <span className="w-3 h-3 bg-[#00f0ff] border border-black rotate-45" />
                        <span className="w-3 h-3 rounded-full bg-[#ff6b8b] border border-black" />
                        <span className="text-[11px] font-black uppercase text-black">
                          MEMPHIS STUDIO 80s
                        </span>
                      </div>
                      <span className="rounded-full font-black uppercase tracking-wider text-[9px] px-2.5 py-0.5 bg-[#ffd166] text-black border-2 border-black rotate-2 shadow-[2px_2px_0px_#000]">
                        POSTMODERN
                      </span>
                    </div>

                    <div
                      className={`gap-6 items-start pt-2 ${
                        isDesktop ? "grid grid-cols-12" : "flex flex-col"
                      }`}
                    >
                      <div className={`${isDesktop ? "col-span-7" : "w-full"} space-y-4`}>
                        {content.eyebrow && (
                          <div className="inline-block rounded-full font-black uppercase tracking-wider text-[10px] px-3 py-1 bg-[#ff6b8b] text-white border-2 border-black shadow-[2px_2px_0px_#000] -rotate-2">
                            {content.eyebrow}
                          </div>
                        )}
                        <h1
                          className={`font-black uppercase tracking-tight text-black leading-tight bg-white border-3 border-black p-4 shadow-[5px_5px_0px_#00f0ff] ${
                            isMobile ? "text-xl sm:text-2xl" : isTablet ? "text-2xl sm:text-3xl" : "text-3xl sm:text-4xl"
                          }`}
                        >
                          {content.headline}
                        </h1>
                        <p className="font-sans font-bold text-xs sm:text-sm text-black/80 leading-relaxed">
                          {content.description}
                        </p>

                        {content.hero && (
                          <div className="border-3 border-black shadow-[6px_6px_0px_#000000] overflow-hidden my-3 -rotate-1 bg-white">
                            <img src={content.hero.url} alt="Memphis Hero" className="w-full h-auto object-cover" />
                          </div>
                        )}
                      </div>

                      <div className={`${isDesktop ? "col-span-5" : "w-full"} p-5 sm:p-6 border-3 border-black bg-white shadow-[6px_6px_0px_#000000]`}>
                        <div className="font-black text-xs uppercase mb-3 text-black border-b-2 border-black pb-1 flex items-center justify-between">
                          <span>VIP ACCESS LIST</span>
                          <span className="text-[#ff6b8b]">★</span>
                        </div>
                        {renderFormInputs("memphis")}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* 1. Social Proof (Always Above Additional Content) */}
            {content.additionalContentEnabled &&
              content.testimonials &&
              content.testimonials.length > 0 &&
              !isViewingSuccess && (
                <div className="mt-8 pt-8 border-t border-white/10 space-y-4 text-left">
                  <div className="text-center text-xs font-mono uppercase tracking-wider text-zinc-400 font-semibold">
                    Trusted By Industry Leaders
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {content.testimonials.map((t) => (
                      <div
                        key={t.id}
                        className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-2 text-left shadow-lg"
                      >
                        <p className="text-xs text-zinc-300 italic leading-relaxed">
                          &ldquo;{t.quote}&rdquo;
                        </p>
                        <div className="flex items-center gap-2.5 pt-1">
                          {t.photoUrl && (
                            <img
                              src={t.photoUrl}
                              alt={t.name}
                              className="w-7 h-7 rounded-full object-cover border border-white/20"
                            />
                          )}
                          <div>
                            <div className="text-xs font-semibold text-white">
                              {t.name}
                            </div>
                            <div className="text-[10px] text-zinc-400">
                              {t.title}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            {/* 2. Modular Additional Content Blocks (Embeds, Rich Text, FAQs) */}
            {!isViewingSuccess && content.contentBlocks && content.contentBlocks.length > 0 && (
              <div className="mt-8 space-y-6 text-left">
                {content.contentBlocks.map((block) => {
                  if (block.type === "embed" && block.embedUrl) {
                    const embedSrc = getEmbedIframeSrc(block.embedUrl);
                    return (
                      <div key={block.id} className="space-y-2">
                        {block.embedTitle && (
                          <div className="text-xs font-mono uppercase tracking-wider text-zinc-400 font-semibold flex items-center gap-2">
                            <Video className="w-3.5 h-3.5 text-red-500" />
                            <span>{block.embedTitle}</span>
                          </div>
                        )}
                        <div className="relative w-full aspect-video rounded-2xl overflow-hidden border border-white/10 shadow-2xl bg-black">
                          {embedSrc ? (
                            <iframe
                              src={embedSrc}
                              title={block.embedTitle || "Video Player"}
                              className="w-full h-full border-0"
                              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                              allowFullScreen
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-zinc-500 text-xs font-mono">
                              Invalid video embed URL
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  }

                  if (block.type === "text") {
                    return (
                      <div
                        key={block.id}
                        className="p-5 sm:p-6 rounded-2xl bg-white/[0.04] border border-white/10 space-y-2 text-left shadow-lg"
                      >
                        {block.title && (
                          <h3 className="text-sm sm:text-base font-bold text-white font-serif">
                            {block.title}
                          </h3>
                        )}
                        {block.content && (
                          <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed whitespace-pre-wrap">
                            {block.content}
                          </p>
                        )}
                      </div>
                    );
                  }

                  if (block.type === "faq" && block.faqs && block.faqs.length > 0) {
                    return (
                      <div
                        key={block.id}
                        className="p-5 sm:p-6 rounded-2xl bg-white/[0.04] border border-white/10 space-y-4 text-left shadow-lg"
                      >
                        <div className="text-xs font-mono uppercase tracking-wider text-zinc-400 font-semibold flex items-center gap-1.5">
                          <HelpCircle className="w-3.5 h-3.5 text-amber-400" />
                          <span>Frequently Asked Questions</span>
                        </div>
                        <div className="space-y-3">
                          {block.faqs.map((faq, fIdx) => (
                            <div
                              key={fIdx}
                              className="p-3 rounded-xl bg-white/[0.03] border border-white/5 space-y-1"
                            >
                              <div className="text-xs sm:text-sm font-semibold text-white">
                                {faq.question}
                              </div>
                              <div className="text-xs text-zinc-300 leading-relaxed">
                                {faq.answer}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  }

                  return null;
                })}
              </div>
            )}

            {/* Sponsor Cards Section (Matching Screenshot 1) */}
            {!isViewingSuccess && content.sponsorsEnabled && content.sponsors && content.sponsors.length > 0 && (
              <div className="mt-8 pt-6 border-t border-white/10 space-y-3.5 text-left">
                <div className="text-[11px] font-mono uppercase tracking-wider text-zinc-400 font-semibold flex items-center justify-between">
                  <span>Sponsored By</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 font-sans">
                    Partner Showcase
                  </span>
                </div>

                <div
                  className={`gap-3.5 ${
                    content.sponsors.length > 1
                      ? isMobile
                        ? "grid grid-cols-1"
                        : "grid grid-cols-2"
                      : "grid grid-cols-1"
                  }`}
                >
                  {content.sponsors.map((sponsor) => (
                    <div
                      key={sponsor.id}
                      className="p-4 rounded-2xl bg-[#121216]/85 backdrop-blur-md border border-white/10 hover:border-white/20 shadow-xl flex flex-col justify-between space-y-3 transition-all group"
                    >
                      {/* Top: Logo / Preview & Info */}
                      <div className="flex items-start gap-3">
                        {sponsor.logoUrl ? (
                          <img
                            src={sponsor.logoUrl}
                            alt="Sponsor Logo"
                            className="w-11 h-11 rounded-xl object-contain bg-white/5 border border-white/10 p-1 shrink-0"
                          />
                        ) : sponsor.imageUrl ? (
                          <img
                            src={sponsor.imageUrl}
                            alt="Sponsor"
                            className="w-11 h-11 rounded-xl object-cover border border-white/10 shrink-0"
                          />
                        ) : null}

                        <div className="min-w-0 flex-1 space-y-1">
                          {sponsor.description && (
                            <p className="text-xs text-zinc-300 line-clamp-2 leading-snug">
                              {sponsor.description}
                            </p>
                          )}
                          {sponsor.offerLine && (
                            <div className="inline-block text-[10px] font-semibold text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-md">
                              {sponsor.offerLine}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Optional larger sponsor visual banner */}
                      {sponsor.imageUrl && !sponsor.logoUrl && (
                        <div className="rounded-xl overflow-hidden border border-white/10 max-h-32">
                          <img
                            src={sponsor.imageUrl}
                            alt="Sponsor Media"
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                      )}

                      {/* Bottom: Learn More button */}
                      <a
                        href={sponsor.buttonUrl || "#"}
                        target="_blank"
                        rel="noreferrer noopener"
                        className="py-2 px-4 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 cursor-pointer shadow-md transition-all hover:brightness-110 active:scale-[0.98] text-center"
                        style={{
                          backgroundColor: theme.primaryColor || "#f59e0b",
                          color: "#000000",
                          fontFamily: getHeadlineFontFamily(),
                        }}
                      >
                        <span>{sponsor.buttonText || "Learn More"}</span>
                        <ExternalLink className="w-3 h-3 shrink-0" />
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Bottom Platform Branding (Matching Screenshot 1) */}
            {!isViewingSuccess && (
              <div className="pt-8 pb-4 text-center">
                <span className="text-[11px] font-mono text-zinc-500 tracking-wider">
                  Made with {theme.logoText || "VueMagnet"}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
