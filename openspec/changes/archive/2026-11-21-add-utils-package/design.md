## Context

See proposal.md (Why) for the motivation, and the specs (`utils-package`, `date-formats`, `value-display`, `component-playground`) for the requirements. Facts that shape the approach:

- **`packages/ui` is the template:**
  - `tsdown.config.ts`: unbundled ESM with d.ts. Tests and `tests/` folders are excluded from the entry. `define` keeps `process.env.NODE_ENV` for the consumer's bundler.
  - `vitest.config.ts`: includes `src/**/*-tests.*`.
  - `scripts/check-package.mjs`: outputs, `@/` alias leak, publint, attw `esm-only`, tarball allowlist.
  - `internal/utils/constants/is-dev.ts` (`process.env.NODE_ENV !== "production"`).
  - `internal/utils/helpers/iso-date.ts`: validated local ISO parsing, with `daysInMonth`.
- **The shared configuration already covers new packages:**
  - `tooling/typescript/base.json` is strict, `ES2023`, with no DOM.
  - The root Biome config lints every workspace.
  - Turbo runs `build`, `dev`, `typecheck`, `test` and `check:package` over every workspace that has the script.
  - Changesets publishes every non-private package.
- **Node 24 (ICU full)** gives the outputs in the `date-formats` spec table for `es-ES` and `en-US`. These were verified while writing the spec.
- **Grouping in CLDR:** `useGrouping: true` follows the locale's minimum grouping digits. For example, `es-ES` writes `1234,5` but `12.345,5`.
- **Intl's currency default:** `style: "currency"` forces the currency's minor digits (2 for EUR) unless the fraction digits are set.
- **Playground:**
  - Storybook resolves workspace packages through their `exports`, so it reads `dist/`.
  - The toolbar's `locale` global is `"en" | "es"`.
  - Tool UIs keep their strings in a typed `en`/`es` object, as in `tools/theme-builder/i18n`.
  - `coverage-tests.ts` checks the `<En>`/`<Es>` balance of MDX pages in `guides/` and `foundations/`.

## Goals / Non-Goals

**Goals:**
- A package layout where adding a module means adding a folder: no `package.json` edit, no check-script edit.
- Date output that is identical for the same input in any runtime time zone, for local ISO values.
- Every requirement covered by a unit or type test that runs in Node without a DOM.

**Non-Goals:**
- Making `@aureus-core/ui` depend on `@aureus-core/utils`.
- Supporting runtimes without `Intl.Segmenter` or `Intl.ListFormat`. Every browser and Node version this repo targets has them.

## Decisions

### 1. Exports: one wildcard, with `internal` blocked
`package.json`:
```json
"exports": {
  "./internal/*": null,
  "./*": { "types": "./dist/*/index.d.ts", "default": "./dist/*/index.js" },
  "./package.json": "./package.json"
}
```
- A module is a `src/<module>/index.ts`. The wildcard maps `@aureus-core/utils/<module>` to it.
- `"./internal/*": null` closes the private layer, which otherwise resolves through the wildcard. `internal/` has no root `index.ts`, so `@aureus-core/utils/internal` already fails.
- `sideEffects: false`, `type: module`. There are no dependencies or peer dependencies.

*Alternative:* list every module in `exports`. That is rejected: each new module would need a manifest edit, the same reason `ui` uses wildcards.

### 2. Build and check
- **`tsdown.config.ts`:** copied from `ui`, without the CSS copy and the `"use client"` log filter, and with `platform: "neutral"`, since the code runs in browsers and Node.
- **`tsconfig.json`:** extends `base.json` with `types: ["node"]`, only so `process.env.NODE_ENV` type-checks. `@types/node` is a devDependency. The `@/*` path alias works as in `ui`.
- **`scripts/check-package.mjs`:** derived from `ui`'s. The module list is read from the folders in `src/` (except `internal`) that have an `index.ts`. For each one it expects `dist/<module>/index.{js,d.ts}`, and it passes the same list as attw entry points (`./<module>`). It also runs:
  - the alias-leak check;
  - publint (strict);
  - the tarball allowlist;
  - a new check that `@aureus-core/utils/internal/types` does **not** resolve.
- **`dev` script:** `tsdown --watch`, so the root `dev` rebuilds the package while Storybook runs.

### 3. Locale and time zone resolution (shared)
`internal/utils/helpers/resolve-locale.ts`:
```ts
type LocaleInput = string | readonly string[] | (() => string | readonly string[] | undefined);
resolveLocale(input?: LocaleInput): string | string[] | undefined;
```
- A function is called on every call, and `undefined` means the runtime default.
- The per-call `overrides` win over the factory config: `overrides.locale ?? config.locale`.
- `timeZone` passes through untouched; `undefined` means the runtime's.

The `Intl` formatters are cached per module in a `Map`, keyed by `JSON.stringify([locale, timeZone, key])`. They are created lazily. There is no eviction: an app's set of key combinations is small, and fixed by the closed catalog and the few number options.

