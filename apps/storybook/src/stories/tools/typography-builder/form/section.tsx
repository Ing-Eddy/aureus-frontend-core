import type { Dispatch } from "react";
import type { TypographyDraft } from "../core/typography-types";
import type { TypographyBuilderStrings } from "../i18n/typography-builder-strings";
import type { TypographyAction } from "../use-typography-draft";

export { Section } from "../../shared/form";

/** What every form section receives from the builder. */
export interface SectionProps {
  draft: TypographyDraft;
  dispatch: Dispatch<TypographyAction>;
  t: TypographyBuilderStrings;
}

/** The visible name of each role. */
export const roleLabel = (t: TypographyBuilderStrings) =>
  ({ sans: t.roleSans, heading: t.roleHeading, serif: t.roleSerif, mono: t.roleMono }) as const;
