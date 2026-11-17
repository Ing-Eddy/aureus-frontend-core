import { defineComponentDocs } from "@sb/docs/define-component-docs";

export const docs = defineComponentDocs({
  name: "Avatar Control",
  importPath: "@aureus-core/ui/components/avatar-control",
  exports: ["AvatarControl", "AvatarControlProps"],
  primitive: {
    label: "react-hook-form: Controller",
    href: "https://react-hook-form.com/docs/usecontroller/controller",
  },
  providers: [
    { name: "TooltipProvider", importPath: "@aureus-core/ui/shadcn/tooltip" },
    { name: "FormProvider", importPath: "react-hook-form" },
  ],
  api: {
    AvatarControl: {
      name: { type: "string", required: true },
      disabled: { type: "boolean", default: "false" },
      shouldUnregister: { type: "boolean", default: "false" },
      onValueChange: { type: "(value: FileItem<E> | null) => void" },
      "…AvatarField props": { type: "see Avatar Field" },
    },
  },
  stories: ["WithSchema", "EditForm", "DisabledVsLoading", "Parity"],
  keyboard: ["Tab", "Enter / Space", "Escape"],
  links: [
    { label: "Guide: Fields & controls", href: "?path=/docs/guides-fields-controls--docs" },
    { label: "Avatar Field", href: "?path=/docs/components-forms-avatar-field--docs" },
    {
      label: "react-hook-form: FormProvider",
      href: "https://react-hook-form.com/docs/formprovider",
    },
  ],
  en: {
    summary:
      "Avatar Field bound to a react-hook-form form. Render it inside a `FormProvider` and give it a `name`: the form holds the photo item (or `null`), so an update form puts the stored photo in `defaultValues` with `toExistingFile`, and on submit `diffFiles` and `toFormData` turn it into what your backend expects. Schema messages are shown as helper text. It accepts every Avatar Field prop, and with the same props it looks exactly the same.",
    whenToUse: [
      "For profile, account and organisation forms built with react-hook-form and a schema.",
    ],
    whenNotToUse: ["Outside a `FormProvider`: it throws. Use Avatar Field."],
    anatomy: {
      AvatarControl:
        "A react-hook-form `Controller` that takes `control` from the `FormProvider` context and renders an Avatar Field. A missing form value behaves as `null`.",
    },
    props: {
      AvatarControl: {
        name: "Path of the field in the form values, e.g. `photo`. A development warning names it when it is not in the form's `defaultValues`.",
        disabled:
          "Disables the field through react-hook-form, which leaves its value out of the submitted data.",
        shouldUnregister: "Unregisters the field, and drops its value, when the control unmounts.",
        onValueChange: "Called after react-hook-form stores the new value.",
        "…AvatarField props":
          "Every Avatar Field prop (`getFileInfo`, the texts, shape, size, fallback, dialog options, editor, upload, label, helper…), except `value`, `defaultValue`, `error` and `errorMessage`, which come from the form.",
      },
    },
    stories: {
      WithSchema:
        "The schema requires a photo: submitting without one shows its message and focuses the file input; uploading one submits it.",
      EditForm:
        "An update form: the stored photo is submitted unchanged, and a new one replaces it.",
      DisabledVsLoading:
        "A loading control keeps its photo in the submitted data; a disabled one is left out.",
      Parity:
        "An Avatar Field and an Avatar Control with the same props, side by side: they render the same markup.",
    },
    keyboard: {
      Tab: "Moves to the avatar, the choose or change button and the action.",
      "Enter / Space":
        "Opens the dialog from the avatar, or the system picker from the choose button.",
      Escape: "Closes the dialog.",
    },
    aria: [
      "Everything Avatar Field documents applies. The schema's message becomes the helper text, and `aria-invalid` is set on the file input.",
      "On a failed submit, `shouldFocusError` moves focus to the file input.",
    ],
    theming: ["Identical to Avatar Field: the control adds no markup."],
  },
  es: {
    summary:
      "Avatar Field vinculado a un formulario de react-hook-form. Renderízalo dentro de un `FormProvider` y dale un `name`: el formulario guarda la foto (o `null`), así que un formulario de edición pone la foto guardada en `defaultValues` con `toExistingFile`, y al enviar `diffFiles` y `toFormData` la convierten en lo que espera tu backend. Los mensajes del schema se muestran como texto de ayuda. Acepta todas las props de Avatar Field y, con las mismas props, se ve exactamente igual.",
    whenToUse: [
      "Para formularios de perfil, cuenta u organización con react-hook-form y un schema.",
    ],
    whenNotToUse: ["Fuera de un `FormProvider`: lanza un error. Usa Avatar Field."],
    anatomy: {
      AvatarControl:
        "Un `Controller` de react-hook-form que toma `control` del contexto del `FormProvider` y renderiza un Avatar Field. Un valor ausente en el formulario se comporta como `null`.",
    },
    props: {
      AvatarControl: {
        name: "Ruta del campo en los valores del formulario, p. ej. `photo`. Un aviso en desarrollo lo nombra si no está en los `defaultValues` del formulario.",
        disabled:
          "Deshabilita el campo a través de react-hook-form, que deja su valor fuera de los datos enviados.",
        shouldUnregister: "Elimina el registro del campo, y su valor, al desmontar el control.",
        onValueChange: "Se llama después de que react-hook-form guarde el nuevo valor.",
        "…AvatarField props":
          "Todas las props de Avatar Field (`getFileInfo`, los textos, forma, tamaño, fallback, opciones del diálogo, editor, subida, label, ayuda…), salvo `value`, `defaultValue`, `error` y `errorMessage`, que vienen del formulario.",
      },
    },
    stories: {
      WithSchema:
        "El schema exige una foto: al enviar sin ella se muestra su mensaje y el foco va al input de archivos; al subir una, se envía.",
      EditForm:
        "Un formulario de edición: la foto guardada se envía sin cambios, y una nueva la sustituye.",
      DisabledVsLoading:
        "Un control en carga conserva su foto en los datos enviados; uno deshabilitado se queda fuera.",
      Parity:
        "Un Avatar Field y un Avatar Control con las mismas props, lado a lado: renderizan el mismo markup.",
    },
    keyboard: {
      Tab: "Pasa al avatar, al botón de elegir o cambiar y a la acción.",
      "Enter / Space":
        "Abre el diálogo desde el avatar, o el selector del sistema desde el botón de elegir.",
      Escape: "Cierra el diálogo.",
    },
    aria: [
      "Se aplica todo lo documentado en Avatar Field. El mensaje del schema pasa a ser el texto de ayuda y se pone `aria-invalid` en el input de archivos.",
      "Si el envío falla, `shouldFocusError` lleva el foco al input de archivos.",
    ],
    theming: ["Igual que Avatar Field: el control no añade markup."],
  },
});
