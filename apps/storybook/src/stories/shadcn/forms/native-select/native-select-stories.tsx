import { Label } from "@aureus-core/ui/shadcn/label";
import {
  NativeSelect,
  NativeSelectOptGroup,
  NativeSelectOption,
} from "@aureus-core/ui/shadcn/native-select";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, userEvent } from "storybook/test";
import { docs } from "./native-select-docs";

const fruitOptions = (
  <>
    <NativeSelectOption value="">Select a fruit</NativeSelectOption>
    <NativeSelectOption value="apple">Apple</NativeSelectOption>
    <NativeSelectOption value="banana">Banana</NativeSelectOption>
    <NativeSelectOption value="cherry">Cherry</NativeSelectOption>
  </>
);

const meta = {
  title: "shadcn/Forms/Native Select",
  component: NativeSelect,
  parameters: { aureusDocs: docs },
  args: { size: "default", disabled: false, "aria-invalid": false, onChange: fn() },
  argTypes: {
    size: {
      control: "inline-radio",
      options: ["sm", "default"],
      table: { category: "Appearance" },
    },
    disabled: { control: "boolean", table: { category: "State" } },
    "aria-invalid": { control: "boolean", table: { category: "State" } },
    onChange: { table: { category: "Events" } },
    children: { control: false },
  },
  render: (args) => (
    <div className="grid gap-2">
      <Label htmlFor="native-select-playground">Fruit</Label>
      <NativeSelect id="native-select-playground" {...args}>
        {fruitOptions}
      </NativeSelect>
    </div>
  ),
} satisfies Meta<typeof NativeSelect>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Choosing an option updates the value and calls `onChange`. */
export const Playground: Story = {
  play: async ({ args, canvas }) => {
    const select = canvas.getByLabelText("Fruit");
    await userEvent.selectOptions(select, "banana");
    await expect(select).toHaveValue("banana");
    await expect(args.onChange).toHaveBeenCalledTimes(1);
  },
};

export const Sizes: Story = {
  render: (args) => (
    <div className="flex items-end gap-4">
      {(["sm", "default"] as const).map((size) => (
        <div key={size} className="grid gap-2">
          <Label htmlFor={`native-select-${size}`}>{size}</Label>
          <NativeSelect {...args} id={`native-select-${size}`} size={size}>
            {fruitOptions}
          </NativeSelect>
        </div>
      ))}
    </div>
  ),
};

export const OptionGroups: Story = {
  render: (args) => (
    <div className="grid gap-2">
      <Label htmlFor="native-select-groups">Time zone</Label>
      <NativeSelect {...args} id="native-select-groups" defaultValue="europe/madrid">
        <NativeSelectOptGroup label="Europe">
          <NativeSelectOption value="europe/madrid">Madrid</NativeSelectOption>
          <NativeSelectOption value="europe/london">London</NativeSelectOption>
          <NativeSelectOption value="europe/kyiv" disabled>
            Kyiv (unavailable)
          </NativeSelectOption>
        </NativeSelectOptGroup>
        <NativeSelectOptGroup label="Americas">
          <NativeSelectOption value="america/bogota">Bogotá</NativeSelectOption>
          <NativeSelectOption value="america/mexico_city">Mexico City</NativeSelectOption>
          <NativeSelectOption value="america/new_york">New York</NativeSelectOption>
        </NativeSelectOptGroup>
      </NativeSelect>
    </div>
  ),
  play: async ({ canvas }) => {
    const select = canvas.getByLabelText("Time zone");
    await expect(canvas.getByRole("group", { name: "Americas" })).toBeInTheDocument();
    await expect(canvas.getByRole("option", { name: "Kyiv (unavailable)" })).toBeDisabled();
    await userEvent.selectOptions(select, "america/bogota");
    await expect(select).toHaveValue("america/bogota");
  },
};

export const Disabled: Story = {
  args: { disabled: true },
  play: async ({ canvas }) => {
    await expect(canvas.getByLabelText("Fruit")).toBeDisabled();
  },
};

export const Invalid: Story = {
  args: { "aria-invalid": true, "aria-describedby": "native-select-error" },
  render: (args) => (
    <div className="grid gap-2">
      <Label htmlFor="native-select-invalid">Fruit</Label>
      <NativeSelect id="native-select-invalid" {...args}>
        {fruitOptions}
      </NativeSelect>
      <p id="native-select-error" className="text-destructive text-sm">
        Choose a fruit to continue.
      </p>
    </div>
  ),
  play: async ({ canvas }) => {
    await expect(canvas.getByLabelText("Fruit")).toHaveAccessibleDescription(
      "Choose a fruit to continue.",
    );
  },
};
