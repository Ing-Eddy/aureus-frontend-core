import type { RowData } from "@tanstack/react-table";
import { type MissingTextCheck, useMissingTexts } from "@/internal/hooks";
import type { DataTableProps } from "../types";
import { columnId, hasPlainLabel, leafColumns } from "../utils";

/** The development warnings of `DataTable` for untyped code (design decision 13). */
export function dataTableTextChecks<TData extends RowData>(
  props: DataTableProps<TData>,
): MissingTextCheck[] {
  const { search, reload, filters, columnToggle, sorting, selection, expansion, rowActions } =
    props;
  const { resizing, error } = props;
  const pagination = props.pagination || undefined;
  const header = props.header || undefined;
  const missing = (feature: string, text: string): string => `\`${feature}\` needs \`${text}\``;

  const checks: MissingTextCheck[] = [
    [search && !search.label, missing("search", "label")],
    [search && !search.submitLabel, missing("search", "submitLabel")],
    [search && !search.clearLabel, missing("search", "clearLabel")],
    [reload && !reload.label, missing("reload", "label")],
    [filters && !filters.label, missing("filters", "label")],
    [columnToggle && !columnToggle.label, missing("columnToggle", "label")],
    [sorting && !sorting.sortLabel, missing("sorting", "sortLabel")],
    [selection && !selection.selectRowLabel, missing("selection", "selectRowLabel")],
    [
      selection && selection.mode !== "single" && !selection.selectAllLabel,
      missing("selection", "selectAllLabel"),
    ],
    [
      selection && (selection.actions || selection.renderActions) && !selection.actionsLabel,
      missing("selection", "actionsLabel"),
    ],
    [expansion && !expansion.expandLabel, missing("expansion", "expandLabel")],
    [rowActions && !rowActions.label, missing("rowActions", "label")],
    [resizing && !resizing.resizeLabel, missing("resizing", "resizeLabel")],
    [pagination && !pagination.previousLabel, missing("pagination", "previousLabel")],
    [pagination && !pagination.nextLabel, missing("pagination", "nextLabel")],
    [pagination && !pagination.pageLabel, missing("pagination", "pageLabel")],
    [
      pagination?.pageSizes && !pagination.pageSizeLabel,
      "`pagination.pageSizes` needs `pageSizeLabel`",
    ],
    [
      pagination?.showFirstLast && (!pagination.firstLabel || !pagination.lastLabel),
      "`pagination.showFirstLast` needs `firstLabel` and `lastLabel`",
    ],
    [props.loading && !props.loadingLabel, "`loading` needs `loadingLabel`"],
    [error?.onRetry && !error.retryLabel, "`error.onRetry` needs `error.retryLabel`"],
    [
      !props["aria-label"] && !props["aria-labelledby"] && !header?.title,
      "the table has no accessible name. Pass `aria-label`, `aria-labelledby` or `header.title`",
    ],
  ];

  for (const action of props.toolbarActions ?? []) {
    checks.push([!action.label, `toolbar action "${action.id}" needs \`label\``]);
  }

  for (const column of leafColumns(props.columns)) {
    const named = (column.sortable && sorting) || (column.hideable && columnToggle);
    checks.push([
      named && !hasPlainLabel(column),
      `column "${columnId(column)}" has a non-text \`header\` and no \`label\``,
    ]);
  }
  return checks;
}

/**
 * Logs once, in development, each missing text, each column without a plain label that needs one,
 * and a table without an accessible name.
 */
export function useDataTableWarnings<TData extends RowData>(props: DataTableProps<TData>) {
  useMissingTexts("DataTable", dataTableTextChecks(props));
}
