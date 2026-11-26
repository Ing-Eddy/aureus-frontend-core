import { type RefObject, useEffect } from "react";
import { attributeSelector } from "../utils";

/** The attribute the stylesheet paints. */
const HOVER = "data-column-hover";

/**
 * Column hover by DOM attributes, not React state (design decision 6): every cell carries
 * `data-column-id` (its leaf column) and group headers `data-column-leaves`; the cells of the
 * column under the pointer get `data-column-hover`, so nothing re-renders while the pointer moves.
 */
export function useColumnHover(tableRef: RefObject<HTMLTableElement | null>, enabled: boolean) {
  useEffect(() => {
    const table = tableRef.current;
    if (!enabled || !table) return;
    let current = "";

    const clear = () => {
      for (const element of table.querySelectorAll(`[${HOVER}]`)) element.removeAttribute(HOVER);
      current = "";
    };

    const onOver = (event: PointerEvent) => {
      const cell = (event.target as Element | null)?.closest?.(
        "[data-column-id], [data-column-leaves]",
      );
      if (!cell || !table.contains(cell)) return;
      const leaves =
        cell.getAttribute("data-column-leaves") ?? cell.getAttribute("data-column-id") ?? "";
      if (leaves === current) return;
      clear();
      current = leaves;
      for (const id of leaves.split(" ").filter(Boolean)) {
        for (const element of table.querySelectorAll(attributeSelector("data-column-id", id))) {
          element.setAttribute(HOVER, "");
        }
      }
    };

    table.addEventListener("pointerover", onOver);
    table.addEventListener("pointerleave", clear);
    return () => {
      table.removeEventListener("pointerover", onOver);
      table.removeEventListener("pointerleave", clear);
      clear();
    };
  }, [tableRef, enabled]);
}
