import { Button } from "@aureus-core/ui/shadcn/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@aureus-core/ui/shadcn/collapsible";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { ChevronsUpDownIcon } from "lucide-react";
import { expect, fn, userEvent } from "storybook/test";
import { docs } from "./collapsible-docs";

const repositories = ["aureus/ui", "aureus/docs", "aureus/cli", "aureus/icons"] as const;

interface CollapsibleArgs {
  defaultOpen: boolean;
  disabled: boolean;
  onOpenChange: (open: boolean) => void;
}

const meta = {
  title: "shadcn/Data Display/Collapsible",
  parameters: { aureusDocs: docs },
  args: { defaultOpen: false, disabled: false, onOpenChange: fn() },
  argTypes: {
    defaultOpen: { control: "boolean", table: { category: "State" } },
    disabled: { control: "boolean", table: { category: "State" } },
    onOpenChange: { table: { category: "Events" } },
  },
  render: ({ defaultOpen, disabled, onOpenChange }) => (
    <Collapsible
      key={String(defaultOpen)}
      defaultOpen={defaultOpen}
      disabled={disabled}
      onOpenChange={onOpenChange}
      className="grid w-80 gap-2"
    >
      <div className="flex items-center justify-between gap-4">
        <h4 className="font-medium text-sm">@ada starred 4 repositories</h4>
        <CollapsibleTrigger asChild>
          <Button variant="ghost" size="icon-sm" aria-label="Show all repositories">
            <ChevronsUpDownIcon />
          </Button>
        </CollapsibleTrigger>
      </div>
      <div className="rounded-md border px-3 py-2 font-mono text-sm">{repositories[0]}</div>
      <CollapsibleContent className="grid gap-2">
        {repositories.slice(1).map((repo) => (
          <div key={repo} className="rounded-md border px-3 py-2 font-mono text-sm">
            {repo}
          </div>
        ))}
      </CollapsibleContent>
    </Collapsible>
  ),
} satisfies Meta<CollapsibleArgs>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Enter and Space toggle the content and `aria-expanded`. */
export const Playground: Story = {
  play: async ({ args, canvas }) => {
    const button = canvas.getByRole("button", { name: "Show all repositories" });
    await expect(canvas.queryByText("aureus/cli")).toBeNull();
    await userEvent.tab();
    await userEvent.keyboard("{Enter}");
    await expect(button).toHaveAttribute("aria-expanded", "true");
    await expect(canvas.getByText("aureus/cli")).toBeVisible();
    await expect(args.onOpenChange).toHaveBeenLastCalledWith(true);
    await userEvent.keyboard(" ");
    await expect(button).toHaveAttribute("aria-expanded", "false");
  },
};

export const DefaultOpen: Story = { args: { defaultOpen: true } };

export const Disabled: Story = {
  args: { disabled: true },
  play: async ({ args, canvas }) => {
    await userEvent.click(canvas.getByRole("button", { name: "Show all repositories" }), {
      pointerEventsCheck: 0,
    });
    await expect(args.onOpenChange).not.toHaveBeenCalled();
  },
};

export const InSidebarGroup: Story = {
  render: () => (
    <Collapsible className="w-64">
      <ul className="grid gap-1 text-sm">
        <li>Inbox</li>
        <li>Drafts</li>
      </ul>
      <CollapsibleContent asChild>
        <ul className="mt-1 grid gap-1 text-sm">
          <li>Archive</li>
          <li>Spam</li>
        </ul>
      </CollapsibleContent>
      <CollapsibleTrigger asChild>
        <Button variant="link" className="px-0">
          Show 2 more folders
        </Button>
      </CollapsibleTrigger>
    </Collapsible>
  ),
  play: async ({ canvas }) => {
    await userEvent.click(canvas.getByRole("button", { name: "Show 2 more folders" }));
    await expect(canvas.getByText("Spam")).toBeVisible();
  },
};
