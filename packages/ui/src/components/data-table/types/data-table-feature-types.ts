import type { ReactNode } from "react";

/** The `value` / `defaultValue` / `onChange` trio of a state slice. */
export interface DataTableControllable<T> {
  /** Controlled value: the table renders exactly this. */
  value?: T;
  /** Initial value when uncontrolled. */
  defaultValue?: T;
  /** Called with every requested change, controlled or not. */
  onChange?: (value: T) => void;
}

export interface DataTableHeaderOptions {
  title?: ReactNode;
  subtitle?: ReactNode;
  /** Your own toolbar content, at the inline end before the built-in buttons. */
  toolbar?: ReactNode;
}

interface DataTableSearchBase {
  /** Accessible name of the input. */
  label: string;
  /** Accessible name of the search button. */
  submitLabel: string;
  /** Accessible name of the clear button. */
  clearLabel: string;
  placeholder?: string;
  /** Shown on hover and focus of the input. */
  tooltip?: ReactNode;
  /** Controlled input value. */
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  /** Called with the trimmed query when it is applied. */
  onSearch?: (query: string) => void;
  /** Do not filter in the client: only the callbacks run (server search). */
  manual?: boolean;
}

/** `trigger: "submit"` (default) applies on Enter or the button; `"change"` while typing. */
export type DataTableSearchOptions = DataTableSearchBase &
  (
    | { trigger?: "submit"; debounceMs?: undefined }
    | {
        trigger: "change";
        /** Delay after the last keystroke. Default 0. */
        debounceMs?: number;
      }
  );

export interface DataTableReloadOptions {
  /** Accessible name and tooltip of the button. */
  label: string;
  onReload: () => void;
  disabled?: boolean;
}

interface DataTableToolbarActionBase {
  id: string;
  /** Accessible name and tooltip; also the visible text with `showLabel`. */
  label: string;
  onClick: () => void;
  disabled?: boolean;
  /** Leaves the action out of the toolbar. */
  hidden?: boolean;
  /** Default `"outline"`, like the built-in buttons. */
  variant?: "outline" | "default" | "secondary" | "destructive";
}

/**
 * A custom toolbar button, drawn like the built-in ones: an icon button with its `label` as
 * tooltip, or with `showLabel` a button with the icon (optional) and the label.
 */
export type DataTableToolbarAction = DataTableToolbarActionBase &
  (
    | { icon: ReactNode; showLabel?: false }
    | {
        /** Shows `label` as text instead of only the icon. */
        showLabel: true;
        icon?: ReactNode;
      }
  );

export interface DataTableFiltersOptions {
  /** Accessible name and tooltip of the button. */
  label: string;
  /** Your filters: any content, shown in a popover. */
  content: ReactNode;
  /** Shown as a badge when greater than zero. */
  activeCount?: number;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}

/** Visibility by column id; a missing id is visible. */
export type DataTableColumnVisibility = Record<string, boolean>;

export interface DataTableColumnToggleOptions
  extends DataTableControllable<DataTableColumnVisibility> {
  /** Accessible name and tooltip of the button. */
  label: string;
  /** Optional heading inside the menu. */
  menuLabel?: ReactNode;
}

export interface DataTableSort {
  id: string;
  desc: boolean;
}

export type DataTableSortDirection = "ascending" | "descending" | "none";

export interface DataTableSortingOptions extends DataTableControllable<DataTableSort[]> {
  /** Accessible name of a sort button: the column label and the direction a press sets. */
  sortLabel: (column: string, next: DataTableSortDirection) => string;
  /** Shift+press adds the column to the current sort. */
  multi?: boolean;
  /** The first press sorts descending. */
  descFirst?: boolean;
  /** Do not sort in the client: only `onChange` runs (server sorting). */
  manual?: boolean;
}

export interface DataTableHighlight {
  columnId?: string;
  rowId?: string;
}

export interface DataTableHighlightOptions extends DataTableControllable<DataTableHighlight> {
  /** Clicking a header marks its column. */
  columns?: boolean;
  /** Clicking a row marks it. */
  rows?: boolean;
}

export interface DataTableHoverOptions {
  rows?: boolean;
  columns?: boolean;
}

/** Selected rows by id. */
export type DataTableRowSelection = Record<string, boolean>;

export interface DataTableBulkAction<TData> {
  id: string;
  label: ReactNode;
  icon?: ReactNode;
  variant?: "default" | "destructive";
  disabled?: (rows: TData[]) => boolean;
  /** Leaves the action out of the menu for this selection. With every action hidden, the button is not shown. */
  hidden?: (rows: TData[]) => boolean;
  /** `clear()` empties the selection. */
  onSelect: (rows: TData[], clear: () => void) => void;
}

