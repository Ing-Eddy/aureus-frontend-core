import { defineComponentDocs } from "@sb/docs/define-component-docs";

export const docs = defineComponentDocs({
  name: "Password Control",
  importPath: "@aureus-core/ui/components/password-control",
  exports: ["PasswordControl"],
  primitive: {
    label: "react-hook-form: Controller",
    href: "https://react-hook-form.com/docs/usecontroller/controller",
  },
  providers: [
    { name: "TooltipProvider", importPath: "@aureus-core/ui/shadcn/tooltip" },
    { name: "FormProvider", importPath: "react-hook-form" },
  ],
  api: {
    PasswordControl: {
      name: { type: "string", required: true },
      disabled: { type: "boolean", default: "false" },
      shouldUnregister: { type: "boolean", default: "false" },
      label: { type: "ReactNode" },
      required: { type: "boolean", default: "false" },
      loading: { type: "boolean", default: "false" },
      info: { type: "ReactNode" },
      helperText: { type: "ReactNode" },
      visible: { type: "boolean" },
      defaultVisible: { type: "boolean", default: "false" },
      onVisibleChange: { type: "(visible: boolean) => void" },
      showPasswordLabel: { type: "string", required: true },
      hidePasswordLabel: { type: "string", required: true },
      autoComplete: { type: "string", default: '"current-password"' },
      className: { type: "string" },
      classNames: { type: "FieldClassNames" },
      onChange: { type: "(event: ChangeEvent<HTMLInputElement>) => void" },
      onBlur: { type: "(event: FocusEvent<HTMLInputElement>) => void" },
      loadingLabel: { type: "string" },
      infoLabel: { type: "string" },
      ref: { type: "Ref<HTMLInputElement>" },
    },
  },
  stories: ["WithSchema", "DisabledVsLoading", "HidesOnSubmit", "Parity"],
  keyboard: ["Tab", "Shift + Tab", "Enter", "Space"],
  links: [
    { label: "Guide: Fields & controls", href: "?path=/docs/guides-fields-controls--docs" },
    { label: "Password Field", href: "?path=/docs/components-forms-password-field--docs" },
    {
      label: "react-hook-form: FormProvider",
      href: "https://react-hook-form.com/docs/formprovider",
    },
  ],
  en: {
    summary:
      "Password Field bound to a react-hook-form form. Render it inside a `FormProvider` and give it a `name`: it reads and writes the value and shows the form's validation message as helper text. With the same props it looks exactly like Password Field, show/hide toggle included.",
    whenToUse: [
      "In sign-in, sign-up and change-password forms built with react-hook-form and a schema.",
      "For password confirmation: put the match rule in the schema (for example a zod `refine` on the confirmation path) and the message appears on that control.",
    ],
    whenNotToUse: [
      "Outside a `FormProvider`: it throws. Use Password Field.",
      "To add password rules on the component: they belong to the form's schema.",
    ],
    anatomy: {
      PasswordControl:
        "A react-hook-form `Controller` that takes `control` from the `FormProvider` context and renders a Password Field with the value, handlers, ref, disabled state and error mapped from the form.",
    },
    props: {
      PasswordControl: {
        name: "Path of the field in the form values, e.g. `password`. A development warning names it when it is not in the form's `defaultValues`.",
        disabled:
          "Disables the field through react-hook-form, which leaves its value out of the submitted data.",
        shouldUnregister: "Unregisters the field, and drops its value, when the control unmounts.",
        label: "Text above the input; its accessible name.",
        required:
          "Red asterisk and `aria-required`. It adds no validation rule: requiredness lives in the schema.",
        loading:
          "Disables the input and the toggle and shows a spinner. The value stays in the form and is submitted.",
        info: "Content of the info tooltip, also part of the input's accessible description.",
        helperText:
          "Text below the input. While the field has a validation error, the error's message is shown in its place.",
        visible: "Controlled visibility, as in Password Field.",
        defaultVisible: "Initial visibility when uncontrolled. Hidden by default.",
        onVisibleChange:
          "Called when the toggle is pressed, and with `false` when the form is submitted.",
        showPasswordLabel:
          'Accessible name of the toggle while the password is hidden, such as "Show password" in your language. Always required: the toggle is always shown.',
        hidePasswordLabel:
          'Accessible name of the toggle while the password is shown, such as "Hide password" in your language. Always required.',
        autoComplete:
          "`current-password` by default; use `new-password` for sign-up and confirmation fields.",
        className: "Extra classes for the root element.",
        classNames: "Extra classes per part, as in Password Field.",
        onChange: "Called after react-hook-form handles the change.",
        onBlur: "Called after react-hook-form handles the blur.",
        loadingLabel:
          "Accessible name of the loading spinner, in your language. Required with `loading`; there is no default.",
        infoLabel:
          "Accessible name of the info button, in your language. Required with `info`; there is no default.",
        ref: "Reaches the `<input>`, merged with react-hook-form's own ref (so `setFocus` keeps working).",
      },
    },
    stories: {
      WithSchema:
        "A password and its confirmation validated by a zod schema. Submitting two different values shows the mismatch message on the confirmation, and focus moves to the first invalid field.",
      DisabledVsLoading:
        "A loading field keeps its value in the submitted data, and a disabled field is left out: the loading confirmation is sent and the disabled old password is not.",
      HidesOnSubmit:
        "Show the password and submit: the value is sent, and the field is a password field again.",
      Parity:
        "A Password Field and a Password Control with the same props, side by side: they render the same markup.",
    },
    keyboard: {
      Tab: "Moves focus to the input, then to the toggle (and to the info button first when there is one).",
      "Shift + Tab": "Moves focus back in the same order.",
      Enter: "Inside the input, submits the form; on the toggle, shows or hides the password.",
      Space: "On the toggle, shows or hides the password.",
    },
    aria: [
      "Same accessibility contract as Password Field: toggle with `aria-pressed` and `aria-controls`, label as accessible name, `aria-required`, helper and info in `aria-describedby`.",
      'A validation error sets `aria-invalid` and renders the message with `role="alert"`, so it is announced when it appears.',
      "react-hook-form's ref is attached to the input, so `shouldFocusError` moves focus to the first invalid control on submit.",
    ],
    theming: [
      "Identical to Password Field: the control renders a Password Field, so the same tokens, `data-*` attributes and `classNames` apply.",
    ],
  },
  es: {
    summary:
      "Password Field vinculado a un formulario de react-hook-form. Renderízalo dentro de un `FormProvider` y dale un `name`: lee y escribe el valor y muestra el mensaje de validación del formulario como texto de ayuda. Con las mismas props se ve exactamente igual que Password Field, botón de mostrar/ocultar incluido.",
    whenToUse: [
      "En formularios de acceso, registro y cambio de contraseña hechos con react-hook-form y un schema.",
      "Para confirmar la contraseña: pon la regla de coincidencia en el schema (por ejemplo un `refine` de zod sobre la ruta de la confirmación) y el mensaje aparece en ese control.",
    ],
    whenNotToUse: [
      "Fuera de un `FormProvider`: lanza un error. Usa Password Field.",
      "Para añadir reglas de contraseña en el componente: pertenecen al schema del formulario.",
    ],
    anatomy: {
      PasswordControl:
        "Un `Controller` de react-hook-form que toma `control` del contexto del `FormProvider` y renderiza un Password Field con el valor, los handlers, el ref, el estado deshabilitado y el error del formulario.",
    },
    props: {
      PasswordControl: {
        name: "Ruta del campo en los valores del formulario, p. ej. `password`. Un aviso en desarrollo lo nombra si no está en los `defaultValues` del formulario.",
        disabled:
          "Deshabilita el campo a través de react-hook-form, que deja su valor fuera de los datos enviados.",
        shouldUnregister:
          "Desregistra el campo, y descarta su valor, cuando el control se desmonta.",
        label: "Texto sobre el input; su nombre accesible.",
        required:
          "Asterisco rojo y `aria-required`. No añade ninguna regla de validación: la obligatoriedad vive en el schema.",
        loading:
          "Deshabilita el input y el botón y muestra un spinner. El valor sigue en el formulario y se envía.",
        info: "Contenido del tooltip de información, también parte de la descripción accesible del input.",
        helperText:
          "Texto bajo el input. Mientras el campo tiene un error de validación, en su lugar se muestra el mensaje del error.",
        visible: "Visibilidad controlada, como en Password Field.",
        defaultVisible: "Visibilidad inicial en modo no controlado. Oculta por defecto.",
        onVisibleChange:
          "Se llama al pulsar el botón, y con `false` cuando se envía el formulario.",
        showPasswordLabel:
          'Nombre accesible del botón mientras la contraseña está oculta, como "Mostrar contraseña". Siempre obligatorio: el botón siempre se muestra.',
        hidePasswordLabel:
          'Nombre accesible del botón mientras la contraseña se muestra, como "Ocultar contraseña". Siempre obligatorio.',
        autoComplete:
          "`current-password` por defecto; usa `new-password` en campos de registro y de confirmación.",
        className: "Clases extra para la raíz.",
        classNames: "Clases extra por parte, como en Password Field.",
        onChange: "Se llama después de que react-hook-form procese el cambio.",
        onBlur: "Se llama después de que react-hook-form procese el blur.",
        loadingLabel:
          "Nombre accesible del spinner de carga, en tu idioma. Obligatorio con `loading`; no hay valor por defecto.",
        infoLabel:
          "Nombre accesible del botón de información, en tu idioma. Obligatorio con `info`; no hay valor por defecto.",
        ref: "Apunta al `<input>`, combinado con el ref propio de react-hook-form (así `setFocus` sigue funcionando).",
      },
    },
    stories: {
      WithSchema:
        "Una contraseña y su confirmación validadas con un schema de zod. Al enviar dos valores distintos, la confirmación muestra el mensaje de que no coinciden y el foco pasa al primer campo inválido.",
      DisabledVsLoading:
        "Un campo en carga conserva su valor en los datos enviados y uno deshabilitado se queda fuera: la confirmación en carga se envía y la contraseña antigua deshabilitada no.",
      HidesOnSubmit:
        "Muestra la contraseña y envía: el valor se envía y el campo vuelve a ser de contraseña.",
      Parity:
        "Un Password Field y un Password Control con las mismas props, lado a lado: renderizan el mismo markup.",
    },
    keyboard: {
      Tab: "Mueve el foco al input y luego al botón (y antes al botón de información si lo hay).",
      "Shift + Tab": "Mueve el foco hacia atrás en el mismo orden.",
      Enter: "En el input, envía el formulario; en el botón, muestra u oculta la contraseña.",
      Space: "En el botón, muestra u oculta la contraseña.",
    },
    aria: [
      "El mismo contrato de accesibilidad que Password Field: botón con `aria-pressed` y `aria-controls`, el label como nombre accesible, `aria-required`, ayuda e información en `aria-describedby`.",
      'Un error de validación pone `aria-invalid` y renderiza el mensaje con `role="alert"`, así se anuncia cuando aparece.',
      "El ref de react-hook-form se conecta al input, así `shouldFocusError` lleva el foco al primer control inválido al enviar.",
    ],
    theming: [
      "Idéntico a Password Field: el control renderiza un Password Field, así que se aplican los mismos tokens, atributos `data-*` y `classNames`.",
    ],
  },
});
