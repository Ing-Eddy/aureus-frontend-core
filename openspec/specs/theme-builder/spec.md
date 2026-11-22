# theme-builder Specification

## Purpose
Lets anyone create a complete, accessible shadcn theme from a few inputs, preview it on the real components and take it away as a standalone CSS file for any Tailwind CSS v4 shadcn app.

## Requirements

### Requirement: Theme builder page
The playground SHALL provide a theme builder page under "Tools › Theme Builder". The page shows the editing form and a live preview. It MUST work the same in the published static site as in local development, with no server.

#### Scenario: Opening the builder on the published site
- **WHEN** a user opens "Tools › Theme Builder" on the published documentation site
- **THEN** the form and the preview are shown, and every feature (editing, import, export) is available

### Requirement: Default starting theme
When there is no saved draft, the builder SHALL start from the Aureus brand theme: the color tokens `@aureus-core/ui` ships, with Aureus Blue as primary, Aureus Gold as secondary and slate neutrals. Its inputs MUST describe that theme: the blue primary color, a non-achromatic primary, the slate neutral palette and primary-derived charts. Its preview MUST look like the components do elsewhere in the playground. A "Reset" action MUST bring the builder back to this state after asking for confirmation.

#### Scenario: First visit
- **WHEN** a user opens the builder for the first time
- **THEN** every token shows the value the package's stylesheet uses, and no contrast pair is flagged

#### Scenario: Reset
- **WHEN** a user has edited the theme and confirms "Reset"
- **THEN** every input and token returns to the Aureus brand theme, and the saved draft is discarded

#### Scenario: Brand inputs
- **WHEN** a user opens the builder for the first time
- **THEN** the primary color input shows Aureus Blue and the neutral palette shows slate

### Requirement: Generated color tokens
The builder SHALL derive every color token for both light and dark mode from these inputs:
- a primary color;
- a neutral palette: neutral, zinc, stone, slate or gray;
- a neutral tint amount, from no tint to a visible tint of the primary hue;
- a destructive color, which defaults to the Aureus red;
- a chart palette mode: monochrome, or derived from the primary hue.

The generated token set MUST cover every color token the shadcn stylesheet defines: background, foreground, card, popover, primary, secondary, muted, accent, destructive, border, input, ring, chart-1 to chart-5 and the sidebar tokens, each with its foreground pair where one exists. Each foreground MUST be chosen so that it reaches at least 4.5:1 against its surface, if any color in the palette can. Changing an input MUST update the affected tokens and the preview without a reload.

#### Scenario: Changing the primary color
- **WHEN** a user sets the primary color to a saturated blue
- **THEN** `--primary`, `--ring` and the sidebar primary tokens become shades of that blue in both modes, and `--primary-foreground` reaches at least 4.5:1 on `--primary` in both modes

#### Scenario: Changing the neutral palette
- **WHEN** a user switches the neutral palette from neutral to slate
- **THEN** background, card, popover, secondary, muted, accent, border, input and their foregrounds take slate values in both modes

### Requirement: Per-token overrides
The user SHALL be able to override any single color token, in either mode, with an explicit value. Overridden tokens MUST be marked as such. They MUST keep their value when the generation inputs change, and the user MUST be able to reset each one to its generated value. A color input MUST accept hex, rgb, hsl and oklch notation, alpha included. It MUST reject invalid values with a visible message and keep the previous value.

#### Scenario: Override survives regeneration
- **WHEN** a user overrides the light `--accent` and then changes the primary color
- **THEN** the light `--accent` keeps the overridden value and is marked as overridden, while the other tokens update

#### Scenario: Invalid color
- **WHEN** a user types `not-a-color` into a token's input
- **THEN** an error message is shown next to the input, and the token keeps its previous value

### Requirement: Contrast validation
The builder SHALL show the WCAG 2 contrast ratio of every surface/foreground pair in both modes. The pairs are:
- background, card, popover, primary, secondary, muted, accent, sidebar, sidebar-primary and sidebar-accent against their foreground;
- muted-foreground against background and against muted;
- destructive against background.

Colors with alpha MUST be composited over the surface they are drawn on before the ratio is computed. A pair below 4.5:1 MUST be flagged in the form and in a summary of failing pairs. The ratios MUST update on every change.

#### Scenario: Failing pair is flagged
- **WHEN** a user overrides the light `--muted-foreground` with a value that gives 3:1 on `--muted`
- **THEN** that pair is flagged with its ratio, and the summary lists it as failing in light mode

#### Scenario: All pairs pass
- **WHEN** every pair reaches at least 4.5:1 in both modes
- **THEN** the summary reports that the theme meets WCAG AA for text contrast

### Requirement: Live preview
The preview SHALL render real `@aureus-core/ui` components with the edited theme, in light and dark mode side by side. It MUST include at least: buttons in every variant, a card with form controls (input, select, checkbox, switch), badges, an alert, tabs, a table, a chart and a sidebar-style navigation sample. Only the preview uses the edited theme. The builder's own form MUST keep the playground's theme, so that it stays readable whatever theme is being edited.

#### Scenario: Preview isolates the edited theme
- **WHEN** a user sets an unreadable foreground color
- **THEN** the preview shows that color, and the form controls keep the playground's own styles

### Requirement: Import an existing theme
The user SHALL be able to load a theme by pasting CSS or by choosing a `.css` file. The import MUST:
- read custom-property declarations from `:root` (or `:root:not(.dark)`) for light mode and from `.dark` for dark mode;
- accept color values in hex, rgb, hsl, oklch, or bare shadcn HSL channels (`222.2 84% 4.9%`), and convert them to OKLCH;
- read the radius, shadow and spacing tokens when present.

