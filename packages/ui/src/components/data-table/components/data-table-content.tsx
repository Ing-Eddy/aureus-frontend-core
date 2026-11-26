import type { Header, RowData } from "@tanstack/react-table";
import { type ReactNode, useRef } from "react";
import { cn } from "@/shadcn/lib/utils";
import { TableHeader, TableRow } from "@/shadcn/ui/table";
import { useDataTableContext } from "../hooks/use-data-table-context";
import { usePinnedOffsets } from "../hooks/use-pinned-offsets";
import { useScrollArea } from "../hooks/use-scroll-area";
import {
  containerClassName,
  type DataTableFeatures,
  MAX_PINNED_SHARE,
  type PinLayout,
  RESERVED_COLUMN_IDS,
  rowResetClassName,
  scrollAreaClassName,
  scrollRegionClassName,
  scrollShadowClassName,
  stickyHeaderClassName,
  tableClassName,
} from "../utils";
import { DataTableBody } from "./data-table-body";
import { DataTableFooterRow } from "./data-table-footer-row";
import { DataTableHeadCell } from "./data-table-head-cell";

/**
 * The scroll container and the `<table>`: header rows, body and footer. It measures the pinned
 * columns, suspends pinning when they would cover too much of the table, and shows a shadow at each
 * edge that hides content.
 */
export function DataTableContent<TData extends RowData>() {
  const { props, table, tableElementRef, titleId } = useDataTableContext<TData>();
  const resizing = props.resizing !== undefined;

  const scrollRef = useRef<HTMLDivElement>(null);
  const area = useScrollArea(scrollRef, tableElementRef, props.stickyHeader === true);

  const startIds = table.getStartVisibleLeafColumns().map((column) => column.id);
  const endIds = table.getEndVisibleLeafColumns().map((column) => column.id);
  const pinned = usePinnedOffsets(tableElementRef, startIds, endIds);
  const measured = pinned.offsets;
  // Pinned columns that would cover most of a narrow table scroll with the rest instead: first the
  // data columns, keeping the narrow selection, expand and actions columns (always the outermost,
  // so their offsets do not change), then those too if they are still too wide. The pinning state
  // is kept and applies again when the table is wide enough.
  const inset = (ids: readonly string[]) =>
    ids.reduce((sum, id) => sum + (pinned.widths[id] ?? 0), 0);
  const limit = area.width * MAX_PINNED_SHARE;
  let activeStart: readonly string[] = startIds;
  let activeEnd: readonly string[] = endIds;
  if (area.width > 0 && pinned.start + pinned.end > limit) {
    activeStart = startIds.filter((id) => RESERVED_COLUMN_IDS.has(id));
    activeEnd = endIds.filter((id) => RESERVED_COLUMN_IDS.has(id));
    if (inset(activeStart) + inset(activeEnd) > limit) {
      activeStart = [];
      activeEnd = [];
    }
  }
  const suspended = activeStart.length < startIds.length || activeEnd.length < endIds.length;
  const startInset = inset(activeStart);
  const endInset = inset(activeEnd);

  const pinOf = (id: string): PinLayout | undefined => {
    const startIndex = activeStart.indexOf(id);
    if (startIndex >= 0) {
      return {
        side: "start",
        offset: resizing ? (table.getColumn(id)?.getStart("start") ?? 0) : (measured[id] ?? 0),
        edge: startIndex === activeStart.length - 1,
      };
    }
    const endIndex = activeEnd.indexOf(id);
    if (endIndex >= 0) {
      return {
        side: "end",
        offset: resizing ? (table.getColumn(id)?.getAfter("end") ?? 0) : (measured[id] ?? 0),
        edge: endIndex === 0,
      };
    }
    return undefined;
  };

  /** A group header sticks when all its leaves are pinned to the same edge. */
  const groupPin = (header: Header<DataTableFeatures, TData, unknown>) => {
    const leaves = header
      .getLeafHeaders()
      .filter((leaf) => leaf.subHeaders.length === 0)
      .map((leaf) => leaf.column.id);
    if (leaves.length === 0) return undefined;
    const pins = leaves.map(pinOf);
    if (pins.every((pin) => pin?.side === "start")) {
      return {
        side: "start",
        offset: pins[0]?.offset ?? 0,
        edge: pins.at(-1)?.edge ?? false,
      } as const;
    }
    if (pins.every((pin) => pin?.side === "end")) {
      return {
        side: "end",
        offset: pins.at(-1)?.offset ?? 0,
        edge: pins[0]?.edge ?? false,
      } as const;
    }
    return undefined;
  };

  // TanStack repeats a leaf column that has no group as a placeholder in the upper header rows.
  // The leaf is drawn once, in its first row, spanning the remaining rows.
  const headerGroups = table.getHeaderGroups();
  const drawn = new Set<string>();
  const headerRows = headerGroups.map((group, depth) => {
    const cells: ReactNode[] = [];
    for (const header of group.headers) {
      const leaf = header.subHeaders.length === 0;
      if (leaf || header.isPlaceholder) {
        if (drawn.has(header.column.id)) continue;
        drawn.add(header.column.id);
        cells.push(
          <DataTableHeadCell
            key={header.id}
            header={header}
            rowSpan={headerGroups.length - depth}
            pin={pinOf(header.column.id)}
          />,
        );
      } else {
        cells.push(
          <DataTableHeadCell key={header.id} header={header} rowSpan={1} pin={groupPin(header)} />,
        );
      }
    }
    return (
      <TableRow key={group.id} className={cn(rowResetClassName, props.classNames?.headerRow)}>
        {cells}
      </TableRow>
    );
  });

  const labelledBy =
    props["aria-labelledby"] ??
    (!props["aria-label"] && props.header && props.header.title !== undefined
      ? titleId
      : undefined);

  const name = { "aria-label": props["aria-label"], "aria-labelledby": labelledBy };
  return (
    <div data-slot="data-table-scroll-area" className={scrollAreaClassName}>
      {/* A scrolling container is a named, focusable region, so keyboard users can scroll it. */}
      <div
        ref={scrollRef}
        data-slot="table-container"
        data-pins-suspended={suspended ? "" : undefined}
        {...(area.scrollable ? { role: "region", tabIndex: 0, ...name } : {})}
        className={cn(containerClassName, scrollRegionClassName, props.classNames?.container)}
        style={{
          maxHeight: props.maxHeight,
          scrollPaddingInlineStart: startInset || undefined,
          scrollPaddingInlineEnd: endInset || undefined,
        }}
      >
        <table
          ref={tableElementRef}
          data-slot="table"
          aria-label={props["aria-label"]}
          aria-labelledby={labelledBy}
          aria-busy={props.loading ? true : undefined}
          className={cn(tableClassName, resizing && "table-fixed", props.classNames?.table)}
          style={resizing ? { width: table.getTotalSize(), minWidth: "100%" } : undefined}
        >
          <TableHeader className={cn(props.stickyHeader && stickyHeaderClassName)}>
            {headerRows}
          </TableHeader>
          <DataTableBody pinOf={pinOf} />
          <DataTableFooterRow pinOf={pinOf} />
        </table>
      </div>
      {/* Shadows at the edges that hide content, next to the pinned columns. */}
      <div
        aria-hidden
        data-slot="data-table-scroll-shadow"
        data-side="start"
        className={scrollShadowClassName.start}
        style={{ insetInlineStart: startInset }}
      />
      <div
        aria-hidden
        data-slot="data-table-scroll-shadow"
        data-side="end"
        className={scrollShadowClassName.end}
        style={{ insetInlineEnd: endInset }}
      />
    </div>
  );
}
