import { shadowSteps, themeVariableBlocks } from "../core/serialize-theme";
import type { ResolvedTheme } from "../core/theme-types";

/**
 * The prebuilt `@aureus-core/ui/styles.css` inlines Tailwind's default shadows into its utilities,
 * so overriding the variables alone does not reach them. (Fonts and letter spacing read the
 * `--typography-*` variables at runtime and belong to the Typography Builder.) These preview-only rules route them back through the variables (design D5). They are not
 * part of the export: there, `@theme inline` does this at build time.
 */
const adapter = [
  ...shadowSteps.map((step) => {
    const name = step ? `shadow-${step}` : "shadow";
    return `.${name} { --tw-shadow: var(--${name}); }`;
  }),
].join("\n");

export function previewCss(theme: ResolvedTheme): string {
  const [root, dark] = themeVariableBlocks(theme);
  return [root, dark, adapter].join("\n\n");
}
