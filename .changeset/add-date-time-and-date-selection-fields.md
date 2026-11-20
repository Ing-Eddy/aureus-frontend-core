---
"@aureus-core/ui": minor
---

Add `DateTimeField` / `DateTimeControl` and `DateSelectionField` / `DateSelectionControl`.

- `DateTimeField` (`@aureus-core/ui/components/date-time-field`): one date, time or both.
  - **Value.** A local ISO string with no time zone: `"2026-08-01"` (`mode="date"`, the default), `"14:30"` or `"14:30:15"` (`mode="time"`), `"2026-08-01T14:30"` (`mode="datetime"`). It is `null` while the input is empty or incomplete, and only complete, real dates are emitted.
  - **Input.** Editable segments in the locale's order, separators and digits, each a `spinbutton` named by `Intl.DisplayNames`: typing with auto-advance, arrows that wrap and follow `minuteStep`/`secondStep`, Backspace, separators and phone keyboards. The modes with a date open a localized calendar in a popover.
  - **Opt-in extras, each independent.** `hourCycle`, `granularity`, `minuteStep`, `secondStep`, `weekStartsOn`, `min`/`max` (the calendar disables days outside them and the arrows stop at them), `disabledDates`, `isDateDisabled` and `presets`.
  - **Helpers.** `toDate`, `fromDate`, `todayIso`, `addDaysIso`, `isIsoDate`, `isIsoTime` and `isIsoDateTime`, none of which goes through UTC.
- `DateSelectionField` (`@aureus-core/ui/components/date-selection-field`): several days in a calendar.
  - **`selection="range"`.** `{ from, to }` (`to: null` while the end is chosen), typed in two groups of segments or chosen in the calendar with a hover preview; `minDays`/`maxDays` count both ends, and `excludeDisabled` keeps blocked days out.
  - **`selection="multiple"`.** A sorted list of days chosen from a summary button (`Intl.ListFormat`, or `formatSummary`), with `maxSelected` and `placeholder`.
- **No default texts.** The calendar requires `previousMonthLabel` and `nextMonthLabel`; a calendar button beside segments requires `openCalendarLabel`; a range requires `startLabel` and `endLabel`; `presets` require `presetsLabel`. Captions, weekdays, day names and segment names come from `Intl`, and today and chosen days are conveyed by `aria-current` and `aria-selected`, never by English words.
- `DateTimeControl` (`@aureus-core/ui/components/date-time-control`) and `DateSelectionControl` (`@aureus-core/ui/components/date-selection-control`): the same fields bound to react-hook-form. Opening the calendar does not mark the field as touched.
