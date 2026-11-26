# Review notes: document-packages-api

## Baseline (2026-11-26, commit `de799de`)

Our own source: no `shadcn/`, no tests or test helpers.

**Public API** (exports of the public entry points, and their own props):

| Package | Exports documented | Props documented |
|---|---|---|
| `utils` | 13 / 21 | 19 / 21 |
| `hooks` | 24 / 24 | 10 / 13 |
| `i18n` | 8 / 8 | 19 / 19 |
| `ui` | 255 / 314 | 584 / 710 |

First `doc-guard` run (public items without a comment, inherited and inline props included): `utils` 8, `hooks` 0, `i18n` 0, `ui` 219.

**All source** (`src` and `scripts`: every module declaration and type member, public or not):

| Package | Module declarations documented | Type members documented |
|---|---|---|
| `utils` | 41 / 100 | 36 / 49 |
| `hooks` | 40 / 66 | 10 / 14 |
| `i18n` | 52 / 94 | 29 / 40 |
| `ui` | 791 / 1209 | 957 / 2078 |

**Built CSS:**
- playground (`storybook-static/assets/*.css`): 261,917 bytes;
- `@aureus-core/ui` alone (its `dist/styles/index.css` with its own `@source`): 288,684 bytes.

## Result (2026-11-26)

**Public API** (checked by `src/documentation-tests.ts` in each package): `doc-guard` reports 0 undocumented items in `utils`, `hooks`, `i18n` and `ui`, from 8, 0, 0 and 219 at the start. Every public component, hook and function also has a usage example, and every `ts` / `tsx` example was type-checked against the packages.

**All source** (`src`: every module declaration and type member). Both columns are measured with the same final rules, so the "before" figures replace the first estimate above: scripts are left out (they follow the per-file and per-block rule) and members are counted only inside declared types.

| Package | Declarations before | Declarations after | Type members before | Type members after |
|---|---|---|---|---|
| `utils` | 41 / 80 | 80 / 80 | 36 / 48 | 48 / 48 |
| `hooks` | 40 / 46 | 46 / 46 | 10 / 13 | 13 / 13 |
| `i18n` | 52 / 72 | 72 / 72 | 29 / 40 | 40 / 40 |
| `ui` | 791 / 1185 | 1185 / 1185 | 956 / 1977 | 1977 / 1977 |

**Only comments changed.** Every modified source file was compared with `de799de` with comments removed. The one difference is intended: the `include` of the `vite` project in `packages/i18n/vitest.config.ts`, so the new guard runs. Other changes: the four guard tests, their `@aureus-core/doc-guard` devDependency, `tooling/doc-guard`, the "Doc comments" section of `CONTRIBUTING.md` and the changeset.

**Verification:** `pnpm lint` (one existing note in `apps/storybook/.storybook/i18n/localized.tsx`, not touched), `typecheck`, `test`, `build` and `check:package` pass from the root. Comments reach the built `.d.ts` files. The built CSS is unchanged: the playground is 261,917 bytes as before, and the output of `@aureus-core/ui` alone is byte for byte the same.

## Findings

Code problems found while reviewing, ordered by severity. Nothing here has been changed. Severity: **bug** (wrong behavior), **risk** (fragile or surprising), **improvement**. In total 40: 11 bugs, 14 risks and 15 improvements. A row says "checked" when it was reproduced with a temporary test or run; treat the others as found by reading the code.

