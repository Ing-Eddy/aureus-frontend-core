## Context

See proposal.md (Why) for the motivation, and the `form-fields` delta for the behaviour. This section covers what shapes the approach.

- **The calendar:** `react-day-picker` 10.0.2 is already a dependency, wrapped by shadcn's `Calendar` (`src/shadcn/ui/calendar.tsx`, which we never edit).
  - **English defaults:**
    - `labelNext` is "Go to the Next Month", and `labelPrevious` is "Go to the Previous Month";
    - `labelDayButton` adds "Today, " and ", selected";
    - `labelWeekday`, `formatCaption` and `formatWeekdayName` use date-fns' English locale unless a date-fns `Locale` is passed;
    - `labelNav` is already empty.
  - **State attributes:**
    - selected days get `aria-selected` on the `gridcell`;
    - disabled days get `disabled`;
    - nothing marks today with `aria-current`.
  - **Range mode:**
    - `addToRange` sets `to = from` on the first click;
    - `min`/`max` count nights (`differenceInCalendarDays`), not days.
- **The popover:** shadcn's `Popover` (Radix) is portaled. Its content has `role="dialog"`, and it returns focus to the trigger on close.
- **`Intl` in Node 24 and Chromium:** both have `DateTimeFormat#formatToParts`, `DisplayNames({ type: "dateTimeField" })` ("día", "mes", "año", "hora", "minuto", "segundo"), `Locale#getWeekInfo` and `ListFormat`.
  - **Order** from `formatToParts`: `es-ES` gives day/month/year, `en-US` month/day/year with `dayPeriod`, `ja-JP` year/month/day, `de-DE` uses "." separators.
  - **`ar-EG`** gives Arabic-Indic digits and U+200F marks inside the literals.
- **Building blocks:**
  - the field family: `FieldShell`, `useFieldA11y`, `useControllableState`, `useMissingTexts`/`fieldTextChecks`/`inputNameCheck`, `useInheritedDirection`;
  - the binding: `ControlField` + `mapControllerToValueField`;
  - the parity helpers in `internal/testing`;
  - loading follows the shared rule (input disabled, spinner at the inline end, value still submitted).

## Goals / Non-Goals

**Goals:**

- **One segment engine** used by every date and time input (single, datetime, both ends of a range), tested on its own.
- **No English text anywhere in the calendar,** checked by a unit test that renders it in `es-ES` and searches every text and accessible name.
- **Exact range semantics** (`{ from, to: null }`, inclusive day counts) that do not depend on day-picker's defaults.

**Non-Goals:**

- A public `Calendar` or `DateSegments` component. They stay internal until a second use appears.
- Parsing free text ("next Friday", "1/8"). Only segments and the calendar.
- Custom time pickers (lists of hours). The time is typed or stepped in segments.

## Decisions

### 1. Two families, typed by `mode` and `selection`

`DateTimeField` covers one value (`mode: "date" | "time" | "datetime"`). `DateSelectionField` covers several days (`selection: "range" | "multiple"`).

- **Why two:** one component with five value types would need a union of five shapes for `value`, `onValueChange`, the texts and the limits. Error messages would become unreadable, and options like `maxSelected` or `granularity` would only make sense in some branches.
- **What they share:** the internals, and the prop names.
- **Unions:**
  - `DateTimeField`'s props are a union over `mode`: `"time"` forbids the calendar texts, `presets`, `disabledDates` and `isDateDisabled` with `never`;
  - `DateSelectionField`'s props are a union over `selection`;
  - feature texts are added with the `FieldTexts` pattern (`presets` ⇒ `presetsLabel`).
- **Alternative rejected:** one `DateField` with `selection` and `mode`. It is easier to find, but the types fight it.

### 2. Values are local ISO strings, handled by `internal/utils/helpers/iso-date.ts`

The helpers are pure functions:

- **Parsing and checking:** `parseIsoDate`, `parseIsoTime` and `parseIsoDateTime` return parts or `null`, and check real days (leap years, month lengths).
- **Formatting:** `formatIsoDate` and `formatIsoTime(parts, granularity)`.
- **`Date` conversion:** `toLocalDate(iso)` and `fromLocalDate(date, mode, granularity)`.
- **Dates:** `compareIso`, `addDaysIso` and `daysBetweenInclusive`.
- **Limits and today:** `clampIso(value, min, max)` and `todayIso()`.

Every `Date` is built with `new Date(y, m - 1, d, h, min, s)`, and day arithmetic uses `setDate` on a date at 12:00. A daylight-saving change can then never move the day, and no `toISOString()` (UTC) is used.

