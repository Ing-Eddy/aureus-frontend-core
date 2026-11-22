# schema-form Specification

## Purpose
Lets an app create a react-hook-form form hook from a zod schema (or a schema hook) in a few lines, configured per form: typed values, create and edit modes, backend errors and messages that follow the app's language.

## Requirements

### Requirement: Form hook from a schema
The module SHALL export `createFormHook(config)`. `config` holds `schema`, `defaultValues` and the form's options. The function MUST return a React hook (for example `useLoginForm`). That hook returns react-hook-form's form object for the schema, which can be spread into `FormProvider`. `schema` MUST accept:
- a zod 4 schema whose input is an object;
- a hook with no parameters returning such a schema;
- a hook with one parameter returning such a schema.

`defaultValues` MUST be a plain object of the schema's input type. Each form hook MUST use only its own `config`: there is no shared or global configuration.

#### Scenario: Static schema
- **WHEN** `useProfileForm = createFormHook({ schema: profileSchema, defaultValues: { name: "" } })` is called inside a component as `useProfileForm()`
- **THEN** it returns a form whose values are `{ name: "" }` and whose validation uses `profileSchema`

#### Scenario: Schema hook
- **WHEN** `schema` is `useLoginSchema`, a hook that calls other hooks (such as `useTranslation`) and returns a memoized schema
- **THEN** `useLoginForm()` calls it as a hook on every render and validates with the schema it returns

#### Scenario: Two forms with different options
- **WHEN** one form hook is created with `mode: "onBlur"` and another without `mode`
- **THEN** the first validates on blur and the second keeps react-hook-form's default, and neither affects the other

#### Scenario: Result is react-hook-form's form
- **WHEN** a component renders `<FormProvider {...form}>` with the object returned by a form hook, and `*-control` components inside it
- **THEN** the controls read and write the form's values and show its validation messages

### Requirement: Schema hook parameters
The form hook SHALL accept an options object with `schemaParams`, which is passed to a schema hook that takes a parameter. TypeScript MUST enforce the schema hook's parameter:
- a static schema, or a hook without parameters → `schemaParams` is rejected;
- an optional parameter → `schemaParams` is optional;
- a required parameter → the options object and `schemaParams` are required, with the parameter's type.

No call MUST throw at runtime because `schemaParams` is missing.

#### Scenario: Required parameter
- **WHEN** `schema` is `({ isEdit }: { isEdit: boolean }) => …` and a component calls `useCompanyForm()` without `schemaParams`
- **THEN** TypeScript reports an error

#### Scenario: Passing the parameter
- **WHEN** a component calls `useCompanyForm({ schemaParams: { isEdit: true } })`
- **THEN** the schema hook receives `{ isEdit: true }` and the form validates with the schema built for it

#### Scenario: Schema without parameters
- **WHEN** `schema` is `useLoginSchema` (no parameters) and a component calls `useLoginForm({ schemaParams: {} })`
- **THEN** TypeScript reports an error, and `useLoginForm()` compiles and runs

### Requirement: Neutral defaults and full option pass-through
A form hook and `useSchemaForm` SHALL use react-hook-form's own defaults for every `useForm` option. They MUST accept every `useForm` option except `resolver`, `context`, `defaultValues` and `values` (the module manages these). They MUST pass the accepted options to react-hook-form unchanged. Options given when the hook is called MUST override the form's `config` for that call only. Every option MUST be independent: no option changes the default of another.

#### Scenario: Default validation timing
- **WHEN** a form hook is created without `mode` and the user leaves an invalid field without submitting
- **THEN** no error is shown until the form is submitted, as in react-hook-form

#### Scenario: Options are passed through
- **WHEN** a form hook is created with `mode: "onBlur"`, `shouldUnregister: true` and `criteriaMode: "all"`
- **THEN** the form behaves as `useForm` does with those three options

#### Scenario: Resolver cannot be replaced
- **WHEN** a form hook is created with a `resolver` option
- **THEN** TypeScript reports an error

### Requirement: Direct use without a factory
The module SHALL export `useSchemaForm(schema, options)`, with the same behavior as a form hook, for one-off forms. `options` MUST include `defaultValues`, and MAY include `values`, `serverErrors` and every other form option.

#### Scenario: One-off form
- **WHEN** a component calls `useSchemaForm(schema, { defaultValues: { username: "" } })`
- **THEN** it returns a form validated by `schema` with those default values

### Requirement: Input and output types
The form's values SHALL be typed with the schema's input type, and the data passed to the submit handler MUST be the schema's output type. Schemas that transform, coerce or default values MUST work. `defaultValues` MUST be checked against the input type.

#### Scenario: Transform on submit
- **WHEN** the schema has `age: z.string().transform(Number)`, the user types `"42"` and submits
- **THEN** the submit handler receives `age: 42` (a number), and TypeScript types it as `number`

#### Scenario: Default values use the input type
- **WHEN** `defaultValues` gives `age` a number for that schema
- **THEN** TypeScript reports an error, because the input type of `age` is `string`

### Requirement: Default values and existing values
`defaultValues` SHALL be the form's initial values (usually empty). The form hook MUST accept `values`, a partial object of the input type with existing data (for example the record being edited). `values` MUST be merged over `defaultValues` as follows:
- plain objects are merged recursively;
- arrays, dates and primitives replace the default;
- a key set to `undefined` keeps the default, and `null` is kept.

When `values` is given later, or its content changes, the form MUST be reset to the new merged values. A new object with the same content MUST NOT reset the form. react-hook-form's `resetOptions` (such as `keepDirtyValues`) MUST apply to these resets. `defaultValues` MUST NOT be mutated.

