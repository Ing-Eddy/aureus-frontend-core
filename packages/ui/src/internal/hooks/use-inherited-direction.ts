import { type RefObject, useLayoutEffect, useState } from "react";

/**
 * The text direction an element inherits from the page (`dir="rtl"` on an ancestor, or CSS
 * `direction`). Radix primitives such as the radio group default to `"ltr"` and set it on their
 * root unless they get a `dir`, which breaks their layout and arrow keys in right-to-left pages.
 * Passing this value keeps them in the surrounding direction. It is read when the element mounts,
 * and is `undefined` before that.
 */
export function useInheritedDirection(ref: RefObject<HTMLElement | null>) {
  const [direction, setDirection] = useState<"ltr" | "rtl">();
  useLayoutEffect(() => {
    if (!ref.current) return;
    setDirection(getComputedStyle(ref.current).direction === "rtl" ? "rtl" : "ltr");
  }, [ref]);
  return direction;
}
