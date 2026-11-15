## Why

The form family can pick one value from a popup (Select) and several values from a visible list (Checkbox group). It cannot yet pick **exactly one** value from a visible list, which is the most common choice in forms: a plan, a shipping method, a frequency, a yes/no/maybe answer.

Radios behave differently from checkboxes:

- only one option is active at a time;
- the group is a single tab stop;
- the arrow keys move the selection.

A dedicated pair on the shared field base gives that choice the family's look and an accessible, WAI-ARIA-conformant behaviour.

## What Changes

- **New `RadioGroupField`** (`@aureus-core/ui/components/radio-group-field`).
  - **Shared field behaviour:** label, required mark, info, helper text, error with an optional message, loading, disabled and `classNames`.
  - **Options:** `{ value, label, description?, disabled? }`, the same shape as the checkbox group's options.
  - **Value:** `string | null` (`null` until something is chosen), controlled or uncontrolled. Only one option is checked at a time.
  - **Keyboard:** the WAI-ARIA radio group pattern. The group is one tab stop, the arrow keys move and select, skipping disabled options, and Space selects.
  - **Opt-in extras.** Each is independent:
    - `orientation="horizontal"`;
    - `columns` (2–4, collapsing in narrow containers);
    - `appearance="card"`;
    - `appearance="segmented"` (joined buttons, for short choices);
    - `radioPosition="end"`;
    - `otherOption` (`{ label, inputLabel, placeholder? }`, whose texts are required by TypeScript): a free-text input appears, and the value becomes the typed text;
    - `deselectable`: activating the checked radio returns to `null`. It is opt-in and documented as a deviation from the standard pattern.
  - **Accessibility:**
    - the `radiogroup` is named by `label`, described by helper and info, and carries `aria-required` and `aria-invalid`;
    - each radio is named by its option;
    - a development warning is emitted when the group has no name.
  - **No new default texts.**
- **New `RadioGroupControl`** (`@aureus-core/ui/components/radio-group-control`): the field bound to the surrounding react-hook-form `FormProvider`, taking only `name` plus the field's props. The form holds `string | null`, and a failed submit focuses the checked radio, or the first enabled one.
- **Internal, behaviour-neutral:**
  - the shared `checkbox-row` becomes `choice-row`, used by Checkbox, Checkbox group and Radio group;
  - it takes a slot prefix, so the existing `checkbox-*` `data-slot` names are kept;
  - the option type and the column and orientation layout move to the shared internals;
  - `CheckboxGroupOption` stays exported as the same type.
- **Documentation:**
  - bilingual (EN/ES) Storybook pages and stories;
  - a section in the guide;
  - README;
  - JSDoc;
  - a `minor` changeset.

Non-goals:

- Radio buttons outside a group (a single radio).
- Numeric or object values: option values are strings.
- Arbitrary content in segmented segments: they show the label only, without descriptions.
- Changing the defaults of existing components.

## Capabilities

### New Capabilities

_None._

### Modified Capabilities

- `form-fields`: adds the radio group requirements:
  - options and value;
  - naming, description and keyboard;
  - layout and appearance;
  - other option;
  - deselection;
  - field;
  - form-bound control.

## Impact

- **New public entry points:** `@aureus-core/ui/components/radio-group-field` and `@aureus-core/ui/components/radio-group-control`. These make 16 custom components.
- **Internal:**
  - `src/internal/components/checkbox-row` is renamed to `choice-row`;
  - a shared `ChoiceOption` type and layout classes are added;
  - `CheckboxField` and `CheckboxGroupField` are updated to import them, with no change to their markup.
- **No new runtime dependencies.** It uses shadcn's `RadioGroup` (Radix), wrapped and not edited, and Radix's radio primitive (already a dependency through `radix-ui`) for the segmented items.
- **Storybook:** new stories and docs under `apps/storybook/src/stories/components/forms/`, plus an update to the guide.
- **Release:** a `minor` changeset for `@aureus-core/ui`.
