## 1. Setup

- [x] 1.1 In `packages/ui/package.json`:
  - add `@tanstack/react-table` to `peerDependencies` (`^9`), with `peerDependenciesMeta: { "@tanstack/react-table": { "optional": true } }`;
  - add it to `devDependencies` (`^9.3.1`).

  Verify that `pnpm install` succeeds, that `pnpm ls --filter @aureus-core/ui @tanstack/react-table` shows 9.3.1, and that `pnpm --filter @aureus-core/ui typecheck` passes.
- [x] 1.2 Add the jsdom shims Radix menus need to `packages/ui/vitest-setup.ts`, only when missing: `Element.prototype.hasPointerCapture`, `releasePointerCapture` and `scrollIntoView`. Verify that the existing `pnpm --filter @aureus-core/ui test` suite still passes.

## 2. Types and utils

- [x] 2.1 Write `data-table/types/`, with an `index.ts`. Verify with `typecheck`.
  - `data-table-column-types.ts` holds `DataTableColumn<TData>` and the `cell`/`footer`/`header` render contexts.
  - `data-table-feature-types.ts` holds one options type per feature, with its required texts and the discriminated unions of design decision 13.
  - `data-table-types.ts` holds `DataTableProps<TData>`, with the `loading` and `loadingLabel` union, and `DataTableHandle`.
- [x] 2.2 Write `data-table/tests/data-table-types-tests.tsx`, with one `@ts-expect-error` case per required text in the spec "No default texts" requirement, plus the valid forms. Verify with `typecheck`, and with an empty `it` so Vitest runs it.
- [x] 2.3 Write the `data-table/utils/` files, with an `index.ts`:
  - `data-table-features.ts` (design decision 1);
  - `data-table-classes.ts` (design decision 7; the header comment names `src/shadcn/ui/table.tsx`);
  - `column-label.ts`;
  - `to-tanstack-columns.ts` (design decision 2).

  Verify with `tests/to-tanstack-columns-tests.ts`:
  - groups keep their children;
  - `sortable`, `hideable` and `resizable` default to `false`;
  - `meta.aureus` carries the label, subtitle, align, pin and class names;
  - the reserved display columns are injected in order only for the features that are on;
  - the label falls back from `label` to a string `header` to the id.

## 3. Hooks

- [x] 3.1 Write `hooks/use-table-state.ts` (design decision 3). Verify with `tests/data-table-state-tests.tsx`, for every slice:
  - uncontrolled with `defaultValue`;
  - uncontrolled with no `defaultValue` (the neutral initial value);
  - controlled, where `value` wins and an `onChange` that does not update it leaves the render unchanged;
  - `onChange` is called on every change;
  - a page-size change resets `pageIndex`.
- [x] 3.2 Write `hooks/use-data-table.ts`: the translated columns, the `useTable` options with the `manual*` and `enable*` flags of design decision 1, the `functionalUpdate` setters, and the selected-rows cache. Verify with `tests/data-table-manual-tests.tsx`:
  - each `manual` flag on its own skips only its client row model;
  - with `pagination.manual` and client sorting, the given rows are sorted but not paginated;
  - selection `rows` includes rows from a previous page in manual mode.
- [x] 3.3 Write `hooks/use-search.ts` (design decision 4). Verify with `tests/data-table-search-tests.tsx`:
  - submit with Enter and with the button;
  - typing does not search in submit mode;
  - change mode with fake timers and `debounceMs`;
  - clear empties the input, calls `onSearch("")`, restores the rows, hides the clear button and focuses the input;
  - client filtering across columns, and a return to page 1;
  - `manual` does not filter;
  - controlled `value`.
- [x] 3.4 Write `hooks/use-highlight.ts` (design decision 5). Verify with `tests/data-table-highlight-tests.tsx`:
  - a header click marks the column, and a second click unmarks it;
  - a row click marks the row;
  - the crossing cell has both attributes;
  - Escape clears both, and does not stop the event when nothing is marked;
  - a click on the sort button, a checkbox or a menu does not mark;
  - controlled `value` and `onChange`.
- [x] 3.5 Write `hooks/use-column-hover.ts` (design decision 6). Verify with `tests/data-table-hover-tests.tsx`, using `fireEvent.pointerOver` / `pointerLeave`:
  - every cell of the column gets `data-column-hover`, header and footer included, and the previous column loses it;
  - a group header marks all its leaves;
  - leaving clears;
  - without `hover.columns` nothing is set;
  - `hover.rows` toggles the row hover class.
- [x] 3.6 Write `hooks/use-pinned-offsets.ts` (design decision 8). Verify with unit tests, using a mocked `ResizeObserver` and `getBoundingClientRect`, that the CSS custom properties hold the accumulated start and end offsets. Also verify that with `resizing` the offsets come from the column sizes.
- [x] 3.7 Write `hooks/use-data-table-warnings.ts` (design decision 13). Verify with `tests/data-table-warnings-tests.tsx`:
  - every missing required text logs one `DataTable:` warning naming it;
  - a missing accessible name and a rich header without `label` warn;
  - a complete configuration logs nothing.

