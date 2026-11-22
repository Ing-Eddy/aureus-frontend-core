# data-table Specification

## Purpose

Defines the behaviour, control surface, text contract and accessibility of `DataTable` in `@aureus-core/ui`: a data table with a header, a table body and pagination. Every feature is opt-in and controllable by its consumer, and it works with client-side or server-side data.

## Requirements

### Requirement: One component, one object per feature
`@aureus-core/ui/components/data-table` SHALL export `DataTable` and its public types: `DataTableColumn`, `DataTableProps`, `DataTableHandle` and the option type of each feature. `DataTable` MUST render up to three areas, in this order: the header, the table, and the pagination.

Each feature is configured by one object prop: `search`, `reload`, `filters`, `columnToggle`, `sorting`, `highlight`, `hover`, `selection`, `expansion`, `rowActions`, `resizing`, `pinning` and `pagination`. Passing the object turns the feature on, and omitting it turns it off. `header={false}` MUST hide the whole header, and `pagination={false}` MUST hide the pagination, without changing the table state.

A `DataTable` with only `data`, `columns` and an accessible name MUST render a plain table of every row, with no header controls, no pagination, no selection and no sorting.

#### Scenario: Minimal table
- **WHEN** `<DataTable data={rows} columns={columns} aria-label="Users" />` is rendered with 30 rows
- **THEN** a table with 30 body rows is shown, with no search, no buttons, no checkboxes and no pagination

#### Scenario: Hiding the pagination
- **WHEN** a table with a `pagination` object is rendered with `pagination={false}` instead
- **THEN** no pagination controls are shown

### Requirement: Columns
Columns SHALL be described with `DataTableColumn<TData>`:
- an `accessorKey`, an `accessorFn` with an `id`, or only an `id` for display columns;
- `header`: text or a render function;
- `label`: plain text that names the column in menus, sort labels and warnings. It defaults to `header` when that is a string;
- optional `subtitle`, shown under the header text;
- `cell` and `footer` renderers;
- `align`: `start`, `center` or `end`;
- `sortable`, `hideable`, `pin` (`start` or `end`), `size`, `minSize`, `maxSize` and `resizable`;
- `headerClassName` and `cellClassName`.

A column with `columns` is a group. Its header MUST span its leaf columns (`colSpan`), and the header rows MUST show every level. A footer row MUST be rendered only when at least one column defines `footer`.

#### Scenario: Nested columns
- **WHEN** a column "Contact" has the child columns "Email" and "Phone"
- **THEN** the first header row shows "Contact" spanning two columns, the second shows "Email" and "Phone", and each body row has one cell per leaf column

#### Scenario: Subtitle
- **WHEN** a column has `subtitle: "Last 30 days"`
- **THEN** its header cell shows the header text with "Last 30 days" under it

#### Scenario: Missing label for a rich header
- **WHEN** a hideable or sortable column has a non-string `header` and no `label`, in development
- **THEN** a warning starting with `DataTable:` names the column id

### Requirement: Accessible table name
The table SHALL have an accessible name: `aria-label`, `aria-labelledby`, or, when neither is given, the header `title` (through `aria-labelledby`). When there is none, a development warning MUST be logged.

#### Scenario: Name from the title
- **WHEN** a table has `header={{ title: "Users" }}` and no `aria-label`
- **THEN** the table's accessible name is "Users"

### Requirement: Header layout
When it is not `false`, the header SHALL show:
- `title` and `subtitle`;
- below them, a toolbar with the search at the inline start, taking the free width;
- at the inline end, in this order: the consumer's `toolbar` slot, the bulk-actions button, and the reload, filters and column-visibility buttons.

The reload, filters and column-visibility buttons MUST be icon buttons, named by their `label` and showing it as a tooltip. The header MUST NOT render when it has nothing to show. On narrow viewports the search MUST take the full width and the buttons MUST wrap below it, and in right-to-left documents the order MUST mirror.

#### Scenario: Toolbar order
- **WHEN** a table has `search`, `reload`, `filters` and `columnToggle`
- **THEN** the search input is the first control in the toolbar, and the reload, filters and columns buttons follow it at the inline end

### Requirement: Search
`search` SHALL render a text input with:
- the required `label` (its accessible name) and an optional `placeholder` and `tooltip`;
- a search button with a search icon, named by the required `submitLabel`;
- a clear button, named by the required `clearLabel`, shown only while the input is not empty.

