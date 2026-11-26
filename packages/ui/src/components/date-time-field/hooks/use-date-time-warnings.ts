import type { ReactNode } from "react";
import { segmentNames } from "@/internal/components";
import { fieldTextChecks, inputNameCheck, useMissingTexts } from "@/internal/hooks";
import type { FieldStatusInternal } from "@/internal/types";
import { type IsoMode, isIsoValue } from "@/internal/utils/helpers";

/** The props the warnings read, all optional: untyped code can leave any of them out. */
export interface DateTimeWarningSources extends FieldStatusInternal {
  /** The visible label. */
  label?: ReactNode;
  /** Accessible name without a label. */
  "aria-label"?: string;
  /** Ids of the elements that name the field. */
  "aria-labelledby"?: string;
  /** What the value holds. */
  mode?: IsoMode;
  /** The field's locale. */
  locale?: string;
  /** Name of the calendar button. */
  openCalendarLabel?: string;
  /** Name of the previous-month button. */
  previousMonthLabel?: string;
  /** Name of the next-month button. */
  nextMonthLabel?: string;
  /** The presets. */
  presets?: readonly unknown[];
  /** Name of their group. */
  presetsLabel?: string;
  /** Controlled value. */
  value?: string | null;
  /** Initial value. */
  defaultValue?: string | null;
  /** Earliest value. */
  min?: string;
  /** Latest value. */
  max?: string;
}

/** The expected format of each mode, for warnings. */
const FORMATS: Record<IsoMode, string> = {
  date: "YYYY-MM-DD",
  time: "HH:mm[:ss]",
  datetime: "YYYY-MM-DDTHH:mm[:ss]",
};

/** Problems shared by every date field: texts and the browser's locale data. */
export function calendarTextProblems(
  props: Pick<
    DateTimeWarningSources,
    "previousMonthLabel" | "nextMonthLabel" | "presets" | "presetsLabel" | "locale"
  >,
  calendar: boolean,
): string[] {
  const problems: string[] = [];
  if (calendar) {
    for (const key of ["previousMonthLabel", "nextMonthLabel"] as const) {
      if (!props[key]) problems.push(`the calendar needs \`${key}\``);
    }
  }
  if (props.presets?.length && !props.presetsLabel) problems.push("`presets` needs `presetsLabel`");
  if (!segmentNames(props.locale).day) {
    problems.push(
      "this browser has no `Intl.DisplayNames` date field names, so the segments have no names",
    );
  }
  return problems;
}

/** The problems of a date and time field's props that the types cannot catch in untyped code. */
export function dateTimeProblems(props: DateTimeWarningSources): string[] {
  const mode = props.mode ?? "date";
  const calendar = mode !== "time";
  const problems: string[] = [];
  const [unnamed, nameProblem] = inputNameCheck(props, "date field");
  if (unnamed) problems.push(nameProblem);
  if (calendar && !props.openCalendarLabel) problems.push("the calendar needs `openCalendarLabel`");
  problems.push(...calendarTextProblems(props, calendar));
  if (!calendar && props.presets?.length)
    problems.push('`presets` are not allowed with `mode="time"`');
  for (const key of ["value", "defaultValue", "min", "max"] as const) {
    const value = props[key];
    if (value !== undefined && value !== null && !isIsoValue(value, mode)) {
      problems.push(`\`${key}\` "${value}" is not a ${FORMATS[mode]} value; it is ignored`);
    }
  }
  return problems;
}

/** Development warnings for untyped usage. No text is ever generated. */
export function useDateTimeWarnings(componentName: string, props: DateTimeWarningSources) {
  useMissingTexts(componentName, [
    ...dateTimeProblems(props).map((problem) => [true, problem] as const),
    ...fieldTextChecks(props),
  ]);
}
