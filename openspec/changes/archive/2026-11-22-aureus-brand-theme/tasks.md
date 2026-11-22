## 1. Package theme

- [x] 1.1 Rewrite `packages/ui/src/styles/theme.css` (design decisions 1 and 2):
  - a header comment (Aureus brand, hex references, contrast summary, override rules);
  - a `:root` block with the 31 light color tokens and the four `--brand-*` constants;
  - a `.dark` block with the 31 dark tokens and the dark constants;
  - `@theme inline` mapping the four `--color-brand-*` colors.

  Keep the AA comments for both destructive reds. Verify with `pnpm --filter @aureus-core/ui build` that `dist/styles/theme.css` contains the new blocks.
- [x] 1.2 Add `packages/ui/src/theme-css-tests.ts` (node environment, design decision 4). It checks that both blocks define the 31 tokens and four constants, that `@theme inline` has the four mappings, and that there is no `:root:not(.dark)`. Verify that the test passes, and that it fails when a token is removed.
- [x] 1.3 Compile `@aureus-core/ui/styles.css` with `@tailwindcss/node` in a test (the storybook unit project, next to the Theme Builder Tailwind test). Check:
  - `bg-brand-gold` and `text-brand-gold-text` resolve to `var(--brand-gold)` and `var(--brand-gold-text)`;
  - an app `:root { --muted-foreground: … }` appended after the package appears after the package's `:root` block.

  Verify that the test passes.

## 2. Theme Builder preset

- [x] 2.1 Update `apps/storybook/src/stories/tools/theme-builder/core/default-theme.ts`:
  - `aureusColors` takes the design table values, normalized;
  - `aureusInputs` takes the blue primary, `achromaticPrimary: false`, slate, `tint: 0`, the destructive red and `chartMode: "primary"`;
  - the comments describe the brand.

  Verify that the typecheck passes.
- [x] 2.2 Update `core/default-theme-tests.ts` to merge `theme.css` `:root` and `.dark` over `shadcn.css`, ignoring `--brand-*`. Verify that the drift test passes.
- [x] 2.3 Add `core/default-theme-contrast-tests.ts` (design decision 3): the preset has no failing contrast pair, and the ring and charts reach at least 3:1 in both modes. Verify that the test passes.
- [x] 2.4 Update the Theme Builder stories and tests that assert stock colors, such as the default primary in the code view or the "meets WCAG AA" summary, to the brand values. Verify that the Theme Builder stories pass.
  - Done: three unit tests assumed stock shadcn (the tint test now uses a pure neutral ramp, the Tailwind test reads the slate dark background, and the export-override test checks the brand `:root` block instead of `:root:not(.dark)`). The stories needed no change.

## 3. Documentation

- [x] 3.1 Update `apps/storybook/src/stories/foundations/colors.mdx` (EN/ES) with the "Aureus brand" section (swatches of `--brand-blue`, `--brand-gold` and `--brand-gold-text`) and the usage rules. Verify that the MDX coverage check passes and the swatches follow the theme toolbar.
- [x] 3.2 Update `guides/theming.mdx` (EN/ES):
  - rename the section to "The Aureus brand theme" and document what changed and how to restore stock shadcn;
  - remove the `:root:not(.dark)` caveat.

  Verify that the page renders in both locales.
- [x] 3.3 Update the README "Theming" section (brand by default, `brand-*` utilities) and add a CONTRIBUTING note (`theme.css` is the brand source, the preset must follow, contrast tests guard both). Verify that `pnpm lint` formats both files.
- [x] 3.4 Add `.changeset/aureus-brand-theme.md` (`minor`). Verify with `pnpm changeset status`.

## 4. Verification

- [x] 4.1 Run `pnpm lint && pnpm typecheck && pnpm test && pnpm build && pnpm check:package`. The full Storybook suite runs axe on every story. Fix any contrast failure in the palette, without suppressing rules. Verify that every command passes.
- [ ] 4.2 Check by hand in Storybook, in light and dark mode:
  - Foundations › Colors;
  - Button and Badge, including the `secondary` variants;
  - Bubble;
  - Chart;
  - AppLayout (the active item);
  - DataTable and Modal;
  - Theme Builder "Reset";
  - the Typography Builder "Interface" view.
- [x] 4.3 Run `openspec validate aureus-brand-theme --strict` and verify that it passes.
