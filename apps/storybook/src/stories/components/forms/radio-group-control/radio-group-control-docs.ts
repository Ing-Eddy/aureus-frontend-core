import { defineComponentDocs } from "@sb/docs/define-component-docs";

export const docs = defineComponentDocs({
  name: "Radio Group Control",
  importPath: "@aureus-core/ui/components/radio-group-control",
  exports: ["RadioGroupControl"],
  primitive: {
    label: "react-hook-form: Controller",
    href: "https://react-hook-form.com/docs/usecontroller/controller",
  },
  providers: [
    { name: "TooltipProvider", importPath: "@aureus-core/ui/shadcn/tooltip" },
    { name: "FormProvider", importPath: "react-hook-form" },
  ],
  api: {
    RadioGroupControl: {
      name: { type: "string", required: true },
      disabled: { type: "boolean", default: "false" },
      shouldUnregister: { type: "boolean", default: "false" },
      onValueChange: { type: "(value: string | null) => void" },
      "…RadioGroupField props": { type: "see Radio Group Field" },
    },
  },
  stories: ["WithSchema", "DisabledVsLoading", "Parity"],
  keyboard: ["Tab / Shift + Tab", "Arrow keys", "Space"],
  links: [
    { label: "Guide: Fields & controls", href: "?path=/docs/guides-fields-controls--docs" },
    {
      label: "Radio Group Field",
      href: "?path=/docs/components-forms-radio-group-field--docs",
    },
    {
      label: "react-hook-form: FormProvider",
      href: "https://react-hook-form.com/docs/formprovider",
    },
  ],
  en: {
    summary:
      "Radio Group Field bound to a react-hook-form form. Render it inside a `FormProvider` and give it a `name`: the form holds a `string | null` (or the other option's text), so schemas such as `z.string({ error })` or `z.enum([...])` work directly, and their message is shown as helper text. It accepts every Radio Group Field prop, and with the same props it looks exactly the same.",
    whenToUse: [
      "To choose exactly one value in forms built with react-hook-form and a schema: plan, shipping method, frequency.",
      "With `otherOption` when the list may not cover every answer: validate the text with `min(1)`.",
    ],
    whenNotToUse: [
      "Outside a `FormProvider`: it throws. Use Radio Group Field.",
      "For several values: use Checkbox Group Control.",
    ],
    anatomy: {
      RadioGroupControl:
        "A react-hook-form `Controller` that takes `control` from the `FormProvider` context and renders a Radio Group Field. A missing form value behaves as `null`.",
    },
    props: {
      RadioGroupControl: {
        name: "Path of the field in the form values, e.g. `plan`. A development warning names it when it is not in the form's `defaultValues`.",
        disabled:
          "Disables the field through react-hook-form, which leaves its value out of the submitted data.",
        shouldUnregister: "Unregisters the field, and drops its value, when the control unmounts.",
        onValueChange: "Called after react-hook-form stores the new value.",
        "…RadioGroupField props":
          "Every Radio Group Field prop (options, layout, cards, segmented, other option, deselectable, label, helper…), except `value`, `defaultValue`, `error` and `errorMessage`, which come from the form.",
      },
    },
    stories: {
      WithSchema:
        "A required plan (`z.string({ error })`) and a source with an other option validated by `min(1)`. Submitting empty shows each message and focuses the first enabled radio.",
      DisabledVsLoading:
        "Both look unavailable, but only `disabled` removes the value from the submitted data: compare the payload.",
      Parity:
        "A Radio Group Field and a Radio Group Control with the same props, side by side: they render the same markup.",
    },
    keyboard: {
      "Tab / Shift + Tab":
        "Enters the group on the checked radio and leaves it; leaving marks the field as touched.",
      "Arrow keys": "Move to the next or previous enabled radio and store it in the form.",
      Space: "Checks the focused radio.",
    },
    aria: [
      "Same accessibility contract as Radio Group Field: a `radiogroup` named by the label, a `radio` per option.",
      'A validation error sets `aria-invalid` on the radiogroup and renders the message with `role="alert"`.',
      "On a failed submit, `shouldFocusError` moves focus to the checked radio, or to the first enabled one.",
    ],
    theming: [
      "Identical to Radio Group Field: the control renders a Radio Group Field, so the same tokens, `data-*` attributes and `classNames` apply.",
    ],
  },
  es: {
    summary:
      'Radio Group Field vinculado a un formulario de react-hook-form. Renderízalo dentro de un `FormProvider` y dale un `name`: el formulario guarda un `string | null` (o el texto de "Otro"), así schemas como `z.string({ error })` o `z.enum([...])` funcionan directamente, y su mensaje se muestra como texto de ayuda. Acepta todas las props de Radio Group Field y, con las mismas props, se ve exactamente igual.',
    whenToUse: [
      "Para elegir exactamente un valor en formularios hechos con react-hook-form y un schema: plan, método de envío, frecuencia.",
      "Con `otherOption` cuando la lista puede no cubrir todas las respuestas: valida el texto con `min(1)`.",
    ],
    whenNotToUse: [
      "Fuera de un `FormProvider`: lanza un error. Usa Radio Group Field.",
      "Para varios valores: usa Checkbox Group Control.",
    ],
    anatomy: {
      RadioGroupControl:
        "Un `Controller` de react-hook-form que toma `control` del contexto del `FormProvider` y renderiza un Radio Group Field. Si falta el valor en el formulario, se comporta como `null`.",
    },
    props: {
      RadioGroupControl: {
        name: "Ruta del campo en los valores del formulario, p. ej. `plan`. Un aviso en desarrollo lo nombra si no está en los `defaultValues` del formulario.",
        disabled:
          "Deshabilita el campo a través de react-hook-form, que deja su valor fuera de los datos enviados.",
        shouldUnregister:
          "Desregistra el campo, y descarta su valor, cuando el control se desmonta.",
        onValueChange: "Se llama después de que react-hook-form guarde el nuevo valor.",
        "…RadioGroupField props":
          'Todas las props de Radio Group Field (opciones, disposición, tarjetas, segmentado, opción "Otro", desmarcar, label, ayuda…), salvo `value`, `defaultValue`, `error` y `errorMessage`, que vienen del formulario.',
      },
    },
    stories: {
      WithSchema:
        'Un plan obligatorio (`z.string({ error })`) y un origen con opción "Otro" validado con `min(1)`. Al enviar vacío aparece cada mensaje y el foco va al primer radio habilitado.',
      DisabledVsLoading:
        "Los dos parecen no disponibles, pero solo `disabled` quita el valor de los datos enviados: compara el payload.",
      Parity:
        "Un Radio Group Field y un Radio Group Control con las mismas props, lado a lado: renderizan el mismo markup.",
    },
    keyboard: {
      "Tab / Shift + Tab":
        "Entra en el grupo por el radio marcado y sale de él; al salir el campo queda tocado.",
      "Arrow keys": "Pasan al radio habilitado siguiente o anterior y lo guardan en el formulario.",
      Space: "Marca el radio enfocado.",
    },
    aria: [
      "El mismo contrato de accesibilidad que Radio Group Field: un `radiogroup` nombrado por el label y un `radio` por opción.",
      'Un error de validación pone `aria-invalid` en el radiogroup y renderiza el mensaje con `role="alert"`.',
      "Al fallar el envío, `shouldFocusError` lleva el foco al radio marcado o al primero habilitado.",
    ],
    theming: [
      "Idéntico a Radio Group Field: el control renderiza un Radio Group Field, así que se aplican los mismos tokens, atributos `data-*` y `classNames`.",
    ],
  },
});
