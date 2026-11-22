import type { ColumnDef, RowData } from "@tanstack/react-table";
import type { DataTableColumn, DataTableLeafColumn } from "../types/data-table-column-types";
import { columnId, columnLabel } from "./column-label";
import {
  ACTIONS_COLUMN_ID,
  type AureusColumnKind,
  type DataTableFeatures,
  EXPAND_COLUMN_ID,
  SELECT_COLUMN_ID,
} from "./data-table-features";

export type DataTableColumnDef<TData extends RowData> = ColumnDef<DataTableFeatures, TData>;

export interface DisplayColumns {
  select: boolean;
  expand: boolean;
  actions: boolean;
}

/** TanStack renders nothing itself: the table parts render from `meta.aureus`. */
const noRender = () => null;

function displayColumn<TData extends RowData>(
  id: string,
  kind: AureusColumnKind,
): DataTableColumnDef<TData> {
  return {
    id,
    header: noRender,
    size: 40,
    enableSorting: false,
    enableHiding: false,
    enableResizing: false,
    enableGlobalFilter: false,
    meta: { aureus: { kind, label: id } },
  } as DataTableColumnDef<TData>;
}

function toColumnDef<TData extends RowData>(
  column: DataTableColumn<TData>,
): DataTableColumnDef<TData> {
  const id = columnId(column);
  const meta = {
    aureus: {
      kind: (column.columns ? "group" : "data") as AureusColumnKind,
      label: columnLabel(column),
      source: column,
    },
  };

  if (column.columns) {
    return {
      id,
      header: noRender,
      columns: column.columns.map(toColumnDef),
      meta,
    } as DataTableColumnDef<TData>;
  }

  const { sortFn } = column;
  const isDisplay = column.accessorKey === undefined && column.accessorFn === undefined;
  return {
    id,
    ...(column.accessorKey !== undefined ? { accessorKey: column.accessorKey } : {}),
    ...(column.accessorFn !== undefined ? { accessorFn: column.accessorFn } : {}),
    header: noRender,
    cell: noRender,
    enableSorting: column.sortable === true,
    enableHiding: column.hideable === true,
    enableResizing: column.resizable === true,
    enableGlobalFilter: !isDisplay,
    ...(column.size !== undefined ? { size: column.size } : {}),
    ...(column.minSize !== undefined ? { minSize: column.minSize } : {}),
    ...(column.maxSize !== undefined ? { maxSize: column.maxSize } : {}),
    ...(typeof sortFn === "string"
      ? { sortFn }
      : typeof sortFn === "function"
        ? {
            sortFn: (a: { original: TData }, b: { original: TData }) =>
              sortFn(a.original, b.original),
          }
        : {}),
    meta,
  } as DataTableColumnDef<TData>;
}

/**
 * The consumer's columns as TanStack column definitions, with the display columns of the features
 * that are on: selection first, expansion second, row actions last.
 */
export function toTanstackColumns<TData extends RowData>(
  columns: readonly DataTableColumn<TData>[],
  display: DisplayColumns,
): DataTableColumnDef<TData>[] {
  return [
    ...(display.select ? [displayColumn<TData>(SELECT_COLUMN_ID, "select")] : []),
    ...(display.expand ? [displayColumn<TData>(EXPAND_COLUMN_ID, "expand")] : []),
    ...columns.map(toColumnDef),
    ...(display.actions ? [displayColumn<TData>(ACTIONS_COLUMN_ID, "actions")] : []),
  ];
}

/** Every leaf column of a tree, in order. */
export function leafColumns<TData>(
  columns: readonly DataTableColumn<TData>[],
): DataTableLeafColumn<TData>[] {
  return columns.flatMap((column) =>
    column.columns ? leafColumns(column.columns) : [column as DataTableLeafColumn<TData>],
  );
}
