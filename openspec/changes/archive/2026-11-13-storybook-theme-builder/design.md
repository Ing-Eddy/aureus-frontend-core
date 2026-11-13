## Context

The current state relevant to the approach (motivation: see proposal.md - Why; requirements: see `specs/theme-builder/spec.md`):

- **Token source.** The package's stylesheet has three layers:
  - `packages/ui/src/styles/shadcn.css` (CLI-owned) defines the `@theme inline` mapping and the stock neutral tokens in `:root` and `.dark`.
  - `theme.css` overrides three tokens for WCAG AA: light `--destructive`, light `--muted-foreground` and dark `--destructive`.
  - The radix-nova token set has no `--destructive-foreground`.
- **What the prebuilt CSS can change at runtime.** Storybook renders the prebuilt `@aureus-core/ui/styles.css`.
  - Colors and radius go through `@theme inline` as `var(--x)`, so overriding the variable at runtime works.
  - `--spacing` is read through `var()` by the utilities, so it also works at runtime.
  - Fonts (`--font-sans: 'Geist Variable'`), Tailwind's default shadows and letter-spacing are written as literal values in the utilities. Overriding them at runtime has no effect.
- **Dark mode.** The variant is `@custom-variant dark (&:is(.dark *))`, and the playground toolbar puts `.dark` on `<html>`. So an element anywhere under a dark `<html>` matches `dark:` variants. A light preview cannot be scoped by a wrapper element alone.
- **Playground conventions.**
  - Stories are globbed from `src/stories/**/*-stories.tsx`.
  - Node unit tests are `src/**/*-tests.ts`.
  - Browser story tests run render + play + axe (`a11y.test: "error"`).
  - `coverage-tests.ts` only inspects `stories/shadcn/` and the guides/foundations MDX.
  - Locale reaches story canvases through `globals.locale`. `useLocale()` relies on the docs context.
- **Hosting.** The site is static on GitHub Pages, so there is no server and nothing can be written to disk.

## Goals / Non-Goals

**Goals:**
- One pure, framework-free theme core (types, generate, contrast, serialize, parse) that the UI, the preview and the tests all share. The UI is a thin layer over it.
- The exported file is verified by compiling it with Tailwind in a test, not only by eye.
- The preview shows the edited theme on real package components, unaffected by the playground's own theme.

**Non-Goals:**
- Previewing overlay components (dialog, popover, select dropdown, tooltip). Their Radix portals render into the parent document, outside the preview.
- APCA or non-text (3:1) contrast checks. Only text pairs at 4.5:1 are checked.
- Pixel-perfect parity between preview and export for fonts, shadows and letter spacing (see D5). The export is the reference.

## Decisions

### D1. Folder layout under `stories/tools/theme-builder/`
```
apps/storybook/src/stories/tools/theme-builder/
  theme-builder-stories.tsx        # title "Tools/Theme Builder", layout fullscreen, tags ["!autodocs"];
                                   # Default (no play) + test-only stories tagged "!dev" with in-memory storage
  theme-builder.tsx                # root component: state + layout
  index.ts
  core/                            # pure TS, no React, no DOM
    theme-types.ts                 # ThemeDraft, ThemeInputs, ColorToken, ResolvedTheme
    palettes.ts                    # Tailwind v4 neutral/zinc/stone/slate/gray ramps (OKLCH, 50–950)
    default-theme.ts               # Aureus preset (exact package tokens) + its matching inputs
    generate-theme.ts  contrast.ts  serialize-theme.ts  parse-theme.ts  draft-storage.ts
    color.ts                       # culori wrappers: parse any notation → OKLCH, format, gamut map
    *-tests.ts                     # one per module
    index.ts
  form/        # input sections: colors, overrides, typography, shadows-spacing, import, export
  preview/     # preview-frame.tsx (iframe), preview-sample.tsx (component showcase)
  i18n/        # theme-builder-strings.ts (+ -tests.ts)
```
Each folder gets an `index.ts` barrel, and all names are kebab-case with `-` role suffixes. `preview.tsx` `storySort` gains `"Tools"` after `"components"`.
- *Alternative:* an MDX page under `guides/`. Rejected: interactive state and play-function tests fit a story better, and MDX pages are not story tests.

### D2. State: draft = base + overrides, resolved in one place
```ts
type ThemeDraft = {
  version: 1;
  name: string;
  base: { kind: "preset"; id: "aureus" } | { kind: "generated" };
  inputs: ThemeInputs;          // primary, neutral, tint, destructive, chartMode, radius,
                                // fonts {sans, serif, mono}, shadow {color{light,dark}, opacity,
                                // blur, spread, x, y}, spacing, tracking
  overrides: { light: Partial<Record<ColorToken, string>>; dark: Partial<Record<ColorToken, string>> };
};
resolveTheme(draft): ResolvedTheme   // base tokens (preset or generate(inputs)) ⊕ overrides
```
The draft lives in `useReducer` in `theme-builder.tsx`. The preview, the contrast table, the code view and the download all read `resolveTheme(draft)`, memoized, so they cannot disagree.

