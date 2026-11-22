## Purpose

Lets anyone choose free fonts, tune the type scale and every typography variant of `@aureus-core/ui` on the real components, and take the result away as a CSS file plus a font install command for their apps.

## ADDED Requirements

### Requirement: Typography builder page
The playground SHALL provide a page under "Tools › Typography Builder" with the editing form, the readability checks and a live preview. It MUST work the same in the published static site as in local development, with no server. Its labels, help texts, messages and reports MUST follow the playground's locale switcher (English and Spanish) without a reload, and the draft MUST be kept when the locale changes.

#### Scenario: Opening the builder on the published site
- **WHEN** a user opens "Tools › Typography Builder" on the published documentation site
- **THEN** the form, the checks and the preview are shown, and editing, import and export are available

#### Scenario: Switching to Spanish
- **WHEN** a user who has edited the scale selects "Español" in the locale switcher
- **THEN** every label and message is shown in Spanish and the edited scale is kept

### Requirement: Default starting typography
When there is no saved draft, the builder SHALL start from the Aureus default typography: the font roles and the 15 variant values that `@aureus-core/ui` ships. The preview MUST then look like the components elsewhere in the playground, and its export MUST contain exactly the package's default values. A "Reset" action MUST bring the builder back to this state after asking for confirmation, and MUST discard the saved draft.

#### Scenario: First visit
- **WHEN** a user opens the builder for the first time
- **THEN** every font role and every variant property shows the value of the package stylesheet, and no readability warning is shown

#### Scenario: Reset
- **WHEN** a user has changed fonts and sizes and confirms "Reset"
- **THEN** every input returns to the Aureus default and the stored draft is removed

### Requirement: Font roles and font explorer
The builder SHALL let the user set the family of four roles: `sans`, `heading`, `serif` and `mono`. For each role, the user MUST be able to choose:
- the bundled default (Geist, or Geist Mono for `mono`);
- the system stack;
- a font from a curated catalog of free fonts available on both Google Fonts and Fontsource;
- any other Google Fonts family typed as free text.

Each catalog entry MUST state its category (sans, serif, display or mono), whether it is a variable font, the weights it provides and its exact Fontsource package. The explorer MUST filter the catalog by category and by variable or static. It MUST render every listed font in that font, with a sample text the user can edit, a size waterfall and a weight selector. For a free-text family, the builder MUST propose a Fontsource package name derived from the family, let the user edit it, and mark it as unverified.

Every chosen family MUST be stored as a full stack with a generic fallback for its role.

#### Scenario: Choosing a catalog font
- **WHEN** a user picks "Inter" for the `sans` role
- **THEN** the preview's body text renders in Inter, and the export sets `--typography-font-sans` to Inter followed by a sans-serif fallback

#### Scenario: Trying a font outside the catalog
- **WHEN** a user types "Atkinson Hyperlegible Next" for the `heading` role
- **THEN** the preview headings render in that family, the proposed package is shown as unverified, and the user can edit it

#### Scenario: Filtering the explorer
- **WHEN** a user filters the explorer by "serif" and "variable"
- **THEN** only variable serif fonts are listed, each one rendered in its own font

### Requirement: Font pairings
The builder SHALL offer curated font pairings that set several roles in one action. The first pairing MUST be Aureus (Geist for sans and heading, Geist Mono for mono). Applying a pairing MUST change only the font roles. Sizes, weights and other overrides MUST be kept.

#### Scenario: Applying a pairing
- **WHEN** a user who has overridden the weight of `h2` applies the "Inter + JetBrains Mono" pairing
- **THEN** `sans` and `heading` become Inter, `mono` becomes JetBrains Mono, and `h2` keeps the overridden weight

### Requirement: Scale generation
The builder SHALL generate the sizes of every variant from:
- a base size between 14 and 20 px;
- a ratio, chosen from named presets (1.125, 1.2, 1.25, 1.333, 1.414) or entered as a custom value.

The sizes MUST grow monotonically from `caption` to `display`, in this order: `caption` ≤ `body-sm` ≤ `body` ≤ `body-lg` ≤ `lead`, and `h6` ≤ `h5` ≤ … ≤ `h1` ≤ `display`. The line height and letter spacing of `display` and the headings MUST be derived from their size: tighter for larger text. The other variants MUST keep the line height and letter spacing of the base.

An optional fluid mode MUST make the largest headings scale between a minimum and a maximum viewport width. Each fluid size MUST be written as a `clamp()` whose three terms all include `rem`, so the size grows with zoom. Generating MUST replace the preset's sizes, line heights and letter spacing, keep the fonts, weights and transforms, and keep every per-variant override.

#### Scenario: Changing the ratio
- **WHEN** a user selects the 1.333 ratio with a 16 px base
- **THEN** `h3`, `h2`, `h1` and `display` grow, `body` stays 1rem, and the preview updates without a reload

#### Scenario: Fluid headings
- **WHEN** a user enables the fluid mode between 360 and 1280 px
- **THEN** the largest headings get `clamp()` sizes whose minimum applies in a 360 px preview and whose maximum applies in a 1280 px preview

### Requirement: Per-variant overrides
For each of the 15 variants, the user SHALL be able to override:
- the font role;
- the size, either fixed (rem, or em for `code`) or fluid (minimum and maximum);
- the line height;
- the weight, from 100 to 900;
- the letter spacing (em);
- the text transform (`none`, `uppercase`, `lowercase` or `capitalize`).

Overridden properties MUST be marked as such and MUST keep their value when the scale is regenerated. The user MUST be able to reset each override to its base value. Invalid input MUST be rejected with a visible message, and the previous value MUST be kept.

