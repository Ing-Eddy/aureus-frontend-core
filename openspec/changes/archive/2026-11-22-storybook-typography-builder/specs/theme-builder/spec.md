## ADDED Requirements

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

## MODIFIED Requirements

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

## REMOVED Requirements

### Requirement: Radius, typography, shadows and spacing
**Reason**: Fonts and letter spacing are now owned by the Typography Builder, which writes the `--typography-*` variables of `@aureus-core/ui`. The theme kept `--font-*` variables that competed with them.
**Migration**: Radius, shadows and spacing are covered by the new "Radius, shadows and spacing" requirement. Edit fonts and letter spacing in "Tools › Typography Builder" and load its export after `@aureus-core/ui/styles.css`.