## 4. Components

- [x] 4.1 Write `components/data-table-content.tsx`, `data-table-head-cell.tsx`, `data-table-body.tsx`, `data-table-footer-row.tsx` and `data-table-detail-row.tsx`:
  - nested header rows with `colSpan`, subtitles, alignment and `scope="col"`;
  - the sort button with `aria-sort` on the `th`;
  - `data-column-id` / `data-column-leaves`;
  - density, striped and sticky classes;
  - the footer row only when a column has `footer`;
  - the detail row with `colSpan`.

  Verify with `tests/data-table-columns-tests.tsx` (nested, subtitle, footer presence) and `tests/data-table-sorting-tests.tsx`: three presses give `ascending`, `descending` and none, with the row order; `descFirst`; `multi` with Shift; `manual`; and the controlled case that ignores clicks.
- [x] 4.2 Write `components/data-table-resize-handle.tsx` (design decision 9), and the pinning styles in the head and body cells. Verify with `tests/data-table-resize-tests.tsx`:
  - the ARIA attributes;
  - ArrowRight/ArrowLeft ±10px, clamped to `minSize`/`maxSize`, and mirrored with `dir="rtl"`;
  - Home and End;
  - `onChange`.

  Verify with `tests/data-table-pinning-tests.tsx`:
  - start/end pinned cells are sticky;
  - the edge attributes;
  - the pinning state is controllable;
  - the row-actions column is pinned to the end.
- [x] 4.3 Add the selection column (header checkbox, row checkboxes, indeterminate, `canSelect`, single mode, `aria-selected` / `data-state`) and `components/data-table-selection-actions.tsx`. Verify with `tests/data-table-selection-tests.tsx`:
  - select all on a page vs `"all"`;
  - single mode;
  - disabled rows;
  - `onChange(state, rows)`;
  - the actions button appears only with a selection;
  - menu items receive the rows and `clear` empties the selection;
  - `disabled(rows)`, `renderActions`;
  - the `selectedLabel` live region.
- [x] 4.4 Add the expand column and the detail row, `components/data-table-row-actions.tsx`, and row click with focusable rows. Verify with `tests/data-table-rows-tests.tsx`:
  - the expand button with `aria-expanded` and the detail content;
  - `single` collapses the others;
  - `canExpand`;
  - row-action items receive the row;
  - `onRowClick` on click and on Enter;
  - rows are not focusable without `onRowClick` or `highlight.rows`.
- [x] 4.5 Write `components/data-table-header.tsx`, `data-table-search.tsx`, `data-table-toolbar.tsx`, `data-table-filters.tsx` and `data-table-column-toggle.tsx` (design decision 10). Verify with `tests/data-table-header-tests.tsx`:
  - the title and subtitle;
  - the toolbar order (search first, then the slot, actions, reload, filters, columns);
  - `header={false}` renders nothing, and the header is not rendered when empty;
  - reload calls `onReload` and spins while `loading`;
  - the filters popover shows the slot, the badge count and its description, focus moves in and back, and `open` is controllable;
  - the columns menu hides and shows columns, groups disappear with their last leaf, and visibility is controllable.
- [x] 4.6 Write `components/data-table-pagination.tsx` (design decision 11). Verify with `tests/data-table-pagination-tests.tsx`:
  - client paging over 25 rows;
  - previous/next disabled at the ends;
  - `showFirstLast`;
  - `pageLabel`, and `rangeLabel` when given;
  - the page-size select resets to page 1;
  - manual mode with `rowCount` and with `pageCount`;
  - `pagination={false}` hides it.
- [x] 4.7 Write `data-table.tsx` (the root: state, warnings, the `tableRef` handle, the live region, loading/empty/error, `classNames`) and `index.ts` (`DataTable` and the public types). Verify with `tests/data-table-states-tests.tsx`:
  - loading: `aria-busy`, the label in the live region, skeleton rows only without rows, stale rows kept on refetch;
  - empty slot, and an empty body without it;
  - error with retry;
  - the accessible name from the title;
  - the `tableRef` helpers.
- [x] 4.8 Write `tests/data-table-independence-tests.tsx`. Verify that each feature on its own changes only its own behaviour, using the spec "Independent features" examples plus `highlight` without `hover`, and `selection` without pagination. Run `src/no-default-texts-tests.ts` and verify that it passes with no allowlist entry.

## 5. Playground

