## Context

See proposal.md (Why) for the motivation and `specs/brand-theme/spec.md` for the requirements. These facts shape the approach:

- **`packages/ui/src/styles/shadcn.css`** is CLI-owned. It defines stock neutral tokens in `:root` and `.dark`.
- **`theme.css`** is loaded right after `shadcn.css`. Today it overrides only `--destructive` and `--muted-foreground`. Light values sit in `:root:not(.dark)` (specificity 0,2,0), because a lone `:root` override would also beat shadcn's `.dark`, which has the same specificity and comes earlier. That selector is why a plain `:root` override in an app, or an older Theme Builder export, could not change those two tokens.
- **The Theme Builder preset** (`apps/storybook/src/stories/tools/theme-builder/core/default-theme.ts`, `aureusColors` and `aureusInputs`) must equal the package tokens. `default-theme-tests.ts` merges `shadcn.css :root` with `theme.css :root:not(.dark)`, and `.dark` with `.dark`, then compares the result with the preset.
- **Who uses `--secondary`:** only the `secondary` variants of Button, Badge and Bubble. `--accent` is used by about 30 hover and selected states (menus, items), so it stays neutral.
- **The palette comparison** (Artifact "Paleta Aureus", direction A) fixed the brand colors and their contrast with culori.

## Goals / Non-Goals

**Goals:**
- One complete token set per mode, so `shadcn.css` values never show through.
- Plain `:root` and `.dark` overrides work in apps.
- Every text pair is at least 4.5:1 and every chart or focus color at least 3:1, in both modes, checked by tests.

**Non-Goals:**
- Generating the brand from the Theme Builder algorithm. The brand values are hand-picked and fixed. The generator only describes them through the preset inputs.
- Success and warning tokens, and changes to radius, shadows or typography.

## Decisions

### 1. Token values

Slate values are those of Tailwind/shadcn: s50 `oklch(0.984 0.003 247.858)`, s100 `oklch(0.968 0.007 247.896)`, s200 `oklch(0.929 0.013 255.508)`, s400 `oklch(0.704 0.04 256.788)`, s600 `oklch(0.446 0.043 257.281)`, s800 `oklch(0.279 0.041 260.031)`, s900 `oklch(0.208 0.042 265.755)`, s950 `oklch(0.129 0.042 264.695)`. Blue = `oklch(0.45 0.2 264)` light and `oklch(0.62 0.17 264)` dark. Ink = `oklch(0.26 0.05 70)`, the warm near-black used on gold.

| Token | Light | Dark |
|---|---|---|
| background / foreground | `oklch(1 0 0)` / s950 | s950 / s50 |
| card, popover / foreground | `oklch(1 0 0)` / s950 | s900 / s50 |
| primary / foreground | blue / s50 | blue / s950 |
| secondary / foreground | `oklch(0.8 0.14 84)` / ink | `oklch(0.82 0.13 86)` / ink |
| muted / foreground | s100 / s600 | s800 / s400 |
| accent / foreground | s100 / s900 | s800 / s50 |
| destructive | `oklch(0.51 0.2 27.325)` | `oklch(0.74 0.191 22.216)` |
| border, input | s200, s200 | `oklch(1 0 0 / 10%)`, `oklch(1 0 0 / 15%)` |
| ring | blue | blue |
| chart-1…5 | blue, `oklch(0.55 0.12 78)`, `oklch(0.62 0.17 264)`, `oklch(0.47 0.1 70)`, s600 | blue, `oklch(0.82 0.13 86)`, `oklch(0.76 0.11 258)`, `oklch(0.68 0.12 80)`, s400 |
| sidebar / foreground | s50 / s950 | s900 / s50 |
| sidebar-primary / foreground | blue / s50 | blue / s950 |
| sidebar-accent / foreground | s100 / s900 | s800 / s50 |
| sidebar-border, sidebar-ring | s200, blue | `oklch(1 0 0 / 10%)`, blue |
| brand-blue | `oklch(0.45 0.2 264)` | `oklch(0.62 0.17 264)` |
| brand-gold / brand-gold-foreground | `oklch(0.8 0.14 84)` / ink | `oklch(0.82 0.13 86)` / ink |
| brand-gold-text | `oklch(0.55 0.12 78)` | `oklch(0.85 0.12 86)` |

Contrast, computed with culori:

| Check | Light | Dark |
|---|---|---|
| background | 20.17 | 19.27 |
| card | 20.17 | 17.05 |
| primary | 7.50 | 5.41 |
| secondary | 8.30 | 8.91 |
| muted | 6.90 | 5.58 |
| accent | 16.28 | 14.00 |
| sidebar | 19.27 | 17.05 |
| sidebar-primary | 7.50 | 5.41 |
| muted-foreground on background | 7.56 | 7.68 |
| destructive on background | 6.38 | 8.04 |
| primary on background (links) | 7.86 | 5.41 |
| brand-gold-text on background | 4.94 | 12.70 |
| ring on background | 7.86 | 5.41 |
| charts on card (chart-1…5) | 7.86 / 4.94 / 3.73 / 6.98 / 7.56 | 4.78 / 10.16 / 8.30 / 6.11 / 6.79 |

