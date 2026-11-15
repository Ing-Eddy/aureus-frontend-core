## Context

The proposal (see proposal.md, Why) and `specs/form-fields/spec.md` define the requirements. Current state:

- **`input-otp` 1.5** exports `OTPInput` (`forwardRef` to the real `<input>`). Its props are the input attributes plus:
  - `value`, `onChange(newValue)`, `maxLength`;
  - `pattern`, which filters typed characters through a regexp string;
  - `onComplete`, `pasteTransformer`, `containerClassName`, `textAlign`, `pushPasswordManagerStrategy`;
  - a `render` function or `children`, which read `OTPInputContext` (`slots[i] = { char, isActive, hasFakeCaret }`).

  It also exports `REGEXP_ONLY_DIGITS`, `REGEXP_ONLY_CHARS` and `REGEXP_ONLY_DIGITS_AND_CHARS`. The library renders a container `div` holding the children and a transparent, absolutely positioned `<input>` over them.
- **shadcn** (`src/shadcn/ui/input-otp.tsx`) wraps it as:
  - `InputOTP` (`containerClassName` with `has-disabled:opacity-50`);
  - `InputOTPGroup` (a rounded block, with `has-aria-invalid` styles);
  - `InputOTPSlot` (a `size-8` box that reads the context, with active and `aria-invalid` styles, and renders `char` plus a fake caret);
  - `InputOTPSeparator` (`role="separator"` with a minus icon).

  shadcn's `InputOTPSlot` always renders `char`, so a masked box needs its own slot.
- **Shared field pieces:** `FieldShell`, `useFieldA11y`, `FieldAction`, `FieldLoading`, `ControlField`, `mapControllerToValueField`, `mergeRefs`, `isDev` and `useControllableState` in `src/internal`.

## Goals / Non-Goals

**Goals:**

- One real input as the form control, with decorative boxes.
- Independent options. Pasting and SMS autofill work everywhere.
- shadcn's look without editing `src/shadcn`.

**Non-Goals:**

- A built-in resend timer.
- Server verification.
- Per-box custom rendering.

## Decisions

### D1. Structure

```
FieldShell (label htmlFor = input id; headerEnd unused)
└─ div data-slot="otp-row" (flex wrap; items-center; gap-2)
   ├─ InputOTP (shadcn) ref → input; id; name; value; onChange; maxLength=length; pattern; inputMode;
   │      autoComplete="one-time-code"; aria-*; type=password when masked & hidden; pasteTransformer;
   │      containerClassName: "flex-wrap gap-y-2" + dir="ltr"
   │   └─ OtpSlots: blocks of InputOTPGroup with OtpSlot per index, InputOTPSeparator between blocks
   │                (the slots wrapper is aria-hidden="true")
   ├─ reveal toggle (InputGroupButton-like icon button, aria-pressed) — only with masked + reveal
   ├─ FieldLoading while loading
   └─ FieldAction (action)
```

- **ARIA on the input:** `aria-describedby`, `aria-invalid`, `aria-required`, `aria-busy`, `aria-label` and `aria-labelledby` reach the real input, because `OTPInput` spreads the input attributes onto it.
- **Hiding the boxes:** the boxes live in a wrapper with `aria-hidden="true"` inside `InputOTP`'s children. The input itself is a sibling that the library renders, so it stays exposed. This is asserted in tests.
- **Locking:** `loading` and `disabled` both set the input's `disabled`. shadcn's container dims with `has-disabled:opacity-50`.
- **Order in RTL:** `dir="ltr"` on the container keeps the box order and the caret logic of `input-otp` (left to right) in RTL documents. The field layout around it (label, helper) still follows the document direction.

### D2. Character sets (`utils/otp-charset.ts`)

`resolveCharset(charset)` returns `{ pattern, inputMode, filter }`:

| charset | pattern | inputMode |
|---|---|---|
| `digits` | `REGEXP_ONLY_DIGITS` | `numeric` |
| `letters` | `REGEXP_ONLY_CHARS` | `text` |
| `alphanumeric` | `REGEXP_ONLY_DIGITS_AND_CHARS` | `text` |
| `{ pattern, inputMode? }` | `pattern` | `inputMode ?? "text"` |

- **`uppercase`:** letters are uppercased in `onChange` before the pattern check, so lowercase typing is accepted for uppercase codes. The pattern is checked on the uppercased text: `REGEXP_ONLY_CHARS` accepts both cases.
- **`pasteTransformer`:** removes whitespace and `-`, applies `uppercase`, keeps only characters that match the charset, and trims to `length`.
- **`sanitize(value)`:** applied to controlled and default values. Invalid characters are dropped and the value is trimmed to `length`, with a development warning when that changes the value.

### D3. Groups (`utils/otp-groups.ts`)

`toBlocks(length, groups)` returns arrays of slot indexes. A missing `groups`, any non-positive size, or a sum different from `length` gives one block. The development warning comes from `hooks/use-otp-warnings.ts`. Blocks are wrapped in a `flex flex-wrap` container, so a block never splits across lines.

### D4. Masking (`components/otp-slots.tsx`)

