import { defineComponentDocs } from "@sb/docs/define-component-docs";

const node = { children: { type: "ReactNode" } };

export const docs = defineComponentDocs({
  name: "Item",
  importPath: "@aureus-core/ui/shadcn/item",
  exports: [
    "Item",
    "ItemMedia",
    "ItemContent",
    "ItemTitle",
    "ItemDescription",
    "ItemActions",
    "ItemHeader",
    "ItemFooter",
    "ItemGroup",
    "ItemSeparator",
  ],
  api: {
    Item: {
      variant: { type: '"default" | "outline" | "muted"', default: '"default"' },
      size: { type: '"default" | "sm" | "xs"', default: '"default"' },
      asChild: { type: "boolean", default: "false" },
    },
    ItemMedia: { variant: { type: '"default" | "icon" | "image"', default: '"default"' } },
    ItemContent: node,
    ItemTitle: node,
    ItemDescription: node,
    ItemActions: node,
    ItemHeader: node,
    ItemFooter: node,
    ItemGroup: node,
    ItemSeparator: {},
  },
  stories: ["Variants", "Sizes", "WithMedia", "List", "AsLink"],
  keyboard: [],
  links: [{ label: "shadcn/ui: Item", href: "https://ui.shadcn.com/docs/components/item" }],
  en: {
    summary:
      "A flexible row for lists: media on the left, a title and description, and actions on the right. Lighter than a Card.",
    whenToUse: [
      "For rows of people, files, notifications or settings with an action.",
      "As a clickable row (`asChild` with a link) in navigation lists.",
    ],
    whenNotToUse: [
      "For tabular data with columns: use Table.",
      "For a self-contained block with its own header and footer: use Card.",
    ],
    anatomy: {
      Item: 'The row (`data-slot="item"`); `asChild` makes the whole row a link or button.',
      ItemMedia:
        'Leading icon, avatar or image. `variant="icon"` frames an icon; `image` crops a picture.',
      ItemContent: "Stacks the title and description and takes the free space.",
      ItemTitle: "The main text.",
      ItemDescription: "Muted secondary text, clamped to two lines.",
      ItemActions: "Trailing buttons or controls.",
      ItemHeader: "A full-width row above the content (e.g. an image).",
      ItemFooter: "A full-width row below the content.",
      ItemGroup: 'A `role="list"` container for items.',
      ItemSeparator: "A line between items in a group.",
    },
    props: {
      Item: {
        variant: "`outline` adds a border; `muted` a soft background.",
        size: "`default`, `sm` and `xs` padding and gaps.",
        asChild: "Render your own element, typically an `<a>`.",
      },
      ItemMedia: {
        variant: "`default` (as is), `icon` (framed icon) or `image` (cropped square).",
      },
      ItemContent: { children: "Title and description." },
      ItemTitle: { children: "Title text." },
      ItemDescription: { children: "Description text." },
      ItemActions: { children: "Buttons." },
      ItemHeader: { children: "Header content." },
      ItemFooter: { children: "Footer content." },
      ItemGroup: { children: "Items and separators." },
      ItemSeparator: {},
    },
    stories: {
      Variants: "`default`, `outline` and `muted`.",
      Sizes: "`default`, `sm` and `xs`.",
      WithMedia: "Icon, avatar and image media.",
      List: "An ItemGroup of people with separators and an action per row.",
      AsLink: "`asChild` with an `<a>`: the whole row is one link.",
    },
    keyboard: {},
    aria: [
      'ItemGroup has `role="list"`, but Item adds no role of its own: pass `role="listitem"` to each Item in a group (see List).',
      "Inside a link row, do not add other interactive elements: a link cannot contain buttons.",
      "Icon-only actions need `aria-label`.",
    ],
    theming: [
      "Outline border: `--border`; muted background: `--muted` at 50%; description: `--muted-foreground`.",
      "Hover styles apply when the item is a link (`[a]:hover:bg-muted`).",
    ],
  },
  es: {
    summary:
      "Una fila flexible para listas: medio a la izquierda, un título y una descripción, y acciones a la derecha. Más ligera que una Card.",
    whenToUse: [
      "Para filas de personas, archivos, notificaciones o ajustes con una acción.",
      "Como fila pulsable (`asChild` con un enlace) en listas de navegación.",
    ],
    whenNotToUse: [
      "Para datos tabulares con columnas: usa Table.",
      "Para un bloque autónomo con su propia cabecera y pie: usa Card.",
    ],
    anatomy: {
      Item: 'La fila (`data-slot="item"`); `asChild` convierte toda la fila en un enlace o un botón.',
      ItemMedia:
        'Icono, avatar o imagen inicial. `variant="icon"` enmarca un icono; `image` recorta una imagen.',
      ItemContent: "Apila el título y la descripción y ocupa el espacio libre.",
      ItemTitle: "El texto principal.",
      ItemDescription: "Texto secundario atenuado, limitado a dos líneas.",
      ItemActions: "Botones o controles al final.",
      ItemHeader: "Una fila a todo el ancho sobre el contenido (p. ej. una imagen).",
      ItemFooter: "Una fila a todo el ancho bajo el contenido.",
      ItemGroup: 'Un contenedor `role="list"` para los elementos.',
      ItemSeparator: "Una línea entre elementos de un grupo.",
    },
    props: {
      Item: {
        variant: "`outline` añade un borde; `muted` un fondo suave.",
        size: "Padding y espacios `default`, `sm` y `xs`.",
        asChild: "Renderiza tu propio elemento, normalmente un `<a>`.",
      },
      ItemMedia: {
        variant: "`default` (tal cual), `icon` (icono enmarcado) o `image` (cuadrado recortado).",
      },
      ItemContent: { children: "Título y descripción." },
      ItemTitle: { children: "Texto del título." },
      ItemDescription: { children: "Texto de la descripción." },
      ItemActions: { children: "Botones." },
      ItemHeader: { children: "Contenido de la cabecera." },
      ItemFooter: { children: "Contenido del pie." },
      ItemGroup: { children: "Elementos y separadores." },
      ItemSeparator: {},
    },
    stories: {
      Variants: "`default`, `outline` y `muted`.",
      Sizes: "`default`, `sm` y `xs`.",
      WithMedia: "Medios de icono, avatar e imagen.",
      List: "Un ItemGroup de personas con separadores y una acción por fila.",
      AsLink: "`asChild` con un `<a>`: toda la fila es un enlace.",
    },
    keyboard: {},
    aria: [
      'ItemGroup tiene `role="list"`, pero Item no añade rol propio: pasa `role="listitem"` a cada Item de un grupo (mira List).',
      "Dentro de una fila enlace no añadas otros elementos interactivos: un enlace no puede contener botones.",
      "Las acciones solo con icono necesitan `aria-label`.",
    ],
    theming: [
      "Borde outline: `--border`; fondo muted: `--muted` al 50%; descripción: `--muted-foreground`.",
      "Los estilos al pasar el ratón se aplican cuando el elemento es un enlace (`[a]:hover:bg-muted`).",
    ],
  },
});
