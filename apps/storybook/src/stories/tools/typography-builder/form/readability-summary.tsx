import { Alert, AlertDescription, AlertTitle } from "@aureus-core/ui/shadcn/alert";
import { CircleCheckIcon, TriangleAlertIcon } from "lucide-react";
import { fill } from "../../shared/i18n";
import type { ReadabilityCheck, ReadabilityIssue } from "../core/readability-checks";
import type { TypographyBuilderStrings } from "../i18n/typography-builder-strings";

const messageKey: Record<ReadabilityCheck, keyof TypographyBuilderStrings> = {
  "body-too-small": "checkBodyTooSmall",
  "line-height-tight": "checkLineHeightTight",
  "heading-order": "checkHeadingOrder",
  "weight-unavailable": "checkWeightUnavailable",
  "fluid-without-rem": "checkFluidWithoutRem",
};

export const describeIssue = (issue: ReadabilityIssue, t: TypographyBuilderStrings) =>
  fill(t[messageKey[issue.check]], { variant: issue.variant, value: issue.value });

/** Non-blocking warnings, updated on every change (spec: Readability checks). */
export function ReadabilitySummary({
  issues,
  t,
}: {
  issues: readonly ReadabilityIssue[];
  t: TypographyBuilderStrings;
}) {
  return (
    <section aria-label={t.sectionChecks} aria-live="polite" data-testid="readability-summary">
      {issues.length ? (
        <Alert>
          <TriangleAlertIcon />
          <AlertTitle>{fill(t.checksCount, { count: issues.length })}</AlertTitle>
          <AlertDescription>
            <ul className="list-disc ps-4">
              {issues.map((issue) => (
                <li key={`${issue.check}-${issue.variant}`}>{describeIssue(issue, t)}</li>
              ))}
            </ul>
          </AlertDescription>
        </Alert>
      ) : (
        <Alert>
          <CircleCheckIcon />
          <AlertTitle>{t.checksPass}</AlertTitle>
        </Alert>
      )}
    </section>
  );
}
