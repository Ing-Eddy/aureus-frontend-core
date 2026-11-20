## ADDED Requirements

### Requirement: Date and time values
A date or time field SHALL hold local ISO strings with no time zone:

| Value | Format | Example |
| --- | --- | --- |
| date | `YYYY-MM-DD` | `"2026-08-01"` |
| time | `HH:mm`, or `HH:mm:ss` with `granularity="second"` | `"14:30"`, `"14:30:15"` |
| date and time | `YYYY-MM-DDTHH:mm[:ss]` | `"2026-08-01T14:30"` |
| range | `{ from: date; to: date \| null }` | `{ from: "2026-08-01", to: "2026-08-27" }` |
| several days | a sorted `date[]` with no duplicates | `["2026-08-01", "2026-08-05"]` |

- **Incomplete input:**
  - a single value MUST be `null` while its input is empty or incomplete, and a value MUST be emitted only when it is complete and a real calendar date;
  - a range MUST be `null` without a start, and `{ from, to: null }` while only the start is complete.
- **Changes:** every field MUST work controlled (`value`/`onValueChange`) and uncontrolled (`defaultValue`).
  - An incomplete input MUST NOT be cleared because the controlled value is still `null`.
  - A new controlled value MUST replace what is shown.
- **Hours:** times MUST always use the 24-hour clock in the value, whatever the hour cycle shown.
- **Invalid values:** a controlled or default value that is not valid for the field's mode MUST be shown as empty, and a development warning MUST name it.

#### Scenario: Value only when complete
- **WHEN** a user types day and month in an empty date field with `locale="es-ES"` and has not typed the year
- **THEN** `onValueChange` has not been called with a date; after typing "2026" it is called once with `"2026-08-01"`

#### Scenario: Controlled reset
- **WHEN** a controlled date field showing `"2026-08-01"` receives `value={null}`
- **THEN** every segment is empty

### Requirement: Date segments
A date or time input SHALL be a group of editable segments: day, month, year, hour, minute, second and day period, as the mode needs.

- **Locale:**
  - the order, separators and numerals MUST follow `locale` (for example day/month/year in `es-ES`, month/day/year in `en-US`, year/month/day in `ja-JP`);
  - `locale` defaults to the browser's.
- **Empty segments:** an empty segment MUST show a placeholder made of dashes, never words.
- **Typing:**
  - digits fill the focused segment;
  - focus MUST move to the next segment once the segment is complete, or once no further digit could give a valid value (for example "4" in the month segment);
  - the day period is chosen by typing the first letter of the locale's own text for it;
  - Backspace and Delete clear the focused segment, and Backspace in an empty segment moves to the previous one.
- **Arrows:**
  - ArrowUp and ArrowDown change the focused segment by one step and wrap within it (for example December to January), without changing the other segments;
  - an empty segment starts at the current date's or time's part.
- **Moving between segments:**
  - ArrowLeft and ArrowRight move to the segment on that side;
  - Home and End go to the segment's lowest and highest values;
  - Tab leaves the group after the last segment.
- **Real dates:** a day beyond the length of the chosen month MUST be reduced to the month's last day once month and year are known (31 → 30 in April, 29 → 28 in February 2027).
- **Native forms:** with `name`, the field MUST submit its ISO value from a hidden input, or an empty string while it has none.
- **Narrow frames:** a long value MUST wrap between its date and its time instead of hiding segments; neither part is split across lines.

#### Scenario: Order per locale
- **WHEN** a date field renders with `locale="en-US"` and with `locale="es-ES"`
- **THEN** the segments read month, day, year in the first and day, month, year in the second, with the locale's separators

#### Scenario: Auto-advance
- **WHEN** a user focuses the month segment of an `es-ES` date field and types "4"
- **THEN** the month is April and focus is on the year segment

#### Scenario: February clamp
- **WHEN** a date field shows 31/01/2027 and the user presses ArrowUp in the month segment
- **THEN** it shows 28/02/2027 and emits `"2027-02-28"`

