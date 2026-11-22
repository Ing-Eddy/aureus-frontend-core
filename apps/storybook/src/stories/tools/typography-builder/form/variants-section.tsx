import { typographyVariants } from "@aureus-core/ui/components/typography";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@aureus-core/ui/shadcn/accordion";
import { Badge } from "@aureus-core/ui/shadcn/badge";
import { fill } from "../../shared/i18n";
import { formatNumber, formatSize } from "../core/fluid-size";
import type { ResolvedTypography } from "../core/typography-types";
import { Section, type SectionProps } from "./section";
import { VariantEditor } from "./variant-editor";

/** Every variant's six properties (spec: Per-variant overrides). */
export function VariantsSection({
  draft,
  dispatch,
  t,
  typography,
}: SectionProps & { typography: ResolvedTypography }) {
  return (
    <Section title={t.sectionVariants}>
      <p className="text-sm text-muted-foreground">{t.variantsHelp}</p>
      <Accordion type="multiple" className="rounded-lg border">
        {typographyVariants.map((variant) => {
          const style = typography.variants[variant];
          const count = Object.keys(draft.overrides[variant] ?? {}).length;
          return (
            <AccordionItem key={variant} value={variant} data-testid={`variant-${variant}`}>
              <AccordionTrigger className="px-3">
                <span className="flex min-w-0 flex-1 flex-wrap items-baseline gap-x-3 gap-y-1">
                  <code className="font-mono text-sm">{variant}</code>
                  <span className="text-xs font-normal text-muted-foreground tabular-nums">
                    {fill(t.variantSummary, {
                      size: formatSize(style.size),
                      lineHeight:
                        style.lineHeight === "inherit" ? "inherit" : formatNumber(style.lineHeight),
                      weight: style.weight,
                    })}
                  </span>
                  {count ? (
                    <Badge variant="secondary">{fill(t.variantOverridden, { count })}</Badge>
                  ) : null}
                </span>
              </AccordionTrigger>
              <AccordionContent className="px-3">
                <VariantEditor
                  variant={variant}
                  style={style}
                  overridden={draft.overrides[variant]}
                  scale={draft.scale}
                  dispatch={dispatch}
                  t={t}
                />
              </AccordionContent>
            </AccordionItem>
          );
        })}
      </Accordion>
    </Section>
  );
}
