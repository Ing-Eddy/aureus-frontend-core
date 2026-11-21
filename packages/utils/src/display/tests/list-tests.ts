import { describe, expect, it, vi } from "vitest";
import { display, spyWarn } from "./setup";

describe("list", () => {
  it("joins with the locale's conventions, skipping missing and blank items", () => {
    expect(display.list(["a", null, " ", "b", undefined, " c "], { locale: "es" })).toBe(
      "a, b y c",
    );
    expect(display.list(["a", "b", "c"], { locale: "en" })).toBe("a, b, and c");
  });

  it("shows empty when nothing is left", () => {
    expect(display.list([])).toBe("-");
    expect(display.list([null, "  "])).toBe("-");
    expect(display.list(null)).toBe("-");
  });

  it("type and style", () => {
    expect(display.list(["a", "b"], { locale: "es", type: "disjunction" })).toBe("a o b");
    expect(display.list(["a", "b", "c"], { locale: "en", style: "short", type: "unit" })).toBe(
      "a, b, c",
    );
  });

  it("maxItems shows the first items and then more(hidden)", () => {
    expect(
      display.list(["a", "b", "c", "d", "e"], {
        locale: "es",
        maxItems: 2,
        more: (n) => `${n} más`,
      }),
    ).toBe("a, b y 3 más");
  });

  it("does not call more when nothing is hidden", () => {
    const more = vi.fn(() => "x");
    expect(display.list(["a", "b"], { locale: "es", maxItems: 2, more })).toBe("a y b");
    expect(more).not.toHaveBeenCalled();
  });

  it("skips items that are not strings and warns for a non-array", () => {
    const warn = spyWarn();
    expect(display.list(["a", 1 as unknown as string, "b"], { locale: "es" })).toBe("a y b");
    expect(display.list("a" as unknown as string[])).toBe("-");
    expect(warn).toHaveBeenCalledTimes(2);
  });
});
