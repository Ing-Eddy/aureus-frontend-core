import { Alert, AlertDescription } from "@aureus-core/ui/shadcn/alert";
import { Button } from "@aureus-core/ui/shadcn/button";
import { Field, FieldDescription, FieldGroup, FieldLabel } from "@aureus-core/ui/shadcn/field";
import { Input } from "@aureus-core/ui/shadcn/input";
import { CheckIcon, CopyIcon, DownloadIcon, TriangleAlertIcon } from "lucide-react";
import { useEffect, useId, useRef, useState } from "react";
import { type ContrastResult, failingPairs } from "../core/contrast";
import { toFileName } from "../core/serialize-theme";
import { fill } from "../i18n/theme-builder-strings";
import { describeFailure } from "./contrast-summary";
import { Section, type SectionProps } from "./section";

interface ExportSectionProps extends SectionProps {
  css: string;
  contrast: readonly ContrastResult[];
}

/** Saves the CSS through a temporary object URL; nothing is sent anywhere (design D7). */
export function downloadCss(css: string, fileName: string) {
  const url = URL.createObjectURL(new Blob([css], { type: "text/css" }));
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  link.rel = "noopener";
  document.body.append(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 0);
}

export function ExportSection({ draft, dispatch, t, css, contrast }: ExportSectionProps) {
  const id = useId();
  const codeRef = useRef<HTMLPreElement>(null);
  const [copy, setCopy] = useState<"idle" | "copied" | "failed">("idle");
  const fileName = toFileName(draft.name);
  const failing = failingPairs(contrast);

  useEffect(() => {
    if (copy !== "copied") return;
    const timer = setTimeout(() => setCopy("idle"), 2000);
    return () => clearTimeout(timer);
  }, [copy]);

  const copyCss = async () => {
    try {
      await navigator.clipboard.writeText(css);
      setCopy("copied");
    } catch {
      // Clipboard blocked (permissions, insecure context): select the code for a manual copy.
      const code = codeRef.current;
      const selection = code ? getSelection() : null;
      if (code && selection) {
        const range = document.createRange();
        range.selectNodeContents(code);
        selection.removeAllRanges();
        selection.addRange(range);
        code.focus();
      }
      setCopy("failed");
    }
  };

  return (
    <Section title={t.sectionExport}>
      <FieldGroup>
        <Field>
          <FieldLabel htmlFor={`${id}-name`}>{t.themeName}</FieldLabel>
          <Input
            id={`${id}-name`}
            value={draft.name}
            maxLength={60}
            aria-describedby={`${id}-file`}
            onChange={(event) => dispatch({ type: "name", name: event.target.value })}
          />
          <FieldDescription id={`${id}-file`}>
            {fill(t.themeNameHelp, { file: fileName })}
          </FieldDescription>
        </Field>
      </FieldGroup>

      {failing.length ? (
        <Alert variant="destructive" data-testid="export-warning">
          <TriangleAlertIcon />
          <AlertDescription>
            {fill(t.exportWarning, {
              list: failing.map((result) => describeFailure(result, t)).join("; "),
            })}
          </AlertDescription>
        </Alert>
      ) : null}

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
