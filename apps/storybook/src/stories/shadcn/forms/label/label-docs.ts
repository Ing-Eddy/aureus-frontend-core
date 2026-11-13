import { defineComponentDocs } from "@sb/docs/define-component-docs";

export const docs = defineComponentDocs({
  name: "Label",
  importPath: "@aureus-core/ui/shadcn/label",
  exports: ["Label"],
  primitive: {
    label: "Radix UI Label",
    href: "https://www.radix-ui.com/primitives/docs/components/label",
  },
  api: {
    Label: {
      htmlFor: { type: "string" },
      asChild: { type: "boolean", default: "false" },
      children: { type: "ReactNode", required: true },
    },
  },
  stories: ["WithInput", "WithCheckbox", "DisabledPeer"],
  keyboard: [],
  links: [
    { label: "shadcn/ui: Label", href: "https://ui.shadcn.com/docs/components/label" },
    { label: "Radix: Label", href: "https://www.radix-ui.com/primitives/docs/components/label" },
  ],
  en: {
    summary:
      "The visible name of a form control. Clicking it focuses or toggles the control it points to with `htmlFor`.",
    whenToUse: [
      "For every Input, Textarea, Select, Checkbox, Switch or Slider that has visible text naming it.",
      "Inside a Field, where FieldLabel builds on it.",
    ],
    whenNotToUse: [
      "For headings or general text: use a heading or paragraph.",
      "To name a group of controls: use a `<fieldset>` with `<legend>` (FieldSet and FieldLegend).",
    ],
    anatomy: {
      Label:
        'A `<label>` with `data-slot="label"`. It is a flex row, so an icon or a checkbox can sit next to the text.',
    },
    props: {
      Label: {
        htmlFor:
          "The `id` of the control it names. Required unless the control is nested inside the label.",
        asChild: "Renders its single child instead of a `<label>`, merging props into it.",
        children: "The label text, optionally with an icon or a nested control.",
      },
    },
    stories: {
      WithInput:
        "The basic pair: `htmlFor` matches the input `id`, so clicking the text focuses the field.",
      WithCheckbox: "A label next to a checkbox: clicking the text toggles it.",
      DisabledPeer:
        "When the control has the `peer` class and is disabled, the label dims and shows a not-allowed cursor.",
    },
    keyboard: {},
    aria: [
      "A native `<label>`: its text becomes the accessible name of the associated control.",
      "Radix prevents text selection on double click, so repeated clicks do not highlight the label.",
      "Do not put interactive elements other than the labelled control inside a label.",
    ],
    theming: [
      "Text: `text-sm font-medium` in the current foreground color.",
      'It reacts to `peer-disabled` and to a parent `group` with `data-disabled="true"`.',
    ],
  },
  es: {
    summary:
      "El nombre visible de un control de formulario. Al pulsarlo enfoca o activa el control al que apunta con `htmlFor`.",
    whenToUse: [
      "Para cada Input, Textarea, Select, Checkbox, Switch o Slider con un texto visible que lo nombra.",
      "Dentro de un Field, donde FieldLabel se construye sobre él.",
    ],
    whenNotToUse: [
      "Para títulos o texto general: usa un encabezado o un párrafo.",
      "Para nombrar un grupo de controles: usa un `<fieldset>` con `<legend>` (FieldSet y FieldLegend).",
    ],
    anatomy: {
      Label:
        'Un `<label>` con `data-slot="label"`. Es una fila flex, así que un icono o un checkbox pueden ir junto al texto.',
    },
    props: {
      Label: {
        htmlFor:
          "El `id` del control que nombra. Obligatorio salvo que el control esté dentro de la etiqueta.",
        asChild: "Renderiza su único hijo en lugar de un `<label>`, fusionando en él las props.",
        children: "El texto de la etiqueta, opcionalmente con un icono o un control anidado.",
      },
    },
    stories: {
      WithInput:
        "La pareja básica: `htmlFor` coincide con el `id` del input, así que pulsar el texto enfoca el campo.",
      WithCheckbox: "Una etiqueta junto a un checkbox: pulsar el texto lo marca o desmarca.",
      DisabledPeer:
        "Cuando el control tiene la clase `peer` y está deshabilitado, la etiqueta se atenúa y muestra un cursor de no permitido.",
    },
    keyboard: {},
    aria: [
      "Un `<label>` nativo: su texto se convierte en el nombre accesible del control asociado.",
      "Radix evita la selección de texto con doble clic, así que los clics repetidos no resaltan la etiqueta.",
      "No pongas dentro de una etiqueta elementos interactivos distintos del control que nombra.",
    ],
    theming: [
      "Texto: `text-sm font-medium` con el color de primer plano actual.",
      'Reacciona a `peer-disabled` y a un `group` padre con `data-disabled="true"`.',
    ],
  },
});
