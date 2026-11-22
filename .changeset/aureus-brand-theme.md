---
"@aureus-core/ui": minor
---

Apply the Aureus brand theme by default (`styles.css`). This changes the look of every component.

- **Aureus Blue** (`oklch(0.45 0.2 264)`, `#1745c2`; `oklch(0.62 0.17 264)` with dark text in dark mode) for `--primary`, `--ring`, `--sidebar-primary` and `--sidebar-ring`.
- **Aureus Gold** (`oklch(0.8 0.14 84)`, `#e8b543`) for `--secondary` with a warm dark foreground, used by the secondary Button, Badge and Bubble. `--accent` stays neutral, so menus and hovers are unchanged in hue.
- **Charts** alternate blue and gold; light mode uses deep golds so every chart color reaches 3:1.
- **Neutrals** are Tailwind slate. `--muted-foreground` is slate-600 in light mode (6.9:1 on `--muted`). The accessible destructive reds are kept.
- **Brand constants** `--brand-blue`, `--brand-gold`, `--brand-gold-foreground` and `--brand-gold-text`, available as `bg-brand-*` / `text-brand-*` utilities. They keep the brand when an app re-themes `--primary` or `--secondary`; use `text-brand-gold-text` for gold text.
- `theme.css` now sets every color token in a `:root` block and a `.dark` block. Plain `:root`/`.dark` overrides in apps work for every token, including the ones that previously needed `:root:not(.dark)`.

To keep stock shadcn colors, redefine the color tokens in `:root` and `.dark` after `@import "@aureus-core/ui/styles.css"`.