- **Light gold:** the light `--chart-2` and `--chart-4` are deep golds, because the surface gold gives only 1.89:1 on white.
- **Destructive:** both reds keep the previous AA values and comments (tint and 80% cases).
- **Dark primary text:** the dark primary is light enough for links on dark slate, so its foreground is s950. White on it gives only 3.73:1.

### 2. `theme.css` layout

```css
/* header: Aureus brand, hex references, contrast summary, how apps override */
:root { /* 31 color tokens, light */ --brand-blue: …; --brand-gold: …; --brand-gold-foreground: …; --brand-gold-text: …; }
.dark { /* 31 color tokens, dark */ /* 4 brand constants, dark */ }
@theme inline {
  --color-brand-blue: var(--brand-blue);
  --color-brand-gold: var(--brand-gold);
  --color-brand-gold-foreground: var(--brand-gold-foreground);
  --color-brand-gold-text: var(--brand-gold-text);
}
```

- **Why `:root` then `.dark`:** with every token defined in both blocks, the light block can no longer leak into dark mode, because `.dark` comes later with the same specificity. Dropping `:root:not(.dark)` restores plain app overrides. This is why the previous caveat in the theming guide is removed.
- **Alternative: keep `:root:not(.dark)`.** Rejected: apps would need the higher-specificity selector for every token.
- **Brand constants are separate from the shadcn tokens** because the Theme Builder and apps may re-theme `--primary` and `--secondary`, while a logo or a premium highlight must keep the brand. They are not part of the Theme Builder's 31 tokens.

### 3. Theme Builder preset

- **`aureusColors`** becomes the table above, normalized with `normalizeColor`. The brand constants are not part of it.
- **`aureusInputs`:**
  - `primary: "oklch(0.45 0.2 264)"`, `achromaticPrimary: false`;
  - `neutral: "slate"`, `tint: 0`;
  - `destructive: "oklch(0.51 0.2 27.325)"`;
  - `chartMode: "primary"`;
  - the other inputs are unchanged.
- **The base stays `preset`,** so the preview shows the exact brand. Editing an input switches to generated colors, as today.
- **`default-theme-tests.ts`** reads `theme.css` `:root` and `.dark` merged over `shadcn.css`, and ignores `--brand-*` when it checks that the token sets match.
- **New `default-theme-contrast-tests.ts`:**
  - `checkContrast(resolveTheme(createDefaultDraft()))` has no failing pair;
  - `--ring` against the background and every `--chart-*` against the card are at least 3:1 in both modes, using `contrastRatio` from `core/color.ts`.

### 4. A package test for the brand constants

`packages/ui/src/styles/` holds no tests, because the folder is copied to dist as is. The theme belongs to no component, so the guard goes at the package source root as `packages/ui/src/theme-css-tests.ts`, beside `no-default-texts-tests.ts`. It reads `src/styles/theme.css` and checks that:
- the `:root` and `.dark` blocks each define the 31 shadcn color tokens and the four `--brand-*` constants;
- `@theme inline` maps the four `--color-brand-*` utilities;
- the file contains no `:root:not(.dark)`.

### 5. Documentation

- **`foundations/colors.mdx`** (EN/ES):
  - a "Aureus brand" section first, with live swatches of `--brand-blue`, `--brand-gold` and `--brand-gold-text`, and the existing pairs below;
  - the rules: blue for actions and active states; gold for secondary actions, premium highlights and charts; never the surface gold as text on light backgrounds, use `text-brand-gold-text`.
- **`guides/theming.mdx`:**
  - "What this package already changed" becomes "The Aureus brand theme": what changed, and how to restore stock shadcn by redefining tokens in `:root` and `.dark` (or by exporting from the Theme Builder);
  - the `:root:not(.dark)` sentence is removed.
- **README "Theming"** and a CONTRIBUTING note: brand changes go in `theme.css`, the preset must follow, and contrast tests guard both.
- **Changeset `.changeset/aureus-brand-theme.md`** (`minor`). It describes the visual change, the brand utilities and the restored plain `:root` overrides.

## Risks / Trade-offs

- **[Every component changes color for current consumers]** → It is a `minor` release with a clear changeset. Apps that want the old look can override tokens, and the guide documents how.
- **[A story uses a token pair that the new palette makes illegible]** → Axe runs on every story, so the full Storybook test suite must pass. Any failure is fixed in the palette, not by suppressing the rule.
- **[Gold on light backgrounds is tempting to use as text]** → The documented rule and the `brand-gold-text` utility, with 4.94:1 contrast.
- **[The preset inputs do not regenerate the exact preset]** → Accepted, as before. The base stays `preset` until an input changes.

## Migration Plan

Consumers upgrade and get the brand. To keep stock shadcn colors, they paste shadcn's `:root` and `.dark` token blocks after the package import, or export a neutral theme from the Theme Builder. Rollback means reverting the package version.
