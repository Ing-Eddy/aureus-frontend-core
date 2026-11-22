## 1. Tokens and stylesheet

- [x] 1.1 Add `@fontsource-variable/geist-mono` to the runtime `dependencies` of `packages/ui`. Verify that `pnpm install` succeeds and the package `node_modules` contains the font files.
- [x] 1.2 Write `packages/ui/src/styles/typography.css` (design decisions 1–3). It contains:
  - the geist-mono `@import`;
  - the unlayered `:root` block, with the four font roles, `--typography-tracking-normal` and six variables per variant, with the values of the spec table in catalog order;
  - the `@theme inline` mappings for `--font-{sans,heading,serif,mono}` and the `--tracking-*` steps;
  - `@layer base` for the body letter spacing;
  - `@layer components` with one `.typography-<variant>` class per variant;
  - a header comment explaining how apps override the variables.

  Verify that `pnpm --filter @aureus-core/ui build` copies it to `dist/styles/`.
- [x] 1.3 Import `./typography.css` in `packages/ui/src/styles/index.css` after `theme.css` and before `data-table.css`. Verify that Storybook starts and the shadcn `Card` title still renders in Geist.

## 2. Types and utilities (`components/typography/`)

- [x] 2.1 Write `utils/typography-variants.ts` with:
  - `typographyVariants` (an `as const` list in spec order);
  - `typographyElements` (the closed `as` list);
  - `naturalElements: Record<TypographyVariant, TypographyElement>`.

  Add the `utils/index.ts` barrel. Verify that the typecheck passes.
- [x] 2.2 Write `utils/typography-classes.ts` with `variantClassNames`, `toneClassNames`, `weightClassNames`, `alignClassNames`, `wrapClassNames` and `lineClampClassNames` (design decision 4). They are full literal class strings, so `@source` picks them up. Export them from the barrel. Verify that the typecheck passes.
- [x] 2.3 Write `types/typography-types.ts` (design decision 5):
  - `TypographyVariant`, `TypographyElement`, `TypographyTone`, `TypographyWeight`, `TypographyAlign`, `TypographyWrap` and `TypographyLineClamp`;
  - the polymorphic `TypographyProps<E>`, with the exclusive `as`/`asChild` and `truncate`/`lineClamp` unions and `DistributiveOmit` from `@/internal/types`;
  - JSDoc on every prop, stating its default and that it is independent.

  Add the `types/index.ts` barrel. Verify that the typecheck passes.

## 3. Component

- [x] 3.1 Write `typography.tsx`. It resolves the element (`asChild` → `Slot.Root`, otherwise `as ?? naturalElements[variant]`), builds the classes with `cn` in the order of design decision 4 with `className` last, and sets `data-slot="typography"` and `data-variant`. Unused modifiers add nothing. Verify by rendering it in a quick test.
- [x] 3.2 Write the `index.ts` barrel, exporting `Typography`, `typographyVariants`, `typographyElements` and every public type by name. Verify that `pnpm --filter @aureus-core/ui build && pnpm --filter @aureus-core/ui check:package` passes and lists `components/typography`.

## 4. Tests (`components/typography/tests/`)

- [x] 4.1 `typography-render-tests.tsx`:
  - each variant renders its natural element and its class;
  - the bare component is a `p` with only `typography-body`;
  - checks `data-slot`/`data-variant`, the ref, and that native attributes are forwarded;
  - an empty label renders an empty `span` with no text attributes.

  Verify with `pnpm --filter @aureus-core/ui test`.
- [x] 4.2 `typography-as-tests.tsx` and `typography-as-child-tests.tsx`:
  - `variant="h2" as="h3"` renders an `h3` with the `h2` class;
  - every element in `typographyElements` renders;
  - `asChild` with an `a` renders one link with merged classes and props;
  - in untyped JS, `asChild` wins over `as`.

  Verify that the tests pass.
- [x] 4.3 `typography-independence-tests.tsx`. For each modifier (tone, weight, align, wrap, truncate, lineClamp, italic, tabularNums), the class list with and without it differs only by that modifier's class, and the element is unchanged. In addition:
  - `tone="muted" className="text-foreground"` keeps only `text-foreground`;
  - `weight` with a variant keeps the variant class;
  - in untyped JS, `lineClamp` wins over `truncate`.

  Verify that the tests pass.
