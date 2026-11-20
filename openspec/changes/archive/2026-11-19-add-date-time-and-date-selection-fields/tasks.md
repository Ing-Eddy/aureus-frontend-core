## 1. ISO helpers

- [x] 1.1 Write `internal/utils/helpers/iso-date.ts` (design decision 2) and export it from the helpers barrel. Verify with `iso-date-tests.ts`:
  - parsing and checking for leap years (`2028-02-29` valid, `2027-02-29` invalid), month ends and malformed strings;
  - `HH:mm` and `HH:mm:ss`;
  - the `Date` round trip with no drift, including a daylight-saving day (`TZ=Europe/Madrid`, 2026-03-29 and 2026-10-25);
  - `addDaysIso` across month and year ends;
  - `daysBetweenInclusive("2026-08-01", "2026-08-27") === 27`;
  - `clampIso` and `compareIso`.

## 2. Segment engine

- [x] 2.1 Write `internal/components/date-segments/segment-parts.ts` (design decision 3). Verify with `segment-parts-tests.ts`:
  - segment order and separators for `es-ES`, `en-US`, `ja-JP` and `de-DE`;
  - `hourCycle` 12 adds `dayPeriod`, and `granularity` `"second"` adds `second`;
  - names from `Intl.DisplayNames` ("día", "mes", "año");
  - Arabic-Indic digits for `ar-EG`, and the digit map accepting ASCII and locale digits;
  - bidi marks stripped from literals.
- [x] 2.2 Write `use-date-segments.ts`. Verify with unit tests:
  - typing with auto-advance ("4" in the month);
  - the day clamp (31 → 30 in April, 29 → 28 in February 2027);
  - arrows wrapping, starting from now's part when empty, and following `minuteStep`/`secondStep`;
  - arrows clamped to `min`/`max`;
  - `null` until complete;
  - a controlled value replaces the segments only when it differs from the last one emitted (a partial input survives `value={null}`, while a reset from a value clears it);
  - the day period chosen by the locale's first letter.
