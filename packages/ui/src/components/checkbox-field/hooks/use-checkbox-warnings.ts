import type { ReactNode } from "react";
import { fieldTextChecks, useMissingTexts } from "@/internal/hooks";
import type { FieldStatusInternal } from "@/internal/types";

/** The props that can name a checkbox, plus those whose texts are checked. */
export interface CheckboxNameSources extends FieldStatusInternal {
  /** The label above the field. */
  label?: ReactNode;
  /** The text beside the box. */
  checkboxLabel?: ReactNode;
  /** Accessible name without visible text. */
  "aria-label"?: string;
  /** Ids of the elements that name the box. */
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
