import type { FocusEvent, ReactNode, Ref } from "react";
import type {
  FieldActionProps,
  FieldBaseProps,
  FieldClassNames,
  FieldTexts,
} from "@/internal/types";

/** A point on the track. Its `label` is optional content; without it only the tick is drawn. */
export interface SliderMark {
  /** Position of the mark. Marks outside `[min, max]` are ignored. */
  value: number;
  /** Shown below the mark (beside it in vertical sliders). No default. Hidden from assistive technology. */
  label?: ReactNode;
}

/** Extra parts of a slider field that accept classes. */
export interface SliderFieldClassNames extends FieldClassNames {
  /** The slider root (track, range, thumbs and marks). */
  slider?: string;
  /** The track. */
  track?: string;
  /** The filled part of the track. */
  range?: string;
  /** Each thumb. */
  thumb?: string;
  /** The layer of marks and their labels. */
  marks?: string;
  /** Each mark label. */
  markLabel?: string;
  /** The value shown over a thumb with `showValue="tooltip"`. */
  tooltip?: string;
  /** The value shown in the label row with `showValue="header"`. */
  value?: string;
  /** Each linked number input. */
  inputs?: string;
}

/**
 * Props of `SliderField` shared by single and range sliders. Every option is independent and
 * opt-in, and there are no default texts.
 */
export interface SliderFieldBaseProps extends Omit<FieldBaseProps, "classNames"> {
  /** Lowest value. Defaults to `0`. */
  min?: number;
  /** Highest value. Defaults to `100`. */
  max?: number;
  /** Precision of the value: every value is a multiple of `step` from `min`. Defaults to `1`. */
  step?: number;
  /** PageUp/PageDown and Shift+arrow distance. Defaults to ten times `step`. */
  largeStep?: number;

  /** Locale of every shown and announced value. Defaults to the browser's. */
  locale?: string;
  /** `Intl.NumberFormat` options, for currency, percent or unit values. */
  formatOptions?: Intl.NumberFormatOptions;
  /** Turns a value into its text. Wins over `locale` and `formatOptions`. */
  formatValue?: (value: number) => string;

  /**
   * `"none"` (the default); `"header"`, the formatted value at the end of the label row; or
   * `"tooltip"`, the value over the thumb while it is dragged, hovered or focused. Both are hidden
   * from assistive technology: each thumb announces its value text.
   */
  showValue?: "none" | "header" | "tooltip";
  /** Points drawn on the track, each with an optional label. */
  marks?: readonly SliderMark[];
  /** Allows only the values of `marks`: dragging snaps to them and the arrows move between them. */
  snapToMarks?: boolean;

  /** `"horizontal"` (the default) or `"vertical"`, with low values at the bottom. */
  orientation?: "horizontal" | "vertical";
  /** Length of a vertical track, as a CSS length. Defaults to `"12rem"`. */
  height?: string;

  /** Name of the hidden form inputs: `name` with one value, `name[]` with two. */
  name?: string;
  /** Base id of the field. Generated when missing. */
  id?: string;
  /** Reaches the first thumb (the element with `role="slider"`). */
  ref?: Ref<HTMLSpanElement>;
  /** Called when focus leaves the field (thumbs and linked inputs). */
  onBlur?: (event: FocusEvent<HTMLDivElement>) => void;
  /** Accessible name of the slider (or of the group, with `range`) when there is no `label`. */
  "aria-label"?: string;
  /** Ids of the elements that name the slider (or the group) when there is no `label`. */
  "aria-labelledby"?: string;
  /** Extra ids describing each thumb. */
  "aria-describedby"?: string;
  /** A button at the inline end of the slider row. */
  action?: FieldActionProps;
  /** Extra classes per part. */
  classNames?: SliderFieldClassNames;
}

/** One thumb: the value is a `number`, named by the field's label. */
export interface SliderSingleProps {
  /** Two thumbs and a `[low, high]` value. Off by default. */
  range?: false;
  /** Controlled value. */
  value?: number;
  /** Initial value when uncontrolled. Defaults to `min`. */
  defaultValue?: number;
  /** Called while the thumb moves. */
  onValueChange?: (value: number) => void;
  /** Called once when a drag ends, when a key changes the value, or when the input commits. */
  onValueCommit?: (value: number) => void;
  /** Only allowed with `range`. */
  minDistance?: never;
  /** Only allowed with `range`. */
  thumbLabels?: never;
}

/** Two thumbs: the value is `[low, high]`, always sorted. `thumbLabels` names each thumb. */
export interface SliderRangeProps {
  /** Two thumbs and a `[low, high]` value. */
  range: true;
  /** Controlled value. A pair out of order is shown sorted. */
  value?: [number, number];
  /** Initial value when uncontrolled. Defaults to `[min, max]`. */
  defaultValue?: [number, number];
  /** Called while a thumb moves. */
  onValueChange?: (value: [number, number]) => void;
  /** Called once when a drag ends, when a key changes the value, or when an input commits. */
  onValueCommit?: (value: [number, number]) => void;
  /** Smallest distance between the two values. Defaults to `0`. */
  minDistance?: number;
  /** Accessible names of the low and high thumbs, in the developer's language. Required. */
  thumbLabels: [string, string];
}

/** No linked input. */
interface SliderWithoutInput {
  /** A number input to type an exact value (two with `range`). Off by default. */
  withInput?: false;
  /** Only allowed with `withInput`. */
  inputLabel?: never;
  /** Only allowed with `withInput` and `range`. */
  inputLabels?: never;
}

/** The linked input of a single slider and its name. */
export type SliderSingleInputTexts =
  | SliderWithoutInput
  | {
      /** A number input to type an exact value. */
      withInput: boolean;
      /** Accessible name of the input. Required with `withInput`. */
      inputLabel: string;
      /** Only allowed with `range`. */
      inputLabels?: never;
    };

/** The linked inputs of a range slider and their names. */
export type SliderRangeInputTexts =
  | SliderWithoutInput
  | {
      /** Two number inputs, for the low and high values. */
      withInput: boolean;
      /** Accessible names of the low and high inputs. Required with `withInput` and `range`. */
      inputLabels: [string, string];
      /** Use `inputLabels` with `range`. */
      inputLabel?: never;
    };

/** A single or range value, with the linked input texts that each one requires. */
export type SliderValueProps =
  | (SliderSingleProps & SliderSingleInputTexts)
  | (SliderRangeProps & SliderRangeInputTexts);

/**
 * Props of `SliderField`. `range` requires `thumbLabels`, `withInput` requires `inputLabel`
 * (`inputLabels` with `range`), `loading` requires `loadingLabel` and `info` requires `infoLabel`.
 * No text is generated.
 */
export type SliderFieldProps = SliderFieldBaseProps & SliderValueProps & FieldTexts;
