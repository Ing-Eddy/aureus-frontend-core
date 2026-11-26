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

/** What `tableRef` exposes to act on a table from outside. */
export interface DataTableHandle<TData extends RowData> {
  /** The underlying TanStack Table instance. Its API may change between TanStack versions. */
  table: DataTableInstance<TData>;
  /** Empties the selection, calling `selection.onChange`. */
  clearSelection: () => void;
  /** Focuses the search input, if there is one. */
  focusSearch: () => void;
  /** Clears the marked column and row. */
  resetHighlight: () => void;
}

/** Extra classes for each part of the table. */
export interface DataTableClassNames {
  /** The outer frame. */
  root?: string;
  /** The title and toolbar band. */
  header?: string;
  /** The toolbar row. */
  toolbar?: string;
  /** The scroll container. */
  container?: string;
  /** The `<table>`. */
  table?: string;
  /** Each header row. */
  headerRow?: string;
  /** Each data row. */
  row?: string;
  /** Each body cell and each header cell of a data or group column. */
  cell?: string;
  /** The table footer. */
  footer?: string;
  /** The pagination band. */
  pagination?: string;
}

/** The loading state, which needs its announcement while on. */
type DataTableLoading =
  | {
      /** Not loading. Defaults to `false`. */
      loading?: false;
      /** Announced while loading; may stay set when not loading. */
      loadingLabel?: string;
    }
  | {
      /** Shows skeleton rows when there are no rows, sets `aria-busy` and spins the reload icon. */
      loading: boolean;
      /** Announced while loading. */
      loadingLabel: string;
    };

/** The props of `DataTable` except the loading ones. */
interface DataTableBaseProps<TData extends RowData> {
  /**
   * The rows. Keep the array stable between renders (`useMemo`): with client pagination a new array
   * returns to the first page.
   */
  data: readonly TData[];
  /** The columns, in order. */
  columns: readonly DataTableColumn<TData>[];
  /** Stable row ids (recommended). Default: the row index. */
  getRowId?: (row: TData, index: number) => string;
  /** The table's accessible name. Default: the header `title`. */
  "aria-label"?: string;
  /** Id of the element that names the table. */
  "aria-labelledby"?: string;
  /** Id of the root element. */
  id?: string;

  /** Title, subtitle and toolbar. `false` hides the whole header. */
  header?: DataTableHeaderOptions | false;
  /** A search box that filters the rows. */
  search?: DataTableSearchOptions;
  /** Custom buttons in the toolbar, before reload, filters and columns. */
  toolbarActions?: readonly DataTableToolbarAction[];
  /** A reload button. */
  reload?: DataTableReloadOptions;
  /** A button that opens the consumer's filters. */
  filters?: DataTableFiltersOptions;
  /** A menu that shows and hides columns. */
  columnToggle?: DataTableColumnToggleOptions;
  /** Sort buttons in the headers of `sortable` columns. */
  sorting?: DataTableSortingOptions;
  /** Marking a column or row. */
  highlight?: DataTableHighlightOptions;
  /** Highlighting the row or column under the pointer. */
  hover?: DataTableHoverOptions;
  /** Row selection and bulk actions. */
  selection?: DataTableSelectionOptions<TData>;
  /** Expandable row details. */
  expansion?: DataTableExpansionOptions<TData>;
  /** A menu of actions per row. */
  rowActions?: DataTableRowActionsOptions<TData>;
  /** Resizable columns. */
  resizing?: DataTableResizingOptions;
  /** Controls the pinned columns. */
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
  /** Alternates the row background. Defaults to `false`. */
  striped?: boolean;
  /** Draws a vertical line between columns, in the header, body and footer. */
  columnDividers?: boolean;
  /** Keeps the header rows visible while the body scrolls (within `maxHeight`). */
  stickyHeader?: boolean;
  /** Maximum height of the scrolling container (CSS length or pixels). */
  maxHeight?: number | string;

  /**
   * Makes rows focusable and clickable (Enter too). Not called for events on controls inside the
   * row.
   */
  onRowClick?: (row: TData, event: MouseEvent<HTMLElement> | KeyboardEvent<HTMLElement>) => void;
  /** Receives the table's handle. */
  tableRef?: Ref<DataTableHandle<TData>>;
  /** Classes of the root element. */
  className?: string;
  /** Classes of the parts. */
  classNames?: DataTableClassNames;
}

/** Props of `DataTable` for rows of type `TData`. */
export type DataTableProps<TData extends RowData> = DataTableBaseProps<TData> & DataTableLoading;
