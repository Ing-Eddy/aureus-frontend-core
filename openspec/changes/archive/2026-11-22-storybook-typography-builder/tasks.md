## 1. Shared tool layer (`tools/shared/`)

- [x] 1.1 Move `PreviewFrame` to `shared/preview/` and add a `width?: number` prop (a fixed iframe width, centred in the column with horizontal scroll). Update the Theme Builder imports. Verify that the Theme Builder stories still pass (`pnpm --filter @aureus-core/storybook test`).
- [x] 1.2 Move `Section`, `NumberField`, `SliderField` and `ColorField` to `shared/form/`, replacing their `t` dependency with message props. Add the generic `TextField` and `SelectField` wrappers used by both builders. Verify that the Theme Builder typechecks and its stories pass.
  - Deviation: `ColorField` stays in `theme-builder/form/fields.tsx`, because it depends on the theme's color core (`normalizeColor`, `toHex`) and only the Theme Builder edits colors. The theme fields file re-exports `NumberField` and `SliderField` from `shared/form`.
- [x] 1.3 Move `downloadCss` and the clipboard logic (with the select fallback) to `shared/export/`, `fill`/`placeholders` to `shared/i18n/` and `toFileName` to `shared/utils/`, with their tests. Verify that the moved tests pass.
- [x] 1.4 Write `shared/storage/draft-storage.ts` with `DraftStorage`, `browserStorage` and `createStore<T>({ key, validate, migrate?, create })` (load with fallback, save, clear, debounced saver with `flush`/`cancel`). Add `draft-storage-tests.ts` covering a throwing storage, corrupt JSON, migration and debounce. Verify that the tests pass.

## 2. Theme Builder migration

- [x] 2.1 Remove `fonts` and `tracking` from `ThemeInputs`, bump `ThemeDraft.version` to 2, and rewrite `core/draft-storage.ts` on `createStore` with the `v2` key and the v1→v2 migration (design D9). Add tests: a v1 draft with a custom primary color and sans font is restored without fonts, and the v1 key is removed. Verify that the tests pass.
- [x] 2.2 `serialize-theme.ts`: drop the `--font-*`, `--font-heading` and `--tracking-*` lines and the `body` rule. Update `serialize-theme-tests.ts` and the Tailwind compile test: no `font-sans`/`tracking-tight` cases, plus a "no `--font-`/`--tracking-`/`letter-spacing`" case. Verify that the tests pass.
- [x] 2.3 `parse-theme.ts`: report `--font-*`, `--tracking-normal` and `--letter-spacing` as ignored, with a hint flag. Show the hint in `import-section.tsx`. Update `parse-theme-tests.ts` with the "older export with fonts" scenario. Verify that the tests pass.
- [x] 2.4 Delete `core/font-options.ts` and `form/typography-section.tsx`, drop the font and tracking rules from `preview/preview-css.ts`, and replace the section with a link card to `?path=/story/tools-typography-builder--default`. Update the reducer actions and the i18n strings in both locales. Update the Theme Builder stories. Verify that `pnpm typecheck` passes and the Theme Builder stories pass.

## 3. Typography core (`typography-builder/core/`, pure TypeScript, each module with `*-tests.ts`)

- [x] 3.1 `typography-types.ts` and `default-typography.ts`, with the Aureus preset as the A2 table. Add `default-typography-tests.ts`, which parses `packages/ui/src/styles/typography.css` and requires that the default export's `:root` variables equal the package values one by one. Verify that the test passes.
- [x] 3.2 `font-catalog.ts` with the 51 entries of design D3 (the design first counted 48; the table lists 51). Copy the weights from each family's Fontsource metadata. Add `font-pairings.ts` with the 8 pairings (Aureus first). Tests: unique ids and packages; `@fontsource-variable/` iff variable; weights within 100–900; every pairing references existing ids. Verify that the tests pass.
- [x] 3.3 `font-stack.ts` (stack per choice and role, with the variable plus static family names), `google-fonts-url.ts` and `install-command.ts`. Tests:
  - the Inter stack;
  - bundled stacks equal to `typography.css`;
  - the custom slug;
  - the URL axes for variable and static fonts;
  - an empty install command for the default.

  Verify that the tests pass.
- [x] 3.4 `fluid-size.ts` (the D4 clamp math, its formatting and parsing) and `generate-scale.ts` (the steps table, `round16`, heading line height and tracking, fluid steps). Tests:
  - monotonic order for every preset ratio and every base from 14 to 20;
  - body equals the base;
  - the caption floor;
  - at 360 and 1280 px, the clamp equals the minimum and the maximum;
  - a negative intercept is formatted with `- `.

  Verify that the tests pass.
- [x] 3.5 `resolve-typography.ts`: base (preset or generated) plus per-property overrides plus font stacks. Tests: an override survives regeneration; a pairing keeps the overrides. Verify that the tests pass.
- [x] 3.6 `serialize-typography.ts`, with the D5 format and the shared `typographyVariableBlock()`. Tests:
  - deterministic bytes;
  - catalog order;
  - sorted, unique imports;
  - the header names the install command;
  - the default has no `@import`.

  Add `serialize-typography-tailwind-tests.ts`: compile `@import` of `packages/ui/src/styles/index.css` plus the default export with `@tailwindcss/node`, and check that `.typography-h1`, `font-heading` and `font-sans` read the variables and that the exported `:root` values are present. Check the `@import` lines of a pairing export textually. Verify that the tests pass.
