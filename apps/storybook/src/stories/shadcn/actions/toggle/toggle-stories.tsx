import { Toggle } from "@aureus-core/ui/shadcn/toggle";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { BoldIcon, BookmarkIcon, ItalicIcon } from "lucide-react";
import { expect, fn, userEvent } from "storybook/test";
import { docs } from "./toggle-docs";

const meta = {
  title: "shadcn/Actions/Toggle",
  component: Toggle,
  parameters: { aureusDocs: docs },
  args: {
    variant: "default",
    size: "default",
    disabled: false,
    "aria-label": "Bold",
    children: <BoldIcon />,
    onPressedChange: fn(),
  },
  argTypes: {
    variant: {
      control: "inline-radio",
      options: ["default", "outline"],
      table: { category: "Appearance" },
    },
    size: {
      control: "inline-radio",
      options: ["sm", "default", "lg"],
      table: { category: "Appearance" },
    },
    pressed: { control: "boolean", table: { category: "State" } },
    disabled: { control: "boolean", table: { category: "State" } },
    children: { control: false },
    onPressedChange: { table: { category: "Events" } },
  },
} satisfies Meta<typeof Toggle>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Space toggles `aria-pressed`; `onPressedChange` receives the new state. */
export const Playground: Story = {
  play: async ({ args, canvas }) => {
    const toggle = canvas.getByRole("button", { name: "Bold" });
    await userEvent.tab();
    await expect(toggle).toHaveAttribute("aria-pressed", "false");
    await userEvent.keyboard(" ");
    await expect(toggle).toHaveAttribute("aria-pressed", "true");
    await expect(args.onPressedChange).toHaveBeenLastCalledWith(true);
    await userEvent.keyboard("{Enter}");
    await expect(toggle).toHaveAttribute("aria-pressed", "false");
    await expect(args.onPressedChange).toHaveBeenLastCalledWith(false);
  },
};

export const Variants: Story = {
  render: (args) => (
    <div className="flex gap-2">
      {(["default", "outline"] as const).map((variant) => (
        <div key={variant} className="flex gap-2">
          <Toggle {...args} variant={variant} aria-label={`Italic (${variant})`}>
            <ItalicIcon />
          </Toggle>
          <Toggle {...args} variant={variant} defaultPressed aria-label={`Italic (${variant}, on)`}>
            <ItalicIcon />
          </Toggle>
        </div>
      ))}
    </div>
  ),
};

export const Sizes: Story = {
  render: (args) => (
    <div className="flex items-center gap-2">
      {(["sm", "default", "lg"] as const).map((size) => (
        <Toggle key={size} {...args} size={size} variant="outline" aria-label={`Bold (${size})`}>
          <BoldIcon />
        </Toggle>
      ))}
    </div>
  ),
};

export const WithText: Story = {
  args: { "aria-label": undefined, variant: "outline" },
  render: (args) => (
    <Toggle {...args}>
      <BookmarkIcon data-icon="inline-start" />
      Bookmark
    </Toggle>
  ),
  play: async ({ canvas }) => {
    await userEvent.click(canvas.getByRole("button", { name: "Bookmark" }));
    await expect(canvas.getByRole("button", { name: "Bookmark" })).toHaveAttribute(
      "data-state",
      "on",
    );
  },
};

export const Disabled: Story = {
  args: { disabled: true },
  play: async ({ args, canvas }) => {
    const toggle = canvas.getByRole("button", { name: "Bold" });
    await userEvent.click(toggle, { pointerEventsCheck: 0 });
    await expect(toggle).toHaveAttribute("aria-pressed", "false");
    await expect(args.onPressedChange).not.toHaveBeenCalled();
  },
};
