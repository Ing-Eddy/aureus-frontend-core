import { defineComponentDocs } from "@sb/docs/define-component-docs";

const node = { children: { type: "ReactNode" } };

export const docs = defineComponentDocs({
  name: "Pagination",
  importPath: "@aureus-core/ui/shadcn/pagination",
  exports: [
    "Pagination",
    "PaginationContent",
    "PaginationItem",
    "PaginationLink",
    "PaginationPrevious",
    "PaginationNext",
    "PaginationEllipsis",
  ],
  api: {
    Pagination: { "aria-label": { type: "string", default: '"pagination"' } },
    PaginationContent: node,
    PaginationItem: node,
    PaginationLink: {
      href: { type: "string" },
      isActive: { type: "boolean", default: "false" },
      size: { type: "Button size", default: '"icon"' },
    },
    PaginationPrevious: {
      text: { type: "string", default: '"Previous"' },
      href: { type: "string" },
    },
    PaginationNext: { text: { type: "string", default: '"Next"' }, href: { type: "string" } },
    PaginationEllipsis: {},
  },
  stories: ["WithEllipsis", "Controlled"],
  keyboard: ["Tab", "Enter"],
  links: [
    { label: "shadcn/ui: Pagination", href: "https://ui.shadcn.com/docs/components/pagination" },
  ],
  en: {
    summary:
      "Links to move between pages of a list or table: previous, next, numbered pages and ellipses for skipped ranges. It renders links; your router or state decides what each page shows.",
    whenToUse: [
      "Below long lists or tables split into pages, especially when the page belongs in the URL.",
      "When users need to jump to a specific page.",
    ],
    whenNotToUse: [
      "For feeds read top to bottom: use infinite scroll or a “Load more” button.",
      "For a wizard: use explicit Back/Continue buttons.",
    ],
    anatomy: {
      Pagination: '`<nav aria-label="pagination">` landmark.',
      PaginationContent: "The `<ul>` row of items.",
      PaginationItem: "One `<li>`.",
      PaginationLink:
        'A page link styled as a ghost button; the active page is outlined and has `aria-current="page"`.',
      PaginationPrevious:
        "Link to the previous page with a chevron; the text hides on small screens.",
      PaginationNext: "Link to the next page with a chevron.",
      PaginationEllipsis: "“…” for skipped pages, with screen-reader text “More pages”.",
    },
    props: {
      Pagination: { "aria-label": "Landmark name; translate it (“Paginación”)." },
      PaginationContent: { children: "Pagination items." },
      PaginationItem: { children: "A link or ellipsis." },
      PaginationLink: {
        href: "URL of the page. Add `onClick` with `preventDefault()` for client-side state.",
        isActive: "Marks the current page.",
        size: "Button size; `icon` is square for numbers.",
      },
      PaginationPrevious: {
        text: "Visible label; translate it.",
        href: "URL of the previous page.",
      },
      PaginationNext: { text: "Visible label; translate it.", href: "URL of the next page." },
      PaginationEllipsis: {},
    },
    stories: {
      WithEllipsis: "A long range: first, current neighbourhood and last, with ellipses.",
      Controlled: "Client-side pagination: clicks update React state and the active page.",
    },
    keyboard: { Tab: "Moves through the page links.", Enter: "Follows the focused link." },
    aria: [
      'A `navigation` landmark; the active page has `aria-current="page"`.',
      "Previous and Next are named “Go to previous/next page”; the ellipsis reads “More pages”.",
      "At the first or last page, render Previous/Next with `aria-disabled` and `pointer-events-none` (or omit them) so they do nothing.",
    ],
    theming: [
      "Items use Button variants: `ghost` for pages, `outline` for the active page.",
      'Target `[data-slot="pagination-link"][data-active=true]` for a custom active style.',
    ],
  },
  es: {
    summary:
      "Enlaces para moverse entre las páginas de una lista o tabla: anterior, siguiente, páginas numeradas y elipsis para los saltos. Renderiza enlaces; tu router o tu estado deciden qué muestra cada página.",
    whenToUse: [
      "Bajo listas o tablas largas divididas en páginas, sobre todo cuando la página va en la URL.",
      "Cuando el usuario necesita saltar a una página concreta.",
    ],
    whenNotToUse: [
      "Para contenidos que se leen de arriba abajo: usa scroll infinito o un botón “Cargar más”.",
      "Para un asistente: usa botones explícitos Atrás/Continuar.",
    ],
    anatomy: {
      Pagination: 'Región `<nav aria-label="pagination">`.',
      PaginationContent: "La fila `<ul>` de elementos.",
      PaginationItem: "Un `<li>`.",
      PaginationLink:
        'Un enlace de página con estilo de botón ghost; la página activa tiene borde y `aria-current="page"`.',
      PaginationPrevious:
        "Enlace a la página anterior con flecha; el texto se oculta en pantallas pequeñas.",
      PaginationNext: "Enlace a la página siguiente con flecha.",
      PaginationEllipsis: "“…” para páginas omitidas, con el texto para lectores “More pages”.",
    },
    props: {
      Pagination: { "aria-label": "Nombre de la región; tradúcelo (“Paginación”)." },
      PaginationContent: { children: "Elementos de la paginación." },
      PaginationItem: { children: "Un enlace o una elipsis." },
      PaginationLink: {
        href: "URL de la página. Añade `onClick` con `preventDefault()` para estado en el cliente.",
        isActive: "Marca la página actual.",
        size: "Tamaño del botón; `icon` es cuadrado para números.",
      },
      PaginationPrevious: {
        text: "Etiqueta visible; tradúcela.",
        href: "URL de la página anterior.",
      },
      PaginationNext: { text: "Etiqueta visible; tradúcela.", href: "URL de la página siguiente." },
      PaginationEllipsis: {},
    },
    stories: {
      WithEllipsis:
        "Un rango largo: la primera, las cercanas a la actual y la última, con elipsis.",
      Controlled:
        "Paginación en el cliente: los clics actualizan el estado de React y la página activa.",
    },
    keyboard: { Tab: "Recorre los enlaces de página.", Enter: "Sigue el enlace enfocado." },
    aria: [
      'Una región `navigation`; la página activa tiene `aria-current="page"`.',
      "Anterior y Siguiente se llaman “Go to previous/next page”; la elipsis se lee “More pages”.",
      "En la primera o la última página, renderiza Anterior/Siguiente con `aria-disabled` y `pointer-events-none` (u omítelos) para que no hagan nada.",
    ],
    theming: [
      "Los elementos usan variantes de Button: `ghost` para páginas, `outline` para la activa.",
      'Usa `[data-slot="pagination-link"][data-active=true]` para un estilo activo propio.',
    ],
  },
});
