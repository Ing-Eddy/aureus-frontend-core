import { SliderBase } from "@/internal/components";
import { MAX_ZOOM, MIN_ZOOM } from "../utils";

export interface ZoomSliderProps {
  value: number;
  onValueChange: (value: number) => void;
  /** Accessible name of the slider (on its thumb, the element with `role="slider"`). */
  label: string;
  locale?: string;
  disabled?: boolean;
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
