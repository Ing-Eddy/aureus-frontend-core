## ADDED Requirements

### Requirement: Select options and value
A select field SHALL take `options` as an array of `{ value: string; label: string; description?; icon?; disabled?; group? }`.

- **Single mode** (the default): the value is `string | null`.
- **Multiple mode** (`multiple`): the value is `string[]`.

Both modes MUST work controlled (`value`) and uncontrolled (`defaultValue`), and report changes through `onValueChange`. A value that is not in `options` MUST be kept, not dropped, so that options loaded later still match. In development, a warning MUST name such a value. The selected values MUST be submitted with native forms when `name` is set.

#### Scenario: Single selection
- **WHEN** a user opens a `SelectField` and picks "España" (value `es`)
- **THEN** the field shows "España" and `onValueChange` receives `"es"`

#### Scenario: Multiple selection
- **WHEN** a user picks "Rojo" and then "Azul" in a `SelectField` with `multiple`
- **THEN** `onValueChange` last receives `["rojo", "azul"]` and the popup stays open

#### Scenario: Value not yet in options
- **WHEN** a `SelectField` has `value="pe"` while `options` does not include `pe` yet
- **THEN** the value is kept, a development warning names `pe`, and once `pe` is added to `options` its label is shown

### Requirement: Select messages are provided by the developer
A select field SHALL NOT render any default text.

- **Visible messages** render nothing when their prop is omitted:
  - `placeholder` for an empty field;
  - `emptyMessage` for a popup with no options;
  - `noResultsMessage` for a search with no matches;
  - `optionsLoadingMessage` while `optionsLoading`;
  - `maxSelectedMessage` once `maxSelected` is reached.
- **Texts a feature needs** MUST be required by the props' TypeScript types whenever the feature is enabled:
  - `searchLabel` with `searchable`;
  - `clearLabel` with `clearable`;
  - `removeChipLabel(option)` with `multipleDisplay="chips"`;
  - `renderSummary(selected)` with `multipleDisplay="summary"`;
  - `selectAll.label` with `selectAll`;
  - `createLabel(query)` and `onCreate` with `creatable`.

  When one of them is missing at runtime (untyped code), a development warning MUST name the missing prop.
- **Announced messages:** the no-results and loading messages MUST be rendered in a `status` region, so screen readers announce them.

#### Scenario: No message without its prop
- **WHEN** a searchable `SelectField` without `noResultsMessage` filters to no matches
- **THEN** the popup shows no message text and no default wording

#### Scenario: Message in its situation
- **WHEN** the same field has `noResultsMessage="Ningún país coincide"`
- **THEN** that text is shown in a status region while no option matches, and hidden once options match again

#### Scenario: Feature without its text does not type-check
- **WHEN** a developer writes `<SelectField clearable />` without `clearLabel`
- **THEN** TypeScript reports an error

