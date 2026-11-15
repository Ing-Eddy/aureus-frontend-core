## Why

`CheckboxField` covers a single yes/no value. Many forms need several values from a short, always-visible list: permissions, notification channels, weekdays, interests. A multiple Select hides the choices behind a popup, and stacking separate `CheckboxField`s leaves the consumer to:

- assemble the `string[]` value;
- name the group;
- handle "select all" and limits;
- bind one form field.

When the checkbox family was planned, the group was deferred to its own iteration. It completes the family.

## What Changes

- **New `CheckboxGroupField`** (`@aureus-core/ui/components/checkbox-group-field`).
  - **Shared field behaviour:** label, required mark, info, helper text, error with an optional message, loading, disabled and `classNames`.
  - **Options:** `{ value, label, description?, disabled? }`. `label` is a `ReactNode`, and links in it navigate without toggling.
  - **Value:** a `string[]`, controlled or uncontrolled, always in the order of `options`. Values not present in `options` are kept, with a development warning.
  - **Opt-in extras.** Each is independent and none changes another's default:
    - `selectAll` (`{ label }`, with the label required by TypeScript), a parent box with a mixed state;
    - `maxSelected`, with an optional `maxSelectedMessage`;
    - `orientation="horizontal"`;
    - `columns` (2–4), collapsing to one column in narrow containers;
    - `appearance="card"`;
    - `checkboxPosition="end"`.
  - **Accessibility:**
    - the field is a group named by `label`, and each box is named by its option;
    - `required` shows the mark but does not set `aria-required` on every box;
    - a development warning is emitted when the group has no name.
  - **No new default texts.**
- **New `CheckboxGroupControl`** (`@aureus-core/ui/components/checkbox-group-control`): the group bound to the surrounding react-hook-form `FormProvider`, taking only `name` plus the field's props. The form holds a `string[]`, so `z.array(z.string()).min(1)` works directly, and `shouldFocusError` focuses the first enabled box.
- **Internal, backward-compatible:**
  - the checkbox row and box used by `CheckboxField` move from `components/checkbox-field/components` to `src/internal/components/checkbox-row`, to be shared;
  - the row gains an optional description line;
  - `FieldShell` gains optional root ARIA attributes and a slot at the end of the header.
  - `CheckboxField` and every other field render exactly as before.
- **Documentation:**
  - bilingual (EN/ES) Storybook pages and stories;
  - a section in the guide;
  - README;
  - JSDoc;
  - a `minor` changeset.

Non-goals:

- Nested or hierarchical checkbox trees, beyond the single "select all" parent.
- A minimum-selection rule in the component: minimums belong to the schema (`min(1)`).
- Keeping the value in click order: it always follows `options`.
- Changing the defaults of existing components.

## Capabilities

### New Capabilities

_None._

### Modified Capabilities

- `form-fields`: adds the checkbox group field and control requirements:
  - options and value;
  - naming and description;
  - select all;
  - selection limit;
  - layout and appearance;
  - field;
  - form-bound control.

## Impact

- **New public entry points:** `@aureus-core/ui/components/checkbox-group-field` and `@aureus-core/ui/components/checkbox-group-control`. These make 14 custom components.
- **Internal:**
  - `src/internal/components/checkbox-row`, which is new and moved from `checkbox-field`;
  - `src/internal/components/field-shell`, with two optional props;
  - `CheckboxField` imports the shared row, with no behaviour change.
- **No new runtime dependencies.**
- **Storybook:** new stories and docs under `apps/storybook/src/stories/components/forms/`, plus an update to the guide.
- **Release:** a `minor` changeset for `@aureus-core/ui`.
