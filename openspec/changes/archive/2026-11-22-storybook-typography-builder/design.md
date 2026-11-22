## Context

See proposal.md (Why) for the motivation and `specs/typography-builder/spec.md` for the requirements. These facts shape the approach:

- **The Theme Builder** (`apps/storybook/src/stories/tools/theme-builder/`, archived change `2026-11-13-storybook-theme-builder`) sets the pattern:
  - `core/` is pure TypeScript with node tests;
  - `form/` holds the sections; `preview/` holds an iframe `PreviewFrame` that mounts children through a portal and clones the playground stylesheets;
  - `i18n/` holds `Record<Locale, Strings>` plus `fill()`;
  - drafts are a reducer plus a debounced `localStorage` saver;
  - test stories are `!dev` with in-memory storage.
- **Pieces to share:**
  - `PreviewFrame`, `Section`, `NumberField` and `SliderField` have no theme logic.
  - `ColorField` and `NumberField` take `t: ThemeBuilderStrings` for one or two messages.
  - `downloadCss` lives in `form/export-section.tsx`.
  - `draft-storage.ts` mixes generic helpers (`browserStorage`, saver, load/save/clear) with theme validation.
- **The package after `add-typography`:**
  - `typography.css` reads every value from `:root` variables at runtime;
  - the `.typography-<variant>` classes are in `@layer components`;
  - `font-*` and `tracking-*` resolve to `var(--typography-*)`;
  - `typographyVariants` is exported.

  Storybook compiles the package stylesheet, so a preview only has to inject a `:root` block. No adapter rules are needed for typography, unlike the theme preview's D5.
- **Font naming:** Fontsource variable packages register the family `"<Family> Variable"`. Static Fontsource packages and the Google Fonts CSS API register `"<Family>"`.
- **Catalog check:** every catalog package below was checked against the npm registry while writing this design (2026-11-22). Commit Mono was dropped (static-only, and not on Google Fonts).

## Goals / Non-Goals

**Goals:**
- The default draft exports exactly the values of `packages/ui/src/styles/typography.css`. A test fails on drift.
- One resolved model feeds the preview CSS, the checks, the code view, the download and the install command.
- The Theme Builder keeps working, with less scope, and loses no data other than fonts and tracking.

**Non-Goals:**
- Editing the package's `typography.css` from the tool. The tool only exports app files.
- Font subsetting, `font-display` or preload hints.
- Choosing a different variant per breakpoint. Fluid sizes cover responsive headings.

## Decisions

### D1. Folder layout and the shared layer

```
tools/shared/                 # no stories; each folder has index.ts
  preview/  preview-frame.tsx       # + `width?: number` (fixed iframe width, centred) and `mode`
  form/     section.tsx fields.tsx  # NumberField, SliderField, ColorField, TextField, SelectField: messages via props
  export/   download-file.ts copy-text.ts   # downloadCss, copyText (clipboard + select fallback)
  storage/  draft-storage.ts        # DraftStorage, browserStorage, createStore<T>({ key, validate, migrate?, create })
  i18n/     fill.ts                 # fill, placeholders
  utils/    to-file-name.ts
tools/theme-builder/          # imports shared/, keeps its own core/form/preview/i18n
tools/typography-builder/
  typography-builder-stories.tsx typography-builder.tsx use-typography-draft.ts index.ts
  core/    typography-types.ts default-typography.ts font-catalog.ts font-pairings.ts font-stack.ts
           generate-scale.ts fluid-size.ts resolve-typography.ts serialize-typography.ts
           parse-typography.ts readability-checks.ts google-fonts-url.ts install-command.ts index.ts
  form/    fonts-section.tsx font-explorer.tsx pairings-section.tsx scale-section.tsx
           variants-section.tsx variant-editor.tsx tracking-section.tsx readability-summary.tsx
           import-section.tsx export-section.tsx install-panel.tsx index.ts
  preview/ typography-preview.tsx specimen-sample.tsx article-sample.tsx ui-sample.tsx preview-css.ts index.ts
  i18n/    typography-builder-strings.ts (+ tests) index.ts
```

- **Shared fields:** they receive their messages as props (for example `invalidMessage`), so they do not depend on either builder's strings type. Each builder passes its own `t.*`.
- **Storage helper:** `createStore` wraps the versioned key, validation, optional migration, loading with a fallback, and the debounced saver. Each builder keeps only its own `validate`.
- **Alternative: copy the files into the new tool.** Rejected: two copies of the iframe and storage logic would drift.

### D2. Draft model: base + overrides, resolved in one place

This is the same principle as Theme Builder D2.

