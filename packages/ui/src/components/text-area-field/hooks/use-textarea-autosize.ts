import { type RefObject, useCallback, useEffect, useLayoutEffect, useRef } from "react";

export interface UseTextareaAutosizeOptions {
  ref: RefObject<HTMLTextAreaElement | null>;
  minRows: number;
  maxRows: number;
}

const px = (value: string) => Number.parseFloat(value) || 0;

/**
 * Sizes a textarea to its content, between `minRows` and `maxRows` lines, without relying on CSS
 * `field-sizing` (not supported everywhere). A height the user drags to becomes the new minimum;
 * a width change (responsive layout) re-measures.
 */
export function useTextareaAutosize({ ref, minRows, maxRows }: UseTextareaAutosizeOptions) {
  const sizing = useRef({ floor: 0, lastApplied: 0, lastWidth: 0 });

  const adjust = useCallback(() => {
    const textarea = ref.current;
    if (!textarea) return;
    const style = getComputedStyle(textarea);
    const fontSize = px(style.fontSize) || 16;
    const lineHeight = style.lineHeight === "normal" ? fontSize * 1.2 : px(style.lineHeight);
    const lines = lineHeight || fontSize * 1.2;
    const padding = px(style.paddingTop) + px(style.paddingBottom);
    const border = px(style.borderTopWidth) + px(style.borderBottomWidth);
    const minPx = minRows * lines + padding + border;
    const maxPx = Number.isFinite(maxRows) ? maxRows * lines + padding + border : Infinity;

    textarea.style.minHeight = `${minPx}px`;
    textarea.style.maxHeight = Number.isFinite(maxPx) ? `${maxPx}px` : "";
    // Collapse first so `scrollHeight` reports the content, and the field can shrink.
    textarea.style.height = `${minPx}px`;
    const content = textarea.scrollHeight + border;
    const next = Math.min(Math.max(content, sizing.current.floor, minPx), maxPx);
    textarea.style.height = `${next}px`;
    textarea.style.overflowY = content > maxPx ? "auto" : "hidden";
    sizing.current.lastApplied = next;
  }, [ref, minRows, maxRows]);

  // Every render: covers controlled values, prop changes and the first paint.
  useLayoutEffect(() => {
    adjust();
  });

  useEffect(() => {
    const textarea = ref.current;
    if (!textarea) return;
    // Uncontrolled typing does not re-render the field.
    textarea.addEventListener("input", adjust);

    let observer: ResizeObserver | undefined;
    if (typeof ResizeObserver !== "undefined") {
      sizing.current.lastWidth = textarea.offsetWidth;
      observer = new ResizeObserver(() => {
        const width = textarea.offsetWidth;
        const height = textarea.offsetHeight;
        if (width !== sizing.current.lastWidth) {
          sizing.current.lastWidth = width;
          adjust();
          return;
        }
        // Same width, different height than the one we set: the user dragged the handle.
        if (Math.abs(height - sizing.current.lastApplied) > 1) {
          sizing.current.floor = height;
          sizing.current.lastApplied = height;
        }
      });
      observer.observe(textarea);
    }

    return () => {
      textarea.removeEventListener("input", adjust);
      observer?.disconnect();
    };
  }, [ref, adjust]);
}
