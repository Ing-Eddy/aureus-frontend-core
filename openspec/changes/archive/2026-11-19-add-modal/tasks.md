## 1. Shared media query (refactor, no behaviour change)

- [x] 1.1 Write `internal/hooks/use-media-query.ts` (design decision 7) and export it from `internal/hooks/index.ts`. Verify with `use-media-query-tests.ts`:
  - it returns the current match;
  - it updates on a `change` event;
  - it unsubscribes on unmount;
  - it returns `serverValue` when `matchMedia` is missing.
- [x] 1.2 Rewrite `internal/components/field-stepper/hooks/use-stepper-layout.ts` on `useMediaQuery("(pointer: coarse)", false)`. Verify that the `field-stepper` and `number-field` tests pass unchanged.

## 2. Types, context and hooks

- [x] 2.1 Write `modal/types/modal-types.ts` and `types/index.ts`, with JSDoc that states the defaults and that no text is generated. Verify with `typecheck`. It contains:
  - `ModalProps`, `ModalMode`, `ModalOpenChangeReason`, `ModalSize`, `ModalDrawerDirection`;
  - `ModalContentProps`, with the `closeButton`/`closeLabel` discriminated union;
  - the props of each section, `ModalCloseProps`, `ModalTriggerProps`;
  - `UseModalResult`.
- [x] 2.2 Write `hooks/use-modal.ts`: `ModalContext`, the internal `useModalContext(partName)`, which throws `<Part> must be used inside Modal`, and the public `useModal()`. Verify with unit tests that every part and the hook throw outside `Modal`, naming the part.
- [x] 2.3 Write `hooks/use-modal-mode.ts` (design decision 7). Verify with unit tests, using the `matchMedia` mock in `tests/render-modal.tsx`:
  - default `768` above and below;
  - a custom `breakpoint`;
  - forced modes;
  - no `matchMedia` → dialog;
  - `onModeChange` once per switch;
  - `lockModeWhileOpen` freezes the mode while open and applies the current one after closing.
- [x] 2.4 Write `hooks/use-modal-dismiss.ts` (design decisions 3 and 4): the reason ref and the Escape and outside wrappers for each view, including the non-modal drawer and `closeOnSwipe={false}`. Verify with unit tests of the wrappers:
  - the consumer's `preventDefault()` wins;
  - each `closeOn*` flag blocks only its own path;
  - the reason is recorded and then cleared.
- [x] 2.5 Write `hooks/use-modal-focus.ts` (design decision 2): capture of the element focused before opening, `initialFocusRef`, and the return order `returnFocusRef` → trigger → previously focused. Verify with unit tests of the open and close handlers, including a consumer `preventDefault()`.
- [x] 2.6 Write `hooks/use-modal-warnings.ts` (`useMissingTexts` checks: a missing `ModalTitle`, `closeButton` without `closeLabel`). Verify with unit tests that each warning starts with `Modal:`, is logged once, and that nothing is logged when everything is given.

## 3. Components

- [x] 3.1 Write `modal.tsx` (the root provider: `useControllableState`, the reason-aware `setOpen`, ids, `triggerRef`, the parent context) and `components/modal-trigger.tsx` and `components/modal-close.tsx` (`Slot` with `asChild`). Verify with unit tests:
  - controlled and uncontrolled, `defaultOpen`;
  - `onOpenChange` with `"trigger"` and `"close"`;
  - the trigger's `aria-haspopup`, `aria-expanded` and `aria-controls`;
  - `useModal().close()` and `setOpen`.
- [x] 3.2 Write `utils/modal-classes.ts` (design decision 5: the shadcn dialog and drawer content classes with their source named, the `size` map, the body, header and footer layout, safe area, `motion-reduce`). Verify with a unit test that checks the main tokens and that `size` only adds dialog width classes.
- [x] 3.3 Write `components/modal-sections.tsx`:
  - `ModalHeader`, `ModalBody` and `ModalFooter`, with `asChild`;
  - `ModalTitle` and `ModalDescription`, which choose the shadcn part for the mode and register in the panel context, with `visuallyHidden`.

  Verify with unit tests:
  - the title names the dialog in both modes;
  - with `visuallyHidden` the name stays;
  - `aria-describedby` exists only with a description;
  - each section has a `data-slot`.
- [x] 3.4 Write `components/modal-close-button.tsx` (the X named by `closeLabel`, 44 px on coarse pointers). Verify with a unit test that it closes with `"close-button"` and has no text of its own.
- [x] 3.5 Write `components/modal-dialog-view.tsx` and `components/modal-drawer-view.tsx`:
  - each with its root, portal (`container`), overlay (`overlayClassName`), primitive content, the dismiss, focus and `onOpenChangeComplete` wrappers (design decision 8), `data-mode` and `data-size`;
  - the drawer view also has the handle (`drawerHandle`, `handleClassName`, `aria-hidden`), `autoFocus`, the drawer options, and `NestedRoot` when nested.

  Write `components/modal-content.tsx` to choose between them. Verify with a smoke render of both views and `typecheck`.
