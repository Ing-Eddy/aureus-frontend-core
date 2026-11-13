import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { normalizeColor } from "./color";
import { aureusColors, aureusInputs } from "./default-theme";
import { colorTokens, type Mode } from "./theme-types";

const stylesDir = new URL("../../../../../../../packages/ui/src/styles/", import.meta.url);
const read = (file: string) => readFileSync(fileURLToPath(new URL(file, stylesDir)), "utf8");

/** Custom properties of every top-level block whose selector is exactly `selector`. */
function declarations(css: string, selector: string): Record<string, string> {
  const result: Record<string, string> = {};
  const withoutComments = css.replace(/\/\*[\s\S]*?\*\//g, "");
  const escaped = selector.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  for (const block of withoutComments.matchAll(
    new RegExp(`(?:^|\\})\\s*${escaped}\\s*\\{([^}]*)\\}`, "g"),
  )) {
    for (const [, name, value] of (block[1] ?? "").matchAll(/--([\w-]+)\s*:\s*([^;]+);/g)) {
      if (name && value) result[name] = value.trim();
    }
  }
  return result;
}

/** What `@aureus-core/ui/styles.css` resolves to: shadcn.css, then theme.css on top. */
function packageTokens(): Record<Mode, Record<string, string>> {
  const shadcn = read("shadcn.css");
  const theme = read("theme.css");
  return {
    light: { ...declarations(shadcn, ":root"), ...declarations(theme, ":root:not(.dark)") },
    dark: { ...declarations(shadcn, ".dark"), ...declarations(theme, ".dark") },
  };
}

describe("Aureus preset", () => {
  const tokens = packageTokens();

  it.each(["light", "dark"] as const)("matches the package's %s tokens", (mode) => {
    for (const token of colorTokens) {
      const fromPackage = tokens[mode][token];
      expect(fromPackage, `--${token} missing from the package (${mode})`).toBeDefined();
      expect(aureusColors[mode][token], `--${token} (${mode})`).toBe(
        normalizeColor(fromPackage ?? ""),
      );
    }
  });

  it("has no color token the package lacks", () => {
    const packageColors = Object.keys(tokens.light).filter((name) => name !== "radius");
    expect([...colorTokens].sort()).toEqual(packageColors.sort());
  });

  it("matches the package's radius", () => {
    expect(`${aureusInputs.radius}rem`).toBe(tokens.light.radius);
  });
});
