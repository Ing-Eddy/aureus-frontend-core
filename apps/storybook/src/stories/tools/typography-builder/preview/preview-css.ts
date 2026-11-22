import { typographyVariableBlock } from "../core/serialize-typography";
import type { ResolvedTypography } from "../core/typography-types";

/**
 * The frame clones the playground's compiled `@aureus-core/ui/styles.css`, whose typography classes
 * and font utilities read the `--typography-*` variables at runtime. So the preview only needs the
 * same `:root` block the export writes (design D8), and it matches the export exactly.
 */
export function previewCss(typography: ResolvedTypography): string {
  return typographyVariableBlock(typography);
}
