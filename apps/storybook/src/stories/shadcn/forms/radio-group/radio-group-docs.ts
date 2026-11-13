import { defineComponentDocs } from "@sb/docs/define-component-docs";

export const docs = defineComponentDocs({
  name: "Radio Group",
  importPath: "@aureus-core/ui/shadcn/radio-group",
  exports: ["RadioGroup", "RadioGroupItem"],
  primitive: {
    label: "Radix UI Radio Group",
    href: "https://www.radix-ui.com/primitives/docs/components/radio-group",
  },
  api: {
    RadioGroup: {
      value: { type: "string" },
      defaultValue: { type: "string" },
      onValueChange: { type: "(value: string) => void" },
      orientation: { type: '"horizontal" | "vertical"' },
      loop: { type: "boolean", default: "true" },
      disabled: { type: "boolean", default: "false" },
      required: { type: "boolean", default: "false" },
      name: { type: "string" },
    },
    RadioGroupItem: {
      value: { type: "string", required: true },
      disabled: { type: "boolean", default: "false" },
      id: { type: "string" },
    },
  },
  stories: ["Controlled", "Horizontal", "DisabledItem", "Invalid", "InField"],
  keyboard: ["Tab", "↓ / →", "↑ / ←", "Space"],
  links: [
    { label: "shadcn/ui: Radio Group", href: "https://ui.shadcn.com/docs/components/radio-group" },
    {
      label: "Radix: Radio Group",
      href: "https://www.radix-ui.com/primitives/docs/components/radio-group",
    },
    { label: "WAI-ARIA APG: Radio Group", href: "https://www.w3.org/WAI/ARIA/apg/patterns/radio/" },
  ],
  en: {
    summary:
      "A set of options where exactly one can be selected. Arrow keys move the selection, and the whole group is a single tab stop.",
    whenToUse: [
      "For one choice among two to about six options that should all be visible.",
      "When the options need a short description each (use Field choice cards).",
    ],
    whenNotToUse: [
      "For many options: use Select, NativeSelect or Combobox.",
      "For several choices at once: use Checkbox.",
      "For an immediate on/off: use Switch; for a segmented toolbar: use ToggleGroup.",
    ],
    anatomy: {
      RadioGroup: 'The `role="radiogroup"` container. It holds the value and manages roving focus.',
      RadioGroupItem: 'One `<button role="radio">` option, with a dot indicator when selected.',
    },
    props: {
      RadioGroup: {
        value: "Controlled selected value.",
        defaultValue: "Initial value when uncontrolled.",
        onValueChange: "Called with the newly selected value.",
        orientation: "Sets `aria-orientation`; arrow keys work in both directions regardless.",
        loop: "Whether arrow keys wrap from the last option to the first.",
        disabled: "Disables every item.",
        required: "Requires a selection for native form validation.",
        name: "Form field name for the submitted value.",
      },
      RadioGroupItem: {
        value: "The value this option selects.",
        disabled: "Disables this option only; arrow keys skip it.",
        id: "Target for the option's `<Label htmlFor>`.",
      },
    },
    stories: {
      Controlled: "`value` and `onValueChange` owned by React state.",
      Horizontal: 'Options in a row with `orientation="horizontal"`.',
      DisabledItem: "A disabled option is shown but skipped by the arrow keys.",
      Invalid: "`aria-invalid` on the items of a required group with an error message.",
      InField: "A FieldSet with legend and description wrapping the group.",
    },
    keyboard: {
      Tab: "Moves focus into the group, onto the selected (or first) option.",
      "↓ / →": "Moves to and selects the next option.",
      "↑ / ←": "Moves to and selects the previous option.",
      Space: "Selects the focused option if it is not selected yet.",
    },
    aria: [
      'Container has `role="radiogroup"`; each item has `role="radio"` and `aria-checked`.',
      "Name the group with a FieldLegend in a FieldSet, or `aria-labelledby` / `aria-label` on RadioGroup.",
      "Each item needs its own Label (`htmlFor` = item `id`).",
    ],
    theming: [
      "Selected: `--primary` fill with a `--primary-foreground` dot. Unselected border: `--input`.",
      "The group is a CSS grid with `gap-2`; change the layout with `className` (e.g. `flex`).",
    ],
  },
  es: {
    summary:
      "Un conjunto de opciones donde solo se puede elegir una. Las flechas mueven la selección y todo el grupo es una sola parada de tabulación.",
    whenToUse: [
      "Para elegir una entre dos y unas seis opciones que deben verse todas.",
      "Cuando cada opción necesita una descripción corta (usa las tarjetas de opción de Field).",
    ],
    whenNotToUse: [
      "Para muchas opciones: usa Select, NativeSelect o Combobox.",
      "Para varias opciones a la vez: usa Checkbox.",
      "Para un encendido/apagado inmediato: usa Switch; para una barra segmentada: usa ToggleGroup.",
    ],
    anatomy: {
      RadioGroup:
        'El contenedor `role="radiogroup"`. Guarda el valor y gestiona el foco itinerante.',
      RadioGroupItem:
        'Una opción `<button role="radio">`, con un punto indicador cuando está seleccionada.',
    },
    props: {
      RadioGroup: {
        value: "Valor seleccionado controlado.",
        defaultValue: "Valor inicial cuando no está controlado.",
        onValueChange: "Se llama con el nuevo valor seleccionado.",
        orientation:
          "Define `aria-orientation`; las flechas funcionan en ambas direcciones igualmente.",
        loop: "Si las flechas vuelven de la última opción a la primera.",
        disabled: "Deshabilita todas las opciones.",
        required: "Exige una selección para la validación nativa.",
        name: "Nombre del campo para el valor enviado.",
      },
      RadioGroupItem: {
        value: "El valor que selecciona esta opción.",
        disabled: "Deshabilita solo esta opción; las flechas la saltan.",
        id: "Destino del `<Label htmlFor>` de la opción.",
      },
    },
    stories: {
      Controlled: "`value` y `onValueChange` gestionados por estado de React.",
      Horizontal: 'Opciones en fila con `orientation="horizontal"`.',
      DisabledItem: "Una opción deshabilitada se muestra pero las flechas la saltan.",
      Invalid: "`aria-invalid` en las opciones de un grupo obligatorio con mensaje de error.",
      InField: "Un FieldSet con leyenda y descripción alrededor del grupo.",
    },
    keyboard: {
      Tab: "Mueve el foco al grupo, a la opción seleccionada (o la primera).",
      "↓ / →": "Mueve a la opción siguiente y la selecciona.",
      "↑ / ←": "Mueve a la opción anterior y la selecciona.",
      Space: "Selecciona la opción enfocada si aún no lo está.",
    },
    aria: [
      'El contenedor tiene `role="radiogroup"`; cada opción tiene `role="radio"` y `aria-checked`.',
      "Nombra el grupo con un FieldLegend dentro de un FieldSet, o con `aria-labelledby` / `aria-label` en RadioGroup.",
      "Cada opción necesita su propio Label (`htmlFor` = `id` de la opción).",
    ],
    theming: [
      "Seleccionada: relleno `--primary` con punto `--primary-foreground`. Borde sin seleccionar: `--input`.",
      "El grupo es una rejilla CSS con `gap-2`; cambia la disposición con `className` (p. ej. `flex`).",
    ],
  },
});
