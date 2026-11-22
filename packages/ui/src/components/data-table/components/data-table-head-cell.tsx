import type { Header, RowData } from "@tanstack/react-table";
import { ArrowDownIcon, ArrowUpDownIcon, ArrowUpIcon } from "lucide-react";
import type { FocusEvent, KeyboardEvent, ReactNode } from "react";
import { cn } from "@/shadcn/lib/utils";
import { Button } from "@/shadcn/ui/button";
import { Checkbox } from "@/shadcn/ui/checkbox";
import { TableHead } from "@/shadcn/ui/table";
import { useDataTableContext } from "../hooks/use-data-table-context";
import { columnKeys } from "../hooks/use-roving-focus";
import type { DataTableSortDirection } from "../types";
import {
  alignClassName,
  attributeSelector,
  type DataTableFeatures,
  headCellClassName,
  justifyClassName,
  type PinLayout,
  pinAttributes,
  pinnedHeaderCellClassName,
  sourceOf,
} from "../utils";
import { DataTableResizeHandle } from "./data-table-resize-handle";

const sortIcon = { asc: ArrowUpIcon, desc: ArrowDownIcon, none: ArrowUpDownIcon } as const;
const nextDirection = { asc: "ascending", desc: "descending" } as const;

export interface DataTableHeadCellProps<TData extends RowData> {
  header: Header<DataTableFeatures, TData, unknown>;
  rowSpan: number;
  pin: PinLayout | undefined;
}

function HeaderText({ content, subtitle }: { content: ReactNode; subtitle?: ReactNode }) {
  return (
    <span className="flex min-w-0 flex-col">
      <span className="truncate">{content}</span>
      {subtitle !== undefined && (
        <span className="truncate font-normal text-muted-foreground text-xs">{subtitle}</span>
      )}
    </span>
  );
}