- [x] 3.6 Write `components/index.ts`, `hooks/index.ts`, `utils/index.ts` and the public `index.ts` (all parts, `useModal` and the types). Verify that `pnpm build` emits `dist/components/modal/index.js` and `index.d.ts`.

## 4. Modal tests (`modal/tests/`)

- [x] 4.1 `render-modal.tsx`: the render helper, the settable `matchMedia` mock and a fake-timer helper for the animation fallback. Verify that it is used by the tests below and is not built.
- [x] 4.2 `modal-mode-tests.tsx`. Verify the spec scenarios "Wide viewport", "Narrow viewport", "Custom breakpoint", "Forced mode", "Viewport crosses the breakpoint while open" (the trigger is the same DOM node), "Locked mode while open" and "No media queries".
- [x] 4.3 `modal-state-tests.tsx`. Verify:
  - "Uncontrolled modal", "Controlled modal ignores requests", "Close from inside the content" and "After the close animation" (fallback timer);
  - each `reason` in each mode.
- [x] 4.4 `modal-dismiss-tests.tsx`. Verify:
  - "Swipe off, Escape still closes" (the Escape and overlay paths), "Outside press off in both modes" and "Non-modal keeps Escape";
  - the consumer's `onEscapeKeyDown`/`onInteractOutside` calling `preventDefault()`.
- [x] 4.5 `modal-a11y-tests.tsx`. Verify:
  - "Focus returns to the trigger", "Initial focus target", "Escape prevented by the consumer", "Named close button", "No close button by default", "Hidden title" and "No description";
  - focus moves into the drawer too.
- [x] 4.6 `modal-independence-tests.tsx`. Verify the "Independent modal props" scenario and every pair it lists.
- [x] 4.7 `modal-nested-tests.tsx`. Verify "Close the nested modal" in both modes.
- [x] 4.8 `modal-types-tests.tsx`, with `@ts-expect-error` for `closeButton` without `closeLabel` and `closeLabel` without `closeButton`, plus positive cases for `closeButton={flag}` with a label. Verify with `typecheck`.
- [x] 4.9 Run `src/no-default-texts-tests.ts`. Verify that it passes with the modal sources and no new allowlist entry.

## 5. Stories and documentation

- [x] 5.1 Write `apps/storybook/src/stories/components/overlays/modal/modal-stories.tsx` (title `components/Overlays/Modal`). Verify that every story passes `pnpm --filter @aureus-core/storybook test` with axe. Stories, with `play` functions that use `within(document.body)`:
  - `Playground`: every `Modal`/`ModalContent` prop, grouped Content, Appearance, State, Behavior and Events, with `fn()` callbacks;
  - `Sizes`;
  - `ForcedModes`;
  - `Responsive`: mobile and desktop viewports;
  - `WithForm`: zod + `FormProvider` + `TextControl`, `lockModeWhileOpen`, reset in `onOpenChangeComplete`;
  - `Controlled`: the reason shown in the story;
  - `DismissOptions`;
  - `LongContent`: the body scrolls, the header and footer stay;
  - `Nested`;
  - `DrawerSnapPoints`;
  - `DrawerDirections`;
  - `HiddenTitle`;
  - `UseModalHook`.

  The `play` functions check that focus enters and returns to the trigger, that Escape closes, that the X is named, that the dismissal props are respected, and that swipe closes in drawer mode.
- [x] 5.2 Write `modal-docs.ts` with `defineComponentDocs`:
  - `name`, `importPath`, every export, `primitive` (Radix Dialog and Vaul);
  - the `api` of each part with types and defaults;
  - the stories, `keyboard` (`Enter / Space`, `Tab`, `Shift+Tab`, `Esc`) and links;
  - complete `en` and `es` prose: summary, whenToUse, whenNotToUse, anatomy of each part, every prop, and `aria` notes on the title, `visuallyHidden`, `closeLabel` and live mode switches.

  Verify that the docs coverage test passes and that the page renders in both locales.
- [x] 5.3 Update CONTRIBUTING.md with an "Overlays" section:
  - the root provider and the panel that picks the primitive;
  - the own trigger and close;
  - why shadcn's `DialogContent`/`DrawerContent` are not used;
  - `useMediaQuery`;
  - the folder layout.

  Also add `modal` to the README component list, with an example. Verify that `pnpm lint` passes.
- [x] 5.4 Add `.changeset/add-modal.md` (`@aureus-core/ui`: `minor`). Verify that `pnpm changeset status` lists it.

## 6. Verification

- [x] 6.1 Run `pnpm lint`, `pnpm typecheck`, `pnpm test` (unit, the text guard, and the Chromium stories with axe), `pnpm build` and `pnpm check:package`. Verify that every command exits 0, that `check:package` reports 31 custom components, and record the test counts.
- [x] 6.2 In the built Storybook, check by hand:
  - resize across 768 px while open, with and without `lockModeWhileOpen`;
  - touch-emulated swipe and snap points;
  - after each kind of close, page scroll and `pointer-events` come back;
  - light, dark and RTL, at 320 px.

  Verify by reviewing screenshots. Fix any problem and re-run 6.1.
