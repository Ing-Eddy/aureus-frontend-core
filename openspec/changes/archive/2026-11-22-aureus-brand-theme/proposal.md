## Why

`@aureus-core/ui` still looks like stock shadcn: a near-black primary, neutral greys and monochrome charts, plus two accessibility fixes. Every Aureus app (a hub of accounting, finance and business tools) should share one visual identity that reads as advanced, technological and premium, without each app having to export and import a theme. The user chose direction **A · Sapphire & Gold** from the palette comparison: a deep sapphire blue as primary and a warm gold as secondary. *Aureus* is Latin for "golden".

## What Changes

- **Brand theme as the package default.** `packages/ui/src/styles/theme.css` defines every color token in a `:root` block and then a `.dark` block:
  - **Primary (Aureus Blue):** `oklch(0.45 0.2 264)` (#1745c2) in light mode, `oklch(0.62 0.17 264)` (#5080eb) in dark mode. Used by the primary button, the active navigation, links, the focus ring and `--sidebar-primary`.
  - **Secondary (Aureus Gold):** `oklch(0.8 0.14 84)` (#e8b543) in light mode, `oklch(0.82 0.13 86)` (#e9be57) in dark mode, with a warm dark foreground. Used by the secondary button, badge and bubble.
  - **Charts:** blue and gold alternate across `--chart-1…5`. Light mode uses the deep gold, because the surface gold does not reach 3:1 on white.
  - **Neutrals:** shadcn's slate palette, with a darker light-mode `--muted-foreground` (slate-600) for AA.
  - **`--accent`:** stays neutral, so menus and hovers stay quiet.
  - **Destructive:** the existing AA reds are kept.
- **Brand constants** for app-level accents, mapped to Tailwind utilities (`bg-brand-gold`, `text-brand-gold-text`…):
  - `--brand-blue`, `--brand-gold`, `--brand-gold-foreground`, and `--brand-gold-text`, a gold that is legible as text.
  - They keep the brand when an app re-themes `--primary` or `--secondary`.
- **BREAKING (visual):** every component changes color. `theme.css` no longer uses `:root:not(.dark)`, so a plain `:root { … }` override in an app works again for every token. Exports from the Theme Builder (`:root, :root:not(.dark)`) keep overriding.
- **Theme Builder:**
  - the "Aureus" preset equals the new package tokens, and its inputs become the blue primary, the slate neutrals and primary-derived charts;
  - "Reset" returns to the brand theme;
  - the drift test reads the new `:root` block.
- **Documentation (EN/ES):**
  - a brand section on `Foundations/Colors`, with usage rules (gold is an accent, never text on white except the gold-text tone);
  - the theming guide's "What this package already changed" becomes "The Aureus brand theme", with how to return to stock shadcn;
  - the obsolete `:root:not(.dark)` caveat is removed;
  - README and CONTRIBUTING.
- **Release:** a `minor` changeset.

Non-goals:
- Changing fonts (they belong to typography), radius, shadows or spacing.
- New semantic tokens beyond the four brand constants. Success and warning colors are not part of this change.
- Changes to `shadcn.css`.

## Capabilities

### New Capabilities

- `brand-theme`:
  - the Aureus palette and the role of each color;
  - the brand constants and their utilities;
  - the contrast guarantees (4.5:1 for text pairs, 3:1 for focus and chart marks, in both modes);
  - how apps override the theme.

### Modified Capabilities

- `theme-builder`: "Default starting theme" becomes the Aureus brand theme instead of stock shadcn with accessibility overrides.

## Impact

- **Modified:**
  - `packages/ui/src/styles/theme.css`;
  - in `apps/storybook/src/stories/tools/theme-builder/core/`: `default-theme.ts` and `default-theme-tests.ts`, plus a new preset contrast test;
  - `apps/storybook/src/stories/foundations/colors.mdx` and `guides/theming.mdx`;
  - README and CONTRIBUTING.
- **Visual:** all stories change color. Axe runs on every story, so any illegible pair fails the tests.
- **Consumers:** apps that override tokens in `:root`/`.dark` keep their values. Apps with no theme get the brand.
- **Release:** a `minor` changeset for `@aureus-core/ui`.
