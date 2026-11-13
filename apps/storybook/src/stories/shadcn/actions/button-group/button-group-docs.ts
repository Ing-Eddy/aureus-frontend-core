import { defineComponentDocs } from "@sb/docs/define-component-docs";

export const docs = defineComponentDocs({
  name: "Button Group",
  importPath: "@aureus-core/ui/shadcn/button-group",
  exports: ["ButtonGroup", "ButtonGroupText", "ButtonGroupSeparator", "buttonGroupVariants"],
  api: {
    ButtonGroup: {
      orientation: { type: '"horizontal" | "vertical"', default: '"horizontal"' },
      "aria-label": { type: "string" },
    },
    ButtonGroupText: { asChild: { type: "boolean", default: "false" } },
    ButtonGroupSeparator: {
      orientation: { type: '"horizontal" | "vertical"', default: '"vertical"' },
    },
    buttonGroupVariants: { orientation: { type: '"horizontal" | "vertical"' } },
  },
  stories: ["Vertical", "WithSeparator", "WithInput", "SplitButton", "Nested"],
  keyboard: ["Tab"],
  links: [
    {
      label: "shadcn/ui: Button Group",
      href: "https://ui.shadcn.com/docs/components/button-group",
    },
  ],
  en: {
    summary:
      "Joins related buttons (and inputs or text) into one visual unit with shared borders: a toolbar segment, a split button, a pager.",
    whenToUse: [
      "For a few related actions that belong together: Previous/Next, Copy/Paste, a split “Save ▾” button.",
      "To attach a button to an input or a text label.",
    ],
    whenNotToUse: [
      "For a set of on/off options: use ToggleGroup, which manages pressed state and arrow keys.",
      "For a long list of actions: use DropdownMenu.",
    ],
    anatomy: {
      ButtonGroup: 'A `role="group"` that removes the inner borders and radii of its children.',
      ButtonGroupText: "A non-interactive segment with text or an icon (e.g. a unit or label).",
      ButtonGroupSeparator: "A thin divider between segments, useful between solid buttons.",
      buttonGroupVariants: "The class generator, to apply the group styles to another element.",
    },
    props: {
      ButtonGroup: {
        orientation: "`vertical` stacks the children and joins them top to bottom.",
        "aria-label": "Names the group for assistive technology (e.g. “Pagination”).",
      },
      ButtonGroupText: { asChild: "Renders the child (e.g. a `<label>`) with the segment styles." },
      ButtonGroupSeparator: { orientation: "Usually `vertical` in a horizontal group." },
      buttonGroupVariants: { orientation: "Same values as ButtonGroup." },
    },
    stories: {
      Vertical: '`orientation="vertical"` for stacked actions such as zoom in/out.',
      WithSeparator: "Solid secondary buttons separated by ButtonGroupSeparator.",
      WithInput: "An Input joined with a button and a text segment.",
      SplitButton: "A main action plus a DropdownMenu trigger for alternatives.",
      Nested: "Groups inside a group keep a gap between them: a toolbar of segments.",
    },
    keyboard: { Tab: "Each button in the group is its own tab stop." },
    aria: [
      'ButtonGroup has `role="group"`; give it an `aria-label` when its purpose is not obvious.',
      "Each child keeps its own semantics; icon-only buttons need `aria-label`.",
      "Unlike ToggleGroup, there is no roving focus: Tab visits every button.",
    ],
    theming: [
      "No tokens of its own: children keep their Button variant colors.",
      "Joined edges come from `rounded-*-none` and `border-*-0` utilities applied to the children.",
    ],
  },
  es: {
    summary:
      "Une botones relacionados (e inputs o texto) en una sola pieza visual con bordes compartidos: un segmento de barra de herramientas, un botón dividido, un paginador.",
    whenToUse: [
      "Para unas pocas acciones relacionadas: Anterior/Siguiente, Copiar/Pegar, un botón dividido “Guardar ▾”.",
      "Para pegar un botón a un input o a una etiqueta de texto.",
    ],
    whenNotToUse: [
      "Para un conjunto de opciones activar/desactivar: usa ToggleGroup, que gestiona el estado pulsado y las flechas.",
      "Para una lista larga de acciones: usa DropdownMenu.",
    ],
    anatomy: {
      ButtonGroup: 'Un `role="group"` que quita los bordes y radios interiores de sus hijos.',
      ButtonGroupText:
        "Un segmento no interactivo con texto o icono (p. ej. una unidad o etiqueta).",
      ButtonGroupSeparator: "Un divisor fino entre segmentos, útil entre botones sólidos.",
      buttonGroupVariants:
        "El generador de clases, para aplicar los estilos del grupo a otro elemento.",
    },
    props: {
      ButtonGroup: {
        orientation: "`vertical` apila los hijos y los une de arriba abajo.",
        "aria-label": "Nombra el grupo para las tecnologías de asistencia (p. ej. “Paginación”).",
      },
      ButtonGroupText: {
        asChild: "Renderiza el hijo (p. ej. un `<label>`) con los estilos del segmento.",
      },
      ButtonGroupSeparator: { orientation: "Normalmente `vertical` en un grupo horizontal." },
      buttonGroupVariants: { orientation: "Los mismos valores que ButtonGroup." },
    },
    stories: {
      Vertical: '`orientation="vertical"` para acciones apiladas como acercar/alejar.',
      WithSeparator: "Botones secundarios sólidos separados por ButtonGroupSeparator.",
      WithInput: "Un Input unido a un botón y a un segmento de texto.",
      SplitButton: "Una acción principal más un disparador de DropdownMenu para las alternativas.",
      Nested: "Grupos dentro de un grupo mantienen un espacio entre ellos: una barra de segmentos.",
    },
    keyboard: { Tab: "Cada botón del grupo es su propia parada de tabulación." },
    aria: [
      'ButtonGroup tiene `role="group"`; dale un `aria-label` cuando su propósito no sea evidente.',
      "Cada hijo conserva su semántica; los botones solo con icono necesitan `aria-label`.",
      "A diferencia de ToggleGroup, no hay foco itinerante: Tab visita cada botón.",
    ],
    theming: [
      "No tiene tokens propios: los hijos conservan los colores de su variante de Button.",
      "Los bordes unidos vienen de utilidades `rounded-*-none` y `border-*-0` aplicadas a los hijos.",
    ],
  },
});
