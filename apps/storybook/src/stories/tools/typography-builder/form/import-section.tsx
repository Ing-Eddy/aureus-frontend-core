import { Alert, AlertDescription } from "@aureus-core/ui/shadcn/alert";
import { Button } from "@aureus-core/ui/shadcn/button";
import { Field, FieldDescription, FieldGroup, FieldLabel } from "@aureus-core/ui/shadcn/field";
import { Input } from "@aureus-core/ui/shadcn/input";
import { Textarea } from "@aureus-core/ui/shadcn/textarea";
import { useId, useState } from "react";
import { fill } from "../../shared/i18n";
import {
  importTypography,
  parseTypographyCss,
  type TypographyImportReport,
} from "../core/parse-typography";
import { Section, type SectionProps } from "./section";

type Outcome = { ok: true; report: TypographyImportReport } | { ok: false } | undefined;

/** Paste or choose a file exported earlier (spec: Import typography). */
export function ImportSection({ draft, dispatch, t }: SectionProps) {
  const id = useId();
  const [css, setCss] = useState("");
  const [outcome, setOutcome] = useState<Outcome>();

  const run = (source: string) => {
    const result = importTypography(draft, parseTypographyCss(source));
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
          <FieldLabel htmlFor={`${id}-css`}>{t.importLabel}</FieldLabel>
          <Textarea
            id={`${id}-css`}
            value={css}
            spellCheck={false}
            rows={6}
            placeholder=":root { --typography-body-size: 1rem; }"
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
          {t.importPasted}
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
