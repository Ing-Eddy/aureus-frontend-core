import type { RowData } from "@tanstack/react-table";
import { useCallback, useState } from "react";
import { useControllableState } from "@/internal/hooks";
import type {
  DataTableColumnPinning,
  DataTableColumnSizing,
  DataTableColumnVisibility,
  DataTableExpanded,
  DataTableHighlight,
  DataTablePage,
  DataTableProps,
  DataTableRowSelection,
  DataTableSort,
} from "../types";
import { leafColumns } from "../utils";
import { columnId } from "../utils/column-label";

/** Stable empty default of the sorting state. */
const EMPTY_SORTING: DataTableSort[] = [];
/** Stable empty default of the states kept by id (selection, visibility, sizing, expansion). */
const EMPTY_RECORD = {};
/** Stable default with nothing marked. */
const EMPTY_HIGHLIGHT: DataTableHighlight = {};

/** The pins the columns declare with `pin`. */
function columnPins<TData extends RowData>(props: DataTableProps<TData>): DataTableColumnPinning {
  const leaves = leafColumns(props.columns);
  return {
    start: leaves.filter((column) => column.pin === "start").map(columnId),
    end: leaves.filter((column) => column.pin === "end").map(columnId),
  };
}

/**
 * Every state slice of the table (design decision 3): each one is owned by the table unless its
 * feature passes `value`, and reports every change through the feature's `onChange`.
 */
export function useTableState<TData extends RowData>(props: DataTableProps<TData>) {
  const { search, sorting, columnToggle, highlight, selection, expansion, resizing, pinning } =
    props;
  const pagination = props.pagination || undefined;

  const [initialPins] = useState(() => columnPins(props));
  const initialPageSize = pagination?.pageSizes?.[0] ?? 10;

  const [searchValue, setSearchValue] = useControllableState<string>({
    value: search?.value,
    defaultValue: search?.defaultValue ?? "",
    onChange: search?.onValueChange,
  });
  // The applied query starts from the initial input value, then changes only when applied.
  const [query, setQuery] = useState(() => (search?.value ?? search?.defaultValue ?? "").trim());

  const [sortingState, setSorting] = useControllableState<DataTableSort[]>({
    value: sorting?.value,
    defaultValue: sorting?.defaultValue ?? EMPTY_SORTING,
    onChange: sorting?.onChange,
  });

  const [paginationState, setPaginationRaw] = useControllableState<DataTablePage>({
    value: pagination?.value,
    defaultValue: pagination?.defaultValue ?? { pageIndex: 0, pageSize: initialPageSize },
    onChange: pagination?.onChange,
  });
  /** A page-size change returns to the first page. */
  const setPagination = useCallback(
    (next: DataTablePage) =>
      setPaginationRaw(
        next.pageSize !== paginationState.pageSize && next.pageIndex !== 0
          ? { ...next, pageIndex: 0 }
          : next,
      ),
    [setPaginationRaw, paginationState.pageSize],
  );

  const [rowSelection, setRowSelectionRaw] = useControllableState<DataTableRowSelection>({
    value: selection?.value,
    defaultValue: selection?.defaultValue ?? EMPTY_RECORD,
  });

  const [columnVisibility, setColumnVisibility] = useControllableState<DataTableColumnVisibility>({
    value: columnToggle?.value,
    defaultValue: columnToggle?.defaultValue ?? EMPTY_RECORD,
    onChange: columnToggle?.onChange,
  });

  const [columnPinning, setColumnPinning] = useControllableState<DataTableColumnPinning>({
    value: pinning?.value,
    defaultValue: pinning?.defaultValue ?? initialPins,
    onChange: pinning?.onChange,
  });

  const [columnSizing, setColumnSizing] = useControllableState<DataTableColumnSizing>({
    value: resizing?.value,
    defaultValue: resizing?.defaultValue ?? EMPTY_RECORD,
    onChange: resizing?.onChange,
  });

  const [expanded, setExpandedRaw] = useControllableState<DataTableExpanded>({
    value: expansion?.value,
    defaultValue: expansion?.defaultValue ?? EMPTY_RECORD,
    onChange: expansion?.onChange,
  });
  /** With `single`, expanding a row collapses the others. */
  const setExpanded = useCallback(
    (next: DataTableExpanded) => {
      if (!expansion?.single) return setExpandedRaw(next);
      const opened = Object.keys(next).find((id) => next[id] && !expanded[id]);
      setExpandedRaw(opened ? { [opened]: true } : next);
    },
    [expansion?.single, expanded, setExpandedRaw],
  );

  const [highlightState, setHighlight] = useControllableState<DataTableHighlight>({
    value: highlight?.value,
    defaultValue: highlight?.defaultValue ?? EMPTY_HIGHLIGHT,
    onChange: highlight?.onChange,
  });

  const [filtersOpen, setFiltersOpen] = useControllableState<boolean>({
    value: props.filters?.open,
    defaultValue: props.filters?.defaultOpen ?? false,
    onChange: props.filters?.onOpenChange,
  });

  return {
    searchValue,
    setSearchValue,
    query,
    setQuery,
    sorting: sortingState,
    setSorting,
    pagination: paginationState,
    setPagination,
    rowSelection,
    /** Raw setter: the table wraps it to report the selected rows too. */
    setRowSelectionRaw,
    columnVisibility,
    setColumnVisibility,
    columnPinning,
    setColumnPinning,
    columnSizing,
    setColumnSizing,
    expanded,
    setExpanded,
    highlight: highlightState,
    setHighlight,
    filtersOpen,
    setFiltersOpen,
  };
}

/** Every state slice of one table, with its setter. */
export type DataTableState = ReturnType<typeof useTableState>;
