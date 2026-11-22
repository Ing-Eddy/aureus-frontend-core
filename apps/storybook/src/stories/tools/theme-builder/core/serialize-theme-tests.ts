import { describe, expect, it } from "vitest";
import { createDefaultDraft } from "./default-theme";
import { resolveTheme } from "./generate-theme";
import { lightSelector, serializeTheme, shadowValues } from "./serialize-theme";
import { colorTokens, type ThemeDraft } from "./theme-types";

const draft = (): ThemeDraft => ({
  ...createDefaultDraft(),
  name: "Ocean Breeze",
  base: { kind: "generated" },
  inputs: {
    ...createDefaultDraft().inputs,
    achromaticPrimary: false,
    primary: "oklch(0.6 0.15 220)",
  },
});

/** Declarations of one top-level block. */
function blockOf(css: string, selector: string): string {
  const start = css.indexOf(`${selector} {`);
  expect(start, `no ${selector} block`).toBeGreaterThanOrEqual(0);
  return css.slice(start, css.indexOf("\n}", start));
}

describe("serializeTheme", () => {
  const css = serializeTheme(resolveTheme(draft()));

  it("is deterministic", () => {
    expect(serializeTheme(resolveTheme(draft()))).toBe(css);
  });

  it("writes a header naming the theme and pointing to the Typography Builder", () => {
    expect(css.startsWith("/* Ocean Breeze — shadcn theme for Tailwind CSS v4.")).toBe(true);
    expect(css).toContain("export them with the Aureus Typography Builder");
  });

  it("is named theme by default and says how to use it with @aureus-core/ui", () => {
    const plain = serializeTheme(resolveTheme(createDefaultDraft()));
    expect(createDefaultDraft().name).toBe("theme");
    expect(plain.startsWith("/* theme — shadcn theme")).toBe(true);
    expect(plain).toContain('import this file after @import "@aureus-core/ui/styles.css"');
  });

  it("writes the light block so it beats the package's light-only overrides", () => {
    expect(lightSelector).toBe(":root, :root:not(.dark)");
    expect(css.indexOf(`${lightSelector} {`)).toBeLessThan(css.indexOf(".dark {"));
  });

  it("contains no typography", () => {
    const declarations = css.replace(/\/\*[\s\S]*?\*\//g, "");
    expect(declarations).not.toMatch(/--font-|--tracking-|letter-spacing/);
  });

  it("declares every color token in :root and .dark, all in OKLCH", () => {
    for (const selector of [lightSelector, ".dark"]) {
      const body = blockOf(css, selector);
      for (const token of colorTokens) expect(body).toMatch(new RegExp(`--${token}: oklch\\(`));
    }
    const colorValues = [...css.matchAll(/--(?:[a-z0-9-]+): ((?:#|rgb|hsl)[^;]*);/g)];
    expect(colorValues).toEqual([]);
  });

  it("maps everything to Tailwind in @theme inline", () => {
    const body = blockOf(css, "@theme inline");
    expect(body).toContain("--color-primary: var(--primary);");
    expect(body).toContain("--radius-lg: var(--radius);");
    expect(body).toContain("--radius-xl: calc(var(--radius) * 1.4);");
    expect(body).toContain("--shadow-md: var(--shadow-md);");
  });

  it("exports the raw shadow parameters and spacing", () => {
    const root = blockOf(css, lightSelector);
    expect(root).toContain("--shadow-opacity: 0.1;");
    expect(root).toContain("--shadow-offset-y: 1px;");
    expect(root).toContain("--spacing: 0.25rem;");
    expect(root).toContain("--radius: 0.625rem;");
  });
});

describe("shadowValues", () => {
  it("derives every step from the shadow definition", () => {
    const values = shadowValues(resolveTheme(draft()), "light");
    expect(values.sm).toBe(
      "0px 1px 3px 0px oklch(0 0 0 / 10%), 0px 1px 2px -1px oklch(0 0 0 / 10%)",
    );
    expect(values["2xs"]).toBe("0px 1px 3px 0px oklch(0 0 0 / 5%)");
    expect(values["2xl"]).toBe("0px 1px 3px 0px oklch(0 0 0 / 25%)");
  });
});
