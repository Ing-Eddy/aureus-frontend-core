import { cn } from "@/shadcn/lib/utils";

export interface SliderValueTooltipProps {
  text: string;
  orientation: "horizontal" | "vertical";
  className?: string;
}

/**
 * The value over a thumb (at its inline end in vertical sliders), rendered inside the thumb so it
 * follows it exactly. It shows while the thumb is hovered or focused with the keyboard, and while
 * the slider is dragged (`data-dragging` on the `group/slider` container). Decorative: the thumb
 * announces the same text as its `aria-valuetext`.
 */
export function SliderValueTooltip({ text, orientation, className }: SliderValueTooltipProps) {
  return (
    <span
      aria-hidden="true"
      data-slot="slider-tooltip"
      className={cn(
        "pointer-events-none absolute z-10 rounded-md bg-foreground px-1.5 py-0.5 text-xs whitespace-nowrap text-background tabular-nums opacity-0 shadow-sm transition-opacity motion-reduce:transition-none",
        "group-hover/thumb:opacity-100 group-focus-visible/thumb:opacity-100 group-data-dragging/slider:opacity-100",
        orientation === "horizontal"
          ? "start-1/2 bottom-full mb-2 -translate-x-1/2 rtl:translate-x-1/2"
          : "start-full top-1/2 ms-2 -translate-y-1/2",
        className,
      )}
    >
      {text}
    </span>
  );
}
