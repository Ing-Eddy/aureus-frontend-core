## Context

The proposal (see proposal.md, Why) and `specs/form-fields/spec.md` define the requirements. Current state:

- **`CheckboxField`** (`components/checkbox-field`) holds the pieces the switch needs too:
  - the both-or-neither value types (`checkbox-field-types.ts`: `CheckboxValue`, `CheckboxBooleanValueProps`, `CheckboxCustomValueProps<V>`);
  - the value hook (`hooks/use-checkbox-value.ts`, with an unknown-value warning);
  - the name warning;
  - the overloads that type callbacks without annotations;
  - the D4 naming table (`label` names the group and the text names the control, through `FieldShell`'s `labelFor`/`labelledByRoot`).
- **`src/internal/components/choice-row`:**
  - `ChoiceRow` (slots `checkbox` | `radio`): the text names the control by `aria-labelledby`, and pointer clicks on the text or on a card are forwarded to the control, skipping interactive elements inside the row;
  - its card styles target `[data-slot$=box-slot]>[data-state=checked]`, so any Radix control with `data-state` works;
  - `CheckboxBox`, `choiceStyles` and the layout helpers.
- **shadcn's `Switch`** (`src/shadcn/ui/switch.tsx`) wraps Radix `Switch.Root` and `Switch.Thumb`:
  - it has two sizes (`data-size`) and an enlarged hit area (`after:-inset-x-3 -inset-y-2`);
  - the thumb moves with `translate-x-[calc(100%-2px)]` when checked, which is wrong in RTL;
  - its thumb takes **no children**, so a spinner or icon cannot go inside it.

  Radix's switch is a `button role="switch"`: Space and Enter toggle it natively, and inside a `<form>` it renders a hidden native checkbox with `name` and `value`.

## Goals / Non-Goals

**Goals:**

- Reuse the checkbox value, naming and row logic by moving it to `src/internal`, without changing checkbox markup.
- A thumb that can show a spinner or icons, with shadcn's look and correct RTL behaviour.
- A small, well-defined asynchronous change flow.

**Non-Goals:**

- Optimistic UI.
- Retry logic.
- Showing error text from `onBeforeChange`. The consumer shows any message through `error`/`errorMessage` or a toast.

## Decisions

### D1. Move the value logic to `src/internal`

- **`internal/types/toggle-value-types.ts`:** `ToggleValue`, `ToggleBooleanValueProps` and `ToggleCustomValueProps<V>`. The checkbox types become aliases of them (`CheckboxValue = ToggleValue`, and so on), so their public names stay the same.
- **`internal/hooks/use-toggle-value.ts`:** the current `useCheckboxValue`, renamed, with its tests moved alongside.
- **Checkbox:** `CheckboxField` imports both, and its tests and parity must pass unchanged.
- **Why:** the switch must not import another component's private hook. Shared, private code belongs in `internal`.

### D2. `SwitchBox` on the Radix primitive (`choice-row/switch-box.tsx`)

- **Why not shadcn's `Switch`:** it renders its own thumb with no children, so it cannot show the spinner or icons. `SwitchBox` therefore renders Radix's `Switch.Root` and `Switch.Thumb` from `radix-ui`, as the segmented radio does for the same reason.
- **Classes:** it reuses shadcn's class strings for the track and thumb, copied into `choice-styles.ts` as `switchTrack` and `switchThumb` with a comment pointing at the source, plus:
  - **RTL:** `rtl:data-[state=checked]:-translate-x-[calc(100%-2px)]` on the thumb;
  - **reduced motion:** `motion-reduce:transition-none`;
  - **thumb content:** `flex items-center justify-center` with a centered child slot, which holds the `Spinner` (`size-3` / `size-2.5` for `sm`) while busy, otherwise `thumbIcons[state]` (`aria-hidden`).
- **Variants:** only arbitrary `data-[state=…]` and `data-[size=…]` variants.
- **Drift guard:** a Chromium story compares the computed track and thumb sizes and colours of `SwitchBox` with shadcn's `Switch` in both states and sizes. A shadcn update that changes them then fails visibly.
- **Group dimming:** shadcn's switch has no `group-has-disabled/field` class today. The story also asserts the opacity of an enabled switch next to a disabled action.

### D3. Row and state label

- **`ChoiceRow`** gains `slot="switch"`. Its data-slots become `switch-row`, `switch-label`, `switch-box-slot` and so on.
- **`stateLabels`:** `SwitchBox` renders `<span aria-hidden data-slot="switch-state-label">` after the switch inside the box slot, with the text of the current state. Its width is reserved for the longer of the two labels (both rendered in a grid stack, with the inactive one invisible), so the row does not jump when the state changes.
- **Clicks on the state label:** `ChoiceRow`'s text-part selector includes `${slot}-state-label`, so a click on the state label toggles too.

### D4. Asynchronous change (`hooks/use-switch-change.ts`)

```ts
const { pending, request } = useSwitchChange({ onBeforeChange, commit: (checked) => value.setChecked(checked) });
// Radix onCheckedChange={request}; busy = loading || pending
```

- **Without `onBeforeChange`:** `request(next)` commits immediately.
- **With a guard:** it calls `onBeforeChange(next)`.
  - A synchronous `true` commits; a synchronous `false` does nothing.
  - A thenable sets `pending`. On resolve, it commits when the result is `true` and the component is still mounted (checked with a ref). On reject or `false`, it does nothing. Afterwards it clears `pending`.
- **While pending:** `request` is ignored.
- **The switch stays controlled** by the current value, so it does not move until the change commits.
- **Busy state:** the spinner shows in the thumb and `aria-busy` is set, but the two sources lock the switch differently:
  - **`pending`** (`onBeforeChange` running): the switch is **not** `disabled`, because a disabled button would drop keyboard focus while the save runs. It gets `aria-disabled="true"`, and `request` ignores toggles, so focus stays on the switch.
  - **`loading`**: uses Radix `disabled`, like the other families.

### D5. Naming, required mark and warnings

The same as `CheckboxField` (its D4 and D7):

- **`label` + `switchLabel`:** `FieldShell` with `labelFor={false}` and `labelledByRoot`, and the switch has `aria-labelledby` set to the text id.
- **Only `label`:** the header label points to the switch.
- **Only `switchLabel`:** the required mark follows the text.
- **Warnings** (`hooks/use-switch-warnings.ts`): no name, and unknown values (from the moved hook).

### D6. Types and overloads

- **`switch-field-types.ts`:** `SwitchFieldBaseProps`, with `switchLabel`, `switchPosition`, `appearance`, `size`, `stateLabels?: { on: ReactNode; off: ReactNode }`, `thumbIcons?: { on: ReactNode; off: ReactNode }`, `onBeforeChange?: (next: V) => boolean | Promise<boolean>` and the family props.
- **Union:** the base props combine with the `ToggleBooleanValueProps | ToggleCustomValueProps<V>` union.
- **Overloads:** `SwitchField` and `SwitchControl` have one for boolean and one for `const V`, as in the checkbox.
- **`onBeforeChange`** receives the value it would change to: the checked or unchecked value, typed `V`.

### D7. Control

- **Mapping:** `mapControllerToValueField(ctx, props, uncheckedValue ?? false)`, rendering `SwitchField`. The guard runs inside the field, so react-hook-form's `field.onChange` only sees committed values.
- **Focus:** react-hook-form's ref reaches the Radix button, so `shouldFocusError` focuses the switch.
- **Parity:** the parity test renders the field inside a form, because of the native input.

### D8. Folder layout

```
internal/types/toggle-value-types.ts
internal/hooks/use-toggle-value.ts (+ tests, moved)
internal/components/choice-row/switch-box.tsx (+ slot "switch", styles)
components/switch-field/
├─ index.ts  switch-field.tsx  switch-field-types.ts
├─ hooks/  index.ts  use-switch-change.ts  use-switch-warnings.ts  (+ tests)
└─ tests/  helpers.tsx  value / a11y / extras / async / states / types
components/switch-control/
├─ index.ts  switch-control.tsx  switch-control-types.ts
└─ tests/  render-in-form.tsx  form / parity / types
```

## Risks / Trade-offs

- **[Copied shadcn classes in `SwitchBox`]** → The drift-guard story compares computed styles with shadcn's `Switch`, and the classes are commented with their origin.
- **[Moving checkbox internals]** → It is behaviour-neutral. The Checkbox suites, stories and parity run before any switch work.
- **[Pending state with a never-settling promise]** → The switch stays busy; the docs advise rejecting on timeout. Unmounting clears it safely.
- **[`aria-disabled` versus `disabled` while pending]** → Focus is kept on the switch, and toggles are ignored in code. Tests cover clicks and keys while pending.
- **[RTL arrow of the thumb]** → It is asserted by the computed thumb position in an RTL story.

## Migration Plan

Purely additive for consumers. Release in a `minor` changeset.

## Implementation Notes

Findings while implementing, kept here so that the archived design matches the code.

- **D2 spinner:** the thumb uses lucide's `Loader2Icon` directly (`aria-hidden`, `data-slot="switch-spinner"`) instead of shadcn's `Spinner`. The `Spinner` carries `role="status"` and `aria-label="Loading"`, which do not belong inside a `switch` button, and `aria-busy` already announces the state. For the same reason `SwitchFieldBaseProps` omits `loadingLabel`: it would be a prop without effect.
- **D2 drift guard:** the `ShadcnParity` story compares the computed width, height, background and radius of the track, and the size, transform and background of the thumb, with shadcn's `Switch` in both sizes and states. It passes, so the copied classes match today's shadcn.
- **D3 helper indent:** in a plain row with the switch at the start, the helper is indented by the track width plus the 8 px gap (`ps-10`, or `ps-8` with `size="sm"`). It is not indented when `stateLabels` sit between the switch and the text, because their width varies.
- **D1:** `useToggleValue` imports `useControllableState` directly, not through the `internal/hooks` barrel, to avoid a cycle. `CheckboxValue`, `CheckboxBooleanValueProps` and `CheckboxCustomValueProps` are now aliases of the toggle types, and their JSDoc reads "on/off".
- **Coverage:** every story other than `Playground` needs a localized description, so `ShadcnParity` is documented as a drift guard.
