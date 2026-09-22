"use client";

import { useEffect } from "react";
import { X, CheckCircle2, AlertCircle, Info, AlertTriangle } from "lucide-react";

/** Toast — ephemeral notification for success/error feedback. */
export function Toast({
  message,
  type = "info",
  onDismiss,
}: {
  message: string;
  type?: "info" | "success" | "error" | "warning";
  onDismiss: () => void;
}) {
  useEffect(() => {
    const timer = setTimeout(onDismiss, 5000);
    return () => clearTimeout(timer);
  }, [onDismiss]);

  const icons = {
    info: <Info className="w-5 h-5 text-blue-500" />,
    success: <CheckCircle2 className="w-5 h-5 text-emerald-500" />,
    error: <AlertCircle className="w-5 h-5 text-red-500" />,
    warning: <AlertTriangle className="w-5 h-5 text-amber-500" />
  };

  return (
    <div role="status" aria-live="polite" className="pointer-events-auto flex items-center justify-between gap-4 w-full max-w-sm bg-card border border-border shadow-lg rounded-xl p-4 animate-in slide-in-from-bottom-5 fade-in duration-300">
      <div className="flex items-center gap-3">
        {icons[type]}
        <span className="text-sm font-medium text-foreground">{message}</span>
      </div>
      <button onClick={onDismiss} aria-label="Dismiss" className="text-muted-foreground hover:text-foreground transition-colors">
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}
