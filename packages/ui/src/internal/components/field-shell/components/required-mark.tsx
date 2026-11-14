import { cn } from "@/shadcn/lib/utils";

/** The red asterisk after the label. Hidden from assistive technology: the input has `aria-required`. */
export function RequiredMark({ className }: { className?: string }) {
  return (
    <span
      aria-hidden="true"
      data-slot="field-required-mark"
      className={cn("text-destructive", className)}
    >
      *
    </span>
  );
}
