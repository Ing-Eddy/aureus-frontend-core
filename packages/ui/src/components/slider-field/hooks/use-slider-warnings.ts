import type { ReactNode } from "react";
import { fieldTextChecks, inputNameCheck, useMissingTexts } from "@/internal/hooks";
import type { FieldStatusInternal } from "@/internal/types";

/** The props the warnings read, all optional: untyped code can leave any of them out. */
export interface SliderWarningSources extends FieldStatusInternal {
  /** The visible label. */
  label?: ReactNode;
  /** Accessible name without a label. */
  "aria-label"?: string;
  /** Ids of the elements that name the slider. */
  "aria-labelledby"?: string;
  /** Two thumbs. */
  range?: boolean;
  /** Names of the two thumbs. */
  thumbLabels?: readonly (string | undefined)[];
  /** Linked inputs are on. */
  withInput?: boolean;
  /** Name of the single input. */
  inputLabel?: string;
  /** Names of the two inputs. */
  inputLabels?: readonly (string | undefined)[];
  /** Lowest value. */
  min?: number;
  /** Highest value. */
  max?: number;
  /** Controlled value. */
  value?: number | readonly number[];
  /** Initial value. */
  defaultValue?: number | readonly number[];
  /** Smallest distance between the two values. */
  minDistance?: number;
  /** Only mark values are allowed. */
  snapToMarks?: boolean;
  /** The marks. */
  marks?: readonly {
    /** Position of the mark. */
    value: number;
  }[];
}

/** Whether both texts of a range are given. */
const hasTwo = (texts?: readonly (string | undefined)[]) =>
  texts?.length === 2 && texts.every(Boolean);

/** The problems of a slider's props that the types cannot catch in untyped code. */
export function sliderProblems(props: SliderWarningSources): string[] {
  const { min = 0, max = 100, range } = props;
  const problems: string[] = [];
  const [unnamed, nameProblem] = inputNameCheck(props, range ? "slider group" : "slider");
  if (unnamed) problems.push(nameProblem);
  if (range && !hasTwo(props.thumbLabels)) problems.push("`range` needs two `thumbLabels`");
  if (props.withInput && !range && !props.inputLabel)
    problems.push("`withInput` needs `inputLabel`");
  if (props.withInput && range && !hasTwo(props.inputLabels)) {
    problems.push("`withInput` with `range` needs two `inputLabels`");
  }
  for (const source of [props.value, props.defaultValue]) {
    if (source === undefined) continue;
    for (const value of typeof source === "number" ? [source] : source) {
      if (value < min || value > max) {
        problems.push(
          `the value ${value} is outside \`min\` (${min}) and \`max\` (${max}); it is shown clamped`,
        );
      }
    }
  }
  if (props.snapToMarks && props.minDistance && props.marks?.length) {
    const inside = props.marks.map((mark) => mark.value).filter((v) => v >= min && v <= max);
    const span = inside.length ? Math.max(...inside) - Math.min(...inside) : 0;
    if (span < props.minDistance) {
      problems.push(`no two marks are \`minDistance\` (${props.minDistance}) apart`);
    }
  }
  return problems;
}

/** Development warnings for untyped usage. No text is ever generated. */
export function useSliderWarnings(componentName: string, props: SliderWarningSources) {
  useMissingTexts(componentName, [
    ...sliderProblems(props).map((problem) => [true, problem] as const),
    ...fieldTextChecks(props),
  ]);
}
