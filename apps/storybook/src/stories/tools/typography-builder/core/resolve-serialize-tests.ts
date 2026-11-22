import { describe, expect, it } from "vitest";
import { createDefaultDraft } from "./default-typography";
import { fontPairings } from "./font-pairings";
import { resolveTypography } from "./resolve-typography";
import { serializeTypography } from "./serialize-typography";
import type { TypographyDraft } from "./typography-types";

const pairing = (id: string) => {
  const found = fontPairings.find((entry) => entry.id === id);
  if (!found) throw new Error(id);
  return found;
};

const withPairing = (draft: TypographyDraft, id: string): TypographyDraft => ({
  ...draft,
  fonts: { ...draft.fonts, ...pairing(id).fonts },
});

describe("resolveTypography", () => {
  it("lays overrides over the base, property by property", () => {
    const draft = createDefaultDraft();
    draft.overrides.h1 = { weight: 800 };
    const resolved = resolveTypography(draft);
    expect(resolved.variants.h1.weight).toBe(800);
    expect(resolved.variants.h1.lineHeight).toBe(1.15);
  });

  it("keeps an override when the scale is regenerated", () => {
    const draft: TypographyDraft = {
      ...createDefaultDraft(),
      base: { kind: "generated" },
      overrides: { h1: { weight: 800 } },
    };
    const before = resolveTypography(draft).variants.h1;
    const after = resolveTypography({ ...draft, scale: { ...draft.scale, ratio: Math.SQRT2 } })
      .variants.h1;
    expect(after.weight).toBe(800);
    expect(after.size).not.toEqual(before.size);
  });

  it("applies a pairing without touching overrides", () => {
    const draft = withPairing(
      { ...createDefaultDraft(), overrides: { h2: { weight: 800 } } },
      "inter-jetbrains",
    );
    const resolved = resolveTypography(draft);
    expect(resolved.fonts.sans.family).toBe("Inter");
    expect(resolved.fonts.heading.family).toBe("Inter");
    expect(resolved.fonts.mono.family).toBe("JetBrains Mono");
    expect(resolved.variants.h2.weight).toBe(800);
  });
});

describe("serializeTypography", () => {
  it("is named typography by default", () => {
    expect(createDefaultDraft().name).toBe("typography");
    expect(serializeTypography(resolveTypography(createDefaultDraft()))).toMatch(
      /^\/\* typography — /,
    );
    expect(serializeTypography(resolveTypography({ ...createDefaultDraft(), name: " " }))).toMatch(
      /^\/\* typography — /,
    );
  });

  const draft = { ...withPairing(createDefaultDraft(), "editorial"), name: "Docs" };
  const css = serializeTypography(resolveTypography(draft));

  it("is deterministic", () => {
    expect(serializeTypography(resolveTypography(structuredClone(draft)))).toBe(css);
  });

  it("names the install command and the import order in the header", () => {
    expect(css.startsWith("/* Docs — Aureus typography.")).toBe(true);
    expect(css).toContain(
      "Install: pnpm add @fontsource-variable/fraunces @fontsource-variable/inter @fontsource-variable/jetbrains-mono",
    );
    expect(css).toContain("Import this file after @aureus-core/ui/styles.css.");
  });

  it("imports every package once, sorted, before :root", () => {
    const imports = [...css.matchAll(/^@import "([^"]+)";$/gm)].map((match) => match[1]);
    expect(imports).toEqual([
      "@fontsource-variable/fraunces",
      "@fontsource-variable/inter",
      "@fontsource-variable/jetbrains-mono",
    ]);
    expect(css.indexOf("@import")).toBeLessThan(css.indexOf(":root {"));
  });

  it("writes the variables in catalog order", () => {
    const names = [...css.matchAll(/^ {2}(--typography-[\w-]+):/gm)].map((match) => match[1]);
    expect(names.slice(0, 5)).toEqual([
      "--typography-font-sans",
      "--typography-font-heading",
      "--typography-font-serif",
      "--typography-font-mono",
      "--typography-tracking-normal",
    ]);
    expect(names[5]).toBe("--typography-display-font");
    expect(names.at(-1)).toBe("--typography-code-transform");
    expect(names).toHaveLength(5 + 15 * 6);
  });

  it("flags unverified packages of custom fonts", () => {
    const custom: TypographyDraft = {
      ...createDefaultDraft(),
      fonts: {
        ...createDefaultDraft().fonts,
        heading: { kind: "custom", family: "Comic Neue", fontsource: "@fontsource/comic-neue" },
      },
    };
    expect(serializeTypography(resolveTypography(custom))).toContain(
      "Unverified packages (custom fonts, check they exist): @fontsource/comic-neue",
    );
  });
});
