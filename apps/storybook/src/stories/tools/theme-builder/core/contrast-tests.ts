import { describe, expect, it } from "vitest";
import { checkContrast, contrastPairs, failingPairs, pairRatio } from "./contrast";
import { aureusColors } from "./default-theme";

describe("checkContrast", () => {
  it("checks every pair in both modes", () => {
    expect(checkContrast({ colors: aureusColors })).toHaveLength(contrastPairs.length * 2);
  });

  it("finds no failing pair in the Aureus preset", () => {
    expect(failingPairs(checkContrast({ colors: aureusColors }))).toEqual([]);
  });

  it("gives 21:1 for black text on a white background", () => {
    const colors = { ...aureusColors.light, foreground: "oklch(0 0 0)" };
    const [first] = contrastPairs;
    expect(first?.id).toBe("foreground/background");
    if (first) expect(pairRatio(colors, first)).toBeCloseTo(21, 1);
  });

  it("composites a translucent foreground before measuring", () => {
    const solid = { ...aureusColors.light, foreground: "oklch(0 0 0)" };
    const faded = { ...aureusColors.light, foreground: "oklch(0 0 0 / 20%)" };
    const [first] = contrastPairs;
    if (!first) throw new Error("no pairs");
    expect(pairRatio(faded, first)).toBeLessThan(2);
    expect(pairRatio(faded, first)).toBeLessThan(pairRatio(solid, first));
  });

  it("flags a failing pair with its ratio", () => {
    const light = { ...aureusColors.light, "muted-foreground": "oklch(0.7 0 0)" };
    const failing = failingPairs(checkContrast({ colors: { light, dark: aureusColors.dark } }));
    expect(failing.map((result) => `${result.mode}:${result.pair.id}`)).toEqual([
      "light:muted-foreground/muted",
      "light:muted-foreground/background",
    ]);
    expect(failing[0]?.ratio).toBeLessThan(4.5);
  });
});
