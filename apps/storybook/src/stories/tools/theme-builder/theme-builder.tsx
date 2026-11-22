import { Button } from "@aureus-core/ui/shadcn/button";
import type { Locale } from "@sb/i18n/locale-types";
import { RotateCcwIcon } from "lucide-react";
import { useMemo, useState } from "react";
import { PreviewFrame } from "../shared/preview";
import { checkContrast } from "./core/contrast";
import { browserStorage, type DraftStorage } from "./core/draft-storage";
import { resolveTheme } from "./core/generate-theme";
import { serializeTheme } from "./core/serialize-theme";
import { ColorsSection } from "./form/colors-section";
import { ContrastSummary } from "./form/contrast-summary";
import { ExportSection } from "./form/export-section";
import { ImportSection } from "./form/import-section";
import { OverridesSection } from "./form/overrides-section";
import { ShadowsSpacingSection } from "./form/shadows-spacing-section";
import { TypographyLink } from "./form/typography-link";
import { themeBuilderStrings } from "./i18n/theme-builder-strings";
import { previewCss } from "./preview/preview-css";
import { PreviewSample } from "./preview/preview-sample";
import { useThemeDraft } from "./use-theme-draft";

export interface ThemeBuilderProps {
  locale: Locale;
  /** Where the draft is kept; defaults to `localStorage`. */
  storage?: DraftStorage;
}

/**
 * The theme builder page (spec: theme-builder). The draft is the single source of truth; the
 * preview, the contrast table, the code view and the download all read `resolveTheme(draft)`.
 */
export function ThemeBuilder({ locale, storage = browserStorage() }: ThemeBuilderProps) {
  const t = themeBuilderStrings[locale];
  const { draft, dispatch, reset } = useThemeDraft(storage);
  const [confirmingReset, setConfirmingReset] = useState(false);

  const theme = useMemo(() => resolveTheme(draft), [draft]);
  const contrast = useMemo(() => checkContrast(theme), [theme]);
  const css = useMemo(() => serializeTheme(theme), [theme]);
  const frameCss = useMemo(() => previewCss(theme), [theme]);
  const sectionProps = { draft, dispatch, t };

  return (
    <div className="flex min-h-screen flex-col gap-6 bg-background p-4 text-foreground md:p-6">
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex max-w-3xl flex-col gap-1">
          <h1 className="font-heading text-2xl font-semibold tracking-tight">{t.title}</h1>
          <p className="text-sm text-muted-foreground">{t.intro}</p>
        </div>
        {confirmingReset ? (
          <div className="flex flex-wrap items-center gap-2 rounded-lg border p-2">
            <span className="text-sm">{t.resetConfirm}</span>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => {
                reset();
                setConfirmingReset(false);
              }}
            >
              {t.resetConfirmYes}
            </Button>
            <Button variant="outline" size="sm" onClick={() => setConfirmingReset(false)}>
              {t.cancel}
            </Button>
          </div>
        ) : (
          <Button variant="outline" onClick={() => setConfirmingReset(true)}>
            <RotateCcwIcon />
            {t.reset}
          </Button>
        )}
      </header>

      <div className="grid gap-6 lg:grid-cols-[minmax(20rem,26rem)_minmax(0,1fr)]">
        <div className="flex min-w-0 flex-col gap-4">
          <ColorsSection {...sectionProps} />
          <OverridesSection {...sectionProps} theme={theme} contrast={contrast} />
          <TypographyLink t={t} />
          <ShadowsSpacingSection {...sectionProps} />
          <ImportSection {...sectionProps} />
          <ExportSection {...sectionProps} css={css} contrast={contrast} />
        </div>

        <div className="flex min-w-0 flex-col gap-4">
          <ContrastSummary contrast={contrast} t={t} />
          <section aria-label={t.preview} className="grid gap-4 xl:grid-cols-2">
            <PreviewFrame mode="light" title={t.previewLight} css={frameCss}>
              <PreviewSample />
            </PreviewFrame>
            <PreviewFrame mode="dark" title={t.previewDark} css={frameCss}>
              <PreviewSample />
            </PreviewFrame>
          </section>
        </div>
      </div>
    </div>
  );
}
