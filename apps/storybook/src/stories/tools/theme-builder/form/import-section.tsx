import { Alert, AlertDescription } from "@aureus-core/ui/shadcn/alert";
import { Button } from "@aureus-core/ui/shadcn/button";
import { Field, FieldDescription, FieldGroup, FieldLabel } from "@aureus-core/ui/shadcn/field";
import { Input } from "@aureus-core/ui/shadcn/input";
import { Textarea } from "@aureus-core/ui/shadcn/textarea";
import { useId, useState } from "react";
import { type ImportReport, importTheme, parseThemeCss } from "../core/parse-theme";
import { fill } from "../i18n/theme-builder-strings";
import { Section, type SectionProps } from "./section";

type Outcome = { ok: true; report: ImportReport } | { ok: false } | undefined;

/** Paste or upload a shadcn theme to keep editing it (spec: Import an existing theme). */
export function ImportSection({ draft, dispatch, t }: SectionProps) {
  const id = useId();
  const [css, setCss] = useState("");
  const [outcome, setOutcome] = useState<Outcome>();

  const run = (source: string) => {
    const result = importTheme(draft, parseThemeCss(source));
    if (result.ok) {
      dispatch({ type: "replace", draft: result.draft });
      setOutcome({ ok: true, report: result.report });
    } else {
      setOutcome({ ok: false });
    }
  };

  return (
    <Section title={t.sectionImport}>
      <p className="text-sm text-muted-foreground">{t.importHelp}</p>
      <FieldGroup>
        <Field>
          <FieldLabel htmlFor={`${id}-css`}>{t.importPaste}</FieldLabel>
          <Textarea
            id={`${id}-css`}
            value={css}
            spellCheck={false}
            rows={6}
            placeholder=":root { --primary: oklch(…); }"
            onChange={(event) => setCss(event.target.value)}
            className="font-mono text-xs"
          />
        </Field>
        <Button
          variant="secondary"
          className="self-start"
          disabled={!css.trim()}
          onClick={() => run(css)}
        >
          {t.importButton}
        </Button>
        <Field>
          <FieldLabel htmlFor={`${id}-file`}>{t.importFile}</FieldLabel>
          <Input
            id={`${id}-file`}
            type="file"
            accept=".css,text/css"
            onChange={async (event) => {
              const file = event.target.files?.[0];
              event.target.value = "";
              if (file) run(await file.text());
            }}
          />
        </Field>
      </FieldGroup>
      <div aria-live="polite" data-testid="import-report">
        {outcome?.ok === false ? (
          <Alert variant="destructive">
            <AlertDescription>{t.importError}</AlertDescription>
          </Alert>
        ) : null}
        {outcome?.ok ? (
          <Alert>
            <AlertDescription className="flex flex-col gap-1">
              <p>{fill(t.importOk, { count: outcome.report.imported })}</p>
              {outcome.report.missing.length ? (
                <FieldDescription>
                  {fill(t.importMissing, { list: outcome.report.missing.join(", ") })}
                </FieldDescription>
              ) : null}
              {outcome.report.ignored.length ? (
                <FieldDescription>
                  {fill(t.importIgnored, { list: outcome.report.ignored.join(", ") })}
                </FieldDescription>
              ) : null}
            </AlertDescription>
          </Alert>
        ) : null}
      </div>
    </Section>
  );
}
