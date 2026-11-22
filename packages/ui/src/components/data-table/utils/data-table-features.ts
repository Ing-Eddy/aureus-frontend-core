import {
  columnFilteringFeature,
  columnPinningFeature,
  columnResizingFeature,
  columnSizingFeature,
  columnVisibilityFeature,
  createFilteredRowModel,
  createPaginatedRowModel,
  createSortedRowModel,
  filterFn_includesString,
  globalFilteringFeature,
  rowExpandingFeature,
  rowPaginationFeature,
  rowSelectionFeature,
  rowSortingFeature,
  sortFn_alphanumeric,
  sortFn_basic,
  sortFn_datetime,
  sortFn_text,
  tableFeatures,
} from "@tanstack/react-table";
import type { DataTableColumn } from "../types/data-table-column-types";

/** The reserved ids of the columns the table adds itself. */
export const SELECT_COLUMN_ID = "__aureus_select";
export const EXPAND_COLUMN_ID = "__aureus_expand";
export const ACTIONS_COLUMN_ID = "__aureus_actions";

/** The display columns the table adds itself. */
export const RESERVED_COLUMN_IDS: ReadonlySet<string> = new Set([
  SELECT_COLUMN_ID,
  EXPAND_COLUMN_ID,
  ACTIONS_COLUMN_ID,
]);

export type AureusColumnKind = "data" | "group" | "select" | "expand" | "actions";

/** What every TanStack column carries in `columnDef.meta`. */
export interface AureusColumnMeta {
  aureus: {
    kind: AureusColumnKind;
    /** The plain-text label (see `columnLabel`). */
    label: string;
    /** The consumer's column, for data and group columns. */
    // biome-ignore lint/suspicious/noExplicitAny: the row type is erased at this level.
    source?: DataTableColumn<any>;
  };
}

/**
 * Every feature the table can use, declared once (TanStack v9 expects a static set). Whether a
 * feature acts is decided per render by the `manual*` and `enable*` options (design decision 1),
 * so a feature that is off runs no row model.
 */
export const dataTableFeatures = tableFeatures({
  rowSortingFeature,
  columnFilteringFeature,
  globalFilteringFeature,
  columnVisibilityFeature,
  columnPinningFeature,
  columnSizingFeature,
  columnResizingFeature,
  rowExpandingFeature,
  rowSelectionFeature,
  rowPaginationFeature,
  sortedRowModel: createSortedRowModel(),
  filteredRowModel: createFilteredRowModel(),
  paginatedRowModel: createPaginatedRowModel(),
  sortFns: {
    alphanumeric: sortFn_alphanumeric,
    text: sortFn_text,
    datetime: sortFn_datetime,
    basic: sortFn_basic,
  },
  filterFns: { includesString: filterFn_includesString },
  columnMeta: {} as AureusColumnMeta,
});

export type DataTableFeatures = typeof dataTableFeatures;