With `trigger: "submit"` (the default), `onSearch(query)` MUST be called when the user presses Enter or the search button. With `trigger: "change"`, it MUST be called after the input stops changing for `debounceMs` (default 0). Clearing MUST empty the input, call `onSearch("")`, and return focus to the input. The input value is controllable (`value`, `defaultValue`, `onValueChange`).

Without `manual`, the applied query MUST filter the rows in the client across every column that can be filtered, and the page index MUST return to the first page. With `manual`, the rows MUST NOT be filtered and only the callbacks run.

#### Scenario: Submit search
- **WHEN** the user types "ada" and presses Enter in a table with `search` and no `manual`
- **THEN** `onSearch("ada")` is called once and only the rows containing "ada" are shown

#### Scenario: Typing does not search on submit mode
- **WHEN** the user types "ada" without pressing Enter or the button, with `trigger: "submit"`
- **THEN** `onSearch` is not called and the rows are not filtered

#### Scenario: Clear
- **WHEN** the input holds "ada" and the user presses the clear button
- **THEN** the input is empty, `onSearch("")` is called, every row is shown again, the clear button disappears and the input has focus

#### Scenario: Server search
- **WHEN** `search.manual` is `true` and the user submits "ada"
- **THEN** `onSearch("ada")` is called and the rendered rows are exactly `data`

### Requirement: Reload
`reload` SHALL render an icon button, named by the required `label`, that calls `onReload()` when pressed. While the table's `loading` is `true`, its icon MUST spin and the button MUST stay operable unless `reload.disabled` is `true`.

#### Scenario: Reload pressed
- **WHEN** the user presses the reload button
- **THEN** `onReload` is called once

### Requirement: Advanced filters slot
`filters` SHALL render an icon button, named by the required `label`, that opens a popover containing `filters.content` (any consumer content). With `activeCount` greater than zero, the button MUST show the count as a badge, and its accessible description MUST include it. The open state is controllable (`open`, `defaultOpen`, `onOpenChange`). Focus MUST move into the popover when it opens and return to the button when it closes.

#### Scenario: Consumer filters
- **WHEN** the user presses the filters button of a table with `filters={{ label: "Filters", content: <StatusFilter /> }}`
- **THEN** a popover opens with the consumer's `StatusFilter`, and pressing Escape closes it and returns focus to the button

### Requirement: Column visibility
`columnToggle` SHALL render an icon button, named by the required `label`, that opens a menu with one checkbox item per `hideable` column, named by the column `label`. Toggling an item MUST show or hide that column, its header and its cells. A group whose leaf columns are all hidden MUST disappear. The visibility state is controllable (`value`, `defaultValue`, `onChange`).

While one or more `hideable` columns are hidden, the button SHALL show a count badge with that number, like the filters badge: outside the button, hidden from assistive technology and referenced by the button's `aria-describedby`, so the button's name stays its `label`. Columns that are not `hideable` never count, and with no hidden column there is no badge.

#### Scenario: Hidden count badge
- **WHEN** `columnToggle` is rendered with `defaultValue: { email: false }` and the user then hides Name
- **THEN** the button's badge shows `1`, then `2`, and the button is described by it; showing both columns again removes the badge

#### Scenario: Hiding a column
- **WHEN** the user unchecks "Email" in the columns menu
- **THEN** the Email header and cells disappear, and `onChange` receives `{ email: false }`

### Requirement: Three-state sorting
With `sorting`, every `sortable` column header SHALL contain a sort button, named by `sortLabel(columnLabel, nextDirection)`, with an icon that shows the current direction. Each press MUST cycle the column through no sorting → ascending → descending → no sorting. With `descFirst`, the order is descending first. The header cell MUST carry `aria-sort` (`ascending`, `descending`, or none when it is not sorted).

With `multi`, Shift+press MUST add the column to the existing sort instead of replacing it. Without `manual`, the rows MUST be sorted in the client; with `manual`, they MUST NOT be. The sorting state is controllable (`value`, `defaultValue`, `onChange`).

#### Scenario: Cycling a column
- **WHEN** the user presses the "Name" sort button three times
- **THEN** after each press `aria-sort` is `ascending`, then `descending`, then absent, and the rows follow that order and then return to their original order

