import type { Dispatch } from "react";
import type { ThemeDraft } from "../core/theme-types";
import type { ThemeBuilderStrings } from "../i18n/theme-builder-strings";
import type { DraftAction } from "../use-theme-draft";

export { Section } from "../../shared/form";

/** What every form section receives from the builder. */
export interface SectionProps {
  draft: ThemeDraft;
  dispatch: Dispatch<DraftAction>;
  t: ThemeBuilderStrings;
}
