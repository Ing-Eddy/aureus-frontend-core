## Context

See proposal.md (Why) for the motivation, and the specs (`hooks-package`, `schema-form`, `component-playground`) for the requirements. Facts that shape the approach:

- **`packages/utils` is the template for a new package:**
  - exports: `"./internal/*": null` and `"./*"`;
  - `tsdown.config.ts`: unbundled ESM with d.ts, tests excluded, `define` keeps `process.env.NODE_ENV`;
  - `scripts/check-package.mjs`: modules discovered from `src/*/index.ts`; outputs, alias leak, publint, attw `esm-only`, tarball allowlist, `internal` blocked;
  - `internal/utils/constants/is-dev.ts` and `internal/utils/helpers/warn-once.ts`.

  `packages/ui` is the template for a React package: platform `browser`, Testing Library, jsdom, and `render-in-form.tsx` (`FormProvider` + `zodResolver` harness).
- **react-hook-form 7.92:**
  - `useForm` copies its props into `control._options` on every render, so a new `resolver` is used on the next validation without remounting.
  - With the `values` prop, `useForm` resets the form when `!deepEqual(props.values, previous)`, applying `resetOptions`.
  - `form.reset()` with no arguments returns to the default values.
  - `setError(name, { type, message, types })` accepts `types: Record<string, string | string[]>`.
- **`@hookform/resolvers` 7.0.6:** `zodResolver` has zod 4 overloads that return `Resolver<z4.input<T>, Context, z4.output<T>>`, so `useForm<In, unknown, Out>` is typed without casts.
- **The user's apps:**
  - every schema is a hook (`useLoginSchema`: `useTranslation` + `useMemo([t])`);
  - some schemas take arguments;
  - all five existing form hooks are `{ ...DEFAULTS, ...preset }`, and one also syncs edits;
  - backends return `{ field: string[] }`.
- **Playground:**
  - workspace packages resolve through their `exports` (`dist/`);
  - `useLocale()` from `@sb/i18n/use-locale` gives the toolbar locale;
  - MDX pages use `<En>`/`<Es>`;
  - `coverage-tests.ts` checks MDX balance for `guides`, `foundations` and `utils`;
  - tool strings are typed `en`/`es` objects, tested by `utils-strings-tests.ts`.

## Goals / Non-Goals

**Goals:**
- A call site as short as `createFormHook({ schema, defaultValues })` + `useXForm({ values, serverErrors })`, with nothing else to write per form.
- Exact types end to end: input type for values, output type for submit, and `schemaParams` enforced by arity.
- Every behavior covered by a test that runs under jsdom, plus type tests.

**Non-Goals:**
- A wrapper around the returned form object. It stays react-hook-form's `UseFormReturn`.
- Supporting zod 3 or other schema libraries.

## Decisions

### 1. Package layout: a sibling of utils, not part of ui
- `@aureus-core/hooks` mirrors `@aureus-core/utils`. A module is `src/<module>/index.ts`, and the wildcard export makes it public. `internal/*` maps to `null`.
- `react` is a required peer. `react-hook-form`, `zod` and `@hookform/resolvers` are listed in `peerDependencies` and marked `optional` in `peerDependenciesMeta`, because future modules will not need them.
- `platform: "browser"`, `sideEffects: false`, ESM only.
- The check script is copied from utils. It adds `react`, `react-hook-form`, `zod` and `@hookform/resolvers` to the externals that attw resolves.

Alternatives:
- `@aureus-core/ui/hooks/*`: that path is the shadcn CLI's hooks folder, and ui would gain zod peers.
- `@aureus-core/forms`: rejected by the user, who wants one package for every future hook.

### 2. Module layout
```
src/schema-form/
├─ index.ts              public barrel: createFormHook, useSchemaForm, applyServerErrors, types
├─ schema-form.ts        useSchemaForm (the engine)
├─ factory/              create-form-hook.ts
├─ hooks/                use-merged-values.ts, use-server-errors.ts, use-schema-revalidation.ts
├─ types/                schema-form-types.ts
├─ utils/helpers/        merge-values.ts, normalize-server-errors.ts, apply-server-errors.ts
└─ tests/
```
- This follows the repo's folder rule: the root holds `index.ts` and the main file, and everything else sits in category folders with their own `index.ts`.
- `factory/` is its own category, like `display/formatters/` in utils.
- `src/internal/utils/{constants,helpers}` is copied from utils (`isDev`, `warnOnce`, `resetWarnings`).

