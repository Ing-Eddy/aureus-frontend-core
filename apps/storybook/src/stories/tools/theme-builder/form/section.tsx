import type { Dispatch, ReactNode } from "react";
import type { ThemeDraft } from "../core/theme-types";
import type { ThemeBuilderStrings } from "../i18n/theme-builder-strings";
import type { DraftAction } from "../use-theme-draft";

/** What every form section receives from the builder. */
export interface SectionProps {
  draft: ThemeDraft;
  dispatch: Dispatch<DraftAction>;
  t: ThemeBuilderStrings;
}

export function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section aria-label={title} className="flex flex-col gap-4 rounded-xl border bg-card p-4">
      <h2 className="font-heading text-base font-semibold">{title}</h2>
      {children}
    </section>
  );
}
