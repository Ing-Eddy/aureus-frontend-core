---
"@aureus-core/hooks": minor
---

New package `@aureus-core/hooks`: reusable React hooks for every Aureus project. It is ESM only, gives one entry point per module, and lists each module's libraries as optional peers (`react` 19 is required).

- **`@aureus-core/hooks/schema-form`** (needs `react-hook-form` 7, `zod` 4 and `@hookform/resolvers` 7):
  - **`createFormHook({ schema, defaultValues, ...options })`** creates the hook of one form, configured only by what it is given:
    - `schema` is a zod schema or a schema hook (memoized on i18next's `t`), with or without one parameter;
    - `defaultValues` holds the initial values;
    - every `useForm` option is accepted, with react-hook-form's defaults otherwise.
  - The created hook takes:
    - **`schemaParams`** for the schema hook: TypeScript requires it, accepts it or rejects it, following the hook's parameter;
    - **`values`**: existing data, deep-merged over `defaultValues` and kept in sync (a new object with equal content does not reset);
    - **`serverErrors`**.

    It returns react-hook-form's own `UseFormReturn`, with the schema's input type for values and its output type on submit.
  - **Server errors** are `{ path: string | string[] }`, with dot paths and `root`:
    - each field gets a `"server"` error whose message is joined with `joinMessages` (default: a space), and `types.server` keeps every message;
    - `parseServerErrors` adapts other backend shapes;
    - errors are set each time a new object arrives, and a fixed error does not come back.
  - **`applyServerErrors(form, errors, options?)`** sets backend errors from a callback.
  - **`useSchemaForm(schema, options)`** is the same engine without the factory.
  - **Messages follow the language:** when the schema changes identity, only the fields that show a schema error are validated again, and server errors are kept. A schema that changes on every render is detected: one development warning, no render loop.