*Alternative:* resolve the locale once at creation. That is rejected because it would freeze the language (spec: "Locale follows the app's language at runtime").

### 4. Reading values: instants vs. wall time
`date-formats/utils/helpers/to-date-value.ts` classifies the input as one of:
- `{ kind: "instant", date }`: a `Date`, a timestamp, or an ISO string with `Z`/offset. Parsed with `new Date(string)` and checked with `isNaN`.
- `{ kind: "date" | "time" | "datetime", date }`: a local ISO string, validated with the copied `iso-date` helpers. `date` is built with `Date.UTC(parts)` (a time alone uses 1970-01-01).

Wall-time values are always formatted with `timeZone: "UTC"`, which ignores the requested zone and the runtime's. Because the instant *is* the wall time read in UTC, no daylight-saving gap or overlap can move it. That covers the spec's DST scenario even for 02:30 on a spring-forward day.

*Alternative:* build a local `Date(y, m, d, h, mi)` and format it in the runtime zone, as `ui`'s `iso-date` does with its noon trick. That is rejected because a wall time inside a DST gap (02:30 on 2026-03-08 in New York) does not exist locally, and it would print 03:30.

### 5. Fit rule
- A value has a date if its kind is `date`, `datetime` or `instant`, and a time if it is `time`, `datetime` or `instant`.
- Each catalog entry declares `needs: "date" | "time" | "both"`: calendar names need a date, time names a time, and date-time names both.
- A mismatch returns `null` and calls `warnOnce`.

### 6. Catalog definition and exact forms
`date-formats/utils/constants/date-format-catalog.ts`:
```ts
{ short: { needs: "date", intl: { dateStyle: "short" } }, ..., numericDate: { needs: "date", intl: { day: "2-digit", month: "2-digit", year: "numeric" } }, ... }
// shape of an entry:
interface CatalogEntry { needs: Needs; intl: Intl.DateTimeFormatOptions; patterns?: Readonly<Record<string, string>> }
```
- The `intl` options are the ones in the spec table (`dateStyle`/`timeStyle`, or field options for `numericDate`, `dayMonth`, `monthYear`, `weekday`, `month` and `year`).
- No v1 entry needs `patterns`: the locale forms already match the intended look in `es` and `en`. The mechanism ships anyway, so that a future exact form is a data change and not a code change.
- `resolveDefinition(entry, resolvedLocale)` picks:
  1. `patterns[fullTag]`;
  2. else `patterns[baseLanguage]`;
  3. else `intl`.

  The resolved tag comes from `new Intl.DateTimeFormat(locale).resolvedOptions().locale`. The resolver takes the entry as a parameter, so the tests exercise it with a test-only entry.
- `dateFormatNames` is `Object.freeze` of the catalog keys. `DateFormatName`, `CalendarFormatName`, `TimeFormatName` and `DateTimeFormatName` are derived from the catalog's `needs` with mapped types. The groups therefore cannot drift from the data.

### 7. Pattern formatter (internal)
`format-pattern.ts` tokenizes a pattern:
- runs of the same letter are one token;
- `'…'` is literal text, and `''` is a literal quote.

It renders each token from parts:
- **Numeric tokens:** `yyyy yy M MM d dd H HH h hh m mm s ss`. They use one `formatToParts` call with `hourCycle: "h23"` and all-numeric fields, then are padded or computed by hand. `h` is `hour % 12 || 12`. Hand computation keeps the digits ASCII and independent of the locale's numbering preferences.
- **Name tokens:** `MMM MMMM EEE EEEE a`. They use the `month`/`weekday` part of a cached `Intl.DateTimeFormat(locale, { month: "short" | "long" })` or `{ weekday }`, and the `dayPeriod` part of an `hour12: true` formatter. Names are therefore in the resolved language.

An unquoted letter that is not a token is written literally, and `warnOnce` reports it. A unit test runs every catalog pattern through the tokenizer and fails on any warning (none exist in v1, so the test is ready for the first one).

### 8. Number mapping
`Intl.NumberFormat(locale, { … })`, with:
- `minimumFractionDigits`: `padDecimals && decimals !== undefined ? decimals : 0`;
- `maximumFractionDigits`: `decimals ?? 20`;
- `useGrouping`: `grouping ? "always" : false`. `"always"` makes four-digit numbers group in `es`, as the spec requires;
- `style: "currency", currency`, when `currency` is set. The explicit fraction digits above stop Intl from forcing the currency's minor digits;
- `signDisplay: "negative"`, so that `-0` and values that round to zero have no sign.

`negativeFormat: "parentheses"` formats the value. If `formatToParts` contains a `minusSign`, it formats `Math.abs(value)` and wraps the result in `(` `)`. Values that round to zero are therefore never wrapped. Rounding uses Intl's default `halfExpand`, which rounds half away from zero.

