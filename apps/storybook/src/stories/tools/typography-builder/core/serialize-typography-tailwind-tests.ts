import { fileURLToPath } from "node:url";
import { compile } from "@tailwindcss/node";
import { describe, expect, it } from "vitest";
import { createDefaultDraft } from "./default-typography";
import { resolveTypography } from "./resolve-typography";
import { serializeTypography } from "./serialize-typography";
import type { TypographyDraft } from "./typography-types";

/**
 * Proves "Exported file works with the package": the package stylesheet plus the export, compiled
 * by Tailwind CSS v4 as an app would, makes the typography classes and font utilities read the
 * exported variables. (Imports of fonts the playground does not install are checked as text in
 * `resolve-serialize-tests.ts`.)
 */
const stylesDir = fileURLToPath(
  new URL("../../../../../../../packages/ui/src/styles/", import.meta.url),
);

const edited = (): TypographyDraft => ({
  ...createDefaultDraft(),
  tracking: 0.01,
  overrides: { h1: { weight: 800, lineHeight: 1.05 } },
});

async function build(candidates: string[]) {
  const exported = serializeTypography(resolveTypography(edited()));
  const compiler = await compile(`@import "./index.css";\n${exported}`, {
    base: stylesDir,
    onDependency: () => {},
  });
  return compiler.build(candidates);
}

function rule(css: string, selector: string): string {
  const start = css.indexOf(`${selector} {`);
  expect(start, `no rule for ${selector}`).toBeGreaterThanOrEqual(0);
  return css.slice(start, css.indexOf("}", start));
}

describe("typography export compiled after @aureus-core/ui/styles.css", () => {
  it("keeps the package classes reading the variables", async () => {
    const css = await build(["typography-h1"]);
    expect(rule(css, ".typography-h1")).toContain("font-weight: var(--typography-h1-weight)");
  });

  it("routes the font utilities through the font roles", async () => {
    const css = await build(["font-heading", "font-sans", "tracking-wide"]);
    expect(rule(css, ".font-heading")).toContain("font-family: var(--typography-font-heading)");
    expect(rule(css, ".font-sans")).toContain("font-family: var(--typography-font-sans)");
    expect(rule(css, ".tracking-wide")).toContain("var(--typography-tracking-normal)");
  });

  it("ends with the exported :root values, after the package's own", async () => {
    const css = await build([]);
    const exportedAt = css.lastIndexOf("--typography-h1-weight: 800;");
    const packageAt = css.indexOf("--typography-h1-weight: 700;");
    expect(packageAt).toBeGreaterThanOrEqual(0);
    expect(exportedAt).toBeGreaterThan(packageAt);
    expect(css).toContain("--typography-tracking-normal: 0.01em;");
  });
});