#### Scenario: Server sorting
- **WHEN** `sorting.manual` is `true` and the user presses the "Name" sort button
- **THEN** `onChange` receives `[{ id: "name", desc: false }]` and the rows keep the order of `data`

### Requirement: Highlight a column and a row
With `highlight.columns`, clicking a leaf header cell outside its controls SHALL mark that column, and clicking it again MUST unmark it. With `highlight.rows`, clicking a body row outside its controls SHALL mark that row, and clicking it again MUST unmark it.

At most one column and one row are marked at a time. The marked column's cells and the marked row MUST look distinct, and the cell where both meet MUST look more emphasised than either. Pressing Escape inside the table MUST clear both marks.

The state is controllable (`value: { columnId?, rowId? }`, `defaultValue`, `onChange`). Clicks on buttons, checkboxes, links and inputs inside a header or a row MUST NOT mark anything.

#### Scenario: Crosshair
- **WHEN** the user clicks the "Balance" header and then the row of "Ada"
- **THEN** every Balance cell is marked, Ada's row is marked, the Balance cell in Ada's row has the strongest emphasis, and `onChange` receives `{ columnId: "balance", rowId: "u1" }`

#### Scenario: Sorting does not mark
- **WHEN** the user presses the sort button inside the "Balance" header with `highlight.columns` on
- **THEN** the column is sorted and not marked

### Requirement: Hover effects
With `hover.rows`, the row under the pointer SHALL be highlighted. With `hover.columns`, every cell of the column under the pointer SHALL be highlighted, header and footer included. Hovering a group header MUST highlight all its leaf columns. Hover highlights MUST NOT be announced to assistive technologies.

#### Scenario: Column hover
- **WHEN** the pointer moves over a body cell of the "Email" column with `hover.columns` on
- **THEN** all Email cells are highlighted, and when the pointer leaves the table no cell is highlighted

### Requirement: Row selection
With `selection`, a checkbox column SHALL be shown first:
- each row checkbox is named by the required `selectRowLabel(row)`;
- with `mode: "multiple"` (the default), a header checkbox named by the required `selectAllLabel` selects or clears every selectable row, on the current page with `selectAllScope: "page"` (the default) or in every row with `"all"`. It MUST be indeterminate while only some of those rows are selected;
- with `mode: "single"`, selecting a row clears the others and there is no header checkbox;
- `canSelect(row)` disables the checkbox of rows that cannot be selected.

Selected rows MUST be marked with `data-state="selected"` and `aria-selected`. The selection state is controllable (`value`, `defaultValue`, `onChange(state, rows)`), and `selectedLabel(count)`, when given, MUST show the selection count in a polite live region.

#### Scenario: Select all on the page
- **WHEN** the user checks the header checkbox on page 1 of a table of 25 rows with page size 10
- **THEN** the 10 rows of page 1 are selected and `onChange` receives their 10 rows

#### Scenario: Single selection
- **WHEN** `mode` is `"single"`, row A is selected and the user selects row B
- **THEN** only row B is selected

### Requirement: Bulk actions
With `selection.actions` or `selection.renderActions`, a button named by the required `actionsLabel` SHALL appear in the header toolbar while at least one row is selected, and MUST disappear when none is.

With `actions`, it opens a menu with one item per action, showing its `label`, an optional `icon` and the `destructive` variant. An item is disabled when `disabled(rows)` returns `true`. An action is left out of the menu when `hidden(rows)` returns `true`, and when every action is hidden the button MUST NOT be shown. Choosing an item MUST call `onSelect(rows, clear)` with the selected row data, where `clear()` empties the selection. With `renderActions(rows, clear)`, the consumer's content is shown in the menu instead.

#### Scenario: Actions appear with the selection
- **WHEN** the user selects two rows in a table with `selection.actions`
- **THEN** the actions button appears, and choosing "Delete" calls its `onSelect` with those two rows

#### Scenario: No selection, no button
- **WHEN** no row is selected
- **THEN** the actions button is not rendered

### Requirement: Expandable rows
With `expansion`, rows for which `canExpand(row)` returns `true` (every row by default) SHALL have a toggle button, named by the required `expandLabel(row, expanded)`, with `aria-expanded`. An expanded row MUST be followed by a full-width row with `renderDetail(row)`. With `single`, expanding a row MUST collapse the others. The expansion state is controllable (`value`, `defaultValue`, `onChange`).

