## Why

Every app needs full data tables: searching, filtering, sortable and nested columns, row selection with bulk actions, pagination, and data that lives either in the client or on a server. The package ships only the visual `shadcn/table` and a TanStack example story, so each app would rebuild the same table, with the same accessibility and state bugs, on top of TanStack Table v9 by hand.

## What Changes

- **New `DataTable`** (`@aureus-core/ui/components/data-table`):
  - one component built on TanStack Table v9 and the shadcn table parts;
  - it is configured with **one object prop per feature**: passing the object turns the feature on, and TypeScript requires the texts that feature needs;
  - `header={false}` and `pagination={false}` hide those areas.
- **Columns** (`DataTableColumn<TData>`):
  - header, plain-text `label` and `subtitle`;
  - nested columns (header groups);
  - cell and footer renderers, alignment;
  - three-state sorting (none → ascending → descending → none);
  - hiding, start/end pinning, sizes and resizing.
- **Header:**
  - title and subtitle;
  - a search input at the inline start, with a placeholder, a tooltip, a search button with an icon and a clear button. It runs on submit (Enter or the button) or on change with a debounce;
  - at the inline end, icon buttons for reload, advanced filters and column visibility. The filters button opens a popover whose content is a consumer slot, and shows an active-filter count;
  - a slot for the consumer's own toolbar content;
  - the bulk-actions button, shown while rows are selected.
- **Highlight:**
  - clicking a column header marks the column and clicking a row marks the row, and the cell where both meet is emphasised;
  - a second click unmarks, and Escape clears both;
  - row and column hover effects.
- **Selection:**
  - single or multiple, with a per-row `canSelect`;
  - select-all scoped to the page or to every row;
  - bulk actions (a menu of items, or a render slot) that receive the selected rows.
- **Rows:**
  - expandable detail rows;
  - a per-row actions menu in a column pinned to the end;
  - `onRowClick`.
- **States:** loading (skeleton rows, `aria-busy`, a spinning reload icon), an empty slot, and an error slot with retry.
- **Layout:** density (`default`/`compact`), striped rows, a footer row (shown when a column defines a footer), a sticky header with `maxHeight`, and horizontal scrolling with pinned columns.
- **Pagination:** previous/next and optional first/last buttons, page label, page-size select, optional range text, and client or manual mode (`rowCount`).
- **Full control:** every state slice (search, sorting, pagination, selection, visibility, pinning, sizing, expansion, highlight, filters popover) accepts `value` / `defaultValue` / `onChange`. Each feature has its own `manual` flag for server-driven data. `tableRef` exposes the TanStack instance and helpers.
- **No default texts:** every visible or accessible text comes from the consumer. The texts a feature needs are required by TypeScript and checked by development warnings.
- **Dependency:** `@tanstack/react-table` `^9` becomes an **optional** peer dependency of `@aureus-core/ui`, needed only to use `DataTable`.
- **Documentation:**
  - a bilingual Storybook page and stories under `components/Data Display/Data Table`;
  - a new `employees` fixture;
  - README and Getting started updates for the peer dependency;
  - a CONTRIBUTING section;
  - a `minor` changeset.

Non-goals:
- Row virtualisation, column reordering by drag, editable cells, grouping/aggregation rows, export (CSV/Excel), and saved views.
- Changes to the CLI-owned `shadcn/` files.

## Capabilities

### New Capabilities

- `data-table`: the `DataTable` component:
  - feature objects and their required texts;
  - columns (nested, subtitle, sorting, pinning, resizing);
  - header, search and toolbar;
  - highlight and hover;
  - selection and bulk actions;
  - expansion and row actions;
  - states, layout options and pagination;
  - controllable state, manual (server) mode, and accessibility.

### Modified Capabilities

- `ui-package`: "Runtime dependencies are used and documented". A library imported by a shipped component that only some consumers use (the table-state library for `DataTable`) is an optional peer dependency, documented as such, instead of being example-only.

## Impact

- **New code:** `packages/ui/src/components/data-table/` (`components/`, `hooks/`, `types/`, `utils/`, `tests/`).
- **Package manifest** (`packages/ui/package.json`): `@tanstack/react-table` goes in `peerDependencies` (`^9`) with `peerDependenciesMeta.optional`, and in `devDependencies` (`^9.3.1`).
- **Playground:**
  - `apps/storybook/src/stories/components/data-display/data-table/` (stories + docs);
  - `apps/storybook/src/fixtures/employees.ts`;
  - a note in the shadcn Table docs pointing to `DataTable`.
- **Docs:**
  - `README.md` and `apps/storybook/src/stories/guides/getting-started.mdx`: they currently say `@tanstack/react-table` is not a dependency; this changes to an optional peer dependency for `DataTable`;
  - `CONTRIBUTING.md`;
  - `.changeset/add-data-table.md`.
- **Reused:** `useControllableState`, `useMissingTexts` / `missingTextProblems`, `useMediaQuery` (`src/internal/hooks`), and the shadcn `table`, `button`, `input-group`, `tooltip`, `popover`, `dropdown-menu`, `checkbox`, `skeleton`, `badge` and `select` parts.
- **Not changed:** `src/shadcn/**`, and every existing component.
