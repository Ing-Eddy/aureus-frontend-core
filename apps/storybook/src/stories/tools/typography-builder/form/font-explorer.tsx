import { Button } from "@aureus-core/ui/shadcn/button";
import { Field, FieldGroup, FieldLabel } from "@aureus-core/ui/shadcn/field";
import { Input } from "@aureus-core/ui/shadcn/input";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { useEffect, useId, useMemo, useState } from "react";
import { SelectField } from "../../shared/form";
import { fill } from "../../shared/i18n";
import {
  type CatalogFont,
  type FontCategory,
  fontCatalog,
  fontCategories,
} from "../core/font-catalog";
import { webFontStack } from "../core/font-stack";
import { catalogFontsUrl } from "../core/google-fonts-url";
import type { FontRole } from "../core/typography-types";
import { categoryLabel } from "./fonts-section";
import { Section, type SectionProps } from "./section";

export const explorerPageSize = 6;
const waterfallSizes = [12, 16, 20, 28, 40] as const;
const weights = [100, 200, 300, 400, 500, 600, 700, 800, 900] as const;

type CategoryFilter = "all" | FontCategory;
type AxisFilter = "all" | "variable" | "static";

/** Loads one page of explorer fonts from Google Fonts into the builder's own document. */
function useExplorerFonts(fonts: readonly CatalogFont[]) {
  const url = catalogFontsUrl(fonts);
  useEffect(() => {
    const head = document.head;
    const existing = head.querySelector<HTMLLinkElement>("link[data-explorer-fonts]");
    if (!url) {
      existing?.remove();
      return;
    }
    const link = existing ?? document.createElement("link");
    link.rel = "stylesheet";
    link.href = url;
    link.setAttribute("data-explorer-fonts", "");
    if (!existing) head.append(link);
  }, [url]);
}

const stackOf = (font: CatalogFont) => webFontStack(font.family, font.variable, font.fallback);