#### Scenario: Expanding a row
- **WHEN** the user presses the expand button of Ada's row
- **THEN** a detail row with Ada's `renderDetail` content appears under it and the button has `aria-expanded="true"`

### Requirement: Row actions
With `rowActions`, a last column pinned to the end SHALL show one menu button per row, named by the required `label(row)`. The menu lists `items(row)`, each with a `label`, an optional `icon`, the `destructive` variant, `disabled`, `hidden` and `onSelect(row)`. Hidden items are left out of the menu, and a row whose items are all hidden (or empty) MUST NOT show the menu button.

#### Scenario: Row action
- **WHEN** the user opens the actions menu of Ada's row and chooses "Edit"
- **THEN** that item's `onSelect` is called with Ada's row data

### Requirement: Row click and keyboard
With `onRowClick`, clicking a row outside its controls SHALL call `onRowClick(row, event)`. When `onRowClick` or `highlight.rows` is set, rows MUST be focusable, and Enter on a focused row MUST act like a click. Otherwise rows MUST NOT be focusable.

#### Scenario: Keyboard activation
- **WHEN** a row has focus and the user presses Enter, in a table with `onRowClick`
- **THEN** `onRowClick` is called with that row

### Requirement: Loading, empty and error states
- **Loading:** `loading` requires `loadingLabel`. While it is `true`, the table MUST be `aria-busy`, `loadingLabel` MUST be announced politely, and, when there are no rows to show, `loadingRows` skeleton rows (default 5) MUST be shown.
- **Empty:** when there is nothing to show and the table is not loading, `empty` (any content) MUST be shown in a full-width row. When `empty` is omitted, the body is empty, with no text of its own.
- **Error:** `error.content` replaces the body rows. With `error.onRetry`, a button named by the required `error.retryLabel` calls it.

#### Scenario: Empty after a search
- **WHEN** a search matches no row and `empty` is `<p>No users</p>`
- **THEN** a single full-width row shows "No users"

#### Scenario: Error with retry
- **WHEN** `error={{ content: <p>Could not load</p>, onRetry, retryLabel: "Retry" }}` is set
- **THEN** "Could not load" and a "Retry" button are shown instead of the rows, and pressing the button calls `onRetry`

### Requirement: Layout options
Each layout option SHALL be independent:
- `density: "compact"` reduces cell padding and row height (default `"default"`);
- `striped` alternates the row background;
- `columnDividers` draws a vertical line between columns in the header, body and footer, never after the last column and never doubling a pinned edge's divider (default off);
- `stickyHeader` keeps the header rows visible while the table body scrolls vertically, within `maxHeight` when it is given;
- the table container MUST scroll horizontally when the columns are wider than it.

#### Scenario: Sticky header
- **WHEN** a table with `stickyHeader` and `maxHeight={320}` has more rows than fit
- **THEN** the body scrolls inside the container and the header rows stay visible at its top

#### Scenario: Column dividers
- **WHEN** a table with nested columns is rendered with `columnDividers`
- **THEN** every header, body and footer cell except the last of its row shows a divider at its inline end, and without `columnDividers` none does

#### Scenario: Fixed table height
- **WHEN** the root is given a height with `className` (for example `h-[26rem]`) and the rows do not fit
- **THEN** the header and pagination keep their place inside that height and only the rows' area scrolls

### Requirement: Custom toolbar actions
With `toolbarActions`, the toolbar SHALL show one button per action that is not `hidden`, after the `header.toolbar` slot and the bulk-actions button and before reload, filters and columns, in the given order. Each action requires `id`, `label` and `onClick`. By default it is an icon button showing `icon`, named by `label` and showing it as a tooltip, like the built-in buttons; with `showLabel` it shows `label` as text, after `icon` when given. `disabled` disables it and `variant` (default `"outline"`) sets its style. Pressing it MUST call `onClick()`. An icon-only action without `icon`, or any action without `label`, MUST be a type error and log a development warning naming the action. When every action is hidden and nothing else fills the header, the header MUST NOT render.

#### Scenario: Export and new buttons
- **WHEN** `toolbarActions` holds an Export action with an icon and a New employee action with `showLabel`
- **THEN** Export is an icon button named "Export" with that tooltip, New employee shows its text, and both sit before the reload button