The Aureus default is a **preset**. `default-theme.ts` holds its exact token values, and its `inputs` are the closest generator inputs: neutral palette, achromatic primary, no tint, Aureus red, monochrome charts. Editing any generation input switches `base` to `generated`. This is how "first visit = package values" (spec) holds exactly, without forcing the generator to reproduce hand-tuned values to the third decimal.
- *Alternative:* always generate, and tune the generator so that its default inputs give exactly the package values. Rejected: it is brittle, and any later change to `theme.css` would mean re-tuning the generator.
- A node test reads `packages/ui/src/styles/shadcn.css` and `theme.css` with `fs` (as `coverage-tests.ts` already does with `src/shadcn/ui`). It asserts that the preset equals them, so the preset cannot drift from the package.

### D3. Color math with `culori`
`culori` handles parsing (hex/rgb/hsl/oklch, alpha), OKLCH conversion, `toGamut("rgb", "oklch")` and `wcagContrast`. It is imported from `culori/fn` so it tree-shakes. `color.ts` wraps it with these rules:
- Output format is `oklch(L C H)`, with L to 3 decimals, C to 3 and H to 3. Achromatic colors print `0` for the hue. Alpha is written as `/ N%`.
- Bare HSL channels (`222.2 84% 4.9%`) are detected by regex and wrapped in `hsl()` before parsing.

Rounding is applied once, when a value enters the draft. That makes a serialize → parse round trip exact.
- *Alternatives:* `colorjs.io` is more complete but several times heavier. Hand-written conversions would be error-prone, and gamut mapping is not trivial.

### D4. Generation algorithm (`generate-theme.ts`)
1. **Neutral ramp.** Take the chosen palette's 11 steps. With a tint `t ∈ [0, 1]`, set each step's hue to the primary hue and add `t × 0.04 × bell(L)` to its chroma. `bell` peaks at mid lightness, so white and black stay clean.
2. **Neutral token map.** Mirror shadcn's base-color mapping:

   | Token | Light | Dark |
   | --- | --- | --- |
   | background | white | 950 |
   | foreground | 950 | 50 |
   | card, popover | white | 900 |
   | secondary, muted, accent | 100 | 800 |
   | muted-foreground | 500 | 400 |
   | border, input | 200 | white at 10% / 15% |
   | ring | 400 | 500 |
   | sidebar | 50 | 900 |
3. **Brand.** Build an 11-step brand ramp: the neutral L curve, the primary's hue, and the primary's chroma scaled per step and gamut-mapped.
   - Light `--primary` is the user's exact color.
   - Dark `--primary` is the user's color if it reaches 3:1 against the dark background. Otherwise it is the brand step 400.
   - `--ring` and `--sidebar-primary` (and `--sidebar-ring`) use brand steps 400 / 500.
   - An "achromatic primary" input keeps shadcn's neutral primary (900 light / 200 dark).
4. **Destructive.** Light is the input color. Dark is that color lightened to brand-ramp step 400 lightness.
5. **Charts.**
   - Monochrome uses neutral steps 300/500/600/700/800 (stock shadcn).
   - Derived uses five hues, `h + k·72°`, at fixed L/C per mode, gamut-mapped.
6. **Foreground repair.** For every pair in the contrast table (D6), pick the palette's 50 or 950 step, whichever contrasts more. If it still falls below 4.6:1 (4.5 plus a margin against rounding), move the foreground's L away from the surface in 0.01 steps until it passes or hits 0 or 1. This guarantees the spec's "foreground reaches 4.5:1 if any color can".

Overrides are applied after generation and are never repaired. The user's explicit value wins, and the contrast table shows the result.

### D5. Preview in a same-origin iframe, with a preview-only adapter stylesheet
`preview-frame.tsx` renders an `<iframe srcdoc>` for each mode and mounts the sample into the iframe body with `createPortal`. React 17+ attaches event listeners to portal containers, so interactions work. Theme isolation then works the same way it does in an app: the dark frame's `<html>` gets `.dark`, and the light frame's does not, whatever the playground toolbar says.

The frame's `<head>` receives:
1. Clones of the parent document's stylesheets (`<style>` and `<link rel=stylesheet>`). A `MutationObserver` on the parent `<head>` re-syncs them, so Vite HMR in dev keeps working.
2. A theme `<style>` built from the same `:root` / `.dark` blocks as the export.
3. An **adapter** block for what the prebuilt CSS inlines (Context):
   - `html, .font-sans { font-family: var(--font-sans) }`, and the same for serif and mono;
   - `.shadow-sm { --tw-shadow: var(--shadow-sm) }`, and so on for each step;
   - `body { letter-spacing: var(--tracking-normal) }`.

