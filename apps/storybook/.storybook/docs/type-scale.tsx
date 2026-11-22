import {
  Typography,
  type TypographyVariant,
  typographyVariants,
} from "@aureus-core/ui/components/typography";
import { useEffect, useRef, useState } from "react";

/** Size in px, line height as a ratio and weight, read from the rendered element. */
function readMetrics(element: HTMLElement): string {
  const style = getComputedStyle(element);
  const size = Number.parseFloat(style.fontSize);
  const lineHeight = Number.parseFloat(style.lineHeight);
  const ratio = Number.isNaN(lineHeight)
    ? style.lineHeight
    : String(Math.round((lineHeight / size) * 100) / 100);
  return `${Math.round(size * 100) / 100}px · ${ratio} · ${style.fontWeight}`;
}

function Row({ variant, sample }: { variant: TypographyVariant; sample: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [metrics, setMetrics] = useState("");

  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    const update = () => setMetrics(readMetrics(element));
    update();
    // Fluid sizes change with the width; fonts change metrics once they load.
    const observer = new ResizeObserver(update);
    observer.observe(element);
    document.fonts?.ready.then(update);
    return () => observer.disconnect();
  }, []);

  return (
    <div style={{ display: "flex", alignItems: "baseline", gap: "1.5rem", minWidth: 0 }}>
      <code
        style={{
          flexShrink: 0,
          width: "11rem",
          fontSize: "0.75rem",
          color: "var(--muted-foreground)",
        }}
      >
        {variant}
        <br />
        {metrics}
      </code>
      <Typography
        ref={ref}
        variant={variant}
        as="div"
        truncate
        style={{ color: "var(--foreground)", minWidth: 0 }}
      >
        {variant === "code" ? "pnpm add @aureus-core/ui" : sample}
      </Typography>
    </div>
  );
}

/**
 * The package's typography catalog in its real styles, with the computed metrics of each variant.
 * It replaces Storybook's Typeset block, whose labels are hard-coded at 40% opacity in dark docs
 * (3.66:1, below WCAG AA). Colors come from the package tokens, so the specimen follows the theme
 * toolbar, and the metrics follow any override of the `--typography-*` variables.
 */
export function TypeScale({ sample }: { sample: string }) {
  return (
    <div style={{ display: "grid", gap: "1rem", margin: "1.5rem 0" }}>
      {typographyVariants.map((variant) => (
        <Row key={variant} variant={variant} sample={sample} />
      ))}
    </div>
  );
}
