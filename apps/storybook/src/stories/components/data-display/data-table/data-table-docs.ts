import { defineComponentDocs } from "@sb/docs/define-component-docs";

const controllable = (type: string) => ({
  value: { type },
  defaultValue: { type },
  onChange: { type: `(value: ${type}) => void` },
});

export const docs = defineComponentDocs({
  name: "Data Table",
  importPath: "@aureus-core/ui/components/data-table",
  exports: ["DataTable", "type DataTableColumn", "type DataTableProps", "type DataTableHandle"],
  primitive: { label: "TanStack Table v9", href: "https://tanstack.com/table/latest" },
  providers: [{ name: "TooltipProvider", importPath: "@aureus-core/ui/shadcn/tooltip" }],
  api: {
    DataTable: {
      data: { type: "readonly TData[]", required: true },
      columns: { type: "readonly DataTableColumn<TData>[]", required: true },
      getRowId: { type: "(row: TData, index: number) => string", default: "the index" },
      "aria-label": { type: "string" },
      loading: { type: "boolean", default: "false" },
      loadingLabel: { type: "string" },
      loadingRows: { type: "number", default: "5" },
      empty: { type: "ReactNode" },
      error: { type: "{ content: ReactNode; onRetry?: () => void; retryLabel?: string }" },
      density: { type: '"default" | "compact"', default: '"default"' },
      striped: { type: "boolean", default: "false" },
      columnDividers: { type: "boolean", default: "false" },
      stickyHeader: { type: "boolean", default: "false" },
      maxHeight: { type: "number | string" },
      onRowClick: { type: "(row: TData, event) => void" },
      tableRef: { type: "Ref<DataTableHandle<TData>>" },
      className: { type: "string" },
      classNames: { type: "DataTableClassNames" },
    },
    DataTableColumn: {
      "accessorKey | accessorFn | id": {
        type: "keyof TData | (row) => value | string",
        required: true,
      },
      header: { type: "ReactNode | ({ label }) => ReactNode", required: true },
      label: { type: "string" },
      subtitle: { type: "ReactNode" },
      columns: { type: "DataTableColumn<TData>[]" },
      cell: { type: "({ value, row, rowId, rowIndex }) => ReactNode" },
      footer: { type: "ReactNode | ({ rows }) => ReactNode" },
      align: { type: '"start" | "center" | "end"', default: '"start"' },
      sortable: { type: "boolean", default: "false" },
      sortFn: { type: '"alphanumeric" | "text" | "datetime" | "basic" | (a, b) => number' },
      hideable: { type: "boolean", default: "false" },
      pin: { type: '"start" | "end"' },
      "size | minSize | maxSize": { type: "number", default: "150 | 20 | —" },
      resizable: { type: "boolean", default: "false" },
    },
    header: {
      title: { type: "ReactNode" },
      subtitle: { type: "ReactNode" },
      toolbar: { type: "ReactNode" },
    },
    search: {
      label: { type: "string", required: true },
      submitLabel: { type: "string", required: true },
      clearLabel: { type: "string", required: true },
      placeholder: { type: "string" },
      tooltip: { type: "ReactNode" },
      trigger: { type: '"submit" | "change"', default: '"submit"' },
      debounceMs: { type: "number", default: "0" },
      onSearch: { type: "(query: string) => void" },
      manual: { type: "boolean", default: "false" },
      "value | defaultValue | onValueChange": { type: "string" },
    },
    toolbarActions: {
      id: { type: "string", required: true },
      label: { type: "string", required: true },
      icon: { type: "ReactNode", required: true },
      onClick: { type: "() => void", required: true },
      showLabel: { type: "boolean", default: "false" },
      disabled: { type: "boolean", default: "false" },
      hidden: { type: "boolean", default: "false" },
      variant: {
        type: '"outline" | "default" | "secondary" | "destructive"',
        default: '"outline"',
      },
    },
    reload: {
      label: { type: "string", required: true },
      onReload: { type: "() => void", required: true },
      disabled: { type: "boolean", default: "false" },
    },
    filters: {
      label: { type: "string", required: true },
      content: { type: "ReactNode", required: true },
      activeCount: { type: "number" },
      "open | defaultOpen | onOpenChange": { type: "boolean" },
    },
    columnToggle: {
      label: { type: "string", required: true },
      menuLabel: { type: "ReactNode" },
      ...controllable("Record<string, boolean>"),
    },
    sorting: {
      sortLabel: {
        type: '(column: string, next: "ascending" | "descending" | "none") => string',
        required: true,
      },
      multi: { type: "boolean", default: "false" },
      descFirst: { type: "boolean", default: "false" },
      manual: { type: "boolean", default: "false" },
      ...controllable("{ id: string; desc: boolean }[]"),
    },
    highlight: {
      columns: { type: "boolean", default: "false" },
      rows: { type: "boolean", default: "false" },
      ...controllable("{ columnId?: string; rowId?: string }"),
    },
    hover: {
      rows: { type: "boolean", default: "false" },
      columns: { type: "boolean", default: "false" },
    },
    selection: {
      selectRowLabel: { type: "(row: TData) => string", required: true },
      mode: { type: '"multiple" | "single"', default: '"multiple"' },
      selectAllLabel: { type: "string" },
      selectAllScope: { type: '"page" | "all"', default: '"page"' },
      canSelect: { type: "(row: TData) => boolean" },
      actions: { type: "DataTableBulkAction<TData>[]" },
      renderActions: { type: "(rows: TData[], clear: () => void) => ReactNode" },
      actionsLabel: { type: "string" },
      selectedLabel: { type: "(count: number) => string" },
      "value | defaultValue": { type: "Record<string, boolean>" },
      onChange: { type: "(value, rows: TData[]) => void" },
    },
    expansion: {
      renderDetail: { type: "(row: TData) => ReactNode", required: true },
      expandLabel: { type: "(row: TData, expanded: boolean) => string", required: true },
      canExpand: { type: "(row: TData) => boolean" },
      single: { type: "boolean", default: "false" },
      ...controllable("Record<string, boolean>"),
    },
    rowActions: {
      label: { type: "(row: TData) => string", required: true },
      items: { type: "(row: TData) => DataTableRowAction<TData>[]", required: true },
    },
    resizing: {
      resizeLabel: { type: "(column: string) => string", required: true },
      mode: { type: '"onChange" | "onEnd"', default: '"onChange"' },
      ...controllable("Record<string, number>"),
    },
    pinning: controllable("{ start: string[]; end: string[] }"),
    pagination: {
      previousLabel: { type: "string", required: true },
      nextLabel: { type: "string", required: true },
      pageLabel: { type: "(page: number, pageCount: number) => string", required: true },
      rangeLabel: { type: "(from: number, to: number, total: number) => string" },
      pageSizes: { type: "number[]" },
      pageSizeLabel: { type: "string" },
      showFirstLast: { type: "boolean", default: "false" },
      "firstLabel | lastLabel": { type: "string" },
      manual: { type: "boolean", default: "false" },
      "rowCount | pageCount": { type: "number" },
      ...controllable("{ pageIndex: number; pageSize: number }"),
    },
    DataTableHandle: {
      table: { type: "TanStack Table instance" },
      clearSelection: { type: "() => void" },
      focusSearch: { type: "() => void" },
      resetHighlight: { type: "() => void" },
    },
  },
  stories: [
    "Minimal",
    "NestedColumns",
    "SortingAndHighlight",
    "SelectionActions",
    "ServerSide",
    "States",
    "PinnedAndResizable",
    "ExpandableRows",
    "DensityStripedFooter",
    "HiddenHeaderAndPagination",
    "ColumnsMenu",
    "Responsive",
    "FixedHeight",
    "ColumnDividers",
    "ToolbarActions",
  ],
  keyboard: [
    "Tab",
    "Enter",
    "Space",
    "Escape",
    "Shift + Enter / Shift + click",
    "ArrowUp / ArrowDown",
    "ArrowLeft / ArrowRight",
    "Home / End",
  ],
  links: [
    { label: "TanStack Table", href: "https://tanstack.com/table/latest" },
    { label: "WAI-ARIA: Table", href: "https://www.w3.org/WAI/ARIA/apg/patterns/table/" },
  ],
  en: {
    summary:
      "A data table with a header (title, search and tools), the table and pagination. Every feature is an object prop: passing it turns the feature on, and TypeScript asks for the texts it needs. Every piece of state can be controlled, and each feature has its own `manual` flag for data that lives on a server.",
    whenToUse: [
      "Lists of records that people search, sort, select or page through: users, orders, invoices.",
      "Tables whose data comes page by page from a server (`manual` on search, sorting and pagination).",
      "Wide tables that need pinned columns, resizable widths or a sticky header.",
    ],
    whenNotToUse: [
      "A small static table with no interaction: use the shadcn `Table` parts.",
      "Spreadsheet-like editing of cells, or thousands of rows on one page (no virtualisation).",
    ],
    anatomy: {
      DataTable:
        "The root. It renders the header, the table and the pagination, and holds every state slice. Install `@tanstack/react-table@^9` (an optional peer dependency) to use it.",
      DataTableColumn:
        "One column: an accessor or a display column, or a group with `columns` (nested headers). `label` names it in menus and sort labels.",
      header:
        "Title, subtitle and your own `toolbar` content. `header={false}` hides the whole header.",
      search:
        'The search box at the inline start of the toolbar, with a search button and a clear button. It searches on Enter or the button, or while typing with `trigger: "change"`.',
      toolbarActions:
        "Your own buttons in the toolbar, before reload, filters and columns, drawn like the built-in ones: icon buttons with their label as tooltip, or buttons with text (`showLabel`). Each one can be disabled or hidden.",
      reload: "An icon button that calls `onReload`. Its icon spins while `loading`.",
      filters:
        "An icon button that opens a popover with your own filter inputs (`content`), with an optional count badge.",
      columnToggle:
        "An icon button with a menu to show or hide the `hideable` columns. While some are hidden, a badge on the button shows how many (also the button's description), so people know the view was changed.",
      sorting:
        "A sort button in every `sortable` header that cycles none → ascending → descending → none.",
      highlight:
        "Click a header to mark its column and a row to mark the row; the crossing cell stands out. Click again to unmark, Escape clears both.",
      hover: "Highlights the row and/or the column under the pointer.",
      selection:
        "A checkbox column. While rows are selected, a bulk-actions button appears in the toolbar and its actions receive the selected rows.",
      expansion: "A toggle per row that shows a full-width detail row.",
      rowActions: "A menu per row, in a column pinned to the end.",
      resizing: "A resize handle in every `resizable` header, by drag or keyboard.",
      pinning:
        "The pinned columns. They start from each column's `pin`. When they would take more than half of a narrow table, they scroll with the rest until the table is wide enough again; the pinning state does not change.",
      pagination:
        "Compact: an optional page-size select (an icon and the size, with `pageSizeLabel` as its tooltip) and range text on one side; previous/next (and optional first/last) buttons around the page buttons on the other. The page buttons always show the first and last pages and the pages around the current one, with gaps in between; narrow tables list fewer. `pagination={false}` shows every row.",
      DataTableHandle: "What `tableRef` exposes: the TanStack instance and a few helpers.",
    },
    props: {
      DataTable: {
        data: "The rows. Memoise it: a new array re-runs every row model.",
        columns: "The columns. Memoise them as well.",
        getRowId:
          "Stable row ids. Needed for selection, expansion and highlight to survive data changes.",
        "aria-label":
          "The table's accessible name. Without it, the header `title` names the table.",
        loading:
          "Shows skeleton rows when there are no rows, sets `aria-busy` and spins the reload icon. Requires `loadingLabel`.",
        loadingLabel: "Announced while loading.",
        loadingRows: "How many skeleton rows to show.",
        empty:
          "Shown in a full-width row when there is nothing to show. Without it, the body stays empty.",
        error: "Replaces the rows. `onRetry` adds a button named by the required `retryLabel`.",
        density: "`compact` reduces padding and row height.",
        striped: "Alternates the row background.",
        columnDividers:
          "Draws a vertical line between columns, in the header, body and footer. Pinned edges keep their own divider.",
        stickyHeader: "Keeps the header rows visible while the body scrolls.",
        maxHeight:
          "Maximum height of the rows' scrolling area alone (with `stickyHeader`). To size the whole table, give the root a height with `className` instead.",
        onRowClick:
          "Called when a row is clicked or activated with Enter, never from its controls. Makes rows focusable.",
        tableRef: "Gives you `DataTableHandle`.",
        className:
          "Classes for the root. Give it a height (`h-[480px]`, or `h-full` in a sized parent) and the header and pagination stay in place while only the rows scroll; add `stickyHeader` to keep the column headers visible.",
        classNames:
          "Classes for the root, header, toolbar, container, table, header rows, rows, cells, footer and pagination.",
      },
      DataTableColumn: {
        "accessorKey | accessorFn | id":
          "`accessorKey` reads `row[key]` (the cell value is typed from it); `accessorFn` computes it (needs `id`); only `id` makes a display column.",
        header: "Text, a node, or a render function.",
        label:
          "Plain text for menus, sort labels and warnings. Defaults to `header` when it is a string.",
        subtitle: "Shown under the header text.",
        columns: "Child columns: this column becomes a group whose header spans them.",
        cell: "The cell content. Default: the value as text.",
        footer:
          "The footer of this column; the footer row appears when any column has one. `rows` are the searched rows on every page.",
        align: "Alignment of the header, cells and footer.",
        sortable: "Adds a sort button when `sorting` is on.",
        sortFn: "How the column sorts: a built-in name or a compare function of two rows.",
        hideable: "Lists the column in the columns menu.",
        pin: "Pins the column to an edge from the start.",
        "size | minSize | maxSize": "Widths in pixels, used by `resizing`.",
        resizable: "Adds a resize handle when `resizing` is on.",
      },
      header: {
        title: "Shown at the top; it also names the table when there is no `aria-label`.",
        subtitle: "Shown under the title.",
        toolbar: "Your own content, at the inline end before the built-in buttons.",
      },
      search: {
        label: "Accessible name of the input.",
        submitLabel: "Accessible name of the search button.",
        clearLabel: "Accessible name of the clear button, shown while the input is not empty.",
        placeholder: "Placeholder of the input.",
        tooltip: "Tooltip on the input.",
        trigger: "`submit` searches on Enter or the button; `change` while typing.",
        debounceMs: 'Delay after the last keystroke with `trigger: "change"`.',
        onSearch:
          "Called with the trimmed query when it is applied (an empty string when cleared).",
        manual: "Does not filter in the client: only the callbacks run.",
        "value | defaultValue | onValueChange": "The input value, controlled or not.",
      },
      toolbarActions: {
        id: "A unique key.",
        label: "Accessible name and tooltip; the visible text with `showLabel`.",
        icon: "The icon. Required unless `showLabel` is `true`.",
        onClick: "Called when the button is pressed.",
        showLabel: "Shows `label` as text, next to the icon if there is one.",
        disabled: "Disables the button.",
        hidden:
          "Leaves the button out. With every action hidden and nothing else in the header, the header is not shown.",
        variant: "The button style; `outline` matches the built-in buttons.",
      },
      reload: {
        label: "Accessible name and tooltip.",
        onReload: "Called when the button is pressed.",
        disabled: "Disables the button.",
      },
      filters: {
        label: "Accessible name and tooltip.",
        content: "Your filter inputs and logic, shown in the popover.",
        activeCount: "Shown as a badge (and as the button's description) when greater than zero.",
        "open | defaultOpen | onOpenChange": "The popover state, controlled or not.",
      },
      columnToggle: {
        label: "Accessible name and tooltip.",
        menuLabel: "Optional heading inside the menu.",
        value: "Controlled visibility by column id (`false` hides).",
        defaultValue: "Initial visibility.",
        onChange: "Called with the visibility on every change.",
      },
      sorting: {
        sortLabel:
          "Accessible name of a sort button: the column label and the direction a press sets.",
        multi: "Shift+press adds the column to the current sort.",
        descFirst: "The first press sorts descending.",
        manual: "Does not sort in the client: only `onChange` runs.",
        value: "Controlled sorting.",
        defaultValue: "Initial sorting.",
        onChange: "Called with the sorting on every change.",
      },
      highlight: {
        columns: "Clicking a header marks its column.",
        rows: "Clicking a row marks it; rows become focusable (Enter marks too).",
        value: "Controlled marks.",
        defaultValue: "Initial marks.",
        onChange: "Called with the marks on every change.",
      },
      hover: {
        rows: "Highlights the row under the pointer.",
        columns:
          "Highlights every cell of the column under the pointer, header and footer included.",
      },
      selection: {
        selectRowLabel: "Accessible name of a row checkbox.",
        mode: "`single` selects one row at a time and has no header checkbox.",
        selectAllLabel: "Accessible name of the header checkbox (required in multiple mode).",
        selectAllScope: "Whether the header checkbox selects the page or every row.",
        canSelect: "Disables the checkbox of rows that cannot be selected.",
        actions:
          "Bulk actions: `{ id, label, icon?, variant?, disabled?(rows), hidden?(rows), onSelect(rows, clear) }`. `hidden` leaves an action out for the current selection; with every action hidden, the button is not shown.",
        renderActions: "Your own menu content instead of `actions`.",
        actionsLabel: "Visible name of the bulk-actions button (required with actions).",
        selectedLabel: "Visible count, announced politely.",
        "value | defaultValue": "Selected rows by id, controlled or not.",
        onChange:
          "Called with the selection and the data of the selected rows the table has shown.",
      },
      expansion: {
        renderDetail: "The content of the detail row.",
        expandLabel: "Accessible name of a row's toggle.",
        canExpand: "Rows without a toggle return `false`.",
        single: "Expanding a row collapses the others.",
        value: "Controlled expanded rows.",
        defaultValue: "Initially expanded rows.",
        onChange: "Called with the expanded rows on every change.",
      },
      rowActions: {
        label: "Accessible name of a row's menu button.",
        items:
          "The menu items: `{ id, label, icon?, variant?, disabled?, hidden?, onSelect(row) }`. `items` runs per row, so `disabled` and `hidden` can depend on it; a row with every item hidden shows no menu button.",
      },
      resizing: {
        resizeLabel: "Accessible name of a resize handle.",
        mode: "`onChange` resizes while dragging; `onEnd` when the drag ends.",
        value: "Controlled widths by column id.",
        defaultValue: "Initial widths.",
        onChange: "Called with the widths on every change.",
      },
      pinning: {
        value: "Controlled pinned columns.",
        defaultValue: "Initially pinned columns (default: each column's `pin`).",
        onChange: "Called with the pinned columns on every change.",
      },
      pagination: {
        previousLabel: "Accessible name of the previous button.",
        nextLabel: "Accessible name of the next button.",
        pageLabel:
          "The accessible name of each page button, such as `Page 3 of 10`. Without `rangeLabel`, it also announces the current page when it changes.",
        rangeLabel:
          "Visible range text, such as `11–20 of 95`. It also announces page and search changes.",
        pageSizes: "Options of the page-size select; the first one is the initial size.",
        pageSizeLabel:
          "Accessible name and tooltip of the page-size select (required with `pageSizes`); it is not shown as text.",
        showFirstLast:
          "Adds first and last buttons (named by the required `firstLabel` / `lastLabel`).",
        "firstLabel | lastLabel": "Accessible names of the first and last buttons.",
        manual: "`data` is the current page: only `onChange` runs.",
        "rowCount | pageCount": "Totals in manual mode.",
        value: "Controlled page.",
        defaultValue: "Initial page.",
        onChange:
          "Called with the page on every change. Changing the page size returns to the first page.",
      },
      DataTableHandle: {
        table:
          "The underlying TanStack Table instance. Its API may change between TanStack versions.",
        clearSelection: "Empties the selection.",
        focusSearch: "Moves focus to the search input.",
        resetHighlight: "Clears the marked column and row.",
      },
    },
    stories: {
      Minimal: "Only `data`, `columns` and an accessible name: a plain table of every row.",
      NestedColumns:
        "Group columns with subtitles; their headers span their children. Hover marks whole columns.",
      SortingAndHighlight:
        "Three-state sorting, and the crosshair: click the Salary header, then a row; Escape clears.",
      SelectionActions:
        "Selecting rows shows the bulk-actions button; Remove deletes them and clears the selection.",
      ServerSide:
        "A simulated server: search, sorting and pagination are `manual` and controlled; the table only shows the page it receives.",
      States: "Loading skeleton rows, an empty slot, and an error with retry.",
      PinnedAndResizable:
        "Name pinned to the start, Salary to the end, resizable widths and a sticky header.",
      ExpandableRows: "One detail row at a time, and a per-row actions menu.",
      DensityStripedFooter: "Compact density, striped rows and a totals footer.",
      ColumnDividers: "`columnDividers` with nested columns: lines between every column.",
      ToolbarActions:
        "Custom toolbar buttons: Export and Print as icon buttons, a disabled one, and New employee with its text.",
      HiddenHeaderAndPagination:
        "`header={false}` and `pagination={false}`: only the table is shown.",
      ColumnsMenu: "The columns menu hides and shows the hideable columns.",
      Responsive:
        "A resizable box: the header, toolbar and pagination follow the table's own width (container queries), the pinned Name column scrolls when the table is narrow, and shadows show the hidden edges.",
      FixedHeight:
        '`className="h-[26rem]"` on the root: the header and pagination stay in place and only the rows scroll, under a sticky header.',
    },
    keyboard: {
      Tab: "Reaches the toolbar, the scroll container while it scrolls, the markable headers and the focusable rows (one tab stop each), and the controls in the cells.",
      Enter:
        "In the search input, applies the search. On a focused row (with `onRowClick` or `highlight.rows`), activates it. On a focused header (with `highlight.columns`), marks its column.",
      Space: "On a focused header (with `highlight.columns`), marks or unmarks its column.",
      Escape: "Clears the marked column and row; closes the open menu or popover.",
      "Shift + Enter / Shift + click":
        "On a sort button with `sorting.multi`, adds the column to the current sort.",
      "ArrowUp / ArrowDown": "On a focused row, moves to the previous or next row.",
      "ArrowLeft / ArrowRight":
        "On a focused header, moves to the previous or next markable header. On a resize handle, narrows or widens the column by 10px. Both are mirrored in right-to-left.",
      "Home / End":
        "On a focused row or header, moves to the first or last one. On a resize handle, sets the minimum or maximum width.",
    },
    aria: [
      "The table is named by `aria-label`, `aria-labelledby` or the header `title`; a development warning names a table without a name.",
      'Header cells use `scope="col"` (`colgroup` for groups), and sorted columns carry `aria-sort`.',
      "Selected rows carry `aria-selected`; every checkbox, toggle and menu button is named by its required text.",
      "Loading sets `aria-busy` and announces `loadingLabel` in a polite status region.",
      "Resize handles are focusable `separator`s with `aria-valuenow`, `aria-valuemin` and `aria-valuemax`.",
      "The toolbar buttons are icon buttons named by their `label`, also shown as a tooltip: mount `TooltipProvider` once in the app.",
      "While the table scrolls, its container is a focusable `region` with the table's name, so keyboard users can scroll it; focus is never hidden under the pinned columns or the sticky header (`scroll-padding`).",
      "The marked column header and the marked row carry `aria-current`. Expand buttons point to their detail row with `aria-controls`.",
      "The error state is an `alert`. The range label (or the page label without it) is a polite live region, so page and search changes are announced.",
      'Page buttons are named by `pageLabel` and the current one has `aria-current="page"`; the gaps are hidden from assistive technology.',
      "Forced colors (Windows high contrast) outline the selected, marked and crossing cells with system colors. Animations respect `prefers-reduced-motion`; touch screens get larger pagination buttons and resize handles.",
    ],
    theming: [
      "Cell backgrounds (stripes, hover, selected, marked, crossing) come from `--muted` and `--primary`; pinned and sticky cells use `--background`.",
      "Pinned edges use `--border`. Override the tokens in your theme, or use `classNames` for layout tweaks.",
    ],
  },
  es: {
    summary:
      "Una tabla de datos con un header (título, búsqueda y herramientas), la tabla y la paginación. Cada funcionalidad es un prop-objeto: al pasarlo se activa, y TypeScript pide los textos que necesita. Todo el estado se puede controlar, y cada funcionalidad tiene su propio `manual` para datos que viven en un servidor.",
    whenToUse: [
      "Listas de registros que se buscan, ordenan, seleccionan o paginan: usuarios, pedidos, facturas.",
      "Tablas cuyos datos llegan página a página desde un servidor (`manual` en búsqueda, orden y paginación).",
      "Tablas anchas que necesitan columnas fijas, anchos redimensionables o un header pegajoso.",
    ],
    whenNotToUse: [
      "Una tabla pequeña y estática sin interacción: usa las piezas `Table` de shadcn.",
      "Edición de celdas tipo hoja de cálculo, o miles de filas en una página (no hay virtualización).",
    ],
    anatomy: {
      DataTable:
        "La raíz. Muestra el header, la tabla y la paginación, y guarda todo el estado. Instala `@tanstack/react-table@^9` (una peer dependency opcional) para usarla.",
      DataTableColumn:
        "Una columna: un accessor o una columna de presentación, o un grupo con `columns` (encabezados anidados). `label` la nombra en menús y etiquetas de orden.",
      header:
        "Título, subtítulo y tu propio contenido en `toolbar`. `header={false}` oculta todo el header.",
      search:
        'La búsqueda al inicio de la barra, con un botón de buscar y otro de limpiar. Busca con Enter o el botón, o mientras se escribe con `trigger: "change"`.',
      toolbarActions:
        "Tus propios botones en la barra, antes de recargar, filtros y columnas, con el mismo aspecto que los integrados: botones de icono con su label como tooltip, o botones con texto (`showLabel`). Cada uno se puede desactivar u ocultar.",
      reload: "Un botón de icono que llama a `onReload`. Su icono gira mientras `loading`.",
      filters:
        "Un botón de icono que abre un popover con tus propios filtros (`content`), con un contador opcional.",
      columnToggle:
        "Un botón de icono con un menú para mostrar u ocultar las columnas `hideable`. Mientras haya alguna oculta, un badge en el botón indica cuántas (también es la descripción del botón), para que se sepa que la vista está modificada.",
      sorting:
        "Un botón de orden en cada encabezado `sortable` que recorre sin orden → ascendente → descendente → sin orden.",
      highlight:
        "Clic en un encabezado marca su columna y clic en una fila marca la fila; la celda del cruce resalta más. Otro clic desmarca y Escape limpia ambas.",
      hover: "Resalta la fila y/o la columna bajo el puntero.",
      selection:
        "Una columna de checkboxes. Mientras haya filas seleccionadas aparece un botón de acciones en la barra, y sus acciones reciben las filas seleccionadas.",
      expansion: "Un botón por fila que muestra una fila de detalle a todo el ancho.",
      rowActions: "Un menú por fila, en una columna fija al final.",
      resizing:
        "Un separador para redimensionar en cada encabezado `resizable`, con arrastre o teclado.",
      pinning:
        "Las columnas fijas. Parten del `pin` de cada columna. Si ocuparían más de la mitad de una tabla estrecha, se desplazan con el resto hasta que la tabla vuelve a tener ancho suficiente; el estado de fijado no cambia.",
      pagination:
        "Compacta: un selector de tamaño opcional (un icono y el tamaño, con `pageSizeLabel` como tooltip) y el texto de rango a un lado; los botones anterior/siguiente (y primera/última opcionales) alrededor de los botones de página al otro. Los botones de página siempre muestran la primera y la última página y las cercanas a la actual, con huecos entre medias; las tablas estrechas listan menos. `pagination={false}` muestra todas las filas.",
      DataTableHandle: "Lo que expone `tableRef`: la instancia de TanStack y algunas utilidades.",
    },
    props: {
      DataTable: {
        data: "Las filas. Memorízalas: un array nuevo recalcula todos los modelos de filas.",
        columns: "Las columnas. Memorízalas también.",
        getRowId:
          "Ids estables de fila. Necesarios para que la selección, la expansión y el marcado sobrevivan a cambios de datos.",
        "aria-label": "El nombre accesible de la tabla. Sin él, la nombra el `title` del header.",
        loading:
          "Muestra filas skeleton cuando no hay filas, pone `aria-busy` y hace girar el icono de recargar. Requiere `loadingLabel`.",
        loadingLabel: "Se anuncia mientras carga.",
        loadingRows: "Cuántas filas skeleton mostrar.",
        empty:
          "Se muestra en una fila a todo el ancho cuando no hay nada que mostrar. Sin él, el cuerpo queda vacío.",
        error:
          "Reemplaza las filas. `onRetry` añade un botón con el texto obligatorio `retryLabel`.",
        density: "`compact` reduce el padding y la altura de fila.",
        striped: "Alterna el fondo de las filas.",
        columnDividers:
          "Dibuja una línea vertical entre columnas, en el encabezado, el cuerpo y el footer. Los bordes de las columnas fijas mantienen su propia línea.",
        stickyHeader: "Mantiene visibles los encabezados mientras el cuerpo hace scroll.",
        maxHeight:
          "Altura máxima solo del área con scroll de las filas (con `stickyHeader`). Para dar tamaño a toda la tabla, dale un alto a la raíz con `className`.",
        onRowClick:
          "Se llama al hacer clic en una fila o activarla con Enter, nunca desde sus controles. Hace las filas focusables.",
        tableRef: "Te da `DataTableHandle`.",
        className:
          "Clases para la raíz. Dale un alto (`h-[480px]`, o `h-full` dentro de un padre con alto) y el header y la paginación se quedan en su sitio mientras solo se desplazan las filas; añade `stickyHeader` para mantener visibles los encabezados de columna.",
        classNames:
          "Clases para la raíz, el header, la barra, el contenedor, la tabla, las filas de encabezado, las filas, las celdas, el footer y la paginación.",
      },
      DataTableColumn: {
        "accessorKey | accessorFn | id":
          "`accessorKey` lee `row[key]` (el valor de la celda se tipa a partir de él); `accessorFn` lo calcula (necesita `id`); solo `id` crea una columna de presentación.",
        header: "Texto, un nodo o una función de render.",
        label:
          "Texto plano para menús, etiquetas de orden y avisos. Por defecto, `header` cuando es un string.",
        subtitle: "Se muestra bajo el texto del encabezado.",
        columns: "Columnas hijas: esta columna pasa a ser un grupo cuyo encabezado las abarca.",
        cell: "El contenido de la celda. Por defecto, el valor como texto.",
        footer:
          "El footer de esta columna; la fila de footer aparece si alguna columna lo tiene. `rows` son las filas buscadas de todas las páginas.",
        align: "Alineación del encabezado, las celdas y el footer.",
        sortable: "Añade un botón de orden cuando `sorting` está activo.",
        sortFn: "Cómo ordena la columna: un nombre integrado o una función que compara dos filas.",
        hideable: "Incluye la columna en el menú de columnas.",
        pin: "Fija la columna a un borde desde el inicio.",
        "size | minSize | maxSize": "Anchos en píxeles, usados por `resizing`.",
        resizable: "Añade un separador para redimensionar cuando `resizing` está activo.",
      },
      header: {
        title: "Se muestra arriba; también nombra la tabla cuando no hay `aria-label`.",
        subtitle: "Se muestra bajo el título.",
        toolbar: "Tu propio contenido, al final de la barra, antes de los botones integrados.",
      },
      search: {
        label: "Nombre accesible del input.",
        submitLabel: "Nombre accesible del botón de buscar.",
        clearLabel:
          "Nombre accesible del botón de limpiar, visible mientras el input no esté vacío.",
        placeholder: "Placeholder del input.",
        tooltip: "Tooltip del input.",
        trigger: "`submit` busca con Enter o el botón; `change` mientras se escribe.",
        debounceMs: 'Espera tras la última tecla con `trigger: "change"`.',
        onSearch:
          "Se llama con la consulta sin espacios al aplicarse (un string vacío al limpiar).",
        manual: "No filtra en el cliente: solo se ejecutan los callbacks.",
        "value | defaultValue | onValueChange": "El valor del input, controlado o no.",
      },
      toolbarActions: {
        id: "Una clave única.",
        label: "Nombre accesible y tooltip; el texto visible con `showLabel`.",
        icon: "El icono. Obligatorio salvo con `showLabel: true`.",
        onClick: "Se llama al pulsar el botón.",
        showLabel: "Muestra `label` como texto, junto al icono si lo hay.",
        disabled: "Desactiva el botón.",
        hidden:
          "Quita el botón. Si todas las acciones están ocultas y no hay nada más en el header, el header no se muestra.",
        variant: "El estilo del botón; `outline` coincide con los botones integrados.",
      },
      reload: {
        label: "Nombre accesible y tooltip.",
        onReload: "Se llama al pulsar el botón.",
        disabled: "Desactiva el botón.",
      },
      filters: {
        label: "Nombre accesible y tooltip.",
        content: "Tus inputs y lógica de filtros, dentro del popover.",
        activeCount:
          "Se muestra como badge (y como descripción del botón) cuando es mayor que cero.",
        "open | defaultOpen | onOpenChange": "El estado del popover, controlado o no.",
      },
      columnToggle: {
        label: "Nombre accesible y tooltip.",
        menuLabel: "Encabezado opcional dentro del menú.",
        value: "Visibilidad controlada por id de columna (`false` oculta).",
        defaultValue: "Visibilidad inicial.",
        onChange: "Se llama con la visibilidad en cada cambio.",
      },
      sorting: {
        sortLabel:
          "Nombre accesible de un botón de orden: la etiqueta de la columna y la dirección que fija la pulsación.",
        multi: "Mayús+pulsación añade la columna al orden actual.",
        descFirst: "La primera pulsación ordena descendente.",
        manual: "No ordena en el cliente: solo se ejecuta `onChange`.",
        value: "Orden controlado.",
        defaultValue: "Orden inicial.",
        onChange: "Se llama con el orden en cada cambio.",
      },
      highlight: {
        columns: "Clic en un encabezado marca su columna.",
        rows: "Clic en una fila la marca; las filas pasan a ser focusables (Enter también marca).",
        value: "Marcas controladas.",
        defaultValue: "Marcas iniciales.",
        onChange: "Se llama con las marcas en cada cambio.",
      },
      hover: {
        rows: "Resalta la fila bajo el puntero.",
        columns:
          "Resalta todas las celdas de la columna bajo el puntero, encabezado y footer incluidos.",
      },
      selection: {
        selectRowLabel: "Nombre accesible del checkbox de una fila.",
        mode: "`single` selecciona una fila a la vez y no tiene checkbox en el encabezado.",
        selectAllLabel:
          "Nombre accesible del checkbox del encabezado (obligatorio en modo múltiple).",
        selectAllScope: "Si el checkbox del encabezado selecciona la página o todas las filas.",
        canSelect: "Desactiva el checkbox de las filas que no se pueden seleccionar.",
        actions:
          "Acciones en bloque: `{ id, label, icon?, variant?, disabled?(rows), hidden?(rows), onSelect(rows, clear) }`. `hidden` quita una acción para la selección actual; si todas quedan ocultas, el botón no se muestra.",
        renderActions: "Tu propio contenido del menú en lugar de `actions`.",
        actionsLabel: "Nombre visible del botón de acciones (obligatorio con acciones).",
        selectedLabel: "Contador visible, anunciado de forma educada.",
        "value | defaultValue": "Filas seleccionadas por id, controladas o no.",
        onChange:
          "Se llama con la selección y los datos de las filas seleccionadas que la tabla ha mostrado.",
      },
      expansion: {
        renderDetail: "El contenido de la fila de detalle.",
        expandLabel: "Nombre accesible del botón de una fila.",
        canExpand: "Las filas sin botón devuelven `false`.",
        single: "Al expandir una fila se cierran las demás.",
        value: "Filas expandidas controladas.",
        defaultValue: "Filas expandidas al inicio.",
        onChange: "Se llama con las filas expandidas en cada cambio.",
      },
      rowActions: {
        label: "Nombre accesible del botón de menú de una fila.",
        items:
          "Las opciones del menú: `{ id, label, icon?, variant?, disabled?, hidden?, onSelect(row) }`. `items` se calcula por fila, así que `disabled` y `hidden` pueden depender de ella; una fila con todas las opciones ocultas no muestra botón de menú.",
      },
      resizing: {
        resizeLabel: "Nombre accesible de un separador.",
        mode: "`onChange` redimensiona mientras se arrastra; `onEnd` al soltar.",
        value: "Anchos controlados por id de columna.",
        defaultValue: "Anchos iniciales.",
        onChange: "Se llama con los anchos en cada cambio.",
      },
      pinning: {
        value: "Columnas fijas controladas.",
        defaultValue: "Columnas fijas al inicio (por defecto, el `pin` de cada columna).",
        onChange: "Se llama con las columnas fijas en cada cambio.",
      },
      pagination: {
        previousLabel: "Nombre accesible del botón anterior.",
        nextLabel: "Nombre accesible del botón siguiente.",
        pageLabel:
          "El nombre accesible de cada botón de página, como `Página 3 de 10`. Sin `rangeLabel`, también anuncia la página actual cuando cambia.",
        rangeLabel:
          "Texto visible del rango, como `11–20 de 95`. También anuncia los cambios de página y de búsqueda.",
        pageSizes: "Opciones del selector de tamaño; la primera es el tamaño inicial.",
        pageSizeLabel:
          "Nombre accesible y tooltip del selector de tamaño (obligatorio con `pageSizes`); no se muestra como texto.",
        showFirstLast:
          "Añade los botones primera y última (con los obligatorios `firstLabel` / `lastLabel`).",
        "firstLabel | lastLabel": "Nombres accesibles de los botones primera y última.",
        manual: "`data` es la página actual: solo se ejecuta `onChange`.",
        "rowCount | pageCount": "Totales en modo manual.",
        value: "Página controlada.",
        defaultValue: "Página inicial.",
        onChange:
          "Se llama con la página en cada cambio. Cambiar el tamaño vuelve a la primera página.",
      },
      DataTableHandle: {
        table: "La instancia de TanStack Table. Su API puede cambiar entre versiones de TanStack.",
        clearSelection: "Vacía la selección.",
        focusSearch: "Mueve el foco al input de búsqueda.",
        resetHighlight: "Limpia la columna y la fila marcadas.",
      },
    },
    stories: {
      Minimal:
        "Solo `data`, `columns` y un nombre accesible: una tabla simple con todas las filas.",
      NestedColumns:
        "Columnas agrupadas con subtítulos; sus encabezados abarcan a sus hijas. El hover marca columnas enteras.",
      SortingAndHighlight:
        "Orden de tres estados y el cruce: clic en el encabezado Salary y luego en una fila; Escape limpia.",
      SelectionActions:
        "Al seleccionar filas aparece el botón de acciones; Remove las elimina y limpia la selección.",
      ServerSide:
        "Un servidor simulado: búsqueda, orden y paginación son `manual` y controlados; la tabla solo muestra la página que recibe.",
      States: "Filas skeleton al cargar, un slot de vacío y un error con reintentar.",
      PinnedAndResizable:
        "Name fija al inicio, Salary al final, anchos redimensionables y header pegajoso.",
      ExpandableRows: "Una fila de detalle a la vez y un menú de acciones por fila.",
      DensityStripedFooter: "Densidad compacta, filas rayadas y un footer de totales.",
      ColumnDividers: "`columnDividers` con columnas anidadas: líneas entre todas las columnas.",
      ToolbarActions:
        "Botones propios en la barra: Export y Print como botones de icono, uno desactivado, y New employee con su texto.",
      HiddenHeaderAndPagination:
        "`header={false}` y `pagination={false}`: solo se muestra la tabla.",
      ColumnsMenu: "El menú de columnas oculta y muestra las columnas `hideable`.",
      Responsive:
        "Una caja redimensionable: el header, la barra y la paginación siguen el ancho de la propia tabla (container queries), la columna Name fija se desplaza cuando la tabla es estrecha y unas sombras indican los bordes ocultos.",
      FixedHeight:
        '`className="h-[26rem]"` en la raíz: el header y la paginación se quedan en su sitio y solo se desplazan las filas, bajo un header pegajoso.',
    },
    keyboard: {
      Tab: "Llega a la barra, al contenedor con scroll mientras desplaza, a los encabezados marcables y a las filas focusables (una parada de tabulación cada uno), y a los controles de las celdas.",
      Enter:
        "En el input de búsqueda, aplica la búsqueda. En una fila con foco (con `onRowClick` o `highlight.rows`), la activa. En un encabezado con foco (con `highlight.columns`), marca su columna.",
      Space: "En un encabezado con foco (con `highlight.columns`), marca o desmarca su columna.",
      Escape: "Limpia la columna y la fila marcadas; cierra el menú o popover abierto.",
      "Shift + Enter / Shift + click":
        "En un botón de orden con `sorting.multi`, añade la columna al orden actual.",
      "ArrowUp / ArrowDown": "En una fila con foco, pasa a la fila anterior o siguiente.",
      "ArrowLeft / ArrowRight":
        "En un encabezado con foco, pasa al encabezado marcable anterior o siguiente. En un separador, estrecha o ensancha la columna 10px. Ambos se invierten en derecha a izquierda.",
      "Home / End":
        "En una fila o encabezado con foco, va al primero o al último. En un separador, fija el ancho mínimo o máximo.",
    },
    aria: [
      "La tabla se nombra con `aria-label`, `aria-labelledby` o el `title` del header; un aviso de desarrollo señala una tabla sin nombre.",
      'Los encabezados usan `scope="col"` (`colgroup` en los grupos) y las columnas ordenadas llevan `aria-sort`.',
      "Las filas seleccionadas llevan `aria-selected`; cada checkbox, botón y menú tiene el nombre de su texto obligatorio.",
      "La carga pone `aria-busy` y anuncia `loadingLabel` en una región de estado educada.",
      "Los separadores para redimensionar son `separator` focusables con `aria-valuenow`, `aria-valuemin` y `aria-valuemax`.",
      "Los botones de la barra son de icono, con el nombre de su `label`, que también se muestra como tooltip: monta `TooltipProvider` una vez en la app.",
      "Mientras la tabla tiene scroll, su contenedor es una `region` focusable con el nombre de la tabla, para poder desplazarla con el teclado; el foco nunca queda oculto bajo las columnas fijas ni el header pegajoso (`scroll-padding`).",
      "El encabezado de la columna marcada y la fila marcada llevan `aria-current`. Los botones de expandir apuntan a su fila de detalle con `aria-controls`.",
      "El estado de error es un `alert`. La etiqueta de rango (o la de página si no hay rango) es una región viva educada, así que se anuncian los cambios de página y de búsqueda.",
      'Los botones de página se nombran con `pageLabel` y el actual lleva `aria-current="page"`; los huecos se ocultan a las tecnologías de apoyo.',
      "Con colores forzados (alto contraste de Windows) las celdas seleccionadas, marcadas y de cruce se contornean con colores del sistema. Las animaciones respetan `prefers-reduced-motion`; en pantallas táctiles los botones de paginación y los separadores son más grandes.",
    ],
    theming: [
      "Los fondos de celda (rayado, hover, seleccionada, marcada, cruce) salen de `--muted` y `--primary`; las celdas fijas y pegajosas usan `--background`.",
      "Los bordes de las columnas fijas usan `--border`. Sobrescribe los tokens en tu tema, o usa `classNames` para ajustes de layout.",
    ],
  },
});
