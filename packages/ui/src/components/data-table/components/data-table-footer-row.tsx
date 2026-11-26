import type { RowData } from "@tanstack/react-table";
import { cn } from "@/shadcn/lib/utils";
import { TableCell, TableFooter, TableRow } from "@/shadcn/ui/table";
import { useDataTableContext } from "../hooks/use-data-table-context";
import {
  alignClassName,
  bodyCellClassName,
  type PinLayout,
  pinAttributes,
  pinnedCellClassName,
  rowResetClassName,
  sourceOf,
} from "../utils";

/** The footer row: rendered only when a visible column defines `footer`. */
export function DataTableFooterRow<TData extends RowData>({
  pinOf,
}: {
  /** The pin of each column. */
  pinOf: (columnId: string) => PinLayout | undefined;
}) {
  const { props, table } = useDataTableContext<TData>();
  const columns = table.getVisibleLeafColumns();
  if (!columns.some((column) => sourceOf(column)?.footer !== undefined)) return null;
  const rows = table.getFilteredRowModel().rows.map((row) => row.original);

  return (
    <TableFooter className={props.classNames?.footer}>
      <TableRow className={rowResetClassName}>
        {columns.map((column) => {
          const source = sourceOf(column);
          const footer = source?.footer;
          const pin = pinOf(column.id);
          return (
            <TableCell
              key={column.id}
              data-column-id={column.id}
              {...pinAttributes(pin)}
              className={cn(
                bodyCellClassName[props.density ?? "default"],
                alignClassName[source?.align ?? "start"],
                pin && pinnedCellClassName,
                source?.cellClassName,
              )}
            >
              {typeof footer === "function" ? footer({ rows }) : footer}
            </TableCell>
          );
        })}
      </TableRow>
    </TableFooter>
  );
}
