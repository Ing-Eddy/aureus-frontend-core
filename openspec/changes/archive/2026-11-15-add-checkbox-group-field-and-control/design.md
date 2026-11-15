## Context

The proposal (see proposal.md, Why) and `specs/form-fields/spec.md` define the requirements. Current state:

- **`CheckboxField`** renders through `FieldShell` (`labelFor`, `labelledByRoot`) and two private pieces in `components/checkbox-field/components/`:
  - `CheckboxBox`: shadcn's Checkbox plus the mixed state, drawn with arbitrary `data-[state=indeterminate]` classes;
  - `CheckboxRow`: box, text, end slot, and plain/card and start/end layouts.

  The row's text is a `<span>` that names the box through `aria-labelledby`. One row-level pointer handler forwards clicks on the text, or on a card, to the box, skipping interactive descendants. This keeps links inside labels from toggling, which a `<label>` does not guarantee in Chromium.
- **`FieldShell`:**
  - the root is shadcn's `Field` (`role="group"`);
  - its `rootProps` only accept `data-*`;
  - `FieldHeader` renders the label, the required mark and the info button, and has no other slot.
- **Shared hooks and helpers:**
  - `useSelectValue` (`components/select-field/hooks`) already implements "select all with disabled options and a limit";
  - `mapControllerToValueField` maps react-hook-form to value-based fields.
- **Radix Checkbox** renders a hidden native checkbox, carrying `name` and `value`, only inside a `<form>`.

## Goals / Non-Goals

**Goals:**

- Share one row and box implementation between `CheckboxField` and the group, with no visible change to `CheckboxField`.
- Keep a deterministic value order and independent opt-in extras.
- Give one accessible name per element: the group by `label`, each box by its option.

**Non-Goals:**

- Roving tabindex or arrow-key navigation. A group of checkboxes is a set of separate tab stops, as in the WAI-ARIA checkbox pattern.
- Virtualisation.
- Nested trees.

## Decisions

### D1. Move the row and box to `src/internal/components/checkbox-row`

- **Move:** `checkbox-box.tsx`, `checkbox-row.tsx` and `styles.ts` (renamed to `checkbox-styles.ts`) move to `src/internal/components/checkbox-row/`, exported from `internal/components`. `CheckboxField` imports them from there, and the empty `components/` folder is removed.
- **Description line:** `CheckboxRow` gains an optional `description` and `descriptionId`, rendered as a second, muted line under the text. The text and the description are wrapped in one column, and the box stays aligned with the first line.
- **Why:** private shared code belongs in `internal`, following the folder rule. Importing another component's private folder would couple the two components.
- **Check:** the `CheckboxField`/`CheckboxControl` suites, including parity, run unchanged after the move.

### D2. Value (`hooks/use-checkbox-group-value.ts`)

- **State:** `useControllableState<string[]>({ value, defaultValue: defaultValue ?? [], onChange })`.
- **Canonical order:** `normalize(ids)` returns the known ids in `options` order, followed by the unknown ids in their original order.
- **API:**
  - `toggle(id, checked)`;
  - `isChecked(id)`;
  - `atLimit = maxSelected !== undefined && selected.length >= maxSelected`;
  - `isLocked(option) = option.disabled || (atLimit && !isChecked(option.value))`.
- **Select all:**
  - `enabled` = the values of options that are not disabled;
  - `selectAllState` is `all` when every enabled option is checked, `none` when none is, and `some` otherwise;
  - `toggleAll()`: from `all`, or when `atLimit`, it unchecks every enabled option and keeps the checked disabled ones. Otherwise it adds the enabled options in order until `maxSelected`.

  This mirrors `useSelectValue.toggleAll`, plus the "limit reached → clear" rule, so the parent box never gets stuck in the mixed state.
- **Unknown values:** a development warning once per unknown id, like Select.

### D3. Layout (`components/checkbox-group-options.tsx`)

