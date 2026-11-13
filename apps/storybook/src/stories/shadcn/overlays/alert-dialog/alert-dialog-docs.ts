import { defineComponentDocs } from "@sb/docs/define-component-docs";

const node = { children: { type: "ReactNode" } };
const buttonProps = {
  variant: { type: "Button variant", default: '"default"' },
  size: { type: "Button size", default: '"default"' },
};

export const docs = defineComponentDocs({
  name: "Alert Dialog",
  importPath: "@aureus-core/ui/shadcn/alert-dialog",
  exports: [
    "AlertDialog",
    "AlertDialogTrigger",
    "AlertDialogContent",
    "AlertDialogHeader",
    "AlertDialogFooter",
    "AlertDialogMedia",
    "AlertDialogTitle",
    "AlertDialogDescription",
    "AlertDialogAction",
    "AlertDialogCancel",
    "AlertDialogOverlay",
    "AlertDialogPortal",
  ],
  primitive: {
    label: "Radix UI Alert Dialog",
    href: "https://www.radix-ui.com/primitives/docs/components/alert-dialog",
  },
  api: {
    AlertDialog: {
      open: { type: "boolean" },
      defaultOpen: { type: "boolean", default: "false" },
      onOpenChange: { type: "(open: boolean) => void" },
    },
    AlertDialogTrigger: { asChild: { type: "boolean", default: "false" } },
    AlertDialogContent: { size: { type: '"default" | "sm"', default: '"default"' } },
    AlertDialogHeader: node,
    AlertDialogFooter: node,
    AlertDialogMedia: node,
    AlertDialogTitle: { children: { type: "ReactNode", required: true } },
    AlertDialogDescription: { children: { type: "ReactNode", required: true } },
    AlertDialogAction: { ...buttonProps, onClick: { type: "(event: MouseEvent) => void" } },
    AlertDialogCancel: {
      ...buttonProps,
      variant: { type: "Button variant", default: '"outline"' },
    },
    AlertDialogOverlay: { className: { type: "string" } },
    AlertDialogPortal: { container: { type: "HTMLElement" } },
  },
  stories: ["Destructive", "Small", "WithMedia", "IconTrigger"],
  keyboard: ["Enter / Space", "Tab", "Esc"],
  links: [
    {
      label: "shadcn/ui: Alert Dialog",
      href: "https://ui.shadcn.com/docs/components/alert-dialog",
    },
    {
      label: "Radix: Alert Dialog",
      href: "https://www.radix-ui.com/primitives/docs/components/alert-dialog",
    },
    {
      label: "WAI-ARIA APG: Alert dialog",
      href: "https://www.w3.org/WAI/ARIA/apg/patterns/alertdialog/",
    },
  ],
  en: {
    summary:
      "A modal that interrupts the user to confirm an important action. It must be answered: clicking outside does not close it, and focus starts on the safe choice (Cancel).",
    whenToUse: [
      "Before an irreversible or costly action: delete, revoke access, discard unsaved changes.",
      "When the user must acknowledge something before continuing.",
    ],
    whenNotToUse: [
      "For forms or rich content: use Dialog.",
      "For non-blocking feedback: use Alert or a toast.",
      "For actions that can be undone: do them and offer Undo instead of asking.",
    ],
    anatomy: {
      AlertDialog: "The root: holds the open state.",
      AlertDialogTrigger: "The button that opens it; focus returns to it on close.",
      AlertDialogContent:
        '`role="alertdialog"` panel with overlay, in a portal. `size="sm"` is a compact centered layout.',
      AlertDialogHeader: "Stacks media, title and description.",
      AlertDialogFooter: "The actions row, on a muted band at the bottom.",
      AlertDialogMedia: "Optional icon or image beside the title.",
      AlertDialogTitle: "The question, used as the accessible name.",
      AlertDialogDescription: "The consequences, used as the accessible description.",
      AlertDialogAction: "The confirming Button. It closes the dialog after `onClick`.",
      AlertDialogCancel: "The safe Button. It receives focus on open and closes the dialog.",
      AlertDialogOverlay: "The backdrop; clicking it does nothing.",
      AlertDialogPortal: "Renders into `document.body`. Included by AlertDialogContent.",
    },
    props: {
      AlertDialog: {
        open: "Controlled open state, for example to keep it open while an async action runs.",
        defaultOpen: "Initial open state when uncontrolled.",
        onOpenChange: "Called when it opens or closes.",
      },
      AlertDialogTrigger: { asChild: "Use your own Button as the trigger." },
      AlertDialogContent: {
        size: "`default` aligns left on larger screens; `sm` is narrow and centered with a two-column footer.",
      },
      AlertDialogHeader: { children: "Media, title and description." },
      AlertDialogFooter: { children: "Cancel and Action buttons." },
      AlertDialogMedia: { children: "An icon or image." },
      AlertDialogTitle: { children: "Question text, e.g. “Delete project?”." },
      AlertDialogDescription: { children: "What will happen if the user confirms." },
      AlertDialogAction: {
        variant: "Use `destructive` for irreversible actions.",
        size: "Button size.",
        onClick: "Runs the action; call `event.preventDefault()` to keep the dialog open.",
      },
      AlertDialogCancel: { variant: "Button variant; `outline` by default.", size: "Button size." },
      AlertDialogOverlay: { className: "Classes for the backdrop." },
      AlertDialogPortal: { container: "Element to render into." },
    },
    stories: {
      Destructive:
        'A destructive confirmation: the Action is `variant="destructive"` and names the action (“Delete”).',
      Small: '`size="sm"` for short confirmations, with the buttons side by side.',
      WithMedia: "AlertDialogMedia shows an icon next to the title.",
      IconTrigger:
        "An icon-only trigger: it needs `aria-label`, and the title repeats what is being deleted.",
    },
    keyboard: {
      "Enter / Space": "On the trigger: opens. On a button: activates it.",
      Tab: "Moves between Cancel and Action; focus stays inside.",
      Esc: "Cancels and closes the dialog.",
    },
    aria: [
      '`role="alertdialog"` with `aria-modal`, named by the title and described by the description, so the question is read on open.',
      "Focus starts on Cancel, the least destructive option, and returns to the trigger on close.",
      "The overlay does not close it: the user must choose Cancel, Action or press Esc.",
    ],
    theming: [
      "Panel: `--popover`; footer band: `--muted` at 50% with a `--border` top line.",
      "The destructive Action uses `--destructive` on its own tint (fixed for contrast in `theme.css`).",
    ],
  },
  es: {
    summary:
      "Un modal que interrumpe al usuario para confirmar una acción importante. Hay que responderlo: pulsar fuera no lo cierra, y el foco empieza en la opción segura (Cancel).",
    whenToUse: [
      "Antes de una acción irreversible o costosa: eliminar, revocar acceso, descartar cambios sin guardar.",
      "Cuando el usuario debe confirmar algo antes de seguir.",
    ],
    whenNotToUse: [
      "Para formularios o contenido enriquecido: usa Dialog.",
      "Para avisos que no bloquean: usa Alert o un toast.",
      "Para acciones que se pueden deshacer: hazlas y ofrece Deshacer en lugar de preguntar.",
    ],
    anatomy: {
      AlertDialog: "La raíz: guarda el estado abierto.",
      AlertDialogTrigger: "El botón que lo abre; el foco vuelve a él al cerrar.",
      AlertDialogContent:
        'Panel `role="alertdialog"` con overlay, en un portal. `size="sm"` es una versión compacta y centrada.',
      AlertDialogHeader: "Apila el medio, el título y la descripción.",
      AlertDialogFooter: "La fila de acciones, sobre una franja atenuada abajo.",
      AlertDialogMedia: "Icono o imagen opcional junto al título.",
      AlertDialogTitle: "La pregunta, usada como nombre accesible.",
      AlertDialogDescription: "Las consecuencias, usadas como descripción accesible.",
      AlertDialogAction: "El Button de confirmar. Cierra el diálogo después de `onClick`.",
      AlertDialogCancel: "El Button seguro. Recibe el foco al abrir y cierra el diálogo.",
      AlertDialogOverlay: "El fondo; pulsarlo no hace nada.",
      AlertDialogPortal: "Renderiza en `document.body`. Lo incluye AlertDialogContent.",
    },
    props: {
      AlertDialog: {
        open: "Estado abierto controlado, por ejemplo para mantenerlo abierto mientras corre una acción asíncrona.",
        defaultOpen: "Estado abierto inicial cuando no está controlado.",
        onOpenChange: "Se llama al abrir o cerrar.",
      },
      AlertDialogTrigger: { asChild: "Usa tu propio Button como disparador." },
      AlertDialogContent: {
        size: "`default` se alinea a la izquierda en pantallas grandes; `sm` es estrecho y centrado con un pie de dos columnas.",
      },
      AlertDialogHeader: { children: "Medio, título y descripción." },
      AlertDialogFooter: { children: "Botones Cancel y Action." },
      AlertDialogMedia: { children: "Un icono o una imagen." },
      AlertDialogTitle: { children: "Texto de la pregunta, p. ej. “¿Eliminar el proyecto?”." },
      AlertDialogDescription: { children: "Qué pasará si el usuario confirma." },
      AlertDialogAction: {
        variant: "Usa `destructive` para acciones irreversibles.",
        size: "Tamaño del botón.",
        onClick:
          "Ejecuta la acción; llama a `event.preventDefault()` para mantener el diálogo abierto.",
      },
      AlertDialogCancel: {
        variant: "Variante del botón; `outline` por defecto.",
        size: "Tamaño del botón.",
      },
      AlertDialogOverlay: { className: "Clases para el fondo." },
      AlertDialogPortal: { container: "Elemento donde renderizar." },
    },
    stories: {
      Destructive:
        'Una confirmación destructiva: Action es `variant="destructive"` y nombra la acción (“Delete”).',
      Small: '`size="sm"` para confirmaciones cortas, con los botones lado a lado.',
      WithMedia: "AlertDialogMedia muestra un icono junto al título.",
      IconTrigger:
        "Un disparador solo con icono: necesita `aria-label`, y el título repite qué se elimina.",
    },
    keyboard: {
      "Enter / Space": "En el disparador: lo abre. En un botón: lo activa.",
      Tab: "Alterna entre Cancel y Action; el foco no sale.",
      Esc: "Cancela y cierra el diálogo.",
    },
    aria: [
      '`role="alertdialog"` con `aria-modal`, nombrado por el título y descrito por la descripción, así la pregunta se lee al abrir.',
      "El foco empieza en Cancel, la opción menos destructiva, y vuelve al disparador al cerrar.",
      "El overlay no lo cierra: el usuario debe elegir Cancel, Action o pulsar Esc.",
    ],
    theming: [
      "Panel: `--popover`; franja del pie: `--muted` al 50% con una línea superior `--border`.",
      "La Action destructiva usa `--destructive` sobre su propio tinte (ajustado por contraste en `theme.css`).",
    ],
  },
});
