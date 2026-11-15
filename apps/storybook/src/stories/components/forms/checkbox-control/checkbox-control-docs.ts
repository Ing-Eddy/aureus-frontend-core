import { defineComponentDocs } from "@sb/docs/define-component-docs";

export const docs = defineComponentDocs({
  name: "Checkbox Control",
  importPath: "@aureus-core/ui/components/checkbox-control",
  exports: ["CheckboxControl"],
  primitive: {
    label: "react-hook-form: Controller",
    href: "https://react-hook-form.com/docs/usecontroller/controller",
  },
  providers: [
    { name: "TooltipProvider", importPath: "@aureus-core/ui/shadcn/tooltip" },
    { name: "FormProvider", importPath: "react-hook-form" },
  ],
  api: {
    CheckboxControl: {
      name: { type: "string", required: true },
      disabled: { type: "boolean", default: "false" },
      shouldUnregister: { type: "boolean", default: "false" },
      onValueChange: { type: "(value: boolean | V) => void" },
      "…CheckboxField props": { type: "see Checkbox Field" },
    },
  },
  stories: ["WithSchema", "CustomValues", "DisabledVsLoading", "Parity"],
  keyboard: ["Space", "Tab"],
  links: [
    { label: "Guide: Fields & controls", href: "?path=/docs/guides-fields-controls--docs" },
    { label: "Checkbox Field", href: "?path=/docs/components-forms-checkbox-field--docs" },
    {
      label: "react-hook-form: FormProvider",
      href: "https://react-hook-form.com/docs/formprovider",
    },
  ],
  en: {
    summary:
      'Checkbox Field bound to a react-hook-form form. Render it inside a `FormProvider` and give it a `name`: the form holds a `boolean`, or your custom values (`checkedValue`/`uncheckedValue`), so schemas such as `z.boolean()`, `z.literal(true)` or `z.enum(["S", "N"])` work directly, and their message is shown as helper text. It accepts every Checkbox Field prop, and with the same props it looks exactly the same.',
    whenToUse: [
      "For yes/no values in forms built with react-hook-form and a schema: accept terms, subscribe, mark as active.",
      "When the backend stores two values other than true/false: the form holds them directly.",
    ],
    whenNotToUse: [
      "Outside a `FormProvider`: it throws. Use Checkbox Field.",
      "To pick several values from a list: a checkbox group (planned) or a multiple Select Control.",
    ],
    anatomy: {
      CheckboxControl:
        "A react-hook-form `Controller` that takes `control` from the `FormProvider` context and renders a Checkbox Field. A missing form value shows the unchecked state.",
    },
    props: {
      CheckboxControl: {
        name: "Path of the field in the form values, e.g. `terms`. A development warning names it when it is not in the form's `defaultValues`.",
        disabled:
          "Disables the field through react-hook-form, which leaves its value out of the submitted data.",
        shouldUnregister: "Unregisters the field, and drops its value, when the control unmounts.",
        onValueChange: "Called after react-hook-form stores the new value.",
        "…CheckboxField props":
          "Every Checkbox Field prop (`checkboxLabel`, custom values, indeterminate, position, card, label, helper…), except `value`, `defaultValue`, `error` and `errorMessage`, which come from the form. Custom values stay both-or-neither.",
      },
    },
    stories: {
      WithSchema:
        "Terms validated by `z.literal(true)` and a free `z.boolean()`. Submitting without accepting shows the schema's message and focuses the box.",
      CustomValues: 'A box that stores `"S"` or `"N"`, validated by `z.enum(["S", "N"])`.',
      DisabledVsLoading:
        "Both look unavailable, but only `disabled` removes the value from the submitted data: compare the payload.",
      Parity:
        "A Checkbox Field and a Checkbox Control with the same props, side by side: they render the same markup.",
    },
    keyboard: {
      Space: "Toggles the box; the value is stored in the form immediately.",
      Tab: "Moves on and marks the field as touched.",
    },
    aria: [
      "Same accessibility contract as Checkbox Field: a `checkbox` with one accessible name, its description and state.",
      'A validation error sets `aria-invalid` and renders the message with `role="alert"`.',
      "react-hook-form's ref is attached to the box, so `shouldFocusError` moves focus to the first invalid control on submit.",
    ],
    theming: [
      "Identical to Checkbox Field: the control renders a Checkbox Field, so the same tokens, `data-*` attributes and `classNames` apply.",
    ],
  },
  es: {
    summary:
      'Checkbox Field vinculado a un formulario de react-hook-form. Renderízalo dentro de un `FormProvider` y dale un `name`: el formulario guarda un `boolean`, o tus valores personalizados (`checkedValue`/`uncheckedValue`), así schemas como `z.boolean()`, `z.literal(true)` o `z.enum(["S", "N"])` funcionan directamente, y su mensaje se muestra como texto de ayuda. Acepta todas las props de Checkbox Field y, con las mismas props, se ve exactamente igual.',
    whenToUse: [
      "Para valores sí/no en formularios hechos con react-hook-form y un schema: aceptar términos, suscribirse, marcar como activo.",
      "Cuando el backend guarda dos valores distintos de true/false: el formulario los guarda directamente.",
    ],
    whenNotToUse: [
      "Fuera de un `FormProvider`: lanza un error. Usa Checkbox Field.",
      "Para elegir varios valores de una lista: un grupo de checkboxes (previsto) o un Select Control múltiple.",
    ],
    anatomy: {
      CheckboxControl:
        "Un `Controller` de react-hook-form que toma `control` del contexto del `FormProvider` y renderiza un Checkbox Field. Si falta el valor en el formulario, se muestra desmarcado.",
    },
    props: {
      CheckboxControl: {
        name: "Ruta del campo en los valores del formulario, p. ej. `terms`. Un aviso en desarrollo lo nombra si no está en los `defaultValues` del formulario.",
        disabled:
          "Deshabilita el campo a través de react-hook-form, que deja su valor fuera de los datos enviados.",
        shouldUnregister:
          "Desregistra el campo, y descarta su valor, cuando el control se desmonta.",
        onValueChange: "Se llama después de que react-hook-form guarde el nuevo valor.",
        "…CheckboxField props":
          "Todas las props de Checkbox Field (`checkboxLabel`, valores personalizados, indeterminado, posición, tarjeta, label, ayuda…), salvo `value`, `defaultValue`, `error` y `errorMessage`, que vienen del formulario. Los valores personalizados siguen siendo los dos o ninguno.",
      },
    },
    stories: {
      WithSchema:
        "Términos validados con `z.literal(true)` y un `z.boolean()` libre. Al enviar sin aceptar aparece el mensaje del schema y el foco va a la casilla.",
      CustomValues: 'Una casilla que guarda `"S"` o `"N"`, validada con `z.enum(["S", "N"])`.',
      DisabledVsLoading:
        "Los dos parecen no disponibles, pero solo `disabled` quita el valor de los datos enviados: compara el payload.",
      Parity:
        "Un Checkbox Field y un Checkbox Control con las mismas props, lado a lado: renderizan el mismo markup.",
    },
    keyboard: {
      Space: "Cambia la casilla; el valor se guarda en el formulario al momento.",
      Tab: "Pasa al siguiente control y marca el campo como tocado.",
    },
    aria: [
      "El mismo contrato de accesibilidad que Checkbox Field: un `checkbox` con un solo nombre accesible, su descripción y su estado.",
      'Un error de validación pone `aria-invalid` y renderiza el mensaje con `role="alert"`.',
      "El ref de react-hook-form se conecta a la casilla, así `shouldFocusError` lleva el foco al primer control inválido al enviar.",
    ],
    theming: [
      "Idéntico a Checkbox Field: el control renderiza un Checkbox Field, así que se aplican los mismos tokens, atributos `data-*` y `classNames`.",
    ],
  },
});
