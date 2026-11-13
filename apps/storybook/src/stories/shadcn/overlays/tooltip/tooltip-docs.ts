import { defineComponentDocs } from "@sb/docs/define-component-docs";

export const docs = defineComponentDocs({
  name: "Tooltip",
  importPath: "@aureus-core/ui/shadcn/tooltip",
  exports: ["TooltipProvider", "Tooltip", "TooltipTrigger", "TooltipContent"],
  primitive: {
    label: "Radix UI Tooltip",
    href: "https://www.radix-ui.com/primitives/docs/components/tooltip",
  },
  providers: [{ name: "TooltipProvider", importPath: "@aureus-core/ui/shadcn/tooltip" }],
  api: {
    TooltipProvider: {
      delayDuration: { type: "number", default: "0" },
      skipDelayDuration: { type: "number", default: "300" },
      disableHoverableContent: { type: "boolean", default: "false" },
    },
    Tooltip: {
      open: { type: "boolean" },
      defaultOpen: { type: "boolean", default: "false" },
      onOpenChange: { type: "(open: boolean) => void" },
      delayDuration: { type: "number" },
    },
    TooltipTrigger: { asChild: { type: "boolean", default: "false" } },
    TooltipContent: {
      side: { type: '"top" | "right" | "bottom" | "left"', default: '"top"' },
      align: { type: '"start" | "center" | "end"', default: '"center"' },
      sideOffset: { type: "number", default: "0" },
    },
  },
  stories: ["IconButton", "Sides", "WithKeyboardShortcut", "Delay", "DisabledTrigger"],
  keyboard: ["Tab", "Esc"],
  links: [
    { label: "shadcn/ui: Tooltip", href: "https://ui.shadcn.com/docs/components/tooltip" },
    {
      label: "Radix: Tooltip",
      href: "https://www.radix-ui.com/primitives/docs/components/tooltip",
    },
    { label: "WAI-ARIA APG: Tooltip", href: "https://www.w3.org/WAI/ARIA/apg/patterns/tooltip/" },
  ],
  en: {
    summary:
      "A short text label that appears when a control is hovered or focused. It names or explains a control, typically an icon button. Requires a TooltipProvider in the app.",
    whenToUse: [
      "To show the name of an icon-only button (keep its `aria-label` too).",
      "To reveal a keyboard shortcut or a short hint about a control.",
    ],
    whenNotToUse: [
      "For interactive content or anything longer than a sentence: use Popover or HoverCard.",
      "For essential information: touch users cannot hover. Put it on the page.",
    ],
    anatomy: {
      TooltipProvider:
        "Shares the delays for every tooltip below it. Mount it once near the app root; this Storybook mounts it globally.",
      Tooltip: "The root of one tooltip: open state.",
      TooltipTrigger: "The control that shows the tooltip on hover and focus.",
      TooltipContent:
        'The dark label with an arrow, in a portal. It exposes a `role="tooltip"` to assistive technology.',
    },
    props: {
      TooltipProvider: {
        delayDuration:
          "Milliseconds of hover before opening. This package defaults it to `0` (Radix uses 700).",
        skipDelayDuration: "Window after closing one tooltip in which the next opens instantly.",
        disableHoverableContent: "Closes the tooltip as soon as the pointer leaves the trigger.",
      },
      Tooltip: {
        open: "Controlled open state.",
        defaultOpen: "Initial open state.",
        onOpenChange: "Called when it opens or closes.",
        delayDuration: "Overrides the provider delay for this tooltip.",
      },
      TooltipTrigger: { asChild: "Use your own Button as the trigger." },
      TooltipContent: {
        side: "Preferred side; it flips when there is no room.",
        align: "Alignment against the trigger.",
        sideOffset: "Gap from the trigger in pixels.",
      },
    },
    stories: {
      IconButton:
        "The main use: an icon-only button with `aria-label` and a tooltip with the same text.",
      Sides: "The tooltip on each side.",
      WithKeyboardShortcut: "Content with a Kbd showing the shortcut.",
      Delay: "A per-tooltip `delayDuration` of 500 ms, like Radix's default behaviour.",
      DisabledTrigger:
        "Disabled buttons do not fire pointer events: wrap them in a focusable `<span>` to keep the tooltip.",
    },
    keyboard: {
      Tab: "Focusing the trigger opens the tooltip immediately; moving focus closes it.",
      Esc: "Closes the tooltip while the trigger keeps focus.",
    },
    aria: [
      'While open, the trigger gets `aria-describedby` pointing to the `role="tooltip"` text.',
      "A tooltip describes, it does not name: icon buttons still need `aria-label`.",
      "Opens on keyboard focus as well as hover, and Esc dismisses it (WCAG 1.4.13).",
    ],
    theming: [
      "Inverted colors: `--foreground` background with `--background` text; the arrow uses the same fill.",
      "Text is `text-xs`; long content wraps at `max-w-xs`.",
    ],
  },
  es: {
    summary:
      "Una etiqueta de texto corta que aparece al pasar el ratón o enfocar un control. Nombra o explica un control, normalmente un botón con icono. Necesita un TooltipProvider en la app.",
    whenToUse: [
      "Para mostrar el nombre de un botón solo con icono (mantén también su `aria-label`).",
      "Para mostrar un atajo de teclado o una pista corta sobre un control.",
    ],
    whenNotToUse: [
      "Para contenido interactivo o de más de una frase: usa Popover o HoverCard.",
      "Para información esencial: en táctil no se puede pasar el ratón. Ponla en la página.",
    ],
    anatomy: {
      TooltipProvider:
        "Comparte los retardos de todos los tooltips por debajo. Móntalo una vez cerca de la raíz de la app; este Storybook lo monta globalmente.",
      Tooltip: "La raíz de un tooltip: estado abierto.",
      TooltipTrigger: "El control que muestra el tooltip al pasar el ratón y al enfocarlo.",
      TooltipContent:
        'La etiqueta oscura con flecha, en un portal. Expone un `role="tooltip"` a las tecnologías de asistencia.',
    },
    props: {
      TooltipProvider: {
        delayDuration:
          "Milisegundos sobre el disparador antes de abrir. Este paquete lo deja en `0` (Radix usa 700).",
        skipDelayDuration: "Tiempo tras cerrar un tooltip en el que el siguiente abre al instante.",
        disableHoverableContent: "Cierra el tooltip en cuanto el ratón sale del disparador.",
      },
      Tooltip: {
        open: "Estado abierto controlado.",
        defaultOpen: "Estado abierto inicial.",
        onOpenChange: "Se llama al abrir o cerrar.",
        delayDuration: "Sustituye el retardo del provider para este tooltip.",
      },
      TooltipTrigger: { asChild: "Usa tu propio Button como disparador." },
      TooltipContent: {
        side: "Lado preferido; cambia de lado si no hay espacio.",
        align: "Alineación respecto al disparador.",
        sideOffset: "Separación del disparador en píxeles.",
      },
    },
    stories: {
      IconButton:
        "El uso principal: un botón solo con icono con `aria-label` y un tooltip con el mismo texto.",
      Sides: "El tooltip en cada lado.",
      WithKeyboardShortcut: "Contenido con un Kbd que muestra el atajo.",
      Delay:
        "Un `delayDuration` de 500 ms en un tooltip, como el comportamiento por defecto de Radix.",
      DisabledTrigger:
        "Los botones deshabilitados no emiten eventos de puntero: envuélvelos en un `<span>` enfocable para conservar el tooltip.",
    },
    keyboard: {
      Tab: "Enfocar el disparador abre el tooltip al instante; mover el foco lo cierra.",
      Esc: "Cierra el tooltip mientras el disparador mantiene el foco.",
    },
    aria: [
      'Mientras está abierto, el disparador recibe `aria-describedby` apuntando al texto `role="tooltip"`.',
      "Un tooltip describe, no nombra: los botones con icono siguen necesitando `aria-label`.",
      "Se abre con el foco del teclado además de con el ratón, y Esc lo cierra (WCAG 1.4.13).",
    ],
    theming: [
      "Colores invertidos: fondo `--foreground` con texto `--background`; la flecha usa el mismo relleno.",
      "El texto es `text-xs`; el contenido largo se ajusta a `max-w-xs`.",
    ],
  },
});