/** Try catalog fonts with your own text, then assign them to a role (spec: font explorer). */
export function FontExplorer({ dispatch, t }: Pick<SectionProps, "dispatch" | "t">) {
  const id = useId();
  const [category, setCategory] = useState<CategoryFilter>("all");
  const [axis, setAxis] = useState<AxisFilter>("all");
  const [sample, setSample] = useState("");
  const [weight, setWeight] = useState(400);
  const [page, setPage] = useState(0);
  const [focused, setFocused] = useState<string>();
  const categories = categoryLabel(t);
  const text = sample || t.explorerSampleDefault;

  const matches = useMemo(
    () =>
      fontCatalog.filter(
        (font) =>
          (category === "all" || font.category === category) &&
          (axis === "all" || font.variable === (axis === "variable")),
      ),
    [category, axis],
  );
  const pages = Math.max(1, Math.ceil(matches.length / explorerPageSize));
  const current = Math.min(page, pages - 1);
  const shown = matches.slice(current * explorerPageSize, (current + 1) * explorerPageSize);
  const focus = shown.find((font) => font.id === focused) ?? shown[0];
  useExplorerFonts(shown);

  const use = (role: FontRole, font: CatalogFont) =>
    dispatch({ type: "font", role, choice: { kind: "catalog", id: font.id } });
  const roleButtons = (font: CatalogFont): [FontRole, string][] => [
    ["sans", t.useText],
    ["heading", t.useHeading],
    ...(font.fallback === "serif" ? ([["serif", t.useSerif]] as [FontRole, string][]) : []),
    ...(font.fallback === "mono" ? ([["mono", t.useMono]] as [FontRole, string][]) : []),
  ];

  return (
    <Section title={t.sectionExplorer}>
      <p className="text-sm text-muted-foreground">{t.explorerHelp}</p>
      <FieldGroup className="grid gap-4 sm:grid-cols-2">
        <SelectField<CategoryFilter>
          label={t.explorerCategory}
          value={category}
          options={[
            { value: "all", label: t.explorerAll },
            ...fontCategories.map((value) => ({ value, label: categories[value] })),
          ]}
          onChange={(value) => {
            setCategory(value);
            setPage(0);
          }}
        />
        <SelectField<AxisFilter>
          label={t.explorerAxis}
          value={axis}
          options={[
            { value: "all", label: t.explorerAll },
            { value: "variable", label: t.explorerVariable },
            { value: "static", label: t.explorerStatic },
          ]}
          onChange={(value) => {
            setAxis(value);
            setPage(0);
          }}
        />
        <Field className="sm:col-span-2">
          <FieldLabel htmlFor={`${id}-sample`}>{t.explorerSample}</FieldLabel>
          <Input
            id={`${id}-sample`}
            value={sample}
            placeholder={t.explorerSampleDefault}
            onChange={(event) => setSample(event.target.value)}
          />
        </Field>
        <SelectField
          label={t.explorerWeight}
          value={String(weight)}
          options={weights.map((value) => ({ value: String(value), label: String(value) }))}
          onChange={(value) => setWeight(Number(value))}
        />
      </FieldGroup>

      {focus ? (
        <figure
          aria-label={fill(t.explorerWaterfall, { family: focus.family })}
          className="flex flex-col gap-1 overflow-hidden rounded-lg border p-3"
          data-testid="explorer-waterfall"
        >
          {waterfallSizes.map((size) => (
            <p
              key={size}
              className="truncate"
              style={{ fontFamily: stackOf(focus), fontSize: size, fontWeight: weight }}
            >
              <span className="me-2 font-sans text-xs text-muted-foreground tabular-nums">
                {size}
              </span>
              {text}
            </p>
          ))}
        </figure>
      ) : null}

      <p aria-live="polite" className="text-sm text-muted-foreground">
        {matches.length
          ? fill(t.explorerCount, { shown: shown.length, total: matches.length })
          : t.explorerEmpty}
      </p>
      <ul className="flex flex-col gap-3" data-testid="explorer-list">
        {shown.map((font) => (
          <li
            key={font.id}
            className="flex flex-col gap-2 rounded-lg border p-3"
            data-font={font.id}
          >
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <span className="font-medium text-sm">{font.family}</span>
              <span className="text-xs text-muted-foreground">
                {categories[font.category]} ·{" "}
                {font.variable
                  ? fill(t.explorerVariableRange, {
                      min: font.weights[0] ?? 400,
                      max: font.weights[font.weights.length - 1] ?? 400,
                    })
                  : fill(t.explorerWeights, { weights: font.weights.join(", ") })}
              </span>
            </div>
            <p
              className="break-words text-2xl leading-snug"
              style={{ fontFamily: stackOf(font), fontWeight: weight }}
            >
              {text}
            </p>
            <div className="flex flex-wrap gap-2">
              <Button
                size="sm"
                variant="ghost"
                aria-pressed={focus?.id === font.id}
                aria-label={fill(t.explorerFocus, { family: font.family })}
                onClick={() => setFocused(font.id)}
              >
                {t.explorerWaterfallButton}
              </Button>
              {roleButtons(font).map(([role, label]) => (
                <Button
                  key={role}
                  size="sm"
                  variant="outline"
                  aria-label={fill(t.explorerUseAs, { role: label, family: font.family })}
                  onClick={() => use(role, font)}
                >
                  {label}
                </Button>
              ))}
            </div>
          </li>
        ))}
      </ul>
      {pages > 1 ? (
        <nav aria-label={t.sectionExplorer} className="flex items-center justify-between gap-2">
          <Button
            size="icon-sm"
            variant="outline"
            aria-label={t.explorerPrevious}
            disabled={current === 0}
            onClick={() => setPage(current - 1)}
          >
            <ChevronLeftIcon />
          </Button>
          <span className="text-sm tabular-nums">
            {fill(t.explorerPage, { page: current + 1, pages })}
          </span>
          <Button
            size="icon-sm"
            variant="outline"
            aria-label={t.explorerNext}
            disabled={current >= pages - 1}
            onClick={() => setPage(current + 1)}
          >
            <ChevronRightIcon />
          </Button>
        </nav>
      ) : null}
    </Section>
  );
}
