## Purpose

Defines the behaviour, accessibility and text contract of the overlay components in `@aureus-core/ui`, starting with `Modal`: a modal that is a centred dialog on wide viewports and a drawer on narrow ones, fully controllable and without default texts.

## ADDED Requirements

### Requirement: Compound modal parts
`@aureus-core/ui/components/modal` SHALL export these parts:
- `Modal`: the root. It holds the state and behaviour and renders no element of its own.
- `ModalTrigger` and `ModalClose`.
- `ModalContent`: the panel.
- The sections `ModalHeader`, `ModalTitle`, `ModalDescription`, `ModalBody` and `ModalFooter`.
- The `useModal()` hook.

`ModalTrigger`, `ModalClose`, `ModalHeader`, `ModalTitle`, `ModalDescription`, `ModalBody` and `ModalFooter` MUST accept `asChild`, so the consumer's own element can be rendered instead. Every part that renders an element MUST accept `className` and pass other HTML attributes through to that element.

A part or `useModal()` used outside a `Modal` MUST throw an error that names the part.

#### Scenario: Trigger with the consumer's button
- **WHEN** `<ModalTrigger asChild><Button>Edit</Button></ModalTrigger>` is rendered inside a `Modal`
- **THEN** only the consumer's button is rendered, and clicking it opens the modal

#### Scenario: Part outside the root
- **WHEN** `ModalContent` is rendered without a surrounding `Modal`
- **THEN** rendering throws an error that names `ModalContent` and says it must be used inside `Modal`

### Requirement: Responsive mode
The modal SHALL present the panel as a **dialog** (centred) or as a **drawer** (attached to a viewport edge). `mode` decides which:

- `"responsive"` (default): a dialog when the viewport is at least `breakpoint` CSS pixels wide (default `768`), and a drawer below that.
- `"dialog"` or `"drawer"`: always that presentation.

When the viewport width cannot be measured (server rendering, environments without media queries), a responsive modal MUST present a dialog. A responsive modal MUST follow viewport changes while it is open. With `lockModeWhileOpen`, it keeps the presentation it had when it opened until it closes, and then takes the current one. `onModeChange(mode)` MUST be called whenever the presentation changes. `useModal()` MUST return the current presentation as `mode`, and the panel MUST expose it as `data-mode`.

Changing the presentation MUST NOT remount or replace the trigger, or any part rendered outside `ModalContent`.

#### Scenario: Wide viewport
- **WHEN** a `Modal` with default props is opened in a viewport 1024 px wide
- **THEN** the panel is a centred dialog with `data-mode="dialog"`

#### Scenario: Narrow viewport
- **WHEN** a `Modal` with default props is opened in a viewport 375 px wide
- **THEN** the panel is a drawer attached to the bottom edge, with `data-mode="drawer"`

#### Scenario: Custom breakpoint
- **WHEN** a `Modal` with `breakpoint={1024}` is opened in a viewport 900 px wide
- **THEN** the panel is a drawer

#### Scenario: Forced mode
- **WHEN** a `Modal` with `mode="drawer"` is opened in a viewport 1440 px wide
- **THEN** the panel is a drawer

#### Scenario: Viewport crosses the breakpoint while open
- **WHEN** an open responsive `Modal` is in a 1024 px viewport that shrinks to 600 px
- **THEN** the panel becomes a drawer, the modal stays open, `onModeChange` is called with `"drawer"`, and the trigger element is the same DOM node as before

#### Scenario: Locked mode while open
- **WHEN** an open `Modal` with `lockModeWhileOpen` is in a 1024 px viewport that shrinks to 600 px
- **THEN** the panel stays a dialog until the modal closes, and the next opening presents a drawer

#### Scenario: No media queries
- **WHEN** a responsive `Modal` is rendered where `matchMedia` is unavailable
- **THEN** it presents a dialog

### Requirement: Open state and close reasons
The open state SHALL be controllable through `open` with `onOpenChange`, or uncontrolled with `defaultOpen` (default `false`). Every requested change MUST call `onOpenChange(open, { reason })` in both modes. The reasons are:
- `"trigger"`: `ModalTrigger` activated;
- `"close"`: `ModalClose` or `useModal().close()` / `setOpen(false)`;
- `"close-button"`: the built-in close button;
- `"escape-key"`;
- `"outside-press"`: a press outside the panel;
- `"swipe"`: dragging the drawer closed.

