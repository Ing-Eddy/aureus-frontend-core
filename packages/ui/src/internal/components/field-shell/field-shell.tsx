import type { ReactNode } from "react";
import type { FieldBaseProps } from "@/internal/types";
import { cn } from "@/shadcn/lib/utils";
import { Field } from "@/shadcn/ui/field";
import { FieldHeader, FieldHelper } from "./components";

export interface FieldShellProps
  extends Pick<
    FieldBaseProps,
    | "label"
    | "required"
    | "info"
    | "infoLabel"
    | "helperText"
    | "error"
    | "errorMessage"
    | "className"
    | "classNames"
  > {
  inputId: string;
  helperId: string;
  infoId: string;
  /** `data-*` attributes from `useFieldA11y`. */
  rootProps?: Record<`data-${string}`, boolean | undefined>;
  /** The control: an input frame with its addons. */
  children: ReactNode;
  /** Associates the header label with the control (default `true`). See `FieldHeader`. */
  labelFor?: boolean;
  /** Names the root group with the header label through `aria-labelledby` (default `false`). */
  labelledByRoot?: boolean;
}

/**
 * The layout every field shares: header row (label, required mark, info), the control, and the
 * helper text or error message below it.
 */
export function FieldShell({
  inputId,
  helperId,
  infoId,
  rootProps,
  label,
  required,
  info,
  infoLabel,
  helperText,
  error,
  errorMessage,
  className,
  classNames,
  children,
  labelFor = true,
  labelledByRoot = false,
}: FieldShellProps) {
  return (
    <Field
      className={cn("min-w-0", classNames?.root, className)}
      aria-labelledby={labelledByRoot && label ? `${inputId}-label` : undefined}
      {...rootProps}
    >
      {label || info ? (
        <FieldHeader
          inputId={inputId}
          infoId={infoId}
          label={label}
          required={required}
          info={info}
          infoLabel={infoLabel}
          classNames={classNames}
          labelFor={labelFor}
        />
      ) : null}
      {children}
      <FieldHelper
        id={helperId}
        helperText={helperText}
        error={error}
        errorMessage={errorMessage}
        className={classNames?.helper}
      />
    </Field>
  );
}
