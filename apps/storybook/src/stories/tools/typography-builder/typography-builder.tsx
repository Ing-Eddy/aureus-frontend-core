import { Button } from "@aureus-core/ui/shadcn/button";
import type { Locale } from "@sb/i18n/locale-types";
import { RotateCcwIcon } from "lucide-react";
import { useMemo, useState } from "react";
import { browserStorage, type DraftStorage } from "../shared/storage";
import { installCommand, unverifiedPackages } from "./core/install-command";
import { checkReadability } from "./core/readability-checks";
import { resolveTypography } from "./core/resolve-typography";
import { serializeTypography } from "./core/serialize-typography";
import {
  ExportSection,
  FontExplorer,
  FontsSection,
  ImportSection,
  PairingsSection,
  ReadabilitySummary,
  ScaleSection,
  TrackingSection,
  VariantsSection,
} from "./form";
import { typographyBuilderStrings } from "./i18n/typography-builder-strings";
import { TypographyPreview } from "./preview/typography-preview";
import { useTypographyDraft } from "./use-typography-draft";

export interface TypographyBuilderProps {
  locale: Locale;
  /** Where the draft is kept; defaults to `localStorage`. */
  storage?: DraftStorage;
}

/**
 * The typography builder page (spec: typography-builder). The draft is the single source of truth;
 * the preview, the checks, the code view, the download and the install command all read
 * `resolveTypography(draft)`.
 */
export function TypographyBuilder({ locale, storage = browserStorage() }: TypographyBuilderProps) {
  const t = typographyBuilderStrings[locale];
  const { draft, dispatch, reset } = useTypographyDraft(storage);
  const [confirmingReset, setConfirmingReset] = useState(false);

  const typography = useMemo(() => resolveTypography(draft), [draft]);
  const issues = useMemo(() => checkReadability(typography), [typography]);
  const css = useMemo(() => serializeTypography(typography), [typography]);
  const install = installCommand(typography);
  const unverified = unverifiedPackages(typography);
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

      <div className="grid gap-6 lg:grid-cols-[minmax(20rem,28rem)_minmax(0,1fr)]">
        <div className="flex min-w-0 flex-col gap-4">
          <PairingsSection {...sectionProps} />
          <FontsSection {...sectionProps} />
          <FontExplorer dispatch={dispatch} t={t} />
          <ScaleSection {...sectionProps} />
          <TrackingSection {...sectionProps} />
          <VariantsSection {...sectionProps} typography={typography} />
          <ImportSection {...sectionProps} />
          <ExportSection {...sectionProps} css={css} install={install} unverified={unverified} />
        </div>

        <div className="flex min-w-0 flex-col gap-4 lg:sticky lg:top-4 lg:self-start">
          <ReadabilitySummary issues={issues} t={t} />
          <TypographyPreview typography={typography} t={t} />
        </div>
      </div>
    </div>
  );
}
