import { defineComponentDocs } from "@sb/docs/define-component-docs";

const asChild = { type: "boolean", default: "false" };
const className = { type: "string" };

export const docs = defineComponentDocs({
  name: "Modal",
  importPath: "@aureus-core/ui/components/modal",
  exports: [
    "Modal",
    "ModalTrigger",
    "ModalContent",
    "ModalHeader",
    "ModalTitle",
    "ModalDescription",
    "ModalBody",
    "ModalFooter",
    "ModalClose",
    "useModal",
  ],
  primitive: {
    label: "Radix Dialog & Vaul",
    href: "https://www.radix-ui.com/primitives/docs/components/dialog",
  },
  api: {
    Modal: {
      open: { type: "boolean" },
      defaultOpen: { type: "boolean", default: "false" },
      onOpenChange: { type: "(open: boolean, details: { reason }) => void" },
      onOpenChangeComplete: { type: "(open: boolean) => void" },
      mode: { type: '"responsive" | "dialog" | "drawer"', default: '"responsive"' },
      breakpoint: { type: "number", default: "768" },
      lockModeWhileOpen: { type: "boolean", default: "false" },
      onModeChange: { type: '(mode: "dialog" | "drawer") => void' },
      closeOnEscape: { type: "boolean", default: "true" },
      closeOnOutsidePress: { type: "boolean", default: "true" },
      closeOnSwipe: { type: "boolean", default: "true" },
      modal: { type: "boolean", default: "true" },
      drawerDirection: { type: '"bottom" | "top" | "left" | "right"', default: '"bottom"' },
      drawerSnapPoints: { type: "(number | string)[]" },
      drawerActiveSnapPoint: { type: "number | string | null" },
      onDrawerActiveSnapPointChange: { type: "(snapPoint: number | string | null) => void" },
      onDrawerDrag: { type: "(event: PointerEvent, percentageDragged: number) => void" },
      onDrawerRelease: { type: "(event: PointerEvent, open: boolean) => void" },
      drawerHandleOnly: { type: "boolean", default: "false" },
      drawerScaleBackground: { type: "boolean", default: "false" },
      drawerRepositionInputs: { type: "boolean", default: "true" },
    },
    ModalTrigger: { asChild },
    ModalContent: {
      size: { type: '"sm" | "md" | "lg" | "xl" | "full"', default: '"sm"' },
      closeButton: { type: "boolean", default: "false" },
      closeLabel: { type: "string" },
      drawerHandle: { type: "boolean", default: "true" },
      initialFocusRef: { type: "RefObject<HTMLElement | null>" },
      returnFocusRef: { type: "RefObject<HTMLElement | null>" },
      onOpenAutoFocus: { type: "(event: Event) => void" },
      onCloseAutoFocus: { type: "(event: Event) => void" },
      onEscapeKeyDown: { type: "(event: KeyboardEvent) => void" },
      onInteractOutside: { type: "(event: CustomEvent) => void" },
      container: { type: "HTMLElement | null", default: "document.body" },
      className,
      overlayClassName: className,
      closeButtonClassName: className,
      handleClassName: className,
    },
    ModalHeader: { asChild, className },
    ModalTitle: { asChild, visuallyHidden: { type: "boolean", default: "false" }, className },
    ModalDescription: {
      asChild,
      visuallyHidden: { type: "boolean", default: "false" },
      className,
    },
    ModalBody: { asChild, className },
    ModalFooter: { asChild, className },
    ModalClose: { asChild },
    useModal: {},
  },
  stories: [
    "Sizes",
    "ForcedModes",
    "Responsive",
    "WithForm",
    "Controlled",
    "DismissOptions",
    "LongContent",
    "Nested",
    "DrawerSnapPoints",
    "DrawerDirections",
    "HiddenTitle",
    "UseModalHook",
  ],
  keyboard: ["Enter / Space", "Tab", "Shift + Tab", "Escape"],
  links: [
    { label: "Dialog (shadcn)", href: "?path=/docs/shadcn-overlays-dialog--docs" },
    { label: "Drawer (shadcn)", href: "?path=/docs/shadcn-overlays-drawer--docs" },
    { label: "Radix Dialog", href: "https://www.radix-ui.com/primitives/docs/components/dialog" },
    { label: "Vaul", href: "https://vaul.emilkowal.ski/" },
    {
      label: "WAI-ARIA: Dialog (modal) pattern",
      href: "https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/",
    },
  ],
  en: {
    summary:
      "A modal that is a centred dialog on wide viewports and a bottom drawer (swipe to close) on narrow ones. One set of props controls both: state with close reasons, independent dismissal rules, focus, size and the drawer options. It renders no text of its own.",
    whenToUse: [
      "For a task that interrupts the page and must be finished or dismissed: editing a record, a short form, a choice.",
      "When the same overlay must feel native on phones (a drawer you can swipe) and on desktop (a centred dialog).",
      "When you need to know why it closed (`onOpenChange` reason), to block some ways of closing, or to run code after the animation.",
    ],
    whenNotToUse: [
      "For a confirmation that must be answered: use AlertDialog, which has the `alertdialog` role and no outside dismissal.",
      "For a side panel on desktop, such as navigation or filters next to the content: use Sheet.",
      "For non-blocking messages: use a toast or an inline Alert.",
    ],
    anatomy: {
      Modal:
        "The root. It holds the open state, the mode and the behaviour, and renders no element.",
      ModalTrigger:
        "Opens and closes the modal. It is rendered outside the dialog and drawer, so it keeps its node when the mode changes.",
      ModalContent:
        "The panel: a dialog or a drawer, with its overlay and portal. Only this part changes when the mode changes.",
      ModalHeader: "Groups the title and the description at the top.",
      ModalTitle: "The dialog's accessible name. Every panel needs one.",
      ModalDescription: "The optional accessible description.",
      ModalBody:
        "The main content. It scrolls on its own when the panel would exceed the viewport.",
      ModalFooter: "The actions: a row at the end in the dialog, stacked in the drawer.",
      ModalClose: "Closes the modal; use `asChild` with a Button.",
      useModal:
        "Hook for any component inside `Modal`: returns `open`, `mode`, `setOpen(open)` and `close()`.",
    },
    props: {
      Modal: {
        open: "Controlled open state. Pass it with `onOpenChange`.",
        defaultOpen: "Initial open state when uncontrolled.",
        onOpenChange:
          'Called with every requested change and its reason: `"trigger"`, `"close"`, `"close-button"`, `"escape-key"`, `"outside-press"` or `"swipe"`. A controlled modal changes only when `open` changes.',
        onOpenChangeComplete:
          "Called once when the opening or closing animation ends (at once with reduced motion). Use it to reset a form after closing.",
        mode: "`responsive` picks the mode from the viewport width; `dialog` and `drawer` force it.",
        breakpoint:
          "Viewport width in CSS pixels from which a responsive modal is a dialog. Below it, it is a drawer. Without `matchMedia` (server rendering) it is a dialog.",
        lockModeWhileOpen:
          "Keeps the mode the modal opened with until it closes. Without it, crossing the breakpoint while open remounts the panel, and state kept inside it is lost.",
        onModeChange: "Called when the presentation changes.",
        closeOnEscape: "Escape closes the modal, in both modes.",
        closeOnOutsidePress: "A press outside the panel closes it, in both modes.",
        closeOnSwipe: "Dragging the drawer closes it. Only the drawer uses it.",
        modal:
          "With `true`, an overlay is shown, page scroll is locked and the page is inert. With `false`, the page stays usable; the dismissal props keep their values.",
        drawerDirection: "Edge the drawer comes from.",
        drawerSnapPoints:
          'Resting positions of the drawer: fractions of the viewport (`0.5`) or CSS lengths (`"320px"`).',
        drawerActiveSnapPoint: "Controlled snap point. Omit it to let the drawer own it.",
        onDrawerActiveSnapPointChange: "Called when the drawer moves to another snap point.",
        onDrawerDrag: "Called while the drawer is dragged, with the dragged percentage.",
        onDrawerRelease: "Called when a drag ends, with whether the drawer stays open.",
        drawerHandleOnly: "The drawer can only be dragged from its handle.",
        drawerScaleBackground:
          "Scales the page down behind the drawer. Wrap the page in an element with `data-vaul-drawer-wrapper`.",
        drawerRepositionInputs:
          "Moves the drawer above the on-screen keyboard while an input inside it has focus.",
      },
      ModalTrigger: {
        asChild:
          "Renders your element (such as a Button) instead of a `button`. It gets `aria-haspopup`, `aria-expanded` and `aria-controls`.",
      },
      ModalContent: {
        size: "Width of the dialog: `sm` (shadcn's width), `md`, `lg`, `xl` or `full`. The drawer ignores it.",
        closeButton:
          "Shows a close button in the top inline-end corner. It requires `closeLabel`; there is no default text.",
        closeLabel:
          'Accessible name of the close button, in your language, such as "Close". Required with `closeButton`.',
        drawerHandle: "Shows the decorative grab handle on top and bottom drawers.",
        initialFocusRef:
          "Element focused when the modal opens, instead of the first focusable one.",
        returnFocusRef: "Element focused when the modal closes, instead of the trigger.",
        onOpenAutoFocus: "Called when focus moves inside; `preventDefault()` keeps it where it is.",
        onCloseAutoFocus:
          "Called when focus returns; `preventDefault()` lets you move it yourself.",
        onEscapeKeyDown: "Called on Escape; `preventDefault()` keeps the modal open.",
        onInteractOutside: "Called on a press outside the panel; `preventDefault()` keeps it open.",
        container: "Element the panel is portalled into.",
        className: "Extra classes for the panel. Other `div` props are passed to it.",
        overlayClassName: "Extra classes for the overlay.",
        closeButtonClassName: "Extra classes for the close button.",
        handleClassName: "Extra classes for the drawer handle.",
      },
      ModalHeader: {
        asChild: "Renders your element (such as `header`) instead of a `div`.",
        className: "Extra classes, merged after the defaults of the current mode.",
      },
      ModalTitle: {
        asChild: "Renders your element instead of an `h2`.",
        visuallyHidden: "Hides the title from view; it still names the dialog.",
        className: "Extra classes for the title.",
      },
      ModalDescription: {
        asChild: "Renders your element instead of a `p`.",
        visuallyHidden: "Hides the description from view; it still describes the dialog.",
        className: "Extra classes for the description.",
      },
      ModalBody: {
        asChild: "Renders your element instead of a `div`.",
        className: "Extra classes for the scrolling body.",
      },
      ModalFooter: {
        asChild: "Renders your element instead of a `div`.",
        className: "Extra classes for the actions area.",
      },
      ModalClose: {
        asChild: "Renders your element (such as a Button) instead of a `button`.",
      },
      useModal: {},
    },
    stories: {
      Sizes: "The five dialog widths, from `sm` to `full`.",
      ForcedModes: '`mode="dialog"` and `mode="drawer"` ignore the viewport width.',
      Responsive:
        "The Playground modal on a phone: a bottom drawer you can swipe down. Resize the viewport across 768 px to see it switch.",
      WithForm:
        "A react-hook-form form with a zod schema inside the panel: `useModal().close()` closes it after a valid submit, `lockModeWhileOpen` keeps the typed text if the viewport changes, outside presses are ignored once the form is dirty, and `onOpenChangeComplete` resets it after closing.",
      Controlled:
        "The page owns `open` and shows the reason of the last change from `onOpenChange`.",
      DismissOptions:
        "`closeOnEscape`, `closeOnOutsidePress` and `closeOnSwipe` turned off: only the buttons close it.",
      LongContent:
        "The body scrolls on its own while the header and footer stay visible, and the panel never exceeds the viewport.",
      Nested:
        "A modal inside another: Escape closes only the top one and focus returns to its trigger. In drawer mode the drawers stack.",
      DrawerSnapPoints: "A drawer that rests at half height and can be dragged to full height.",
      DrawerDirections: "The drawer from each edge; only top and bottom drawers show the handle.",
      HiddenTitle:
        "`visuallyHidden` keeps the dialog named for screen readers without showing the title.",
      UseModalHook:
        "A child component reads the state and mode with `useModal` and closes the modal.",
    },
    keyboard: {
      "Enter / Space":
        "On the trigger, opens the modal; on `ModalClose` or the close button, closes it.",
      Tab: "Moves focus to the next element inside the panel; focus stays inside while it is open.",
      "Shift + Tab": "Moves focus to the previous element inside the panel.",
      Escape:
        "Closes the modal (unless `closeOnEscape` is off) and returns focus to the trigger. With nested modals, only the top one closes.",
    },
    aria: [
      'The panel has `role="dialog"` and `aria-modal`, is named by `ModalTitle` and described by `ModalDescription`. Without a description it has no `aria-describedby`.',
      "Every panel needs a `ModalTitle`; use `visuallyHidden` when the design has no visible title. A development warning names a panel without one.",
      "The component renders no text: the close button needs `closeLabel` (TypeScript requires it with `closeButton`), and its target is 44 px on touch screens.",
      "Focus moves inside on open (to `initialFocusRef` when given) and returns to `returnFocusRef`, the trigger, or the element focused before opening.",
      "When the viewport crosses the breakpoint while the modal is open, the panel is replaced and focus moves to the new one. Use `lockModeWhileOpen` to avoid it during a form.",
      "With `modal={false}` the dialog leaves the page fully usable. In drawer mode, Vaul still hides the page from assistive technology and keeps keyboard focus in the drawer; only pointer input reaches the page.",
    ],
    theming: [
      "The panel uses shadcn's dialog and drawer tokens (`popover`, `muted`, `ring`) and radius.",
      "Target `[data-slot=modal-content]` with `[data-mode=dialog]` or `[data-mode=drawer]`, and `data-size`, to style one presentation.",
      "Each section has `className` and a `data-slot` (`modal-header`, `modal-body`, `modal-footer`, `modal-title`, `modal-description`, `modal-handle`, `modal-overlay`).",
      "Animations are removed under `prefers-reduced-motion`.",
    ],
  },
  es: {
    summary:
      "Un modal que es un diálogo centrado en pantallas anchas y un drawer inferior (se cierra deslizando) en pantallas estrechas. Un solo conjunto de props controla los dos: estado con motivos de cierre, reglas de cierre independientes, foco, tamaño y las opciones del drawer. No muestra ningún texto propio.",
    whenToUse: [
      "Para una tarea que interrumpe la página y debe terminarse o descartarse: editar un registro, un formulario corto, una elección.",
      "Cuando el mismo overlay debe sentirse nativo en el móvil (un drawer que se desliza) y en escritorio (un diálogo centrado).",
      "Cuando necesitas saber por qué se cerró (el motivo de `onOpenChange`), bloquear algunas formas de cerrar o ejecutar código al terminar la animación.",
    ],
    whenNotToUse: [
      "Para una confirmación que hay que responder: usa AlertDialog, que tiene el rol `alertdialog` y no se cierra al pulsar fuera.",
      "Para un panel lateral en escritorio, como navegación o filtros junto al contenido: usa Sheet.",
      "Para mensajes que no bloquean: usa un toast o un Alert en línea.",
    ],
    anatomy: {
      Modal:
        "La raíz. Guarda el estado abierto, el modo y el comportamiento, y no renderiza ningún elemento.",
      ModalTrigger:
        "Abre y cierra el modal. Se renderiza fuera del diálogo y del drawer, así conserva su nodo cuando cambia el modo.",
      ModalContent:
        "El panel: un diálogo o un drawer, con su overlay y su portal. Solo esta parte cambia cuando cambia el modo.",
      ModalHeader: "Agrupa el título y la descripción arriba.",
      ModalTitle: "El nombre accesible del diálogo. Todo panel necesita uno.",
      ModalDescription: "La descripción accesible, opcional.",
      ModalBody:
        "El contenido principal. Hace scroll propio cuando el panel superaría la pantalla.",
      ModalFooter: "Las acciones: en fila al final en el diálogo, apiladas en el drawer.",
      ModalClose: "Cierra el modal; usa `asChild` con un Button.",
      useModal:
        "Hook para cualquier componente dentro de `Modal`: devuelve `open`, `mode`, `setOpen(open)` y `close()`.",
    },
    props: {
      Modal: {
        open: "Estado abierto controlado. Pásalo junto con `onOpenChange`.",
        defaultOpen: "Estado inicial cuando no está controlado.",
        onOpenChange:
          'Se llama con cada cambio pedido y su motivo: `"trigger"`, `"close"`, `"close-button"`, `"escape-key"`, `"outside-press"` o `"swipe"`. Un modal controlado solo cambia cuando cambia `open`.',
        onOpenChangeComplete:
          "Se llama una vez al terminar la animación de apertura o de cierre (al instante con movimiento reducido). Úsalo para reiniciar un formulario al cerrar.",
        mode: "`responsive` elige el modo según el ancho de la pantalla; `dialog` y `drawer` lo fuerzan.",
        breakpoint:
          "Ancho de pantalla en píxeles CSS desde el que un modal responsive es un diálogo. Por debajo es un drawer. Sin `matchMedia` (render en servidor) es un diálogo.",
        lockModeWhileOpen:
          "Mantiene el modo con el que se abrió hasta que se cierra. Sin esto, cruzar el breakpoint con el modal abierto remonta el panel y se pierde el estado guardado dentro.",
        onModeChange: "Se llama cuando cambia la presentación.",
        closeOnEscape: "Escape cierra el modal, en los dos modos.",
        closeOnOutsidePress: "Pulsar fuera del panel lo cierra, en los dos modos.",
        closeOnSwipe: "Arrastrar el drawer lo cierra. Solo lo usa el drawer.",
        modal:
          "Con `true` se muestra un overlay, se bloquea el scroll y la página queda inerte. Con `false` la página sigue usable; las props de cierre conservan su valor.",
        drawerDirection: "Borde desde el que sale el drawer.",
        drawerSnapPoints:
          'Posiciones de reposo del drawer: fracciones de la pantalla (`0.5`) o longitudes CSS (`"320px"`).',
        drawerActiveSnapPoint:
          "Punto de anclaje controlado. Omítelo para que lo gestione el drawer.",
        onDrawerActiveSnapPointChange: "Se llama cuando el drawer pasa a otro punto de anclaje.",
        onDrawerDrag: "Se llama mientras se arrastra el drawer, con el porcentaje arrastrado.",
        onDrawerRelease: "Se llama al soltar el arrastre, con si el drawer sigue abierto.",
        drawerHandleOnly: "El drawer solo se puede arrastrar desde el asa.",
        drawerScaleBackground:
          "Reduce la página detrás del drawer. Envuelve la página en un elemento con `data-vaul-drawer-wrapper`.",
        drawerRepositionInputs:
          "Sube el drawer por encima del teclado en pantalla mientras un input dentro tiene el foco.",
      },
      ModalTrigger: {
        asChild:
          "Renderiza tu elemento (como un Button) en lugar de un `button`. Recibe `aria-haspopup`, `aria-expanded` y `aria-controls`.",
      },
      ModalContent: {
        size: "Ancho del diálogo: `sm` (el de shadcn), `md`, `lg`, `xl` o `full`. El drawer lo ignora.",
        closeButton:
          "Muestra un botón de cerrar en la esquina superior del lado final. Requiere `closeLabel`; no hay texto por defecto.",
        closeLabel:
          'Nombre accesible del botón de cerrar, en tu idioma, como "Cerrar". Obligatorio con `closeButton`.',
        drawerHandle: "Muestra el asa decorativa en los drawers superior e inferior.",
        initialFocusRef: "Elemento que recibe el foco al abrir, en lugar del primero enfocable.",
        returnFocusRef: "Elemento que recibe el foco al cerrar, en lugar del trigger.",
        onOpenAutoFocus: "Se llama cuando el foco entra; `preventDefault()` lo deja donde está.",
        onCloseAutoFocus: "Se llama cuando el foco vuelve; `preventDefault()` te deja moverlo tú.",
        onEscapeKeyDown: "Se llama al pulsar Escape; `preventDefault()` mantiene el modal abierto.",
        onInteractOutside:
          "Se llama al pulsar fuera del panel; `preventDefault()` lo mantiene abierto.",
        container: "Elemento al que se lleva el panel con el portal.",
        className: "Clases extra para el panel. El resto de props de `div` llegan a él.",
        overlayClassName: "Clases extra para el overlay.",
        closeButtonClassName: "Clases extra para el botón de cerrar.",
        handleClassName: "Clases extra para el asa del drawer.",
      },
      ModalHeader: {
        asChild: "Renderiza tu elemento (como `header`) en lugar de un `div`.",
        className: "Clases extra, aplicadas después de las del modo actual.",
      },
      ModalTitle: {
        asChild: "Renderiza tu elemento en lugar de un `h2`.",
        visuallyHidden: "Oculta el título a la vista; sigue nombrando el diálogo.",
        className: "Clases extra para el título.",
      },
      ModalDescription: {
        asChild: "Renderiza tu elemento en lugar de un `p`.",
        visuallyHidden: "Oculta la descripción a la vista; sigue describiendo el diálogo.",
        className: "Clases extra para la descripción.",
      },
      ModalBody: {
        asChild: "Renderiza tu elemento en lugar de un `div`.",
        className: "Clases extra para el cuerpo con scroll.",
      },
      ModalFooter: {
        asChild: "Renderiza tu elemento en lugar de un `div`.",
        className: "Clases extra para la zona de acciones.",
      },
      ModalClose: {
        asChild: "Renderiza tu elemento (como un Button) en lugar de un `button`.",
      },
      useModal: {},
    },
    stories: {
      Sizes: "Los cinco anchos del diálogo, de `sm` a `full`.",
      ForcedModes: '`mode="dialog"` y `mode="drawer"` ignoran el ancho de la pantalla.',
      Responsive:
        "El modal del Playground en un móvil: un drawer inferior que se cierra deslizando hacia abajo. Cambia el ancho por encima y por debajo de 768 px para verlo cambiar.",
      WithForm:
        "Un formulario de react-hook-form con un schema de zod dentro del panel: `useModal().close()` lo cierra tras un envío válido, `lockModeWhileOpen` conserva lo escrito si cambia la pantalla, las pulsaciones fuera se ignoran cuando el formulario tiene cambios y `onOpenChangeComplete` lo reinicia al cerrar.",
      Controlled:
        "La página controla `open` y muestra el motivo del último cambio que da `onOpenChange`.",
      DismissOptions:
        "`closeOnEscape`, `closeOnOutsidePress` y `closeOnSwipe` desactivados: solo lo cierran los botones.",
      LongContent:
        "El cuerpo hace scroll propio mientras la cabecera y el pie siguen visibles, y el panel nunca supera la pantalla.",
      Nested:
        "Un modal dentro de otro: Escape cierra solo el de arriba y el foco vuelve a su trigger. En modo drawer los drawers se apilan.",
      DrawerSnapPoints: "Un drawer que reposa a media altura y se puede arrastrar hasta arriba.",
      DrawerDirections:
        "El drawer desde cada borde; solo los drawers superior e inferior muestran el asa.",
      HiddenTitle:
        "`visuallyHidden` mantiene el diálogo nombrado para lectores de pantalla sin mostrar el título.",
      UseModalHook: "Un componente hijo lee el estado y el modo con `useModal` y cierra el modal.",
    },
    keyboard: {
      "Enter / Space":
        "En el trigger, abre el modal; en `ModalClose` o en el botón de cerrar, lo cierra.",
      Tab: "Mueve el foco al siguiente elemento del panel; el foco no sale mientras está abierto.",
      "Shift + Tab": "Mueve el foco al elemento anterior del panel.",
      Escape:
        "Cierra el modal (salvo con `closeOnEscape` desactivado) y devuelve el foco al trigger. Con modales anidados, solo se cierra el de arriba.",
    },
    aria: [
      'El panel tiene `role="dialog"` y `aria-modal`, lo nombra `ModalTitle` y lo describe `ModalDescription`. Sin descripción no tiene `aria-describedby`.',
      "Todo panel necesita un `ModalTitle`; usa `visuallyHidden` cuando el diseño no tiene título visible. Un aviso de desarrollo señala el panel que no lo tiene.",
      "El componente no muestra textos: el botón de cerrar necesita `closeLabel` (TypeScript lo exige con `closeButton`) y su área táctil es de 44 px en pantallas táctiles.",
      "El foco entra al abrir (a `initialFocusRef` si se da) y vuelve a `returnFocusRef`, al trigger o al elemento que tenía el foco antes de abrir.",
      "Si la pantalla cruza el breakpoint con el modal abierto, el panel se reemplaza y el foco pasa al nuevo. Usa `lockModeWhileOpen` para evitarlo durante un formulario.",
      "Con `modal={false}` el diálogo deja la página totalmente usable. En modo drawer, Vaul sigue ocultando la página a las tecnologías de asistencia y mantiene el foco del teclado en el drawer; solo el puntero llega a la página.",
    ],
    theming: [
      "El panel usa los tokens del diálogo y del drawer de shadcn (`popover`, `muted`, `ring`) y su radio.",
      "Apunta a `[data-slot=modal-content]` con `[data-mode=dialog]` o `[data-mode=drawer]`, y `data-size`, para dar estilo a una presentación.",
      "Cada sección tiene `className` y un `data-slot` (`modal-header`, `modal-body`, `modal-footer`, `modal-title`, `modal-description`, `modal-handle`, `modal-overlay`).",
      "Las animaciones se quitan con `prefers-reduced-motion`.",
    ],
  },
});
