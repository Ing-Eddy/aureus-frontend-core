import { type TypographyVariant, typographyVariants } from "@aureus-core/ui/components/typography";
import { aureusVariants } from "./default-typography";
import { bundledStacks, resolveFont } from "./font-stack";
import { generateScale } from "./generate-scale";
import {
  type FontRole,
  fontRoles,
  type ResolvedFont,
  type ResolvedTypography,
  type TypographyDraft,
  type VariantStyle,
} from "./typography-types";

/** The styles before overrides: the Aureus preset, or the scale generated from the inputs. */
export function baseVariants(draft: TypographyDraft): Record<TypographyVariant, VariantStyle> {
  return draft.base.kind === "preset"
    ? structuredClone(aureusVariants)
    : generateScale(draft.scale);
}

/** Every role's stack. A bundled heading follows the text font, like the package does. */
export function resolveFonts(draft: TypographyDraft): Record<FontRole, ResolvedFont> {
  const fonts = {} as Record<FontRole, ResolvedFont>;
  for (const role of fontRoles) fonts[role] = resolveFont(role, draft.fonts[role]);
  if (draft.fonts.heading.kind === "bundled") {
    const { sans } = fonts;
    fonts.heading = {
      choice: draft.fonts.heading,
      stack: bundledStacks.heading,
      family: sans.family,
      catalog: sans.catalog,
      verified: true,
    };
  }
  return fonts;
}

/** The single source of truth for the preview, checks, code view and export (design D2). */
export function resolveTypography(draft: TypographyDraft): ResolvedTypography {
  const base = baseVariants(draft);
  const variants = {} as Record<TypographyVariant, VariantStyle>;
  for (const variant of typographyVariants) {
    variants[variant] = { ...base[variant], ...draft.overrides[variant] };
  }
  return { name: draft.name, fonts: resolveFonts(draft), tracking: draft.tracking, variants };
}
