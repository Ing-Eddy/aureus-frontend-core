/** The limits every slider value is normalized to. */
export interface SliderLimits {
  /** Lowest value. */
  min: number;
  /** Highest value. */
  max: number;
  /** Every value is a multiple of it from `min`. */
  step: number;
  /** Smallest distance between the two values of a range. `0` when not given. */
  minDistance?: number;
  /** With `snapToMarks`: the only allowed values, sorted and within `[min, max]`. */
  marks?: readonly number[];
}

/** Fraction digits of a number as written (`0.05` → 2), including exponent notation. */
export function decimalsOf(value: number): number {
  if (!Number.isFinite(value)) return 0;
  const [mantissa = "", exponent] = String(value).toLowerCase().split("e");
  const fraction = mantissa.split(".")[1]?.length ?? 0;
  return Math.max(0, fraction - Number(exponent ?? 0));
}

/** `value` moved into `[min, max]`. */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

/** Rounds away float drift (`0.1 + 0.2`) to the precision of `min` and `step`. */
function fix(value: number, { min, step }: Pick<SliderLimits, "min" | "step">): number {
  return Number(value.toFixed(Math.max(decimalsOf(step), decimalsOf(min))));
}

/** The highest value on the step grid: `max` itself, or the last step below it. */
export function gridMax(limits: Pick<SliderLimits, "min" | "max" | "step">): number {
  const { min, max, step } = limits;
  if (max <= min || step <= 0) return min;
  return fix(min + Math.floor(fix((max - min) / step, { min: 0, step: 1e-9 })) * step, limits);
}

/** The nearest multiple of `step` from `min`. */
export function roundToStep(value: number, min: number, step: number): number {
  if (step <= 0) return value;
  return fix(min + Math.round((value - min) / step) * step, { min, step });
}

/** The mark closest to `value` (the lower one on a tie). `marks` must be sorted and not empty. */
export function nearestMark(value: number, marks: readonly number[]): number {
  let best = marks[0] ?? value;
  for (const mark of marks) if (Math.abs(mark - value) < Math.abs(best - value)) best = mark;
  return best;
}

/** The mark `delta` positions away from the mark nearest to `value`, stopping at the ends. */
export function neighbourMark(value: number, marks: readonly number[], delta: number): number {
  if (marks.length === 0) return value;
  const index = marks.indexOf(nearestMark(value, marks));
  return marks[clamp(index + delta, 0, marks.length - 1)] ?? value;
}

/** Puts one value on the grid (or on a mark) within the limits. */
export function snapValue(value: number, limits: SliderLimits): number {
  if (limits.marks?.length) return nearestMark(value, limits.marks);
  const top = gridMax(limits);
  return clamp(roundToStep(value, limits.min, limits.step), limits.min, top);
}

/**
 * The allowed value at or below (`direction` -1) or at or above (+1) `value`: the grid step or
 * mark on that side. Falls back to the nearest allowed value when there is none on that side.
 */
export function snapToward(value: number, limits: SliderLimits, direction: -1 | 1): number {
  const epsilon = 1e-9;
  if (limits.marks?.length) {
    const side = limits.marks.filter((mark) =>
      direction < 0 ? mark <= value + epsilon : mark >= value - epsilon,
    );
    const found = direction < 0 ? side.at(-1) : side[0];
    return found ?? nearestMark(value, limits.marks);
  }
  const { min, step } = limits;
  const raw = (value - min) / step;
  const steps = direction < 0 ? Math.floor(raw + epsilon) : Math.ceil(raw - epsilon);
  return clamp(fix(min + steps * step, limits), min, gridMax(limits));
}

/**
 * Normalizes the values of a slider: one value is snapped; a pair is sorted, snapped and kept
 * `minDistance` apart. To restore the distance, the value at `changedIndex` moves (the high one
 * when no index is given); when it cannot, the other one does.
 */
export function normalizeValues(
  values: readonly number[],
  limits: SliderLimits,
  changedIndex?: number,
): number[] {
  if (values.length < 2) return values.length ? [snapValue(values[0] as number, limits)] : [];
  const sortedFirst = (values[0] as number) <= (values[1] as number);
  let low = snapValue(Math.min(values[0] as number, values[1] as number), limits);
  let high = snapValue(Math.max(values[0] as number, values[1] as number), limits);
  const distance = limits.minDistance ?? 0;
  if (distance <= 0 || high - low >= distance - 1e-9) return [low, high];

  // The changed value, after sorting: a pair given out of order swaps its indexes.
  const moved = changedIndex === undefined ? 1 : sortedFirst ? changedIndex : 1 - changedIndex;
  const top = limits.marks?.length ? (limits.marks.at(-1) as number) : gridMax(limits);
  const bottom = limits.marks?.length ? (limits.marks[0] as number) : limits.min;
  if (moved === 0) {
    low = snapToward(high - distance, limits, -1);
    if (high - low < distance - 1e-9 || low < bottom) {
      low = bottom;
      high = snapToward(low + distance, limits, 1);
    }
  } else {
    high = snapToward(low + distance, limits, 1);
    if (high - low < distance - 1e-9 || high > top) {
      high = top;
      low = snapToward(high - distance, limits, -1);
    }
  }
  return [low, high];
}

/** Whether two value lists are equal. */
export function sameValues(a: readonly number[], b: readonly number[]): boolean {
  return a.length === b.length && a.every((value, index) => value === b[index]);
}
