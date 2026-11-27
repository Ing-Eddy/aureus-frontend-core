import { type MouseEvent, type PointerEvent, useRef } from "react";
import type { ToastData } from "../types";
import { createToastContext, isCardPress, type Point, toast } from "../utils/helpers";

/**
 * The behaviour of a clickable toast. The title button gives keyboard access; pointer presses on
 * the rest of the card are delegated here, so no control is nested inside another.
 */
export function useToastClick(id: string, { onClick, keepOpenOnClick = false }: ToastData) {
  const origin = useRef<Point | null>(null);
  if (!onClick) return { activate: undefined, rootProps: {} };

  const activate = () => {
    onClick(createToastContext(id));
    if (!keepOpenOnClick) toast.dismiss(id);
  };
  return {
    activate,
    rootProps: {
      onPointerDown(event: PointerEvent<HTMLElement>) {
        origin.current = { x: event.clientX, y: event.clientY };
      },
      onClick(event: MouseEvent<HTMLElement>) {
        const start = origin.current;
        origin.current = null;
        const press = isCardPress({
          point: { x: event.clientX, y: event.clientY },
          origin: start,
          target: event.target as Element,
          card: event.currentTarget,
        });
        if (press && !event.defaultPrevented) activate();
      },
    },
  };
}
