import type { ReactTable, RowData } from "@tanstack/react-table";
import type { KeyboardEvent, MouseEvent, ReactNode, Ref } from "react";
import type { DataTableFeatures } from "../utils/data-table-features";
import type { DataTableColumn } from "./data-table-column-types";
import type {
  DataTableColumnToggleOptions,
  DataTableErrorOptions,
  DataTableExpansionOptions,
  DataTableFiltersOptions,
  DataTableHeaderOptions,
  DataTableHighlightOptions,
  DataTableHoverOptions,
  DataTablePaginationOptions,
  DataTablePinningOptions,
  DataTableReloadOptions,
  DataTableResizingOptions,
  DataTableRowActionsOptions,
  DataTableSearchOptions,
  DataTableSelectionOptions,
  DataTableSortingOptions,
  DataTableToolbarAction,
} from "./data-table-feature-types";

/** The TanStack Table instance behind a `DataTable` (escape hatch, see `tableRef`). */
export type DataTableInstance<TData extends RowData> = ReactTable<DataTableFeatures, TData>;

export interface DataTableHandle<TData extends RowData> {
  /** The underlying TanStack Table instance. Its API may change between TanStack versions. */
  table: DataTableInstance<TData>;
  clearSelection: () => void;
  focusSearch: () => void;
  resetHighlight: () => void;
}

export interface DataTableClassNames {
  root?: string;
  header?: string;
  toolbar?: string;
  container?: string;
  table?: string;
  headerRow?: string;
  row?: string;
  cell?: string;
  footer?: string;
  pagination?: string;
}

type DataTableLoading =
  | { loading?: false; loadingLabel?: string }
  | {
      /** Shows skeleton rows when there are no rows, sets `aria-busy` and spins the reload icon. */
      loading: boolean;
      /** Announced while loading. */
      loadingLabel: string;
    };

interface DataTableBaseProps<TData extends RowData> {
  data: readonly TData[];
  columns: readonly DataTableColumn<TData>[];
  /** Stable row ids (recommended). Default: the row index. */
  getRowId?: (row: TData, index: number) => string;
  /** The table's accessible name. Default: the header `title`. */
  "aria-label"?: string;
  "aria-labelledby"?: string;
  id?: string;

  /** Title, subtitle and toolbar. `false` hides the whole header. */
  header?: DataTableHeaderOptions | false;
  search?: DataTableSearchOptions;
  /** Custom buttons in the toolbar, before reload, filters and columns. */
  toolbarActions?: readonly DataTableToolbarAction[];
  reload?: DataTableReloadOptions;
  filters?: DataTableFiltersOptions;
  columnToggle?: DataTableColumnToggleOptions;
  sorting?: DataTableSortingOptions;
  highlight?: DataTableHighlightOptions;
  hover?: DataTableHoverOptions;
  selection?: DataTableSelectionOptions<TData>;
  expansion?: DataTableExpansionOptions<TData>;
  rowActions?: DataTableRowActionsOptions<TData>;
  resizing?: DataTableResizingOptions;
  pinning?: DataTablePinningOptions;
  /** One page at a time. `false` (or omitted) shows every row. */
  pagination?: DataTablePaginationOptions | false;

  /** Skeleton rows while loading with no rows. Default 5. */
  loadingRows?: number;
  /** Shown when there is nothing to show. Omitted: the body stays empty. */
  empty?: ReactNode;
  /** Shown instead of the rows. */
  error?: DataTableErrorOptions;

  /** Default `"default"`. */
  density?: "default" | "compact";
  striped?: boolean;
  /** Draws a vertical line between columns, in the header, body and footer. */
  columnDividers?: boolean;
  /** Keeps the header rows visible while the body scrolls (within `maxHeight`). */
  stickyHeader?: boolean;
  /** Maximum height of the scrolling container (CSS length or pixels). */
  maxHeight?: number | string;

  onRowClick?: (row: TData, event: MouseEvent<HTMLElement> | KeyboardEvent<HTMLElement>) => void;
  tableRef?: Ref<DataTableHandle<TData>>;
  className?: string;
  classNames?: DataTableClassNames;
}

export type DataTableProps<TData extends RowData> = DataTableBaseProps<TData> & DataTableLoading;
