import { defineComponentDocs } from "@sb/docs/define-component-docs";

export const docs = defineComponentDocs({
  name: "Select",
  importPath: "@aureus-core/ui/shadcn/select",
  exports: [
    "Select",
    "SelectTrigger",
    "SelectValue",
    "SelectContent",
    "SelectGroup",
    "SelectLabel",
    "SelectItem",
    "SelectSeparator",
    "SelectScrollUpButton",
    "SelectScrollDownButton",
  ],
  primitive: {
    label: "Radix UI Select",
    href: "https://www.radix-ui.com/primitives/docs/components/select",
  },
  api: {
    Select: {
      value: { type: "string" },
      defaultValue: { type: "string" },
      onValueChange: { type: "(value: string) => void" },
      open: { type: "boolean" },
      onOpenChange: { type: "(open: boolean) => void" },
      disabled: { type: "boolean", default: "false" },
      required: { type: "boolean", default: "false" },
      name: { type: "string" },
    },
    SelectTrigger: {
      size: { type: '"sm" | "default"', default: '"default"' },
      "aria-invalid": { type: "boolean" },
    },
    SelectValue: { placeholder: { type: "ReactNode" } },
    SelectContent: {
      position: { type: '"item-aligned" | "popper"', default: '"item-aligned"' },
      side: { type: '"top" | "right" | "bottom" | "left"', default: '"bottom"' },
      align: { type: '"start" | "center" | "end"', default: '"center"' },
      sideOffset: { type: "number", default: "0" },
    },
    SelectGroup: {},
    SelectLabel: {},
    SelectItem: {
      value: { type: "string", required: true },
      disabled: { type: "boolean", default: "false" },
      textValue: { type: "string" },
    },
    SelectSeparator: {},
    SelectScrollUpButton: {},
    SelectScrollDownButton: {},
  },
  stories: [
    "GroupsAndSeparators",
    "DisabledItems",
    "Scrollable",
    "Popper",
    "Sizes",
    "Invalid",
    "Disabled",
  ],
  keyboard: ["Space / Enter / ↓", "↑ / ↓", "Home / End", "Type a letter", "Enter", "Esc"],
  links: [
    { label: "shadcn/ui: Select", href: "https://ui.shadcn.com/docs/components/select" },
    { label: "Radix: Select", href: "https://www.radix-ui.com/primitives/docs/components/select" },
    {
      label: "WAI-ARIA APG: Select-only combobox",
      href: "https://www.w3.org/WAI/ARIA/apg/patterns/combobox/examples/combobox-select-only/",
    },
  ],
  en: {
    summary:
      "A custom-styled dropdown to pick one value from a list. Unlike NativeSelect, its options can hold icons and rich text, and it looks the same on every platform.",
    whenToUse: [
      "For picking one option from about 5–15 values that need consistent styling or icons.",
      "With SelectGroup and SelectLabel to organise options under headings.",
    ],
    whenNotToUse: [
      "For long lists the user should search: use Combobox.",
      "On mobile-heavy forms where the OS picker is better: use NativeSelect.",
      "For a menu of actions: use DropdownMenu.",
    ],
    anatomy: {
      Select: "The root: holds the value and open state. Renders no element of its own.",
      SelectTrigger: 'The `<button role="combobox">` that shows the value and a chevron.',
      SelectValue:
        "Shows the selected item's text inside the trigger, or `placeholder` when empty.",
      SelectContent: "The popup listbox, rendered in a portal, with scroll buttons at both ends.",
      SelectGroup: "Groups items under a SelectLabel.",
      SelectLabel: "A non-selectable heading for a group.",
      SelectItem: 'A `role="option"`, with a check icon when selected.',
      SelectSeparator: "A line between groups.",
      SelectScrollUpButton:
        "Appears at the top of a long list; hovering scrolls up. Included by SelectContent.",
      SelectScrollDownButton:
        "Appears at the bottom of a long list; hovering scrolls down. Included by SelectContent.",
    },
    props: {
      Select: {
        value: "Controlled value.",
        defaultValue: "Initial value when uncontrolled.",
        onValueChange: "Called with the selected item's `value`.",
        open: "Controlled open state.",
        onOpenChange: "Called when the list opens or closes.",
        disabled: "Disables the trigger.",
        required: "Requires a value in native form validation.",
        name: "Form field name; a hidden `<select>` submits the value.",
      },
      SelectTrigger: {
        size: "`default` is 32px tall, `sm` is 28px.",
        "aria-invalid": "Shows the destructive border and ring.",
      },
      SelectValue: { placeholder: "Text shown, muted, while no value is selected." },
      SelectContent: {
        position:
          "`item-aligned` places the selected item over the trigger (macOS style); `popper` opens below it like a dropdown.",
        side: 'Preferred side with `position="popper"`.',
        align: 'Alignment against the trigger with `position="popper"`.',
        sideOffset: 'Distance from the trigger with `position="popper"`.',
      },
      SelectGroup: {},
      SelectLabel: {},
      SelectItem: {
        value: "Value passed to `onValueChange`. It must not be an empty string.",
        disabled: "Shows the item but prevents selecting it; the keyboard skips it.",
        textValue: "Text used for typeahead when the children are not plain text.",
      },
      SelectSeparator: {},
      SelectScrollUpButton: {},
      SelectScrollDownButton: {},
    },
    stories: {
      GroupsAndSeparators: "Items grouped under labels and divided by separators.",
      DisabledItems: "A disabled item stays visible but cannot be selected or focused.",
      Scrollable:
        "A long list: the content is capped to the available height and gets scroll buttons.",
      Popper: '`position="popper"` opens the list below the trigger, matching its width.',
      Sizes: "The `sm` and `default` trigger heights.",
      Invalid: "`aria-invalid` on the trigger with an error message.",
      Disabled: "A disabled Select cannot be opened.",
    },
    keyboard: {
      "Space / Enter / ↓": "On the trigger: opens the list.",
      "↑ / ↓": "Moves between items.",
      "Home / End": "Moves to the first or last item.",
      "Type a letter": "Typeahead: focuses the next item starting with the typed text.",
      Enter: "Selects the focused item and closes the list.",
      Esc: "Closes the list without changing the value; focus returns to the trigger.",
    },
    aria: [
      'Trigger: `role="combobox"` with `aria-expanded` and `aria-controls`; content: `role="listbox"` of `role="option"` items.',
      "Name the trigger with a `<Label htmlFor>` pointing at its `id`, or `aria-label`.",
      "While open, the rest of the page is hidden from assistive technology and focus is trapped in the list.",
    ],
    theming: [
      "Trigger: same tokens as Input. Popup: `--popover`/`--popover-foreground`; focused item: `--accent`/`--accent-foreground`.",
      'Target `[data-slot="select-item"]` or `[data-slot="select-content"]` for custom styles.',
    ],
  },
  es: {
    summary:
      "Un desplegable con estilos propios para elegir un valor de una lista. A diferencia de NativeSelect, sus opciones pueden tener iconos y texto enriquecido, y se ve igual en todas las plataformas.",
    whenToUse: [
      "Para elegir una opción entre unos 5–15 valores que necesitan estilos uniformes o iconos.",
      "Con SelectGroup y SelectLabel para organizar las opciones bajo encabezados.",
    ],
    whenNotToUse: [
      "Para listas largas donde el usuario debe buscar: usa Combobox.",
      "En formularios sobre todo para móvil, donde el selector del sistema es mejor: usa NativeSelect.",
      "Para un menú de acciones: usa DropdownMenu.",
    ],
    anatomy: {
      Select: "La raíz: guarda el valor y el estado abierto. No renderiza ningún elemento propio.",
      SelectTrigger: 'El `<button role="combobox">` que muestra el valor y una flecha.',
      SelectValue:
        "Muestra el texto del elemento elegido dentro del disparador, o `placeholder` si está vacío.",
      SelectContent:
        "El listbox emergente, renderizado en un portal, con botones de desplazamiento en ambos extremos.",
      SelectGroup: "Agrupa elementos bajo un SelectLabel.",
      SelectLabel: "Un encabezado no seleccionable para un grupo.",
      SelectItem: 'Un `role="option"`, con un icono de check cuando está elegido.',
      SelectSeparator: "Una línea entre grupos.",
      SelectScrollUpButton:
        "Aparece arriba en listas largas; al pasar el ratón desplaza hacia arriba. Lo incluye SelectContent.",
      SelectScrollDownButton:
        "Aparece abajo en listas largas; al pasar el ratón desplaza hacia abajo. Lo incluye SelectContent.",
    },
    props: {
      Select: {
        value: "Valor controlado.",
        defaultValue: "Valor inicial cuando no está controlado.",
        onValueChange: "Se llama con el `value` del elemento elegido.",
        open: "Estado abierto controlado.",
        onOpenChange: "Se llama al abrir o cerrar la lista.",
        disabled: "Deshabilita el disparador.",
        required: "Exige un valor en la validación nativa.",
        name: "Nombre del campo; un `<select>` oculto envía el valor.",
      },
      SelectTrigger: {
        size: "`default` mide 32px de alto, `sm` 28px.",
        "aria-invalid": "Muestra el borde y el anillo destructivos.",
      },
      SelectValue: { placeholder: "Texto atenuado que se muestra mientras no hay valor." },
      SelectContent: {
        position:
          "`item-aligned` coloca el elemento elegido sobre el disparador (estilo macOS); `popper` lo abre debajo como un desplegable.",
        side: 'Lado preferido con `position="popper"`.',
        align: 'Alineación respecto al disparador con `position="popper"`.',
        sideOffset: 'Distancia al disparador con `position="popper"`.',
      },
      SelectGroup: {},
      SelectLabel: {},
      SelectItem: {
        value: "Valor que recibe `onValueChange`. No puede ser una cadena vacía.",
        disabled: "Muestra el elemento pero impide elegirlo; el teclado lo salta.",
        textValue: "Texto para la búsqueda por tecleo cuando los hijos no son texto plano.",
      },
      SelectSeparator: {},
      SelectScrollUpButton: {},
      SelectScrollDownButton: {},
    },
    stories: {
      GroupsAndSeparators: "Elementos agrupados bajo etiquetas y divididos por separadores.",
      DisabledItems: "Un elemento deshabilitado sigue visible pero no se puede elegir ni enfocar.",
      Scrollable:
        "Una lista larga: el contenido se limita a la altura disponible y tiene botones de desplazamiento.",
      Popper: '`position="popper"` abre la lista debajo del disparador, con su mismo ancho.',
      Sizes: "Las alturas `sm` y `default` del disparador.",
      Invalid: "`aria-invalid` en el disparador con un mensaje de error.",
      Disabled: "Un Select deshabilitado no se puede abrir.",
    },
    keyboard: {
      "Space / Enter / ↓": "En el disparador: abre la lista.",
      "↑ / ↓": "Recorre los elementos.",
      "Home / End": "Va al primer o al último elemento.",
      "Type a letter":
        "Búsqueda por tecleo: enfoca el siguiente elemento que empieza por el texto.",
      Enter: "Elige el elemento enfocado y cierra la lista.",
      Esc: "Cierra la lista sin cambiar el valor; el foco vuelve al disparador.",
    },
    aria: [
      'Disparador: `role="combobox"` con `aria-expanded` y `aria-controls`; contenido: `role="listbox"` con elementos `role="option"`.',
      "Nombra el disparador con un `<Label htmlFor>` que apunte a su `id`, o con `aria-label`.",
      "Mientras está abierto, el resto de la página se oculta a las tecnologías de asistencia y el foco queda en la lista.",
    ],
    theming: [
      "Disparador: mismos tokens que Input. Emergente: `--popover`/`--popover-foreground`; elemento enfocado: `--accent`/`--accent-foreground`.",
      'Usa `[data-slot="select-item"]` o `[data-slot="select-content"]` para estilos propios.',
    ],
  },
});
