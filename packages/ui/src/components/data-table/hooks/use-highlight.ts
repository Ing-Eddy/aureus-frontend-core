import { type KeyboardEvent, type SyntheticEvent, useCallback } from "react";
import type { DataTableHighlight, DataTableHighlightOptions } from "../types";
import { fromInteractive } from "../utils";
import type { DataTableState } from "./use-table-state";

/** `{ columnId?, rowId? }` without `undefined` keys. */
function compact(columnId: string | undefined, rowId: string | undefined): DataTableHighlight {
  return {
    ...(columnId !== undefined ? { columnId } : {}),
    ...(rowId !== undefined ? { rowId } : {}),
  };
}

/**
 * Marking a column and a row (design decision 5). Clicks on controls inside a header or a row
 * never mark; a second click unmarks; Escape clears both.
 */
export function useHighlight(
  options: DataTableHighlightOptions | undefined,
  state: DataTableState,
) {
  const { highlight, setHighlight } = state;

  const markColumn = useCallback(
    (columnId: string, event: SyntheticEvent<HTMLElement>) => {
      if (!options?.columns || fromInteractive(event.target, event.currentTarget)) return;
      const next = highlight.columnId === columnId ? undefined : columnId;
      setHighlight(compact(next, highlight.rowId));
    },
    [options?.columns, highlight, setHighlight],
  );

  const markRow = useCallback(
    (rowId: string) => {
      if (!options?.rows) return;
      const next = highlight.rowId === rowId ? undefined : rowId;
      setHighlight(compact(highlight.columnId, next));
    },
    [options?.rows, highlight, setHighlight],
  );

  const onKeyDown = useCallback(
    (event: KeyboardEvent<HTMLElement>) => {
      if (event.key !== "Escape") return;
      if (highlight.columnId === undefined && highlight.rowId === undefined) return;
      event.stopPropagation();
      setHighlight({});
    },
    [highlight, setHighlight],
  );

  const reset = useCallback(() => setHighlight({}), [setHighlight]);

  return {
    columnId: options?.columns ? highlight.columnId : undefined,
    rowId: options?.rows ? highlight.rowId : undefined,
    markColumn,
    markRow,
    onKeyDown,
    reset,
  };
}