The frame height follows its content through a `ResizeObserver`.

The sample uses only components with no portals: NativeSelect instead of Select, and no Dialog or Tooltip. It shows buttons in every variant, a card form, badges, an alert, tabs, a table, a chart (recharts) and a navigation sample styled with the `sidebar-*` tokens. All of it is imported from `@aureus-core/ui/shadcn/*`.
- *Alternative A:* scope the tokens to a wrapper `div`. Rejected: under a dark playground the light pane would still match `.dark *` (Context).
- *Alternative B:* restyle the whole preview iframe (`:root`). Rejected: the form itself would become unreadable with a bad theme (spec: Live preview).
- *Alternative C:* `createRoot` inside the iframe. This is the fallback if portal event handling misbehaves. It costs a separate React root, which needs its own providers.

### D6. Contrast (`contrast.ts`)
A fixed pair table, taken from the spec, is evaluated for both modes. Before computing the ratio, a foreground with alpha is composited over its surface in sRGB, and a surface with alpha over `--background`. The function returns `{ pair, mode, ratio, passes }[]`. The form shows the ratio next to each override row. A summary panel lists the failures, or reports "meets WCAG AA". The export section reuses the same list for its warning.

### D7. Export format (`serialize-theme.ts`)
```css
/* <name> — shadcn theme for Tailwind CSS v4. Generated by Aureus Theme Builder.
   Replace the :root, .dark and @theme inline blocks of your global CSS with this file.
   Fonts: load "<font>" in your app (e.g. @fontsource-variable/<font>). */
@custom-variant dark (&:is(.dark *));   /* Tailwind's default `dark:` is prefers-color-scheme */
:root {
  --radius: …; --background: oklch(…); … all color tokens …
  --font-sans: …; --font-serif: …; --font-mono: …;
  --shadow-color: …; --shadow-opacity: …; --shadow-blur: …; --shadow-spread: …;
  --shadow-offset-x: …; --shadow-offset-y: …;
  --shadow-2xs: …; … --shadow-2xl: …;
  --tracking-normal: …; --spacing: …;
}
.dark { … color tokens … --shadow-color: …; --shadow-2xs … --shadow-2xl (recomputed) }
@theme inline {
  --color-<token>: var(--<token>); …         /* same list as shadcn.css */
  --radius-sm … --radius-4xl: calc(var(--radius) * k);   /* same factors as shadcn.css */
  --font-sans: var(--font-sans); --font-serif: …; --font-mono: …; --font-heading: var(--font-sans);
  --shadow-2xs: var(--shadow-2xs); … --shadow-2xl: var(--shadow-2xl);
  --tracking-tighter: calc(var(--tracking-normal) - 0.05em); … --tracking-widest: calc(… + 0.1em);
}
body { letter-spacing: var(--tracking-normal); }
```
- The raw shadow parameters are exported alongside the derived steps. Import reads the parameters, so a round trip is exact.
- `--spacing` stays in `:root`, unlayered. Tailwind v4 utilities read `var(--spacing)`, and an unlayered `:root` wins over Tailwind's `@layer theme`.
- Token order and formatting are deterministic, so two exports of the same draft are byte-identical.
- **Verification:** a node test compiles `@import "tailwindcss"; <export>` with `@tailwindcss/node` (already present through `@tailwindcss/vite`; it becomes an explicit dev dependency). It uses candidate classes `bg-primary text-muted-foreground rounded-lg shadow-md font-sans p-4 tracking-tight dark:bg-primary`. It asserts that each class resolves to `var(--…)` of the theme, not to Tailwind's defaults. That test is what proves the "exported file works in a fresh app" scenario. If a mapping turns out not to work (for example, shadows), it is fixed in the serializer with the test as the guard.
- **Download:** a `Blob([css], { type: "text/css" })`, `URL.createObjectURL`, and a temporary `<a download="<kebab-name>.css">`. The URL is revoked on the next tick.
- **Copy:** `navigator.clipboard.writeText`, the same mechanism as the existing import-snippet copy button in `.storybook/docs/import-snippet.tsx`. On failure, the code view text is selected so the user can copy it by hand.

### D8. Import parser (`parse-theme.ts`), hand-written
This is a small scanner, not a CSS library:
1. Strip comments, and respect quoted strings.
2. Walk blocks by brace depth, and descend into `@layer` (shadcn v3 themes wrap everything in `@layer base`).
3. Collect `--name: value;` declarations from blocks whose selector is `:root`, `:root:not(.dark)` or `.dark`. A selector list that contains one of them counts too.
4. Skip `@media`, `@theme`, `@supports` and other selectors, and record what was skipped for the report.

