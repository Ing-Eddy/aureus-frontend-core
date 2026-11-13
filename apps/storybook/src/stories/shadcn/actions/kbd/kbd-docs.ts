import { defineComponentDocs } from "@sb/docs/define-component-docs";

export const docs = defineComponentDocs({
  name: "Kbd",
  importPath: "@aureus-core/ui/shadcn/kbd",
  exports: ["Kbd", "KbdGroup"],
  primitive: {
    label: "<kbd> (HTML)",
    href: "https://developer.mozilla.org/docs/Web/HTML/Element/kbd",
  },
  api: {
    Kbd: { children: { type: "ReactNode", required: true } },
    KbdGroup: { children: { type: "ReactNode", required: true } },
  },
  stories: ["Group", "InText", "InButton"],
  keyboard: [],
  links: [
    { label: "shadcn/ui: Kbd", href: "https://ui.shadcn.com/docs/components/kbd" },
    { label: "MDN: <kbd>", href: "https://developer.mozilla.org/docs/Web/HTML/Element/kbd" },
  ],
  en: {
    summary:
      "Displays a key or a keyboard shortcut. It is a styled `<kbd>` element; KbdGroup lays out a combination.",
    whenToUse: [
      "To show shortcuts in menus, tooltips, buttons and help text.",
      "In documentation, to name the keys the user must press.",
    ],
    whenNotToUse: [
      "For code or values: use `<code>`.",
      "As an interactive element: it is display only.",
    ],
    anatomy: {
      Kbd: 'A `<kbd>` with `data-slot="kbd"`: a small muted key cap.',
      KbdGroup: "Lays out several Kbd elements in a row with a small gap.",
    },
    props: {
      Kbd: { children: "The key label: a symbol (⌘, ⇧, ⏎) or a word (Ctrl, Esc)." },
      KbdGroup: { children: "Kbd elements and optional separators like “+”." },
    },
    stories: {
      Group: "Combinations with KbdGroup: symbols and words.",
      InText: "Keys inline in a sentence.",
      InButton: "A shortcut hint inside a button and inside a tooltip.",
    },
    keyboard: {},
    aria: [
      "`<kbd>` is read as normal text; symbols like ⌘ are announced by name by most screen readers.",
      "For the shortcut itself, add `aria-keyshortcuts` on the control it triggers.",
      "Inside a button, the key text becomes part of the button's name; keep the main label first.",
    ],
    theming: [
      "Background `--muted`, text `--muted-foreground` (fixed for contrast in `theme.css`).",
      "Inside a tooltip it inverts to match the tooltip colors.",
    ],
  },
  es: {
    summary:
      "Muestra una tecla o un atajo de teclado. Es un elemento `<kbd>` con estilos; KbdGroup dispone una combinación.",
    whenToUse: [
      "Para mostrar atajos en menús, tooltips, botones y textos de ayuda.",
      "En documentación, para nombrar las teclas que el usuario debe pulsar.",
    ],
    whenNotToUse: [
      "Para código o valores: usa `<code>`.",
      "Como elemento interactivo: es solo visual.",
    ],
    anatomy: {
      Kbd: 'Un `<kbd>` con `data-slot="kbd"`: una pequeña tecla atenuada.',
      KbdGroup: "Dispone varios Kbd en fila con un pequeño espacio.",
    },
    props: {
      Kbd: { children: "La etiqueta de la tecla: un símbolo (⌘, ⇧, ⏎) o una palabra (Ctrl, Esc)." },
      KbdGroup: { children: "Elementos Kbd y separadores opcionales como “+”." },
    },
    stories: {
      Group: "Combinaciones con KbdGroup: símbolos y palabras.",
      InText: "Teclas dentro de una frase.",
      InButton: "Una pista de atajo dentro de un botón y dentro de un tooltip.",
    },
    keyboard: {},
    aria: [
      "`<kbd>` se lee como texto normal; la mayoría de lectores anuncian los símbolos como ⌘ por su nombre.",
      "Para el atajo en sí, añade `aria-keyshortcuts` en el control que activa.",
      "Dentro de un botón, el texto de la tecla pasa a formar parte del nombre; deja la etiqueta principal primero.",
    ],
    theming: [
      "Fondo `--muted`, texto `--muted-foreground` (ajustado por contraste en `theme.css`).",
      "Dentro de un tooltip se invierte para coincidir con sus colores.",
    ],
  },
});
