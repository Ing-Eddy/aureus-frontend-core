import type { Column, RowData } from "@tanstack/react-table";
import type { CSSProperties } from "react";
import type { DataTableAlign, DataTableLeafColumn } from "../types";
import type { DataTableFeatures } from "./data-table-features";

// biome-ignore lint/suspicious/noExplicitAny: works for any row type.
export type AnyColumn = Column<DataTableFeatures, any>;

/** The consumer's column behind a TanStack column (data and group columns). */
export function sourceOf<TData extends RowData>(
  column: Column<DataTableFeatures, TData>,
): DataTableLeafColumn<TData> | undefined {
  return column.columnDef.meta?.aureus.source as DataTableLeafColumn<TData> | undefined;
}

export function alignOf(column: AnyColumn): DataTableAlign {
  return sourceOf(column)?.align ?? "start";
}

export interface PinLayout {
  side: "start" | "end";
  offset: number;
  /** The last start-pinned or first end-pinned visible column: shows the divider. */
  edge: boolean;
}

export interface PinAttributes {
  style?: CSSProperties;
  "data-pinned"?: "start" | "end";
  "data-opaque"?: "";
  "data-pin-edge"?: "start" | "end";
}

/** Inline styles and attributes of a pinned cell. */
export function pinAttributes(pin: PinLayout | undefined): PinAttributes {
  if (!pin) return {};
  const style: CSSProperties =
    pin.side === "start" ? { insetInlineStart: pin.offset } : { insetInlineEnd: pin.offset };
  return {
    style,
    "data-pinned": pin.side,
    "data-opaque": "",
    ...(pin.edge ? { "data-pin-edge": pin.side } : {}),
  };
}
