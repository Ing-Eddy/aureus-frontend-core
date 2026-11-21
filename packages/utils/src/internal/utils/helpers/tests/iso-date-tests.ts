import { describe, expect, it } from "vitest";
import { isNil } from "../is-nil";
import { parseIsoDate, parseIsoDateTime, parseIsoTime } from "../iso-date";

describe("parseIsoDate", () => {
  it("reads a real date", () => {
    expect(parseIsoDate("2026-11-21")).toEqual({ year: 2026, month: 11, day: 21 });
  });

  it("accepts 29 February in a leap year only", () => {
    expect(parseIsoDate("2024-02-29")).not.toBeNull();
    expect(parseIsoDate("2026-02-29")).toBeNull();
  });

  it("rejects impossible dates and other forms", () => {
    for (const value of [
      "2026-02-30",
      "2026-13-01",
      "0000-01-01",
      "21/11/2026",
      "2026-1-1",
      20261121,
    ]) {
      expect(parseIsoDate(value), String(value)).toBeNull();
    }
  });
});

describe("parseIsoTime", () => {
  it("reads HH:mm and HH:mm:ss", () => {
    expect(parseIsoTime("14:30")).toEqual({ hour: 14, minute: 30, second: 0 });
    expect(parseIsoTime("14:30:05")).toEqual({ hour: 14, minute: 30, second: 5 });
  });

  it("rejects out-of-range and malformed times", () => {
    for (const value of ["24:00", "12:60", "12:00:60", "9:30", "14:30:05.1"]) {
      expect(parseIsoTime(value), value).toBeNull();
    }
  });
});

describe("parseIsoDateTime", () => {
  it("reads a local date and time", () => {
    expect(parseIsoDateTime("2026-11-21T14:30")).toEqual({
      year: 2026,
      month: 11,
      day: 21,
      hour: 14,
      minute: 30,
      second: 0,
    });
  });

  it("rejects zones, impossible dates and extra parts", () => {
    for (const value of ["2026-11-21T14:30Z", "2026-02-30T10:00", "2026-11-21T", "2026-11-21"]) {
      expect(parseIsoDateTime(value), value).toBeNull();
    }
  });
});

describe("isNil", () => {
  it("is true only for null and undefined", () => {
    expect([null, undefined, 0, "", false, Number.NaN].map(isNil)).toEqual([
      true,
      true,
      false,
      false,
      false,
      false,
    ]);
  });
});
