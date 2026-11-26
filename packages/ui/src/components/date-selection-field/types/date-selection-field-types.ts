import type { FocusEvent, ReactNode, Ref } from "react";
import type { WeekDay } from "@/components/date-time-field";
import type {
  FieldActionProps,
  FieldBaseProps,
  FieldClassNames,
  FieldTexts,
} from "@/internal/types";
import type { DateRangeValue } from "../utils";

export type { DateRangeValue } from "../utils";

/** A shortcut beside the calendar: a value, or a function that returns one (for relative dates). */
export interface DateSelectionPreset<Value> {
  /** Content of the preset button. No default. */
  label: ReactNode;
  /**
   * The value to choose, or a function called when it is chosen (and while the popover is open, to
   * mark it as pressed).
   */
  value: Value | (() => Value);
}

/** Extra parts of a date selection field that accept classes. */
export interface DateSelectionFieldClassNames extends FieldClassNames {
  /** Each row of segments (start and end of a range). */
  segments?: string;
  /** Each segment. */
  segment?: string;
  /** The button that opens the calendar beside the segments of a range. */
  calendarButton?: string;
  /** The summary button of several days. */
  summary?: string;
  /** The popover around the calendar. */
  popover?: string;
  /** The calendar. */
  calendar?: string;
  /** The group of presets. */
  presets?: string;
}

/**
 * Props of `DateSelectionField` shared by both selections. Every option is independent and
 * opt-in, and there are no default texts.
 */
export interface DateSelectionFieldBaseProps extends Omit<FieldBaseProps, "classNames"> {
  /** Locale of the segments, the calendar, the summary and every announced text. Defaults to the browser's. */
  locale?: string;
  /** First day of the week in the calendar. Defaults to the locale's. */
  weekStartsOn?: WeekDay;
  /** Earliest choosable day (`YYYY-MM-DD`). */
  min?: string;
  /** Latest choosable day (`YYYY-MM-DD`). */
  max?: string;
  /** ISO dates that cannot be chosen. */
  disabledDates?: readonly string[];
  /** Days that cannot be chosen, called with each ISO date. */
  isDateDisabled?: (date: string) => boolean;
  /** Accessible name of the previous-month button. Required. */
  previousMonthLabel: string;
  /** Accessible name of the next-month button. Required. */
  nextMonthLabel: string;
  /** Name of the hidden inputs: `name[from]` and `name[to]` for a range, `name[]` per day. */
  name?: string;
  /** Id of the first segment (range) or of the summary button. Generated when missing. */
  id?: string;
  /** Reaches the first segment of a range, or the summary button. */
  ref?: Ref<HTMLElement>;
  /** Called when focus leaves the field and its calendar. */
  onBlur?: (event: FocusEvent<HTMLDivElement>) => void;
  /** Accessible name of the field when there is no `label`. */
  "aria-label"?: string;
  /** Ids of the elements that name the field when there is no `label`. */
  "aria-labelledby"?: string;
  /** Extra ids describing the segments or the summary button. */
  "aria-describedby"?: string;
  /** A button at the inline end of the frame. */
  action?: FieldActionProps;
  /** Extra classes per part. */
  classNames?: DateSelectionFieldClassNames;
}

/** Without presets. */
interface WithoutPresets {
  /** Shortcuts beside the calendar. Off by default. */
  presets?: undefined;
  /** Only allowed with `presets`. */
  presetsLabel?: never;
}

/** Presets of a selection and the name of their group. */
export type DateSelectionPresetTexts<Value> =
  | WithoutPresets
  | {
      /** Shortcuts beside the calendar. */
      presets: readonly DateSelectionPreset<Value>[];
      /** Accessible name of the group of presets. Required with `presets`. */
      presetsLabel: string;
    };

/** A start and an end day: the value is `{ from, to }`, with `to: null` while the end is chosen. */
export type DateRangeSelectionProps = {
  /** `"range"`: a start and an end day. */
  selection: "range";
  /** Controlled value: `null` without a start. Always sorted. */
  value?: DateRangeValue | null;
  /** Initial value when uncontrolled. */
  defaultValue?: DateRangeValue | null;
  /** Called when the range changes. */
  onValueChange?: (value: DateRangeValue | null) => void;
  /** Accessible name of the button that opens the calendar. Required with `range`. */
  openCalendarLabel: string;
  /** Accessible name of the start segments. Required with `range`. */
  startLabel: string;
  /** Accessible name of the end segments. Required with `range`. */
  endLabel: string;
  /** Fewest days in a range, counting both ends. */
  minDays?: number;
  /** Most days in a range, counting both ends (1 to 27 August is 27). */
  maxDays?: number;
  /** A range cannot contain a disabled day. */
  excludeDisabled?: boolean;
  /** Only allowed with `selection="multiple"`. */
  maxSelected?: never;
  /** Only allowed with `selection="multiple"`. */
  formatSummary?: never;
  /** Only allowed with `selection="multiple"`. */
  placeholder?: never;
} & DateSelectionPresetTexts<DateRangeValue>;

/** Any set of separate days: the value is a sorted list of ISO dates. */
export type DateMultipleSelectionProps = {
  /** `"multiple"`: separate days. */
  selection: "multiple";
  /** Controlled value: a sorted list of ISO dates with no duplicates. */
  value?: readonly string[];
  /** Initial value when uncontrolled. */
  defaultValue?: readonly string[];
  /** Called when a day is added or removed. */
  onValueChange?: (value: string[]) => void;
  /** Most days that can be chosen. */
  maxSelected?: number;
  /** The text of the summary button. Defaults to the dates joined by `Intl.ListFormat`. */
  formatSummary?: (dates: readonly string[]) => string;
  /** Shown in the summary button while no day is chosen. No default. */
  placeholder?: ReactNode;
  /** Only allowed with `selection="range"`: the summary button opens the calendar. */
  openCalendarLabel?: never;
  /** Only allowed with `selection="range"`. */
  startLabel?: never;
  /** Only allowed with `selection="range"`. */
  endLabel?: never;
  /** Only allowed with `selection="range"`. */
  minDays?: never;
  /** Only allowed with `selection="range"`. */
  maxDays?: never;
  /** Only allowed with `selection="range"`. */
  excludeDisabled?: never;
} & DateSelectionPresetTexts<readonly string[]>;

/** Both selections, with the props and texts each one requires. */
export type DateSelectionProps = DateRangeSelectionProps | DateMultipleSelectionProps;

/**
 * Props of `DateSelectionField`. Every selection requires `previousMonthLabel` and
 * `nextMonthLabel`; a range also requires `openCalendarLabel`, `startLabel` and `endLabel`;
 * `presets` requires `presetsLabel`; `loading` requires `loadingLabel` and `info` requires
 * `infoLabel`. No text is generated.
 */
export type DateSelectionFieldProps = DateSelectionFieldBaseProps & DateSelectionProps & FieldTexts;
