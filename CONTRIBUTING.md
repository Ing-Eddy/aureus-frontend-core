# Contributing

## The shadcn boundary

Everything the shadcn CLI generates lives in **CLI-owned** paths:

- `packages/ui/src/shadcn/**` (components, hooks, `lib/utils.ts`)
- `packages/ui/src/styles/shadcn.css`

**Never edit these files by hand.** They are overwritten by `pnpm --filter @aureus-core/ui shadcn:update` and excluded from Biome.

```sh
pnpm --filter @aureus-core/ui shadcn:add card dialog   # install components
pnpm --filter @aureus-core/ui shadcn:update            # re-pull all installed components (review the diff!)
```

Run `shadcn:update` on a branch, review `git diff`, run tests and Storybook, then add a changeset.

## Customising shadcn (use the first that works)

1. **Tokens** – override CSS variables in `packages/ui/src/styles/theme.css` (loaded after `shadcn.css`).
2. **Wrap** – create a component in `src/components/` that composes the primitive (`cva` + `cn()` from `@/shadcn/lib/utils`).
3. **Fork** – copy the file into `src/components/<new-name>/` under a new name. From then on it is yours and the CLI will never touch it.

Code in `src/shadcn/` must never import from `src/components/`.

## Custom components

One kebab-case folder per component. Its `index.ts` is the only public entry point:

```
src/components/example-button/
├─ example-button.tsx
├─ example-button-types.ts
├─ example-button-tests.tsx
└─ index.ts
```

```ts
// index.ts
export { ExampleButton } from "./example-button";
export type { ExampleButtonProps } from "./example-button-types";
```

- Consumers import it as `@aureus-core/ui/components/example-button`. Exports are wildcards, so you never edit `package.json`.
- Inside the package, import other components through their folder (`@/components/x`), never their internal files.
- **No root barrel** (`src/index.ts`).

## Naming

Pure kebab-case. Role suffixes use `-`, never `.`:

| Role    | Name                                                                |
| ------- | ------------------------------------------------------------------- |
| Types   | `<name>-types.ts`                                                   |
| Tests   | `<name>-tests.tsx`                                                  |
| Stories | `<name>-stories.tsx` (in `apps/storybook/src/stories/…`, see below) |
| Docs    | `<name>-docs.ts` (bilingual docs content, next to the stories file) |

## Stories and docs

Every installed shadcn component has a folder in the Storybook app. `pnpm test` fails if one is missing or incomplete.

```
apps/storybook/src/stories/shadcn/<category>/<name>/
├─ <name>-stories.tsx   # title "shadcn/<Category>/<Name>", parameters: { aureusDocs: docs }
└─ <name>-docs.ts       # export const docs = defineComponentDocs({ …, en: {…}, es: {…} })
```

Categories: `actions`, `forms`, `overlays`, `navigation`, `data-display`, `feedback`, `layout`, `ai-chat`.
Use [`actions/button/`](apps/storybook/src/stories/shadcn/actions/button) as the template.

**Stories** import the package only through public paths (`@aureus-core/ui/shadcn/<name>`), never source files. Each component needs:

1. `Playground`: a control for every prop that changes the output, grouped with `table.category` (Content, Appearance, State, Behavior, Events). Callbacks use `fn()` from `storybook/test`, so calls show in the Actions panel.
2. Variants and sizes (a gallery story is fine), plus the states the component supports: disabled, invalid (`aria-invalid`), loading.
3. At least one composition that reflects real usage (e.g. Field + Label + Input).
4. A `play` function for every interactive component. It checks the keyboard behaviour and the main state change. Overlays also check that focus moves inside and returns to the trigger on close; query them with `within(document.body)`, because they render in a portal. For arrow keys in Radix roving-focus groups (RadioGroup, ToggleGroup, Slider…), use `pressKey` from `@sb/testing/press-key`: it holds the key down like a person does, which Radix needs to select on focus.
5. Local data only: fixtures from `src/fixtures/`, images from `public/` referenced through `asset("images/x.svg")` from `@fixtures/asset` (so they also load on GitHub Pages, under `/<repo>/`). No network, no `new Date()`.

**Docs** (`<name>-docs.ts`) hold language-neutral facts (`importPath`, `exports`, `api` types and defaults, story names, keyboard keys, links) and one prose block per locale (`en`, `es`). TypeScript rejects a locale that misses or adds a sub-component, prop, story or key; the coverage test rejects empty text or lists of different lengths. Wrap code in backticks: the docs page renders it as `<code>`.

**Guides and foundations** live in `apps/storybook/src/stories/{guides,foundations}/*.mdx`. Write each section twice, in `<En>` and `<Es>` blocks from `@sb/i18n/localized`, with a blank line after the opening tag so MDX parses the Markdown inside. The coverage test fails when a page has a different number of `<En>` and `<Es>` blocks. For short inline text use `<Localized en="…" es="…" />`.

**Accessibility.** Every story runs axe in `pnpm test`, and a violation fails it. Fix the story first (give the element the accessible name a real app would). If the violation comes from the shadcn component itself:

- for a colour-contrast problem, fix the token in `packages/ui/src/styles/theme.css`;
- if the component accepts a prop or `components` override that fixes it, use it in the story and document it in the docs `aria` notes, since consumers need the same fix (Slider thumb name, Calendar `labels` and `WeekNumber`);
- if only some elements are affected, narrow the rule with a `selector` instead of disabling it (`rules: [{ id: "button-name", selector: "button:not([data-slot=…])" }]`, see Combobox);
- otherwise disable only that rule on that story (`parameters: { a11y: { config: { rules: [{ id, enabled: false }] } } }`), with a comment linking the upstream issue. Never relax a rule globally.

**Running them.**

```sh
pnpm --filter @aureus-core/storybook exec playwright install chromium   # once
pnpm --filter @aureus-core/storybook test                               # stories (Chromium) + coverage
pnpm --filter @aureus-core/storybook dev                                # http://localhost:6006
```

## Releasing

Every change to a published package needs a changeset:

```sh
pnpm changeset
```

When the PR is merged to `main`, CI opens a "Version Packages" PR. Merging that PR publishes to npm (trusted publishing, with provenance).
