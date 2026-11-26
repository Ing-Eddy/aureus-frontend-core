import type { RowData } from "@tanstack/react-table";
import { createContext, type RefObject, useContext } from "react";
import type { DataTableInstance, DataTableProps, DataTableRowSelection } from "../types";
import type { useHighlight } from "./use-highlight";
import type { useRovingFocus } from "./use-roving-focus";
import type { useSearch } from "./use-search";
import type { DataTableState } from "./use-table-state";

/** What the parts of one table share. */
export interface DataTableContextValue<TData extends RowData> {
  /** The consumer's props. */
  props: DataTableProps<TData>;
  /** The TanStack table. */
  table: DataTableInstance<TData>;
  /** Every state slice with its setter. */
  state: DataTableState;
  /** The marked column and row, and how to change them. */
  highlight: ReturnType<typeof useHighlight>;
  /** The search box's draft value and actions. */
  search: ReturnType<typeof useSearch>;
  /** The tab stop among the focusable rows. */
  rowFocus: ReturnType<typeof useRovingFocus>;
  /** The tab stop among the markable column headers. */
  columnFocus: ReturnType<typeof useRovingFocus>;
  /** The search input, focused after clearing and by `focusSearch()`. */
  searchInputRef: RefObject<HTMLInputElement | null>;
  /** The `<table>` element, used to find and measure cells. */
  tableElementRef: RefObject<HTMLTableElement | null>;
  /** Id of the title, also the prefix of the detail rows' ids. */
  titleId: string;
  /** The text direction measured on the root, for arrow keys and resizing. */
  direction: "ltr" | "rtl" | undefined;
  /** The data of the selected ids, among the rows the table has been given. */
  selectedRows: (selection: DataTableRowSelection) => TData[];
  /** Empties the selection. */
  clearSelection: () => void;
}

/** The context of one table; `null` outside `DataTable`. */
// biome-ignore lint/suspicious/noExplicitAny: the row type is restored by useDataTableContext.
export const DataTableContext = createContext<DataTableContextValue<any> | null>(null);

/** The table's internals, for its parts. Throws outside `DataTable` (a part is never public). */
export function useDataTableContext<TData extends RowData>(): DataTableContextValue<TData> {
  const context = useContext(DataTableContext);
  if (!context) throw new Error("DataTable parts must be rendered inside DataTable.");
  return context;
}
