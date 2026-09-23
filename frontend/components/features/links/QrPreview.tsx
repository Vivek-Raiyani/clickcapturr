"use client";

import React, { useEffect, useRef, useState } from "react";
import QRCodeStyling, {
  DrawType,
  DotType,
  CornerSquareType,
} from "qr-code-styling";
import { QRConfig } from "@/types/qr";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Download } from "lucide-react";

interface QrPreviewProps {
  url: string;
  title: string;
  shortCode: string;
  initialConfig: QRConfig | null;
  onSaveConfig: (config: QRConfig) => void;
  isSaving: boolean;
}

export const QrPreview: React.FC<QrPreviewProps> = ({
  url,
  title,
  shortCode,
  initialConfig,
  onSaveConfig,
  isSaving,
}) => {
  const [config, setConfig] = useState<QRConfig>(initialConfig || {
    type: "solid",
    pattern: "squares",
    shape: "square",
    color_palette: { solid: { primary: "#000000", secondary: "#ffffff" } },
    background_image_opacity: 1.0,
  });

  const ref = useRef<HTMLDivElement>(null);
  const qrCode = useRef<QRCodeStyling | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      qrCode.current = new QRCodeStyling({
        width: 300,
        height: 300,
        type: "svg" as DrawType,
        data: url,
        image: config.logo_url || undefined,
        dotsOptions: {
          color: config.type === "solid" ? config.color_palette?.solid?.primary || "#000000" : undefined,
          gradient: config.type === "gradient" ? {
            type: config.gradient_direction === "radial" ? "radial" : "linear",
            rotation: config.gradient_direction === "to_bottom" ? Math.PI / 2 :
                     config.gradient_direction === "to_left" ? Math.PI :
                     config.gradient_direction === "to_right" ? 0 : -Math.PI / 2,
            colorStops: [
              { offset: 0, color: config.color_palette?.gradient?.primary || "#000000" },
              { offset: 1, color: config.color_palette?.gradient?.secondary || "#000000" }
            ]
          } : undefined,
          type: config.pattern as DotType || "square"
        },
        backgroundOptions: {
          color: config.type === "solid" ? config.color_palette?.solid?.secondary || "#ffffff" : "#ffffff",
        },
        imageOptions: {
          crossOrigin: "anonymous",
          margin: 10
        },
        cornersSquareOptions: {
          type: config.shape as CornerSquareType || "square",
        }
      });
      
      if (ref.current) {
        ref.current.innerHTML = "";
        qrCode.current.append(ref.current);
      }
    }
  }, []);

  useEffect(() => {
    if (!qrCode.current) return;
    qrCode.current.update({
      data: url,
      image: config.logo_url || undefined,
      dotsOptions: {
        color: config.type === "solid" ? config.color_palette?.solid?.primary || "#000000" : undefined,
        gradient: config.type === "gradient" ? {
          type: config.gradient_direction === "radial" ? "radial" : "linear",
          rotation: config.gradient_direction === "to_bottom" ? Math.PI / 2 :
                   config.gradient_direction === "to_left" ? Math.PI :
                   config.gradient_direction === "to_right" ? 0 : -Math.PI / 2,
          colorStops: [
            { offset: 0, color: config.color_palette?.gradient?.primary || "#000000" },
            { offset: 1, color: config.color_palette?.gradient?.secondary || "#000000" }
          ]
        } : undefined,
        type: (config.pattern === "squares" ? "square" : config.pattern) as DotType || "square"
      },
      backgroundOptions: {
        color: config.type === "solid" ? config.color_palette?.solid?.secondary || "#ffffff" : "#ffffff",
      },
      cornersSquareOptions: {
        type: config.shape as CornerSquareType || "square",
      }
    });
  }, [config, url]);

  const onDownloadClick = () => {
    if (!qrCode.current) return;
    qrCode.current.download({
      extension: "png"
    });
  };

  const handleUpdateConfig = (key: keyof QRConfig, value: any) => {
    setConfig(prev => ({ ...prev, [key]: value }));
  };

  const handleColorChange = (type: "solid" | "gradient", key: "primary" | "secondary", val: string) => {
    setConfig(prev => {
      const newPalette = { ...prev.color_palette };
      if (!newPalette[type]) newPalette[type] = { primary: "#000000", secondary: "#ffffff" } as any;
      (newPalette[type] as any)[key] = val;
      return { ...prev, color_palette: newPalette };
    });
  };

  return (
    <div className="flex flex-col gap-6 md:flex-row">
      <div className="flex flex-col items-center justify-center p-6 border rounded-xl bg-muted/20 w-full md:w-1/2">
        <div ref={ref} className="bg-white p-4 rounded-xl shadow-sm mb-4" />
        <Button variant="outline" onClick={onDownloadClick} className="w-full max-w-[300px]">
          <Download className="w-4 h-4 mr-2" /> Download QR
        </Button>
      </div>

      <div className="flex flex-col gap-4 w-full md:w-1/2">
        <div>
          <h3 className="font-medium mb-1">{title}</h3>
          <p className="text-sm text-muted-foreground mb-4">Link: {shortCode}</p>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-1 block">Style Type</label>
              <select 
                className="w-full flex h-10 items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                value={config.type || "solid"} 
                onChange={(e) => handleUpdateConfig("type", e.target.value)}
              >
                <option value="solid">Solid Color</option>
                <option value="gradient">Gradient</option>
              </select>
            </div>
            
            {config.type === "solid" ? (
              <>
                <div>
                  <label className="text-sm font-medium mb-1 block">Primary Color</label>
                  <div className="flex items-center gap-2">
                    <input 
                      type="color" 
                      value={config.color_palette?.solid?.primary || "#000000"} 
                      onChange={(e) => handleColorChange("solid", "primary", e.target.value)}
                      className="w-10 h-10 p-1 rounded border cursor-pointer"
                    />
                    <Input 
                      value={config.color_palette?.solid?.primary || "#000000"} 
                      onChange={(e) => handleColorChange("solid", "primary", e.target.value)}
                    />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Background Color</label>
                  <div className="flex items-center gap-2">
                    <input 
                      type="color" 
                      value={config.color_palette?.solid?.secondary || "#ffffff"} 
                      onChange={(e) => handleColorChange("solid", "secondary", e.target.value)}
                      className="w-10 h-10 p-1 rounded border cursor-pointer"
                    />
                    <Input 
                      value={config.color_palette?.solid?.secondary || "#ffffff"} 
                      onChange={(e) => handleColorChange("solid", "secondary", e.target.value)}
                    />
                  </div>
                </div>
              </>
            ) : (
              <>
                <div>
                  <label className="text-sm font-medium mb-1 block">Gradient Direction</label>
                  <select 
                    className="w-full flex h-10 items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    value={config.gradient_direction || "to_bottom"} 
                    onChange={(e) => handleUpdateConfig("gradient_direction", e.target.value)}
                  >
                    <option value="to_bottom">To Bottom</option>
                    <option value="to_top">To Top</option>
                    <option value="to_left">To Left</option>
                    <option value="to_right">To Right</option>
                    <option value="radial">Radial</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Start Color</label>
                  <div className="flex items-center gap-2">
                    <input 
                      type="color" 
                      value={config.color_palette?.gradient?.primary || "#000000"} 
                      onChange={(e) => handleColorChange("gradient", "primary", e.target.value)}
                      className="w-10 h-10 p-1 rounded border cursor-pointer"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">End Color</label>
                  <div className="flex items-center gap-2">
                    <input 
                      type="color" 
                      value={config.color_palette?.gradient?.secondary || "#000000"} 
                      onChange={(e) => handleColorChange("gradient", "secondary", e.target.value)}
                      className="w-10 h-10 p-1 rounded border cursor-pointer"
                    />
                  </div>
                </div>
              </>
            )}

            <div>
              <label className="text-sm font-medium mb-1 block">Pattern</label>
              <select 
                className="w-full flex h-10 items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                value={config.pattern || "squares"} 
                onChange={(e) => handleUpdateConfig("pattern", e.target.value)}
              >
                <option value="squares">Squares</option>
                <option value="dots">Dots</option>
                <option value="rounded">Rounded</option>
                <option value="extra-rounded">Extra Rounded</option>
                <option value="classy">Classy</option>
                <option value="classy-rounded">Classy Rounded</option>
              </select>
            </div>

            <div>
              <label className="text-sm font-medium mb-1 block">Corners Shape</label>
              <select 
                className="w-full flex h-10 items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                value={config.shape || "square"} 
                onChange={(e) => handleUpdateConfig("shape", e.target.value)}
              >
                <option value="square">Square</option>
                <option value="dot">Dot</option>
                <option value="extra-rounded">Extra Rounded</option>
              </select>
            </div>
            
            <div className="col-span-2">
              <label className="text-sm font-medium mb-1 block">Logo URL (Optional)</label>
              <Input 
                placeholder="https://example.com/logo.png" 
                value={config.logo_url || ""} 
                onChange={(e) => handleUpdateConfig("logo_url", e.target.value)} 
              />
            </div>
          </div>
        </div>

        <Button onClick={() => onSaveConfig(config)} disabled={isSaving} className="mt-4">
          {isSaving ? "Saving..." : "Save QR Configuration"}
        </Button>
      </div>
    </div>
  );
};
