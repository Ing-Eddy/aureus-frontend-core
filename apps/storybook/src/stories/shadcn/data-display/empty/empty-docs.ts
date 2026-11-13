import { defineComponentDocs } from "@sb/docs/define-component-docs";

const node = { children: { type: "ReactNode" } };

export const docs = defineComponentDocs({
  name: "Empty",
  importPath: "@aureus-core/ui/shadcn/empty",
  exports: ["Empty", "EmptyHeader", "EmptyMedia", "EmptyTitle", "EmptyDescription", "EmptyContent"],
  api: {
    Empty: node,
    EmptyHeader: node,
    EmptyMedia: { variant: { type: '"default" | "icon"', default: '"default"' } },
    EmptyTitle: node,
    EmptyDescription: node,
    EmptyContent: node,
  },
  stories: ["WithAvatar", "InCard", "NoResults"],
  keyboard: [],
  links: [{ label: "shadcn/ui: Empty", href: "https://ui.shadcn.com/docs/components/empty" }],
  en: {
    summary:
      "An empty state: a centered block with an icon, a title, a short explanation and the actions that get the user started.",
    whenToUse: [
      "When a list, table or page has no data yet (“No projects yet”).",
      "When a search or filter returns nothing, with an action to clear it.",
    ],
    whenNotToUse: [
      "For errors: use Alert, which conveys the problem and its severity.",
      "While loading: use Skeleton or Spinner.",
    ],
    anatomy: {
      Empty: "The centered container with a dashed border option (`border-dashed`).",
      EmptyHeader: "Stacks media, title and description.",
      EmptyMedia:
        'An icon or image above the title; `variant="icon"` frames an icon on a muted square.',
      EmptyTitle:
        "The main message. It is a `div`; wrap it in a heading if it is the page's main message.",
      EmptyDescription: "Muted supporting text; links inside are underlined.",
      EmptyContent: "Actions (buttons, an input) below the header.",
    },
    props: {
      Empty: { children: "Header and content." },
      EmptyHeader: { children: "Media, title and description." },
      EmptyMedia: { variant: "`icon` gives the icon a muted rounded background." },
      EmptyTitle: { children: "Title text." },
      EmptyDescription: { children: "Description text." },
      EmptyContent: { children: "Buttons or other actions." },
    },
    stories: {
      WithAvatar: "Media with avatars instead of an icon.",
      InCard: "An empty state inside a Card with a dashed border.",
      NoResults: "No search results, with an action to clear the search.",
    },
    keyboard: {},
    aria: [
      "Plain content with no role. Write a title that says what is missing and why.",
      "If the empty state appears after a search, announce it (e.g. a live region with the result count).",
      "Decorative icons should be `aria-hidden`.",
    ],
    theming: [
      "Description: `--muted-foreground`; icon media: `--muted` background.",
      "Add `border border-dashed` and a padding with `className` to frame it.",
    ],
  },
  es: {
    summary:
      "Un estado vacío: un bloque centrado con un icono, un título, una explicación corta y las acciones para empezar.",
    whenToUse: [
      "Cuando una lista, tabla o página aún no tiene datos (“Aún no hay proyectos”).",
      "Cuando una búsqueda o un filtro no devuelve nada, con una acción para limpiarlo.",
    ],
    whenNotToUse: [
      "Para errores: usa Alert, que transmite el problema y su gravedad.",
      "Mientras carga: usa Skeleton o Spinner.",
    ],
    anatomy: {
      Empty: "El contenedor centrado, con opción de borde discontinuo (`border-dashed`).",
      EmptyHeader: "Apila el medio, el título y la descripción.",
      EmptyMedia:
        'Un icono o imagen sobre el título; `variant="icon"` enmarca un icono en un cuadrado atenuado.',
      EmptyTitle:
        "El mensaje principal. Es un `div`; envuélvelo en un encabezado si es el mensaje principal de la página.",
      EmptyDescription: "Texto de apoyo atenuado; los enlaces de dentro se subrayan.",
      EmptyContent: "Acciones (botones, un input) bajo la cabecera.",
    },
    props: {
      Empty: { children: "Cabecera y contenido." },
      EmptyHeader: { children: "Medio, título y descripción." },
      EmptyMedia: { variant: "`icon` da al icono un fondo redondeado atenuado." },
      EmptyTitle: { children: "Texto del título." },
      EmptyDescription: { children: "Texto de la descripción." },
      EmptyContent: { children: "Botones u otras acciones." },
    },
    stories: {
      WithAvatar: "Medio con avatares en lugar de un icono.",
      InCard: "Un estado vacío dentro de una Card con borde discontinuo.",
      NoResults: "Sin resultados de búsqueda, con una acción para limpiar la búsqueda.",
    },
    keyboard: {},
    aria: [
      "Contenido sin rol. Escribe un título que diga qué falta y por qué.",
      "Si el estado vacío aparece tras una búsqueda, anúncialo (p. ej. una región viva con el número de resultados).",
      "Los iconos decorativos deben ser `aria-hidden`.",
    ],
    theming: [
      "Descripción: `--muted-foreground`; medio icono: fondo `--muted`.",
      "Añade `border border-dashed` y un padding con `className` para enmarcarlo.",
    ],
  },
});