### 3. The engine: `useSchemaForm`
```ts
const resolver = useMemo(() => zodResolver(schema, resolverOptions), [schema, resolverOptions]);
const merged = useMergedValues(defaultValues, values);          // undefined when `values` is undefined
const form = useForm<In, unknown, Out>({ ...rhfOptions, resolver, defaultValues, values: merged });
useServerErrors(form, serverErrors, { joinMessages, parseServerErrors });
useSchemaRevalidation(form, schema);
return form;
```
- RHF options are spread untouched, so its defaults apply (spec: neutral defaults). `resolver`, `context`, `defaultValues` and `values` are removed from the public option type.
- `resolverOptions` is expected to be stable (constant). An inline object only re-creates the resolver, and that is cheap and loop-free.
- The return value is RHF's own object, so `form.reset()` and `form.setError()` replace the old `resetForm` and `setFieldError`.

### 4. `defaultValues` + `values` instead of a defaults factory
- `merge-values.ts`: deep merge of plain objects (prototype `Object.prototype` or `null`); everything else replaces; `undefined` is skipped; inputs are never mutated.
- `useMergedValues` gives the merged object to RHF's `values`. RHF's own `deepEqual` decides when to reset (spec: same content does not reset).
- The merge is memoized on the identities of `defaultValues` and `values`, so a parent that re-renders with a new object costs one merge and one `deepEqual`.
- `values: undefined` gives `undefined`, so RHF uses `defaultValues` and never resets.

Alternatives:
- `defaultValues: (params) => values` (the original): every form repeated the same merge, and it threw on optional parameters. The user found it too complex.
- A `syncDefaultValues` flag: it is not needed, because existing data always wants to sync. `resetOptions.keepDirtyValues` covers the "don't overwrite edits" case.

### 5. `schemaParams` typing by arity
```ts
type SchemaSource<S> = S | (() => S) | ((params: any) => S);
type FormHookArgs<Src, Opts> =
  Src extends (...args: infer A) => any
    ? A extends [] ? [options?: Opts]                                       // hook without params
    : A extends [infer P] ? [options: Opts & { schemaParams: P }]           // required param
    : A extends [(infer P)?] ? [options?: Opts & { schemaParams?: P }]      // optional param
    : never
    : [options?: Opts];                                                     // static schema
```
- `Opts` excludes `schemaParams` with `?: never` where it is forbidden.
- `createFormHook<Src extends SchemaSource<FormSchema>, …>(config)` infers `Src` from `schema`, and the schema type `S` is `Src extends (...a) => infer R ? R : Src`.
- At runtime: `typeof schema === "function" ? schema(options?.schemaParams) : schema`. Zod schemas are objects, never functions, so the check is exact. The call is unconditional on every render, so the rules of hooks hold.

Alternative: positional `useX(params, options)` (the original). It makes `undefined` placeholders necessary, and the user chose a single options object.

### 6. Server errors
- `normalize-server-errors.ts` is pure. Its input is `Record<string, string | readonly string[] | null | undefined>`, and its output is a list of `{ name, messages }`, with empty strings removed and empty entries dropped.
- `applyServerErrors(form, raw, { joinMessages = (m) => m.join(" "), parse })`:
  1. `const errors = parse ? parse(raw) : raw`;
  2. for each entry, `form.setError(name, { type: "server", message: joinMessages(messages), types: { server: messages } })`;
  3. it warns once per name that is neither `root…` nor a path present in `form.formState.defaultValues`, resolved by walking the dot path.
