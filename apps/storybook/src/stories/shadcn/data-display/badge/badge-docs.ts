import { defineComponentDocs } from "@sb/docs/define-component-docs";

const variant = '"default" | "secondary" | "destructive" | "outline" | "ghost" | "link"';

export const docs = defineComponentDocs({
  name: "Badge",
  importPath: "@aureus-core/ui/shadcn/badge",
  exports: ["Badge", "badgeVariants"],
  api: {
    Badge: {
      variant: { type: variant, default: '"default"' },
      asChild: { type: "boolean", default: "false" },
    },
    badgeVariants: { variant: { type: variant } },
  },
  stories: ["Variants", "WithIcon", "AsLink", "Counter"],
  keyboard: [],
  links: [{ label: "shadcn/ui: Badge", href: "https://ui.shadcn.com/docs/components/badge" }],
  en: {
    summary: "A small label for a status, a category or a count: “New”, “Paid”, “3”.",
    whenToUse: [
      "To show a status next to an item (Active, Failed) or tag it with a category.",
      "To show a short count on a menu item or tab.",
    ],
    whenNotToUse: [
      "For actions: use Button (a link badge is fine for navigation to a filtered view).",
      "For longer messages: use Alert.",
    ],
    anatomy: {
      Badge:
        'A `<span data-slot="badge">` with rounded-full corners; with `asChild` it styles its child (e.g. a link).',
      badgeVariants: "The class generator, to give another element the badge look.",
    },
    props: {
      Badge: {
        variant:
          "Color: `default` (primary), `secondary`, `destructive`, `outline`, `ghost`, `link`.",
        asChild: "Renders the child element, e.g. an `<a>` for a clickable tag.",
      },
      badgeVariants: { variant: "Same values as Badge." },
    },
    stories: {
      Variants: "All six variants.",
      WithIcon: "Icons before the text, sized automatically.",
      AsLink: "`asChild` with an `<a>`: a tag that links to a filtered view.",
      Counter: "A numeric count with `tabular-nums`, plus screen-reader text for context.",
    },
    keyboard: {},
    aria: [
      "A badge is plain text: make sure its meaning is clear without color (write “Failed”, not only red).",
      "Counts need context for screen readers: add `sr-only` text such as “unread messages”.",
      "As a link, it keeps link semantics and focus styles.",
    ],
    theming: [
      "`default` uses `--primary`; `secondary` `--secondary`; `destructive` `--destructive` on its 10% tint; `outline` `--border`.",
      "Shape: `rounded-4xl`, `h-5`, `text-xs`.",
    ],
  },
  es: {
    summary:
      "Una etiqueta pequeña para un estado, una categoría o un recuento: “Nuevo”, “Pagado”, “3”.",
    whenToUse: [
      "Para mostrar un estado junto a un elemento (Activo, Fallido) o etiquetarlo con una categoría.",
      "Para mostrar un recuento corto en un elemento de menú o una pestaña.",
    ],
    whenNotToUse: [
      "Para acciones: usa Button (un badge enlace vale para ir a una vista filtrada).",
      "Para mensajes más largos: usa Alert.",
    ],
    anatomy: {
      Badge:
        'Un `<span data-slot="badge">` con esquinas redondeadas; con `asChild` estiliza su hijo (p. ej. un enlace).',
      badgeVariants: "El generador de clases, para dar a otro elemento el aspecto de badge.",
    },
    props: {
      Badge: {
        variant:
          "Color: `default` (primario), `secondary`, `destructive`, `outline`, `ghost`, `link`.",
        asChild: "Renderiza el elemento hijo, p. ej. un `<a>` para una etiqueta pulsable.",
      },
      badgeVariants: { variant: "Los mismos valores que Badge." },
    },
    stories: {
      Variants: "Las seis variantes.",
      WithIcon: "Iconos antes del texto, con tamaño automático.",
      AsLink: "`asChild` con un `<a>`: una etiqueta que lleva a una vista filtrada.",
      Counter: "Un recuento numérico con `tabular-nums`, más texto para lectores de pantalla.",
    },
    keyboard: {},
    aria: [
      "Un badge es texto plano: asegúrate de que su significado se entiende sin color (escribe “Fallido”, no solo rojo).",
      "Los recuentos necesitan contexto para los lectores: añade texto `sr-only` como “mensajes sin leer”.",
      "Como enlace, conserva la semántica y los estilos de foco de un enlace.",
    ],
    theming: [
      "`default` usa `--primary`; `secondary` `--secondary`; `destructive` `--destructive` sobre su tinte del 10%; `outline` `--border`.",
      "Forma: `rounded-4xl`, `h-5`, `text-xs`.",
    ],
  },
});
