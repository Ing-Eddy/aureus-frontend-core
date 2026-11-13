## 1. Setup

- [x] 1.1 Add `culori`, `@types/culori` and `@tailwindcss/node` (same minor as `@tailwindcss/vite`) to `apps/storybook` `devDependencies`. Verify that `pnpm install` succeeds and that `pnpm --filter @aureus-core/storybook typecheck` still passes.
- [x] 1.2 Create the folder skeleton from design D1 (`stories/tools/theme-builder/{core,form,preview,i18n}`, each with `index.ts`). Add `"Tools"` after `"components"` in the `storySort` of `.storybook/preview.tsx`. Verify that `pnpm lint` passes and that the existing tests stay green (`pnpm --filter @aureus-core/storybook test`).

## 2. Theme core (pure modules, node unit tests)

- [x] 2.1 Write `core/theme-types.ts`: `ColorToken` (the full radix-nova color token list, read from `shadcn.css`), `ThemeInputs`, `ThemeDraft` (version 1) and `ResolvedTheme`, per design D2. Verify with `typecheck`.
- [x] 2.2 Write `core/color.ts` (parse any notation including bare HSL channels, OKLCH formatting with fixed rounding, gamut mapping) and `color-tests.ts`. Verify that the tests cover hex, rgb, hsl, oklch, alpha, bare channels, invalid input and that formatting is idempotent (`format(parse(format(x))) === format(x)`).
- [x] 2.3 Write `core/palettes.ts` with the Tailwind v4 neutral, zinc, stone, slate and gray ramps (50–950, OKLCH). Verify with a test that each ramp has 11 steps with strictly decreasing lightness.
- [x] 2.4 Write `core/default-theme.ts` with the Aureus preset (exact token values) and its matching inputs, plus `default-theme-tests.ts`. That test parses `packages/ui/src/styles/shadcn.css` and `theme.css` with `fs` and asserts that the preset equals them, `theme.css` overrides included. Verify that the test passes. Then change one preset value, check that the test fails and names the token, and revert the change.
- [x] 2.5 Write `core/contrast.ts` (pair table from the spec, alpha compositing, `{ pair, mode, ratio, passes }[]`) and `contrast-tests.ts`. Verify that:
  - black/white gives 21:1;
  - an alpha foreground is composited before the ratio is computed;
  - the Aureus preset has no failing pair in either mode.
- [x] 2.6 Write `core/generate-theme.ts` (design D4: tinted neutral ramp, neutral token map, brand ramp, destructive, charts, foreground repair) and `resolveTheme(draft)` (base ⊕ overrides), with `generate-theme-tests.ts`. Verify that:
  - every `ColorToken` is produced for both modes;
  - for a sweep of primaries (several hues × lightness levels × the five palettes), every repaired pair reaches ≥ 4.5:1;
  - `--primary`, `--ring` and `--sidebar-primary` carry the primary hue;
  - tint 0 leaves neutrals at the palette's own chroma;
  - overrides survive a change of inputs.
- [x] 2.7 Write `core/serialize-theme.ts` (design D7: header comment, `:root`, `.dark`, `@theme inline`, deterministic order, shadow steps derived from the parameters) and `serialize-theme-tests.ts`. Verify that two serializations of the same draft are byte-identical, and that every color in the output is `oklch(...)`.
- [x] 2.8 Add `serialize-theme-tailwind-tests.ts`. It compiles `@import "tailwindcss"; <export>` with `@tailwindcss/node` for the candidates listed in design D7. Verify that:
  - each class resolves to the theme's variables (not Tailwind defaults);
  - `dark:bg-primary` emits the `.dark` variant;
  - `p-4` uses `var(--spacing)`.

  Fix any mapping that fails in the serializer, not in the test.
- [x] 2.9 Write `core/parse-theme.ts` (the design D8 scanner) and `importTheme(draft, parsed)`, with `parse-theme-tests.ts`. Verify that the tests cover:
  - comments and quoted strings;
  - `@layer base` nesting;
  - `:root:not(.dark)`;
  - selector lists;
  - skipped `@media` / `@theme`;
  - HSL channel values;
  - a tweakcn-style sample and a shadcn v3 sample;
  - no recognized tokens → an error and an unchanged draft;
  - the report contents (`imported`, `missing`, `ignored`);
  - round trip: `importTheme(default, parse(serialize(draft)))` yields the same resolved theme as `draft`.
- [x] 2.10 Write `core/draft-storage.ts` (versioned key, shape validation, debounced save, `try/catch` around every access) and `draft-storage-tests.ts`, using a fake storage object. Verify that:
  - a valid draft round-trips;
  - corrupt JSON, a wrong version, an unknown enum value and an unparseable color each fall back to the default;
  - a storage that throws on every call does not throw out of the module.

## 3. UI strings

- [x] 3.1 Write `i18n/theme-builder-strings.ts` (EN/ES, typed with the keyed-on-English mapped type) and `theme-builder-strings-tests.ts`. Verify that:
  - the test fails when a Spanish key is removed or emptied, or when the `{placeholder}` sets differ, and that it names the key;
  - it passes with the complete strings.

## 4. Preview

- [x] 4.1 Write `preview/preview-frame.tsx` (design D5):
  - a same-origin `srcdoc` iframe per mode;
  - stylesheet cloning with `MutationObserver` re-sync;
  - the theme `<style>` and the adapter rules;
  - `.dark` on the dark frame's `<html>` only;
  - `createPortal` mount, `ResizeObserver` height and a `data-ready` attribute.

  Verify in `pnpm dev` that, with the playground toolbar set to dark, the light frame still renders light components, and the reverse.
