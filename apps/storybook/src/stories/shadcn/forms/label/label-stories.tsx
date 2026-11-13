import { Checkbox } from "@aureus-core/ui/shadcn/checkbox";
import { Input } from "@aureus-core/ui/shadcn/input";
import { Label } from "@aureus-core/ui/shadcn/label";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent } from "storybook/test";
import { docs } from "./label-docs";

const meta = {
  title: "shadcn/Forms/Label",
  component: Label,
  parameters: { aureusDocs: docs },
  args: { children: "Username", htmlFor: "label-playground" },
  argTypes: {
    children: { control: "text", table: { category: "Content" } },
    htmlFor: { control: "text", table: { category: "Behavior" } },
    asChild: { control: false, table: { category: "Behavior" } },
  },
  render: (args) => (
    <div className="grid w-72 gap-2">
      <Label {...args} />
      <Input id="label-playground" placeholder="ada" />
    </div>
  ),
} satisfies Meta<typeof Label>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Clicking the label focuses the input it points to. */
export const Playground: Story = {
  play: async ({ canvas }) => {
    await userEvent.click(canvas.getByText("Username"));
    await expect(canvas.getByRole("textbox", { name: "Username" })).toHaveFocus();
  },
};

export const WithInput: Story = {
  args: { children: "Email", htmlFor: "label-email" },
  render: (args) => (
    <div className="grid w-72 gap-2">
      <Label {...args} />
      <Input id="label-email" type="email" placeholder="you@example.com" />
    </div>
  ),
  play: async ({ canvas }) => {
    await userEvent.click(canvas.getByText("Email"));
    await expect(canvas.getByRole("textbox", { name: "Email" })).toHaveFocus();
  },
};

export const WithCheckbox: Story = {
  args: { children: "Accept terms and conditions", htmlFor: "label-terms" },
  render: (args) => (
    <div className="flex items-center gap-2">
      <Checkbox id="label-terms" />
      <Label {...args} />
    </div>
  ),
  play: async ({ canvas }) => {
    const checkbox = canvas.getByRole("checkbox", { name: "Accept terms and conditions" });
    await userEvent.click(canvas.getByText("Accept terms and conditions"));
    await expect(checkbox).toBeChecked();
  },
};

export const DisabledPeer: Story = {
  args: { children: "Notifications (unavailable)", htmlFor: "label-disabled" },
  render: (args) => (
    <div className="flex items-center gap-2">
      <Checkbox id="label-disabled" className="peer" disabled />
      <Label {...args} />
    </div>
  ),
  play: async ({ canvas }) => {
    const checkbox = canvas.getByRole("checkbox", { name: "Notifications (unavailable)" });
    await userEvent.click(canvas.getByText("Notifications (unavailable)"), {
      pointerEventsCheck: 0,
    });
    await expect(checkbox).not.toBeChecked();
  },
};
