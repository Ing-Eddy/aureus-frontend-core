import { defineComponentDocs } from "@sb/docs/define-component-docs";

export const docs = defineComponentDocs({
  name: "Hover Card",
  importPath: "@aureus-core/ui/shadcn/hover-card",
  exports: ["HoverCard", "HoverCardTrigger", "HoverCardContent"],
  primitive: {
    label: "Radix UI Hover Card",
    href: "https://www.radix-ui.com/primitives/docs/components/hover-card",
  },
  api: {
    HoverCard: {
      openDelay: { type: "number", default: "700" },
      closeDelay: { type: "number", default: "300" },
      open: { type: "boolean" },
      onOpenChange: { type: "(open: boolean) => void" },
    },
    HoverCardTrigger: { asChild: { type: "boolean", default: "false" } },
    HoverCardContent: {
      side: { type: '"top" | "right" | "bottom" | "left"', default: '"bottom"' },
      align: { type: '"start" | "center" | "end"', default: '"center"' },
      sideOffset: { type: "number", default: "4" },
    },
  },
  stories: ["Profile", "Sides"],
  keyboard: ["Tab", "Shift + Tab"],
  links: [
    { label: "shadcn/ui: Hover Card", href: "https://ui.shadcn.com/docs/components/hover-card" },
    {
      label: "Radix: Hover Card",
      href: "https://www.radix-ui.com/primitives/docs/components/hover-card",
    },
  ],
  en: {
    summary:
      "A preview card shown when a pointer hovers over, or keyboard focus reaches, a link: a user profile, a repository summary. It is supplementary, for sighted mouse users first.",
    whenToUse: [
      "To preview what is behind a link (a user, an issue) without navigating.",
      "When the same information is also available on the linked page.",
    ],
    whenNotToUse: [
      "For essential information or actions: they would be unreachable on touch devices. Use Popover.",
      "For a one-line hint: use Tooltip.",
    ],
    anatomy: {
      HoverCard: "The root: open state and the open/close delays.",
      HoverCardTrigger: "Usually a link (`asChild` with `<a>`). Hover or focus opens the card.",
      HoverCardContent:
        "The floating card in a portal. It stays open while the pointer is over it.",
    },
    props: {
      HoverCard: {
        openDelay: "Milliseconds of hover before opening, to avoid flashes while moving the mouse.",
        closeDelay: "Milliseconds before closing after the pointer leaves.",
        open: "Controlled open state.",
        onOpenChange: "Called when it opens or closes.",
      },
      HoverCardTrigger: { asChild: "Use your own link as the trigger." },
      HoverCardContent: {
        side: "Preferred side; it flips when there is no room.",
        align: "Alignment against the trigger.",
        sideOffset: "Gap from the trigger in pixels.",
      },
    },
    stories: {
      Profile: "A user profile preview on an @mention link, with local avatar images.",
      Sides: "The card on each side of its trigger.",
    },
    keyboard: {
      Tab: "Focusing the trigger opens the card (after `openDelay`).",
      "Shift + Tab": "Moving focus away closes it.",
    },
    aria: [
      "The card is not announced to screen readers and its content is not focusable: treat it as decoration of the link.",
      "The trigger stays a normal link with a descriptive name.",
      "Never put the only copy of important content or actions in a hover card.",
    ],
    theming: [
      "Same surface as Popover: `--popover`, `ring-1` of `--foreground` at 10%, `shadow-md`.",
      "Default width is `w-64`; change it with `className`.",
    ],
  },
  es: {
    summary:
      "Una tarjeta de vista previa que aparece al pasar el ratón por un enlace o al enfocarlo con teclado: el perfil de un usuario, el resumen de un repositorio. Es complementaria, pensada sobre todo para usuarios con ratón.",
    whenToUse: [
      "Para previsualizar lo que hay detrás de un enlace (un usuario, una incidencia) sin navegar.",
      "Cuando la misma información también está en la página enlazada.",
    ],
    whenNotToUse: [
      "Para información o acciones esenciales: serían inalcanzables en pantallas táctiles. Usa Popover.",
      "Para una pista de una línea: usa Tooltip.",
    ],
    anatomy: {
      HoverCard: "La raíz: estado abierto y los retardos de apertura y cierre.",
      HoverCardTrigger:
        "Normalmente un enlace (`asChild` con `<a>`). Pasar el ratón o enfocarlo abre la tarjeta.",
      HoverCardContent:
        "La tarjeta flotante en un portal. Sigue abierta mientras el ratón está encima.",
    },
    props: {
      HoverCard: {
        openDelay:
          "Milisegundos sobre el disparador antes de abrir, para evitar destellos al mover el ratón.",
        closeDelay: "Milisegundos antes de cerrar cuando el ratón sale.",
        open: "Estado abierto controlado.",
        onOpenChange: "Se llama al abrir o cerrar.",
      },
      HoverCardTrigger: { asChild: "Usa tu propio enlace como disparador." },
      HoverCardContent: {
        side: "Lado preferido; cambia de lado si no hay espacio.",
        align: "Alineación respecto al disparador.",
        sideOffset: "Separación del disparador en píxeles.",
      },
    },
    stories: {
      Profile: "Una vista previa de perfil sobre un enlace @mención, con avatares locales.",
      Sides: "La tarjeta en cada lado de su disparador.",
    },
    keyboard: {
      Tab: "Enfocar el disparador abre la tarjeta (tras `openDelay`).",
      "Shift + Tab": "Mover el foco fuera la cierra.",
    },
    aria: [
      "La tarjeta no se anuncia a los lectores de pantalla y su contenido no es enfocable: trátala como decoración del enlace.",
      "El disparador sigue siendo un enlace normal con un nombre descriptivo.",
      "Nunca pongas la única copia de contenido o acciones importantes en una hover card.",
    ],
    theming: [
      "La misma superficie que Popover: `--popover`, `ring-1` de `--foreground` al 10%, `shadow-md`.",
      "El ancho por defecto es `w-64`; cámbialo con `className`.",
    ],
  },
});
