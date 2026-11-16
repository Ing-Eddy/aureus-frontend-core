import { CheckboxField } from "@aureus-core/ui/components/checkbox-field";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { type ComponentType, type MouseEvent, useState } from "react";
import { expect, fn, userEvent, waitFor, within } from "storybook/test";
import { type ActionArgs, actionArgs, actionArgTypes, splitActionArgs } from "../field-action-args";
import { infoTexts, loadingTexts } from "../story-args";
import { docs } from "./checkbox-field-docs";

/** Flat, story-only args; the render builds the value props from `valueMode`. */
interface PlaygroundArgs extends ActionArgs {
  label: string;
  checkboxLabel: string;
  helperText: string;
  info: string;
  infoLabel: string;
  errorMessage: string;
  valueMode: "boolean" | "S / N" | "1 / 0";
  indeterminate: boolean;
  checkboxPosition: "start" | "end";
  appearance: "plain" | "card";
  required: boolean;
  loading: boolean;
  loadingLabel: string;
  disabled: boolean;
  error: boolean;
  onValueChange: (value: unknown) => void;
}

const text = (value: string) => (value === "" ? undefined : value);

/** Demo links do not navigate away from the story. */
const stayOnPage = (event: MouseEvent) => event.preventDefault();

function PlaygroundRender(args: PlaygroundArgs) {
  const [base, action] = splitActionArgs(args);
  const common = {
    label: text(base.label),
    checkboxLabel: text(base.checkboxLabel),
    helperText: text(base.helperText),
    ...infoTexts(base.info, base.infoLabel),
    errorMessage: text(base.errorMessage),
    indeterminate: base.indeterminate,
    checkboxPosition: base.checkboxPosition,
    appearance: base.appearance,
    required: base.required,
    ...loadingTexts(base.loading, base.loadingLabel),
    disabled: base.disabled,
    error: base.error,
    action,
  };
  if (base.valueMode === "S / N") {
    return (
      <CheckboxField
        {...common}
        checkedValue="S"
        uncheckedValue="N"
        onValueChange={base.onValueChange}
      />
    );
  }
  if (base.valueMode === "1 / 0") {
    return (
      <CheckboxField
        {...common}
        checkedValue={1}
        uncheckedValue={0}
        onValueChange={base.onValueChange}
      />
    );
  }
  return <CheckboxField {...common} onValueChange={base.onValueChange} />;
}

const content = { table: { category: "Content" } };
const behavior = { table: { category: "Behavior" } };
const state = { table: { category: "State" } };

const meta = {
  title: "components/Forms/Checkbox Field",
  component: CheckboxField as unknown as ComponentType<PlaygroundArgs>,
  parameters: { aureusDocs: docs },
  decorators: [
    (Story) => (
      <div className="w-full max-w-sm">
        <Story />
      </div>
    ),
  ],
  render: (args) => <PlaygroundRender {...args} />,
  args: {
    label: "",
    checkboxLabel: "Receive the weekly digest",
    helperText: "",
    info: "",
    infoLabel: "More information",
    errorMessage: "",
    valueMode: "boolean",
    indeterminate: false,
    checkboxPosition: "start",
    appearance: "plain",
    required: false,
    loading: false,
    loadingLabel: "Loading",
    disabled: false,
    error: false,
    onValueChange: fn(),
    ...actionArgs,
    showAction: false,
  },
  argTypes: {
    label: { control: "text", ...content },
    checkboxLabel: { control: "text", ...content },
    helperText: { control: "text", ...content },
    info: { control: "text", ...content },
    infoLabel: { control: "text", ...content },
    errorMessage: { control: "text", ...content },
    valueMode: { control: "inline-radio", options: ["boolean", "S / N", "1 / 0"], ...behavior },
    indeterminate: { control: "boolean", ...behavior },
    checkboxPosition: { control: "inline-radio", options: ["start", "end"], ...behavior },
    appearance: { control: "inline-radio", options: ["plain", "card"], ...behavior },
    required: { control: "boolean", ...state },
    loading: { control: "boolean", ...state },
    loadingLabel: { control: "text", ...content },
    disabled: { control: "boolean", ...state },
    error: { control: "boolean", ...state },
    ...actionArgTypes,
    onValueChange: { table: { category: "Events" } },
  },
} satisfies Meta<PlaygroundArgs>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Every option has a control; the value mode switches between boolean and custom values. */
export const Playground: Story = {
  play: async ({ args, canvas }) => {
    await userEvent.click(canvas.getByRole("checkbox", { name: "Receive the weekly digest" }));
    await expect(args.onValueChange).toHaveBeenLastCalledWith(true);
  },
};

