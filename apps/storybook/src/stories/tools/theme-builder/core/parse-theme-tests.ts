import { describe, expect, it } from "vitest";
import { normalizeColor } from "./color";
import { createDefaultDraft } from "./default-theme";
import { resolveTheme } from "./generate-theme";
import { importTheme, parseThemeCss } from "./parse-theme";
import { serializeTheme } from "./serialize-theme";
import type { ThemeDraft } from "./theme-types";

describe("parseThemeCss", () => {
  it("reads :root, :root:not(.dark) and .dark blocks", () => {
    const parsed = parseThemeCss(`
      :root { --radius: 0.5rem; --primary: oklch(0.5 0.2 260); }
      :root:not(.dark) { --muted: #eee; }
      .dark { --primary: oklch(0.7 0.15 260); }
    `);
    expect(parsed.light).toEqual({
      "--radius": "0.5rem",
      "--primary": "oklch(0.5 0.2 260)",
      "--muted": "#eee",
    });
    expect(parsed.dark).toEqual({ "--primary": "oklch(0.7 0.15 260)" });
  });

  it("ignores comments, including braces and semicolons inside them", () => {
    const parsed = parseThemeCss(`
      /* :root { --primary: red; } */
      :root { /* --muted: blue; */ --accent: green; }
    `);
    expect(parsed.light).toEqual({ "--accent": "green" });
  });

  it("keeps quoted strings intact", () => {
    const parsed = parseThemeCss(
      `:root { --font-sans: "Inter; Display", 'A /* b */', sans-serif; }`,
    );
    expect(parsed.light["--font-sans"]).toBe(`"Inter; Display", 'A /* b */', sans-serif`);
  });

  it("descends into @layer and skips @media, @theme and other selectors", () => {
    const parsed = parseThemeCss(`
      @import "tailwindcss";
      @layer base {
        :root { --background: 0 0% 100%; }
        .dark { --background: 222.2 84% 4.9%; }
      }
      @media (prefers-color-scheme: dark) { :root { --background: black; } }
      @theme inline { --color-background: var(--background); }
      body { --background: red; }
    `);
    expect(parsed.light).toEqual({ "--background": "0 0% 100%" });
    expect(parsed.dark).toEqual({ "--background": "222.2 84% 4.9%" });
  });

  it("accepts selector lists that contain :root or .dark", () => {
    const parsed = parseThemeCss(
      `:root, .light { --primary: red; } .dark, [data-theme="dark"] { --primary: blue; }`,
    );
    expect(parsed.light["--primary"]).toBe("red");
    expect(parsed.dark["--primary"]).toBe("blue");
  });

  it("skips nested rules inside a theme block", () => {
    const parsed = parseThemeCss(
      `:root { --primary: red; & .x { --primary: blue; } --muted: gray; }`,
    );
    expect(parsed.light).toEqual({ "--primary": "red", "--muted": "gray" });
  });

  it("survives malformed input", () => {
    expect(parseThemeCss(":root { --primary: red;")).toEqual({ light: {}, dark: {} });
    expect(parseThemeCss("}}} {{{")).toEqual({ light: {}, dark: {} });
    expect(parseThemeCss("")).toEqual({ light: {}, dark: {} });
  });
});

const tweakcn = `
:root {
  --background: oklch(0.9900 0.0020 247.8);
  --foreground: oklch(0.2000 0.0200 260);
  --primary: oklch(0.6000 0.1800 250);
  --primary-foreground: oklch(1.0000 0 0);
  --destructive-foreground: oklch(1 0 0);
  --font-sans: Inter, sans-serif;
  --font-mono: JetBrains Mono, monospace;
  --radius: 0.5rem;
  --shadow-color: hsl(0 0% 0%);
  --shadow-opacity: 0.18;
  --shadow-blur: 4px;
  --shadow-spread: 0px;
  --shadow-offset-x: 0px;
  --shadow-offset-y: 2px;
  --letter-spacing: -0.01em;
  --spacing: 0.25rem;
  --shadow-sm: 0px 2px 4px 0px hsl(0 0% 0% / 0.18);
}
.dark {
  --background: oklch(0.1500 0.0200 260);
  --primary: oklch(0.7000 0.1500 250);
  --shadow-color: hsl(0 0% 0%);
}
@theme inline { --color-background: var(--background); }
`;

