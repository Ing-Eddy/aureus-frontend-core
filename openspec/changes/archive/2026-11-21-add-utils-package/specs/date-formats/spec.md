## Purpose

Defines `@aureus-core/utils/date-formats`: one closed catalog of named date and time formats, owned by the library, that every app uses the same way, and that resolves each name to the form of the active language.

## ADDED Requirements

### Requirement: Closed catalog of named formats
The module SHALL export the formats as a fixed set of names, `dateFormatNames` (read-only), and the `DateFormatName` type as the union of those names. Consumers MUST NOT be able to add, replace or define formats, or pass a format pattern. Changing how a name looks, or adding a name, is a change to the library. The catalog SHALL contain these names, shown here for 21 November 2026 at 14:30:05:

| Name | es-ES | en-US |
|---|---|---|
| `short` | 21/11/26 | 11/21/26 |
| `medium` | 21 nov 2026 | Nov 21, 2026 |
| `long` | 21 de noviembre de 2026 | November 21, 2026 |
| `full` | sábado, 21 de noviembre de 2026 | Saturday, November 21, 2026 |
| `numericDate` | 21/11/2026 | 11/21/2026 |
| `dayMonth` | 21 nov | Nov 21 |
| `monthYear` | noviembre de 2026 | November 2026 |
| `weekday` | sábado | Saturday |
| `month` | noviembre | November |
| `year` | 2026 | 2026 |
| `time` | 14:30 | 2:30 PM |
| `timeWithSeconds` | 14:30:05 | 2:30:05 PM |
| `shortDateTime` | 21/11/26, 14:30 | 11/21/26, 2:30 PM |
| `mediumDateTime` | 21 nov 2026, 14:30 | Nov 21, 2026, 2:30 PM |
| `longDateTime` | 21 de noviembre de 2026 a las 14:30 | November 21, 2026 at 2:30 PM |

The module SHALL also export three groups of names as types:
- `CalendarFormatName`: `short` to `year`;
- `TimeFormatName`: `time` and `timeWithSeconds`;
- `DateTimeFormatName`: the three `…DateTime` names.

The exact characters (spaces, punctuation, day-period marks) come from the runtime's locale data. A name MUST give a form that follows that locale's conventions (order of parts, month and weekday names, 12- or 24-hour clock) for any locale, not only the two above.

#### Scenario: Unknown name in TypeScript
- **WHEN** a consumer calls `format(value, "custom")`
- **THEN** TypeScript reports an error

#### Scenario: Same name, another language
- **WHEN** the same value is formatted with `long` in `fr` and in `de`
- **THEN** each result follows that language's conventions and month names

#### Scenario: Listing the names
- **WHEN** a consumer reads `dateFormatNames`
- **THEN** it contains exactly the fifteen names of the table, and attempting to modify it has no effect on the catalog

### Requirement: Exact forms per language
A catalog entry MAY define an exact form for specific languages. For any other language, it uses the locale's conventions. When a value is formatted:
1. The locale is resolved to the tag the runtime supports.
2. The entry's exact form for that full tag (for example `es-MX`) MUST be used if there is one.
3. Otherwise the exact form for its base language (`es`) MUST be used.
4. Otherwise the locale's conventional form MUST be used.

Month and weekday names, and day-period marks, in an exact form MUST be written in the resolved language.

#### Scenario: Base-language form
- **WHEN** an entry defines an exact form for `es` only and a value is formatted in `es-MX`
- **THEN** the `es` exact form is used

#### Scenario: Language without an exact form
- **WHEN** that entry is used in `fr`
- **THEN** the result is the conventional French form

### Requirement: Date formatter
`createDateFormatter({ locale?, timeZone? })` SHALL return an object with `format(value, name, overrides?)`. `overrides` MAY contain `locale` and `timeZone`, and they apply only to that call. `format` MUST return the formatted string, or `null` when:
- the value is `null` or `undefined`;
- the value cannot be read as a date;
- the format does not fit the value (see "Values and formats must fit").

Formatting the same value with the same name, locale and time zone MUST always return the same string.

#### Scenario: Per-call override
- **WHEN** a formatter created with `locale: "es-ES"` formats a value with `overrides: { locale: "en-US" }`
- **THEN** that result is in English, and the next call without overrides is in Spanish

#### Scenario: Missing value
- **WHEN** `format(null, "long")` is called
- **THEN** it returns `null` and logs nothing

### Requirement: Accepted values
`format` SHALL accept:
- a `Date`;
- a finite number of milliseconds since the epoch;
- an ISO string in one of these forms:
  - local date: `YYYY-MM-DD`;
  - local time: `HH:mm` or `HH:mm:ss`;
  - local date-time: `YYYY-MM-DDTHH:mm` or `YYYY-MM-DDTHH:mm:ss`;
  - date-time with a zone: `Z` or `±HH:mm`, optionally with fractional seconds.

A local ISO string MUST be shown with exactly the calendar date and wall time it contains, whatever the runtime's time zone and whatever `timeZone` is given. It MUST NOT be shifted by a UTC conversion or a daylight-saving change. A `Date`, a timestamp, and an ISO string with a zone are instants: they MUST be shown in `timeZone`, or in the runtime's time zone when none is given.

Any other value MUST give `null` and a development warning. That includes an invalid `Date`, a non-finite number, an impossible calendar date such as `2026-02-30`, and a string in another form.

#### Scenario: Local date is not shifted
- **WHEN** `"2026-11-21"` is formatted with `numericDate` in `es-ES` in a runtime whose time zone is `America/New_York`, or with `timeZone: "Asia/Tokyo"`
- **THEN** both results are `21/11/2026`

#### Scenario: Local date-time across a daylight-saving change
- **WHEN** `"2026-03-08T12:00"` is formatted with `shortDateTime` in `en-US` in `America/New_York`, the day clocks move forward
- **THEN** the result shows March 8, 2026 at 12:00 PM

#### Scenario: Instant in a given time zone
- **WHEN** `"2026-11-21T14:30:00Z"` is formatted with `time` in `es-ES` and `timeZone: "America/Mexico_City"`
- **THEN** the result is `8:30`

#### Scenario: Impossible date
- **WHEN** `"2026-02-30"` is formatted in development
- **THEN** `format` returns `null` and a warning names the value

### Requirement: Values and formats must fit
A format that shows calendar parts (any name except `time` and `timeWithSeconds`) MUST NOT be applied to a value that has only a time (`HH:mm[:ss]`). A format that shows clock parts (`time`, `timeWithSeconds` and the date-time names) MUST NOT be applied to a value that has only a date (`YYYY-MM-DD`). In both cases `format` MUST return `null` and log a development warning that names the format and the value.

#### Scenario: Date format on a time
- **WHEN** `"14:30"` is formatted with `long`
- **THEN** `format` returns `null` and warns

#### Scenario: Time format on a time
- **WHEN** `"14:30"` is formatted with `time` in `en-US`
- **THEN** the result is `2:30 PM`

### Requirement: Unknown name at runtime
When untyped JavaScript passes a name that is not in the catalog, `format` SHALL use `short` and log a development warning that names the unknown name.

#### Scenario: Typo in JavaScript
- **WHEN** `format(value, "shrot")` is called from JavaScript in development
- **THEN** the value is formatted as `short`, and one warning names `"shrot"`
