import { defineComponentDocs } from "@sb/docs/define-component-docs";

export const docs = defineComponentDocs({
  name: "Checkbox",
  importPath: "@aureus-core/ui/shadcn/checkbox",
  exports: ["Checkbox"],
  primitive: {
    label: "Radix UI Checkbox",
    href: "https://www.radix-ui.com/primitives/docs/components/checkbox",
  },
  api: {
    Checkbox: {
      checked: { type: 'boolean | "indeterminate"' },
      defaultChecked: { type: 'boolean | "indeterminate"' },
      onCheckedChange: { type: '(checked: boolean | "indeterminate") => void' },
      disabled: { type: "boolean", default: "false" },
      required: { type: "boolean", default: "false" },
      name: { type: "string" },
      value: { type: "string", default: '"on"' },
      "aria-invalid": { type: "boolean" },
    },
  },
  stories: ["Controlled", "Indeterminate", "Disabled", "Invalid", "GroupInField"],
  keyboard: ["Tab", "Space"],
  links: [
    { label: "shadcn/ui: Checkbox", href: "https://ui.shadcn.com/docs/components/checkbox" },
    {
      label: "Radix: Checkbox",
      href: "https://www.radix-ui.com/primitives/docs/components/checkbox",
    },
    { label: "WAI-ARIA APG: Checkbox", href: "https://www.w3.org/WAI/ARIA/apg/patterns/checkbox/" },
  ],
  en: {
    summary:
      "A box the user checks or unchecks. It supports a third, indeterminate state for “some of these” and submits a value inside native forms.",
    whenToUse: [
      "For an independent yes/no option that takes effect on submit (accept terms, remember me).",
      "For choosing several options from a list.",
      "With `indeterminate` on a parent checkbox when only some children are checked.",
    ],
    whenNotToUse: [
      "For a setting that applies immediately: use Switch.",
      "For exactly one choice from a list: use RadioGroup.",
    ],
    anatomy: {
      Checkbox:
        'A `<button role="checkbox">` with `data-slot="checkbox"`, plus a hidden native input when inside a form. Its indicator shows a check icon when checked.',
    },
    props: {
      Checkbox: {
        checked: 'Controlled state: `true`, `false` or `"indeterminate"`.',
        defaultChecked: "Initial state when uncontrolled.",
        onCheckedChange: "Called with the new state on every toggle.",
        disabled: "Prevents toggling and removes it from the tab order.",
        required: "Marks it required for native form validation.",
        name: "Form field name; the value is submitted only when checked.",
        value: "Submitted value when checked.",
        "aria-invalid": "Shows the destructive border and ring.",
      },
    },
    stories: {
      Controlled:
        "`checked` and `onCheckedChange` owned by React state, with the state shown as text.",
      Indeterminate:
        "A “select all” parent: indeterminate when some children are checked; clicking it checks them all.",
      Disabled: "Disabled checked and unchecked boxes. The label dims through the `peer` class.",
      Invalid:
        "`aria-invalid` on a required checkbox, with the error linked through `aria-describedby`.",
      GroupInField: "Several checkboxes in a FieldSet with a legend and description.",
    },
    keyboard: {
      Tab: "Moves focus to the checkbox.",
      Space: "Toggles it. In indeterminate state, Space checks it.",
    },
    aria: [
      'Role `checkbox` with `aria-checked` set to `true`, `false` or `"mixed"` (indeterminate).',
      "Name it with a `<Label htmlFor>` pointing at the checkbox `id`.",
      "Enter does not toggle a checkbox (per WAI-ARIA); Space does.",
    ],
    theming: [
      "Unchecked border: `--input`. Checked: `--primary` background with `--primary-foreground` check.",
      'Target `[data-slot="checkbox"][data-state="checked"]` for custom styles. The hit area extends beyond the box (`after:-inset-*`).',
    ],
  },
  es: {
    summary:
      "Una casilla que el usuario marca o desmarca. Admite un tercer estado indeterminado para “algunos de estos” y envía un valor dentro de formularios nativos.",
    whenToUse: [
      "Para una opción sí/no independiente que se aplica al enviar (aceptar términos, recordarme).",
      "Para elegir varias opciones de una lista.",
      "Con `indeterminate` en una casilla padre cuando solo algunas hijas están marcadas.",
    ],
    whenNotToUse: [
      "Para un ajuste que se aplica al momento: usa Switch.",
      "Para una sola opción de una lista: usa RadioGroup.",
    ],
    anatomy: {
      Checkbox:
        'Un `<button role="checkbox">` con `data-slot="checkbox"`, más un input nativo oculto dentro de un formulario. Su indicador muestra un icono de check al marcarlo.',
    },
    props: {
      Checkbox: {
        checked: 'Estado controlado: `true`, `false` o `"indeterminate"`.',
        defaultChecked: "Estado inicial cuando no está controlado.",
        onCheckedChange: "Se llama con el nuevo estado en cada cambio.",
        disabled: "Impide cambiarlo y lo saca del orden de tabulación.",
        required: "Lo marca como obligatorio para la validación nativa.",
        name: "Nombre del campo; el valor solo se envía si está marcado.",
        value: "Valor que se envía cuando está marcado.",
        "aria-invalid": "Muestra el borde y el anillo destructivos.",
      },
    },
    stories: {
      Controlled:
        "`checked` y `onCheckedChange` gestionados por estado de React, con el estado mostrado como texto.",
      Indeterminate:
        "Una casilla “seleccionar todo”: indeterminada cuando algunas hijas están marcadas; al pulsarla las marca todas.",
      Disabled:
        "Casillas deshabilitadas marcadas y sin marcar. La etiqueta se atenúa mediante la clase `peer`.",
      Invalid:
        "`aria-invalid` en una casilla obligatoria, con el error enlazado mediante `aria-describedby`.",
      GroupInField: "Varias casillas en un FieldSet con leyenda y descripción.",
    },
    keyboard: {
      Tab: "Mueve el foco a la casilla.",
      Space: "La marca o desmarca. En estado indeterminado, Space la marca.",
    },
    aria: [
      'Rol `checkbox` con `aria-checked` a `true`, `false` o `"mixed"` (indeterminado).',
      "Ponle nombre con un `<Label htmlFor>` que apunte al `id` de la casilla.",
      "Enter no cambia una casilla (según WAI-ARIA); Space sí.",
    ],
    theming: [
      "Borde sin marcar: `--input`. Marcada: fondo `--primary` con el check en `--primary-foreground`.",
      'Usa `[data-slot="checkbox"][data-state="checked"]` para estilos propios. El área pulsable va más allá de la casilla (`after:-inset-*`).',
    ],
  },
});
