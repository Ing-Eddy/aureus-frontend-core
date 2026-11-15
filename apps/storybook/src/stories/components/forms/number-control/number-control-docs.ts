import { defineComponentDocs } from "@sb/docs/define-component-docs";

export const docs = defineComponentDocs({
  name: "Number Control",
  importPath: "@aureus-core/ui/components/number-control",
  exports: ["NumberControl"],
  primitive: {
    label: "react-hook-form: Controller",
    href: "https://react-hook-form.com/docs/usecontroller/controller",
  },
  providers: [
    { name: "TooltipProvider", importPath: "@aureus-core/ui/shadcn/tooltip" },
    { name: "FormProvider", importPath: "react-hook-form" },
  ],
  api: {
    NumberControl: {
      name: { type: "string", required: true },
      disabled: { type: "boolean", default: "false" },
      shouldUnregister: { type: "boolean", default: "false" },
      onValueChange: { type: "(value: number | null) => void" },
      "…NumberField props": { type: "see Number Field" },
    },
  },
  stories: ["WithSchema", "DisabledVsLoading", "Parity"],
  keyboard: ["Arrow Up / Arrow Down", "Enter", "Escape"],
  links: [
    { label: "Guide: Fields & controls", href: "?path=/docs/guides-fields-controls--docs" },
    { label: "Number Field", href: "?path=/docs/components-forms-number-field--docs" },
    {
      label: "react-hook-form: FormProvider",
      href: "https://react-hook-form.com/docs/formprovider",
    },
  ],
  en: {
    summary:
      "Number Field bound to a react-hook-form form. Render it inside a `FormProvider` and give it a `name`: the form holds a `number | null` (never a string), so a schema such as `z.number().min(1)` works directly, and its message is shown as helper text. It accepts every Number Field prop, and with the same props it looks exactly the same.",
    whenToUse: [
      "For numeric values in forms built with react-hook-form and a schema: amounts, quantities, rates.",
      "When the backend expects numbers: the form value is already a number, with formatting only in the view.",
    ],
    whenNotToUse: [
      "Outside a `FormProvider`: it throws. Use Number Field.",
      "For digit strings that are not quantities (phone, ZIP code): use Text Control.",
    ],
    anatomy: {
      NumberControl:
        "A react-hook-form `Controller` that takes `control` from the `FormProvider` context and renders a Number Field, storing its `number | null` value in the form.",
    },
    props: {
      NumberControl: {
        name: "Path of the field in the form values, e.g. `amount`. A development warning names it when it is not in the form's `defaultValues`.",
        disabled:
          "Disables the field through react-hook-form, which leaves its value out of the submitted data.",
        shouldUnregister: "Unregisters the field, and drops its value, when the control unmounts.",
        onValueChange: "Called after react-hook-form stores the new value.",
        "…NumberField props":
          "Every Number Field prop (formatting, stepper, keyboard, shorthand, expressions, label, helper…), except `value`, `defaultValue`, `error` and `errorMessage`, which come from the form.",
      },
    },
    stories: {
      WithSchema:
        "An amount validated by `z.number().min(1).max(10000)`. Submitting 0 shows the schema's message; the submitted value is a number.",
      DisabledVsLoading:
        "Both look unavailable, but only `disabled` removes the value from the submitted data: compare the payload.",
      Parity:
        "A Number Field and a Number Control with the same props, side by side: they render the same markup.",
    },
    keyboard: {
      "Arrow Up / Arrow Down": "Steps the value, which is stored in the form immediately.",
      Enter: "Commits the text; if it was already committed, submits the form.",
      Escape: "Restores the last committed value in the form.",
    },
    aria: [
      "Same accessibility contract as Number Field: `spinbutton` with value, range and readable value text; step buttons outside the Tab order.",
      'A validation error sets `aria-invalid` and renders the message with `role="alert"`.',
      "react-hook-form's ref is attached to the input, so `shouldFocusError` moves focus to the first invalid control on submit.",
    ],
    theming: [
      "Identical to Number Field: the control renders a Number Field, so the same tokens, `data-*` attributes and `classNames` apply.",
    ],
  },
  es: {
    summary:
      "Number Field vinculado a un formulario de react-hook-form. Renderízalo dentro de un `FormProvider` y dale un `name`: el formulario guarda un `number | null` (nunca un texto), así un schema como `z.number().min(1)` funciona directamente, y su mensaje se muestra como texto de ayuda. Acepta todas las props de Number Field y, con las mismas props, se ve exactamente igual.",
    whenToUse: [
      "Para valores numéricos en formularios hechos con react-hook-form y un schema: importes, cantidades, tasas.",
      "Cuando el backend espera números: el valor del formulario ya es un número y el formato solo vive en la vista.",
    ],
    whenNotToUse: [
      "Fuera de un `FormProvider`: lanza un error. Usa Number Field.",
      "Para cadenas de dígitos que no son cantidades (teléfono, código postal): usa Text Control.",
    ],
    anatomy: {
      NumberControl:
        "Un `Controller` de react-hook-form que toma `control` del contexto del `FormProvider` y renderiza un Number Field, guardando su valor `number | null` en el formulario.",
    },
    props: {
      NumberControl: {
        name: "Ruta del campo en los valores del formulario, p. ej. `amount`. Un aviso en desarrollo lo nombra si no está en los `defaultValues` del formulario.",
        disabled:
          "Deshabilita el campo a través de react-hook-form, que deja su valor fuera de los datos enviados.",
        shouldUnregister:
          "Desregistra el campo, y descarta su valor, cuando el control se desmonta.",
        onValueChange: "Se llama después de que react-hook-form guarde el nuevo valor.",
        "…NumberField props":
          "Todas las props de Number Field (formato, botones, teclado, abreviaturas, expresiones, label, ayuda…), salvo `value`, `defaultValue`, `error` y `errorMessage`, que vienen del formulario.",
      },
    },
    stories: {
      WithSchema:
        "Un importe validado con `z.number().min(1).max(10000)`. Al enviar 0 aparece el mensaje del schema; el valor enviado es un número.",
      DisabledVsLoading:
        "Los dos parecen no disponibles, pero solo `disabled` quita el valor de los datos enviados: compara el payload.",
      Parity:
        "Un Number Field y un Number Control con las mismas props, lado a lado: renderizan el mismo markup.",
    },
    keyboard: {
      "Arrow Up / Arrow Down": "Cambia el valor, que se guarda en el formulario al momento.",
      Enter: "Confirma el texto; si ya estaba confirmado, envía el formulario.",
      Escape: "Restaura en el formulario el último valor confirmado.",
    },
    aria: [
      "El mismo contrato de accesibilidad que Number Field: `spinbutton` con valor, rango y texto legible del valor; botones de paso fuera del orden de Tab.",
      'Un error de validación pone `aria-invalid` y renderiza el mensaje con `role="alert"`.',
      "El ref de react-hook-form se conecta al input, así `shouldFocusError` lleva el foco al primer control inválido al enviar.",
    ],
    theming: [
      "Idéntico a Number Field: el control renderiza un Number Field, así que se aplican los mismos tokens, atributos `data-*` y `classNames`.",
    ],
  },
});