```ts
type FontRole = "sans" | "heading" | "serif" | "mono";
type FontChoice =
  | { kind: "bundled" }                              // Geist / Geist Mono; system serif for serif
  | { kind: "system" }
  | { kind: "catalog"; id: string }                  // font-catalog entry id
  | { kind: "custom"; family: string; fontsource: string };   // free text, unverified
type SizeValue =
  | { kind: "fixed"; value: number; unit: "rem" | "em" }
  | { kind: "fluid"; min: number; max: number; intercept: number; slope: number }; // rem, rem, rem, vw
interface VariantStyle {
  font: FontRole; size: SizeValue; lineHeight: number | "inherit";
  weight: number; tracking: number; transform: "none" | "uppercase" | "lowercase" | "capitalize";
}
interface ScaleInputs { basePx: number; ratio: number; fluid: boolean; minViewport: number; maxViewport: number; minRatio: number }
interface TypographyDraft {
  version: 1; name: string;
  base: { kind: "preset"; id: "aureus" } | { kind: "generated" };
  fonts: Record<FontRole, FontChoice>;
  scale: ScaleInputs;          // defaults 16 / 1.25 / false / 360 / 1280 / 1.2
  tracking: number;            // em
  overrides: Partial<Record<TypographyVariant, Partial<VariantStyle>>>;
}
```

- **Resolving:** `resolveTypography(draft)` takes the base styles (the Aureus preset or `generateScale(draft.scale)`), lays the overrides on top property by property, and turns the font choices into stacks (D3).
- **Leaving the preset:** editing any `scale` input switches `base` to `generated`. Fonts, tracking and overrides never change `base`.
- **Pairings:** a pairing only dispatches `font` actions.
- **Reducer actions:** `font | scale | override | resetOverride | tracking | name | replace | reset`.

### D3. Fonts: catalog, stacks and loading

**Catalog entry:** `{ id, family, category: "sans" | "serif" | "display" | "mono", variable: boolean, weights: number[] | [min, max], fontsource }`. The first entries per role are the bundled and the system choices. The catalog has 51 entries, all checked on npm, with weights from the Fontsource API:

| Category | Fonts |
|---|---|
| sans, variable | Inter, Roboto, Open Sans, Montserrat, Nunito, DM Sans, Plus Jakarta Sans, Manrope, Work Sans, Figtree, Outfit, Onest, Raleway, Rubik, Source Sans 3, Lexend, IBM Plex Sans, Sora, Urbanist, Instrument Sans, Archivo, Public Sans, Noto Sans, Mona Sans, Hanken Grotesk, Atkinson Hyperlegible Next |
| sans, static | Lato, Poppins |
| display | Space Grotesk (variable), Bricolage Grotesque (variable), DM Serif Display (static), Instrument Serif (static) |
| serif, variable | Merriweather, Lora, Playfair Display, Source Serif 4, Fraunces, Libre Baskerville, EB Garamond, Crimson Pro, Noto Serif, Newsreader, Literata |
| mono, variable | JetBrains Mono, Fira Code, Source Code Pro, Roboto Mono, Red Hat Mono |
| mono, static | DM Mono, IBM Plex Mono, Space Mono |

- **Packages:** variable entries use `@fontsource-variable/<slug>`, static ones `@fontsource/<slug>`.
- **Weights:** they are copied from each family's Fontsource metadata when the catalog is written. A unit test checks the shape: unique ids and packages, weights within 100–900, and categories present.

**Stack (`font-stack.ts`):**
- A variable font gives `"<Family> Variable", "<Family>", <role fallback>`.
- A static or custom font gives `"<Family>", <role fallback>`.
- The second name lets the Google Fonts preview and an app on static Fontsource use the same stack as an app on `@fontsource-variable`.
- The bundled and system stacks are the exact strings of `typography.css` or the generic stacks.
- The role fallbacks are the sans, serif and mono generics. `heading` uses the generic of the font's own category: serif for serif and display-serif fonts, sans otherwise.

**Custom fonts:**
- The package is proposed as `@fontsource/<slug>`, where the slug is the family in lowercase with spaces turned into `-`. It is editable and marked unverified.
- The family is checked against `/^[A-Za-z0-9 ]{2,60}$/`.

**Preview loading:**
- `googleFontsUrl(fonts)` builds one `css2` URL for the non-bundled, non-system families, with `wght@<min>..<max>` for variable fonts and `wght@<list>` for static ones, plus `display=swap`.
- Custom families request `wght@400;700`.
- The explorer loads one URL for the visible page of the catalog only, so filtering does not load all 48 families at once.
- A note in the UI says Google Fonts is contacted for the preview only.

### D4. Scale generation

