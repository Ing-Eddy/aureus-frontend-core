import { describe, expect, it } from "vitest";
import { addScaled, clamp, decimalPlaces, maxSafe, round } from "./decimal-math";

describe("decimal-math", () => {
  it("counts decimal places, also in exponent notation", () => {
    expect(decimalPlaces(12)).toBe(0);
    expect(decimalPlaces(1.25)).toBe(2);
    expect(decimalPlaces(1e-7)).toBe(7);
  });

  it("rounds half away from zero without artefacts", () => {
    expect(round(1.005, 2)).toBe(1.01);
    expect(round(-1.005, 2)).toBe(-1.01);
    expect(round(2.675, 2)).toBe(2.68);
    expect(round(1234.5, 0)).toBe(1235);
    expect(round(-0.001, 2)).toBe(0);
    expect(round(1.23456)).toBe(1.23456);
  });

  it("adds decimals exactly", () => {
    expect(addScaled(0.1, 0.2)).toBe(0.3);
    expect(addScaled(1.1, -0.01)).toBe(1.09);
    expect(addScaled(0.2, 0.1)).toBe(0.3);
    expect(addScaled(-0.3, 0.1)).toBe(-0.2);
  });

  it("clamps with optional bounds", () => {
    expect(clamp(5, 0, 3)).toBe(3);
    expect(clamp(-5, 0)).toBe(0);
    expect(clamp(5)).toBe(5);
  });

  it("knows the safe range per decimals", () => {
    expect(maxSafe()).toBe(Number.MAX_SAFE_INTEGER);
    expect(maxSafe(2)).toBe(Number.MAX_SAFE_INTEGER / 100);
  });
});
