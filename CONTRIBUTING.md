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

One kebab-case folder per component. Its `index.ts` is the only public entry point. The folder root holds **only** `index.ts` and `<name>.tsx`, with two exceptions while they stay simple: `<name>-types.ts` and a single `<name>-tests.tsx`.

```
src/components/example-button/
├─ index.ts
├─ example-button.tsx
└─ example-button-types.ts      # only while it is simple
```

When a component grows, its other code goes in category subfolders, each with its own `index.ts`: `components/`, `hooks/`, `types/` and `utils/`. Tests split across several files go in `tests/` (no `index.ts`: tests are not imported; anything in a `tests/` folder is never built).

```
src/components/example-picker/
├─ index.ts
├─ example-picker.tsx
├─ components/   index.ts, example-picker-option.tsx
├─ hooks/        index.ts, use-example-picker.ts
├─ types/        index.ts, example-picker-types.ts
└─ tests/        example-picker-keyboard-tests.tsx, example-picker-a11y-tests.tsx
```

```ts
// index.ts
export { ExampleButton } from "./example-button";
export type { ExampleButtonProps } from "./example-button-types";
```

- Consumers import it as `@aureus-core/ui/components/example-button`. Exports are wildcards, so you never edit `package.json`.
- Inside the package, import other components through their folder (`@/components/x`), never their internal files.
- **No root barrel** (`src/index.ts`).

## The private `internal/` layer

Building blocks shared by several custom components live in `packages/ui/src/internal/`. It is compiled with the package but is **not exported**: consumers cannot import it, so its API can change freely.

```
src/internal/
├─ components/   # internal components, each in its own folder (same structure rules as above)
├─ hooks/
├─ types/
└─ utils/
   ├─ constants/
   ├─ helpers/   # pure functions
   └─ libs/      # wrappers or configuration of third-party libraries
```

- Every category and sub-category has an `index.ts`; import through it (`@/internal/hooks`, `@/internal/utils/helpers`). Do not create empty folders.
- Dependency direction: `shadcn/` ← `internal/` ← `components/`. `shadcn/` imports neither; `internal/` never imports `components/`. Inside `internal/`: `types` and `utils/constants` ← `utils/helpers` and `utils/libs` ← `hooks` ← `components`.

## Fields and controls

Form inputs come in pairs that must look identical with the same props:

- `<kind>-field` (e.g. `text-field`, `password-field`): general-purpose, controlled or uncontrolled. Single-line fields render `InputField` from `internal/components` (field shell, input frame, spinner and action), choosing only the input type and the action, so every family looks the same.
- `<kind>-control` (e.g. `text-control`): the same input bound to react-hook-form. It takes only `name`, `disabled`, `shouldUnregister` and the field's visual props, reads the form from the `FormProvider` context through `ControlField`, and renders the field with `mapControllerToField`. No `control`, `rules` or type parameters.

A field either accepts a configurable `action` (text, text area) or defines a fixed button of its own (the password visibility toggle); a field with a fixed button must not accept `action`. Single-line fields put the action at the inline end of the input; multi-line fields put it at the inline end of a footer bar (`InputGroupAddon align="block-end"`) that stays attached to the bottom edge however tall the field gets. `FieldCounter` in `internal/components` provides an accessible character counter for any field. State a field owns but a consumer may control (such as password visibility) uses `useControllableState` from `internal/hooks`.

The shared props (`FieldBaseProps`, `FieldActionProps`, `FieldClassNames`) live in `internal/types`. Each pair has a parity test that compares the markup of the field and the control.

## Naming

Pure kebab-case. Role suffixes use `-`, never `.`:

| Role    | Name                                                                |
| ------- | ------------------------------------------------------------------- |
| Types   | `<name>-types.ts`                                                   |
| Tests   | `<name>-tests.tsx`                                                  |
| Stories | `<name>-stories.tsx` (in `apps/storybook/src/stories/…`, see below) |
| Docs    | `<name>-docs.ts` (bilingual docs content, next to the stories file) |

## Stories and docs

Every installed shadcn component, and every custom component in `src/components/`, has a folder in the Storybook app. `pnpm test` fails if one is missing or incomplete.

```
apps/storybook/src/stories/shadcn/<category>/<name>/
├─ <name>-stories.tsx   # title "shadcn/<Category>/<Name>", parameters: { aureusDocs: docs }
└─ <name>-docs.ts       # export const docs = defineComponentDocs({ …, en: {…}, es: {…} })

apps/storybook/src/stories/components/<category>/<name>/
├─ <name>-stories.tsx   # title "components/<Category>/<Name>"
└─ <name>-docs.ts       # importPath "@aureus-core/ui/components/<name>"
```

`src/internal/` is not documented: it is not public API.

Categories: `actions`, `forms`, `overlays`, `navigation`, `data-display`, `feedback`, `layout`, `ai-chat`.
Use [`actions/button/`](apps/storybook/src/stories/shadcn/actions/button) as the template.

**Stories** import the package only through public paths (`@aureus-core/ui/shadcn/<name>`, `@aureus-core/ui/components/<name>`), never source files. Each component needs:

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
