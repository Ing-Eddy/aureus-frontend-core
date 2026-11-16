import type { ReactNode } from "react";
import { fieldTextChecks, useMissingTexts } from "@/internal/hooks";
import type { FieldStatusInternal } from "@/internal/types";

export interface CheckboxGroupNameSources extends FieldStatusInternal {
  label?: ReactNode;
  "aria-label"?: string;
  "aria-labelledby"?: string;
}

/** Whether the group gets an accessible name from any of the props that can name it. */
export function hasGroupName(props: CheckboxGroupNameSources) {
  return Boolean(props.label || props["aria-label"] || props["aria-labelledby"]);
}

/**
 * Development warnings for a field without an accessible name, and for `loading` or `info`
 * without their texts. No text is ever generated.
 */
export function useCheckboxGroupWarnings(componentName: string, props: CheckboxGroupNameSources) {
  useMissingTexts(componentName, [
    [
      !hasGroupName(props),
      "the group has no accessible name. Pass `label`, `aria-label` or `aria-labelledby`",
    ],
    ...fieldTextChecks(props),
  ]);
}