- `useServerErrors` calls `applyServerErrors` in a `useEffect` keyed on the `serverErrors` identity. It applies when the identity changes, not when the content changes: a new response with equal content must re-apply (spec: lifecycle), and RHF clears a server error when the field revalidates.
- Types:
  - `ServerErrors<In> = Partial<Record<FieldPath<In> | "root" | \`root.${string}\`, string | readonly string[]>>`;
  - with `parseServerErrors: (body: B) => ServerErrors<In>`, the option type of `serverErrors` becomes `B`, inferred through a generic `B` on `createFormHook`, default `ServerErrors<In>`.

Alternative: compare content to avoid re-applying. That would break a re-submit that returns the same errors.

### 7. Re-validation when the schema changes, with a loop guard
- `useSchemaRevalidation(form, schema)` keeps the previous schema in a ref. In an effect, when the identity changed (skipping the first render), it collects the names of errors whose `type !== "server"` and calls `form.trigger(names)`.
- No i18n import: language changes are seen as schema identity changes, because the user's schema hooks memoize on `t`.
- **Guard.** A `revalidating` ref is set before `trigger` and cleared after the next commit in which the schema identity was stable. If the schema changes again while `revalidating` is set (meaning our own re-render produced a new schema), the hook skips that trigger and calls `warnOnce` with:

  `[useSchemaForm] The schema changed while re-validating. Memoize the schema (useMemo) and pass primitive or memoized schemaParams.`

  This bounds the renders: at most one extra validation per real change.
- Server errors are kept because only non-server error names are triggered.

### 8. Tests
- Vitest with jsdom and Testing Library (`renderHook`, plus a harness like ui's `render-in-form.tsx`, with plain inputs registered through `Controller`, so the package does not depend on ui).
- Type tests use `@ts-expect-error` in `tests/schema-form-types-tests.ts` and run under `tsc --noEmit`.
- The `useLoginSchema` question (does `z.email().min(1)` show "invalid" on empty input, and does a trailing `.trim()` validate untrimmed input?) is answered by a test in zod 4.6. The guide's "schema hooks" section states the result, with the `string().trim().min(1).pipe(z.email())` form as the recommendation if confirmed.

### 9. Documentation and playground
- `apps/storybook/src/stories/hooks/schema-form.mdx`: `<Meta of={SchemaFormStories} name="Guide" />`, `<En>`/`<Es>`, with the sections listed in tasks.
- `hooks/schema-form/schema-form-stories.tsx` (title `hooks/Schema form`): `Basic`, `CreateAndEdit`, `ServerErrors`, `Multilanguage`, `SchemaParams`, `Transforms`.
  - The stories use `TextControl` / `PasswordControl` / `SwitchControl` from `@aureus-core/ui` inside `TooltipProvider`.
  - `Multilanguage` builds its schema hook on `useLocale()`, so the toolbar plays the role of i18next.
  - Strings are in `schema-form-strings.ts`, typed `en`/`es`, and tested in `hooks-strings-tests.ts`.
- `storySort`: `"hooks", ["Schema form", ["Guide", "*"]]` after `utils`.
- `coverage-tests.ts`: `mdxDirs` adds `"hooks"`.

## Risks / Trade-offs

- [The `values` sync overwrites the user's edits when a query refetches with new data] → The guide documents `resetOptions: { keepDirtyValues: true }`, and a test covers it.
- [`serverErrors` passed as a new literal on every render re-applies on every render, so it "sticks"] → The guide asks for a stable object (the mutation's error), the JSDoc says so, and `applyServerErrors` is offered for callbacks. Comparing content is rejected (decision 6).
- [The loop guard misjudges a legitimate quick double change (a language and a parameter in the same tick)] → It only skips a trigger while our own re-validation is pending. The next real change re-validates. The cost is at most one stale message until the next interaction.
- [The tuple types for arity are complex and can give unreadable errors] → The public `FormHook` type is named and documented, and the type tests pin each case.
- [Optional peers allow installing without `zod`, and importing `schema-form` then fails at runtime] → The README and the guide list the peers, and the import fails at resolution time with a clear module-not-found error.

## Migration Plan

This is a new package; nothing in the monorepo changes behavior. Before the first release the owner creates `@aureus-core/hooks` on npm and registers `release.yml` as trusted publisher. Migrating the `aureus_systems` forms follows the guide's before/after table and is out of scope.
