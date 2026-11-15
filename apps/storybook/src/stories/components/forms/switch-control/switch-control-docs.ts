import { defineComponentDocs } from "@sb/docs/define-component-docs";

export const docs = defineComponentDocs({
  name: "Switch Control",
  importPath: "@aureus-core/ui/components/switch-control",
  exports: ["SwitchControl"],
  primitive: {
    label: "react-hook-form: Controller",
    href: "https://react-hook-form.com/docs/usecontroller/controller",
  },
  providers: [
    { name: "TooltipProvider", importPath: "@aureus-core/ui/shadcn/tooltip" },
    { name: "FormProvider", importPath: "react-hook-form" },
  ],
  api: {
    SwitchControl: {
      name: { type: "string", required: true },
      disabled: { type: "boolean", default: "false" },
      shouldUnregister: { type: "boolean", default: "false" },
      onValueChange: { type: "(value: boolean | V) => void" },
      "…SwitchField props": { type: "see Switch Field" },
    },
  },
  stories: ["WithSchema", "CustomValues", "AsyncSave", "DisabledVsLoading", "Parity"],
  keyboard: ["Space / Enter", "Tab"],
  links: [
    { label: "Guide: Fields & controls", href: "?path=/docs/guides-fields-controls--docs" },
    { label: "Switch Field", href: "?path=/docs/components-forms-switch-field--docs" },
    {
      label: "react-hook-form: FormProvider",
      href: "https://react-hook-form.com/docs/formprovider",
    },
  ],
  en: {
    summary:
      "Switch Field bound to a react-hook-form form. Render it inside a `FormProvider` and give it a `name`: the form holds a `boolean`, or your custom values, so schemas such as `z.boolean()`, `z.literal(true)` or `z.enum([...])` work directly, and their message is shown as helper text. With `onBeforeChange`, only confirmed changes reach the form. It accepts every Switch Field prop, and with the same props it looks exactly the same.",
    whenToUse: [
      "For on/off settings in forms built with react-hook-form and a schema.",
      "With `onBeforeChange` when each change is saved on its own (auto-saving settings) and the form must only hold what was saved.",
    ],
    whenNotToUse: [
      "Outside a `FormProvider`: it throws. Use Switch Field.",
      "For a consent confirmed with the form's submit button: a Checkbox Control reads better.",
    ],
    anatomy: {
      SwitchControl:
        "A react-hook-form `Controller` that takes `control` from the `FormProvider` context and renders a Switch Field. A missing form value shows the switch off.",
    },
    props: {
      SwitchControl: {
        name: "Path of the field in the form values, e.g. `alerts`. A development warning names it when it is not in the form's `defaultValues`.",
        disabled:
          "Disables the field through react-hook-form, which leaves its value out of the submitted data.",
        shouldUnregister: "Unregisters the field, and drops its value, when the control unmounts.",
        onValueChange:
          "Called after react-hook-form stores the new value (confirmed changes only).",
        "…SwitchField props":
          "Every Switch Field prop (`switchLabel`, custom values, `onBeforeChange`, position, card, size, state labels, thumb icons, label, helper…), except `value`, `defaultValue`, `error` and `errorMessage`, which come from the form.",
      },
    },
    stories: {
      WithSchema:
        "A consent validated by `z.literal(true)` and a free `z.boolean()`. Submitting with the consent off shows the schema's message and focuses the switch.",
      CustomValues: 'A visibility stored as `"public"` or `"private"`, validated by `z.enum`.',
      AsyncSave:
        "Each change is saved first; the second switch fails to save, and the submitted payload keeps the old value.",
      DisabledVsLoading:
        "Both look unavailable, but only `disabled` removes the value from the submitted data: compare the payload.",
      Parity:
        "A Switch Field and a Switch Control with the same props, side by side: they render the same markup.",
    },
    keyboard: {
      "Space / Enter": "Toggles the switch; the value is stored in the form once applied.",
      Tab: "Moves on and marks the field as touched.",
    },
    aria: [
      "Same accessibility contract as Switch Field: a `switch` with `aria-checked` and one accessible name.",
      'A validation error sets `aria-invalid` and renders the message with `role="alert"`.',
      "react-hook-form's ref is attached to the switch, so `shouldFocusError` moves focus to it on submit.",
    ],
    theming: [
      "Identical to Switch Field: the control renders a Switch Field, so the same tokens, `data-*` attributes and `classNames` apply.",
    ],
  },
  es: {
    summary:
      "Switch Field vinculado a un formulario de react-hook-form. Renderízalo dentro de un `FormProvider` y dale un `name`: el formulario guarda un `boolean`, o tus valores personalizados, así schemas como `z.boolean()`, `z.literal(true)` o `z.enum([...])` funcionan directamente, y su mensaje se muestra como texto de ayuda. Con `onBeforeChange`, al formulario solo llegan los cambios confirmados. Acepta todas las props de Switch Field y, con las mismas props, se ve exactamente igual.",
    whenToUse: [
      "Para ajustes de encendido/apagado en formularios hechos con react-hook-form y un schema.",
      "Con `onBeforeChange` cuando cada cambio se guarda por sí solo (ajustes con guardado automático) y el formulario solo debe tener lo guardado.",
    ],
    whenNotToUse: [
      "Fuera de un `FormProvider`: lanza un error. Usa Switch Field.",
      "Para un consentimiento que se confirma con el botón de enviar: un Checkbox Control se entiende mejor.",
    ],
    anatomy: {
      SwitchControl:
        "Un `Controller` de react-hook-form que toma `control` del contexto del `FormProvider` y renderiza un Switch Field. Si falta el valor en el formulario, el switch aparece desactivado.",
    },
    props: {
      SwitchControl: {
        name: "Ruta del campo en los valores del formulario, p. ej. `alerts`. Un aviso en desarrollo lo nombra si no está en los `defaultValues` del formulario.",
        disabled:
          "Deshabilita el campo a través de react-hook-form, que deja su valor fuera de los datos enviados.",
        shouldUnregister:
          "Desregistra el campo, y descarta su valor, cuando el control se desmonta.",
        onValueChange:
          "Se llama después de que react-hook-form guarde el nuevo valor (solo cambios confirmados).",
        "…SwitchField props":
          "Todas las props de Switch Field (`switchLabel`, valores personalizados, `onBeforeChange`, posición, tarjeta, tamaño, textos de estado, iconos del thumb, label, ayuda…), salvo `value`, `defaultValue`, `error` y `errorMessage`, que vienen del formulario.",
      },
    },
    stories: {
      WithSchema:
        "Un consentimiento validado con `z.literal(true)` y un `z.boolean()` libre. Al enviar con el consentimiento desactivado aparece el mensaje del schema y el foco va al switch.",
      CustomValues:
        'Una visibilidad guardada como `"public"` o `"private"`, validada con `z.enum`.',
      AsyncSave:
        "Cada cambio se guarda primero; el segundo switch no se puede guardar, y el payload enviado conserva el valor anterior.",
      DisabledVsLoading:
        "Los dos parecen no disponibles, pero solo `disabled` quita el valor de los datos enviados: compara el payload.",
      Parity:
        "Un Switch Field y un Switch Control con las mismas props, lado a lado: renderizan el mismo markup.",
    },
    keyboard: {
      "Space / Enter": "Cambian el switch; el valor se guarda en el formulario cuando se aplica.",
      Tab: "Pasa al siguiente control y marca el campo como tocado.",
    },
    aria: [
      "El mismo contrato de accesibilidad que Switch Field: un `switch` con `aria-checked` y un solo nombre accesible.",
      'Un error de validación pone `aria-invalid` y renderiza el mensaje con `role="alert"`.',
      "El ref de react-hook-form se conecta al switch, así `shouldFocusError` lleva el foco a él al enviar.",
    ],
    theming: [
      "Idéntico a Switch Field: el control renderiza un Switch Field, así que se aplican los mismos tokens, atributos `data-*` y `classNames`.",
    ],
  },
});
