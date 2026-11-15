import type { ReactNode } from "react";
import { FieldInfo } from "@/internal/components/field-info";
import type { FieldClassNames } from "@/internal/types";
import { fieldHeaderClassName, fieldLabelClassName } from "@/internal/utils/constants";
import { cn } from "@/shadcn/lib/utils";
import { FieldLabel } from "@/shadcn/ui/field";
import { RequiredMark } from "./required-mark";

export interface FieldHeaderProps {
  inputId: string;
  infoId: string;
  label?: ReactNode;
  required?: boolean;
  info?: ReactNode;
  infoLabel?: string;
  classNames?: FieldClassNames;
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
}: FieldHeaderProps) {
  return (
    <div data-slot="field-header" className={cn(fieldHeaderClassName, classNames?.header)}>
      {label ? (
        <FieldLabel
          id={`${inputId}-label`}
          htmlFor={inputId}
          className={cn(fieldLabelClassName, classNames?.label)}
        >
          {label}
          {required ? <RequiredMark className={classNames?.requiredMark} /> : null}
        </FieldLabel>
      ) : null}
      {info ? (
        <FieldInfo
          id={infoId}
          content={info}
          label={infoLabel}
          className={cn("ms-auto", classNames?.info)}
        />
      ) : null}
    </div>
  );
}
