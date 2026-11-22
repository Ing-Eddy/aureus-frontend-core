## Context

See proposal.md (Why) for the motivation and `specs/typography/spec.md` for the requirements. These facts shape the approach:

- **`src/styles/shadcn.css`** is CLI-owned and must not be edited by hand. Its `@theme inline` sets:
  - `--font-sans: 'Geist Variable', sans-serif;`
  - `--font-heading: var(--font-sans);`

  Its `@layer base` applies `font-sans` to `html`. It imports `@fontsource-variable/geist`. It defines no mono font, so `font-mono` falls back to Tailwind's system mono stack.
- **`src/styles/index.css`** imports `shadcn.css`, then `theme.css`, then `data-table.css`, then `@source "../"`. `tsdown` copies `src/styles` to `dist` as is, so the consumer's Tailwind build compiles the stylesheet. A later `@theme` declaration overrides an earlier one with the same name.
- **Tailwind v4** declares the cascade layers `theme, base, components, utilities`. Rules inside `@layer components { … }` are emitted as written, always, and lose to every utility whatever the class order.
- **`cn`** (from `@/shadcn/lib/utils`, the `cn` package: clsx + tailwind-merge) merges conflicting Tailwind utilities, last one wins. It does not know custom classes such as `typography-h1`, so it never removes them and cannot resolve their conflicts with utilities.
- **Precedents:**
  - `Slot` from `radix-ui` for `asChild` (`modal-sections.tsx`);
  - `Record<…, string>` class maps in `utils/*-classes.ts` (`modal-classes.ts`);
  - `DistributiveOmit` in `internal/types`;
  - JSDoc on every prop with its default.
- **Existing color tokens:** `--foreground`, `--muted-foreground`, `--primary` and `--destructive`. There is no success or warning token.
- **The Theme Builder** (Storybook tool) exports `--font-sans/serif/mono` in `:root` and `--font-*: var(--font-*)` in its own `@theme inline`. It keeps working on top of this change (see Risks). Its typography section is removed in the follow-up change `storybook-typography-builder`.
- **Guards:**
  - `src/no-default-texts-tests.ts` scans `src/components`;
  - `apps/storybook/src/coverage-tests.ts` requires a stories folder in one of its fixed categories, and `data-display` exists.

## Goals / Non-Goals

**Goals:**
- One token per typographic property, overridable at runtime, so the follow-up builder exports only a `:root` block.
- No visual change to existing components with the default values, except `font-mono` (see Risks).
- Consumer utilities always beat variant styles, with no merge logic in the component.

**Non-Goals:**
- Responsive variants of the style classes (`md:typography-h1`). Fluid sizes cover responsive headings, and a different variant per breakpoint is out of scope.
- Dark-mode-specific typography.
- Per-locale fonts.

## Decisions

### 1. Three-tier tokens in `styles/typography.css`

The variables are read at runtime and are defined in an unlayered `:root` block, like `theme.css`, so an app file loaded later wins by order:

```css
:root {
  --typography-font-sans: 'Geist Variable', ui-sans-serif, system-ui, sans-serif;
  --typography-font-heading: var(--typography-font-sans);
  --typography-font-serif: ui-serif, Georgia, Cambria, 'Times New Roman', Times, serif;
  --typography-font-mono: 'Geist Mono Variable', ui-monospace, SFMono-Regular, Menlo, monospace;
  --typography-tracking-normal: 0em;

  --typography-h1-font: var(--typography-font-heading);
  --typography-h1-size: clamp(2rem, 1.6rem + 1.5vw, 2.5rem);
  --typography-h1-line-height: 1.15;
  --typography-h1-weight: 700;
  --typography-h1-tracking: -0.025em;
  --typography-h1-transform: none;
  /* … one group of six per variant, in catalog order */
}
```

Tailwind's tokens are mapped to these variables in `@theme inline`:
- `--font-sans`, `--font-heading`, `--font-serif` and `--font-mono` point to their `var(--typography-font-*)`.
- `--tracking-normal` points to `var(--typography-tracking-normal)`.
- The other `--tracking-{tighter,tight,wide,wider,widest}` steps are `calc(var(--typography-tracking-normal) ± …)`, with Tailwind's offsets.

`@layer base { body { letter-spacing: var(--tracking-normal); } }`.

`@import "@fontsource-variable/geist-mono";` is at the top of the file. The family name it registers is `'Geist Mono Variable'`.

- **Why the `--typography-` prefix:** if the runtime variables used Tailwind's own names, we would get `--font-sans: var(--font-sans)`, which only works because an unlayered `:root` shadows Tailwind's emitted theme variable. A separate namespace avoids that cycle, and it also groups everything the builder writes under one prefix.
- **Per-variant `font` variable:** it references a role variable rather than a family, so changing a role moves every variant on that role. The builder can still point one variant to a different role.
- **Alternative: Tailwind `--text-<variant>` tokens with `--line-height` and `--font-weight` sub-properties.** Rejected:
  - they cannot carry the font family or the text transform;
  - names like `text-label` and `text-caption` share the `text-*` namespace with colors, so an app color called `caption` would collide.

