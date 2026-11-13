import { Button } from "@aureus-core/ui/shadcn/button";
import {
  MessageScroller,
  MessageScrollerButton,
  MessageScrollerContent,
  MessageScrollerItem,
  MessageScrollerProvider,
  MessageScrollerViewport,
} from "@aureus-core/ui/shadcn/message-scroller";
import { type ChatMessage, chatMessages, longConversation } from "@fixtures/chat-messages";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { expect, fireEvent, userEvent, waitFor } from "storybook/test";
import { ChatRow } from "../chat-demo";
import { docs } from "./message-scroller-docs";

interface ScrollerArgs {
  autoScroll: boolean;
  defaultScrollPosition: "start" | "end" | "last-anchor";
}

function Transcript({
  messages,
  ...provider
}: ScrollerArgs & { messages: readonly ChatMessage[] }) {
  return (
    <MessageScrollerProvider {...provider}>
      <MessageScroller className="h-96 w-[32rem] rounded-lg border">
        <MessageScrollerViewport aria-label="Conversation">
          <MessageScrollerContent className="p-4">
            {messages.map((message) => (
              <MessageScrollerItem
                key={message.id}
                messageId={message.id}
                scrollAnchor={message.role === "user"}
              >
                <ChatRow message={message} />
              </MessageScrollerItem>
            ))}
          </MessageScrollerContent>
        </MessageScrollerViewport>
        <MessageScrollerButton />
      </MessageScroller>
    </MessageScrollerProvider>
  );
}

const meta = {
  title: "shadcn/AI & Chat/Message Scroller",
  parameters: { aureusDocs: docs },
  args: { autoScroll: true, defaultScrollPosition: "end" },
  argTypes: {
    autoScroll: { control: "boolean", table: { category: "Behavior" } },
    defaultScrollPosition: {
      control: "inline-radio",
      options: ["start", "end", "last-anchor"],
      table: { category: "Behavior" },
    },
  },
  render: (args) => (
    <Transcript key={args.defaultScrollPosition} {...args} messages={longConversation} />
  ),
} satisfies Meta<ScrollerArgs>;

export default meta;
type Story = StoryObj<typeof meta>;

const viewportOf = (root: HTMLElement) =>
  root.querySelector<HTMLElement>('[data-slot="message-scroller-viewport"]') as HTMLElement;
const buttonOf = (root: HTMLElement) =>
  root.querySelector<HTMLElement>('[data-slot="message-scroller-button"]') as HTMLElement;
const atEnd = (element: HTMLElement) =>
  element.scrollHeight - element.scrollTop - element.clientHeight < 4;

/**
 * The view starts at the end. Scrolling up activates "Scroll to end"; clicking it returns to the
 * bottom and the button hides again.
 */
export const Playground: Story = {
  play: async ({ canvas, canvasElement }) => {
    const viewport = viewportOf(canvasElement);
    await expect(canvas.getByRole("region", { name: "Conversation" })).toBe(viewport);
    await expect(canvas.getByRole("log")).toBeInTheDocument();
    await waitFor(() => expect(atEnd(viewport)).toBe(true));
    await expect(buttonOf(canvasElement)).toHaveAttribute("data-active", "false");

    viewport.scrollTop = 0;
    fireEvent.scroll(viewport);
    fireEvent.wheel(viewport, { deltaY: -500 });
    await waitFor(() => expect(buttonOf(canvasElement)).toHaveAttribute("data-active", "true"));
    await userEvent.click(canvas.getByRole("button", { name: "Scroll to end" }));
    await waitFor(() => expect(atEnd(viewport)).toBe(true), { timeout: 3000 });
    await waitFor(() => expect(buttonOf(canvasElement)).toHaveAttribute("data-active", "false"));
  },
};

export const LongConversation: Story = {};

function StreamingExample() {
  const [messages, setMessages] = useState<ChatMessage[]>([...chatMessages]);
  return (
    <div className="grid gap-3">
      <Transcript autoScroll defaultScrollPosition="end" messages={messages} />
      <Button
        className="justify-self-start"
        onClick={() =>
          setMessages((current) => [
            ...current,
            {
              id: `new-${current.length}`,
              role: current.length % 2 ? "assistant" : "user",
              author: current.length % 2 ? "Assistant" : "Ada Lovelace",
              content: `New message number ${current.length + 1}.`,
              time: "2026-01-15T10:00:00Z",
            },
          ])
        }
      >
        Add message
      </Button>
    </div>
  );
}

/** While at the end, new messages scroll into view automatically. */
export const StreamingMessages: Story = {
  render: () => <StreamingExample />,
  play: async ({ canvas, canvasElement }) => {
    const viewport = viewportOf(canvasElement);
    for (let index = 0; index < 4; index++) {
      await userEvent.click(canvas.getByRole("button", { name: "Add message" }));
    }
    await waitFor(() => expect(canvas.getAllByText(/^New message number/)).toHaveLength(4));
    await waitFor(() => expect(atEnd(viewport)).toBe(true), { timeout: 3000 });
  },
};
