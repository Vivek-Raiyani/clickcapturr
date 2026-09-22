"use client";

import React, { useEffect, useState, useRef } from "react";
import { Download, Copy, Check, QrCode as QrIcon, Save, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/Button";
import type { QRConfig, QRDotsStyle, QRCornersSquareStyle, QRCornersDotStyle, QRGradientType } from "@/types/qr";

export interface QrPreviewProps {
  url: string;
  title?: string;
  shortCode?: string;
  initialConfig?: QRConfig | null;
  onSaveConfig?: (config: QRConfig) => void;
  isSaving?: boolean;
}

function hexToRgba(hex: string, opacity: number): string {
  let r = 0, g = 0, b = 0;
  hex = hex.replace("#", "");
  if (hex.length === 3) {
    r = parseInt(hex[0] + hex[0], 16);
    g = parseInt(hex[1] + hex[1], 16);
    b = parseInt(hex[2] + hex[2], 16);
  } else if (hex.length === 6) {
    r = parseInt(hex.substring(0, 2), 16);
    g = parseInt(hex.substring(2, 4), 16);
    b = parseInt(hex.substring(4, 6), 16);
  }
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
}

async function getRoundedImageUrl(src: string, radiusPercent: number): Promise<string> {
  if (!src || radiusPercent <= 0) return src;
  
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");
      if (!ctx) return resolve(src);

      const radius = Math.min(img.width, img.height) * (radiusPercent / 100);
      ctx.beginPath();
      ctx.moveTo(radius, 0);
      ctx.lineTo(img.width - radius, 0);
      ctx.quadraticCurveTo(img.width, 0, img.width, radius);
      ctx.lineTo(img.width, img.height - radius);
      ctx.quadraticCurveTo(img.width, img.height, img.width - radius, img.height);
      ctx.lineTo(radius, img.height);
      ctx.quadraticCurveTo(0, img.height, 0, img.height - radius);
      ctx.lineTo(0, radius);
      ctx.quadraticCurveTo(0, 0, radius, 0);
      ctx.closePath();
      
      ctx.clip();
      ctx.drawImage(img, 0, 0);
      resolve(canvas.toDataURL("image/png"));
    };
    img.onerror = () => resolve(src);
    img.src = src;
  });
}

