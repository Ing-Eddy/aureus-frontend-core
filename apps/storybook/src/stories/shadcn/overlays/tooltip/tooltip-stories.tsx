import { Button } from "@aureus-core/ui/shadcn/button";
import { Kbd } from "@aureus-core/ui/shadcn/kbd";
import { Tooltip, TooltipContent, TooltipTrigger } from "@aureus-core/ui/shadcn/tooltip";
import { expectClosed, screen } from "@sb/testing/overlay";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { BoldIcon, PlusIcon, SaveIcon } from "lucide-react";
import { expect, fn, userEvent, waitFor } from "storybook/test";
import { docs } from "./tooltip-docs";

type Side = "top" | "right" | "bottom" | "left";

interface TooltipArgs {
  side: Side;
  sideOffset: number;
  content: string;
  onOpenChange: (open: boolean) => void;
}

const meta = {
  title: "shadcn/Overlays/Tooltip",
  parameters: { aureusDocs: docs },
  args: { side: "top", sideOffset: 0, content: "Add to library", onOpenChange: fn() },
  argTypes: {
    side: {
      control: "inline-radio",
      options: ["top", "right", "bottom", "left"],
      table: { category: "Appearance" },
    },
    sideOffset: { control: { type: "number", min: 0, max: 24 }, table: { category: "Appearance" } },
    content: { control: "text", table: { category: "Content" } },
    onOpenChange: { table: { category: "Events" } },
  },
  render: ({ side, sideOffset, content, onOpenChange }) => (
    <Tooltip onOpenChange={onOpenChange}>
      <TooltipTrigger asChild>
        <Button variant="outline" size="icon" aria-label={content}>
          <PlusIcon />
        </Button>
      </TooltipTrigger>
      <TooltipContent side={side} sideOffset={sideOffset}>
        {content}
      </TooltipContent>
    </Tooltip>
  ),
} satisfies Meta<TooltipArgs>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Focus shows the tooltip and links it with `aria-describedby`; Esc and blur hide it. */
export const Playground: Story = {
  play: async ({ args, canvas }) => {
    const button = canvas.getByRole("button", { name: "Add to library" });
    await userEvent.tab();
    const tooltip = await screen().findByRole("tooltip");
    await expect(tooltip).toHaveTextContent("Add to library");
    await expect(button).toHaveAttribute("aria-describedby", tooltip.id);
    await expect(args.onOpenChange).toHaveBeenLastCalledWith(true);
    await userEvent.keyboard("{Escape}");
    await expectClosed("tooltip");
    await expect(button).toHaveFocus();

    await userEvent.hover(button);
    await screen().findByRole("tooltip");
    await userEvent.unhover(button);
    await userEvent.tab();
    await expectClosed("tooltip");
  },
};

export const IconButton: Story = {
  render: () => (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button variant="ghost" size="icon" aria-label="Bold">
          <BoldIcon />
        </Button>
      </TooltipTrigger>
      <TooltipContent>Bold</TooltipContent>
    </Tooltip>
  ),
};

export const Sides: Story = {
  render: () => (
    <div className="flex gap-2 p-12">
      {(["top", "right", "bottom", "left"] as const).map((side) => (
        <Tooltip key={side}>
          <TooltipTrigger asChild>
            <Button variant="outline">{side}</Button>
          </TooltipTrigger>
          <TooltipContent side={side}>Tooltip on the {side}</TooltipContent>
        </Tooltip>
      ))}
    </div>
  ),
  play: async ({ canvas }) => {
    canvas.getByRole("button", { name: "left" }).focus();
    const tooltip = await screen().findByRole("tooltip");
    await expect(tooltip).toHaveTextContent("Tooltip on the left");
    await userEvent.keyboard("{Escape}");
    await expectClosed("tooltip");
  },
};

export const WithKeyboardShortcut: Story = {
  render: () => (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button variant="outline" size="icon" aria-label="Save" aria-keyshortcuts="Control+S">
          <SaveIcon />
        </Button>
      </TooltipTrigger>
      <TooltipContent className="flex items-center gap-2">
        Save <Kbd>Ctrl S</Kbd>
      </TooltipContent>
    </Tooltip>
  ),
};

/** With `delayDuration={500}`, hovering shows the tooltip only after the delay. */
export const Delay: Story = {
  render: () => (
    <Tooltip delayDuration={500}>
      <TooltipTrigger asChild>
        <Button variant="outline">Hover me</Button>
      </TooltipTrigger>
      <TooltipContent>Shown after 500 ms</TooltipContent>
    </Tooltip>
  ),
  play: async ({ canvas }) => {
    const button = canvas.getByRole("button", { name: "Hover me" });
    await userEvent.hover(button);
    await expect(screen().queryByRole("tooltip")).toBeNull();
    await waitFor(() => expect(screen().getByRole("tooltip")).toBeInTheDocument(), {
      timeout: 1500,
    });
    await userEvent.unhover(button);
    await expectClosed("tooltip");
  },
};

export const DisabledTrigger: Story = {
  render: () => (
    <Tooltip>
      <TooltipTrigger asChild>
        {/* biome-ignore lint/a11y/noNoninteractiveTabindex: the wrapper keeps the disabled button's tooltip reachable by keyboard. */}
        <span tabIndex={0} className="inline-flex">
          <Button disabled>Publish</Button>
        </span>
      </TooltipTrigger>
      <TooltipContent>Add a title before publishing</TooltipContent>
    </Tooltip>
  ),
  play: async () => {
    await userEvent.tab();
    await expect(await screen().findByRole("tooltip")).toHaveTextContent(
      "Add a title before publishing",
    );
    await userEvent.keyboard("{Escape}");
    await expectClosed("tooltip");
  },
};
