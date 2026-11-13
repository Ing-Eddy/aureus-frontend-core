import { defineComponentDocs } from "@sb/docs/define-component-docs";

const node = { children: { type: "ReactNode" } };

export const docs = defineComponentDocs({
  name: "Card",
  importPath: "@aureus-core/ui/shadcn/card",
  exports: [
    "Card",
    "CardHeader",
    "CardTitle",
    "CardDescription",
    "CardAction",
    "CardContent",
    "CardFooter",
  ],
  api: {
    Card: { size: { type: '"default" | "sm"', default: '"default"' } },
    CardHeader: node,
    CardTitle: node,
    CardDescription: node,
    CardAction: node,
    CardContent: node,
    CardFooter: node,
  },
  stories: ["LoginForm", "Small", "WithImage", "Stat"],
  keyboard: [],
  links: [{ label: "shadcn/ui: Card", href: "https://ui.shadcn.com/docs/components/card" }],
  en: {
    summary:
      "A bordered surface that groups related content and actions: a form, a summary, a list item with details. Header, content and footer keep consistent spacing.",
    whenToUse: [
      "To group content about one subject that can stand on its own: a plan, a project, a metric.",
      "To frame a short form, like sign-in or settings sections.",
    ],
    whenNotToUse: [
      "For every section of a page: too many borders add noise; use spacing and headings.",
      "For rows in a list: use Item, which is lighter.",
    ],
    anatomy: {
      Card: 'The container (`data-slot="card"`): border, radius and vertical padding. `size="sm"` is tighter.',
      CardHeader:
        "Top area: a grid that places the title and description on the left and CardAction on the right.",
      CardTitle:
        "The card heading. It is a `div`: wrap the text in an `<h2>`/`<h3>` when it should be a real heading.",
      CardDescription: "Muted text under the title.",
      CardAction: "Top-right slot for a button or menu.",
      CardContent: "The body.",
      CardFooter: "Bottom row for actions; with a top border when it has the `border-t` class.",
    },
    props: {
      Card: { size: "`sm` reduces padding and gaps for dense layouts." },
      CardHeader: { children: "Title, description and action." },
      CardTitle: { children: "Title text or a heading element." },
      CardDescription: { children: "Supporting text." },
      CardAction: { children: "A Button, DropdownMenu or Badge." },
      CardContent: { children: "Body content." },
      CardFooter: { children: "Actions or secondary information." },
    },
    stories: {
      LoginForm:
        "A sign-in form: header with an action link, fields in the content and buttons in the footer.",
      Small: '`size="sm"` for dense dashboards.',
      WithImage: "A full-bleed image above the header (local image).",
      Stat: "A metric card with a Badge in CardAction.",
    },
    keyboard: {},
    aria: [
      "A card is a plain `div`: it has no role. Use a real heading inside CardTitle so it shows in the document outline.",
      "If the whole card is clickable, make one link inside it the target instead of nesting interactive elements in a link.",
      'Images need `alt` text unless they are decorative (`alt=""`).',
    ],
    theming: [
      "Surface: `--card` / `--card-foreground`, ring of `--foreground` at 10%, radius from `--radius`.",
      "Description: `--muted-foreground`.",
    ],
  },
  es: {
    summary:
      "Una superficie con borde que agrupa contenido y acciones relacionados: un formulario, un resumen, un elemento con detalles. Cabecera, contenido y pie mantienen un espaciado uniforme.",
    whenToUse: [
      "Para agrupar contenido sobre un tema que se sostiene solo: un plan, un proyecto, una métrica.",
      "Para enmarcar un formulario corto, como el inicio de sesión o secciones de ajustes.",
    ],
    whenNotToUse: [
      "Para cada sección de una página: demasiados bordes añaden ruido; usa espaciado y encabezados.",
      "Para las filas de una lista: usa Item, que es más ligero.",
    ],
    anatomy: {
      Card: 'El contenedor (`data-slot="card"`): borde, radio y padding vertical. `size="sm"` es más compacto.',
      CardHeader:
        "Zona superior: una rejilla con el título y la descripción a la izquierda y CardAction a la derecha.",
      CardTitle:
        "El título de la tarjeta. Es un `div`: envuelve el texto en un `<h2>`/`<h3>` cuando deba ser un encabezado real.",
      CardDescription: "Texto atenuado bajo el título.",
      CardAction: "Hueco arriba a la derecha para un botón o un menú.",
      CardContent: "El cuerpo.",
      CardFooter: "Fila inferior para acciones; con borde superior si tiene la clase `border-t`.",
    },
    props: {
      Card: { size: "`sm` reduce el padding y los espacios para diseños densos." },
      CardHeader: { children: "Título, descripción y acción." },
      CardTitle: { children: "Texto del título o un elemento de encabezado." },
      CardDescription: { children: "Texto de apoyo." },
      CardAction: { children: "Un Button, DropdownMenu o Badge." },
      CardContent: { children: "Contenido del cuerpo." },
      CardFooter: { children: "Acciones o información secundaria." },
    },
    stories: {
      LoginForm:
        "Un formulario de acceso: cabecera con un enlace de acción, campos en el contenido y botones en el pie.",
      Small: '`size="sm"` para paneles densos.',
      WithImage: "Una imagen a sangre sobre la cabecera (imagen local).",
      Stat: "Una tarjeta de métrica con un Badge en CardAction.",
    },
    keyboard: {},
    aria: [
      "Una tarjeta es un `div` sin rol. Usa un encabezado real dentro de CardTitle para que aparezca en el esquema del documento.",
      "Si toda la tarjeta es pulsable, haz que un enlace de dentro sea el destino en lugar de anidar elementos interactivos en un enlace.",
      'Las imágenes necesitan texto `alt` salvo que sean decorativas (`alt=""`).',
    ],
    theming: [
      "Superficie: `--card` / `--card-foreground`, anillo de `--foreground` al 10%, radio desde `--radius`.",
      "Descripción: `--muted-foreground`.",
    ],
  },
});