### Requirement: Localized calendar
The calendar of a date field SHALL show and announce only texts from `Intl` with the field's `locale`, or from the field's props.

- **`Intl` texts:**
  - the month caption, weekday names and day numbers;
  - each day's accessible name, which MUST be the full formatted date only.
- **States:**
  - today MUST be marked with `aria-current="date"`;
  - the chosen days MUST be marked with `aria-selected="true"`;
  - no English word ("Today", "selected", "Go to the Next Month") may appear in the calendar's text or accessible names.
- **Navigation:** the previous- and next-month buttons are named by `previousMonthLabel` and `nextMonthLabel`.
- **`weekStartsOn`:**
  - defaults to the locale's first day of the week;
  - falls back to Sunday when the browser cannot tell.
- **Opening month:** the calendar MUST open at the month of the chosen date (the start of a range, the first of several days). Without one, it opens at the current month, moved into `[min, max]` when that month is outside.
- **Keyboard and direction:** the day grid MUST be keyboard-navigable (arrows, PageUp/PageDown for months, Home/End for the week), and it follows the page's direction.

#### Scenario: Spanish calendar
- **WHEN** the calendar of a date field with `locale="es-ES"` opens in August 2026
- **THEN** the caption reads "agosto de 2026", the week starts on Monday, the 1 August button's name is the date formatted by `Intl.DateTimeFormat("es-ES", { dateStyle: "full" })`, and no English text is present

### Requirement: Calendar popover
A field with a calendar SHALL open it in a popover: from a button at the end of its segments, or, with several days, from the summary button itself.

- **Names:**
  - the button beside the segments is named by `openCalendarLabel`; both buttons expose `aria-haspopup="dialog"` and `aria-expanded`;
  - the popover is a dialog named by the field's label (or by `aria-label`/`aria-labelledby`).
- **Focus:** on opening, focus MUST move to the chosen day, or to today, or to the first enabled day.
- **Closing:**
  - Escape and a click outside close the popover, and focus returns to the button;
  - choosing a day closes it in date mode and when a range is complete;
  - with several days, it stays open until Escape or a click outside.
- **Date and time:** choosing a day in `"datetime"` mode sets the date part and keeps the time part. If the time is empty, focus moves to the first time segment.
- **Disabled and loading:** a disabled or loading field MUST NOT open the popover.

#### Scenario: Pick a day
- **WHEN** a user opens the calendar of an empty date field and presses Enter on 12 August 2026
- **THEN** the popover closes, the segments show that date, `"2026-08-12"` is emitted, and focus is on the calendar button

### Requirement: Time options
A field with a time SHALL support:

- **`hourCycle`:**
  - `12` shows hours 1–12 with a day period segment;
  - `24` shows 0–23;
  - it defaults to the locale's.
- **`granularity`:** `"minute"` (the default) or `"second"`. Only `"second"` shows a second segment and adds seconds to the value.
- **Steps:**
  - `minuteStep` and `secondStep` (1 by default) set how far ArrowUp and ArrowDown move those segments;
  - from a value off the step, an arrow moves to the next multiple of the step;
  - typed values are kept as typed.

#### Scenario: Twelve-hour input
- **WHEN** a time field with `hourCycle={12}` shows 2:30 PM and the user types "a" in the day period segment
- **THEN** it shows 2:30 AM and emits `"02:30"`

#### Scenario: Minute step
- **WHEN** a time field with `minuteStep={15}` shows 10:07 and the user presses ArrowUp in the minute segment
- **THEN** it shows 10:15

### Requirement: Date limits
A date field SHALL accept limits on the days and values that can be chosen:

- `min` and `max`, ISO values of the field's mode;
- `disabledDates`, a list of ISO dates;
- `isDateDisabled(date)`, called with each ISO date.

Their effect:

