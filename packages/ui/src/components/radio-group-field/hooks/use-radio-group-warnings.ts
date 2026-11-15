import { type ReactNode, useEffect } from "react";
import { isDev } from "@/internal/utils/constants";

export interface RadioGroupWarningSources {
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
  const key = radioGroupProblems(props).join("|");
  useEffect(() => {
    if (!isDev || !key) return;
    for (const problem of key.split("|")) console.warn(`${componentName}: ${problem}.`);
  }, [componentName, key]);
}