export const BooleanValue: Story = {
  render: () => <CheckboxField checkboxLabel="Remember me on this device" />,
  play: async ({ canvas }) => {
    const box = canvas.getByRole("checkbox", { name: "Remember me on this device" });
    await userEvent.click(canvas.getByText("Remember me on this device"));
    await expect(box).toHaveAttribute("aria-checked", "true");
    // The checked fill comes from shadcn's classes: assert the real style.
    await expect(getComputedStyle(box).backgroundColor).not.toBe("rgba(0, 0, 0, 0)");
  },
};

export const LabelAndText: Story = {
  render: () => (
    <CheckboxField
      infoLabel="More information"
      label="Notifications"
      checkboxLabel="Receive the weekly digest by email"
      helperText="You can change it at any time."
      info="We send it on Mondays."
    />
  ),
  play: async ({ canvas }) => {
    const group = canvas.getByRole("group", { name: "Notifications" });
    await expect(
      within(group).getByRole("checkbox", { name: "Receive the weekly digest by email" }),
    ).toHaveAccessibleDescription(/You can change it at any time\./);
  },
};

export const TextOnly: Story = {
  render: () => <CheckboxField checkboxLabel="I accept the terms and conditions" required />,
  play: async ({ canvas }) => {
    await expect(canvas.getByRole("checkbox", { name: /^I accept the terms/ })).toHaveAttribute(
      "aria-required",
      "true",
    );
  },
};

export const RichText: Story = {
  render: () => (
    <CheckboxField
      checkboxLabel={
        <>
          I accept the{" "}
          <a href="/legal/terms" onClick={stayOnPage} className="underline underline-offset-4">
            terms and conditions
          </a>{" "}
          and the{" "}
          <a href="/legal/privacy" onClick={stayOnPage} className="underline underline-offset-4">
            privacy policy
          </a>
        </>
      }
    />
  ),
  play: async ({ canvas }) => {
    const box = canvas.getByRole("checkbox");
    await userEvent.click(canvas.getByRole("link", { name: "terms and conditions" }));
    await expect(box).toHaveAttribute("aria-checked", "false");
    await userEvent.click(canvas.getByText(/I accept the/));
    await expect(box).toHaveAttribute("aria-checked", "true");
  },
};

function CustomValuesExample() {
  const [value, setValue] = useState<"S" | "N">("N");
  return (
    <div className="flex flex-col gap-3">
      <CheckboxField
        label="Status"
        checkboxLabel="Active"
        checkedValue="S"
        uncheckedValue="N"
        value={value}
        onValueChange={setValue}
      />
      <output aria-label="Stored value" className="font-mono text-xs">
        {JSON.stringify(value)}
      </output>
    </div>
  );
}

export const CustomValues: Story = {
  render: () => <CustomValuesExample />,
  play: async ({ canvas }) => {
    await userEvent.click(canvas.getByRole("checkbox", { name: "Active" }));
    await expect(canvas.getByRole("status", { name: "Stored value" })).toHaveTextContent('"S"');
  },
};

const permissions = ["Read", "Write", "Delete"];

function IndeterminateExample() {
  const [checked, setChecked] = useState<string[]>(["Read"]);
  const all = checked.length === permissions.length;
  return (
    <div className="flex flex-col gap-3">
      <CheckboxField
        checkboxLabel="All permissions"
        value={all}
        indeterminate={checked.length > 0 && !all}
        onValueChange={(next) => setChecked(next ? permissions : [])}
      />
      <div className="flex flex-col gap-3 ps-6">
        {permissions.map((permission) => (
          <CheckboxField
            key={permission}
            checkboxLabel={permission}
            value={checked.includes(permission)}
            onValueChange={(next) =>
              setChecked((current) =>
                next ? [...current, permission] : current.filter((item) => item !== permission),
              )
            }
          />
        ))}
      </div>
    </div>
  );
}

export const Indeterminate: Story = {
  render: () => <IndeterminateExample />,
  play: async ({ canvas }) => {
    const all = canvas.getByRole("checkbox", { name: "All permissions" });
    await expect(all).toHaveAttribute("aria-checked", "mixed");
    // The mixed state is drawn by our classes on top of shadcn: assert the fill and the dash.
    await expect(getComputedStyle(all).backgroundColor).not.toBe("rgba(0, 0, 0, 0)");
    await expect(getComputedStyle(all, "::before").width).toBe("8px");
    await userEvent.click(all);
    await expect(all).toHaveAttribute("aria-checked", "true");
    await expect(canvas.getByRole("checkbox", { name: "Delete" })).toHaveAttribute(
      "aria-checked",
      "true",
    );
    await userEvent.click(canvas.getByRole("checkbox", { name: "Write" }));
    await expect(all).toHaveAttribute("aria-checked", "mixed");
  },
};

