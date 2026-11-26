import { cn } from "@/shadcn/lib/utils";
import { Spinner } from "@/shadcn/ui/spinner";

/** Props of `FieldLoading`. */
export interface FieldLoadingProps {
  /**
   * Accessible name of the spinner, from the field's `loadingLabel`. The public types require it
   * with `loading`; it is only `undefined` in untyped code, which gets a development warning.
   */
  label: string | undefined;
  /** Extra classes of the spinner. */
  className?: string;
}

/** Spinner shown inside the input frame while the field is loading. */
export function FieldLoading({ label, className }: FieldLoadingProps) {
  return (
    <Spinner
      data-slot="field-loading"
      aria-label={label}
      className={cn("text-muted-foreground", className)}
    />
  );
}
