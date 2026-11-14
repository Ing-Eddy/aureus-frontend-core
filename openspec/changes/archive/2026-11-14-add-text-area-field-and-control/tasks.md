## 1. Internal additions

- [x] 1.1 Add `footer?: string` (with JSDoc: "multi-line fields only") to `FieldClassNames` in `internal/types/field-base-types.ts`. Add the `charactersRemaining(n)` and `characters(n)` functions to `internal/utils/constants/field-strings.ts`. Add `fieldFooterClassName` and `textareaClassName` (design D1) to `field-styles.ts` and export them from the constants `index.ts`. Verify with `pnpm --filter @aureus-core/ui typecheck`.
- [x] 1.2 Write `internal/components/field-counter/` (design D3) and export it from `internal/components/index.ts`. Write `field-counter-tests.tsx`, using fake timers. Verify:
  - "120/500" and "120";
  - the visible part is `aria-hidden`;
  - the sr-only description has the id;
  - the live region is empty on mount and is filled once, 1 s after the last change;
  - `text-destructive` at the limit.

## 2. TextAreaField

- [x] 2.1 Write `components/text-area-field/text-area-field-types.ts` (design D5), with JSDoc on every new prop. Verify with `typecheck`.
- [x] 2.2 Write `hooks/use-textarea-autosize.ts`, `hooks/use-action-shortcut.ts` and `hooks/index.ts` (designs D2 and D4). Verify with `typecheck`.
- [x] 2.3 Write `text-area-field.tsx` and `index.ts` (design D1):
  - the counter's count source for controlled and uncontrolled use;
  - the composed `onChange` and `onKeyDown`;
  - the merged refs for the textarea (autosize plus the consumer's `ref`) and for the action (shortcut plus `action.ref`);
  - the footer, only when there is a spinner, an action or a counter.

  Verify with `typecheck` and `pnpm lint`.
- [x] 2.4 Write `components/text-area-field/tests/`:
  - `text-area-field-sizing-tests.tsx` (mocked `scrollHeight` and computed style):
    - min and max heights from `minRows` and `maxRows`;
    - the field grows with content and caps at `maxRows` with `overflow-y: auto`;
    - it never goes below `minRows`;
    - a simulated manual height (a `ResizeObserver` callback with the same width) becomes the floor;
    - a width change re-measures;
    - `resize={false}` gives `resize-none`, and the default gives `resize-y`;
    - `field-sizing-fixed` is applied.
  - `text-area-field-footer-tests.tsx`:
    - no footer without spinner, action or counter;
    - the order is spinner, counter, action;
    - the action is disabled while loading or disabled;
    - disabling only the action leaves the textarea enabled;
    - Ctrl+Enter and Meta+Enter click the action, and do not when it is disabled or `actionShortcut` is off;
    - Enter alone does not;
    - `aria-keyshortcuts` is set only when `actionShortcut` is on;
    - the consumer's `onKeyDown` still runs.
  - `text-area-field-a11y-tests.tsx`:
    - the label is the accessible name;
    - `aria-required`;
    - `aria-describedby` contains the counter, the helper and the info, in that order after the consumer's own ids;
    - `aria-invalid` and the `errorMessage` alert.
  - `text-area-field-states-tests.tsx`:
    - uncontrolled multi-line typing;
    - the controlled value;
    - the counter follows both;
    - `rows` is a type error;
    - the `ref` reaches the textarea;
    - `classNames.footer` and `classNames.input` are merged.

  Verify that `pnpm --filter @aureus-core/ui test` passes.

## 3. TextAreaControl

- [x] 3.1 Write `components/text-area-control/text-area-control-types.ts`, `text-area-control.tsx` and `index.ts` (design D5). Verify with `typecheck`.
- [x] 3.2 Write `tests/render-in-form.tsx`, with a schema that requires `bio` to be at least 20 characters and at most 500, and `text-area-control-form-tests.tsx`. Verify:
  - the value is registered and submitted;
  - the schema message replaces the helper and is cleared once the value is fixed;
  - the counter shows the form value's length;
  - `disabled` excludes the value and `loading` keeps it;
  - it throws outside a `FormProvider`.
- [x] 3.3 Write `text-area-control-parity-tests.tsx` (normalized ids, sorted attributes) and `text-area-control-types-tests.tsx`. Verify:
  - the markup is identical in the default state, in the state with required + info + helper + counter + action, and in error with a message;
  - `control`, `rules`, `value`, `defaultValue`, `error` and `rows` are type errors.

## 4. Package verification

- [x] 4.1 Run `pnpm build && pnpm check:package`. Verify that:
  - `dist/components/text-area-{field,control}/index.{js,d.ts}` and `dist/internal/components/field-counter/` exist;
  - nothing from `tests/` ends up in `dist`;
  - the check reports 6 custom components.

## 5. Stories and docs

- [x] 5.1 Write `apps/storybook/src/stories/components/forms/text-area-field/text-area-field-docs.ts`, complete in `en` and `es`:
  - `api` with every prop, plus the `action` and `classNames` entries (`classNames` includes `footer`);
  - `providers`: `TooltipProvider`;
  - `keyboard`: Tab, Shift + Tab, Enter, Ctrl + Enter, Escape;
  - `aria`: the counter description and its debounced live region, `aria-keyshortcuts`, and the footer layout;
  - `theming`.
- [x] 5.2 Write `text-area-field-stories.tsx`:
  - a `Playground` with the Action group from `field-action-args.tsx` and sizing and counter controls;
  - `States`;
  - `AutoGrow`, whose play checks growth, the cap with scroll, and the footer staying at the bottom;
  - `CharacterCounter`, at the limit;
  - `CommentComposer`, with Ctrl+Enter and Enter;
  - `NoResize`;
  - `Responsive`, with no overflow.

  Verify that the stories pass in Chromium, axe included.
- [x] 5.3 Write `text-area-control/text-area-control-docs.ts` (EN/ES; `providers`: `TooltipProvider` and `FormProvider`) and `text-area-control-stories.tsx`, with a `DemoForm` decorator and the Action group in the Playground:
  - `WithSchema`;
  - `DisabledVsLoading`, which shows the payload;
  - `Parity`.

  Verify that the stories and `coverage-tests.ts` pass.
- [x] 5.4 Update `stories/guides/fields-and-controls.mdx` with matching `<En>`/`<Es>` blocks:
  - a "Text area" row in the families table;
  - a section on growth and resize, the footer bar, the counter and the shortcut.

  Verify that the bilingual guide test passes.

## 6. Repository docs and release

- [x] 6.1 Update `README.md` ("Fields & controls": the new pair) and `CONTRIBUTING.md` (in multi-line fields the action lives in a footer bar; `FieldCounter` is available in `internal/`). Verify with `pnpm lint`.
- [x] 6.2 Add a `minor` changeset announcing `TextAreaField` and `TextAreaControl`. Verify that `pnpm changeset status` lists it.

## 7. Final verification

- [x] 7.1 Run `pnpm lint && pnpm typecheck && pnpm test && pnpm build && pnpm check:package` from the root, and verify that all of them pass.
- [x] 7.2 Take screenshots of the static Storybook build:
  - AutoGrow after typing, where the footer must be at the bottom;
  - CommentComposer in light, dark and RTL, where the action must be at the left end;
  - Responsive at mobile width;
  - the TextAreaField docs page in Spanish.

  Verify the layout and record any issue as a follow-up task before archiving.