export function QrPreview({ url, title, shortCode, initialConfig, onSaveConfig, isSaving }: QrPreviewProps) {
  const qrRef = useRef<HTMLDivElement>(null);
  const qrCodeRef = useRef<any>(null);
  const [copied, setCopied] = useState(false);

  const [config, setConfig] = useState<QRConfig>(
    initialConfig || {
      dotsType: "square",
      cornersSquareType: "square",
      cornersDotType: "square",
      fgColor: "#09090b",
      bgColor: "#ffffff",
      logoUrl: "",
      errorCorrection: "M",
      logoSize: 0.4,
      logoMargin: 5,
      logoRadius: 0,
      bgOpacity: 1,
    }
  );

  const [colorMode, setColorMode] = useState<"solid" | "gradient">(
    initialConfig?.fgGradient ? "gradient" : "solid"
  );

  useEffect(() => {
    // Dynamic import to prevent SSR document undefined error
    const initQr = async () => {
      const QRCodeStyling = (await import("qr-code-styling")).default;
      
      if (!qrCodeRef.current) {
        qrCodeRef.current = new QRCodeStyling({
          width: 250, // slightly larger for center layout
          height: 250,
          margin: 10,
          data: url,
        });
        if (qrRef.current) {
          qrRef.current.innerHTML = "";
          qrCodeRef.current.append(qrRef.current);
        }
      }

      const gradientOptions = (colorMode === "gradient" && config.fgGradient) ? {
        type: config.fgGradient.type,
        rotation: config.fgGradient.rotation || 0,
        colorStops: [
          { offset: 0, color: config.fgGradient.startColor },
          { offset: 1, color: config.fgGradient.endColor }
        ]
      } : undefined;

      const solidColor = colorMode === "solid" ? (config.fgColor || "#000000") : undefined;
      
      const opacity = config.bgOpacity !== undefined ? config.bgOpacity : (config.bgImageUrl ? 0.8 : 1);
      const isTransparent = config.bgColor === "transparent" || opacity === 0;
      const actualBgColor = isTransparent 
        ? "transparent" 
        : hexToRgba(config.bgColor || "#ffffff", opacity);

      // Process logo image for rounded corners if needed
      const finalLogoUrl = config.logoUrl 
        ? await getRoundedImageUrl(config.logoUrl, config.logoRadius || 0)
        : undefined;

      // Update options
      qrCodeRef.current.update({
        data: url,
        dotsOptions: { 
          type: config.dotsType || "square", 
          color: solidColor,
          gradient: gradientOptions
        },
        cornersSquareOptions: { 
          type: config.cornersSquareType || "square", 
          color: solidColor,
        },
        cornersDotOptions: { 
          type: config.cornersDotType || "square", 
          color: solidColor,
        },
        backgroundOptions: { color: actualBgColor },
        image: finalLogoUrl,
        imageOptions: { 
          crossOrigin: "anonymous", 
          margin: config.logoMargin ?? 5,
          imageSize: config.logoSize ?? 0.4 
        },
        qrOptions: { errorCorrectionLevel: (config.logoUrl ? "H" : (config.errorCorrection || "M")) },
      });
    };
    initQr();
  }, [url, config, colorMode]);

  const handleCopy = () => {
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = async () => {
    if (!qrCodeRef.current) return;

    if (config.bgImageUrl) {
      try {
        const qrBlob = await qrCodeRef.current.getRawData("png");
        if (!qrBlob) throw new Error("No Blob");
        const qrUrl = URL.createObjectURL(qrBlob);

        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        
        const [bgImg, qrImg] = await Promise.all([
          new Promise<HTMLImageElement>((resolve, reject) => {
            const img = new Image();
            img.crossOrigin = "anonymous";
            img.onload = () => resolve(img);
            img.onerror = reject;
            img.src = config.bgImageUrl!;
          }),
          new Promise<HTMLImageElement>((resolve, reject) => {
            const img = new Image();
            img.onload = () => resolve(img);
            img.onerror = reject;
            img.src = qrUrl;
          })
        ]);

        canvas.width = qrImg.width;
        canvas.height = qrImg.height;
        
        if (ctx) {
          const scale = Math.max(canvas.width / bgImg.width, canvas.height / bgImg.height);
          const w = bgImg.width * scale;
          const h = bgImg.height * scale;
          const x = (canvas.width - w) / 2;
          const y = (canvas.height - h) / 2;
          ctx.drawImage(bgImg, x, y, w, h);
          ctx.drawImage(qrImg, 0, 0);

          const compositeUrl = canvas.toDataURL("image/png");
          const a = document.createElement("a");
          a.href = compositeUrl;
          a.download = `lycan-qr-${shortCode || "link"}.png`;
          a.click();
        }
        URL.revokeObjectURL(qrUrl);
        return;
      } catch (err) {
        console.error("Background composite failed, falling back to standard download.", err);
      }
    }

    // Standard download
    await qrCodeRef.current.download({
      name: `lycan-qr-${shortCode || "link"}`,
      extension: "png",
    });
  };

  const updateConfig = (updates: Partial<QRConfig>) => {
    setConfig((prev) => ({ ...prev, ...updates }));
  };

  return (
    <div className="bg-theme-card border border-theme-border rounded-xl p-5 shadow-xs flex flex-col w-full">
      <div className="flex items-center gap-2 text-xs font-semibold text-theme-primary uppercase tracking-wider mb-6 justify-center">
        <QrIcon className="w-4 h-4" />
        <span>{title || "Scannable Target"}</span>
      </div>

      <div className="space-y-6">
        {/* TOP: PATTERNS */}
        <div>
          <label className="block text-xs font-medium text-theme-text-muted mb-3 text-center">Pattern Style</label>
          <div className="flex flex-wrap justify-center gap-2">
            {["square", "dots", "rounded", "classy", "extra-rounded"].map((type) => (
              <button
                key={type}
                onClick={() => updateConfig({ dotsType: type as QRDotsStyle })}
                className={`py-1.5 px-3 text-[11px] rounded-lg border capitalize transition-colors ${
                  config.dotsType === type
                    ? "bg-theme-primary/10 border-theme-primary text-theme-primary font-medium"
                    : "border-theme-border bg-theme-surface text-theme-text-muted hover:text-theme-text hover:border-theme-border/80"
                }`}
              >
                {type.replace("-", " ")}
              </button>
            ))}
          </div>
        </div>

        {/* MIDDLE: LEFT (Eyes) | CENTER (Preview) | RIGHT (Colors) */}
        <div className="flex flex-col lg:flex-row gap-6 items-start justify-between border-t border-theme-border pt-6">
          
          {/* Left Column: Eye Config */}
          <div className="w-full lg:w-1/4 space-y-5">
            <div>
              <label className="block text-xs font-medium text-theme-text-muted mb-2">Eye Frame</label>
              <select
                value={config.cornersSquareType || "square"}
                onChange={(e) => updateConfig({ cornersSquareType: e.target.value as QRCornersSquareStyle })}
                className="w-full text-xs bg-theme-surface border border-theme-border rounded-lg px-2.5 py-1.5 text-theme-text focus:outline-none focus:border-theme-primary"
              >
                <option value="square">Square</option>
                <option value="dot">Dot</option>
                <option value="extra-rounded">Extra Rounded</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-theme-text-muted mb-2">Eye Center</label>
              <select
                value={config.cornersDotType || "square"}
                onChange={(e) => updateConfig({ cornersDotType: e.target.value as QRCornersDotStyle })}
                className="w-full text-xs bg-theme-surface border border-theme-border rounded-lg px-2.5 py-1.5 text-theme-text focus:outline-none focus:border-theme-primary"
              >
                <option value="square">Square</option>
                <option value="dot">Dot</option>
              </select>
            </div>
          </div>

          {/* Center Column: Preview & Download */}
          <div className="w-full lg:w-1/2 flex flex-col items-center">
            <div 
              className="rounded-xl shadow-md border border-theme-border/50 mb-4 overflow-hidden flex items-center justify-center p-2 relative" 
              style={{ 
                minHeight: "270px", 
                minWidth: "270px",
                backgroundColor: config.bgImageUrl ? "transparent" : (config.bgColor || "#ffffff"),
                backgroundImage: config.bgImageUrl ? `url(${config.bgImageUrl})` : "none",
                backgroundSize: "cover",
                backgroundPosition: "center"
              }}
            >
              {/* Ensure the canvas sits inside cleanly */}
              <div ref={qrRef} className="[&>canvas]:max-w-[250px] [&>canvas]:max-h-[250px]" />
            </div>
            <div className="flex items-center gap-3 w-full max-w-[270px]">
              <Button variant="secondary" size="sm" onClick={handleCopy} className="flex-1">
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? "Copied" : "Link"}</span>
              </Button>
              <Button variant="primary" size="sm" onClick={handleDownload} className="flex-1">
                <Download className="w-3.5 h-3.5" />
                <span>Save PNG</span>
              </Button>
            </div>
          </div>

          {/* Right Column: Colors */}
          <div className="w-full lg:w-1/4 space-y-5">
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-xs font-medium text-theme-text-muted">QR Color</label>
                <select
                  value={colorMode}
                  onChange={(e) => {
                    setColorMode(e.target.value as "solid" | "gradient");
                    if (e.target.value === "gradient" && !config.fgGradient) {
                      updateConfig({ fgGradient: { type: "linear", startColor: config.fgColor || "#000000", endColor: "#d97706" } });
                    }
                  }}
                  className="text-[10px] bg-theme-surface border border-theme-border rounded px-1.5 py-0.5 text-theme-text"
                >
                  <option value="solid">Solid</option>
                  <option value="gradient">Gradient</option>
                </select>
              </div>

              {colorMode === "solid" ? (
                <div className="flex gap-3 items-center">
                  <input
                    type="color"
                    value={config.fgColor || "#000000"}
                    onChange={(e) => updateConfig({ fgColor: e.target.value })}
                    className="w-8 h-8 rounded-md cursor-pointer border-0 p-0 bg-transparent shrink-0"
                  />
                  <span className="text-xs font-mono text-theme-text-muted uppercase truncate">{config.fgColor}</span>
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  <div className="flex items-center gap-3">
                    <input
                      type="color"
                      value={config.fgGradient?.startColor || "#000000"}
                      onChange={(e) => updateConfig({ fgGradient: { ...(config.fgGradient || { type: "linear", endColor: "#000" }), startColor: e.target.value } })}
                      className="w-8 h-8 rounded-md cursor-pointer border-0 p-0 bg-transparent shrink-0"
                    />
                    <span className="text-xs text-theme-text-muted">to</span>
                    <input
                      type="color"
                      value={config.fgGradient?.endColor || "#d97706"}
                      onChange={(e) => updateConfig({ fgGradient: { ...(config.fgGradient || { type: "linear", startColor: "#000" }), endColor: e.target.value } })}
                      className="w-8 h-8 rounded-md cursor-pointer border-0 p-0 bg-transparent shrink-0"
                    />
                  </div>
                  <select
                    value={config.fgGradient?.type || "linear"}
                    onChange={(e) => updateConfig({ fgGradient: { ...(config.fgGradient || { startColor: "#000", endColor: "#000" }), type: e.target.value as QRGradientType } })}
                    className="w-full text-xs bg-theme-surface border border-theme-border rounded-lg px-2.5 py-1.5 text-theme-text focus:outline-none focus:border-theme-primary"
                  >
                    <option value="linear">Linear</option>
                    <option value="radial">Radial</option>
                  </select>
                </div>
              )}
            </div>
            
            <div>
              <label className="block text-xs font-medium text-theme-text-muted mb-2">QR Background Mask</label>
              <div className="flex flex-col gap-3">
                <div className="flex gap-3 items-center">
                  <input
                    type="color"
                    value={config.bgColor || "#ffffff"}
                    onChange={(e) => updateConfig({ bgColor: e.target.value })}
                    className="w-8 h-8 rounded-md cursor-pointer border-0 p-0 bg-transparent shrink-0"
                    disabled={config.bgOpacity === 0}
                  />
                  <span className="text-xs font-mono text-theme-text-muted uppercase truncate">
                    {config.bgOpacity === 0 ? "Clear" : (config.bgColor || "#ffffff")}
                  </span>
                </div>
                {config.bgImageUrl && (
                  <div>
                    <label className="block text-[10px] text-theme-text-muted mb-1.5">Mask Opacity ({(config.bgOpacity ?? 0.8) * 100}%)</label>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.05"
                      value={config.bgOpacity ?? 0.8}
                      onChange={(e) => updateConfig({ bgOpacity: parseFloat(e.target.value) })}
                      className="w-full accent-theme-primary"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* BOTTOM: Branding & Background Image */}
        <div className="pt-6 border-t border-theme-border grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-theme-text-muted mb-2">
                <ImageIcon className="w-3.5 h-3.5 inline mr-1" />
                Background Image URL
              </label>
              <input
                type="url"
                placeholder="e.g. https://images.unsplash.com/..."
                value={config.bgImageUrl || ""}
                onChange={(e) => updateConfig({ bgImageUrl: e.target.value })}
                className="w-full text-xs bg-theme-surface border border-theme-border rounded-lg px-3 py-2 text-theme-text focus:outline-none focus:border-theme-primary"
              />
              <p className="text-[10px] text-theme-text-muted mt-1">Overrides background color when active.</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-theme-text-muted mb-2">Center Logo URL (Optional)</label>
              <input
                type="url"
                placeholder="https://example.com/logo.png"
                value={config.logoUrl || ""}
                onChange={(e) => updateConfig({ logoUrl: e.target.value })}
                className="w-full text-xs bg-theme-surface border border-theme-border rounded-lg px-3 py-2 text-theme-text focus:outline-none focus:border-theme-primary"
              />
            </div>

            {config.logoUrl && (
              <div className="grid grid-cols-3 gap-4 bg-theme-surface p-3 rounded-lg border border-theme-border">
                <div>
                  <label className="block text-[10px] text-theme-text-muted mb-1">Logo Size ({(config.logoSize || 0.4) * 100}%)</label>
                  <input
                    type="range"
                    min="0.1"
                    max="0.6"
                    step="0.05"
                    value={config.logoSize || 0.4}
                    onChange={(e) => updateConfig({ logoSize: parseFloat(e.target.value) })}
                    className="w-full accent-theme-primary"
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-theme-text-muted mb-1">Logo Margin ({config.logoMargin ?? 5}px)</label>
                  <input
                    type="range"
                    min="0"
                    max="20"
                    step="1"
                    value={config.logoMargin ?? 5}
                    onChange={(e) => updateConfig({ logoMargin: parseInt(e.target.value) })}
                    className="w-full accent-theme-primary"
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-theme-text-muted mb-1">Logo Radius ({config.logoRadius ?? 0}%)</label>
                  <input
                    type="range"
                    min="0"
                    max="50"
                    step="1"
                    value={config.logoRadius ?? 0}
                    onChange={(e) => updateConfig({ logoRadius: parseInt(e.target.value) })}
                    className="w-full accent-theme-primary"
                  />
                </div>
              </div>
            )}
          </div>
        </div>
          
        {onSaveConfig && (
          <div className="pt-2">
            <Button
              variant="primary"
              size="sm"
              onClick={() => onSaveConfig(config)}
              isLoading={isSaving}
              className="w-full"
            >
              <Save className="w-4 h-4" />
              <span>Save Design to Database</span>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
