## Context

See proposal.md (Why) for the motivation and specs/overlays/spec.md for the requirements. Facts that shape the approach:

- **shadcn's `DialogContent`** (`src/shadcn/ui/dialog.tsx`, CLI-owned) bundles its own `DialogPortal` and `DialogOverlay`, and with `showCloseButton` (default `true`) it renders `<span className="sr-only">Close</span>`. `DrawerContent` also bundles its portal, overlay and handle. Neither accepts a portal container or overlay classes. The smaller parts (`DialogPortal`, `DialogOverlay`, `DialogTitle`, `DialogDescription`, and their `Drawer*` equivalents) are exported separately.
- **Radix Dialog (`radix-ui` 1.8.1):**
  - On close, focus returns to `context.triggerRef`, which is set only by `Dialog.Trigger`. Without that trigger, focus is lost to `body`.
  - The internal focus handler is composed after the consumer's handler, so calling `preventDefault()` first skips it.
  - Escape and outside press go through `onEscapeKeyDown` / `onPointerDownOutside` / `onInteractOutside` and then `onOpenChange(false)`.
- **Vaul 1.1.2:**
  - `Root` wraps Radix `Dialog.Root`. With `dismissible={false}`, its `onOpenChange` ignores every close request: drag, Escape and outside press alike. The `open` prop still closes it.
  - `autoFocus` defaults to `false`, so `Content` calls `preventDefault()` on `onOpenAutoFocus` and focus does **not** move into the drawer.
  - With `modal={false}`, `Content` prevents every outside press.
  - `onAnimationEnd` and its body-style restore run only when Vaul itself changes the state, not when `open` changes from outside.
  - `NestedRoot` stacks drawers.
- **`useStepperLayout`** (`internal/components/field-stepper/hooks/use-stepper-layout.ts`) already reads a media query with `useSyncExternalStore` and a server snapshot. The modal needs the same thing with another query.
- **Shared hooks:**
  - `useControllableState` (`internal/hooks`) gives the `value` / `defaultValue` / `onChange` pattern with a stable setter.
  - `useMissingTexts` logs `<Component>: <problem>.` once per problem.
- **The guard** `src/no-default-texts-tests.ts` scans `src/components` and `src/internal` for literal visible or accessible texts.
- **Precedent:** custom code already imports primitives directly, e.g. `internal/components/slider-base/slider-base.tsx` and `components/radio-group-field/components/radio-segmented.tsx`.

## Goals / Non-Goals

**Goals:**
- One state, one set of dismissal rules and one focus behaviour for both presentations. The primitive's quirks are absorbed inside `ModalContent`.
- Switching presentation remounts only the panel.
- Zero hard-coded texts, with the guard passing and no allowlist entry.

**Non-Goals:**
- Keeping the panel's internal React state across a presentation switch (`lockModeWhileOpen` is the opt-in answer).
- Drag gestures in dialog mode.
- Animating between the two presentations.

## Decisions

### 1. `Modal` is a context provider; `ModalContent` mounts the primitive

`Modal` renders only `ModalContext.Provider` around its children. The context holds:
- `open` and `setOpen(next, reason)`;
- `mode`;
- the dismissal flags;
- the drawer options;
- the ids (`contentId`, `titleId`, `descriptionId`);
- `triggerRef`;
- the parent context, for nesting.

`ModalContent` reads the context and renders `ModalDialogView` or `ModalDrawerView`, each with its own primitive `Root`, which is controlled by `open`.

- *Alternative:* render the primitive `Root` in `Modal`. Rejected: Radix and Vaul roots differ, so a mode switch would remount the whole subtree, including the consumer's trigger and anything beside the panel.

### 2. Own trigger and close, with manual focus return

- **`ModalTrigger`** is a `button` (or `Slot` from `radix-ui` with `asChild`). It stores its node in `triggerRef`, calls `setOpen(true, "trigger")` on click, and sets `aria-haspopup="dialog"`, `aria-expanded` and, while open, `aria-controls={contentId}`.
- **`ModalClose`** calls `setOpen(false, "close")`.
- **Focus on close.** Because there is no primitive trigger, `ModalContent` wraps `onCloseAutoFocus`. It calls the consumer's handler first. If that handler did not call `preventDefault()`, it calls it, then focuses `returnFocusRef.current ?? triggerRef.current ?? previouslyFocused`. `previouslyFocused` is `document.activeElement`, captured when `open` turns true.
- **Focus on open.** `initialFocusRef` is handled the same way in `onOpenAutoFocus`.
- **Vaul gets `autoFocus`**, so the drawer moves focus like the dialog does.
- *Alternative:* use `DialogTrigger` and `DrawerTrigger`. Rejected: each must live inside its own root, so the trigger would remount on every switch.

### 3. Close reasons recorded at the source

A `reasonRef` in `Modal` holds the pending reason:
- `onEscapeKeyDown` sets `"escape-key"`;
- `onPointerDownOutside` sets `"outside-press"`;
- the built-in close button, `ModalClose` and `useModal` call `setOpen` with their own reason directly.

When the primitive calls its `onOpenChange(false)`, the recorded reason is used and then cleared. In drawer mode, an unrecorded close is `"swipe"`, because Vaul's only other close source is dragging. `setOpen` is the `useControllableState` setter wrapped with the reason, so the controlled and uncontrolled modes behave the same.

### 4. Dismissal implemented by the modal, not by `dismissible`

`ModalContent` handles each way of closing itself, in both views:

- **Escape:** the `onEscapeKeyDown` wrapper calls the consumer's handler, then calls `preventDefault()` when `closeOnEscape` is `false`.
- **Outside press:**
  - The `onPointerDownOutside` wrapper does the same with `closeOnOutsidePress`.
  - The consumer's `onInteractOutside` runs first.
  - In a non-modal drawer, Vaul prevents every outside press, so the wrapper closes it itself with `setOpen(false, "outside-press")` when `closeOnOutsidePress` is on.
