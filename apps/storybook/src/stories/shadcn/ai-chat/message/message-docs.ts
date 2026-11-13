import { defineComponentDocs } from "@sb/docs/define-component-docs";

const node = { children: { type: "ReactNode" } };

export const docs = defineComponentDocs({
  name: "Message",
  importPath: "@aureus-core/ui/shadcn/message",
  exports: [
    "MessageGroup",
    "Message",
    "MessageAvatar",
    "MessageContent",
    "MessageHeader",
    "MessageFooter",
  ],
  api: {
    MessageGroup: node,
    Message: { align: { type: '"start" | "end"', default: '"start"' } },
    MessageAvatar: node,
    MessageContent: node,
    MessageHeader: node,
    MessageFooter: node,
  },
  stories: ["Conversation", "Grouped", "WithoutAvatar"],
  keyboard: [],
  links: [{ label: "shadcn/ui", href: "https://ui.shadcn.com/" }],
  en: {
    summary:
      'The layout of one chat message: avatar, author header, content (usually a Bubble) and a footer for time or status. `align="end"` puts the user\'s own messages on the right.',
    whenToUse: [
      "For chat transcripts, AI assistant conversations and comment threads.",
      "With MessageGroup to stack consecutive messages from the same author.",
    ],
    whenNotToUse: ["For notifications or activity feeds: use Item."],
    anatomy: {
      MessageGroup: "Vertical stack of messages with a consistent gap.",
      Message: "One message row; `data-align` decides the side.",
      MessageAvatar: "Avatar slot, aligned to the top of the message.",
      MessageContent: "Column with header, body and footer.",
      MessageHeader: "Author name and optional metadata, muted.",
      MessageFooter: "Time, delivery status or actions, muted.",
    },
    props: {
      MessageGroup: { children: "Messages." },
      Message: {
        align: "`start` for others (left in LTR), `end` for the current user (right in LTR).",
      },
      MessageAvatar: { children: "An Avatar or icon." },
      MessageContent: { children: "Header, bubbles and footer." },
      MessageHeader: { children: "Author and metadata." },
      MessageFooter: { children: "A `<time>` or status." },
    },
    stories: {
      Conversation: "A user/assistant exchange from the `chatMessages` fixture.",
      Grouped: "Several bubbles from the same author inside one message.",
      WithoutAvatar: "A compact layout without MessageAvatar.",
    },
    keyboard: {},
    aria: [
      'Messages have no role of their own: wrap the transcript in a `role="log"` region so new messages are announced politely.',
      "Use `<time dateTime>` in the footer so the timestamp is machine-readable.",
      'Avatars next to a visible author name should have `alt=""`.',
    ],
    theming: [
      "Header and footer: `--muted-foreground`, `text-xs`. Bubbles bring their own colors.",
      "`align` mirrors automatically in RTL because the layout uses logical properties.",
    ],
  },
  es: {
    summary:
      'La disposición de un mensaje de chat: avatar, cabecera con el autor, contenido (normalmente un Bubble) y un pie para la hora o el estado. `align="end"` pone a la derecha los mensajes del propio usuario.',
    whenToUse: [
      "Para transcripciones de chat, conversaciones con un asistente de IA e hilos de comentarios.",
      "Con MessageGroup para apilar mensajes seguidos del mismo autor.",
    ],
    whenNotToUse: ["Para notificaciones o feeds de actividad: usa Item."],
    anatomy: {
      MessageGroup: "Pila vertical de mensajes con un espacio uniforme.",
      Message: "Una fila de mensaje; `data-align` decide el lado.",
      MessageAvatar: "Hueco para el avatar, alineado arriba del mensaje.",
      MessageContent: "Columna con cabecera, cuerpo y pie.",
      MessageHeader: "Nombre del autor y metadatos opcionales, atenuados.",
      MessageFooter: "Hora, estado de entrega o acciones, atenuados.",
    },
    props: {
      MessageGroup: { children: "Mensajes." },
      Message: {
        align:
          "`start` para los demás (izquierda en LTR), `end` para el usuario actual (derecha en LTR).",
      },
      MessageAvatar: { children: "Un Avatar o un icono." },
      MessageContent: { children: "Cabecera, burbujas y pie." },
      MessageHeader: { children: "Autor y metadatos." },
      MessageFooter: { children: "Un `<time>` o un estado." },
    },
    stories: {
      Conversation: "Un intercambio usuario/asistente del fixture `chatMessages`.",
      Grouped: "Varias burbujas del mismo autor dentro de un mensaje.",
      WithoutAvatar: "Una disposición compacta sin MessageAvatar.",
    },
    keyboard: {},
    aria: [
      'Los mensajes no tienen rol propio: envuelve la transcripción en una región `role="log"` para que los mensajes nuevos se anuncien de forma educada.',
      "Usa `<time dateTime>` en el pie para que la hora sea legible por máquinas.",
      'Los avatares junto a un nombre de autor visible deben tener `alt=""`.',
    ],
    theming: [
      "Cabecera y pie: `--muted-foreground`, `text-xs`. Las burbujas traen sus propios colores.",
      "`align` se refleja solo en RTL porque la disposición usa propiedades lógicas.",
    ],
  },
});
