import { defineComponentDocs } from "@sb/docs/define-component-docs";

export const docs = defineComponentDocs({
  name: "Aspect Ratio",
  importPath: "@aureus-core/ui/shadcn/aspect-ratio",
  exports: ["AspectRatio"],
  primitive: {
    label: "Radix UI Aspect Ratio",
    href: "https://www.radix-ui.com/primitives/docs/components/aspect-ratio",
  },
  api: { AspectRatio: { ratio: { type: "number", default: "1" } } },
  stories: ["Ratios", "Video"],
  keyboard: [],
  links: [
    {
      label: "shadcn/ui: Aspect Ratio",
      href: "https://ui.shadcn.com/docs/components/aspect-ratio",
    },
    {
      label: "Radix: Aspect Ratio",
      href: "https://www.radix-ui.com/primitives/docs/components/aspect-ratio",
    },
  ],
  en: {
    summary:
      "Keeps its content at a fixed width-to-height ratio, so images and embeds keep their shape at any width.",
    whenToUse: [
      "For images, videos, maps and embeds that must keep a 16:9, 4:3 or square shape.",
      "To reserve space before an image loads and avoid layout shift.",
    ],
    whenNotToUse: [
      "When the content defines its own height (text).",
      "For simple cases where CSS `aspect-ratio` on the element is enough.",
    ],
    anatomy: { AspectRatio: "A wrapper that sizes its child to fill a box of the given `ratio`." },
    props: { AspectRatio: { ratio: "Width divided by height, e.g. `16 / 9`." } },
    stories: {
      Ratios: "16:9, 4:3 and 1:1 with the same local image.",
      Video: "A video placeholder with a caption, kept at 16:9.",
    },
    keyboard: {},
    aria: [
      "No semantics of its own: the child carries them (an `<img>` with `alt`, a titled `<iframe>`).",
      "Use `object-cover` on images so they fill the box without distortion.",
      "Give embedded iframes a `title`.",
    ],
    theming: [
      "Unstyled: add radius, background and overflow with `className` on the wrapper or the child.",
      "Use `rounded-lg overflow-hidden` on a parent for rounded media.",
    ],
  },
  es: {
    summary:
      "Mantiene su contenido en una proporción ancho/alto fija, para que imágenes e incrustaciones conserven la forma con cualquier ancho.",
    whenToUse: [
      "Para imágenes, vídeos, mapas e incrustaciones que deben mantener una forma 16:9, 4:3 o cuadrada.",
      "Para reservar espacio antes de que cargue una imagen y evitar saltos en la página.",
    ],
    whenNotToUse: [
      "Cuando el contenido define su propia altura (texto).",
      "En casos simples donde basta el `aspect-ratio` de CSS en el elemento.",
    ],
    anatomy: {
      AspectRatio: "Un contenedor que ajusta su hijo para llenar una caja de la `ratio` indicada.",
    },
    props: { AspectRatio: { ratio: "Ancho dividido entre alto, p. ej. `16 / 9`." } },
    stories: {
      Ratios: "16:9, 4:3 y 1:1 con la misma imagen local.",
      Video: "Un marcador de vídeo con pie, mantenido en 16:9.",
    },
    keyboard: {},
    aria: [
      "No tiene semántica propia: la aporta el hijo (un `<img>` con `alt`, un `<iframe>` con título).",
      "Usa `object-cover` en las imágenes para que llenen la caja sin deformarse.",
      "Dale un `title` a los iframes incrustados.",
    ],
    theming: [
      "Sin estilos: añade radio, fondo y overflow con `className` en el contenedor o el hijo.",
      "Usa `rounded-lg overflow-hidden` en un padre para medios redondeados.",
    ],
  },
});
