import { defineComponentDocs } from "@sb/docs/define-component-docs";

export const docs = defineComponentDocs({
  name: "Textarea",
  importPath: "@aureus-core/ui/shadcn/textarea",
  exports: ["Textarea"],
  primitive: {
    label: "<textarea> (HTML)",
    href: "https://developer.mozilla.org/docs/Web/HTML/Element/textarea",
  },
  api: {
    Textarea: {
      placeholder: { type: "string" },
      rows: { type: "number" },
      maxLength: { type: "number" },
      disabled: { type: "boolean", default: "false" },
      "aria-invalid": { type: "boolean" },
      value: { type: "string" },
      onChange: { type: "(event: ChangeEvent<HTMLTextAreaElement>) => void" },
    },
  },
  stories: ["Disabled", "Invalid", "WithCounter"],
  keyboard: ["Tab", "Enter"],
  links: [
    { label: "shadcn/ui: Textarea", href: "https://ui.shadcn.com/docs/components/textarea" },
    {
      label: "MDN: <textarea>",
      href: "https://developer.mozilla.org/docs/Web/HTML/Element/textarea",
    },
  ],
  en: {
    summary:
      "A multi-line text field that grows with its content (`field-sizing: content`). It is a styled native `<textarea>`.",
    whenToUse: [
      "For free text longer than one line: comments, descriptions, messages.",
      "Inside a Field or an InputGroup, for a label, help text or inline actions.",
    ],
    whenNotToUse: [
      "For a single short value: use Input.",
      "For rich text with formatting: use a dedicated editor.",
    ],
    anatomy: {
      Textarea:
        'The `<textarea>` element, with `data-slot="textarea"`. Its minimum height is `min-h-16` and it grows as you type.',
    },
    props: {
      Textarea: {
        placeholder: "Hint shown while empty. It does not replace a label.",
        rows: "Initial visible rows. Content still grows the field beyond it.",
        maxLength: "Maximum number of characters the browser accepts.",
        disabled: "Blocks editing and removes the field from the tab order.",
        "aria-invalid": "Shows the destructive border and ring.",
        value: "Controlled value. Pair it with `onChange`.",
        onChange: "Fires on every edit with the new text in `event.target.value`.",
      },
    },
    stories: {
      Disabled: "A disabled textarea ignores typing.",
      Invalid: "`aria-invalid` plus an error linked with `aria-describedby`.",
      WithCounter: "A controlled textarea with `maxLength` and a live character counter.",
    },
    keyboard: {
      Tab: "Moves focus into the textarea (Tab does not insert a tab character).",
      Enter: "Inserts a new line; it never submits the form.",
    },
    aria: [
      "A native `<textarea>`: the browser exposes it as a multi-line text box.",
      "Name it with a `<Label htmlFor>` or `aria-label`.",
      "Announce limits and errors through `aria-describedby`.",
    ],
    theming: [
      "Same tokens as Input: `--input`, `--ring`, `--destructive`, `--muted-foreground`.",
      'Disable auto-grow with `className="field-sizing-fixed"` and set `rows`.',
    ],
  },
  es: {
    summary:
      "Un campo de texto de varias líneas que crece con su contenido (`field-sizing: content`). Es un `<textarea>` nativo con estilos.",
    whenToUse: [
      "Para texto libre de más de una línea: comentarios, descripciones, mensajes.",
      "Dentro de un Field o un InputGroup, para tener etiqueta, ayuda o acciones en línea.",
    ],
    whenNotToUse: [
      "Para un valor corto: usa Input.",
      "Para texto enriquecido con formato: usa un editor específico.",
    ],
    anatomy: {
      Textarea:
        'El elemento `<textarea>`, con `data-slot="textarea"`. Su altura mínima es `min-h-16` y crece al escribir.',
    },
    props: {
      Textarea: {
        placeholder: "Pista visible mientras está vacío. No sustituye a una etiqueta.",
        rows: "Filas visibles al inicio. El contenido puede hacer crecer el campo más allá.",
        maxLength: "Número máximo de caracteres que acepta el navegador.",
        disabled: "Bloquea la edición y saca el campo del orden de tabulación.",
        "aria-invalid": "Muestra el borde y el anillo destructivos.",
        value: "Valor controlado. Úsalo junto con `onChange`.",
        onChange: "Se dispara en cada edición con el texto nuevo en `event.target.value`.",
      },
    },
    stories: {
      Disabled: "Un textarea deshabilitado ignora lo que se escribe.",
      Invalid: "`aria-invalid` más un error enlazado con `aria-describedby`.",
      WithCounter: "Un textarea controlado con `maxLength` y un contador de caracteres en vivo.",
    },
    keyboard: {
      Tab: "Mueve el foco al textarea (Tab no inserta un tabulador).",
      Enter: "Inserta un salto de línea; nunca envía el formulario.",
    },
    aria: [
      "Un `<textarea>` nativo: el navegador lo expone como un cuadro de texto de varias líneas.",
      "Ponle nombre con un `<Label htmlFor>` o `aria-label`.",
      "Anuncia los límites y errores mediante `aria-describedby`.",
    ],
    theming: [
      "Los mismos tokens que Input: `--input`, `--ring`, `--destructive`, `--muted-foreground`.",
      'Desactiva el crecimiento automático con `className="field-sizing-fixed"` y usa `rows`.',
    ],
  },
});
