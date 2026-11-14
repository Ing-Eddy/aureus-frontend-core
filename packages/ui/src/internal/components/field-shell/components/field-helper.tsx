import type { ReactNode } from "react";
import { cn } from "@/shadcn/lib/utils";
import { FieldDescription, FieldError } from "@/shadcn/ui/field";

export interface FieldHelperProps {
  /** Referenced by the input's `aria-describedby`. */
  id: string;
  helperText?: ReactNode;
  error?: boolean;
  errorMessage?: ReactNode;
  className?: string;
}

/**
 * The text below the input. While in error, an `errorMessage` replaces the helper text and is
 * announced as an alert; without one, the helper text is kept and turns destructive.
 */
export function FieldHelper({ id, helperText, error, errorMessage, className }: FieldHelperProps) {
  if (error && errorMessage) {
    return (
      <FieldError id={id} className={className}>
        {errorMessage}
      </FieldError>
    );
  }
  if (!helperText) return null;
  return (
    // shadcn's description is `text-left`; `text-start` keeps it aligned in right-to-left layouts.
    <FieldDescription id={id} className={cn("text-start", error && "text-destructive", className)}>
      {helperText}
    </FieldDescription>
  );
}
