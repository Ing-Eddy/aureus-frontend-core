import { Slider as SliderPrimitive } from "radix-ui";
import { cn } from "@/shadcn/lib/utils";
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
 * The zoom slider: the Radix primitive with shadcn's slider look. shadcn's `Slider` does not let
 * its thumb be named, and a slider needs a name, so this wrapper names the thumb and gives it a
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
    <SliderPrimitive.Root
      data-slot="zoom-slider"
      min={MIN_ZOOM}
      max={MAX_ZOOM}
      step={0.01}
      value={[value]}
      onValueChange={([next]) => next !== undefined && onValueChange(next)}
      disabled={disabled}
      className={cn(
        "relative flex w-full touch-none items-center select-none data-disabled:opacity-50",
        className,
      )}
    >
      <SliderPrimitive.Track className="relative h-1 w-full grow overflow-hidden rounded-full bg-muted">
        <SliderPrimitive.Range className="absolute h-full bg-primary" />
      </SliderPrimitive.Track>
      <SliderPrimitive.Thumb
        aria-label={label}
        aria-valuetext={text}
        className="relative block size-3 shrink-0 rounded-full border border-ring bg-background ring-ring/50 transition-[box-shadow] select-none after:absolute after:-inset-2 hover:ring-3 focus-visible:ring-3 focus-visible:outline-hidden motion-reduce:transition-none pointer-coarse:size-5"
      />
    </SliderPrimitive.Root>
  );
}
