import type { ReactNode } from "react";
import { fieldTextChecks, useMissingTexts } from "@/internal/hooks";
import type { FieldStatusInternal } from "@/internal/types";
import { isValidGroups } from "../utils";

export interface OtpWarningSources extends FieldStatusInternal {
  label?: ReactNode;
  "aria-label"?: string;
  "aria-labelledby"?: string;
  length: number;
  groups?: readonly number[];
  masked?: boolean;
  reveal?: unknown;
  /** The value given by the consumer, and the value after sanitising it. */
  rawValue?: string;
  sanitizedValue?: string;
}

/** The problems of an OTP's props, one message each. */
export function otpProblems(props: OtpWarningSources): string[] {
  const problems: string[] = [];
  if (!props.label && !props["aria-label"] && !props["aria-labelledby"]) {
    problems.push(
      "the input has no accessible name. Pass `label`, `aria-label` or `aria-labelledby`",
    );
  }
  if (props.groups !== undefined && !isValidGroups(props.length, props.groups)) {
    problems.push(
      `\`groups\` [${props.groups.join(", ")}] does not add up to \`length\` (${props.length}); one block is used`,
    );
  }
  if (props.reveal && !props.masked) problems.push("`reveal` only works with `masked`");
  if (props.rawValue !== undefined && props.rawValue !== props.sanitizedValue) {
    problems.push(
      `the value "${props.rawValue}" was changed to "${props.sanitizedValue}" to fit \`length\` and \`charset\``,
    );
  }
  return problems;
}

/** Development warnings, each emitted once per distinct problem. */
export function useOtpWarnings(componentName: string, props: OtpWarningSources) {
  useMissingTexts(componentName, [
    ...otpProblems(props).map((problem) => [true, problem] as const),
    ...fieldTextChecks(props),
  ]);
}
