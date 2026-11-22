import { renderHook } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { usePinnedOffsets } from "../hooks/use-pinned-offsets";
import { paginationTexts, renderTable } from "./render-data-table";

function tableWith(widths: Record<string, number>) {
  const table = document.createElement("table");
  const head = table.createTHead().insertRow();
  for (const [id, width] of Object.entries(widths)) {
    const cell = document.createElement("th");
    cell.setAttribute("data-column-id", id);
    cell.getBoundingClientRect = () => ({ width }) as DOMRect;
    head.appendChild(cell);
  }
  document.body.appendChild(table);
  return { current: table };
}

describe("usePinnedOffsets", () => {
  it("accumulates the widths of the pinned header cells from each edge, and their totals", () => {
    const ref = tableWith({ a: 40, b: 120, c: 200, y: 60, z: 80 });
    const { result } = renderHook(() => usePinnedOffsets(ref, ["a", "b"], ["y", "z"]));
    expect(result.current).toEqual({
      offsets: { a: 0, b: 40, y: 80, z: 0 },
      widths: { a: 40, b: 120, y: 60, z: 80 },
      start: 160,
      end: 140,
    });
  });

  it("measures the td header cells of the reserved display columns", () => {
    const ref = tableWith({ a: 40 });
    const select = document.createElement("td");
    select.setAttribute("data-column-id", "__aureus_select");
    select.getBoundingClientRect = () => ({ width: 36 }) as DOMRect;
    ref.current.tHead?.rows[0]?.prepend(select);
    const { result } = renderHook(() => usePinnedOffsets(ref, ["__aureus_select", "a"], []));
    expect(result.current.offsets).toEqual({ __aureus_select: 0, a: 36 });
    expect(result.current.start).toBe(76);
  });

  it("is empty when nothing is pinned", () => {
    const ref = tableWith({ a: 40 });
    expect(renderHook(() => usePinnedOffsets(ref, [], [])).result.current).toEqual({
      offsets: {},
      widths: {},
      start: 0,
      end: 0,
    });
  });

  it("observes the pinned header cells", () => {
    const observe = vi.fn();
    const original = globalThis.ResizeObserver;
    globalThis.ResizeObserver = class {
      observe = observe;
      unobserve() {}
      disconnect() {}
    } as unknown as typeof ResizeObserver;
    const ref = tableWith({ a: 40, b: 10 });
    renderHook(() => usePinnedOffsets(ref, ["a"], ["b"]));
    expect(observe).toHaveBeenCalledTimes(2);
    globalThis.ResizeObserver = original;
  });
});

describe("offsets with resizing", () => {
  it("come from the column sizes", () => {
    renderTable({
      columns: [
        { accessorKey: "name", header: "Name", pin: "start", size: 120 },
        { accessorKey: "email", header: "Email", pin: "start", size: 200 },
        { accessorKey: "age", header: "Age" },
      ],
      resizing: { resizeLabel: (column) => `Resize ${column}` },
      pagination: paginationTexts,
    });
    const email = document.querySelector('th[data-column-id="email"]') as HTMLElement;
    expect(email.style.insetInlineStart).toBe("120px");
  });
});
