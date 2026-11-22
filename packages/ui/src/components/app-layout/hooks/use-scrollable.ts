import { type RefObject, useLayoutEffect, useState } from "react";

/**
 * Whether an element's content overflows it vertically, kept up to date as the element or its
 * content resize. A scrolling region needs a tab stop so keyboard users can scroll it when it has
 * nothing focusable inside. `false` where `ResizeObserver` is missing.
 */
export function useScrollable(
  elementRef: RefObject<HTMLElement | null>,
  contentRef: RefObject<HTMLElement | null>,
): boolean {
  const [scrollable, setScrollable] = useState(false);
  useLayoutEffect(() => {
    const element = elementRef.current;
    if (!element || typeof ResizeObserver === "undefined") return;
    const measure = () => setScrollable(element.scrollHeight > element.clientHeight + 1);
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(element);
    if (contentRef.current) observer.observe(contentRef.current);
    return () => observer.disconnect();
  }, [elementRef, contentRef]);
  return scrollable;
}