Font and letter-spacing declarations (`--font-*`, `--tracking-normal`, `--letter-spacing`) MUST be reported as ignored, with a hint that typography is edited in the Typography Builder. Imported color tokens are treated as overrides. Tokens missing from the file keep their current values. The builder MUST then report how many tokens were imported, which recognized tokens were missing, and which declarations were ignored. Input with no recognizable token MUST be rejected with a message, and the theme MUST stay unchanged.

#### Scenario: Importing a theme exported earlier
- **WHEN** a user imports a file the builder exported
- **THEN** every token in the builder equals the value in the file, and the report shows no ignored declarations

#### Scenario: Importing an older export with fonts
- **WHEN** a user imports a theme file that also sets `--font-sans` and `--tracking-normal`
- **THEN** the colors, radius, shadows and spacing are imported, and the report lists the font and tracking declarations as ignored with a pointer to the Typography Builder

#### Scenario: Importing an HSL theme
- **WHEN** a user pastes a theme whose colors are written as `--primary: 222.2 47.4% 11.2%;`
- **THEN** `--primary` is imported as the equivalent OKLCH color

#### Scenario: Rejecting unrelated CSS
- **WHEN** a user pastes CSS with no shadcn theme tokens
- **THEN** an error message is shown, and the current theme is unchanged

### Requirement: Standalone CSS export
The builder SHALL export the theme as one CSS file containing:
- a header comment with the theme name, the generator and how to import the file in an `@aureus-core/ui` app and in any other shadcn app;
- a light block with every light token, whose selector is `:root, :root:not(.dark)` so it also overrides the package's light-only `:root:not(.dark)` tokens;
- a `.dark` block with every dark color token and the dark shadow tokens;
- an `@theme inline` block that maps colors, radius steps and shadows to Tailwind theme variables, as shadcn's own stylesheet does.

The file MUST NOT contain font or letter-spacing variables. Typography is exported by the Typography Builder. All colors MUST be written in OKLCH. The file MUST be usable on its own in a Tailwind CSS v4 shadcn app that imports `tailwindcss` and uses the `.dark` class for dark mode, without `@aureus-core/ui`. The user MUST be able to set the theme name, which defaults to "theme", so the file downloads as `theme.css`. The user MUST be able to download the file as `<theme-name>.css`, with the name in kebab-case, and copy the same content to the clipboard. The output MUST also be shown in a read-only code view. If any contrast pair fails, the export actions MUST stay enabled but show a warning that names the failing pairs.

#### Scenario: Downloading the theme
- **WHEN** a user named the theme "Ocean Breeze" and selects "Download"
- **THEN** the browser saves a file named `ocean-breeze.css` with the `:root`, `.dark` and `@theme inline` blocks

#### Scenario: Copying the theme
- **WHEN** a user selects "Copy"
- **THEN** the clipboard contains exactly the content the code view shows, and the control briefly confirms the copy

#### Scenario: Exported file works in a fresh app
- **WHEN** the exported file is imported after `tailwindcss` in a Tailwind CSS v4 project and compiled
- **THEN** `bg-primary`, `text-muted-foreground`, `rounded-lg`, `shadow-md` and the spacing utilities resolve to the theme's values in light mode and, under `.dark`, to the dark values

#### Scenario: Exported file works after the package stylesheet
- **WHEN** an app imports `@aureus-core/ui/styles.css` and then the exported file, which sets a custom light `--muted-foreground`
- **THEN** light mode uses the exported `--muted-foreground` instead of the package's accessibility value, and dark mode uses the exported dark values

#### Scenario: No typography in the theme file
- **WHEN** a user exports any theme
- **THEN** the file contains no `--font-` or `--tracking-` declaration and no `letter-spacing` rule

#### Scenario: Round trip
- **WHEN** a theme is exported and then imported again
- **THEN** every token value is unchanged

### Requirement: Draft persistence
The builder SHALL save the current draft (inputs, overrides and theme name) in the browser on every change and restore it on the next visit. If the stored draft is unreadable, or storage is unavailable, the builder MUST start from the default theme and stay fully usable. A draft saved by an earlier version that still contains fonts and letter spacing MUST be migrated: those values are discarded and every other input, override and the name are kept.

#### Scenario: Reload keeps work
- **WHEN** a user edits the primary color and reloads the page
- **THEN** the builder shows the edited primary color and the same overrides as before the reload

#### Scenario: Storage unavailable
- **WHEN** browser storage throws on access
- **THEN** the builder starts from the default theme, and editing and export still work

#### Scenario: Migrating an older draft
- **WHEN** the browser holds a draft from the previous version with a custom primary color and a custom sans font
- **THEN** the builder restores the primary color and its overrides, and no font setting remains

### Requirement: Radius, shadows and spacing
Besides colors, the builder SHALL let the user set:
- the base radius;
- a shadow scale defined by color, opacity, blur, spread and x/y offset, from which every shadow step is derived;
- the base spacing unit.

These values apply to both modes, except the shadow color, which can differ per mode. The preview MUST reflect each change. Fonts and letter spacing are not part of the theme. The builder MUST show a link to "Tools › Typography Builder" where the typography section used to be.

#### Scenario: Changing the radius
- **WHEN** a user sets the radius to 0
- **THEN** buttons, inputs and cards in the preview show square corners

#### Scenario: Typography lives in its own tool
- **WHEN** a user looks for the font settings in the theme builder
- **THEN** the builder shows a link to the Typography Builder and no font or letter-spacing input
