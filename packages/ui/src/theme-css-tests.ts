// @vitest-environment node
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

/**
 * Guard for the Aureus brand theme (`src/styles/theme.css`, spec: brand-theme): every shadcn color
 * token and every brand constant is defined in both modes, the brand utilities are mapped, and the
 * light block is a plain `:root`, so apps can override it without a more specific selector.
 */

const read = (file: string) =>
  readFileSync(fileURLToPath(new URL(`./styles/${file}`, import.meta.url)), "utf8").replace(
    /\/\*[\s\S]*?\*\//g,
    "",
  );

const theme = read("theme.css");

/** Custom properties of the top-level blocks whose selector is exactly `selector`. */
function names(css: string, selector: string): string[] {
  const escaped = selector.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const found: string[] = [];
  for (const block of css.matchAll(new RegExp(`(?:^|\\})\\s*${escaped}\\s*\\{([^}]*)\\}`, "g"))) {
    for (const match of (block[1] ?? "").matchAll(/(--[\w-]+)\s*:/g))
      found.push(match[1] as string);
  }
  return found;
}

const shadcnColors = names(read("shadcn.css"), ":root").filter((name) => name !== "--radius");
const brandConstants = [
  "--brand-blue",
  "--brand-gold",
  "--brand-gold-foreground",
  "--brand-gold-text",
];

describe("theme.css (Aureus brand)", () => {
  it.each([":root", ".dark"])(
    "%s defines every shadcn color token and brand constant",
    (selector) => {
      const defined = names(theme, selector);
      expect(defined.length).toBeGreaterThan(30);
      expect([...defined].sort()).toEqual([...shadcnColors, ...brandConstants].sort());
    },
  );

  it("defines the light block before the dark block, with plain selectors", () => {
    expect(theme).not.toContain(":root:not(.dark)");
    expect(theme.indexOf(":root {")).toBeLessThan(theme.indexOf(".dark {"));
  });

  it("maps the brand constants to Tailwind colors", () => {
    for (const name of brandConstants) {
      const utility = name.replace("--", "--color-");
      expect(theme).toMatch(new RegExp(`${utility}:\\s*var\\(${name}\\);`));
    }
  });
});
