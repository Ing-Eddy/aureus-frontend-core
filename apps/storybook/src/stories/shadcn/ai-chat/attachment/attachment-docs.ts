import { defineComponentDocs } from "@sb/docs/define-component-docs";

const node = { children: { type: "ReactNode" } };

export const docs = defineComponentDocs({
  name: "Attachment",
  importPath: "@aureus-core/ui/shadcn/attachment",
  exports: [
    "AttachmentGroup",
    "Attachment",
    "AttachmentMedia",
    "AttachmentContent",
    "AttachmentTitle",
    "AttachmentDescription",
    "AttachmentActions",
    "AttachmentAction",
    "AttachmentTrigger",
  ],
  api: {
    AttachmentGroup: node,
    Attachment: {
      state: { type: '"idle" | "uploading" | "processing" | "error" | "done"', default: '"done"' },
      size: { type: '"default" | "sm" | "xs"', default: '"default"' },
      orientation: { type: '"horizontal" | "vertical"', default: '"horizontal"' },
    },
    AttachmentMedia: { variant: { type: '"icon" | "image"', default: '"icon"' } },
    AttachmentContent: node,
    AttachmentTitle: node,
    AttachmentDescription: node,
    AttachmentActions: node,
    AttachmentAction: {
      variant: { type: "Button variant", default: '"ghost"' },
      size: { type: "Button size", default: '"icon-xs"' },
      "aria-label": { type: "string", required: true },
    },
    AttachmentTrigger: { asChild: { type: "boolean", default: "false" } },
  },
  stories: ["States", "Image", "Vertical", "Removable"],
  keyboard: ["Tab", "Enter / Space"],
  links: [{ label: "shadcn/ui", href: "https://ui.shadcn.com/" }],
  en: {
    summary:
      "A compact card for a file attached to a message or a form: icon or thumbnail, name, size or status, and actions such as remove. It shows uploading, processing and error states.",
    whenToUse: [
      "For files attached to a chat message or a prompt before sending.",
      "For upload lists with per-file progress and errors.",
    ],
    whenNotToUse: [
      "For a gallery of images: use a grid of images or a Carousel.",
      'For the drop zone itself: use an Input of `type="file"` or a dedicated dropzone.',
    ],
    anatomy: {
      AttachmentGroup: "A row of attachments that scrolls horizontally when it overflows.",
      Attachment:
        "The card; `data-state` drives the styles (dashed when idle, shimmer while uploading, red when failed).",
      AttachmentMedia: 'Icon or image thumbnail; `variant="image"` crops an `<img>`.',
      AttachmentContent: "Column with title and description.",
      AttachmentTitle: "File name, truncated.",
      AttachmentDescription: "Size, type or status text.",
      AttachmentActions: "Trailing actions.",
      AttachmentAction: "A small ghost icon Button (remove, retry, download).",
      AttachmentTrigger: "An invisible full-card button or link to open the file.",
    },
    props: {
      AttachmentGroup: { children: "Attachments." },
      Attachment: {
        state: "`idle` (not uploaded yet), `uploading`, `processing`, `error` or `done`.",
        size: "Padding and text size.",
        orientation: "`vertical` stacks a large thumbnail above the text.",
      },
      AttachmentMedia: { variant: "`icon` for file types, `image` for thumbnails." },
      AttachmentContent: { children: "Title and description." },
      AttachmentTitle: { children: "File name." },
      AttachmentDescription: { children: "Details or status." },
      AttachmentActions: { children: "AttachmentAction buttons." },
      AttachmentAction: {
        variant: "Button variant.",
        size: "Button size.",
        "aria-label": "Required: actions are icon-only (“Remove q4-report.pdf”).",
      },
      AttachmentTrigger: { asChild: "Render a link (`<a href>`) instead of a button." },
    },
    stories: {
      States:
        "Done, uploading (with progress text), processing and error states from the `files` fixture.",
      Image: "An image attachment with a local thumbnail.",
      Vertical: '`orientation="vertical"` tiles for images.',
      Removable: "A remove action per attachment that calls `onRemove` with the file id.",
    },
    keyboard: {
      Tab: "Moves to the trigger and then to each action.",
      "Enter / Space": "Opens the file (trigger) or runs the focused action.",
    },
    aria: [
      "Name every AttachmentAction with the file it affects: “Remove notes.txt”.",
      "Say the state in text (“Uploading… 45%”, “Upload failed”), not only with color or shimmer.",
      'AttachmentTrigger covers the card: give it an accessible name (the file name) and keep actions above it (`z-20`). A group that can overflow needs `tabIndex={0}`, `role="region"` and `aria-label` so it can be scrolled by keyboard.',
    ],
    theming: [
      "Card: `--card` with `--border`; error: `--destructive` border and media tint; media: `--muted`.",
      "The uploading/processing title uses the `shimmer` utility from the package styles.",
    ],
  },
  es: {
    summary:
      "Una tarjeta compacta para un archivo adjunto a un mensaje o a un formulario: icono o miniatura, nombre, tamaño o estado, y acciones como quitar. Muestra los estados de subida, procesamiento y error.",
    whenToUse: [
      "Para archivos adjuntos a un mensaje de chat o a un prompt antes de enviar.",
      "Para listas de subida con progreso y errores por archivo.",
    ],
    whenNotToUse: [
      "Para una galería de imágenes: usa una rejilla de imágenes o un Carousel.",
      'Para la zona de soltar en sí: usa un Input de `type="file"` o un dropzone específico.',
    ],
    anatomy: {
      AttachmentGroup: "Una fila de adjuntos que se desplaza en horizontal cuando desborda.",
      Attachment:
        "La tarjeta; `data-state` define los estilos (discontinua sin subir, brillo al subir, roja si falla).",
      AttachmentMedia: 'Icono o miniatura; `variant="image"` recorta un `<img>`.',
      AttachmentContent: "Columna con título y descripción.",
      AttachmentTitle: "Nombre del archivo, truncado.",
      AttachmentDescription: "Texto de tamaño, tipo o estado.",
      AttachmentActions: "Acciones al final.",
      AttachmentAction: "Un pequeño Button ghost de icono (quitar, reintentar, descargar).",
      AttachmentTrigger: "Un botón o enlace invisible que cubre la tarjeta para abrir el archivo.",
    },
    props: {
      AttachmentGroup: { children: "Adjuntos." },
      Attachment: {
        state: "`idle` (aún sin subir), `uploading`, `processing`, `error` o `done`.",
        size: "Padding y tamaño del texto.",
        orientation: "`vertical` apila una miniatura grande sobre el texto.",
      },
      AttachmentMedia: { variant: "`icon` para tipos de archivo, `image` para miniaturas." },
      AttachmentContent: { children: "Título y descripción." },
      AttachmentTitle: { children: "Nombre del archivo." },
      AttachmentDescription: { children: "Detalles o estado." },
      AttachmentActions: { children: "Botones AttachmentAction." },
      AttachmentAction: {
        variant: "Variante del botón.",
        size: "Tamaño del botón.",
        "aria-label": "Obligatorio: las acciones son solo icono (“Quitar q4-report.pdf”).",
      },
      AttachmentTrigger: { asChild: "Renderiza un enlace (`<a href>`) en lugar de un botón." },
    },
    stories: {
      States:
        "Estados terminado, subiendo (con texto de progreso), procesando y error del fixture `files`.",
      Image: "Un adjunto de imagen con una miniatura local.",
      Vertical: 'Mosaicos `orientation="vertical"` para imágenes.',
      Removable: "Una acción de quitar por adjunto que llama a `onRemove` con el id del archivo.",
    },
    keyboard: {
      Tab: "Va al disparador y luego a cada acción.",
      "Enter / Space": "Abre el archivo (disparador) o ejecuta la acción enfocada.",
    },
    aria: [
      "Nombra cada AttachmentAction con el archivo al que afecta: “Quitar notes.txt”.",
      "Di el estado con texto (“Subiendo… 45%”, “Error al subir”), no solo con color o brillo.",
      'AttachmentTrigger cubre la tarjeta: dale un nombre accesible (el nombre del archivo) y deja las acciones por encima (`z-20`). Un grupo que puede desbordar necesita `tabIndex={0}`, `role="region"` y `aria-label` para desplazarse con teclado.',
    ],
    theming: [
      "Tarjeta: `--card` con `--border`; error: borde `--destructive` y tinte del medio; medio: `--muted`.",
      "El título al subir/procesar usa la utilidad `shimmer` de los estilos del paquete.",
    ],
  },
});