interface DataTableSelectionBase<TData> {
  /** Accessible name of a row checkbox. */
  selectRowLabel: (row: TData) => string;
  canSelect?: (row: TData) => boolean;
  value?: DataTableRowSelection;
  defaultValue?: DataTableRowSelection;
  /** `rows` holds the data of the selected rows the table has shown. */
  onChange?: (value: DataTableRowSelection, rows: TData[]) => void;
  /** Visible count, announced politely. */
  selectedLabel?: (count: number) => string;
}

type DataTableSelectionMode =
  | {
      mode?: "multiple";
      /** Accessible name of the header checkbox. */
      selectAllLabel: string;
      /** What the header checkbox selects. Default `"page"`. */
      selectAllScope?: "page" | "all";
    }
  | { mode: "single"; selectAllLabel?: undefined; selectAllScope?: undefined };

type DataTableSelectionActions<TData> =
  | { actions?: undefined; renderActions?: undefined; actionsLabel?: undefined }
  | {
      actions: readonly DataTableBulkAction<TData>[];
      renderActions?: undefined;
      /** Accessible name of the actions button. */
      actionsLabel: string;
    }
  | {
      renderActions: (rows: TData[], clear: () => void) => ReactNode;
      actions?: undefined;
      actionsLabel: string;
    };

export type DataTableSelectionOptions<TData> = DataTableSelectionBase<TData> &
  DataTableSelectionMode &
  DataTableSelectionActions<TData>;

/** Expanded rows by id. */
export type DataTableExpanded = Record<string, boolean>;

export interface DataTableExpansionOptions<TData> extends DataTableControllable<DataTableExpanded> {
  renderDetail: (row: TData) => ReactNode;
  /** Accessible name of a row's toggle. */
  expandLabel: (row: TData, expanded: boolean) => string;
  canExpand?: (row: TData) => boolean;
  /** Expanding a row collapses the others. */
  single?: boolean;
}

export interface DataTableRowAction<TData> {
  id: string;
  label: ReactNode;
  icon?: ReactNode;
  variant?: "default" | "destructive";
  disabled?: boolean;
  /** Leaves the action out of the menu. A row with every action hidden shows no menu button. */
  hidden?: boolean;
  onSelect: (row: TData) => void;
}

export interface DataTableRowActionsOptions<TData> {
  /** Accessible name of a row's menu button. */
  label: (row: TData) => string;
  items: (row: TData) => readonly DataTableRowAction<TData>[];
}

/** Widths in pixels by column id. */
export type DataTableColumnSizing = Record<string, number>;

export interface DataTableResizingOptions extends DataTableControllable<DataTableColumnSizing> {
  /** Accessible name of a resize handle. */
  resizeLabel: (column: string) => string;
  /** `"onChange"` (default) resizes while dragging; `"onEnd"` when the drag ends. */
  mode?: "onChange" | "onEnd";
}

export interface DataTableColumnPinning {
  start: string[];
  end: string[];
}

export type DataTablePinningOptions = DataTableControllable<DataTableColumnPinning>;

export interface DataTablePage {
  pageIndex: number;
  pageSize: number;
}

interface DataTablePaginationBase extends DataTableControllable<DataTablePage> {
  previousLabel: string;
  nextLabel: string;
  /**
   * Accessible name of each page button, e.g. `(page, count) => t("page.of", { page, count })`.
   * Without `rangeLabel`, it also announces the current page when it changes.
   */
  pageLabel: (page: number, pageCount: number) => string;
  /** Visible range text, e.g. "11–20 of 95". It also announces page and search changes. */
  rangeLabel?: (from: number, to: number, total: number) => string;
  /** Do not paginate in the client: `data` is the current page (server pagination). */
  manual?: boolean;
  /** Total rows in manual mode; the page count is derived from it. */
  rowCount?: number;
  /** Total pages in manual mode, when `rowCount` is unknown. */
  pageCount?: number;
}

type DataTablePageSizes =
  | { pageSizes?: undefined; pageSizeLabel?: undefined }
  | {
      /** Options of the page-size select; the first one is the initial size. */
      pageSizes: readonly number[];
      /** Accessible name and tooltip of the page-size select. */
      pageSizeLabel: string;
    };

type DataTableFirstLast =
  | { showFirstLast?: false; firstLabel?: undefined; lastLabel?: undefined }
  | { showFirstLast: true; firstLabel: string; lastLabel: string };

export type DataTablePaginationOptions = DataTablePaginationBase &
  DataTablePageSizes &
  DataTableFirstLast;

export type DataTableErrorOptions =
  | { content: ReactNode; onRetry?: undefined; retryLabel?: undefined }
  | { content: ReactNode; onRetry: () => void; retryLabel: string };
