import { defineComponentDocs } from "@sb/docs/define-component-docs";

const position = {
  side: { type: '"top" | "right" | "bottom" | "left"', default: '"bottom"' },
  align: { type: '"start" | "center" | "end"', default: '"center"' },
  sideOffset: { type: "number", default: "4" },
  alignOffset: { type: "number", default: "0" },
  collisionPadding: { type: "number", default: "0" },
};

export const docs = defineComponentDocs({
  name: "Popover",
  importPath: "@aureus-core/ui/shadcn/popover",
  exports: [
    "Popover",
    "PopoverTrigger",
    "PopoverContent",
    "PopoverAnchor",
    "PopoverHeader",
    "PopoverTitle",
    "PopoverDescription",
  ],
  primitive: {
    label: "Radix UI Popover",
    href: "https://www.radix-ui.com/primitives/docs/components/popover",
  },
  api: {
    Popover: {
      open: { type: "boolean" },
      defaultOpen: { type: "boolean", default: "false" },
      onOpenChange: { type: "(open: boolean) => void" },
      modal: { type: "boolean", default: "false" },
    },
    PopoverTrigger: { asChild: { type: "boolean", default: "false" } },
    PopoverContent: position,
    PopoverAnchor: { asChild: { type: "boolean", default: "false" } },
    PopoverHeader: { children: { type: "ReactNode" } },
    PopoverTitle: { children: { type: "ReactNode" } },
    PopoverDescription: { children: { type: "ReactNode" } },
  },
  stories: ["Placement", "WithForm", "WithAnchor"],
  keyboard: ["Enter / Space", "Tab", "Esc"],
  links: [
    { label: "shadcn/ui: Popover", href: "https://ui.shadcn.com/docs/components/popover" },
    {
      label: "Radix: Popover",
      href: "https://www.radix-ui.com/primitives/docs/components/popover",
    },
  ],
  en: {
    summary:
      "Rich content in a floating panel anchored to a trigger. It opens on click, can hold interactive content, and closes on Esc or a click outside.",
    whenToUse: [
      "For small, interactive content tied to a control: a date picker, a color picker, quick settings.",
      "For extra information the user asks for by clicking.",
    ],
    whenNotToUse: [
      "For a short text label on hover or focus: use Tooltip.",
      "For a preview on hover: use HoverCard.",
      "For a list of actions: use DropdownMenu. For a task that needs full attention: use Dialog.",
    ],
    anatomy: {
      Popover: "The root: holds the open state.",
      PopoverTrigger: "Toggles the popover; gets `aria-expanded` and `aria-controls`.",
      PopoverContent: '`role="dialog"` panel in a portal, positioned with collision handling.',
      PopoverAnchor: "Optional element to position against instead of the trigger.",
      PopoverHeader: "Stacks title and description with consistent spacing.",
      PopoverTitle: "Heading of the panel.",
      PopoverDescription: "Muted supporting text.",
    },
    props: {
      Popover: {
        open: "Controlled open state.",
        defaultOpen: "Initial open state.",
        onOpenChange: "Called when it opens or closes.",
        modal: "When `true`, traps focus and makes the page inert while open.",
      },
      PopoverTrigger: { asChild: "Use your own Button as the trigger." },
      PopoverContent: {
        side: "Preferred side; it flips when there is no room.",
        align: "Alignment against the trigger.",
        sideOffset: "Gap from the trigger in pixels.",
        alignOffset: "Shift along the alignment axis.",
        collisionPadding: "Distance from the viewport edges to keep.",
      },
      PopoverAnchor: { asChild: "Use your own element as the anchor." },
      PopoverHeader: { children: "Title and description." },
      PopoverTitle: { children: "Title text." },
      PopoverDescription: { children: "Description text." },
    },
    stories: {
      Placement: 'Each `side` with `align="start"`, and a larger `sideOffset`.',
      WithForm: "Interactive content: dimension fields inside the popover, focused on open.",
      WithAnchor:
        "PopoverAnchor positions the panel against a whole row while the trigger is a small button.",
    },
    keyboard: {
      "Enter / Space": "On the trigger: opens or closes the popover.",
      Tab: "Moves into the popover content; leaving it does not close it.",
      Esc: "Closes the popover and returns focus to the trigger.",
    },
    aria: [
      'Content is a `role="dialog"`; give it a name with `aria-label` or a PopoverTitle referenced by `aria-labelledby`.',
      'The trigger gets `aria-expanded` and `aria-haspopup="dialog"`.',
      "Focus moves to the first focusable element on open and back to the trigger on close.",
    ],
    theming: [
      "Panel: `--popover`/`--popover-foreground`, `ring-1` of `--foreground` at 10%, `shadow-md`.",
      "Default width is `w-72`; change it with `className`.",
    ],
  },
  es: {
    summary:
      "Contenido enriquecido en un panel flotante anclado a un disparador. Se abre al pulsar, admite contenido interactivo y se cierra con Esc o al pulsar fuera.",
    whenToUse: [
      "Para contenido pequeño e interactivo ligado a un control: un selector de fecha o de color, ajustes rápidos.",
      "Para información extra que el usuario pide al pulsar.",
    ],
    whenNotToUse: [
      "Para una etiqueta corta al pasar el ratón o enfocar: usa Tooltip.",
      "Para una vista previa al pasar el ratón: usa HoverCard.",
      "Para una lista de acciones: usa DropdownMenu. Para una tarea que necesita toda la atención: usa Dialog.",
    ],
    anatomy: {
      Popover: "La raíz: guarda el estado abierto.",
      PopoverTrigger: "Abre y cierra el popover; recibe `aria-expanded` y `aria-controls`.",
      PopoverContent: 'Panel `role="dialog"` en un portal, colocado evitando colisiones.',
      PopoverAnchor: "Elemento opcional respecto al que colocarlo en lugar del disparador.",
      PopoverHeader: "Apila título y descripción con espaciado uniforme.",
      PopoverTitle: "Encabezado del panel.",
      PopoverDescription: "Texto de apoyo atenuado.",
    },
    props: {
      Popover: {
        open: "Estado abierto controlado.",
        defaultOpen: "Estado abierto inicial.",
        onOpenChange: "Se llama al abrir o cerrar.",
        modal: "Con `true`, atrapa el foco y deja la página inerte mientras está abierto.",
      },
      PopoverTrigger: { asChild: "Usa tu propio Button como disparador." },
      PopoverContent: {
        side: "Lado preferido; cambia de lado si no hay espacio.",
        align: "Alineación respecto al disparador.",
        sideOffset: "Separación del disparador en píxeles.",
        alignOffset: "Desplazamiento sobre el eje de alineación.",
        collisionPadding: "Distancia a los bordes del viewport que se respeta.",
      },
      PopoverAnchor: { asChild: "Usa tu propio elemento como ancla." },
      PopoverHeader: { children: "Título y descripción." },
      PopoverTitle: { children: "Texto del título." },
      PopoverDescription: { children: "Texto de la descripción." },
    },
    stories: {
      Placement: 'Cada `side` con `align="start"`, y un `sideOffset` mayor.',
      WithForm:
        "Contenido interactivo: campos de dimensiones dentro del popover, enfocados al abrir.",
      WithAnchor:
        "PopoverAnchor coloca el panel respecto a toda una fila mientras el disparador es un botón pequeño.",
    },
    keyboard: {
      "Enter / Space": "En el disparador: abre o cierra el popover.",
      Tab: "Entra en el contenido del popover; salir de él no lo cierra.",
      Esc: "Cierra el popover y devuelve el foco al disparador.",
    },
    aria: [
      'El contenido es un `role="dialog"`; dale nombre con `aria-label` o con un PopoverTitle referenciado por `aria-labelledby`.',
      'El disparador recibe `aria-expanded` y `aria-haspopup="dialog"`.',
      "El foco va al primer elemento enfocable al abrir y vuelve al disparador al cerrar.",
    ],
    theming: [
      "Panel: `--popover`/`--popover-foreground`, `ring-1` de `--foreground` al 10%, `shadow-md`.",
      "El ancho por defecto es `w-72`; cámbialo con `className`.",
    ],
  },
});
