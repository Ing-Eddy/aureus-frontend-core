import { shadowSteps, themeVariableBlocks } from "../core/serialize-theme";
import type { ResolvedTheme } from "../core/theme-types";

/**
 * The prebuilt `@aureus-core/ui/styles.css` inlines a few theme values into its utilities (fonts,
 * Tailwind's default shadows and letter spacing), so overriding the variables alone does not reach
 * them. These preview-only rules route them back through the variables (design D5). They are not
 * part of the export: there, `@theme inline` does this at build time.
 */
const adapter = [
  "html, body, .font-sans { font-family: var(--font-sans); }",
  ".font-heading { font-family: var(--font-sans); }",
  ".font-serif { font-family: var(--font-serif); }",
  ".font-mono, code, kbd, pre, samp { font-family: var(--font-mono); }",
  ...shadowSteps.map((step) => {
    const name = step ? `shadow-${step}` : "shadow";
    return `.${name} { --tw-shadow: var(--${name}); }`;
  }),
  "body { letter-spacing: var(--tracking-normal); }",
  ".tracking-tighter { letter-spacing: calc(var(--tracking-normal) - 0.05em); }",
  ".tracking-tight { letter-spacing: calc(var(--tracking-normal) - 0.025em); }",
  ".tracking-wide { letter-spacing: calc(var(--tracking-normal) + 0.025em); }",
  ".tracking-wider { letter-spacing: calc(var(--tracking-normal) + 0.05em); }",
  ".tracking-widest { letter-spacing: calc(var(--tracking-normal) + 0.1em); }",
].join("\n");

export function previewCss(theme: ResolvedTheme): string {
  const [root, dark] = themeVariableBlocks(theme);
  return [root, dark, adapter].join("\n\n");
}
