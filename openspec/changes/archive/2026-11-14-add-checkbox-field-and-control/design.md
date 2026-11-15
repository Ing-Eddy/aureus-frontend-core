## Context

The proposal (see proposal.md, Why) and `specs/form-fields/spec.md` define the requirements. Current state:

- **Shared field base.** Every field renders through `FieldShell` (`src/internal/components/field-shell`), which lays out:
  - `FieldHeader`: a label with `htmlFor={inputId}` and `id={inputId}-label`, the required mark and the info button;
  - the control;
  - `FieldHelper`.
- **The shell root** is shadcn's `Field`, which already renders `role="group"`.
- **Shared helpers:**
  - `useFieldA11y` returns `inputId`, `helperId`, `infoId`, `labelId` and the ARIA props;
  - value-based controls use `mapControllerToValueField(ctx, props, emptyValue)`.
- **shadcn's `Checkbox`** (`src/shadcn/ui/checkbox.tsx`) wraps Radix `Checkbox.Root`:
  - it is a `button role="checkbox"`;
  - `checked` accepts `boolean | "indeterminate"`;
  - its indicator always renders a `CheckIcon`;
  - it does not accept children;
  - its classes already cover the checked state, `aria-invalid`, `disabled` and an enlarged hit area (`after:-inset-x-3 -inset-y-2`).
  - It is CLI-owned and must not be edited.
- **Radix in native forms:** inside a `<form>`, Radix renders a hidden native checkbox carrying `name` and `value` (default `"on"`), so native submission works.
- **Lesson from Select:** shadcn's `tailwind.css` redefines some `data-*` variants strictly (for example `data-selected` only matches `="true"`). Styling must use arbitrary attribute variants and be verified with computed styles in Chromium stories.

## Goals / Non-Goals

**Goals:**

- One box per field, with two independent texts (`label` and `checkboxLabel`) and exactly one accessible name.
- Every extra (custom values, indeterminate, position, card) is a separate prop, with a neutral default and no interaction with the others.
- The field and the control produce the same markup.
- No edits to `src/shadcn`. Changes to `src/internal` are backward-compatible.

**Non-Goals:**

- Checkbox groups, which will be a later family.
- A tri-state stored value.
- A switch look.

## Decisions

### D1. Wrap shadcn's `Checkbox`; style indeterminate through classes

`components/checkbox-box.tsx` renders shadcn's `Checkbox` with:

- `checked={indeterminate ? "indeterminate" : checked}`;
- extra classes for the mixed state, all on `data-[state=indeterminate]`:
  - `border-primary bg-primary text-primary-foreground`;
  - the check icon hidden (`[&_svg]:hidden`);
  - a dash drawn with a `before:` pseudo-element, 8×2 px, `bg-current`, centred.

Radix sets `aria-checked="mixed"` itself.

- **Why:** this keeps the shadcn look, focus ring, invalid and hit-area styles without forking.
- **Alternative rejected:** forking the Radix primitive into our own component. That duplicates the shadcn styles and drifts on `shadcn` updates.
- The `Indeterminate` story asserts the computed background and the visible dash, because of the strict-variant lesson.

### D2. Value mapping (`hooks/use-checkbox-value.ts`)

- **State:** `useControllableState<V>` holds the raw value. `checked = Object.is(value, checkedValue)`.
- **On change**, Radix reports `boolean`, which is mapped to `checkedValue` or `uncheckedValue`. From indeterminate, Radix reports `true`, so the checked value is emitted, and `indeterminate` itself is never touched.
- **Defaults:** `checkedValue = true`, `uncheckedValue = false`; the default value is `uncheckedValue`.
- **Unknown value:** a controlled value equal to neither value renders unchecked, and `isDev` emits a warning once per value.
- **Native forms:** Radix gets `value={String(checkedValue)}` only when `checkedValue` is not `true`, so the boolean case keeps the browser's `on`.

### D3. Types: values are both-or-neither (`checkbox-field-types.ts`)

```ts
type CheckboxValueProps<V> =
  | { checkedValue?: undefined; uncheckedValue?: undefined; value?: boolean; defaultValue?: boolean; onValueChange?: (v: boolean) => void }
  | { checkedValue: V; uncheckedValue: V; value?: V; defaultValue?: V; onValueChange?: (v: V) => void };
```

- **Generics:** `CheckboxField<V extends string | number | boolean = boolean>` infers `V` from the literals. The constraint keeps literal types, so `"S" | "N"` is inferred and not widened to `string`.
- **`CheckboxControl`** is generic the same way, by inference only: developers never write `<CheckboxControl<…>>`.
- **Type tests** cover:
  - one value alone is an error;
  - the inferred `onValueChange` parameter;
  - `value={true}` with string custom values is an error.
- The file is small enough to stay at the folder root.

### D4. Naming: who labels the box

`useFieldA11y` already provides `labelId`. `FieldShell` and `FieldHeader` gain two optional props, both with a default that keeps today's behaviour:

- **`labelFor`** (default `true`): when `false`, the header label renders without `htmlFor`;
- **`labelledByRoot`** (default `false`): when `true`, the root `Field` gets `aria-labelledby={labelId}`.

