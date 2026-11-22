import type { Cell, Row, RowData } from "@tanstack/react-table";
import { ChevronRightIcon } from "lucide-react";
import { Fragment, type KeyboardEvent, type MouseEvent } from "react";
import { cn } from "@/shadcn/lib/utils";
import { Button } from "@/shadcn/ui/button";
import { Checkbox } from "@/shadcn/ui/checkbox";
import { Skeleton } from "@/shadcn/ui/skeleton";
import { TableBody, TableCell, TableRow } from "@/shadcn/ui/table";
import { useDataTableContext } from "../hooks/use-data-table-context";
import { rowKeys } from "../hooks/use-roving-focus";
import {
  alignClassName,
  attributeSelector,
  bodyCellClassName,
  type DataTableFeatures,
  fromInteractive,
  type PinLayout,
  pinAttributes,
  pinnedCellClassName,
  rowResetClassName,
  sourceOf,
} from "../utils";
import { DataTableDetailRow } from "./data-table-detail-row";
import { DataTableRowActions } from "./data-table-row-actions";

type PinOf = (columnId: string) => PinLayout | undefined;

/** The id of a row's detail row, for the expand button's `aria-controls`. */
const detailIdOf = (baseId: string, rowIndex: number) => `${baseId}-detail-${rowIndex}`;

function asText(value: unknown): string {
  if (value === null || value === undefined) return "";
  return typeof value === "object" ? JSON.stringify(value) : String(value);
}

function BodyCell<TData extends RowData>({
  cell,
  pin,
}: {
  cell: Cell<DataTableFeatures, TData, unknown>;
  pin: PinLayout | undefined;
}) {
  const { props, highlight, titleId } = useDataTableContext<TData>();
  const { column, row } = cell;
  const kind = column.columnDef.meta?.aureus.kind;
  const source = sourceOf(column);
  const align = source?.align ?? "start";

  let content = null;
  if (kind === "select" && props.selection) {
    content = (
      <Checkbox
        aria-label={props.selection.selectRowLabel?.(row.original)}
        checked={row.getIsSelected()}
        disabled={!row.getCanSelect()}
        onCheckedChange={(value) => row.toggleSelected(value === true)}
      />
    );
  } else if (kind === "expand" && props.expansion) {
    const expanded = row.getIsExpanded();
    content = row.getCanExpand() ? (
      <Button
        type="button"
        variant="ghost"
        size="icon-sm"
        aria-expanded={expanded}
        aria-controls={expanded ? detailIdOf(titleId, row.index) : undefined}
        aria-label={props.expansion.expandLabel?.(row.original, expanded)}
        onClick={() => row.toggleExpanded()}
      >
        <ChevronRightIcon
          aria-hidden
          className={cn(
            "transition-transform motion-reduce:transition-none",
            expanded ? "rotate-90" : "rtl:rotate-180",
          )}
        />
      </Button>
    ) : null;
  } else if (kind === "actions" && props.rowActions) {
    content = <DataTableRowActions row={row.original} options={props.rowActions} />;
  } else if (source) {
    const value = cell.getValue();
    content = source.cell
      ? source.cell({ value, row: row.original, rowId: row.id, rowIndex: row.index } as never)
      : asText(value);
  }

  const width = props.resizing ? column.getSize() : undefined;
  const pinned = pinAttributes(pin);
  return (
    <TableCell
      data-column-id={column.id}
      data-highlight-column={highlight.columnId === column.id ? "" : undefined}
      {...pinned}
      style={{ ...pinned.style, ...(width !== undefined ? { width, minWidth: width } : {}) }}
      className={cn(
        bodyCellClassName[props.density ?? "default"],
        alignClassName[align],
        (kind === "select" || kind === "expand" || kind === "actions") && "w-10",
        pin && pinnedCellClassName,
        source?.cellClassName,
        props.classNames?.cell,
      )}
    >
      {content}
    </TableCell>
  );
}

