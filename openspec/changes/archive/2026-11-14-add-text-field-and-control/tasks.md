## 1. Setup

- [x] 1.1 Add `react-hook-form@^7` to `packages/ui` as a `peerDependencies` entry, and add `react-hook-form`, `zod`, `@hookform/resolvers` and `@testing-library/user-event` to `packages/ui` `devDependencies`. Add `react-hook-form`, `zod` and `@hookform/resolvers` to `apps/storybook` `devDependencies`. Verify that `pnpm install` succeeds and that `pnpm typecheck` still passes.
- [x] 1.2 Create the `packages/ui/src/internal/` skeleton from design D2:
  - `components/`, `hooks/`, `types/` and `utils/{constants,helpers}/`, each with `index.ts`;
  - no `utils/libs/`.

  Verify that `pnpm lint` passes.

## 2. Internal types and constants

- [x] 2.1 Write `internal/types/field-base-types.ts` (`FieldBaseProps`, `FieldClassNames`), `field-action-types.ts` (`FieldActionProps`) and `control-base-types.ts` (`ControlBaseProps`: `name: string`, `disabled?`, `shouldUnregister?`). Every prop gets JSDoc. Export them from `types/index.ts`. Verify with `pnpm --filter @aureus-core/ui typecheck`.
- [x] 2.2 Write `internal/utils/constants/field-strings.ts` (default `loadingLabel`, `infoLabel`) and `field-styles.ts` (design D8 frame classes, with the `has-disabled` reset and `cursor-progress` on loading). Export them from `constants/index.ts` and `utils/index.ts`. Verify with `typecheck`.

## 3. Internal helpers and hooks

- [x] 3.1 Write `internal/utils/helpers/merge-refs.ts` with `merge-refs-tests.ts`. Verify that the tests cover function refs, object refs, `null` and `undefined`.
- [x] 3.2 Write `resolve-action-size.ts` with tests. Verify:
  - string children → `xs`;
  - element children → `icon-xs`;
  - an explicit size wins.
- [x] 3.3 Write `map-controller-to-field.ts` (design D4) with `map-controller-to-field-tests.ts`. Verify that:
  - `value ?? ""`;
  - `onChange` and `onBlur` call RHF first and then the user handler;
  - the refs are merged;
  - `disabled`, `error` and `errorMessage` are mapped from `field` and `fieldState`.
- [x] 3.4 Write `internal/hooks/use-field-a11y.ts` (design D5) with `use-field-a11y-tests.ts`. Verify:
  - the generated `id` and the user `id`;
  - the order of `aria-describedby` (user + helper + info);
  - `aria-invalid`, `aria-required` and `aria-busy`;
  - `isDisabled = disabled || loading`;
  - the `data-*` attributes.
- [x] 3.5 Write `internal/hooks/use-required-form-context.ts`. Verify, through the `control-field` tests in 4.5, that it throws the message from design D4 outside a `FormProvider`.

## 4. Internal components

- [x] 4.1 Write `internal/components/field-shell/`:
  - `field-shell.tsx`;
  - `components/field-header.tsx`, `required-mark.tsx` and `field-helper.tsx`, with their `index.ts`;
  - `field-shell-tests.tsx`.

  Verify that:
  - the label is associated through `htmlFor`;
  - the asterisk is `aria-hidden` and uses the destructive color;
  - with no `label` and no `info`, no header is rendered;
  - the helper and `errorMessage` swap (`role="alert"`);
  - `data-invalid` and `data-disabled` are set;
  - every `classNames` slot is merged.
- [x] 4.2 Write `internal/components/field-info/` with tests (design D6). Verify that a click toggles `open`, that the button's `aria-label` defaults to "More information" and can be overridden, and that the button is `size-6`.
- [x] 4.3 Write `internal/components/field-action/` with tests (design D7). Verify that:
  - the default is `type="button"`;
  - the size is resolved automatically;
  - the button is disabled when the field is disabled or loading;
  - a tooltip wrapper is used only when `tooltip` is set;
  - an icon-only button without an accessible name triggers the development warning;
  - disabling only the action leaves the frame without the dimmed classes.
- [x] 4.4 Write `internal/components/field-loading/` (a Spinner with `loadingLabel`). Verify, through the `text-field` tests in 5.2, that the `status` role and label are rendered.
- [x] 4.5 Write `internal/components/control-field/` with tests (design D4). Verify that:
  - it renders `Controller` with the context's control;
  - outside a `FormProvider` it throws the descriptive error;
  - an unknown `name` logs one development warning;
  - a missing `_defaultValues` skips the warning without crashing.
- [x] 4.6 Export all internal components from `internal/components/index.ts`. Verify that `pnpm lint` and `typecheck` pass and that no file under `internal/` imports from `src/components/`. Check with `grep -r "@/components" packages/ui/src/internal`, which must return nothing.

## 5. TextField

- [x] 5.1 Write `components/text-field/text-field-types.ts` (design D9, with JSDoc), `text-field.tsx` and `index.ts`. `index.ts` exports `TextField` and `TextFieldProps`. The component composes `FieldShell`, `InputGroup`, `InputGroupInput` and the inline-end addon. Verify with `typecheck`.
- [x] 5.2 Write `components/text-field/tests/`:
  - `text-field-a11y-tests.tsx`: label → accessible name, `aria-required`, `aria-describedby` including helper and info, `aria-invalid`.
  - `text-field-states-tests.tsx`: loading → disabled, `aria-busy` and `status`; disabled; `error` + `errorMessage` replaces the helper; `classNames.label`; `ref` focus; controlled and uncontrolled.
  - `text-field-action-tests.tsx`: `onClick` called, no form submit, disabled while loading.

  Verify that `pnpm --filter @aureus-core/ui test` passes.