| Texts | Header label | Root | Box name from |
|---|---|---|---|
| `label` + `checkboxLabel` | not associated | `aria-labelledby` = label | `<label htmlFor>` around `checkboxLabel` |
| only `label` | `htmlFor` = box (today's behaviour) | — | the header label |
| only `checkboxLabel` | no header | — | `<label htmlFor>` around `checkboxLabel` |

- **Required mark:** without a header label, the mark follows `checkboxLabel`. `RequiredMark` is exported from `internal/components/field-shell` for that.
- **Why not two `htmlFor` labels:** a box with two `htmlFor` labels gets their concatenated name, for example "Notificaciones Recibir resumen". The group pattern keeps one name per element.
- **Clicking the text:** `checkboxLabel` is a real `<label htmlFor>`, so clicking it toggles natively. Clicking a link inside it does not activate the label (HTML label activation skips interactive descendants).

### D5. Row layout (`components/checkbox-row.tsx`)

- **Row:** a flex row: box, text, then at the inline end the spinner (`loading`) and `FieldAction` (`action`).
  - `checkboxPosition="end"` swaps the box after the text with `flex-row-reverse`-free ordering (`order-last`), so RTL mirrors through logical properties.
  - The text column is `min-w-0 flex-1` and wraps long text.
  - The box keeps `mt-0.5` to align with the first line.
- **Helper:**
  - In plain/start layout, the helper is indented to the text column (`ps-6`, box 16 px plus a gap of 8 px) through an internal helper class merged before `classNames.helper`.
  - In `end` and `card`, it is not indented.
- **Card:** `appearance="card"` makes the row the field's frame (like the input frame of other fields):
  - classes: `rounded-lg border p-3`, `has-[[data-state=checked]]:border-primary has-[[data-state=checked]]:bg-primary/5`, and the destructive border when `error`;
  - the helper stays below the card, as in every field.
- **Card clicks:**
  - a `pointer` click on the card that does not land inside an interactive element (`a, button, input, label, [role=checkbox]`) calls `boxRef.current.click()`, so the whole card toggles without nesting labels;
  - keyboard users still use the box itself.
- **Hit area:** shadcn's `after:` inset already gives the box about 40×32 px, and the text is clickable. That meets WCAG 2.5.8.

### D6. States

- `locked = disabled || loading`, which sets Radix `disabled`. `loading` also shows `FieldLoading` at the end of the row, sets `aria-busy` (from `useFieldA11y`) and dims the row like other fields.
- `error` adds `aria-invalid` on the box, which shadcn's classes style.

### D7. Development warnings (`hooks/use-checkbox-warnings.ts`)

- **No accessible name:** none of `label`, `checkboxLabel`, `aria-label` or `aria-labelledby` is set. The message is "CheckboxField: the checkbox has no accessible name…".
- **Unknown value:** see D2.

The warnings are emitted once per mount or value and only when `isDev`. The control passes `componentName="CheckboxControl"`.

### D8. `CheckboxControl`

`ControlField` with `mapControllerToValueField<HTMLButtonElement, V>(ctx, { onValueChange, onBlur, ref }, uncheckedValue ?? false)`, rendering `CheckboxField`.

- **Focus on error:** react-hook-form's ref reaches the Radix button, so `shouldFocusError` focuses it.
- **Parity:** a parity test compares the closed markup with the same serializer as the other families, which normalises React ids.

### D9. Folder layout

```
checkbox-field/
├─ index.ts  checkbox-field.tsx  checkbox-field-types.ts
├─ components/  index.ts  checkbox-box.tsx  checkbox-row.tsx
├─ hooks/       index.ts  use-checkbox-value.ts  use-checkbox-warnings.ts
└─ tests/       helpers.tsx, value, a11y, extras, states, types tests
checkbox-control/
├─ index.ts  checkbox-control.tsx  checkbox-control-types.ts
└─ tests/       render-in-form.tsx, form, parity, types tests
```

## Risks / Trade-offs

- **[Strict shadcn `data-*` variants]** → Use arbitrary `data-[state=…]` variants, and assert computed styles in Chromium stories (checked fill, dash, card highlight).
- **[Literal inference of `V`]** → The `extends string | number | boolean` constraint keeps literals. A type test locks `"S" | "N"`. If inference widens, fall back to `const` type parameters (TS 5).
- **[Card click forwarding is a pointer-only enhancement]** → Keyboard and assistive technology use the box and its label as usual. The test checks that a click on a link or the action inside the card does not toggle.
- **[Indeterminate is visual only]** → The consumer must clear it. The docs and the "select all" story show the pattern.
- **[`labelFor`/`labelledByRoot` touch the shared shell]** → Both default to today's behaviour. The existing parity and unit tests of every family must stay green.

## Migration Plan

Purely additive. Release in a `minor` changeset.

## Implementation Notes

Findings while implementing, kept here so that the archived design matches the code.

- **D4, as built: the text is not a `<label>`.** In Chromium, clicking a link inside a `<label htmlFor>` still toggled the box. The `checkboxLabel` is therefore a `<span data-slot="checkbox-label">` that names the box through `aria-labelledby`. The row has one pointer handler that forwards clicks on the text, or anywhere on a card, to the box, and skips interactive elements (links, buttons, inputs). The behaviour in the spec is unchanged: the text names the box, clicking it toggles the box, and links navigate without toggling. This also makes the rule testable in jsdom. A consumer's `aria-labelledby` is appended to the text id.
- **D5: one click handler** handles both text and card clicks, so a click on the text inside a card toggles only once.
- **D3, as built: overloads instead of a generic union.** With a single generic union, an unannotated `onValueChange={(value) => …}` was typed as implicit `any`. `CheckboxField` and `CheckboxControl` are overloaded:
  - the boolean props;
  - the custom-value props, with a `const V` type parameter.

  `CheckboxFieldProps<V>` and `CheckboxControlProps<V>` remain as union types for consumers. The type tests lock in the inference of `"S" | "N"`.
- **D7:** the warnings always say `CheckboxField`. The control renders the field, as Select does, and passes no component name.
- **Parity:** Radix renders its native checkbox only inside a `<form>`. The parity test therefore renders the field inside a plain form, like the control.
- **Stories:** demo links prevent navigation. A real hash navigation inside the Vitest browser iframe closed the test connection.