- **Container:** `<div data-slot="checkbox-group-options" data-orientation=… data-columns=…>`, which also receives the group `ref`.
  - **vertical:** `flex flex-col gap-3`;
  - **horizontal:** `flex flex-row flex-wrap gap-x-6 gap-y-3`;
  - **columns:** `grid gap-3 @container`, with `grid-cols-1` that switches to `@md:grid-cols-2`, `@lg:grid-cols-3` or `@2xl:grid-cols-4` by container width, so the grid collapses inside narrow layouts and not only on narrow screens.
  - `columns` takes precedence over `orientation` for placing the options. Both stay independent props, and the docs say so.
- **Select all:** rendered before the container in a vertical stack, as a `CheckboxRow` with `CheckboxBox indeterminate={state === "some"}`. In vertical, non-card layouts the options are indented (`ps-6`) under it.
- **Cards:** in card appearance, `gap-2` and each `CheckboxRow` is a card. The row's forwarder makes the card clickable.
- **Limit message:** `maxSelectedMessage` is rendered after the options, in a `role="status"` `aria-live="polite"` element only while `atLimit`. It is linked to no box.

### D4. Ids and names

- **Ids:** `useFieldA11y` gives `inputId`, which is used as the group's base id. For option *i*:
  - `optionId = ${inputId}-${i}`, the box id;
  - `${optionId}-text`;
  - `${optionId}-description`.

  The select-all box is `${inputId}-all`.
- **Each box:** `aria-labelledby` points at its text id. `aria-describedby` points at its description id, plus the consumer's `aria-describedby` for the group, which is not repeated on every box. `aria-invalid` is set when `error`. No `aria-required` is set on the boxes.
- **Group root** (`FieldShell`):
  - `labelFor={false}` and `labelledByRoot`;
  - the new `rootAria` prop carries `aria-describedby` (helper and info ids from `useFieldA11y`), `aria-busy`, `aria-label` and `aria-labelledby` when there is no `label`.
- **Native forms:** every box gets `name` and `value={option.value}`, so Radix submits `name=value` per checked box.
- **Warnings** (`hooks/use-checkbox-group-warnings.ts`): no group name, and unknown values (from D2).

### D5. `FieldShell` additions (backward-compatible)

- **`rootAria?: { "aria-describedby"?; "aria-busy"?; "aria-label"?; "aria-labelledby"? }`**, spread on the root `Field`. When `labelledByRoot` is set, it takes precedence for `aria-labelledby`.
- **`headerEnd?: ReactNode`**, rendered in `FieldHeader` before the info button, so the header also renders when only `headerEnd` is present. The group puts `FieldLoading` there while `loading`.
- **Defaults:** both default to nothing, so every existing field's markup is unchanged. The existing parity tests of every family guard this.

### D6. Types

