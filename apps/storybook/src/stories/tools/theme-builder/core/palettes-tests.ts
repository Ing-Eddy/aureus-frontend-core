import { describe, expect, it } from "vitest";
import { paletteSteps, palettes } from "./palettes";

describe("neutral palettes", () => {
  it.each(Object.entries(palettes))("%s has 11 steps of decreasing lightness", (_name, ramp) => {
    expect(Object.keys(ramp)).toHaveLength(11);
    const lightness = paletteSteps.map((step) => ramp[step][0]);
    for (let index = 1; index < lightness.length; index++) {
      expect(lightness[index]).toBeLessThan(lightness[index - 1] ?? 1);
    }
  });
});
