import { type RefObject, useLayoutEffect, useState } from "react";
import { attributeSelector } from "../utils";

/** The measured layout of the pinned columns. */
export interface PinnedOffsets {
  /** Inset of each pinned leaf column from its edge, by column id. */
  readonly offsets: Readonly<Record<string, number>>;
  /** Rendered width of each pinned leaf column, by column id. */
  readonly widths: Readonly<Record<string, number>>;
  /** Total width pinned to the inline start. */
  readonly start: number;
  /** Total width pinned to the inline end. */
  readonly end: number;
}

/** The result while nothing is pinned; one object, so no re-render. */
const NONE: PinnedOffsets = { offsets: {}, widths: {}, start: 0, end: 0 };

/** Whether two measures are equal, to skip a re-render. */
function sameOffsets(a: PinnedOffsets, b: PinnedOffsets) {
  const keys = Object.keys(a.offsets);
  return (
    a.start === b.start &&
    a.end === b.end &&
    keys.length === Object.keys(b.offsets).length &&
    keys.every((key) => a.offsets[key] === b.offsets[key] && a.widths[key] === b.widths[key])
  );
}

/**
 * Inset of each pinned leaf column from its edge, and the width pinned to each edge, from the
 * rendered widths of the pinned header cells (design decision 8): automatic table layout stays as
 * the browser lays it out. It only re-renders when a pinned width changes. The reserved display
 * columns render their header as a `td`, so both cell kinds are measured.
 */
export function usePinnedOffsets(
  tableRef: RefObject<HTMLTableElement | null>,
  start: readonly string[],
  end: readonly string[],
): PinnedOffsets {
  const [offsets, setOffsets] = useState<PinnedOffsets>(NONE);
  const startKey = start.join("\u0000");
  const endKey = end.join("\u0000");

  useLayoutEffect(() => {
    const table = tableRef.current;
    const startIds = startKey ? startKey.split("\u0000") : [];
    const endIds = endKey ? endKey.split("\u0000") : [];
    if (!table || (startIds.length === 0 && endIds.length === 0)) {
      setOffsets((previous) => (previous === NONE ? previous : NONE));
      return;
    }
    const headerCell = (id: string) =>
      table.querySelector<HTMLElement>(
        `thead :is(th, td)${attributeSelector("data-column-id", id)}`,
      );
    const width = (id: string) => headerCell(id)?.getBoundingClientRect().width ?? 0;
    const measure = () => {
      const next: Record<string, number> = {};
      const widths: Record<string, number> = {};
      let startWidth = 0;
      for (const id of startIds) {
        next[id] = startWidth;
        widths[id] = width(id);
        startWidth += widths[id];
      }
      let endWidth = 0;
      for (const id of [...endIds].reverse()) {
        next[id] = endWidth;
        widths[id] = width(id);
        endWidth += widths[id];
      }
      const measured = { offsets: next, widths, start: startWidth, end: endWidth };
      setOffsets((previous) => (sameOffsets(previous, measured) ? previous : measured));
    };
    measure();
    const observer = new ResizeObserver(measure);
    for (const id of [...startIds, ...endIds]) {
      const cell = headerCell(id);
      if (cell) observer.observe(cell);
    }
    return () => observer.disconnect();
  }, [tableRef, startKey, endKey]);

  return offsets;
}
