## Context

See proposal.md (Why) for the motivation and specs/data-table/spec.md for the requirements. Facts that shape the approach:

- **TanStack Table 9.3.1** (`@tanstack/react-table`, core `@tanstack/table-core`) is already installed in the workspace for the playground. Its v9 API:
  - features and row models are declared once with `tableFeatures({...})` and passed to `useTable({ features, data, columns, state, on*Change, … })`;
  - row models come from factories: `createSortedRowModel`, `createFilteredRowModel`, `createPaginatedRowModel`, `createExpandedRowModel`;
  - `table.state` is the render-time read, and `table.Subscribe` subscribes to a slice;
  - column pinning is `{ start: string[]; end: string[] }`, with `column.getStart("start")` / `getAfter("end")` and `getStartLeafColumns`, so it follows logical (RTL-safe) edges;
  - sorting has `enableSortingRemoval` (three states), `enableMultiSort`, `sortDescFirst` and `manualSorting`;
  - pagination has `manualPagination`, `rowCount` and `pageCount`;
  - global filtering has `globalFilterFn` and `manualFiltering`;
  - `RowSelectionState` is `Record<string, true>`, and `ExpandedState` is `true | Record<string, boolean>`;
  - see `apps/storybook/src/stories/shadcn/data-display/table/table-stories.tsx` for a working v9 table.
- **shadcn `Table`** (`src/shadcn/ui/table.tsx`, CLI-owned) wraps `<table>` in a `div[data-slot=table-container]` with `overflow-x-auto` and accepts no props for it. A sticky header with `maxHeight` needs that container to be the vertical scroll container. `TableHeader`, `TableBody`, `TableFooter`, `TableRow`, `TableHead` and `TableCell` accept any attributes.
- **Shared hooks** in `src/internal/hooks`:
  - `useControllableState({ value, defaultValue, onChange })`;
  - `useMissingTexts(componentName, checks)` with `MissingTextCheck = [happens, problem]`, which logs `<Component>: <problem>.` once each;
  - `useInheritedDirection(ref)`;
  - `useMediaQuery`.
- **Precedent:**
  - `Modal` copies shadcn classes into `modal/utils/modal-classes.ts` when a shadcn part cannot be used as is;
  - fields use discriminated unions for required texts;
  - the `no-default-texts-tests.ts` guard scans `src/components`.
- **jsdom** (the ui test environment) has no layout, no `ResizeObserver` (shimmed in `vitest-setup.ts`) and no pointer capture. Radix menus need `hasPointerCapture` / `scrollIntoView` shims.

## Goals / Non-Goals

