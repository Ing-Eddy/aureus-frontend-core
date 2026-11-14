## 1. Internal refactor

- [x] 1.1 Create `internal/components/input-field/` (design D1) with the current `TextField` body, a `type: "text" | "password"` prop and an optional `action`. Export it from `internal/components/index.ts`. Rewrite `components/text-field/text-field.tsx` as `<InputField {...props} type="text" />`. Verify that `pnpm --filter @aureus-core/ui test` passes **without editing any existing TextField or TextControl test**, the parity tests included.
- [x] 1.2 Write `internal/components/input-field/input-field-tests.tsx`. Verify that:
  - the input renders with `type="password"` and with `type="text"`;
  - `type` cannot be overridden through the spread;
  - the action is disabled while loading.
- [x] 1.3 Write `internal/hooks/use-controllable-state.ts` (design D2) and its tests, and export it from `internal/hooks/index.ts`. Verify:
  - the uncontrolled update and `onChange`;
  - in controlled mode, only `onChange` is called and the value follows the prop;
  - the setter is stable across renders.
- [x] 1.4 Add `showPassword` and `hidePassword` to `internal/utils/constants/field-strings.ts`. Add `passwordInputClassName` (it hides `::-ms-reveal` and `::-ms-clear`) to `field-styles.ts` and to the constants `index.ts`. Verify with `typecheck`.

## 2. PasswordField

- [x] 2.1 Write `components/password-field/password-field-types.ts`: `PasswordFieldProps`, with JSDoc on every new prop. Verify with `typecheck`.
- [x] 2.2 Write `components/password-field/hooks/use-password-visibility.ts` and `hooks/index.ts` (design D3):
  - controllable visibility;
  - the native `submit` listener on `input.form`, which sets `input.type` synchronously and then updates the state;
  - `keepCaretOnPointerDown`;
  - caret restore in a `useLayoutEffect`.

  Verify with `typecheck`.
- [x] 2.3 Write `components/password-field/password-field.tsx` and `index.ts` (design D4). Verify with `typecheck` and with `pnpm lint`.
- [x] 2.4 Write `components/password-field/tests/`:
  - `password-field-toggle-tests.tsx`:
    - it starts hidden;
    - a click shows the password (`type`, `aria-pressed`, accessible name, eye-off icon);
    - a click on the toggle leaves focus in the input and keeps the caret;
    - controlled `visible` + `onVisibleChange`, and uncontrolled `defaultVisible`;
    - submitting the form re-hides it, and the input is `type="password"` already inside the submit handler.
  - `password-field-a11y-tests.tsx`:
    - `aria-controls` points at the input;
    - custom `showPasswordLabel` / `hidePasswordLabel`;
    - the label, `aria-required`, the helper and the info in `aria-describedby`.
  - `password-field-states-tests.tsx`:
    - loading and disabled disable the toggle, and the spinner comes before the toggle;
    - `autoComplete` defaults to `current-password` and can be overridden;
    - `spellCheck`, `autoCorrect` and `autoCapitalize` are off and cannot be overridden;
    - the `ref` reaches the input;
    - `@ts-expect-error` for `action` and `type`.

  Verify that `pnpm --filter @aureus-core/ui test` passes.

## 3. PasswordControl

- [x] 3.1 Write `components/password-control/password-control-types.ts`, `password-control.tsx` and `index.ts` (design D5). Verify with `typecheck`.
- [x] 3.2 Write `components/password-control/tests/render-in-form.tsx`, which uses a `password` / `confirm` schema with `refine`, and `password-control-form-tests.tsx`. Verify:
  - the value is registered and submitted;
  - the mismatch message is shown on `confirm`'s helper and is cleared once the values match;
  - `disabled` excludes the value, and `loading` keeps it;
  - submitting while visible sends the value and hides the input again;
  - it throws outside a `FormProvider`.
- [x] 3.3 Write `password-control-parity-tests.tsx`, normalizing ids as in `text-control-parity-tests.tsx`, and `password-control-types-tests.tsx`. Verify:
  - the markup is identical in the default state, in the state with required + info + helper, and in the state with an error and its message;
  - `control`, `rules`, `value`, `defaultValue`, `error`, `type` and `action` are type errors.

## 4. Package verification

- [x] 4.1 Run `pnpm build && pnpm check:package`. Verify that:
  - `dist/components/password-{field,control}/index.{js,d.ts}` and `dist/internal/components/input-field/` exist;
  - nothing from `tests/` ends up in `dist`;
  - the check reports 4 custom components.

## 5. Stories and docs

- [x] 5.1 Write `apps/storybook/src/stories/components/forms/password-field/password-field-docs.ts`, complete in `en` and `es` (design D7):
  - `api` with every prop, including `visible`, `defaultVisible`, `onVisibleChange`, `showPasswordLabel` and `hidePasswordLabel`;
  - `providers`: `TooltipProvider`;
  - `keyboard`;
  - `aria` notes: `aria-pressed` / `aria-controls`, no tooltip, focus and caret, re-hide on submit, autocorrect off;
  - `theming`, plus a note about password manager overlays.
- [x] 5.2 Write `password-field-stories.tsx`:
  - `Playground`, whose play checks:
    - the Tab order info → input → toggle;
    - a click on the toggle changes `type` and `aria-pressed`, and focus stays in the input;
    - `onVisibleChange` is called;
  - `States`;
  - `ControlledVisibility`, where a checkbox controls two fields;
  - `NewPassword`;
  - `Responsive`, with no overflow.

  Verify that the stories pass in Chromium, axe included.
- [x] 5.3 Write `password-control/password-control-docs.ts` (EN/ES; `providers`: `TooltipProvider` and `FormProvider`) and `password-control-stories.tsx`, with a `DemoForm` decorator:
  - `Playground`;
  - `WithSchema`: a password/confirm mismatch;
  - `HidesOnSubmit`;
  - `Parity`.

  Verify that the stories pass and that `coverage-tests.ts` passes for both new components.
- [x] 5.4 Update `stories/guides/fields-and-controls.mdx` with matching `<En>`/`<Es>` blocks:
  - a table of the available families (Text, Password);
  - a "Password" section on controlled visibility and on `current-password` vs `new-password`.

  Verify that the bilingual guide test passes.

## 6. Repository docs and release

- [x] 6.1 Update `README.md` ("Fields & controls": add a `PasswordField` / `PasswordControl` example) and `CONTRIBUTING.md` (`InputField` as the base of single-line fields; fixed-button fields do not accept `action`). Verify with `pnpm lint`.
- [x] 6.2 Add a `minor` changeset for `@aureus-core/ui` announcing `PasswordField` and `PasswordControl`. Verify that `pnpm changeset status` lists it.

## 7. Final verification

- [x] 7.1 Run `pnpm lint && pnpm typecheck && pnpm test && pnpm build && pnpm check:package` from the root, and verify that all of them pass.
- [x] 7.2 Take screenshots of the static Storybook build:
  - PasswordField States in light and dark;
  - WithSchema in RTL, where the toggle must be at the left end;
  - Responsive at mobile width;
  - the PasswordField docs page and the guide in Spanish.

  Verify the layout and record any issue as a follow-up task before archiving.
