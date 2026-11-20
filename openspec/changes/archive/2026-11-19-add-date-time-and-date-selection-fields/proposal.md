## Why

Forms need dates and times: a birth date, a meeting time, a stay from 1 to 27 August, or a set of separate days. The family has no date or time field.

- **shadcn's `Calendar`** (react-day-picker) has the look, but it is not a field.
  - It ships English texts: "Go to the Next Month", "Today, …", "…, selected", and weekday names from date-fns' English locale.
  - It has no typed input, no label, helper or error, and no form binding.
- **Native `<input type="date">`** looks different in each browser and cannot be styled or translated consistently.

## What Changes

- **New `DateTimeField`** (`@aureus-core/ui/components/date-time-field`): one value.
  - **`mode`:**
    - `"date"` (the default), a date with a calendar;
    - `"time"`, a time only, with no calendar;
    - `"datetime"`, a date with a calendar plus a time.
  - **Value:** a local ISO string with no time zone:
    - `"2026-08-01"`;
    - `"14:30"`, or `"14:30:15"` with seconds;
    - `"2026-08-01T14:30"`.

    It is `null` while the input is empty or incomplete. Controlled and uncontrolled.
  - **Input:** editable segments (day, month, year, hour, minute, second, day period).
    - **Order and separators** follow the locale.
    - **Each segment** is a spinbutton named by the browser's own locale data (`Intl.DisplayNames`).
    - **The calendar** opens in a popover from a button beside the segments.
  - **Locale:** `locale`, `hourCycle` (12/24, defaults to the locale's) and `weekStartsOn` (defaults to the locale's).
  - **Time:** `granularity` (`"minute"` or `"second"`), `minuteStep` and `secondStep`.
  - **Limits:** `min`/`max`, `isDateDisabled(date)` and `disabledDates`. The calendar disables those days, and the arrows never leave `min`/`max`.
  - **Presets:** `presets`, a list of `{ label, value }` shortcuts shown beside the calendar ("Today", "In a week"). The value can be a function, evaluated on click.
  - **Shared field behaviour:**
    - label, required mark, info, helper text, error with an optional message;
    - loading, disabled;
    - `classNames`, an optional `action`, `aria-label`/`aria-labelledby`;
    - `name` for native forms.
- **New `DateSelectionField`** (`@aureus-core/ui/components/date-selection-field`): several days in a calendar.
  - **`selection="range"`:**
    - the value is `{ from: string; to: string | null } | null`, with `to: null` while the end is being chosen;
    - two groups of segments (start and end) plus the calendar;
    - `minDays`/`maxDays` (inclusive day counts) and `excludeDisabled` (a range cannot cross blocked days).
  - **`selection="multiple"`:**
    - the value is a sorted `string[]`;
    - a button shows the summary (`Intl.ListFormat`, or `formatSummary`) and opens the calendar;
    - `maxSelected`.
  - **Shared with `DateTimeField`:** the same locale, limits, presets and field props.
- **New `DateTimeControl` and `DateSelectionControl`:** each field bound to the surrounding react-hook-form `FormProvider`. The form holds the same values.
- **No default texts:**
  - **Calendar fields** require `previousMonthLabel` and `nextMonthLabel`, plus `openCalendarLabel` when the calendar opens from a button beside segments (date modes and ranges; with several days the summary button opens it).
  - **A range** requires `startLabel` and `endLabel`.
  - **Presets** require `presetsLabel`.
  - **As in every field,** `loading` requires `loadingLabel` and `info` requires `infoLabel`.
  - **Every other text the calendar shows or announces comes from `Intl`:** captions, weekdays, day names and numerals. "Today" and "selected" are conveyed by `aria-current` and `aria-selected`, never by words.
- **Public helpers** from `@aureus-core/ui/components/date-time-field`:
  - `toDate` and `fromDate`, to and from a local `Date`;
  - `todayIso` and `addDaysIso`;
  - `isIsoDate`, `isIsoTime` and `isIsoDateTime`, for schemas.
- **Internal pieces:** ISO helpers, a segment engine, a localized calendar and a calendar popover in `src/internal/`.
- **Documentation:**
  - bilingual (EN/ES) Storybook pages and stories;
  - a section in the guide;
  - README;
  - JSDoc;
  - a `minor` changeset.

Non-goals:

- An always-visible (inline) calendar, and several months at once.
- Time zones: the values are local.
- A date range with times.
- Non-Gregorian calendars.
- Month or year dropdowns in the calendar: typing in the year segment is the fast way to jump far.
- New dependencies.
- Changing existing components.

## Capabilities

### New Capabilities

_None._

### Modified Capabilities

- `form-fields`: adds the requirements for the date and time fields and controls:
  - ISO values;
  - segments;
  - the localized calendar and its popover;
  - time and steps;
  - limits;
  - presets;
  - range and multiple selection;
  - texts;
  - accessibility;
  - both fields and both controls;
  - the public helpers.

## Impact

- **New code:**
  - `packages/ui/src/internal/utils/helpers/iso-date.ts`;
  - `packages/ui/src/internal/components/date-segments/`, `field-calendar/` and `field-popover/`;
  - `packages/ui/src/components/date-time-field/`, `date-time-control/`, `date-selection-field/` and `date-selection-control/`.
- **Reused:**
  - shadcn's `Calendar`, `Popover` and `Button` (no shadcn file is edited);
  - `FieldShell`, `FieldLoading`, `FieldInfo`, `FieldAction`, `ControlField`;
  - `useFieldA11y`, `useControllableState`, `useMissingTexts`, `useInheritedDirection`;
  - `mapControllerToValueField`, `FieldTexts`, `DistributiveOmit`;
  - `fieldFrameClassName`.
- **Dependencies:** none added. `react-day-picker` is already a dependency, and `date-fns` stays internal to it.
- **Package:** four new public entry points (30 custom components).
- **Release:** a `minor` changeset.
