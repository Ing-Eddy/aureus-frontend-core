import {
  Field,
  FieldContent,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@aureus-core/ui/shadcn/field";
import { Label } from "@aureus-core/ui/shadcn/label";
import { Switch } from "@aureus-core/ui/shadcn/switch";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { expect, fn, userEvent } from "storybook/test";
import { docs } from "./switch-docs";

const meta = {
  title: "shadcn/Forms/Switch",
  component: Switch,
  parameters: { aureusDocs: docs },
  args: { size: "default", disabled: false, "aria-invalid": false, onCheckedChange: fn() },
  argTypes: {
    size: {
      control: "inline-radio",
      options: ["sm", "default"],
      table: { category: "Appearance" },
    },
    checked: { control: "boolean", table: { category: "State" } },
    disabled: { control: "boolean", table: { category: "State" } },
    "aria-invalid": { control: "boolean", table: { category: "State" } },
    onCheckedChange: { table: { category: "Events" } },
  },
  render: (args) => (
    <div className="flex items-center gap-2">
      <Switch id="switch-playground" {...args} />
      <Label htmlFor="switch-playground">Airplane mode</Label>
    </div>
  ),
} satisfies Meta<typeof Switch>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Space and Enter toggle; `onCheckedChange` receives the new value. */
export const Playground: Story = {
  play: async ({ args, canvas }) => {
    const control = canvas.getByRole("switch", { name: "Airplane mode" });
    await userEvent.tab();
    await userEvent.keyboard(" ");
    await expect(control).toBeChecked();
    await expect(args.onCheckedChange).toHaveBeenLastCalledWith(true);
    await userEvent.keyboard("{Enter}");
    await expect(control).not.toBeChecked();
    await expect(args.onCheckedChange).toHaveBeenLastCalledWith(false);
  },
};

export const Sizes: Story = {
  render: (args) => (
    <div className="flex items-center gap-6">
      {(["sm", "default"] as const).map((size) => (
        <div key={size} className="flex items-center gap-2">
          <Switch {...args} id={`switch-${size}`} size={size} defaultChecked />
          <Label htmlFor={`switch-${size}`}>{size}</Label>
        </div>
      ))}
    </div>
  ),
};

function ControlledExample() {
  const [checked, setChecked] = useState(false);
  return (
    <div className="grid gap-2">
      <div className="flex items-center gap-2">
        <Switch id="switch-controlled" checked={checked} onCheckedChange={setChecked} />
        <Label htmlFor="switch-controlled">Wi-Fi</Label>
      </div>
      <p className="text-muted-foreground text-sm">Wi-Fi is {checked ? "on" : "off"}.</p>
    </div>
  );
}

export const Controlled: Story = {
  render: () => <ControlledExample />,
  play: async ({ canvas }) => {
    await userEvent.click(canvas.getByRole("switch", { name: "Wi-Fi" }));
    await expect(canvas.getByText("Wi-Fi is on.")).toBeVisible();
  },
};

export const Disabled: Story = {
  render: () => (
    <div className="grid gap-3">
      <div className="flex items-center gap-2">
        <Switch id="switch-disabled-off" disabled />
        <Label htmlFor="switch-disabled-off">Beta features</Label>
      </div>
      <div className="flex items-center gap-2">
        <Switch id="switch-disabled-on" disabled defaultChecked />
        <Label htmlFor="switch-disabled-on">Managed by your organization</Label>
      </div>
    </div>
  ),
  play: async ({ canvas }) => {
    const control = canvas.getByRole("switch", { name: "Beta features" });
    await userEvent.click(control, { pointerEventsCheck: 0 });
    await expect(control).not.toBeChecked();
  },
};

const settings = [
  { id: "marketing", title: "Marketing emails", description: "News about products and features." },
  { id: "security", title: "Security emails", description: "Sign-in alerts and password changes." },
] as const;

export const SettingsList: Story = {
  render: () => (
    <FieldGroup className="w-96">
      {settings.map((setting) => (
        <Field key={setting.id} orientation="horizontal">
          <FieldContent>
            <FieldLabel htmlFor={`switch-${setting.id}`}>{setting.title}</FieldLabel>
            <FieldDescription id={`switch-${setting.id}-help`}>
              {setting.description}
            </FieldDescription>
          </FieldContent>
          <Switch
            id={`switch-${setting.id}`}
            aria-describedby={`switch-${setting.id}-help`}
            defaultChecked={setting.id === "security"}
          />
        </Field>
      ))}
    </FieldGroup>
  ),
  play: async ({ canvas }) => {
    await expect(
      canvas.getByRole("switch", { name: "Security emails" }),
    ).toHaveAccessibleDescription("Sign-in alerts and password changes.");
  },
};