### 2. Style classes in `@layer components`

```css
@layer components {
  .typography-h1 {
    font-family: var(--typography-h1-font);
    font-size: var(--typography-h1-size);
    line-height: var(--typography-h1-line-height);
    font-weight: var(--typography-h1-weight);
    letter-spacing: var(--typography-h1-tracking);
    text-transform: var(--typography-h1-transform);
  }
  /* … one per variant */
}
```

- **Why this layer:** any utility in `className` (`font-bold`, `text-lg`, `tracking-wide`, `uppercase`) and every modifier class beats the variant style through the cascade layer, regardless of `cn` or the order of the classes.
- **Alternative: `@utility typography-h1`.** It would allow `md:typography-h1`, but utility sorting would make the override order depend on Tailwind's property sort. That is fragile, and `cn` cannot fix it. Rejected.
- **Trade-off:** the 15 classes are always emitted, even when unused. That is about 2 KB.

### 3. Default values

The values are the table in the spec, tuned by hand from a major-third (1.25) scale.

- **Line height:** it gets tighter as the size grows (1.1 for display, 1.6 for body).
- **Letter spacing:** large headings get negative tracking, which suits Geist's wide default spacing at large sizes. Small uppercase text gets positive tracking.
- **Fluid sizes:** only `display`, `h1` and `h2` are fluid. Each is `clamp(min-rem, rem + vw, max-rem)`, so zoom and the user's font size scale both ends.
- **`code`:** it uses `em` and `line-height: inherit`, so it sits inside any text without changing its rhythm.
- **Source of truth:** the table lives twice, in `typography.css` and in `typographyVariants` plus its natural-element map. A test parses the CSS and fails if any variant or property is missing, extra or misnamed. The follow-up builder adds a third copy, guarded the same way.

### 4. Component and folder layout

```
components/typography/
  index.ts             # Typography, typographyVariants, public types
  typography.tsx
  types/   index.ts  typography-types.ts
  utils/   index.ts  typography-variants.ts   # typographyVariants, naturalElements: Record<Variant, Element>, typographyElements
           typography-classes.ts              # variantClassNames, toneClassNames, weightClassNames, alignClassNames,
                                              # wrapClassNames, lineClampClassNames (Record<…, string>, full literal strings for @source)
  tests/   typography-{render,as,as-child,independence,types,styles}-tests.tsx
```

- **Rendering:** `typography.tsx` resolves the element as follows:
  - `asChild` → `Slot.Root`;
  - otherwise `as ?? naturalElements[variant]`.

  It renders `cn(variantClassNames[variant], toneClass, weightClass, alignClass, wrapClass, truncate && "truncate", clampClass, italic && "italic", tabularNums && "tabular-nums", className)`, with `data-slot="typography"` and `data-variant={variant}`. When a modifier is omitted, its class is `undefined`.
- **Modifier classes:**
  - `tone`: `default` → `text-foreground`, `muted` → `text-muted-foreground`, `primary` → `text-primary`, `destructive` → `text-destructive`;
  - `weight`: `font-normal` / `font-medium` / `font-semibold` / `font-bold`;
  - `align`: `text-start` / `text-center` / `text-end` / `text-justify`;
  - `wrap`: `text-balance` / `text-pretty` / `text-nowrap`;
  - `lineClamp`: `line-clamp-1` … `line-clamp-6`.

  They are all utilities, so `cn` merges them correctly against the consumer's `className` (`tone="muted" className="text-foreground"` → foreground).
- **No `success` tone:** the theme has no success token, so `success` is left out. Adding one later is an additive change.
- **Nothing in `internal/`:** no other component shares this code yet.

### 5. Types: polymorphic by `as`, exclusive pairs by union

```ts
type TypographyElement = (typeof typographyElements)[number]; // closed list from the spec
interface TypographyStyleProps { variant?; tone?; weight?; align?; wrap?; italic?; tabularNums? }
type TypographyClampProps =
  | { truncate?: boolean; lineClamp?: never }
  | { lineClamp?: 1 | 2 | 3 | 4 | 5 | 6; truncate?: never };
type TypographyProps<E extends TypographyElement = "span"> = TypographyStyleProps & TypographyClampProps & (
  | ({ as?: E; asChild?: false } & DistributiveOmit<ComponentPropsWithRef<E>, keyof TypographyStyleProps | "as">)
  | ({ asChild: true; as?: never } & ComponentPropsWithRef<"span">)
);
export function Typography<E extends TypographyElement = "span">(props: TypographyProps<E>): ReactElement;
```

