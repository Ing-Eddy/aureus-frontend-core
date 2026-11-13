import { Avatar, AvatarFallback, AvatarImage } from "@aureus-core/ui/shadcn/avatar";
import { Button } from "@aureus-core/ui/shadcn/button";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@aureus-core/ui/shadcn/hover-card";
import { users } from "@fixtures/users";
import { screen } from "@sb/testing/overlay";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { CalendarIcon } from "lucide-react";
import { expect, fn, userEvent, waitFor } from "storybook/test";
import { docs } from "./hover-card-docs";

const ada = users[0];

interface HoverArgs {
  openDelay: number;
  closeDelay: number;
  side: "top" | "right" | "bottom" | "left";
  onOpenChange: (open: boolean) => void;
}

function ProfileCard({ openDelay, closeDelay, side, onOpenChange }: HoverArgs) {
  return (
    <HoverCard openDelay={openDelay} closeDelay={closeDelay} onOpenChange={onOpenChange}>
      <HoverCardTrigger asChild>
        <Button variant="link" asChild>
          <a href="#ada">@ada</a>
        </Button>
      </HoverCardTrigger>
      <HoverCardContent side={side} className="w-72">
        <div className="flex gap-3">
          <Avatar>
            <AvatarImage src={ada?.avatar} alt="" />
            <AvatarFallback>{ada?.initials}</AvatarFallback>
          </Avatar>
          <div className="grid gap-1">
            <p className="font-medium text-sm">{ada?.name}</p>
            <p className="text-sm">Wrote the first published algorithm for a machine.</p>
            <p className="flex items-center gap-1 text-muted-foreground text-xs">
              <CalendarIcon className="size-3" aria-hidden />
              Joined December 1842
            </p>
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
}

const meta = {
  title: "shadcn/Overlays/Hover Card",
  parameters: { aureusDocs: docs },
  // Short delays keep the interaction tests fast; the component defaults are 700 ms / 300 ms.
  args: { openDelay: 100, closeDelay: 100, side: "bottom", onOpenChange: fn() },
  argTypes: {
    openDelay: { control: { type: "number", min: 0, step: 100 }, table: { category: "Behavior" } },
    closeDelay: { control: { type: "number", min: 0, step: 100 }, table: { category: "Behavior" } },
    side: {
      control: "inline-radio",
      options: ["top", "right", "bottom", "left"],
      table: { category: "Appearance" },
    },
    onOpenChange: { table: { category: "Events" } },
  },
  render: (args) => <ProfileCard {...args} />,
} satisfies Meta<HoverArgs>;

export default meta;
type Story = StoryObj<typeof meta>;

const card = () => screen().queryByText("Joined December 1842");

/** Focus on the link opens the card; moving focus away closes it. Hover does the same. */
export const Playground: Story = {
  play: async ({ args, canvas }) => {
    const link = canvas.getByRole("link", { name: "@ada" });
    await userEvent.tab();
    await expect(link).toHaveFocus();
    await waitFor(() => expect(card()).not.toBeNull());
    await expect(args.onOpenChange).toHaveBeenLastCalledWith(true);
    await userEvent.tab();
    await waitFor(() => expect(card()).toBeNull());

    await userEvent.hover(link);
    await waitFor(() => expect(card()).not.toBeNull());
    await userEvent.unhover(link);
    await waitFor(() => expect(card()).toBeNull());
  },
};

export const Profile: Story = {};

export const Sides: Story = {
  render: (args) => (
    <div className="flex flex-wrap gap-8 p-24">
      {(["top", "right", "bottom", "left"] as const).map((side) => (
        <HoverCard key={side} openDelay={args.openDelay} closeDelay={args.closeDelay}>
          <HoverCardTrigger asChild>
            <Button variant="link" asChild>
              <a href={`#${side}`}>{side}</a>
            </Button>
          </HoverCardTrigger>
          <HoverCardContent side={side} className="w-40 text-sm">
            Opens on the {side}.
          </HoverCardContent>
        </HoverCard>
      ))}
    </div>
  ),
};