- [x] 4.4 `typography-types-tests.tsx`, with `expectTypeOf` and `@ts-expect-error` for:
  - `as="button"`;
  - `htmlFor` without `as="label"`;
  - `dateTime` accepted with `as="time"`;
  - `truncate` together with `lineClamp`;
  - `as` together with `asChild`;
  - `lineClamp={7}`;
  - `tone="success"`.

  Verify with `pnpm typecheck`.
- [x] 4.5 `typography-styles-tests.ts` (node environment, design decision 6). It parses `src/styles/typography.css` and checks:
  - the six variables of every `typographyVariants` entry;
  - the class blocks inside `@layer components`;
  - the four role variables and their defaults;
  - the `@theme inline` font and tracking mappings;
  - the geist-mono import;
  - that the fluid sizes contain `rem`;
  - that the import order in `index.css` is correct.

  Verify that the test fails when a variable is deleted, and then passes.
- [x] 4.6 Run `src/no-default-texts-tests.ts` and verify that it passes with an empty `ALLOWLIST`.

## 5. Stories and documentation

- [x] 5.1 Write `apps/storybook/src/stories/components/data-display/typography/typography-stories.tsx` (title `components/Data Display/Typography`, design decision 7). It has `Playground` with `table.category` groups, plus `Variants`, `SemanticVsVisual`, `Tones`, `Weights`, `Truncation`, `Wrapping`, `AsChild` and `Composition`. Each story has a `play` function that checks the elements and computed styles. Verify that the stories pass axe in light and dark mode.
- [x] 5.2 Write `typography-docs.ts` with `defineComponentDocs`:
  - `api` for every prop, with its type and default;
  - the `stories` list;
  - en/es `summary`, `whenToUse`/`whenNotToUse`, `anatomy` and `props`;
  - `aria`: heading levels follow the document outline, so choose them with `as`, never through the visual variant;
  - `theming`: the `--typography-*` variables, the font roles and the `typography-*` classes.

  Verify that `coverage-tests.ts` passes.
- [x] 5.3 Rewrite `apps/storybook/src/stories/foundations/typography.mdx` (`<En>`/`<Es>`). It covers:
  - the variant catalog with its default table;
  - the font roles;
  - runtime overrides, with a `:root` example;
  - how to replace fonts with Fontsource (`pnpm add` plus overriding `--typography-font-*`);
  - the warning about old Theme Builder font blocks.

  Update `.storybook/docs/type-scale.tsx` so it renders `typographyVariants` with live metrics. Verify that the MDX coverage check passes and the page renders.
- [x] 5.4 Add a "Typography" section to `apps/storybook/src/stories/guides/theming.mdx` (bilingual) that links to the foundations page. Verify that the page renders in both locales.
- [x] 5.5 Update `README.md`:
  - a "Typography" usage section with the example from the plan;
  - the import in the "Imports" table;
  - a "Fonts" paragraph under "Theming" (install and override).

  Verify the links and the code fences by reading the rendered README.
- [x] 5.6 Add a "Typography" section to `CONTRIBUTING.md`. It states that:
  - new components use `Typography` or the `typography-*` classes instead of ad-hoc sizes;
  - a new variant means updating `typographyVariants`, `typography.css` and the styles test;
  - modifiers stay independent.

  Verify by reading the section.
- [x] 5.7 Add `.changeset/add-typography.md` (`minor` for `@aureus-core/ui`). It mentions the new component, the stylesheet tokens, the geist-mono dependency and the `font-mono` change. Verify with `pnpm changeset status`.

## 6. Verification

- [x] 6.1 Run `pnpm lint && pnpm typecheck && pnpm test && pnpm build && pnpm check:package` and verify that every command passes.
- [ ] 6.2 Check Storybook by hand:
  - the Typography stories in both themes and both directions;
  - `Foundations/Typography`;
  - the chart and code-block stories, which now use Geist Mono;
  - the Card and Dialog titles, which show no visual change.

  Verify that an override added in the browser devtools (`--typography-h2-weight: 800`) updates only `h2`.
- [x] 6.3 Run `openspec validate add-typography --strict` and verify that it passes.
