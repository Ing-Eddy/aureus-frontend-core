import { defineComponentDocs } from "@sb/docs/define-component-docs";

const node = { children: { type: "ReactNode" } };

export const docs = defineComponentDocs({
  name: "Drawer",
  importPath: "@aureus-core/ui/shadcn/drawer",
  exports: [
    "Drawer",
    "DrawerTrigger",
    "DrawerContent",
    "DrawerHeader",
    "DrawerFooter",
    "DrawerTitle",
    "DrawerDescription",
    "DrawerClose",
    "DrawerOverlay",
    "DrawerPortal",
  ],
  primitive: { label: "Vaul", href: "https://vaul.emilkowal.ski/" },
  api: {
    Drawer: {
      open: { type: "boolean" },
      onOpenChange: { type: "(open: boolean) => void" },
      direction: { type: '"top" | "right" | "bottom" | "left"', default: '"bottom"' },
      snapPoints: { type: "(number | string)[]" },
      activeSnapPoint: { type: "number | string | null" },
      setActiveSnapPoint: { type: "(snapPoint: number | string | null) => void" },
      dismissible: { type: "boolean", default: "true" },
      shouldScaleBackground: { type: "boolean", default: "false" },
    },
    DrawerTrigger: { asChild: { type: "boolean", default: "false" } },
    DrawerContent: node,
    DrawerHeader: node,
    DrawerFooter: node,
    DrawerTitle: { children: { type: "ReactNode", required: true } },
    DrawerDescription: node,
    DrawerClose: { asChild: { type: "boolean", default: "false" } },
    DrawerOverlay: { className: { type: "string" } },
    DrawerPortal: { container: { type: "HTMLElement" } },
  },
  stories: ["Directions", "SnapPoints", "WithForm", "Mobile"],
  keyboard: ["Enter / Space", "Tab", "Esc"],
  links: [
    { label: "shadcn/ui: Drawer", href: "https://ui.shadcn.com/docs/components/drawer" },
    { label: "Vaul", href: "https://vaul.emilkowal.ski/" },
  ],
  en: {
    summary:
      "A panel that slides from an edge and can be dragged closed, built on Vaul. The bottom drawer, with its grab handle, is the mobile-native alternative to Dialog.",
    whenToUse: [
      "On touch devices, for actions and short forms that should feel native (swipe down to close).",
      "With `snapPoints` for a panel that rests half-open and expands on drag.",
      "As the mobile half of a responsive pattern: Dialog on desktop, Drawer on mobile.",
    ],
    whenNotToUse: [
      "On desktop for side panels: Sheet is simpler and does not need drag gestures.",
      "For confirmations that must be answered: use AlertDialog.",
    ],
    anatomy: {
      Drawer: "The Vaul root: open state, direction, snap points and drag behaviour.",
      DrawerTrigger: "Opens the drawer.",
      DrawerContent: '`role="dialog"` panel with overlay; bottom drawers show a grab handle.',
      DrawerHeader: "Title and description, centered for top and bottom drawers.",
      DrawerFooter: "Actions at the bottom of the panel.",
      DrawerTitle: "The accessible name.",
      DrawerDescription: "The accessible description.",
      DrawerClose: "Closes the drawer; use `asChild` with a Button.",
      DrawerOverlay: "The dimmed backdrop. Included by DrawerContent.",
      DrawerPortal: "Renders into `document.body`. Included by DrawerContent.",
    },
    props: {
      Drawer: {
        open: "Controlled open state.",
        onOpenChange: "Called when the drawer opens or closes (including by drag).",
        direction: "Edge the drawer comes from, and the drag direction.",
        snapPoints:
          'Resting positions: fractions of the screen (`0.5`) or pixel strings (`"300px"`).',
        activeSnapPoint: "Controlled current snap point.",
        setActiveSnapPoint: "Called when the user drags to another snap point.",
        dismissible: "When `false`, dragging, Esc and outside clicks do not close it.",
        shouldScaleBackground: "Scales the page behind (needs a `vaul-drawer-wrapper` element).",
      },
      DrawerTrigger: { asChild: "Use your own Button as the trigger." },
      DrawerContent: { children: "Header, body and footer." },
      DrawerHeader: { children: "Title and description." },
      DrawerFooter: { children: "Action buttons." },
      DrawerTitle: { children: "Title text." },
      DrawerDescription: { children: "Supporting text." },
      DrawerClose: { asChild: "Use your own Button as the close control." },
      DrawerOverlay: { className: "Classes for the backdrop." },
      DrawerPortal: { container: "Element to render into." },
    },
    stories: {
      Directions: "`direction` set to each edge; only bottom drawers show the handle.",
      SnapPoints:
        "`snapPoints={[0.4, 1]}`: the drawer opens at 40% and can be dragged to full height.",
      WithForm: "A short form inside the drawer with submit and cancel actions.",
      Mobile: "The typical mobile use, on a phone viewport.",
    },
    keyboard: {
      "Enter / Space": "On the trigger: opens the drawer.",
      Tab: "Moves through the drawer's controls; focus stays inside.",
      Esc: "Closes the drawer (unless `dismissible={false}`).",
    },
    aria: [
      'Vaul uses Radix Dialog: a modal `role="dialog"` named by DrawerTitle and described by DrawerDescription.',
      "Dragging is an extra gesture, never the only way to close: Esc and a close button always work.",
      "Focus is trapped while open and returns to the trigger on close.",
    ],
    theming: [
      "Panel: `--popover`, rounded on the inner edge; handle: `--muted`.",
      "Bottom and top drawers are capped at 80vh; left and right are 3/4 wide (max `sm`).",
    ],
  },
  es: {
    summary:
      "Un panel que se desliza desde un borde y se puede cerrar arrastrando, construido sobre Vaul. El drawer inferior, con su tirador, es la alternativa nativa de móvil a Dialog.",
    whenToUse: [
      "En pantallas táctiles, para acciones y formularios cortos que deben sentirse nativos (deslizar hacia abajo para cerrar).",
      "Con `snapPoints` para un panel que se queda medio abierto y se expande al arrastrar.",
      "Como la mitad móvil de un patrón adaptable: Dialog en escritorio, Drawer en móvil.",
    ],
    whenNotToUse: [
      "En escritorio para paneles laterales: Sheet es más sencillo y no necesita gestos de arrastre.",
      "Para confirmaciones que hay que responder: usa AlertDialog.",
    ],
    anatomy: {
      Drawer: "La raíz de Vaul: estado abierto, dirección, puntos de anclaje y arrastre.",
      DrawerTrigger: "Abre el drawer.",
      DrawerContent:
        'Panel `role="dialog"` con overlay; los drawers inferiores muestran un tirador.',
      DrawerHeader: "Título y descripción, centrados en drawers superiores e inferiores.",
      DrawerFooter: "Acciones abajo del panel.",
      DrawerTitle: "El nombre accesible.",
      DrawerDescription: "La descripción accesible.",
      DrawerClose: "Cierra el drawer; úsalo con `asChild` y un Button.",
      DrawerOverlay: "El fondo atenuado. Lo incluye DrawerContent.",
      DrawerPortal: "Renderiza en `document.body`. Lo incluye DrawerContent.",
    },
    props: {
      Drawer: {
        open: "Estado abierto controlado.",
        onOpenChange: "Se llama al abrir o cerrar el drawer (también al arrastrar).",
        direction: "Borde desde el que aparece, y dirección del arrastre.",
        snapPoints:
          'Posiciones de reposo: fracciones de la pantalla (`0.5`) o píxeles como cadena (`"300px"`).',
        activeSnapPoint: "Punto de anclaje actual controlado.",
        setActiveSnapPoint: "Se llama cuando el usuario arrastra a otro punto de anclaje.",
        dismissible: "Con `false`, ni arrastrar, ni Esc, ni pulsar fuera lo cierran.",
        shouldScaleBackground:
          "Escala la página de fondo (necesita un elemento `vaul-drawer-wrapper`).",
      },
      DrawerTrigger: { asChild: "Usa tu propio Button como disparador." },
      DrawerContent: { children: "Cabecera, cuerpo y pie." },
      DrawerHeader: { children: "Título y descripción." },
      DrawerFooter: { children: "Botones de acción." },
      DrawerTitle: { children: "Texto del título." },
      DrawerDescription: { children: "Texto de apoyo." },
      DrawerClose: { asChild: "Usa tu propio Button como control de cierre." },
      DrawerOverlay: { className: "Clases para el fondo." },
      DrawerPortal: { container: "Elemento donde renderizar." },
    },
    stories: {
      Directions: "`direction` con cada borde; solo los drawers inferiores muestran el tirador.",
      SnapPoints:
        "`snapPoints={[0.4, 1]}`: el drawer abre al 40% y se puede arrastrar a toda la altura.",
      WithForm: "Un formulario corto dentro del drawer con acciones de enviar y cancelar.",
      Mobile: "El uso típico en móvil, en un viewport de teléfono.",
    },
    keyboard: {
      "Enter / Space": "En el disparador: abre el drawer.",
      Tab: "Recorre los controles del drawer; el foco no sale.",
      Esc: "Cierra el drawer (salvo con `dismissible={false}`).",
    },
    aria: [
      'Vaul usa Radix Dialog: un `role="dialog"` modal nombrado por DrawerTitle y descrito por DrawerDescription.',
      "Arrastrar es un gesto extra, nunca la única forma de cerrar: Esc y un botón de cerrar siempre funcionan.",
      "El foco queda atrapado mientras está abierto y vuelve al disparador al cerrar.",
    ],
    theming: [
      "Panel: `--popover`, redondeado en el borde interior; tirador: `--muted`.",
      "Los drawers inferior y superior llegan como máximo al 80vh; izquierdo y derecho ocupan 3/4 (máximo `sm`).",
    ],
  },
});
