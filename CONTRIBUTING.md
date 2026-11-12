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

| Role    | Name                                                                        |
| ------- | --------------------------------------------------------------------------- |
| Types   | `<name>-types.ts`                                                           |
| Tests   | `<name>-tests.tsx`                                                          |
| Stories | `<name>-stories.tsx` (in `apps/storybook/src/stories/{shadcn,components}/`) |

## Releasing

Every change to a published package needs a changeset:

```sh
pnpm changeset
```

When the PR is merged to `main`, CI opens a "Version Packages" PR. Merging that PR publishes to npm (trusted publishing, with provenance).
