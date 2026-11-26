import { type KeyboardEvent, type PointerEvent, useCallback, useRef } from "react";

/** Options of `useCropDrag`. */
export interface UseCropDragOptions {
  /** Current zoom, which the keys step from. */
  zoom: number;
  /** Moves the image, in fractions of the window. */
  moveBy: (dx: number, dy: number) => void;
  /** Sets the zoom. */
  zoomTo: (zoom: number) => void;
  /** Centres the image. */
  center: () => void;
  /** Ignores pointer and keys. */
  disabled: boolean;
}

/** Step of an arrow key, and of Shift + arrow, as a fraction of the window. */
export const MOVE_STEP = 0.02;
/** Step of Shift + arrow. */
export const LARGE_MOVE_STEP = 0.1;
/** Zoom change of the `+` and `-` keys. */
export const ZOOM_STEP = 0.1;

/**
 * Moving the image in the crop area.
 *
 * - **Pointer:** dragging (touch included) moves it by the pointer's distance, measured in
 *   fractions of the area's width.
 * - **Keyboard:** the arrow keys move it in the direction of the arrow on screen (in any page
 *   direction), Shift for larger steps; `+`/`=` and `-` zoom; Home centres it.
 */
export function useCropDrag({ zoom, moveBy, zoomTo, center, disabled }: UseCropDragOptions) {
  const last = useRef<{ x: number; y: number; id: number } | null>(null);

  const onPointerDown = useCallback(
    (event: PointerEvent<HTMLElement>) => {
      if (disabled || event.button !== 0) return;
      event.preventDefault();
      try {
        event.currentTarget.setPointerCapture(event.pointerId);
      } catch {
        // Synthetic pointers have no capturable pointer: drag anyway.
      }
      last.current = { x: event.clientX, y: event.clientY, id: event.pointerId };
    },
    [disabled],
  );

  const onPointerMove = useCallback(
    (event: PointerEvent<HTMLElement>) => {
      const start = last.current;
      if (!start || start.id !== event.pointerId) return;
      const side = event.currentTarget.getBoundingClientRect().width || 1;
      moveBy((event.clientX - start.x) / side, (event.clientY - start.y) / side);
      last.current = { ...start, x: event.clientX, y: event.clientY };
    },
    [moveBy],
  );

  const onPointerUp = useCallback((event: PointerEvent<HTMLElement>) => {
    if (event.currentTarget.hasPointerCapture?.(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
    last.current = null;
  }, []);

  const onKeyDown = useCallback(
    (event: KeyboardEvent<HTMLElement>) => {
      if (disabled) return;
      const step = event.shiftKey ? LARGE_MOVE_STEP : MOVE_STEP;
      const moves: Record<string, [number, number]> = {
        ArrowLeft: [-step, 0],
        ArrowRight: [step, 0],
        ArrowUp: [0, -step],
        ArrowDown: [0, step],
      };
      const move = moves[event.key];
      if (move) {
        event.preventDefault();
        moveBy(move[0], move[1]);
      } else if (event.key === "+" || event.key === "=") {
        event.preventDefault();
        zoomTo(zoom + ZOOM_STEP);
      } else if (event.key === "-") {
        event.preventDefault();
        zoomTo(zoom - ZOOM_STEP);
      } else if (event.key === "Home") {
        event.preventDefault();
        center();
      }
    },
    [center, disabled, moveBy, zoom, zoomTo],
  );

  return {
    onPointerDown,
    onPointerMove,
    onPointerUp,
    onPointerCancel: onPointerUp,
    onKeyDown,
  };
}
