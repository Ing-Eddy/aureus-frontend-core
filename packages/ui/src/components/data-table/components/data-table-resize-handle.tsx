import type { Header, RowData } from "@tanstack/react-table";
import type { KeyboardEvent } from "react";
import { cn } from "@/shadcn/lib/utils";
import { useDataTableContext } from "../hooks/use-data-table-context";
import type { DataTableFeatures } from "../utils";

/** Pixels an arrow key adds to or removes from a column's width. */
const STEP = 10;

/** Props of `DataTableResizeHandle`. */
export interface DataTableResizeHandleProps<TData extends RowData> {
  /** The header of the column to resize. */
  header: Header<DataTableFeatures, TData, unknown>;
  /** The column's plain-text label, passed to `resizeLabel`. */
  label: string;
}

/**
 * A keyboard- and pointer-operable column separator (design decision 9): dragging resizes, the
 * arrow keys move by 10px (mirrored in RTL), Home and End go to the minimum and maximum, and a
 * double click restores the column's size.
 */
export function DataTableResizeHandle<TData extends RowData>({
  header,
  label,
}: DataTableResizeHandleProps<TData>) {
  const { props, table, direction } = useDataTableContext<TData>();
  const resizing = props.resizing;
  if (!resizing) return null;

  const { column } = header;
  const size = column.getSize();
  const min = column.columnDef.minSize ?? 20;
  const max = column.columnDef.maxSize;
  const clamp = (value: number) => Math.max(min, max === undefined ? value : Math.min(max, value));
  const setSize = (value: number) =>
    table.setColumnSizing((sizing) => ({ ...sizing, [column.id]: clamp(value) }));

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const grow = direction === "rtl" ? "ArrowLeft" : "ArrowRight";
    const shrink = direction === "rtl" ? "ArrowRight" : "ArrowLeft";
    if (event.key === grow) setSize(size + STEP);
    else if (event.key === shrink) setSize(size - STEP);
    else if (event.key === "Home") setSize(min);
    else if (event.key === "End" && max !== undefined) setSize(max);
    else return;
    event.preventDefault();
    event.stopPropagation();
  };

  const handler = header.getResizeHandler();
  return (
    // biome-ignore lint/a11y/useSemanticElements: a focusable, valued separator has no native element.
    <div
      role="separator"
      tabIndex={0}
      aria-orientation="vertical"
      aria-label={resizing.resizeLabel?.(label)}
      aria-valuenow={Math.round(size)}
      aria-valuemin={min}
      {...(max !== undefined ? { "aria-valuemax": max } : {})}
      data-slot="resize-handle"
      data-resizing={column.getIsResizing() ? "" : undefined}
      onMouseDown={handler}
      onTouchStart={handler}
      onDoubleClick={() => column.resetSize()}
      onKeyDown={onKeyDown}
      className={cn(
        "absolute inset-y-0 end-0 z-10 w-1.5 cursor-col-resize touch-none select-none outline-none pointer-coarse:w-4",
        "hover:bg-border focus-visible:bg-ring data-[resizing]:bg-ring",
      )}
    />
  );
}