The result is `{ light, dark, ignored[] }` with raw strings. `importTheme(draft, parsed)` then:
- maps recognized names to draft fields: color tokens become overrides, `--radius`, `--font-*`, `--shadow-<param>`, `--spacing` and `--tracking-normal` become inputs;
- converts colors via `color.ts`;
- returns `{ draft, report: { imported, missing[], ignored[] } }`.

Zero recognized tokens → an error, and the draft is unchanged.

Importing keeps the draft's `base` (preset or generated) and stores the colors as overrides, so tokens missing from the file keep their current values (spec), and "Reset token" on an imported color falls back to the base value. (Switching the base to `generated` on import was rejected during implementation: it would silently change every token the file does not define.)
- *Alternative:* `postcss` for parsing. Rejected: its browser build pulls in Node-only modules (`path`, `url`, source maps) that Vite externalizes with warnings. The needed subset is small, and the unit tests cover it: comments, strings, nested `@layer`, `@media`, selector lists, HSL channels, and malformed input.

### D9. Locale and UI strings
`i18n/theme-builder-strings.ts` exports `Record<Locale, ThemeBuilderStrings>`, typed with the same keyed-on-English mapped type the docs kit uses, so a missing Spanish key fails `typecheck`. A unit test (`theme-builder-strings-tests.ts`) also asserts:
- equal key sets;
- no empty strings;
- placeholders (`{count}`) that match across locales.

The story passes `globals.locale` into `<ThemeBuilder locale=… />`. Canvases re-render on global changes, and the draft is in the component's state plus storage, so it survives. The Theming guide (`guides/theming.mdx`) gets a short "Theme builder" section with a link, in both `<En>` and `<Es>`, which keeps the bilingual coverage test green.

### D10. Draft persistence (`draft-storage.ts`)
The key is `aureus-theme-builder:draft:v1` in `localStorage`. Writes are debounced (300 ms). Every read and write is wrapped in `try/catch`. On load, the shape is validated (`version === 1`, known enum values, every color string parses). Anything invalid → the default draft. "Reset" asks with an inline confirm, not `window.confirm` (that one blocks the play-function tests), then clears the key.

### D11. Form controls
The form is built only from package components (`Field`, `Input`, `NativeSelect`, `Slider`, `Switch`, `Tabs`, `Button`, `Textarea`, `Badge`) plus native `<input type="color">` and `<input type="file" accept=".css,text/css">`.
- The primary and destructive colors each get a swatch picker and a text field. The text field accepts any notation (the picker is sRGB hex only).
- Overrides are grouped in a table per mode: token, swatch, value input, an "overridden" badge, a reset button and the contrast ratio when the token belongs to a pair.
- Every control has a visible label, so axe passes. Errors are tied to their input with `aria-describedby` and `aria-invalid`.

## Risks / Trade-offs

- [Fonts, shadows and letter spacing in the preview rely on adapter rules, not the real `@theme` compile] → The export is guarded by the Tailwind compile test (D7). The adapter is preview-only and documented in code. Visible drift there is cosmetic.
- [axe does not audit content inside the preview iframes] → This is acceptable. The frames show a user-chosen theme, so accessibility is reported by the builder's own contrast table. The builder's form, which is outside the frames, is fully audited by the story test.
- [Cloned stylesheets miss a style injected later, such as a lazily loaded chunk] → The `MutationObserver` re-sync covers it. In the static build all CSS is loaded up front.
- [Google Fonts requests leak the visitor's IP to Google] → A font is fetched only when the user picks a non-system, non-bundled font. Geist and the system stacks need no network. A note under the font selector says so.
- [Generated themes can look off for extreme inputs, such as neon yellow] → Foreground repair keeps text readable, overrides give full control, and the contrast summary makes the problems visible.
- [Storybook story-test timeouts with two iframes plus recharts] → The play function waits for a `data-ready` attribute that the frames set once their styles have loaded.
- [`culori` bundle size in the docs site] → Only the `culori/fn` modules in use are imported (a few kB gzipped).

## Migration Plan

There is nothing to migrate. The change adds a page to the private playground app and touches no published package. It ships with the next push to `main` through the existing Pages workflow. Rollback is reverting the change. Stored drafts are versioned (`v1`), so a future format change can discard or migrate old drafts.

## Open Questions

- The exact curated font list (around 15 sans, serif and mono families plus system stacks). This can be settled during implementation without affecting the specs.
- The fine-tuning constants of the generator (tint factor, chart L/C per mode). They will be tuned visually against the preview. The tests assert properties (contrast, hue), not exact numbers.