- [x] 5.1 Add `apps/storybook/src/fixtures/employees.ts`: about 60 rows with id, name, department, email, phone, start date, salary and status, for nested columns, totals and paging. Verify that `typecheck` passes.
- [x] 5.2 Write `apps/storybook/src/stories/components/data-display/data-table/data-table-stories.tsx` (title `components/Data Display/Data Table`), with these stories:
  - `Playground`, with a boolean control per feature;
  - `Minimal`, `NestedColumns`, `SortingAndHighlight`, `SelectionActions`;
  - `ServerSide` (a simulated async source over the fixture with `setTimeout`, no network);
  - `States`, `PinnedAndResizable`, `ExpandableRows`, `DensityStripedFooter`, `HiddenHeaderAndPagination`.

  Write `play` functions for search submit/clear, the three sort states, the crosshair highlight, selection → actions, the columns menu, pagination, and keyboard resizing. Verify that `pnpm --filter @aureus-core/storybook test` passes, axe included.
- [x] 5.3 Write `data-table-docs.ts` (`defineComponentDocs`, `importPath` `@aureus-core/ui/components/data-table`), in English and Spanish:
  - a summary, and when to use it;
  - the anatomy;
  - one API section per feature object and per root prop, marking the required texts;
  - the columns API;
  - client vs server (`manual`), and controlled state;
  - the stories;
  - the keyboard (sorting, highlight with Escape, rows with Enter, resize arrows/Home/End, menus);
  - the ARIA notes;
  - the `TooltipProvider` requirement.

  Add a note to the shadcn Table docs (`shadcn/data-display/table/table-docs.ts`) that points to `DataTable`. Verify that the coverage test passes.

## 6. Documentation and release

- [x] 6.1 Update `README.md`:
  - the Install section: `@tanstack/react-table` is an optional peer, only for `DataTable`;
  - a "Data table" section with a usage example.

  Update `apps/storybook/src/stories/guides/getting-started.mdx` with the same peer change, in English and Spanish. Verify that `coverage-tests.ts` (bilingual check) passes.
- [x] 6.2 Add a "Data table" section to `CONTRIBUTING.md`:
  - feature objects and their text unions;
  - one source of truth for the state;
  - `manual` per feature;
  - DOM-driven column hover;
  - measured pinning offsets;
  - `data-table-classes.ts`, to compare after `shadcn:update`.

  Add `.changeset/add-data-table.md` (`"@aureus-core/ui": minor`). Verify that `pnpm changeset status` lists the bump.
- [x] 6.3 Final check: run `pnpm lint && pnpm typecheck && pnpm test && pnpm build && pnpm check:package` from the root, and verify that it passes with `data-table` in the checked custom components. Then review by hand in `pnpm run dev`:
  - row and column hover, and the crosshair;
  - pinned columns with horizontal scroll and the sticky header;
  - drag resizing;
  - a narrow viewport (stacked header and pagination);
  - dark mode and RTL.

## 7. Responsive and accessibility hardening

- [x] 7.1 Frame the table: a bordered root, with the header and pagination as muted bands. Line up the edge cells with the bands.
- [x] 7.2 Container queries for the toolbar and pagination, scroll shadows, and narrow-table pinning that keeps the reserved columns pinned (`use-scroll-area.ts`, widths from `use-pinned-offsets.ts`). Verify with `tests/data-table-responsive-tests.tsx`.
- [x] 7.3 One tab stop for rows and markable headers (`use-roving-focus.ts`), keyboard marking, `aria-current`, `aria-controls`, the error `alert`, the pagination live region, `scroll-padding`, forced colors and coarse-pointer targets. Verify with `tests/data-table-keyboard-tests.tsx`.
- [x] 7.4 Add the `Responsive` story and update the bilingual docs (keyboard, ARIA, pinning).
- [x] 7.5 Compact pagination: the page-size select shows an icon (its label is the tooltip), the page text gives way to page buttons with gaps (`utils/page-items.ts`), fewer on narrow tables. Fix the root size container (`@container/data-table`), which was missing. Verify with `tests/page-items-tests.ts` and `tests/data-table-pagination-tests.tsx`.
- [x] 7.6 A root with a fixed height scrolls only the rows: the scroll area fills the height the header and pagination leave. Verify with the `FixedHeight` story.
- [x] 7.7 `columnDividers`: vertical lines between columns (pseudo-elements in `data-table.css`, skipped at pinned edges, CanvasText in forced colors). Verify with the independence test and the `ColumnDividers` story.
- [x] 7.8 `toolbarActions`: custom toolbar buttons like the built-in ones (icon with tooltip, or `showLabel`), with `disabled`, `hidden` and `variant`; required `label` and icon in the types and a development warning. Verify with the header, types and warnings tests and the `ToolbarActions` story.
- [x] 7.9 Hidden-columns badge on the columns button, sharing `DataTableToolbarBadge` with the filters count. Verify with the header tests and the `ColumnsMenu` story.
