## Why

The form family (ten field/control pairs plus the shared `src/internal` pieces) was built over ten iterations, and its rules matured along the way:

- "no default texts" started with Select;
- typed callbacks through overloads started with Checkbox;
- RTL stories started with Switch.

The early families still ship English defaults through `fieldStrings`:

- "Loading" and "More information" (inherited by **every** field);
- "Show/Hide password";
- "Increase/Decrease";
- the character counter;
- "minus";
- "Invalid expression" and "Calculated from".

Story coverage, duplicated helpers, docs and naming are also uneven across the families.

The library promises that every text is the developer's. This change makes that true everywhere, and reviews the whole family for good practices, responsive design, accessibility, coherence, tests, documentation and Storybook, before the package is first published (it is at `0.0.0`).

## What Changes

- **Audit:** a structured review of the 20 public components and the shared internals, recorded in `audit.md` inside this change. It covers texts, code practices, API coherence, responsive and RTL behaviour, accessibility, tests, docs and stories. Each finding has a severity, a location and a fix. Findings that change observable behaviour are added to this change's specs, through an artifact update, before they are fixed.
- **BREAKING:** no component ships default texts any more. `fieldStrings` is removed.
  - Texts a feature needs become **required by TypeScript when the feature is on**, with a development warning for untyped code:
    - `loadingLabel` with `loading`;
    - `infoLabel` with `info`;
    - `showPasswordLabel` and `hidePasswordLabel` on the password field (its toggle is always present);
    - `countLabel` with `showCount` on the text area, now one function `(count, maxLength?) => string` that replaces the two default texts;
    - `incrementLabel` and `decrementLabel` on the number field unless `stepper={false}`;
    - `invalidExpressionLabel` and `calculatedFromLabel` with `expressions`.
  - **BREAKING:** `minusLabel` is removed from the number field. `aria-valuetext` now uses the `Intl`-formatted number, including its minus sign, which screen readers read in their own language.
  - Developer-facing messages (console warnings, provider errors) stay as they are.
- **Guard test:** a source scan fails when a component or shared internal ships a hard-coded user-facing text.
- **Consistency fixes from the audit:**
  - shared helpers instead of duplicated ones (`DistributiveOmit` and the parity serializer);
  - the same minimum set of stories in every family, including `Rtl` and `Keyboard` stories where they are missing;
  - aligned names, `data-slot` values, warning formats and docs;
  - any further approved findings.
- **Documentation:**
  - the 20 docs pages (EN/ES) list the now-required texts and drop every "defaults to" text;
  - the guide generalises the "messages are the developer's" section to the whole family;
  - CONTRIBUTING states the library-wide rule and the guard test;
  - README;
  - a changeset describing the migration.

## Capabilities

### New Capabilities

_None._

### Modified Capabilities

- `form-fields`:
  - **modifies** the loading state, info tooltip, password visibility toggle, character counter, negative numbers, stepper buttons and number input conveniences requirements, which no longer have default texts;
  - **adds** a family-wide "no default texts" requirement;
  - **adds** a family-wide "consistent development warnings" requirement (accessible-name warnings in every field, one unknown-value wording, the field's name on action warnings), from the audit.
  - **adds** a family-wide "right-to-left layout" requirement, from a defect found while adding the `Rtl` stories (the radio group was forced to left to right).

## Impact

- **Public API (breaking, pre-1.0):**
  - new required props on every field when `loading` or `info` is used;
  - always on the password field;
  - on the number field when the stepper (on by default) or `expressions` is used;
  - on the text area with `showCount`;
  - `countLabel` changes signature;
  - `minusLabel` is removed.

  Controls inherit all of this.
- **Code:**
  - `src/internal/utils/constants/field-strings.ts` is removed;
  - `src/internal/types` gains the shared text unions and `DistributiveOmit`;
  - `src/internal/components` (`FieldLoading`, `FieldInfo`, `FieldStepper`) take required labels;
  - every `src/components/*` field and control is updated;
  - a test-only `src/internal/testing` helper is added, excluded from the build.
- **Storybook:** every story and docs page that renders `loading`, `info`, password, stepper or counter features passes the texts. New `Rtl` and `Keyboard` stories are added.
- **Release:** a `minor` changeset (pre-1.0) with a migration section.
