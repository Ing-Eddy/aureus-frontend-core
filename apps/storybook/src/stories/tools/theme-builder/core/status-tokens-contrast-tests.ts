import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { converter, formatCss } from "culori/fn";
import { describe, expect, it } from "vitest";
import { contrastRatio, mustParse, type OklchColor, parseColor } from "./color";
import { aureusColors } from "./default-theme";
import { type Mode, modes } from "./theme-types";

/**
 * Contrast of the status colors (spec: brand-theme, Status colors). A toast paints them as its
 * icon and title, on the popover surface or on a 10% tint of the color over it.
 */
const stylesDir = new URL("../../../../../../../packages/ui/src/styles/", import.meta.url);
const status = readFileSync(fileURLToPath(new URL("status.css", stylesDir)), "utf8").replace(
  /\/\*[\s\S]*?\*\//g,
  "",
);

function declared(selector: ":root" | ".dark", name: string): string | undefined {
  const escaped = selector.replace(/\./g, "\\.");
  const block = status.match(new RegExp(`(?:^|\\})\\s*${escaped}\\s*\\{([^}]*)\\}`))?.[1];
  return block?.match(new RegExp(`--${name}\\s*:\\s*([^;]+);`))?.[1]?.trim();
}

const toOklab = converter("oklab");

/** `color-mix(in oklab, color <amount>, surface)`, the tint the toast stylesheet paints. */
function tint(color: OklchColor, surface: OklchColor, amount: number): OklchColor {
  const a = toOklab({ mode: "oklch", ...color });
  const b = toOklab({ mode: "oklch", ...surface });
  const mix = (x: number, y: number) => x * amount + y * (1 - amount);
  const mixed = parseColor(
    formatCss({ mode: "oklab", l: mix(a.l, b.l), a: mix(a.a, b.a), b: mix(a.b, b.b) }),
  );
  if (!mixed) throw new Error("tint failed");
  return mixed;
}

const statuses = ["success", "warning", "info", "destructive"] as const;

function statusColor(mode: Mode, name: (typeof statuses)[number]): OklchColor {
  if (name === "destructive") return mustParse(aureusColors[mode].destructive);
  const value = declared(mode === "light" ? ":root" : ".dark", name);
  expect(value, `--${name} missing from status.css (${mode})`).toBeDefined();
  return mustParse(value ?? "");
}

describe("status colors", () => {
  const cases = modes.flatMap((mode) => statuses.map((name) => [mode, name] as const));

  it.each(cases)("%s: --%s reaches 4.5:1 on the popover and on its tint", (mode, name) => {
    const color = statusColor(mode, name);
    const popover = mustParse(aureusColors[mode].popover);
    expect(contrastRatio(color, popover)).toBeGreaterThanOrEqual(4.5);
    expect(contrastRatio(color, tint(color, popover, 0.1))).toBeGreaterThanOrEqual(4.5);
  });

  it.each(cases)("%s: popover text reaches 4.5:1 on the %s tint", (mode, name) => {
    const popover = mustParse(aureusColors[mode].popover);
    const text = mustParse(aureusColors[mode]["popover-foreground"]);
    const surface = tint(statusColor(mode, name), popover, 0.1);
    expect(contrastRatio(text, surface)).toBeGreaterThanOrEqual(4.5);
  });

  it("maps the status colors to Tailwind colors", () => {
    for (const name of ["success", "warning", "info"]) {
      expect(status).toMatch(new RegExp(`--color-${name}:\\s*var\\(--${name}\\);`));
    }
  });
});
