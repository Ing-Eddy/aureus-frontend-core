import { Progress as ProgressPrimitive } from "radix-ui";
import { cn } from "@/shadcn/lib/utils";

/**
 * An upload's progress bar. shadcn's `Progress` keeps `value` for its indicator only, so the bar
 * would have no `aria-valuenow`; this one passes it to the Radix root, with the same look.
 */
export function FileProgress({
  value,
  label,
  className,
}: {
  value: number;
  label: string | undefined;
  className?: string;
}) {
  return (
    <ProgressPrimitive.Root
      data-slot="file-progress"
      value={value}
      aria-label={label}
      className={cn(
        "relative flex h-1 w-full items-center overflow-x-hidden rounded-full bg-muted",
        className,
      )}
    >
      <ProgressPrimitive.Indicator
        className="size-full flex-1 bg-primary transition-transform motion-reduce:transition-none"
        style={{ transform: `translateX(-${100 - value}%)` }}
      />
    </ProgressPrimitive.Root>
  );
}
