# brand-theme Specification

## Purpose
Defines the Aureus visual identity that `@aureus-core/ui` applies by default: the sapphire blue and gold palette, the role of each color, the brand constants apps can use, the contrast it guarantees, and how apps override it.

## Requirements

### Requirement: Aureus palette by default
Importing `@aureus-core/ui/styles.css` SHALL apply the Aureus brand theme with no other stylesheet. Its color tokens MUST be:
- **Primary (Aureus Blue):** `--primary` is `oklch(0.45 0.2 264)` in light mode and `oklch(0.62 0.17 264)` in dark mode. `--ring`, `--sidebar-primary` and `--sidebar-ring` use the same blue. `--primary-foreground` is near-white in light mode and near-black in dark mode.
- **Secondary (Aureus Gold):** `--secondary` is `oklch(0.8 0.14 84)` in light mode and `oklch(0.82 0.13 86)` in dark mode, with a warm near-black `--secondary-foreground` in both modes.
- **Charts:** `--chart-1` is blue, `--chart-2` gold, `--chart-3` a lighter blue, `--chart-4` a deeper gold and `--chart-5` slate. In light mode the golds are the deep tones.
- **Neutrals:** background, card, popover, muted, accent, border, input and the sidebar surfaces come from the slate palette. `--accent` MUST stay neutral.
- **Destructive:** the package's accessible reds.

#### Scenario: App with no theme file
- **WHEN** an app imports only `@aureus-core/ui/styles.css` and renders a default `Button` and a `secondary` `Button`
- **THEN** the first is Aureus Blue with light text, and the second is Aureus Gold with dark text

#### Scenario: Dark mode
- **WHEN** the `dark` class is on `<html>`
- **THEN** the primary button is the lighter blue with dark text, and the surfaces are dark slate

#### Scenario: Menus stay neutral
- **WHEN** a dropdown menu item is hovered
- **THEN** its background is the neutral slate accent, not blue or gold

### Requirement: Brand constants
The stylesheet SHALL define, for both modes:
- `--brand-blue`;
- `--brand-gold`;
- `--brand-gold-foreground`, text on gold;
- `--brand-gold-text`, gold legible as text on the background: `oklch(0.55 0.12 78)` in light mode and `oklch(0.85 0.12 86)` in dark mode.

It MUST map them to the Tailwind colors `brand-blue`, `brand-gold`, `brand-gold-foreground` and `brand-gold-text`, so that `bg-brand-gold` or `text-brand-gold-text` work in apps. The constants MUST keep their values when an app overrides `--primary` or `--secondary`.

#### Scenario: Gold figure as text
- **WHEN** an app renders a figure with `text-brand-gold-text` on the default background
- **THEN** it renders in the legible gold of the current mode

#### Scenario: Re-themed app keeps the brand
- **WHEN** an app overrides `--secondary` with another color and uses `bg-brand-gold` on its logo
- **THEN** the secondary button uses the app's color and the logo keeps Aureus Gold

### Requirement: Contrast guarantees
In both modes, the brand theme SHALL meet:
- at least 4.5:1 between every surface and its foreground: background, card, popover, primary, secondary, muted, accent, sidebar, sidebar-primary and sidebar-accent;
- at least 4.5:1 for `--muted-foreground`, `--destructive`, `--primary` and `--brand-gold-text` against the background;
- at least 3:1 for `--ring` against the background, and for every `--chart-*` color against the card.

The playground's automated accessibility checks MUST pass on every story with the brand theme.

#### Scenario: Gold never fails as text
- **WHEN** the contrast of the brand theme is computed
- **THEN** no text pair uses the surface gold on a light background, and `--brand-gold-text` reaches at least 4.5:1 on the light background

### Requirement: Overriding the brand theme
The brand theme SHALL set every color token in a `:root` block followed by a `.dark` block. Because of that order:
- an app that redefines a token in `:root` after the package stylesheet MUST get its value in light mode;
- an app that redefines a token in `.dark` MUST get its value in dark mode;
- a file exported by the Theme Builder MUST override the brand theme in both modes.

#### Scenario: Plain root override
- **WHEN** an app adds `:root { --muted-foreground: oklch(0.4 0.1 250); }` after `@import "@aureus-core/ui/styles.css"`
- **THEN** light mode uses that value

#### Scenario: Theme Builder export
- **WHEN** an app imports a `theme.css` exported by the Theme Builder after the package stylesheet
- **THEN** every exported token replaces the brand value in its mode