describe("importTheme", () => {
  it("imports a tweakcn theme: colors as overrides, the rest as inputs, fonts ignored", () => {
    const result = importTheme(createDefaultDraft(), parseThemeCss(tweakcn));
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    const { draft, report } = result;
    expect(draft.overrides.light.primary).toBe("oklch(0.6 0.18 250)");
    expect(draft.overrides.dark.background).toBe("oklch(0.15 0.02 260)");
    expect(draft.inputs.radius).toBe(0.5);
    expect(draft.inputs.shadow).toMatchObject({ opacity: 0.18, blur: 4, y: 2 });
    expect(report.ignored).toEqual([
      "--destructive-foreground (light)",
      "--font-sans (light)",
      "--font-mono (light)",
      "--letter-spacing (light)",
    ]);
    expect(report.typography).toBe(true);
    expect(report.missing).toContain("--sidebar (dark)");
    expect(report.missing).not.toContain("--primary (light)");
    expect(report.imported).toBe(15);
  });

  it("keeps the base, so tokens missing from the file keep their values", () => {
    const result = importTheme(createDefaultDraft(), parseThemeCss(tweakcn));
    if (!result.ok) throw new Error("import failed");
    expect(result.draft.base).toEqual({ kind: "preset", id: "aureus" });
    expect(resolveTheme(result.draft).colors.light.muted).toBe(
      resolveTheme(createDefaultDraft()).colors.light.muted,
    );
  });

  it("converts shadcn v3 HSL channels to OKLCH", () => {
    const result = importTheme(
      createDefaultDraft(),
      parseThemeCss("@layer base { :root { --primary: 222.2 47.4% 11.2%; } }"),
    );
    if (!result.ok) throw new Error("import failed");
    expect(result.draft.overrides.light.primary).toBe(normalizeColor("hsl(222.2 47.4% 11.2%)"));
  });

  it("reports an invalid color as ignored and keeps the current value", () => {
    const result = importTheme(
      createDefaultDraft(),
      parseThemeCss(":root { --primary: nope; --muted: #eee; }"),
    );
    if (!result.ok) throw new Error("import failed");
    expect(result.draft.overrides.light.primary).toBeUndefined();
    expect(result.report.ignored).toEqual(["--primary (light)"]);
    expect(result.report.imported).toBe(1);
  });

  it("rejects CSS without theme tokens and leaves the draft unchanged", () => {
    const draft = createDefaultDraft();
    const before = structuredClone(draft);
    expect(
      importTheme(draft, parseThemeCss(".btn { color: red; } :root { --brand: red; }")),
    ).toEqual({
      ok: false,
    });
    expect(draft).toEqual(before);
  });

  it("round-trips an exported theme exactly, with nothing ignored", () => {
    const source: ThemeDraft = {
      ...createDefaultDraft(),
      base: { kind: "generated" },
      inputs: {
        ...createDefaultDraft().inputs,
        achromaticPrimary: false,
        primary: "oklch(0.62 0.19 150)",
        neutral: "stone",
        tint: 0.6,
        chartMode: "primary",
        radius: 0.3,
        shadow: {
          color: { light: "oklch(0.3 0.05 150)", dark: "oklch(0 0 0)" },
          opacity: 0.2,
          blur: 6,
          spread: -1,
          x: 1,
          y: 3,
        },
        spacing: 0.3,
      },
      overrides: { light: { accent: "oklch(0.9 0.05 90)" }, dark: {} },
    };
    const css = serializeTheme(resolveTheme(source));
    const result = importTheme(createDefaultDraft(), parseThemeCss(css));
    if (!result.ok) throw new Error("import failed");
    expect(result.report.ignored).toEqual([]);
    expect(result.report.typography).toBe(false);
    expect(result.report.missing).toEqual([]);
    const { name: _a, ...expected } = resolveTheme(source);
    const { name: _b, ...actual } = resolveTheme(result.draft);
    expect(actual).toEqual(expected);
    expect(serializeTheme(resolveTheme({ ...result.draft, name: source.name }))).toBe(css);
  });

  it("imports an older export with fonts: reports them as ignored and points to the typography tool", () => {
    const older = `:root { --primary: oklch(0.5 0.2 260); --radius: 0.75rem; --font-sans: Inter, sans-serif; --tracking-normal: 0.01em; }
@theme inline { --font-sans: var(--font-sans); --tracking-tight: calc(var(--tracking-normal) - 0.025em); }`;
    const result = importTheme(createDefaultDraft(), parseThemeCss(older));
    if (!result.ok) throw new Error("import failed");
    expect(result.draft.overrides.light.primary).toBe("oklch(0.5 0.2 260)");
    expect(result.draft.inputs.radius).toBe(0.75);
    expect(result.report.ignored).toEqual(["--font-sans (light)", "--tracking-normal (light)"]);
    expect(result.report.typography).toBe(true);
  });
});
