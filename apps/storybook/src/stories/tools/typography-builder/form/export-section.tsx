import { Button } from "@aureus-core/ui/shadcn/button";
import { Field, FieldDescription, FieldGroup, FieldLabel } from "@aureus-core/ui/shadcn/field";
import { Input } from "@aureus-core/ui/shadcn/input";
import { CheckIcon, CopyIcon, DownloadIcon } from "lucide-react";
import { useId, useRef } from "react";
import { downloadCss, useCopy } from "../../shared/export";
import { fill } from "../../shared/i18n";
import { toFileName } from "../../shared/utils";
import { defaultTypographyName } from "../core/default-typography";
import { InstallPanel } from "./install-panel";
import { Section, type SectionProps } from "./section";

interface ExportSectionProps extends SectionProps {
  css: string;
  install: string | undefined;
  unverified: readonly string[];
}

/** Name, download, copy, code view and install command (spec: Typography export). */
export function ExportSection({
  draft,
  dispatch,
  t,
  css,
  install,
  unverified,
}: ExportSectionProps) {
  const id = useId();
  const codeRef = useRef<HTMLPreElement>(null);
  const { state: copy, copy: copyCss } = useCopy(css, codeRef);
  const fileName = toFileName(draft.name, defaultTypographyName);

  return (
    <Section title={t.sectionExport}>
      <FieldGroup>
        <Field>
          <FieldLabel htmlFor={`${id}-name`}>{t.typographyName}</FieldLabel>
          <Input
            id={`${id}-name`}
            value={draft.name}
            maxLength={60}
            aria-describedby={`${id}-file`}
            onChange={(event) => dispatch({ type: "name", name: event.target.value })}
          />
          <FieldDescription id={`${id}-file`}>
            {fill(t.typographyNameHelp, { file: fileName })}
          </FieldDescription>
        </Field>
      </FieldGroup>

      <InstallPanel command={install} unverified={unverified} t={t} />

      <p className="text-sm text-muted-foreground">{t.exportHelp}</p>
      <div className="flex flex-wrap gap-2">
        <Button onClick={() => downloadCss(css, fileName)}>
          <DownloadIcon />
          {t.download}
        </Button>
        <Button variant="outline" onClick={copyCss}>
          {copy === "copied" ? <CheckIcon /> : <CopyIcon />}
          {copy === "copied" ? t.copied : t.copy}
        </Button>
      </div>
      <p aria-live="polite" className="text-sm text-muted-foreground empty:hidden">
        {copy === "failed" ? t.copyFailed : copy === "copied" ? t.copied : ""}
      </p>

      <section aria-label={t.code}>
        <pre
          ref={codeRef}
          // biome-ignore lint/a11y/noNoninteractiveTabindex: a scrollable region must be keyboard-reachable.
          tabIndex={0}
          data-testid="export-code"
          className="max-h-96 overflow-auto rounded-lg border bg-muted p-3 font-mono text-xs leading-relaxed text-foreground focus-visible:outline-2 focus-visible:outline-ring"
        >
          <code>{css}</code>
        </pre>
      </section>
    </Section>
  );
}
