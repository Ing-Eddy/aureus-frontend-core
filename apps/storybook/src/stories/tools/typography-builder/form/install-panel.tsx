import { Alert, AlertDescription } from "@aureus-core/ui/shadcn/alert";
import { Button } from "@aureus-core/ui/shadcn/button";
import { CheckIcon, CopyIcon, TriangleAlertIcon } from "lucide-react";
import { useRef } from "react";
import { useCopy } from "../../shared/export";
import { fill } from "../../shared/i18n";
import type { TypographyBuilderStrings } from "../i18n/typography-builder-strings";

/** The `pnpm add` command for the fonts, with unverified packages flagged (spec: Typography export). */
export function InstallPanel({
  command,
  unverified,
  t,
}: {
  command: string | undefined;
  unverified: readonly string[];
  t: TypographyBuilderStrings;
}) {
  const codeRef = useRef<HTMLPreElement>(null);
  const { state, copy } = useCopy(command ?? "", codeRef);
  return (
    <section aria-label={t.install} className="flex flex-col gap-2" data-testid="install-panel">
      <h3 className="text-sm font-medium">{t.install}</h3>
      {command ? (
        <>
          <div className="flex items-start gap-2">
            <pre
              ref={codeRef}
              data-testid="install-command"
              className="min-w-0 flex-1 whitespace-pre-wrap break-all rounded-lg border bg-muted p-3 font-mono text-xs text-foreground"
            >
              <code>{command}</code>
            </pre>
            <Button
              size="icon-sm"
              variant="outline"
              aria-label={state === "copied" ? t.copied : t.installCopy}
              onClick={copy}
            >
              {state === "copied" ? <CheckIcon /> : <CopyIcon />}
            </Button>
          </div>
          {state === "failed" ? (
            <p aria-live="polite" className="text-sm text-muted-foreground">
              {t.copyFailed}
            </p>
          ) : null}
          {unverified.length ? (
            <Alert data-testid="install-unverified">
              <TriangleAlertIcon />
              <AlertDescription>
                {fill(t.installUnverified, { list: unverified.join(", ") })}
              </AlertDescription>
            </Alert>
          ) : null}
        </>
      ) : (
        <p className="text-sm text-muted-foreground" data-testid="install-command">
          {t.installNone}
        </p>
      )}
    </section>
  );
}
