import { Button } from "@aureus-core/ui/shadcn/button";
import { Kbd, KbdGroup } from "@aureus-core/ui/shadcn/kbd";
import { Tooltip, TooltipContent, TooltipTrigger } from "@aureus-core/ui/shadcn/tooltip";
import { expectClosed, screen } from "@sb/testing/overlay";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent } from "storybook/test";
import { docs } from "./kbd-docs";

const meta = {
  title: "shadcn/Actions/Kbd",
  component: Kbd,
  parameters: { aureusDocs: docs },
  args: { children: "⌘K" },
  argTypes: { children: { control: "text", table: { category: "Content" } } },
} satisfies Meta<typeof Kbd>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  play: async ({ canvas }) => {
    const key = canvas.getByText("⌘K");
    await expect(key.tagName).toBe("KBD");
  },
};

export const Group: Story = {
  render: () => (
    <div className="grid gap-3">
      <KbdGroup>
        <Kbd>⌘</Kbd>
        <Kbd>⇧</Kbd>
        <Kbd>P</Kbd>
      </KbdGroup>
      <KbdGroup>
        <Kbd>Ctrl</Kbd>
        <span>+</span>
        <Kbd>Alt</Kbd>
        <span>+</span>
        <Kbd>Delete</Kbd>
      </KbdGroup>
    </div>
  ),
};

export const InText: Story = {
  render: () => (
    <p className="text-sm">
      Press <Kbd>Esc</Kbd> to close the dialog, or <Kbd>⏎</Kbd> to confirm.
    </p>
  ),
};

export const InButton: Story = {
  render: () => (
    <div className="flex gap-4">
      <Button variant="outline" aria-keyshortcuts="Control+K">
        Search
        <Kbd>Ctrl K</Kbd>
      </Button>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="outline">Print</Button>
        </TooltipTrigger>
        <TooltipContent className="flex items-center gap-2">
          Print page
          <KbdGroup>
            <Kbd>⌘</Kbd>
            <Kbd>P</Kbd>
          </KbdGroup>
        </TooltipContent>
      </Tooltip>
    </div>
  ),
  play: async ({ canvas }) => {
    await expect(canvas.getByRole("button", { name: /Search/ })).toHaveAttribute(
      "aria-keyshortcuts",
      "Control+K",
    );
    canvas.getByRole("button", { name: "Print" }).focus();
    await expect(await screen().findByRole("tooltip")).toHaveTextContent("Print page");
    await userEvent.keyboard("{Escape}");
    await expectClosed("tooltip");
  },
};
