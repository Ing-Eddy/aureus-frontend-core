import { describe, expect, it } from "vitest";
import { contrastRatio, mustParse } from "./color";
import { checkContrast, failingPairs } from "./contrast";
import { aureusColors, createDefaultDraft } from "./default-theme";
import { resolveTheme } from "./generate-theme";
import { type ColorToken, modes } from "./theme-types";

/** Contrast guarantees of the Aureus brand theme (spec: brand-theme, Contrast guarantees). */
describe("Aureus brand contrast", () => {
  it("flags no text pair in either mode", () => {
    const results = checkContrast(resolveTheme(createDefaultDraft()));
    expect(failingPairs(results)).toEqual([]);
  });

  const nonText: [ColorToken, ColorToken][] = [
    ["ring", "background"],
    ["chart-1", "card"],
    ["chart-2", "card"],
    ["chart-3", "card"],
    ["chart-4", "card"],
    ["chart-5", "card"],
  ];
  it.each(
    modes.flatMap((mode) => nonText.map(([mark, surface]) => [mode, mark, surface] as const)),
  )("%s: --%s reaches 3:1 on --%s", (mode, mark, surface) => {
    const colors = aureusColors[mode];
    const ratio = contrastRatio(mustParse(colors[mark]), mustParse(colors[surface]));
    expect(ratio).toBeGreaterThanOrEqual(3);
  });

  it.each(modes)("%s: links (primary text) reach 4.5:1 on the background", (mode) => {
    const colors = aureusColors[mode];
    expect(
      contrastRatio(mustParse(colors.primary), mustParse(colors.background)),
    ).toBeGreaterThanOrEqual(4.5);
  });
});
