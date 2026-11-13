import { Checkbox } from "@aureus-core/ui/shadcn/checkbox";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@aureus-core/ui/shadcn/field";
import { Label } from "@aureus-core/ui/shadcn/label";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { expect, fn, userEvent } from "storybook/test";
import { docs } from "./checkbox-docs";

const meta = {
  title: "shadcn/Forms/Checkbox",
  component: Checkbox,
  parameters: { aureusDocs: docs },
  args: { disabled: false, required: false, "aria-invalid": false, onCheckedChange: fn() },
  argTypes: {
    checked: {
      control: "inline-radio",
      options: [true, false, "indeterminate"],
      table: { category: "State" },
    },
    disabled: { control: "boolean", table: { category: "State" } },
    required: { control: "boolean", table: { category: "Behavior" } },
    "aria-invalid": { control: "boolean", table: { category: "State" } },
    onCheckedChange: { table: { category: "Events" } },
  },
  render: (args) => (
    <div className="flex items-center gap-2">
      <Checkbox id="checkbox-playground" {...args} />
      <Label htmlFor="checkbox-playground">Accept terms and conditions</Label>
    </div>
  ),
} satisfies Meta<typeof Checkbox>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Space toggles the box and `onCheckedChange` receives the new state. */
export const Playground: Story = {
  play: async ({ args, canvas }) => {
    const checkbox = canvas.getByRole("checkbox", { name: "Accept terms and conditions" });
    await userEvent.tab();
    await expect(checkbox).toHaveFocus();
    await userEvent.keyboard(" ");
    await expect(checkbox).toBeChecked();
    await expect(args.onCheckedChange).toHaveBeenLastCalledWith(true);
    await userEvent.keyboard(" ");
    await expect(checkbox).not.toBeChecked();
    await expect(args.onCheckedChange).toHaveBeenLastCalledWith(false);
  },
};

function ControlledExample() {
  const [checked, setChecked] = useState<boolean | "indeterminate">(true);
  return (
    <div className="grid gap-2">
      <div className="flex items-center gap-2">
        <Checkbox id="checkbox-controlled" checked={checked} onCheckedChange={setChecked} />
        <Label htmlFor="checkbox-controlled">Email me a receipt</Label>
      </div>
      <p className="text-muted-foreground text-sm">checked: {String(checked)}</p>
    </div>
  );
}

export const Controlled: Story = {
  render: () => <ControlledExample />,
  play: async ({ canvas }) => {
    await userEvent.click(canvas.getByRole("checkbox", { name: "Email me a receipt" }));
    await expect(canvas.getByText("checked: false")).toBeVisible();
  },
};

const toppings = ["Cheese", "Tomato", "Basil"] as const;

function IndeterminateExample() {
  const [selected, setSelected] = useState<string[]>(["Cheese"]);
  const all = selected.length === toppings.length;
  const parent = all ? true : selected.length > 0 ? "indeterminate" : false;
  return (
    <div className="grid gap-3">
      <div className="flex items-center gap-2">
        <Checkbox
          id="checkbox-all"
          checked={parent}
          onCheckedChange={(value) => setSelected(value === true ? [...toppings] : [])}
        />
        <Label htmlFor="checkbox-all">All toppings</Label>
      </div>
      <div className="grid gap-2 ps-6">
        {toppings.map((topping) => (
          <div key={topping} className="flex items-center gap-2">
            <Checkbox
              id={`checkbox-${topping}`}
              checked={selected.includes(topping)}
              onCheckedChange={(value) =>
                setSelected((current) =>
                  value === true ? [...current, topping] : current.filter((t) => t !== topping),
                )
              }
            />
            <Label htmlFor={`checkbox-${topping}`}>{topping}</Label>
          </div>
        ))}
      </div>
    </div>
  );
}

/** The parent is `aria-checked="mixed"` until every child is checked. */
export const Indeterminate: Story = {
  render: () => <IndeterminateExample />,
  play: async ({ canvas }) => {
    const parent = canvas.getByRole("checkbox", { name: "All toppings" });
    await expect(parent).toHaveAttribute("aria-checked", "mixed");
    await userEvent.click(parent);
    for (const topping of toppings) {
      await expect(canvas.getByRole("checkbox", { name: topping })).toBeChecked();
    }
    await expect(parent).toBeChecked();
  },
};

export const Disabled: Story = {
  render: () => (
    <div className="grid gap-2">
      <div className="flex items-center gap-2">
        <Checkbox id="checkbox-disabled-off" disabled />
        <Label htmlFor="checkbox-disabled-off">Unavailable option</Label>
      </div>
      <div className="flex items-center gap-2">
        <Checkbox id="checkbox-disabled-on" disabled defaultChecked />
        <Label htmlFor="checkbox-disabled-on">Required by your plan</Label>
      </div>
    </div>
  ),
  play: async ({ canvas }) => {
    const checkbox = canvas.getByRole("checkbox", { name: "Unavailable option" });
    await userEvent.click(checkbox, { pointerEventsCheck: 0 });
    await expect(checkbox).not.toBeChecked();
  },
};

export const Invalid: Story = {
  render: () => (
    <Field orientation="horizontal" data-invalid>
      <Checkbox id="checkbox-invalid" required aria-invalid aria-describedby="checkbox-error" />
      <FieldLabel htmlFor="checkbox-invalid">I agree to the privacy policy</FieldLabel>
      <FieldError id="checkbox-error" className="sr-only">
        You must agree to continue.
      </FieldError>
    </Field>
  ),
  play: async ({ canvas }) => {
    const checkbox = canvas.getByRole("checkbox", { name: "I agree to the privacy policy" });
    await expect(checkbox).toHaveAccessibleDescription("You must agree to continue.");
  },
};

export const GroupInField: Story = {
  render: () => (
    <FieldSet className="w-80">
      <FieldLegend variant="label">Show on desktop</FieldLegend>
      <FieldDescription>Items to show on the desktop.</FieldDescription>
      <FieldGroup data-slot="checkbox-group">
        {["Hard disks", "External disks", "Connected servers"].map((item, index) => (
          <Field key={item} orientation="horizontal">
            <Checkbox id={`checkbox-group-${index}`} defaultChecked={index === 0} />
            <FieldLabel htmlFor={`checkbox-group-${index}`}>{item}</FieldLabel>
          </Field>
        ))}
      </FieldGroup>
    </FieldSet>
  ),
};