#### Scenario: Hidden and disabled actions
- **WHEN** one action is `hidden` and another is `disabled`
- **THEN** the hidden one is not rendered and the disabled one is rendered disabled

### Requirement: Column pinning
Columns with `pin: "start"` or `pin: "end"`, and the columns in the controllable pinning state (`pinning.value`, `defaultValue`, `onChange`), SHALL stay fixed at that edge while the table scrolls horizontally, in their order. Pinned cells MUST be opaque, and the last start-pinned and first end-pinned columns MUST show an edge divider while content scrolls under them. `start` and `end` MUST follow the document direction.

#### Scenario: Pinned first column
- **WHEN** the "Name" column has `pin: "start"` and the user scrolls the table horizontally
- **THEN** the Name cells stay at the inline-start edge and the other cells scroll under them

### Requirement: Column resizing
With `resizing`, every `resizable` leaf header SHALL have a resize handle with `role="separator"`, `aria-orientation="vertical"` and `aria-valuenow` (the width in pixels), named by the required `resizeLabel(columnLabel)`. Dragging it MUST change the column width within `minSize` and `maxSize`. With the handle focused, the arrow keys MUST change the width by 10px. With `mode: "onEnd"`, the width MUST change only when the drag ends. The sizing state is controllable (`value`, `defaultValue`, `onChange`).

#### Scenario: Keyboard resize
- **WHEN** the resize handle of "Email" (200px) has focus and the user presses ArrowRight twice in a left-to-right document
- **THEN** the column is 220px wide, `aria-valuenow` is 220, and `onChange` receives the new width

### Requirement: Pagination
With `pagination`, the table SHALL show one page of rows and a pagination bar with:
- previous and next buttons named by the required `previousLabel` and `nextLabel`, disabled at the first and last page;
- with `showFirstLast`, first and last buttons named by the required `firstLabel` and `lastLabel`;
- page buttons between previous and next: the first and last pages, one page on each side of the current one (none below the medium container size), and a gap where pages are left out, keeping the same number of items while the current page moves. Each button shows its number, is named by the required `pageLabel(page, pageCount)` and jumps to its page; the current one has `aria-current="page"`, and the gaps are hidden from assistive technology;
- with `pageSizes`, a select showing an icon and the size, named by the required `pageSizeLabel`, which is its tooltip and is not shown as text;
- with `rangeLabel(from, to, total)`, that text.

The bar MUST be compact: no visible page text besides the range and the page numbers.

Without `manual`, the rows are paginated in the client. With `manual`, the rows are exactly `data`, the page count comes from `rowCount` (or `pageCount`), and only `onChange` runs. The pagination state `{ pageIndex, pageSize }` is controllable (`value`, `defaultValue`, `onChange`). Changing the page size MUST return to the first page.

#### Scenario: Client pagination
- **WHEN** a table of 25 rows has `pagination` with a page size of 10 and the user presses next twice
- **THEN** the third page shows rows 21–25, the button named `pageLabel(3, 3)` has `aria-current="page"`, and the next button is disabled

#### Scenario: Jumping to a page
- **WHEN** a table of 95 rows has a page size of 10 and the user presses the page button `10`
- **THEN** the last page shows rows 91–95, and the page buttons are 1, a gap, and 6 to 10

#### Scenario: Server pagination
- **WHEN** `pagination={{ manual: true, rowCount: 95, value: { pageIndex: 0, pageSize: 10 }, … }}` is rendered with 10 rows and the user presses next
- **THEN** `onChange` receives `{ pageIndex: 1, pageSize: 10 }`, the rows stay the 10 given, and the last page button is named `pageLabel(10, 10)`

