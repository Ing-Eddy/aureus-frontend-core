## Why

The package has no text component. Every component and app styles text with ad-hoc Tailwind classes: `text-sm` appears 105 times in `packages/ui/src`, `text-xs` 40 times, and titles mix `font-heading`, `font-semibold` and `leading-*` by hand. Nothing guarantees that a heading, a caption or a label look the same across components and apps. Fonts can only be changed by editing `@theme inline` in each app, and there is no monospace font bundled. The package needs one source of truth for typography: a fixed set of named text styles, backed by runtime tokens that apps (and the upcoming Typography Builder tool) can override.

## What Changes

- **New stylesheet `packages/ui/src/styles/typography.css`**, imported by `styles.css` after `theme.css`:
  - Runtime variables in `:root`:
    - the font families `--typography-font-{sans,heading,serif,mono}`;
    - the global letter spacing `--typography-tracking-normal`;
    - six variables per variant: `--typography-<variant>-{font,size,line-height,weight,tracking,transform}`.
  - `@theme inline` maps Tailwind's `--font-sans`, `--font-heading`, `--font-serif`, `--font-mono` and the `--tracking-*` scale to those variables. Existing `font-heading` titles (card, dialog, sheet…) follow the heading font with no change to shadcn files.
  - One class per variant, `.typography-<variant>`, in the `components` layer. Any Tailwind utility passed by the consumer always wins over it. Apps may also use these classes without the component.
- **Default "Aureus" values for 15 variants:** `display`, `h1`–`h6`, `lead`, `body-lg`, `body`, `body-sm`, `label`, `caption`, `overline` and `code`.
  - Fonts: Geist for text and headings, Geist Mono for code, the system serif stack for serif.
  - `display`, `h1` and `h2` have fluid sizes that keep a `rem` term.
- **New `Typography` component** (`@aureus-core/ui/components/typography`):
  - `variant` defaults to `"body"`.
  - Each variant renders its natural element: `h1`–`h6` for headings, `p` for body text, `span` for label, caption and overline, `code` for code.
  - `as` changes only the element and accepts a closed list of text elements. Native props are typed for the chosen element.
  - `asChild` uses Radix `Slot`.
  - Opt-in, independent modifiers, none of which changes another prop's default:
    - `tone` (`default`, `muted`, `primary`, `destructive`);
    - `weight`, `align`, `wrap`, `italic`, `tabularNums`;
    - `truncate` or `lineClamp`, which are mutually exclusive in TypeScript.
  - `className` always wins. The component renders no text of its own.
  - Exports the `typographyVariants` list and its types.
- **New runtime dependency `@fontsource-variable/geist-mono`**, imported by `typography.css`.
- **Documentation:**
  - a bilingual (EN/ES) Storybook page and stories under `components/Data Display/Typography`;
  - the rewritten `Foundations/Typography` page and type-scale specimen;
  - a typography section in the theming guide;
  - README and CONTRIBUTING sections;
  - JSDoc;
  - a `minor` changeset.

Non-goals:
- Migrating existing components to `Typography`. This is a follow-up change; the candidates are listed in `design.md`.
- A `Prose` component for long-form containers (lists, blockquotes, spacing between blocks).
- The Typography Builder tool and the removal of fonts from the Theme Builder. These belong to a separate change, `storybook-typography-builder`.
- Changes to `shadcn.css` or `src/shadcn/**`.

## Capabilities

### New Capabilities

- `typography`:
  - the variant catalog and its default values;
  - the runtime tokens and the classes per variant;
  - font roles;
  - the `Typography` component: natural elements, `as` and `asChild`, independent modifiers, `className` precedence;
  - no default texts;
  - accessibility of heading semantics.

### Modified Capabilities

- `ui-package`:
  - "Consumer stylesheet": the stylesheet also loads the typography tokens and classes, after the theme overrides.
  - "Runtime dependencies are used and documented": `@fontsource-variable/geist-mono` is a stylesheet-referenced dependency, and the documentation lists how to replace the bundled fonts.

## Impact

- **New code:**
  - `packages/ui/src/styles/typography.css`;
  - `packages/ui/src/components/typography/` (`types/`, `utils/`, `tests/`).
- **Modified:**
  - `packages/ui/src/styles/index.css`, which gains one import;
  - `packages/ui/package.json`, which gains the geist-mono dependency;
  - `apps/storybook/src/stories/foundations/typography.mdx`;
  - `apps/storybook/.storybook/docs/type-scale.tsx`;
  - `guides/theming.mdx`, README and CONTRIBUTING.
- **Reused:**
  - `Slot` from `radix-ui` and `cn` from `@/shadcn/lib/utils`;
  - the `Record<…, string>` class-map pattern of `modal-classes.ts`;
  - the color tokens that already exist (`--foreground`, `--muted-foreground`, `--primary`, `--destructive`).
- **Visual impact on existing components:**
  - `font-heading` and `font-sans` now resolve through variables with the same default values, so nothing changes visually.
  - `font-mono` changes from the system mono stack to Geist Mono (chart, code-block, questionnaire).
- **Storybook:** new stories folder `apps/storybook/src/stories/components/data-display/typography/`.
- **Release:** a `minor` changeset.