The public `toDate`, `fromDate`, `todayIso`, `addDaysIso`, `isIsoDate`, `isIsoTime` and `isIsoDateTime` are thin re-exports from `date-time-field/utils/`, the same pattern as the file field's helpers.

- **Why strings:** they serialize as is (forms, URLs, JSON), compare with `<`, validate with zod, and have no time zone, so a birth date cannot shift by a day.
- **Alternative rejected:** `Date` objects. They carry a time and a zone, they need care in every comparison, and they are `Invalid Date` instead of `null`.

### 3. The segment engine: `internal/components/date-segments/`

**Layout (`segment-parts.ts`).**

- **Parts:** `segmentLayout(locale, { date, time, hourCycle, granularity })` formats a fixed reference date with `formatToParts`, using `year: "numeric"`, `month: "2-digit"`, `day: "2-digit"`, `hour: "2-digit"`, `minute`, `second`, and `hourCycle` mapped to `h12`/`h23`.
  - It keeps each part's type and each literal.
  - The U+200E/U+200F marks are stripped from literals, because the row is laid out left to right (see below).
  - It is cached per option set.
- **Numerals:** digits are shown with `Intl.NumberFormat(locale, { useGrouping: false, minimumIntegerDigits })`. A digit map built from formatting 0–9 lets typing accept both ASCII and locale digits.
- **Names and texts:** segment names come from `Intl.DisplayNames(locale, { type: "dateTimeField" })`. The month's `aria-valuetext` comes from `Intl.DateTimeFormat(locale, { month: "long" })`. The day period texts come from formatting 01:00 and 13:00.

**State (`use-date-segments.ts`).**

- **Shape:** `{ year, month, day, hour, minute, second, dayPeriod }`, each `number | null`, plus a typing buffer for the focused segment.
- **Derived value:** the ISO value, `null` until every needed segment is filled.
- **Syncing:** the hook stores the last value it emitted. An incoming `value` replaces the segments only when it differs from that value. A partial input is therefore never wiped by a controlled value that is still `null`, and a parent reset (to `null`, or to another date) still clears or replaces it.
- **Typing:**
  - **Digits:** each digit is appended to the buffer.
  - **Auto-advance:** focus moves on once the buffer has the segment's maximum length, or once `buffer * 10` is greater than the segment's maximum.
  - **Day clamp:** the day is reduced to the month's length once month and year are known.
  - **Arrows:** they wrap within the segment, and `minuteStep`/`secondStep` snap to the next multiple. When the result completes a value outside `[min, max]`, it is clamped (`clampIso`).
  - **Empty segments:** they start from now's part.

**Elements (`date-segments.tsx`).**

- **Group:** a `role="group"` with `dir="ltr"`, wrapped in an isolating span, so the locale's order reads left to right like digits. The frame, the button and the spinner around it follow the page's direction (`useInheritedDirection`).
- **Segments:** each is a `contentEditable` `<span role="spinbutton">` with `inputMode="numeric"` and `enterKeyHint="next"`, and React renders its text.
  - **Input:** typed characters are read from `beforeinput` (`event.data`), which also works on phone keyboards where `keydown.key` is `"Unidentified"`. The event is then cancelled, so the DOM never diverges from React.
  - **Keyboard:** arrows, Home/End, Backspace and Delete are handled on `keydown`.
- **Hidden input:** it holds the ISO value for native forms. It is disabled only when the field is disabled.
- **Why `contentEditable`:** a plain focusable span does not open the virtual keyboard on touch devices. One `<input>` per segment adds native selection and caret behaviour that fights the segment model. This is React Aria's proven approach.
- **Alternatives rejected:**
  - one masked `<input>`: the locale order and the per-segment spinbutton semantics are lost;
  - native `<input type="date">`: see proposal.md.

### 4. The localized calendar: `internal/components/field-calendar/`

`FieldCalendar` renders shadcn's `Calendar` with `captionLayout="label"`.

- **`calendar-intl.ts` builds the texts from the field's `locale`:**
  - formatters: `formatCaption` (`{ month: "long", year: "numeric" }`), `formatWeekdayName` (`{ weekday: "narrow" }`) and `formatDay` (`Intl.NumberFormat`);
  - labels: `labelGrid` (the caption), `labelWeekday` (`{ weekday: "long" }`), and `labelDayButton` (`{ dateStyle: "full" }`, nothing added for today or selected);
  - the props' `labelPrevious`/`labelNext`.
