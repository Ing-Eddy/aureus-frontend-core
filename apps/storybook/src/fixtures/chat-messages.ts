/** A fixed conversation for the AI & Chat stories. Timestamps are fixed (no `new Date()` drift). */
export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  author: string;
  content: string;
  time: string; // ISO date-time
}

export const chatMessages: readonly ChatMessage[] = [
  {
    id: "m1",
    role: "user",
    author: "Ada Lovelace",
    content: "Can you summarize last month's sales?",
    time: "2026-01-15T09:00:00Z",
  },
  {
    id: "m2",
    role: "assistant",
    author: "Assistant",
    content: "Sure. Revenue grew 12% month over month, driven by the new annual plan.",
    time: "2026-01-15T09:00:04Z",
  },
  {
    id: "m3",
    role: "user",
    author: "Ada Lovelace",
    content: "Which region grew the most?",
    time: "2026-01-15T09:01:10Z",
  },
  {
    id: "m4",
    role: "assistant",
    author: "Assistant",
    content: "LATAM, at 21%. Europe followed with 14%.",
    time: "2026-01-15T09:01:13Z",
  },
  {
    id: "m5",
    role: "user",
    author: "Ada Lovelace",
    content: "Great. Draft an email to the team with these numbers.",
    time: "2026-01-15T09:02:30Z",
  },
  {
    id: "m6",
    role: "assistant",
    author: "Assistant",
    content: 'Here is a draft: "Team, January closed 12% above December. LATAM led with 21%…"',
    time: "2026-01-15T09:02:35Z",
  },
];

/** A long conversation for scroll behaviour (MessageScroller). */
export const longConversation: readonly ChatMessage[] = Array.from({ length: 40 }, (_, index) => {
  const source = chatMessages[index % chatMessages.length] as ChatMessage;
  return { ...source, id: `long-${index}`, content: `${source.content} (${index + 1})` };
});