| # | Severity | Where | What happens | Proposed fix |
|---|---|---|---|---|
| I1 | **bug (high)** | `packages/i18n/src/runtime/runtime.ts:56` | A region-only locale file such as `pt-BR.json` is never loaded: `load: "languageOnly"` requests only `pt`, which is not a discovered language, so the app shows the fallback language. Checked against the built package: `lng: "pt-BR"` loads only `en/common`. It breaks the `i18n-runtime` spec ("the supported languages MUST be exactly the discovered languages"). Base-language files are not affected. | Remove `load: "languageOnly"` and `nonExplicitSupportedLngs` (or compute them from the discovered languages), and add tests for `pt-BR.json` and for `es-ES` → `es`. |
| UI1 | **bug** | `packages/ui/src/internal/hooks/use-inherited-direction.ts:12` | The inherited text direction is read once, on mount. When the page direction changes at runtime (an app switching to Arabic, for example with `createI18n({ syncDocument: true })`), the radio group, slider, file and date fields, data table and app layout keep the old direction until they remount, and pass it to Radix as `dir`. | Observe `dir` changes (a `MutationObserver` on the document element and ancestors), or re-read it on every render and set state only when it changes. |
| F1 | **bug** | `packages/ui/src/components/number-field/number-field.tsx:82` | A `readOnly` `NumberField` can still be changed with the arrow keys and the step buttons (checked: 5 → 7, `onValueChange` called twice), and by reading the code also with the wheel and paste, because only `disabled` and `loading` lock the field. | Include `readOnly` in `locked`, and skip the paste handling when read-only. |
| F2 | **bug** | `packages/ui/src/components/number-field/utils/evaluate-expression.ts:35` | With `expressions` on, accounting parentheses lose their sign: `"(1,234.50)"` is treated as an expression and gives `+1234.5` (checked). The spec says pasted accounting parentheses are accepted. | Treat a text wholly wrapped in parentheses with no operator inside as a number. |
| C1 | **bug** | `packages/ui/src/components/radio-group-field/hooks/use-radio-group-value.ts` | While typing in the other option's input, a text equal to an option's value (even as a prefix on the way) selects that option and removes the input: typing "red" with an option `red` makes it impossible to continue (checked). | Keep the other option selected while its input is being edited, instead of deriving it only from the value. |
| C2 | **bug** (native forms) | `packages/ui/src/components/radio-group-field/radio-group-field.tsx` | With `name`, choosing the other option submits the internal id `"\u0000other"` instead of the typed text (checked with `FormData`). react-hook-form usage is not affected. | Render the radios without `name` and submit the value through a hidden input. |
| AL1 | **bug** | `packages/ui/src/components/app-layout/hooks/use-breadcrumb-state.ts:41`, `use-app-layout-breadcrumb.ts:82` | When two nested components that call `useAppLayoutBreadcrumbItems` mount together (a section route and its page), the outer one's trail is shown: layout effects run child first, so the parent's layer lands on top (checked: "Parent page" shown, not "Child page"). | Order the layers by nesting depth (a context that counts it) instead of by effect order. |
| AL2 | **bug** (accessibility) | `packages/ui/src/components/app-layout/components/app-layout-nav-control.tsx` (`asChild` branch) | A `disabled` item or sub-item with `asChild` is not disabled: the consumer's link has no `aria-disabled`, can be activated and calls `onSelect` (checked). The spec says a disabled item must not be activated and must be marked disabled. | With `disabled`, set `aria-disabled`, prevent the default of the click and skip `onSelect`. |
| AL3 | **bug** | `packages/ui/src/components/app-layout/components/app-layout-nav-sub-item.tsx` (flyout branch) | In a collapsed sidebar, a sub-item with `asChild` becomes a plain menu entry without the consumer's link, so choosing it does not navigate (checked: a `div` with no `href`). The spec says choosing in the flyout must behave as in the expanded sidebar. | Render the consumer's element inside `DropdownMenuItem asChild`. |
| DT1 | **bug** (RTL) | `packages/ui/src/components/data-table/components/data-table-row-actions.tsx:1`, `data-table-column-toggle.tsx`, `data-table-selection-actions.tsx`, `data-table-pagination.tsx` | The table's menus and page-size select do not receive `dir`, so Radix renders them `ltr` in a right-to-left page (checked: the row actions menu inside `dir="rtl"` has `dir="ltr"`). The app layout passes it. | Pass the `direction` the table already measures to every menu and select. |
| U1 | bug (dev message) | `packages/utils/src/display/formatters/display-list.ts:26`, `display/utils/helpers/options.ts:21` | For a non-string list item, the development warning says "the empty text is shown", but the item is skipped and the others are shown. | Give `list` its own warning: "the item is skipped". |
| U2 | risk | `packages/utils/src/date-formats/date-formats.ts:76-79`, `display/formatters/display-list.ts` | An invalid locale tag (`"es_ES"`) or time zone makes `format`, `date`, `time`, `dateTime` and `list` throw a `RangeError`. `number` catches it and shows the empty text. The `value-display` spec says every function must return a string. | Catch the error as `number` does: warn once and return `null` / the empty text. |
| I2 | risk | `packages/i18n/src/runtime/utils/helpers/language-detector.ts:56` | i18next also stores the language **detected** on the first visit, not only one the user chose. A later change of the browser's language is then ignored. The guide and README say the user's choice is stored. | Store only after an explicit change (skip the call made during `init`), or state it in the docs. |
| I3 | risk | `packages/i18n/src/runtime/utils/helpers/resources-backend.ts:15` | A load that fails (offline, or a chunk removed by a new deploy) is not retried by i18next (checked: one attempt in 3 s): the namespace stays untranslated until the page reloads. | Retry in `read` a few times before failing. |
| UI2 | risk | `packages/ui/src/internal/hooks/use-file-input.ts:54-67` | With an async `transform`, the count and total-size limits are checked against the value before the transform ends. Two quick additions (drop, then paste) can both pass and exceed `maxFiles` or `maxTotalSize`. Found by reading the code. | Count the files still being transformed in `getCurrent`, or serialize additions. |
| UI4 | risk | `packages/ui/src/internal/components/file-trigger/file-trigger.tsx`, `internal/hooks/use-file-input.ts` | With `name` (native form submission), the input is emptied after every pick (`value = ""`) and refilled only when the value changes. If every picked file is rejected, the value does not change and the input stays empty: a native submit loses the files already chosen. Found by reading the code. | Refill the input after each pick, or sync in an effect that also depends on the rejections. |
| F3 | risk | `packages/ui/src/components/otp-field/utils/otp-charset.ts:58` | A custom `charset.pattern` is applied to each character, so a pattern that requires the full length (`"^[A-Z0-9]{4}$"`) rejects everything (checked: the value becomes `""`). The previous doc comment said the pattern matched the whole value; the comment was corrected. | Warn when the pattern rejects single characters, or take a character pattern explicitly. |
| A1 | risk | `packages/ui/src/components/file-field/utils/file-guards.ts` | `toExistingFile` without `getId` gives every item the id `existing-0`: two of them in one list collide (keys, removal, `diffFiles`). Its comment now says to use it for a single file. | Generate a unique id when `getId` is missing. |
| AL4 | risk | `packages/ui/src/components/app-layout/hooks/use-app-layout-breadcrumb.ts:65-74` | The trail is only updated when an `id`, text label or `href` changes, so an inline `onSelect` (or `icon`) keeps the closure of the first render: after a state change the click sees the old value (checked: 1 instead of 2). | Call the latest `onSelect` through a ref, or include the items' identity for handlers. |
| DT2 | risk | `packages/ui/src/components/data-table/hooks/use-data-table.ts` (`autoResetPageIndex`) | With client pagination, a `data` array that is new on every render sends the table back to page 1, so an app with inline `data={items.filter(…)}` cannot leave it when the parent re-renders (checked). The comment of `data` now says to keep it stable. | Reset only on search or sort changes, or warn when `data` changes on consecutive renders. |
| DT3 | risk | `packages/ui/src/components/data-table/hooks/use-data-table.ts` (`rowsById`) | A selected row that is removed from `data` stays selected: the count still includes it and a bulk action receives the removed row (checked after deleting a selected row). | Drop ids that left `data` in client mode, or document that the app must update the selection. |
| U3 | risk (latent) | `packages/utils/src/date-formats/utils/helpers/format-pattern.ts:113` | In a pattern, month and weekday names are formatted on their own and in the locale's default calendar: Russian gets the standalone "ноябрь" inside a date, and `fa` would mix Persian month names with Gregorian numbers. No catalog entry uses `patterns` today. | Format names together with the day, with `calendar: "gregory"`. |
| H2 | risk (low) | `packages/hooks/src/schema-form/hooks/use-schema-revalidation.ts` | An object-level refinement without a `path` is stored under the error key `""` (checked with `zodResolver`). No field has that path, so its message is not re-validated when the language changes. | Include the `""` / `root` error in the re-validation, with a full `trigger()` when present. |
| AL5 | risk (low) | `packages/ui/src/components/app-layout/hooks/use-keyboard-shortcut.ts:18` | Shift and Alt are not checked, so with `keyboardShortcut="b"` the browser's Ctrl+Shift+B is also captured and cancelled. Found by reading the code. | Ignore the event when `shiftKey` or `altKey` is set. |
| DT8 | risk (low) | `packages/ui/src/components/data-table/hooks/use-search.ts` | With `trigger: "change"`, an inline `onSearch` restarts the debounce on every parent render, so frequent renders delay the search. Found by reading the code. | Keep `onSearch` in a ref. |
| H1 | improvement | `packages/hooks/src/schema-form/utils/helpers/normalize-server-errors.ts` | A server error whose value is not a string or string array (for example a nested object `{ address: { city: "…" } }`), and non-string items of an array, are dropped without a development warning, so a wrong error shape fails silently. | Warn once when a key has a value that yields no message and is not empty. |
| I4 | improvement | `packages/i18n/src/vite/vite.ts:237` | While a locale file of `typesFrom` is temporarily invalid JSON (autosave mid-edit), the namespace is written to the declaration file with no keys, so every `t()` of it shows type errors until the file is fixed. | Keep the previous content for the types while a file cannot be parsed. |
| I5 | improvement | `packages/i18n/src/vite/utils/helpers/scan-namespaces.ts:48,59` | Symbolic links to locale folders or JSON files are skipped without a message. | Follow them, or warn that they were skipped. |
| UI3 | improvement (dev message) | `packages/ui/src/internal/hooks/use-toggle-value.ts:49` | The warning for an unknown value says "the box is shown unchecked" also for `SwitchField`. | Say "the control is shown off". |
| F4 | improvement | `packages/ui/src/components/number-field/number-field.tsx:33` | `NumberField` defaults `locale` to `"en-US"` (as the `form-fields` spec says), while the other fields default to the browser's language. | Default to the browser's locale in a minor release, updating the spec. |
| F5 | improvement | `packages/ui/src/components/text-area-field/text-area-field.tsx:68` | The character counter of an uncontrolled text area only updates on typing: after a native form reset it keeps the old count. | Listen to the form's `reset` event. |
| C3 | improvement | `packages/ui/src/components/select-field/hooks/use-select-value.ts`, `checkbox-group-field/hooks/use-checkbox-group-value.ts` | At `maxSelected`, the select's "select all" does nothing, while the checkbox group's clears the enabled options. Both follow their specs. | Align both behaviors. |
| C4 | improvement | `packages/ui/src/components/switch-field/hooks/use-switch-change.ts` | An `onBeforeChange` that throws or rejects keeps the state and the error is swallowed, so a failing save leaves no trace. | Report it (rethrow asynchronously, or a development warning). |
| D1 | improvement | `packages/ui/src/components/date-selection-field/date-selection-field.tsx:191`, `date-time-field/date-time-field.tsx:144` | Choosing a preset sets its value without applying `maxSelected`, `minDays`/`maxDays`, `excludeDisabled`, `min` or `max`, so a preset can give a value the field would not let a person pick. The spec does not say presets are limited. | Validate preset values against the same limits, or document that presets bypass them. |
| AL6 | improvement | `packages/ui/src/components/app-layout/utils/app-layout-classes.ts` (`triggerClassName`) | The constant is not used anywhere. | Remove it. |
| DT4 | improvement | `packages/ui/src/components/data-table/hooks/use-data-table.ts` (manual pagination) | With `pagination.manual` and neither `rowCount` nor `pageCount`, the table assumes one page and disables "next" without a warning (checked). Both are optional in the types. | Require one of them in the type, or warn. |
| DT5 | improvement | `packages/ui/src/components/data-table/components/data-table-body.tsx:31` | The default cell shows objects as JSON, so a `Date` value appears quoted (`"2026-01-01T00:00:00.000Z"`). Found by reading the code. | Show dates through `toString`/a formatter, or warn when a column has an object value and no `cell`. |
| DT6 | improvement | `packages/ui/src/components/data-table/types/data-table-column-types.ts` | A group column accepts `pin`, `footer`, `align`, `hideable` and `cellClassName`, which have no effect. | Leave them out of the group's type. |
| DT7 | improvement (performance) | `packages/ui/src/components/data-table/components/data-table-body.tsx:145` | Every focusable row rebuilds the list of row ids to find the tab stop, so rendering grows with the square of the row count. | Compute the tab stop once in `DataTableBody`. |
| R1 | improvement | `packages/ui/` | The package has no `README.md` (`utils`, `hooks` and `i18n` have one), so its npm page does not say how to install it or import `styles.css`. Not created, as agreed in the plan. | Add a README with installation, the stylesheet import and the entry points. |
