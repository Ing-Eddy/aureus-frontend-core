import { afterEach, describe, expect, it, vi } from "vitest";
import { resetWarnings } from "@/internal/utils/helpers";
import type { DateFormatDefinition } from "../types";
import { dateFormatCatalog } from "../utils/constants";
import { formatPattern, toDateValue, tokenize } from "../utils/helpers";

afterEach(() => {
  resetWarnings();
  vi.restoreAllMocks();
});

const at = (iso: string) => (toDateValue(iso) as { date: Date }).date;
const afternoon = at("2026-11-21T14:05:09");
const morning = at("2026-01-03T00:07:00");

describe("formatPattern", () => {
  it("writes every token", () => {
    const pattern = "yyyy yy M MM MMM MMMM d dd EEE EEEE H HH h hh m mm s ss a";
    expect(formatPattern(afternoon, pattern, "en-US", "UTC")).toBe(
      "2026 26 11 11 Nov November 21 21 Sat Saturday 14 14 2 02 5 05 9 09 PM",
    );
    expect(formatPattern(morning, pattern, "en-US", "UTC")).toBe(
      "2026 26 1 01 Jan January 3 03 Sat Saturday 0 00 12 12 7 07 0 00 AM",
    );
  });

  it("writes names in the given language", () => {
    expect(formatPattern(afternoon, "EEEE d 'de' MMMM, h:mm a", "es-ES", "UTC")).toBe(
      "sábado 21 de noviembre, 2:05 p.\u202fm.",
    );
  });

  it("reads the parts in the given time zone", () => {
    const instant = new Date(Date.UTC(2026, 10, 21, 2, 0));
    expect(formatPattern(instant, "yyyy-MM-dd HH:mm", "en-US", "America/Mexico_City")).toBe(
      "2026-11-20 20:00",
    );
  });

  it("writes quoted text literally, and '' as a quote", () => {
    expect(formatPattern(afternoon, "'Day' d, 'o''clock' H''", "en-US", "UTC")).toBe(
      "Day 21, o'clock 14'",
    );
  });

  it("writes an unknown letter literally and warns once", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    expect(formatPattern(afternoon, "d Q", "en-US", "UTC")).toBe("21 Q");
    formatPattern(afternoon, "d Q", "en-US", "UTC");
    expect(warn).toHaveBeenCalledTimes(1);
    expect(warn.mock.calls[0]?.[0]).toMatch(/^date-formats: "Q"/);
  });
});

describe("catalog patterns", () => {
  it("are all valid", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    const definitions: DateFormatDefinition[] = Object.values(dateFormatCatalog);
    for (const { patterns = {} } of definitions) {
      for (const pattern of Object.values(patterns)) tokenize(pattern);
    }
    expect(warn).not.toHaveBeenCalled();
  });
});
