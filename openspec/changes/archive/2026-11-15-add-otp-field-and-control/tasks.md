## 1. Utilities and hooks

- [x] 1.1 Write `otp-field/utils/otp-charset.ts` (design D2) with tests. Verify:
  - `pattern` and `inputMode` per charset, including a custom pattern;
  - the paste transform removes spaces and dashes, applies `uppercase`, filters to the charset and trims to `length`;
  - `sanitize` drops invalid characters and trims.
- [x] 1.2 Write `otp-field/utils/otp-groups.ts` (design D3) with tests. Verify:
  - blocks for `[3, 3]` and `[2, 2, 2]`;
  - one block without `groups`;
  - one block for a mismatched or non-positive `groups`.
- [x] 1.3 Write `otp-field/hooks/use-otp-warnings.ts` (design D6) with tests. Verify each warning, named and emitted once:
  - no name;
  - `groups` mismatch;
  - `reveal` without `masked`;
  - a sanitised value.

## 2. Types and components

- [x] 2.1 Write `otp-field-types.ts`:
  - `length` (required), the value props, `onComplete`, `submitOnComplete`;
  - `charset` (a union including `{ pattern; inputMode? }`), `uppercase`;
  - `groups`, `separator`;
  - `masked`, `reveal: { showLabel: string; hideLabel: string }`;
  - `autoFocus`;
  - `classNames` (`slots`, `slot`, `separator`) and the family props;
  - JSDoc stating there is no default text.

  Verify with `typecheck`.
- [x] 2.2 Write `components/otp-slots.tsx` (design D3 and D4):
  - the blocks of shadcn's `InputOTPGroup`, with shadcn's `InputOTPSlot` when unmasked and our `OtpSlot` (dot plus fake caret) when masked and hidden;
  - `InputOTPSeparator` or the custom `separator` between blocks;
  - the wrapper `aria-hidden`.

  Verify with `typecheck` and `lint`.
- [x] 2.3 Write `otp-field.tsx` and `index.ts` (design D1, D4 and D5):
  - `FieldShell` with `useFieldA11y`, and the ARIA on the input;
  - `pattern`, `inputMode`, `autoComplete`, `maxLength`, `pasteTransformer` and `uppercase` handling;
  - controlled value with sanitising;
  - `dir="ltr"` on the container;
  - the reveal toggle;
  - `loading` (spinner, `disabled`, `aria-busy`) and `disabled`;
  - `onComplete` and `submitOnComplete`, once per completion;
  - `autoFocus`, `ref` to the input, `action`.

  Verify with `typecheck` and `lint`.

## 3. OtpField tests

- [x] 3.1 Write `tests/otp-field-value-tests.tsx`. Verify:
  - typing fills the boxes;
  - `onValueChange`;
  - `onComplete` once;
  - controlled and uncontrolled;
  - a sanitised default value;
  - `submitOnComplete` calls `requestSubmit` once and nothing is submitted without it;
  - native `FormData` with `name`.
- [x] 3.2 Write `tests/otp-field-a11y-tests.tsx`. Verify:
  - the only textbox is named by the label and described by helper and info;
  - `autocomplete="one-time-code"`, `inputMode` and `maxLength`;
  - `aria-invalid`, `aria-required` and `aria-busy`;
  - the boxes are hidden from assistive technology;
  - the warning without a name;
  - `dir="ltr"` on the boxes container.
- [x] 3.3 Write `tests/otp-field-charset-tests.tsx`, `-groups-tests.tsx` and `-masked-tests.tsx`. Verify:
  - letters are rejected for digits;
  - alphanumeric with `uppercase`;
  - pasting `"123 456"` and `"123-456"`;
  - two blocks with a separator, and a custom separator;
  - mismatched groups fall back with a warning;
  - masked boxes show dots and the input is a password;
  - the reveal toggle names, `aria-pressed`, and focus kept in the input;
  - `reveal` without `masked` warns;
  - each extra leaves the other defaults unchanged.
