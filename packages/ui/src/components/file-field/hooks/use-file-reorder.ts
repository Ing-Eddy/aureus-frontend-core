import {
  type KeyboardEvent,
  type PointerEvent,
  type RefObject,
  useCallback,
  useLayoutEffect,
  useRef,
  useState,
} from "react";

export interface UseFileReorderOptions {
  /** Item ids in their current order. */
  ids: readonly string[];
  enabled: boolean;
  move: (from: number, to: number) => void;
  /** Announces the item's new position (1-based) after a move. */
  announce: (id: string, position: number, total: number) => void;
  /** The element that contains the items, to find handles and items by id. */
  containerRef: RefObject<HTMLElement | null>;
  /** Mirrors ArrowLeft and ArrowRight in right-to-left pages. */
  direction?: "ltr" | "rtl";
}

const handleSelector = (id: string) => `[data-file-handle="${CSS.escape(id)}"]`;

/**
 * Reordering without a library.
 *
 * - **Keyboard:** Space or Enter on an item's handle grabs it, the arrow keys move it (Up and the
 *   inline-start arrow go back, Down and the inline-end arrow go forward), Space or Enter drops
 *   it, Escape puts it back, and Tab or leaving the handle drops it.
 * - **Pointer:** dragging a handle (touch included) moves the item over the one under the pointer.
 *
 * Each move is announced. Focus stays on the moved handle.
 */
export function useFileReorder({
  ids,
  enabled,
  move,
  announce,
  containerRef,
  direction,
}: UseFileReorderOptions) {
  const [grabbed, setGrabbed] = useState<string | null>(null);
  const origin = useRef(-1);
  const moving = useRef(false);
  const idsRef = useRef(ids);
  idsRef.current = ids;

  // React moves the DOM node of a reordered item, which drops focus: put it back.
  useLayoutEffect(() => {
    if (!moving.current) return;
    moving.current = false;
    if (!grabbed) return;
    containerRef.current?.querySelector<HTMLElement>(handleSelector(grabbed))?.focus();
  });

  const moveTo = useCallback(
    (id: string, to: number) => {
      const list = idsRef.current;
      const from = list.indexOf(id);
      if (from < 0 || to < 0 || to >= list.length || from === to) return;
      moving.current = true;
      move(from, to);
      announce(id, to + 1, list.length);
    },
    [announce, move],
  );

  const drop = useCallback(() => {
    setGrabbed(null);
    origin.current = -1;
  }, []);

  const onHandleKeyDown = useCallback(
    (id: string, event: KeyboardEvent<HTMLElement>) => {
      if (!enabled) return;
      const index = idsRef.current.indexOf(id);
      const grab = event.key === " " || event.key === "Enter";
      if (grabbed !== id) {
        if (!grab) return;
        event.preventDefault();
        origin.current = index;
        setGrabbed(id);
        return;
      }
      const back = direction === "rtl" ? "ArrowRight" : "ArrowLeft";
      const forward = direction === "rtl" ? "ArrowLeft" : "ArrowRight";
      if (event.key === "ArrowUp" || event.key === back) {
        event.preventDefault();
        moveTo(id, index - 1);
      } else if (event.key === "ArrowDown" || event.key === forward) {
        event.preventDefault();
        moveTo(id, index + 1);
      } else if (grab) {
        event.preventDefault();
        drop();
      } else if (event.key === "Escape") {
        event.preventDefault();
        moveTo(id, origin.current);
        drop();
      } else if (event.key === "Tab") {
        drop();
      }
    },
    [direction, drop, enabled, grabbed, moveTo],
  );

  const onHandleBlur = useCallback(() => {
    if (moving.current) return;
    drop();
  }, [drop]);

  const onHandlePointerDown = useCallback(
    (id: string, event: PointerEvent<HTMLElement>) => {
      if (!enabled || event.button !== 0) return;
      event.preventDefault();
      try {
        event.currentTarget.setPointerCapture(event.pointerId);
      } catch {
        // Synthetic pointers (and some assistive tools) have no capturable pointer: drag anyway.
      }
      setGrabbed(id);
    },
    [enabled],
  );

  const onHandlePointerMove = useCallback(
    (id: string, event: PointerEvent<HTMLElement>) => {
      if (grabbed !== id || typeof document.elementsFromPoint !== "function") return;
      const target = document
        .elementsFromPoint(event.clientX, event.clientY)
        .map((element) => element.closest<HTMLElement>("[data-file-item-id]"))
        .find((element) => element && element.dataset.fileItemId !== id);
      const targetId = target?.dataset.fileItemId;
      if (!targetId || !containerRef.current?.contains(target)) return;
      moveTo(id, idsRef.current.indexOf(targetId));
    },
    [containerRef, grabbed, moveTo],
  );

  const onHandlePointerUp = useCallback(
    (id: string, event: PointerEvent<HTMLElement>) => {
      if (grabbed !== id) return;
      if (event.currentTarget.hasPointerCapture?.(event.pointerId)) {
        event.currentTarget.releasePointerCapture(event.pointerId);
      }
      drop();
    },
    [drop, grabbed],
  );

  return {
    grabbed,
    handleProps: (id: string) => ({
      "data-file-handle": id,
      "aria-pressed": enabled ? grabbed === id : undefined,
      onKeyDown: (event: KeyboardEvent<HTMLElement>) => onHandleKeyDown(id, event),
      onBlur: onHandleBlur,
      onPointerDown: (event: PointerEvent<HTMLElement>) => onHandlePointerDown(id, event),
      onPointerMove: (event: PointerEvent<HTMLElement>) => onHandlePointerMove(id, event),
      onPointerUp: (event: PointerEvent<HTMLElement>) => onHandlePointerUp(id, event),
      onPointerCancel: (event: PointerEvent<HTMLElement>) => onHandlePointerUp(id, event),
    }),
  };
}