- **Sizes:** with `b = basePx / 16` (rem) and ratio `r`, `size = round16(b · r^step)`, where `round16` rounds to 1/16 rem.

  | Variant | Step |
  |---|---|
  | `display` | 5 |
  | `h1` | 4 |
  | `h2` | 3 |
  | `h3` | 2 |
  | `h4`, `lead` | 1 |
  | `h5`, `body-lg` | 0.5 |
  | `h6`, `body` | 0 |
  | `body-sm`, `label` | −0.5 |
  | `caption`, `overline` | −1 |

  Every negative step is floored at 0.75rem, so small text stays legible and keeps its order.

  `code` stays `0.875em`. Monotonic order is guaranteed by the steps, and a test checks it for every preset ratio and every base from 14 to 20.
- **Headings and `display`:**
  - line height: `round(clamp(1.1, 1.5 − 0.3 · log2(px / 16), 1.5), 0.05)`;
  - letter spacing: `round(clamp(−0.04, −0.02 · log2(px / 16), 0), 0.005)` em, where `px` is the (maximum) size.

  This gives 1.5 / 0em at 16 px and 1.2 / −0.02em at 32 px, close to the preset.
- **Other variants:** they keep the preset's line height, letter spacing, weight, font role and transform.
- **Fluid mode:** steps ≥ 3 (`display`, `h1`, `h2`) become fluid. `max = b · r^step` and `min = b · minRatio^step`, where `minRatio ≤ ratio` and the default is 1.2. With viewports `vmin` and `vmax` in px:
  - `slope = (max − min) · 16 / (vmax − vmin) · 100` (vw);
  - `intercept = min − slope · vmin / 1600` (rem).

  Both are rounded to 3 decimals. It is written as `clamp(<min>rem, <intercept>rem + <slope>vw, <max>rem)`. A negative intercept stays a leading negative rem term (`-0.2rem + 3vw`). A fluid minimum is never smaller than the minimum of the next lower heading (`h2` ≥ `h3`, `h1` ≥ `h2`, `display` ≥ `h1`), so the order holds at every width. Editing min or max in a variant override recomputes the intercept and slope with the draft's viewports.
- **Alternative: a single modular scale with no steps table.** Rejected: body text and small text need half steps, or they jump too far apart.

### D5. Serialization (export)

`serializeTypography(resolved)` writes:
1. **The header comment:** the name, the generator, `Install: pnpm add …` or `No font install needed`, and `Import this file after @aureus-core/ui/styles.css.`
2. **Imports:** the sorted, de-duplicated `@import "<package>";` lines for non-bundled fonts.
3. **`:root`:** the four `--typography-font-*` lines, `--typography-tracking-normal`, then six lines per variant in `typographyVariants` order.

Number format:
- at most 4 decimals (1/16 rem steps such as 1.0625), with no trailing zeros;
- `0em` for zero tracking;
- `inherit` and `none` written literally;
- fluid sizes as in D4.

`installCommand(resolved)` returns `pnpm add <packages…>`, or nothing when no package is needed. The serializer and the preview share `typographyVariableBlock()`, as the Theme Builder shares `themeVariableBlocks`.

### D6. Import

`parseTypographyCss(text)` does the following:
- It reuses the hand-written block scanner approach of `parse-theme.ts` (Theme Builder D8). It only needs `:root` and top-level `@import`.
- It reads `--typography-*` declarations.
- Font stacks are matched to the catalog by their first family name, with ` Variable` removed. Generic stacks match `system`. Geist and Geist Mono match `bundled`. Anything else becomes `custom`, with the package taken from a matching `@import` line, or proposed (D3).
- Sizes are parsed as `<n>rem`, `<n>em` or the D4 `clamp()` form. Line height is a number or `inherit`. The weight is an integer from 1 to 1000. Tracking is `<n>em`. The transform must be one of the four keywords.
- Invalid or unknown declarations go to `ignored`.
- `importTypography(draft, parsed)` stores the values as overrides, plus fonts and tracking, and returns `{ imported, missing[], ignored[] }`.

### D7. Readability checks

`checkReadability(resolved)` evaluates sizes at a reference root of 16 px. Fluid sizes are checked at their minimum. It returns `{ id, variant, value }` items, each with a localized message:

| Check | Rule |
|---|---|
| `body-too-small` | body < 16 px |
| `line-height-tight` | body, body-lg or lead line height < 1.4 |
| `heading-order` | h(n) smaller than h(n+1), and display smaller than h1, compared at minimum and maximum |
| `weight-unavailable` | a static catalog font without that weight, or a variable font outside its range. Custom fonts are not checked |
| `fluid-without-rem` | a fluid size whose preferred value has no positive rem term (intercept ≤ 0), so it stops growing with zoom. The parser only accepts rem terms, so this is the remaining case |

