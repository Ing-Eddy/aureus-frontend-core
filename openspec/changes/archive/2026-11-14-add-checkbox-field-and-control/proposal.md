## Why

The form family covers text, password, multi-line, number and select inputs, but not the most common yes/no input: a checkbox. Without it, apps would use shadcn's bare `Checkbox`, which has no label, helper text, error, required mark, loading state or form binding. Each screen would then rebuild that layout, and the accessible names would come out inconsistent.

A checkbox pair on the shared field base gives booleans, and other two-state values, the same look and accessibility contract as the rest of the family.

## What Changes

- **New `CheckboxField`** (`@aureus-core/ui/components/checkbox-field`).
  - **Shared field behaviour:** label, required mark, info, helper text, error with an optional message, loading, disabled, `classNames` and an optional `action`.
  - **`checkboxLabel`:** the text beside the box, a `ReactNode`. Clicking it toggles the box, and it may contain links. It is separate from the field's `label`, which stays above, as in every other field.
  - **Value API** like the rest of the family: `value`, `defaultValue` and `onValueChange`. The value is a `boolean` by default.
  - **Opt-in extras.** Each one is independent and none changes another's default:
    - **custom values:** `checkedValue` and `uncheckedValue`, both or neither, for example `"S"`/`"N"` or `1`/`0`; the value type is inferred from them;
    - **`indeterminate`:** a visual mixed state;
    - **`checkboxPosition="end"`:** the box after the text;
    - **`appearance="card"`:** the whole row is a clickable, bordered card.
  - **Accessible name:**
    - with both `label` and `checkboxLabel`, the field's group is named by `label` and the box by `checkboxLabel`;
    - with only one of them, that text names the box;
    - with none, a development warning is emitted.
  - **No new default texts.**
- **New `CheckboxControl`** (`@aureus-core/ui/components/checkbox-control`): `CheckboxField` bound to the surrounding react-hook-form `FormProvider`. It takes only `name` plus the field's props. The form holds `boolean`, or the custom values.
- **Internal, backward-compatible:**
  - `FieldShell` and `FieldHeader` can render the field label without associating it with the control;
  - `FieldShell` can name the root group with the label.
  - Existing fields render exactly as before.
- **Documentation:**
  - bilingual (EN/ES) Storybook pages and stories;
  - a Checkbox section in the guide;
  - README;
  - JSDoc;
  - a `minor` changeset.

Non-goals:

- Checkbox groups (several boxes holding a `string[]`). They are planned as a separate `checkbox-group-field` and `checkbox-group-control` family.
- Switches or toggles.
- Using `indeterminate` as a third stored value: it is visual only.
- Changing the defaults of existing components.

## Capabilities

### New Capabilities

_None._

### Modified Capabilities

- `form-fields`: adds the checkbox field and control requirements:
  - value and custom values;
  - texts and accessible name;
  - indeterminate state;
  - position and card appearance;
  - field;
  - form-bound control.

## Impact

- **New public entry points:** `@aureus-core/ui/components/checkbox-field` and `@aureus-core/ui/components/checkbox-control`. These make 12 custom components.
- **Internal:** `src/internal/components/field-shell` gains two optional, backward-compatible props.
- **No new runtime dependencies.** It reuses shadcn's `Checkbox` (Radix), wrapped and not edited, and react-hook-form, which is already a peer dependency.
- **Storybook:** new stories and docs under `apps/storybook/src/stories/components/forms/`, plus an update to the guide.
- **Release:** a `minor` changeset for `@aureus-core/ui`.
