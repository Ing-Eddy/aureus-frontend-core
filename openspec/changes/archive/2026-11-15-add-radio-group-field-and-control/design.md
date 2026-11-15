## Context

The proposal (see proposal.md, Why) and `specs/form-fields/spec.md` define the requirements. Current state:

- **`src/internal/components/checkbox-row/`** holds `CheckboxRow`, `CheckboxBox` and `checkboxStyles`, shared by `CheckboxField` and `CheckboxGroupField`. The row:
  - names the control through `aria-labelledby` (its text is a `<span>`, not a `<label>`);
  - forwards pointer clicks on the text, or on a card, to the control, skipping interactive descendants;
  - supports a description line, plain/card and start/end.

  Its `data-slot` names (`checkbox-row`, `checkbox-label`, `checkbox-description`, `checkbox-box-slot`, …) are documented in the checkbox docs. Card styles target `[data-slot=checkbox][data-state=…]`.
- **`CheckboxGroupField`** keeps, in its own folder:
  - its option type (`types/checkbox-group-option-types.ts`);
  - its layout (literal container-query column classes, orientation and indentation in `components/checkbox-group-options.tsx`).
- **`FieldShell`** supports `labelFor`, `labelledByRoot`, `rootAria` (`aria-describedby`, `aria-busy`, `aria-disabled`, `aria-label`, `aria-labelledby`) and `headerEnd`. `useFieldA11y` gives `inputId`, `labelId`, `helperId` and `infoId`.
- **shadcn's `RadioGroup` / `RadioGroupItem`** (`src/shadcn/ui/radio-group.tsx`) wrap Radix RadioGroup:
  - the root is `role="radiogroup"` with roving focus, an `orientation` prop and `loop`;
  - the items are `button role="radio"` with an enlarged hit area and a fixed circle indicator;
  - the items accept no children.

  Radix renders a hidden native radio, with `name` and `value`, per item inside a `<form>`. Radix arrow keys check the focused radio, and `dir` comes from Radix's `DirectionProvider`, which shadcn re-exports in `direction.tsx`.

## Goals / Non-Goals

**Goals:**

- One shared row and layout for all choice components, with no visible change to the checkbox components.
- WAI-ARIA radio group semantics and keyboard behaviour, provided by Radix and not re-implemented.
- Independent extras. Segmented, other option and deselectable stay opt-in.

**Non-Goals:**

- A standalone radio.
- Values other than strings.
- Re-implementing roving focus.

## Decisions

### D1. Rename `checkbox-row` to `choice-row`, keeping the checkbox `data-slot` names

- **Move:** `src/internal/components/choice-row/` holds `choice-row.tsx` (`ChoiceRow`), `checkbox-box.tsx` (unchanged), `choice-styles.ts` (`choiceStyles`) and `choice-layout.ts` (D3).
- **`slot` prop:** `ChoiceRow` takes `slot: "checkbox" | "radio"` (default `"checkbox"`) and renders `data-slot={`${slot}-row`}`, `${slot}-label`, `${slot}-description`, `${slot}-text`, `${slot}-box-slot` and `${slot}-end`. Checkbox markup is therefore unchanged, and the existing parity tests guard it.
- **Generic selectors:**
  - the card styles target the control inside the box slot (`has-[[data-slot$=box-slot]>[data-state=checked]]`, and the same for `indeterminate` and `:disabled`), so they work for both controls;
  - `[role=radio]` joins the interactive selectors that click forwarding skips;
  - the text-part selector uses the prefix.