- **Today:** a `DayButton` override wraps `CalendarDayButton` and adds `aria-current="date"`.
- **No date-fns `Locale` is passed.** date-fns only does the arithmetic, and every visible or announced text goes through the formatters and labels above. The "no English" test (Goals) guards it.
- **`weekStartsOn`:** the prop, or `new Intl.Locale(locale).getWeekInfo?.() ?? .weekInfo` with `firstDay % 7`. When neither exists, it falls back to 0.
- **Limits:**
  - `min`/`max` become `startMonth`/`endMonth` and `{ before, after }` matchers;
  - `disabledDates` becomes a `Set`, and `isDateDisabled` is called with the ISO string;
  - `dir` comes from `useInheritedDirection`.
- **Month changes:** the opening month is derived from the value or the limits (spec). The calendar keeps its own `month` state while open, so presets and typing can move it.
- **Alternative rejected:** passing a date-fns locale. It would need date-fns locale imports per language, a new public dependency surface, and it still leaves `labelNext`/`labelDayButton` in English.

### 5. The popover: `internal/components/field-popover/`

`FieldPopover` takes the following parts:

- `anchor`, the field frame, so the popover lines up with the whole input;
- `trigger`, the calendar button or the summary button;
- `labelledBy`/`aria-label`;
- the calendar, and an optional `presets` slot.

How it works:

- **Elements:** it uses `Popover`, `PopoverAnchor`, `PopoverTrigger` and `PopoverContent` with `w-auto`.
- **Focus:**
  - **On open:** `onOpenAutoFocus` is prevented, and day-picker's `autoFocus` puts focus on the selected day, today or the first enabled day.
  - **On close:** focus returns to the trigger. `onCloseAutoFocus` is prevented only in datetime mode with an empty time, to focus the first time segment instead.
- **Presets (`presets-list.tsx`):** a `role="group"` named by `presetsLabel`, holding `Button variant="ghost"` items with `aria-pressed`. It sits in a column beside the calendar, and above it below the `sm` breakpoint.
- **Blur across the portal:** the field container and the popover content share a focus-within check. `onBlur` fires only when the newly focused element (`relatedTarget`) is outside both. The controls' `field.onBlur` therefore does not mark the field touched when the user simply opens the calendar.
- **Disabled and loading:** the trigger is disabled, so the popover cannot open.

### 6. Range and multiple logic of our own

`date-selection-field/utils/next-range.ts` is the pure function `nextRange(current, clicked, { minDays, maxDays, excludeDisabled, isDisabled })`, implementing the delta's rules exactly:

- the first click gives `{ from, to: null }`;
- a click before the start moves the start;
- after a complete range, a click starts over;
- `excludeDisabled` restarts at the clicked day.

The calendar runs in `mode="range"` (for the band, `aria-multiselectable` and the modifiers), but the result of `onSelect` is ignored, and its `triggerDate` goes through `nextRange`.

While a start is waiting for its end, ends outside `[from + minDays − 1, from + maxDays − 1]` are added to the `disabled` matcher. A `preview` modifier from `onDayMouseEnter` draws the hover band.

Multiple selection runs in `mode="multiple"` with our own toggle and sort. With `maxSelected` reached, every day that is not chosen is added to `disabled`.

- **Alternative rejected:** day-picker's `addToRange`. It gives `to = from` on the first click and counts `min`/`max` in nights, so 1–27 August would be "26".

### 7. Inputs of `DateSelectionField`

- **Range:** two `DateSegments` groups (named by `startLabel` and `endLabel`) sit in one frame, separated by an en dash (`aria-hidden`), plus the calendar button. They are wrapped in a group named by the label.
  - **Order:** a typed end before the start is emitted sorted immediately. The segments re-render sorted on the field's blur, so they never jump while the user types.
- **Multiple:** the frame is itself the `PopoverTrigger`, a `button` with `aria-labelledby` set to the label id plus the summary id.
  - **Summary:** `Intl.DateTimeFormat(locale, { dateStyle: "medium" })` joined by `Intl.ListFormat(locale, { type: "conjunction" })`, or `formatSummary`.
  - **Long lists:** they truncate with an ellipsis; the full text stays in the accessible name.
- **Hidden inputs:** `name[from]` and `name[to]` for a range, and one `name[]` per day for multiple.

### 8. The frame

The segments sit in shadcn's `InputGroup`, so the height, border, radius and invalid styles match the other fields.

