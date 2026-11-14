import { defineComponentDocs } from "@sb/docs/define-component-docs";

const actionSize = '"xs" | "sm" | "icon-xs" | "icon-sm"';
const variant = '"default" | "secondary" | "outline" | "ghost" | "destructive" | "link"';

export const docs = defineComponentDocs({
  name: "Text Area Field",
  importPath: "@aureus-core/ui/components/text-area-field",
  exports: ["TextAreaField"],
  primitive: {
    label: "<textarea> (HTML)",
    href: "https://developer.mozilla.org/docs/Web/HTML/Element/textarea",
  },
  providers: [{ name: "TooltipProvider", importPath: "@aureus-core/ui/shadcn/tooltip" }],
  api: {
    TextAreaField: {
      label: { type: "ReactNode" },
      required: { type: "boolean", default: "false" },
      loading: { type: "boolean", default: "false" },
      disabled: { type: "boolean", default: "false" },
      info: { type: "ReactNode" },
      helperText: { type: "ReactNode" },
      error: { type: "boolean", default: "false" },
      errorMessage: { type: "ReactNode" },
      action: { type: "FieldActionProps" },
      minRows: { type: "number", default: "3" },
      maxRows: { type: "number", default: "10" },
      resize: { type: "boolean", default: "true" },
      showCount: { type: "boolean", default: "false" },
      maxLength: { type: "number" },
      countLabel: { type: "(remaining: number) => string" },
      actionShortcut: { type: "boolean", default: "false" },
      className: { type: "string" },
      classNames: { type: "FieldClassNames" },
      loadingLabel: { type: "string", default: '"Loading"' },
      infoLabel: { type: "string", default: '"More information"' },
      ref: { type: "Ref<HTMLTextAreaElement>" },
    },
    action: {
      children: { type: "ReactNode", required: true },
      tooltip: { type: "ReactNode" },
      onClick: { type: "(event: MouseEvent) => void" },
      "aria-label": { type: "string" },
      variant: { type: variant, default: '"ghost"' },
      size: { type: actionSize, default: '"icon-xs" for an icon, "xs" otherwise' },
      disabled: { type: "boolean", default: "false" },
      type: { type: '"button" | "submit" | "reset"', default: '"button"' },
    },
    classNames: {
      root: { type: "string" },
      header: { type: "string" },
      label: { type: "string" },
      requiredMark: { type: "string" },
      info: { type: "string" },
      control: { type: "string" },
      input: { type: "string" },
      footer: { type: "string" },
      helper: { type: "string" },
      action: { type: "string" },
    },
  },
  stories: ["States", "AutoGrow", "CharacterCounter", "CommentComposer", "NoResize", "Responsive"],
  keyboard: ["Tab", "Shift + Tab", "Enter", "Ctrl + Enter", "Escape"],
  links: [
    { label: "Guide: Fields & controls", href: "?path=/docs/guides-fields-controls--docs" },
    { label: "Text Area Control", href: "?path=/docs/components-forms-text-area-control--docs" },
    { label: "Text Field", href: "?path=/docs/components-forms-text-field--docs" },
    { label: "shadcn/ui: Input Group", href: "https://ui.shadcn.com/docs/components/input-group" },
  ],
  en: {
    summary:
      "A multi-line text input with the same label, required mark, info tooltip, helper text, error, loading and disabled states as every field. It grows with its content, can be resized by the user, and keeps its spinner, character counter and action in a footer bar attached to the bottom edge.",
    whenToUse: [
      "For text that can span several lines: comments, descriptions, bios, messages, notes.",
      "When users benefit from seeing how much they can still write: turn on `showCount` with `maxLength`.",
      "For quick composers where an action sends the text: add `action` and `actionShortcut`.",
    ],
    whenNotToUse: [
      "Inside a react-hook-form `FormProvider`: use Text Area Control, which looks the same and binds to the form.",
      "For a single line (a name, a title, a search): use Text Field.",
      "For formatted text (bold, links, lists): a rich text editor is needed.",
    ],
    anatomy: {
      TextAreaField:
        "The shared header row (label, red asterisk, info button), a frame with the textarea and, when needed, a footer bar along its bottom edge (spinner and counter at the start, action at the end), then the helper text or error message.",
      action:
        "The object passed to `action`: one button at the inline end of the footer bar, so it never sits beside the text however tall the field becomes.",
      classNames:
        "Extra classes per part, merged after the defaults. `footer` targets the footer bar, which only multi-line fields have.",
    },
    props: {
      TextAreaField: {
        label: "Text above the field. It becomes the textarea's accessible name.",
        required: "Shows a red asterisk and sets `aria-required`. It only marks the field.",
        loading:
          "Disables the textarea and the action, sets `aria-busy` and shows a spinner in the footer bar.",
        disabled: "Disables the textarea and the action and dims the label.",
        info: "Content of the info tooltip, also part of the textarea's accessible description.",
        helperText: "Text below the field, part of its accessible description.",
        error: "Destructive frame, label and helper text, plus `aria-invalid`.",
        errorMessage: "Replaces `helperText` while `error` is true, announced as an alert.",
        action: "The button in the footer bar. See the `action` table.",
        minRows: "Lines shown when empty. The field never gets shorter, even when resized.",
        maxRows:
          "Lines the field grows to before it scrolls. Also the limit for manual resizing. `Infinity` removes it.",
        resize:
          "Shows a handle to drag the field taller or shorter. The dragged height becomes the new minimum.",
        showCount:
          "Shows a counter in the footer bar: `count/maxLength`, or the count alone without `maxLength`.",
        maxLength: "Native limit on the number of characters; the counter turns red when reached.",
        countLabel:
          'What assistive technology hears for the counter, given the remaining characters. Defaults to "n characters remaining".',
        actionShortcut:
          "Ctrl+Enter (Cmd+Enter on macOS) presses the action. Enter alone still adds a new line.",
        className: "Extra classes for the root element.",
        classNames: "Extra classes per part. See the `classNames` table.",
        loadingLabel: "Accessible label of the spinner.",
        infoLabel: "Accessible name of the info button.",
        ref: "Reaches the `<textarea>`. Other native props (`value`, `onChange`, `placeholder`, `name`…) are passed to it; `rows` is replaced by `minRows`.",
      },
      action: {
        children: "Text or a single icon element.",
        tooltip: "Tooltip shown on hover and focus.",
        onClick: "Called when the button is clicked or the shortcut is pressed.",
        "aria-label": "Accessible name. Required when `children` is only an icon.",
        variant: "Any Button variant. `default` works well for a primary action such as Send.",
        size: "Height and padding; the default fits the footer bar.",
        disabled:
          "Disables only the button. Forced while the field is disabled or loading; the shortcut does nothing then.",
        type: "Native button type; `button`, so it never submits a form by accident.",
      },
      classNames: {
        root: "Root element (same as `className`).",
        header: "Row with the label and the info button.",
        label: "The label.",
        requiredMark: "The red asterisk.",
        info: "The info button.",
        control: "The frame: border, ring and background.",
        input: "The `<textarea>`.",
        footer: "The footer bar with the spinner, counter and action.",
        helper: "The helper text or the error message.",
        action: "The action button.",
      },
    },
    stories: {
      States:
        "Required with info, helper text, error with a message, loading (spinner in the footer bar) and disabled.",
      AutoGrow:
        "Type several lines: the field grows line by line up to `maxRows` and then scrolls, while the footer bar stays attached to the bottom edge.",
      CharacterCounter:
        "With `maxLength` and `showCount`, the counter shows how much is used and turns red at the limit.",
      CommentComposer:
        "A composer: the Post button is disabled while the text is empty, and Ctrl+Enter (Cmd+Enter) posts without leaving the keyboard.",
      NoResize: "`resize={false}` removes the drag handle; the field still grows with its content.",
      Responsive:
        "In a narrow container the label wraps, the field shrinks without overflowing, and the footer bar wraps if it must.",
    },
    keyboard: {
      Tab: "Moves focus to the info button, then the textarea, then the action.",
      "Shift + Tab": "Moves focus back in the same order.",
      Enter: "Inside the textarea, adds a new line. On the action, presses it.",
      "Ctrl + Enter":
        "With `actionShortcut`, presses the action from inside the textarea (Cmd + Enter on macOS).",
      Escape: "Closes the open tooltip.",
    },
    aria: [
      "The label is associated with the textarea, so it is its accessible name; `required` sets `aria-required`.",
      "The visible counter is hidden from screen readers. Instead, the remaining characters are part of the textarea's description, and a polite live region announces them once the user pauses typing, not on every keystroke.",
      'With `actionShortcut`, the action exposes `aria-keyshortcuts="Control+Enter Meta+Enter"`.',
      "The action sits in the footer bar, after the textarea in reading and tab order, and never covers the text or the resize handle.",
      "An icon-only action needs `aria-label`; a development warning is logged when it is missing.",
    ],
    theming: [
      "Error state uses `--destructive`; the frame uses `--input` and the focus ring `--ring`. The footer bar is separated by a `--border` line.",
      "Parts carry `data-slot`: `input-group-control` (the textarea), `field-counter` (with `data-limit` at the limit), `field-action`, `field-loading`.",
      "Use `classNames.footer` to restyle the footer bar, for example to drop its divider.",
    ],
  },
  es: {
    summary:
      "Un input de texto multilínea con el mismo label, asterisco de obligatorio, tooltip de información, texto de ayuda, error y estados de carga y deshabilitado que todos los fields. Crece con su contenido, el usuario puede redimensionarlo, y guarda su spinner, contador de caracteres y acción en una barra inferior pegada al borde de abajo.",
    whenToUse: [
      "Para texto que puede ocupar varias líneas: comentarios, descripciones, biografías, mensajes, notas.",
      "Cuando al usuario le ayuda ver cuánto puede escribir aún: activa `showCount` con `maxLength`.",
      "Para compositores rápidos en los que una acción envía el texto: añade `action` y `actionShortcut`.",
    ],
    whenNotToUse: [
      "Dentro de un `FormProvider` de react-hook-form: usa Text Area Control, que se ve igual y se vincula al formulario.",
      "Para una sola línea (un nombre, un título, una búsqueda): usa Text Field.",
      "Para texto con formato (negrita, enlaces, listas): hace falta un editor de texto enriquecido.",
    ],
    anatomy: {
      TextAreaField:
        "La fila de cabecera común (label, asterisco rojo, botón de información), un marco con el textarea y, cuando hace falta, una barra inferior pegada a su borde de abajo (spinner y contador al inicio, acción al final), y después el texto de ayuda o el mensaje de error.",
      action:
        "El objeto que recibe `action`: un botón al final de la barra inferior, así nunca queda al lado del texto por mucho que crezca el campo.",
      classNames:
        "Clases extra por parte, aplicadas después de las de por defecto. `footer` apunta a la barra inferior, que solo tienen los campos multilínea.",
    },
    props: {
      TextAreaField: {
        label: "Texto sobre el campo. Se convierte en el nombre accesible del textarea.",
        required: "Muestra un asterisco rojo y pone `aria-required`. Solo marca el campo.",
        loading:
          "Deshabilita el textarea y la acción, pone `aria-busy` y muestra un spinner en la barra inferior.",
        disabled: "Deshabilita el textarea y la acción y atenúa el label.",
        info: "Contenido del tooltip de información, también parte de la descripción accesible del textarea.",
        helperText: "Texto bajo el campo, parte de su descripción accesible.",
        error: "Marco, label y texto de ayuda en color destructivo, más `aria-invalid`.",
        errorMessage: "Sustituye a `helperText` mientras `error` es true; se anuncia como alerta.",
        action: "El botón de la barra inferior. Ver la tabla `action`.",
        minRows:
          "Líneas que se ven con el campo vacío. Nunca se hace más bajo, ni al redimensionarlo.",
        maxRows:
          "Líneas hasta las que crece antes de hacer scroll. También es el límite al redimensionarlo a mano. `Infinity` lo quita.",
        resize:
          "Muestra un asa para arrastrar el campo y hacerlo más alto o más bajo. La altura elegida pasa a ser el nuevo mínimo.",
        showCount:
          "Muestra un contador en la barra inferior: `cuenta/maxLength`, o solo la cuenta sin `maxLength`.",
        maxLength: "Límite nativo de caracteres; el contador se pone en rojo al alcanzarlo.",
        countLabel:
          'Lo que escuchan las tecnologías de asistencia para el contador, a partir de los caracteres restantes. Por defecto "n characters remaining".',
        actionShortcut:
          "Ctrl+Enter (Cmd+Enter en macOS) pulsa la acción. Enter solo sigue haciendo un salto de línea.",
        className: "Clases extra para la raíz.",
        classNames: "Clases extra por parte. Ver la tabla `classNames`.",
        loadingLabel: "Etiqueta accesible del spinner.",
        infoLabel: "Nombre accesible del botón de información.",
        ref: "Apunta al `<textarea>`. El resto de props nativas (`value`, `onChange`, `placeholder`, `name`…) llegan a él; `rows` se sustituye por `minRows`.",
      },
      action: {
        children: "Texto o un único icono.",
        tooltip: "Tooltip que se muestra con hover y foco.",
        onClick: "Se llama al pulsar el botón o el atajo.",
        "aria-label": "Nombre accesible. Obligatorio cuando `children` es solo un icono.",
        variant:
          "Cualquier variante de Button. `default` va bien para una acción principal como Enviar.",
        size: "Altura y padding; el valor por defecto encaja en la barra inferior.",
        disabled:
          "Deshabilita solo el botón. Se fuerza mientras el campo está deshabilitado o cargando; entonces el atajo no hace nada.",
        type: "Tipo nativo del botón; `button`, para que nunca envíe un formulario por accidente.",
      },
      classNames: {
        root: "La raíz (igual que `className`).",
        header: "La fila con el label y el botón de información.",
        label: "El label.",
        requiredMark: "El asterisco rojo.",
        info: "El botón de información.",
        control: "El marco: borde, anillo y fondo.",
        input: "El `<textarea>`.",
        footer: "La barra inferior con el spinner, el contador y la acción.",
        helper: "El texto de ayuda o el mensaje de error.",
        action: "El botón de acción.",
      },
    },
    stories: {
      States:
        "Obligatorio con información, texto de ayuda, error con mensaje, cargando (spinner en la barra inferior) y deshabilitado.",
      AutoGrow:
        "Escribe varias líneas: el campo crece línea a línea hasta `maxRows` y luego hace scroll, mientras la barra inferior sigue pegada al borde de abajo.",
      CharacterCounter:
        "Con `maxLength` y `showCount`, el contador muestra cuánto se ha usado y se pone en rojo al llegar al límite.",
      CommentComposer:
        "Un compositor: el botón Publicar está deshabilitado mientras el texto está vacío, y Ctrl+Enter (Cmd+Enter) publica sin soltar el teclado.",
      NoResize:
        "`resize={false}` quita el asa de arrastre; el campo sigue creciendo con su contenido.",
      Responsive:
        "En un contenedor estrecho el label se parte en líneas, el campo se encoge sin desbordar y la barra inferior pasa a otra línea si hace falta.",
    },
    keyboard: {
      Tab: "Mueve el foco al botón de información, luego al textarea y luego a la acción.",
      "Shift + Tab": "Mueve el foco hacia atrás en el mismo orden.",
      Enter: "Dentro del textarea, hace un salto de línea. En la acción, la pulsa.",
      "Ctrl + Enter":
        "Con `actionShortcut`, pulsa la acción desde dentro del textarea (Cmd + Enter en macOS).",
      Escape: "Cierra el tooltip abierto.",
    },
    aria: [
      "El label se asocia al textarea, así que es su nombre accesible; `required` pone `aria-required`.",
      "El contador visible está oculto para los lectores de pantalla. En su lugar, los caracteres restantes forman parte de la descripción del textarea, y una región live educada los anuncia cuando el usuario deja de escribir, no en cada tecla.",
      'Con `actionShortcut`, la acción expone `aria-keyshortcuts="Control+Enter Meta+Enter"`.',
      "La acción está en la barra inferior, después del textarea en el orden de lectura y de tabulación, y nunca tapa el texto ni el asa de redimensionar.",
      "Una acción solo con icono necesita `aria-label`; si falta, se registra un aviso en desarrollo.",
    ],
    theming: [
      "El estado de error usa `--destructive`; el marco usa `--input` y el anillo de foco `--ring`. La barra inferior se separa con una línea de `--border`.",
      "Las partes llevan `data-slot`: `input-group-control` (el textarea), `field-counter` (con `data-limit` en el límite), `field-action`, `field-loading`.",
      "Usa `classNames.footer` para cambiar el estilo de la barra inferior, por ejemplo para quitar su línea divisoria.",
    ],
  },
});
