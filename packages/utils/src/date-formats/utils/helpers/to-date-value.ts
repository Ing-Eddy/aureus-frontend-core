import { parseIsoDate, parseIsoDateTime, parseIsoTime } from "@/internal/utils/helpers";

/**
 * A readable date value:
 * - `instant`: a moment in time (`Date`, timestamp, ISO with a zone), shown in a time zone;
 * - `date` / `time` / `datetime`: a local ISO wall time. Its `date` holds the wall time read in
 *   UTC and must be formatted with `timeZone: "UTC"`, so no zone or daylight-saving change can
 *   move it.
 */
export type DateValue =
  | { kind: "instant"; date: Date }
  | { kind: "date" | "time" | "datetime"; date: Date };

const ZONED = /^(\d{4}-\d{2}-\d{2})T(\d{2}:\d{2}(?::\d{2})?)(?:\.\d+)?(?:Z|[+-]\d{2}:\d{2})$/;

/** A UTC `Date` holding a wall time; years below 100 are kept as they are. */
function wallTime(year: number, month: number, day: number, hour = 0, minute = 0, second = 0) {
  const date = new Date(Date.UTC(2000, 0, 1, hour, minute, second));
  date.setUTCFullYear(year, month - 1, day);
  return date;
}

const isValid = (date: Date) => !Number.isNaN(date.getTime());

/** Reads `value` as a date, or returns `null` when it is not a supported, real date. */
export function toDateValue(value: unknown): DateValue | null {
  if (value instanceof Date) return isValid(value) ? { kind: "instant", date: value } : null;
  if (typeof value === "number") {
    if (!Number.isFinite(value)) return null;
    const date = new Date(value);
    return isValid(date) ? { kind: "instant", date } : null;
  }
  if (typeof value !== "string") return null;

  const dateTime = parseIsoDateTime(value);
  if (dateTime) {
    const { year, month, day, hour, minute, second } = dateTime;
    return { kind: "datetime", date: wallTime(year, month, day, hour, minute, second) };
  }
  const date = parseIsoDate(value);
  if (date) return { kind: "date", date: wallTime(date.year, date.month, date.day) };
  const time = parseIsoTime(value);
  if (time)
    return { kind: "time", date: wallTime(1970, 1, 1, time.hour, time.minute, time.second) };

  const zoned = ZONED.exec(value);
  if (zoned && parseIsoDate(zoned[1]) && parseIsoTime(zoned[2])) {
    const instant = new Date(value);
    if (isValid(instant)) return { kind: "instant", date: instant };
  }
  return null;
}
