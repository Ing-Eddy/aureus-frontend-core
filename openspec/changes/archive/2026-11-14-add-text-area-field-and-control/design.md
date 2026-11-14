## Context

The current state relevant to the approach. For motivation, see proposal.md (Why). For requirements, see `specs/form-fields/spec.md`.

- **shadcn `Textarea`** (`packages/ui/src/shadcn/ui/textarea.tsx`) uses `field-sizing-content min-h-16`. CSS `field-sizing` is not supported in Firefox, so auto-growth cannot rely on it.
- **`InputGroupTextarea`** adds `flex-1 resize-none … py-2` and `data-slot="input-group-control"`.
- **`InputGroup`** already handles textareas and footers:
  - `has-[>textarea]:h-auto`;
  - a `block-end` addon switches the group to `flex-col h-auto`;
  - the addon is `order-last w-full justify-start px-2.5 pb-2 [.border-t]:pt-2`.

  So a block-end addon is a footer that follows the bottom edge with no extra work.
- **Shared pieces in `src/internal/`:**
  - `FieldShell`;
  - `useFieldA11y`, which is element-agnostic: id, `aria-*`, `isDisabled`;
  - `FieldAction`, which forwards `ref` and every button prop to `InputGroupButton`;
  - `FieldLoading`;
  - `fieldFrameClassName`, which dims only on `[data-slot=input-group-control]:disabled`, a slot the textarea also has;
  - `ControlField`, `mapControllerToField` (generic over the element type) and `useControllableState`;
  - `mergeRefs`;
  - `fieldStrings`.
- **`InputField`** is the single-line view. It is not reused here.
- **Playground:**
  - `field-action-args.tsx` provides the Action controls;
  - `coverage-tests.ts` requires docs for every `src/components/*`.

## Goals / Non-Goals

**Goals:**
- Height that follows content and manual resizing in every evergreen browser.
- A footer bar that holds the action, spinner and counter, attached to the bottom edge whatever the height.
- An accessible counter that does not spam screen readers.
- The same header, frame, helper and error as every other field, and parity between field and control.

**Non-Goals:**
- A public autosize hook.
- Horizontal resize.
- A counter on single-line fields in this change.

## Decisions

### D1. Composition
```
FieldShell
└─ InputGroup (fieldFrameClassName + classNames.control)
   ├─ InputGroupTextarea (textareaClassName + resize class + classNames.input, a11y props, ref)
   └─ InputGroupAddon align="block-end" (fieldFooterClassName + classNames.footer)   ← only if loading | action | showCount
      ├─ FieldLoading
      ├─ FieldCounter
      └─ FieldAction (ms-auto, ref → shortcut)
```
- **`textareaClassName`** (in `field-styles.ts`) is `field-sizing-fixed min-h-0 flex-none`. It cancels shadcn's content sizing and `min-h-16`, so the hook owns the height. The resize class is `resize-y` or `resize-none`.
- **Why `flex-none`:** it was found while implementing, by the `AutoGrow` story in Chromium. Once the footer bar turns the frame into a column, `InputGroupTextarea`'s `flex-1` (a zero flex-basis) makes the browser ignore the computed `height`, so the field would never grow.
- **`fieldFooterClassName`** is `border-t gap-2`. It relies on shadcn's own `[.border-t]:pt-2` for top padding.
- The action gets `ms-auto`, so it sits at the inline end, also in RTL.
- *Alternative:* an action column beside the text (inline-end). Rejected by the author: it floats at an arbitrary height and competes with the resize handle.

### D2. `useTextareaAutosize` (in `components/text-area-field/hooks/`)
**Inputs:** `{ ref, minRows, maxRows, resize }`.

**Metrics:**
- From `getComputedStyle`, read `lineHeight` (if it is `normal`, use `fontSize × 1.2`), the vertical padding and the vertical border.
- `minPx = minRows × lh + padding + border`, and `maxPx` is the same with `maxRows` (`Infinity` allowed).
- These go in `style.minHeight` and `style.maxHeight`, so a manual drag is bounded too.

**`adjust()`:**
1. `style.height = minPx`.
2. `content = scrollHeight + border`.
3. `next = clamp(max(content, floor), minPx, maxPx)`.
4. `style.height = next` and `lastApplied = next`.
5. `style.overflowY = content > maxPx ? "auto" : "hidden"`.

Setting a small height before reading `scrollHeight` is the standard way to let the field shrink.

**When it runs:**
- In a `useLayoutEffect` with no dependency array, so on every render: this covers controlled values, prop changes and the first paint.
- On a native `input` listener: this covers uncontrolled typing.

**Manual resize:**
- A `ResizeObserver` on the textarea compares its width and height with the previous ones.
  - **Width changed:** the layout is responsive and the text re-wraps, so run `adjust()`.
  - **Width unchanged and `offsetHeight ≠ lastApplied`:** the user dragged the handle, so `floor = offsetHeight` and `lastApplied = offsetHeight`.
