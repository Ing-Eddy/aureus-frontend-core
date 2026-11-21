import { describe, expect, it } from "vitest";
import { createDisplay } from "..";
import { plain, spyWarn } from "./setup";

const display = createDisplay({ empty: "-", locale: "en-US" });

describe("date, time and dateTime", () => {
  it("use short, time and shortDateTime by default", () => {
    expect(display.date("2026-11-21")).toBe("11/21/26");
    expect(plain(display.time("14:30"))).toBe("2:30 PM");
    expect(plain(display.dateTime("2026-11-21T14:30"))).toBe("11/21/26, 2:30 PM");
  });

  it("use a named format", () => {
    expect(display.date("2026-11-21", { format: "long", locale: "es-ES" })).toBe(
      "21 de noviembre de 2026",
    );
    expect(display.date("2026-11-21T14:30", { format: "monthYear" })).toBe("November 2026");
  });

  it("apply locale and timeZone overrides", () => {
    expect(display.time("2026-11-21T14:30:00Z", { locale: "es-ES", timeZone: "Asia/Tokyo" })).toBe(
      "23:30",
    );
    const zoned = createDisplay({ empty: "-", locale: "es-ES", timeZone: "America/Mexico_City" });
    expect(zoned.time("2026-11-21T14:30:00Z")).toBe("8:30");
  });

  it("show empty for missing, unreadable and unfitting values", () => {
    const warn = spyWarn();
    expect(display.date(null)).toBe("-");
    expect(display.date(undefined, { empty: "none" })).toBe("none");
    expect(warn).not.toHaveBeenCalled();
    expect(display.date("14:30")).toBe("-");
    expect(display.date("2026-02-30")).toBe("-");
    expect(display.time("2026-11-21")).toBe("-");
    expect(warn).toHaveBeenCalledTimes(3);
  });
});
