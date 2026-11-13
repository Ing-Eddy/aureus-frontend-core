import { describe, expect, it } from "vitest";
import { composite, contrastRatio, formatOklch, normalizeColor, parseColor, toHex } from "./color";

describe("normalizeColor", () => {
  it.each([
    ["#ffffff", "oklch(1 0 0)"],
    ["#000", "oklch(0 0 0)"],
    ["rgb(255 255 255)", "oklch(1 0 0)"],
    ["rgb(0, 0, 0)", "oklch(0 0 0)"],
    ["hsl(0 0% 100%)", "oklch(1 0 0)"],
    ["oklch(0.577 0.245 27.325)", "oklch(0.577 0.245 27.325)"],
    ["oklch(57.7% 0.245 27.325)", "oklch(0.577 0.245 27.325)"],
    ["white", "oklch(1 0 0)"],
  ])("%s → %s", (input, expected) => {
    expect(normalizeColor(input)).toBe(expected);
  });

  it("keeps alpha as a percentage", () => {
    expect(normalizeColor("oklch(1 0 0 / 10%)")).toBe("oklch(1 0 0 / 10%)");
    expect(normalizeColor("rgb(0 0 0 / 0.5)")).toBe("oklch(0 0 0 / 50%)");
    expect(normalizeColor("#00000080")).toBe("oklch(0 0 0 / 50.2%)");
  });

  it("accepts shadcn v3 bare HSL channels", () => {
    expect(normalizeColor("0 0% 100%")).toBe("oklch(1 0 0)");
    const navy = parseColor("222.2 47.4% 11.2%");
    expect(navy).toBeDefined();
    expect(navy?.l).toBeGreaterThan(0.1);
    expect(navy?.l).toBeLessThan(0.25);
    expect(navy?.h).toBeGreaterThan(250);
  });

  it.each(["", "not-a-color", "oklch(", "#12", "12px"])("rejects %j", (input) => {
    expect(normalizeColor(input)).toBeUndefined();
  });

  it("is idempotent", () => {
    for (const input of ["#3b82f6", "hsl(142 71% 45%)", "rgb(10 20 30 / 0.3)", "tomato"]) {
      const once = normalizeColor(input) ?? "";
      expect(normalizeColor(once)).toBe(once);
    }
  });

  it("prints a hue of 0 for achromatic colors", () => {
    expect(formatOklch({ l: 0.5, c: 0, h: 123 })).toBe("oklch(0.5 0 0)");
  });
});

describe("contrast helpers", () => {
  it("gives 21:1 for black on white", () => {
    expect(contrastRatio({ l: 0, c: 0, h: 0 }, { l: 1, c: 0, h: 0 })).toBeCloseTo(21, 1);
  });

  it("composites translucent colors over their backdrop", () => {
    const mixed = composite({ l: 1, c: 0, h: 0, alpha: 0.5 }, { l: 0, c: 0, h: 0 });
    expect(mixed.alpha).toBeUndefined();
    expect(mixed.l).toBeGreaterThan(0.55);
    expect(mixed.l).toBeLessThan(0.85);
  });

  it("converts to hex for the native color picker", () => {
    expect(toHex("oklch(1 0 0)")).toBe("#ffffff");
    expect(toHex("garbage")).toBe("#000000");
  });
});