- **Calendar:** days outside `[min, max]`, listed or matched MUST be disabled and cannot be chosen, and the month buttons MUST NOT go to months with no day inside the limits.
- **Arrows:** a segment arrow that would complete a value outside `[min, max]` MUST stop at the nearest limit.
- **Typing:** typed values are emitted as typed, so a schema decides whether they are valid.
- **Times:** in `"datetime"` mode, a day that is only partly inside the limits stays enabled.

#### Scenario: Blocked weekends
- **WHEN** a date field has `isDateDisabled={(d) => [0, 6].includes(toDate(d).getDay())}` and its calendar is open
- **THEN** every Saturday and Sunday is disabled and cannot be chosen with the pointer or the keyboard

#### Scenario: Arrows stop at the limit
- **WHEN** a date field with `min="2026-08-10"` shows 10/08/2026 and the user presses ArrowDown in the day segment
- **THEN** the value stays `"2026-08-10"`

### Requirement: Date presets
A field with a calendar SHALL accept `presets`, a list of `{ label, value }`. Each `value` is a value of the field, or a function that returns one. A function MUST be called when the preset is chosen, and MAY also be called while the popover is open to mark the pressed preset, so relative presets stay current.

- **Placement:** the presets MUST be shown in the popover, beside the calendar (above it in narrow viewports), as buttons in a group named by `presetsLabel`.
- **Choosing a preset:** it sets the value, moves the calendar to it and closes the popover.
- **Pressed state:** a preset whose value equals the current value is marked `aria-pressed="true"`.
- **Time-only fields:** `mode="time"` MUST NOT accept presets.

#### Scenario: Range preset
- **WHEN** a user opens a range field with the preset `{ label: "Próximos 7 días", value: () => ({ from: todayIso(), to: addDaysIso(todayIso(), 6) }) }` and presses it
- **THEN** the value is the seven days from today, and the popover closes

### Requirement: Date range selection
`DateSelectionField` with `selection="range"` SHALL choose a start and an end day.

- **Input:** two groups of date segments, named by `startLabel` and `endLabel`, inside one frame with the calendar button.
- **Calendar:**
  - the first day chosen is the start (the value is `{ from, to: null }`), and the second is the end;
  - a second day before the start becomes the new start;
  - with a complete range, the next day starts a new range;
  - the days between start and end are shown as a band, and the hovered day previews the end.
- **Order:** the value MUST always have `from <= to`. A typed end before the start is emitted sorted, and the segments show the sorted range once focus leaves the field.
- **Length:** `minDays` and `maxDays` count both ends (1 to 27 August is 27 days).
  - In the calendar, ends that would break them MUST be disabled. The start itself and the days before it stay enabled, because choosing one starts the range again.
  - Typed ranges are emitted as typed.
- **Blocked days:** with `excludeDisabled`, a range MUST NOT contain a disabled day. Choosing an end beyond one starts a new range at that end.

#### Scenario: 1 to 27 August
- **WHEN** a user opens an empty range field and chooses 1 August 2026, then 27 August 2026
- **THEN** `onValueChange` is called with `{ from: "2026-08-01", to: null }`, then with `{ from: "2026-08-01", to: "2026-08-27" }`, and the popover closes

#### Scenario: Maximum length
- **WHEN** a range field with `maxDays={7}` has the start 1 August 2026 and its calendar is open
- **THEN** 8 August is enabled and 9 August is disabled

### Requirement: Multiple date selection
`DateSelectionField` with `selection="multiple"` SHALL choose any set of separate days.

- **Calendar:** choosing a day adds it, or removes it when it is already chosen. The value stays sorted.
- **Limit:** with `maxSelected`, once that many days are chosen the other days MUST be disabled until one is removed.
- **Input:** a button that opens the calendar and shows the summary of the chosen days:
  - by default, each date formatted with `Intl.DateTimeFormat(locale, { dateStyle: "medium" })`, joined by `Intl.ListFormat(locale)`;
  - `formatSummary(dates)` replaces that text;
  - with no days, it shows `placeholder` when given, and nothing otherwise.

  The button is named by the field's label and the summary.
- **Native forms:** with `name`, each day is submitted as `name[]`.

