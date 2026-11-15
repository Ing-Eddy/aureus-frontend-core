## Why

The form family has text, password, multi-line and number inputs, but no way to pick from a list. Choosing one or several values (a country, a currency, tags, accounts) is one of the most common form tasks. Without a family member for it, apps would mix shadcn's Select (single only, its own look) with ad-hoc multi-selects. A select pair on the shared field base gives a consistent, accessible single and multiple selection.

It also introduces the rule that a component ships **no default messages**. The developer provides every text for its situation, and a feature that needs a text cannot be enabled without it.

## What Changes

- **New `SelectField`** (`@aureus-core/ui/components/select-field`). It has the same field behaviour as the rest of the family: label, required mark, info, helper text, error with an optional message, loading, disabled, `classNames` and an `action`. It adds:
  - **Options** `{ value, label, description?, icon?, disabled?, group? }`. Single value is `string | null`; multiple value (`multiple`) is `string[]`. Both can be controlled or uncontrolled.
  - **The field is always a select-like button.** With `searchable`, a search box appears inside the popup, above the list, and filters by label ignoring case and accents.
  - **Multiple display:** `multipleDisplay` is required when `multiple` is on:
    - `"chips"` shows removable chips, and the field grows;
    - `"summary"` shows one line whose text comes from `renderSummary`.
  - **No default messages.**
    - `placeholder`, `emptyMessage`, `noResultsMessage`, `optionsLoadingMessage` and `maxSelectedMessage` show nothing when omitted.
    - Texts a feature needs are required by TypeScript when the feature is on: `searchLabel` with `searchable`, `clearLabel` with `clearable`, `removeChipLabel` with chips, `renderSummary` with summary, `selectAll.label`, and `createLabel` with `creatable`.
    - Untyped JavaScript gets a development warning instead.
  - **Opt-in extras:**
    - groups, descriptions and disabled options;
    - server-side search (`onSearchChange`, `filter={false}`, `optionsLoading`);
    - `maxSelected` and `selectAll`;
    - `creatable` with `onCreate`;
    - `clearable`;
    - `closeOnSelect`.
- **New `SelectControl`** (`@aureus-core/ui/components/select-control`). It is `SelectField` bound to the surrounding react-hook-form `FormProvider`, with only `name` plus the field's props. The form holds `string | null` or `string[]`.
- **Documentation:**
  - bilingual (EN/ES) Storybook pages and stories;
  - a Select section in the guide;
  - README and CONTRIBUTING updates, including the "no default messages" rule;
  - JSDoc;
  - a `minor` changeset.

Non-goals:
- No default texts of any kind in these components.
- No virtualised lists for very large option sets (thousands of options). The recommendation is server search.
- No tree, nested or cascading selects. No free-form values without `creatable`.
- No change to the defaults of existing components.

## Capabilities

### New Capabilities

_None._

### Modified Capabilities

- `form-fields`: adds select options and value, developer-provided messages, the trigger and popup, search, multiple selection display, limits and select all, creatable options, server-side options, `SelectField` and `SelectControl`.

## Impact

- **Code:**
  - new `packages/ui/src/components/select-field/**` (component, `components/`, `hooks/`, `types/`, `utils/`, `tests/`);
  - new `packages/ui/src/components/select-control/**`.
- **Shared code:**
  - reuses `FieldShell`, `useFieldA11y`, `fieldFrameClassName`, `FieldAction`, `FieldLoading`, `useControllableState`, `ControlField`, `mapControllerToValueField` and `mergeRefs`;
  - uses Base UI `Select` and `Combobox` from `@base-ui/react`, already a dependency.
- **Playground:**
  - new `apps/storybook/src/stories/components/forms/select-{field,control}/`;
  - the guide is updated.
- **Dependencies:** none new.
- **Consumers:** purely additive.
