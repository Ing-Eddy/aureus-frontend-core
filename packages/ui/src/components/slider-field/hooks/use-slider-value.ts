import { useRef } from "react";
import { useControllableState } from "@/internal/hooks";
import { normalizeValues, type SliderLimits, sameValues } from "../utils";

/** A slider value as the consumer sees it: a `number`, or a pair with `range`. */
export type SliderValue = number | [number, number];

export interface UseSliderValueOptions {
  range: boolean;
  value?: number | readonly number[];
  defaultValue?: number | readonly number[];
  onValueChange?: (value: SliderValue) => void;
  onValueCommit?: (value: SliderValue) => void;
  limits: SliderLimits;
}

/** The consumer's value as a list of the right length, or `undefined` when it is not given. */
function toList(value: number | readonly number[] | undefined, range: boolean, fallback: number[]) {
  if (value === undefined) return undefined;
  const list = typeof value === "number" ? [value] : [...value];
  if (range) return list.length === 2 ? list : fallback;
  return list.length >= 1 ? [list[0] as number] : fallback;
}

/**
 * The value of a slider, always as a normalized list (one value, or a sorted pair): controlled or
 * uncontrolled, clamped, on the step grid (or on marks) and `minDistance` apart. `change` reports
 * a new value while it moves and `commit` reports the latest one when the interaction ends.
 */
export function useSliderValue({
  range,
  value,
  defaultValue,
  onValueChange,
  onValueCommit,
  limits,
}: UseSliderValueOptions) {
  const fallback = range ? [limits.min, limits.max] : [limits.min];
  const toConsumer = (list: number[]): SliderValue =>
    range ? [list[0] as number, list[1] as number] : (list[0] as number);

  const [raw, setRaw] = useControllableState<number[]>({
    value: toList(value, range, fallback),
    defaultValue: toList(defaultValue, range, fallback) ?? fallback,
    onChange: (next) => onValueChange?.(toConsumer(next)),
  });
  const values = normalizeValues(toList(raw, range, fallback) ?? fallback, limits);

  // The value to commit: the latest change, even before the consumer re-renders with it.
  const latest = useRef(values);
  latest.current = values;

  /**
   * Requests new values; `changedIndex` is the value that moved (for `minDistance`). Returns
   * whether the normalized value changed.
   */
  const change = (next: readonly number[], changedIndex?: number) => {
    const normalized = normalizeValues(next, limits, changedIndex);
    if (sameValues(normalized, latest.current)) return false;
    latest.current = normalized;
    setRaw(normalized);
    return true;
  };

  const commit = () => onValueCommit?.(toConsumer(latest.current));

  return { values, change, commit, toConsumer };
}