When controlled, the modal MUST NOT open or close until `open` changes. `onOpenChangeComplete(open)` MUST be called once after the opening or closing animation ends (immediately when motion is reduced).

#### Scenario: Uncontrolled modal
- **WHEN** a `Modal` without `open` has its trigger clicked, and then Escape is pressed
- **THEN** it opens and then closes, and `onOpenChange` receives `(true, { reason: "trigger" })` and then `(false, { reason: "escape-key" })`

#### Scenario: Controlled modal ignores requests
- **WHEN** a `Modal` with `open={true}` and an `onOpenChange` that does not update `open` receives an Escape press
- **THEN** `onOpenChange` is called with `false` and the modal stays open

#### Scenario: Close from inside the content
- **WHEN** a component inside `ModalContent` calls `useModal().close()`
- **THEN** the modal closes and `onOpenChange` receives `(false, { reason: "close" })`

#### Scenario: After the close animation
- **WHEN** an open `Modal` with `onOpenChangeComplete` closes
- **THEN** `onOpenChangeComplete(false)` is called once, after the panel has left the screen

### Requirement: Independent dismissal
`closeOnEscape`, `closeOnOutsidePress` and `closeOnSwipe` SHALL each default to `true` and act independently. Turning one off MUST disable only that way of closing, in both modes. `closeOnSwipe` applies only to the drawer.

`modal` (default `true`) controls the backdrop:
- with `true`, an overlay is shown, page scroll is locked and the content behind is inert;
- with `false`, there is no overlay, the page stays interactive and scrollable, and the dismissal props keep their values.

#### Scenario: Swipe off, Escape still closes
- **WHEN** a drawer-mode `Modal` has `closeOnSwipe={false}`
- **THEN** dragging the drawer down does not close it, while Escape and a press on the overlay still close it

#### Scenario: Outside press off in both modes
- **WHEN** a `Modal` with `closeOnOutsidePress={false}` is open in dialog mode, and then in drawer mode
- **THEN** pressing the overlay never closes it, and Escape always does

#### Scenario: Non-modal keeps Escape
- **WHEN** a `Modal` with `modal={false}` is open
- **THEN** no overlay is shown, the page behind can be clicked, and Escape still closes the modal

### Requirement: Focus management
When the modal opens, focus SHALL move into the panel:
- to the element in `initialFocusRef` when given;
- otherwise to the first focusable element.

While the modal is open, focus MUST stay inside the panel, unless `modal={false}`.

When the modal closes, focus MUST return:
- to the element in `returnFocusRef` when given;
- otherwise to the trigger;
- otherwise to the element that had focus before opening.

`onOpenAutoFocus`, `onCloseAutoFocus`, `onEscapeKeyDown` and `onInteractOutside` on `ModalContent` MUST be called in both modes, and calling `preventDefault()` on their event MUST cancel the default behaviour (moving focus, returning focus, or closing).

#### Scenario: Focus returns to the trigger
- **WHEN** a user opens a `Modal` with its trigger and closes it with Escape
- **THEN** focus moves into the panel on open and returns to the trigger on close

#### Scenario: Initial focus target
- **WHEN** a `Modal` whose `ModalContent` has `initialFocusRef` pointing to its second input is opened
- **THEN** that input receives focus

#### Scenario: Escape prevented by the consumer
- **WHEN** `ModalContent` has `onEscapeKeyDown={(e) => e.preventDefault()}` and Escape is pressed
- **THEN** the modal stays open

### Requirement: Panel layout and appearance
The panel SHALL be laid out as a column:
- `ModalHeader` and `ModalFooter` stay in place;
- `ModalBody` scrolls on its own when the content is taller than the panel;
- the panel never exceeds the viewport.

`size` (`"sm"` default, `"md"`, `"lg"`, `"xl"`, `"full"`) MUST set the dialog's width and expose `data-size`. It MUST NOT change the drawer.

`drawerDirection` (default `"bottom"`) MUST choose the drawer's edge. `drawerHandle` (default `true`) MUST show a decorative handle on top and bottom drawers, hidden from assistive technology.

In a dialog, the footer lays its actions out in a row at the inline end; in a drawer, it stacks them. The drawer MUST respect the device's safe-area inset. Animations MUST be removed when the user prefers reduced motion.

`ModalContent` MUST accept class names for the panel, the overlay, the close button and the handle, merged after the defaults, and a `container` for the portal (default `document.body`).

#### Scenario: Long content scrolls in the body
- **WHEN** a `Modal` whose `ModalBody` is taller than the viewport is opened
- **THEN** the body scrolls, while the header and footer stay visible

