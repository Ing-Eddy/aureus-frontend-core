import { defineComponentDocs } from "@sb/docs/define-component-docs";

const div = { className: { type: "string" } };

export const docs = defineComponentDocs({
  name: "Field",
  importPath: "@aureus-core/ui/shadcn/field",
  exports: [
    "Field",
    "FieldLabel",
    "FieldDescription",
    "FieldError",
    "FieldGroup",
    "FieldSet",
    "FieldLegend",
    "FieldSeparator",
    "FieldContent",
    "FieldTitle",
  ],
  api: {
    Field: {
      orientation: { type: '"vertical" | "horizontal" | "responsive"', default: '"vertical"' },
      "data-invalid": { type: "boolean" },
      "data-disabled": { type: "boolean" },
    },
    FieldLabel: { htmlFor: { type: "string" } },
    FieldDescription: { id: { type: "string" } },
    FieldError: {
      errors: { type: "Array<{ message?: string } | undefined>" },
      children: { type: "ReactNode" },
    },
    FieldGroup: div,
    FieldSet: { disabled: { type: "boolean", default: "false" } },
    FieldLegend: { variant: { type: '"legend" | "label"', default: '"legend"' } },
    FieldSeparator: { children: { type: "ReactNode" } },
    FieldContent: div,
    FieldTitle: div,
  },
  stories: ["WithError", "Horizontal", "FieldSetWithLegend", "ChoiceCards", "WithSeparator"],
  keyboard: [],
  links: [
    { label: "shadcn/ui: Field", href: "https://ui.shadcn.com/docs/components/field" },
    {
      label: "WAI: Labeling controls",
      href: "https://www.w3.org/WAI/tutorials/forms/labels/",
    },
  ],
  en: {
    summary:
      "Building blocks for accessible form layouts: a Field groups a control with its label, description and error, and FieldSet/FieldGroup arrange many fields. They are layout only and work with any form library.",
    whenToUse: [
      "Around every form control that needs a label, help text or a validation message.",
      "With FieldSet and FieldLegend for a group of related checkboxes, radios or switches.",
      'With `orientation="horizontal"` for settings rows where the control sits next to the label.',
    ],
    whenNotToUse: [
      "For a control whose label is its only content, such as a lone checkbox in a table: Label is enough.",
      "As a generic layout grid outside forms.",
    ],
    anatomy: {
      Field:
        'The `role="group"` wrapper of one control. `data-invalid` colors its label and text destructive.',
      FieldLabel:
        "A Label for the control. When it wraps a whole Field it becomes a selectable choice card.",
      FieldDescription:
        "Muted help text. Give it an `id` and reference it from the control's `aria-describedby`.",
      FieldError:
        '`role="alert"` text with the error. It renders `children`, or deduplicated `errors` as a list.',
      FieldGroup:
        "Vertical stack of fields with consistent spacing; also the container-query root for `responsive`.",
      FieldSet:
        "A `<fieldset>` that groups related fields; `disabled` disables every native control inside.",
      FieldLegend:
        'The `<legend>` naming a FieldSet. `variant="label"` makes it look like a label.',
      FieldSeparator: "A divider between groups, with optional centered text (“Or continue with”).",
      FieldContent:
        "Column that stacks a label and description next to a control in horizontal fields.",
      FieldTitle:
        "A label-styled title for content that is not a `<label>`, such as a choice card heading.",
    },
    props: {
      Field: {
        orientation:
          "`vertical` stacks, `horizontal` puts the control beside the label, `responsive` switches at the `@md` container width.",
        "data-invalid": "Marks the field as invalid, coloring label and text with `--destructive`.",
        "data-disabled": "Dims the label when the control is disabled.",
      },
      FieldLabel: { htmlFor: "The `id` of the control it labels." },
      FieldDescription: { id: "Target for the control's `aria-describedby`." },
      FieldError: {
        errors:
          "Validation errors, for example from React Hook Form or TanStack Form; duplicates are removed.",
        children: "Custom error content; takes precedence over `errors`.",
      },
      FieldGroup: { className: "Extra classes for the stack." },
      FieldSet: { disabled: "Disables every native control in the set." },
      FieldLegend: { variant: "`legend` is larger heading text; `label` matches Label." },
      FieldSeparator: { children: "Optional text centered on the line." },
      FieldContent: { className: "Extra classes for the column." },
      FieldTitle: { className: "Extra classes for the title." },
    },
    stories: {
      WithError:
        "An invalid field: `data-invalid` on Field, `aria-invalid` on the input, and FieldError linked with `aria-describedby`.",
      Horizontal: "Settings rows: the switch or checkbox sits next to a label and description.",
      FieldSetWithLegend: "A FieldSet named by its legend, holding a group of checkboxes.",
      ChoiceCards: "FieldLabel wrapping a Field turns each radio option into a selectable card.",
      WithSeparator: "FieldSeparator with text between two groups of fields.",
    },
    keyboard: {},
    aria: [
      'Field has `role="group"`; FieldSet is a native `<fieldset>`, announced with its legend.',
      "Field does not wire ids automatically: set `htmlFor`, `id` and `aria-describedby` yourself (see the stories).",
      'FieldError has `role="alert"`, so an error that appears is announced immediately.',
    ],
    theming: [
      "Description: `--muted-foreground`. Invalid text: `--destructive`. Choice cards: `--primary` tints when checked.",
      "Spacing comes from `gap-*` utilities on FieldGroup and Field; override them with `className`.",
    ],
  },
  es: {
    summary:
      "Piezas para formularios accesibles: un Field agrupa un control con su etiqueta, descripción y error, y FieldSet/FieldGroup ordenan muchos campos. Solo son maquetación y funcionan con cualquier librería de formularios.",
    whenToUse: [
      "Alrededor de cada control de formulario que necesite etiqueta, ayuda o mensaje de validación.",
      "Con FieldSet y FieldLegend para un grupo de checkboxes, radios o switches relacionados.",
      'Con `orientation="horizontal"` para filas de ajustes donde el control va junto a la etiqueta.',
    ],
    whenNotToUse: [
      "Para un control cuyo único contenido es la etiqueta, como un checkbox suelto en una tabla: basta con Label.",
      "Como rejilla de maquetación genérica fuera de formularios.",
    ],
    anatomy: {
      Field:
        'El contenedor `role="group"` de un control. `data-invalid` pinta su etiqueta y textos en color destructivo.',
      FieldLabel:
        "Un Label para el control. Si envuelve un Field entero, se convierte en una tarjeta de opción seleccionable.",
      FieldDescription:
        "Texto de ayuda atenuado. Dale un `id` y referencialo desde el `aria-describedby` del control.",
      FieldError:
        'Texto con `role="alert"` para el error. Muestra `children`, o los `errors` sin duplicados como lista.',
      FieldGroup:
        "Pila vertical de campos con espaciado uniforme; también es la raíz de la container query de `responsive`.",
      FieldSet:
        "Un `<fieldset>` que agrupa campos relacionados; `disabled` deshabilita todos los controles nativos de dentro.",
      FieldLegend:
        'El `<legend>` que nombra un FieldSet. `variant="label"` lo hace parecer una etiqueta.',
      FieldSeparator: "Un divisor entre grupos, con texto centrado opcional (“O continúa con”).",
      FieldContent:
        "Columna que apila etiqueta y descripción junto a un control en campos horizontales.",
      FieldTitle:
        "Un título con estilo de etiqueta para contenido que no es un `<label>`, como el encabezado de una tarjeta de opción.",
    },
    props: {
      Field: {
        orientation:
          "`vertical` apila, `horizontal` pone el control junto a la etiqueta, `responsive` cambia al ancho de contenedor `@md`.",
        "data-invalid":
          "Marca el campo como inválido y pinta etiqueta y textos con `--destructive`.",
        "data-disabled": "Atenúa la etiqueta cuando el control está deshabilitado.",
      },
      FieldLabel: { htmlFor: "El `id` del control que etiqueta." },
      FieldDescription: { id: "Destino del `aria-describedby` del control." },
      FieldError: {
        errors:
          "Errores de validación, por ejemplo de React Hook Form o TanStack Form; se eliminan los duplicados.",
        children: "Contenido de error propio; tiene prioridad sobre `errors`.",
      },
      FieldGroup: { className: "Clases extra para la pila." },
      FieldSet: { disabled: "Deshabilita todos los controles nativos del grupo." },
      FieldLegend: {
        variant: "`legend` es un texto de encabezado mayor; `label` coincide con Label.",
      },
      FieldSeparator: { children: "Texto opcional centrado sobre la línea." },
      FieldContent: { className: "Clases extra para la columna." },
      FieldTitle: { className: "Clases extra para el título." },
    },
    stories: {
      WithError:
        "Un campo inválido: `data-invalid` en Field, `aria-invalid` en el input y FieldError enlazado con `aria-describedby`.",
      Horizontal:
        "Filas de ajustes: el switch o checkbox va junto a una etiqueta y una descripción.",
      FieldSetWithLegend: "Un FieldSet nombrado por su leyenda, con un grupo de checkboxes.",
      ChoiceCards:
        "FieldLabel envolviendo un Field convierte cada opción de radio en una tarjeta seleccionable.",
      WithSeparator: "FieldSeparator con texto entre dos grupos de campos.",
    },
    keyboard: {},
    aria: [
      'Field tiene `role="group"`; FieldSet es un `<fieldset>` nativo que se anuncia con su leyenda.',
      "Field no conecta los ids solo: pon tú `htmlFor`, `id` y `aria-describedby` (mira las historias).",
      'FieldError tiene `role="alert"`, así que un error que aparece se anuncia de inmediato.',
    ],
    theming: [
      "Descripción: `--muted-foreground`. Texto inválido: `--destructive`. Tarjetas de opción: tintes de `--primary` al marcarlas.",
      "El espaciado viene de utilidades `gap-*` en FieldGroup y Field; cámbialo con `className`.",
    ],
  },
});