- [x] 3.4 Write `tests/otp-field-states-tests.tsx` and `-types-tests.tsx`. Verify:
  - `loading` (spinner, no typing, `aria-busy`) and `disabled`;
  - the error message;
  - `autoFocus`;
  - the `ref` reaches the input;
  - `@ts-expect-error` without `length` and for `reveal` without `hideLabel`.

  Verify that `pnpm --filter @aureus-core/ui test` passes.

## 4. OtpControl

- [x] 4.1 Write `otp-control-types.ts`, `otp-control.tsx` (design D7) and `index.ts`. Verify with `typecheck`.
- [x] 4.2 Write `tests/render-in-form.tsx` (`code: z.string().length(6, …)`, `pin: z.string().regex(/^\d{4}$/, …)` and a lenient schema) and `otp-control-form-tests.tsx`. Verify:
  - the string is submitted;
  - the schema message, `aria-invalid` and focus;
  - `submitOnComplete` submits the form with the full code;
  - a missing value behaves as `""`;
  - `disabled` excludes the value and `loading` keeps it;
  - it throws outside a `FormProvider`.
- [x] 4.3 Write `otp-control-parity-tests.tsx` (plain, groups, masked with reveal; ids normalised) and `otp-control-types-tests.tsx`. Verify that the tests pass.

## 5. Package verification

- [x] 5.1 Run `pnpm build && pnpm check:package`. Verify:
  - 20 custom components;
  - `dist/components/otp-{field,control}` exist;
  - no test files in `dist`.

## 6. Stories and docs

- [x] 6.1 Write `otp-field-docs.ts` (EN/ES):
  - the API;
  - SMS autofill and pasting;
  - the one-input accessibility model;
  - the character sets and the mobile keyboard;
  - masking;
  - code order in RTL;
  - the keyboard table, `aria` notes and theming.
- [x] 6.2 Write `otp-field-stories.tsx`:
  - a `Playground` (`reveal` texts empty by default);
  - `Basic`, `Paste` (real clipboard paste in Chromium), `Groups` and `Alphanumeric`;
  - `MaskedPin`: with and without reveal, comparing the computed style of the masked slot with shadcn's slot, and recording whether `type="password"` keeps `autocomplete`;
  - `ResendAction` (an `action` with a story-side countdown);
  - `Verifying`;
  - `Keyboard` (Backspace, arrows, Home/End);
  - `States`;
  - `Responsive` (narrow and touch, no overflow, whole blocks wrap);
  - `Rtl` (box order).

  Verify that they pass in Chromium, axe included.
- [x] 6.3 Write `otp-control-docs.ts` (EN/ES) and `otp-control-stories.tsx`:
  - `Playground`;
  - `WithSchema`;
  - `SubmitOnComplete`;
  - `DisabledVsLoading`;
  - `Parity`.

  Verify that the stories and the coverage test pass.
- [x] 6.4 Update the guide `fields-and-controls.mdx` (EN/ES) with an "OTP" row and a short section. Verify that the bilingual guide test passes.

## 7. Repository docs and release

- [x] 7.1 Update `README.md` with the pair and an example line. Verify with `pnpm lint`.
- [x] 7.2 Add a `minor` changeset for `OtpField` and `OtpControl`. Verify that `pnpm changeset status` lists it.

## 8. Final verification

- [x] 8.1 Run `pnpm lint && pnpm typecheck && pnpm test && pnpm build && pnpm check:package` from the root. Verify that all pass, and that the full test suite passes twice in a row.
- [x] 8.2 Take screenshots of the static Storybook build:
  - basic;
  - groups;
  - alphanumeric;
  - masked PIN;
  - verifying;
  - error;
  - light and dark;
  - a narrow mobile viewport with touch emulated;
  - RTL;
  - the docs in ES.

  Verify the layout, fix any issue, and record the findings (including the masking decision) in `design.md`.
