import { type RefObject, useLayoutEffect, useState } from "react";

export interface ScrollArea {
  /** The content overflows the container in either axis. */
  scrollable: boolean;
  /** The container's inner width, in pixels (0 before the first measure). */
  width: number;
}

const INITIAL: ScrollArea = { scrollable: false, width: 0 };

/**
 * Watches the scroll container. It returns whether it scrolls and its width, which only change on
 * resize, so scrolling never re-renders: the hidden-content flags (`data-scroll-start` /
 * `data-scroll-end`, in logical directions, also in RTL where `scrollLeft` is negative) and the
 * sticky header's `scroll-padding-top` are written to the DOM directly.
 */
export function useScrollArea(
  containerRef: RefObject<HTMLElement | null>,
  tableRef: RefObject<HTMLTableElement | null>,
  stickyHeader: boolean,
): ScrollArea {
  const [area, setArea] = useState<ScrollArea>(INITIAL);

  useLayoutEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const flag = (name: string, on: boolean) => {
      if (on) container.setAttribute(name, "");
      else container.removeAttribute(name);
    };
    const onScroll = () => {
      const offset = Math.abs(container.scrollLeft);
      flag("data-scroll-start", offset > 1);
      flag("data-scroll-end", offset + container.clientWidth < container.scrollWidth - 1);
    };
    const measure = () => {
      onScroll();
      const head = tableRef.current?.tHead;
      container.style.scrollPaddingTop = stickyHeader && head ? `${head.offsetHeight}px` : "";
      const next: ScrollArea = {
        scrollable:
          container.scrollWidth > container.clientWidth + 1 ||
          container.scrollHeight > container.clientHeight + 1,
        width: container.clientWidth,
      };
      setArea((previous) =>
        previous.scrollable === next.scrollable && previous.width === next.width ? previous : next,
      );
    };

    measure();
    container.addEventListener("scroll", onScroll, { passive: true });
    const observer = new ResizeObserver(measure);
    observer.observe(container);
    if (tableRef.current) observer.observe(tableRef.current);
    return () => {
      container.removeEventListener("scroll", onScroll);
      observer.disconnect();
    };
  }, [containerRef, tableRef, stickyHeader]);

  return area;
}
