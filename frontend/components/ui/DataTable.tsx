"use client";

import React from "react";

export interface Column<T> {
  key: keyof T | string;
  header: string;
  render?: (value: any, row: T) => React.ReactNode;
  className?: string;
}

export interface DataTableProps<T extends Record<string, unknown>> {
  columns: Column<T>[];
  rows: T[];
  onRowClick?: (row: T) => void;
  emptyMessage?: string;
  className?: string;
}

/**
 * DataTable — clean, responsive data table with theme styling,
 * row click callbacks, custom cell formatters, and empty state support.
 */
export function DataTable<T extends Record<string, unknown>>({
  columns,
  rows,
  onRowClick,
  emptyMessage = "No records found.",
  className = "",
}: DataTableProps<T>) {
  if (rows.length === 0) {
    return (
      <div className="bg-card border border-border rounded-xl p-8 text-center">
        <p className="text-sm text-muted-foreground">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className={`overflow-x-auto rounded-xl border border-border bg-card ${className}`}>
      <table className="w-full text-left text-sm border-collapse">
        <thead>
          <tr className="border-b border-border bg-muted/40">
            {columns.map((col) => (
              <th
                key={String(col.key)}
                className={`py-3.5 px-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground ${
                  col.className || ""
                }`}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {rows.map((row, i) => (
            <tr
              key={i}
              onClick={() => onRowClick?.(row)}
              className={`transition-colors ${
                onRowClick
                  ? "cursor-pointer hover:bg-muted/60 active:bg-muted"
                  : "hover:bg-muted/30"
              }`}
            >
              {columns.map((col) => {
                const val = (row as any)[col.key];
                return (
                  <td
                    key={String(col.key)}
                    className={`py-3.5 px-4 text-foreground align-middle ${col.className || ""}`}
                  >
                    {col.render ? col.render(val, row) : String(val ?? "")}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
