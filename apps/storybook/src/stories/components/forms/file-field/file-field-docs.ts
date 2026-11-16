import { defineComponentDocs } from "@sb/docs/define-component-docs";

export const docs = defineComponentDocs({
  name: "File Field",
  importPath: "@aureus-core/ui/components/file-field",
  exports: [
    "FileField",
    "FileFieldProps",
    "FileItem",
    "FileInfo",
    "FileRejection",
    "diffFiles",
    "toFormData",
    "fileToBase64",
    "hasPendingUploads",
    "toExistingFile",
    "toExistingFiles",
    "isNewFile",
    "isExistingFile",
  ],
  primitive: {
    label: "shadcn/ui Attachment",
    href: "https://ui.shadcn.com/docs/components",
  },
  providers: [{ name: "TooltipProvider", importPath: "@aureus-core/ui/shadcn/tooltip" }],
  api: {
    FileField: {
      getFileInfo: { type: "(data: E) => FileInfo", required: true },
      chooseLabel: { type: "ReactNode", required: true },
      removeLabel: { type: "(name: string) => string", required: true },
      multiple: { type: "boolean", default: "false" },
      value: { type: "FileItem<E> | null  ·  FileItem<E>[] with multiple" },
      defaultValue: { type: "FileItem<E> | null  ·  FileItem<E>[]", default: "null / []" },
      onValueChange: { type: "(value) => void" },
      appearance: { type: '"list" | "grid" | "single"', default: '"list"' },
      replaceLabel: { type: "(name: string) => string" },
      dropzone: { type: "boolean", default: "false" },
      dropzoneText: { type: "ReactNode" },
      accept: { type: "string" },
      maxSize: { type: "number (bytes)" },
      minSize: { type: "number (bytes)" },
      maxFiles: { type: "number" },
      maxTotalSize: { type: "number (bytes)" },
      onReject: { type: "(rejections: FileRejection[]) => void" },
      rejectionMessage: { type: "(rejection: FileRejection) => ReactNode", default: "none" },
      upload: { type: "(file: File, { signal, onProgress }) => Promise<E>" },
      uploadProgressLabel: { type: "(name: string) => string" },
      cancelUploadLabel: { type: "(name: string) => string" },
      retryUploadLabel: { type: "(name: string) => string" },
      uploadErrorText: { type: "(name: string) => ReactNode" },
      onUploadError: { type: "(file: File, error: unknown) => void" },
      transform: { type: "(file: File) => Promise<File>" },
      reorderable: { type: "boolean", default: "false" },
      moveLabel: { type: "(name: string) => string" },
      moveAnnouncement: { type: "(name: string, position: number, total: number) => string" },
      pasteable: { type: "boolean", default: "false" },
      capture: { type: '"user" | "environment"' },
      addedAnnouncement: { type: "(count: number) => string", default: "none" },
      removedAnnouncement: { type: "(name: string) => string", default: "none" },
      locale: { type: "string", default: "the browser's" },
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
      classNames: { type: "FileFieldClassNames" },
      id: { type: "string" },
      onBlur: { type: "(event: FocusEvent) => void" },
      ref: { type: "Ref<HTMLInputElement>" },
    },
    helpers: {
      diffFiles: { type: "(initial, current) => { added: File[]; kept: E[]; removed: E[] }" },
      toFormData: { type: "(value, field: string, formData?: FormData) => FormData" },
      fileToBase64: { type: "(file: Blob) => Promise<string>" },
      hasPendingUploads: { type: "(value) => boolean" },
      toExistingFiles: { type: "(list: E[], getId?) => ExistingFileItem<E>[]" },
      toExistingFile: { type: "(data: E, getId?) => ExistingFileItem<E>" },
      isNewFile: { type: "(item) => item is NewFileItem" },
      isExistingFile: { type: "(item) => item is ExistingFileItem<E>" },
    },
  },
  stories: [
    "CreateForm",
    "EditForm",
    "Restrictions",
    "Dropzone",
    "Grid",
    "Single",
    "Upload",
    "Transform",
    "Reorder",
    "Paste",
    "Camera",
    "NativeForm",
    "Keyboard",
    "States",
    "Rtl",
    "Responsive",
  ],
  keyboard: ["Tab", "Enter / Space", "Space (move handle)", "Arrow keys", "Escape", "Ctrl + V"],
  links: [
    { label: "Guide: Fields & controls", href: "?path=/docs/guides-fields-controls--docs" },
    { label: "File Control", href: "?path=/docs/components-forms-file-control--docs" },
    {
      label: 'MDN: <input type="file">',
      href: "https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/file",
    },
  ],
  en: {
    summary:
      "A file field for create and update forms. Its value is a list of items: `new` (a `File` picked now) or `existing` (your backend's data, of any type `E`, shown through `getFileInfo`). An update form therefore shows the stored files, lets people remove, replace or add, and `diffFiles` tells you what to send. Files travel with the form (send them with `toFormData`), or, with `upload`, are uploaded as soon as they are picked. Lists, thumbnails, a single large preview, a dropzone, reordering, paste, camera and `transform` are opt-in. It ships no texts of its own.",
    whenToUse: [
      "To attach documents or images in a form, in create and in update screens.",
      "With `upload` when files should be stored while the user keeps filling the form (presigned URLs, large files).",
      'With `appearance="single"` for one image such as an avatar or a cover.',
    ],
    whenNotToUse: [
      "Inside a react-hook-form `FormProvider`: use File Control.",
      "To edit images (crop, rotate): use a dedicated editor, then pass the result as a file.",
      "As a security control: `accept` and the sizes only guide people; validate types and sizes on the server.",
    ],
    anatomy: {
      FileField:
        "Field header (`label`, required mark, info, spinner), the choose button (a label styled as a button over the hidden native input) or the dropzone around it, the items (rows, tiles or one large preview, each with its actions), the rejection messages, a live region and the helper or error text.",
      helpers:
        "Plain functions for submitting: they accept one item, `null` or an array, so they work in both modes.",
    },
    props: {
      FileField: {
        getFileInfo:
          "What to show for an existing item: `{ name, url?, size?, type? }`. Annotate its parameter so `E` is inferred. Required.",
        chooseLabel: 'Content of the choose button, such as "Choose files". Required.',
        removeLabel: "Accessible name of each remove button, from the file's name. Required.",
        multiple:
          "Holds several files (an array). Without it the value is one item or `null`, and picking a file replaces it.",
        value: "Controlled value. Build existing items with `toExistingFiles`.",
        defaultValue: "Initial value when uncontrolled.",
        onValueChange:
          "Called with the whole new value after every change: add, remove, replace, reorder, upload completed.",
        appearance:
          "`list` (rows), `grid` (thumbnails, needs `multiple`) or `single` (one large preview, without `multiple`).",
        replaceLabel: 'Accessible name of the replace button. Required with `appearance="single"`.',
        dropzone: "Adds a drag-and-drop area around the choose button.",
        dropzoneText: "Text inside the dropzone. Required with `dropzone`.",
        accept:
          "Accepted types: MIME types, `image/*` wildcards and `.pdf` extensions. Also filters the system picker; dropped and pasted files are checked too.",
        maxSize: "Largest size of one file, in bytes.",
        minSize: "Smallest size of one file, in bytes.",
        maxFiles:
          "Most items, with `multiple`. Extra files are rejected with `count`; at the limit the choose button is disabled.",
        maxTotalSize: "Largest total size, with `multiple`.",
        onReject:
          "Called with the files that did not enter, each with its reasons: `type`, `size-max`, `size-min`, `count`, `total-size`, `transform`.",
        rejectionMessage:
          "Text shown as an alert for each rejection of the last attempt. Without it nothing is shown.",
        upload:
          "Uploads each file as soon as it is added and resolves with your backend's data; the item then becomes existing, in place. Abort on `signal` and report progress (0–100) with `onProgress`.",
        uploadProgressLabel: "Accessible name of an item's progress bar. Required with `upload`.",
        cancelUploadLabel:
          "Accessible name of the cancel button while uploading. Required with `upload`.",
        retryUploadLabel:
          "Accessible name of the retry button of a failed upload. Required with `upload`.",
        uploadErrorText:
          "Text shown on, and announced for, a failed upload. Required with `upload`.",
        onUploadError: "Called when an upload fails.",
        transform:
          "Runs on each accepted file before it is added (and uploaded), to compress or resize. A rejection reports the file with the reason `transform`.",
        reorderable:
          "Lets people reorder the items with the keyboard and the pointer. Needs `multiple`.",
        moveLabel: "Accessible name of each move handle. Required with `reorderable`.",
        moveAnnouncement: "Announced after each move. Required with `reorderable`.",
        pasteable: "Adds files pasted while focus is inside the field.",
        capture: "Opens the camera on mobile: `user` (front) or `environment` (back).",
        addedAnnouncement: "Announced when files are added. Nothing is announced without it.",
        removedAnnouncement: "Announced when an item is removed. Nothing is announced without it.",
        locale: "Locale of the sizes, formatted with `Intl` (`1.5 kB`, `2 MB`).",
        name: "Name of the native input: a native form submission carries the new files.",
        label: "Text above the field; it names the field's group and the choose button.",
        required: "Red asterisk and `aria-required` on the file input. It adds no validation rule.",
        loading: "Disables every control, sets `aria-busy` and shows a spinner in the header.",
        loadingLabel: "Accessible name of the spinner. Required with `loading`.",
        disabled: "Disables the choose button, the dropzone and every item action.",
        info: "Content of the info tooltip, also part of the accessible description.",
        infoLabel: "Accessible name of the info button. Required with `info`.",
        helperText: "Text below the field, part of its accessible description.",
        error: "Error state: destructive helper text and `aria-invalid` on the file input.",
        errorMessage: "Replaces `helperText` while `error` is true, announced as an alert.",
        action: "A button next to the choose button, as in Text Field.",
        "aria-label": "Accessible name without a visible `label`.",
        "aria-labelledby": "Id of an element that names the field, instead of `label`.",
        className: "Extra classes for the root element.",
        classNames:
          "Extra classes per part: the shared ones plus `trigger`, `dropzone`, `items`, `item` and `preview`.",
        id: "Id of the native file input. Generated when missing.",
        onBlur: "Called when focus leaves the field.",
        ref: "Reaches the native file input, the field's focusable control.",
      },
      helpers: {
        diffFiles:
          "Compares the initial value (for example the form's defaults) with the current one by id: the new files to upload, the stored data kept and the stored data removed.",
        toFormData:
          "Appends the new files under a field name, to a new or given `FormData`. The recommended way to send files.",
        fileToBase64:
          "Reads a file as a data URL. Use it only when the backend requires base64: it is a third larger and reads the whole file into memory.",
        hasPendingUploads:
          "True while any item is still new. With `upload`, use it in a schema to block the submit while uploads are pending.",
        toExistingFiles:
          "Builds existing items from your backend's list, with stable ids (from `getId` or the index).",
        toExistingFile: "Builds one existing item.",
        isNewFile: "Narrows an item to a new file.",
        isExistingFile: "Narrows an item to a stored file.",
      },
    },
    stories: {
      CreateForm:
        "A create form: the picked files are sent as multipart `FormData` with `toFormData`.",
      EditForm:
        "An update form with stored files: remove one, add one, and `diffFiles` shows what to send.",
      Restrictions:
        "Images up to 1 MB, at most two: rejected files never enter, and your message is announced.",
      Dropzone:
        "Files dropped on the area are added; it highlights while files are dragged over it.",
      Grid: "Stored images as thumbnails that wrap and fill the width.",
      Single: "One large preview, such as a cover; the trigger becomes the replace button.",
      Upload:
        "Immediate upload to a simulated server, with progress, a successful file that becomes stored, and a failing file with retry.",
      Transform: "`transform` turns each picked image into a small PNG before it is added.",
      Reorder:
        "Reorder with the keyboard (Space, arrows, Space), with an announcement, or by dragging the handle.",
      Paste: "With `pasteable`, a pasted image is added.",
      Camera: "`capture` opens the back camera on mobile; on desktop it is the usual picker.",
      NativeForm:
        "Without react-hook-form: with `name`, a native submission carries the new files.",
      Keyboard:
        "Tab reaches the choose button, with a visible focus ring, and then each item's link and actions; removing keeps focus in the field.",
      States: "Required with info and helper, error with message, loading and disabled.",
      Rtl: "In a right-to-left container each item's actions sit on its left.",
      Responsive:
        "In a narrow container long names truncate, nothing overflows and every action stays at least 24 px.",
    },
    keyboard: {
      Tab: "Moves to the choose button, then to each item's link and actions.",
      "Enter / Space": "On the choose button, opens the system picker. On an action, presses it.",
      "Space (move handle)": "Grabs or drops the item (also Enter).",
      "Arrow keys":
        "While an item is grabbed, move it back or forward (mirrored in right-to-left pages).",
      Escape: "While an item is grabbed, puts it back where it was.",
      "Ctrl + V": "With `pasteable`, adds the pasted files (Cmd + V on macOS).",
    },
    aria: [
      "The focusable control is the native file input, visually hidden and presented by a label styled as a button. It is named by `chooseLabel` and the field's label, described by the helper text and info, and carries `aria-required`, `aria-invalid` and `aria-busy` (a `button` could not carry `aria-required`).",
      "The field's label names the group; the items are a list, so screen readers announce how many files there are.",
      "Every action (open, remove, replace, cancel, retry, move) is named with the file's name through your texts; an upload's progress bar is named by `uploadProgressLabel` and exposes its value.",
      "Rejections are announced as an alert; additions, removals, moves and failed uploads through a polite live region, all with your texts.",
      "The dropzone is not focusable: the choose button inside it is the way in for keyboard and screen-reader users.",
    ],
    theming: [
      "Items are shadcn's Attachment (`data-slot=attachment`, with `data-state` `uploading`, `error` or `done`); the choose button uses the Button `outline` styles.",
      "Parts carry `data-slot`: `file-field`, `file-trigger`, `file-dropzone` (with `data-dragging`), `file-items` (with `data-layout`), `file-single`, `file-progress`, `file-rejections`, `file-announcer`.",
      "Use `classNames.trigger`, `dropzone`, `items`, `item` and `preview` to restyle single parts.",
    ],
  },
  es: {
    summary:
      "Un campo de archivos para formularios de creación y de edición. Su valor es una lista de elementos: `new` (un `File` elegido ahora) o `existing` (los datos de tu backend, de cualquier tipo `E`, mostrados con `getFileInfo`). Así, un formulario de edición muestra los archivos guardados, deja quitar, sustituir o añadir, y `diffFiles` te dice qué enviar. Los archivos viajan con el formulario (envíalos con `toFormData`) o, con `upload`, se suben en cuanto se eligen. Lista, miniaturas, una vista grande única, zona de arrastre, reordenar, pegar, cámara y `transform` son opcionales. No trae textos propios.",
    whenToUse: [
      "Para adjuntar documentos o imágenes en un formulario, tanto al crear como al editar.",
      "Con `upload` cuando los archivos deben guardarse mientras se sigue rellenando el formulario (URLs prefirmadas, archivos grandes).",
      'Con `appearance="single"` para una sola imagen, como un avatar o una portada.',
    ],
    whenNotToUse: [
      "Dentro de un `FormProvider` de react-hook-form: usa File Control.",
      "Para editar imágenes (recortar, girar): usa un editor dedicado y pasa el resultado como archivo.",
      "Como control de seguridad: `accept` y los tamaños solo guían; valida tipos y tamaños en el servidor.",
    ],
    anatomy: {
      FileField:
        "Cabecera del field (`label`, asterisco, info, spinner), el botón de elegir (un label con estilo de botón sobre el input nativo oculto) o la zona de arrastre que lo rodea, los elementos (filas, miniaturas o una vista grande, cada uno con sus acciones), los mensajes de rechazo, una región viva y el texto de ayuda o de error.",
      helpers:
        "Funciones sencillas para el envío: aceptan un elemento, `null` o una lista, así que sirven en los dos modos.",
    },
    props: {
      FileField: {
        getFileInfo:
          "Qué mostrar de un elemento existente: `{ name, url?, size?, type? }`. Anota su parámetro para que se infiera `E`. Obligatorio.",
        chooseLabel: 'Contenido del botón de elegir, como "Elegir archivos". Obligatorio.',
        removeLabel:
          "Nombre accesible de cada botón de quitar, a partir del nombre del archivo. Obligatorio.",
        multiple:
          "Guarda varios archivos (una lista). Sin ella el valor es un elemento o `null`, y elegir un archivo lo sustituye.",
        value: "Valor controlado. Crea los elementos existentes con `toExistingFiles`.",
        defaultValue: "Valor inicial sin controlar.",
        onValueChange:
          "Se llama con el valor completo tras cada cambio: añadir, quitar, sustituir, reordenar o completar una subida.",
        appearance:
          "`list` (filas), `grid` (miniaturas, necesita `multiple`) o `single` (una vista grande, sin `multiple`).",
        replaceLabel:
          'Nombre accesible del botón de sustituir. Obligatorio con `appearance="single"`.',
        dropzone: "Añade una zona de arrastre alrededor del botón de elegir.",
        dropzoneText: "Texto de la zona de arrastre. Obligatorio con `dropzone`.",
        accept:
          "Tipos aceptados: MIME, comodines `image/*` y extensiones `.pdf`. También filtra el selector del sistema; los archivos soltados y pegados también se comprueban.",
        maxSize: "Tamaño máximo de un archivo, en bytes.",
        minSize: "Tamaño mínimo de un archivo, en bytes.",
        maxFiles:
          "Máximo de elementos, con `multiple`. Los archivos de más se rechazan con `count`; en el límite el botón de elegir se deshabilita.",
        maxTotalSize: "Tamaño total máximo, con `multiple`.",
        onReject:
          "Se llama con los archivos que no entraron, cada uno con sus motivos: `type`, `size-max`, `size-min`, `count`, `total-size`, `transform`.",
        rejectionMessage:
          "Texto que se anuncia como alerta por cada rechazo del último intento. Sin él no se muestra nada.",
        upload:
          "Sube cada archivo en cuanto se añade y resuelve con los datos de tu backend; el elemento pasa a ser existente, en su sitio. Aborta con `signal` e informa del progreso (0–100) con `onProgress`.",
        uploadProgressLabel:
          "Nombre accesible de la barra de progreso de un elemento. Obligatorio con `upload`.",
        cancelUploadLabel:
          "Nombre accesible del botón de cancelar durante la subida. Obligatorio con `upload`.",
        retryUploadLabel:
          "Nombre accesible del botón de reintentar una subida fallida. Obligatorio con `upload`.",
        uploadErrorText:
          "Texto que se muestra, y se anuncia, en una subida fallida. Obligatorio con `upload`.",
        onUploadError: "Se llama cuando falla una subida.",
        transform:
          "Se aplica a cada archivo aceptado antes de añadirlo (y de subirlo), para comprimir o redimensionar. Si falla, el archivo se rechaza con el motivo `transform`.",
        reorderable:
          "Permite reordenar los elementos con el teclado y con el puntero. Necesita `multiple`.",
        moveLabel: "Nombre accesible de cada asa de movimiento. Obligatorio con `reorderable`.",
        moveAnnouncement: "Se anuncia tras cada movimiento. Obligatorio con `reorderable`.",
        pasteable: "Añade los archivos pegados mientras el foco está dentro del field.",
        capture: "Abre la cámara en el móvil: `user` (frontal) o `environment` (trasera).",
        addedAnnouncement: "Se anuncia al añadir archivos. Sin él no se anuncia nada.",
        removedAnnouncement: "Se anuncia al quitar un elemento. Sin él no se anuncia nada.",
        locale: "Locale de los tamaños, formateados con `Intl` (`1,5 kB`, `2 MB`).",
        name: "Nombre del input nativo: un envío nativo del formulario incluye los archivos nuevos.",
        label: "Texto sobre el field; da nombre al grupo y al botón de elegir.",
        required:
          "Asterisco rojo y `aria-required` en el input de archivos. No añade ninguna regla de validación.",
        loading:
          "Deshabilita todos los controles, pone `aria-busy` y muestra un spinner en la cabecera.",
        loadingLabel: "Nombre accesible del spinner. Obligatorio con `loading`.",
        disabled: "Deshabilita el botón de elegir, la zona de arrastre y todas las acciones.",
        info: "Contenido del tooltip de información, también parte de la descripción accesible.",
        infoLabel: "Nombre accesible del botón de información. Obligatorio con `info`.",
        helperText: "Texto bajo el field, parte de su descripción accesible.",
        error: "Estado de error: texto de ayuda en rojo y `aria-invalid` en el input de archivos.",
        errorMessage: "Sustituye a `helperText` mientras `error` es true y se anuncia como alerta.",
        action: "Un botón junto al botón de elegir, como en Text Field.",
        "aria-label": "Nombre accesible sin `label` visible.",
        "aria-labelledby": "Id de un elemento que da nombre al field, en lugar de `label`.",
        className: "Clases extra para el elemento raíz.",
        classNames:
          "Clases extra por parte: las comunes más `trigger`, `dropzone`, `items`, `item` y `preview`.",
        id: "Id del input de archivos nativo. Se genera si falta.",
        onBlur: "Se llama cuando el foco sale del field.",
        ref: "Llega al input de archivos nativo, el control enfocable del field.",
      },
      helpers: {
        diffFiles:
          "Compara el valor inicial (por ejemplo los valores por defecto del formulario) con el actual por id: los archivos nuevos que subir, los datos guardados que se mantienen y los que se quitaron.",
        toFormData:
          "Añade los archivos nuevos con un nombre de campo a un `FormData` nuevo o dado. La forma recomendada de enviar archivos.",
        fileToBase64:
          "Lee un archivo como data URL. Úsalo solo si el backend exige base64: ocupa un tercio más y carga el archivo entero en memoria.",
        hasPendingUploads:
          "True mientras quede algún elemento nuevo. Con `upload`, úsalo en un schema para bloquear el envío mientras haya subidas pendientes.",
        toExistingFiles:
          "Crea elementos existentes a partir de la lista de tu backend, con ids estables (de `getId` o del índice).",
        toExistingFile: "Crea un elemento existente.",
        isNewFile: "Restringe un elemento a archivo nuevo.",
        isExistingFile: "Restringe un elemento a archivo guardado.",
      },
    },
    stories: {
      CreateForm:
        "Un formulario de creación: los archivos elegidos se envían como `FormData` multipart con `toFormData`.",
      EditForm:
        "Un formulario de edición con archivos guardados: quita uno, añade otro, y `diffFiles` muestra qué enviar.",
      Restrictions:
        "Imágenes de hasta 1 MB, dos como máximo: los archivos rechazados no entran y se anuncia tu mensaje.",
      Dropzone:
        "Los archivos soltados en la zona se añaden; se resalta mientras se arrastran archivos encima.",
      Grid: "Imágenes guardadas como miniaturas que se reparten y llenan el ancho.",
      Single: "Una vista grande, como una portada; el botón de elegir pasa a ser el de sustituir.",
      Upload:
        "Subida inmediata a un servidor simulado, con progreso, un archivo que se guarda y otro que falla con reintento.",
      Transform: "`transform` convierte cada imagen elegida en un PNG pequeño antes de añadirla.",
      Reorder:
        "Reordena con el teclado (Espacio, flechas, Espacio), con anuncio, o arrastrando el asa.",
      Paste: "Con `pasteable`, se añade una imagen pegada.",
      Camera:
        "`capture` abre la cámara trasera en el móvil; en escritorio es el selector de siempre.",
      NativeForm: "Sin react-hook-form: con `name`, un envío nativo incluye los archivos nuevos.",
      Keyboard:
        "Tab llega al botón de elegir, con un anillo de foco visible, y después al enlace y las acciones de cada elemento; al quitar, el foco se queda en el field.",
      States: "Obligatorio con info y ayuda, error con mensaje, carga y deshabilitado.",
      Rtl: "En un contenedor de derecha a izquierda las acciones de cada elemento quedan a su izquierda.",
      Responsive:
        "En un contenedor estrecho los nombres largos se recortan, nada desborda y cada acción mide al menos 24 px.",
    },
    keyboard: {
      Tab: "Pasa al botón de elegir y después al enlace y las acciones de cada elemento.",
      "Enter / Space":
        "En el botón de elegir, abre el selector del sistema. En una acción, la pulsa.",
      "Space (move handle)": "Coge o suelta el elemento (también Enter).",
      "Arrow keys":
        "Con un elemento cogido, lo mueven hacia atrás o hacia delante (al revés en páginas de derecha a izquierda).",
      Escape: "Con un elemento cogido, lo devuelve a su sitio.",
      "Ctrl + V": "Con `pasteable`, añade los archivos pegados (Cmd + V en macOS).",
    },
    aria: [
      "El control enfocable es el input de archivos nativo, oculto visualmente y presentado por un label con estilo de botón. Lo nombran `chooseLabel` y el label del field, lo describen la ayuda y la info, y lleva `aria-required`, `aria-invalid` y `aria-busy` (un `button` no podría llevar `aria-required`).",
      "El label del field da nombre al grupo; los elementos son una lista, así los lectores de pantalla anuncian cuántos archivos hay.",
      "Cada acción (abrir, quitar, sustituir, cancelar, reintentar, mover) se nombra con el nombre del archivo mediante tus textos; la barra de progreso de una subida se nombra con `uploadProgressLabel` y expone su valor.",
      "Los rechazos se anuncian como alerta; las altas, bajas, movimientos y subidas fallidas, en una región viva educada, todo con tus textos.",
      "La zona de arrastre no es enfocable: el botón de elegir que contiene es la vía de entrada con teclado y lector de pantalla.",
    ],
    theming: [
      "Los elementos son el Attachment de shadcn (`data-slot=attachment`, con `data-state` `uploading`, `error` o `done`); el botón de elegir usa los estilos `outline` de Button.",
      "Las partes llevan `data-slot`: `file-field`, `file-trigger`, `file-dropzone` (con `data-dragging`), `file-items` (con `data-layout`), `file-single`, `file-progress`, `file-rejections`, `file-announcer`.",
      "Usa `classNames.trigger`, `dropzone`, `items`, `item` y `preview` para cambiar partes concretas.",
    ],
  },
});
