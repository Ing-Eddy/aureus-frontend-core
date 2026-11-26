import { SliderBase } from "@/internal/components";
import { MAX_ZOOM, MIN_ZOOM } from "../utils";

/** Props of `ZoomSlider`. */
export interface ZoomSliderProps {
  /** Current zoom. */
  value: number;
  /** Called with the new zoom. */
  onValueChange: (value: number) => void;
  /** Accessible name of the slider (on its thumb, the element with `role="slider"`). */
  label: string;
  /** Locale of the value text. */
  locale?: string;
  /** Disables the slider. */
  disabled?: boolean;
  /** Extra classes of the slider. */
  className?: string;
}

/**
 * The zoom slider: the shared `SliderBase` (Radix with shadcn's look and a named thumb) with a
 * value text such as "1.5×" (a number for the locale and a symbol, not words).
 */
export function ZoomSlider({
  value,
  onValueChange,
  label,
  locale,
  disabled,
  className,
}: ZoomSliderProps) {
  const text = `${new Intl.NumberFormat(locale, { maximumFractionDigits: 1 }).format(value)}×`;
  return (
    <SliderBase
      data-slot="zoom-slider"
      min={MIN_ZOOM}
      max={MAX_ZOOM}
      step={0.01}
      values={[value]}
      onValueChange={([next]) => next !== undefined && onValueChange(next)}
      disabled={disabled}
      className={className}
      thumbs={[{ "aria-label": label, "aria-valuetext": text }]}
    />
  );
}
