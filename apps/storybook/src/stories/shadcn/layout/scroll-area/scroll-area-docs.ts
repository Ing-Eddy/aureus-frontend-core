import { defineComponentDocs } from "@sb/docs/define-component-docs";

export const docs = defineComponentDocs({
  name: "Scroll Area",
  importPath: "@aureus-core/ui/shadcn/scroll-area",
  exports: ["ScrollArea", "ScrollBar"],
  primitive: {
    label: "Radix UI Scroll Area",
    href: "https://www.radix-ui.com/primitives/docs/components/scroll-area",
  },
  api: {
    ScrollArea: {
      type: { type: '"auto" | "always" | "scroll" | "hover"', default: '"hover"' },
      scrollHideDelay: { type: "number", default: "600" },
      className: { type: "string" },
    },
    ScrollBar: { orientation: { type: '"vertical" | "horizontal"', default: '"vertical"' } },
  },
  stories: ["Horizontal", "Both"],
  keyboard: ["Tab", "↑ / ↓ / ← / →", "Page Up / Page Down", "Home / End"],
  links: [
    { label: "shadcn/ui: Scroll Area", href: "https://ui.shadcn.com/docs/components/scroll-area" },
    {
      label: "Radix: Scroll Area",
      href: "https://www.radix-ui.com/primitives/docs/components/scroll-area",
    },
  ],
  en: {
    summary:
      "A scrollable region with thin, theme-styled scrollbars that look the same on every OS. Native scrolling, wheel and touch keep working.",
    whenToUse: [
      "For fixed-height panels with long content: tag lists, sidebars, chat history.",
      "For horizontal strips of cards or images.",
    ],
    whenNotToUse: [
      "For the main page scroll: let the browser handle it.",
      "When the default scrollbars are fine: a plain `overflow-auto` element is simpler.",
    ],
    anatomy: {
      ScrollArea: "Root and viewport. It includes a vertical ScrollBar and the corner.",
      ScrollBar:
        'A styled scrollbar; add `<ScrollBar orientation="horizontal" />` for horizontal scrolling.',
    },
    props: {
      ScrollArea: {
        type: "When scrollbars show: on `hover` (default), `always`, while `scroll`ing, or `auto` when content overflows.",
        scrollHideDelay:
          "Milliseconds before the scrollbars hide after the user stops interacting.",
        className: "Give it a fixed height or width, e.g. `h-72`.",
      },
      ScrollBar: { orientation: "Axis of this scrollbar." },
    },
    stories: {
      Horizontal: 'A horizontal strip of images with `<ScrollBar orientation="horizontal" />`.',
      Both: "Content that overflows in both directions with both scrollbars.",
    },
    keyboard: {
      Tab: "Moves focus into the viewport, once it is made focusable (see Accessibility).",
      "↑ / ↓ / ← / →": "Scrolls the viewport.",
      "Page Up / Page Down": "Scrolls by a page.",
      "Home / End": "Scrolls to the start or end.",
    },
    aria: [
      "Upstream limitation: the viewport is not focusable, so content without focusable elements cannot be scrolled by keyboard. Add `tabindex=\"0\"` with a ref on ScrollArea: `ref={(root) => root?.querySelector('[data-slot=scroll-area-viewport]')?.setAttribute('tabindex', '0')}`.",
      "Give the region a name (`aria-label` on ScrollArea, or a heading) when it holds a distinct section.",
      "The custom scrollbars are presentational; scrolling never depends on them.",
    ],
    theming: [
      "Thumb: `--border`; track is transparent. Focus ring on the viewport: `--ring`.",
      "Thickness: `w-2.5` / `h-2.5`; override on ScrollBar with `className`.",
    ],
  },
  es: {
    summary:
      "Una región desplazable con barras finas y del tema que se ven igual en todos los sistemas. El desplazamiento nativo, la rueda y el táctil siguen funcionando.",
    whenToUse: [
      "Para paneles de altura fija con contenido largo: listas de etiquetas, barras laterales, historial de chat.",
      "Para tiras horizontales de tarjetas o imágenes.",
    ],
    whenNotToUse: [
      "Para el desplazamiento principal de la página: deja que lo gestione el navegador.",
      "Cuando las barras por defecto valen: un elemento con `overflow-auto` es más sencillo.",
    ],
    anatomy: {
      ScrollArea: "Raíz y viewport. Incluye una ScrollBar vertical y la esquina.",
      ScrollBar:
        'Una barra con estilo; añade `<ScrollBar orientation="horizontal" />` para el desplazamiento horizontal.',
    },
    props: {
      ScrollArea: {
        type: "Cuándo se ven las barras: al pasar el ratón (`hover`, por defecto), siempre (`always`), al desplazar (`scroll`) o `auto` si hay desbordamiento.",
        scrollHideDelay:
          "Milisegundos antes de ocultar las barras cuando el usuario deja de interactuar.",
        className: "Dale una altura o anchura fija, p. ej. `h-72`.",
      },
      ScrollBar: { orientation: "Eje de esta barra." },
    },
    stories: {
      Horizontal: 'Una tira horizontal de imágenes con `<ScrollBar orientation="horizontal" />`.',
      Both: "Contenido que desborda en ambas direcciones con las dos barras.",
    },
    keyboard: {
      Tab: "Mueve el foco al viewport, una vez hecho enfocable (mira Accesibilidad).",
      "↑ / ↓ / ← / →": "Desplaza el viewport.",
      "Page Up / Page Down": "Desplaza una página.",
      "Home / End": "Va al inicio o al final.",
    },
    aria: [
      "Limitación de shadcn: el viewport no es enfocable, así que un contenido sin elementos enfocables no se puede desplazar con teclado. Añade `tabindex=\"0\"` con una ref en ScrollArea: `ref={(root) => root?.querySelector('[data-slot=scroll-area-viewport]')?.setAttribute('tabindex', '0')}`.",
      "Dale un nombre a la región (`aria-label` en ScrollArea, o un encabezado) cuando contenga una sección propia.",
      "Las barras personalizadas son de presentación; el desplazamiento nunca depende de ellas.",
    ],
    theming: [
      "Pulgar: `--border`; el carril es transparente. Anillo de foco del viewport: `--ring`.",
      "Grosor: `w-2.5` / `h-2.5`; cámbialo en ScrollBar con `className`.",
    ],
  },
});
