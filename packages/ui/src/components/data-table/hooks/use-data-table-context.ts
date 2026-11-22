import type { RowData } from "@tanstack/react-table";
import { createContext, type RefObject, useContext } from "react";
import type { DataTableInstance, DataTableProps, DataTableRowSelection } from "../types";
import type { useHighlight } from "./use-highlight";
import type { useRovingFocus } from "./use-roving-focus";
import type { useSearch } from "./use-search";
import type { DataTableState } from "./use-table-state";

export interface DataTableContextValue<TData extends RowData> {
  props: DataTableProps<TData>;
  table: DataTableInstance<TData>;
  state: DataTableState;
  highlight: ReturnType<typeof useHighlight>;
  search: ReturnType<typeof useSearch>;
  /** The tab stop among the focusable rows. */
  rowFocus: ReturnType<typeof useRovingFocus>;
  /** The tab stop among the markable column headers. */
  columnFocus: ReturnType<typeof useRovingFocus>;
  searchInputRef: RefObject<HTMLInputElement | null>;
  tableElementRef: RefObject<HTMLTableElement | null>;
  titleId: string;
  direction: "ltr" | "rtl" | undefined;
  selectedRows: (selection: DataTableRowSelection) => TData[];
  clearSelection: () => void;
}

// biome-ignore lint/suspicious/noExplicitAny: the row type is restored by useDataTableContext.
export const DataTableContext = createContext<DataTableContextValue<any> | null>(null);

/** The table's internals, for its parts. Throws outside `DataTable` (a part is never public). */
export function useDataTableContext<TData extends RowData>(): DataTableContextValue<TData> {
  const context = useContext(DataTableContext);
  if (!context) throw new Error("DataTable parts must be rendered inside DataTable.");
  return context;
}
