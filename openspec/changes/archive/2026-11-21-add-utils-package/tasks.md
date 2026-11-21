## 1. Package scaffold

- [x] 1.1 Create `packages/utils/package.json`:
  - `@aureus-core/utils`, version `0.0.0`, `type: module`, `sideEffects: false`, `files: ["dist"]`;
  - exports as in design decision 1 (`./internal/*: null`, `./*`, `./package.json`);
  - `publishConfig` with public access and provenance, and `repository.directory`;
  - scripts `build`, `dev`, `typecheck`, `test`, `check:package`;
  - devDependencies only (`@aureus-core/tsconfig`, `@types/node`, `tsdown`, `typescript`, `vitest`, `publint`, `@arethetypeswrong/cli`), with the same versions as `packages/ui`.

  Verify that `pnpm install` links it and that `pnpm ls --filter @aureus-core/utils --prod` shows no dependencies.
- [x] 1.2 Add `tsconfig.json` (extends `base.json`, `types: ["node"]`, `@/*` paths), `tsdown.config.ts` (design decision 2) and `vitest.config.ts`, with `environment: "node"`, `include: src/**/*-tests.ts`, `env.TZ = "America/New_York"`, the `@` alias and `passWithNoTests`. Verify that `pnpm --filter @aureus-core/utils typecheck` and `test` run with an empty `src/`.
- [x] 1.3 Write `scripts/check-package.mjs` (design decision 2): modules discovered from `src/*/index.ts` except `internal`; outputs, alias leak, publint strict, attw `esm-only` per module, tarball allowlist, and a check that `internal/*` does not resolve. Verify, after a build with a temporary module, that the check passes, and that it fails and names the module when that module's `dist/<module>/index.js` is deleted.

## 2. Internal layer

- [x] 2.1 Write `src/internal/utils/constants/is-dev.ts` and `src/internal/utils/helpers/warn-once.ts`, with `warnOnce` and `resetWarnings` (design decision 11). Add the `index.ts` barrels. Verify with `internal/utils/helpers/tests/warn-once-tests.ts`: one log per key, and no log when `NODE_ENV=production`.
- [x] 2.2 Write `src/internal/types/locale-types.ts` (`LocaleInput`) and `helpers/resolve-locale.ts` (design decision 3). Verify with unit tests: a string, an array, a getter re-evaluated on every call, a getter returning `undefined`, and no input.
- [x] 2.3 Copy `iso-date.ts` from `packages/ui/src/internal/utils/helpers/` into `src/internal/utils/helpers/`, keeping the parsing and validation and dropping what the module does not use. Add `is-nil.ts`. Verify with unit tests: `2026-02-30`, `2024-02-29`, `24:00`, and the `HH:mm` / `HH:mm:ss` forms.

## 3. `date-formats` module

- [x] 3.1 Write `date-formats/utils/constants/date-format-catalog.ts`, with the fifteen entries, their `needs` and their `intl` options (design decision 6). Write `types/date-formats-types.ts`, with `DateFormatName` and its three groups derived from the catalog, `DateFormatterConfig` and `DateFormatOverrides`. Verify with `tests/date-formats-types-tests.ts`: an unknown name is rejected, and each group contains exactly its names.
- [x] 3.2 Write `utils/helpers/to-date-value.ts` (design decision 4). Verify with `tests/iso-input-tests.ts`:
  - each accepted form;
  - a timestamp, a `Date` and an invalid `Date`;
  - `NaN`, `2026-02-30` and `21/11/2026`;
  - offset and `Z` strings with fractional seconds.
- [x] 3.3 Write `utils/constants/date-tokens.ts` and `utils/helpers/format-pattern.ts` (design decision 7). Verify with `tests/pattern-tests.ts`:
  - every token in `es-ES` and `en-US`;
  - quoted literals and `''`;
  - an unknown letter is written literally and warns once;
  - every `patterns` entry in the catalog runs without warnings.
- [x] 3.4 Write `utils/helpers/resolve-definition.ts` and the shared `Intl` cache (`internal/utils/helpers/intl-cache.ts`, also used by `display`). Verify with `tests/resolve-locale-tests.ts`, using a test entry with `patterns: { es: …, "es-MX": … }`:
  - `es-MX` uses its own form;
  - `es-AR` uses the `es` form;
  - `fr` uses `intl`;
  - a repeated call reuses the cached `Intl` instance.
- [x] 3.5 Write `date-formats.ts` (`createDateFormatter`) and `index.ts`, which exports `createDateFormatter`, `dateFormatNames` (frozen) and the types. Verify with `tests/catalog-tests.ts`:
  - an inline snapshot of all names in `es-ES` and `en-US` for `2026-11-21T14:30:05`, matching the spec table;
  - `fr` and `de` for `long`;
  - a getter locale switching from `es` to `en` between calls;
  - per-call overrides, no locale and no zone (runtime defaults);
  - `timeZone` on an instant (`2026-11-21T14:30:00Z` → `8:30` in `America/Mexico_City`);
  - a local date that is not shifted under `Asia/Tokyo`;
  - `2026-03-08T12:00` and `2026-03-08T02:30` in New York;
  - the fit rule in both directions, returning `null` with a warning;
  - an unknown runtime name falls back to `short` with one warning;
  - `null` returns `null` with no warning;
  - `dateFormatNames` cannot be modified.

## 4. `display` module

