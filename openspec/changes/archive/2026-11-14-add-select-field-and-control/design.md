## Context

The current state relevant to the approach. For motivation, see proposal.md (Why). For requirements, see `specs/form-fields/spec.md`.

- **`@base-ui/react` 1.9** is already a dependency; `src/shadcn/ui/combobox.tsx` is built on it. Its documentation (`node_modules/@base-ui/react/docs/react/components/combobox.md`) states:
  - *"Avoid [Combobox] when not rendering an input: Use Select instead… which includes accessibility features specific to a listbox without an input"*;
  - Combobox documents the **input-inside-popup** pattern (`Combobox.Trigger` as the form control, `Combobox.Input` inside `Combobox.Popup`), plus grouped items, async single and multiple search, and creatable items.
  - Base UI **Select** supports `multiple` and keyboard typeahead.
  - Both accept items with IDs as values (`itemToStringLabel`, `isItemEqualToValue`).
- **Shared field pieces in `src/internal/`:**
  - `FieldShell`, `useFieldA11y`, `fieldFrameClassName`, `FieldAction`, `FieldLoading`;
  - `useControllableState`, `ControlField`, `mapControllerToValueField(context, props, emptyValue)` and `mergeRefs`.
- **shadcn's `select.tsx`** is Radix and single-only, so it is not used.
- **Project rules:**
  - every prop is independent and opt-in;
  - no default messages (new for this component, recorded in CONTRIBUTING by this change).

## Goals / Non-Goals

**Goals:**
- One visual frame for both modes (with and without search), identical to the other fields.
- Correct ARIA per mode: a listbox without an input, and a combobox with an input.
- Texts that a feature needs cannot be forgotten: TypeScript enforces them, and development warnings cover untyped code.

**Non-Goals:**
- Virtualisation.
- Cascading or tree selects.
- Changing the English defaults of existing components (separate decision).

## Decisions

### D1. Two Base UI primitives behind one view
- **Without `searchable`:** **Base UI `Select`**, which provides listbox semantics, typeahead and `multiple`.
- **With `searchable`:** **Base UI `Combobox`** in the input-inside-popup pattern.
- **Rendering:** `select-field.tsx` picks the root by `searchable`. Both roots render the same internal pieces:
  - `SelectFrame`: frame, chips, trigger content, clear, chevron;
  - `SelectPopupContent`: list, groups, items, status messages.

  The only difference is which Base UI `Trigger`, `Popup`, `List` and `Item` parts are passed in, through a small adapter object (`selectParts` / `comboboxParts`).
- **Alternative rejected:** Combobox for both modes with a hidden input. Base UI advises against it, and it degrades listbox semantics.

### D2. Values are option IDs
- Base UI gets `items = options` and `value = string | string[]`, following the documented "Value selection with IDs" pattern.
- `itemToStringLabel = (id) => labelById.get(id) ?? id`, and `isItemEqualToValue` compares IDs.
- **Groups:** options with `group` become Base UI groups `{ value: groupTitle, items }`, in order of first appearance.
- **Orphan values** (not in `options`) are kept. They render their ID until options arrive, and a development warning names them once (D8).

### D3. The frame never nests interactive elements
```
InputGroup (fieldFrameClassName, h-auto + flex-wrap when chips)
├─ ul.chips (chips mode)            li > span label + <button aria-label={removeChipLabel(o)}>✕</button>
├─ Trigger <button> (flex-1)        value text | renderSummary | placeholder | sr-only selected labels (chips mode)
├─ FieldLoading                     (loading)
├─ FieldAction                      (action)
├─ <button> clear                   (clearable && has value) aria-label={clearLabel}
└─ <span aria-hidden> chevron       click → trigger.click(); rotates with data-open
```
- **Chips and clear are siblings of the trigger.** In chips mode the trigger's accessible content includes the selected labels as an sr-only list. These are data (the option labels), not default messages.
- **Backspace** on the trigger while closed, in chips mode, removes the last value.
- **`ref`** is merged onto the trigger.
- **`useFieldA11y`** gives the trigger its `id`, `aria-describedby`, `aria-invalid` and `aria-required`. `FieldLabel` points at the trigger with `htmlFor`, since a `<button>` is labelable.