*Alternative:* `currencySign: "accounting"`. That is rejected: it works only with a currency, and many locales (`es-ES`) ignore it.

### 9. Text truncation
`truncate-graphemes.ts` uses `Intl.Segmenter(undefined, { granularity: "grapheme" })`, created once.
- It counts graphemes only when the text's UTF-16 length is above `maxLength`; otherwise it cannot be too long.
- It cuts to `maxLength − ellipsisLength` graphemes, removes trailing whitespace, and appends the ellipsis. The ellipsis length is also counted in graphemes.

### 10. Display types
```ts
createDisplay(config: { empty: string; locale?: LocaleInput; timeZone?: string }): Display
```
- The common per-call options are `{ empty?: string }`, plus `locale` and/or `timeZone` where the function uses them.
- **`boolean`:** `{ true: string; false: string }`, both required.
- **`list`:** a discriminated union, so `more` is required whenever `maxItems` is given.
  ```ts
  | { maxItems?: undefined; more?: undefined }
  | { maxItems: number; more: (hidden: number) => string }
  ```
- **`date` / `time` / `dateTime`:** `format?: CalendarFormatName`, `TimeFormatName` and `DateTimeFormatName` respectively.

`display` imports only `../date-formats` (its public index) and `../internal/...`. Inside `display/`, `formatters/` hold one function each, which receives `(value, options, config)`, and `display.ts` binds them to the config. The date functions create one `createDateFormatter` per display and pass the call's overrides through.

### 11. Warnings
`internal/utils/helpers/warn-once.ts`:
- `warnOnce(key, message)` keeps a module-level `Set` of keys and logs `console.warn(message)` only when `isDev`.
- Messages start with the module: `date-formats: …` or `display: …`.
- Tests reset the `Set` through an internal `resetWarnings()` export, which is not public because it lives in `internal/`.

### 12. Tests
- **Environment:** Vitest in `node`.
- **Time zone:** `vitest.config.ts` sets `test.env.TZ = "America/New_York"`, a zone with DST. Node re-reads `TZ` when it is assigned, so every worker formats in that zone. This replaces the separate `vitest-global-setup.ts` from the plan: same effect, one file less.
- **Type tests:** `*-types-tests.ts` files hold `@ts-expect-error` cases. `pnpm typecheck` checks them, and an empty `it` keeps Vitest from reporting an empty file.
- **Catalog snapshot:** an inline snapshot of all fifteen names in `es-ES` and `en-US` for `2026-11-21T14:30:05`. Any change to how a date looks appears in the review diff.

### 13. Playground
- `apps/storybook/src/stories/utils/date-formats.mdx` and `display.mdx`, bilingual. `coverage-tests.ts` adds `"utils"` to `mdxDirs`, and the minimum page count rises from 9 to 11.
- **`utils/date-formats/date-formats-stories.tsx`** (title `utils/Date formats/Catalog`, `!autodocs`):
  - a table of every name with a fixed set of sample values, formatted in the toolbar locale;
  - its column headers come from a typed `{ en, es }` strings object, following the bilingual-tools requirement;
  - a `play` function checks one Spanish and one English cell.
- **`utils/display/display-stories.tsx`** (`utils/Display/Playground`):
  - controls for the function, the value and the options of each function, plus a rendered result;
  - the strings object works the same way as in the catalog story.
- **`storySort`:** `utils` goes between `components` and `Tools`, with the order `["Date formats", "Display"]`.

## Risks / Trade-offs

- **[ICU data changes the characters]** A new Node or browser can change a space or a punctuation mark in a locale's form, for example a narrow no-break space before "PM". → The spec says the characters come from the runtime. The snapshot test pins the CI's Node, so a change shows up as a reviewed snapshot update, not a silent drift. The docs say that output can differ slightly between browsers.
- **[Closed catalog is rigid]** An app that needs a new form must wait for a library release. → This is intended for cross-app uniformity. Adding a name is a small, additive data change with a `minor` changeset.
- **[Unused pattern machinery]** The pattern formatter ships without a v1 catalog entry that uses it. → It is small, internal and fully tested, and it lets the first exact form be pure data. If it is still unused when the catalog matures, removing it changes nothing public.
- **[`process` in the browser]** `isDev` reads `process.env.NODE_ENV`. → Every consumer is a Vite app, and Vite replaces it at build time, the same contract as `@aureus-core/ui`. The README states it.
- **[Unbounded formatter cache]** → Keys are bounded by locales × zones × catalog and number-option combinations used by one app, which stay in the low hundreds at most.

## Migration Plan

This is a new, additive package with nothing to migrate. To release it:
1. merge with the `minor` changeset;
2. the owner creates `@aureus-core/utils` on npm (a first manual publish or a placeholder) and registers the repository's `release.yml` as trusted publisher;
3. the "Version Packages" PR publishes it.

To roll back, deprecate the version on npm. No other package depends on it.