- [x] 3.7 `parse-typography.ts` and `importTypography` (D6). Tests:
  - round trip for the default, a pairing and a custom font;
  - the import report;
  - unrelated CSS is rejected;
  - invalid values go to ignored.

  Verify that the tests pass.
- [x] 3.8 `readability-checks.ts` (D7). Tests: one case per check, plus the default with no warnings. Verify that the tests pass.
- [x] 3.9 The typography draft store (`createStore` with `aureus-typography-builder:draft:v1`) and strict validation. Tests: a valid round trip; each invalid field falls back to the default. Verify that the tests pass.

## 4. Strings, reducer and preview

- [x] 4.1 `i18n/typography-builder-strings.ts` (en/es) with every label, help text, check message, report line and the Google Fonts note. Add the tests for identical keys and placeholders. Verify that the tests pass.
- [x] 4.2 `use-typography-draft.ts` (reducer of design D2, with `base` switching on scale edits) on the shared store. Add reducer tests. Verify that the tests pass.
- [x] 4.3 `preview/` with `previewCss`, `TypographyPreview` (tabs Specimen, Article and UI; light/dark toggle; 360/768/1280 width selector, through `PreviewFrame` `width`), `specimen-sample.tsx` (computed metrics), `article-sample.tsx` and `ui-sample.tsx` (Card, Field/Input, Button, Table, Badge, `Typography` header). Verify in Storybook that switching to 360 px shrinks the fluid headings.

## 5. Form

- [x] 5.1 `fonts-section.tsx` and `font-explorer.tsx`:
  - one picker per role (bundled, system, catalog, custom);
  - the explorer, with category and variable filters, an editable sample text, a size waterfall and a weight selector;
  - lazy Google Fonts loading per visible page;
  - custom family input with an editable, unverified package;
  - the network note.

  Verify by hand that "Inter" for sans re-renders the preview.
- [x] 5.2 `pairings-section.tsx`: one-click pairings that dispatch only font actions. Verify that a weight override is kept after applying a pairing.
- [x] 5.3 `scale-section.tsx` (base px, ratio presets plus custom, fluid toggle with viewports and minimum ratio) and `tracking-section.tsx`. Verify that changing the ratio updates the specimen.
- [x] 5.4 `variants-section.tsx` and `variant-editor.tsx`: one accordion item per variant with role, fixed/fluid size, line height, weight, tracking and transform. Overridden properties are marked, with a per-property reset, and invalid input shows a message and keeps the old value. Verify that an override survives a ratio change.
- [x] 5.5 `readability-summary.tsx`, `import-section.tsx` (paste or file, report), `export-section.tsx` (name, download, copy, code view `data-testid="export-code"`) and `install-panel.tsx` (the `pnpm add` command, copy, unverified flags). Verify the download name `docs.css` and the copy content by hand.
- [x] 5.6 `typography-builder.tsx`: the layout (form | checks + preview), the header with Reset confirmation, and memoized derivations from `resolveTypography(draft)`. Verify that the page renders with the default draft and shows no warning.

  - Note: the "by hand" checks of 4.3 and 5.1–5.6 are automated in the `PairAndExport`, `Import` and `ReadabilityWarnings` stories (pairing re-renders the preview, a weight override survives a pairing and two ratio changes, 360/1280 px frame widths give the fluid minimum and maximum of `h1`, download name `docs.css`, copy content, default with no warning).

## 6. Stories and documentation

- [x] 6.1 `typography-builder-stories.tsx` (`Tools/Typography Builder`) with `Default`, plus `PairAndExport`, `Import` and `ReadabilityWarnings` as `!dev` with memory storage (design D11). Verify that every story passes, including axe, in `pnpm --filter @aureus-core/storybook test`.
- [x] 6.2 Write `apps/storybook/src/stories/guides/typography-builder.mdx` (`<En>`/`<Es>`). It covers:
  - choosing a pairing or fonts;
  - testing them in the explorer;
  - the scale and the fluid mode;
  - variant overrides;
  - reading the checks;
  - exporting, then running `pnpm add`, then importing the file after `@aureus-core/ui/styles.css`;
  - the note on the Google Fonts preview versus self-hosted Fontsource.

  Verify that the MDX coverage check passes.
- [x] 6.3 Link the builder from `foundations/typography.mdx` and `guides/theming.mdx` (the Typography section, and the Theme Builder section now states that it has no fonts). Mention it in the README under "Theming". Verify that the pages render in both locales and that `pnpm lint` formats the README.

## 7. Verification

- [x] 7.1 Run `pnpm lint && pnpm typecheck && pnpm test && pnpm build` and verify that every command passes.
- [ ] 7.2 Check by hand in Storybook:
  - the full flow (pairing → ratio 1.2 → `h2` weight → three views and three widths → export → re-import → reload restores the draft);
  - the Theme Builder has no typography section;
  - a v1 theme draft placed in `localStorage` migrates;
  - both tools switch to Spanish.
- [x] 7.3 Run `openspec validate storybook-typography-builder --strict` and verify that it passes.
