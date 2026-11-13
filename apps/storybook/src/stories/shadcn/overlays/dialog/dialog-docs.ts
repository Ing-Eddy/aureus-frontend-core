import { defineComponentDocs } from "@sb/docs/define-component-docs";

const node = { children: { type: "ReactNode" } };

export const docs = defineComponentDocs({
  name: "Dialog",
  importPath: "@aureus-core/ui/shadcn/dialog",
  exports: [
    "Dialog",
    "DialogTrigger",
    "DialogContent",
    "DialogHeader",
    "DialogFooter",
    "DialogTitle",
    "DialogDescription",
    "DialogClose",
    "DialogOverlay",
    "DialogPortal",
  ],
  primitive: {
    label: "Radix UI Dialog",
    href: "https://www.radix-ui.com/primitives/docs/components/dialog",
  },
  api: {
    Dialog: {
      open: { type: "boolean" },
      defaultOpen: { type: "boolean", default: "false" },
      onOpenChange: { type: "(open: boolean) => void" },
      modal: { type: "boolean", default: "true" },
    },
    DialogTrigger: { asChild: { type: "boolean", default: "false" } },
    DialogContent: {
      showCloseButton: { type: "boolean", default: "true" },
      onOpenAutoFocus: { type: "(event: Event) => void" },
      onCloseAutoFocus: { type: "(event: Event) => void" },
      onEscapeKeyDown: { type: "(event: KeyboardEvent) => void" },
      onInteractOutside: { type: "(event: Event) => void" },
    },
    DialogHeader: node,
    DialogFooter: { showCloseButton: { type: "boolean", default: "false" } },
    DialogTitle: { children: { type: "ReactNode", required: true } },
    DialogDescription: node,
    DialogClose: { asChild: { type: "boolean", default: "false" } },
    DialogOverlay: { className: { type: "string" } },
    DialogPortal: { container: { type: "HTMLElement" } },
  },
  stories: ["WithForm", "ScrollableBody", "NoCloseButton", "Controlled"],
  keyboard: ["Enter / Space", "Tab", "Shift + Tab", "Esc"],
  links: [
    { label: "shadcn/ui: Dialog", href: "https://ui.shadcn.com/docs/components/dialog" },
    { label: "Radix: Dialog", href: "https://www.radix-ui.com/primitives/docs/components/dialog" },
    {
      label: "WAI-ARIA APG: Dialog (modal)",
      href: "https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/",
    },
  ],
  en: {
    summary:
      "A window over the page that takes focus until it is closed. The page behind is inert and dimmed. Use it for focused tasks: a short form, a detail view, a confirmation with context.",
    whenToUse: [
      "For a short task that should not lose the current page: edit a profile, invite a teammate.",
      "When the content needs the user's full attention before continuing.",
    ],
    whenNotToUse: [
      "To confirm a destructive action: use AlertDialog, which cannot be dismissed by clicking outside.",
      "For side panels with navigation or filters: use Sheet (or Drawer on mobile).",
      "For small contextual content near a trigger: use Popover.",
    ],
    anatomy: {
      Dialog: "The root: holds the open state. Renders no element.",
      DialogTrigger: "The button that opens the dialog. Focus returns to it on close.",
      DialogContent:
        'The `role="dialog"` panel, centered, in a portal with an overlay. Includes a close (×) button unless `showCloseButton={false}`.',
      DialogHeader: "Stacks the title and description.",
      DialogFooter: "Action row at the bottom; stacked on mobile, right-aligned on larger screens.",
      DialogTitle:
        "The dialog's accessible name. Required: hide it with `sr-only` if the design has no visible title.",
      DialogDescription: "Linked as the dialog's accessible description.",
      DialogClose: "Closes the dialog when activated; use `asChild` with a Button.",
      DialogOverlay: "The dimmed backdrop. Included by DialogContent.",
      DialogPortal:
        "Renders the content into `document.body` (or `container`). Included by DialogContent.",
    },
    props: {
      Dialog: {
        open: "Controlled open state.",
        defaultOpen: "Initial open state when uncontrolled.",
        onOpenChange:
          "Called with `true` or `false` when the dialog opens or closes for any reason.",
        modal: "When `true`, the page behind is inert and focus is trapped.",
      },
      DialogTrigger: { asChild: "Use your own Button as the trigger." },
      DialogContent: {
        showCloseButton: "Shows the × button in the top corner.",
        onOpenAutoFocus:
          "Called when focus moves into the dialog; `preventDefault()` keeps it from moving.",
        onCloseAutoFocus:
          "Called when focus returns to the trigger; `preventDefault()` to focus something else.",
        onEscapeKeyDown: "Called on Esc; `preventDefault()` keeps the dialog open.",
        onInteractOutside: "Called on a click outside; `preventDefault()` keeps the dialog open.",
      },
      DialogHeader: { children: "Title and description." },
      DialogFooter: { showCloseButton: "Adds an outline “Close” button." },
      DialogTitle: { children: "Title text." },
      DialogDescription: { children: "Supporting text." },
      DialogClose: { asChild: "Use your own Button as the close control." },
      DialogOverlay: { className: "Classes for the backdrop." },
      DialogPortal: { container: "Element to render into instead of `document.body`." },
    },
    stories: {
      WithForm:
        "An edit-profile form: the first field gets focus on open, and Save submits and closes.",
      ScrollableBody:
        "Long content scrolls inside the dialog while header and footer stay visible.",
      NoCloseButton: "`showCloseButton={false}` with explicit Cancel/Close buttons in the footer.",
      Controlled: "`open` and `onOpenChange` owned by React state, opened from outside the dialog.",
    },
    keyboard: {
      "Enter / Space": "On the trigger: opens the dialog.",
      Tab: "Moves to the next focusable element inside the dialog, wrapping to the first.",
      "Shift + Tab": "Moves to the previous focusable element, wrapping to the last.",
      Esc: "Closes the dialog and returns focus to the trigger.",
    },
    aria: [
      '`role="dialog"` with `aria-modal`, named by DialogTitle and described by DialogDescription.',
      "Radix warns in the console when DialogTitle is missing; keep it (use `sr-only` to hide it).",
      "Focus moves into the dialog on open, stays trapped while it is open, and returns to the trigger on close.",
    ],
    theming: [
      "Panel: `--popover`/`--popover-foreground` with a `--foreground` ring at 10%; overlay: black at 10% with a backdrop blur.",
      'Width: `sm:max-w-sm`; override with `className="sm:max-w-lg"` on DialogContent.',
    ],
  },
  es: {
    summary:
      "Una ventana sobre la página que retiene el foco hasta que se cierra. La página de fondo queda inerte y atenuada. Úsalo para tareas concretas: un formulario corto, una vista de detalle, una confirmación con contexto.",
    whenToUse: [
      "Para una tarea corta sin salir de la página actual: editar un perfil, invitar a un compañero.",
      "Cuando el contenido necesita toda la atención del usuario antes de continuar.",
    ],
    whenNotToUse: [
      "Para confirmar una acción destructiva: usa AlertDialog, que no se cierra al pulsar fuera.",
      "Para paneles laterales con navegación o filtros: usa Sheet (o Drawer en móvil).",
      "Para contenido contextual pequeño junto a un disparador: usa Popover.",
    ],
    anatomy: {
      Dialog: "La raíz: guarda el estado abierto. No renderiza ningún elemento.",
      DialogTrigger: "El botón que abre el diálogo. El foco vuelve a él al cerrar.",
      DialogContent:
        'El panel `role="dialog"`, centrado, en un portal con overlay. Incluye un botón de cerrar (×) salvo con `showCloseButton={false}`.',
      DialogHeader: "Apila el título y la descripción.",
      DialogFooter:
        "Fila de acciones abajo; apiladas en móvil, alineadas a la derecha en pantallas grandes.",
      DialogTitle:
        "El nombre accesible del diálogo. Obligatorio: ocúltalo con `sr-only` si el diseño no tiene título visible.",
      DialogDescription: "Se enlaza como descripción accesible del diálogo.",
      DialogClose: "Cierra el diálogo al activarse; úsalo con `asChild` y un Button.",
      DialogOverlay: "El fondo atenuado. Lo incluye DialogContent.",
      DialogPortal:
        "Renderiza el contenido en `document.body` (o `container`). Lo incluye DialogContent.",
    },
    props: {
      Dialog: {
        open: "Estado abierto controlado.",
        defaultOpen: "Estado abierto inicial cuando no está controlado.",
        onOpenChange:
          "Se llama con `true` o `false` cuando el diálogo se abre o cierra por cualquier motivo.",
        modal: "Con `true`, la página de fondo queda inerte y el foco atrapado.",
      },
      DialogTrigger: { asChild: "Usa tu propio Button como disparador." },
      DialogContent: {
        showCloseButton: "Muestra el botón × en la esquina superior.",
        onOpenAutoFocus:
          "Se llama cuando el foco entra al diálogo; `preventDefault()` evita que se mueva.",
        onCloseAutoFocus:
          "Se llama cuando el foco vuelve al disparador; `preventDefault()` para enfocar otra cosa.",
        onEscapeKeyDown: "Se llama con Esc; `preventDefault()` mantiene el diálogo abierto.",
        onInteractOutside:
          "Se llama al pulsar fuera; `preventDefault()` mantiene el diálogo abierto.",
      },
      DialogHeader: { children: "Título y descripción." },
      DialogFooter: { showCloseButton: "Añade un botón “Close” con estilo outline." },
      DialogTitle: { children: "Texto del título." },
      DialogDescription: { children: "Texto de apoyo." },
      DialogClose: { asChild: "Usa tu propio Button como control de cierre." },
      DialogOverlay: { className: "Clases para el fondo." },
      DialogPortal: { container: "Elemento donde renderizar en lugar de `document.body`." },
    },
    stories: {
      WithForm:
        "Un formulario de editar perfil: el primer campo recibe el foco al abrir, y Save envía y cierra.",
      ScrollableBody:
        "El contenido largo se desplaza dentro del diálogo mientras cabecera y pie siguen visibles.",
      NoCloseButton: "`showCloseButton={false}` con botones Cancel/Close explícitos en el pie.",
      Controlled:
        "`open` y `onOpenChange` gestionados por estado de React, abierto desde fuera del diálogo.",
    },
    keyboard: {
      "Enter / Space": "En el disparador: abre el diálogo.",
      Tab: "Va al siguiente elemento enfocable dentro del diálogo, y vuelve al primero.",
      "Shift + Tab": "Va al elemento enfocable anterior, y vuelve al último.",
      Esc: "Cierra el diálogo y devuelve el foco al disparador.",
    },
    aria: [
      '`role="dialog"` con `aria-modal`, nombrado por DialogTitle y descrito por DialogDescription.',
      "Radix avisa en la consola cuando falta DialogTitle; mantenlo (usa `sr-only` para ocultarlo).",
      "El foco entra al diálogo al abrirlo, queda atrapado mientras está abierto y vuelve al disparador al cerrarlo.",
    ],
    theming: [
      "Panel: `--popover`/`--popover-foreground` con un anillo `--foreground` al 10%; overlay: negro al 10% con desenfoque.",
      'Ancho: `sm:max-w-sm`; cámbialo con `className="sm:max-w-lg"` en DialogContent.',
    ],
  },
});
