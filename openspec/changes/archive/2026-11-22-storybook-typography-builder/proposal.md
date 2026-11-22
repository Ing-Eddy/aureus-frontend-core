## Why

`add-typography` made every font, size, weight, line height and letter spacing of the package a runtime variable (`--typography-*`). Writing those 95 variables by hand is still error-prone, and so is choosing and testing fonts. There is no place to try a free font on the real components, compare type scales or check readability before an app adopts them. The Theme Builder only edits three font stacks and the base tracking, and it writes them to `--font-*` variables that now compete with the typography roles. Apps need one tool that owns typography from start to finish: the fonts, the scale and every variant, exported as a file that works with `@aureus-core/ui`.

## What Changes

- **New tool "Tools › Typography Builder"** in the playground (static, no server), with the same layout and conventions as the Theme Builder.
  - **Fonts.** It edits four roles: sans (text and UI), heading, serif and mono.
    - **Font explorer:** a curated catalog of free fonts available on both Google Fonts and Fontsource. It filters by category and by variable or static, with an editable sample text, a size waterfall and a weight selector.
    - **Custom fonts:** any other Google Fonts family can be typed in, and its Fontsource package can be edited.
    - **Pairings:** one-click font pairings, starting with Aureus (Geist + Geist Mono).
  - **Scale.** The scale is generated from a base size and a ratio, with an optional fluid mode between two viewport widths. Generating replaces the Aureus preset with computed sizes, line heights and letter spacing.
  - **Variants.** Each of the 15 variants can be overridden on its own, and each override can be reset:
    - font role;
    - fixed or fluid size;
    - line height, weight, letter spacing and text transform.
  - **Global letter spacing:** `--typography-tracking-normal`.
  - **Readability checks.** These are non-blocking warnings:
    - body text below 16 px;
    - body line height below 1.4;
    - a heading smaller than the next level down;
    - a weight the chosen font does not provide;
    - a fluid size whose preferred value has no positive `rem` term.
  - **Live preview** of real `@aureus-core/ui` components in an isolated frame. It has three tabs: specimen, article and UI sample. It can switch between light and dark mode, and between 360, 768 and 1280 px widths.
  - **Export.** It produces a `.css` file (download, copy, code view) with Fontsource `@import` lines and one `:root` block of `--typography-*` variables, plus the `pnpm add` command for the fonts. The file is meant to be loaded after `@aureus-core/ui/styles.css`.
  - **Import** of a file exported earlier, with a report.
  - **Draft** kept in the browser, and a Reset action with confirmation.
  - **Language:** every text is in English and Spanish.
- **Shared tool code.** The preview frame, form section, fields, download/copy helpers, draft-storage helpers and string-template helper move from `theme-builder/` to `tools/shared/`. Both builders use them.
- **Theme Builder (BREAKING for its exports and drafts):**
  - It no longer edits or exports fonts or letter spacing. Its typography section is replaced by a link to the Typography Builder.
  - Its export drops `--font-*`, `--font-heading`, `--tracking-*` and `body { letter-spacing }`.
  - Its import reports those declarations as ignored and points to the Typography Builder.
  - Saved drafts migrate from v1 to v2: fonts and tracking are discarded, and everything else is kept.
- **Documentation:**
  - a bilingual guide "Typography builder";
  - links from `Foundations/Typography` and the theming guide;
  - a README mention.

Non-goals:
- Changes to `@aureus-core/ui`, so there is no changeset.
- Self-hosting arbitrary font files that are not on Google Fonts or Fontsource.
- Dark-mode-specific typography.
- Sharing drafts by URL.
- Per-locale fonts.

## Capabilities

### New Capabilities

- `typography-builder`:
  - the page;
  - the default and Reset;
  - the font roles, explorer, custom fonts and pairings;
  - scale generation;
  - per-variant overrides;
  - global tracking;
  - readability checks;
  - the live preview;
  - the export with Fontsource install;
  - import;
  - draft persistence.

### Modified Capabilities

- `theme-builder`:
  - the "Radius, typography, shadows and spacing" requirement loses typography and letter spacing;
  - the import no longer reads font or letter-spacing tokens;
  - the export no longer contains them;
  - draft persistence migrates old drafts.
- `component-playground`: the "Tools" section contains the theme builder and the typography builder.

## Impact

- **New code:**
  - `apps/storybook/src/stories/tools/typography-builder/` (`core/`, `form/`, `preview/`, `i18n/`, root files);
  - `apps/storybook/src/stories/tools/shared/`;
  - `apps/storybook/src/stories/guides/typography-builder.mdx`.
- **Modified:**
  - `apps/storybook/src/stories/tools/theme-builder/**`: imports from `shared/`; fonts and tracking removed from types, generation, serialization, parsing, preview adapter, storage, i18n, form and stories;
  - `foundations/typography.mdx`, `guides/theming.mdx` and the README.
- **Reused:**
  - the `--typography-*` variables, `typographyVariants` and `Typography` from `@aureus-core/ui/components/typography`;
  - the package components for the preview and the form.
- **Dependencies:** none new. `@tailwindcss/node` is already a devDependency of the playground.
- **Network:** only the preview loads Google Fonts CSS, for non-bundled fonts. This is stated in the UI, as in the Theme Builder.
- **Release:** none. The playground is not published to npm.