- **Without `as`:** the generic defaults to `"span"`, whose props are the common `HTMLAttributes`. Element-specific attributes (`htmlFor`, `dateTime`, `cite`) therefore need the matching `as`, as the spec requires.
- **Refs:** React 19 passes `ref` as a prop, so no `forwardRef` is needed.
- **Runtime fallback for untyped JS:** if both `as` and `asChild` are passed, `asChild` wins. If both `truncate` and `lineClamp` are passed, `lineClamp` wins. These are documented, with no warning: no text is missing, so `useMissingTexts` does not apply.
- **Alternative: one `ComponentProps<"p">` for all elements.** It is simpler, but it would accept `htmlFor` on a `p` and reject `dateTime` on a `time`. Rejected.

### 6. Tests

- **render:** each variant gives its class and its natural element. The bare component is a `p` with only `typography-body`. Checks `data-*` and that the ref reaches the element.
- **as:** for a sample of elements, the tag changes and the class list stays the same.
- **as-child:** a single `a` with merged classes and props.
- **independence:** for every modifier, rendering with and without it differs only by its own class, and the element is the same. `className` is last and wins over `tone` and `weight` through `cn`.
- **types:** `expectTypeOf`, plus `@ts-expect-error` for `as="button"`, `htmlFor` without `as="label"`, `truncate` with `lineClamp`, `as` with `asChild`, and `lineClamp={7}`.
- **styles** (node environment):
  - reads `src/styles/typography.css`;
  - checks the six variables and the class block of every variant, the four role variables, the `@theme inline` mappings and the geist-mono import;
  - checks that the classes sit inside `@layer components`;
  - checks that `index.css` imports `typography.css` after `theme.css`.
- **No new devDependency for the Tailwind compile check.** The follow-up builder change adds an end-to-end compile test with `@tailwindcss/node`, which `apps/storybook` already has. The consumer smoke check in `check:package` still builds a fresh app with `styles.css`.

### 7. Storybook

- **Location:** `stories/components/data-display/typography/`, titled `components/Data Display/Typography`.
- **Stories:**
  - `Playground`: every prop, grouped with `table.category`.
  - `Variants`: every variant with its name and metrics.
  - `SemanticVsVisual`, `Tones`, `Weights`, `Truncation`, `Wrapping` and `AsChild`.
  - `Composition`: a page header (overline, h1, lead) and a card article.
- **`play` functions:**
  - check the elements;
  - check `getComputedStyle` font sizes (Storybook compiles the real stylesheet);
  - check that `className` wins.
- **Foundations page:** `Foundations/Typography` is rewritten around the variants. `TypeScale` (`.storybook/docs/type-scale.tsx`) renders `typographyVariants` with the computed size, line height and weight, read from the variables, so it follows overrides.

## Risks / Trade-offs

- **`font-mono` changes for existing components.** The chart, code-block and questionnaire components switch from the system mono stack to Geist Mono. → Mitigation: Geist Mono is metrically close and the same design family. The change is mentioned in the changeset, and the affected stories are checked visually.
- **Theme Builder exports keep their font block.** A theme file exported before this change sets `@theme inline { --font-sans: var(--font-sans) }` and `:root { --font-sans: … }`. Loaded after the package, it wins for `font-sans` and leaves the typography roles untouched, so variants and `font-sans` could use different families. → Mitigation: documented in the theming guide (move the font lines to the typography variables). The follow-up builder change removes fonts from the theme export.
- **Fluid sizes and very wide screens:** they stop at the `clamp` maximum, by design.
- **The table is duplicated** in the CSS and the TS map. → Mitigation: the styles test fails on any drift.
- **`cn` cannot dedupe a consumer passing another `typography-*` class in `className`.** Both classes apply, and the later one in the stylesheet wins. → Mitigation: documented. Use `variant` to change the style.

## Migration Plan

The change is additive for consumers. They upgrade the package and keep importing `styles.css`, and fonts and sizes stay the same except for `font-mono`. To customise typography, an app adds a file after `styles.css` that redefines `--typography-*` variables, and installs the font package it references. Rollback is reverting the package version.

The follow-up change adopts `Typography` or the `typography-*` classes in existing components. These are the candidates found:
- the data-table title and subtitle (`data-table-header.tsx`), head-cell subtitles, and the pagination and status texts (`data-table-classes.ts`);
- the field counter (`field-counter.tsx`), choice-row texts (`choice-styles.ts`), checkbox-group descriptions, slider value and marks, and file and avatar errors;
- the app-layout group labels, menu text, badge and letter fallback (`app-layout-classes.ts`);
- select-field empty text, count and group labels (`select-field/components/styles.ts`).