#### Scenario: Create mode
- **WHEN** a component calls `useCompanyForm()` without `values`
- **THEN** the form starts with `defaultValues`

#### Scenario: Edit mode with partial values
- **WHEN** `defaultValues` is `{ name: "", address: { city: "", street: "" } }` and the hook is called with `values: { name: "Acme", address: { city: "Lima" } }`
- **THEN** the form starts with `{ name: "Acme", address: { city: "Lima", street: "" } }`

#### Scenario: Values arrive later
- **WHEN** the hook is first called with `values: undefined` and, after a query resolves, with `values: company`
- **THEN** the form is reset to `company` merged over `defaultValues`

#### Scenario: Same content does not reset
- **WHEN** the component re-renders and passes a new object with the same content as `values`
- **THEN** the form is not reset and the user's edits are kept

#### Scenario: Keeping the user's edits
- **WHEN** the form is created with `resetOptions: { keepDirtyValues: true }`, the user edits `name`, and `values` changes
- **THEN** `name` keeps the user's edit and the other fields take the new values

### Requirement: Server errors
The form hook and `useSchemaForm` SHALL accept `serverErrors`, an object whose keys are field paths and whose values are a message or an array of messages. Keys MUST support:
- dot paths for nested fields and array items (`"address.street"`, `"items.0.name"`);
- `"root"` and `"root.<name>"` for errors that belong to no field.

For each key with at least one non-empty message, the field MUST get an error of type `"server"`:
- its message is the non-empty messages joined by the form's `joinMessages` function (default: joined with a single space);
- the full list of messages is available as `types.server`.

Empty messages MUST be ignored. A key with no non-empty message MUST NOT create an error. A key that is not in `defaultValues` (other than `root`) MUST still be set and MUST log a development warning.

#### Scenario: Array of messages for one field
- **WHEN** `serverErrors` is `{ email: ["Already registered", "Domain not allowed"] }` and the form was created with `joinMessages: (m) => m.join(". ")`
- **THEN** the `email` control shows "Already registered. Domain not allowed", and `errors.email.types.server` is the array of both messages

#### Scenario: Single message and root error
- **WHEN** `serverErrors` is `{ password: "Too short", root: "Invalid credentials" }`
- **THEN** `password` has the error "Too short", and `formState.errors.root` has "Invalid credentials"

#### Scenario: Empty messages
- **WHEN** `serverErrors` is `{ email: ["", ""], name: [] }`
- **THEN** neither field gets an error

### Requirement: Server error adapter
A form SHALL accept `parseServerErrors`, a function that turns any backend error body into the server-error object described above. The function can be given in the form's `config` or in the call options. When it is set, `serverErrors` MUST accept the adapter's input type, and TypeScript MUST check it.

#### Scenario: Backend with another shape
- **WHEN** the form is created with `parseServerErrors: (body: { errors: Record<string, string[]> }) => body.errors` and the hook receives `serverErrors: { errors: { email: ["Taken"] } }`
- **THEN** `email` has the error "Taken"

#### Scenario: Wrong body type
- **WHEN** that form receives `serverErrors: { email: ["Taken"] }`
- **THEN** TypeScript reports an error

### Requirement: Server error lifecycle
Server errors given through `serverErrors` SHALL be set each time a new `serverErrors` object is received, even if its messages are the same as the previous one. They MUST NOT be set again while the same object is passed on later renders. `undefined` MUST leave the current errors unchanged. A server error MUST disappear when react-hook-form validates its field again and the field is valid, as with any other error.

#### Scenario: Error does not stick after the fix
- **WHEN** the hook receives a `serverErrors` object for `email`, the user corrects `email` so that it passes validation, and the component re-renders with the same object
- **THEN** `email` has no error

#### Scenario: Same messages in a new response
- **WHEN** the user submits again and the backend returns a new object with the same messages for `email`
- **THEN** `email` shows the error again

### Requirement: Imperative server errors
The module SHALL export `applyServerErrors(form, errors, options?)`. It sets the same errors, with the same rules, as `serverErrors` on a form returned by a form hook or by `useSchemaForm`. `options` MUST accept `joinMessages` and an adapter `parse`.

#### Scenario: Errors in a mutation callback
- **WHEN** `applyServerErrors(form, { email: ["Taken"] })` is called in a request's error callback
- **THEN** `email` has the error "Taken" with type `"server"`

### Requirement: Messages follow schema changes
When the schema returned for a form changes identity between renders (for example after the language changes, or `schemaParams` changes), the form SHALL validate again every field that currently has an error whose type is not `"server"`. It MUST NOT validate fields without errors, and it MUST NOT remove server errors. The module MUST NOT depend on any i18n library.

#### Scenario: Language change
- **WHEN** a schema hook memoizes its schema on i18next's `t`, the submitted form shows "Required" on `email`, and the app language changes to Spanish
- **THEN** `email` shows "Obligatorio" without the user doing anything

#### Scenario: Server errors survive
- **WHEN** `email` has a server error, `password` has a schema error, and the language changes
- **THEN** `password` shows the translated message and `email` keeps its server error

#### Scenario: Schema parameters change the rules
- **WHEN** `schemaParams.isEdit` changes from `false` to `true` while `taxId` shows an error that the edit schema no longer requires
- **THEN** the `taxId` error disappears

### Requirement: Unstable schema guard
If the schema changes identity on renders caused by the form's own re-validation (because it is not memoized, or because `schemaParams` is a new object on every render), the form SHALL stop re-validating for that change. It MUST NOT enter a render loop, and it MUST log one development warning that names the likely cause.

#### Scenario: Schema not memoized
- **WHEN** a schema hook returns a new schema on every render and the form has a schema error
- **THEN** the component renders a bounded number of times and one warning starting with `[useSchemaForm]` is logged
