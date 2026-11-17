import { cn } from "@/shadcn/lib/utils";
import type { SliderMark } from "../types";
import { percentOf, positionAt } from "../utils";

interface SliderMarksCommon {
  /** Visible marks: within the limits, sorted and unique (see `visibleMarks`). */
  marks: readonly SliderMark[];
  min: number;
  max: number;
  orientation: "horizontal" | "vertical";
  className?: string;
}

/**
 * The ticks, drawn inside the slider root over the track. Decorative: the value and its text
 * already carry the information.
 */
export function SliderMarkTicks({ marks, min, max, orientation, className }: SliderMarksCommon) {
  const horizontal = orientation === "horizontal";
  return (
    <span
      aria-hidden="true"
      data-slot="slider-marks"
      className={cn("pointer-events-none absolute inset-0", className)}
    >
      {marks.map((mark) => (
        <span
          key={mark.value}
          data-slot="slider-mark"
          data-value={mark.value}
          style={
            horizontal
              ? { insetInlineStart: positionAt(percentOf(mark.value, min, max)) }
              : { bottom: positionAt(percentOf(mark.value, min, max)) }
          }
          className={cn(
            // A light dot with a ring: visible on the filled range and on the empty track.
            "absolute size-1.5 rounded-full bg-background ring-1 ring-foreground/30",
            horizontal
              ? "top-1/2 -translate-x-1/2 -translate-y-1/2 rtl:translate-x-1/2"
              : "left-1/2 -translate-x-1/2 translate-y-1/2",
          )}
        />
      ))}
    </span>
  );
}

export interface SliderMarkLabelsProps extends SliderMarksCommon {
  labelClassName?: string;
}

/**
 * The labels of the marks that have one: a row below the track (a column beside it in vertical
 * sliders), each centred on its mark. The labels at the ends align to their edge instead, so they
 * never overflow the field. Decorative, like the ticks.
 */
export function SliderMarkLabels({
  marks,
  min,
  max,
  orientation,
  className,
  labelClassName,
}: SliderMarkLabelsProps) {
  const labelled = marks.filter((mark) => mark.label !== undefined && mark.label !== null);
  if (labelled.length === 0) return null;
  const horizontal = orientation === "horizontal";
  return (
    <span
      aria-hidden="true"
      data-slot="slider-mark-labels"
      className={cn(
        "pointer-events-none relative block text-xs text-muted-foreground tabular-nums",
        horizontal ? "h-4 w-full" : "h-full min-w-8",
        className,
      )}
    >
      {labelled.map((mark) => {
        const percent = percentOf(mark.value, min, max);
        const edge = horizontal && (percent <= 0 ? "start" : percent >= 100 ? "end" : null);
        return (
          <span
            key={mark.value}
            data-slot="slider-mark-label"
            data-value={mark.value}
            style={
              edge
                ? undefined
                : horizontal
                  ? { insetInlineStart: positionAt(percent) }
                  : { bottom: positionAt(percent) }
            }
            className={cn(
              "absolute leading-4 whitespace-nowrap",
              edge === "start" && "start-0",
              edge === "end" && "end-0",
              !edge && horizontal && "-translate-x-1/2 rtl:translate-x-1/2",
              !horizontal && "start-0 translate-y-1/2",
              labelClassName,
            )}
          >
            {mark.label}
          </span>
        );
      })}
    </span>
  );
}
