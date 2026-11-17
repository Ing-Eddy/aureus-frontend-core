import { clamp, type SliderLimits, snapToward } from "./snap";

export interface SliderKeyInput {
  key: string;
  shiftKey: boolean;
  /** Index of the focused thumb. */
  index: number;
  /** The current, normalized values. */
  values: readonly number[];
  orientation: "horizontal" | "vertical";
  direction: "ltr" | "rtl";
  limits: SliderLimits;
  /** PageUp/PageDown and Shift+arrow distance (ignored with marks: they move two marks). */
  largeStep: number;
}

const INCREASE = new Set(["ArrowUp", "PageUp"]);
const DECREASE = new Set(["ArrowDown", "PageDown"]);

/** +1, -1, or 0 when the key does not move the thumb by a step. */
function stepDirection(key: string, orientation: string, direction: string): number {
  if (INCREASE.has(key)) return 1;
  if (DECREASE.has(key)) return -1;
  // Right increases, except in right-to-left horizontal sliders (as in Radix and the APG).
  const flip = orientation === "horizontal" && direction === "rtl" ? -1 : 1;
  if (key === "ArrowRight") return flip;
  if (key === "ArrowLeft") return -flip;
  return 0;
}

/**
 * The values after a key press on the focused thumb, or `null` when the key is not a slider key.
 * Every slider key is handled here instead of by Radix, so all of them follow the props:
 * - arrows move one step, or one mark with `limits.marks`;
 * - PageUp/PageDown and Shift+arrows move `largeStep`, or two marks;
 * - Home/End move to the lowest/highest value the thumb can take.
 *
 * A thumb never passes the other one (or comes closer than `minDistance`) with the keyboard.
 */
export function keyboardValues(input: SliderKeyInput): number[] | null {
  const { key, index, values, limits } = input;
  const current = values[index];
  if (current === undefined) return null;

  const distance = limits.minDistance ?? 0;
  const before = values[index - 1];
  const after = values[index + 1];
  const marks = limits.marks?.length ? limits.marks : undefined;
  const lowest = marks ? (marks[0] as number) : limits.min;
  const highest = marks ? (marks.at(-1) as number) : snapToward(limits.max, limits, -1);
  // The range this thumb can move in, on the grid or on marks.
  const floor = before === undefined ? lowest : snapToward(before + distance, limits, 1);
  const ceiling = after === undefined ? highest : snapToward(after - distance, limits, -1);

  let next: number;
  if (key === "Home") next = floor;
  else if (key === "End") next = ceiling;
  else {
    const sign = stepDirection(key, input.orientation, input.direction);
    if (sign === 0) return null;
    const large = key === "PageUp" || key === "PageDown" || input.shiftKey;
    if (marks) {
      const position = marks.indexOf(snapToward(current, limits, sign > 0 ? -1 : 1));
      const target = clamp(position + sign * (large ? 2 : 1), 0, marks.length - 1);
      next = marks[target] as number;
    } else {
      const amount = large ? input.largeStep : limits.step;
      next = snapToward(current + sign * amount, limits, sign > 0 ? -1 : 1);
    }
  }
  if (floor <= ceiling) next = clamp(next, floor, ceiling);
  else next = current;

  const result = [...values];
  result[index] = next;
  return result;
}
