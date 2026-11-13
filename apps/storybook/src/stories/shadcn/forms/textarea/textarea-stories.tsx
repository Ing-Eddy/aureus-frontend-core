import { Label } from "@aureus-core/ui/shadcn/label";
import { Textarea } from "@aureus-core/ui/shadcn/textarea";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { expect, fn, userEvent } from "storybook/test";
import { docs } from "./textarea-docs";

const meta = {
  title: "shadcn/Forms/Textarea",
  component: Textarea,
  parameters: { aureusDocs: docs },
  args: {
    placeholder: "Tell us a little about yourself",
    disabled: false,
    "aria-invalid": false,
    onChange: fn(),
  },
  argTypes: {
    placeholder: { control: "text", table: { category: "Content" } },
    rows: { control: "number", table: { category: "Appearance" } },
    maxLength: { control: "number", table: { category: "Behavior" } },
    disabled: { control: "boolean", table: { category: "State" } },
    "aria-invalid": { control: "boolean", table: { category: "State" } },
    onChange: { table: { category: "Events" } },
  },
  render: (args) => (
    <div className="grid w-80 gap-2">
      <Label htmlFor="textarea-playground">Bio</Label>
      <Textarea id="textarea-playground" {...args} />
    </div>
  ),
} satisfies Meta<typeof Textarea>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Typing (including Enter for a new line) updates the value. */
export const Playground: Story = {
  play: async ({ args, canvas }) => {
    const textarea = canvas.getByLabelText("Bio");
    await userEvent.type(textarea, "Line one{Enter}Line two");
    await expect(textarea).toHaveValue("Line one\nLine two");
    await expect(args.onChange).toHaveBeenCalled();
  },
};

export const Disabled: Story = {
  args: { disabled: true },
  play: async ({ canvas }) => {
    const textarea = canvas.getByLabelText("Bio");
    await expect(textarea).toBeDisabled();
    await userEvent.type(textarea, "ignored", { pointerEventsCheck: 0 });
    await expect(textarea).toHaveValue("");
  },
};

export const Invalid: Story = {
  args: { "aria-invalid": true, "aria-describedby": "textarea-error" },
  render: (args) => (
    <div className="grid w-80 gap-2">
      <Label htmlFor="textarea-invalid">Bio</Label>
      <Textarea id="textarea-invalid" {...args} />
      <p id="textarea-error" className="text-destructive text-sm">
        A bio is required.
      </p>
    </div>
  ),
  play: async ({ canvas }) => {
    await expect(canvas.getByLabelText("Bio")).toHaveAccessibleDescription("A bio is required.");
  },
};

const limit = 80;

function CounterExample(props: React.ComponentProps<typeof Textarea>) {
  const [value, setValue] = useState("");
  return (
    <div className="grid w-80 gap-2">
      <Label htmlFor="textarea-counter">Status</Label>
      <Textarea
        {...props}
        id="textarea-counter"
        maxLength={limit}
        value={value}
        aria-describedby="textarea-count"
        onChange={(event) => {
          setValue(event.target.value);
          props.onChange?.(event);
        }}
      />
      <p id="textarea-count" className="text-muted-foreground text-right text-sm">
        {value.length}/{limit}
      </p>
    </div>
  );
}

/** The counter follows the controlled value, and `maxLength` stops input at the limit. */
export const WithCounter: Story = {
  render: (args) => <CounterExample {...args} />,
  play: async ({ canvas }) => {
    const textarea = canvas.getByLabelText("Status");
    await userEvent.type(textarea, "Hello");
    await expect(canvas.getByText("5/80")).toBeVisible();
    await userEvent.type(textarea, "x".repeat(100));
    await expect(textarea).toHaveValue(`Hello${"x".repeat(limit - 5)}`);
  },
};
