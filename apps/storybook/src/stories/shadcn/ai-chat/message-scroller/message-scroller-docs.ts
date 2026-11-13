import { defineComponentDocs } from "@sb/docs/define-component-docs";

export const docs = defineComponentDocs({
  name: "Message Scroller",
  importPath: "@aureus-core/ui/shadcn/message-scroller",
  exports: [
    "MessageScrollerProvider",
    "MessageScroller",
    "MessageScrollerViewport",
    "MessageScrollerContent",
    "MessageScrollerItem",
    "MessageScrollerButton",
    "useMessageScroller",
    "useMessageScrollerScrollable",
    "useMessageScrollerVisibility",
  ],
  primitive: { label: "@shadcn/react MessageScroller", href: "https://ui.shadcn.com/" },
  api: {
    MessageScrollerProvider: {
      autoScroll: { type: "boolean", default: "true" },
      defaultScrollPosition: { type: '"start" | "end" | "last-anchor"', default: '"end"' },
      scrollEdgeThreshold: { type: "number" },
      scrollMargin: { type: "number" },
    },
    MessageScroller: { className: { type: "string" } },
    MessageScrollerViewport: {
      "aria-label": { type: "string", default: '"Messages"' },
      preserveScrollOnPrepend: { type: "boolean", default: "false" },
    },
    MessageScrollerContent: { "aria-relevant": { type: "string", default: '"additions"' } },
    MessageScrollerItem: {
      messageId: { type: "string" },
      scrollAnchor: { type: "boolean", default: "false" },
    },
    MessageScrollerButton: {
      direction: { type: '"start" | "end"', default: '"end"' },
      behavior: { type: "ScrollBehavior" },
      variant: { type: "Button variant", default: '"secondary"' },
      size: { type: "Button size", default: '"icon-sm"' },
    },
    useMessageScroller: {
      scrollToEnd: { type: "(options?) => boolean" },
      scrollToStart: { type: "(options?) => boolean" },
      scrollToMessage: { type: "(messageId: string, options?) => boolean" },
    },
    useMessageScrollerScrollable: {
      "{ start, end }": { type: "{ start: boolean; end: boolean }" },
    },
    useMessageScrollerVisibility: {
      "{ currentAnchorId, visibleMessageIds }": {
        type: "{ currentAnchorId: string | null; visibleMessageIds: string[] }",
      },
    },
  },
  stories: ["LongConversation", "StreamingMessages"],
  keyboard: ["Tab", "↑ / ↓ / Page Up / Page Down", "Enter / Space"],
  links: [{ label: "shadcn/ui", href: "https://ui.shadcn.com/" }],
  en: {
    summary:
      "A chat viewport that starts at the latest message, sticks to the bottom while new messages arrive, and shows a “scroll to latest” button when the user scrolls up.",
    whenToUse: [
      "For chat and assistant transcripts that grow at the bottom.",
      "When new messages stream in and the view should follow them unless the user is reading history.",
    ],
    whenNotToUse: [
      "For ordinary scrollable panels: use ScrollArea.",
      "For feeds that grow at the top (newest first): a plain list is simpler.",
    ],
    anatomy: {
      MessageScrollerProvider: "State and options shared by the scroller parts and hooks.",
      MessageScroller: "The relative container that positions the button over the viewport.",
      MessageScrollerViewport:
        'The scrolling `role="region"` (named “Messages”), focusable for keyboard scrolling.',
      MessageScrollerContent: 'The `role="log"` list that announces added messages politely.',
      MessageScrollerItem:
        "One message wrapper; `messageId` enables `scrollToMessage`, `scrollAnchor` marks turns to align to.",
      MessageScrollerButton:
        "Appears when the viewport is not at the edge; scrolls to the end (or start).",
      useMessageScroller: "Imperative scroll helpers.",
      useMessageScrollerScrollable:
        "Whether the viewport can scroll towards the start and the end.",
      useMessageScrollerVisibility: "Which messages are visible and which anchor is current.",
    },
    props: {
      MessageScrollerProvider: {
        autoScroll: "Follow new content while the user is at the end.",
        defaultScrollPosition:
          "Where the viewport starts: the end, the start, or the last anchor item.",
        scrollEdgeThreshold: "Distance in pixels that still counts as “at the edge”.",
        scrollMargin: "Space kept above an item scrolled into view.",
      },
      MessageScroller: { className: "Give the scroller a height, e.g. `h-96`." },
      MessageScrollerViewport: {
        "aria-label": "Name of the scroll region.",
        preserveScrollOnPrepend: "Keep the visual position when older messages load at the top.",
      },
      MessageScrollerContent: {
        "aria-relevant": "What the log announces; `additions` by default.",
      },
      MessageScrollerItem: {
        messageId: "Id used by `scrollToMessage` and the visibility hook.",
        scrollAnchor: "Marks the start of a turn (e.g. each user message).",
      },
      MessageScrollerButton: {
        direction: "Edge to scroll to.",
        behavior: "`smooth` or `instant` scrolling.",
        variant: "Button variant.",
        size: "Button size.",
      },
      useMessageScroller: {
        scrollToEnd: "Scrolls to the latest message.",
        scrollToStart: "Scrolls to the first message.",
        scrollToMessage: "Scrolls a message into view by id.",
      },
      useMessageScrollerScrollable: {
        "{ start, end }": "Booleans: there is content before / after the visible area.",
      },
      useMessageScrollerVisibility: {
        "{ currentAnchorId, visibleMessageIds }":
          "Ids of the current anchor and of the visible messages.",
      },
    },
    stories: {
      LongConversation:
        "40 messages: the view starts at the end; scrolling up reveals the “Scroll to end” button.",
      StreamingMessages: "Adding messages while at the end keeps the newest visible (auto-scroll).",
    },
    keyboard: {
      Tab: "Moves focus to the viewport, then to the scroll button when visible.",
      "↑ / ↓ / Page Up / Page Down": "Scroll the focused viewport.",
      "Enter / Space": "On the button: scrolls to the latest message.",
    },
    aria: [
      'The viewport is a named, focusable `region`; the content is a `role="log"` with `aria-relevant="additions"`.',
      "The button is named “Scroll to end” and is removed from the tab order while hidden.",
      "Avoid also announcing streamed tokens one by one; announce the finished message instead.",
    ],
    theming: [
      "The viewport fades its bottom edge (`scroll-fade-b`) and uses thin scrollbars.",
      "The button is a `secondary` icon Button centred above the bottom edge; change it with `variant`, `size` or `className`.",
    ],
  },
  es: {
    summary:
      "Un viewport de chat que empieza en el último mensaje, se queda abajo mientras llegan mensajes nuevos y muestra un botón “ir al último” cuando el usuario sube.",
    whenToUse: [
      "Para transcripciones de chat y del asistente que crecen por abajo.",
      "Cuando los mensajes llegan en streaming y la vista debe seguirlos salvo que el usuario esté leyendo el historial.",
    ],
    whenNotToUse: [
      "Para paneles desplazables normales: usa ScrollArea.",
      "Para feeds que crecen por arriba (lo más nuevo primero): una lista simple es más sencilla.",
    ],
    anatomy: {
      MessageScrollerProvider: "Estado y opciones compartidos por las partes y hooks del scroller.",
      MessageScroller: "El contenedor relativo que coloca el botón sobre el viewport.",
      MessageScrollerViewport:
        'La `role="region"` desplazable (llamada “Messages”), enfocable para desplazar con teclado.',
      MessageScrollerContent:
        'La lista `role="log"` que anuncia con cortesía los mensajes añadidos.',
      MessageScrollerItem:
        "Envoltorio de un mensaje; `messageId` habilita `scrollToMessage`, `scrollAnchor` marca turnos a los que alinear.",
      MessageScrollerButton:
        "Aparece cuando el viewport no está en el borde; desplaza al final (o al inicio).",
      useMessageScroller: "Funciones imperativas de desplazamiento.",
      useMessageScrollerScrollable:
        "Si el viewport puede desplazarse hacia el inicio y hacia el final.",
      useMessageScrollerVisibility: "Qué mensajes se ven y qué ancla es la actual.",
    },
    props: {
      MessageScrollerProvider: {
        autoScroll: "Sigue el contenido nuevo mientras el usuario está al final.",
        defaultScrollPosition:
          "Dónde empieza el viewport: al final, al inicio o en el último ancla.",
        scrollEdgeThreshold: "Distancia en píxeles que sigue contando como “en el borde”.",
        scrollMargin: "Espacio que se deja sobre un elemento al desplazarlo a la vista.",
      },
      MessageScroller: { className: "Dale una altura al scroller, p. ej. `h-96`." },
      MessageScrollerViewport: {
        "aria-label": "Nombre de la región desplazable.",
        preserveScrollOnPrepend:
          "Mantiene la posición visual cuando se cargan mensajes antiguos arriba.",
      },
      MessageScrollerContent: { "aria-relevant": "Qué anuncia el log; `additions` por defecto." },
      MessageScrollerItem: {
        messageId: "Id que usan `scrollToMessage` y el hook de visibilidad.",
        scrollAnchor: "Marca el inicio de un turno (p. ej. cada mensaje del usuario).",
      },
      MessageScrollerButton: {
        direction: "Borde al que desplazar.",
        behavior: "Desplazamiento `smooth` o `instant`.",
        variant: "Variante del botón.",
        size: "Tamaño del botón.",
      },
      useMessageScroller: {
        scrollToEnd: "Desplaza al último mensaje.",
        scrollToStart: "Desplaza al primer mensaje.",
        scrollToMessage: "Desplaza un mensaje a la vista por su id.",
      },
      useMessageScrollerScrollable: {
        "{ start, end }": "Booleanos: hay contenido antes / después del área visible.",
      },
      useMessageScrollerVisibility: {
        "{ currentAnchorId, visibleMessageIds }":
          "Ids del ancla actual y de los mensajes visibles.",
      },
    },
    stories: {
      LongConversation:
        "40 mensajes: la vista empieza al final; al subir aparece el botón “Scroll to end”.",
      StreamingMessages:
        "Añadir mensajes estando al final mantiene visible el más nuevo (auto-scroll).",
    },
    keyboard: {
      Tab: "Mueve el foco al viewport y luego al botón de desplazamiento cuando se ve.",
      "↑ / ↓ / Page Up / Page Down": "Desplazan el viewport enfocado.",
      "Enter / Space": "En el botón: va al último mensaje.",
    },
    aria: [
      'El viewport es una `region` enfocable y con nombre; el contenido es un `role="log"` con `aria-relevant="additions"`.',
      "El botón se llama “Scroll to end” y sale del orden de tabulación mientras está oculto.",
      "Evita anunciar también los tokens del streaming uno a uno; anuncia el mensaje terminado.",
    ],
    theming: [
      "El viewport difumina su borde inferior (`scroll-fade-b`) y usa barras finas.",
      "El botón es un Button de icono `secondary` centrado sobre el borde inferior; cámbialo con `variant`, `size` o `className`.",
    ],
  },
});