- **`OtpSlot`:** our slot replaces shadcn's `InputOTPSlot` only when the field is masked and not revealed. It reuses shadcn's slot class string through a small `otpSlotClassName` constant (copied, with its origin noted) and renders `•` (`data-slot="otp-slot-dot"`) for a filled box, plus the same fake caret. Unmasked fields use shadcn's `InputOTPSlot` directly, so the look stays shadcn's.
- **The input:** gets `type="password"` while masked and hidden, so password managers and screenshots do not expose the code. If SMS autofill in Chromium turns out not to work with `type="password"`, the input stays `type="text"` and only the boxes mask. The implementation notes will record what Chromium does.
- **`reveal`:**
  - it is a ghost icon button (`EyeIcon`/`EyeOffIcon`, `aria-hidden`) named `showLabel` or `hideLabel`, with `aria-pressed`;
  - `onMouseDown` calls `preventDefault`, so focus stays in the input;
  - its state is local (`useControllableState` is not needed).

### D5. Completion and submit

`OTPInput`'s `onComplete` calls the consumer's `onComplete(code)`. Then, with `submitOnComplete`, it calls `inputRef.current?.form?.requestSubmit()` in a microtask, after the value commit, so react-hook-form sees the full value. It is guarded so it fires once per completion, not again on re-renders while full.

### D6. Warnings (`hooks/use-otp-warnings.ts`)

The warnings are emitted once, only when `isDev`:

- no accessible name;
- `groups` does not sum to `length`;
- `reveal` without `masked`;
- a value changed by sanitising.

### D7. Control

- **Mapping:** `mapControllerToValueField<HTMLInputElement, string>(ctx, { onValueChange, onBlur, ref }, "")`.
- **Ref:** react-hook-form's ref reaches the real input through `OTPInput`'s `forwardRef`, so `shouldFocusError` works.
- **`submitOnComplete` inside a form:** it calls `requestSubmit()` on the form element that wraps the `FormProvider`, which runs `handleSubmit`.

### D8. Folder layout

```
components/otp-field/
├─ index.ts  otp-field.tsx  otp-field-types.ts
├─ components/  index.ts  otp-slots.tsx
├─ utils/       index.ts  otp-charset.ts  otp-groups.ts  (+ tests)
├─ hooks/       index.ts  use-otp-warnings.ts  (+ tests)
└─ tests/       helpers.tsx  value / a11y / charset / groups / masked / states / types
components/otp-control/
├─ index.ts  otp-control.tsx  otp-control-types.ts
└─ tests/       render-in-form.tsx  form / parity / types
```

## Risks / Trade-offs

- **[input-otp in jsdom]** → The library uses `document.activeElement`, selection ranges and `ResizeObserver`; the stub already exists in `vitest-setup.ts`. Typing, pasting and focus are also asserted in Chromium stories. jsdom tests focus on value, ARIA and options.
- **[`type="password"` and SMS autofill]** → This is verified in Chromium. The fallback is boxes-only masking (D4).
- **[Copied slot classes for masked boxes]** → A Chromium story compares the computed size, border and radius of a masked slot with shadcn's slot.
- **[Wrapping blocks change the visual order in RTL]** → `dir="ltr"` on the container keeps the order.
- **[Strict shadcn `data-*` variants]** → Only arbitrary variants are used in our classes.

## Migration Plan

Purely additive for consumers. Release in a `minor` changeset.

## Implementation Notes

Findings while implementing, kept here so that the archived design matches the code.

- **D1 fix, RTL:** `OTPInput` forwards every prop to the real `<input>`, so `dir="ltr"` passed to it only reached the input, and the boxes rendered reversed in RTL. Our `otp-slots` wrapper now carries `dir="ltr"` too. The `Rtl` story asserts that the leftmost box shows the first character.
- **D2, as built:** without `uppercase`, `input-otp` also rejects characters as they are typed, through `pattern`. With `uppercase`, `pattern` is not passed to `input-otp`, which has no case-insensitive option. Our `sanitizeOtp` uppercases and filters each change, and the controlled value keeps the input in sync. This works for custom uppercase-only patterns such as `^[0-9A-F]+$`.
- **D5, as built:** completion is detected in our change handler (the value reaching `length` from below), not through `input-otp`'s `onComplete`, so it fires once per completion, including for pasted codes. `submitOnComplete` calls `form.requestSubmit()` in a microtask.
- **D4, masking decision:** a masked input is `type="password"` and keeps `autocomplete="one-time-code"`, which the `MaskedPin` story asserts. Desktop Chromium cannot exercise SMS autofill, so real-device autofill with a password input is not verified here. Masked fields are meant for PINs, which are typed. The docs recommend leaving SMS codes unmasked.
- **Masked dots** are larger (`text-2xl`) than the box text, so they read clearly. The `MaskedPin` story compares the masked box's size, border and radius with shadcn's slot, and they match.
- **jsdom:** `input-otp` calls `document.elementFromPoint`, which jsdom lacks, so `vitest-setup.ts` stubs it, like `ResizeObserver`.
- **Wrapping blocks:** in narrow containers whole blocks wrap, and a separator stays at the end of the line it follows. The `Responsive` story asserts that there is no overflow and that the blocks wrap.
