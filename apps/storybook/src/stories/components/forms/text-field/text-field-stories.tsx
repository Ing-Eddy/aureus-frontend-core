import { TextField, type TextFieldProps } from "@aureus-core/ui/components/text-field";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { CopyIcon, XIcon } from "lucide-react";
import { type ComponentType, useState } from "react";
import { expect, fn, userEvent, waitFor, within } from "storybook/test";
import { type ActionArgs, actionArgs, actionArgTypes, splitActionArgs } from "../field-action-args";
import type { StoryArgs } from "../story-args";
import { docs } from "./text-field-docs";

type TextFieldStoryArgs = StoryArgs<TextFieldProps> & ActionArgs;

const meta = {
  title: "components/Forms/Text Field",
  component: TextField as unknown as ComponentType<TextFieldStoryArgs>,
  parameters: { aureusDocs: docs },
  decorators: [
    (Story) => (
      <div className="w-full max-w-sm">
        <Story />
      </div>
    ),
  ],
  render: (args) => {
    const [props, action] = splitActionArgs(args);
    return <TextField {...(props as TextFieldProps)} action={action} />;
  },
  args: {
    label: "Username",
    placeholder: "ada",
    helperText: "Visible to other members.",
    info: "Use letters, numbers and dashes.",
    infoLabel: "More information",
    required: false,
    loading: false,
    loadingLabel: "Loading",
    disabled: false,
    error: false,
    errorMessage: "",
    onChange: fn(),
    onBlur: fn(),
    ...actionArgs,
  },
  argTypes: {
    label: { control: "text", table: { category: "Content" } },
    placeholder: { control: "text", table: { category: "Content" } },
    helperText: { control: "text", table: { category: "Content" } },
    info: { control: "text", table: { category: "Content" } },
    infoLabel: { control: "text", table: { category: "Content" } },
    errorMessage: { control: "text", table: { category: "Content" } },
    classNames: { control: "object", table: { category: "Appearance" } },
    className: { control: "text", table: { category: "Appearance" } },
    required: { control: "boolean", table: { category: "State" } },
    loading: { control: "boolean", table: { category: "State" } },
    loadingLabel: { control: "text", table: { category: "Content" } },
    disabled: { control: "boolean", table: { category: "State" } },
    error: { control: "boolean", table: { category: "State" } },
    ...actionArgTypes,
    onChange: { table: { category: "Events" } },
    onBlur: { table: { category: "Events" } },
  },
} satisfies Meta<TextFieldStoryArgs>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Every prop is wired to a control; the "Action" group adds, removes and changes the integrated
 * button. The play function checks the tab order (info → input → action), the tap-to-open info
 * tooltip, typing and the action.
 */
export const Playground: Story = {
  play: async ({ args, canvas }) => {
    const body = within(document.body);
    const info = canvas.getByRole("button", { name: "More information" });
    const input = canvas.getByRole("textbox", { name: "Username" });
    const action = canvas.getByRole("button", { name: "Check" });

    await userEvent.tab();
    await expect(info).toHaveFocus();
    await userEvent.tab();
    await expect(input).toHaveFocus();
    await userEvent.type(input, "ada");
    await expect(args.onChange).toHaveBeenCalledTimes(3);
    await userEvent.tab();
    await expect(action).toHaveFocus();
    await userEvent.keyboard("{Enter}");
    await expect(args.onActionClick).toHaveBeenCalledTimes(1);

    await userEvent.click(info);
    await expect(await body.findByRole("tooltip")).toHaveTextContent(
      "Use letters, numbers and dashes.",
    );
    await userEvent.keyboard("{Escape}");
    await waitFor(() => expect(body.queryByRole("tooltip")).toBeNull());
  },
};

export const States: Story = {
  render: () => (
    <div className="flex flex-col gap-6">
      <TextField
        infoLabel="More information"
        label="Email"
        required
        info="We never share it."
        placeholder="you@example.com"
      />
      <TextField label="Display name" helperText="Shown on your profile." />
      <TextField label="Website" defaultValue="example" error helperText="Include https://." />
      <TextField
        label="Phone"
        defaultValue="12"
        error
        helperText="With country code."
        errorMessage="Enter at least 8 digits."
      />
      <TextField loadingLabel="Loading" label="Coupon" defaultValue="WELCOME10" loading />
      <TextField
        label="Member ID"
        defaultValue="AUR-0042"
        disabled
        helperText="Assigned by the system."
      />
    </div>
  ),
  play: async ({ canvas }) => {
    await expect(canvas.getByRole("textbox", { name: "Email" })).toHaveAttribute(
      "aria-required",
      "true",
    );
    await expect(canvas.getByRole("textbox", { name: "Website" })).toHaveAttribute(
      "aria-invalid",
      "true",
    );
    await expect(canvas.getByRole("alert")).toHaveTextContent("Enter at least 8 digits.");
    await expect(canvas.getByRole("textbox", { name: "Coupon" })).toBeDisabled();
    await expect(canvas.getByRole("status", { name: "Loading" })).toBeInTheDocument();
    await expect(canvas.getByRole("textbox", { name: "Member ID" })).toBeDisabled();
  },
};

