import { Button } from "@aureus-core/ui/shadcn/button";
import {
  ButtonGroup,
  ButtonGroupSeparator,
  ButtonGroupText,
} from "@aureus-core/ui/shadcn/button-group";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@aureus-core/ui/shadcn/dropdown-menu";
import { Input } from "@aureus-core/ui/shadcn/input";
import { expectClosed, screen } from "@sb/testing/overlay";
import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  ChevronDownIcon,
  MinusIcon,
  PlusIcon,
  SearchIcon,
} from "lucide-react";
import { expect, fn, userEvent } from "storybook/test";
import { docs } from "./button-group-docs";

interface GroupArgs {
  orientation: "horizontal" | "vertical";
  onAction: (action: string) => void;
}

const meta = {
  title: "shadcn/Actions/Button Group",
  parameters: { aureusDocs: docs },
  args: { orientation: "horizontal", onAction: fn() },
  argTypes: {
    orientation: {
      control: "inline-radio",
      options: ["horizontal", "vertical"],
      table: { category: "Appearance" },
    },
    onAction: { table: { category: "Events" } },
  },
  render: ({ orientation, onAction }) => (
    <ButtonGroup orientation={orientation} aria-label="Navigation">
      <Button variant="outline" onClick={() => onAction("back")}>
        <ArrowLeftIcon data-icon="inline-start" />
        Back
      </Button>
      <Button variant="outline" onClick={() => onAction("today")}>
        Today
      </Button>
      <Button variant="outline" onClick={() => onAction("next")}>
        Next
        <ArrowRightIcon data-icon="inline-end" />
      </Button>
    </ButtonGroup>
  ),
} satisfies Meta<GroupArgs>;

export default meta;
type Story = StoryObj<typeof meta>;

/** The group is named; Tab visits each button and Enter activates it. */
export const Playground: Story = {
  play: async ({ args, canvas }) => {
    await expect(canvas.getByRole("group", { name: "Navigation" })).toBeInTheDocument();
    await userEvent.tab();
    await userEvent.tab();
    await expect(canvas.getByRole("button", { name: "Today" })).toHaveFocus();
    await userEvent.keyboard("{Enter}");
    await expect(args.onAction).toHaveBeenLastCalledWith("today");
  },
};

export const Vertical: Story = {
  render: ({ onAction }) => (
    <ButtonGroup orientation="vertical" aria-label="Zoom">
      <Button
        variant="outline"
        size="icon"
        aria-label="Zoom in"
        onClick={() => onAction("zoom-in")}
      >
        <PlusIcon />
      </Button>
      <Button
        variant="outline"
        size="icon"
        aria-label="Zoom out"
        onClick={() => onAction("zoom-out")}
      >
        <MinusIcon />
      </Button>
    </ButtonGroup>
  ),
};

export const WithSeparator: Story = {
  render: () => (
    <ButtonGroup aria-label="Clipboard">
      <Button variant="secondary">Copy</Button>
      <ButtonGroupSeparator />
      <Button variant="secondary">Paste</Button>
    </ButtonGroup>
  ),
};

export const WithInput: Story = {
  render: () => (
    <ButtonGroup aria-label="Search">
      <ButtonGroupText asChild>
        <label htmlFor="button-group-search">Search</label>
      </ButtonGroupText>
      <Input id="button-group-search" placeholder="Type to search…" />
      <Button variant="outline" size="icon" aria-label="Run search">
        <SearchIcon />
      </Button>
    </ButtonGroup>
  ),
  play: async ({ canvas }) => {
    await userEvent.click(canvas.getByText("Search"));
    await expect(canvas.getByRole("textbox", { name: "Search" })).toHaveFocus();
  },
};

/** The chevron opens alternatives; choosing one calls `onAction`. */
export const SplitButton: Story = {
  render: ({ onAction }) => (
    <ButtonGroup aria-label="Save">
      <Button onClick={() => onAction("save")}>Save</Button>
      <ButtonGroupSeparator />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button size="icon" aria-label="More save options">
            <ChevronDownIcon />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onSelect={() => onAction("save-as")}>Save as…</DropdownMenuItem>
          <DropdownMenuItem onSelect={() => onAction("save-template")}>
            Save as template
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </ButtonGroup>
  ),
  play: async ({ args, canvas }) => {
    await userEvent.click(canvas.getByRole("button", { name: "More save options" }));
    await userEvent.click(await screen().findByRole("menuitem", { name: "Save as…" }));
    await expect(args.onAction).toHaveBeenLastCalledWith("save-as");
    await expectClosed("menu");
  },
};

export const Nested: Story = {
  render: () => (
    <ButtonGroup aria-label="Pager">
      <ButtonGroup>
        <Button variant="outline" size="sm">
          1
        </Button>
        <Button variant="outline" size="sm">
          2
        </Button>
        <Button variant="outline" size="sm">
          3
        </Button>
      </ButtonGroup>
      <ButtonGroup>
        <Button variant="outline" size="icon-sm" aria-label="Previous page">
          <ArrowLeftIcon />
        </Button>
        <Button variant="outline" size="icon-sm" aria-label="Next page">
          <ArrowRightIcon />
        </Button>
      </ButtonGroup>
    </ButtonGroup>
  ),
};
