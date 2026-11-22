import { type KeyboardEvent, useCallback, useState } from "react";

export type RovingKeyMap = Readonly<Record<string, "previous" | "next" | "first" | "last">>;

/** Row keys: up and down, Home and End. */
export const rowKeys: RovingKeyMap = {
  ArrowUp: "previous",
  ArrowDown: "next",
  Home: "first",
  End: "last",
};

/** Column header keys, mirrored in RTL. */
export function columnKeys(direction: "ltr" | "rtl" | undefined): RovingKeyMap {
  const rtl = direction === "rtl";
  return {
    ArrowLeft: rtl ? "next" : "previous",
    ArrowRight: rtl ? "previous" : "next",
    Home: "first",
    End: "last",
  };
}

/**
 * One tab stop for a set of items (the focusable rows, or the markable column headers): the
 * active item has `tabIndex` 0 and the others -1, and the keys move the focus between them.
 */
export function useRovingFocus() {
  const [activeId, setActiveId] = useState<string>();

  /** The active id when it is still among `ids`, else `fallback`, else the first id. */
  const tabStop = useCallback(
    (ids: readonly string[], fallback?: string) => {
      if (activeId !== undefined && ids.includes(activeId)) return activeId;
      if (fallback !== undefined && ids.includes(fallback)) return fallback;
      return ids[0];
    },
    [activeId],
  );

  /**
   * Moves the focus for a key from `keys`, when the event is on the item itself (not on a control
   * inside it). `find(id)` returns the element of an item.
   */
  const onKeyDown = useCallback(
    (
      event: KeyboardEvent<HTMLElement>,
      keys: RovingKeyMap,
      ids: readonly string[],
      currentId: string,
      find: (id: string) => HTMLElement | null | undefined,
    ) => {
      const move = keys[event.key];
      if (!move || event.target !== event.currentTarget || ids.length === 0) return;
      const index = ids.indexOf(currentId);
      const target =
        move === "first"
          ? 0
          : move === "last"
            ? ids.length - 1
            : Math.min(Math.max(index + (move === "next" ? 1 : -1), 0), ids.length - 1);
      const id = ids[target];
      if (id === undefined) return;
      event.preventDefault();
      setActiveId(id);
      find(id)?.focus();
    },
    [],
  );

  return { activeId, setActiveId, tabStop, onKeyDown };
}
