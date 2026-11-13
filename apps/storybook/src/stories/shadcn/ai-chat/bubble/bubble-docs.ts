import { defineComponentDocs } from "@sb/docs/define-component-docs";

const variant =
  '"default" | "secondary" | "muted" | "tinted" | "outline" | "ghost" | "destructive"';

export const docs = defineComponentDocs({
  name: "Bubble",
  importPath: "@aureus-core/ui/shadcn/bubble",
  exports: ["BubbleGroup", "Bubble", "BubbleContent", "BubbleReactions"],
  api: {
    BubbleGroup: { children: { type: "ReactNode" } },
    Bubble: {
      variant: { type: variant, default: '"default"' },
      align: { type: '"start" | "end"', default: '"start"' },
    },
    BubbleContent: { asChild: { type: "boolean", default: "false" } },
    BubbleReactions: {
      side: { type: '"top" | "bottom"', default: '"bottom"' },
      align: { type: '"start" | "end"', default: '"end"' },
    },
  },
  stories: ["Variants", "WithReactions", "Interactive"],
  keyboard: ["Tab", "Enter / Space"],
  links: [{ label: "shadcn/ui", href: "https://ui.shadcn.com/" }],
  en: {
    summary:
      "The speech bubble of a chat message: colored content with rounded corners, optional reactions pinned to an edge, and seven color variants.",
    whenToUse: [
      "For the body of chat and assistant messages.",
      "With `asChild` on BubbleContent when the bubble itself is a button or link (a suggested reply).",
    ],
    whenNotToUse: [
      'For long-form assistant answers with headings and code: use `variant="ghost"` or plain content.',
    ],
    anatomy: {
      BubbleGroup: "Stacks bubbles with a gap.",
      Bubble: "The wrapper: variant colors, max width (80%) and side.",
      BubbleContent: "The rounded colored box with the text.",
      BubbleReactions: "Row of reactions overlapping the bubble's top or bottom edge.",
    },
    props: {
      BubbleGroup: { children: "Bubbles." },
      Bubble: {
        variant:
          "`default` (primary), `secondary`, `muted`, `tinted` (primary-tinted), `outline`, `ghost` (no box), `destructive` (failed message).",
        align: "Side of the bubble; inside a Message it follows the message alignment.",
      },
      BubbleContent: { asChild: "Render a `<button>` or `<a>` as the bubble." },
      BubbleReactions: {
        side: "Edge the reactions overlap.",
        align: "Corner the reactions sit in.",
      },
    },
    stories: {
      Variants: "All seven variants.",
      WithReactions: "Reactions as buttons with accessible names and pressed state.",
      Interactive: "Suggested replies: `asChild` bubbles that are buttons.",
    },
    keyboard: {
      Tab: "Moves to interactive bubbles and reaction buttons.",
      "Enter / Space": "Activates the focused bubble or reaction.",
    },
    aria: [
      "Bubbles are plain content; interactive ones must be real buttons or links (`asChild`).",
      "Reaction buttons need a name that includes the emoji meaning and count (“Thumbs up, 3 reactions”) and `aria-pressed` if they toggle.",
      "A failed message (`destructive`) should say so in text, not only by color.",
    ],
    theming: [
      "`default` uses `--primary`; `secondary` `--secondary`; `muted` `--muted`; `tinted` derives a light tint from `--primary` with relative oklch.",
      "Radius and padding live on BubbleContent; override with `className`.",
    ],
  },
  es: {
    summary:
      "La burbuja de un mensaje de chat: contenido coloreado con esquinas redondeadas, reacciones opcionales sobre un borde y siete variantes de color.",
    whenToUse: [
      "Para el cuerpo de los mensajes de chat y del asistente.",
      "Con `asChild` en BubbleContent cuando la burbuja es un botón o enlace (una respuesta sugerida).",
    ],
    whenNotToUse: [
      'Para respuestas largas del asistente con encabezados y código: usa `variant="ghost"` o contenido sin burbuja.',
    ],
    anatomy: {
      BubbleGroup: "Apila burbujas con un espacio.",
      Bubble: "El contenedor: colores de la variante, ancho máximo (80%) y lado.",
      BubbleContent: "La caja redondeada y coloreada con el texto.",
      BubbleReactions: "Fila de reacciones superpuesta al borde superior o inferior de la burbuja.",
    },
    props: {
      BubbleGroup: { children: "Burbujas." },
      Bubble: {
        variant:
          "`default` (primario), `secondary`, `muted`, `tinted` (tinte del primario), `outline`, `ghost` (sin caja), `destructive` (mensaje fallido).",
        align: "Lado de la burbuja; dentro de un Message sigue la alineación del mensaje.",
      },
      BubbleContent: { asChild: "Renderiza un `<button>` o un `<a>` como burbuja." },
      BubbleReactions: {
        side: "Borde sobre el que se superponen las reacciones.",
        align: "Esquina donde se colocan las reacciones.",
      },
    },
    stories: {
      Variants: "Las siete variantes.",
      WithReactions: "Reacciones como botones con nombre accesible y estado pulsado.",
      Interactive: "Respuestas sugeridas: burbujas `asChild` que son botones.",
    },
    keyboard: {
      Tab: "Va a las burbujas interactivas y a los botones de reacción.",
      "Enter / Space": "Activa la burbuja o la reacción enfocada.",
    },
    aria: [
      "Las burbujas son contenido; las interactivas deben ser botones o enlaces reales (`asChild`).",
      "Los botones de reacción necesitan un nombre con el significado del emoji y el recuento (“Pulgar arriba, 3 reacciones”) y `aria-pressed` si se activan y desactivan.",
      "Un mensaje fallido (`destructive`) debe decirlo con texto, no solo con color.",
    ],
    theming: [
      "`default` usa `--primary`; `secondary` `--secondary`; `muted` `--muted`; `tinted` deriva un tinte claro de `--primary` con oklch relativo.",
      "El radio y el padding están en BubbleContent; cámbialos con `className`.",
    ],
  },
});
