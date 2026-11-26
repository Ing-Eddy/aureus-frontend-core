import type { ReactNode } from "react";
import { fieldTextChecks, useMissingTexts } from "@/internal/hooks";
import type { FieldStatusInternal } from "@/internal/types";

/** The props that can name a checkbox group, plus those whose texts are checked. */
export interface CheckboxGroupNameSources extends FieldStatusInternal {
  /** The visible label. */
  label?: ReactNode;
  /** Accessible name without a label. */
  "aria-label"?: string;
  /** Ids of the elements that name the group. */
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
