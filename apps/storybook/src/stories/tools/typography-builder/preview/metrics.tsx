import { type RefObject, useEffect, useState } from "react";

/** Size in px, line height as a ratio, and weight of a rendered element (in its own frame). */
export function readMetrics(element: HTMLElement): string {
  const view = element.ownerDocument.defaultView ?? window;
  const style = view.getComputedStyle(element);
  const size = Number.parseFloat(style.fontSize);
  const lineHeight = Number.parseFloat(style.lineHeight);
  const ratio = Number.isNaN(lineHeight)
    ? style.lineHeight
    : String(Math.round((lineHeight / size) * 100) / 100);
  return `${Math.round(size * 100) / 100}px · ${ratio} · ${style.fontWeight}`;
}

/**
 * Live metrics of the referenced element. They are read again when `version` changes (new CSS or
 * width), when the frame resizes and once the frame's fonts have loaded.
 */
export function useMetrics(target: RefObject<HTMLElement | null>, version: string): string {
  const [metrics, setMetrics] = useState("");
  // biome-ignore lint/correctness/useExhaustiveDependencies: `version` is the re-measure trigger.
  useEffect(() => {
    const element = target.current;
    if (!element) return;
    const update = () => setMetrics(readMetrics(element));
    // The frame applies new CSS in an effect of its own: measure on the next frame.
    const view = element.ownerDocument.defaultView;
    const frame = view?.requestAnimationFrame(update);
    const observer = view ? new view.ResizeObserver(update) : undefined;
    observer?.observe(element.ownerDocument.body);
    element.ownerDocument.fonts?.ready?.then(update);
    return () => {
      if (frame !== undefined) view?.cancelAnimationFrame(frame);
      observer?.disconnect();
    };
  }, [target, version]);
  return metrics;
}
