## Why

Today the only way to theme `@aureus-core/ui` (or any shadcn app) is to hand-write OKLCH values for ~30 tokens in light and dark mode, then check contrast pair by pair, as `theme.css` documents. That is slow and error-prone. The project already cares about WCAG AA, and a bad token silently breaks it. A theme builder inside the documentation site lets anyone produce a complete, accessible shadcn theme file in minutes, with the real components as a preview.

## What Changes

- **New "Tools › Theme Builder" page** in the Storybook playground: a form-driven editor with a live preview of real `@aureus-core/ui` components in light and dark mode, side by side.
- **Generate, then adjust.** The user picks a brand (primary) color, a neutral palette (neutral, zinc, stone, slate, gray), how much the neutrals are tinted toward the brand hue, and the radius. The builder derives every color token for both modes. Any single token can then be overridden by hand, and the override can be reset to the generated value.
- **Typography, shadows and spacing.** Sans, serif and mono font stacks (from a curated list or free text), a shadow scale (color, opacity, blur, spread, offset), the base spacing unit and letter spacing.
- **Live contrast validation.** The builder shows the WCAG contrast ratio for every surface/foreground pair, in both modes. Pairs below 4.5:1 are flagged, and so is any mode that fails. Export stays allowed, but it carries a warning.
- **Import.** The user can paste or upload an existing shadcn theme (from shadcn's themes page, tweakcn, or a file exported earlier) to keep editing it. Colors in hex, rgb, hsl or oklch are accepted. Tokens that are not recognized are reported and ignored.
- **Export as a `.css` file.** A complete, standalone theme: `:root`, `.dark` and an `@theme inline` block, all colors in OKLCH, for Tailwind CSS v4 shadcn apps. The user can download it as a file named after the theme, or copy it to the clipboard. This works the same on the published GitHub Pages site and locally. Nothing is written to the repository.
- **Draft persistence.** The current draft is kept in the browser, so a reload does not lose work. "Reset" goes back to the Aureus default theme.
- **Bilingual UI.** The builder's labels and help text follow the playground's EN/ES locale switcher. The Theming guide links to the builder.

Non-goals:
- No changes to `@aureus-core/ui` or its published stylesheet, so no changeset.
- No writing files to disk or to the repo from Storybook.
- No Tailwind v3 / HSL output format.
- No sharing a theme by URL, and no theme gallery.
- No per-component token editing beyond the shadcn token set.

## Capabilities

### New Capabilities

- `theme-builder`: the theme editor. Covers deriving tokens from a few inputs, per-token overrides, typography, shadows and spacing, contrast validation, import of existing themes, the standalone CSS export (download and copy), draft persistence and the live preview.

### Modified Capabilities

- `component-playground`: the sidebar gains a "Tools" section after the shadcn and components sections, holding interactive tools that are not component documentation. The theme builder's own UI text is bilingual and follows the locale switcher.

## Impact

- **Code**: `apps/storybook` only. A new `src/stories/tools/theme-builder/` folder holds the story, the form and preview components, and the pure theme modules (generator, contrast, serializer, parser) with their unit tests. It also touches `.storybook/preview.tsx` (sidebar order) and `src/stories/guides/theming.mdx` (link to the builder, EN/ES).
- **Dependencies** (storybook, dev): `culori` for color parsing, OKLCH conversion, gamut mapping and WCAG contrast, plus its types.
- **Tests**: new Node unit tests for the theme modules, and a browser story test with an interaction script for the builder, which goes through the existing render + play + axe pipeline.
- **Consumers**: none affected. The exported file is meant for any Tailwind v4 shadcn app, `@aureus-core/ui` consumers included.
