## ADDED Requirements

### Requirement: Status colors
The package stylesheet SHALL define `--success`, `--warning` and `--info` in a `:root` block followed by a `.dark` block, and map them to the Tailwind colors `success`, `warning` and `info`. Danger uses `--destructive`. In both modes each status color, `--destructive` included, MUST reach at least 4.5:1 on `--popover` and on a 10% tint of itself over `--popover`.

#### Scenario: Re-themed status
- **WHEN** an app redefines `--success` after the package stylesheet
- **THEN** success toasts use the app's color