export const PositionEnd: Story = {
  render: () => (
    <div className="flex flex-col divide-y">
      <CheckboxField
        className="py-3"
        checkboxLabel="Compact mode"
        helperText="Reduces the space between rows."
        checkboxPosition="end"
      />
      <CheckboxField
        className="py-3"
        checkboxLabel="Show week numbers"
        checkboxPosition="end"
        defaultValue
      />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const row = canvasElement.querySelector("[data-slot=checkbox-row]") as HTMLElement;
    const box = row.querySelector("[data-slot=checkbox]") as HTMLElement;
    const label = row.querySelector("[data-slot=checkbox-label]") as HTMLElement;
    await expect(box.getBoundingClientRect().left).toBeGreaterThan(
      label.getBoundingClientRect().left,
    );
  },
};

export const Card: Story = {
  render: () => (
    <div className="flex flex-col gap-3">
      <CheckboxField
        checkboxLabel="Two-factor authentication"
        helperText="Ask for a code when signing in on a new device."
        appearance="card"
        defaultValue
      />
      <CheckboxField
        checkboxLabel="Login alerts"
        helperText="Email me when someone signs in."
        appearance="card"
      />
    </div>
  ),
  play: async ({ canvasElement, canvas }) => {
    const [checkedCard, card] = [
      ...canvasElement.querySelectorAll<HTMLElement>("[data-slot=checkbox-row]"),
    ];
    if (!checkedCard || !card) throw new Error("cards not rendered");
    // Highlight of a checked card (computed, not just the class name).
    await expect(getComputedStyle(checkedCard).borderColor).not.toBe(
      getComputedStyle(card).borderColor,
    );
    await userEvent.click(card);
    await expect(canvas.getByRole("checkbox", { name: "Login alerts" })).toHaveAttribute(
      "aria-checked",
      "true",
    );
  },
};

export const Keyboard: Story = {
  render: () => <CheckboxField checkboxLabel="Remember me" />,
  play: async ({ canvas }) => {
    const box = canvas.getByRole("checkbox", { name: "Remember me" });
    await userEvent.tab();
    await expect(box).toHaveFocus();
    await userEvent.keyboard("{Enter}");
    await expect(box).toHaveAttribute("aria-checked", "false");
    await userEvent.keyboard(" ");
    await expect(box).toHaveAttribute("aria-checked", "true");
  },
};

export const States: Story = {
  render: () => (
    <div className="flex flex-col gap-6">
      <CheckboxField
        infoLabel="More information"
        label="Terms"
        checkboxLabel="I accept the terms"
        required
        info="Required to create the account."
        action={{ children: "View", onClick: fn() }}
      />
      <CheckboxField checkboxLabel="Weekly digest" helperText="Sent on Mondays." />
      <CheckboxField
        checkboxLabel="I accept the privacy policy"
        error
        errorMessage="Accept it to continue."
      />
      <CheckboxField
        loadingLabel="Loading"
        checkboxLabel="Syncing preferences"
        loading
        defaultValue
      />
      <CheckboxField checkboxLabel="Managed by your organization" disabled defaultValue />
    </div>
  ),
  play: async ({ canvas }) => {
    await expect(canvas.getByRole("alert")).toHaveTextContent("Accept it to continue.");
    const syncing = canvas.getByRole("checkbox", { name: "Syncing preferences" });
    await expect(syncing).toHaveAttribute("aria-busy", "true");
    await userEvent.click(syncing);
    await waitFor(() => expect(syncing).toHaveAttribute("aria-checked", "true"));
  },
};

/** Right to left: the box moves to the inline start, on the right of its text. */
export const Rtl: Story = {
  render: () => (
    <div dir="rtl">
      <CheckboxField checkboxLabel="Receive the weekly digest" />
    </div>
  ),
  play: async ({ canvas }) => {
    const box = canvas.getByRole("checkbox", { name: "Receive the weekly digest" });
    const text = canvas.getByText("Receive the weekly digest");
    await expect(box.getBoundingClientRect().left).toBeGreaterThanOrEqual(
      text.getBoundingClientRect().right - 1,
    );
  },
};

export const Responsive: Story = {
  decorators: [
    (Story) => (
      <div className="w-56 border border-dashed p-2">
        <Story />
      </div>
    ),
  ],
  render: () => (
    <CheckboxField
      label="Marketing"
      checkboxLabel="I want to receive news, offers and product updates from the company and its partners"
      helperText="You can unsubscribe at any time."
    />
  ),
  play: async ({ canvasElement }) => {
    const field = canvasElement.querySelector("[data-slot=field]") as HTMLElement;
    await expect(field.scrollWidth).toBeLessThanOrEqual(field.clientWidth);
  },
};
