import { type RefObject, useLayoutEffect, useState } from "react";

/**
 * The text direction an element inherits from the page (`dir="rtl"` on an ancestor, or CSS
 * `direction`). Radix primitives such as the radio group default to `"ltr"` and set it on their
 * root unless they get a `dir`, which breaks their layout and arrow keys in right-to-left pages.
 * Passing this value keeps them in the surrounding direction. It is `undefined` before the element
 * mounts, then follows the page: it is read again when `dir`, `class` or `style` changes on the
 * element or one of its ancestors, such as when an app switches to a right-to-left language.
 */
export function useInheritedDirection(ref: RefObject<HTMLElement | null>) {
  const [direction, setDirection] = useState<"ltr" | "rtl">();
  useLayoutEffect(() => {
    const element = ref.current;
    if (!element) return;
    const read = () => setDirection(getComputedStyle(element).direction === "rtl" ? "rtl" : "ltr");
    read();
    // Only the ancestors are observed, not their subtrees, so unrelated changes cost nothing.
    const observer = new MutationObserver(read);
    for (let node: Element | null = element; node; node = node.parentElement) {
      observer.observe(node, { attributeFilter: ["dir", "class", "style"] });
    }
    return () => observer.disconnect();
  }, [ref]);
  return direction;
}
