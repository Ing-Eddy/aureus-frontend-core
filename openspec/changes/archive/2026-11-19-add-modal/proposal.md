## Why

Apps need one overlay that is a centred dialog on large screens and a bottom drawer on phones. The package ships both halves (`shadcn/dialog` on Radix, `shadcn/drawer` on Vaul), but every app would have to rebuild the switch, and the obvious version has problems:

- **Hard-coded text:** shadcn's `DialogContent` renders a fixed English `sr-only "Close"`, which breaks the library rule that no component ships texts.
- **Lost focus and state:** swapping `Dialog` for `Drawer` when the viewport crosses the breakpoint remounts the consumer's trigger and content.
- **Different dismissal rules:** Vaul's `dismissible` blocks drag, Escape and outside press together, while Radix has separate handlers. The same props would not mean the same thing in both modes.

## What Changes

- **New `Modal`** (`@aureus-core/ui/components/modal`), a compound API:
  - `Modal` is the root. It holds the open state, the mode and the behaviour, and renders no DOM.
  - `ModalTrigger` and `ModalClose` open and close it.
  - `ModalContent` is the panel. It is the only piece that mounts Radix `Dialog` or Vaul `Drawer`.
  - The sections are `ModalHeader`, `ModalTitle`, `ModalDescription`, `ModalBody` (it scrolls on its own) and `ModalFooter`.
  - The `useModal()` hook returns `{ open, mode, setOpen, close }`.
- **Responsive mode:**
  - `mode` is `"responsive"` (default), `"dialog"` or `"drawer"`.
  - `breakpoint` (px, default `768`): at or above it the panel is a dialog, below it a drawer.
  - `lockModeWhileOpen` keeps the mode while the modal is open, so the content does not remount.
  - `onModeChange` reports each switch.
  - Without `matchMedia` (SSR, tests) the mode is `dialog`.
- **State and callbacks:**
  - `open` / `defaultOpen` (default `false`).
  - `onOpenChange(open, { reason })`, where `reason` is one of `trigger`, `close`, `close-button`, `escape-key`, `outside-press` or `swipe`.
  - `onOpenChangeComplete(open)`, called after the animation ends.
- **Independent dismissal**, the same in both modes: `closeOnEscape`, `closeOnOutsidePress` and `closeOnSwipe` (drawer only), each default `true`, plus `modal` (default `true`).
- **Panel:**
  - `size` (`sm` default … `full`) sets the dialog width only.
  - `drawerHandle` (default `true`) shows a decorative handle.
  - Focus: `initialFocusRef` and `returnFocusRef`.
  - The Radix focus and dismiss events, in both modes.
  - `container`, and class names for the panel, the overlay, the close button and the handle.
  - `data-mode` and `data-size` attributes.
- **Drawer options on the root:** `drawerDirection` (default `bottom`), snap points (controlled or not), drag and release callbacks, `drawerHandleOnly`, `drawerScaleBackground` and `drawerRepositionInputs`.
- **Nesting:** a `Modal` inside another `ModalContent` stacks. In drawer mode it uses Vaul's `NestedRoot`.
- **No default texts:**
  - The close button is opt-in. `closeButton: true` requires `closeLabel` in TypeScript.
  - Title and description are the consumer's nodes; `visuallyHidden` keeps the accessible name without showing it.
  - Development warnings cover a missing `ModalTitle` or `closeLabel`. A piece outside `Modal` throws a development error.
- **Internal:** a shared `useMediaQuery` in `src/internal/hooks`. The field stepper's `useStepperLayout` moves onto it with no behaviour change.
- **Documentation:**
  - a bilingual (EN/ES) Storybook page and stories under `components/Overlays/Modal`;
  - an "Overlays" section in CONTRIBUTING;
  - README;
  - JSDoc;
  - a `minor` changeset.

Non-goals:

- A props-only shortcut component.
- An alert-dialog role: `shadcn/alert-dialog` covers it.
- Side sheets on desktop (`shadcn/sheet`).
- New dependencies.
- Changing existing components' behaviour.

## Capabilities

### New Capabilities

- `overlays`: the responsive modal:
  - choosing the mode;
  - state and close reasons;
  - independent dismissal;
  - focus;
  - layout;
  - nesting;
  - no default texts;
  - accessibility.

### Modified Capabilities

_None._ The `useStepperLayout` refactor keeps the `form-fields` behaviour unchanged.

## Impact

- **New code:**
  - `packages/ui/src/components/modal/` (`components/`, `hooks/`, `types/`, `utils/`, `tests/`);
  - `packages/ui/src/internal/hooks/use-media-query.ts`.
- **Changed code:** `internal/components/field-stepper/hooks/use-stepper-layout.ts` uses `useMediaQuery`.
- **Reused:**
  - `internal/hooks`: `useControllableState` and `useMissingTexts`;
  - shadcn's `DialogPortal`, `DialogOverlay`, `DialogTitle`, `DialogDescription`, the matching `Drawer*` parts and `Button`;
  - the `Dialog` primitive from `radix-ui` and the `Drawer` primitive from `vaul` for the panel. Both are already dependencies.
- **Storybook:** a new `apps/storybook/src/stories/components/overlays/` category folder.
- **Package:** one new public entry point.
- **Release:** a `minor` changeset.
