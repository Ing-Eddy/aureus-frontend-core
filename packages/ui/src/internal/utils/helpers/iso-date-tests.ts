import { afterEach, beforeEach, describe, expect, it } from "vitest";
import {
  addDaysIso,
  clampIso,
  compareIso,
  daysBetweenInclusive,
  daysInMonth,
  fromLocalDate,
  isIsoDate,
  isIsoDateTime,
  isIsoTime,
  isIsoValue,
  parseIsoDate,
  parseIsoDateTime,
  parseIsoTime,
  todayIso,
  toLocalDate,
} from "./iso-date";

describe("parsing and checking", () => {
  it("accepts real dates only", () => {
    expect(isIsoDate("2028-02-29")).toBe(true);
    expect(isIsoDate("2027-02-29")).toBe(false);
    expect(isIsoDate("2000-02-29")).toBe(true);
    expect(isIsoDate("1900-02-29")).toBe(false);
    expect(isIsoDate("2026-04-31")).toBe(false);
    expect(isIsoDate("2026-12-31")).toBe(true);
    expect(isIsoDate("2026-13-01")).toBe(false);
    expect(isIsoDate("0000-01-01")).toBe(false);
    for (const bad of ["2026-8-1", "2026/08/01", " 2026-08-01", "2026-08-01T10:00", "", null, 5]) {
      expect(isIsoDate(bad)).toBe(false);
    }
    expect(parseIsoDate("2026-08-01")).toEqual({ year: 2026, month: 8, day: 1 });
  });

  it("accepts HH:mm and HH:mm:ss", () => {
    expect(isIsoTime("14:30")).toBe(true);
    expect(isIsoTime("14:30:15")).toBe(true);
    expect(isIsoTime("00:00")).toBe(true);
    expect(isIsoTime("23:59:59")).toBe(true);
    for (const bad of ["24:00", "12:60", "12:00:60", "9:30", "12:3", "12:30:5", "12:30Z"]) {
      expect(isIsoTime(bad)).toBe(false);
    }
    expect(parseIsoTime("09:05")).toEqual({ hour: 9, minute: 5, second: 0, hasSeconds: false });
  });

  it("accepts dates with times", () => {
    expect(isIsoDateTime("2026-08-01T14:30")).toBe(true);
    expect(isIsoDateTime("2026-08-01T14:30:15")).toBe(true);
    expect(isIsoDateTime("2027-02-29T10:00")).toBe(false);
    expect(isIsoDateTime("2026-08-01")).toBe(false);
    expect(isIsoDateTime("2026-08-01T14:30Z")).toBe(false);
    expect(isIsoDateTime("2026-08-01T14:30T1")).toBe(false);
    expect(parseIsoDateTime("2026-08-01T14:30")?.hour).toBe(14);
    expect(isIsoValue("14:30", "time")).toBe(true);
    expect(isIsoValue("14:30", "date")).toBe(false);
  });

  it("knows month lengths", () => {
    expect(daysInMonth(2026, 4)).toBe(30);
    expect(daysInMonth(2028, 2)).toBe(29);
    expect(daysInMonth(2026, 12)).toBe(31);
  });
});

describe("Date conversion", () => {
  const original = process.env.TZ;
  beforeEach(() => {
    process.env.TZ = "Europe/Madrid";
  });
  afterEach(() => {
    process.env.TZ = original;
  });

  it("round trips daylight-saving days with no drift", () => {
    for (const day of ["2026-03-29", "2026-10-25", "2026-01-01", "2026-12-31"]) {
      const date = toLocalDate(day);
      expect(date).not.toBeNull();
      expect(fromLocalDate(date as Date, "date")).toBe(day);
    }
    expect(fromLocalDate(toLocalDate("2026-03-29T02:30") as Date, "date")).toBe("2026-03-29");
  });

  it("converts each mode", () => {
    const date = toLocalDate("2026-08-01T14:30:15") as Date;
    expect(date.getHours()).toBe(14);
    expect(fromLocalDate(date, "datetime")).toBe("2026-08-01T14:30");
    expect(fromLocalDate(date, "datetime", "second")).toBe("2026-08-01T14:30:15");
    expect(fromLocalDate(date, "time")).toBe("14:30");
    const time = toLocalDate("09:05") as Date;
    expect(fromLocalDate(time, "date")).toBe(todayIso());
    expect(time.getMinutes()).toBe(5);
    expect(toLocalDate("nope")).toBeNull();
  });

  it("keeps years below 100", () => {
    expect(fromLocalDate(toLocalDate("0050-06-15") as Date, "date")).toBe("0050-06-15");
  });

  it("adds days across month, year and daylight-saving changes", () => {
    expect(addDaysIso("2026-03-28", 1)).toBe("2026-03-29");
    expect(addDaysIso("2026-03-29", 1)).toBe("2026-03-30");
    expect(addDaysIso("2026-10-25", -1)).toBe("2026-10-24");
    expect(addDaysIso("2026-01-31", 1)).toBe("2026-02-01");
    expect(addDaysIso("2026-12-31", 1)).toBe("2027-01-01");
    expect(addDaysIso("2028-02-28", 1)).toBe("2028-02-29");
    expect(addDaysIso("2026-08-01", 26)).toBe("2026-08-27");
    expect(() => addDaysIso("2026-02-30", 1)).toThrow(RangeError);
  });

  it("counts days inclusively", () => {
    expect(daysBetweenInclusive("2026-08-01", "2026-08-27")).toBe(27);
    expect(daysBetweenInclusive("2026-08-01", "2026-08-01")).toBe(1);
    expect(daysBetweenInclusive("2026-03-28", "2026-03-30")).toBe(3);
    expect(daysBetweenInclusive("2026-08-02", "2026-08-01")).toBe(-2);
  });
});

describe("comparing and clamping", () => {
  it("compares values of one mode, with optional seconds", () => {
    expect(compareIso("2026-08-01", "2026-08-02")).toBeLessThan(0);
    expect(compareIso("14:30", "14:30:00")).toBe(0);
    expect(compareIso("2026-08-01T14:30", "2026-08-01T14:30:01")).toBeLessThan(0);
    expect(compareIso("10:00", "09:59")).toBeGreaterThan(0);
  });

  it("clamps into the limits", () => {
    expect(clampIso("2026-08-05", "2026-08-10", "2026-08-20")).toBe("2026-08-10");
    expect(clampIso("2026-08-25", "2026-08-10", "2026-08-20")).toBe("2026-08-20");
    expect(clampIso("2026-08-15", "2026-08-10", null)).toBe("2026-08-15");
    expect(clampIso("2026-08-15")).toBe("2026-08-15");
  });
});
