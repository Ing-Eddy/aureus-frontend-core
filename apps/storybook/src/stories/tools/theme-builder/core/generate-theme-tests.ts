import { describe, expect, it } from "vitest";
import { contrastRatio, formatOklch, mustParse } from "./color";
import { checkContrast, failingPairs } from "./contrast";
import { aureusColors, aureusInputs, createDefaultDraft } from "./default-theme";
import { baseColor, generateColors, resolveTheme } from "./generate-theme";
import { palettes } from "./palettes";
import {
  colorTokens,
  modes,
  neutralPalettes,
  type ThemeDraft,
  type ThemeInputs,
} from "./theme-types";

const blue = "oklch(0.546 0.245 262.881)";
const inputsWith = (patch: Partial<ThemeInputs>): ThemeInputs => ({
  ...aureusInputs,
  achromaticPrimary: false,
  ...patch,
});
const generated = (inputs: ThemeInputs): ThemeDraft => ({
  ...createDefaultDraft(),
  base: { kind: "generated" },
  inputs,
});

const hueDistance = (a: number, b: number) => Math.min(Math.abs(a - b), 360 - Math.abs(a - b));

describe("generateColors", () => {
  it.each(modes)("produces every color token (%s)", (mode) => {
    const colors = generateColors(inputsWith({ primary: blue }), mode);
    expect(Object.keys(colors).sort()).toEqual([...colorTokens].sort());
    for (const value of Object.values(colors)) expect(value).toMatch(/^oklch\(/);
  });

  it("carries the primary hue into primary, ring and sidebar-primary", () => {
    for (const mode of modes) {
      const colors = generateColors(inputsWith({ primary: blue }), mode);
      for (const token of ["primary", "ring", "sidebar-primary", "sidebar-ring"] as const) {
        const color = mustParse(colors[token]);
        expect(color.c, `${mode} ${token} chroma`).toBeGreaterThan(0.05);
        expect(hueDistance(color.h, 262.881), `${mode} ${token} hue`).toBeLessThan(5);
      }
    }
  });

  it("keeps the user's exact primary in light mode", () => {
    expect(generateColors(inputsWith({ primary: blue }), "light").primary).toBe(blue);
  });

  it("leaves neutrals at the palette's own chroma with no tint", () => {
    const colors = generateColors(
      inputsWith({ primary: blue, neutral: "slate", tint: 0 }),
      "light",
    );
    const [l, c] = palettes.slate[100];
    expect(mustParse(colors.secondary)).toMatchObject({ l, c });
  });

  it("tints neutrals toward the primary hue", () => {
    const colors = generateColors(inputsWith({ primary: blue, tint: 1 }), "light");
    const muted = mustParse(colors.muted);
    expect(muted.c).toBeGreaterThan(0);
    expect(hueDistance(muted.h, 262.881)).toBeLessThan(5);
    expect(colors.background).toBe("oklch(1 0 0)");
  });

  it("uses the slate ramp when slate is chosen", () => {
    const colors = generateColors(inputsWith({ primary: blue, neutral: "slate" }), "dark");
    const [l, c, h] = palettes.slate[950];
    expect(colors.background).toBe(formatOklch({ l, c, h }));
  });

  it("derives multicolor charts from the primary", () => {
    const colors = generateColors(inputsWith({ primary: blue, chartMode: "primary" }), "light");
    const hues = (["chart-1", "chart-2", "chart-3", "chart-4", "chart-5"] as const).map(
      (token) => mustParse(colors[token]).h,
    );
    expect(new Set(hues.map((hue) => Math.round(hue / 30))).size).toBeGreaterThanOrEqual(4);
  });

  // A sweep of hues × lightness × palettes: every repaired pair must pass (design D4 step 6).
  const primaries = [0, 60, 120, 200, 262, 320].flatMap((h) =>
    [0.35, 0.55, 0.75, 0.9].map((l) => formatOklch({ l, c: 0.15, h })),
  );
  it.each(neutralPalettes)("reaches 4.5:1 on every pair for any primary (%s)", (neutral) => {
    for (const primary of primaries) {
      for (const tint of [0, 1]) {
        const inputs = inputsWith({ primary, neutral, tint, chartMode: "primary" });
        const colors = {
          light: generateColors(inputs, "light"),
          dark: generateColors(inputs, "dark"),
        };
        const failing = failingPairs(checkContrast({ colors }))
          // "if any color can": a surface on which neither black nor white reaches 4.5:1 is exempt.
          .filter((result) => {
            const surface = mustParse(colors[result.mode][result.pair.surface]);
            const best = Math.max(
              contrastRatio(surface, { l: 0, c: 0, h: 0 }),
              contrastRatio(surface, { l: 1, c: 0, h: 0 }),
            );
            return best >= 4.5;
          })
          .map((result) => `${result.mode} ${result.pair.id} ${result.ratio}`);
        expect(failing, `primary ${primary}, tint ${tint}`).toEqual([]);
      }
    }
  });

  it("repairs the stock muted-foreground, which fails 4.5:1 on muted", () => {
    const colors = generateColors(aureusInputs, "light");
    expect(mustParse(colors["muted-foreground"]).l).toBeLessThan(0.556);
  });
});

describe("resolveTheme", () => {
  it("returns the Aureus preset for the default draft", () => {
    expect(resolveTheme(createDefaultDraft()).colors).toEqual(aureusColors);
  });

  it("applies overrides over the base, and they survive an input change", () => {
    const draft: ThemeDraft = {
      ...generated(inputsWith({ primary: blue })),
      overrides: { light: { accent: "oklch(0.9 0.1 120)" }, dark: {} },
    };
    const changed: ThemeDraft = {
      ...draft,
      inputs: { ...draft.inputs, primary: "oklch(0.6 0.2 30)" },
    };
    expect(resolveTheme(changed).colors.light.accent).toBe("oklch(0.9 0.1 120)");
    expect(resolveTheme(changed).colors.light.primary).toBe("oklch(0.6 0.2 30)");
    expect(baseColor(changed, "light", "accent")).not.toBe("oklch(0.9 0.1 120)");
  });
});
