import type { ReactNode } from "react";
import { fieldTextChecks, useMissingTexts } from "@/internal/hooks";
import type { FieldStatusInternal } from "@/internal/types";

export interface CheckboxNameSources extends FieldStatusInternal {
  label?: ReactNode;
  checkboxLabel?: ReactNode;
  "aria-label"?: string;
  "aria-labelledby"?: string;
}

/** Whether the box gets an accessible name from any of the props that can name it. */
export function hasAccessibleName(props: CheckboxNameSources) {
  return Boolean(
    props.label || props.checkboxLabel || props["aria-label"] || props["aria-labelledby"],
  );
}

/**
 * Development warnings for a field without an accessible name, and for `loading` or `info`
 * without their texts. No text is ever generated.
 */
export function useCheckboxWarnings(componentName: string, props: CheckboxNameSources) {
  useMissingTexts(componentName, [
    [
      !hasAccessibleName(props),
      "the checkbox has no accessible name. Pass `label`, `checkboxLabel`, `aria-label` or `aria-labelledby`",
    ],
    ...fieldTextChecks(props),
  ]);
}
