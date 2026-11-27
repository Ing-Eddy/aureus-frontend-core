## ADDED Requirements

### Requirement: Toasts over a modal
A pointer press or focus move inside the toaster SHALL NOT dismiss a `Modal`, whatever `closeOnOutsidePress` is, and a toast SHALL stay clickable while a modal dialog is open.

#### Scenario: Press a toast action over a modal
- **WHEN** an open `Modal` has a toast above it and the toast's action is pressed
- **THEN** the action runs and the modal stays open
