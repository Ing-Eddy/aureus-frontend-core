import { functionalUpdate, type RowData, type Updater, useTable } from "@tanstack/react-table";
import { useCallback, useMemo, useRef } from "react";
import type { DataTableColumnPinning, DataTableProps, DataTableRowSelection } from "../types";
import {
  ACTIONS_COLUMN_ID,
  dataTableFeatures,
  EXPAND_COLUMN_ID,
  SELECT_COLUMN_ID,
  toTanstackColumns,
} from "../utils";
import type { DataTableState } from "./use-table-state";

const RESERVED = new Set([SELECT_COLUMN_ID, EXPAND_COLUMN_ID, ACTIONS_COLUMN_ID]);

/** TanStack keeps only selected ids (`true`); the public type also accepts `false` entries. */
function selectedOnly(selection: DataTableRowSelection): Record<string, true> {
  const result: Record<string, true> = {};
  for (const id of Object.keys(selection)) if (selection[id]) result[id] = true;
  return result;
}

/** Resolves a TanStack updater against the current value and hands the result to `set`. */
function updater<T>(current: T, set: (next: T) => void) {
  return (next: Updater<T>) => set(functionalUpdate(next, current));
}

/**
 * The TanStack table behind `DataTable` (design decisions 1–3): the translated columns, the state
 * slices given as controlled `state`, and each feature's `manual` / `enable` flags.
 */
export function useDataTable<TData extends RowData>(
  props: DataTableProps<TData>,
  state: DataTableState,
  direction: "ltr" | "rtl" | undefined,
) {
  const { data, columns, getRowId, search, sorting, selection, expansion, rowActions, resizing } =
    props;
  const pagination = props.pagination || undefined;

  const hasSelection = selection !== undefined;
  const hasExpansion = expansion !== undefined;
  const hasRowActions = rowActions !== undefined;
  const tanstackColumns = useMemo(
    () =>
      toTanstackColumns(columns, {
        select: hasSelection,
        expand: hasExpansion,
        actions: hasRowActions,
      }),
    [columns, hasSelection, hasExpansion, hasRowActions],
  );

  // The display columns follow the pins: selection and expansion stay at the start when anything
  // is pinned there, and row actions are always pinned to the end.
  const effectivePinning = useMemo<DataTableColumnPinning>(() => {
    const start = state.columnPinning.start.filter((id) => !RESERVED.has(id));
    const end = state.columnPinning.end.filter((id) => !RESERVED.has(id));
    const leading = [
      ...(hasSelection ? [SELECT_COLUMN_ID] : []),
      ...(hasExpansion ? [EXPAND_COLUMN_ID] : []),
    ];
    return {
      start: start.length > 0 ? [...leading, ...start] : start,
      end: hasRowActions ? [...end, ACTIONS_COLUMN_ID] : end,
    };
  }, [state.columnPinning, hasSelection, hasExpansion, hasRowActions]);
  const setPinning = useCallback(
    (next: DataTableColumnPinning) =>
      state.setColumnPinning({
        start: next.start.filter((id) => !RESERVED.has(id)),
        end: next.end.filter((id) => !RESERVED.has(id)),
      }),
    [state.setColumnPinning],
  );

  // Every row the table has shown, so selections on other pages still report their data.
  const rowsById = useRef(new Map<string, TData>());
  const rowIdOf = useCallback(
    (row: TData, index: number) => (getRowId ? getRowId(row, index) : String(index)),
    [getRowId],
  );
  data.forEach((row, index) => {
    rowsById.current.set(rowIdOf(row, index), row);
  });
  const selectedRows = useCallback(
    (value: DataTableRowSelection) =>
      Object.keys(value)
        .filter((id) => value[id])
        .map((id) => rowsById.current.get(id))
        .filter((row): row is TData => row !== undefined),
    [],
  );
  const setRowSelection = useCallback(
    (next: DataTableRowSelection) => {
      state.setRowSelectionRaw(next);
      selection?.onChange?.(next, selectedRows(next));
    },
    [state.setRowSelectionRaw, selection?.onChange, selectedRows],
  );

  const tanstackSelection = useMemo(() => selectedOnly(state.rowSelection), [state.rowSelection]);
  const clientPagination = pagination !== undefined && !pagination.manual;

  const table = useTable({
    features: dataTableFeatures,
    data: data as TData[],
    columns: tanstackColumns,
    getRowId: rowIdOf,
    state: {
      sorting: state.sorting,
      globalFilter: state.query,
      pagination: state.pagination,
      rowSelection: tanstackSelection,
      columnVisibility: state.columnVisibility,
      columnPinning: effectivePinning,
      columnSizing: state.columnSizing,
      expanded: state.expanded,
    },
    onSortingChange: updater(state.sorting, state.setSorting),
    onGlobalFilterChange: updater<string>(state.query, state.setQuery),
    onPaginationChange: updater(state.pagination, state.setPagination),
    onRowSelectionChange: updater<Record<string, true>>(tanstackSelection, setRowSelection),
    onColumnVisibilityChange: updater(state.columnVisibility, state.setColumnVisibility),
    onColumnPinningChange: updater<DataTableColumnPinning>(effectivePinning, setPinning),
    onColumnSizingChange: updater(state.columnSizing, state.setColumnSizing),
    onExpandedChange: (next) => {
      const resolved = functionalUpdate(next, state.expanded);
      state.setExpanded(resolved === true ? {} : resolved);
    },

    // Sorting: three states, client unless manual.
    enableSorting: sorting !== undefined,
    manualSorting: sorting === undefined || sorting.manual === true,
    enableSortingRemoval: true,
    enableMultiSort: sorting?.multi === true,
    sortDescFirst: sorting?.descFirst === true,

    // Search: client global filter unless manual.
    enableGlobalFilter: search !== undefined,
    manualFiltering: search === undefined || search.manual === true,
    globalFilterFn: "includesString",

    // Pagination: client unless off or manual.
    manualPagination: !clientPagination,
    autoResetPageIndex: clientPagination,
    ...(pagination?.manual && pagination.rowCount !== undefined
      ? { rowCount: pagination.rowCount }
      : {}),
    ...(pagination?.manual && pagination.pageCount !== undefined
      ? { pageCount: pagination.pageCount }
      : {}),

    enableRowSelection: selection ? (row) => selection.canSelect?.(row.original) ?? true : false,
    enableMultiRowSelection: selection?.mode !== "single",

    enableExpanding: hasExpansion,
    getRowCanExpand: (row) => expansion?.canExpand?.(row.original) ?? hasExpansion,

    enableHiding: true,
    enableColumnPinning: true,
    enableColumnResizing: resizing !== undefined,
    columnResizeMode: resizing?.mode ?? "onChange",
    columnResizeDirection: direction ?? "ltr",
  });

  return { table, selectedRows };
}
