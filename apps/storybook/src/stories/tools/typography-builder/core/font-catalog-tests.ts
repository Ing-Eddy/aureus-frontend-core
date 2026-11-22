import { describe, expect, it } from "vitest";
import {
  findCatalogFamily,
  findCatalogFont,
  fontCatalog,
  fontCategories,
  supportsWeight,
} from "./font-catalog";
import { fontPairings } from "./font-pairings";

describe("font catalog", () => {
  it("has unique ids, families and packages", () => {
    for (const key of ["id", "family", "fontsource"] as const) {
      const values = fontCatalog.map((font) => font[key]);
      expect(new Set(values).size, key).toBe(values.length);
    }
  });

  it.each(fontCatalog.map((font) => [font.id, font] as const))("%s is well formed", (_id, font) => {
    const prefix = font.variable ? "@fontsource-variable/" : "@fontsource/";
    expect(font.fontsource).toBe(`${prefix}${font.id}`);
    expect(font.weights.length).toBeGreaterThan(0);
    expect([...font.weights].sort((a, b) => a - b)).toEqual(font.weights);
    for (const weight of font.weights) {
      expect(weight).toBeGreaterThanOrEqual(100);
      expect(weight).toBeLessThanOrEqual(900);
    }
  });

  it("covers every category", () => {
    for (const category of fontCategories) {
      expect(
        fontCatalog.some((font) => font.category === category),
        category,
      ).toBe(true);
    }
  });

  it("finds families with or without the Variable suffix", () => {
    expect(findCatalogFamily("Inter Variable")?.id).toBe("inter");
    expect(findCatalogFamily("jetbrains mono")?.id).toBe("jetbrains-mono");
    expect(findCatalogFamily("Comic Sans")).toBeUndefined();
  });

  it("knows which weights a font provides", () => {
    const lato = findCatalogFont("lato");
    const inter = findCatalogFont("inter");
    if (!lato || !inter) throw new Error("missing fonts");
    expect(supportsWeight(lato, 700)).toBe(true);
    expect(supportsWeight(lato, 600)).toBe(false);
    expect(supportsWeight(inter, 650)).toBe(true);
  });
});

describe("font pairings", () => {
  it("starts with Aureus", () => {
    expect(fontPairings[0]?.id).toBe("aureus");
  });

  it("only references catalog fonts that exist", () => {
    for (const pairing of fontPairings) {
      for (const choice of Object.values(pairing.fonts)) {
        if (choice.kind === "catalog") expect(findCatalogFont(choice.id), pairing.id).toBeDefined();
      }
    }
  });
});
