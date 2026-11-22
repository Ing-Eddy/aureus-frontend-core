---
"@aureus-core/ui": minor
---

Add `Typography` (`@aureus-core/ui/components/typography`) and the typography tokens of `styles.css`.

- **Catalog.** 15 named text styles: `display`, `h1`–`h6`, `lead`, `body-lg`, `body`, `body-sm`, `label`, `caption`, `overline` and `code`, exported as `typographyVariants`. `display`, `h1` and `h2` have fluid sizes that keep a `rem` term.
- **Component.** `variant` (default `body`) renders its natural element (`h1`–`h6`, `p`, `span` or `code`). `as` changes only the element, with native props typed for it, and `asChild` styles the only child. Opt-in, independent modifiers: `tone` (`default`, `muted`, `primary`, `destructive`), `weight`, `align` (logical), `wrap`, `truncate` or `lineClamp` (1–6), `italic` and `tabularNums`. `className` always wins. It renders no text of its own.
- **Runtime tokens.** New `src/styles/typography.css`, loaded after the theme overrides: font roles `--typography-font-{sans,heading,serif,mono}`, `--typography-tracking-normal` and six variables per variant (`--typography-<variant>-{font,size,line-height,weight,tracking,transform}`). Override any of them in `:root` after `@aureus-core/ui/styles.css`.
- **Classes.** `.typography-<variant>` in the `components` cascade layer, usable without the component; any Tailwind utility on the same element wins.
- **Font utilities follow the roles.** `font-sans`, `font-heading`, `font-serif`, `font-mono` and the `tracking-*` scale now resolve to the typography variables. Defaults are unchanged for `font-sans` and `font-heading` (Geist).
- **New runtime dependency `@fontsource-variable/geist-mono`.** `font-mono` and the `code` style now use Geist Mono instead of the system monospace stack. This changes the look of monospace text in `Chart`, code blocks and the questionnaire.
