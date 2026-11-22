import { ToggleGroup, ToggleGroupItem } from "@aureus-core/ui/shadcn/toggle-group";
import { useMemo, useState } from "react";
import { fill } from "../../shared/i18n";
import { PreviewFrame, type PreviewMode } from "../../shared/preview";
import { googleFontsUrl } from "../core/google-fonts-url";
import type { ResolvedTypography } from "../core/typography-types";
import type { TypographyBuilderStrings } from "../i18n/typography-builder-strings";
import { ArticleSample } from "./article-sample";
import { previewCss } from "./preview-css";
import { SpecimenSample } from "./specimen-sample";
import { UiSample } from "./ui-sample";

export type PreviewView = "specimen" | "article" | "ui";
/** `0` fills the column; the others are fixed frame widths for checking fluid sizes. */
export const previewWidths = [0, 360, 768, 1280] as const;
export type PreviewWidth = (typeof previewWidths)[number];

interface TypographyPreviewProps {
  typography: ResolvedTypography;
  t: TypographyBuilderStrings;
}

/** One isolated frame with three views, a color mode and a width selector (design D8). */
export function TypographyPreview({ typography, t }: TypographyPreviewProps) {
  const [view, setView] = useState<PreviewView>("specimen");
  const [mode, setMode] = useState<PreviewMode>("light");
  const [width, setWidth] = useState<PreviewWidth>(0);
  const css = useMemo(() => previewCss(typography), [typography]);
  const fontsUrl = googleFontsUrl(typography.fonts);
  const version = `${css}|${width}|${fontsUrl ?? ""}`;
  const widthText = (value: PreviewWidth) =>
    value ? fill(t.widthLabel, { width: value }) : t.widthFit;

  return (
    <section aria-label={t.preview} className="flex min-w-0 flex-col gap-3">
      <div className="flex flex-wrap items-center gap-3">
        <ToggleGroup
          type="single"
          variant="outline"
          size="sm"
          aria-label={t.preview}
          value={view}
          onValueChange={(next) => next && setView(next as PreviewView)}
        >
          <ToggleGroupItem value="specimen">{t.viewSpecimen}</ToggleGroupItem>
          <ToggleGroupItem value="article">{t.viewArticle}</ToggleGroupItem>
          <ToggleGroupItem value="ui">{t.viewUi}</ToggleGroupItem>
        </ToggleGroup>
        <ToggleGroup
          type="single"
          variant="outline"
          size="sm"
          aria-label={t.previewMode}
          value={mode}
          onValueChange={(next) => next && setMode(next as PreviewMode)}
        >
          <ToggleGroupItem value="light">{t.modeLight}</ToggleGroupItem>
          <ToggleGroupItem value="dark">{t.modeDark}</ToggleGroupItem>
        </ToggleGroup>
        <ToggleGroup
          type="single"
          variant="outline"
          size="sm"
          aria-label={t.previewWidth}
          value={String(width)}
          onValueChange={(next) => next && setWidth(Number(next) as PreviewWidth)}
        >
          {previewWidths.map((value) => (
            <ToggleGroupItem key={value} value={String(value)}>
              {widthText(value)}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
      </div>
      <PreviewFrame
        mode={mode}
        title={fill(t.previewFrame, {
          mode: mode === "dark" ? t.modeDark : t.modeLight,
          width: widthText(width),
        })}
        css={css}
        fontsUrl={fontsUrl}
        width={width || undefined}
      >
        <div className="min-h-full bg-background p-6 text-foreground">
          {view === "specimen" ? <SpecimenSample version={version} /> : null}
          {view === "article" ? <ArticleSample /> : null}
          {view === "ui" ? <UiSample /> : null}
        </div>
      </PreviewFrame>
    </section>
  );
}
