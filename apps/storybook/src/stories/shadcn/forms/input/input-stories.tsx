import { Input } from "@aureus-core/ui/shadcn/input";
import { Label } from "@aureus-core/ui/shadcn/label";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, userEvent } from "storybook/test";
import { docs } from "./input-docs";

const types = ["text", "email", "password", "number", "search", "tel", "url"] as const;

const meta = {
  title: "shadcn/Forms/Input",
  component: Input,
  parameters: { aureusDocs: docs },
  args: {
    type: "email",
    placeholder: "you@example.com",
    disabled: false,
    readOnly: false,
    "aria-invalid": false,
    onChange: fn(),
  },
  argTypes: {
    type: { control: "select", options: [...types, "file"], table: { category: "Behavior" } },
    placeholder: { control: "text", table: { category: "Content" } },
    disabled: { control: "boolean", table: { category: "State" } },
    readOnly: { control: "boolean", table: { category: "State" } },
    "aria-invalid": { control: "boolean", table: { category: "State" } },
    onChange: { table: { category: "Events" } },
  },
  render: (args) => (
    <div className="grid w-72 gap-2">
      <Label htmlFor="input-playground">Email</Label>
      <Input id="input-playground" {...args} />
    </div>
  ),
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Typing updates the value and calls `onChange` once per character. */
export const Playground: Story = {
  play: async ({ args, canvas }) => {
    const input = canvas.getByLabelText("Email");
    await userEvent.type(input, "ada@example.com");
    await expect(input).toHaveValue("ada@example.com");
    await expect(args.onChange).toHaveBeenCalledTimes("ada@example.com".length);
  },
};

export const Types: Story = {
  render: (args) => (
    <div className="grid w-72 gap-4">
      {types.map((type) => (
        <div key={type} className="grid gap-2">
          <Label htmlFor={`input-${type}`}>{type}</Label>
          <Input {...args} id={`input-${type}`} type={type} placeholder={`type="${type}"`} />
        </div>
      ))}
    </div>
  ),
};

export const File: Story = {
  render: (args) => (
    <div className="grid w-72 gap-2">
      <Label htmlFor="input-file">Picture</Label>
      <Input {...args} id="input-file" type="file" placeholder={undefined} />
    </div>
  ),
  play: async ({ canvas }) => {
    const input = canvas.getByLabelText<HTMLInputElement>("Picture");
    await userEvent.upload(
      input,
      new globalThis.File(["avatar"], "avatar.png", { type: "image/png" }),
    );
    await expect(input.files?.[0]?.name).toBe("avatar.png");
  },
};

/** A disabled input rejects typing and is skipped by Tab. */
export const Disabled: Story = {
  args: { disabled: true },
  play: async ({ args, canvas }) => {
    const input = canvas.getByLabelText("Email");
    await expect(input).toBeDisabled();
    await userEvent.type(input, "ignored", { pointerEventsCheck: 0 });
    await expect(input).toHaveValue("");
    await userEvent.tab();
    await expect(input).not.toHaveFocus();
    await expect(args.onChange).not.toHaveBeenCalled();
  },
};

export const ReadOnly: Story = {
  args: { readOnly: true, defaultValue: "ada@example.com" },
  play: async ({ canvas }) => {
    const input = canvas.getByLabelText("Email");
    await userEvent.type(input, "x");
    await expect(input).toHaveValue("ada@example.com");
    await expect(input).toHaveFocus();
  },
};

export const Invalid: Story = {
  args: { "aria-invalid": true, defaultValue: "ada@", "aria-describedby": "input-error" },
  render: (args) => (
    <div className="grid w-72 gap-2">
      <Label htmlFor="input-invalid">Email</Label>
      <Input id="input-invalid" {...args} />
      <p id="input-error" className="text-destructive text-sm">
        Enter a complete email address.
      </p>
    </div>
  ),
  play: async ({ canvas }) => {
    const input = canvas.getByLabelText("Email");
    await expect(input).toHaveAttribute("aria-invalid", "true");
    await expect(input).toHaveAccessibleDescription("Enter a complete email address.");
  },
};
