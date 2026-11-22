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
  headerClassName?: string;
  cellClassName?: string;
}

interface DataTableLeafColumnBase<TData, TValue> extends DataTableColumnBase<TData> {
  /** The cell content. Default: the value as text. */
  cell?: (context: DataTableCellContext<TData, TValue>) => ReactNode;
  /** Has a sort button when `sorting` is on. Default `false`. */
  sortable?: boolean;
  /** How the column sorts: a built-in name, or a compare function of two rows. */
  sortFn?: DataTableSortFnName | ((a: TData, b: TData) => number);
  /** Width in pixels (used by `resizing`). Default 150. */
  size?: number;
  minSize?: number;
  maxSize?: number;
  /** Has a resize handle when `resizing` is on. Default `false`. */
  resizable?: boolean;
  columns?: undefined;
}

/** A column reading `row[accessorKey]`; its id defaults to the key. */
export type DataTableAccessorKeyColumn<TData> = {
  [Key in keyof TData & string]: DataTableLeafColumnBase<TData, TData[Key]> & {
    accessorKey: Key;
    accessorFn?: undefined;
    id?: string;
  };
}[keyof TData & string];

/** A column computing its value from the row. */
export interface DataTableAccessorFnColumn<TData, TValue = unknown>
  extends DataTableLeafColumnBase<TData, TValue> {
  accessorFn: (row: TData, index: number) => TValue;
  accessorKey?: undefined;
  id: string;
}

/** A column with no value of its own (actions, badges…). Not searchable or sortable by value. */
export interface DataTableDisplayColumn<TData> extends DataTableLeafColumnBase<TData, undefined> {
  id: string;
  accessorKey?: undefined;
  accessorFn?: undefined;
}

/** A group of columns: its header spans its children. */
export interface DataTableGroupColumn<TData> extends DataTableColumnBase<TData> {
  id: string;
  columns: readonly DataTableColumn<TData>[];
  accessorKey?: undefined;
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
