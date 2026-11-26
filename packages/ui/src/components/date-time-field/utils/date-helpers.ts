import {
  addDaysIso as addDays,
  fromLocalDate,
  type IsoMode,
  isIsoDate as isDate,
  isIsoDateTime as isDateTime,
  isIsoTime as isTime,
  type TimeGranularity,
  todayIso as today,
  toLocalDate,
} from "@/internal/utils/helpers";

/**
 * A local `Date` for an ISO date (at 00:00), time (on today's date) or date and time, or `null`
 * when the value is not valid. Never converts through UTC.
 *
 * ```ts
 * const midnight = toDate("2026-11-26"); // 26 November 2026, 00:00 local time
 * ```
 */
export function toDate(value: string): Date | null {
  return toLocalDate(value);
}

/**
 * The ISO value of a `Date` in local time, for `"date"`, `"time"` or `"datetime"`.
 *
 * ```ts
 * const value = fromDate(new Date(), "datetime"); // "2026-11-26T14:05"
 * ```
 */
export function fromDate(
  date: Date,
  mode: IsoMode,
  granularity: TimeGranularity = "minute",
): string {
  return fromLocalDate(date, mode, granularity);
}

/**
 * Today's local date as `YYYY-MM-DD`.
 *
 * ```ts
 * const minimum = todayIso(); // "2026-11-26"
 * ```
 */
export function todayIso(): string {
  return today();
}

/**
 * A `YYYY-MM-DD` date moved by calendar days, also across daylight-saving changes.
 *
 * ```ts
 * const tomorrow = addDaysIso("2026-12-31", 1); // "2027-01-01"
 * ```
 */
export function addDaysIso(date: string, days: number): string {
  return addDays(date, days);
}

/**
 * `true` only for a well-formed `YYYY-MM-DD` of a real date.
 *
 * ```ts
 * isIsoDate("2026-02-30"); // false: February has no day 30
 * ```
 */
export function isIsoDate(value: unknown): value is string {
  return isDate(value);
}

/**
 * `true` only for a well-formed `HH:mm` or `HH:mm:ss`.
 *
 * ```ts
 * isIsoTime("14:05"); // true
 * ```
 */
export function isIsoTime(value: unknown): value is string {
  return isTime(value);
}

/**
 * `true` only for a well-formed `YYYY-MM-DDTHH:mm[:ss]` of a real date.
 *
 * ```ts
 * isIsoDateTime("2026-11-26T14:05"); // true
 * ```
 */
export function isIsoDateTime(value: unknown): value is string {
  return isDateTime(value);
}
