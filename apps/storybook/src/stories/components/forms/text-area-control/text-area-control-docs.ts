import { defineComponentDocs } from "@sb/docs/define-component-docs";

export const docs = defineComponentDocs({
  name: "Text Area Control",
  importPath: "@aureus-core/ui/components/text-area-control",
  exports: ["TextAreaControl"],
  primitive: {
    label: "react-hook-form: Controller",
    href: "https://react-hook-form.com/docs/usecontroller/controller",
  },
  providers: [
    { name: "TooltipProvider", importPath: "@aureus-core/ui/shadcn/tooltip" },
    { name: "FormProvider", importPath: "react-hook-form" },
  ],
  api: {
    TextAreaControl: {
      name: { type: "string", required: true },
      disabled: { type: "boolean", default: "false" },
      shouldUnregister: { type: "boolean", default: "false" },
      label: { type: "ReactNode" },
      required: { type: "boolean", default: "false" },
      loading: { type: "boolean", default: "false" },
      info: { type: "ReactNode" },
      helperText: { type: "ReactNode" },
      action: { type: "FieldActionProps" },
      minRows: { type: "number", default: "3" },
      maxRows: { type: "number", default: "10" },
      resize: { type: "boolean", default: "true" },
      showCount: { type: "boolean", default: "false" },
      maxLength: { type: "number" },
      countLabel: { type: "(count: number, maxLength?: number) => string" },
      actionShortcut: { type: "boolean", default: "false" },
      className: { type: "string" },
      classNames: { type: "FieldClassNames" },
      onChange: { type: "(event: ChangeEvent<HTMLTextAreaElement>) => void" },
      onBlur: { type: "(event: FocusEvent<HTMLTextAreaElement>) => void" },
      loadingLabel: { type: "string" },
      infoLabel: { type: "string" },
      ref: { type: "Ref<HTMLTextAreaElement>" },
    },
  },
  stories: ["WithSchema", "DisabledVsLoading", "Parity"],
  keyboard: ["Tab", "Shift + Tab", "Enter", "Ctrl + Enter"],
  links: [
    { label: "Guide: Fields & controls", href: "?path=/docs/guides-fields-controls--docs" },
    { label: "Text Area Field", href: "?path=/docs/components-forms-text-area-field--docs" },
    {
      label: "react-hook-form: FormProvider",
      href: "https://react-hook-form.com/docs/formprovider",
    },
  ],
  en: {
    summary:
      "Text Area Field bound to a react-hook-form form. Render it inside a `FormProvider` and give it a `name`: it reads and writes the value, counts the form's value, and shows the form's validation message as helper text. With the same props it looks exactly like Text Area Field.",
    whenToUse: [
      "For multi-line values in forms built with react-hook-form and a schema: descriptions, bios, feedback.",
      "When length rules belong to the schema (for example `z.string().min(20).max(500)`) and the counter should follow the form value.",
    ],
    whenNotToUse: [
      "Outside a `FormProvider`: it throws. Use Text Area Field.",
      "For single-line values: use Text Control.",
    ],
    anatomy: {
      TextAreaControl:
        "A react-hook-form `Controller` that takes `control` from the `FormProvider` context and renders a Text Area Field with the value, handlers, ref, disabled state and error mapped from the form.",
    },
    props: {
      TextAreaControl: {
        name: "Path of the field in the form values, e.g. `bio`. A development warning names it when it is not in the form's `defaultValues`.",
        disabled:
          "Disables the field through react-hook-form, which leaves its value out of the submitted data.",
        shouldUnregister: "Unregisters the field, and drops its value, when the control unmounts.",
        label: "Text above the field; its accessible name.",
        required:
          "Red asterisk and `aria-required`. It adds no validation rule: requiredness lives in the schema.",
        loading:
          "Disables the textarea and the action and shows a spinner in the footer bar. The value stays in the form and is submitted.",
        info: "Content of the info tooltip, also part of the textarea's accessible description.",
        helperText:
          "Text below the field. While the field has a validation error, the error's message is shown in its place.",
        action: "The button in the footer bar, as in Text Area Field.",
        minRows: "Lines shown when empty.",
        maxRows: "Lines the field grows to before it scrolls.",
        resize: "Shows the drag handle to resize the field.",
        showCount: "Shows the character counter, which follows the form value.",
        maxLength: "Native character limit, shown by the counter.",
        countLabel:
          "What assistive technology hears for the counter, given the current count and the `maxLength` (when set), so it can say what remains. Required with `showCount`; there is no default.",
        actionShortcut: "Ctrl+Enter (Cmd+Enter) presses the action.",
        className: "Extra classes for the root element.",
        classNames: "Extra classes per part, as in Text Area Field (including `footer`).",
        onChange: "Called after react-hook-form handles the change.",
        onBlur: "Called after react-hook-form handles the blur.",
        loadingLabel:
          "Accessible name of the loading spinner, in your language. Required with `loading`; there is no default.",
        infoLabel:
          "Accessible name of the info button, in your language. Required with `info`; there is no default.",
        ref: "Reaches the `<textarea>`, merged with react-hook-form's own ref (so `setFocus` keeps working).",
      },
    },
    stories: {
      WithSchema:
        "A bio validated by a zod schema (20 to 500 characters). Submitting a short text shows the schema's message in the helper slot and moves focus to the field; the counter follows the form value.",
      DisabledVsLoading:
        "Both look unavailable, but only `disabled` removes the value from the submitted data: compare the payload.",
      Parity:
        "A Text Area Field and a Text Area Control with the same props, side by side: they render the same markup.",
    },
    keyboard: {
      Tab: "Moves focus to the info button, then the textarea, then the action.",
      "Shift + Tab": "Moves focus back in the same order.",
      Enter: "Inside the textarea, adds a new line; it never submits the form.",
      "Ctrl + Enter": "With `actionShortcut`, presses the action (Cmd + Enter on macOS).",
    },
    aria: [
      "Same accessibility contract as Text Area Field: label as accessible name, `aria-required`, counter, helper and info in `aria-describedby`, debounced counter announcements.",
      'A validation error sets `aria-invalid` and renders the message with `role="alert"`, so it is announced when it appears.',
      "react-hook-form's ref is attached to the textarea, so `shouldFocusError` moves focus to the first invalid control on submit.",
    ],
    theming: [
      "Identical to Text Area Field: the control renders a Text Area Field, so the same tokens, `data-*` attributes and `classNames` apply.",
    ],
  },
  es: {
    summary:
      "Text Area Field vinculado a un formulario de react-hook-form. Renderízalo dentro de un `FormProvider` y dale un `name`: lee y escribe el valor, cuenta el valor del formulario y muestra el mensaje de validación del formulario como texto de ayuda. Con las mismas props se ve exactamente igual que Text Area Field.",
    whenToUse: [
      "Para valores multilínea en formularios hechos con react-hook-form y un schema: descripciones, biografías, comentarios.",
      "Cuando las reglas de longitud pertenecen al schema (por ejemplo `z.string().min(20).max(500)`) y el contador debe seguir el valor del formulario.",
    ],
    whenNotToUse: [
      "Fuera de un `FormProvider`: lanza un error. Usa Text Area Field.",
      "Para valores de una sola línea: usa Text Control.",
    ],
    anatomy: {
      TextAreaControl:
        "Un `Controller` de react-hook-form que toma `control` del contexto del `FormProvider` y renderiza un Text Area Field con el valor, los handlers, el ref, el estado deshabilitado y el error del formulario.",
    },
    props: {
      TextAreaControl: {
        name: "Ruta del campo en los valores del formulario, p. ej. `bio`. Un aviso en desarrollo lo nombra si no está en los `defaultValues` del formulario.",
        disabled:
          "Deshabilita el campo a través de react-hook-form, que deja su valor fuera de los datos enviados.",
        shouldUnregister:
          "Desregistra el campo, y descarta su valor, cuando el control se desmonta.",
        label: "Texto sobre el campo; su nombre accesible.",
        required:
          "Asterisco rojo y `aria-required`. No añade ninguna regla de validación: la obligatoriedad vive en el schema.",
        loading:
          "Deshabilita el textarea y la acción y muestra un spinner en la barra inferior. El valor sigue en el formulario y se envía.",
        info: "Contenido del tooltip de información, también parte de la descripción accesible del textarea.",
        helperText:
          "Texto bajo el campo. Mientras el campo tiene un error de validación, en su lugar se muestra el mensaje del error.",
        action: "El botón de la barra inferior, como en Text Area Field.",
        minRows: "Líneas que se ven con el campo vacío.",
        maxRows: "Líneas hasta las que crece antes de hacer scroll.",
        resize: "Muestra el asa para redimensionar el campo.",
        showCount: "Muestra el contador de caracteres, que sigue el valor del formulario.",
        maxLength: "Límite nativo de caracteres, que muestra el contador.",
        countLabel:
          "Lo que escuchan las tecnologías de asistencia para el contador, a partir del recuento actual y del `maxLength` (si lo hay), para poder decir cuánto queda. Obligatorio con `showCount`; no hay valor por defecto.",
        actionShortcut: "Ctrl+Enter (Cmd+Enter) pulsa la acción.",
        className: "Clases extra para la raíz.",
        classNames: "Clases extra por parte, como en Text Area Field (incluido `footer`).",
        onChange: "Se llama después de que react-hook-form procese el cambio.",
        onBlur: "Se llama después de que react-hook-form procese el blur.",
        loadingLabel:
          "Nombre accesible del spinner de carga, en tu idioma. Obligatorio con `loading`; no hay valor por defecto.",
        infoLabel:
          "Nombre accesible del botón de información, en tu idioma. Obligatorio con `info`; no hay valor por defecto.",
        ref: "Apunta al `<textarea>`, combinado con el ref propio de react-hook-form (así `setFocus` sigue funcionando).",
      },
    },
    stories: {
      WithSchema:
        "Una biografía validada con un schema de zod (de 20 a 500 caracteres). Al enviar un texto corto, el mensaje del schema aparece en el lugar del texto de ayuda y el foco pasa al campo; el contador sigue el valor del formulario.",
      DisabledVsLoading:
        "Los dos parecen no disponibles, pero solo `disabled` quita el valor de los datos enviados: compara el payload.",
      Parity:
        "Un Text Area Field y un Text Area Control con las mismas props, lado a lado: renderizan el mismo markup.",
    },
    keyboard: {
      Tab: "Mueve el foco al botón de información, luego al textarea y luego a la acción.",
      "Shift + Tab": "Mueve el foco hacia atrás en el mismo orden.",
      Enter: "Dentro del textarea, hace un salto de línea; nunca envía el formulario.",
      "Ctrl + Enter": "Con `actionShortcut`, pulsa la acción (Cmd + Enter en macOS).",
    },
    aria: [
      "El mismo contrato de accesibilidad que Text Area Field: el label como nombre accesible, `aria-required`, contador, ayuda e información en `aria-describedby`, y anuncios del contador con retardo.",
      'Un error de validación pone `aria-invalid` y renderiza el mensaje con `role="alert"`, así se anuncia cuando aparece.',
      "El ref de react-hook-form se conecta al textarea, así `shouldFocusError` lleva el foco al primer control inválido al enviar.",
    ],
    theming: [
      "Idéntico a Text Area Field: el control renderiza un Text Area Field, así que se aplican los mismos tokens, atributos `data-*` y `classNames`.",
    ],
  },
});
