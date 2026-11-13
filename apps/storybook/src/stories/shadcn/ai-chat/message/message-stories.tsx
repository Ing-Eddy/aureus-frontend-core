import { Bubble, BubbleContent } from "@aureus-core/ui/shadcn/bubble";
import {
  Message,
  MessageAvatar,
  MessageContent,
  MessageFooter,
  MessageGroup,
  MessageHeader,
} from "@aureus-core/ui/shadcn/message";
import { chatMessages } from "@fixtures/chat-messages";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect } from "storybook/test";
import { ChatRow } from "../chat-demo";
import { docs } from "./message-docs";

interface MessageArgs {
  align: "start" | "end";
  author: string;
  text: string;
}

const meta = {
  title: "shadcn/AI & Chat/Message",
  parameters: { aureusDocs: docs },
  args: { align: "start", author: "Assistant", text: "Here is the report you asked for." },
  argTypes: {
    align: {
      control: "inline-radio",
      options: ["start", "end"],
      table: { category: "Appearance" },
    },
    author: { control: "text", table: { category: "Content" } },
    text: { control: "text", table: { category: "Content" } },
  },
  render: ({ align, author, text }) => (
    <div className="w-[28rem]">
      <Message align={align}>
        <MessageContent>
          <MessageHeader>{author}</MessageHeader>
          <Bubble variant={align === "end" ? "default" : "muted"} align={align}>
            <BubbleContent>{text}</BubbleContent>
          </Bubble>
          <MessageFooter>
            <time dateTime="2026-01-15T09:00:00Z">09:00</time>
          </MessageFooter>
        </MessageContent>
      </Message>
    </div>
  ),
} satisfies Meta<MessageArgs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  play: async ({ canvasElement }) => {
    await expect(canvasElement.querySelector('[data-slot="message"]')).toHaveAttribute(
      "data-align",
      "start",
    );
  },
};

/** The transcript is a `role="log"` region; user messages align to the end. */
export const Conversation: Story = {
  render: () => (
    <MessageGroup role="log" aria-label="Conversation with the assistant" className="w-[32rem]">
      {chatMessages.slice(0, 4).map((message) => (
        <ChatRow key={message.id} message={message} />
      ))}
    </MessageGroup>
  ),
  play: async ({ canvas, canvasElement }) => {
    await expect(
      canvas.getByRole("log", { name: "Conversation with the assistant" }),
    ).toBeInTheDocument();
    const aligns = [...canvasElement.querySelectorAll('[data-slot="message"]')].map((m) =>
      m.getAttribute("data-align"),
    );
    await expect(aligns).toEqual(["end", "start", "end", "start"]);
  },
};

export const Grouped: Story = {
  render: () => (
    <div className="w-[28rem]">
      <Message>
        <MessageAvatar>
          <span className="flex size-6 items-center justify-center rounded-full bg-muted text-xs">
            GH
          </span>
        </MessageAvatar>
        <MessageContent>
          <MessageHeader>Grace Hopper</MessageHeader>
          <Bubble variant="muted">
            <BubbleContent>Deploy finished.</BubbleContent>
          </Bubble>
          <Bubble variant="muted">
            <BubbleContent>All 24 checks passed.</BubbleContent>
          </Bubble>
          <MessageFooter>Delivered</MessageFooter>
        </MessageContent>
      </Message>
    </div>
  ),
};

export const WithoutAvatar: Story = {
  args: { align: "end", author: "You", text: "Thanks!" },
};
