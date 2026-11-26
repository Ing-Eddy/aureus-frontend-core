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

/** The `header` prop: title and toolbar slot. */
export interface DataTableHeaderOptions {
  /** The table's title, also its default accessible name. */
  title?: ReactNode;
  /** Smaller text under the title. */
  subtitle?: ReactNode;
  /** Your own toolbar content, at the inline end before the built-in buttons. */
  toolbar?: ReactNode;
}

/** The search options common to both triggers. */
interface DataTableSearchBase {
  /** Accessible name of the input. */
  label: string;
  /** Accessible name of the search button. */
  submitLabel: string;
  /** Accessible name of the clear button. */
  clearLabel: string;
  /** Placeholder of the input. No default. */
  placeholder?: string;
  /** Shown on hover and focus of the input. */
  tooltip?: ReactNode;
  /** Controlled input value. */
  value?: string;
  /** Initial input value when uncontrolled. It is applied on mount, without `onSearch`. */
  defaultValue?: string;
  /** Called with each change of the input's value, before it is applied. */
  onValueChange?: (value: string) => void;
  /** Called with the trimmed query when it is applied. */
  onSearch?: (query: string) => void;
  /** Do not filter in the client: only the callbacks run (server search). */
  manual?: boolean;
}

/** `trigger: "submit"` (default) applies on Enter or the button; `"change"` while typing. */
export type DataTableSearchOptions = DataTableSearchBase &
  (
    | {
        /** Applies the query on Enter or the search button. Defaults to `"submit"`. */
        trigger?: "submit";
        /** Only with `trigger: "change"`. */
        debounceMs?: undefined;
      }
    | {
        trigger: "change";
        /** Delay after the last keystroke. Default 0. */
        debounceMs?: number;
      }
  );

/** The `reload` prop: a button that reloads data. */
export interface DataTableReloadOptions {
  /** Accessible name and tooltip of the button. */
  label: string;
  /** Called when the button is pressed. */
  onReload: () => void;
  /** Disables the button. Loading alone does not. */
  disabled?: boolean;
}

/** What every custom toolbar action has. */
interface DataTableToolbarActionBase {
  /** Unique among the actions. */
  id: string;
  /** Accessible name and tooltip; also the visible text with `showLabel`. */
  label: string;
  /** Called when the button is pressed. */
  onClick: () => void;
  /** Disables the button. */
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
    | {
        /** The button's icon. */
        icon: ReactNode;
        /** Shows only the icon, with `label` as its name and tooltip. Defaults to `false`. */
        showLabel?: false;
      }
    | {
        /** Shows `label` as text instead of only the icon. */
        showLabel: true;
        icon?: ReactNode;
      }
  );

/** The `filters` prop: the consumer's filters. */
export interface DataTableFiltersOptions {
  /** Accessible name and tooltip of the button. */
  label: string;
  /** Your filters: any content, shown in a popover. */
  content: ReactNode;
  /** Shown as a badge when greater than zero. */
  activeCount?: number;
  /** Controlled open state of the popover. */
  open?: boolean;
  /** Initial open state when uncontrolled. Defaults to `false`. */
  defaultOpen?: boolean;
  /** Called when the popover should open or close. */
  onOpenChange?: (open: boolean) => void;
}

/** Visibility by column id; a missing id is visible. */
export type DataTableColumnVisibility = Record<string, boolean>;

/**
 * The `columnToggle` prop: a menu that shows and hides the `hideable` columns. The state is
 * controllable.
 */
export interface DataTableColumnToggleOptions
  extends DataTableControllable<DataTableColumnVisibility> {
  /** Accessible name and tooltip of the button. */
  label: string;
  /** Optional heading inside the menu. */
  menuLabel?: ReactNode;
}

/** One sorted column. */
export interface DataTableSort {
  /** The column id. */
  id: string;
  /** Descending when `true`, ascending otherwise. */
  desc: boolean;
}

/** A sort direction, or no sorting. */
export type DataTableSortDirection = "ascending" | "descending" | "none";

/** The `sorting` prop. The state, an ordered list of sorted columns, is controllable. */
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

/** The marked column and row, each optional. */
export interface DataTableHighlight {
  /** Id of the marked column. */
  columnId?: string;
  /** Id of the marked row. */
  rowId?: string;
}

