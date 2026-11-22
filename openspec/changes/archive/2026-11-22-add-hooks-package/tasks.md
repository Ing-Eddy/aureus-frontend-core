## 1. Package scaffold

- [x] 1.1 Create `packages/hooks/package.json` (design decision 1):
  - `@aureus-core/hooks`, version `0.0.0`, `type: module`, `sideEffects: false`, `files: ["dist"]`;
  - exports `./internal/*: null`, `./*`, `./package.json`;
  - `publishConfig` with public access and provenance, `repository.directory`, `homepage`, `bugs` and `keywords`;
  - scripts `build`, `dev`, `typecheck`, `test`, `check:package`;
  - peers `react ^19` (required) and `react-hook-form ^7`, `zod ^4`, `@hookform/resolvers ^7` (optional in `peerDependenciesMeta`);
  - devDependencies with the same versions as `packages/ui` (react, react-dom, RHF, zod, resolvers, Testing Library, jsdom, tsdown, typescript, vitest, publint, attw, `@aureus-core/tsconfig`, `@types/react`, `@types/node`).

  Verify that `pnpm install` links it and that `pnpm ls --filter @aureus-core/hooks --prod` lists no dependencies.
- [x] 1.2 Add `tsconfig.json` (extends `base.json`, DOM lib, `jsx: react-jsx`, `types: ["node"]`, `@/*` paths), `tsdown.config.ts` (unbundled ESM, d.ts, platform `browser`, tests excluded, `define` for `NODE_ENV`) and `vitest.config.ts` (jsdom, `src/**/*-tests.{ts,tsx}`, `@` alias, `passWithNoTests`). Verify that `pnpm --filter @aureus-core/hooks typecheck` and `test` run with an empty `src/`.
- [x] 1.3 Copy and adapt `scripts/check-package.mjs` from utils:
  - modules discovered from `src/*/index.ts` except `internal`;
  - outputs, alias leak, publint strict, attw `esm-only` per module, tarball allowlist;
  - `internal/*` does not resolve.

  Verify, after a build, that the check passes, and that it fails and names the module when `dist/schema-form/index.js` is deleted.
- [x] 1.4 Confirm that the root `build`, `dev`, `typecheck`, `test` and `check:package` (turbo, `--filter=./packages/*`) and `.github/workflows/ci.yml` / `release.yml` pick up the new package without edits. Verify with `pnpm check:package` from the root, whose output lists `@aureus-core/hooks`.

## 2. Internal layer

- [x] 2.1 Copy `src/internal/utils/constants/is-dev.ts` and `src/internal/utils/helpers/warn-once.ts` (with `resetWarnings`) from utils, with their `index.ts` barrels. Verify with `internal/utils/helpers/tests/warn-once-tests.ts`: one log per key, and no log when `NODE_ENV=production`.

## 3. Types

- [x] 3.1 Write `schema-form/types/schema-form-types.ts` (design decisions 5 and 6):
  - `FormSchema` (zod 4 core type with object input), `FormInput<S>`, `FormOutput<S>`, `DeepPartial`;
  - `SchemaSource`, `ServerErrors<In>`, `JoinMessages`, `ServerErrorsParser<B, In>`;
  - `SchemaFormOptions` (RHF `UseFormProps` without `resolver`/`context`/`defaultValues`/`values`, plus `defaultValues`, `values`, `serverErrors`, `joinMessages`, `parseServerErrors`, `resolverOptions`);
  - `SchemaFormReturn<S>`, `FormHookOptions`, and `FormHook` with the arity-based argument tuple.

  Add `types/index.ts`, with JSDoc on every public member. Verify with `pnpm --filter @aureus-core/hooks typecheck`.

## 4. Values

- [x] 4.1 Write `utils/helpers/merge-values.ts` (design decision 4). Verify with `tests/merge-values-tests.ts`:
  - nested objects merged;
  - arrays and `Date` replaced;
  - `undefined` keeps the default and `null` is kept;
  - an object with a `null` prototype is merged;
  - neither input is mutated.
- [x] 4.2 Write `hooks/use-merged-values.ts`: memoized merge, and `undefined` when `values` is `undefined`. Verify with `tests/values-tests.tsx` (spec "Default values and existing values"):
  - create mode;
  - partial edit;
  - values that arrive later;
  - a new object with equal content does not reset the form;
  - `keepDirtyValues` keeps the user's edit.

## 5. Server errors

