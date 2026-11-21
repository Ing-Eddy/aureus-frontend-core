# value-display Specification

## Purpose
Defines `@aureus-core/utils/display`: one function per basic type that turns a value into the text shown to the user, with a single configurable mark for missing values and independent, opt-in options.

## Requirements

### Requirement: Display factory
`createDisplay(config)` SHALL return an object with the functions `text`, `number`, `boolean`, `date`, `time`, `dateTime` and `list`. `config` MUST contain `empty`, the string shown for a missing value, and MAY contain `locale` and `timeZone`, which follow the package's locale and time-zone rules. Each function MUST accept the value as its first argument and an options object as its second. The options of every function MAY override `empty`. The options of the functions that depend on the language MAY override `locale`, and those of `date`, `time` and `dateTime` MAY override `timeZone`. Every function MUST return a `string`. The module MUST NOT export standalone versions of these functions.

#### Scenario: Per-call empty text
- **WHEN** a display created with `empty: "-"` calls `text(null, { empty: "No notes" })`
- **THEN** the result is `No notes`, and `text(null)` still returns `-`

#### Scenario: Required empty text
- **WHEN** `createDisplay({ locale: "es" })` is written in TypeScript
- **THEN** TypeScript reports that `empty` is missing

### Requirement: Missing and invalid values
Every function SHALL return the `empty` text when the value is `null` or `undefined`, without a warning. A value of the wrong type, or one that cannot be shown (such as `NaN`, an infinite number or an invalid date), MUST also return `empty` and log a development warning.

#### Scenario: Undefined number
- **WHEN** `number(undefined)` is called on a display with `empty: "-"`
- **THEN** the result is `-` and nothing is logged

#### Scenario: Not a number
- **WHEN** `number(Number.NaN)` is called in development
- **THEN** the result is the `empty` text and one warning is logged

### Requirement: Text
`text(value, options)` SHALL return the value with leading and trailing whitespace removed. Its options are independent:
- **`maxLength`** (a positive integer): when the trimmed text has more user-perceived characters (grapheme clusters) than `maxLength`, it is cut to `maxLength` of them, and whitespace at the end of the cut is removed. A cut MUST NOT split an emoji or a letter with its combining marks.
- **`ellipsis`** (a string): only when a cut happens, it is appended, and its own length counts toward `maxLength`. Without `maxLength` it has no effect. An `ellipsis` as long as `maxLength` or longer is ignored, with a development warning.
- **`blankAsEmpty`** (default `false`): a value that is empty after trimming returns the `empty` text. Without it, such a value returns an empty string.

An invalid `maxLength` (zero, negative or not an integer) MUST be ignored with a development warning.

#### Scenario: Trimmed
- **WHEN** `text("  Ana  ")` is called
- **THEN** the result is `Ana`

#### Scenario: Cut with ellipsis
- **WHEN** `text("Hello world", { maxLength: 7, ellipsis: "…" })` is called
- **THEN** the result is `Hello…`

#### Scenario: Emoji is not split
- **WHEN** `text("👍🏽👍🏽👍🏽", { maxLength: 2 })` is called
- **THEN** the result is `👍🏽👍🏽`

#### Scenario: Blank value
- **WHEN** `text("   ")` is called, and then `text("   ", { blankAsEmpty: true })` on a display with `empty: "-"`
- **THEN** the first result is an empty string and the second is `-`

### Requirement: Number
`number(value, options)` SHALL write a finite number with the locale's digits and decimal separator. By default it uses no grouping separators and shows as many decimals as the number has, with no rounding and no padding. Its options are independent, and none of them changes another one's default:
- **`decimals`** (an integer from 0 to 20): the maximum number of decimals. The number is rounded half away from zero.
- **`padDecimals`**: pads with zeros up to `decimals`. Without `decimals` it has no effect.
- **`grouping`**: inserts the locale's grouping separator, also for four-digit numbers.
- **`currency`** (an ISO 4217 code): adds the currency symbol in the locale's position. It MUST NOT change the number of decimals.
- **`negativeFormat`**: `"minus"` (default) or `"parentheses"`, which shows a negative number as its absolute value, symbol included, between parentheses.

Negative zero MUST be shown as zero.

#### Scenario: Neutral default
- **WHEN** `number(1234.5678, { locale: "es-ES" })` is called
- **THEN** the result is `1234,5678`

#### Scenario: Currency keeps the decimals
- **WHEN** `number(1234.5, { locale: "es-ES", currency: "EUR" })` is called
- **THEN** the result is `1234,5 €`, not padded to two decimals

#### Scenario: All options together
- **WHEN** `number(-1234.5, { locale: "en-US", decimals: 2, padDecimals: true, grouping: true, currency: "USD", negativeFormat: "parentheses" })` is called
- **THEN** the result is `($1,234.50)`

#### Scenario: Pad without decimals
- **WHEN** `number(1.5, { padDecimals: true })` is called
- **THEN** the result is the same as `number(1.5)`

### Requirement: Boolean
`boolean(value, options)` SHALL return `options.true` for `true` and `options.false` for `false`. Both labels MUST be required by TypeScript.

#### Scenario: Labels
- **WHEN** `boolean(false, { true: "Active", false: "Inactive" })` is called
- **THEN** the result is `Inactive`

#### Scenario: Labels required
- **WHEN** `boolean(value, { true: "Yes" })` is written in TypeScript
- **THEN** TypeScript reports that `false` is missing

### Requirement: Dates and times
`date`, `time` and `dateTime` SHALL format the value with the date-formats catalog:
- **`date`**: accepts only calendar format names. Default `short`.
- **`time`**: accepts only time format names. Default `time`.
- **`dateTime`**: accepts only date-time format names. Default `shortDateTime`.

Each uses the `format` option to pick the name. They accept the same values as the catalog. A value that the catalog cannot format, or that does not fit the format, MUST return the `empty` text.

#### Scenario: Named format
- **WHEN** `date("2026-11-21", { format: "long", locale: "es-ES" })` is called
- **THEN** the result is `21 de noviembre de 2026`

#### Scenario: Wrong group of names
- **WHEN** `date(value, { format: "time" })` is written in TypeScript
- **THEN** TypeScript reports an error

#### Scenario: Value does not fit
- **WHEN** `date("14:30")` is called on a display with `empty: "-"`
- **THEN** the result is `-`

### Requirement: List
`list(values, options)` SHALL join the items of an array with the locale's list conventions. Each item is trimmed. `null`, `undefined` and blank items are skipped. If no item is left, the result is the `empty` text. Its options are independent:
- **`type`**: `"conjunction"` (default), `"disjunction"` or `"unit"`.
- **`style`**: `"long"` (default), `"short"` or `"narrow"`.
- **`maxItems`** (a positive integer): only the first `maxItems` items are shown, followed by the text that `more(hiddenCount)` returns as the last item. `more` MUST be required by TypeScript when `maxItems` is given, and it is not called when no item is hidden.

#### Scenario: Join with skipped items
- **WHEN** `list(["a", null, " ", "b", "c"], { locale: "es" })` is called
- **THEN** the result is `a, b y c`

#### Scenario: Hidden items
- **WHEN** `list(["a", "b", "c", "d", "e"], { locale: "es", maxItems: 2, more: (n) => `${n} más` })` is called
- **THEN** the result is `a, b y 3 más`

#### Scenario: More required
- **WHEN** `list(values, { maxItems: 2 })` is written in TypeScript
- **THEN** TypeScript reports that `more` is missing
