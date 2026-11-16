import type { ReactNode } from "react";
import { fieldTextChecks, useMissingTexts } from "@/internal/hooks";
import type { FieldStatusInternal } from "@/internal/types";

export interface RadioGroupWarningSources extends FieldStatusInternal {
  label?: ReactNode;
  "aria-label"?: string;
  "aria-labelledby"?: string;
  otherOption?: { inputLabel?: string };
}

/** The problems of a radio group's texts: no group name, or an other option without input label. */
export function radioGroupProblems(props: RadioGroupWarningSources): string[] {
  const problems: string[] = [];
  if (!props.label && !props["aria-label"] && !props["aria-labelledby"]) {
    problems.push(
      "the group has no accessible name. Pass `label`, `aria-label` or `aria-labelledby`",
    );
  }
  if (props.otherOption && !props.otherOption.inputLabel) {
    problems.push("`otherOption` needs `inputLabel`");
  }
  return problems;
}

/** Development warnings for untyped usage. No text is ever generated. */
export function useRadioGroupWarnings(componentName: string, props: RadioGroupWarningSources) {
  useMissingTexts(componentName, [
    ...radioGroupProblems(props).map((problem) => [true, problem] as const),
    ...fieldTextChecks(props),
  ]);
}