### D8. Preview

- **One frame:** a single `PreviewFrame` with a light/dark toggle, instead of the Theme Builder's two side-by-side frames, so it fits the width selector (360, 768 and 1280 px). The frame is centred and scrolls horizontally when it is wider than the column. Typography does not change between modes, so one frame is enough.
- **Frame CSS:** `previewCss(resolved)` returns only `typographyVariableBlock()`. The cloned package stylesheet does the rest, so the preview matches the export.
- **Views:** the Specimen, Article and UI views are in `preview/`. Specimen reads the computed metrics, as the docs `TypeScale` does. UI uses Card, Field and Input, Button, Table and Badge from the package, and `Typography` for the page header.
- **Fonts:** the Google Fonts URL from D3 is passed through the existing `fontsUrl` prop.

### D9. Storage and Theme Builder migration

- **Typography Builder:** `createStore` with the key `aureus-typography-builder:draft:v1`. Validation is strict: every font choice, every `SizeValue` and every override property is checked. Anything invalid falls back to the default draft.
- **Theme Builder:**
  - `ThemeInputs` loses `fonts` and `tracking`, and `ThemeDraft.version` becomes 2.
  - The key is now `aureus-theme-builder:draft:v2`. The store first reads v2; if there is none, it reads v1, removes `fonts` and `tracking`, validates the result as v2, saves it as v2 and deletes the v1 key.
  - In the theme core:
    - `serialize-theme.ts` drops `--font-*`, `--font-heading`, `--tracking-*` and `body { letter-spacing }`;
    - `parse-theme.ts` moves those names to `ignored` with the hint key;
    - `preview-css.ts` drops the font and tracking adapter rules;
    - `font-options.ts` and `form/typography-section.tsx` are deleted, and `googleFontsUrl` moves to the typography core.
  - The form shows a link card where the typography section was.
  - The export is named `theme` by default (`theme.css`), and its light block uses `:root, :root:not(.dark)`. The package sets `--destructive` and `--muted-foreground` with `:root:not(.dark)` (0,2,0), which a plain `:root` (0,1,0) loses to even later in the cascade, so custom values of those two tokens were ignored in light mode. Its header says how to import it after `@aureus-core/ui/styles.css`. The Typography Builder export is named `typography` by default. An app imports the package, then `theme.css`, then `typography.css`.
  - The theme tests are updated: the Tailwind compile test no longer expects `font-sans` or `tracking-tight`, and it gains the "no typography in the theme file" case.

### D10. Strings

`typography-builder-strings.ts` follows the Theme Builder pattern: `Record<Locale, Strings>`, `fill()` placeholders, and a test that every locale has the same keys and placeholders. Variant names (`h1`, `body-sm`…) and package names are code, not translated. Font family names are not translated.

### D11. Stories

`Tools/Typography Builder` follows Theme Builder D-stories: `!autodocs`, fullscreen, controls off, and the locale taken from globals. It has these stories:
- `Default`: real `localStorage`.
- `PairAndExport` (`!dev`, memory storage):
  - applies "Inter + JetBrains Mono";
  - switches the ratio to 1.333;
  - overrides the `h2` weight to 800;
  - checks the preview's computed styles at 360 and 1280 px;
  - checks the code view and the install command;
  - spies on the download.
- `Import` (`!dev`): pastes an export with a custom font, checks the report and the round trip, then pastes unrelated CSS and checks the error.
- `ReadabilityWarnings` (`!dev`): sets body to 0.8rem and h3 below h4, and checks both warnings.

## Risks / Trade-offs

- **[Google Fonts and Fontsource versions differ slightly]** → The preview is an approximation of the self-hosted font. Metrics match in practice, and this is noted in the guide.
- **[A custom font's package guess is wrong]** → It is marked unverified in the UI and in a header comment of the export, and the user can edit it.
- **[Static fonts with a missing weight synthesize bold]** → This is covered by the `weight-unavailable` check.
- **[The catalog goes stale]** → It is plain data in one file, with a shape test. New entries are a data change.
- **[Theme exports lose fonts (BREAKING for the tool)]** → Old files still import: fonts are reported as ignored with a pointer. The theming guide and the foundations page explain where fonts went.
- **[A single preview frame hides mode-specific issues]** → Typography has none. Colors stay in the Theme Builder's two-frame preview.

## Migration Plan

This is a playground-only change with no package release. Visitors with a v1 theme draft get it migrated on their first visit. Rollback means reverting the commit; a v2 draft would then be ignored by the old code, which would start from the default.