### D4. Popup content and messages
- **Popup:** a Base UI Positioner in a Portal, with `sideOffset 4`, `align="start"` and width `var(--anchor-width)`, in shadcn's popover/menu styling.
- **Searchable header:** `Combobox.Input` with `aria-label={searchLabel}` and `placeholder={searchPlaceholder}`, above a separator.
- **Status region:** `Combobox.Status` (or a `role="status"` div with Select). It renders, in priority order and only when the prop exists:
  1. `optionsLoadingMessage` while `optionsLoading`;
  2. `noResultsMessage` when a search filters everything out;
  3. `emptyMessage` when `options` is empty.
- **Limit message:** `maxSelectedMessage` renders above the list when the limit is reached.
- **Items:**
  - a selected indicator: a check in single mode, and a visual checkbox in multiple mode;
  - the icon, the label, and the description on a second muted line;
  - `min-h-9`, and on coarse pointers `pointer-coarse:min-h-11`.

### D5. Filtering, creatable and select all (`hooks/use-select-options.ts`)
- **Filter:** `normalizeText = s.normalize("NFD").replace(/\p{Diacritic}/gu, "").toLocaleLowerCase()`. With `filter`, the Combobox `filter` prop is `(id, query) => normalize(label).includes(normalize(query))`; with `filter={false}` it is `filter={null}`.
- **Creatable:** when the query is not empty and matches no label exactly (normalised), a synthetic item with the sentinel ID `"\u0000create"` is appended. It renders `createLabel(query)`. Picking it calls `onCreate(query)`, and the value change is intercepted so the sentinel is never stored.
- **Select all:** a synthetic item `"\u0000all"` at the top of the list in multiple mode, intercepted in `onValueChange`.
  - It toggles between all enabled options (capped at `maxSelected`) and none.
  - It renders `aria-checked="mixed"` (`data-indeterminate`) when only some are selected.
- **Limit:** with `maxSelected`, an option is disabled when `selected.length >= maxSelected` and the option is not selected.

### D6. Value state (`hooks/use-select-value.ts`)
- `useControllableState<string | null | string[]>` with `emptyValue` `null` or `[]` depending on `multiple`.
- It exposes `selectedOptions` (resolved from `labelById`, orphans included), `toggle`, `clear`, `removeLast` and `canSelectMore`.
- `onValueChange` reports the cleaned value, with sentinels removed.
- `closeOnSelect` defaults to `!multiple`. It is applied through controlled `open` state, closed after a pick when true.

### D7. Types: discriminated unions (`types/select-field-types.ts`)
```ts
type SelectionProps =
  | { multiple?: false; value?: string | null; defaultValue?: string | null;
      onValueChange?: (v: string | null) => void; multipleDisplay?: never; maxSelected?: never; selectAll?: never }
  | ({ multiple: true; value?: string[]; defaultValue?: string[]; onValueChange?: (v: string[]) => void;
       maxSelected?: number; maxSelectedMessage?: ReactNode; selectAll?: { label: ReactNode } }
     & ({ multipleDisplay: "chips"; removeChipLabel: (o: SelectOption) => string; renderSummary?: never }
      | { multipleDisplay: "summary"; renderSummary: (s: SelectOption[]) => ReactNode; removeChipLabel?: never }));
type SearchProps =
  | { searchable?: false; searchLabel?: never; filter?: never; onSearchChange?: never; creatable?: never; noResultsMessage?: never; optionsLoading?: never }
  | ({ searchable: true; searchLabel: string; searchPlaceholder?: string; filter?: boolean;
       onSearchChange?: (q: string) => void; noResultsMessage?: ReactNode; optionsLoading?: boolean; optionsLoadingMessage?: ReactNode }
     & ({ creatable?: false } | { creatable: true; createLabel: (q: string) => ReactNode; onCreate: (q: string) => void }));
type ClearProps = { clearable?: false } | { clearable: true; clearLabel: string };
type SelectFieldProps = SelectFieldBaseProps & SelectionProps & SearchProps & ClearProps;
```
- **`SelectControlProps`** uses a `DistributiveOmit` helper, because `Omit` over a union would collapse the discriminants.
- **Type tests** (`@ts-expect-error`) cover every missing required text, `creatable` without `searchable`, and `multiple` without `multipleDisplay`.

