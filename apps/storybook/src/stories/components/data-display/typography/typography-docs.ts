import { defineComponentDocs } from "@sb/docs/define-component-docs";

export const docs = defineComponentDocs({
  name: "Typography",
  importPath: "@aureus-core/ui/components/typography",
  exports: ["Typography", "typographyVariants", "typographyElements"],
  api: {
    Typography: {
      variant: {
        type: '"display" | "h1" … "h6" | "lead" | "body-lg" | "body" | "body-sm" | "label" | "caption" | "overline" | "code"',
        default: '"body"',
      },
      as: {
        type: '"h1" … "h6" | "p" | "span" | "div" | "label" | "strong" | "em" | "small" | "code" | "blockquote" | "figcaption" | "legend" | "li" | "dt" | "dd" | "time" | "cite" | "q" | "abbr"',
      },
      asChild: { type: "boolean", default: "false" },
      tone: { type: '"default" | "muted" | "primary" | "destructive"' },
      weight: { type: '"regular" | "medium" | "semibold" | "bold"' },
      align: { type: '"start" | "center" | "end" | "justify"' },
      wrap: { type: '"balance" | "pretty" | "nowrap"' },
      truncate: { type: "boolean", default: "false" },
      lineClamp: { type: "1 | 2 | 3 | 4 | 5 | 6" },
      italic: { type: "boolean", default: "false" },
      tabularNums: { type: "boolean", default: "false" },
      className: { type: "string" },
      children: { type: "ReactNode" },
    },
  },
  stories: [
    "Variants",
    "SemanticVsVisual",
    "Tones",
    "Weights",
    "Truncation",
    "Wrapping",
    "AsChild",
    "Composition",
  ],
  keyboard: [],
  links: [
    { label: "Foundations: Typography", href: "?path=/docs/foundations-typography--docs" },
    { label: "Guide: Theming", href: "?path=/docs/guides-theming--docs" },
    { label: "Fontsource", href: "https://fontsource.org/" },
    {
      label: "WAI: Headings",
      href: "https://www.w3.org/WAI/tutorials/page-structure/headings/",
    },
  ],
  en: {
    summary:
      "Renders text with one of the 15 named styles of the catalog, from `display` to `code`, so every heading, paragraph, label and caption looks the same in every component and app. Each variant renders its natural element. Every modifier is opt-in and changes only its own property. It renders no text of its own.",
    whenToUse: [
      "For any text you would otherwise style with ad-hoc size, weight and line-height classes: page titles, section headings, body text, labels, captions, overlines and inline code.",
      "When the visual level must differ from the document outline: pick the look with `variant` and the heading level with `as`.",
      "To give a link or another element a text style without an extra wrapper, with `asChild`.",
    ],
    whenNotToUse: [
      "For the label of a form field: Field and the `*-field` components already render it with the right association.",
      "For titles of Modal, Card or Sheet: use their own title parts, which carry the accessible name.",
      "For long-form content with lists and quotes that need block spacing: a Prose container is planned for that.",
    ],
    anatomy: {
      Typography:
        'One element (the natural element of the variant, `as`, or the child with `asChild`) with `data-slot="typography"`, `data-variant` and the class `typography-<variant>`.',
    },
    props: {
      Typography: {
        variant:
          "The text style: font role, size, line height, weight, letter spacing and transform. It also picks the natural element: `h1` for `display` and `h1`, `h2`–`h6` for those headings, `p` for `lead` and the body styles, `span` for `label`, `caption` and `overline`, and `code` for `code`.",
        as: 'The element to render. It changes only the element, never the style. Native props are typed for it: `htmlFor` needs `as="label"` and `dateTime` needs `as="time"`.',
        asChild:
          "Renders the only child instead of an element of its own, merging the classes, data attributes and props into it. It cannot be combined with `as`.",
        tone: "Text color from the theme tokens. Without it, the color is inherited.",
        weight: "Overrides the variant's weight and nothing else.",
        align: "Logical text alignment: `start` and `end` follow the text direction.",
        wrap: "How lines break: `balance` evens out short headings, `pretty` avoids a lonely last word, `nowrap` keeps one line.",
        truncate:
          "Keeps the text on one line and ends it with an ellipsis. It cannot be combined with `lineClamp`.",
        lineClamp:
          "Shows at most this many lines and ends the last one with an ellipsis. It cannot be combined with `truncate`.",
        italic: "Renders the text in italics.",
        tabularNums: "Uses fixed-width digits, so numbers line up in columns and counters.",
        className:
          "Applied last. Any Tailwind utility wins over the variant style and over the modifiers.",
        children: "The text. Without children, the element is empty.",
      },
    },
    stories: {
      Variants:
        "The whole catalog with the computed size, line height and weight of each variant. The numbers follow any override of the `--typography-*` variables.",
      SemanticVsVisual:
        'The visual style and the heading level are independent: `variant="h3" as="h2"` looks like an h3 and is a level 2 heading.',
      Tones: "Every tone, plus no tone, which inherits the color of the parent.",
      Weights:
        "`weight` changes only the weight: the size and line height stay those of `body-sm`.",
      Truncation:
        "`truncate` cuts one line, and `lineClamp` cuts after a number of lines. Both work with any variant.",
      Wrapping: "Line breaking of a long heading with no `wrap`, with `balance` and with `pretty`.",
      AsChild: "A link with the `body` style and the primary color, rendered as a single `<a>`.",
      Composition:
        "A page header (overline, h1, lead) and a card mixing headings, strong text, tabular numbers, inline code and a `time` caption.",
    },
    keyboard: {},
    aria: [
      "Heading levels build the document outline that screen reader users navigate. Choose the level with `as` to follow the outline (one `h1`, no skipped levels), and the look with `variant`.",
      '`display` renders an `h1` by default. Use `as="p"` when a large text is decorative and is not the page title.',
      "`truncate` and `lineClamp` only hide text visually: the full text stays in the accessibility tree. When the hidden part matters, show it elsewhere (a tooltip or a details view).",
      "Sizes use `rem`, and fluid sizes keep a `rem` term, so text grows with the browser's font size and page zoom.",
    ],
    theming: [
      "Each variant reads six runtime variables: `--typography-<variant>-{font,size,line-height,weight,tracking,transform}`. Redefine them in `:root` in a stylesheet loaded after `@aureus-core/ui/styles.css`.",
      "Font roles: `--typography-font-sans`, `--typography-font-heading` (defaults to sans), `--typography-font-serif` and `--typography-font-mono`. Tailwind's `font-sans`, `font-heading`, `font-serif` and `font-mono` follow them, so shadcn titles change with the heading font.",
      "The classes `typography-<variant>` work without the component. They live in the `components` cascade layer, so any utility on the same element wins.",
      "Defaults: Geist for sans and headings, Geist Mono for code (both bundled), and the system serif stack.",
    ],
  },
  es: {
    summary:
      "Renderiza texto con uno de los 15 estilos con nombre del catálogo, de `display` a `code`, para que cada título, párrafo, etiqueta y leyenda se vea igual en todos los componentes y apps. Cada variante renderiza su elemento natural. Cada modificador es opcional y cambia solo su propia propiedad. No renderiza ningún texto propio.",
    whenToUse: [
      "Para cualquier texto que de otro modo estilizarías con clases sueltas de tamaño, peso e interlineado: títulos de página, encabezados de sección, texto de cuerpo, etiquetas, leyendas, overlines y código en línea.",
      "Cuando el nivel visual debe diferir del esquema del documento: elige el aspecto con `variant` y el nivel de encabezado con `as`.",
      "Para dar un estilo de texto a un enlace u otro elemento sin un contenedor extra, con `asChild`.",
    ],
    whenNotToUse: [
      "Para la etiqueta de un campo de formulario: Field y los componentes `*-field` ya la renderizan con la asociación correcta.",
      "Para los títulos de Modal, Card o Sheet: usa sus propias partes de título, que llevan el nombre accesible.",
      "Para contenido largo con listas y citas que necesitan espaciado entre bloques: hay un contenedor Prose previsto para eso.",
    ],
    anatomy: {
      Typography:
        'Un elemento (el natural de la variante, `as`, o el hijo con `asChild`) con `data-slot="typography"`, `data-variant` y la clase `typography-<variant>`.',
    },
    props: {
      Typography: {
        variant:
          "El estilo de texto: rol de fuente, tamaño, interlineado, peso, espaciado entre letras y transformación. También elige el elemento natural: `h1` para `display` y `h1`, `h2`–`h6` para esos títulos, `p` para `lead` y los estilos de cuerpo, `span` para `label`, `caption` y `overline`, y `code` para `code`.",
        as: 'El elemento a renderizar. Cambia solo el elemento, nunca el estilo. Las props nativas se tipan para él: `htmlFor` necesita `as="label"` y `dateTime` necesita `as="time"`.',
        asChild:
          "Renderiza el único hijo en lugar de un elemento propio, fusionando en él las clases, los atributos de datos y las props. No se puede combinar con `as`.",
        tone: "Color del texto según los tokens del tema. Sin él, el color se hereda.",
        weight: "Sustituye el peso de la variante y nada más.",
        align: "Alineación lógica: `start` y `end` siguen la dirección del texto.",
        wrap: "Cómo se cortan las líneas: `balance` equilibra los títulos cortos, `pretty` evita una última palabra sola, `nowrap` mantiene una línea.",
        truncate:
          "Mantiene el texto en una línea y lo termina con puntos suspensivos. No se puede combinar con `lineClamp`.",
        lineClamp:
          "Muestra como máximo este número de líneas y termina la última con puntos suspensivos. No se puede combinar con `truncate`.",
        italic: "Muestra el texto en cursiva.",
        tabularNums:
          "Usa dígitos de ancho fijo, para que los números se alineen en columnas y contadores.",
        className:
          "Se aplica al final. Cualquier utilidad de Tailwind gana al estilo de la variante y a los modificadores.",
        children: "El texto. Sin hijos, el elemento queda vacío.",
      },
    },
    stories: {
      Variants:
        "El catálogo completo con el tamaño, el interlineado y el peso calculados de cada variante. Los números siguen cualquier cambio de las variables `--typography-*`.",
      SemanticVsVisual:
        'El estilo visual y el nivel de encabezado son independientes: `variant="h3" as="h2"` se ve como un h3 y es un encabezado de nivel 2.',
      Tones: "Todos los tonos, más ninguno, que hereda el color del padre.",
      Weights:
        "`weight` cambia solo el peso: el tamaño y el interlineado siguen siendo los de `body-sm`.",
      Truncation:
        "`truncate` corta una línea y `lineClamp` corta tras un número de líneas. Ambos funcionan con cualquier variante.",
      Wrapping: "El corte de líneas de un título largo sin `wrap`, con `balance` y con `pretty`.",
      AsChild:
        "Un enlace con el estilo `body` y el color primario, renderizado como un único `<a>`.",
      Composition:
        "Una cabecera de página (overline, h1, lead) y una tarjeta que mezcla títulos, texto destacado, números tabulares, código en línea y una leyenda `time`.",
    },
    keyboard: {},
    aria: [
      "Los niveles de encabezado forman el esquema del documento por el que navegan los usuarios de lectores de pantalla. Elige el nivel con `as` para seguir el esquema (un solo `h1`, sin saltar niveles) y el aspecto con `variant`.",
      '`display` renderiza un `h1` por defecto. Usa `as="p"` cuando un texto grande es decorativo y no es el título de la página.',
      "`truncate` y `lineClamp` solo ocultan el texto visualmente: el texto completo sigue en el árbol de accesibilidad. Si la parte oculta importa, muéstrala en otro sitio (un tooltip o una vista de detalle).",
      "Los tamaños usan `rem`, y los fluidos conservan un término en `rem`, así que el texto crece con el tamaño de fuente del navegador y el zoom.",
    ],
    theming: [
      "Cada variante lee seis variables en tiempo de ejecución: `--typography-<variant>-{font,size,line-height,weight,tracking,transform}`. Redefínelas en `:root` en una hoja de estilos cargada después de `@aureus-core/ui/styles.css`.",
      "Roles de fuente: `--typography-font-sans`, `--typography-font-heading` (por defecto, la sans), `--typography-font-serif` y `--typography-font-mono`. Las utilidades `font-sans`, `font-heading`, `font-serif` y `font-mono` de Tailwind los siguen, así que los títulos de shadcn cambian con la fuente de títulos.",
      "Las clases `typography-<variant>` funcionan sin el componente. Están en la capa de cascada `components`, así que cualquier utilidad en el mismo elemento gana.",
      "Valores por defecto: Geist para sans y títulos, Geist Mono para código (ambas incluidas) y la pila serif del sistema.",
    ],
  },
});
