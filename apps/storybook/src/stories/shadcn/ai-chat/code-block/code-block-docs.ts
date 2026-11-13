import { defineComponentDocs } from "@sb/docs/define-component-docs";

const node = { children: { type: "ReactNode" } };

export const docs = defineComponentDocs({
  name: "Code Block",
  importPath: "@aureus-core/ui/shadcn/code-block",
  exports: [
    "CodeBlock",
    "CodeBlockHeader",
    "CodeBlockTitle",
    "CodeBlockActions",
    "CodeBlockCopyButton",
    "CodeBlockContent",
    "CodeBlockLine",
    "CodeBlockFooter",
  ],
  api: {
    CodeBlock: {
      variant: { type: '"default" | "destructive"', default: '"default"' },
      size: { type: '"default" | "sm"', default: '"default"' },
    },
    CodeBlockHeader: node,
    CodeBlockTitle: node,
    CodeBlockActions: node,
    CodeBlockCopyButton: {
      value: { type: "string", required: true },
      onClick: { type: "(event: MouseEvent) => void" },
    },
    CodeBlockContent: {
      lineNumbers: { type: "boolean", default: "false" },
      startLine: { type: "number", default: "1" },
      wrap: { type: "boolean", default: "false" },
    },
    CodeBlockLine: {
      variant: { type: '"default" | "added" | "removed" | "highlighted"', default: '"default"' },
    },
    CodeBlockFooter: node,
  },
  stories: ["Languages", "HighlightedLines", "Diff", "LongBlock", "Loading", "ErrorOutput"],
  keyboard: ["Tab", "Enter / Space", "← / →"],
  links: [
    { label: "shadcn/ui", href: "https://ui.shadcn.com/" },
    { label: "Shiki", href: "https://shiki.style/" },
  ],
  en: {
    summary:
      "A framed block of code with a header, copy button, optional line numbers and per-line states (highlighted, added, removed). Pair it with `useHighlightedCode` from `@aureus-core/ui/hooks/use-highlighted-code` for Shiki syntax highlighting that loads lazily and supports streaming.",
    whenToUse: [
      "For code in assistant answers, docs and settings (API keys, snippets, commands).",
      "For diffs and logs where individual lines need emphasis.",
    ],
    whenNotToUse: [
      "For inline code inside a sentence: use `<code>`.",
      "For editable code: use an editor (CodeMirror, Monaco).",
    ],
    anatomy: {
      CodeBlock: "The frame; `destructive` styles error output.",
      CodeBlockHeader: "Top bar with the title and actions.",
      CodeBlockTitle: "File name or language label.",
      CodeBlockActions: "Right-aligned buttons.",
      CodeBlockCopyButton:
        "Copies `value` to the clipboard; its name changes to “Copied” and a live region announces it.",
      CodeBlockContent: "The `<pre><code>`: focusable, scrolls horizontally, always left-to-right.",
      CodeBlockLine: "One line; `variant` marks it highlighted, added (+) or removed (−).",
      CodeBlockFooter: "Bottom bar for notes or actions.",
    },
    props: {
      CodeBlock: {
        variant: "`destructive` for error output.",
        size: "`sm` uses smaller text and padding.",
      },
      CodeBlockHeader: { children: "Title and actions." },
      CodeBlockTitle: { children: "Title text." },
      CodeBlockActions: { children: "Buttons, e.g. CodeBlockCopyButton." },
      CodeBlockCopyButton: {
        value: "Text to copy (usually the raw code).",
        onClick: "Called before copying.",
      },
      CodeBlockContent: {
        lineNumbers: "Shows line numbers; with a string child it also splits the lines for you.",
        startLine: "Number of the first line.",
        wrap: "Wraps long lines instead of scrolling.",
      },
      CodeBlockLine: { variant: "Line state." },
      CodeBlockFooter: { children: "Footer content." },
    },
    stories: {
      Languages:
        "TypeScript, Python and Bash highlighted by `useHighlightedCode`; grammars load on demand.",
      HighlightedLines: '`variant="highlighted"` on selected lines with line numbers.',
      Diff: "`added` and `removed` lines with + and − markers.",
      LongBlock: "A long block that scrolls, starting at line 120.",
      Loading:
        "Before the grammar loads, the hook returns plain lines, so the code is readable immediately.",
      ErrorOutput: '`variant="destructive"` for a stack trace.',
    },
    keyboard: {
      Tab: "Moves to the copy button and then into the code (the `<pre>` is focusable).",
      "Enter / Space": "On the copy button: copies the code.",
      "← / →": "With the code focused, scrolls long lines horizontally.",
    },
    aria: [
      "The copy button is named “Copy” and becomes “Copied”; a polite live region announces the copy.",
      "The code area is focusable so keyboard users can scroll it; the `+`/`−` markers are CSS content, so also describe diffs in text when they matter.",
      'Code is forced to `dir="ltr"` so it reads correctly inside RTL pages.',
    ],
    theming: [
      "Frame: `--input` border; destructive: `--destructive`. Highlighted and added lines: `--muted`; removed: `--destructive` at 10%.",
      "Syntax colors come from Shiki's GitHub light and dark themes and follow the `.dark` class. Some light-theme tokens are below WCAG AA (orange `#e36209` is 3.48:1); the theme is fixed in the package's highlighter.",
    ],
  },
  es: {
    summary:
      "Un bloque de código enmarcado con cabecera, botón de copiar, números de línea opcionales y estados por línea (resaltada, añadida, eliminada). Combínalo con `useHighlightedCode` de `@aureus-core/ui/hooks/use-highlighted-code` para el resaltado de sintaxis de Shiki, que carga bajo demanda y admite streaming.",
    whenToUse: [
      "Para código en respuestas del asistente, documentación y ajustes (claves de API, fragmentos, comandos).",
      "Para diffs y registros donde hay que destacar líneas concretas.",
    ],
    whenNotToUse: [
      "Para código dentro de una frase: usa `<code>`.",
      "Para código editable: usa un editor (CodeMirror, Monaco).",
    ],
    anatomy: {
      CodeBlock: "El marco; `destructive` da estilo a una salida de error.",
      CodeBlockHeader: "Barra superior con el título y las acciones.",
      CodeBlockTitle: "Nombre del archivo o etiqueta del lenguaje.",
      CodeBlockActions: "Botones alineados a la derecha.",
      CodeBlockCopyButton:
        "Copia `value` al portapapeles; su nombre cambia a “Copied” y una región viva lo anuncia.",
      CodeBlockContent:
        "El `<pre><code>`: enfocable, con desplazamiento horizontal, siempre de izquierda a derecha.",
      CodeBlockLine: "Una línea; `variant` la marca como resaltada, añadida (+) o eliminada (−).",
      CodeBlockFooter: "Barra inferior para notas o acciones.",
    },
    props: {
      CodeBlock: {
        variant: "`destructive` para salidas de error.",
        size: "`sm` usa texto y padding más pequeños.",
      },
      CodeBlockHeader: { children: "Título y acciones." },
      CodeBlockTitle: { children: "Texto del título." },
      CodeBlockActions: { children: "Botones, p. ej. CodeBlockCopyButton." },
      CodeBlockCopyButton: {
        value: "Texto que se copia (normalmente el código sin formato).",
        onClick: "Se llama antes de copiar.",
      },
      CodeBlockContent: {
        lineNumbers:
          "Muestra los números de línea; con un hijo de texto también separa las líneas por ti.",
        startLine: "Número de la primera línea.",
        wrap: "Ajusta las líneas largas en lugar de desplazar.",
      },
      CodeBlockLine: { variant: "Estado de la línea." },
      CodeBlockFooter: { children: "Contenido del pie." },
    },
    stories: {
      Languages:
        "TypeScript, Python y Bash resaltados con `useHighlightedCode`; las gramáticas se cargan bajo demanda.",
      HighlightedLines: '`variant="highlighted"` en líneas concretas con números de línea.',
      Diff: "Líneas `added` y `removed` con marcas + y −.",
      LongBlock: "Un bloque largo con desplazamiento, que empieza en la línea 120.",
      Loading:
        "Antes de que cargue la gramática, el hook devuelve líneas planas, así que el código se lee al instante.",
      ErrorOutput: '`variant="destructive"` para una traza de error.',
    },
    keyboard: {
      Tab: "Va al botón de copiar y luego al código (el `<pre>` es enfocable).",
      "Enter / Space": "En el botón de copiar: copia el código.",
      "← / →": "Con el código enfocado, desplaza las líneas largas en horizontal.",
    },
    aria: [
      "El botón de copiar se llama “Copy” y pasa a “Copied”; una región viva educada anuncia la copia.",
      "El área de código es enfocable para poder desplazarla con teclado; las marcas `+`/`−` son contenido CSS, así que describe también los diffs con texto cuando importen.",
      'El código se fuerza a `dir="ltr"` para que se lea bien dentro de páginas RTL.',
    ],
    theming: [
      "Marco: borde `--input`; destructivo: `--destructive`. Líneas resaltadas y añadidas: `--muted`; eliminadas: `--destructive` al 10%.",
      "Los colores de sintaxis vienen de los temas GitHub claro y oscuro de Shiki y siguen la clase `.dark`. Algunos tokens del tema claro no llegan a WCAG AA (el naranja `#e36209` da 3.48:1); el tema está fijado en el highlighter del paquete.",
    ],
  },
});
