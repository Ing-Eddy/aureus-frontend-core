## Why

Settings that take effect immediately (notifications, compact mode, public profile) read best as a switch, not a checkbox. A checkbox suggests that something is confirmed later with a button, while a switch suggests the change applies now.

The family has checkbox, checkbox group and radio group pairs, but no switch. Without one, apps would use shadcn's bare `Switch`: no label, helper, error, required mark, loading state or form binding, and no pattern for saving a setting on the server before showing it as changed.

## What Changes

- **New `SwitchField`** (`@aureus-core/ui/components/switch-field`).
  - **Shared field behaviour:** label, required mark, info, helper text, error with an optional message, disabled, `classNames` and an optional `action`.
  - **`switchLabel`:** the text beside the switch, a clickable `ReactNode`. Links inside it navigate without toggling.
  - **Value:** `value`, `defaultValue` and `onValueChange`, a `boolean` by default. With `checkedValue` and `uncheckedValue` (both or neither, enforced by TypeScript) it stores custom values, and their type is inferred.
  - **`loading`:** shows a spinner **inside the thumb**, locks the switch and sets `aria-busy`.
  - **Opt-in extras.** Each is independent:
    - `switchPosition="end"`;
    - `appearance="card"`;
    - `size="sm"`;
    - `stateLabels` (`{ on, off }`, both required): a decorative text for the current state;
    - `thumbIcons` (`{ on, off }`, both required): a decorative icon inside the thumb;
    - `onBeforeChange(next)`, which returns `boolean` or `Promise<boolean>`: while it is pending, the switch is locked with a spinner in the thumb, and the change is reported only if it is confirmed.
  - **Accessibility:**
    - `role="switch"` with `aria-checked`, and exactly one accessible name (the same rules as the checkbox);
    - Space and Enter toggle;
    - the thumb moves the correct way in RTL;
    - a development warning is emitted when there is no name.
  - **No new default texts.**
- **New `SwitchControl`** (`@aureus-core/ui/components/switch-control`): the field bound to the surrounding react-hook-form `FormProvider`, taking only `name` plus the field's props. The form holds the boolean or the custom values, and with `onBeforeChange` it receives only confirmed values.
- **Internal, behaviour-neutral:**
  - the value hook and the both-or-neither value types move from `checkbox-field` to `src/internal`, and the checkbox's public type names stay as aliases;
  - `ChoiceRow` accepts `slot="switch"`;
  - a `SwitchBox` (the switch with a customisable thumb) is added to the shared choice components.
- **Documentation:**
  - bilingual (EN/ES) Storybook pages and stories;
  - a section in the guide;
  - README;
  - JSDoc;
  - a `minor` changeset.

Non-goals:

- Switch groups.
- Optimistic updates that show the new state before `onBeforeChange` confirms it.
- An indeterminate switch.
- Changing the defaults of existing components.

## Capabilities

### New Capabilities

_None._

### Modified Capabilities

- `form-fields`: adds the switch field and control requirements:
  - value and custom values;
  - texts and accessible name;
  - appearance;
  - asynchronous change;
  - field;
  - form-bound control.

## Impact

- **New public entry points:** `@aureus-core/ui/components/switch-field` and `@aureus-core/ui/components/switch-control`. These make 18 custom components.
- **Internal:**
  - `src/internal/hooks/use-toggle-value.ts` and `src/internal/types/toggle-value-types.ts`, moved and renamed from `checkbox-field`;
  - `src/internal/components/choice-row`, which gains the `switch` slot and `SwitchBox`;
  - `CheckboxField` updated to import them, with no change to its markup.
- **No new runtime dependencies.** The switch uses Radix's switch primitive from `radix-ui`, which shadcn's `Switch` already uses.
- **Storybook:** new stories and docs under `apps/storybook/src/stories/components/forms/`, plus an update to the guide.
- **Release:** a `minor` changeset for `@aureus-core/ui`.
