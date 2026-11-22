// @vitest-environment node
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { typographyVariants } from "../utils";

/**
 * Keeps `src/styles/typography.css` in sync with `typographyVariants`: every variant needs its six
 * runtime variables and its class, and the classes must stay in the `components` layer so utilities
 * always win over them.
 */

const stylesDir = fileURLToPath(new URL("../../../styles/", import.meta.url));
const css = readFileSync(`${stylesDir}typography.css`, "utf8").replace(/\/\*[\s\S]*?\*\//g, "");
const properties = ["font", "size", "line-height", "weight", "tracking", "transform"] as const;

/** The body of the first top-level block whose prelude matches, by brace counting. */
function blockBody(prelude: string): string {
  const start = css.indexOf(`${prelude} {`);
  if (start < 0) return "";
  let depth = 0;
  for (let index = css.indexOf("{", start); index < css.length; index += 1) {
    if (css[index] === "{") depth += 1;
    if (css[index] === "}") depth -= 1;
    if (depth === 0) return css.slice(css.indexOf("{", start) + 1, index);
  }
  return "";
}

/** `--name: value;` declarations of a block, as a map. */
function declarations(body: string): Map<string, string> {
  const map = new Map<string, string>();
  for (const match of body.matchAll(/(--[\w-]+)\s*:\s*([^;]+);/g)) {
    map.set(match[1] as string, (match[2] as string).replace(/\s+/g, " ").trim());
  }
  return map;
}

const root = declarations(blockBody(":root"));
const theme = declarations(blockBody("@theme inline"));
const components = blockBody("@layer components");

describe("typography.css", () => {
  it("imports the bundled mono font", () => {
    expect(css).toMatch(/@import "@fontsource-variable\/geist-mono";/);
  });

  it("defines the font roles and the global tracking", () => {
    expect(root.get("--typography-font-sans")).toMatch(/^"Geist Variable", .*sans-serif$/);
    expect(root.get("--typography-font-heading")).toBe("var(--typography-font-sans)");
    expect(root.get("--typography-font-serif")).toMatch(/^ui-serif, .*serif$/);
    expect(root.get("--typography-font-mono")).toMatch(/^"Geist Mono Variable", .*monospace$/);
    expect(root.get("--typography-tracking-normal")).toBe("0em");
  });

  it.each(typographyVariants)("defines the six variables of %s", (variant) => {
    for (const property of properties) {
      expect(root.has(`--typography-${variant}-${property}`), property).toBe(true);
    }
    expect(root.get(`--typography-${variant}-font`)).toMatch(
      /^var\(--typography-font-(sans|heading|serif|mono)\)$/,
    );
  });

  it("defines no variable for an unknown variant", () => {
    const known = new Set<string>(typographyVariants);
    const variantVariables = [...root.keys()].filter(
      (name) => !name.startsWith("--typography-font-") && name !== "--typography-tracking-normal",
    );
    for (const name of variantVariables) {
      const match = name.match(
        /^--typography-(.+)-(font|size|line-height|weight|tracking|transform)$/,
      );
      expect(match && known.has(match[1] as string), name).toBe(true);
    }
    expect(variantVariables).toHaveLength(typographyVariants.length * properties.length);
  });

  it.each(typographyVariants)("puts the class of %s in the components layer", (variant) => {
    const rule = components.match(new RegExp(`\\.typography-${variant} \\{([^}]*)\\}`));
    expect(rule, `.typography-${variant}`).not.toBeNull();
    const body = (rule?.[1] ?? "").replace(/\s+/g, " ");
    expect(body).toContain(`font-family: var(--typography-${variant}-font);`);
    expect(body).toContain(`font-size: var(--typography-${variant}-size);`);
    expect(body).toContain(`line-height: var(--typography-${variant}-line-height);`);
    expect(body).toContain(`font-weight: var(--typography-${variant}-weight);`);
    expect(body).toContain(`letter-spacing: var(--typography-${variant}-tracking);`);
    expect(body).toContain(`text-transform: var(--typography-${variant}-transform);`);
  });

  it("keeps a rem term in every fluid size", () => {
    for (const variant of typographyVariants) {
      const size = root.get(`--typography-${variant}-size`) ?? "";
      if (size.includes("vw")) {
        const parts = size.slice(size.indexOf("(") + 1, -1).split(",");
        for (const part of parts) expect(part, `${variant}: ${part}`).toMatch(/rem/);
      }
    }
  });

  it("maps Tailwind's font and tracking tokens to the runtime variables", () => {
    for (const role of ["sans", "heading", "serif", "mono"]) {
      expect(theme.get(`--font-${role}`)).toBe(`var(--typography-font-${role})`);
    }
    expect(theme.get("--tracking-normal")).toBe("var(--typography-tracking-normal)");
    for (const step of ["tighter", "tight", "wide", "wider", "widest"]) {
      expect(theme.get(`--tracking-${step}`)).toMatch(/^calc\(var\(--typography-tracking-normal\)/);
    }
  });

  it("is imported after the theme overrides", () => {
    const index = readFileSync(`${stylesDir}index.css`, "utf8");
    const theme = index.indexOf('@import "./theme.css";');
    const typography = index.indexOf('@import "./typography.css";');
    expect(theme).toBeGreaterThanOrEqual(0);
    expect(typography).toBeGreaterThan(theme);
  });
});
