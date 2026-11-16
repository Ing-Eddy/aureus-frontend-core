## Context

The proposal (Why) and the spec delta define the goals. Current state:

- **`src/internal/utils/constants/field-strings.ts` (`fieldStrings`)** provides the defaults of:
  - `FieldLoading` (`label = fieldStrings.loading`);
  - `FieldInfo` (`label = fieldStrings.moreInformation`);
  - `FieldStepper` (`increase`/`decrease`);
  - `PasswordField` (`showPassword`/`hidePassword`);
  - `TextAreaField` (`charactersRemaining`, `characters`);
  - `NumberField` (`invalidExpression`, `calculatedFrom`, `minus`).

  Every field inherits the first two.
- **`FieldBaseProps`** (`src/internal/types/field-base-types.ts`) is an interface with `label`, `required`, `loading`, `disabled`, `info`, `helperText`, `error`, `errorMessage`, `className`, `classNames`, `loadingLabel` and `infoLabel`. Its users:
  - `TextFieldProps`, `TextAreaFieldProps`, `NumberFieldProps` and `InputFieldProps` intersect it;
  - `Select`, `Checkbox`, `CheckboxGroup`, `RadioGroup`, `Otp` and `Switch` have **interfaces that extend** `Omit<FieldBaseProps, …>`;
  - `FieldShell` picks from it.
- **The text pattern from Select onwards:** discriminated unions per feature, `DistributiveOmit` (duplicated in `select-field/types` and `select-control`) to keep them in controls, overloads where a generic must be inferred (Checkbox, Switch), and development warnings through `isDev`.
- **Parity tests:** the `canonical` serializer and the id normalisation are copied in the 10 `*-control-parity-tests.tsx` files.
- **Story sets differ by family:** `Rtl` exists only in Switch and OTP, and Text, Password and Text area have no `Keyboard` story.

## Goals / Non-Goals

**Goals:**

- No user-facing text without a prop, enforced by types, development warnings and a guard test.
- One shared way to express "texts required when a feature is on".
- A documented audit, and fixes that make the families coherent.

**Non-Goals:**

- Translating anything.
- Shipping locale packs.
- Changing shadcn files.
- Visual redesigns: the audit fixes defects and inconsistencies only.

## Decisions

### D1. Shared text unions (`src/internal/types/field-text-types.ts`)

```ts
export type FieldLoadingTexts =
  | { loading?: false; loadingLabel?: never }
  | { loading: boolean; loadingLabel: string };
export type FieldInfoTexts =
  | { info?: undefined; infoLabel?: never }
  | { info: ReactNode; infoLabel: string };
export type FieldTexts = FieldLoadingTexts & FieldInfoTexts;
export type DistributiveOmit<T, K extends PropertyKey> = T extends unknown ? Omit<T, K> : never;
```

- **`loading: boolean` on the second branch:** a runtime boolean (`loading={isSaving}`) always requires the label, and `loading={false}` alone is still allowed.
- **`FieldBaseProps` loses** `loading`, `loadingLabel`, `info` and `infoLabel`. They move to `FieldTexts`.
- **Each field's public props become** `XBaseProps & FieldTexts & …feature unions`. Interfaces stay interfaces for the base part, and the public `XFieldProps` becomes a type alias.
- **`FieldShell` and `useFieldA11y`** read `loading` and `info` from the props as before. Their internal prop types are widened with a non-union `FieldStatusInternal` (all optional), because the unions only constrain the public API.
- **Switch** uses `FieldInfoTexts` and keeps a plain `loading?: boolean`, because its spinner is decorative (`aria-busy` announces the state) and it has no `loadingLabel`. This exception is recorded in its docs.

### D2. Feature texts per family

| Family | Union |
|---|---|
| Password | `showPasswordLabel` and `hidePasswordLabel`, always required (plain required props) |
| Text area | `{ showCount?: false; countLabel?: never } \| { showCount: true; countLabel: (count: number, maxLength?: number) => string }` |
| Number | `{ stepper: false; incrementLabel?: never; decrementLabel?: never } \| { stepper?: true; incrementLabel: string; decrementLabel: string }` |
| Number | `{ expressions?: false; … } \| { expressions: true; invalidExpressionLabel: string; calculatedFromLabel: (expression: string) => string }` |

- **Text area `countLabel`:** it replaces the old remaining-only signature. The consumer decides between "remaining" and "count" from the two arguments.
- **Number `minusLabel`:** removed. `aria-valuetext` uses the same `Intl` formatter as the display (`format-number.ts`) in its signed form, never parentheses.
- **Overloads:** Number already infers nothing generic, so no overloads are needed. Checkbox and Switch keep theirs and intersect `FieldTexts` into both overload signatures.

### D3. Internal pieces require their labels

- **`FieldLoading`:** `label: string`.
- **`FieldInfo`:** `label: string`.
- **`FieldStepper`:** `incrementLabel: string` and `decrementLabel: string`.

The defaults are removed and `field-strings.ts` is deleted. Each field passes the prop it received; when `loading` or `info` is on, TypeScript has already guaranteed it.

### D4. Development warnings (`src/internal/hooks/use-missing-texts.ts`)

