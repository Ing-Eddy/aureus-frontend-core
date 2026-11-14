## Context

The current state relevant to the approach. For motivation, see proposal.md (Why). For requirements, see `specs/form-fields/spec.md`.

- **`TextField`** (`packages/ui/src/components/text-field/text-field.tsx`) assembles the whole single-line view itself:
  - `useFieldA11y` → `FieldShell` → `InputGroup` (with `fieldFrameClassName`) → `InputGroupInput` (forced `type="text"`);
  - an optional inline-end `InputGroupAddon` (with `fieldAddonClassName`) holding `FieldLoading` and `FieldAction`;
  - the action is disabled when `isDisabled || action.disabled`.
- **`TextControl`** is `ControlField` + `mapControllerToField` → `<TextField>`. A parity test compares their markup.
- **Shared pieces** live in `src/internal/`:
  - `FieldAction` (`InputGroupButton`, auto-size, optional tooltip);
  - `mergeRefs`;
  - the `fieldStrings` constants (`loading`, `moreInformation`).
- **`lucide-react`** is already a dependency (`EyeIcon` and `EyeOffIcon` are available).
- **Edge's native reveal button**: Microsoft Edge draws its own "reveal password" button inside `type="password"` inputs, through the `::-ms-reveal` pseudo-element. Without hiding it, there would be two eyes.
- **Playground**:
  - `coverage-tests.ts` already requires stories and docs for every `src/components/*` folder;
  - `field-action-args.tsx` provides the Action controls for configurable actions; it does not apply to password inputs.

## Goals / Non-Goals

**Goals:**
- One single-line view for text and password inputs, so both families look identical by construction.
- A toggle that behaves well with pointer, touch, keyboard, password managers and spell checkers.
- No change to `TextField`'s public API or markup. Its existing tests and parity test prove it.

**Non-Goals:**
- A public building block for custom inputs: `InputField` stays internal.
- Strength meters, caps-lock detection, or rule checklists.

## Decisions

### D1. Extract `InputField` into `internal/components/input-field/`
```
internal/components/input-field/
├─ index.ts
├─ input-field.tsx
└─ input-field-tests.tsx
```
- **Props:** `FieldBaseProps & Omit<ComponentProps<"input">, "type" | "size" | "disabled" | "required" | "className" | "children"> & { type: "text" | "password"; action?: FieldActionProps }`.
- **Body:** exactly today's `TextField` body. `type` is applied after the spread, so it cannot be overridden.
- **`TextField`** becomes `<InputField {...props} type="text" />`.
- **`PasswordField`** passes `type` from its visibility state and a fixed `action` (the toggle).
- `InputField` is exported from `internal/components/index.ts`.
- *Alternative:* `PasswordField` renders `TextField` with an `action`. Rejected: `TextField` deliberately has no `type` prop, and adding a hidden one would leak into its public types.

### D2. Generic `useControllableState` in `internal/hooks/`
```ts
function useControllableState<T>(options: { value?: T; defaultValue: T; onChange?: (value: T) => void }):
  [T, (next: T) => void]
```
- **Controlled** when `value !== undefined`. The setter then only calls `onChange`.
- **Uncontrolled:** the setter updates internal state and calls `onChange`.
- The setter is stable (`useCallback` plus a ref to the latest `onChange`).
- It is generic, so it goes in `internal/hooks/` for future fields with their own state.

### D3. `usePasswordVisibility` in `components/password-field/hooks/`
This logic is private to the password field, so it lives in the component's own `hooks/` subfolder.

**Inputs:** `{ visible, defaultVisible, onVisibleChange, inputRef }`.

**Returns:** `{ visible, toggle, keepCaretOnPointerDown }`.

- **Visibility state** comes from `useControllableState`.
- **Re-hide on submit:**
  - A `useEffect` attaches a native `submit` listener to `inputRef.current?.form`, and re-attaches it when the form changes.
  - On submit it sets `input.type = "password"` **synchronously**, then calls `setVisible(false)`. Password managers read the DOM during the submit event, before React re-renders, so the synchronous change is what makes this effective. React then reconciles to the same value.
  - If there is no `<form>`, there is no listener.
