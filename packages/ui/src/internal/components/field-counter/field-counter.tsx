import { useEffect, useRef, useState } from "react";
import { cn } from "@/shadcn/lib/utils";

export interface FieldCounterProps {
  /** Current number of characters. */
  count: number;
  /** The field's `maxLength`, if any. */
  max?: number;
  /** Id of the screen-reader description, referenced by the input's `aria-describedby`. */
  describedById: string;
  /** What assistive technology hears, e.g. "380 characters remaining". */
  announcement: string;
  /** Delay before the live region announces a change, in ms. */
  announceDelay?: number;
  className?: string;
}

/**
 * Character counter. The visible "120/500" is hidden from assistive technology; instead, the
 * input describes itself with `announcement`, and a polite live region repeats it once the
 * user pauses typing, so screen readers are not interrupted on every keystroke.
 */
export function FieldCounter({
  count,
  max,
  describedById,
  announcement,
  announceDelay = 1000,
  className,
}: FieldCounterProps) {
  const [live, setLive] = useState("");
  const previous = useRef(announcement);

  useEffect(() => {
    // Only changes are announced, after a pause: not the mount (nor StrictMode's re-run of it).
    if (announcement === previous.current) return;
    previous.current = announcement;
    const timer = setTimeout(() => setLive(announcement), announceDelay);
    return () => clearTimeout(timer);
  }, [announcement, announceDelay]);

  const atLimit = max !== undefined && count >= max;

  return (
    <>
      <span
        aria-hidden="true"
        data-slot="field-counter"
        data-limit={atLimit || undefined}
        className={cn("text-xs font-normal tabular-nums", atLimit && "text-destructive", className)}
      >
        {max === undefined ? count : `${count}/${max}`}
      </span>
      <span id={describedById} className="sr-only">
        {announcement}
      </span>
      <span aria-live="polite" className="sr-only">
        {live}
      </span>
    </>
  );
}
