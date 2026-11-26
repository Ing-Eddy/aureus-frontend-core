import type { ReactNode } from "react";
import type { FieldBaseProps, FieldStatusInternal } from "@/internal/types";
import { cn } from "@/shadcn/lib/utils";
import { Field } from "@/shadcn/ui/field";
import { FieldHeader, FieldHelper } from "./components";

/** Props of `FieldShell`. */
export interface FieldShellProps
  extends Pick<
      FieldBaseProps,
      "label" | "required" | "helperText" | "error" | "errorMessage" | "className" | "classNames"
    >,
    Pick<FieldStatusInternal, "info" | "infoLabel"> {
  /** Id of the control; the label's id is derived from it. */
  inputId: string;
  /** Id of the helper or error text. */
  helperId: string;
  /** Id of the info content. */
  infoId: string;
  /** `data-*` attributes from `useFieldA11y`. */
  rootProps?: Record<`data-${string}`, boolean | undefined>;
  /** The control: an input frame with its addons. */
  children: ReactNode;
  /** Associates the header label with the control (default `true`). See `FieldHeader`. */
  labelFor?: boolean;
  /** Names the root group with the header label through `aria-labelledby` (default `false`). */
  labelledByRoot?: boolean;
  /**
   * ARIA attributes for the root group, for fields whose control is the whole group (such as a
   * checkbox group). `labelledByRoot` takes precedence for `aria-labelledby`.
   */
  rootAria?: {
    /** Ids that describe the group. */
    "aria-describedby"?: string;
    /** Marks the group as loading. */
    "aria-busy"?: boolean;
    /** Marks the group as disabled. */
    "aria-disabled"?: boolean;
    /** Name of a group without a label. */
    "aria-label"?: string;
    /** Ids of the elements that name a group without a label. */
    "aria-labelledby"?: string;
  };
  /** Content at the end of the header row, before the info button. */
  headerEnd?: ReactNode;
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
  rootAria,
  headerEnd,
}: FieldShellProps) {
  return (
    <Field
      className={cn("min-w-0", classNames?.root, className)}
      {...rootAria}
      aria-labelledby={labelledByRoot && label ? `${inputId}-label` : rootAria?.["aria-labelledby"]}
      {...rootProps}
    >
      {label || info || headerEnd ? (
        <FieldHeader
          inputId={inputId}
          infoId={infoId}
          label={label}
          required={required}
          info={info}
          infoLabel={infoLabel}
          classNames={classNames}
          labelFor={labelFor}
          headerEnd={headerEnd}
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
