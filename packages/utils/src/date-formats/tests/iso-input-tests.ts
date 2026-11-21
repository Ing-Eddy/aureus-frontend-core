import { describe, expect, it } from "vitest";
import { toDateValue } from "../utils/helpers";

const iso = (value: unknown) => {
  const result = toDateValue(value);
  return result && { kind: result.kind, iso: result.date.toISOString() };
};

describe("toDateValue", () => {
  it("reads local ISO strings as wall time held in UTC", () => {
    expect(iso("2026-11-21")).toEqual({ kind: "date", iso: "2026-11-21T00:00:00.000Z" });
    expect(iso("14:30")).toEqual({ kind: "time", iso: "1970-01-01T14:30:00.000Z" });
    expect(iso("14:30:05")).toEqual({ kind: "time", iso: "1970-01-01T14:30:05.000Z" });
    expect(iso("2026-11-21T14:30")).toEqual({ kind: "datetime", iso: "2026-11-21T14:30:00.000Z" });
    expect(iso("2026-11-21T14:30:05")).toEqual({
      kind: "datetime",
      iso: "2026-11-21T14:30:05.000Z",
    });
  });

  it("keeps a wall time inside a daylight-saving gap", () => {
    // 02:30 on 2026-03-08 does not exist in America/New_York (the test time zone).
    expect(iso("2026-03-08T02:30")).toEqual({ kind: "datetime", iso: "2026-03-08T02:30:00.000Z" });
  });

  it("keeps years below 100", () => {
    expect(iso("0050-06-01")).toEqual({ kind: "date", iso: "0050-06-01T00:00:00.000Z" });
  });

  it("reads Dates, timestamps and zoned strings as instants", () => {
    expect(iso(new Date(Date.UTC(2026, 10, 21, 14, 30)))).toEqual({
      kind: "instant",
      iso: "2026-11-21T14:30:00.000Z",
    });
    expect(iso(Date.UTC(2026, 10, 21))).toEqual({
      kind: "instant",
      iso: "2026-11-21T00:00:00.000Z",
    });
    expect(iso("2026-11-21T14:30:00Z")).toEqual({
      kind: "instant",
      iso: "2026-11-21T14:30:00.000Z",
    });
    expect(iso("2026-11-21T14:30:00.123Z")).toEqual({
      kind: "instant",
      iso: "2026-11-21T14:30:00.123Z",
    });
    expect(iso("2026-11-21T08:30-06:00")).toEqual({
      kind: "instant",
      iso: "2026-11-21T14:30:00.000Z",
    });
    expect(iso("2026-11-21T20:00:00.5+05:30")).toEqual({
      kind: "instant",
      iso: "2026-11-21T14:30:00.500Z",
    });
  });

  it("rejects everything else", () => {
    for (const value of [
      new Date(Number.NaN),
      Number.NaN,
      Number.POSITIVE_INFINITY,
      1e20,
      "2026-02-30",
      "2026-02-30T10:00Z",
      "21/11/2026",
      "2026-11-21T14:30:05.123",
      "2026-11-21 14:30",
      "",
      true,
      {},
    ]) {
      expect(toDateValue(value), String(value)).toBeNull();
    }
  });
});
