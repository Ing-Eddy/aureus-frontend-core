import { PasswordField } from "@aureus-core/ui/components/password-field";
import { Checkbox } from "@aureus-core/ui/shadcn/checkbox";
import { Label } from "@aureus-core/ui/shadcn/label";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { expect, fn, userEvent } from "storybook/test";
import { docs } from "./password-field-docs";

const meta = {
  title: "components/Forms/Password Field",
  component: PasswordField,
  parameters: { aureusDocs: docs },
  decorators: [
    (Story) => (
      <div className="w-full max-w-sm">
        <Story />
      </div>
    ),
  ],
  // `defaultVisible` only applies on mount; remount when it changes so the control is live.
  render: (args) => <PasswordField key={String(args.defaultVisible)} {...args} />,
  args: {
    label: "Password",
    helperText: "At least 8 characters.",
    info: "Use a passphrase: several words are easier to remember and harder to guess.",
    required: false,
    loading: false,
    disabled: false,
    error: false,
    errorMessage: "",
    defaultVisible: false,
    autoComplete: "current-password",
    showPasswordLabel: "Show password",
    hidePasswordLabel: "Hide password",
    onVisibleChange: fn(),
    onChange: fn(),
    onBlur: fn(),
  },
  argTypes: {
    label: { control: "text", table: { category: "Content" } },
    placeholder: { control: "text", table: { category: "Content" } },
    helperText: { control: "text", table: { category: "Content" } },
    info: { control: "text", table: { category: "Content" } },
    errorMessage: { control: "text", table: { category: "Content" } },
    showPasswordLabel: { control: "text", table: { category: "Content" } },
    hidePasswordLabel: { control: "text", table: { category: "Content" } },
    classNames: { control: "object", table: { category: "Appearance" } },
    className: { control: "text", table: { category: "Appearance" } },
    required: { control: "boolean", table: { category: "State" } },
    loading: { control: "boolean", table: { category: "State" } },
    disabled: { control: "boolean", table: { category: "State" } },
    error: { control: "boolean", table: { category: "State" } },
    defaultVisible: { control: "boolean", table: { category: "State" } },
    // Controlled visibility is shown in the ControlledVisibility story.
    visible: { control: false, table: { category: "State" } },
    autoComplete: {
      control: "inline-radio",
      options: ["current-password", "new-password", "off"],
      table: { category: "Behavior" },
    },
    onVisibleChange: { table: { category: "Events" } },
    onChange: { table: { category: "Events" } },
    onBlur: { table: { category: "Events" } },
  },
} satisfies Meta<typeof PasswordField>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * The play function checks the tab order (info → input → toggle), that clicking the toggle shows
 * the password while focus stays in the input, and that `onVisibleChange` is called.
 */
export const Playground: Story = {
  play: async ({ args, canvas }) => {
    const info = canvas.getByRole("button", { name: "More information" });
    const input = canvas.getByLabelText("Password");
    const toggle = canvas.getByRole("button", { name: "Show password" });

    await userEvent.tab();
    await expect(info).toHaveFocus();
    await userEvent.tab();
    await expect(input).toHaveFocus();
    await userEvent.type(input, "secret");
    await expect(input).toHaveAttribute("type", "password");

    await userEvent.click(toggle);
    await expect(input).toHaveAttribute("type", "text");
    await expect(input).toHaveFocus();
    await expect(canvas.getByRole("button", { name: "Hide password" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    await expect(args.onVisibleChange).toHaveBeenCalledWith(true);

    await userEvent.tab();
    await expect(canvas.getByRole("button", { name: "Hide password" })).toHaveFocus();
    await userEvent.keyboard(" ");
    await expect(input).toHaveAttribute("type", "password");
  },
};

export const States: Story = {
  render: () => (
    <div className="flex flex-col gap-6">
      <PasswordField label="Password" required info="Ask your administrator if you forgot it." />
      <PasswordField label="Current password" helperText="The one you use today." />
      <PasswordField
        label="New password"
        defaultValue="short"
        error
        helperText="At least 8 characters."
        errorMessage="Use at least 8 characters."
      />
      <PasswordField label="API secret" defaultValue="sk-live-1234" loading />
      <PasswordField
        label="Recovery key"
        defaultValue="aureus-recovery"
        disabled
        helperText="Managed by your organization."
      />
    </div>
  ),
  play: async ({ canvas }) => {
    await expect(canvas.getByLabelText(/^Password/)).toHaveAttribute("aria-required", "true");
    await expect(canvas.getByRole("alert")).toHaveTextContent("Use at least 8 characters.");
    await expect(canvas.getByLabelText("API secret")).toBeDisabled();
    await expect(canvas.getByRole("status", { name: "Loading" })).toBeInTheDocument();
    const toggles = canvas.getAllByRole("button", { name: "Show password" });
    // Loading and disabled fields disable their toggles; the other three stay enabled.
    await expect(toggles.filter((toggle) => (toggle as HTMLButtonElement).disabled)).toHaveLength(
      2,
    );
  },
};

function SharedVisibility() {
  const [show, setShow] = useState(false);
  return (
    <div className="flex flex-col gap-6">
      <PasswordField
        label="New password"
        autoComplete="new-password"
        defaultValue="correct horse"
        visible={show}
        onVisibleChange={setShow}
      />
      <PasswordField
        label="Repeat password"
        autoComplete="new-password"
        defaultValue="correct horse"
        visible={show}
        onVisibleChange={setShow}
      />
      <div className="flex items-center gap-2">
        <Checkbox
          id="show-passwords"
          checked={show}
          onCheckedChange={(checked) => setShow(checked === true)}
        />
        <Label htmlFor="show-passwords">Show passwords</Label>
      </div>
    </div>
  );
}

export const ControlledVisibility: Story = {
  render: () => <SharedVisibility />,
  play: async ({ canvas }) => {
    const first = canvas.getByLabelText("New password");
    const second = canvas.getByLabelText("Repeat password");

    await userEvent.click(canvas.getByRole("checkbox", { name: "Show passwords" }));
    await expect(first).toHaveAttribute("type", "text");
    await expect(second).toHaveAttribute("type", "text");

    await userEvent.click(canvas.getAllByRole("button", { name: "Hide password" })[1] as Element);
    await expect(first).toHaveAttribute("type", "password");
    await expect(second).toHaveAttribute("type", "password");
    await expect(canvas.getByRole("checkbox", { name: "Show passwords" })).not.toBeChecked();
  },
};

export const NewPassword: Story = {
  args: {
    label: "Create a password",
    required: true,
    autoComplete: "new-password",
    helperText: "At least 8 characters, including a number.",
    info: undefined,
  },
  play: async ({ canvas }) => {
    await expect(canvas.getByLabelText(/^Create a password/)).toHaveAttribute(
      "autocomplete",
      "new-password",
    );
  },
};

export const Responsive: Story = {
  decorators: [
    (Story) => (
      <div className="w-48 border border-dashed p-2">
        <Story />
      </div>
    ),
  ],
  args: {
    label: "Password for the shared billing mailbox",
    placeholder: "correct horse battery staple",
    helperText: "Rotate it every 90 days.",
  },
  play: async ({ canvas, canvasElement }) => {
    const field = canvasElement.querySelector("[data-slot=field]") as HTMLElement;
    await expect(field.scrollWidth).toBeLessThanOrEqual(field.clientWidth);
    await expect(canvas.getByRole("button", { name: "Show password" })).toBeVisible();
  },
};
