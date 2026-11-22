import type { DataTableColumn } from "../types/data-table-column-types";

/** The column id: `id`, else `accessorKey`. */
export function columnId<TData>(column: DataTableColumn<TData>): string {
  return column.id ?? (column.accessorKey as string);
}

/** Whether the column has a plain-text label (`label`, or a string `header`). */
export function hasPlainLabel<TData>(column: DataTableColumn<TData>): boolean {
  return column.label !== undefined || typeof column.header === "string";
}

/** The column's plain-text label: `label`, else a string `header`, else its id. */
export function columnLabel<TData>(column: DataTableColumn<TData>): string {
  if (column.label !== undefined) return column.label;
  return typeof column.header === "string" ? column.header : columnId(column);
}
