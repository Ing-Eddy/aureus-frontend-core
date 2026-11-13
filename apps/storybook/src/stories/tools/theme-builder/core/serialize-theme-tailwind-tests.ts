import { fileURLToPath } from "node:url";
import { compile } from "@tailwindcss/node";
import { describe, expect, it } from "vitest";
import { createDefaultDraft } from "./default-theme";
import { resolveTheme } from "./generate-theme";
import { serializeTheme } from "./serialize-theme";

/**
 * Proves the "exported file works in a fresh app" scenario: the export compiles after
 * `@import "tailwindcss"` and every utility reads the theme's variables, not Tailwind's defaults.
 */
const base = fileURLToPath(new URL(".", import.meta.url));

async function build(candidates: string[]): Promise<string> {
  const draft = createDefaultDraft();
  const css = serializeTheme(resolveTheme({ ...draft, inputs: { ...draft.inputs, spacing: 0.3 } }));
  const compiler = await compile(`@import "tailwindcss";\n${css}`, {
    base,
    onDependency: () => {},
  });
  return compiler.build(candidates);
}

/** Selector and declarations of the rule for one utility class (variants flatten into the selector). */
function rule(css: string, className: string): string {
  const start = css.indexOf(`.${className.replace(/:/g, "\\:")}`);
  expect(start, `no rule for .${className}`).toBeGreaterThanOrEqual(0);
  return css.slice(start, css.indexOf("}", start));
}

describe("exported theme compiled with Tailwind CSS v4", () => {
  it.each([
    ["bg-primary", "background-color: var(--primary)"],
    ["text-muted-foreground", "color: var(--muted-foreground)"],
    ["rounded-lg", "border-radius: var(--radius)"],
    ["font-sans", "font-family: var(--font-sans)"],
    ["tracking-tight", "letter-spacing: calc(var(--tracking-normal) - 0.025em)"],
    ["p-4", "padding: calc(var(--spacing) * 4)"],
  ])("%s → %s", async (className, declaration) => {
    expect(rule(await build([className]), className)).toContain(declaration);
  });

  it("shadow-md reads the theme's --shadow-md", async () => {
    expect(rule(await build(["shadow-md"]), "shadow-md")).toContain("var(--shadow-md)");
  });

  it("dark:bg-primary emits the .dark variant", async () => {
    const css = await build(["dark:bg-primary"]);
    const body = rule(css, "dark:bg-primary");
    expect(body).toContain(":is(.dark *)");
    expect(body).toContain("background-color: var(--primary)");
    expect(css).not.toContain("prefers-color-scheme");
  });

  it("keeps the theme's own :root and .dark values", async () => {
    const css = await build([]);
    expect(css).toContain("--spacing: 0.3rem;");
    expect(css).toMatch(/\.dark \{\s*--background: oklch\(0\.145 0 0\);/);
  });
});
