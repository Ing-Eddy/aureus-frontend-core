import type { FocusEvent, ReactNode, Ref } from "react";
import type {
  FieldActionProps,
  FieldBaseProps,
  FieldClassNames,
  FieldTexts,
} from "@/internal/types";

/** A shortcut beside the calendar. */
export interface DateTimePreset {
  /** Content of the preset button. No default. */
  label: ReactNode;
  /** A value of the field's mode, or a function that returns one (for relative dates). */
  value: string | (() => string);
}

/** Extra parts of a date and time field that accept classes. */
export interface DateTimeFieldClassNames extends FieldClassNames {
  /** The row of segments. */
  segments?: string;
  /** Each segment. */
  segment?: string;
  /** The button that opens the calendar. */
  calendarButton?: string;
  /** The popover around the calendar. */
  popover?: string;
  /** The calendar. */
  calendar?: string;
  /** The group of presets. */
  presets?: string;
}

/** First day of the week, 0 (Sunday) to 6 (Saturday). */
export type WeekDay = 0 | 1 | 2 | 3 | 4 | 5 | 6;

/**
 * Props of `DateTimeField` shared by every mode. Every option is independent and opt-in, and there
 * are no default texts.
 */
export interface DateTimeFieldBaseProps extends Omit<FieldBaseProps, "classNames"> {
  /** Controlled value: an ISO string of the mode, or `null` while empty or incomplete. */
  value?: string | null;
  /** Initial value when uncontrolled. */
  defaultValue?: string | null;
  /** Called with each complete value, and with `null` when the input stops being complete. */
  onValueChange?: (value: string | null) => void;
  /** Locale of the segments, the calendar and every announced text. Defaults to the browser's. */
  locale?: string;
  /** Earliest value, an ISO string of the mode. Arrows and the calendar stay within it. */
  min?: string;
  /** Latest value, an ISO string of the mode. Arrows and the calendar stay within it. */
  max?: string;
  /** Name of the hidden input with the ISO value, for native forms. */
  name?: string;
  /** Id of the first segment. Generated when missing. */
  id?: string;
  /** Reaches the first segment. */
  ref?: Ref<HTMLSpanElement>;
  /** Called when focus leaves the field and its calendar. */
  onBlur?: (event: FocusEvent<HTMLDivElement>) => void;
  /** Accessible name of the segments when there is no `label`. */
  "aria-label"?: string;
  /** Ids of the elements that name the segments when there is no `label`. */
  "aria-labelledby"?: string;
  /** Extra ids describing each segment. */
  "aria-describedby"?: string;
  /** A button at the inline end of the frame. */
  action?: FieldActionProps;
  /** Extra classes per part. */
  classNames?: DateTimeFieldClassNames;
}

/** Options of the time segments. */
export interface DateTimeTimeProps {
  /** `12` (with a day period) or `24`. Defaults to the locale's. */
  hourCycle?: 12 | 24;
  /** `"minute"` (the default) or `"second"`, which adds a second segment and seconds to the value. */
  granularity?: "minute" | "second";
  /** How far the arrows move the minutes. Defaults to `1`. */
  minuteStep?: number;
  /** How far the arrows move the seconds. Defaults to `1`. */
  secondStep?: number;
}

/** No time segments. */
interface WithoutTime {
  /** Only allowed with `mode="time"` or `"datetime"`. */
  hourCycle?: never;
  /** Only allowed with `mode="time"` or `"datetime"`. */
  granularity?: never;
  /** Only allowed with `mode="time"` or `"datetime"`. */
  minuteStep?: never;
  /** Only allowed with `mode="time"` or `"datetime"`. */
  secondStep?: never;
}

/** Without presets. */
interface WithoutPresets {
  /** Shortcuts beside the calendar. Off by default. */
  presets?: undefined;
  /** Only allowed with `presets`. */
  presetsLabel?: never;
}

/** Presets and the name of their group. */
export type DateTimePresetTexts =
  | WithoutPresets
  | {
      /** Shortcuts beside the calendar. */
      presets: readonly DateTimePreset[];
      /** Accessible name of the group of presets. Required with `presets`. */
      presetsLabel: string;
    };

/** The calendar, its texts and the days it disables. */
export interface DateTimeCalendarProps {
  /** First day of the week in the calendar. Defaults to the locale's. */
  weekStartsOn?: WeekDay;
  /** ISO dates that cannot be chosen. */
  disabledDates?: readonly string[];
  /** Days that cannot be chosen, called with each ISO date. */
  isDateDisabled?: (date: string) => boolean;
  /** Accessible name of the button that opens the calendar. Required. */
  openCalendarLabel: string;
  /** Accessible name of the previous-month button. Required. */
  previousMonthLabel: string;
  /** Accessible name of the next-month button. Required. */
  nextMonthLabel: string;
}

/** A date with a calendar: the value is `YYYY-MM-DD`. */
export type DateTimeDateModeProps = {
  /** `"date"` (the default), `"time"` or `"datetime"`. */
  mode?: "date";
} & DateTimeCalendarProps &
  WithoutTime &
  DateTimePresetTexts;

/** A date with a calendar plus a time: the value is `YYYY-MM-DDTHH:mm[:ss]`. */
export type DateTimeDateTimeModeProps = {
  /** `"date"` (the default), `"time"` or `"datetime"`. */
  mode: "datetime";
} & DateTimeCalendarProps &
  DateTimeTimeProps &
  DateTimePresetTexts;

/** A time only, with no calendar: the value is `HH:mm[:ss]`. */
export type DateTimeTimeModeProps = {
  /** `"date"` (the default), `"time"` or `"datetime"`. */
  mode: "time";
  /** Only allowed with a calendar (`mode="date"` or `"datetime"`). */
  weekStartsOn?: never;
  /** Only allowed with a calendar. */
  disabledDates?: never;
  /** Only allowed with a calendar. */
  isDateDisabled?: never;
  /** Only allowed with a calendar. */
  openCalendarLabel?: never;
  /** Only allowed with a calendar. */
  previousMonthLabel?: never;
  /** Only allowed with a calendar. */
  nextMonthLabel?: never;
} & DateTimeTimeProps &
  WithoutPresets;

/** The three modes, with the props and texts each one requires. */
export type DateTimeModeProps =
  | DateTimeDateModeProps
  | DateTimeDateTimeModeProps
  | DateTimeTimeModeProps;

/**
 * Props of `DateTimeField`. A calendar (`mode` `"date"` or `"datetime"`) requires
 * `openCalendarLabel`, `previousMonthLabel` and `nextMonthLabel`; `presets` requires `presetsLabel`;
 * `loading` requires `loadingLabel` and `info` requires `infoLabel`. No text is generated: segment
 * names, captions, weekdays and day names come from `Intl` with `locale`.
 */
export type DateTimeFieldProps = DateTimeFieldBaseProps & DateTimeModeProps & FieldTexts;
