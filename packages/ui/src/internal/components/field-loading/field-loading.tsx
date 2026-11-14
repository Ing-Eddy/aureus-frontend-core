import { fieldStrings } from "@/internal/utils/constants";
import { cn } from "@/shadcn/lib/utils";
import { Spinner } from "@/shadcn/ui/spinner";

export interface FieldLoadingProps {
  /** Accessible label of the spinner. */
  label?: string;
  className?: string;
}

/** Spinner shown inside the input frame while the field is loading. */
export function FieldLoading({ label = fieldStrings.loading, className }: FieldLoadingProps) {
  return (
    <Spinner
      data-slot="field-loading"
      aria-label={label}
      className={cn("text-muted-foreground", className)}
    />
  );
}
