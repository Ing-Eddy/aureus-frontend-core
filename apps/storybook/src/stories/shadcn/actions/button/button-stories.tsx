import { Button } from "@aureus-core/ui/shadcn/button";
import { Spinner } from "@aureus-core/ui/shadcn/spinner";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { ArrowRightIcon, MailIcon, PlusIcon, TrashIcon } from "lucide-react";
import { expect, fn, userEvent, within } from "storybook/test";
import { docs } from "./button-docs";

const variants = ["default", "secondary", "outline", "ghost", "destructive", "link"] as const;
const textSizes = ["xs", "sm", "default", "lg"] as const;
const iconSizes = ["icon-xs", "icon-sm", "icon", "icon-lg"] as const;

const meta = {
  title: "shadcn/Actions/Button",
  component: Button,
  parameters: { aureusDocs: docs },
  args: {
    children: "Button",
    variant: "default",
    size: "default",
    type: "button",
    disabled: false,
    onClick: fn(),
  },
  argTypes: {
    children: { control: "text", table: { category: "Content" } },
    variant: { control: "select", options: variants, table: { category: "Appearance" } },
    size: {
      control: "select",
      options: [...textSizes, ...iconSizes],
      table: { category: "Appearance" },
    },
    disabled: { control: "boolean", table: { category: "State" } },
    type: {
      control: "inline-radio",
      options: ["button", "submit", "reset"],
      table: { category: "Behavior" },
    },
    // Needs a single element child; toggling it on plain text would break the story.
    asChild: { control: false, table: { category: "Behavior" } },
    onClick: { table: { category: "Events" } },
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Every prop is wired to a control. The play function checks keyboard activation. */
export const Playground: Story = {
  play: async ({ args, canvas }) => {
    const button = canvas.getByRole("button", { name: "Button" });
    await userEvent.tab();
    await expect(button).toHaveFocus();
    await userEvent.keyboard("{Enter}");
    await expect(args.onClick).toHaveBeenCalledTimes(1);
    await userEvent.keyboard(" ");
    await expect(args.onClick).toHaveBeenCalledTimes(2);
  },
};

export const Variants: Story = {
  render: (args) => (
    <div className="flex flex-wrap items-center gap-2">
      {variants.map((variant) => (
        <Button key={variant} {...args} variant={variant}>
          {variant}
        </Button>
      ))}
    </div>
  ),
};

export const Sizes: Story = {
  render: (args) => (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center gap-2">
        {textSizes.map((size) => (
          <Button key={size} {...args} size={size}>
            {size}
          </Button>
        ))}
      </div>
      <div className="flex flex-wrap items-center gap-2">
        {iconSizes.map((size) => (
          <Button key={size} {...args} size={size} aria-label={`Add (${size})`}>
            <PlusIcon />
          </Button>
        ))}
      </div>
    </div>
  ),
};

export const WithIcon: Story = {
  render: (args) => (
    <div className="flex flex-wrap items-center gap-2">
      <Button {...args}>
        <MailIcon data-icon="inline-start" />
        Login with email
      </Button>
      <Button {...args} variant="outline">
        Continue
        <ArrowRightIcon data-icon="inline-end" />
      </Button>
    </div>
  ),
};

export const IconOnly: Story = {
  args: { size: "icon", variant: "outline", "aria-label": "Delete item", children: <TrashIcon /> },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole("button", { name: "Delete item" })).toBeVisible();
  },
};

export const Disabled: Story = {
  args: { disabled: true },
  play: async ({ args, canvas }) => {
    const button = canvas.getByRole("button", { name: "Button" });
    await expect(button).toBeDisabled();
    await userEvent.click(button, { pointerEventsCheck: 0 });
    await userEvent.tab();
    await expect(button).not.toHaveFocus();
    await expect(args.onClick).not.toHaveBeenCalled();
  },
};

export const Loading: Story = {
  args: { disabled: true },
  render: (args) => (
    <Button {...args}>
      <Spinner data-icon="inline-start" />
      Saving…
    </Button>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole("button", { name: /Saving/ })).toBeDisabled();
    await expect(canvas.getByRole("status", { name: "Loading" })).toBeInTheDocument();
  },
};

export const AsLink: Story = {
  render: (args) => (
    <Button {...args} asChild>
      <a href="#docs">Read the docs</a>
    </Button>
  ),
  play: async ({ canvas }) => {
    const link = canvas.getByRole("link", { name: "Read the docs" });
    await expect(link).toHaveAttribute("data-slot", "button");
    await expect(canvas.queryByRole("button")).toBeNull();
  },
};