- [x] 5.1 Write `utils/helpers/normalize-server-errors.ts`. Verify with `tests/normalize-server-errors-tests.ts`:
  - a string;
  - an array;
  - empty strings removed;
  - an empty array, `null` and `undefined` dropped;
  - dot paths and `root` kept as given.
- [x] 5.2 Write `utils/helpers/apply-server-errors.ts` (`applyServerErrors`, design decision 6): `type: "server"`, `message` from `joinMessages` (default `" "`), `types.server`, `parse`, and a once-per-name warning for paths missing from `defaultValues` (except `root…`). Verify with the imperative cases in `tests/server-errors-tests.tsx`.
- [x] 5.3 Write `hooks/use-server-errors.ts` (an effect keyed on identity). Verify with `tests/server-errors-tests.tsx` (spec "Server errors", "Server error adapter", "Server error lifecycle"):
  - an array with `joinMessages: ". "`;
  - a string and `root`;
  - `"items.0.name"`;
  - empty messages;
  - an adapter with a Laravel-shaped body and one with `[{ field, message }]`;
  - an unknown key warns once;
  - the same object re-rendered after the user fixes the field does not bring the error back;
  - a new object with equal messages re-applies;
  - `undefined` leaves the errors unchanged.

## 6. Schema re-validation

- [x] 6.1 Write `hooks/use-schema-revalidation.ts` (design decision 7). Verify with `tests/revalidation-tests.tsx` (spec "Messages follow schema changes", "Unstable schema guard"):
  - a schema hook memoized on a fake `t` updates the visible message from "Required" to "Obligatorio" when the language changes;
  - a field without an error is not validated;
  - a server error survives;
  - a schema that is new on every render renders a bounded number of times (count renders) and logs one `[useSchemaForm]` warning.

## 7. Engine and factory

- [x] 7.1 Write `schema-form.ts` (`useSchemaForm`, design decision 3), returning RHF's object. Verify with `tests/schema-form-tests.tsx`:
  - default `mode` does not validate on blur;
  - `mode`, `shouldUnregister` and `criteriaMode`, each alone, behave as in `useForm`;
  - a `transform(Number)` field submits a number;
  - `resolverOptions` reach zod;
  - `form.reset()` returns to the merged values;
  - the form works with `FormProvider` and a `Controller`-based input.
- [x] 7.2 Write `factory/create-form-hook.ts` (design decision 5) and `factory/index.ts`. Verify with `tests/create-form-hook-tests.tsx`:
  - static schema;
  - a hook without parameters;
  - a hook with an optional parameter;
  - a hook with a required parameter;
  - `useX()` with no arguments;
  - a `schemaParams.isEdit` change applies the new rules and removes the `taxId` error;
  - an inline object `schemaParams` with an unmemoized schema warns and does not loop;
  - two forms with different options do not affect each other;
  - call options override the config for that call only.
- [x] 7.3 Add zod rule-order cases for the guide to `tests/create-form-hook-tests.tsx`:
  - `z.email(msg).min(1, msg2).trim()` with empty input: which message is shown;
  - `"  ana@mail.com "`: valid or not;
  - the same for `z.string().trim().min(1, req).pipe(z.email(invalid))`.

  Record the observed results in the guide (task 9.2). Verify that the cases pass and document actual behavior.
- [x] 7.4 Write `schema-form/index.ts`, which exports `createFormHook`, `useSchemaForm`, `applyServerErrors` and the public types. Verify with `tests/schema-form-types-tests.ts` (`@ts-expect-error`):
  - `schemaParams` missing for a required parameter;
  - `schemaParams` on a hook without parameters;
  - `schemaParams` of the wrong type;
  - `values` with an unknown field;
  - `defaultValues` with the output type;
  - an unknown key in `serverErrors`;
  - a `serverErrors` body that does not match `parseServerErrors`;
  - `resolver` in the config.

  Also assert positive cases: the submit handler gets the output type, and `useLoginForm()` compiles. Run `pnpm --filter @aureus-core/hooks typecheck && pnpm --filter @aureus-core/hooks test`.
- [x] 7.5 Run `pnpm --filter @aureus-core/hooks build && pnpm --filter @aureus-core/hooks check:package`, and verify that every check passes and that the tarball contains only `dist`, `package.json` and `README.md`.

## 8. Playground

