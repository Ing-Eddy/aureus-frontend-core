import { Alert, AlertDescription, AlertTitle } from "@aureus-core/ui/shadcn/alert";
import { CircleCheckIcon, TriangleAlertIcon } from "lucide-react";
import { type ContrastResult, failingPairs } from "../core/contrast";
import { type Mode, modes } from "../core/theme-types";
import { fill, type ThemeBuilderStrings } from "../i18n/theme-builder-strings";

/** `--muted-foreground on --muted (light) 3.2:1` */
export function describeFailure(result: ContrastResult, t: ThemeBuilderStrings): string {
  const mode = result.mode === "light" ? t.light : t.dark;
  const pair = fill(t.contrastPair, {
    foreground: `--${result.pair.foreground}`,
    surface: `--${result.pair.surface}`,
  });
  return `${pair} (${mode.toLowerCase()}) ${fill(t.ratio, { ratio: result.ratio })}`;
}

/** Live WCAG AA summary of every text pair (spec: Contrast validation). */
export function ContrastSummary({
  contrast,
  t,
}: {
  contrast: readonly ContrastResult[];
  t: ThemeBuilderStrings;
}) {
  const failing = failingPairs(contrast);
  const modeLabel: Record<Mode, string> = { light: t.light, dark: t.dark };
  return (
    <section aria-label={t.contrastTitle} aria-live="polite" data-testid="contrast-summary">
      {failing.length === 0 ? (
        <Alert>
          <CircleCheckIcon />
          <AlertTitle>{t.contrastTitle}</AlertTitle>
          <AlertDescription>{t.contrastPass}</AlertDescription>
        </Alert>
      ) : (
        <Alert variant="destructive">
          <TriangleAlertIcon />
          <AlertTitle>{t.contrastTitle}</AlertTitle>
          <AlertDescription>
            <p>{fill(t.contrastFail, { count: failing.length })}</p>
            {modes.map((mode) => {
              const inMode = failing.filter((result) => result.mode === mode);
              if (inMode.length === 0) return null;
              return (
                <div key={mode} data-mode={mode}>
                  <p className="font-medium">{modeLabel[mode]}</p>
                  <ul className="ml-4 list-disc">
                    {inMode.map((result) => (
                      <li key={result.pair.id} data-pair={result.pair.id}>
                        {fill(t.contrastPair, {
                          foreground: `--${result.pair.foreground}`,
                          surface: `--${result.pair.surface}`,
                        })}
                        : {fill(t.ratio, { ratio: result.ratio })}
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </AlertDescription>
        </Alert>
      )}
    </section>
  );
}
