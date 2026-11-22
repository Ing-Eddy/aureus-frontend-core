## Why

Almost every form in an Aureus app has the same shape: a zod schema (written as a hook so its messages follow the i18next language), empty default values, existing values when editing, and validation errors sent back by the backend, often as an array of messages per field. Today each app copies its own `useGenericForm` / `createFormHook` and the pieces that go with them.

The `aureus_systems` version has three problems:
- a defaults factory with an optional parameter throws when called without arguments;
- every form repeats the `{ ...DEFAULTS, ...preset }` merge;
- server errors "stick" after the user fixes the field.

It also fixes app-specific defaults (`onBlur`, `shouldUnregister: true`) and depends on `react-i18next`. Moving a corrected version into the monorepo lets every app create a form hook in a few lines. A new `@aureus-core/hooks` package gives future React hooks a home: `@aureus-core/ui` is for components, and `@aureus-core/utils` must stay free of React.

## What Changes

- **New published package `@aureus-core/hooks`:**
  - ESM only;
  - one public entry point per module (`@aureus-core/hooks/<module>`), no root barrel;
  - a private `internal/` layer;
  - built with tsdown and checked with its own `check:package`.

  `react` is a required peer. The libraries that a module needs are optional peers, so a future module does not force them on everyone. The first module needs `react-hook-form`, `zod` and `@hookform/resolvers`.
- **Module `schema-form`:**
  - `createFormHook({ schema, defaultValues, ...options })` returns a form hook (`useLoginForm`), configured per form. There is no app-wide preset or factory.
    - `schema` is a zod schema or a schema hook, with or without arguments.
    - `defaultValues` is a plain object.
    - The options are every react-hook-form `useForm` option except `resolver`, `context`, `defaultValues` and `values`, plus `joinMessages`, `parseServerErrors` and `resolverOptions`.
  - The returned hook takes `{ schemaParams?, values?, serverErrors?, ...per-call options }`.
    - `schemaParams` is passed to the schema hook. TypeScript forbids it, makes it optional or requires it, following the schema hook's parameters.
    - `values` (existing data, for edit forms) is deep-merged over `defaultValues` and kept in sync when its content changes.
    - `serverErrors` sets backend errors.
  - It returns react-hook-form's own `UseFormReturn<input, unknown, output>`, ready for `<FormProvider {...form}>`.
  - `useSchemaForm(schema, options)` is the same engine without the factory.
  - `applyServerErrors(form, errors, options?)` sets backend errors imperatively.
  - Backend errors are `{ [path]: string | string[] }`:
    - dot paths and `root` are allowed;
    - messages are joined for the helper text and the full array is kept in `types.server`;
    - an optional adapter accepts any other response shape.
  - When the schema's identity changes (language or `schemaParams` change), only the fields with a non-server error are re-validated, so visible messages update without losing backend errors. A schema that changes on every render is detected: it warns once in development and never loops.
  - Defaults are react-hook-form's own. Every option is independent and opt-in. No texts are shipped (only developer warnings).
- **Documentation:**
  - a bilingual `hooks` section in Storybook, with a complete guide and live stories that use the `@aureus-core/ui` controls;
  - the guide documents the recommended schema-hook pattern;
  - updates to the "Fields & controls" and "Hooks & utilities" guides;
  - a package README, a root README section, a CONTRIBUTING section and a `minor` changeset.

Non-goals:
- A `Form` component, or shared form prop types (`FormBaseProps`).
- Schema libraries other than zod 4.
- Changing `@aureus-core/ui` or `@aureus-core/utils`.
- Migrating the forms of `aureus_systems` (they are a later, app-side change).

## Capabilities

### New Capabilities

- `hooks-package`: the public contract of `@aureus-core/hooks`:
  - module entry points;
  - required and optional peers;
  - the private layer;
  - development-only warnings;
  - no default texts.
- `schema-form`: the `schema-form` module:
  - `createFormHook` and `schemaParams` typing;
  - `useSchemaForm` and its option pass-through;
  - neutral defaults;
  - the `defaultValues` / `values` merge and sync;
  - input and output types;
  - server errors (shape, joining, adapter, lifecycle);
  - re-validation when the schema changes, and the unstable-schema guard.

### Modified Capabilities

- `component-playground`:
  - **Playground renders the built package:** it also consumes `@aureus-core/hooks` through its public paths.
  - **Story organisation:** a `hooks/` section after `utils/`.
  - **Bilingual documentation:** the hooks pages are covered too.

## Impact

- **New code:**
  - `packages/hooks/`: `package.json`, `tsconfig.json`, `tsdown.config.ts`, `vitest.config.ts`, `scripts/check-package.mjs`, `README.md`;
  - `src/schema-form/`, `src/internal/`.
- **Playground:**
  - `apps/storybook/package.json` depends on `@aureus-core/hooks` (`workspace:*`);
  - new `src/stories/hooks/` (MDX guide and stories);
  - `storySort` in `.storybook/preview.tsx`;
  - `src/coverage-tests.ts` adds `hooks` to the bilingual MDX check;
  - the two existing guides are updated.
- **Docs:** root `README.md`, `CONTRIBUTING.md`, `.changeset/add-hooks-package.md`.
- **CI / release:** no workflow changes expected. The root `typecheck`, `test`, `build` and `check:package` run over `packages/*`, to be confirmed while scaffolding.
- **Manual step:** before the first release, the owner creates `@aureus-core/hooks` on npm and registers `release.yml` as its trusted publisher, as was done for utils.
- **Dependencies:**
  - peers `react ^19` (required) and `react-hook-form ^7`, `zod ^4`, `@hookform/resolvers ^7` (optional);
  - devDependencies on the same versions already used by `packages/ui`, plus Testing Library and jsdom.