**Goals:**
- One source of truth for every state slice. TanStack is always given controlled `state`, and our hooks own the value (internally, or mirroring the consumer's `value`).
- Features off or in `manual` mode cost nothing: no client filtering, sorting or pagination runs for them.
- Hover and highlight do not re-render every cell on pointer movement.
- Everything testable in jsdom except real layout (pinning offsets, drag resizing), which the stories cover.

**Non-Goals:**
- A headless hook for consumers.
- Virtualisation.
- Exposing TanStack types in the column API (only `tableRef.table` exposes the instance).

## Decisions

### 1. One static feature set, behaviour through flags
`utils/data-table-features.ts` declares one module-level `tableFeatures` with:
- `rowSortingFeature`, `globalFilteringFeature`, `columnFilteringFeature`, `columnVisibilityFeature`, `columnPinningFeature`, `columnSizingFeature`, `columnResizingFeature`, `rowExpandingFeature`, `rowSelectionFeature` and `rowPaginationFeature`;
- the sorted, filtered, expanded and paginated row models;
- the sort and filter functions.

Whether a feature acts is decided per render by the options:
- `manualSorting: !sorting || sorting.manual`;
- `manualFiltering: !search || search.manual`;
- `manualPagination: !pagination || pagination.manual`;
- `enableRowSelection` and `enableExpanding` from their props;
- `enableColumnResizing: !!resizing`.

So "off" and "manual" use the same path, and no row model runs for them. This also gives the spec's independence case: with manual pagination, the given rows are still sorted in the client.

*Alternative:* build the feature set from the props. That is rejected because v9 expects features to be static, and a changing set would rebuild the table.

### 2. Our column type, translated once
`DataTableColumn<TData>` is our own type (spec "Columns"). `utils/to-tanstack-columns.ts` maps it to `ColumnDef`:
- `sortable → enableSorting`, `hideable → enableHiding`, `resizable → enableResizing` (all default `false`, neutral);
- `size`, `minSize`, `maxSize`;
- `columns → columns` (groups);
- `label`, `subtitle`, `align`, `pin` and the class names go into `meta.aureus`.

`cell` receives `{ value, row, rowId, rowIndex }` and `footer` receives `{ rows }` (the filtered row data), so consumers never touch TanStack types.

Display columns are injected with reserved ids: `__aureus_select` (first), `__aureus_expand` (after it) and `__aureus_actions` (last, pinned end). The translation is memoised on `columns`. The docs ask consumers to memoise `columns` and `data`, as TanStack does. `utils/column-label.ts` resolves a column's label (`label`, else a string `header`, else the id). A sortable or hideable column without a plain-text label gets the spec's warning.

### 3. State slices
`hooks/use-table-state.ts` creates one `useControllableState` per slice:
- search value and applied query;
- sorting, pagination, row selection, visibility, pinning, sizing, expanded and highlight;
- the filters popover open state.

The initial value is the feature's `defaultValue` or its neutral value: `[]`, `{}`, `{ pageIndex: 0, pageSize: pageSizes?.[0] ?? 10 }`, and pinning from `column.pin`.

`hooks/use-data-table.ts` passes `state` to `useTable`. Each `on*Change(updater)` resolves the updater with `functionalUpdate(updater, current)` from table-core and calls the setter, which calls the consumer's `onChange`. A controlled slice therefore only changes when the consumer updates `value` (spec "Controlled sorting ignores clicks until accepted").

Auto resets:
- `autoResetPageIndex` is `true` only for client pagination, so a client filter or sort returns to page 1;
- a page-size change sets `pageIndex: 0` in our pagination setter.

`onChange(state, rows)` for the selection resolves `rows` from a `Map<rowId, TData>` that is updated with every row rendered. That way, in server mode, rows selected on another page are still reported.

### 4. Search draft vs applied query
`hooks/use-search.ts` keeps the **draft** (the controllable input value) separate from the **applied query**, which feeds `globalFilter`:
- **submit mode:** Enter or the button applies the draft and calls `onSearch(draft.trim())`;
- **change mode:** a `setTimeout` of `debounceMs` applies it after typing stops, and is cleared on every keystroke and on unmount;
- **clear:** empties both, calls `onSearch("")` and focuses the input through a ref.

The clear button renders only while the draft is not empty. The tooltip wraps the input group (`Tooltip` + `TooltipTrigger asChild`).

### 5. Highlight state and click targets
`hooks/use-highlight.ts` holds `{ columnId?, rowId? }`. Header cells (leaf only) and rows get click handlers that ignore events whose target is inside an interactive descendant (`target.closest("button, a, input, select, textarea, label, [role=checkbox], [role=menuitem], [data-slot=resize-handle]")` within the cell or row).

A second click on the same column or row clears that half. A `keydown` handler on the root clears both on Escape, and calls `stopPropagation` only when something was marked, so Escape still closes menus normally.

Rendering:
- cells of the marked column get `data-highlight-column`;
- the marked row gets `data-highlight-row`;
- the crossing cell gets both, and the CSS gives `[data-highlight-column][data-highlight-row]` the strongest token (`bg-primary/15` + an inset ring), while each half alone uses `bg-primary/5`.

Highlight changes are rare clicks, so re-rendering is acceptable here.

### 6. Column hover by DOM, not state
`hooks/use-column-hover.ts` attaches `pointerover` and `pointerleave` listeners to the table element when `hover.columns` is on:
- every cell carries `data-column-id`, its leaf column id;
- a group header carries `data-column-leaves="a b c"`;
- on `pointerover`, the hook computes the leaf ids of the cell under the pointer, removes `data-column-hover` from the previously marked elements, and sets it on `[data-column-id="<id>"]` (with `CSS.escape`) inside the table;
- `pointerleave` clears it.

No React state changes, so the cells never re-render on pointer movement. Row hover is the shadcn `hover:bg-muted/50` class, removed when `hover.rows` is off. With `hover` omitted there is no hover at all, which is neutral.

*Alternative:* a hovered-column state. That is rejected: every pointer move across columns would re-render the whole body.

### 7. Own table container with shadcn's classes
`components/data-table-content.tsx` renders its own `div[data-slot=table-container]` and `<table data-slot=table>`, with the classes copied from shadcn's `Table` into `utils/data-table-classes.ts`, plus `TableHeader` / `TableBody` / `TableFooter` / `TableRow` / `TableHead` / `TableCell` from shadcn. That way:
- the container is the scroll container, with `overflow-auto` and `maxHeight` for the sticky header;
- the root can attach the hover listeners to the `<table>`.

As with the modal, CONTRIBUTING asks to compare this file after `shadcn:update`. The other class sets also live in `data-table-classes.ts`:
- density: `compact` uses `h-8` headers and `p-1.5` cells;
- `striped`: `even:bg-muted/40`;
- sticky header: `sticky top-0 z-20 bg-background`;
- pinned cells: `sticky z-10 bg-background`, plus `data-pin-edge` for the divider shadow.

### 8. Pinning offsets measured, not assumed
TanStack's offsets come from column sizes, which default to 150px and would be wrong with the browser's automatic layout. So:
- when `resizing` is off, `hooks/use-pinned-offsets.ts` measures the rendered widths of the pinned leaf header cells with one `ResizeObserver` and writes `insetInlineStart` / `insetInlineEnd` as CSS custom properties on the table (`--pin-<id>`). Cells read them through inline `style`;
- when `resizing` is on, the table switches to `table-layout: fixed`, its width is `table.getTotalSize()`, and the offsets come from `getStart("start")` / `getAfter("end")`.

Logical properties keep pinning right in RTL. In jsdom the measured widths are 0: the tests check the sticky attributes and the order, and the stories check the layout.

*Alternative:* force fixed widths whenever something is pinned. That is rejected because pinning would then change the layout, against the independence rule.

### 9. Resizing
`components/data-table-resize-handle.tsx` is a `div[role=separator][aria-orientation=vertical][tabIndex=0]` with `aria-valuenow`, `aria-valuemin` and `aria-valuemax` from the column, named by `resizeLabel(label)`.
- **Pointer:** `header.getResizeHandler()` for mouse and touch, with `columnResizeMode` set to `onChange` or `onEnd` and `columnResizeDirection` from `useInheritedDirection`.
- **Keyboard:** ArrowRight/ArrowLeft change the width by ±10px, mirrored in RTL so the inline-end arrow grows the column, clamped to `minSize`/`maxSize`, through `table.setColumnSizing`. Home and End jump to min and max.

### 10. Toolbar parts
All of them use shadcn parts:
- **search:** `InputGroup`, with `InputGroupInput` and `InputGroupButton` (`SearchIcon`, `XIcon`);
- **reload, filters and columns:** icon `Button`s (`RefreshCwIcon` with `animate-spin motion-reduce:animate-none` while loading, `SlidersHorizontalIcon`, `Columns3Icon`), each in a `Tooltip` showing its label;
- **filters:** a `Popover`, with the count as a `Badge` and `aria-describedby` pointing to a visually hidden count;
- **column visibility:** `DropdownMenu` + `DropdownMenuCheckboxItem`;
- **bulk actions and row actions:** `DropdownMenu` (`EllipsisIcon` for row actions).

Tooltips require the app's `TooltipProvider`, as for fields; the docs say so.

Layout: `flex flex-wrap items-center gap-2`. The search is `min-w-0 flex-1 basis-full sm:basis-auto sm:max-w-sm`, and the button group is `ms-auto`. In RTL the order mirrors with no extra code.

### 11. Pagination bar
`components/data-table-pagination.tsx`, with `flex flex-wrap items-center justify-between gap-2`:
- **start:** the optional range text and the page-size `Select`;
- **end:** `pageLabel` and the icon buttons first/previous/next/last (`ChevronsLeft`, `ChevronLeft`… with `rtl:rotate-180`), disabled from `getCanPreviousPage` / `getCanNextPage`.

Manual mode passes `rowCount` (or `pageCount`) to `useTable`, which computes `getPageCount()`.

### 12. States and live region
- **Loading:**
  - the `<table>` gets `aria-busy`;
  - one visually hidden `role=status` element (polite) shows `loadingLabel` while loading and `selectedLabel(count)` when given;
  - skeleton rows render `Skeleton` in each visible leaf column, only when there are no rows to show, so a refetch keeps the stale rows and the spinner.
- **Empty and error:** each uses one `TableRow` with a `TableCell colSpan={visibleLeafCount}`.

### 13. Texts: types and warnings
`types/data-table-feature-types.ts` defines one option type per feature, with its required texts as required properties. Conditional texts are discriminated unions, as in the fields:
- `selection`: `mode: "single"` has no `selectAllLabel`; actions require `actionsLabel`;
- `pagination`: `pageSizes` requires `pageSizeLabel`; `showFirstLast: true` requires `firstLabel` / `lastLabel`;
- `error`: `onRetry` requires `retryLabel`;
- the root: `loading` requires `loadingLabel`.

`hooks/use-data-table-warnings.ts` builds the `MissingTextCheck` list for untyped code and calls `useMissingTexts("DataTable", checks)`. It also warns about a missing accessible table name and about sortable or hideable columns without a plain-text label. The `no-default-texts` guard covers the folder with no allowlist entry.

### 14. Handle and root props
`tableRef` is a ref prop (React 19). `useImperativeHandle` exposes `{ table, clearSelection, focusSearch, resetHighlight }`. Other root attributes (`id`, `data-*`, `className`) go to the root `div`, and `classNames` targets the inner parts.

### 15. Implementation notes (deviations found while building)
- **Cell backgrounds in CSS, not classes (amends 7).** Stripes, row and column hover, selected, marked and crossing cells, and opaque pinned and sticky cells are rules in `src/styles/data-table.css`, imported by the package stylesheet. Each rule only sets `--dt-cell-bg` inside `:where()`, so their order is the precedence. Tailwind variant order cannot guarantee that precedence between `data-*`, `hover` and `even` utilities, and pinned cells need an opaque base with the state painted on top. `TableRow`'s own hover and selected backgrounds are neutralised (`rowResetClassName`). Only layout classes stay in `data-table-classes.ts`.
- **Pinned offsets in React state (amends 8).** The measured insets are kept in state and applied as inline `inset-inline-*`, instead of CSS variables. The state only changes when a pinned width changes, so it stays cheap, and the cells read plain numbers.
- **Sticky header on `thead`.** The whole `thead` is sticky, so nested header rows stay together. Its cells are opaque through `data-opaque`.
- **Search landmark.** The search uses the native `<search>` element around its `<form>`.
- **Filters count.** The badge sits outside the button, as an `aria-hidden` sibling, and is the button's `aria-describedby`. Inside the button, its digits made the visible text differ from the accessible name (axe `label-content-name-mismatch`).
- **Selection type.** The public `DataTableRowSelection` is `Record<string, boolean>`. It is normalised to TanStack's `Record<string, true>`.
- **Defensive text calls.** The label functions (`sortLabel`, `selectRowLabel`…) are called with `?.()`, so untyped code that omits them gets the warning instead of a crash.
- **Display header cells.** The header cells of the selection (single mode), expansion and row-actions columns are empty `<td>`s, because an empty `<th>` fails axe's `empty-table-header`.

## Risks / Trade-offs

- **[Large prop surface]** Many feature objects and texts. → Each feature is optional and self-contained. The docs page has one section per feature, and the Playground story turns each on and off.
- **[TanStack v9 is recent]** API details can still move in minor versions. → The peer range is `^9`, the code relies only on the documented feature and row-model API, and `tableRef.table` is documented as "the TanStack instance, use at your own risk".
- **[Measured pinning offsets]** One `ResizeObserver` per table, and a layout read per resize. → Only active when columns are pinned and resizing is off. The writes are CSS variables, with no React re-render.
- **[DOM-driven hover]** The hover attributes are set outside React. → They live only on the table's own cells, carry no semantics, and are cleared on leave and unmount. React never renders `data-column-hover`, so there are no conflicts.
- **[Selected rows across pages in server mode]** Rows never rendered cannot be reported. → The row cache covers every row the table has shown. The docs say `onChange`'s `rows` holds the rows seen, and the ids are always complete in `state`.
- **[jsdom gaps]** No layout, no real pointer drag. → Unit tests cover state, ARIA, keyboard resizing and attributes. The Storybook stories (real Chromium) cover pinning, sticky header, drag resizing and hover visuals.

## Migration Plan

This is additive, with nothing to migrate. Consumers that use `DataTable` install `@tanstack/react-table@^9`. Consumers that do not use it get no new peer warning, because the peer is optional. To roll back, remove the component folder and the peer entry.
