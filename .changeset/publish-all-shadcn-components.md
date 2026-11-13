---
"@aureus-core/ui": minor
---

Publish every installed shadcn component and hook, verified on each build.

- All 62 shadcn components are now importable from `@aureus-core/ui/shadcn/<name>`, and both hooks (`use-mobile`, `use-highlighted-code`) from `@aureus-core/ui/hooks/<name>`, each with type declarations.
- Every build is checked: all compiled modules and type declarations are present, no internal aliases leak, packaging is linted, ESM types resolve, and the tarball has only build output and metadata.
- **Breaking:** `date-fns` and `@tanstack/react-table` are no longer dependencies of this package, because no component uses them. If your project imports them, add them to your own `dependencies`.
- **Visual change:** in light mode, `--destructive` is now `oklch(0.51 0.2 27.325)`, a slightly darker red. The stock shadcn red reaches only 3.99:1 as text on its own tint (destructive Button and Badge), below WCAG AA's 4.5:1; the new value gives 5.36:1 there and 4.78:1 when components use it at 80% opacity. In dark mode it is `oklch(0.74 0.191 22.216)` (stock: `oklch(0.704 0.191 22.216)`), so 80%-opacity error text reaches 4.66:1 on cards. To restore the old colors, override `--destructive` in your own CSS (light and `.dark`).
- **Visual change:** in light mode, `--muted-foreground` is now `oklch(0.53 0 0)` (stock: `oklch(0.556 0 0)`), so muted text reaches WCAG AA on `--muted` and `--accent` backgrounds (4.84:1 instead of 4.34:1). Override it in your own CSS to restore the stock gray.
