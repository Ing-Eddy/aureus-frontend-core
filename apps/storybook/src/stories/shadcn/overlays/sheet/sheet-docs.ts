import { defineComponentDocs } from "@sb/docs/define-component-docs";

const node = { children: { type: "ReactNode" } };

export const docs = defineComponentDocs({
  name: "Sheet",
  importPath: "@aureus-core/ui/shadcn/sheet",
  exports: [
    "Sheet",
    "SheetTrigger",
    "SheetContent",
    "SheetHeader",
    "SheetFooter",
    "SheetTitle",
    "SheetDescription",
    "SheetClose",
  ],
  primitive: {
    label: "Radix UI Dialog",
    href: "https://www.radix-ui.com/primitives/docs/components/dialog",
  },
  api: {
    Sheet: {
      open: { type: "boolean" },
      defaultOpen: { type: "boolean", default: "false" },
      onOpenChange: { type: "(open: boolean) => void" },
      modal: { type: "boolean", default: "true" },
    },
    SheetTrigger: { asChild: { type: "boolean", default: "false" } },
    SheetContent: {
      side: { type: '"top" | "right" | "bottom" | "left"', default: '"right"' },
      showCloseButton: { type: "boolean", default: "true" },
    },
    SheetHeader: node,
    SheetFooter: node,
    SheetTitle: { children: { type: "ReactNode", required: true } },
    SheetDescription: node,
    SheetClose: { asChild: { type: "boolean", default: "false" } },
  },
  stories: ["Sides", "WithForm", "Mobile"],
  keyboard: ["Enter / Space", "Tab", "Esc"],
  links: [
    { label: "shadcn/ui: Sheet", href: "https://ui.shadcn.com/docs/components/sheet" },
    { label: "Radix: Dialog", href: "https://www.radix-ui.com/primitives/docs/components/dialog" },
  ],
  en: {
    summary:
      "A Dialog that slides in from an edge of the screen. It keeps the page visible beside it, which suits secondary tasks: filters, settings, details, navigation on mobile.",
    whenToUse: [
      "For a side panel with filters, settings or the details of a selected item.",
      "For mobile navigation menus that slide in from the left.",
    ],
    whenNotToUse: [
      "For a short focused task in the middle of the screen: use Dialog.",
      "For a swipeable bottom panel on touch devices: use Drawer.",
    ],
    anatomy: {
      Sheet: "The root (a Radix Dialog root): holds the open state.",
      SheetTrigger: "Opens the sheet; focus returns to it on close.",
      SheetContent: '`role="dialog"` panel attached to `side`, with overlay and a × button.',
      SheetHeader: "Title and description at the top, with padding.",
      SheetFooter: "Actions pinned to the bottom of the panel (`mt-auto`).",
      SheetTitle: "The accessible name of the sheet.",
      SheetDescription: "The accessible description.",
      SheetClose: "Closes the sheet; use `asChild` with a Button.",
    },
    props: {
      Sheet: {
        open: "Controlled open state.",
        defaultOpen: "Initial open state when uncontrolled.",
        onOpenChange: "Called when the sheet opens or closes.",
        modal: "When `true`, the page is inert and focus is trapped.",
      },
      SheetTrigger: { asChild: "Use your own Button as the trigger." },
      SheetContent: {
        side: "Edge the panel slides from. Left and right panels are 3/4 wide, max `sm` on larger screens.",
        showCloseButton: "Shows the × button.",
      },
      SheetHeader: { children: "Title and description." },
      SheetFooter: { children: "Action buttons." },
      SheetTitle: { children: "Title text." },
      SheetDescription: { children: "Supporting text." },
      SheetClose: { asChild: "Use your own Button as the close control." },
    },
    stories: {
      Sides: "The four `side` values, each opened from its own button.",
      WithForm: "A settings form inside the sheet with Save and Cancel in the footer.",
      Mobile: "On a phone viewport, a left sheet works as the navigation menu.",
    },
    keyboard: {
      "Enter / Space": "On the trigger: opens the sheet.",
      Tab: "Moves through the sheet's controls; focus stays inside.",
      Esc: "Closes the sheet and returns focus to the trigger.",
    },
    aria: [
      'A modal `role="dialog"` named by SheetTitle and described by SheetDescription.',
      "Focus is trapped while open and returns to the trigger on close.",
      "Keep SheetTitle even for menus (use `sr-only` if it should not show).",
    ],
    theming: [
      "Panel: `--popover` with a `--border` edge and `shadow-lg`; overlay as in Dialog.",
      'Change the width with `className="sm:max-w-lg"`, or the height of top/bottom sheets with `h-*`.',
    ],
  },
  es: {
    summary:
      "Un Dialog que se desliza desde un borde de la pantalla. Deja la página visible a su lado, lo que encaja con tareas secundarias: filtros, ajustes, detalles, navegación en móvil.",
    whenToUse: [
      "Para un panel lateral con filtros, ajustes o el detalle de un elemento seleccionado.",
      "Para menús de navegación en móvil que se deslizan desde la izquierda.",
    ],
    whenNotToUse: [
      "Para una tarea corta y concreta en el centro de la pantalla: usa Dialog.",
      "Para un panel inferior deslizable en pantallas táctiles: usa Drawer.",
    ],
    anatomy: {
      Sheet: "La raíz (una raíz de Radix Dialog): guarda el estado abierto.",
      SheetTrigger: "Abre el panel; el foco vuelve a él al cerrar.",
      SheetContent: 'Panel `role="dialog"` pegado a `side`, con overlay y un botón ×.',
      SheetHeader: "Título y descripción arriba, con padding.",
      SheetFooter: "Acciones fijas abajo del panel (`mt-auto`).",
      SheetTitle: "El nombre accesible del panel.",
      SheetDescription: "La descripción accesible.",
      SheetClose: "Cierra el panel; úsalo con `asChild` y un Button.",
    },
    props: {
      Sheet: {
        open: "Estado abierto controlado.",
        defaultOpen: "Estado abierto inicial cuando no está controlado.",
        onOpenChange: "Se llama al abrir o cerrar el panel.",
        modal: "Con `true`, la página queda inerte y el foco atrapado.",
      },
      SheetTrigger: { asChild: "Usa tu propio Button como disparador." },
      SheetContent: {
        side: "Borde desde el que se desliza. Los paneles izquierdo y derecho ocupan 3/4, como máximo `sm` en pantallas grandes.",
        showCloseButton: "Muestra el botón ×.",
      },
      SheetHeader: { children: "Título y descripción." },
      SheetFooter: { children: "Botones de acción." },
      SheetTitle: { children: "Texto del título." },
      SheetDescription: { children: "Texto de apoyo." },
      SheetClose: { asChild: "Usa tu propio Button como control de cierre." },
    },
    stories: {
      Sides: "Los cuatro valores de `side`, cada uno abierto desde su botón.",
      WithForm: "Un formulario de ajustes dentro del panel con Save y Cancel en el pie.",
      Mobile: "En un viewport de teléfono, un panel izquierdo hace de menú de navegación.",
    },
    keyboard: {
      "Enter / Space": "En el disparador: abre el panel.",
      Tab: "Recorre los controles del panel; el foco no sale.",
      Esc: "Cierra el panel y devuelve el foco al disparador.",
    },
    aria: [
      'Un `role="dialog"` modal nombrado por SheetTitle y descrito por SheetDescription.',
      "El foco queda atrapado mientras está abierto y vuelve al disparador al cerrar.",
      "Mantén SheetTitle incluso en menús (usa `sr-only` si no debe verse).",
    ],
    theming: [
      "Panel: `--popover` con un borde `--border` y `shadow-lg`; overlay como en Dialog.",
      'Cambia el ancho con `className="sm:max-w-lg"`, o la altura de los paneles superior/inferior con `h-*`.',
    ],
  },
});
