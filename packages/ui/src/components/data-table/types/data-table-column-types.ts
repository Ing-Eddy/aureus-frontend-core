import type { ReactNode } from "react";

/** Horizontal alignment of a column's header, cells and footer, in logical terms. */
export type DataTableAlign = "start" | "center" | "end";

/** The edge a column is pinned to while the table scrolls horizontally (follows `dir`). */
export type DataTablePinEdge = "start" | "end";

/** What a `cell` renderer receives. */
export interface DataTableCellContext<TData, TValue = unknown> {
  /** The column's value for this row (`undefined` for display columns). */
  value: TValue;
  /** The row's data. */
  row: TData;
  /** The row id (`getRowId`, or the row index). */
  rowId: string;
  /** The row's index in `data`. */
  rowIndex: number;
}

/** What a `header` render function receives. */
export interface DataTableHeaderContext {
  /** The column's plain-text label. */
  label: string;
}

/** What a `footer` render function receives. */
export interface DataTableFooterContext<TData> {
  /** Every row that passes the search, on every page. */
  rows: readonly TData[];
}

/** The built-in sort functions. */
export type DataTableSortFnName = "alphanumeric" | "text" | "datetime" | "basic";

/** What every column has, groups included. */
interface DataTableColumnBase<TData> {
  /** The header: text, any node, or a render function. */
  header: ReactNode | ((context: DataTableHeaderContext) => ReactNode);
  /**
   * Plain text that names the column in the columns menu, sort labels and warnings. Defaults to
   * `header` when it is a string. Required for a hideable or sortable column with a rich header.
   */
  label?: string;
  /** Shown under the header text. */
  subtitle?: ReactNode;
  /** Header, cells and footer alignment. Default `"start"`. */
  align?: DataTableAlign;
  /** Listed in the columns menu (`columnToggle`). Default `false`. */
  hideable?: boolean;
  /** Pinned to an edge from the start. */
  pin?: DataTablePinEdge;
  /** The footer of this column. The footer row appears when any column has one. */
  footer?: ReactNode | ((context: DataTableFooterContext<TData>) => ReactNode);
  /** Classes of the header cell. */
  headerClassName?: string;
  /** Classes of the body and footer cells. No effect on a group. */
  cellClassName?: string;
}

/** What the columns that render cells share (everything but groups). */
interface DataTableLeafColumnBase<TData, TValue> extends DataTableColumnBase<TData> {
  /** The cell content. Default: the value as text. */
  cell?: (context: DataTableCellContext<TData, TValue>) => ReactNode;
  /** Has a sort button when `sorting` is on. Default `false`. */
  sortable?: boolean;
  /** How the column sorts: a built-in name, or a compare function of two rows. */
  sortFn?: DataTableSortFnName | ((a: TData, b: TData) => number);
  /** Width in pixels (used by `resizing`). Default 150. */
  size?: number;
  /** Smallest width in pixels while resizing. Default 20. */
  minSize?: number;
  /** Largest width in pixels while resizing. No default: no limit. */
  maxSize?: number;
  /** Has a resize handle when `resizing` is on. Default `false`. */
  resizable?: boolean;
  /** Only groups have child columns. */
  columns?: undefined;
}

/** A column reading `row[accessorKey]`; its id defaults to the key. */
export type DataTableAccessorKeyColumn<TData> = {
  [Key in keyof TData & string]: DataTableLeafColumnBase<TData, TData[Key]> & {
    /** The property of the row that holds the value. */
    accessorKey: Key;
    /** Not used together with `accessorKey`. */
    accessorFn?: undefined;
    /** Unique column id. Defaults to `accessorKey`. */
    id?: string;
  };
}[keyof TData & string];

/** A column computing its value from the row. */
export interface DataTableAccessorFnColumn<TData, TValue = unknown>
  extends DataTableLeafColumnBase<TData, TValue> {
  /** Returns the column's value, used for sorting and search. */
  accessorFn: (row: TData, index: number) => TValue;
  /** Not used together with `accessorFn`. */
  accessorKey?: undefined;
  /** Unique column id. */
  id: string;
}

/**
 * A column with no value of its own (actions, badges…): it is not searched, and `sortable` has no
 * effect on it.
 */
export interface DataTableDisplayColumn<TData> extends DataTableLeafColumnBase<TData, undefined> {
  /** Unique column id. */
  id: string;
  /** A display column reads no property. */
  accessorKey?: undefined;
  /** A display column computes no value. */
  accessorFn?: undefined;
}

/**
 * A group of columns: its header spans its children. It uses `header`, `label`, `subtitle` and
 * `headerClassName`; `align`, `pin`, `hideable`, `footer` and `cellClassName` have no effect on it.
 */
export interface DataTableGroupColumn<TData> extends DataTableColumnBase<TData> {
  /** Unique column id. */
  id: string;
  /** The child columns, which may be groups too. */
  columns: readonly DataTableColumn<TData>[];
  /** A group has no value. */
  accessorKey?: undefined;
  /** A group has no value. */
  accessorFn?: undefined;
}

/** One column of a `DataTable`: an accessor, a display column, or a group of columns. */
export type DataTableColumn<TData> =
  | DataTableAccessorKeyColumn<TData>
  | DataTableAccessorFnColumn<TData>
  | DataTableDisplayColumn<TData>
  | DataTableGroupColumn<TData>;

/** A column that renders cells (everything but a group). */
export type DataTableLeafColumn<TData> = Exclude<
  DataTableColumn<TData>,
  DataTableGroupColumn<TData>
>;
