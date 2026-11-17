import { defineComponentDocs } from "@sb/docs/define-component-docs";

export const docs = defineComponentDocs({
  name: "Avatar Field",
  importPath: "@aureus-core/ui/components/avatar-field",
  exports: ["AvatarField", "AvatarFieldProps", "AvatarEditFailure"],
  primitive: {
    label: "shadcn/ui Avatar & Dialog",
    href: "https://ui.shadcn.com/docs/components/avatar",
  },
  providers: [{ name: "TooltipProvider", importPath: "@aureus-core/ui/shadcn/tooltip" }],
  api: {
    AvatarField: {
      getFileInfo: { type: "(data: E) => FileInfo", required: true },
      chooseLabel: { type: "string" },
      changeLabel: { type: "string" },
      readOnly: { type: "boolean", default: "false" },
      inspectLabel: { type: "(name: string) => string", required: true },
      dialogTitle: { type: "ReactNode", required: true },
      closeLabel: { type: "string", required: true },
      value: { type: "FileItem<E> | null" },
      defaultValue: { type: "FileItem<E> | null", default: "null" },
      onValueChange: { type: "(value: FileItem<E> | null) => void" },
      shape: { type: '"circle" | "square"', default: '"circle"' },
      size: { type: '"sm" | "md" | "lg" | "xl"', default: '"lg"' },
      fallback: { type: "ReactNode" },
      initialsFrom: { type: "string" },
      removable: { type: "boolean", default: "false" },
      removeLabel: { type: "ReactNode" },
      downloadable: { type: "boolean", default: "false" },
      downloadLabel: { type: "ReactNode" },
      dropzone: { type: "boolean", default: "false" },
      dropzoneText: { type: "ReactNode" },
      pasteable: { type: "boolean", default: "false" },
      editable: { type: "boolean", default: "false" },
      editLabel: { type: "ReactNode" },
      cropAreaLabel: { type: "string" },
      zoomLabel: { type: "string" },
      rotateLeftLabel: { type: "string" },
      rotateRightLabel: { type: "string" },
      flipHorizontalLabel: { type: "string" },
      flipVerticalLabel: { type: "string" },
      resetLabel: { type: "ReactNode" },
      applyLabel: { type: "ReactNode" },
      cancelLabel: { type: "ReactNode" },
      outputType: { type: '"image/png" | "image/jpeg" | "image/webp"', default: '"image/png"' },
      outputSize: { type: "number (px)", default: "512" },
      outputQuality: { type: "number (0–1)", default: "0.92" },
      onEditError: { type: "(failure: AvatarEditFailure) => void" },
      accept: { type: "string", default: '"image/*"' },
      maxSize: { type: "number (bytes)" },
      minSize: { type: "number (bytes)" },
      onReject: { type: "(rejections: FileRejection[]) => void" },
      rejectionMessage: { type: "(rejection: FileRejection) => ReactNode", default: "none" },
      capture: { type: '"user" | "environment"' },
      transform: { type: "(file: File) => Promise<File>" },
      upload: { type: "(file: File, { signal, onProgress }) => Promise<E>" },
      uploadProgressLabel: { type: "(name: string) => string" },
      cancelUploadLabel: { type: "(name: string) => string" },
      retryUploadLabel: { type: "(name: string) => string" },
      uploadErrorText: { type: "(name: string) => ReactNode" },
      onUploadError: { type: "(file: File, error: unknown) => void" },
      changedAnnouncement: { type: "string", default: "none" },
      removedAnnouncement: { type: "string", default: "none" },
      editedAnnouncement: { type: "string", default: "none" },
      name: { type: "string" },
      label: { type: "ReactNode" },
      required: { type: "boolean", default: "false" },
      loading: { type: "boolean", default: "false" },
      loadingLabel: { type: "string" },
      disabled: { type: "boolean", default: "false" },
      info: { type: "ReactNode" },
      infoLabel: { type: "string" },
      helperText: { type: "ReactNode" },
      error: { type: "boolean", default: "false" },
      errorMessage: { type: "ReactNode" },
      action: { type: "FieldActionProps" },
      "aria-label": { type: "string" },
      "aria-labelledby": { type: "string" },
      className: { type: "string" },
      classNames: { type: "AvatarFieldClassNames" },
      id: { type: "string" },
      onBlur: { type: "(event: FocusEvent) => void" },
      ref: { type: "Ref<HTMLInputElement>" },
    },
  },
  stories: [
    "Empty",
    "Initials",
    "FromBackend",
    "BrokenUrl",
    "Inspect",
    "Edit",
    "CircularButton",
    "ReadOnly",
    "Remove",
    "Download",
    "DropAndPaste",
    "Upload",
    "Square",
    "Sizes",
    "Keyboard",
    "States",
    "Rtl",
    "Responsive",
  ],
  keyboard: [
    "Tab",
    "Enter / Space",
    "Escape",
    "Arrow keys (crop area)",
    "+ / − (crop area)",
    "Home (crop area)",
  ],
  links: [
    { label: "Guide: Fields & controls", href: "?path=/docs/guides-fields-controls--docs" },
    { label: "Avatar Control", href: "?path=/docs/components-forms-avatar-control--docs" },
    { label: "File Field", href: "?path=/docs/components-forms-file-field--docs" },
  ],
  en: {
    summary:
      "A profile photo field. It shows the stored photo (your backend's data, through `getFileInfo`) or a fallback, and with a photo the avatar opens a dialog to inspect, change, remove or open it. With `editable`, the dialog has an editor to crop and zoom, rotate, flip and reset; applying exports a new image. The value is the File Field model with one item (`FileItem<E> | null`), so `diffFiles`, `toFormData` and `upload` work as there. It ships no texts of its own.",
    whenToUse: [
      "For a user's or an organisation's photo or logo, in create and update forms.",
      "With `editable` when people should frame the photo before saving it.",
    ],
    whenNotToUse: [
      "Inside a react-hook-form `FormProvider`: use Avatar Control.",
      "For several images or documents: use File Field.",
      "For advanced editing (filters, drawing, free aspect ratios): use a dedicated editor and pass the result as a file.",
    ],
    anatomy: {
      AvatarField:
        "Field header (`label`, required mark, info, spinner), the avatar (a button with a photo), a circular camera button on its bottom corner (the native file input, to pick or change the photo; absent with `readOnly`), upload status, an optional action, and the helper or error text. The dialog shows the large photo and its actions, or the editor (crop area, zoom slider, rotate and flip buttons, reset, cancel and apply).",
    },
    props: {
      AvatarField: {
        getFileInfo:
          "What to show for a stored photo: its `url` is the image and `name` is used in your texts. Annotate its parameter so `E` is inferred. Required.",
        chooseLabel:
          'Accessible name of the circular camera button on the avatar while there is no photo, such as "Upload photo". Required unless `readOnly`.',
        changeLabel:
          "Accessible name of the circular camera button with a photo, and text of the dialog's change button. Required unless `readOnly`.",
        inspectLabel:
          "Accessible name of the avatar button that opens the dialog, from the photo's name. Required.",
        dialogTitle: "Title of the dialog. Required.",
        closeLabel: "Accessible name of the dialog's close button. Required.",
        readOnly:
          "Only shows the photo: no circular button, and no change, edit or remove action. With a photo, the avatar still opens the dialog to look at it (close, and the original with `downloadable`). The editing features are not allowed with it.",
        value:
          "Controlled value: the photo, or `null`. Build a stored photo with `toExistingFile`.",
        defaultValue: "Initial value when uncontrolled.",
        onValueChange:
          "Called with the new value after every change: picked, edited, removed or uploaded.",
        shape: "`circle` or `square`. Crops are always square; the shape is the mask.",
        size: "Avatar side: 24, 40, 64 or 96 px.",
        fallback:
          "Shown without a photo or when it fails to load. Without it, the initials of `initialsFrom`, then a user icon.",
        initialsFrom: "A name whose initials are the fallback, such as the user's full name.",
        removable: "Adds a remove action to the dialog; the value becomes `null`.",
        removeLabel: "Text of the remove button. Required with `removable`.",
        downloadable: "Adds a link to the original image to the dialog.",
        downloadLabel: "Text of that link. Required with `downloadable`.",
        dropzone: "Lets people drop an image on the dialog's photo to replace it.",
        dropzoneText:
          "Text over the photo while an image is dragged over it. Required with `dropzone`.",
        pasteable: "Replaces the photo with an image pasted while the dialog has focus.",
        editable: "Adds the editor: crop and zoom, rotate, flip, reset.",
        editLabel: "Text of the dialog's edit button. Required with `editable`.",
        cropAreaLabel: "Accessible name of the crop area. Required with `editable`.",
        zoomLabel: "Accessible name of the zoom slider. Required with `editable`.",
        rotateLeftLabel: "Accessible name of the rotate-left button. Required with `editable`.",
        rotateRightLabel: "Accessible name of the rotate-right button. Required with `editable`.",
        flipHorizontalLabel:
          "Accessible name of the horizontal flip button. Required with `editable`.",
        flipVerticalLabel: "Accessible name of the vertical flip button. Required with `editable`.",
        resetLabel: "Text of the reset button. Required with `editable`.",
        applyLabel: "Text of the apply button. Required with `editable`.",
        cancelLabel: "Text of the cancel button. Required with `editable`.",
        outputType: "Type of the edited image.",
        outputSize:
          "Largest side of the edited image. A crop is never upscaled beyond its source pixels.",
        outputQuality: "Quality of JPEG and WebP output.",
        onEditError:
          'Called when an edit cannot be applied. `reason: "cors"` means the stored photo\'s server does not allow CORS, so the browser forbids reading its pixels.',
        accept: "Accepted types; `image/*` when omitted.",
        maxSize: "Largest size of a picked file, in bytes.",
        minSize: "Smallest size of a picked file, in bytes.",
        onReject: "Called with a picked file that was not accepted, and why.",
        rejectionMessage: "Text announced as an alert for a rejected file. Nothing without it.",
        capture: "Opens the camera on mobile: `user` (front) or `environment` (back).",
        transform:
          "Runs on each picked or edited image before it becomes the value (and is uploaded).",
        upload:
          "Uploads each new photo and resolves with your backend's data; the photo then becomes stored.",
        uploadProgressLabel:
          "Accessible name of the progress ring over the avatar. Required with `upload`.",
        cancelUploadLabel:
          "Accessible name of the cancel button while uploading. Required with `upload`.",
        retryUploadLabel:
          "Accessible name of the retry button of a failed upload. Required with `upload`.",
        uploadErrorText: "Text shown and announced for a failed upload. Required with `upload`.",
        onUploadError: "Called when an upload fails.",
        changedAnnouncement: "Announced after a new photo is picked. Nothing without it.",
        removedAnnouncement: "Announced after the photo is removed. Nothing without it.",
        editedAnnouncement: "Announced after an edit is applied. Nothing without it.",
        name: "Name of the native input: a native form submission carries the new photo.",
        label: "Text above the field; it names the field's group and the choose button.",
        required: "Red asterisk and `aria-required` on the file input. It adds no validation rule.",
        loading: "Disables every control, sets `aria-busy` and shows a spinner in the header.",
        loadingLabel: "Accessible name of the spinner. Required with `loading`.",
        disabled: "Disables the avatar, the buttons and the dialog's actions.",
        info: "Content of the info tooltip, also part of the accessible description.",
        infoLabel: "Accessible name of the info button. Required with `info`.",
        helperText: "Text below the field, part of its accessible description.",
        error: "Error state: destructive helper text and `aria-invalid` on the file input.",
        errorMessage: "Replaces `helperText` while `error` is true, announced as an alert.",
        action: "A button next to the choose and change buttons.",
        "aria-label": "Accessible name without a visible `label`.",
        "aria-labelledby": "Id of an element that names the field, instead of `label`.",
        className: "Extra classes for the root element.",
        classNames:
          "Extra classes per part: the shared ones plus `avatar`, `trigger`, `dialog`, `preview` and `editor`.",
        id: "Id of the native file input. Generated when missing.",
        onBlur: "Called when focus leaves the field.",
        ref: "Reaches the native file input.",
      },
    },
    stories: {
      Empty: "Without a photo: a decorative user icon and the upload button.",
      Initials: "The initials of `initialsFrom` as the fallback.",
      FromBackend: "The stored photo comes from the backend data through `getFileInfo`.",
      BrokenUrl: "A stored photo whose URL fails shows the fallback (the initials).",
      Inspect: "The dialog traps focus, closes with Escape and gives focus back to the avatar.",
      Edit: "Rotate right and flip, apply, and the exported image is read back: red on top, blue below, 128×128 PNG.",
      CircularButton:
        "The circular camera button on the avatar's bottom corner, named by your text and the field's label, with a visible focus ring.",
      ReadOnly:
        "Only showing the photo: no button; the avatar opens the dialog with close and the original, and without a photo nothing is interactive.",
      Remove: "Removing sets the value to `null`, closes the dialog and focuses the upload button.",
      Download: "A link to the original image.",
      DropAndPaste: "Drop an image on the large photo, or paste one while the dialog has focus.",
      Upload:
        "Immediate upload with a progress ring over the avatar, and a failing upload with retry.",
      Square: "A square avatar, such as a logo.",
      Sizes: "The four sizes: 24, 40, 64 and 96 px.",
      Keyboard:
        "The avatar, the dialog's actions, and the crop area's zoom and arrow keys, with the keyboard only.",
      States: "Required with info and helper, error with message, loading and disabled.",
      Rtl: "In a right-to-left container the circular button sits on the avatar's bottom left corner.",
      Responsive:
        "At a narrow width nothing overflows, the dialog fits the viewport and its controls keep at least 24 px.",
    },
    keyboard: {
      Tab: "Moves to the avatar, the circular button and the action; inside the dialog, through its controls (focus stays in the dialog).",
      "Enter / Space":
        "Opens the dialog from the avatar, opens the system picker from the choose button, or presses an action.",
      Escape: "Closes the dialog and gives focus back to the avatar.",
      "Arrow keys (crop area)":
        "Move the image in the arrow's direction; with Shift, in larger steps.",
      "+ / − (crop area)": "Zoom in and out.",
      "Home (crop area)": "Centres the image.",
    },
    aria: [
      "The circular camera button on the avatar is the native file input, presented as a round icon button: named by your text and the field's label, described by the helper text and info, with `aria-required` and `aria-invalid`.",
      'With a photo, the avatar is a button named by `inspectLabel`; its image is decorative. The dialog has `role="dialog"`, `aria-modal` and the name `dialogTitle`; shadcn\'s built-in close button (with a fixed English name) is replaced by one named `closeLabel`.',
      'The crop area is a focusable `role="application"` named by `cropAreaLabel`; the zoom slider\'s thumb is named by `zoomLabel` and exposes a value text such as "1.5×".',
      "Changes, removals, edits, rejections and failed uploads are announced with your texts.",
      "Editing a stored photo needs CORS: the image server must send `Access-Control-Allow-Origin`. Displaying it never does.",
    ],
    theming: [
      "The avatar is shadcn's Avatar; the dialog is shadcn's Dialog; buttons use the Button styles.",
      "Parts carry `data-slot`: `avatar-field`, `avatar-preview`, `avatar-inspect`, `avatar-progress`, `avatar-dialog` (with `data-view`), `avatar-viewer`, `avatar-editor`, `crop-area`, `crop-image`, `crop-mask`, `zoom-slider`, `editor-toolbar`.",
      "Use `classNames.avatar`, `trigger`, `dialog`, `preview` and `editor` to restyle single parts.",
    ],
  },
  es: {
    summary:
      "Un campo de foto de perfil. Muestra la foto guardada (los datos de tu backend, mediante `getFileInfo`) o un fallback y, con foto, el avatar abre un diálogo para verla, cambiarla, quitarla o abrirla. Con `editable`, el diálogo tiene un editor para recortar con zoom, girar, voltear y restablecer; al aplicar se exporta una imagen nueva. El valor es el modelo de File Field con un elemento (`FileItem<E> | null`), así que `diffFiles`, `toFormData` y `upload` funcionan igual. No trae textos propios.",
    whenToUse: [
      "Para la foto o el logo de un usuario o una organización, al crear y al editar.",
      "Con `editable` cuando la persona debe encuadrar la foto antes de guardarla.",
    ],
    whenNotToUse: [
      "Dentro de un `FormProvider` de react-hook-form: usa Avatar Control.",
      "Para varias imágenes o documentos: usa File Field.",
      "Para edición avanzada (filtros, dibujo, proporciones libres): usa un editor dedicado y pasa el resultado como archivo.",
    ],
    anatomy: {
      AvatarField:
        "Cabecera del field (`label`, asterisco, info, spinner), el avatar (un botón cuando hay foto), un botón circular con la cámara en su esquina inferior (el input de archivos nativo, para elegir o cambiar la foto; no existe con `readOnly`), el estado de la subida, una acción opcional y el texto de ayuda o de error. El diálogo muestra la foto grande y sus acciones, o el editor (área de recorte, slider de zoom, botones de girar y voltear, restablecer, cancelar y aplicar).",
    },
    props: {
      AvatarField: {
        getFileInfo:
          "Qué mostrar de una foto guardada: su `url` es la imagen y `name` se usa en tus textos. Anota su parámetro para que se infiera `E`. Obligatorio.",
        chooseLabel:
          'Nombre accesible del botón circular con la cámara sobre el avatar mientras no hay foto, como "Subir foto". Obligatorio salvo con `readOnly`.',
        changeLabel:
          "Nombre accesible del botón circular con foto, y texto del botón de cambiar del diálogo. Obligatorio salvo con `readOnly`.",
        inspectLabel:
          "Nombre accesible del botón del avatar que abre el diálogo, a partir del nombre de la foto. Obligatorio.",
        dialogTitle: "Título del diálogo. Obligatorio.",
        closeLabel: "Nombre accesible del botón de cerrar el diálogo. Obligatorio.",
        readOnly:
          "Solo muestra la foto: sin botón circular ni acciones de cambiar, editar o quitar. Con foto, el avatar sigue abriendo el diálogo para verla (cerrar y, con `downloadable`, el original). Las funciones de edición no se permiten con él.",
        value: "Valor controlado: la foto o `null`. Crea una foto guardada con `toExistingFile`.",
        defaultValue: "Valor inicial sin controlar.",
        onValueChange:
          "Se llama con el valor nuevo tras cada cambio: elegida, editada, quitada o subida.",
        shape: "`circle` o `square`. El recorte siempre es cuadrado; la forma es la máscara.",
        size: "Lado del avatar: 24, 40, 64 o 96 px.",
        fallback:
          "Se muestra sin foto o cuando falla su carga. Sin él, las iniciales de `initialsFrom` y después un icono de usuario.",
        initialsFrom:
          "Un nombre cuyas iniciales son el fallback, como el nombre completo del usuario.",
        removable: "Añade la acción de quitar al diálogo; el valor pasa a `null`.",
        removeLabel: "Texto del botón de quitar. Obligatorio con `removable`.",
        downloadable: "Añade al diálogo un enlace a la imagen original.",
        downloadLabel: "Texto de ese enlace. Obligatorio con `downloadable`.",
        dropzone: "Permite soltar una imagen sobre la foto del diálogo para sustituirla.",
        dropzoneText:
          "Texto sobre la foto mientras se arrastra una imagen encima. Obligatorio con `dropzone`.",
        pasteable: "Sustituye la foto por una imagen pegada mientras el diálogo tiene el foco.",
        editable: "Añade el editor: recortar con zoom, girar, voltear, restablecer.",
        editLabel: "Texto del botón de editar del diálogo. Obligatorio con `editable`.",
        cropAreaLabel: "Nombre accesible del área de recorte. Obligatorio con `editable`.",
        zoomLabel: "Nombre accesible del slider de zoom. Obligatorio con `editable`.",
        rotateLeftLabel:
          "Nombre accesible del botón de girar a la izquierda. Obligatorio con `editable`.",
        rotateRightLabel:
          "Nombre accesible del botón de girar a la derecha. Obligatorio con `editable`.",
        flipHorizontalLabel:
          "Nombre accesible del botón de voltear en horizontal. Obligatorio con `editable`.",
        flipVerticalLabel:
          "Nombre accesible del botón de voltear en vertical. Obligatorio con `editable`.",
        resetLabel: "Texto del botón de restablecer. Obligatorio con `editable`.",
        applyLabel: "Texto del botón de aplicar. Obligatorio con `editable`.",
        cancelLabel: "Texto del botón de cancelar. Obligatorio con `editable`.",
        outputType: "Tipo de la imagen editada.",
        outputSize:
          "Lado máximo de la imagen editada. Un recorte nunca se amplía más allá de sus píxeles de origen.",
        outputQuality: "Calidad de la salida JPEG y WebP.",
        onEditError:
          'Se llama cuando no se puede aplicar una edición. `reason: "cors"` significa que el servidor de la foto guardada no permite CORS, así que el navegador no deja leer sus píxeles.',
        accept: "Tipos aceptados; `image/*` si se omite.",
        maxSize: "Tamaño máximo del archivo elegido, en bytes.",
        minSize: "Tamaño mínimo del archivo elegido, en bytes.",
        onReject: "Se llama con un archivo elegido que no se aceptó, y el motivo.",
        rejectionMessage:
          "Texto que se anuncia como alerta para un archivo rechazado. Sin él no se muestra nada.",
        capture: "Abre la cámara en el móvil: `user` (frontal) o `environment` (trasera).",
        transform:
          "Se aplica a cada imagen elegida o editada antes de pasar a ser el valor (y de subirse).",
        upload:
          "Sube cada foto nueva y resuelve con los datos de tu backend; la foto pasa entonces a ser guardada.",
        uploadProgressLabel:
          "Nombre accesible del anillo de progreso sobre el avatar. Obligatorio con `upload`.",
        cancelUploadLabel:
          "Nombre accesible del botón de cancelar durante la subida. Obligatorio con `upload`.",
        retryUploadLabel:
          "Nombre accesible del botón de reintentar una subida fallida. Obligatorio con `upload`.",
        uploadErrorText:
          "Texto que se muestra y se anuncia en una subida fallida. Obligatorio con `upload`.",
        onUploadError: "Se llama cuando falla una subida.",
        changedAnnouncement: "Se anuncia al elegir una foto nueva. Sin él no se anuncia nada.",
        removedAnnouncement: "Se anuncia al quitar la foto. Sin él no se anuncia nada.",
        editedAnnouncement: "Se anuncia al aplicar una edición. Sin él no se anuncia nada.",
        name: "Nombre del input nativo: un envío nativo del formulario incluye la foto nueva.",
        label: "Texto sobre el field; da nombre al grupo y al botón de elegir.",
        required:
          "Asterisco rojo y `aria-required` en el input de archivos. No añade ninguna regla de validación.",
        loading:
          "Deshabilita todos los controles, pone `aria-busy` y muestra un spinner en la cabecera.",
        loadingLabel: "Nombre accesible del spinner. Obligatorio con `loading`.",
        disabled: "Deshabilita el avatar, los botones y las acciones del diálogo.",
        info: "Contenido del tooltip de información, también parte de la descripción accesible.",
        infoLabel: "Nombre accesible del botón de información. Obligatorio con `info`.",
        helperText: "Texto bajo el field, parte de su descripción accesible.",
        error: "Estado de error: texto de ayuda en rojo y `aria-invalid` en el input de archivos.",
        errorMessage: "Sustituye a `helperText` mientras `error` es true y se anuncia como alerta.",
        action: "Un botón junto a los botones de elegir y cambiar.",
        "aria-label": "Nombre accesible sin `label` visible.",
        "aria-labelledby": "Id de un elemento que da nombre al field, en lugar de `label`.",
        className: "Clases extra para el elemento raíz.",
        classNames:
          "Clases extra por parte: las comunes más `avatar`, `trigger`, `dialog`, `preview` y `editor`.",
        id: "Id del input de archivos nativo. Se genera si falta.",
        onBlur: "Se llama cuando el foco sale del field.",
        ref: "Llega al input de archivos nativo.",
      },
    },
    stories: {
      Empty: "Sin foto: un icono de usuario decorativo y el botón de subir.",
      Initials: "Las iniciales de `initialsFrom` como fallback.",
      FromBackend: "La foto guardada viene de los datos del backend mediante `getFileInfo`.",
      BrokenUrl: "Una foto guardada cuya URL falla muestra el fallback (las iniciales).",
      Inspect: "El diálogo atrapa el foco, se cierra con Escape y devuelve el foco al avatar.",
      Edit: "Gira a la derecha y voltea, aplica, y se lee la imagen exportada: rojo arriba, azul abajo, PNG de 128×128.",
      CircularButton:
        "El botón circular con la cámara en la esquina inferior del avatar, nombrado por tu texto y el label del field, con un anillo de foco visible.",
      ReadOnly:
        "Solo mostrar la foto: sin botón; el avatar abre el diálogo con cerrar y el original, y sin foto nada es interactivo.",
      Remove:
        "Al quitar, el valor pasa a `null`, el diálogo se cierra y el foco va al botón de subir.",
      Download: "Un enlace a la imagen original.",
      DropAndPaste: "Suelta una imagen sobre la foto grande, o pega una con el diálogo enfocado.",
      Upload:
        "Subida inmediata con un anillo de progreso sobre el avatar, y una subida fallida con reintento.",
      Square: "Un avatar cuadrado, como un logo.",
      Sizes: "Los cuatro tamaños: 24, 40, 64 y 96 px.",
      Keyboard:
        "El avatar, las acciones del diálogo y las teclas de zoom y flechas del área de recorte, solo con teclado.",
      States: "Obligatorio con info y ayuda, error con mensaje, carga y deshabilitado.",
      Rtl: "En un contenedor de derecha a izquierda el botón circular queda en la esquina inferior izquierda del avatar.",
      Responsive:
        "En un ancho estrecho nada desborda, el diálogo cabe en la pantalla y sus controles miden al menos 24 px.",
    },
    keyboard: {
      Tab: "Pasa al avatar, al botón circular y a la acción; dentro del diálogo, por sus controles (el foco no sale del diálogo).",
      "Enter / Space":
        "Abre el diálogo desde el avatar, abre el selector del sistema desde el botón de elegir o pulsa una acción.",
      Escape: "Cierra el diálogo y devuelve el foco al avatar.",
      "Arrow keys (crop area)":
        "Mueven la imagen en la dirección de la flecha; con Shift, en pasos más grandes.",
      "+ / − (crop area)": "Acercan y alejan.",
      "Home (crop area)": "Centra la imagen.",
    },
    aria: [
      "El botón circular con la cámara sobre el avatar es el input de archivos nativo, presentado como botón redondo con icono: lo nombran tu texto y el label del field, lo describen la ayuda y la info, y lleva `aria-required` y `aria-invalid`.",
      'Con foto, el avatar es un botón nombrado por `inspectLabel`; su imagen es decorativa. El diálogo tiene `role="dialog"`, `aria-modal` y el nombre `dialogTitle`; el botón de cerrar propio de shadcn (con un nombre fijo en inglés) se sustituye por uno nombrado con `closeLabel`.',
      'El área de recorte es un `role="application"` enfocable nombrado por `cropAreaLabel`; el thumb del slider de zoom se nombra con `zoomLabel` y expone un texto de valor como "1,5×".',
      "Los cambios, bajas, ediciones, rechazos y subidas fallidas se anuncian con tus textos.",
      "Editar una foto guardada necesita CORS: el servidor de la imagen debe enviar `Access-Control-Allow-Origin`. Mostrarla nunca lo necesita.",
    ],
    theming: [
      "El avatar es el Avatar de shadcn; el diálogo, el Dialog de shadcn; los botones usan los estilos de Button.",
      "Las partes llevan `data-slot`: `avatar-field`, `avatar-preview`, `avatar-inspect`, `avatar-progress`, `avatar-dialog` (con `data-view`), `avatar-viewer`, `avatar-editor`, `crop-area`, `crop-image`, `crop-mask`, `zoom-slider`, `editor-toolbar`.",
      "Usa `classNames.avatar`, `trigger`, `dialog`, `preview` y `editor` para cambiar partes concretas.",
    ],
  },
});
