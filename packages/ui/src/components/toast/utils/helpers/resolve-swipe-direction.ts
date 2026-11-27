import type { ToastPosition } from "../../types";

/** A physical direction the engine can swipe a toast in. */
type SwipeDirection = "up" | "down" | "left" | "right";

/**
 * A toast is swiped out toward the edges it sits at. `start` and `end` are logical, so the physical
 * side depends on the text direction.
 */
export function resolveSwipeDirections(
  position: ToastPosition,
  direction: "ltr" | "rtl",
): SwipeDirection[] {
  const [edge, side] = position.split("-");
  const vertical: SwipeDirection = edge === "top" ? "up" : "down";
  if (side === "center") return [vertical];
  const isLeft = (side === "start") === (direction === "ltr");
  return [vertical, isLeft ? "left" : "right"];
}