### Requirement: Select trigger and popup
- **Field:** the select field SHALL look like every other field. It has the same frame, header, helper and error.
- **Trigger:** inside the frame, a trigger button fills the width and shows the selected value, or the `placeholder` in the muted color. The trigger:
  - is the labelled form control (the label's `htmlFor` points at it);
  - carries `aria-describedby` (helper, info), `aria-invalid` and `aria-required`;
  - exposes `aria-expanded`.
- **Frame end:** at the inline end of the frame come the spinner, the action, the clear button (`clearable`, only while there is a value) and a chevron. Interactive elements are never nested inside the trigger button.
- **Popup:**
  - matches the field's width, has a maximum height with scroll, is rendered in a portal and avoids viewport collisions;
  - options show an indicator for the selected state, an optional icon, the label and an optional description on a second line;
  - disabled options are announced as disabled and cannot be chosen;
  - groups render their titles in the order the groups first appear;
  - on touch screens every option is at least 24 px tall (WCAG 2.5.8).
- **Disabled and loading:** a disabled or loading field MUST NOT open its popup.
- **Keyboard:**
  - Enter, Space and ArrowDown open the popup;
  - Up/Down, Home and End move through the options, and Enter selects;
  - without search, typing a letter jumps to the matching option;
  - Escape closes the popup and returns focus to the trigger, and Tab closes it and moves on.
- **RTL:** the layout mirrors in right-to-left documents.

#### Scenario: Opening from the keyboard
- **WHEN** a keyboard user focuses a `SelectField` and presses ArrowDown, ArrowDown, Enter
- **THEN** the popup opens, the second option is selected and the popup closes in single mode

#### Scenario: Escape returns focus
- **WHEN** the popup is open and the user presses Escape
- **THEN** the popup closes and the trigger has focus

#### Scenario: Typeahead
- **WHEN** a non-searchable `SelectField` is open and the user types "m"
- **THEN** the first option whose label starts with "m" is highlighted

### Requirement: Select search
When `searchable` is on, the popup SHALL show a search box above the list, labelled by `searchLabel` and optionally showing `searchPlaceholder`. The search box receives focus when the popup opens, and the arrow keys move through the options from it.

With `filter` on (the default), options are filtered locally by label, ignoring case and diacritics. With `filter={false}`, options are not filtered, so that the developer can provide them, for example from a server. `onSearchChange(query)` MUST be called whenever the search text changes, in both modes.

#### Scenario: Accent-insensitive filter
- **WHEN** a user types "espana" in a searchable `SelectField`
- **THEN** the option "España" is shown

### Requirement: Multiple selection display
In multiple mode, `multipleDisplay` SHALL be required.

- **`"chips"`:**
  - each selected option is a chip with a remove button named by `removeChipLabel(option)`;
  - the frame grows in height to fit the chips;
  - Backspace on the focused trigger removes the last chip;
  - chips and their buttons are siblings of the trigger, never inside it.
- **`"summary"`:**
  - the trigger shows, on one line and truncated, the content returned by `renderSummary(selectedOptions)`.

Both displays keep the popup open after each pick unless `closeOnSelect` is set.

#### Scenario: Removing a chip
- **WHEN** a user presses the remove button named "Quitar Azul" in a chips `SelectField` holding Rojo and Azul
- **THEN** the value becomes `["rojo"]` and focus stays in the field

#### Scenario: Developer-provided summary
- **WHEN** a summary `SelectField` with `renderSummary={(s) => \`${s.length} seleccionadas\`}` has three values
- **THEN** the trigger shows "3 seleccionadas"

### Requirement: Selection limit and select all
In multiple mode, `maxSelected` SHALL limit the number of selected values. Once the limit is reached, unselected options become disabled and `maxSelectedMessage` is shown above the list, if provided. `selectAll: { label }` SHALL add an option at the top of the list. It selects every enabled option up to `maxSelected` and, when all of them are selected, unselects them. It exposes its checked state, which is mixed when only some options are selected.

#### Scenario: Limit reached
- **WHEN** a `SelectField` with `maxSelected={2}` has two values
- **THEN** the other options are disabled and the provided `maxSelectedMessage` is visible

#### Scenario: Select all respects disabled options
- **WHEN** the user picks the select-all option in a list with one disabled option among four
- **THEN** the three enabled options are selected

### Requirement: Creatable options
When `searchable` and `creatable` are on and the search text does not exactly match any option label, the list SHALL end with an option whose content is `createLabel(query)`. Choosing it calls `onCreate(query)`. The developer adds the new option and decides whether it is selected. `creatable` requires `searchable`.

#### Scenario: Creating a tag
- **WHEN** a user types "Urgente" in a creatable `SelectField` with no such option and picks the create option
- **THEN** `onCreate` is called with "Urgente"

### Requirement: Server-side options
With `searchable`, `filter={false}`, `onSearchChange` and `optionsLoading`, a select field SHALL support options loaded from a server. While `optionsLoading` is true, the popup shows `optionsLoadingMessage` in its status region, if provided. The previously loaded options stay visible until new options arrive.

#### Scenario: Loading while searching
- **WHEN** the user types "lim" and the developer sets `optionsLoading` until results arrive
- **THEN** the loading message is announced, and the new options replace the old ones when `optionsLoading` turns false

### Requirement: Select field
`SelectField` SHALL be importable from `@aureus-core/ui/components/select-field`. It MUST accept the shared field props, an `action`, and every select prop described above. A `ref` MUST reach the trigger button.

#### Scenario: Minimal select
- **WHEN** a `SelectField` is rendered with only `label` and `options`
- **THEN** it shows an empty field with no text inside, and opening it lists the options

### Requirement: Select control bound to the form context
`SelectControl` SHALL be importable from `@aureus-core/ui/components/select-control`. It MUST follow the same form-binding contract as the other controls:
- it is rendered inside a `FormProvider`;
- it takes `name` (a plain string), optional `disabled` and `shouldUnregister`;
- it accepts every `SelectField` prop except `name`, `value`, `defaultValue`, `error`, `errorMessage` and `disabled`;
- the schema message is shown as helper text;
- a disabled control's value is excluded from the submitted data, while a loading control's value is kept.

The form MUST hold `string | null` in single mode and `string[]` in multiple mode. With the same props and state, a `SelectControl` MUST render the same markup as a `SelectField`, apart from generated element ids.

#### Scenario: Multiple values reach the schema
- **WHEN** a form with `tags: z.array(z.string()).min(1)` uses a multiple `SelectControl` named "tags" and the user picks two tags and submits
- **THEN** the submitted data contains `tags` as an array of the two values

#### Scenario: Schema message
- **WHEN** the user submits with no tags
- **THEN** the schema's message is shown below the field with `aria-invalid="true"` on the trigger
