import {
  Typography,
  type TypographyVariant,
  typographyVariants,
} from "@aureus-core/ui/components/typography";
import { useRef } from "react";
import { useMetrics } from "./metrics";

const sample = "Sphinx of black quartz, judge my vow";

function Row({ variant, version }: { variant: TypographyVariant; version: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const metrics = useMetrics(ref, version);
  return (
    <div className="grid gap-1 border-b pb-4 last:border-b-0 sm:grid-cols-[10rem_minmax(0,1fr)] sm:items-baseline sm:gap-6">
      <div className="flex flex-col font-mono text-xs">
        <span>{variant}</span>
        <span className="text-muted-foreground tabular-nums" data-testid={`metrics-${variant}`}>
          {metrics}
        </span>
      </div>
      <Typography ref={ref} variant={variant} as="div" className="min-w-0 break-words">
        {variant === "code" ? "pnpm add @aureus-core/ui" : sample}
      </Typography>
    </div>
  );
}

/** Every variant with its computed metrics (spec: Live typography preview, Specimen). */
export function SpecimenSample({ version }: { version: string }) {
  return (
    <div className="grid gap-4">
      {typographyVariants.map((variant) => (
        <Row key={variant} variant={variant} version={version} />
      ))}
    </div>
  );
}
