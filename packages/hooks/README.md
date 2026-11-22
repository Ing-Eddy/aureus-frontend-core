# @aureus-core/hooks

Reusable React hooks shared by every Aureus project. ESM only, one entry point per module, no root import.

**Documentation:** <https://ing-eddy.github.io/aureus-frontend-core/> (section **hooks**), in English and Spanish, with live examples.

## Install

```sh
pnpm add @aureus-core/hooks
```

`react` 19 is a required peer. Each module lists the libraries it needs as optional peers, so you only install what you use.

| Module        | Import path                      | Needs                                                 | What it does                                                        |
| ------------- | -------------------------------- | ----------------------------------------------------- | ------------------------------------------------------------------- |
| `schema-form` | `@aureus-core/hooks/schema-form` | `react-hook-form` 7, `zod` 4, `@hookform/resolvers` 7 | Creates react-hook-form form hooks from zod schemas or schema hooks |

```sh
pnpm add @aureus-core/hooks react-hook-form zod @hookform/resolvers
```

## `schema-form`

Create the hook of a form once, with its schema, its initial values and its own options:

```ts
import { createFormHook } from "@aureus-core/hooks/schema-form";

export const useCompanyForm = createFormHook({
  schema: useCompanySchema, // a zod schema, or a schema hook (useTranslation + useMemo)
  defaultValues: { name: "", city: "", taxId: "" },
  mode: "onBlur", // any useForm option; react-hook-form's defaults otherwise
});
```

Use it to create or edit:

```tsx
const form = useCompanyForm({ schemaParams: { isEdit: false } }); // create: empty form
const form = useCompanyForm({ schemaParams: { isEdit: true }, values: company }); // edit: merged over the defaults, kept in sync

return <FormProvider {...form}>{/* *-control components from @aureus-core/ui */}</FormProvider>;
```

- **`values`** is existing data, deep-merged over `defaultValues`. When it arrives later or its content changes, the form is reset to it.
- **`schemaParams`** is passed to a schema hook that takes a parameter. TypeScript requires it, accepts it or rejects it, following that parameter.
- **`serverErrors`** takes backend errors as they come: `{ email: ["Already registered", "Domain not allowed"], root: "…" }`. Messages are joined with `joinMessages` (default: a space), and the full array is kept in `error.types.server`. Use `parseServerErrors` for other shapes, or `applyServerErrors(form, errors)` in a callback.
- **Messages follow the language.** When the schema hook returns a new schema (its `t` changed), the fields that show a schema error are validated again. Server errors are kept.
- It returns react-hook-form's own `UseFormReturn` (input values, output data on submit).

`useSchemaForm(schema, { defaultValues })` is the same engine without the factory, for one-off forms.

## Development warnings

Misuse (an unmemoized schema, a server error for an unknown field) logs a `console.warn` once, outside production. The check reads `process.env.NODE_ENV`, which your bundler replaces at build time.
