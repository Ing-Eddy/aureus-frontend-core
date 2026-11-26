import { addDaysIso, compareIso, daysBetweenInclusive } from "@/internal/utils/helpers";

/** A range being chosen: `to` is `null` until its end is chosen. */
export interface DateRangeValue {
  /** First day, `YYYY-MM-DD`. */
  from: string;
  /** Last day, or `null` while it is not chosen. */
  to: string | null;
}

/** The limits a range chosen in the calendar must respect. */
export interface RangeRules {
  /** Fewest days in a range, counting both ends. */
  minDays?: number;
  /** Most days in a range, counting both ends. */
  maxDays?: number;
  /** A range cannot contain a disabled day. */
  excludeDisabled?: boolean;
  /** Whether a day is disabled (limits, listed or matched days). */
  isDisabled?: (date: string) => boolean;
}

/** Whether some day strictly between `from` and `to` is disabled. */
function crossesDisabled(from: string, to: string, isDisabled: (date: string) => boolean): boolean {
  for (let day = addDaysIso(from, 1); compareIso(day, to) < 0; day = addDaysIso(day, 1)) {
    if (isDisabled(day)) return true;
  }
  return false;
}

/** Whether `[from, to]` breaks the length rules. */
function breaksLength(from: string, to: string, rules: RangeRules): boolean {
  const length = daysBetweenInclusive(from, to);
  return (
    (rules.minDays !== undefined && length < rules.minDays) ||
    (rules.maxDays !== undefined && length > rules.maxDays)
  );
}

/**
 * The range after a day is chosen in the calendar. The first day is the start; the second is the
 * end, or the new start when it comes before the start; after a complete range a new one begins.
 * An end that breaks `minDays`/`maxDays`, or one beyond a disabled day with `excludeDisabled`,
 * starts a new range at that day.
 */
export function nextRange(
  current: DateRangeValue | null,
  clicked: string,
  rules: RangeRules = {},
): DateRangeValue {
  if (!current || current.to !== null) return { from: clicked, to: null };
  if (compareIso(clicked, current.from) < 0) return { from: clicked, to: null };
  if (breaksLength(current.from, clicked, rules)) return { from: clicked, to: null };
  if (
    rules.excludeDisabled &&
    rules.isDisabled &&
    crossesDisabled(current.from, clicked, rules.isDisabled)
  ) {
    return { from: clicked, to: null };
  }
  return { from: current.from, to: clicked };
}

/**
 * Whether a day cannot be the end of a range that starts at `from`: it would break the length
 * rules. The start itself and the days before it stay enabled, because choosing one starts over.
 */
export function isEndBlocked(from: string, day: string, rules: RangeRules): boolean {
  if (compareIso(day, from) <= 0) return false;
  return breaksLength(from, day, rules);
}

/** A range with its ends in order. */
export function sortRange(range: DateRangeValue): DateRangeValue {
  if (range.to !== null && compareIso(range.to, range.from) < 0) {
    return { from: range.to, to: range.from };
  }
  return range;
}

/** Days from `from` to `to`, both included. */
export function isInRange(day: string, from: string, to: string): boolean {
  return compareIso(day, from) >= 0 && compareIso(day, to) <= 0;
}
