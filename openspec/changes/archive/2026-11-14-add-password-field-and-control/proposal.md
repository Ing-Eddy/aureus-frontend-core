## Why

The form family has a text pair (`TextField` / `TextControl`) but nothing for passwords. Today a consumer would have to hand-build a password input with its own show/hide button, and every app would get it slightly differently. A password pair with a fixed, accessible visibility toggle, built on the same shared base, keeps passwords consistent with the rest of the form family.

## What Changes

- **New `PasswordField`** (`@aureus-core/ui/components/password-field`). It has the same shared field behaviour as `TextField`: label, required mark, info tooltip, helper text, error with an optional message, loading, disabled and `classNames`. Its integrated button is **not configurable**: it is always a show/hide toggle (eye / eye-off icon).
  - The toggle has no tooltip. It exposes `aria-label` ("Show password" / "Hide password", overridable), `aria-pressed` and `aria-controls`.
  - Visibility is uncontrolled by default, starting hidden. It can be controlled with `visible`, `defaultVisible` and `onVisibleChange`.
  - Clicking or tapping the toggle keeps focus and the cursor position in the input.
  - Submitting the surrounding form hides the password again.
  - The input never autocorrects: spell-check, auto-correct and auto-capitalize are off.
  - `autoComplete` defaults to `current-password`.
  - It accepts neither `action` nor `type`.
- **New `PasswordControl`** (`@aureus-core/ui/components/password-control`). It is `PasswordField` bound to the surrounding react-hook-form `FormProvider`, following the same rules as `TextControl`:
  - it takes only `name` plus visual and visibility props;
  - the schema's validation message is shown as the helper text;
  - it renders the same markup as `PasswordField` with the same props.
- **Internal refactor**: the single-line input view that `TextField` builds today (field shell, input frame, input, spinner and action) moves into a private internal component. `TextField` and `PasswordField` both render it. `TextField`'s public API and markup do not change.
- **New private hook**: a generic controlled/uncontrolled state hook in the internal layer.
- **Documentation**:
  - bilingual (EN/ES) Storybook pages and stories for both components;
  - the "Fields & controls" guide gains a Password section;
  - updates to README, CONTRIBUTING and JSDoc.
- **Release**: a `minor` changeset.

Non-goals:
- No password strength meter, no rules checklist, no caps-lock warning.
- No validation built into the component: password rules and the match against a confirmation field live in the form's schema.
- No configurable or additional buttons on password inputs.

## Capabilities

### New Capabilities

_None._

### Modified Capabilities

- `form-fields`:
  - adds the password visibility toggle, `PasswordField` and `PasswordControl`;
  - restricts the "Integrated action button" requirement to fields that do not define a fixed button of their own, so a password field never accepts a configurable `action`.

## Impact

- **Code**:
  - new `packages/ui/src/components/password-field/**` and `password-control/**`;
  - new `packages/ui/src/internal/components/input-field/**` and `internal/hooks/use-controllable-state.ts`;
  - `packages/ui/src/components/text-field/text-field.tsx` is refactored onto `InputField`;
  - new strings in `internal/utils/constants/field-strings.ts`.
- **Playground**:
  - new `apps/storybook/src/stories/components/forms/password-{field,control}/`;
  - `guides/fields-and-controls.mdx` is updated.
- **Dependencies**: none new. The eye icons come from `lucide-react`, which the package already uses.
- **Consumers**: purely additive. Existing `TextField` / `TextControl` users see no change.