#### Scenario: Several days
- **WHEN** a user chooses 9, 1 and 5 August 2026 in a multiple field with `locale="es-ES"`
- **THEN** the value is `["2026-08-01", "2026-08-05", "2026-08-09"]` and the summary is the `Intl.ListFormat("es-ES")` list of the three formatted dates ("1 ago 2026, 5 ago 2026 y 9 ago 2026")

#### Scenario: Maximum count
- **WHEN** a multiple field with `maxSelected={2}` has two days chosen
- **THEN** every other day is disabled, and the chosen days can still be removed

### Requirement: Date field texts
The date and time fields SHALL ship no texts of their own. The texts a feature needs MUST be required by the props' TypeScript types while it is on, and a development warning MUST name a missing one at runtime:

| Feature | Requires |
| --- | --- |
| every field | nothing: the input is named by `label`, `aria-label` or `aria-labelledby` (a warning when none is given) |
| a calendar (`DateTimeField` in `"date"` or `"datetime"` mode, every `DateSelectionField`) | `previousMonthLabel`, `nextMonthLabel` |
| a calendar button beside segments (`DateTimeField` with a calendar, `selection="range"`) | `openCalendarLabel` |
| `selection="range"` | `startLabel`, `endLabel` |
| `presets` | `presetsLabel` |
| `loading` / `info` | `loadingLabel` / `infoLabel` |

Segment names, captions, weekdays, day names and the summary of several days MUST come from `Intl` with the field's `locale`. Preset labels and `placeholder` are the consumer's content.

#### Scenario: Calendar without texts
- **WHEN** a developer writes `<DateTimeField label="Fecha" />` without `openCalendarLabel`, `previousMonthLabel` and `nextMonthLabel`
- **THEN** TypeScript reports an error

#### Scenario: Time needs no calendar texts
- **WHEN** a developer writes `<DateTimeField label="Hora" mode="time" />`
- **THEN** TypeScript reports no error, and no warning is logged

