import { FieldDescription, FieldError, FieldLegend, FieldSet } from "@aureus-core/ui/shadcn/field";
import { Label } from "@aureus-core/ui/shadcn/label";
import { RadioGroup, RadioGroupItem } from "@aureus-core/ui/shadcn/radio-group";
import { pressKey } from "@sb/testing/press-key";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { expect, fn, userEvent } from "storybook/test";
import { docs } from "./radio-group-docs";

const densities = [
  { value: "default", label: "Default" },
  { value: "comfortable", label: "Comfortable" },
  { value: "compact", label: "Compact" },
] as const;

function Options({ prefix, disabled }: { prefix: string; disabled?: string }) {
  return densities.map((option) => (
    <div key={option.value} className="flex items-center gap-2">
      <RadioGroupItem
        value={option.value}
        id={`${prefix}-${option.value}`}
        disabled={option.value === disabled}
      />
      <Label htmlFor={`${prefix}-${option.value}`}>{option.label}</Label>
    </div>
  ));
}

const meta = {
  title: "shadcn/Forms/Radio Group",
  component: RadioGroup,
  parameters: { aureusDocs: docs },
  args: {
    defaultValue: "default",
    orientation: "vertical",
    loop: true,
    disabled: false,
    "aria-label": "Density",
    onValueChange: fn(),
  },
  argTypes: {
    orientation: {
      control: "inline-radio",
      options: ["vertical", "horizontal"],
      table: { category: "Appearance" },
    },
    loop: { control: "boolean", table: { category: "Behavior" } },
    disabled: { control: "boolean", table: { category: "State" } },
    onValueChange: { table: { category: "Events" } },
  },
  render: (args) => (
    <RadioGroup {...args}>
      <Options prefix="radio-playground" />
    </RadioGroup>
  ),
} satisfies Meta<typeof RadioGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Arrow keys move the selection; `onValueChange` receives the new value. */
export const Playground: Story = {
  play: async ({ args, canvas }) => {
    await userEvent.tab();
    await expect(canvas.getByRole("radio", { name: "Default" })).toHaveFocus();
    await pressKey("ArrowDown");
    await expect(canvas.getByRole("radio", { name: "Comfortable" })).toBeChecked();
    await expect(args.onValueChange).toHaveBeenLastCalledWith("comfortable");
    await pressKey("ArrowUp", 2);
    await expect(canvas.getByRole("radio", { name: "Compact" })).toBeChecked();
    await expect(args.onValueChange).toHaveBeenLastCalledWith("compact");
  },
};

function ControlledExample() {
  const [value, setValue] = useState("comfortable");
  return (
    <div className="grid gap-3">
      <RadioGroup aria-label="Density" value={value} onValueChange={setValue}>
        <Options prefix="radio-controlled" />
      </RadioGroup>
      <p className="text-muted-foreground text-sm">value: {value}</p>
    </div>
  );
}

export const Controlled: Story = {
  render: () => <ControlledExample />,
  play: async ({ canvas }) => {
    await userEvent.click(canvas.getByText("Compact"));
    await expect(canvas.getByText("value: compact")).toBeVisible();
  },
};

export const Horizontal: Story = {
  args: { orientation: "horizontal", className: "flex gap-4" },
};

/** The disabled option is skipped by the arrow keys. */
export const DisabledItem: Story = {
  render: (args) => (
    <RadioGroup {...args}>
      <Options prefix="radio-disabled" disabled="comfortable" />
    </RadioGroup>
  ),
  play: async ({ canvas }) => {
    await userEvent.tab();
    await pressKey("ArrowDown");
    await expect(canvas.getByRole("radio", { name: "Compact" })).toBeChecked();
    await expect(canvas.getByRole("radio", { name: "Comfortable" })).toBeDisabled();
  },
};

export const Invalid: Story = {
  render: () => (
    <FieldSet className="w-72" data-invalid>
      <FieldLegend variant="label">Shipping speed</FieldLegend>
      <RadioGroup required aria-describedby="radio-error">
        {["Standard", "Express"].map((speed) => (
          <div key={speed} className="flex items-center gap-2">
            <RadioGroupItem value={speed} id={`radio-invalid-${speed}`} aria-invalid />
            <Label htmlFor={`radio-invalid-${speed}`}>{speed}</Label>
          </div>
        ))}
      </RadioGroup>
      <FieldError id="radio-error">Choose a shipping speed.</FieldError>
    </FieldSet>
  ),
};

export const InField: Story = {
  render: () => (
    <FieldSet className="w-72">
      <FieldLegend variant="label">Notify me about</FieldLegend>
      <FieldDescription>You can change this in settings at any time.</FieldDescription>
      <RadioGroup defaultValue="mentions">
        {[
          { value: "all", label: "All new messages" },
          { value: "mentions", label: "Direct messages and mentions" },
          { value: "none", label: "Nothing" },
        ].map(({ value, label }) => (
          <div key={value} className="flex items-center gap-2">
            <RadioGroupItem value={value} id={`radio-field-${value}`} />
            <Label htmlFor={`radio-field-${value}`}>{label}</Label>
          </div>
        ))}
      </RadioGroup>
    </FieldSet>
  ),
  play: async ({ canvas }) => {
    await expect(canvas.getByRole("group", { name: "Notify me about" })).toBeInTheDocument();
    await expect(canvas.getByRole("radio", { name: "Direct messages and mentions" })).toBeChecked();
  },
};
