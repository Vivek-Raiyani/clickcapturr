"use client";

/**
 * ConfirmDialog — THE single reusable confirm/delete modal.
 * Used for: delete-page, delete-link, delete-form-field, delete-account, etc.
 * Only props change per call site — never create a second confirm modal.
 */
export function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  isDangerous = false,
  onConfirm,
  onCancel,
}: {
  open: boolean;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  isDangerous?: boolean;
  onConfirm: () => void | Promise<void>;
  onCancel: () => void;
}) {
  if (!open) return null;
  // TODO: implement with Modal primitive + Tailwind danger styles
  return (
    <dialog open>
      <h2>{title}</h2>
      <p>{description}</p>
      <button onClick={onCancel}>{cancelLabel}</button>
      <button onClick={onConfirm} style={{ color: isDangerous ? "red" : undefined }}>
        {confirmLabel}
      </button>
    </dialog>
  );
}
