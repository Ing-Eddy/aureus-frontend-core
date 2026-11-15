import { defineComponentDocs } from "@sb/docs/define-component-docs";

export const docs = defineComponentDocs({
  name: "OTP Control",
  importPath: "@aureus-core/ui/components/otp-control",
  exports: ["OtpControl"],
  primitive: {
    label: "react-hook-form: Controller",
    href: "https://react-hook-form.com/docs/usecontroller/controller",
  },
  providers: [
    { name: "TooltipProvider", importPath: "@aureus-core/ui/shadcn/tooltip" },
    { name: "FormProvider", importPath: "react-hook-form" },
  ],
  api: {
    OtpControl: {
      name: { type: "string", required: true },
      disabled: { type: "boolean", default: "false" },
      shouldUnregister: { type: "boolean", default: "false" },
      onValueChange: { type: "(value: string) => void" },
      "…OtpField props": { type: "see OTP Field" },
    },
  },
  stories: ["WithSchema", "SubmitOnComplete", "DisabledVsLoading", "Parity"],
  keyboard: ["Characters", "Enter"],
  links: [
    { label: "Guide: Fields & controls", href: "?path=/docs/guides-fields-controls--docs" },
    { label: "OTP Field", href: "?path=/docs/components-forms-otp-field--docs" },
    {
      label: "react-hook-form: FormProvider",
      href: "https://react-hook-form.com/docs/formprovider",
    },
  ],
  en: {
    summary:
      "OTP Field bound to a react-hook-form form. Render it inside a `FormProvider` and give it a `name`: the form holds the code as a `string`, so schemas such as `z.string().length(6)` work directly, and their message is shown as helper text. With `submitOnComplete`, typing the last character submits the form. It accepts every OTP Field prop, and with the same props it looks exactly the same.",
    whenToUse: [
      "For verification steps built with react-hook-form and a schema: SMS codes, 2FA codes, PINs.",
      "With `submitOnComplete` when there is nothing else to fill in on the step.",
    ],
    whenNotToUse: [
      "Outside a `FormProvider`: it throws. Use OTP Field.",
      "For passwords: use Password Control.",
    ],
    anatomy: {
      OtpControl:
        'A react-hook-form `Controller` that takes `control` from the `FormProvider` context and renders an OTP Field. A missing form value behaves as `""`.',
    },
    props: {
      OtpControl: {
        name: "Path of the field in the form values, e.g. `code`. A development warning names it when it is not in the form's `defaultValues`.",
        disabled:
          "Disables the field through react-hook-form, which leaves its value out of the submitted data.",
        shouldUnregister: "Unregisters the field, and drops its value, when the control unmounts.",
        onValueChange: "Called after react-hook-form stores the new value.",
        "…OtpField props":
          "Every OTP Field prop (`length`, `charset`, groups, masking, `onComplete`, `submitOnComplete`, label, helper…), except `value`, `defaultValue`, `error` and `errorMessage`, which come from the form.",
      },
    },
    stories: {
      WithSchema:
        "A 6-digit code validated by `z.string().length(6)`. Submitting an incomplete code shows the schema's message and focuses the field.",
      SubmitOnComplete: "Typing the sixth digit submits the form; the payload appears below.",
      DisabledVsLoading:
        "Both look unavailable, but only `disabled` removes the value from the submitted data: compare the payload.",
      Parity:
        "An OTP Field and an OTP Control with the same props, side by side: they render the same markup.",
    },
    keyboard: {
      Characters: "Fill the boxes; the value is stored in the form as you type.",
      Enter: "Submits the form.",
    },
    aria: [
      'Same accessibility contract as OTP Field: one labelled input with `autocomplete="one-time-code"`; the boxes are hidden from assistive technology.',
      'A validation error sets `aria-invalid` and renders the message with `role="alert"`.',
      "react-hook-form's ref is attached to the input, so `shouldFocusError` moves focus to it on submit.",
    ],
    theming: [
      "Identical to OTP Field: the control renders an OTP Field, so the same tokens, `data-*` attributes and `classNames` apply.",
    ],
  },
  es: {
    summary:
      "OTP Field vinculado a un formulario de react-hook-form. Renderízalo dentro de un `FormProvider` y dale un `name`: el formulario guarda el código como un `string`, así schemas como `z.string().length(6)` funcionan directamente, y su mensaje se muestra como texto de ayuda. Con `submitOnComplete`, escribir el último carácter envía el formulario. Acepta todas las props de OTP Field y, con las mismas props, se ve exactamente igual.",
    whenToUse: [
      "Para pasos de verificación hechos con react-hook-form y un schema: códigos SMS, 2FA, PIN.",
      "Con `submitOnComplete` cuando no hay nada más que rellenar en el paso.",
    ],
    whenNotToUse: [
      "Fuera de un `FormProvider`: lanza un error. Usa OTP Field.",
      "Para contraseñas: usa Password Control.",
    ],
    anatomy: {
      OtpControl:
        'Un `Controller` de react-hook-form que toma `control` del contexto del `FormProvider` y renderiza un OTP Field. Si falta el valor en el formulario, se comporta como `""`.',
    },
    props: {
      OtpControl: {
        name: "Ruta del campo en los valores del formulario, p. ej. `code`. Un aviso en desarrollo lo nombra si no está en los `defaultValues` del formulario.",
        disabled:
          "Deshabilita el campo a través de react-hook-form, que deja su valor fuera de los datos enviados.",
        shouldUnregister:
          "Desregistra el campo, y descarta su valor, cuando el control se desmonta.",
        onValueChange: "Se llama después de que react-hook-form guarde el nuevo valor.",
        "…OtpField props":
          "Todas las props de OTP Field (`length`, `charset`, grupos, ocultar, `onComplete`, `submitOnComplete`, label, ayuda…), salvo `value`, `defaultValue`, `error` y `errorMessage`, que vienen del formulario.",
      },
    },
    stories: {
      WithSchema:
        "Un código de 6 dígitos validado con `z.string().length(6)`. Al enviar un código incompleto aparece el mensaje del schema y el foco va al campo.",
      SubmitOnComplete: "Escribir el sexto dígito envía el formulario; el payload aparece debajo.",
      DisabledVsLoading:
        "Los dos parecen no disponibles, pero solo `disabled` quita el valor de los datos enviados: compara el payload.",
      Parity:
        "Un OTP Field y un OTP Control con las mismas props, lado a lado: renderizan el mismo markup.",
    },
    keyboard: {
      Characters: "Llenan las casillas; el valor se guarda en el formulario mientras escribes.",
      Enter: "Envía el formulario.",
    },
    aria: [
      'El mismo contrato de accesibilidad que OTP Field: un input nombrado con `autocomplete="one-time-code"`; las casillas están ocultas para las tecnologías de asistencia.',
      'Un error de validación pone `aria-invalid` y renderiza el mensaje con `role="alert"`.',
      "El ref de react-hook-form se conecta al input, así `shouldFocusError` lleva el foco a él al enviar.",
    ],
    theming: [
      "Idéntico a OTP Field: el control renderiza un OTP Field, así que se aplican los mismos tokens, atributos `data-*` y `classNames`.",
    ],
  },
});