- [x] 2.3 Write `date-segments.tsx` and `index.ts`, and export them from `internal/components`. The pieces:
  - the `role="group"`, `dir="ltr"` row;
  - the `contentEditable` spinbuttons with `beforeinput`;
  - Backspace and Delete;
  - Left/Right/Home/End;
  - the hidden input;
  - `ref` to the first segment.

  Verify with `date-segments-tests.tsx`:
  - the spinbutton roles, names, `aria-valuenow`/`aria-valuetext` (the month's name, both absent when empty), and the dashed placeholders;
  - typing through `beforeinput` (and `keydown` for keys);
  - Backspace in an empty segment moves back;
  - the hidden input's value is the ISO string or empty, and it is disabled only when the field is disabled;
  - axe passes.

## 3. Calendar and popover

- [x] 3.1 Write `internal/components/field-calendar/` (`calendar-intl.ts`, `field-calendar.tsx`, `index.ts`), as in design decision 4. Verify with `field-calendar-tests.tsx`:
  - the `es-ES` caption "agosto de 2026" and the Monday start;
  - day button names equal `Intl.DateTimeFormat("es-ES", { dateStyle: "full" })`;
  - `aria-current="date"` on today and `aria-selected` on chosen days;
  - the month buttons are named by the props;
  - no English: walk every text node and `aria-label`, and find none of "Today", "selected", "Go to", "Monday" or "August";
  - `min`/`max`, `disabledDates` and `isDateDisabled` disable days and stop the navigation;
  - the opening month follows the value, otherwise today clamped into the limits;
  - `weekStartsOn` overrides the locale.
- [x] 3.2 Write `internal/components/field-popover/` (`field-popover.tsx`, `presets-list.tsx`, `index.ts`), as in design decision 5. Verify with `field-popover-tests.tsx`:
  - the trigger has `aria-haspopup="dialog"` and `aria-expanded`;
  - the dialog is named by the label id or `aria-label`;
  - the trigger is disabled with `disabled`/`loading`;
  - the presets group is named by `presetsLabel`, with `aria-pressed` on the matching preset and function values evaluated on click;
  - the shared blur check fires `onBlur` only when `relatedTarget` is outside both the field and the popover.

## 4. `DateTimeField`

- [x] 4.1 Write `date-time-field/types/` (decision 1) with JSDoc stating there are no default texts. Verify with `typecheck`. It contains:
  - the `mode` union, where `"time"` forbids the calendar texts, `presets`, `disabledDates` and `isDateDisabled`;
  - the time props (`hourCycle`, `granularity`, `minuteStep`, `secondStep`);
  - the limits;
  - `DateTimePreset`;
  - `DateTimeFieldClassNames` (`frame`, `segments`, `segment`, `calendarButton`, `popover`, `calendar`, `presets`);
  - `FieldTexts`.
- [x] 4.2 Write `hooks/use-date-time-value.ts` (the controlled or uncontrolled value, with invalid values shown empty; the datetime merge after a calendar pick goes through the single segment group's `setDate`) and `hooks/use-date-time-warnings.ts`. Verify with unit tests:
  - the warnings: a missing accessible name, the calendar texts, `presetsLabel`, `loadingLabel` and `infoLabel`, and an invalid `value`, `defaultValue`, `min` or `max`, each named once with the `DateTimeField:` prefix;
  - nothing is logged for a complete `mode="time"` field.
- [x] 4.3 Write `date-time-field.tsx`, `index.ts` and `utils/` (the public helpers re-exported, decision 2). The pieces:
  - the frame (decision 8);
  - the calendar button and popover in the date modes;
  - focus to the first time segment after picking a day with an empty time;
  - loading, disabled, `action`, `onBlur` and `ref`.

  Verify with `typecheck` and a smoke render of the three modes.
- [x] 4.4 Write `date-time-field/tests/`. Verify the spec scenarios:
  - **a11y:** "Named segments", segment state (`aria-required`, `aria-invalid`), group state (`aria-disabled`, `aria-busy`) and description, and axe;
  - **value:** "Value only when complete", "Controlled reset", "February clamp" and a native form submission;
  - **keyboard:** "Order per locale", "Auto-advance", "Twelve-hour input" and "Minute step";
  - **calendar:** "Pick a day", the datetime merge, and "Blocked weekends";
  - **limits:** "Arrows stop at the limit", and typed values not clamped;
  - **presets:** the value set and the popover closed;
  - **independence:** each extra (`presets`, limits, `granularity`, steps, `hourCycle`, `action`) changes nothing else;
  - **types:** one `@ts-expect-error` per rule (calendar texts missing, `presets` without `presetsLabel`, `presets` or `isDateDisabled` with `mode="time"`, `loading` without `loadingLabel`), plus "Time needs no calendar texts";
  - **helpers:** "No time-zone drift" and "Invalid date".

## 5. `DateTimeControl`

- [x] 5.1 Write `date-time-control/` (`date-time-control.tsx`, `date-time-control-types.ts`, `index.ts`, like the other controls' trivial types), as in decision 9. Verify with `typecheck`.
- [x] 5.2 Write `date-time-control/tests/`. Verify:
  - the form stores the ISO string or `null`, and a missing value behaves as `null`;
  - "Required meeting time" (message, `aria-invalid`, first segment focused);
  - opening the calendar does not mark the field touched;
  - parity with `DateTimeField` in the three modes via `internal/testing`;
  - `@ts-expect-error` on `value`, `defaultValue` and `error`.

## 6. `DateSelectionField`

- [x] 6.1 Write `date-selection-field/utils/next-range.ts` and `utils/format-summary.ts` (decisions 6 and 7). Verify with unit tests:
  - `nextRange`: first click, a click before the start, restart after a complete range, `minDays`/`maxDays` inclusive, `excludeDisabled` restarting at the clicked day;
  - the summary in `es-ES` and `en-US`, and `formatSummary` winning.
- [x] 6.2 Write `date-selection-field/types/`. Verify with `typecheck`. It contains:
  - the `selection` union, where range requires `openCalendarLabel`, `startLabel` and `endLabel`, and multiple forbids them and has `maxSelected`, `formatSummary` and `placeholder`;
  - `DateRangeValue`;
  - `DateSelectionPreset`;
  - `DateSelectionFieldClassNames`;
  - `FieldTexts`.
- [x] 6.3 Write `hooks/` (`use-range-value`, `use-multiple-value`, `use-date-selection-warnings`), `components/` (`range-inputs.tsx`, `selection-summary.tsx`), `date-selection-field.tsx` and `index.ts`. The pieces:
  - the range ends disabled while waiting for the end;
  - the hover preview;
  - sorted emission, with the segments re-sorted on blur;
  - `maxSelected` disabling;
  - the hidden inputs `name[from]`, `name[to]` and `name[]`.

  Verify with `typecheck` and a smoke render of both selections.
- [x] 6.4 Write `date-selection-field/tests/`. Verify the spec scenarios:
  - **range:** "1 to 27 August", "Maximum length", the typed inverted range, and `excludeDisabled`;
  - **multiple:** "Several days", "Maximum count", and `placeholder`;
  - "Range preset";
  - "Disabled multiple field";
  - **a11y:** the range group named by the label with start and end groups, the summary button named by label and summary, and axe;
  - native form submission;
  - **independence:** each extra changes nothing else;
  - **types:** `@ts-expect-error` for a range without `startLabel`/`endLabel`, `maxSelected` with range, and the calendar texts missing.

## 7. `DateSelectionControl`

- [x] 7.1 Write `date-selection-control/` (`date-selection-control.tsx`, `date-selection-control-types.ts`, `index.ts`). Verify with `typecheck`.
- [x] 7.2 Write `date-selection-control/tests/`. Verify:
  - the form stores the range or `null`, and the list or `[]`, with missing values behaving as those;
  - "Range end missing" (message, start segments focused);
  - focus on the summary button for multiple;
  - parity with `DateSelectionField` for both selections;
  - `@ts-expect-error` on `value`, `defaultValue` and `error`.

## 8. Package

- [x] 8.1 Make sure the four entry points are picked up by the tsdown glob and the `./components/*` export. Verify that `pnpm build` and `pnpm check:package` pass with 30 custom components and the published `.d.ts` files resolve (`attw`).

## 9. Stories and documentation

Rebuild `packages/ui` (`pnpm build`) before running stories, because Storybook reads `dist`.

- [x] 9.1 Add the `apps/storybook/src/fixtures/date-fields.ts` fixtures:
  - a fixed "today" for stable stories;
  - a `typeInto(segment, text)` helper that fires `beforeinput`;
  - `es`/`en` text sets for the required labels.

  Verify that they are used by the stories below and that lint passes.
- [x] 9.2 Write `forms/date-time-field/` stories and `date-time-field-docs.ts` (EN/ES). Verify that the stories pass with their play functions and axe. Stories and checks:
  - **Playground**;
  - **Date** (pick a day, then focus back on the button);
  - **Time** (12 and 24 h, seconds);
  - **DateTime** (the merge, then focus on the hour);
  - **Locales** (es-ES, en-US, ja-JP: segment order and caption);
  - **Limits** (blocked weekends, `min`/`max` navigation);
  - **Presets**;
  - **Steps**;
  - **Keyboard** (typing, arrows, Backspace, and the calendar grid keys);
  - **States**;
  - **Rtl** (a left-to-right segment row, a mirrored frame);
  - **Responsive** (320 px with no page overflow, and 44 px targets on coarse pointers).
- [x] 9.3 Write `forms/date-selection-field/` stories and docs (EN/ES). Verify that the stories pass with axe. Stories and checks:
  - **Playground**;
  - **Range** (1–27 August by pointer and by keyboard);
  - **Multiple** (the summary, `maxSelected`);
  - **Limits** (`maxDays`, `excludeDisabled`);
  - **Presets**;
  - **Keyboard**;
  - **States**;
  - **Rtl**;
  - **Responsive**.
- [x] 9.4 Write `forms/date-time-control/` and `forms/date-selection-control/` stories and docs (EN/ES): **WithSchema** (the spec's refine scenarios), **DisabledVsLoading** and **Parity**. Verify that the stories pass with axe, and that `coverage-tests.ts` passes (stories match the docs, guides are bilingual).
- [x] 9.5 Update the guide `fields-and-controls.mdx` in EN and ES:
  - a Dates section with the booking usage example from the plan;
  - rows in the families table;
  - the `openCalendarLabel`, `previousMonthLabel`/`nextMonthLabel`, `startLabel`/`endLabel` and `presetsLabel` rows in the texts table;
  - a note that typed values are validated by the schema.

  Update the README component list and add `.changeset/add-date-time-and-date-selection-fields.md` (`minor`). Verify that the guide renders in both locales and that `pnpm lint` passes.

## 10. Verification

- [x] 10.1 Run `pnpm lint`, `pnpm typecheck`, `pnpm test` (twice, consecutive, all green: unit tests, the text guard, and Chromium stories with axe), `pnpm build` and `pnpm check:package`. Verify that every command exits 0 and record the test counts.
- [x] 10.2 Take screenshots of the built Storybook in light, dark, touch and RTL:
  - the segments (empty, filled, invalid);
  - the open calendar with today and blocked days;
  - a selected range with the hover band;
  - several days with the summary;
  - presets;
  - 320 px.

  Review them for alignment, contrast and overflow. Verify by reviewing the screenshots, and fix and re-run 10.1 if anything changes.