- **Swipe:**
  - With `closeOnSwipe={false}`, Vaul gets `dismissible={false}`. That also drops Escape and outside press inside Vaul.
  - The Escape and outside wrappers therefore call `setOpen(false, reason)` themselves, which closes it through `open`.
  - This keeps the three props independent, as the spec requires.

### 5. Panel built from shadcn parts, primitives only for the content

- **Dialog view:** shadcn's `Dialog` (root), `DialogPortal` (with `container`), `DialogOverlay` (with `overlayClassName`), and `Dialog.Content` from `radix-ui` with shadcn's content classes.
- **Drawer view:** the same pattern with Vaul's `Drawer.Root` / `NestedRoot`, shadcn's `DrawerPortal` / `DrawerOverlay`, and Vaul's `Drawer.Content`.
- The class strings are copied once into `modal/utils/modal-classes.ts`, with a comment naming their source.
- `ModalTitle` and `ModalDescription` render shadcn's `DialogTitle` / `DrawerTitle` and `DialogDescription` / `DrawerDescription` for the current mode. With `visuallyHidden`, the classes add `sr-only`.
- *Alternative:* fork `dialog.tsx` and `drawer.tsx` into `src/components`. Rejected: that duplicates the CLI files, which then stop receiving updates. Only the content class strings need copying.

### 6. Title and description registration

Inside the panel, a small `ModalPanelContext` lets `ModalTitle` and `ModalDescription` register on mount (layout effect).

- Without a description, the panel passes `aria-describedby={undefined}`, which also silences the Radix warning.
- Without a title, `useModalWarnings` logs `Modal: ModalContent has no ModalTitle, so the dialog has no accessible name.`
- `closeButton` without `closeLabel` is a discriminated union in the types (`{ closeButton?: false; closeLabel?: never } | { closeButton: boolean; closeLabel: string }`), plus a `useMissingTexts` check for untyped JavaScript.

### 7. `useMediaQuery` in `internal/hooks`

`useMediaQuery(query: string, serverValue: boolean): boolean` uses `useSyncExternalStore`, with `serverValue` both on the server and when `matchMedia` is missing. `useStepperLayout` becomes `useMediaQuery("(pointer: coarse)", false)`.

`useModalMode` computes the mode:
- `mode !== "responsive" ? mode : (useMediaQuery(\`(min-width: ${breakpoint}px)\`, true) ? "dialog" : "drawer")`;
- with `lockModeWhileOpen`, the value is frozen in a ref while `open` is true;
- `onModeChange` is called from an effect when the resolved mode changes.

### 8. `onOpenChangeComplete` from the panel's animation

Vaul's `onAnimationEnd` does not fire for changes that come from `open`, so it is not used. Both views put an `onAnimationEnd` on the panel, filtered to `event.target === event.currentTarget`, which reports the state that just finished. Under `prefers-reduced-motion` the animations are removed (`motion-reduce:animate-none`), so an effect calls the callback right after the state change. A timeout fallback (the longest animation, 500 ms) covers environments without animation events, such as jsdom.

### 9. Nesting

`Modal` reads the parent `ModalContext`. In drawer mode, a nested modal renders Vaul's `NestedRoot`. In dialog mode, Radix layers stack on their own. The mode is computed per modal, so a nested modal with `mode="dialog"` inside a drawer is allowed.

### 10. Folder layout

`components/modal/` keeps only `index.ts` and `modal.tsx` at its root. The rest goes in:
- `components/` (`modal-trigger`, `modal-content`, `modal-dialog-view`, `modal-drawer-view`, `modal-sections`, `modal-close`, `modal-close-button`);
- `hooks/` (`use-modal`, `use-modal-mode`, `use-modal-dismiss`, `use-modal-focus`, `use-modal-warnings`);
- `types/`;
- `utils/` (`modal-classes`);
- `tests/`.

Each folder except `tests/` has an `index.ts`. `useMediaQuery` goes in `internal/hooks` because it has two consumers.

## Risks / Trade-offs

- **[Copied shadcn classes drift after `shadcn:update`]** → `modal-classes.ts` names its source. A test checks the main tokens (`bg-popover`, `rounded-xl`, the drawer's direction data attributes) so a visible diff is noticed when updating.
- **[Panel state is lost on a live mode switch]** → This is documented in the docs `whenToUse` and props notes. `lockModeWhileOpen` prevents it, and form state belongs in react-hook-form above the panel.
- **[Vaul's body-style restore is skipped when the drawer closes from `open`]** → Verified in Chromium: after Escape, outside press, `ModalClose`, the close button and swipe, page scroll and `pointer-events` come back.
- **[A non-modal drawer leaves the page without pointer events]** → Vaul does not pass `modal` to Radix, and only restores `pointer-events` when it changes the state itself. The drawer view sets them back to `auto` while a non-modal drawer is open; Radix restores the previous value on close. Known limitation: Vaul still hides the page from assistive technology and keeps keyboard focus in a non-modal drawer. This is documented in the docs `aria` notes.
- **[jsdom has no animations or `matchMedia`]** → The test helper `render-modal.tsx` mocks `matchMedia` with a settable width. Animation-dependent behaviour (swipe, snap points, `onOpenChangeComplete` timing) is checked in Storybook `play` functions in Chromium.
- **[`autoFocus` on Vaul could fight mobile keyboards]** → Focus goes to the first focusable element, as in the dialog. Consumers can call `preventDefault()` in `onOpenAutoFocus` and focus the panel instead.
