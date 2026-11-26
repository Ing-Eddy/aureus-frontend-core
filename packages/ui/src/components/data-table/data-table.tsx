import type { RowData } from "@tanstack/react-table";
import { useId, useImperativeHandle, useMemo, useRef } from "react";
import { useInheritedDirection } from "@/internal/hooks";
import { cn } from "@/shadcn/lib/utils";
import { DataTableContent, DataTableHeader, DataTablePagination } from "./components";
import {
  DataTableContext,
  type DataTableContextValue,
  useColumnHover,
  useDataTable,
  useDataTableWarnings,
  useHighlight,
  useRovingFocus,
  useSearch,
  useTableState,
} from "./hooks";
import type { DataTableProps } from "./types";
import { rootClassName, selectedStatusClassName } from "./utils/data-table-classes";

/**
 * A data table on TanStack Table v9 and the shadcn table parts. Every feature is an opt-in object
 * prop (`search`, `sorting`, `selection`, `pagination`…) whose state is controllable through
 * `value` / `defaultValue` and a change callback; search, sorting and pagination have their own
 * `manual` flag for server data. The component ships no texts: each feature requires the texts it
 * needs.
 *
 * ```tsx
 * const columns: DataTableColumn<User>[] = [
 *   { accessorKey: "name", header: t("users.name"), sortable: true },
 *   { accessorKey: "email", header: t("users.email") },
 * ];
 *
 * <DataTable
 *   aria-label={t("users.title")}
 *   data={users}
 *   columns={columns}
 *   getRowId={(user) => user.id}
 *   sorting={{
 *     sortLabel: (column, next) => t(`table.sort.${next}`, { column }),
 *   }}
 *   pagination={{
 *     previousLabel: t("table.previous"),
 *     nextLabel: t("table.next"),
 *     pageLabel: (page, pageCount) => t("table.page", { page, pageCount }),
 *     pageSizes: [10, 25, 50],
 *     pageSizeLabel: t("table.pageSize"),
 *   }}
 * />
 * ```
 */
export function DataTable<TData extends RowData>(props: DataTableProps<TData>) {
  useDataTableWarnings(props);
  const rootRef = useRef<HTMLDivElement>(null);
  const tableElementRef = useRef<HTMLTableElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const titleId = useId();
  const direction = useInheritedDirection(rootRef);

  const state = useTableState(props);
  const { table, selectedRows } = useDataTable(props, state, direction);
  const highlight = useHighlight(props.highlight, state);
  const search = useSearch(props.search, state, searchInputRef);
  const rowFocus = useRovingFocus();
  const columnFocus = useRovingFocus();
  useColumnHover(tableElementRef, props.hover?.columns === true);

  const clearSelection = () => table.setRowSelection({});
  useImperativeHandle(
    props.tableRef,
    () => ({
      table,
      clearSelection: () => table.setRowSelection({}),
      focusSearch: () => searchInputRef.current?.focus(),
      resetHighlight: highlight.reset,
    }),
    [table, highlight.reset],
  );

  const context: DataTableContextValue<TData> = {
    props,
    table,
    state,
    highlight,
    search,
    rowFocus,
    columnFocus,
    searchInputRef,
    tableElementRef,
    titleId,
    direction,
    selectedRows,
    clearSelection,
  };

  const selectedCount = useMemo(
    () => Object.values(state.rowSelection).filter(Boolean).length,
    [state.rowSelection],
  );
  const selectedLabel = props.selection?.selectedLabel;

  return (
    <DataTableContext.Provider value={context}>
      {/* biome-ignore lint/a11y/noStaticElementInteractions: Escape inside the table clears the marks; the keys reach it from its focusable cells and controls. */}
      <div
        ref={rootRef}
        id={props.id}
        data-slot="data-table"
        data-density={props.density ?? "default"}
        data-hover-rows={props.hover?.rows ? "" : undefined}
        data-column-dividers={props.columnDividers ? "" : undefined}
        className={cn(rootClassName, props.className, props.classNames?.root)}
        onKeyDown={highlight.onKeyDown}
      >
        <DataTableHeader />
        <DataTableContent />
        {selectedLabel && (
          <div role="status" className={selectedStatusClassName}>
            {selectedLabel(selectedCount)}
          </div>
        )}
        <DataTablePagination />
        <div role="status" className="sr-only">
          {props.loading ? props.loadingLabel : null}
        </div>
      </div>
    </DataTableContext.Provider>
  );
}