- **Caret preservation:**
  - `keepCaretOnPointerDown` (wired to the toggle's `onPointerDown`) calls `event.preventDefault()`, so the button never takes focus from the input. If the input is the active element, it also stores `selectionStart`/`selectionEnd`.
  - After the type change, a `useLayoutEffect` restores the selection when the input still has focus. Some browsers (Safari) reset the selection when `type` changes.
  - Keyboard activation does not fire `pointerdown`, so focus stays on the toggle, as the spec requires.

### D4. `PasswordField` composition
```tsx
const generatedId = useId();
const inputId = props.id ?? generatedId;          // needed for aria-controls
const inputRef = useRef<HTMLInputElement>(null);
const ref = useMemo(() => mergeRefs(inputRef, props.ref), [props.ref]);
const { visible, toggle, keepCaretOnPointerDown } = usePasswordVisibility(...);

<InputField
  {...rest}
  id={inputId}
  ref={ref}
  autoComplete={autoComplete ?? "current-password"}
  spellCheck={false} autoCorrect="off" autoCapitalize="off"   // after the spread: not overridable
  type={visible ? "text" : "password"}
  classNames={{ ...classNames, input: cn(passwordInputClassName, classNames?.input) }}
  action={{
    children: visible ? <EyeOffIcon /> : <EyeIcon />,
    "aria-label": visible ? hideLabel : showLabel,
    "aria-pressed": visible,
    "aria-controls": inputId,
    onPointerDown: keepCaretOnPointerDown,
    onClick: toggle,
    className: classNames?.action,
  }}
/>
```
- The toggle is a `FieldAction`. `InputField` therefore gives it the same size, position and the disabled-while-disabled-or-loading rule.
- `FieldAction` auto-sizes it to `icon-xs`. It has `aria-label`, so it triggers no warning.
- `passwordInputClassName` lives in `internal/utils/constants/field-styles.ts`. It hides the browser's own reveal and clear buttons: `[&::-ms-reveal]:hidden [&::-ms-clear]:hidden`.
- `fieldStrings` gains `showPassword: "Show password"` and `hidePassword: "Hide password"`.
- **Types:** `PasswordFieldProps = Omit<TextFieldProps, "action"> & { visible?; defaultVisible?; onVisibleChange?; showPasswordLabel?; hidePasswordLabel? }`.

### D5. `PasswordControl`
- Same shape as `TextControl`: `ControlField componentName="PasswordControl"` → `mapControllerToField<HTMLInputElement>` → `<PasswordField {...rest} {...mapped} disabled={mapped.disabled || disabled} />`.
- `visible`, `defaultVisible` and `onVisibleChange` pass through unchanged.
- **Types:** `PasswordControlProps = ControlBaseProps & Omit<PasswordFieldProps, "name" | "value" | "defaultValue" | "error" | "errorMessage" | "disabled">`.

### D6. Folder layout
```
components/password-field/
├─ index.ts
├─ password-field.tsx
├─ password-field-types.ts
├─ hooks/
│  ├─ index.ts
│  └─ use-password-visibility.ts
└─ tests/
   ├─ password-field-toggle-tests.tsx
   ├─ password-field-a11y-tests.tsx
   └─ password-field-states-tests.tsx

components/password-control/
├─ index.ts
├─ password-control.tsx
├─ password-control-types.ts
└─ tests/
   ├─ render-in-form.tsx
   ├─ password-control-form-tests.tsx
   ├─ password-control-parity-tests.tsx
   └─ password-control-types-tests.tsx
```
- The test harness `render-in-form.tsx` is copied per control. It is small, and `tests/` folders are not shared across components.

### D7. Stories and docs
- **Playground controls:**
  - the shared field controls;
  - `defaultVisible` and `autoComplete` (`current-password` / `new-password` / `off`);
  - `showPasswordLabel` and `hidePasswordLabel`;
  - `onVisibleChange` in Events.
  - The Action group from `field-action-args.tsx` is **not** used.
- **Control stories** use a `DemoForm` decorator like `text-control-stories.tsx`. The schema is `password` (min 8) plus `confirm`, with a `refine` on `path: ["confirm"]`.
- The `HidesOnSubmit` story shows the password, submits, and then asserts `type="password"` and that the payload printed the value.

## Risks / Trade-offs

- **[The synchronous `input.type` mutation bypasses React]** → The state update right after it sets the same value, so React's reconciliation is a no-op. Covered by a test that submits and checks the DOM inside the submit handler.
- **[`preventDefault` on `pointerdown` stops the toggle from taking focus]** → That is intended for pointer users, and keyboard users are unaffected. On touch, `pointerdown` with `preventDefault` still fires `click`, which is verified in the browser story test.
- **[Caret restore differs across browsers]** → jsdom cannot check the type-change reset. The unit test asserts the restore call, and the Chromium story asserts the caret position.
- **[Refactoring `TextField`]** → It could change markup. The existing TextField tests, the parity test and the stories run unchanged as the regression gate.
- **[Password manager overlays (1Password, Bitwarden)]** → They may inject their own icons near the inline-end edge. This is out of scope and noted in the docs.

## Migration Plan

Purely additive for consumers. The `TextField` refactor is internal and must leave its tests untouched. Release it in a `minor` changeset.
