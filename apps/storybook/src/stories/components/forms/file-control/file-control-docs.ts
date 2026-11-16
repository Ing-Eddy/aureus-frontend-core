import { defineComponentDocs } from "@sb/docs/define-component-docs";

export const docs = defineComponentDocs({
  name: "File Control",
  importPath: "@aureus-core/ui/components/file-control",
  exports: ["FileControl", "FileControlProps"],
  primitive: {
    label: "react-hook-form: Controller",
    href: "https://react-hook-form.com/docs/usecontroller/controller",
  },
  providers: [
    { name: "TooltipProvider", importPath: "@aureus-core/ui/shadcn/tooltip" },
    { name: "FormProvider", importPath: "react-hook-form" },
  ],
  api: {
    FileControl: {
      name: { type: "string", required: true },
      disabled: { type: "boolean", default: "false" },
      shouldUnregister: { type: "boolean", default: "false" },
      onValueChange: { type: "(value) => void" },
      "…FileField props": { type: "see File Field" },
    },
  },
  stories: ["WithSchema", "EditForm", "PendingUploads", "DisabledVsLoading", "Parity"],
  keyboard: ["Tab", "Enter / Space"],
  links: [
    { label: "Guide: Fields & controls", href: "?path=/docs/guides-fields-controls--docs" },
    { label: "File Field", href: "?path=/docs/components-forms-file-field--docs" },
    {
      label: "react-hook-form: FormProvider",
      href: "https://react-hook-form.com/docs/formprovider",
    },
  ],
  en: {
    summary:
      "File Field bound to a react-hook-form form. Render it inside a `FormProvider` and give it a `name`: the form holds the file items (`FileItem[]` with `multiple`, one item or `null` without it), so an update form puts the stored files in `defaultValues` with `toExistingFiles`, and on submit `diffFiles` and `toFormData` turn the value into what your backend expects. Schema messages are shown as helper text, and with `upload` a schema can block the submit while uploads are pending. It accepts every File Field prop, and with the same props it looks exactly the same.",
    whenToUse: [
      "For create and update forms built with react-hook-form and a schema.",
      "With `upload` and `hasPendingUploads` when files are stored while the form is being filled.",
    ],
    whenNotToUse: ["Outside a `FormProvider`: it throws. Use File Field."],
    anatomy: {
      FileControl:
        "A react-hook-form `Controller` that takes `control` from the `FormProvider` context and renders a File Field. A missing form value behaves as `[]` with `multiple` and `null` without it.",
    },
    props: {
      FileControl: {
        name: "Path of the field in the form values, e.g. `attachments`. A development warning names it when it is not in the form's `defaultValues`.",
        disabled:
          "Disables the field through react-hook-form, which leaves its value out of the submitted data.",
        shouldUnregister: "Unregisters the field, and drops its value, when the control unmounts.",
        onValueChange: "Called after react-hook-form stores the new value.",
        "…FileField props":
          "Every File Field prop (`getFileInfo`, `chooseLabel`, `removeLabel`, `multiple`, restrictions, appearances, `upload`, extras, label, helper…), except `value`, `defaultValue`, `error` and `errorMessage`, which come from the form.",
      },
    },
    stories: {
      WithSchema:
        "The schema requires a file: submitting empty shows its message and focuses the file input; adding a file submits it.",
      EditForm:
        "An update form: the stored cover comes from the defaults, and replacing it stores the new file.",
      PendingUploads:
        "With `upload`, a schema using `hasPendingUploads` blocks the submit until the upload finishes.",
      DisabledVsLoading:
        "A loading control keeps its stored files in the submitted data; a disabled one is left out.",
      Parity:
        "A File Field and a File Control with the same props, side by side: they render the same markup.",
    },
    keyboard: {
      Tab: "Moves to the choose button, then to each item's link and actions.",
      "Enter / Space": "Opens the system picker from the choose button, or presses an action.",
    },
    aria: [
      "Everything File Field documents applies. The schema's message becomes the helper text, and `aria-invalid` is set on the file input.",
      "On a failed submit, `shouldFocusError` moves focus to the first invalid field's file input.",
    ],
    theming: ["Identical to File Field: the control adds no markup."],
  },
  es: {
    summary:
      "File Field vinculado a un formulario de react-hook-form. Renderízalo dentro de un `FormProvider` y dale un `name`: el formulario guarda los elementos (`FileItem[]` con `multiple`, un elemento o `null` sin ella), así que un formulario de edición pone los archivos guardados en `defaultValues` con `toExistingFiles`, y al enviar `diffFiles` y `toFormData` convierten el valor en lo que espera tu backend. Los mensajes del schema se muestran como texto de ayuda y, con `upload`, un schema puede bloquear el envío mientras haya subidas pendientes. Acepta todas las props de File Field y, con las mismas props, se ve exactamente igual.",
    whenToUse: [
      "Para formularios de creación y de edición con react-hook-form y un schema.",
      "Con `upload` y `hasPendingUploads` cuando los archivos se guardan mientras se rellena el formulario.",
    ],
    whenNotToUse: ["Fuera de un `FormProvider`: lanza un error. Usa File Field."],
    anatomy: {
      FileControl:
        "Un `Controller` de react-hook-form que toma `control` del contexto del `FormProvider` y renderiza un File Field. Un valor ausente en el formulario se comporta como `[]` con `multiple` y como `null` sin ella.",
    },
    props: {
      FileControl: {
        name: "Ruta del campo en los valores del formulario, p. ej. `attachments`. Un aviso en desarrollo lo nombra si no está en los `defaultValues` del formulario.",
        disabled:
          "Deshabilita el campo a través de react-hook-form, que deja su valor fuera de los datos enviados.",
        shouldUnregister: "Elimina el registro del campo, y su valor, al desmontar el control.",
        onValueChange: "Se llama después de que react-hook-form guarde el nuevo valor.",
        "…FileField props":
          "Todas las props de File Field (`getFileInfo`, `chooseLabel`, `removeLabel`, `multiple`, restricciones, apariencias, `upload`, extras, label, ayuda…), salvo `value`, `defaultValue`, `error` y `errorMessage`, que vienen del formulario.",
      },
    },
    stories: {
      WithSchema:
        "El schema exige un archivo: al enviar vacío se muestra su mensaje y el foco va al input de archivos; al añadir un archivo se envía.",
      EditForm:
        "Un formulario de edición: la portada guardada viene de los valores por defecto y, al sustituirla, se guarda el archivo nuevo.",
      PendingUploads:
        "Con `upload`, un schema que usa `hasPendingUploads` bloquea el envío hasta que termina la subida.",
      DisabledVsLoading:
        "Un control en carga conserva sus archivos en los datos enviados; uno deshabilitado se queda fuera.",
      Parity:
        "Un File Field y un File Control con las mismas props, lado a lado: renderizan el mismo markup.",
    },
    keyboard: {
      Tab: "Pasa al botón de elegir y después al enlace y las acciones de cada elemento.",
      "Enter / Space": "Abre el selector del sistema desde el botón de elegir, o pulsa una acción.",
    },
    aria: [
      "Se aplica todo lo documentado en File Field. El mensaje del schema pasa a ser el texto de ayuda y se pone `aria-invalid` en el input de archivos.",
      "Si el envío falla, `shouldFocusError` lleva el foco al input de archivos del primer campo inválido.",
    ],
    theming: ["Igual que File Field: el control no añade markup."],
  },
});