- **`CheckboxGroupOption`:** `{ value: string; label: ReactNode; description?: ReactNode; disabled?: boolean }`.
- **`CheckboxGroupFieldProps`:** the family props plus:
  - `options`, `value`, `defaultValue`, `onValueChange(value: string[])`;
  - `selectAll?: { label: ReactNode }`, whose object type makes `label` required;
  - `maxSelected?: number` and `maxSelectedMessage?: ReactNode`;
  - `orientation`, `columns?: 2 | 3 | 4`, `appearance` and `checkboxPosition`;
  - `name`, `id`, `ref?: Ref<HTMLDivElement>` and `onBlur`;
  - `aria-label`, `aria-labelledby` and `aria-describedby`;
  - `classNames` (`options`, `option`, `checkbox`, `optionLabel` and `selectAll`, on top of the family's).
- **No generics and no overloads:** the value is always `string[]`.
- **`CheckboxGroupControlProps`:** `ControlBaseProps & Omit<…, "name" | "value" | "defaultValue" | "error" | "errorMessage" | "disabled">`.

### D7. Blur and focus

- **`onBlur`:** fires from the options container's `onBlur` when `event.relatedTarget` is outside the container (focus left the group).
- **`CheckboxGroupControl`:** maps with `mapControllerToValueField<HTMLDivElement, string[]>(ctx, …, [])`. react-hook-form's `field.ref` is then given an object whose `focus()` focuses the first enabled box (`[role=checkbox]:not(:disabled)`) in the container, and the consumer's `ref` still receives the container. react-hook-form accepts any object with `focus()`, so `shouldFocusError` lands on a real box.

### D8. Folder layout

```
internal/components/checkbox-row/   index.ts  checkbox-row.tsx  checkbox-box.tsx  checkbox-styles.ts
components/checkbox-group-field/
├─ index.ts  checkbox-group-field.tsx
├─ types/       index.ts  checkbox-group-option-types.ts  checkbox-group-field-types.ts
├─ components/  index.ts  checkbox-group-options.tsx
├─ hooks/       index.ts  use-checkbox-group-value.ts  use-checkbox-group-warnings.ts  (+ tests)
└─ tests/       helpers.tsx  value / a11y / extras / layout / states / types tests
components/checkbox-group-control/
├─ index.ts  checkbox-group-control.tsx  checkbox-group-control-types.ts
└─ tests/       render-in-form.tsx  form / parity / types tests
```

## Risks / Trade-offs

- **[Moving shared code]** → The move is behaviour-neutral, and the `CheckboxField` and `CheckboxControl` tests, stories and parity must pass unchanged before the group work starts.
- **[Container queries in the Tailwind setup]** → Tailwind v4 has `@container` built in. A Chromium story asserts a single column in a narrow container and several in a wide one, through the computed `grid-template-columns`.
- **[Strict shadcn `data-*` variants]** → Only arbitrary variants are used, and the stories assert computed styles for checked, mixed and card states.
- **[Many tab stops in long groups]** → This is the expected WAI-ARIA behaviour for checkbox groups. The docs recommend a multiple Select Field for long lists.
- **[An object ref for react-hook-form]** → It is covered by a form test that asserts focus lands on the first enabled box after a failed submit.

## Migration Plan

Purely additive for consumers. Release in a `minor` changeset.

## Implementation Notes

Findings while implementing, kept here so that the archived design matches the code.

- **D3/D7, as built: one wrapper.** The `ref` and `onBlur` live on an outer `data-slot="checkbox-group"` wrapper, which holds the select-all row, the options container and the limit region. This wrapper is also the `@container` for the column queries. The options container keeps `data-orientation`/`data-columns` and `classNames.options`. Focus therefore counts as leaving the group only when it leaves the select-all box too, and the control's `focus()` finds the first enabled box, which is select all when present.
- **Columns, as built:** `grid-cols-1` with `@sm:grid-cols-2`, then `@lg:grid-cols-3` and `@2xl:grid-cols-4`. The grid steps down one column at a time as the container narrows. The `Columns` story asserts 3 tracks in a 34rem container and 1 track in a 14rem one.
- **The limit region** stays mounted with `empty:sr-only`, not `empty:hidden`. A live region removed from the accessibility tree is not announced reliably when its text appears, and `sr-only` adds no flex gap.
- **D4 addition: `aria-disabled` on the group.** It is set when the group is `disabled` or `loading`. `aria-disabled` is valid on `group`, conveys the state, and lets axe treat the dimmed, unassociated group label as part of an inactive component.
- **Contrast of disabled options:**
  - descriptions are not dimmed further when their box is locked, because they often explain why;
  - a disabled card changes its surface (`bg-muted/50`, `cursor-not-allowed`) instead of its opacity.
- **shadcn's `group-has-disabled/field:opacity-50`** dims every checkbox inside a field that holds any disabled element. In a group, one disabled option dimmed all the boxes. `CheckboxBox` now adds `group-has-disabled/field:not-disabled:opacity-100`, so only disabled boxes dim. This also fixes `CheckboxField` next to a disabled action. The `Cards` story asserts the opacity of enabled and disabled boxes.
- **`FieldShell.rootAria`** also accepts `aria-disabled`.
