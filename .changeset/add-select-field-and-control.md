---
"@aureus-core/ui": minor
---

Add `SelectField` and `SelectControl`.

- `SelectField` (`@aureus-core/ui/components/select-field`): a select with the shared field layout, built on Base UI.
  - **Single or multiple.** The value is `string | null`, or `string[]` with `multiple`, reported with `onValueChange`. Controlled or uncontrolled. Values that are not in `options` are kept, with a development warning.
  - **Multiple display.** `multipleDisplay` is required with `multiple`: `chips` (removable tags; Backspace removes the last one) or `summary` (one line from `renderSummary`).
  - **Options.** `group` titles, `description`, `icon` and `disabled`, each opt-in.
  - **Search inside the list.** `searchable` adds a search box at the top of the popup. Local filtering ignores case and accents; `filter={false}` with `onSearchChange` and `optionsLoading` searches on a server.
  - **Opt-in extras.** `clearable`, `maxSelected`, `selectAll`, `creatable` (with `onCreate`) and `closeOnSelect`, each independent of the others.
  - **No default messages.** `placeholder`, `emptyMessage`, `noResultsMessage`, `optionsLoadingMessage` and `maxSelectedMessage` render nothing when omitted. The texts a feature needs are required by TypeScript when it is enabled (`searchLabel`, `clearLabel`, `removeChipLabel`, `renderSummary`, `selectAll.label`, `createLabel`), with a development warning for untyped JavaScript.
  - **Accessibility.** A `combobox` button with `listbox` options, typeahead and full keyboard support; messages in a `role="status"` region; touch-sized options.
- `SelectControl` (`@aureus-core/ui/components/select-control`): the same field bound to react-hook-form. The form receives `string | null` or `string[]`, so `z.string()` and `z.array(z.string()).min(1)` schemas work directly.
