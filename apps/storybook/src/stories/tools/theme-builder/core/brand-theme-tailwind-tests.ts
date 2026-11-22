import { fileURLToPath } from "node:url";
import { compile } from "@tailwindcss/node";
import { describe, expect, it } from "vitest";

/**
 * The Aureus brand theme as an app compiles it (spec: brand-theme): the package stylesheet alone
 * gives the brand utilities, and an app's own `:root` override comes after the brand block.
 */
const stylesDir = fileURLToPath(
  new URL("../../../../../../../packages/ui/src/styles/", import.meta.url),
);

async function build(appCss: string, candidates: string[]) {
  const compiler = await compile(`@import "./index.css";\n${appCss}`, {
    base: stylesDir,
    onDependency: () => {},
  });
  return compiler.build(candidates);
}

function rule(css: string, className: string): string {
  const start = css.indexOf(`.${className} {`);
  expect(start, `no rule for .${className}`).toBeGreaterThanOrEqual(0);
  return css.slice(start, css.indexOf("}", start));
}

describe("Aureus brand theme compiled with Tailwind CSS v4", () => {
  it("provides the brand utilities", async () => {
    const css = await build("", ["bg-brand-gold", "text-brand-gold-text", "bg-brand-blue"]);
    expect(rule(css, "bg-brand-gold")).toContain("background-color: var(--brand-gold)");
    expect(rule(css, "text-brand-gold-text")).toContain("color: var(--brand-gold-text)");
    expect(rule(css, "bg-brand-blue")).toContain("background-color: var(--brand-blue)");
  });

  it("ships the brand primary and gold secondary", async () => {
    const css = await build("", []);
    expect(css).toMatch(/:root \{[^}]*--primary: oklch\(0\.45 0\.2 264\);/);
    expect(css).toMatch(/\.dark \{[^}]*--secondary: oklch\(0\.82 0\.13 86\);/);
  });

  it("lets a plain :root override in the app come after the brand block", async () => {
    const css = await build(":root { --muted-foreground: oklch(0.4 0.1 250); }", []);
    const brandAt = css.indexOf("--muted-foreground: oklch(0.446 0.043 257.281);");
    const appAt = css.lastIndexOf("--muted-foreground: oklch(0.4 0.1 250);");
    expect(brandAt).toBeGreaterThanOrEqual(0);
    expect(appAt).toBeGreaterThan(brandAt);
    expect(css).not.toContain(":root:not(.dark)");
  });
});
