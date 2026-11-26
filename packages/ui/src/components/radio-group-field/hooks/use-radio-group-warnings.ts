import type { ReactNode } from "react";
import { fieldTextChecks, useMissingTexts } from "@/internal/hooks";
import type { FieldStatusInternal } from "@/internal/types";

/** The props of a radio group that can be misused. */
export interface RadioGroupWarningSources extends FieldStatusInternal {
  /** The visible label. */
  label?: ReactNode;
  /** Accessible name without a label. */
  "aria-label"?: string;
  /** Ids of the elements that name the group. */
  "aria-labelledby"?: string;
  /** The other option, whose input needs a name. */
  otherOption?: {
    /** Accessible name of its text input. */
    inputLabel?: string;
  };
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