- [x] 8.1 Add `@aureus-core/hooks: workspace:*` to `apps/storybook/package.json`. Add `"hooks", ["Schema form", ["Guide", "*"]]` after `utils` in `storySort` (`.storybook/preview.tsx`). Add `"hooks"` to `mdxDirs` in `src/coverage-tests.ts`. Verify with `pnpm install` and `pnpm --filter @aureus-core/storybook typecheck`.
- [x] 8.2 Write `src/stories/hooks/schema-form/schema-form-strings.ts` (typed `en`/`es`: labels, buttons and validation messages for the stories) and `src/stories/hooks/hooks-strings-tests.ts` (same keys, none empty). Verify with `pnpm --filter @aureus-core/storybook test`.
- [x] 8.3 Write `src/stories/hooks/schema-form/schema-form-stories.tsx` (title `hooks/Schema form`), with `TooltipProvider` and controls from `@aureus-core/ui` public paths. Stories:
  - `Basic`: empty submit shows the errors;
  - `CreateAndEdit`: the same hook without `values` and with delayed `values`;
  - `ServerErrors`: buttons for `{ email: [..] }` and for a Laravel-shaped body with an adapter;
  - `Multilanguage`: a schema hook memoized on `useLocale()`;
  - `SchemaParams`: an `isEdit` switch;
  - `Transforms`: shows the submitted output.

  Verify in `pnpm dev` that each story behaves as described in En and Es, and that `pnpm --filter @aureus-core/storybook test` (stories as tests) passes.

## 9. Documentation

- [x] 9.1 Write `src/stories/hooks/schema-form.mdx` (`<Meta of={SchemaFormStories} name="Guide" />`), fully in `<En>` and `<Es>`, with these sections:
  1. What it solves, and `createFormHook` vs `useSchemaForm`.
  2. Installation and peers.
  3. Your first form, step by step.
  4. Create and edit with the same form: `defaultValues` vs `values`, merge rules, late data, `keepDirtyValues`.
  5. Configuring each form: the table of every option, its default and its effect; independence; two forms with different options.
  6. Server errors: shape, dot paths and `root`, `joinMessages`, `types.server`, `parseServerErrors` examples, reactive vs imperative, lifecycle and the stable-object rule.
  7. Schema hooks (see 9.2).
  8. Input and output types.
  9. Development warnings and common mistakes.
  10. Migration from `useForm` + `zodResolver`, and from the original `createFormHook`, with a before → after table.
  11. API reference.

  Verify with `pnpm --filter @aureus-core/storybook test` (MDX balance) and by reading the page in both locales.
- [x] 9.2 In section 7 of the guide (schema hooks), document:
  - `useTranslation` + `useMemo([t, ...args])`;
  - `schemaParams` and the arity → type table;
  - primitive or memoized parameters;
  - what re-validates when the language or the parameters change;
  - the unstable-schema warning;
  - the zod 4 rule order, with the results from task 7.3 and the corrected `useLoginSchema` example;
  - form types from `z.input` / `z.output` of `ReturnType<typeof useXSchema>`.

  Verify that every code sample in the section type-checks, by copying it into a scratch `.tsx` under the storybook `tsconfig`.
- [x] 9.3 Update `guides/fields-and-controls.mdx` ("Using a control": `createFormHook` as the recommended way, with a link to the guide) and `guides/hooks.mdx` (a section and a link to `@aureus-core/hooks`), in both locales. Verify with the MDX balance test.
- [x] 9.4 Write `packages/hooks/README.md`: what it is, peers, the create/edit example, server errors in short, `schemaParams`, and a link to Storybook. Update the root `README.md`: a packages table row, a "Using `@aureus-core/hooks` in a project" section, and the `pnpm dev` / `check:package` notes naming the three packages. Verify that the links resolve.
- [x] 9.5 Add an `@aureus-core/hooks` section to `CONTRIBUTING.md`: one folder per module, the internal structure, optional peers per module, how to add a module with its guide, stories and strings test, and the no-texts and development-warning rules. Verify by reading it against the actual folder tree.
- [x] 9.6 Add `.changeset/add-hooks-package.md` (`"@aureus-core/hooks": minor`), describing `createFormHook`, `useSchemaForm`, `applyServerErrors`, `values`, `schemaParams` and `serverErrors`. Verify with `pnpm changeset status`.

## 10. Final verification

- [x] 10.1 From the root, run `pnpm lint`, `pnpm typecheck`, `pnpm test`, `pnpm build` and `pnpm check:package`, and verify that all of them pass. Run `openspec validate add-hooks-package --strict`.
