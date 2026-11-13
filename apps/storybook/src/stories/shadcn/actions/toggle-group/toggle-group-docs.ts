import { defineComponentDocs } from "@sb/docs/define-component-docs";

export const docs = defineComponentDocs({
  name: "Toggle Group",
  importPath: "@aureus-core/ui/shadcn/toggle-group",
  exports: ["ToggleGroup", "ToggleGroupItem"],
  primitive: {
    label: "Radix UI Toggle Group",
    href: "https://www.radix-ui.com/primitives/docs/components/toggle-group",
  },
  api: {
    ToggleGroup: {
      type: { type: '"single" | "multiple"', required: true },
      value: { type: "string | string[]" },
      defaultValue: { type: "string | string[]" },
      onValueChange: { type: "(value: string | string[]) => void" },
      variant: { type: '"default" | "outline"', default: '"default"' },
      size: { type: '"default" | "sm" | "lg"', default: '"default"' },
      spacing: { type: "number", default: "2" },
      orientation: { type: '"horizontal" | "vertical"', default: '"horizontal"' },
      rovingFocus: { type: "boolean", default: "true" },
      disabled: { type: "boolean", default: "false" },
    },
    ToggleGroupItem: {
      value: { type: "string", required: true },
      disabled: { type: "boolean", default: "false" },
    },
  },
  stories: ["Multiple", "Outline", "Joined", "Vertical", "DisabledItem"],
  keyboard: ["Tab", "← / →", "↑ / ↓", "Home / End", "Space / Enter"],
  links: [
    {
      label: "shadcn/ui: Toggle Group",
      href: "https://ui.shadcn.com/docs/components/toggle-group",
    },
    {
      label: "Radix: Toggle Group",
      href: "https://www.radix-ui.com/primitives/docs/components/toggle-group",
    },
  ],
  en: {
    summary:
      'A set of toggles where one (`type="single"`) or several (`type="multiple"`) can be on. The group is a single tab stop and arrow keys move between items.',
    whenToUse: [
      "For a segmented control: text alignment, list/grid view, chart period.",
      "For a set of formatting options that can combine (bold + italic).",
    ],
    whenNotToUse: [
      "For choices inside a form submitted later: use RadioGroup or Checkbox.",
      "For unrelated actions side by side: use ButtonGroup.",
    ],
    anatomy: {
      ToggleGroup:
        '`role="group"` that holds the value and manages roving focus. Shares variant, size and spacing with its items.',
      ToggleGroupItem:
        'A toggle button. In single mode it behaves as a radio (`role="radio"`); in multiple mode it has `aria-pressed`.',
    },
    props: {
      ToggleGroup: {
        type: "`single`: at most one item on. `multiple`: any number.",
        value: "Controlled value: a string (single) or an array (multiple).",
        defaultValue: "Initial value when uncontrolled.",
        onValueChange:
          'Called with the new value. In single mode, clicking the active item gives `""`.',
        variant: "Applied to every item; `outline` adds borders.",
        size: "Applied to every item.",
        spacing: "Gap between items in spacing units; `0` joins them into one segmented control.",
        orientation: "Direction of the arrow-key navigation and the layout.",
        rovingFocus: "When `false`, every item is a tab stop and arrows do nothing.",
        disabled: "Disables every item.",
      },
      ToggleGroupItem: {
        value: "Value this item contributes to the group value.",
        disabled: "Disables this item; arrows skip it.",
      },
    },
    stories: {
      Multiple: '`type="multiple"`: bold, italic and underline can combine.',
      Outline: '`variant="outline"` with text items.',
      Joined: "`spacing={0}` joins the items into one segmented control.",
      Vertical: '`orientation="vertical"`: ↑ and ↓ move between items.',
      DisabledItem: "A disabled item is skipped by the arrow keys.",
    },
    keyboard: {
      Tab: "Moves focus into the group (to the active item, or the first).",
      "← / →": "Moves to the previous or next item (horizontal).",
      "↑ / ↓": "Moves to the previous or next item (vertical).",
      "Home / End": "Moves to the first or last item.",
      "Space / Enter": "Toggles the focused item.",
    },
    aria: [
      'Single mode: `role="radio"` items with `aria-checked` inside a group. Multiple mode: buttons with `aria-pressed`.',
      "Give the group an `aria-label` and icon-only items an `aria-label` each.",
      "One tab stop for the whole group; arrows move focus without changing the value.",
    ],
    theming: [
      "Same tokens as Toggle: `--muted` when on, `--input` outline.",
      "`spacing` sets the `--gap` custom property; with `0` the inner borders and radii are removed.",
    ],
  },
  es: {
    summary:
      'Un conjunto de toggles donde uno (`type="single"`) o varios (`type="multiple"`) pueden estar activos. El grupo es una sola parada de tabulación y las flechas se mueven entre elementos.',
    whenToUse: [
      "Para un control segmentado: alineación de texto, vista lista/cuadrícula, periodo de un gráfico.",
      "Para opciones de formato que se pueden combinar (negrita + cursiva).",
    ],
    whenNotToUse: [
      "Para opciones dentro de un formulario que se envía después: usa RadioGroup o Checkbox.",
      "Para acciones no relacionadas una junto a otra: usa ButtonGroup.",
    ],
    anatomy: {
      ToggleGroup:
        '`role="group"` que guarda el valor y gestiona el foco itinerante. Comparte variante, tamaño y espaciado con sus elementos.',
      ToggleGroupItem:
        'Un botón toggle. En modo single se comporta como radio (`role="radio"`); en modo multiple tiene `aria-pressed`.',
    },
    props: {
      ToggleGroup: {
        type: "`single`: como mucho un elemento activo. `multiple`: cualquier número.",
        value: "Valor controlado: una cadena (single) o un array (multiple).",
        defaultValue: "Valor inicial cuando no está controlado.",
        onValueChange:
          'Se llama con el nuevo valor. En modo single, pulsar el elemento activo da `""`.',
        variant: "Se aplica a todos los elementos; `outline` añade bordes.",
        size: "Se aplica a todos los elementos.",
        spacing:
          "Separación entre elementos en unidades de espaciado; `0` los une en un único control segmentado.",
        orientation: "Dirección de la navegación con flechas y de la disposición.",
        rovingFocus:
          "Con `false`, cada elemento es una parada de tabulación y las flechas no hacen nada.",
        disabled: "Deshabilita todos los elementos.",
      },
      ToggleGroupItem: {
        value: "Valor que aporta este elemento al valor del grupo.",
        disabled: "Deshabilita este elemento; las flechas lo saltan.",
      },
    },
    stories: {
      Multiple: '`type="multiple"`: negrita, cursiva y subrayado se pueden combinar.',
      Outline: '`variant="outline"` con elementos de texto.',
      Joined: "`spacing={0}` une los elementos en un único control segmentado.",
      Vertical: '`orientation="vertical"`: ↑ y ↓ se mueven entre elementos.',
      DisabledItem: "Las flechas saltan un elemento deshabilitado.",
    },
    keyboard: {
      Tab: "Mueve el foco al grupo (al elemento activo, o al primero).",
      "← / →": "Va al elemento anterior o siguiente (horizontal).",
      "↑ / ↓": "Va al elemento anterior o siguiente (vertical).",
      "Home / End": "Va al primer o al último elemento.",
      "Space / Enter": "Activa o desactiva el elemento enfocado.",
    },
    aria: [
      'Modo single: elementos `role="radio"` con `aria-checked` dentro de un grupo. Modo multiple: botones con `aria-pressed`.',
      "Dale al grupo un `aria-label`, y a cada elemento solo con icono su propio `aria-label`.",
      "Una sola parada de tabulación para todo el grupo; las flechas mueven el foco sin cambiar el valor.",
    ],
    theming: [
      "Los mismos tokens que Toggle: `--muted` cuando está activo, borde `--input`.",
      "`spacing` define la propiedad `--gap`; con `0` se quitan los bordes y radios interiores.",
    ],
  },
});
