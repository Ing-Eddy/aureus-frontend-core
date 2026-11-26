import type { ReactNode } from "react";
import { FieldInfo } from "@/internal/components/field-info";
import type { FieldClassNames } from "@/internal/types";
import { fieldHeaderClassName, fieldLabelClassName } from "@/internal/utils/constants";
import { cn } from "@/shadcn/lib/utils";
import { FieldLabel } from "@/shadcn/ui/field";
import { RequiredMark } from "./required-mark";

/** Props of `FieldHeader`. */
export interface FieldHeaderProps {
  /** Id of the control; the label's id is derived from it. */
  inputId: string;
  /** Id of the info content, for the control's `aria-describedby`. */
  infoId: string;
  /** Text of the label. */
  label?: ReactNode;
  /** Shows the required mark. */
  required?: boolean;
  /** Content of the info tooltip. */
  info?: ReactNode;
  /** Accessible name of the info button. */
  infoLabel?: string;
  /** Extra classes of the parts. */
  classNames?: FieldClassNames;
  /**
   * Associates the label with the control through `htmlFor` (the default). `false` renders it
   * unassociated, for fields whose control is named by another text and whose group is named by
   * this label.
   */
  labelFor?: boolean;
  /** Content at the end of the row, before the info button (for example a group's spinner). */
  headerEnd?: ReactNode;
}

/** The row above the input: label and required mark at the start, info button at the far end. */
export function FieldHeader({
  inputId,
  infoId,
  label,
  required,
  info,
  infoLabel,
  classNames,
  labelFor = true,
  headerEnd,
}: FieldHeaderProps) {
  return (
    <div data-slot="field-header" className={cn(fieldHeaderClassName, classNames?.header)}>
      {label ? (
        <FieldLabel
          id={`${inputId}-label`}
          htmlFor={labelFor ? inputId : undefined}
          className={cn(fieldLabelClassName, classNames?.label)}
        >
          {label}
          {required ? <RequiredMark className={classNames?.requiredMark} /> : null}
        </FieldLabel>
      ) : null}
      {headerEnd ? (
        <span data-slot="field-header-end" className="ms-auto flex items-center gap-2">
          {headerEnd}
        </span>
      ) : null}
      {info ? (
        <FieldInfo
          id={infoId}
          content={info}
          label={infoLabel}
          className={cn(!headerEnd && "ms-auto", classNames?.info)}
        />
      ) : null}
    </div>
  );
}
