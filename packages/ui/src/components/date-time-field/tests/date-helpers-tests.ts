import { afterEach, beforeEach, describe, expect, it } from "vitest";
import {
  addDaysIso,
  fromDate,
  isIsoDate,
  isIsoDateTime,
  isIsoTime,
  toDate,
  todayIso,
} from "../utils";

describe("public date helpers", () => {
  const original = process.env.TZ;
  beforeEach(() => {
    process.env.TZ = "Europe/Madrid";
  });
  afterEach(() => {
    process.env.TZ = original;
  });

  it("has no time-zone drift", () => {
    expect(fromDate(toDate("2026-03-29") as Date, "date")).toBe("2026-03-29");
    expect(fromDate(toDate("2026-10-25") as Date, "date")).toBe("2026-10-25");
  });

  it("rejects invalid dates", () => {
    expect(isIsoDate("2027-02-29")).toBe(false);
    expect(isIsoDate("2028-02-29")).toBe(true);
    expect(isIsoTime("14:30:15")).toBe(true);
    expect(isIsoDateTime("2026-08-01T14:30")).toBe(true);
    expect(toDate("nope")).toBeNull();
  });

  it("moves days and knows today", () => {
    expect(addDaysIso("2026-08-01", 26)).toBe("2026-08-27");
    expect(isIsoDate(todayIso())).toBe(true);
    expect(fromDate(new Date(2026, 7, 1, 14, 30, 15), "datetime", "second")).toBe(
      "2026-08-01T14:30:15",
    );
  });
});
