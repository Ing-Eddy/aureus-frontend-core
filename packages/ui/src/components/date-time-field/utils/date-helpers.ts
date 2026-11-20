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
 */
export function toDate(value: string): Date | null {
  return toLocalDate(value);
}

/** The ISO value of a `Date` in local time, for `"date"`, `"time"` or `"datetime"`. */
export function fromDate(
  date: Date,
  mode: IsoMode,
  granularity: TimeGranularity = "minute",
): string {
  return fromLocalDate(date, mode, granularity);
}

/** Today's local date as `YYYY-MM-DD`. */
export function todayIso(): string {
  return today();
}

/** A `YYYY-MM-DD` date moved by calendar days, also across daylight-saving changes. */
export function addDaysIso(date: string, days: number): string {
  return addDays(date, days);
}

/** `true` only for a well-formed `YYYY-MM-DD` of a real date. */
export function isIsoDate(value: unknown): value is string {
  return isDate(value);
}

/** `true` only for a well-formed `HH:mm` or `HH:mm:ss`. */
export function isIsoTime(value: unknown): value is string {
  return isTime(value);
}

/** `true` only for a well-formed `YYYY-MM-DDTHH:mm[:ss]` of a real date. */
export function isIsoDateTime(value: unknown): value is string {
  return isDateTime(value);
}