### D8. Development warnings
These fire once per component instance:
- a missing required text: the prop name and the feature, for untyped usage;
- orphan values, by ID;
- `creatable` without `searchable`.

### D9. `SelectControl`
- `ControlField componentName="SelectControl"` → `mapControllerToValueField<HTMLButtonElement, string | null | string[]>(ctx, { onValueChange, onBlur, ref }, multiple ? [] : null)` → `<SelectField {...rest} {...mapped} />`.
- Blur is reported when the trigger loses focus while the popup is closed, so `mode: "onTouched"` validates when the user leaves the field.

### D10. Folder layout
```
components/select-field/
├─ index.ts, select-field.tsx
├─ types/{index.ts, select-field-types.ts, select-option-types.ts}
├─ components/{index.ts, select-frame.tsx, select-chips.tsx, select-popup-content.tsx, select-option-item.tsx, parts.ts}
├─ hooks/{index.ts, use-select-value.ts, use-select-options.ts, use-missing-text-warnings.ts}
├─ utils/{index.ts, normalize-text.ts, normalize-text-tests.ts, group-options.ts, group-options-tests.ts}
└─ tests/{select-field-*-tests.tsx}
components/select-control/
├─ index.ts, select-control.tsx, select-control-types.ts
└─ tests/{render-in-form.tsx, …-form-tests.tsx, …-parity-tests.tsx, …-types-tests.tsx}
```
`parts.ts` holds the adapter mapping of Base UI Select and Combobox parts (D1).

## Risks / Trade-offs

- **[Two primitives could drift in behaviour or markup]** → One shared frame and one shared popup content. Story tests run the same scenarios (open, select, Escape, chips) in both modes.
- **[Base UI in jsdom (portals, pointer events, floating-ui)]** → Unit tests target logic, ARIA and closed-state markup, and open the popup with the keyboard. Positioning and focus details are asserted in Chromium stories. Missing jsdom APIs are stubbed in `vitest-setup.ts` if needed (`ResizeObserver` is already there).
- **[Required texts make simple usage longer]** → This is intentional per the author's rule. A minimal select needs only `label` and `options`, because nothing else is required until a feature is enabled.
- **[Sentinel IDs could clash with real values]** → They contain a NUL character (`\u0000`), which never appears in user option IDs. A development assertion warns if an option uses it.
- **[Very large option lists]** → No virtualisation. The docs point to server search with `filter={false}`.

## Migration Plan

Purely additive. Release in a `minor` changeset.

## Implementation Notes

Findings while implementing, kept here so the archived design matches the code.

- **D1 as built.** The shared view is `components/select-roots.tsx`: `ListboxRoot` (Base UI Select) and `ComboboxRoot` (Base UI Combobox) take the same `SelectViewProps`. There is no separate `parts.ts` adapter.
- **Combobox needs `items`.** With manually rendered items, Base UI marks the list as empty and does not open it. The computed groups are passed as `items` (`{ value, title, items }`), with `filter={null}`, because filtering is done by `useSelectOptions`.
- **Accessible names inside the popup.** The search popup is a `dialog`, and it is named by `searchLabel`. The listbox is named by the field label through `aria-labelledby`. `FieldHeader` now gives every field label the id `<inputId>-label`, and `useFieldA11y` returns it as `labelId`.
- **`data-selected` styling.** shadcn's `data-selected` variant only matches `data-selected="true"`, but Base UI sets the attribute empty. The check and the checkbox use the arbitrary `group-data-[selected]/option:` variant. The `LimitAndSelectAll` story checks the computed style.
- **Chips layout.** The chips list is `display: contents`, so each chip wraps inside the frame and the button fills the rest of the last line (`min-w-12`) next to the chevron.
- **Base UI keeps a closed Select popup mounted** (`data-closed`). Story play functions wait until no popup is open or running its exit transition (`data-ending-style`) before they check focus, click outside or run the accessibility check.
- **Select all in tests.** The list opens with the selected option highlighted, so tests reach the select-all row with Home first.
