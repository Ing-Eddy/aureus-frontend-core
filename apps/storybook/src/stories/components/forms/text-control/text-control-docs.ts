import { defineComponentDocs } from "@sb/docs/define-component-docs";

export const docs = defineComponentDocs({
  name: "Text Control",
  importPath: "@aureus-core/ui/components/text-control",
  exports: ["TextControl"],
  primitive: {
    label: "react-hook-form: Controller",
    href: "https://react-hook-form.com/docs/usecontroller/controller",
  },
  providers: [
    { name: "TooltipProvider", importPath: "@aureus-core/ui/shadcn/tooltip" },
    { name: "FormProvider", importPath: "react-hook-form" },
  ],
  api: {
    TextControl: {
      name: { type: "string", required: true },
      disabled: { type: "boolean", default: "false" },
      shouldUnregister: { type: "boolean", default: "false" },
      label: { type: "ReactNode" },
      required: { type: "boolean", default: "false" },
      loading: { type: "boolean", default: "false" },
      info: { type: "ReactNode" },
      helperText: { type: "ReactNode" },
      action: { type: "FieldActionProps" },
      className: { type: "string" },
      classNames: { type: "FieldClassNames" },
      loadingLabel: { type: "string", default: '"Loading"' },
      infoLabel: { type: "string", default: '"More information"' },
      onChange: { type: "(event: ChangeEvent<HTMLInputElement>) => void" },
      onBlur: { type: "(event: FocusEvent<HTMLInputElement>) => void" },
      ref: { type: "Ref<HTMLInputElement>" },
    },
  },
  stories: ["WithSchema", "HelperAndValidation", "DisabledVsLoading", "Parity"],
  keyboard: ["Tab", "Shift + Tab", "Enter", "Escape"],
  links: [
    { label: "Guide: Fields & controls", href: "?path=/docs/guides-fields-controls--docs" },
    { label: "Text Field", href: "?path=/docs/components-forms-text-field--docs" },
    {
      label: "react-hook-form: FormProvider",
      href: "https://react-hook-form.com/docs/formprovider",
    },
    {
      label: "react-hook-form: Controller",
      href: "https://react-hook-form.com/docs/usecontroller/controller",
    },
  ],
  en: {
    summary:
      "Text Field bound to a react-hook-form form. Render it inside a `FormProvider`, give it a `name`, and it reads and writes the value and shows the form's validation message as helper text. With the same props it looks exactly like Text Field.",
    whenToUse: [
      "In forms built with react-hook-form, with validation in a schema (zod, yup…) passed through a resolver.",
      "When the form, not the component, owns values, defaults and validation: the control only takes `name` and visual props.",
    ],
    whenNotToUse: [
      "Outside a `FormProvider`: it throws. Use Text Field and manage the value yourself.",
      "To add validation rules on the component: put them in the form's schema instead.",
    ],
    anatomy: {
      TextControl:
        "A react-hook-form `Controller` that takes `control` from the `FormProvider` context and renders a Text Field with the value, handlers, ref, disabled state and error mapped from the form.",
    },
    props: {
      TextControl: {
        name: "Path of the field in the form values, e.g. `username` or `address.city`. A development warning names it when it is not in the form's `defaultValues`.",
        disabled:
          "Disables the field through react-hook-form, which leaves its value out of the submitted data.",
        shouldUnregister: "Unregisters the field, and drops its value, when the control unmounts.",
        label: "Text above the input; its accessible name.",
        required:
          "Red asterisk and `aria-required`. It adds no validation rule: requiredness lives in the schema.",
        loading:
          "Disables the input visually and shows a spinner. The value stays in the form and is submitted.",
        info: "Content of the info tooltip, also part of the input's accessible description.",
        helperText:
          "Text below the input. While the field has a validation error, the error's message is shown in its place.",
        action: "The integrated button, as in Text Field.",
        className: "Extra classes for the root element.",
        classNames: "Extra classes per part, as in Text Field.",
        loadingLabel: "Accessible label of the spinner.",
        infoLabel: "Accessible name of the info button.",
        onChange: "Called after react-hook-form handles the change.",
        onBlur: "Called after react-hook-form handles the blur.",
        ref: "Reaches the `<input>`, merged with react-hook-form's own ref (so `setFocus` keeps working).",
      },
    },
    stories: {
      WithSchema:
        "A form validated by a zod schema. Submitting it empty shows each field's schema message in its helper slot and moves focus to the first invalid field.",
      HelperAndValidation:
        "The helper text gives way to the validation message while the value is invalid, and comes back once it is fixed.",
      DisabledVsLoading:
        "Both look unavailable, but only `disabled` removes the value from the submitted data: compare the payload.",
      Parity:
        "A Text Field and a Text Control with the same props, side by side: they render the same markup.",
    },
    keyboard: {
      Tab: "Moves focus to the info button, then to the input, then to the action.",
      "Shift + Tab": "Moves focus back in the same order.",
      Enter: "Inside a form, submits it from the input; activates a focused button.",
      Escape: "Closes the open tooltip.",
    },
    aria: [
      "Same accessibility contract as Text Field: label as accessible name, `aria-required`, helper and info in `aria-describedby`.",
      'A validation error sets `aria-invalid` and renders the message with `role="alert"`, so it is announced when it appears.',
      "react-hook-form's ref is attached to the input, so `shouldFocusError` moves focus to the first invalid control on submit.",
    ],
    theming: [
      "Identical to Text Field: the control renders a Text Field, so the same tokens, `data-*` attributes and `classNames` apply.",
    ],
  },
  es: {
    summary:
      "Text Field vinculado a un formulario de react-hook-form. Renderízalo dentro de un `FormProvider`, dale un `name`, y lee y escribe el valor y muestra el mensaje de validación del formulario como texto de ayuda. Con las mismas props se ve exactamente igual que Text Field.",
    whenToUse: [
      "En formularios hechos con react-hook-form, con la validación en un schema (zod, yup…) pasado mediante un resolver.",
      "Cuando el formulario, y no el componente, es dueño de valores, valores por defecto y validación: el control solo recibe `name` y props visuales.",
    ],
    whenNotToUse: [
      "Fuera de un `FormProvider`: lanza un error. Usa Text Field y gestiona tú el valor.",
      "Para añadir reglas de validación en el componente: ponlas en el schema del formulario.",
    ],
    anatomy: {
      TextControl:
        "Un `Controller` de react-hook-form que toma `control` del contexto del `FormProvider` y renderiza un Text Field con el valor, los handlers, el ref, el estado deshabilitado y el error del formulario.",
    },
    props: {
      TextControl: {
        name: "Ruta del campo en los valores del formulario, p. ej. `username` o `address.city`. Un aviso en desarrollo lo nombra si no está en los `defaultValues` del formulario.",
        disabled:
          "Deshabilita el campo a través de react-hook-form, que deja su valor fuera de los datos enviados.",
        shouldUnregister:
          "Desregistra el campo, y descarta su valor, cuando el control se desmonta.",
        label: "Texto sobre el input; su nombre accesible.",
        required:
          "Asterisco rojo y `aria-required`. No añade ninguna regla de validación: la obligatoriedad vive en el schema.",
        loading:
          "Deshabilita el input visualmente y muestra un spinner. El valor sigue en el formulario y se envía.",
        info: "Contenido del tooltip de información, también parte de la descripción accesible del input.",
        helperText:
          "Texto bajo el input. Mientras el campo tiene un error de validación, en su lugar se muestra el mensaje del error.",
        action: "El botón integrado, como en Text Field.",
        className: "Clases extra para la raíz.",
        classNames: "Clases extra por parte, como en Text Field.",
        loadingLabel: "Etiqueta accesible del spinner.",
        infoLabel: "Nombre accesible del botón de información.",
        onChange: "Se llama después de que react-hook-form procese el cambio.",
        onBlur: "Se llama después de que react-hook-form procese el blur.",
        ref: "Apunta al `<input>`, combinado con el ref propio de react-hook-form (así `setFocus` sigue funcionando).",
      },
    },
    stories: {
      WithSchema:
        "Un formulario validado con un schema de zod. Al enviarlo vacío, cada campo muestra el mensaje del schema en su texto de ayuda y el foco pasa al primer campo inválido.",
      HelperAndValidation:
        "El texto de ayuda deja su lugar al mensaje de validación mientras el valor es inválido, y vuelve cuando se corrige.",
      DisabledVsLoading:
        "Los dos parecen no disponibles, pero solo `disabled` quita el valor de los datos enviados: compara el payload.",
      Parity:
        "Un Text Field y un Text Control con las mismas props, lado a lado: renderizan el mismo markup.",
    },
    keyboard: {
      Tab: "Mueve el foco al botón de información, luego al input y luego a la acción.",
      "Shift + Tab": "Mueve el foco hacia atrás en el mismo orden.",
      Enter: "Dentro de un formulario, lo envía desde el input; activa un botón con foco.",
      Escape: "Cierra el tooltip abierto.",
    },
    aria: [
      "El mismo contrato de accesibilidad que Text Field: el label como nombre accesible, `aria-required`, ayuda e información en `aria-describedby`.",
      'Un error de validación pone `aria-invalid` y renderiza el mensaje con `role="alert"`, así se anuncia cuando aparece.',
      "El ref de react-hook-form se conecta al input, así `shouldFocusError` lleva el foco al primer control inválido al enviar.",
    ],
    theming: [
      "Idéntico a Text Field: el control renderiza un Text Field, así que se aplican los mismos tokens, atributos `data-*` y `classNames`.",
    ],
  },
});
