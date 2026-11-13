import { defineComponentDocs } from "@sb/docs/define-component-docs";

export const docs = defineComponentDocs({
  name: "Marker",
  importPath: "@aureus-core/ui/shadcn/marker",
  exports: ["Marker", "MarkerIcon", "MarkerContent", "markerVariants"],
  api: {
    Marker: {
      variant: { type: '"default" | "separator" | "border"', default: '"default"' },
      asChild: { type: "boolean", default: "false" },
    },
    MarkerIcon: { children: { type: "ReactNode" } },
    MarkerContent: { children: { type: "ReactNode" } },
    markerVariants: { variant: { type: '"default" | "separator" | "border"' } },
  },
  stories: ["Variants", "InConversation", "AsLink"],
  keyboard: [],
  links: [{ label: "shadcn/ui", href: "https://ui.shadcn.com/" }],
  en: {
    summary:
      "A small muted line inside a conversation: a date divider, “Ada joined”, “Thinking…”, “Used 3 tools”. It marks events between messages.",
    whenToUse: [
      "For dates and system events between chat messages.",
      "For assistant status lines (thinking, searching, tool calls) above an answer.",
    ],
    whenNotToUse: [
      "For errors the user must act on: use Alert.",
      "For section headings in a page: use a heading.",
    ],
    anatomy: {
      Marker: "The muted row; `separator` draws lines on both sides, `border` a bottom border.",
      MarkerIcon: "A decorative icon (`aria-hidden`).",
      MarkerContent: "The text.",
      markerVariants: "The class generator.",
    },
    props: {
      Marker: {
        variant:
          "`default` plain text; `separator` centered text between lines; `border` underlined row.",
        asChild: "Render a link or button with the marker look.",
      },
      MarkerIcon: { children: "An icon." },
      MarkerContent: { children: "Marker text." },
      markerVariants: { variant: "Same values as Marker." },
    },
    stories: {
      Variants: "The three variants.",
      InConversation: "A date separator and a join event between messages.",
      AsLink: "`asChild` with a link, e.g. “View 3 sources”.",
    },
    keyboard: {},
    aria: [
      "Markers are text; MarkerIcon is hidden from assistive technology.",
      'Inside a `role="log"` transcript, new markers are announced with the messages.',
      "Use `<time dateTime>` inside date markers.",
    ],
    theming: [
      "Text: `--muted-foreground`, `text-sm`. Lines and border: `--border`.",
      "Links inside are underlined and turn `--foreground` on hover.",
    ],
  },
  es: {
    summary:
      "Una línea pequeña y atenuada dentro de una conversación: un separador de fecha, “Ada se ha unido”, “Pensando…”, “Usó 3 herramientas”. Marca eventos entre mensajes.",
    whenToUse: [
      "Para fechas y eventos del sistema entre mensajes de chat.",
      "Para líneas de estado del asistente (pensando, buscando, llamadas a herramientas) sobre una respuesta.",
    ],
    whenNotToUse: [
      "Para errores sobre los que el usuario debe actuar: usa Alert.",
      "Para títulos de sección de una página: usa un encabezado.",
    ],
    anatomy: {
      Marker:
        "La fila atenuada; `separator` dibuja líneas a ambos lados, `border` un borde inferior.",
      MarkerIcon: "Un icono decorativo (`aria-hidden`).",
      MarkerContent: "El texto.",
      markerVariants: "El generador de clases.",
    },
    props: {
      Marker: {
        variant:
          "`default` texto simple; `separator` texto centrado entre líneas; `border` fila subrayada.",
        asChild: "Renderiza un enlace o botón con el aspecto de marker.",
      },
      MarkerIcon: { children: "Un icono." },
      MarkerContent: { children: "Texto del marker." },
      markerVariants: { variant: "Los mismos valores que Marker." },
    },
    stories: {
      Variants: "Las tres variantes.",
      InConversation: "Un separador de fecha y un evento de entrada entre mensajes.",
      AsLink: "`asChild` con un enlace, p. ej. “Ver 3 fuentes”.",
    },
    keyboard: {},
    aria: [
      "Los markers son texto; MarkerIcon se oculta a las tecnologías de asistencia.",
      'Dentro de una transcripción `role="log"`, los markers nuevos se anuncian con los mensajes.',
      "Usa `<time dateTime>` dentro de los markers de fecha.",
    ],
    theming: [
      "Texto: `--muted-foreground`, `text-sm`. Líneas y borde: `--border`.",
      "Los enlaces de dentro se subrayan y pasan a `--foreground` al pasar el ratón.",
    ],
  },
});
