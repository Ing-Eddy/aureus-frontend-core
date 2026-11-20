import type { ReactNode } from "react";
import { calendarTextProblems } from "@/components/date-time-field/hooks";
import { fieldTextChecks, inputNameCheck, useMissingTexts } from "@/internal/hooks";
import type { FieldStatusInternal } from "@/internal/types";
import { isIsoDate } from "@/internal/utils/helpers";
import { validRange } from "./use-range-value";

/** The props the warnings read, all optional: untyped code can leave any of them out. */
export interface DateSelectionWarningSources extends FieldStatusInternal {
  label?: ReactNode;
  "aria-label"?: string;
  "aria-labelledby"?: string;
  selection?: string;
  locale?: string;
  openCalendarLabel?: string;
  previousMonthLabel?: string;
  nextMonthLabel?: string;
  startLabel?: string;
  endLabel?: string;
  presets?: readonly unknown[];
  presetsLabel?: string;
  value?: unknown;
  defaultValue?: unknown;
  min?: string;
  max?: string;
}

/** The problems of a date selection field's props that the types cannot catch in untyped code. */
export function dateSelectionProblems(props: DateSelectionWarningSources): string[] {
  const problems: string[] = [];
  const range = props.selection === "range";
  if (!range && props.selection !== "multiple") {
    problems.push('`selection` must be "range" or "multiple"');
  }
  const [unnamed, nameProblem] = inputNameCheck(props, "date selection");
  if (unnamed) problems.push(nameProblem);
  if (range) {
    for (const key of ["openCalendarLabel", "startLabel", "endLabel"] as const) {
      if (!props[key]) problems.push(`\`selection="range"\` needs \`${key}\``);
    }
  }
  problems.push(...calendarTextProblems(props, true));
  for (const key of ["value", "defaultValue"] as const) {
    const value = props[key];
    if (value === undefined || value === null) continue;
    const valid = range
      ? validRange(value) !== null
      : Array.isArray(value) && value.every((day) => isIsoDate(day));
    if (!valid) {
      problems.push(
        `\`${key}\` is not ${range ? "a { from, to } range of YYYY-MM-DD dates" : "a list of YYYY-MM-DD dates"}; invalid days are ignored`,
      );
    }
  }
  for (const key of ["min", "max"] as const) {
    const value = props[key];
    if (value !== undefined && !isIsoDate(value)) {
      problems.push(`\`${key}\` "${value}" is not a YYYY-MM-DD date; it is ignored`);
    }
  }
  return problems;
}

/** Development warnings for untyped usage. No text is ever generated. */
export function useDateSelectionWarnings(
  componentName: string,
  props: DateSelectionWarningSources,
) {
  useMissingTexts(componentName, [
    ...dateSelectionProblems(props).map((problem) => [true, problem] as const),
    ...fieldTextChecks(props),
  ]);
}
