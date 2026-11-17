import type { SliderMark } from "../types";

/** The marks within `[min, max]`, sorted, keeping the first of each value. */
export function visibleMarks(marks: readonly SliderMark[], min: number, max: number): SliderMark[] {
  const seen = new Set<number>();
  return marks
    .filter((mark) => {
      if (mark.value < min || mark.value > max || seen.has(mark.value)) return false;
      seen.add(mark.value);
      return true;
    })
    .sort((a, b) => a.value - b.value);
}

/** Position of a value along the track, from 0 to 100. */
export function percentOf(value: number, min: number, max: number): number {
  return max > min ? ((value - min) / (max - min)) * 100 : 0;
}

/**
 * CSS offset of a value's centre from the track's start edge. Radix keeps each thumb inside the
 * track by shifting it by `thumb / 2 - percent × thumb`; anything drawn at a value's position uses
 * the same shift (with the shared `--slider-thumb` size) to line up with the thumb.
 */
export function positionAt(percent: number): string {
  const fraction = Number((percent / 100).toFixed(6));
  return `calc(${Number(percent.toFixed(4))}% + var(--slider-thumb) / 2 - ${fraction} * var(--slider-thumb))`;
}
