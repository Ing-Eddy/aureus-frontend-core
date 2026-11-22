---
"@aureus-core/ui": minor
---

Add `DataTable` (`@aureus-core/ui/components/data-table`): a data table on TanStack Table v9 and the shadcn table parts, with a header, the table and pagination.

- **One object per feature.** `search`, `reload`, `filters`, `columnToggle`, `sorting`, `highlight`, `hover`, `selection`, `expansion`, `rowActions`, `resizing`, `pinning` and `pagination`. Passing one turns the feature on, and TypeScript requires the texts it needs. `header={false}` and `pagination={false}` hide those areas.
- **Header.** Title, subtitle and your own toolbar content. A search box at the inline start, with a placeholder, a tooltip, a search button and a clear button; it searches on submit, or on change with a debounce. Icon buttons for reload, advanced filters (a popover slot with a count badge) and column visibility.
- **Columns (`DataTableColumn<TData>`).** Text or rich headers with a `subtitle`, and nested columns. Three-state sorting (single or multiple, `descFirst`). Hiding, start/end pinning, sizes and resizing (pointer and keyboard). Cell and footer renderers, alignment.
- **Interaction.** Mark a column and a row by clicking: the crossing cell stands out, and Escape clears. Row and column hover. Row selection (single or multiple, `canSelect`, select all by page or every row) with a bulk-actions menu, or your own content, that receives the selected rows. Expandable detail rows, a per-row actions menu, and `onRowClick` with keyboard activation.
- **States and layout.** Loading (skeleton rows, `aria-busy`, a spinning reload), empty and error slots (with retry). `density`, `striped`, `stickyHeader` and `maxHeight`. A footer row when a column defines `footer`.
- **Pagination.** Previous/next and optional first/last buttons, the page label, optional range text and a page-size select, in client or manual mode (`rowCount` / `pageCount`).
- **Full control.** Every state slice takes `value` / `defaultValue` / `onChange`. Search, sorting and pagination each have their own `manual` flag for server data. `tableRef` exposes the TanStack instance, `clearSelection`, `focusSearch` and `resetHighlight`.
- **No default texts.** Every visible and accessible text comes from props. Development warnings name missing texts, a table without an accessible name, and rich headers without `label`.
- **Peer dependency.** `@tanstack/react-table` `^9` is a new **optional** peer dependency, needed only by `DataTable`. The stylesheet gains the data-table cell rules.