#### Scenario: Override survives regeneration
- **WHEN** a user sets the weight of `h1` to 800 and then changes the ratio
- **THEN** `h1` keeps weight 800, marked as overridden, while its size follows the new scale

#### Scenario: Invalid size
- **WHEN** a user types `big` into the size of `lead`
- **THEN** an error message is shown next to the input and the size keeps its previous value

### Requirement: Global letter spacing
The builder SHALL let the user set the base letter spacing of the page, which is exported as `--typography-tracking-normal` in em. Tailwind's `tracking-*` steps in the preview MUST follow it.

#### Scenario: Wider base tracking
- **WHEN** a user sets the base letter spacing to 0.01em
- **THEN** the preview's body text and `tracking-wide` utilities render 0.01em wider than before

### Requirement: Readability checks
The builder SHALL show non-blocking warnings, updated on every change, when:
- `body` is smaller than 16 px at the reference root size;
- the line height of `body`, `body-lg` or `lead` is below 1.4;
- a heading is smaller than the next lower heading level;
- a variant's weight is not provided by the font of its role, according to the catalog;
- a fluid size's preferred value has no positive `rem` term, so it would not grow with zoom.

Each warning MUST name the variant and the value. When there is no warning, the builder MUST say so. Warnings MUST NOT disable export.

#### Scenario: Unsupported weight
- **WHEN** the `heading` role is a static font with only 400 and 700 and `h2` has weight 600
- **THEN** a warning names `h2` and weight 600

#### Scenario: No warnings
- **WHEN** every check passes
- **THEN** the checks area reports that the typography passes the readability checks

### Requirement: Live typography preview
The preview SHALL render real `@aureus-core/ui` components with the edited typography, in an isolated frame. It MUST offer three views:
- **Specimen:** every variant with its name and computed metrics.
- **Article:** long-form text with headings, lead, body, code and captions.
- **UI:** a card, form fields, buttons, a table and a page header.

The user MUST be able to switch the frame between light and dark mode, and between 360, 768 and 1280 px widths, so fluid sizes can be checked. Only the preview uses the edited typography: the builder's own form MUST keep the playground's styles. Fonts that are not bundled MAY be loaded from Google Fonts in the preview only, and the UI MUST say so.

#### Scenario: Preview isolates the edited typography
- **WHEN** a user sets `body` to 2rem
- **THEN** body text in the preview is 2rem, and the form's own text keeps its size

#### Scenario: Checking a fluid size on a narrow screen
- **WHEN** a user selects the 360 px width
- **THEN** each fluid variant in the specimen shows its minimum size

### Requirement: Typography export
The builder SHALL export one CSS file containing, in this order:
- a header comment with the name, the generator, the install command and the instruction to load the file after `@aureus-core/ui/styles.css`;
- one `@import` line per non-bundled font package, sorted, with no duplicates;
- one `:root` block with every font role, `--typography-tracking-normal` and the six variables of every variant, in catalog order.

The output MUST be deterministic: the same draft gives the same bytes. The user MUST be able to:
- set the name, which defaults to "typography", so the file downloads as `typography.css`;
- download the file as `<name>.css`, with the name in kebab-case;
- copy the same content.

The output MUST also be shown in a read-only code view. A separate install panel MUST show the `pnpm add` command for every non-bundled font package, with a copy action, and MUST flag unverified packages. With the default typography, the install command MUST be empty and the file MUST have no `@import` lines.

#### Scenario: Exporting a custom pairing
- **WHEN** a user applies "Inter + JetBrains Mono", names the typography "Docs" and selects "Download"
- **THEN** the browser saves `docs.css`, which imports `@fontsource-variable/inter` and `@fontsource-variable/jetbrains-mono` and sets the typography variables, and the install panel shows `pnpm add @fontsource-variable/inter @fontsource-variable/jetbrains-mono`

#### Scenario: Exported file works with the package
- **WHEN** the exported file is compiled with Tailwind CSS v4 after `@aureus-core/ui/styles.css`
- **THEN** `.typography-h1`, `font-heading` and `font-sans` resolve to the exported values

#### Scenario: Round trip
- **WHEN** a typography is exported and imported again
- **THEN** every font role, package and variant value is unchanged

### Requirement: Import typography
The user SHALL be able to load a typography by pasting CSS or choosing a `.css` file. The import MUST:
- read `--typography-*` declarations from `:root`;
- read Fontsource `@import` lines to recover the packages;
- recognise catalog fonts by family;
- treat unknown families as custom fonts.

Imported values are overrides. Values missing from the file MUST keep their current value. The builder MUST report how many values were imported, which known variables were missing and which declarations were ignored. Input with no `--typography-*` declaration MUST be rejected with a message, and the draft MUST stay unchanged.

#### Scenario: Rejecting unrelated CSS
- **WHEN** a user pastes a color theme with no typography variables
- **THEN** an error message is shown and the draft is unchanged

### Requirement: Typography draft persistence
The builder SHALL save the draft in the browser on every change and restore it on the next visit. The draft holds the fonts, scale inputs, overrides, tracking and name. If the stored draft is unreadable, or storage is unavailable, the builder MUST start from the default typography and stay fully usable.

#### Scenario: Reload keeps work
- **WHEN** a user picks a heading font, changes the ratio and reloads the page
- **THEN** the builder shows the same font, ratio and overrides

#### Scenario: Storage unavailable
- **WHEN** browser storage throws on access
- **THEN** the builder starts from the default typography, and editing and export still work
