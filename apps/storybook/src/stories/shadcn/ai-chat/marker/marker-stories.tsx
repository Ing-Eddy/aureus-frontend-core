import { Marker, MarkerContent, MarkerIcon } from "@aureus-core/ui/shadcn/marker";
import { MessageGroup } from "@aureus-core/ui/shadcn/message";
import { chatMessages } from "@fixtures/chat-messages";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { BrainIcon, LinkIcon, UserPlusIcon } from "lucide-react";
import { expect } from "storybook/test";
import { ChatRow } from "../chat-demo";
import { docs } from "./marker-docs";

interface MarkerArgs {
  variant: "default" | "separator" | "border";
  text: string;
}

const meta = {
  title: "shadcn/AI & Chat/Marker",
  parameters: { aureusDocs: docs },
  args: { variant: "default", text: "Thinking…" },
  argTypes: {
    variant: {
      control: "inline-radio",
      options: ["default", "separator", "border"],
      table: { category: "Appearance" },
    },
    text: { control: "text", table: { category: "Content" } },
  },
  render: ({ variant, text }) => (
    <div className="w-96">
      <Marker variant={variant}>
        <MarkerIcon>
          <BrainIcon />
        </MarkerIcon>
        <MarkerContent>{text}</MarkerContent>
      </Marker>
    </div>
  ),
} satisfies Meta<MarkerArgs>;

export default meta;
type Story = StoryObj<typeof meta>;

/** The icon is decorative; only the text is exposed. */
export const Playground: Story = {
  play: async ({ canvasElement }) => {
    await expect(canvasElement.querySelector('[data-slot="marker-icon"]')).toHaveAttribute(
      "aria-hidden",
      "true",
    );
  },
};

export const Variants: Story = {
  render: () => (
    <div className="grid w-96 gap-4">
      {(["default", "separator", "border"] as const).map((variant) => (
        <Marker key={variant} variant={variant}>
          <MarkerContent>variant="{variant}"</MarkerContent>
        </Marker>
      ))}
    </div>
  ),
};

export const InConversation: Story = {
  render: () => (
    <MessageGroup role="log" aria-label="Team chat" className="w-[32rem]">
      <Marker variant="separator">
        <MarkerContent>
          <time dateTime="2026-01-15">January 15</time>
        </MarkerContent>
      </Marker>
      {chatMessages.slice(0, 2).map((message) => (
        <ChatRow key={message.id} message={message} />
      ))}
      <Marker>
        <MarkerIcon>
          <UserPlusIcon />
        </MarkerIcon>
        <MarkerContent>Grace Hopper joined the conversation</MarkerContent>
      </Marker>
    </MessageGroup>
  ),
};

export const AsLink: Story = {
  render: () => (
    <div className="w-96">
      <Marker asChild>
        <a href="#sources">
          <MarkerIcon>
            <LinkIcon />
          </MarkerIcon>
          <MarkerContent>View 3 sources</MarkerContent>
        </a>
      </Marker>
    </div>
  ),
  play: async ({ canvas }) => {
    await expect(canvas.getByRole("link", { name: "View 3 sources" })).toHaveAttribute(
      "data-slot",
      "marker",
    );
  },
};