- [x] 4.1 Write `display/types/display-types.ts` (design decision 10). Verify with `tests/display-types-tests.ts`: `@ts-expect-error` for a missing `empty`, a missing `true`/`false`, `maxItems` without `more`, `date` with `format: "time"`, `time` with `format: "long"`, and `dateTime` with `format: "short"`.
- [x] 4.2 Write `utils/helpers/truncate-graphemes.ts` and `formatters/display-text.ts` (design decision 9). Verify with `tests/text-tests.ts`:
  - trim;
  - `maxLength` alone, `ellipsis` alone (no effect), both together, and an ellipsis as long as `maxLength` (ignored, warns);
  - an emoji with a skin tone and a combining accent are not split;
  - `blankAsEmpty` on and off;
  - an invalid `maxLength` warns;
  - a non-string value returns `empty` and warns.
- [x] 4.3 Write `formatters/display-number.ts` (design decision 8). Verify with `tests/number-tests.ts`:
  - the neutral default (`1234,5678` in `es-ES`);
  - each option alone;
  - independence: `currency` does not pad, `padDecimals` without `decimals` has no effect, `grouping` groups `1234` in `es-ES`;
  - all options together give `($1,234.50)`;
  - `-0`, and `-0.001` with `decimals: 2` and `parentheses`, give `0` with no parentheses;
  - `2.5` → `3` and `-2.5` → `-3` with `decimals: 0`;
  - `NaN` and `Infinity` return `empty` and warn.
- [x] 4.4 Write `formatters/display-boolean.ts` and `formatters/display-list.ts`. Verify with `tests/boolean-tests.ts` and `tests/list-tests.ts`:
  - both labels;
  - a non-boolean value warns;
  - join with skipped `null` and blank items;
  - all items skipped returns `empty`;
  - `type` and `style`;
  - `maxItems` with hidden items (`a, b y 3 más`);
  - `more` is not called when nothing is hidden.
- [x] 4.5 Write `formatters/display-date.ts` (`date`, `time`, `dateTime`, on `createDateFormatter` from `../date-formats`). Verify with `tests/date-tests.ts`:
  - the defaults `short`, `time` and `shortDateTime`;
  - a named format;
  - `timeZone` and `locale` overrides;
  - `date("14:30")` and an invalid date return `empty`.
- [x] 4.6 Write `display.ts` (`createDisplay`) and `index.ts`, which exports only `createDisplay` and the types. Verify with `tests/create-display-tests.ts`:
  - every function returns `empty` for `null`/`undefined` with no warning;
  - a per-call `empty` does not change the config;
  - a getter locale is followed by every function;
  - `index.ts` exports no standalone function.

## 5. Package verification

- [x] 5.1 Run `pnpm --filter @aureus-core/utils build`, then `check:package`. Verify that `dist/date-formats/index.{js,d.ts}` and `dist/display/index.{js,d.ts}` exist, that there is no `dist/**/tests`, and that the check passes, including that `internal/*` does not resolve.
- [x] 5.2 Run `pnpm lint`, `pnpm typecheck` and `pnpm test` from the root. Verify that they pass with the new package.

## 6. Playground

- [x] 6.1 Add `"@aureus-core/utils": "workspace:*"` to `apps/storybook/package.json`, and `utils` to `storySort`, between `components` and `Tools`, with `["Date formats", "Display"]` (`.storybook/preview.tsx`). Verify that `pnpm install` links it, and that Storybook shows the section in that position.
- [x] 6.2 Write `src/stories/utils/date-formats/date-formats-stories.tsx`, with its `date-formats-strings.ts` (`{ en, es }`):
  - a table of every name for fixed ISO values (a date, a time, a local date-time and an instant), formatted in the toolbar locale;
  - a `play` function that checks the `long` cell in `en` (`November 21, 2026`).

  Verify with `pnpm --filter @aureus-core/storybook test`, which includes the a11y check.
- [x] 6.3 Write `src/stories/utils/display/display-stories.tsx`, with its strings file: a `Playground` with controls for the function, the value and each function's options, and the rendered result. Verify with `play` checks for `null` → the configured `empty`, and for `maxLength` with an emoji.
- [x] 6.4 Write `src/stories/utils/date-formats.mdx` and `display.mdx`, in `<En>`/`<Es>` blocks.
  - `date-formats.mdx` covers what the catalog is, a table with the purpose of each name, local ISO vs. instants, time zones, and adding a name (a library change plus a changeset).
  - `display.mdx` covers `createDisplay` with an i18next example, each function and its options, the empty rule, and "display vs i18next".

  Add `"utils"` to `mdxDirs` in `src/coverage-tests.ts` and raise the minimum count to 11. Verify that the coverage test passes, and that it fails when one `<Es>` block is removed.

## 7. Documentation and release

- [x] 7.1 Write `packages/utils/README.md`: what the package is, install, the import table, `createDisplay` and `createDateFormatter` with i18next, the catalog names, and the note that `process.env.NODE_ENV` is replaced by the bundler. Verify that the tarball (`pnpm pack --dry-run`) includes it.
- [x] 7.2 Update the root `README.md`: the package row and a "Using `@aureus-core/utils`" section. Update `CONTRIBUTING.md` with "The utils package":
  - module folders, the root rule (only `index.ts` + `<module>.ts`), and the subfolders `types/`, `formatters/`, `utils/{constants,helpers}/` and `tests/`;
  - `internal/`, the dependency direction (`internal` ← `date-formats` ← `display`, imports through `index.ts` only), and the rule that a new module needs no manifest edit;
  - no default texts, independent options, and the closed catalog.

  Verify that the links and paths in both files exist.
- [x] 7.3 Add `.changeset/add-utils-package.md` (`"@aureus-core/utils": minor`). Verify that `pnpm changeset status` lists the bump.
- [x] 7.4 Final check: run `pnpm lint && pnpm typecheck && pnpm test && pnpm build && pnpm check:package` from the root, and verify that all of them pass. Then report to the user the manual npm step: create the package and register the trusted publisher before the first release.
