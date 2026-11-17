import { cn } from "@/shadcn/lib/utils";

export interface SliderHeaderValueProps {
  text: string;
  className?: string;
}

/**
 * The formatted value (or range) at the end of the label row. Decorative: each thumb announces
 * its value text, so reading it again would repeat it.
 */
export function SliderHeaderValue({ text, className }: SliderHeaderValueProps) {
  return (
    <span
      aria-hidden="true"
      data-slot="slider-value"
      className={cn("text-sm text-muted-foreground tabular-nums", className)}
    >
      {text}
    </span>
  );
}