- **Focus ring:** because the focusable elements are spinbuttons, not an `input-group-control`, the frame adds `has-[[role=spinbutton]:focus-visible]` ring classes next to `fieldFrameClassName`.
- **Disabled look:** it is keyed on the group's `aria-disabled`.
- **Addons:** the calendar button (`Button size="icon-sm" variant="ghost"`, `CalendarIcon` from lucide) and the `FieldLoading` spinner sit in the inline-end `InputGroupAddon`, followed by the `FieldAction` when given.
- **Segment styles:** each segment is `rounded-sm px-0.5 tabular-nums`, with `focus:bg-accent` and a `data-placeholder` muted colour. In narrow frames the segments wrap between segments (the frame grows), so none is hidden or scrolled away at 320 px.

### 9. Controls

`DateTimeControl` and `DateSelectionControl` follow `SliderControl`:

- **Binding:** `ControlField` + `mapControllerToValueField(context, { onValueChange, ref }, emptyValue)`, with `emptyValue` `null`, or `[]` for multiple.
- **Blur:** `onBlur` is composed from the field's own focus-leave event (decision 5).
- **`ref`:** it reaches the first segment or the summary button, so `shouldFocusError` lands there.

### 10. Folder layout

```
internal/utils/helpers/iso-date.ts, iso-date-tests.ts
internal/components/date-segments/   index.ts, date-segments.tsx, use-date-segments.ts, segment-parts.ts, date-segments-tests.tsx, segment-parts-tests.ts
internal/components/field-calendar/  index.ts, field-calendar.tsx, calendar-intl.ts, field-calendar-tests.tsx
internal/components/field-popover/   index.ts, field-popover.tsx, presets-list.tsx, field-popover-tests.tsx
components/date-time-field/          index.ts, date-time-field.tsx, types/, hooks/ (use-date-time-value, use-date-time-warnings), utils/ (public helpers), tests/
components/date-time-control/        index.ts, date-time-control.tsx, types/, tests/
components/date-selection-field/     index.ts, date-selection-field.tsx, types/, hooks/ (use-range-value, use-multiple-value, use-date-selection-warnings), components/ (range-inputs, selection-summary), utils/ (next-range, format-summary), tests/
components/date-selection-control/   index.ts, date-selection-control.tsx, types/, tests/
```

- **`internal/`:** the segment engine, the calendar and the popover serve both families, so they go there by category, as `slider-base` did.
- **Inside each family:** the range and summary logic stays in its family, because nothing else uses it.

## Risks / Trade-offs

- **[`contentEditable` quirks]** IME composition, autocorrect and spellcheck can insert text.
  → `spellCheck={false}`, `autoCorrect="off"` and `autoCapitalize="off"` are set. Composition events are cancelled. Every `beforeinput` is prevented and read only for its data. Chromium stories type on segments, and jsdom tests fire `beforeinput`.
- **[`Intl.DisplayNames`/`getWeekInfo` missing in an old browser]** `getWeekInfo` falls back to `weekInfo`, then to Sunday. `DisplayNames` has been in every evergreen browser since 2021.
  → It is documented as a requirement. When it is missing, a development warning names it, and the segment has no name.
- **[The segments are always left to right in RTL pages]** In Arabic or Hebrew forms, some users may expect day/month/year to mirror.
  → It matches how numeric dates are written and what React Aria does. The frame and button still mirror, and the RTL story shows it.
- **[Typed values are not clamped to the limits]** A user can type a date outside `min`/`max`, or a range longer than `maxDays`.
  → This is deliberate: the schema reports it with the field's message, as with the other fields. The calendar and the arrows cannot produce such values. It is documented in the guide.
- **[day-picker internals]** Ignoring `onSelect`'s computed range relies on `triggerDate` staying in the callback signature.
  → It is pinned by `^10`, and unit tests cover the 1–27 August flow end to end.
- **[shadcn's `Calendar` remounts its days on every render]** It declares `Root`, `Chevron` and `WeekNumber` inline, so each re-render (a hover preview, a toggled day) gives them a new identity and remounts every day button: focus and the pointer target are lost.
  → `FieldCalendar` passes stable components with the same markup through `components`, which shadcn spreads last. A unit test checks that a day button keeps its identity across renders.
- **[The calendar's own background in the popover]** shadcn makes the calendar transparent only inside its own popover slot, and `FieldPopoverContent` renames that slot to `field-popover`.
  → `FieldCalendar` adds `bg-transparent`, so the calendar matches the popover in both themes.
- **[Portaled popover in tests]** Focus checks across the portal are fragile in jsdom.
  → Focus on open and close is checked in the Chromium stories. Unit tests check the blur logic with explicit `relatedTarget`s.

## Migration Plan

This change is additive: four new entry points and no change to the existing ones. Rolling back means removing the folders and the changeset.
