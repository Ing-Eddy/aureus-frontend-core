## ADDED Requirements

### Requirement: Public entry point
`@aureus-core/ui/components/toast` SHALL export `Toaster`, `toast` and their types. `toast` MUST be callable outside React.

#### Scenario: Call before the Toaster is mounted
- **WHEN** `toast.success("Saved")` runs before any `Toaster` is mounted
- **THEN** the toast appears when a `Toaster` mounts

### Requirement: Statuses and layout
`toast` SHALL offer `neutral`, `success`, `info`, `warning`, `danger` and `loading`, each taking a title and options and returning the toast id. A toast SHALL show a status icon, the title and, when given, the description. `neutral` has no icon. `icon` replaces it and `icon={false}` hides it. `iconLabel` names the status for screen readers only.

#### Scenario: Success toast
- **WHEN** `toast.success("Saved", { description: "A copy was sent" })` is called
- **THEN** a toast with `data-type="success"`, the success icon, the title and the description is shown

#### Scenario: Replace by id
- **WHEN** a status method is called with the id of a visible toast
- **THEN** that toast is replaced, keeping none of its previous options

### Requirement: Update, dismiss and promise
`toast.update(id, patch)` SHALL merge the patch into the toast, `toast.dismiss(id?)` SHALL close one or all, and `toast.promise(promise, { loading, success, danger })` SHALL show a loading toast that becomes success or danger, returning its id without rejecting.

#### Scenario: Failed promise
- **WHEN** the promise rejects
- **THEN** the toast becomes a `danger` toast with the `danger` texts, and no unhandled rejection is produced

### Requirement: Duration and priority
A toast SHALL last the Toaster's `duration` (default 5000 ms) unless it sets its own; `Infinity` keeps it open. `priority` SHALL default to `"low"` for every status. `toast.custom` SHALL default to `Infinity`.

#### Scenario: Persistent toast
- **WHEN** a toast has `duration: Infinity`
- **THEN** it stays until it is dismissed

### Requirement: Click and actions
`onClick` SHALL make the notification clickable by pointer and keyboard, without nesting interactive elements. Clicks on controls, text selections and drags MUST NOT trigger it. Each action SHALL render a button. A click or an action closes the toast unless `keepOpenOnClick` or `keepOpen` is set.

#### Scenario: Keyboard activation
- **WHEN** the title of a clickable toast is focused and Enter is pressed
- **THEN** `onClick` is called once and the toast closes

#### Scenario: Action inside a clickable toast
- **WHEN** an action button of a clickable toast is pressed
- **THEN** only the action runs

### Requirement: Custom content
`content` SHALL render below the description; `toast.custom` SHALL replace the whole layout and require `aria-label`. Both receive `{ id, dismiss, update }` and MUST NOT start a swipe.

#### Scenario: Questionnaire
- **WHEN** a radio button inside `content` is chosen and the form calls `toast.success(title, { id })`
- **THEN** the same toast becomes the success toast

### Requirement: Expandable description
With `expandable`, an overflowing description SHALL be clamped to `lines` (default 2) with a button that expands and collapses it. The button MUST appear only when the text overflows and expose `aria-expanded`. An expanded toast MUST NOT close by itself; collapsing restarts its duration. Without both texts, the description is shown in full and a development warning is logged.

#### Scenario: Short text
- **WHEN** an expandable toast has a one-line description
- **THEN** no expand button is shown

### Requirement: Toaster configuration
`<Toaster>` SHALL require `label` and accept `position` (default `bottom-end`), `duration`, `limit` (default 3), `appearance` (default `card`), `closeButton` with `closeLabel`, `expandable`, `icons` and `className`. Every option MUST be independent of the others.

#### Scenario: Appearance per toast
- **WHEN** the Toaster uses `card` and one toast sets `appearance: "tinted"`
- **THEN** only that toast is tinted

### Requirement: No default texts and accessibility
The component MUST NOT render any text of its own, in any language; TypeScript MUST require the texts a feature needs. The region SHALL be reachable with F6, Escape SHALL close the focused toast, and every story MUST pass the automated accessibility checks.

#### Scenario: Close button without its label
- **WHEN** `<Toaster label="Notifications" closeButton />` is type-checked
- **THEN** it is a type error