- [x] 4.2 Write `preview/preview-sample.tsx` with the spec's showcase, using only portal-free package components imported from `@aureus-core/ui/shadcn/*`: buttons in every variant, a card with Input, NativeSelect, Checkbox and Switch, badges, an alert, tabs, a table, a recharts chart and a `sidebar-*` navigation sample. Verify in `pnpm dev`:
  - changing the radius squares the corners;
  - changing the sans font changes the text;
  - changing the shadow changes the card's shadow;
  - changing the spacing changes the gaps;
  - Tabs, Switch and Checkbox respond to clicks inside the frames.

## 5. Form and builder

- [x] 5.1 Write `theme-builder.tsx` with a `useReducer` over `ThemeDraft` (load from storage on mount, save on change). Lay out the form and the two preview frames side by side, stacked on narrow viewports. Verify that the mobile viewport toolbar shows a stacked layout without horizontal scroll.
- [x] 5.2 Write `form/colors-section.tsx`:
  - primary (swatch + text field) with an "achromatic" switch;
  - neutral palette (NativeSelect);
  - tint (Slider);
  - destructive (swatch + text field);
  - chart mode.

  Changing any input switches `base` to `generated`. Verify that changing the primary updates `--primary` in both frames, and that an invalid text value shows an error tied to its input via `aria-describedby` and keeps the previous value.
- [x] 5.3 Write `form/overrides-section.tsx`: per-mode tabs with one row per color token (swatch, value input, "overridden" badge, reset button, contrast ratio for pair tokens). Verify that an override persists after the primary changes, that its reset restores the generated value, and that a failing pair shows its ratio flagged.
- [x] 5.4 Write `form/typography-section.tsx` (sans, serif and mono stacks: curated list plus free text, and on-demand Google Fonts loading into both frames, with the privacy note) and `form/shadows-spacing-section.tsx` (shadow color per mode, opacity, blur, spread, x/y offset, radius, spacing, letter spacing). Verify that each control updates the preview, and that no font request is made until a Google font is picked (network tab).
- [x] 5.5 Write `form/contrast-summary.tsx`, which lists failing pairs per mode or reports that the theme meets WCAG AA. Verify that it updates live, and that the preset shows the "meets WCAG AA" state.
- [x] 5.6 Write `form/import-section.tsx` (Textarea paste + `.css` file input, then an import report of imported count, missing tokens and ignored declarations, or an error). Verify that importing a sample tweakcn theme updates both frames and shows the report, and that pasting unrelated CSS shows the error and leaves the theme unchanged.
- [x] 5.7 Write `form/export-section.tsx`:
  - theme name input (default "custom");
  - read-only code view of `serialize(resolveTheme(draft))`;
  - "Download" (Blob + `download="<kebab-name>.css"`, URL revoked afterwards);
  - "Copy" (clipboard with a brief confirmation; on failure the text is selected);
  - a warning naming the failing pairs.

  Verify in `pnpm dev` that the downloaded `ocean-breeze.css` matches the code view, and that copy and paste gives the same text.
- [x] 5.8 Add "Reset" with an inline confirmation that restores the preset and clears storage. Verify that after reset and reload the builder shows the preset.

## 6. Story, docs and tests

- [x] 6.1 Write `theme-builder-stories.tsx`:
  - title `Tools/Theme Builder`, `layout: "fullscreen"`, `tags: ["!autodocs"]`;
  - render passes `globals.locale`;
  - a `Default` story whose play function waits for `data-ready`, changes the primary, asserts the code view contains the new OKLCH value, overrides `--muted-foreground` with a failing value and asserts the summary flags it;
  - the play function also stubs `URL.createObjectURL` and asserts the download filename, and spies `navigator.clipboard.writeText` and asserts the copied text equals the code view;
  - an `Import` story whose play function pastes a theme and asserts the report.

  Clear the draft storage in a `beforeEach` so the stories are deterministic. Verify that `pnpm --filter @aureus-core/storybook test` runs both stories with no axe violations.

  (Deviation: in the dev server Storybook runs a story's play function when it is opened, which edited and saved the visitor's real draft. The visible `Default` story therefore has no play function. The scripted scenarios live in `GenerateAndExport` and `Import`, which are tagged `!dev` (hidden from the sidebar, still run by the story tests) and get a fresh in-memory storage from a loader instead of clearing `localStorage`.)
- [x] 6.2 Verify locale switching: in `pnpm dev`, switch to Español with an edited theme and check that labels, summary, report and actions are in Spanish and the edits are kept.
- [x] 6.3 Add a "Theme builder" section to `guides/theming.mdx` in both `<En>` and `<Es>`, linking to `?path=/story/tools-theme-builder--default` and explaining download vs. copy and how to load the file in an app. Verify that the bilingual coverage test passes and the link opens the builder.

## 7. Final verification

- [x] 7.1 Run `pnpm lint`, `pnpm typecheck`, `pnpm test` and `pnpm --filter @aureus-core/storybook... build`, then open the builder from `storybook-static` (`npx http-server`). Verify that everything passes and that download, copy, import and persistence work in the static build.
- [x] 7.2 Run an end-to-end consumer check in the scratchpad:
  1. export a theme with a blue primary, slate neutrals, radius 0.25rem, Inter, custom shadows and spacing 0.3rem;
  2. drop it into a fresh `pnpm create vite` React-TS app with Tailwind v4 and a few shadcn components (no `@aureus-core/ui`).

  Verify that `vite build` succeeds and that the app shows the theme in light mode and in `.dark`.
- [x] 7.3 Confirm that no file under `packages/` changed (`git diff --stat packages/` is empty), so no changeset is needed, and run `openspec validate storybook-theme-builder --strict`. Verify that both are clean.
