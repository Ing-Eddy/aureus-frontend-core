import { defineComponentDocs } from "@sb/docs/define-component-docs";

const node = { children: { type: "ReactNode" } };

export const docs = defineComponentDocs({
  name: "Table",
  importPath: "@aureus-core/ui/shadcn/table",
  exports: [
    "Table",
    "TableCaption",
    "TableHeader",
    "TableBody",
    "TableFooter",
    "TableRow",
    "TableHead",
    "TableCell",
  ],
  api: {
    Table: { className: { type: "string" } },
    TableCaption: node,
    TableHeader: node,
    TableBody: node,
    TableFooter: node,
    TableRow: { "data-state": { type: '"selected"' } },
    TableHead: { scope: { type: '"col" | "row"' } },
    TableCell: { colSpan: { type: "number" } },
  },
  stories: ["WithFooter", "DataTable"],
  keyboard: ["Tab"],
  links: [
    { label: "shadcn/ui: Table", href: "https://ui.shadcn.com/docs/components/table" },
    { label: "shadcn/ui: Data Table", href: "https://ui.shadcn.com/docs/components/data-table" },
    { label: "TanStack Table", href: "https://tanstack.com/table/latest" },
  ],
  en: {
    summary:
      "Styled native table elements for tabular data. Combine them with TanStack Table to build a DataTable with sorting, filtering, selection and pagination.",
    whenToUse: [
      "For data with columns users compare across rows: invoices, users, logs.",
      "For a complete table with search, sorting, selection, pagination and server data, use `DataTable` (`@aureus-core/ui/components/data-table`); compose these parts with `@tanstack/react-table` only for a layout it does not cover.",
    ],
    whenNotToUse: [
      "For page layout: use CSS grid or flex.",
      "For simple lists with one main value per row: use Item.",
    ],
    anatomy: {
      Table: "A `<table>` inside a horizontally scrollable wrapper.",
      TableCaption: "The `<caption>`: the table's accessible name, shown below it.",
      TableHeader: "`<thead>` with a bottom border.",
      TableBody: "`<tbody>`; rows have hover and selected styles.",
      TableFooter: "`<tfoot>` for totals, on a muted background.",
      TableRow: '`<tr>`; `data-state="selected"` highlights it.',
      TableHead: "`<th>` header cell.",
      TableCell: "`<td>` data cell.",
    },
    props: {
      Table: { className: "Classes for the `<table>` (the wrapper scrolls horizontally)." },
      TableCaption: { children: "Caption text." },
      TableHeader: { children: "Header rows." },
      TableBody: { children: "Body rows." },
      TableFooter: { children: "Footer rows." },
      TableRow: { "data-state": 'Set `"selected"` to highlight a selected row.' },
      TableHead: { scope: "`col` for column headers, `row` for row headers." },
      TableCell: { colSpan: "Number of columns the cell spans (e.g. an empty-state row)." },
    },
    stories: {
      WithFooter: "A caption, a total row in TableFooter and right-aligned numbers.",
      DataTable:
        "TanStack Table v9 (`useTable` with `tableFeatures`) on top of Table with the payments fixture: sortable email column, email filter, row selection with an indeterminate header checkbox, and pagination.",
    },
    keyboard: {
      Tab: "Moves through interactive cells (checkboxes, sort buttons, menus) in reading order.",
    },
    aria: [
      "Native table semantics: screen readers announce headers when moving between cells.",
      "Name the table with TableCaption (or `aria-label` on Table).",
      "Make sort controls buttons inside TableHead and reflect the order with `aria-sort` on the `<th>`.",
    ],
    theming: [
      "Row borders: `--border`; hover and selected rows: `--muted` at 50%.",
      "Footer: `--muted` at 50% with `font-medium`. Caption: `--muted-foreground`.",
    ],
  },
  es: {
    summary:
      "Elementos de tabla nativos con estilos para datos tabulares. Combínalos con TanStack Table para construir una DataTable con orden, filtros, selección y paginación.",
    whenToUse: [
      "Para datos con columnas que se comparan entre filas: facturas, usuarios, registros.",
      "Para una tabla completa con búsqueda, orden, selección, paginación y datos del servidor, usa `DataTable` (`@aureus-core/ui/components/data-table`); compón estas piezas con `@tanstack/react-table` solo para un diseño que no cubra.",
    ],
    whenNotToUse: [
      "Para maquetar la página: usa CSS grid o flex.",
      "Para listas sencillas con un valor principal por fila: usa Item.",
    ],
    anatomy: {
      Table: "Un `<table>` dentro de un contenedor con desplazamiento horizontal.",
      TableCaption: "El `<caption>`: el nombre accesible de la tabla, mostrado debajo.",
      TableHeader: "`<thead>` con un borde inferior.",
      TableBody: "`<tbody>`; las filas tienen estilos al pasar el ratón y al seleccionarlas.",
      TableFooter: "`<tfoot>` para totales, con fondo atenuado.",
      TableRow: '`<tr>`; `data-state="selected"` la resalta.',
      TableHead: "Celda de encabezado `<th>`.",
      TableCell: "Celda de datos `<td>`.",
    },
    props: {
      Table: { className: "Clases para el `<table>` (el contenedor se desplaza en horizontal)." },
      TableCaption: { children: "Texto del caption." },
      TableHeader: { children: "Filas de encabezado." },
      TableBody: { children: "Filas del cuerpo." },
      TableFooter: { children: "Filas del pie." },
      TableRow: { "data-state": 'Pon `"selected"` para resaltar una fila seleccionada.' },
      TableHead: { scope: "`col` para encabezados de columna, `row` para encabezados de fila." },
      TableCell: {
        colSpan: "Número de columnas que ocupa la celda (p. ej. una fila de estado vacío).",
      },
    },
    stories: {
      WithFooter: "Un caption, una fila de total en TableFooter y números alineados a la derecha.",
      DataTable:
        "TanStack Table v9 (`useTable` con `tableFeatures`) sobre Table con el fixture de pagos: columna de email ordenable, filtro por email, selección de filas con checkbox indeterminado en la cabecera, y paginación.",
    },
    keyboard: {
      Tab: "Recorre las celdas interactivas (checkboxes, botones de orden, menús) en orden de lectura.",
    },
    aria: [
      "Semántica de tabla nativa: los lectores anuncian los encabezados al moverse entre celdas.",
      "Nombra la tabla con TableCaption (o `aria-label` en Table).",
      "Haz que los controles de orden sean botones dentro de TableHead y refleja el orden con `aria-sort` en el `<th>`.",
    ],
    theming: [
      "Bordes de fila: `--border`; filas al pasar el ratón y seleccionadas: `--muted` al 50%.",
      "Pie: `--muted` al 50% con `font-medium`. Caption: `--muted-foreground`.",
    ],
  },
});