- **`after` slot:** `ChoiceRow` gains an optional `after` node, rendered in the text column under the description (the other option's input, D5). Interactive content there is skipped by click forwarding.
- **Why not keep the name:** a "checkbox" row that renders radios misleads readers. The folder is private, so the rename has no public impact.

### D2. Shared option type

`src/internal/types/choice-option-types.ts` defines `ChoiceOption { value: string; label: ReactNode; description?: ReactNode; disabled?: boolean }`. `CheckboxGroupOption` becomes `export type CheckboxGroupOption = ChoiceOption`, the same shape and still exported. `RadioGroupOption` is the same alias.

### D3. Shared layout (`choice-layout.ts`)

- **Contents:** the literal column classes (`@sm:grid-cols-2`, `@lg:grid-cols-3`, `@2xl:grid-cols-4`), the vertical and horizontal classes, and a `choiceLayoutClassName({ orientation, columns, appearance, indent })` helper. Both groups use it, and `CheckboxGroupOptions` switches to it with identical output.
- **Wrapper:** the outer wrapper is the `@container`, as today.
- **Radio arrow axes:** the Radix `orientation` prop is `"vertical"` or `"horizontal"` from `orientation`. With `columns` it is `undefined`, so both axes move, as Radix does without an orientation.

### D4. Radio group structure

```
FieldShell (labelFor={false}; header label id = labelId; headerEnd = spinner while loading)
└─ div data-slot="radio-group" (@container; onBlur when focus leaves)
   ├─ RadioGroup (shadcn root; ref; role=radiogroup; value; onValueChange; orientation; disabled;
   │      aria-labelledby=labelId | aria-label/aria-labelledby; aria-describedby (helper+info);
   │      aria-required; aria-invalid; aria-busy; aria-disabled; name;
   │      className = choice layout or segmented track)
   │   ├─ ChoiceRow slot="radio" per option  → box = RadioGroupItem (shadcn) id=<inputId>-<i>,
   │   │                                         aria-labelledby=<id>-text, aria-describedby=<id>-description
   │   └─ ChoiceRow for the other option (after = input while checked)
   └─ (no status region: radios have no limit message)
```

- **Group attributes:** `aria-*` go on the `radiogroup`, not on the outer `Field` group, which stays unnamed so the name is not announced twice.
- **`required`:** sets `aria-required` on the radiogroup, which is valid there. It does not set Radix's `required` prop, which would add native validation.
- **`aria-invalid`:** goes on the radiogroup. The radios do not repeat it.

### D5. Value (`hooks/use-radio-group-value.ts`)

- **State:** `useControllableState<string | null>({ value, defaultValue: defaultValue ?? null, onChange })`.
- **Radix value** is derived:
  - an option's value when the value matches an option;
  - `OTHER_ID = "\u0000other"` when `otherOption` is set and the value is a string outside `options` (including `""`);
  - otherwise `""`, so no radio is checked.
- **Mapping Radix changes:** `onValueChange(id)` maps back:
  - `OTHER_ID` reports the current other text: the previous custom value if it was one, `""` otherwise;
  - an option id reports that id.
- **The other text** lives in the value itself, so it can be controlled. Typing calls `set(text)`.
- **Unknown values:** without `otherOption`, an unknown value is kept until a change, and a warning is emitted once.
- **Deselection:** with `deselectable`, each item gets an `onClick` that runs before Radix's handler. When the item's value is the checked id it calls `set(null)`; Radix does not call `onValueChange` for an already checked item. Space activates the button too, so it deselects the same way.

### D6. Other option (`components/radio-other-input.tsx`)

- **Input:** shadcn's `Input` with the family's input styles (`fieldFrameClassName` look), `aria-label={inputLabel}`, `placeholder` and `id=<inputId>-other-input`. It is rendered through `ChoiceRow`'s `after` slot, only while the other option is checked.
- **Focus:** when the other option becomes checked by user action, the input receives focus. A controlled value that arrives with other text does not move focus.
- **Locking:** `disabled` and `loading` lock it.
- **Types:** `otherOption?: { label: ReactNode; inputLabel: string; placeholder?: string }`. The required keys are enforced by the object type.
- **Warning:** a development warning is emitted for an empty `inputLabel` in untyped code.

### D7. Segmented (`components/radio-segmented.tsx`)

- **Primitive:** shadcn's `RadioGroupItem` renders a circle indicator and takes no children. Segmented items therefore use Radix's `RadioGroup.Item` from `radix-ui` directly, inside the shadcn root, with our classes:
  - **track:** `flex w-full rounded-lg bg-muted p-[3px] gap-[3px]`, or `flex-col` in vertical;
  - **segment:** `flex-1 min-h-9 pointer-coarse:min-h-11 rounded-md px-3 text-sm font-medium text-muted-foreground`; when checked, `bg-background text-foreground shadow-sm`, with a focus ring from `focus-visible:ring-3 ring-ring/50`, and disabled styles. All variants are arbitrary `data-[state=checked]`.
- **Naming:** the segment's text content names it; there is no `aria-labelledby`.
- **Ignored props:** `description` and `radioPosition` are not shown, and the docs say so.
- **Narrow containers:** the text wraps inside segments (`text-balance`); there is no horizontal scroll.
- **With other option:** the other option renders as a segment, and the input appears below the track.

### D8. Control

- **Mapping:** `mapControllerToValueField<HTMLDivElement, string | null>(ctx, …, null)`.
- **Focus:** react-hook-form's `field.ref` receives an object whose `focus()` targets `[role=radio][data-state=checked]`, else the first `[role=radio]:not(:disabled)` in the group wrapper. This is the same technique as `CheckboxGroupControl`.
- **Ref:** the consumer's `ref` still reaches the radiogroup.

### D9. Folder layout

```
internal/components/choice-row/  index.ts  choice-row.tsx  checkbox-box.tsx  choice-styles.ts  choice-layout.ts  (+ tests)
internal/types/choice-option-types.ts
components/radio-group-field/
├─ index.ts  radio-group-field.tsx
├─ types/       index.ts  radio-group-field-types.ts
├─ components/  index.ts  radio-group-options.tsx  radio-segmented.tsx  radio-other-input.tsx
├─ hooks/       index.ts  use-radio-group-value.ts  use-radio-group-warnings.ts  (+ tests)
└─ tests/       helpers.tsx  value / a11y / keyboard / extras / layout / segmented / other / states / types
components/radio-group-control/
├─ index.ts  radio-group-control.tsx  radio-group-control-types.ts
└─ tests/       render-in-form.tsx  form / parity / types
```

## Risks / Trade-offs

- **[The rename touches two shipped components]** → It is behaviour-neutral and the `data-slot` names are kept. The Checkbox and Checkbox group suites, stories and parity run before any radio work.
- **[Radix's arrow keys in jsdom]** → Roving focus and arrow selection are asserted in Chromium stories, and jsdom tests cover only what jsdom supports (click, Space, Tab entry).
- **[shadcn group dimming]** → The radio item has no `group-has-disabled/field` class today. A story asserts the opacity of enabled radios next to a disabled one, in case the shadcn update brings one.
- **[Other option and validation]** → `""` while empty lets `z.string().min(1)` catch it. The story shows the pattern.
- **[`deselectable` deviates from WAI-ARIA]** → It stays opt-in and documented, and it is still announced as a radio group.
- **[RTL arrow direction]** → Radix follows the `DirectionProvider`, and the docs tell consumers to wrap RTL apps with shadcn's `DirectionProvider`.

## Migration Plan

Purely additive for consumers. Release in a `minor` changeset.

## Implementation Notes

Findings while implementing, kept here so that the archived design matches the code.

- **D1 fix: click forwarding.** `ChoiceRow` skipped a click when `event.target.closest(INTERACTIVE)` matched. Inside a Radix radio group that also matched the `radiogroup` ancestor, which has a `tabindex`, so text and card clicks were ignored. Only interactive elements inside the row (`event.currentTarget.contains(...)`) count now. The checkbox components are unaffected, and their suites still pass.
- **D3, as built:** `choiceLayoutClassName()` and `choiceOptionClassName()` in `choice-row/choice-layout.ts`, shared by both groups. The radiogroup carries `data-layout`, `data-columns` and `data-appearance`, and Radix sets `aria-orientation` (none with `columns`).
- **D6 refinement: focus of the other input.** It moves into the input only when the other option is chosen with the pointer (`event.detail > 0`). Radix checks radios on arrow focus by calling `click()`, so moving the input focus there would break arrow navigation through the group. With the keyboard, Tab moves into the input. The spec delta states this, with its own scenario.
- **Segmented and `orientation`:** following the rule that no prop changes another prop's default, segments follow `orientation`, which defaults to vertical. The examples, docs, guide and changeset pass `orientation="horizontal"` for side-by-side segments.
- **Arrow keys in tests:** Radix checks the radio it moves to in a later task, and only while the arrow key is still down. The stories press arrows as people do (key down, wait for the check, key up), with a small `pressArrow` helper. jsdom tests cover only click, Space and Tab entry.
- **`RadioGroupOption` and `CheckboxGroupOption`** are both aliases of the internal `ChoiceOption`.
