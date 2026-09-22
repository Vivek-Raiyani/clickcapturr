"use client";

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
  // TODO: implement with Tailwind + auto-dismiss timer
  return (
    <div role="status" aria-live="polite">
      <span>{message}</span>
      <button onClick={onDismiss} aria-label="Dismiss">×</button>
    </div>
  );
}
