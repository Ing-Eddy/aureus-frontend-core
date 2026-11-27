import { type RefObject, useCallback, useEffect, useLayoutEffect, useState } from "react";

/**
 * Whether the description is cut: `overflows` while it is clamped, `scrolls` while it is expanded
 * up to its maximum height. Collapsed it keeps what it found, so the button stays while expanded.
 */
export function useTextOverflow(ref: RefObject<HTMLElement | null>, expanded: boolean) {
  const [overflows, setOverflows] = useState(false);
  const [scrolls, setScrolls] = useState(false);
  const measure = useCallback(() => {
    const element = ref.current;
    if (!element) return;
    // One pixel of slack: fractional line heights round the two sizes differently.
    const cut = element.scrollHeight > element.clientHeight + 1;
    if (expanded) setScrolls(cut);
    else {
      setOverflows(cut);
      setScrolls(false);
    }
  }, [ref, expanded]);
  // After every render, because the text may have been replaced without changing the clamped size.
  useLayoutEffect(measure);
  // And when the width changes, such as on a narrower screen or a late web font.
  useEffect(() => {
    const element = ref.current;
    if (!element || typeof ResizeObserver !== "function") return;
    const observer = new ResizeObserver(measure);
    observer.observe(element);
    return () => observer.disconnect();
  }, [ref, measure]);
  return { overflows, scrolls };
}