#### Scenario: Size does not affect the drawer
- **WHEN** a drawer-mode `Modal` has `size="xl"`
- **THEN** the drawer has the same width as with `size="sm"`

#### Scenario: Side drawer
- **WHEN** a drawer-mode `Modal` has `drawerDirection="right"`
- **THEN** the drawer is attached to the right edge and shows no handle

### Requirement: Drawer options
The root SHALL forward these drawer options to the drawer and ignore them in dialog mode:
- snap points (`drawerSnapPoints`, with `drawerActiveSnapPoint` / `onDrawerActiveSnapPointChange` controlled or not);
- `onDrawerDrag` and `onDrawerRelease`;
- `drawerHandleOnly` (default `false`): drag only from the handle;
- `drawerScaleBackground` (default `false`);
- `drawerRepositionInputs` (default `true`).

#### Scenario: Snap points
- **WHEN** a drawer-mode `Modal` with `drawerSnapPoints={[0.5, 1]}` is opened
- **THEN** the drawer rests at half height, can be dragged to full height, and `onDrawerActiveSnapPointChange` is called with `1`

#### Scenario: Ignored in dialog mode
- **WHEN** a dialog-mode `Modal` has `drawerSnapPoints` and `drawerDirection="top"`
- **THEN** the dialog renders exactly as without them

### Requirement: Nested modals
A `Modal` rendered inside another modal's `ModalContent` SHALL open above its parent. Closing it MUST close only the nested modal and MUST return focus inside the parent. In drawer mode, the parent drawer MUST react as a stacked drawer.

#### Scenario: Close the nested modal
- **WHEN** a nested `Modal` is open above its parent and Escape is pressed once
- **THEN** only the nested modal closes, the parent stays open, and focus returns to the nested modal's trigger

### Requirement: Modal texts and accessible names
The modal SHALL NOT render any text of its own, visible or accessible.

- The panel MUST have the dialog role and MUST be named by `ModalTitle`. A `ModalTitle` with `visuallyHidden` MUST stay the accessible name without being visible.
- When a `ModalDescription` is present, it MUST be the panel's accessible description. When there is none, the panel MUST have no `aria-describedby`.
- The close button is opt-in: `closeButton` (default `false`) MUST require `closeLabel` in TypeScript, and `closeLabel` becomes the button's accessible name. Its touch target MUST be at least 44 px on coarse pointers.
- In development, a warning starting with `Modal:` MUST name each problem once: a `ModalContent` without a `ModalTitle`, and `closeButton` without `closeLabel`.
- `ModalTrigger` MUST expose `aria-haspopup="dialog"`, `aria-expanded` and `aria-controls` pointing to the panel while it is open.

#### Scenario: Named close button
- **WHEN** `ModalContent` has `closeButton` and `closeLabel="Cerrar"`
- **THEN** a close button named "Cerrar" is shown, and activating it closes the modal with reason `"close-button"`

#### Scenario: No close button by default
- **WHEN** `ModalContent` has no `closeButton`
- **THEN** no close button is rendered, and the page contains no text the consumer did not pass

#### Scenario: Close button without its text
- **WHEN** a TypeScript consumer passes `closeButton` without `closeLabel`
- **THEN** type checking fails, and in untyped code a development warning names `closeLabel`

#### Scenario: Hidden title
- **WHEN** `<ModalTitle visuallyHidden>Filtros</ModalTitle>` is rendered
- **THEN** the title is not visible and the dialog's accessible name is "Filtros"

#### Scenario: No description
- **WHEN** `ModalContent` has a title and no `ModalDescription`
- **THEN** the dialog has no `aria-describedby`, and no warning about a missing description is logged

### Requirement: Independent modal props
Every configurable behaviour of the modal SHALL be its own opt-in prop with a neutral default. No prop may change another prop's default. Each of these MUST hold:
- `closeButton` does not change the dismissal rules;
- `modal={false}` does not change `closeOnEscape` or `closeOnOutsidePress`;
- `mode` does not change `drawerDirection`;
- `size` does not change the drawer;
- `visuallyHidden` on the title does not hide the description;
- `lockModeWhileOpen` does not change `breakpoint`.

#### Scenario: Close button keeps dismissal
- **WHEN** a `Modal` has a `ModalContent` with `closeButton` and `closeLabel`, and no other props
- **THEN** Escape, outside press and swipe still close it
