import { defineComponentDocs } from "@sb/docs/define-component-docs";

const button = {
  variant: { type: "Button variant", default: '"outline"' },
  size: { type: "Button size", default: '"icon-sm"' },
};

export const docs = defineComponentDocs({
  name: "Carousel",
  importPath: "@aureus-core/ui/shadcn/carousel",
  exports: [
    "Carousel",
    "CarouselContent",
    "CarouselItem",
    "CarouselPrevious",
    "CarouselNext",
    "useCarousel",
    "type CarouselApi",
  ],
  primitive: { label: "Embla Carousel", href: "https://www.embla-carousel.com/" },
  api: {
    Carousel: {
      opts: { type: "EmblaOptionsType" },
      plugins: { type: "EmblaPluginType[]" },
      orientation: { type: '"horizontal" | "vertical"', default: '"horizontal"' },
      setApi: { type: "(api: CarouselApi) => void" },
      "aria-label": { type: "string" },
    },
    CarouselContent: { className: { type: "string" } },
    CarouselItem: { className: { type: "string" } },
    CarouselPrevious: button,
    CarouselNext: button,
    useCarousel: {
      api: { type: "CarouselApi" },
      scrollPrev: { type: "() => void" },
      scrollNext: { type: "() => void" },
      canScrollPrev: { type: "boolean" },
      canScrollNext: { type: "boolean" },
    },
  },
  stories: ["Sizes", "Loop", "Vertical", "WithCounter"],
  keyboard: ["Tab", "← / →"],
  links: [
    { label: "shadcn/ui: Carousel", href: "https://ui.shadcn.com/docs/components/carousel" },
    { label: "Embla Carousel", href: "https://www.embla-carousel.com/" },
    { label: "WAI-ARIA APG: Carousel", href: "https://www.w3.org/WAI/ARIA/apg/patterns/carousel/" },
  ],
  en: {
    summary:
      "A row (or column) of slides that users move through with buttons, arrow keys, swipe or drag. Built on Embla: every Embla option and plugin works.",
    whenToUse: [
      "For a set of related visuals where only a few fit at once: product photos, testimonials.",
      "When browsing the items is optional and their order matters little.",
    ],
    whenNotToUse: [
      "For important content users must see: carousels hide most slides. Use a grid or list.",
      "For auto-rotating banners without a pause control: they fail WCAG 2.2.2.",
    ],
    anatomy: {
      Carousel:
        '`role="region"` with `aria-roledescription="carousel"`: the viewport, keyboard handling and context.',
      CarouselContent: "The track of slides.",
      CarouselItem:
        '`role="group"` slide with `aria-roledescription="slide"`. Its width (`basis-*`) sets how many are visible.',
      CarouselPrevious:
        "Button that scrolls to the previous slide; disabled at the start unless looping.",
      CarouselNext: "Button that scrolls to the next slide; disabled at the end unless looping.",
      useCarousel: "Hook for custom controls inside Carousel.",
    },
    props: {
      Carousel: {
        opts: "Embla options: `loop`, `align`, `slidesToScroll`, `startIndex`…",
        plugins: "Embla plugins such as Autoplay (add a pause button if you use it).",
        orientation: "`vertical` scrolls up and down; give CarouselContent a height.",
        setApi: "Receives the Embla API to read the current slide or scroll programmatically.",
        "aria-label": "Name of the region, e.g. “Featured destinations”.",
      },
      CarouselContent: {
        className: "Classes for the track, e.g. a height for vertical carousels.",
      },
      CarouselItem: { className: "Use `basis-1/2`, `basis-1/3`… to show several slides." },
      CarouselPrevious: { variant: "Button variant.", size: "Button size." },
      CarouselNext: { variant: "Button variant.", size: "Button size." },
      useCarousel: {
        api: "The Embla API instance.",
        scrollPrev: "Scrolls to the previous slide.",
        scrollNext: "Scrolls to the next slide.",
        canScrollPrev: "Whether there is a previous slide.",
        canScrollNext: "Whether there is a next slide.",
      },
    },
    stories: {
      Sizes: "`basis-1/3` on each item shows three slides at once.",
      Loop: "`opts={{ loop: true }}`: the buttons are never disabled and the slides wrap.",
      Vertical: '`orientation="vertical"` with a fixed height.',
      WithCounter: "`setApi` drives a live “Slide 2 of 5” counter.",
    },
    keyboard: {
      Tab: "Moves to the Previous and Next buttons.",
      "← / →": "With focus inside the carousel, moves to the previous or next slide.",
    },
    aria: [
      "The carousel and slides use `aria-roledescription`; give the carousel an `aria-label`.",
      "Previous/Next buttons are named “Previous slide” / “Next slide”.",
      "Announce slide changes with a live region (see WithCounter) and never auto-advance without a pause control.",
    ],
    theming: [
      "Buttons use the `outline` Button variant; slides have no styles of their own.",
      "Spacing between slides comes from `-ml-4` on the track and `pl-4` on each item; change both together.",
    ],
  },
  es: {
    summary:
      "Una fila (o columna) de diapositivas que se recorre con botones, flechas, deslizando o arrastrando. Construido sobre Embla: funcionan todas sus opciones y plugins.",
    whenToUse: [
      "Para un conjunto de imágenes relacionadas donde solo caben unas pocas: fotos de producto, testimonios.",
      "Cuando recorrer los elementos es opcional y su orden importa poco.",
    ],
    whenNotToUse: [
      "Para contenido importante que hay que ver: un carrusel oculta casi todas las diapositivas. Usa una rejilla o lista.",
      "Para banners que rotan solos sin control de pausa: incumplen WCAG 2.2.2.",
    ],
    anatomy: {
      Carousel:
        '`role="region"` con `aria-roledescription="carousel"`: el viewport, el teclado y el contexto.',
      CarouselContent: "El carril de diapositivas.",
      CarouselItem:
        'Diapositiva `role="group"` con `aria-roledescription="slide"`. Su ancho (`basis-*`) define cuántas se ven.',
      CarouselPrevious:
        "Botón que va a la diapositiva anterior; deshabilitado al inicio salvo con loop.",
      CarouselNext:
        "Botón que va a la diapositiva siguiente; deshabilitado al final salvo con loop.",
      useCarousel: "Hook para controles propios dentro de Carousel.",
    },
    props: {
      Carousel: {
        opts: "Opciones de Embla: `loop`, `align`, `slidesToScroll`, `startIndex`…",
        plugins: "Plugins de Embla como Autoplay (añade un botón de pausa si lo usas).",
        orientation: "`vertical` se desplaza arriba y abajo; dale una altura a CarouselContent.",
        setApi: "Recibe la API de Embla para leer la diapositiva actual o desplazar por código.",
        "aria-label": "Nombre de la región, p. ej. “Destinos destacados”.",
      },
      CarouselContent: {
        className: "Clases para el carril, p. ej. una altura en carruseles verticales.",
      },
      CarouselItem: {
        className: "Usa `basis-1/2`, `basis-1/3`… para mostrar varias diapositivas.",
      },
      CarouselPrevious: { variant: "Variante del botón.", size: "Tamaño del botón." },
      CarouselNext: { variant: "Variante del botón.", size: "Tamaño del botón." },
      useCarousel: {
        api: "La instancia de la API de Embla.",
        scrollPrev: "Va a la diapositiva anterior.",
        scrollNext: "Va a la diapositiva siguiente.",
        canScrollPrev: "Si hay una diapositiva anterior.",
        canScrollNext: "Si hay una diapositiva siguiente.",
      },
    },
    stories: {
      Sizes: "`basis-1/3` en cada elemento muestra tres diapositivas a la vez.",
      Loop: "`opts={{ loop: true }}`: los botones nunca se deshabilitan y las diapositivas dan la vuelta.",
      Vertical: '`orientation="vertical"` con una altura fija.',
      WithCounter: "`setApi` alimenta un contador en vivo “Slide 2 of 5”.",
    },
    keyboard: {
      Tab: "Va a los botones Anterior y Siguiente.",
      "← / →": "Con el foco dentro del carrusel, va a la diapositiva anterior o siguiente.",
    },
    aria: [
      "El carrusel y las diapositivas usan `aria-roledescription`; dale al carrusel un `aria-label`.",
      "Los botones Anterior/Siguiente se llaman “Previous slide” / “Next slide”.",
      "Anuncia los cambios de diapositiva con una región viva (mira WithCounter) y nunca avances solo sin un control de pausa.",
    ],
    theming: [
      "Los botones usan la variante `outline` de Button; las diapositivas no tienen estilos propios.",
      "El espacio entre diapositivas viene de `-ml-4` en el carril y `pl-4` en cada elemento; cámbialos juntos.",
    ],
  },
});
