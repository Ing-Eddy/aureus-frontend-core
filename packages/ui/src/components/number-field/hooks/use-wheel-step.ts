import { type RefObject, useEffect, useRef } from "react";

/**
 * With `enabled`, the mouse wheel steps the value while the input is focused, and the page does
 * not scroll meanwhile. Attached natively because React wheel listeners are passive.
 */
export function useWheelStep(
  ref: RefObject<HTMLInputElement | null>,
  enabled: boolean,
  onStep: (direction: "increment" | "decrement") => void,
) {
  const onStepRef = useRef(onStep);
  onStepRef.current = onStep;

  useEffect(() => {
    const input = ref.current;
    if (!enabled || !input) return;
    const handleWheel = (event: WheelEvent) => {
      if (input.ownerDocument.activeElement !== input || event.deltaY === 0) return;
      event.preventDefault();
      onStepRef.current(event.deltaY < 0 ? "increment" : "decrement");
    };
    input.addEventListener("wheel", handleWheel, { passive: false });
    return () => input.removeEventListener("wheel", handleWheel);
  }, [ref, enabled]);
}