### Requirement: Controllable state and handle
Every state slice (search value, sorting, pagination, selection, column visibility, pinning, sizing, expansion, highlight, and the filters popover) SHALL work uncontrolled (`defaultValue`, or the feature's neutral initial state) and controlled (`value`). `onChange` MUST be called with every requested change, in both modes. A controlled slice MUST render exactly its `value`.

`tableRef` MUST expose `{ table, clearSelection(), focusSearch(), resetHighlight() }`, where `table` is the underlying TanStack Table instance.

#### Scenario: Controlled sorting ignores clicks until accepted
- **WHEN** `sorting.value` is `[]` with an `onChange` that does not update it, and the user presses a sort button
- **THEN** `onChange` receives the new sorting, and the rows and `aria-sort` stay unsorted

### Requirement: No default texts
`DataTable` SHALL NOT render any text of its own, visible or accessible, in any language. The texts each feature needs MUST be required by TypeScript when the feature is on:
- `search`: `label`, `submitLabel`, `clearLabel`;
- `reload`, `filters` and `columnToggle`: `label`;
- `sorting`: `sortLabel`;
- `selection`: `selectRowLabel`; `selectAllLabel` in multiple mode; `actionsLabel` with actions;
- `expansion`: `expandLabel`;
- `rowActions`: `label`;
- `resizing`: `resizeLabel`;
- `pagination`: `previousLabel`, `nextLabel`, `pageLabel`; `pageSizeLabel` with `pageSizes`; `firstLabel`/`lastLabel` with `showFirstLast`;
- `loading`: `loadingLabel`;
- `error.onRetry`: `error.retryLabel`.

For untyped JavaScript, a missing required text MUST log one development warning starting with `DataTable:` that names it.

#### Scenario: Search without its texts
- **WHEN** `search={{ label: "Search" }}` is written in TypeScript
- **THEN** TypeScript reports that `submitLabel` and `clearLabel` are missing

### Requirement: Independent features
Every feature and layout option SHALL be independent: turning one on MUST NOT turn on, turn off or change the default of another. For example, `selection` does not enable pagination, `pagination` does not enable search, `manual` on one feature does not make another manual, and `highlight` does not enable `hover`.

#### Scenario: Manual pagination with client sorting
- **WHEN** `pagination.manual` is `true` and `sorting.manual` is not set
- **THEN** the given page of rows is sorted in the client and is not paginated again

### Requirement: Responsive layout
The header, toolbar and pagination SHALL adapt to the table's own width (container queries), not the viewport's. Below the medium container size, the search input MUST take the whole toolbar row with the buttons below it, and the pagination navigation MUST span its row.

The scroll container SHALL show a shadow at each inline edge that hides content, placed next to the pinned columns and mirrored in RTL.

When the pinned columns would take more than half of the container's width, the pinned data columns MUST scroll with the rest while the selection, expand and actions columns stay pinned; if those still take more than half, every column MUST scroll. The pinning state MUST NOT change, and pinning MUST apply again when the table is wide enough.

#### Scenario: Pinned data columns scroll on a narrow table
- **WHEN** a 400px-wide table pins a 200px Name column, with the 40px selection and actions columns
- **THEN** Name scrolls with the other columns, and the selection and actions columns stay pinned

#### Scenario: Layout follows the table width
- **WHEN** a table is rendered in a 360px-wide box on a wide screen
- **THEN** its search input takes the whole toolbar row and the buttons wrap below it

### Requirement: Keyboard and assistive technology support
While the scroll container overflows, it SHALL be a focusable `region` named like the table. Its `scroll-padding` MUST keep focused content clear of the pinned columns and of the sticky header.

Focusable rows SHALL share one tab stop: ArrowUp and ArrowDown move to the previous or next row, Home and End to the first or last. With `highlight.columns`, the data column headers SHALL share one tab stop: ArrowLeft and ArrowRight move between them (mirrored in RTL), Home and End go to the ends, and Enter or Space marks the column. The marked header and row MUST carry `aria-current="true"`.

An expanded row's toggle MUST reference its detail row with `aria-controls`. The error state MUST be an `alert`. The range label, or the page label without it, MUST be a polite live region.

In forced-colors mode, the selected, marked and crossing cells MUST be outlined with system colors and the pinned divider painted in `CanvasText`. On coarse pointers, the pagination buttons and resize handles MUST be larger.

#### Scenario: Rows are one tab stop
- **WHEN** a table with `highlight.rows` is focused on its first row and the user presses ArrowDown
- **THEN** the second row gets the focus and becomes the only row with `tabIndex` 0

#### Scenario: Marking a column from the keyboard
- **WHEN** a header is focused with `highlight.columns` and the user presses Enter
- **THEN** the column is marked and its header has `aria-current="true"`

#### Scenario: Scrolling with the keyboard
- **WHEN** the table is wider than its container
- **THEN** the container is a `region` named like the table and can be focused with Tab
