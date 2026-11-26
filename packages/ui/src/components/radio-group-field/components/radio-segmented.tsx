import { RadioGroup as RadioGroupPrimitive } from "radix-ui";
import type { MouseEvent, ReactNode } from "react";
import { cn } from "@/shadcn/lib/utils";

/** Classes of the segmented appearance. Arbitrary `data-[state=…]` variants on purpose (see shadcn's strict ones). */
export const segmentedStyles = {
  track: "flex w-full gap-[3px] rounded-lg bg-muted p-[3px]",
  trackVertical: "flex-col",
  segment: [
    "flex min-h-9 flex-1 items-center justify-center rounded-md px-3 py-1.5 text-center text-sm font-medium text-balance",
    "text-muted-foreground transition-colors motion-reduce:transition-none outline-none select-none pointer-coarse:min-h-11",
    "hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50",
    "data-[state=checked]:bg-background data-[state=checked]:text-foreground data-[state=checked]:shadow-sm",
    "dark:data-[state=checked]:bg-input/50",
    "disabled:cursor-not-allowed disabled:opacity-50",
    "aria-invalid:ring-1 aria-invalid:ring-destructive",
  ].join(" "),
} as const;

/** Props of `RadioSegment`. */
export interface RadioSegmentProps {
  /** Id of the radio. */
  id: string;
  /** Value of the radio. */
  value: string;
  /** Content that names the segment. */
  label: ReactNode;
  /** Disables the segment. */
  disabled?: boolean;
  /** Marks it as invalid. */
  error?: boolean;
  /** Extra classes of the segment. */
  className?: string;
  /** Click handler, run before Radix's. */
  onClick?: (event: MouseEvent<HTMLButtonElement>) => void;
}

/**
 * One segment: the Radix radio itself, named by its content. shadcn's radio item draws a fixed
 * circle and takes no children, so the primitive is used directly here.
 */
export function RadioSegment({
  id,
  value,
  label,
  disabled,
  error,
  className,
  onClick,
}: RadioSegmentProps) {
  return (
    <RadioGroupPrimitive.Item
      id={id}
      value={value}
      disabled={disabled}
      aria-invalid={error || undefined}
      data-slot="radio-segment"
      className={cn(segmentedStyles.segment, className)}
      onClick={onClick}
    >
      {label}
    </RadioGroupPrimitive.Item>
  );
}