### Requirement: Date field accessibility
- **Segments:**
  - each segment MUST be a `role="spinbutton"` with `aria-valuemin`, `aria-valuemax`, and an `aria-valuenow` and `aria-valuetext` in the locale (both absent while empty; the month's text is its name);
  - each segment is named by the segment's name from `Intl.DisplayNames(locale, { type: "dateTimeField" })` ("día", "mes", "año", "hora"…);
  - the segments of one value form a `role="group"` named by the field's label (by `startLabel` and `endLabel` in a range, inside a group named by the label).
- **Description and state:** each segment MUST be described by the helper text and info and carry `aria-required` and `aria-invalid` (ARIA does not allow `aria-required` on a group). The group MUST carry `aria-disabled` and `aria-busy` as the field's state.
- **Numerals and direction:** digits are shown in the locale's numbering system. The segments are laid out in the locale's order from left to right, as digits are, also in right-to-left pages, while the rest of the frame follows the page's direction.
- **Touch and motion:** every target MUST be at least 24×24 CSS pixels (44 on coarse pointers), and transitions MUST respect reduced motion.

#### Scenario: Named segments
- **WHEN** a date field with `label="Nacimiento"` and `locale="es-ES"` renders
- **THEN** there is a group named "Nacimiento" with three spinbuttons named "día", "mes" and "año"

### Requirement: Date time field
`DateTimeField` SHALL be exported from `@aureus-core/ui/components/date-time-field`, together with its public types and the date helpers.

- **Shared props:** it supports `label`, `required`, `info`, `helperText`, `error`, `errorMessage`, `loading`, `disabled`, `className`, `classNames`, `action`, `aria-label` and `aria-labelledby`.
- **`mode`:** `"date"` (the default), `"time"` or `"datetime"`. Only modes with a date have a calendar.
- **Disabled:** the segments and the calendar button MUST be disabled, and the value is not submitted.
- **Loading:** the segments and the calendar button are disabled, and a spinner is shown at the inline end of the frame. The value is still submitted.
- **`ref`:** reaches the first segment.
- **`onBlur`:** called when focus leaves the field, including the popover. Moving into the popover is not leaving the field.

#### Scenario: Three modes
- **WHEN** a `DateTimeField` renders with `mode="date"`, `mode="time"` and `mode="datetime"`
- **THEN** the first shows date segments and a calendar button, the second only time segments, and the third date and time segments and a calendar button

### Requirement: Date selection field
`DateSelectionField` SHALL be exported from `@aureus-core/ui/components/date-selection-field`, together with its public types.

- **`selection`:** required, `"range"` or `"multiple"`. The value type follows it.
- **Shared props:** it supports the same shared props, limits, `locale`, `weekStartsOn` and `presets` as `DateTimeField`, with the same disabled and loading behaviour.
- **`ref`:** reaches the first segment of a range, or the button of several days.
- **`onBlur`:** called when focus leaves the field, including the popover.

#### Scenario: Disabled multiple field
- **WHEN** a `DateSelectionField` with `selection="multiple"` is `disabled`
- **THEN** its button is disabled and the calendar cannot be opened

### Requirement: Date time control bound to the form context
`DateTimeControl` SHALL be exported from `@aureus-core/ui/components/date-time-control`. It MUST read the form from the surrounding `FormProvider` and take only `name`, `disabled` and `shouldUnregister`, plus the field's props except `value`, `defaultValue`, `error` and `errorMessage`.

- **Stored value:** the form MUST store the ISO string, or `null` while the input is empty or incomplete. A missing form value MUST behave as `null`.
- **Validation:** the schema's message MUST be shown as the helper text.
- **Focus on error:** `shouldFocusError` MUST focus the first segment.
- **Parity:** with the same props, the control MUST render the same markup as `DateTimeField`.

#### Scenario: Required meeting time
- **WHEN** a form with `meeting: z.string().refine(isIsoDateTime, "Elige fecha y hora.")` is submitted while the field has only a date
- **THEN** the message is shown below the field, the group has `aria-invalid="true"`, and the first segment receives focus

### Requirement: Date selection control bound to the form context
`DateSelectionControl` SHALL be exported from `@aureus-core/ui/components/date-selection-control`. It MUST take the same form props as `DateTimeControl`.

- **Stored value:** the form MUST store the range (or `null`), or the list of days. A missing form value MUST behave as `null` for a range and as `[]` for several days.
- **Validation:** the schema's message MUST be shown as the helper text.
- **Focus on error:** `shouldFocusError` MUST focus the first segment of a range, or the button of several days.
- **Parity:** with the same props, the control MUST render the same markup as `DateSelectionField`.

#### Scenario: Range end missing
- **WHEN** a form with `stay: z.object({ from: z.string(), to: z.string().nullable() }).refine((r) => r.to !== null, "Elige la fecha de salida.")` is submitted with only the start chosen
- **THEN** the message is shown below the field and the start segments receive focus

### Requirement: Date helpers
`@aureus-core/ui/components/date-time-field` SHALL export pure helpers for the ISO values:

- **`toDate(iso)`:** a local `Date` for a date, time or date-and-time value (a time uses today's date), or `null` when the value is invalid.
- **`fromDate(date, mode, granularity?)`:** the ISO value of a `Date` in local time for `"date"`, `"time"` or `"datetime"`.
- **`todayIso()`:** today's local date.
- **`addDaysIso(date, days)`:** a date moved by calendar days, also across daylight-saving changes and month ends.
- **`isIsoDate`, `isIsoTime` and `isIsoDateTime`:** `true` only for well-formed values of real dates and times (with or without seconds).

No helper may use UTC conversions that change the local date.

#### Scenario: No time-zone drift
- **WHEN** `fromDate(toDate("2026-03-29"), "date")` runs in a time zone with a daylight-saving change on that day
- **THEN** the result is `"2026-03-29"`

#### Scenario: Invalid date
- **WHEN** `isIsoDate("2027-02-29")` is called
- **THEN** it returns `false`
