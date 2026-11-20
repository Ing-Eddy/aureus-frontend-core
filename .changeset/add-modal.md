---
"@aureus-core/ui": minor
---

Add `Modal` (`@aureus-core/ui/components/modal`): a centred dialog on wide viewports and a bottom drawer below a breakpoint.

- **Compound parts.** `Modal` (state and behaviour, no element), `ModalTrigger`, `ModalContent` (the panel), `ModalHeader`, `ModalTitle`, `ModalDescription`, `ModalBody` (scrolls on its own), `ModalFooter`, `ModalClose`, and the `useModal()` hook (`open`, `mode`, `setOpen`, `close`).
- **Mode.** `mode` (`"responsive"`, `"dialog"` or `"drawer"`), `breakpoint` (768 px), `lockModeWhileOpen` and `onModeChange`. A mode change remounts only the panel; the trigger keeps its node. Without `matchMedia` the modal is a dialog.
- **State.** `open` / `defaultOpen`, `onOpenChange(open, { reason })` with `trigger`, `close`, `close-button`, `escape-key`, `outside-press` or `swipe`, and `onOpenChangeComplete` after the animation.
- **Independent dismissal.** `closeOnEscape`, `closeOnOutsidePress`, `closeOnSwipe` and `modal`, the same in both modes.
- **Panel.** `size` (dialog width), `drawerHandle`, `initialFocusRef`, `returnFocusRef`, the Radix focus and dismiss events, `container`, and class names for the panel, overlay, close button and handle. Drawer options on the root: `drawerDirection`, snap points, drag and release callbacks, `drawerHandleOnly`, `drawerScaleBackground` and `drawerRepositionInputs`. Nested modals stack.
- **No default texts.** `ModalTitle` names the dialog (`visuallyHidden` keeps the name without showing it); the close button is opt-in and `closeButton` requires `closeLabel`. Development warnings name a panel without a title and a close button without its label.
- Internal: a shared `useMediaQuery` hook; the field stepper's touch layout uses it, with no change in behaviour.