/** A controlled field whose action clears it; the action is disabled while the field is empty. */
function ClearableField() {
  const [value, setValue] = useState("aurora");
  return (
    <TextField
      label="Search"
      value={value}
      onChange={(event) => setValue(event.target.value)}
      helperText="The clear button is disabled while the field is empty."
      action={{
        children: <XIcon />,
        "aria-label": "Clear search",
        disabled: value === "",
        onClick: () => setValue(""),
      }}
    />
  );
}

export const WithAction: Story = {
  render: () => (
    <div className="flex flex-col gap-6">
      <TextField label="Promo code" placeholder="SPRING24" action={{ children: "Apply" }} />
      <TextField
        label="Invite link"
        defaultValue="https://aureus.dev/i/7f3k"
        readOnly
        action={{
          children: <CopyIcon />,
          "aria-label": "Copy link",
          tooltip: "Copy to clipboard",
          onClick: fn(),
        }}
      />
      <ClearableField />
    </div>
  ),
  play: async ({ canvas }) => {
    const body = within(document.body);
    await userEvent.hover(canvas.getByRole("button", { name: "Copy link" }));
    await expect(await body.findByRole("tooltip")).toHaveTextContent("Copy to clipboard");
    await userEvent.unhover(canvas.getByRole("button", { name: "Copy link" }));

    const search = canvas.getByRole("textbox", { name: "Search" });
    const clear = canvas.getByRole("button", { name: "Clear search" });
    await userEvent.click(clear);
    await expect(search).toHaveValue("");
    // Disabling only the action keeps the input usable.
    await expect(clear).toBeDisabled();
    await expect(search).toBeEnabled();
    await userEvent.type(search, "ada");
    await expect(clear).toBeEnabled();
  },
};

export const CustomLabelStyles: Story = {
  args: {
    label: "Company",
    required: true,
    helperText: "As it appears on invoices.",
    showAction: false,
    classNames: {
      label: "text-xs uppercase tracking-wider text-muted-foreground",
      requiredMark: "text-base leading-none",
      helper: "text-xs",
    },
  },
  play: async ({ canvas }) => {
    await expect(canvas.getByText("Company").closest("label")).toHaveClass("uppercase");
  },
};

const onCheck = fn();

/** Keyboard only: Tab order, Escape on the tooltip, and Enter and Space on the action. */
export const Keyboard: Story = {
  render: () => (
    <TextField
      label="Handle"
      info="Letters, numbers and dashes."
      infoLabel="More information"
      action={{ children: "Check", onClick: onCheck }}
    />
  ),
  play: async ({ canvas }) => {
    const body = within(document.body);
    onCheck.mockClear();
    await userEvent.tab();
    await expect(canvas.getByRole("button", { name: "More information" })).toHaveFocus();
    await expect(await body.findByRole("tooltip")).toHaveTextContent(
      "Letters, numbers and dashes.",
    );
    await userEvent.keyboard("{Escape}");
    await waitFor(() => expect(body.queryByRole("tooltip")).toBeNull());
    await userEvent.tab();
    const input = canvas.getByRole("textbox", { name: "Handle" });
    await expect(input).toHaveFocus();
    await userEvent.keyboard("ada");
    await expect(input).toHaveValue("ada");
    await userEvent.tab();
    await expect(canvas.getByRole("button", { name: "Check" })).toHaveFocus();
    await userEvent.keyboard("{Enter}");
    await userEvent.keyboard(" ");
    await expect(onCheck).toHaveBeenCalledTimes(2);
  },
};

/** Right to left: the action and the info button move to the inline end, on the left. */
export const Rtl: Story = {
  render: () => (
    <div dir="rtl">
      <TextField
        label="Handle"
        info="Letters, numbers and dashes."
        infoLabel="More information"
        action={{ children: "Check" }}
      />
    </div>
  ),
  play: async ({ canvas }) => {
    const input = canvas.getByRole("textbox", { name: "Handle" }).getBoundingClientRect();
    const action = canvas.getByRole("button", { name: "Check" }).getBoundingClientRect();
    const info = canvas.getByRole("button", { name: "More information" }).getBoundingClientRect();
    const label = canvas.getByText("Handle").getBoundingClientRect();
    await expect(action.right).toBeLessThanOrEqual(input.left + 1);
    await expect(info.right).toBeLessThanOrEqual(label.left);
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
    label: "Billing contact email address for monthly invoices",
    placeholder: "billing@company.example",
    info: "Invoices are sent on the first day of each month.",
    infoLabel: "More information",
    helperText: "Use a shared mailbox if several people pay the bills.",
    actionContent: "icon",
    actionIcon: "copy",
    actionText: "Copy email",
    actionTooltip: "",
  },
  play: async ({ canvas, canvasElement }) => {
    const field = canvasElement.querySelector("[data-slot=field]") as HTMLElement;
    await expect(field.scrollWidth).toBeLessThanOrEqual(field.clientWidth);
    await expect(canvas.getByRole("button", { name: "More information" })).toBeVisible();
    await expect(canvas.getByRole("button", { name: "Copy email" })).toBeVisible();
  },
};