function BodyRow<TData extends RowData>({
  row,
  index,
  pinOf,
}: {
  row: Row<DataTableFeatures, TData>;
  index: number;
  pinOf: PinOf;
}) {
  const { props, highlight, rowFocus, table, tableElementRef } = useDataTableContext<TData>();
  const focusable = props.onRowClick !== undefined || props.highlight?.rows === true;
  const marked = highlight.rowId === row.id;

  // Focusable rows share one tab stop; the arrows, Home and End move between them.
  const rowIds = () => table.getRowModel().rows.map((each) => each.id);

  const activate = (
    event: MouseEvent<HTMLTableRowElement> | KeyboardEvent<HTMLTableRowElement>,
  ) => {
    if (fromInteractive(event.target, event.currentTarget)) return;
    highlight.markRow(row.id);
    props.onRowClick?.(row.original, event);
  };

  return (
    <TableRow
      data-row-id={row.id}
      data-state={row.getIsSelected() ? "selected" : undefined}
      aria-selected={props.selection ? row.getIsSelected() : undefined}
      data-stripe={props.striped && index % 2 === 1 ? "" : undefined}
      data-highlight-row={marked ? "" : undefined}
      aria-current={marked ? "true" : undefined}
      tabIndex={
        focusable ? (rowFocus.tabStop(rowIds(), highlight.rowId) === row.id ? 0 : -1) : undefined
      }
      onClick={focusable ? activate : undefined}
      onFocus={
        focusable
          ? (event) => {
              if (event.target === event.currentTarget) rowFocus.setActiveId(row.id);
            }
          : undefined
      }
      onKeyDown={
        focusable
          ? (event) => {
              if (event.key === "Enter" && event.target === event.currentTarget) {
                event.preventDefault();
                activate(event);
                return;
              }
              rowFocus.onKeyDown(event, rowKeys, rowIds(), row.id, (id) =>
                tableElementRef.current?.querySelector<HTMLElement>(
                  `tbody tr${attributeSelector("data-row-id", id)}`,
                ),
              );
            }
          : undefined
      }
      className={cn(
        rowResetClassName,
        focusable &&
          "cursor-pointer outline-none focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-ring",
        props.classNames?.row,
      )}
    >
      {row.getVisibleCells().map((cell) => (
        <BodyCell key={cell.id} cell={cell} pin={pinOf(cell.column.id)} />
      ))}
    </TableRow>
  );
}

/** The rows, or the loading, empty and error states. */
export function DataTableBody<TData extends RowData>({ pinOf }: { pinOf: PinOf }) {
  const { props, table, titleId } = useDataTableContext<TData>();
  const rows = table.getRowModel().rows;
  const colSpan = table.getVisibleLeafColumns().length;
  const density = props.density ?? "default";

  if (props.error) {
    return (
      <TableBody>
        <DataTableDetailRow colSpan={colSpan} className="h-24 whitespace-normal p-4 text-center">
          <div role="alert" className="flex flex-col items-center gap-2">
            {props.error.content}
            {props.error.onRetry && (
              <Button type="button" variant="outline" size="sm" onClick={props.error.onRetry}>
                {props.error.retryLabel}
              </Button>
            )}
          </div>
        </DataTableDetailRow>
      </TableBody>
    );
  }

  if (rows.length === 0 && props.loading) {
    const columns = table.getVisibleLeafColumns();
    return (
      <TableBody>
        {Array.from({ length: props.loadingRows ?? 5 }, (_, index) => (
          // biome-ignore lint/suspicious/noArrayIndexKey: placeholder rows have no identity.
          <TableRow key={index} aria-hidden className={rowResetClassName}>
            {columns.map((column) => (
              <TableCell key={column.id} className={bodyCellClassName[density]}>
                <Skeleton className="h-4 w-full max-w-32" />
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    );
  }

  if (rows.length === 0) {
    return (
      <TableBody>
        {props.empty !== undefined && (
          <DataTableDetailRow colSpan={colSpan} className="h-24 whitespace-normal p-4 text-center">
            {props.empty}
          </DataTableDetailRow>
        )}
      </TableBody>
    );
  }

  return (
    <TableBody>
      {rows.map((row, index) => (
        <Fragment key={row.id}>
          <BodyRow row={row} index={index} pinOf={pinOf} />
          {props.expansion && row.getIsExpanded() && (
            <DataTableDetailRow id={detailIdOf(titleId, row.index)} colSpan={colSpan}>
              {props.expansion.renderDetail(row.original)}
            </DataTableDetailRow>
          )}
        </Fragment>
      ))}
    </TableBody>
  );
}
