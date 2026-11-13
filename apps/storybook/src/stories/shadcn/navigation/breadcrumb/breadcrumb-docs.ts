import { defineComponentDocs } from "@sb/docs/define-component-docs";

const node = { children: { type: "ReactNode" } };

export const docs = defineComponentDocs({
  name: "Breadcrumb",
  importPath: "@aureus-core/ui/shadcn/breadcrumb",
  exports: [
    "Breadcrumb",
    "BreadcrumbList",
    "BreadcrumbItem",
    "BreadcrumbLink",
    "BreadcrumbPage",
    "BreadcrumbSeparator",
    "BreadcrumbEllipsis",
  ],
  api: {
    Breadcrumb: { "aria-label": { type: "string", default: '"breadcrumb"' } },
    BreadcrumbList: node,
    BreadcrumbItem: node,
    BreadcrumbLink: {
      href: { type: "string" },
      asChild: { type: "boolean", default: "false" },
    },
    BreadcrumbPage: node,
    BreadcrumbSeparator: { children: { type: "ReactNode", default: "<ChevronRightIcon />" } },
    BreadcrumbEllipsis: {},
  },
  stories: ["WithEllipsisMenu", "CustomSeparator", "RouterLink"],
  keyboard: ["Tab"],
  links: [
    { label: "shadcn/ui: Breadcrumb", href: "https://ui.shadcn.com/docs/components/breadcrumb" },
    {
      label: "WAI-ARIA APG: Breadcrumb",
      href: "https://www.w3.org/WAI/ARIA/apg/patterns/breadcrumb/",
    },
  ],
  en: {
    summary:
      "Shows where the current page sits in the site hierarchy, with links back to each ancestor.",
    whenToUse: [
      "In apps and sites with nested sections (Settings › Team › Members).",
      "Above the page title, so users can go up one or more levels.",
    ],
    whenNotToUse: [
      "For flat sites with one or two levels: the main navigation is enough.",
      "For steps of a process: use a stepper or progress indicator.",
    ],
    anatomy: {
      Breadcrumb: '`<nav aria-label="breadcrumb">`: a navigation landmark.',
      BreadcrumbList: "An ordered list `<ol>` of the levels.",
      BreadcrumbItem: "One level `<li>`.",
      BreadcrumbLink: "A link to an ancestor; `asChild` renders your router's Link.",
      BreadcrumbPage: 'The current page: not a link, with `aria-current="page"`.',
      BreadcrumbSeparator:
        "A decorative chevron between levels (`aria-hidden`); pass children for another symbol.",
      BreadcrumbEllipsis: "A “…” placeholder for collapsed levels, often a DropdownMenu trigger.",
    },
    props: {
      Breadcrumb: { "aria-label": "Landmark name; translate it (“Ruta de navegación”)." },
      BreadcrumbList: { children: "Items and separators." },
      BreadcrumbItem: { children: "A link, the page or an ellipsis." },
      BreadcrumbLink: {
        href: "Destination of the link.",
        asChild: "Use your own link component (Next.js `Link`, React Router `Link`).",
      },
      BreadcrumbPage: { children: "Name of the current page." },
      BreadcrumbSeparator: { children: "Custom separator, e.g. `/` or a SlashIcon." },
      BreadcrumbEllipsis: {},
    },
    stories: {
      WithEllipsisMenu:
        "Middle levels collapsed into an ellipsis that opens a DropdownMenu with the hidden links.",
      CustomSeparator: "A slash instead of the default chevron.",
      RouterLink: "`asChild` with a custom link component, as you would with a router.",
    },
    keyboard: { Tab: "Moves through the links; the current page is not focusable." },
    aria: [
      "A `nav` landmark named “breadcrumb”; the list keeps the order of the levels.",
      'The last item has `aria-current="page"` so screen readers announce the current location.',
      "Separators and the ellipsis icon are hidden from assistive technology.",
    ],
    theming: [
      "Links: `--muted-foreground`, hover `--foreground`. Current page: `--foreground`.",
      "The list wraps on small screens; use BreadcrumbEllipsis to keep it on one line.",
    ],
  },
  es: {
    summary:
      "Muestra dónde está la página actual en la jerarquía del sitio, con enlaces a cada nivel superior.",
    whenToUse: [
      "En apps y sitios con secciones anidadas (Ajustes › Equipo › Miembros).",
      "Sobre el título de la página, para subir uno o varios niveles.",
    ],
    whenNotToUse: [
      "En sitios planos de uno o dos niveles: basta con la navegación principal.",
      "Para los pasos de un proceso: usa un indicador de pasos o de progreso.",
    ],
    anatomy: {
      Breadcrumb: '`<nav aria-label="breadcrumb">`: una región de navegación.',
      BreadcrumbList: "Una lista ordenada `<ol>` de los niveles.",
      BreadcrumbItem: "Un nivel `<li>`.",
      BreadcrumbLink: "Un enlace a un nivel superior; `asChild` renderiza el Link de tu router.",
      BreadcrumbPage: 'La página actual: no es un enlace y tiene `aria-current="page"`.',
      BreadcrumbSeparator:
        "Una flecha decorativa entre niveles (`aria-hidden`); pasa children para otro símbolo.",
      BreadcrumbEllipsis:
        "Un “…” para niveles contraídos, a menudo el disparador de un DropdownMenu.",
    },
    props: {
      Breadcrumb: { "aria-label": "Nombre de la región; tradúcelo (“Ruta de navegación”)." },
      BreadcrumbList: { children: "Elementos y separadores." },
      BreadcrumbItem: { children: "Un enlace, la página o una elipsis." },
      BreadcrumbLink: {
        href: "Destino del enlace.",
        asChild: "Usa tu propio componente de enlace (`Link` de Next.js o de React Router).",
      },
      BreadcrumbPage: { children: "Nombre de la página actual." },
      BreadcrumbSeparator: { children: "Separador propio, p. ej. `/` o un SlashIcon." },
      BreadcrumbEllipsis: {},
    },
    stories: {
      WithEllipsisMenu:
        "Niveles intermedios contraídos en una elipsis que abre un DropdownMenu con los enlaces ocultos.",
      CustomSeparator: "Una barra en lugar de la flecha por defecto.",
      RouterLink: "`asChild` con un componente de enlace propio, como harías con un router.",
    },
    keyboard: { Tab: "Recorre los enlaces; la página actual no es enfocable." },
    aria: [
      "Una región `nav` llamada “breadcrumb”; la lista conserva el orden de los niveles.",
      'El último elemento tiene `aria-current="page"` para que los lectores anuncien la ubicación actual.',
      "Los separadores y el icono de la elipsis se ocultan a las tecnologías de asistencia.",
    ],
    theming: [
      "Enlaces: `--muted-foreground`, al pasar el ratón `--foreground`. Página actual: `--foreground`.",
      "La lista se ajusta en pantallas pequeñas; usa BreadcrumbEllipsis para mantenerla en una línea.",
    ],
  },
});