/**
 * The `highlight` prop: marking a column or row by click or keyboard; Escape clears. The state is
 * controllable.
 */
export interface DataTableHighlightOptions extends DataTableControllable<DataTableHighlight> {
  /** Clicking a header marks its column. */
  columns?: boolean;
  /** Clicking a row marks it. */
  rows?: boolean;
}

/** The `hover` prop: highlight under the pointer. */
export interface DataTableHoverOptions {
  /** Highlights the row under the pointer. */
  rows?: boolean;
  /** Highlights every cell of the column under the pointer. */
  columns?: boolean;
}

/** Selected rows by id. */
export type DataTableRowSelection = Record<string, boolean>;

/** One action on the selected rows. */
export interface DataTableBulkAction<TData> {
  /** Unique among the actions. */
  id: string;
  /** The menu entry's text. */
  label: ReactNode;
  /** Icon before the text. */
  icon?: ReactNode;
  /** Style of the entry. Defaults to `"default"`. */
  variant?: "default" | "destructive";
  /** Whether the action cannot be chosen for these rows. */
  disabled?: (rows: TData[]) => boolean;
  /** Leaves the action out of the menu for this selection. With every action hidden, the button is not shown. */
  hidden?: (rows: TData[]) => boolean;
  /** `clear()` empties the selection. */
  onSelect: (rows: TData[], clear: () => void) => void;
}

/** The selection options common to both modes. */
interface DataTableSelectionBase<TData> {
  /** Accessible name of a row checkbox. */
  selectRowLabel: (row: TData) => string;
  /** Rows for which it returns `false` cannot be selected. */
  canSelect?: (row: TData) => boolean;
  /** Controlled selection. */
  value?: DataTableRowSelection;
  /** Initial selection when uncontrolled. Defaults to empty. */
  defaultValue?: DataTableRowSelection;
  /** `rows` holds the data of the selected rows the table has shown. */
  onChange?: (value: DataTableRowSelection, rows: TData[]) => void;
  /** Visible count, announced politely. */
  selectedLabel?: (count: number) => string;
}

/** Multiple selection, with a header checkbox, or single selection without it. */
type DataTableSelectionMode =
  | {
      /** Several rows can be selected. Defaults to `"multiple"`. */
      mode?: "multiple";
      /** Accessible name of the header checkbox. */
      selectAllLabel: string;
      /** What the header checkbox selects. Default `"page"`. */
      selectAllScope?: "page" | "all";
    }
  | {
      /** Selecting a row clears the others. */
      mode: "single";
      /** There is no header checkbox in single mode. */
      selectAllLabel?: undefined;
      /** There is no header checkbox in single mode. */
      selectAllScope?: undefined;
    };

/** Bulk actions as a list or as the consumer's own menu content, or none. */
type DataTableSelectionActions<TData> =
  | {
      /** No bulk actions. */
      actions?: undefined;
      /** No bulk actions. */
      renderActions?: undefined;
      /** Only with bulk actions. */
      actionsLabel?: undefined;
    }
  | {
      /** The actions of the bulk menu. */
      actions: readonly DataTableBulkAction<TData>[];
      /** Not used together with `actions`. */
      renderActions?: undefined;
      /** Accessible name of the actions button. */
      actionsLabel: string;
    }
  | {
      /** The consumer's own content of the bulk menu. `clear()` empties the selection. */
      renderActions: (rows: TData[], clear: () => void) => ReactNode;
      /** Not used together with `renderActions`. */
      actions?: undefined;
      /** Accessible name of the actions button. */
      actionsLabel: string;
    };

/** The `selection` prop: a checkbox column, the selection state and bulk actions. */
export type DataTableSelectionOptions<TData> = DataTableSelectionBase<TData> &
  DataTableSelectionMode &
  DataTableSelectionActions<TData>;

/** Expanded rows by id. */
export type DataTableExpanded = Record<string, boolean>;

/**
 * The `expansion` prop: a button per row that shows a detail under it. The state is controllable.
 */
export interface DataTableExpansionOptions<TData> extends DataTableControllable<DataTableExpanded> {
  /** The content of a row's detail. */
  renderDetail: (row: TData) => ReactNode;
  /** Accessible name of a row's toggle. */
  expandLabel: (row: TData, expanded: boolean) => string;
  /** Rows for which it returns `false` get no button. */
  canExpand?: (row: TData) => boolean;
  /** Expanding a row collapses the others. */
  single?: boolean;
}

