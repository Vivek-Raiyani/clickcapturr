"use client";

import { AlertTriangle, Info, CheckCircle } from "lucide-react";
import { Button } from "./Button";

/**
 * ConfirmDialog — THE single reusable confirm/delete modal.
 * Used for: delete-page, delete-link, delete-form-field, delete-account, etc.
 * Only props change per call site — never create a second confirm modal.
 */
export function ConfirmDialog({
  open,
  title,
  description,
  highlight,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  isDangerous = false,
  isLoading = false,
  onConfirm,
  onCancel,
}: {
  open: boolean;
  title: string;
  /** Main warning/description shown below the title */
  description: string;
  /** Optional highlighted item name shown between title and description */
  highlight?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  isDangerous?: boolean;
  isLoading?: boolean;
  onConfirm: () => void | Promise<void>;
  onCancel: () => void;
}) {
  if (!open) return null;

  const Icon = isDangerous ? AlertTriangle : Info;
  const iconBg = isDangerous
    ? "bg-red-500/10 border-red-500/20"
    : "bg-primary/10 border-primary/20";
  const iconColor = isDangerous ? "text-red-400" : "text-primary";

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150"
      onClick={(e) => e.target === e.currentTarget && !isLoading && onCancel()}
    >
      <div className="relative w-full max-w-sm rounded-2xl bg-card border border-border shadow-2xl p-6 animate-in zoom-in-95 duration-150">
        {/* Icon */}
        <div className={`w-12 h-12 ${iconBg} border rounded-2xl flex items-center justify-center mx-auto mb-4`}>
          <Icon className={`w-6 h-6 ${iconColor}`} />
        </div>

        {/* Title */}
        <h2 className="text-lg font-bold text-foreground text-center mb-1">{title}</h2>

        {/* Optional highlighted item name */}
        {highlight && (
          <p className="text-sm font-semibold text-foreground text-center mb-3 truncate px-4">
            "{highlight}"
          </p>
        )}

        {/* Description */}
        <p className="text-xs text-muted-foreground text-center mb-6 bg-muted/60 rounded-xl px-4 py-2.5 border border-border leading-relaxed">
          {description}
        </p>

        {/* Actions */}
        <div className="flex gap-3">
          <Button
            variant="secondary"
            className="flex-1"
            disabled={isLoading}
            onClick={onCancel}
          >
            {cancelLabel}
          </Button>
          <Button
            variant={isDangerous ? "danger" : "primary"}
            className={`flex-1 ${isDangerous ? "!bg-red-500 hover:!bg-red-600 !text-white !border-red-500" : ""}`}
            isLoading={isLoading}
            onClick={onConfirm}
          >
            {confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}