## 6. TextControl

- [x] 6.1 Write `components/text-control/text-control-types.ts`, `text-control.tsx` and `index.ts`. `index.ts` exports `TextControl` and `TextControlProps`. The component is `ControlField` + `mapControllerToField` → `<TextField>`, and `disabled` goes to `Controller`. Verify with `typecheck`. Also check that `<TextControl name="x" />` needs no type parameters and that passing `control`, `rules`, `value` or `error` is a type error.
- [x] 6.2 Write `components/text-control/tests/text-control-form-tests.tsx`, using `FormProvider` + `zodResolver`. Verify that:
  - the value is registered and submitted;
  - the schema message replaces the helper on submit and the helper comes back after the value is corrected;
  - the input is focused on the first error;
  - `disabled` excludes the value;
  - `loading` keeps it.
- [x] 6.3 Write `components/text-control/tests/text-control-parity-tests.tsx`. Verify that `TextField` and `TextControl` with the same props render identical markup, after normalizing the generated ids, in these states: default, required + info + helper + action, and error with a message.

## 7. Package verification

- [x] 7.1 Run `pnpm build && pnpm check:package`. Verify that:
  - `dist/components/text-{field,control}/index.{js,d.ts}` and `dist/internal/**` exist;
  - no `@/` alias leaks;
  - publint and attw pass for `./components/text-field` and `./components/text-control`;
  - `internal/` is not in the `exports` map.

## 8. Playground coverage

- [x] 8.1 Generalize `apps/storybook/src/coverage-tests.ts` by layer (design D10). Verify that:
  - the existing shadcn checks still pass;
  - before the stories exist, the new `components` layer fails for `text-field` and `text-control`, naming them.

## 9. Stories and docs

- [x] 9.1 Write `stories/components/forms/text-field/text-field-docs.ts` (design D11), complete in `en` and `es`:
  - `api` with every prop, plus the `action` and `classNames` entries;
  - `providers`: `TooltipProvider`;
  - `keyboard`;
  - `aria` notes, including tooltips on disabled actions, `aria-required` vs native `required`, and the accessible name of icon-only actions;
  - `theming` with the `classNames`, `data-*` and tokens.
- [x] 9.2 Write `text-field-stories.tsx`:
  - `Playground`, with controls grouped by category and `fn()` callbacks;
  - `States`;
  - `WithAction` (text, icon, tooltip, a clear button on a controlled field that is disabled on its own while the field is empty);
  - Playground "Action" controls (story-only args in `stories/components/forms/field-action-args.tsx`) to add, remove and change the button, in both Text Field and Text Control;
  - `CustomLabelStyles`;
  - `Responsive`.

  Each story gets a `play` function that checks the keyboard (Tab order: input → info → action), the tap toggle of the info tooltip with Escape to close, and the action click. Verify that `pnpm --filter @aureus-core/storybook test` passes, axe included.
- [x] 9.3 Write `stories/components/forms/text-control/text-control-docs.ts`, complete in `en` and `es`. Its `providers` are `TooltipProvider` and `FormProvider`. Its notes cover `disabled` vs `loading`, the error message coming from the schema, and the development warning about `name`.
- [x] 9.4 Write `text-control-stories.tsx`, with a decorator that provides `FormProvider` + `zodResolver`:
  - `Playground`;
  - `WithSchema`: an empty submit shows the schema messages, and focus goes to the first error;
  - `HelperAndValidation`;
  - `DisabledVsLoading`: the submitted payload is shown;
  - `Parity`.

  Verify that the playground tests and the coverage test pass.
- [x] 9.5 Write the bilingual guide `stories/guides/fields-and-controls.mdx`, with matching `<En>`/`<Es>` blocks. It covers:
  - field vs control and visual parity;
  - the hook + schema + `FormProvider` flow;
  - validation messages appearing in the helper;
  - `disabled` vs `loading`;
  - the shared API.

  Link it from both docs pages. Verify that the "every guide is bilingual" test passes.

## 10. Repository docs and release

- [x] 10.1 Update `README.md`:
  - Install: `react-hook-form` is required;
  - Providers: `FormProvider` around controls;
  - a new "Fields & controls" section with a minimal example.

  Verify with `pnpm lint`; the formatter covers Markdown.
- [x] 10.2 Update `CONTRIBUTING.md`:
  - the `src/internal/` layer, its categories and dependency rules;
  - the component folder-structure rule (root = `index.ts` + `<name>.tsx`; subfolders when the component grows; `tests/`), with the `example-button` sample updated to match;
  - the "`X-control` renders `X-field`" pattern;
  - the `stories/components/<category>/<name>/` location.

  Verify by reading the result back against the `ui-package` delta spec.
- [x] 10.3 Add a `minor` changeset for `@aureus-core/ui` announcing `TextField`, `TextControl` and the new required peer `react-hook-form`. Verify that `pnpm changeset status` lists it.

## 11. Final verification

- [x] 11.1 Run `pnpm lint && pnpm typecheck && pnpm test && pnpm build && pnpm check:package` from the root, and verify that all of them pass.
- [x] 11.2 Manually review in `pnpm dev`:
  - light and dark theme, RTL, mobile viewport;
  - the info tooltip opens on tap;
  - the `Parity` story looks identical;
  - both docs pages and the guide are complete in EN and ES.

  Record any issue found as a follow-up task before archiving.