/** One entry of a row's actions menu. */
export interface DataTableRowAction<TData> {
  /** Unique within the row's menu. */
  id: string;
  /** The entry's text. */
  label: ReactNode;
  /** Icon before the text. */
  icon?: ReactNode;
  /** Style of the entry. Defaults to `"default"`. */
  variant?: "default" | "destructive";
  /** The entry is shown but cannot be chosen. */
  disabled?: boolean;
  /** Leaves the action out of the menu. A row with every action hidden shows no menu button. */
  hidden?: boolean;
  /** Called with the row's data when the entry is chosen. */
  onSelect: (row: TData) => void;
}

/** The `rowActions` prop: a last column, pinned to the end, with a menu per row. */
export interface DataTableRowActionsOptions<TData> {
  /** Accessible name of a row's menu button. */
  label: (row: TData) => string;
  /** The entries of a row's menu. */
  items: (row: TData) => readonly DataTableRowAction<TData>[];
}

/** Widths in pixels by column id. */
export type DataTableColumnSizing = Record<string, number>;

/** The `resizing` prop: handles on the `resizable` columns. The widths are controllable. */
export interface DataTableResizingOptions extends DataTableControllable<DataTableColumnSizing> {
  /** Accessible name of a resize handle. */
  resizeLabel: (column: string) => string;
  /** `"onChange"` (default) resizes while dragging; `"onEnd"` when the drag ends. */
  mode?: "onChange" | "onEnd";
}

/** The pinned columns of each edge, in order. */
export interface DataTableColumnPinning {
  /** Column ids pinned to the inline start. */
  start: string[];
  /** Column ids pinned to the inline end. */
  end: string[];
}

/**
 * The `pinning` prop: controls which columns are pinned. Without it, the columns' `pin` decides.
 */
export type DataTablePinningOptions = DataTableControllable<DataTableColumnPinning>;

/** The pagination state. */
export interface DataTablePage {
  /** The current page, counting from 0. */
  pageIndex: number;
  /** Rows per page. */
  pageSize: number;
}

/** The pagination options without optional features. */
interface DataTablePaginationBase extends DataTableControllable<DataTablePage> {
  /** Accessible name of the previous-page button. */
  previousLabel: string;
  /** Accessible name of the next-page button. */
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

/** A page-size select, which needs its name, or none. */
type DataTablePageSizes =
  | {
      /** No page-size select. */
      pageSizes?: undefined;
      /** Only with `pageSizes`. */
      pageSizeLabel?: undefined;
    }
  | {
      /** Options of the page-size select; the first one is the initial size. */
      pageSizes: readonly number[];
      /** Accessible name and tooltip of the page-size select. */
      pageSizeLabel: string;
    };

/** First and last page buttons, which need names, or none. */
type DataTableFirstLast =
  | {
      /** No first and last buttons. Defaults to `false`. */
      showFirstLast?: false;
      /** Only with `showFirstLast`. */
      firstLabel?: undefined;
      /** Only with `showFirstLast`. */
      lastLabel?: undefined;
    }
  | {
      /** Adds buttons to the first and last pages. */
      showFirstLast: true;
      /** Accessible name of the first-page button. */
      firstLabel: string;
      /** Accessible name of the last-page button. */
      lastLabel: string;
    };

/**
 * The `pagination` prop. The first of `pageSizes` is the initial page size; without `pageSizes` or
 * a `defaultValue` it is 10.
 */
export type DataTablePaginationOptions = DataTablePaginationBase &
  DataTablePageSizes &
  DataTableFirstLast;

/** The `error` prop: what replaces the rows, with an optional retry button. */
export type DataTableErrorOptions =
  | {
      /** What is shown instead of the rows, announced as an alert. */
      content: ReactNode;
      /** No retry button. */
      onRetry?: undefined;
      /** Only with `onRetry`. */
      retryLabel?: undefined;
    }
  | {
      /** What is shown instead of the rows, announced as an alert. */
      content: ReactNode;
      /** Shows a retry button that calls it. */
      onRetry: () => void;
      /** Text of the retry button. */
      retryLabel: string;
    };