- `adjust()` sets `lastApplied` synchronously, so the observer ignores the resizes the hook itself causes.

### D3. Counter
- **`FieldCounter`** lives in `internal/components/field-counter/`. Its props are `{ count, max?, describedById, announcement }`. It renders:
  - the visible `<span aria-hidden data-slot="field-counter">`, with `count/max` or `count`, in `tabular-nums`, and `text-destructive` when `count >= max`;
  - a `<span id={describedById} class="sr-only">{announcement}</span>`, referenced from the textarea's `aria-describedby`;
  - a `<span class="sr-only" aria-live="polite">`, whose text is set 1000 ms after the last change of `announcement` (a timer in `useEffect`). It starts empty, so nothing is announced on mount.
- **Count source in `TextAreaField`:**
  - **controlled:** `String(value ?? "").length`;
  - **uncontrolled:** a `useState` seeded from `defaultValue`, updated in the composed `onChange`.
- **Announcement text:**
  - with `max`: `countLabel?.(max - count) ?? fieldStrings.charactersRemaining(max - count)`;
  - without `max`: `fieldStrings.characters(count)`.
- **Strings:** `fieldStrings` gains `charactersRemaining: (n) => \`${n} characters remaining\`` and `characters: (n) => \`${n} characters\``. Making them functions changes `fieldStrings` from plain strings to mixed values; that is acceptable, because it is internal.
- **Description order:** `useFieldA11y` receives `describedBy = [consumerDescribedBy, counterId].join(" ")`, so the order is consumer, counter, helper, info.

### D4. `useActionShortcut` (in `components/text-area-field/hooks/`)
- **Signature:** `useActionShortcut({ enabled, actionRef })` returns `onKeyDown(event)`. It is composed with the user's `onKeyDown`, which runs first and can call `preventDefault`.
- **Behaviour:** when `enabled`, the key is Enter, Ctrl or Meta is held, an action exists and `!event.nativeEvent.isComposing`, it calls `preventDefault()` and then `actionRef.current.click()` if the button is not disabled.
- The action gets `aria-keyshortcuts="Control+Enter Meta+Enter"` and `ref={mergeRefs(actionRef, action.ref)}`.

### D5. Types
```ts
type TextAreaFieldProps = FieldBaseProps &
  Omit<ComponentProps<"textarea">, "disabled" | "required" | "className" | "children" | "rows"> & {
    action?: FieldActionProps; minRows?: number; maxRows?: number; resize?: boolean;
    showCount?: boolean; countLabel?: (remaining: number) => string; actionShortcut?: boolean;
  };
type TextAreaControlProps = ControlBaseProps &
  Omit<TextAreaFieldProps, "name" | "value" | "defaultValue" | "error" | "errorMessage" | "disabled">;
```
- `FieldClassNames` gains `footer?: string`, documented as used only by multi-line fields.
- `TextAreaControl` = `ControlField componentName="TextAreaControl"` → `mapControllerToField<HTMLTextAreaElement>` → `<TextAreaField>`.

### D6. Folder layout
```
internal/components/field-counter/   index.ts, field-counter.tsx, field-counter-tests.tsx
components/text-area-field/          index.ts, text-area-field.tsx, text-area-field-types.ts,
                                     hooks/{index.ts, use-textarea-autosize.ts, use-action-shortcut.ts},
                                     tests/{a11y, sizing, footer, states}-tests.tsx (prefixed text-area-field-)
components/text-area-control/        index.ts, text-area-control.tsx, text-area-control-types.ts,
                                     tests/{render-in-form.tsx, …-form-tests.tsx, …-parity-tests.tsx, …-types-tests.tsx}
```

### D7. Stories
- The **Playground** reuses `field-action-args.tsx` (`splitActionArgs`) and adds controls for `minRows`, `maxRows`, `resize`, `showCount`, `maxLength` and `actionShortcut`.
- **`AutoGrow`** checks, in Chromium:
  - the textarea's `clientHeight` grows as lines are typed;
  - it stops at `maxRows` with `scrollHeight > clientHeight`;
  - the footer's bottom equals the frame's inner bottom.
- **`CommentComposer`** checks that Ctrl+Enter calls `onClick` and that Enter adds a line.

## Risks / Trade-offs

- **[jsdom has no layout]** `scrollHeight` and line-height are 0 there. → Unit tests mock `scrollHeight` and `getComputedStyle`, and the real growth is asserted in the Chromium story tests.
- **[Web fonts loading after the first measure change the line height]** → The width observer and any re-render re-measure. A late font swap without a re-render may leave the height a few pixels off until the next keystroke. This is accepted.
- **[`ResizeObserver` loops]** → `adjust()` never runs inside the observer for height-only changes. Only a width change triggers it, which settles in one pass.
- **[A manual height above the content keeps empty space]** → This is intended: the user chose that height.
- **[The live region in Storybook's a11y checks]** → It is an empty `span` with `aria-live`, which is valid.

## Migration Plan

Purely additive. Release in a `minor` changeset.
