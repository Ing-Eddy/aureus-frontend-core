/**
 * Local ISO date and time strings with no time zone: `YYYY-MM-DD`, `HH:mm[:ss]` and
 * `YYYY-MM-DDTHH:mm[:ss]`. Only parsing and validation: these values are wall times, so they are
 * never turned into a local `Date` here.
 */

export interface IsoDateParts {
  year: number;
  /** 1–12. */
  month: number;
  /** 1–31. */
  day: number;
}

export interface IsoTimeParts {
  /** 0–23. */
  hour: number;
  minute: number;
  second: number;
}

export type IsoDateTimeParts = IsoDateParts & IsoTimeParts;

const DATE = /^(\d{4})-(\d{2})-(\d{2})$/;
const TIME = /^(\d{2}):(\d{2})(?::(\d{2}))?$/;

export function isLeapYear(year: number): boolean {
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
}

/** Days in a month (`month` 1–12). */
export function daysInMonth(year: number, month: number): number {
  if (month === 2) return isLeapYear(year) ? 29 : 28;
  return [4, 6, 9, 11].includes(month) ? 30 : 31;
}

/** The parts of a real calendar date, or `null`. */
export function parseIsoDate(value: unknown): IsoDateParts | null {
  if (typeof value !== "string") return null;
  const match = DATE.exec(value);
  if (!match) return null;
  const [year, month, day] = match.slice(1).map(Number) as [number, number, number];
  if (year < 1 || month < 1 || month > 12 || day < 1 || day > daysInMonth(year, month)) return null;
  return { year, month, day };
}

/** The parts of a valid 24-hour time (seconds are 0 when absent), or `null`. */
export function parseIsoTime(value: unknown): IsoTimeParts | null {
  if (typeof value !== "string") return null;
  const match = TIME.exec(value);
  if (!match) return null;
  const hour = Number(match[1]);
  const minute = Number(match[2]);
  const second = match[3] === undefined ? 0 : Number(match[3]);
  if (hour > 23 || minute > 59 || second > 59) return null;
  return { hour, minute, second };
}

/** The parts of a valid date and time, or `null`. */
export function parseIsoDateTime(value: unknown): IsoDateTimeParts | null {
  if (typeof value !== "string") return null;
  const [date, time, extra] = value.split("T");
  if (extra !== undefined || time === undefined) return null;
  const dateParts = parseIsoDate(date);
  const timeParts = parseIsoTime(time);
  return dateParts && timeParts ? { ...dateParts, ...timeParts } : null;
}
