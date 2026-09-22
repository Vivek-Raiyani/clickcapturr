"use client";

import { Modal } from "./Modal";
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
  return (
    <Modal open={open} onClose={onCancel} title={title} description={description} maxWidth="sm">
      <div className="flex justify-end gap-3 pt-2">
        <Button variant="secondary" onClick={onCancel}>{cancelLabel}</Button>
        <Button variant={isDangerous ? "danger" : "primary"} onClick={onConfirm}>{confirmLabel}</Button>
      </div>
    </Modal>
  );
}