`useMissingTexts(componentName, [[condition, "propName"], …])` emits `"<Component>: \`<feature>\` needs \`<prop>\`."` once per missing text when `isDev`. Every field calls it for `loading`/`loadingLabel` and `info`/`infoLabel`, plus its own features. Select's `use-missing-text-warnings` is migrated onto it, and the other families' name warnings stay as they are (they are not feature texts).

### D5. Guard test (`packages/ui/src/no-default-texts-tests.ts`)

A Vitest file reads every `.ts`/`.tsx` under `src/components` and `src/internal`, excluding `tests/`, `*-tests.*` and `src/internal/testing`. It fails on:

- any import or use of `fieldStrings`;
- JSX attributes `aria-label`, `aria-valuetext`, `title`, `placeholder` or `alt` with a string literal;
- parameter or destructuring defaults whose name ends in `Label`, `Message` or `Text`, with a string or template-literal value;
- JSX text children made of letters inside `src/components` (for example `>Loading<`).

An explicit allowlist covers decorative characters such as "•" and "*" and developer messages, which are outside JSX by construction.

### D6. Shared test helper (`src/internal/testing/parity.ts`)

It contains `canonical(node)` and `normalizedFieldMarkup(container)`. The 10 parity tests import it. It is excluded from the tsdown entries (like `tests/`) and from the guard test.

### D7. Audit method (`audit.md`)

- **Format:** a table per component with Area, Severity (high/medium/low), Finding, Location and Proposed fix. High severity means an accessibility defect, a default text or a broken behaviour; medium means an inconsistency visible to consumers; low means internal tidiness.
- **Inputs:**
  - greps for text patterns, `as unknown as` and `as never`;
  - the folder-rule check;
  - a story-set matrix per family (Playground, Responsive, Rtl, Keyboard, States, plus Parity, WithSchema and DisabledVsLoading for controls);
  - a check that the docs `api` keys match the exported prop names;
  - EN/ES section parity;
  - the axe results of the Chromium run.
- **Workflow:** high and medium findings become tasks. Behaviour changes not covered by this delta are added through an artifact update before they are fixed. Low findings are fixed when cheap, or recorded as deferred.
- **Publishing:** the audit is published as an artifact page for review.

### D8. Story and docs consistency

- **Minimum story set per field:** Playground, the family's features, Keyboard, States, Responsive and Rtl (each with a computed-layout assertion).
- **Minimum story set per control:** Playground, WithSchema, DisabledVsLoading and Parity.
- **Texts in stories:** every story passes the newly required texts in English. The docs explain that the texts are examples and that the developer supplies them in their language.

## Risks / Trade-offs

- **[Breaking API for early families]** → The package is unpublished (`0.0.0`). The changeset carries a migration table, and the type tests prove each requirement.
- **[Union growth makes error messages verbose]** → The shared names (`FieldTexts`, per-feature unions) and JSDoc on each branch keep editor hints readable. Type tests lock the behaviour.
- **[False positives in the guard test]** → The rules are pattern-based with a small explicit allowlist. Each allowlist entry needs a comment.
- **[Wide surface (20 components and docs)]** → The work is in phases with the full suite after each (D7), and the audit table tracks the status of every finding.

## Migration Plan

| Before | After |
|---|---|
| `loading` with no label | `loading loadingLabel="Cargando"` |
| `info` with no label | `info infoLabel="Más información"` |
| `PasswordField` | `PasswordField showPasswordLabel="Mostrar contraseña" hidePasswordLabel="Ocultar contraseña"` |
| `TextAreaField showCount` | `TextAreaField showCount countLabel={(count, max) => …}` |
| `NumberField` | `NumberField incrementLabel="Aumentar" decrementLabel="Disminuir"`, or `stepper={false}` |
| `NumberField expressions` | `NumberField expressions invalidExpressionLabel="…" calculatedFromLabel={(e) => …}` |
| `NumberField minusLabel` | `minusLabel` is removed |

The `minor` changeset states that it is breaking, which is allowed before 1.0.

## Audit Results

The audit (`audit.md`) found 26 issues: 8 high, 13 medium and 5 low.

- **Fixed:** all but three.
- **Deferred:** T9. The warnings inside a control keep the field's name.
- **Kept on purpose:** T12 (justified casts, now commented) and TX2.

Two findings changed the plan during implementation:

- **RG1 (high):** Radix's radio group forced `dir="ltr"`. `useInheritedDirection` now passes the page's direction, and the spec gains "Right-to-left layout across the family".
- **T6:** for the accessible-name warning to make sense, Select gained `aria-label` and `aria-labelledby`, like the other families.

Implementation notes:

- **Required internal labels:** `FieldLoading`, `FieldInfo` and `FieldStepper` take `label: string | undefined`, still required, so untyped code renders no name instead of a default.
- **Guard test (D5):** pattern-based, because TypeScript 7 has no JavaScript API. Its rules are tested against sample snippets.
- **Stories with union props:** they use `StoryArgs<P>` (`apps/storybook/.../forms/story-args.ts`), a flat args type.
- **Out of scope:** the guide's markdown tables need `remark-gfm` (G1).

