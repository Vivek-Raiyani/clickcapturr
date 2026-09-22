"use client";

import * as React from "react";
import { Plus, Trash2, ChevronUp, ChevronDown, Check, GripVertical } from "lucide-react";
import type { FormField, FormFieldType, FormFieldOption } from "@/types";

export interface FormFieldEditorProps {
  fields: FormField[];
  onChange: (fields: FormField[]) => void;
}

const FIELD_TYPES: Array<{ type: FormFieldType; label: string }> = [
  { type: "text", label: "Text Field" },
  { type: "email", label: "Email Address" },
  { type: "phone", label: "Phone Number" },
  { type: "select", label: "Dropdown Select" },
  { type: "custom", label: "Custom Input" },
];

/**
 * FormFieldEditor handles adding, editing, reordering, and deleting
 * custom form fields configured for a creator landing page.
 *
 * Fully styled with the application's unified theme design tokens
 * (`theme-surface`, `theme-card`, `theme-border`, `theme-text`, `theme-primary`).
 */
export function FormFieldEditor({ fields, onChange }: FormFieldEditorProps) {
  const addField = () => {
    const newField: FormField = {
      id: `field-${Date.now()}`,
      pageId: "",
      label: "New Question / Field",
      fieldType: "text",
      isRequired: true,
      sortOrder: fields.length,
      optionsJson: null,
      createdAt: new Date().toISOString(),
    };
    onChange([...fields, newField]);
  };

  const removeField = (id: string) => {
    onChange(fields.filter((f) => f.id !== id));
  };

  const updateField = (id: string, patch: Partial<FormField>) => {
    onChange(
      fields.map((f) => {
        if (f.id !== id) return f;
        const updated = { ...f, ...patch };
        // If type changed to select and optionsJson is null, initialize choices
        if (patch.fieldType === "select" && !updated.optionsJson) {
          updated.optionsJson = [
            { label: "Option 1", value: "option-1" },
            { label: "Option 2", value: "option-2" },
          ];
        }
        return updated;
      })
    );
  };

  const moveField = (index: number, direction: "up" | "down") => {
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= fields.length) return;
    const clone = [...fields];
    const temp = clone[index];
    clone[index] = clone[targetIndex];
    clone[targetIndex] = temp;
    // Update sortOrder
    onChange(clone.map((f, i) => ({ ...f, sortOrder: i })));
  };

  const addSelectOption = (fieldId: string) => {
    const field = fields.find((f) => f.id === fieldId);
    if (!field) return;
    const currentOptions = field.optionsJson || [];
    const newOption: FormFieldOption = {
      label: `Option ${currentOptions.length + 1}`,
      value: `option-${currentOptions.length + 1}`,
    };
    updateField(fieldId, { optionsJson: [...currentOptions, newOption] });
  };

  const removeSelectOption = (fieldId: string, optIndex: number) => {
    const field = fields.find((f) => f.id === fieldId);
    if (!field || !field.optionsJson) return;
    updateField(fieldId, {
      optionsJson: field.optionsJson.filter((_, i) => i !== optIndex),
    });
  };

  const updateSelectOption = (
    fieldId: string,
    optIndex: number,
    label: string
  ) => {
    const field = fields.find((f) => f.id === fieldId);
    if (!field || !field.optionsJson) return;
    const updated = field.optionsJson.map((opt, i) =>
      i === optIndex ? { ...opt, label, value: label.toLowerCase().replace(/\s+/g, "-") } : opt
    );
    updateField(fieldId, { optionsJson: updated });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="text-xs font-semibold text-theme-text">Lead Capture Fields</h4>
          <p className="text-[11px] text-theme-text-muted">
            Define questions viewers must fill to claim your offer
          </p>
        </div>
        <button
          type="button"
          onClick={addField}
          className="px-2.5 py-1 text-xs rounded-lg bg-theme-primary hover:bg-theme-primary-hover text-theme-primary-fg font-semibold flex items-center gap-1 cursor-pointer transition-colors shadow-xs"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Field</span>
        </button>
      </div>

      <div className="space-y-3">
        {fields.map((field, idx) => (
          <div
            key={field.id}
            className="p-3.5 rounded-xl bg-theme-card border border-theme-border space-y-3"
          >
            {/* Header: drag/reorder & title & delete */}
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-1.5 min-w-0">
                <GripVertical className="w-3.5 h-3.5 text-theme-text-muted shrink-0" />
                <span className="text-xs font-medium text-theme-text truncate">
                  Field #{idx + 1}: {field.label || "Untitled"}
                </span>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <button
                  type="button"
                  disabled={idx === 0}
                  onClick={() => moveField(idx, "up")}
                  className="p-1 text-theme-text-muted hover:text-theme-text disabled:opacity-30 cursor-pointer transition-colors"
                  title="Move Up"
                >
                  <ChevronUp className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  disabled={idx === fields.length - 1}
                  onClick={() => moveField(idx, "down")}
                  className="p-1 text-theme-text-muted hover:text-theme-text disabled:opacity-30 cursor-pointer transition-colors"
                  title="Move Down"
                >
                  <ChevronDown className="w-3.5 h-3.5" />
                </button>
                {["f-name", "l-name", "f-email"].includes(field.id) ? (
                  <button
                    type="button"
                    disabled
                    className="p-1 text-theme-text-muted/30 ml-1 cursor-not-allowed"
                    title="Required default field cannot be removed"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => removeField(field.id)}
                    className="p-1 text-red-400 hover:text-red-300 ml-1 cursor-pointer transition-colors"
                    title="Remove Field"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>

            {/* Label Input */}
            <div>
              <label className="block text-[10.5px] text-theme-text-muted font-medium mb-1">
                Field Label
              </label>
              <input
                type="text"
                value={field.label}
                onChange={(e) => updateField(field.id, { label: e.target.value })}
                placeholder="e.g. Work Email, Company Size"
                className="w-full bg-theme-surface border border-theme-border rounded-lg px-2.5 py-1.5 text-xs text-theme-text focus:outline-none focus:border-theme-primary transition-colors"
              />
            </div>

            {/* Type selector & Required checkbox */}
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[10.5px] text-theme-text-muted font-medium mb-1">
                  Field Type
                </label>
                <select
                  value={field.fieldType}
                  onChange={(e) =>
                    updateField(field.id, {
                      fieldType: e.target.value as FormFieldType,
                    })
                  }
                  className="w-full bg-theme-surface border border-theme-border rounded-lg px-2.5 py-1.5 text-xs text-theme-text focus:outline-none focus:border-theme-primary cursor-pointer"
                >
                  {FIELD_TYPES.map((t) => (
                    <option key={t.type} value={t.type}>
                      {t.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-end pb-1">
                <label className="flex items-center gap-2 cursor-pointer text-xs text-theme-text select-none">
                  <input
                    type="checkbox"
                    checked={field.isRequired}
                    onChange={(e) =>
                      updateField(field.id, { isRequired: e.target.checked })
                    }
                    className="w-4 h-4 rounded bg-theme-surface border-theme-border text-theme-primary focus:ring-0 cursor-pointer"
                  />
                  <span>Required field</span>
                </label>
              </div>
            </div>

            {/* If field is select, render option builder */}
            {field.fieldType === "select" && (
              <div className="pt-2 border-t border-theme-border space-y-2">
                <div className="flex items-center justify-between text-[10px] text-theme-text-muted">
                  <span>Dropdown Choices</span>
                  <button
                    type="button"
                    onClick={() => addSelectOption(field.id)}
                    className="text-theme-primary hover:text-theme-primary-hover font-medium cursor-pointer transition-colors"
                  >
                    + Add Choice
                  </button>
                </div>
                <div className="space-y-1.5">
                  {(field.optionsJson || []).map((opt, optIdx) => (
                    <div key={optIdx} className="flex items-center gap-1.5">
                      <input
                        type="text"
                        value={opt.label}
                        onChange={(e) =>
                          updateSelectOption(field.id, optIdx, e.target.value)
                        }
                        className="flex-1 bg-theme-surface border border-theme-border rounded px-2 py-1 text-xs text-theme-text focus:outline-none focus:border-theme-primary"
                        placeholder={`Option ${optIdx + 1}`}
                      />
                      <button
                        type="button"
                        onClick={() => removeSelectOption(field.id, optIdx)}
                        className="text-theme-text-muted hover:text-red-400 p-1 cursor-pointer transition-colors"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}

        {fields.length === 0 && (
          <div className="p-6 text-center rounded-xl border border-dashed border-theme-border text-theme-text-muted text-xs">
            No fields defined. Click &quot;Add Field&quot; to request information from viewers.
          </div>
        )}
      </div>
    </div>
  );
}
