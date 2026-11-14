## Why

The form family covers single-line text and passwords, but not multi-line text: comments, descriptions, bios, messages. A multi-line field has one design problem the others do not have: its height changes while the user types or drags it. A button placed beside the text would float at an arbitrary height, cover text, or collide with the resize handle. The text area pair solves that once, with the same look and behaviour as the rest of the family.

## What Changes

- **New `TextAreaField`** (`@aureus-core/ui/components/text-area-field`). It has the same shared field behaviour as `TextField`: label, required mark, info tooltip, helper text, error with an optional message, loading, disabled, `classNames` and a configurable `action`. On top of that it adds:
  - **Live height:**
    - it grows with its content between `minRows` (default 3) and `maxRows` (default 10), then scrolls;
    - the user can also drag it taller or shorter, and the chosen height becomes the new minimum;
    - `resize={false}` removes the drag handle.
  - **Footer bar:**
    - the action, the loading spinner and the character counter live in a bar along the bottom edge, inside the frame;
    - it always stays attached to that edge, whatever the height, so the button never covers text or meets the resize handle;
    - the bar only appears when it has something to show.
  - **Character counter (`showCount`):**
    - it shows "120/500" with `maxLength`, or the count alone without it, and turns destructive at the limit;
    - screen readers get the remaining characters in the field's description, plus a polite announcement once the user pauses typing;
    - the announcement text can be overridden.
  - **Action shortcut (`actionShortcut`):** Ctrl+Enter or Cmd+Enter presses the action, and Enter alone still inserts a new line.
- **New `TextAreaControl`** (`@aureus-core/ui/components/text-area-control`). It is `TextAreaField` bound to the surrounding react-hook-form `FormProvider`, following the same contract as `TextControl` (only `name` plus visual props; the schema message is shown as helper text). With the same props it renders the same markup as the field.
- **Internal additions:**
  - a reusable `FieldCounter` component;
  - footer and text-area styles;
  - counter strings;
  - a `footer` slot in `FieldClassNames`.
- **Documentation:**
  - bilingual (EN/ES) Storybook pages and stories for both components;
  - a Text area section in the "Fields & controls" guide;
  - README and CONTRIBUTING updates;
  - JSDoc.
- **Release:** a `minor` changeset.

Non-goals:
- No rich text, markdown preview or mentions.
- No horizontal resizing.
- No counter on `TextField` yet; `FieldCounter` is built to allow it later.

## Capabilities

### New Capabilities

_None._

### Modified Capabilities

- `form-fields`:
  - the integrated action of a multi-line field goes in a footer bar instead of beside the text;
  - adds text area sizing, the footer bar, the character counter, the action keyboard shortcut, `TextAreaField` and `TextAreaControl`.

## Impact

- **Code:**
  - new `packages/ui/src/components/text-area-field/**` and `text-area-control/**`;
  - new `packages/ui/src/internal/components/field-counter/**`;
  - additions to `internal/utils/constants/field-strings.ts` and `field-styles.ts`, and to `internal/types/field-base-types.ts` (the `footer` slot).
- **Playground:**
  - new `apps/storybook/src/stories/components/forms/text-area-{field,control}/`, which reuse `field-action-args.tsx`;
  - `guides/fields-and-controls.mdx` is updated.
- **Dependencies:** none.
- **Consumers:** purely additive.
