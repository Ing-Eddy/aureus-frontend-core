import { Bubble, BubbleContent, BubbleGroup, BubbleReactions } from "@aureus-core/ui/shadcn/bubble";
import { Button } from "@aureus-core/ui/shadcn/button";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { expect, fn, userEvent } from "storybook/test";
import { docs } from "./bubble-docs";

const variants = [
  "default",
  "secondary",
  "muted",
  "tinted",
  "outline",
  "ghost",
  "destructive",
] as const;

interface BubbleArgs {
  variant: (typeof variants)[number];
  align: "start" | "end";
  text: string;
  onReply: (text: string) => void;
}

const meta = {
  title: "shadcn/AI & Chat/Bubble",
  parameters: { aureusDocs: docs },
  args: { variant: "default", align: "start", text: "Sounds good, see you at 10.", onReply: fn() },
  argTypes: {
    variant: { control: "select", options: variants, table: { category: "Appearance" } },
    align: {
      control: "inline-radio",
      options: ["start", "end"],
      table: { category: "Appearance" },
    },
    text: { control: "text", table: { category: "Content" } },
    onReply: { table: { category: "Events" } },
  },
  render: ({ variant, align, text }) => (
    <div className="flex w-96 flex-col">
      <Bubble variant={variant} align={align}>
        <BubbleContent>{text}</BubbleContent>
      </Bubble>
    </div>
  ),
} satisfies Meta<BubbleArgs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Variants: Story = {
  render: () => (
    <BubbleGroup className="w-96">
      {variants.map((variant) => (
        <Bubble key={variant} variant={variant}>
          <BubbleContent>
            {variant === "destructive" ? "Not delivered: tap to retry." : `variant="${variant}"`}
          </BubbleContent>
        </Bubble>
      ))}
    </BubbleGroup>
  ),
};

function ReactionsExample() {
  const [liked, setLiked] = useState(false);
  const count = 2 + (liked ? 1 : 0);
  return (
    <div className="flex w-96 flex-col pb-6">
      <Bubble variant="muted">
        <BubbleContent>The new dashboard is live!</BubbleContent>
        <BubbleReactions>
          <Button
            size="xs"
            variant="outline"
            className="rounded-full"
            aria-pressed={liked}
            aria-label={`Thumbs up, ${count} reactions`}
            onClick={() => setLiked((value) => !value)}
          >
            👍 {count}
          </Button>
        </BubbleReactions>
      </Bubble>
    </div>
  );
}

/** The reaction is a toggle button whose name includes the count. */
export const WithReactions: Story = {
  render: () => <ReactionsExample />,
  play: async ({ canvas }) => {
    const reaction = canvas.getByRole("button", { name: "Thumbs up, 2 reactions" });
    await userEvent.click(reaction);
    await expect(canvas.getByRole("button", { name: "Thumbs up, 3 reactions" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
  },
};

/** Suggested replies are buttons: activating one calls `onReply` with its text. */
export const Interactive: Story = {
  render: ({ onReply }) => (
    <BubbleGroup className="w-96" role="group" aria-label="Suggested replies">
      {["Yes, please", "Not now", "Tell me more"].map((reply) => (
        <Bubble key={reply} variant="outline" align="end">
          <BubbleContent asChild>
            <button type="button" onClick={() => onReply(reply)}>
              {reply}
            </button>
          </BubbleContent>
        </Bubble>
      ))}
    </BubbleGroup>
  ),
  play: async ({ args, canvas }) => {
    await userEvent.tab();
    await userEvent.keyboard("{Enter}");
    await expect(args.onReply).toHaveBeenLastCalledWith("Yes, please");
    await userEvent.click(canvas.getByRole("button", { name: "Tell me more" }));
    await expect(args.onReply).toHaveBeenLastCalledWith("Tell me more");
  },
};