/** One header cell: a group, a data column (sorting, subtitle, resizing, marking) or a display column. */
export function DataTableHeadCell<TData extends RowData>({
  header,
  rowSpan,
  pin,
}: DataTableHeadCellProps<TData>) {
  const { props, table, highlight, columnFocus, direction, tableElementRef } =
    useDataTableContext<TData>();
  const { column } = header;
  const meta = column.columnDef.meta?.aureus;
  const density = props.density ?? "default";
  const base = cn(
    "relative",
    headCellClassName[density],
    pin && pinnedHeaderCellClassName,
    props.stickyHeader && "bg-clip-padding",
  );
  const visible = table.getVisibleLeafColumns();
  const leafIds = header
    .getLeafHeaders()
    .filter((leaf) => leaf.subHeaders.length === 0)
    .map((leaf) => leaf.column.id);
  const common = {
    ...pinAttributes(pin),
    ...(leafIds.includes(visible[0]?.id ?? "") ? { "data-edge-start": "" } : {}),
    ...(leafIds.includes(visible.at(-1)?.id ?? "") ? { "data-edge-end": "" } : {}),
    ...(props.stickyHeader ? { "data-opaque": "" } : {}),
    rowSpan: rowSpan > 1 ? rowSpan : undefined,
  };

  if (meta?.kind === "group") {
    const source = meta.source;
    const content =
      typeof source?.header === "function" ? source.header({ label: meta.label }) : source?.header;
    return (
      <TableHead
        scope="colgroup"
        colSpan={header.colSpan}
        data-column-leaves={leafIds.join(" ")}
        {...common}
        className={cn(base, "text-center", source?.headerClassName, props.classNames?.cell)}
      >
        <span className="inline-flex justify-center">
          <HeaderText content={content} subtitle={source?.subtitle} />
        </span>
      </TableHead>
    );
  }

  if (meta?.kind === "select") {
    const selection = props.selection;
    if (!selection || selection.mode === "single") {
      return <td data-column-id={column.id} {...common} className={base} />;
    }
    const all = selection.selectAllScope === "all";
    const checked = all ? table.getIsAllRowsSelected() : table.getIsAllPageRowsSelected();
    const some = all ? table.getIsSomeRowsSelected() : table.getIsSomePageRowsSelected();
    return (
      <TableHead scope="col" data-column-id={column.id} {...common} className={cn(base, "w-10")}>
        <Checkbox
          aria-label={selection.selectAllLabel}
          checked={checked ? true : some ? "indeterminate" : false}
          onCheckedChange={(value) =>
            all
              ? table.toggleAllRowsSelected(value === true)
              : table.toggleAllPageRowsSelected(value === true)
          }
        />
      </TableHead>
    );
  }

  if (meta?.kind === "expand" || meta?.kind === "actions") {
    return <td data-column-id={column.id} {...common} className={cn(base, "w-10")} />;
  }

  // A data column.
  const source = sourceOf(column);
  const label = meta?.label ?? column.id;
  const align = source?.align ?? "start";
  const content = typeof source?.header === "function" ? source.header({ label }) : source?.header;
  const sortable = props.sorting !== undefined && column.getCanSort();
  const sorted = column.getIsSorted();
  const marked = highlight.columnId === column.id;

  let body: ReactNode = <HeaderText content={content} subtitle={source?.subtitle} />;
  if (sortable && props.sorting) {
    const next = column.getNextSortingOrder();
    const nextLabel: DataTableSortDirection = next ? nextDirection[next] : "none";
    const Icon = sortIcon[sorted || "none"];
    body = (
      <span className={cn("flex items-center", justifyClassName[align])}>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="-mx-1.5 h-auto min-h-7 gap-1 px-1.5 py-0.5 font-medium"
          aria-label={props.sorting.sortLabel?.(label, nextLabel)}
          onClick={column.getToggleSortingHandler()}
        >
          <HeaderText content={content} />
          <Icon
            aria-hidden
            data-icon="inline-end"
            className={cn("size-3.5 shrink-0", !sorted && "text-muted-foreground")}
          />
        </Button>
      </span>
    );
    if (source?.subtitle !== undefined) {
      body = (
        <span className="flex flex-col">
          {body}
          <span
            className={cn(
              "truncate font-normal text-muted-foreground text-xs",
              alignClassName[align],
            )}
          >
            {source.subtitle}
          </span>
        </span>
      );
    }
  }

  // Marking from the keyboard: the markable headers share one tab stop; the arrows move between
  // them (mirrored in RTL), Home and End go to the ends, and Enter or Space marks.
  const markable = props.highlight?.columns === true;
  const markableIds = markable
    ? table
        .getVisibleLeafColumns()
        .filter((leaf) => leaf.columnDef.meta?.aureus.kind === "data")
        .map((leaf) => leaf.id)
    : [];
  const keyboard = markable
    ? {
        tabIndex: columnFocus.tabStop(markableIds, highlight.columnId) === column.id ? 0 : -1,
        onFocus: (event: FocusEvent<HTMLTableCellElement>) => {
          if (event.target === event.currentTarget) columnFocus.setActiveId(column.id);
        },
        onKeyDown: (event: KeyboardEvent<HTMLTableCellElement>) => {
          if (
            event.target === event.currentTarget &&
            (event.key === "Enter" || event.key === " ")
          ) {
            event.preventDefault();
            highlight.markColumn(column.id, event);
            return;
          }
          columnFocus.onKeyDown(event, columnKeys(direction), markableIds, column.id, (id) =>
            tableElementRef.current?.querySelector<HTMLElement>(
              `thead th${attributeSelector("data-column-id", id)}`,
            ),
          );
        },
      }
    : {};

  const width = props.resizing ? header.getSize() : undefined;
  return (
    <TableHead
      scope="col"
      data-column-id={column.id}
      aria-sort={sorted ? (sorted === "asc" ? "ascending" : "descending") : undefined}
      aria-current={marked ? "true" : undefined}
      data-highlight-column={marked ? "" : undefined}
      {...common}
      {...keyboard}
      style={{ ...common.style, ...(width !== undefined ? { width, minWidth: width } : {}) }}
      onClick={markable ? (event) => highlight.markColumn(column.id, event) : undefined}
      className={cn(
        base,
        alignClassName[align],
        markable &&
          "cursor-pointer outline-none focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-ring",
        source?.headerClassName,
        props.classNames?.cell,
      )}
    >
      {body}
      {props.resizing && column.getCanResize() && (
        <DataTableResizeHandle header={header} label={label} />
      )}
    </TableHead>
  );
}
