import { RadioGroupField } from "@aureus-core/ui/components/radio-group-field";
import { billing, frequencies, plans, shipping, sources } from "@fixtures/radio-options";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { type ComponentType, useState } from "react";
import { expect, fn, userEvent, waitFor, within } from "storybook/test";
import { infoTexts, loadingTexts } from "../story-args";
import { docs } from "./radio-group-field-docs";

/** Flat, story-only args; the render builds `otherOption` from its texts. */
interface PlaygroundArgs {
  label: string;
  helperText: string;
  info: string;
  infoLabel: string;
  errorMessage: string;
  otherLabel: string;
  otherInputLabel: string;
  orientation: "vertical" | "horizontal";
  columns?: 2 | 3 | 4;
  appearance: "plain" | "card" | "segmented";
  radioPosition: "start" | "end";
  deselectable: boolean;
  required: boolean;
  loading: boolean;
  loadingLabel: string;
  disabled: boolean;
  error: boolean;
  onValueChange: (value: string | null) => void;
}

const text = (value: string) => (value === "" ? undefined : value);

/** The computed style of an element, for real-style assertions. */
const style = (element: Element) => getComputedStyle(element);

/**
 * Presses an arrow key the way a person does: Radix checks the radio it moves to only while the
 * key is still down (after focus moves, in a later task), so the key is released afterwards.
 */
async function pressArrow(
  key: "ArrowDown" | "ArrowUp" | "ArrowLeft" | "ArrowRight",
  checked: HTMLElement,
) {
  await userEvent.keyboard(`{${key}>}`);
  await waitFor(() => expect(checked).toHaveAttribute("aria-checked", "true"));
  await userEvent.keyboard(`{/${key}}`);
}

const content = { table: { category: "Content" } };
const behavior = { table: { category: "Behavior" } };
const layout = { table: { category: "Layout" } };
const state = { table: { category: "State" } };

const meta = {
  title: "components/Forms/Radio Group Field",
  component: RadioGroupField as unknown as ComponentType<PlaygroundArgs>,
  parameters: { aureusDocs: docs },
  decorators: [
    (Story) => (
      <div className="w-full max-w-sm">
        <Story />
      </div>
    ),
  ],
  render: (args) => (
    <RadioGroupField
      label={text(args.label)}
      helperText={text(args.helperText)}
      {...infoTexts(args.info, args.infoLabel)}
      errorMessage={text(args.errorMessage)}
      options={plans}
      otherOption={
        args.otherLabel && args.otherInputLabel
          ? { label: args.otherLabel, inputLabel: args.otherInputLabel }
          : undefined
      }
      orientation={args.orientation}
      columns={args.columns}
      appearance={args.appearance}
      radioPosition={args.radioPosition}
      deselectable={args.deselectable}
      required={args.required}
      {...loadingTexts(args.loading, args.loadingLabel)}
      disabled={args.disabled}
      error={args.error}
      onValueChange={args.onValueChange}
    />
  ),
  args: {
    label: "Plan",
    helperText: "",
    info: "",
    infoLabel: "More information",
    errorMessage: "",
    otherLabel: "",
    otherInputLabel: "",
    orientation: "vertical",
    appearance: "plain",
    radioPosition: "start",
    deselectable: false,
    required: false,
    loading: false,
    loadingLabel: "Loading",
    disabled: false,
    error: false,
    onValueChange: fn(),
  },
  argTypes: {
    label: { control: "text", ...content },
    helperText: { control: "text", ...content },
    info: { control: "text", ...content },
    infoLabel: { control: "text", ...content },
    errorMessage: { control: "text", ...content },
    otherLabel: { control: "text", name: "otherOption.label", ...behavior },
    otherInputLabel: { control: "text", name: "otherOption.inputLabel", ...behavior },
    deselectable: { control: "boolean", ...behavior },
    orientation: { control: "inline-radio", options: ["vertical", "horizontal"], ...layout },
    columns: { control: "inline-radio", options: [undefined, 2, 3, 4], ...layout },
    appearance: { control: "inline-radio", options: ["plain", "card", "segmented"], ...layout },
    radioPosition: { control: "inline-radio", options: ["start", "end"], ...layout },
    required: { control: "boolean", ...state },
    loading: { control: "boolean", ...state },
    loadingLabel: { control: "text", ...content },
    disabled: { control: "boolean", ...state },
    error: { control: "boolean", ...state },
    onValueChange: { table: { category: "Events" } },
  },
} satisfies Meta<PlaygroundArgs>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Every extra has a control; the other option appears once both of its texts are filled in. */
export const Playground: Story = {
  play: async ({ args, canvas }) => {
    await userEvent.click(canvas.getByRole("radio", { name: "Pro" }));
    await userEvent.click(canvas.getByRole("radio", { name: "Team" }));
    await expect(args.onValueChange).toHaveBeenLastCalledWith("team");
    await expect(canvas.getByRole("radio", { name: "Pro" })).toHaveAttribute(
      "aria-checked",
      "false",
    );
  },
};

export const Basic: Story = {
  render: () => <RadioGroupField label="Shipping" options={shipping} />,
  play: async ({ canvas }) => {
    const group = canvas.getByRole("radiogroup", { name: "Shipping" });
    await userEvent.click(within(group).getByText("Express"));
    const express = canvas.getByRole("radio", { name: "Express" });
    await expect(express).toHaveAttribute("aria-checked", "true");
    await expect(style(express).backgroundColor).not.toBe("rgba(0, 0, 0, 0)");
  },
};

export const WithDescriptions: Story = {
  render: () => <RadioGroupField label="Plan" options={plans} defaultValue="pro" />,
  play: async ({ canvas }) => {
    await expect(canvas.getByRole("radio", { name: "Pro" })).toHaveAccessibleDescription(
      "Unlimited projects, 10 members.",
    );
    await expect(canvas.getByRole("radio", { name: "Enterprise" })).toBeDisabled();
    // A disabled option must not dim the enabled radios.
    await expect(style(canvas.getByRole("radio", { name: "Free" })).opacity).toBe("1");
  },
};

export const Horizontal: Story = {
  render: () => <RadioGroupField label="Shipping" options={shipping} orientation="horizontal" />,
  play: async ({ canvas, canvasElement }) => {
    const [first, second] = [...canvasElement.querySelectorAll("[data-slot=radio-row]")];
    if (!first || !second) throw new Error("rows not rendered");
    await expect(first.getBoundingClientRect().top).toBe(second.getBoundingClientRect().top);
    await userEvent.click(canvas.getByRole("radio", { name: "Standard" }));
    await pressArrow("ArrowRight", canvas.getByRole("radio", { name: "Express" }));
  },
};

export const Columns: Story = {
  decorators: [(Story) => <Story />],
  render: () => (
    <div className="flex flex-col gap-8">
      <div data-testid="wide" className="w-[34rem]">
        <RadioGroupField label="Report frequency" options={frequencies} columns={3} />
      </div>
      <div data-testid="narrow" className="w-56 border border-dashed p-2">
        <RadioGroupField label="Report frequency (narrow)" options={frequencies} columns={3} />
      </div>
    </div>
  ),
  play: async ({ canvas }) => {
    const tracks = (testId: string) => {
      const grid = within(canvas.getByTestId(testId)).getByRole("radiogroup");
      return style(grid).gridTemplateColumns.split(" ").length;
    };
    await expect(tracks("wide")).toBe(3);
    await expect(tracks("narrow")).toBe(1);
  },
};

export const Cards: Story = {
  render: () => (
    <RadioGroupField label="Plan" options={plans} appearance="card" defaultValue="free" />
  ),
  play: async ({ canvasElement, canvas }) => {
    const [chosen, card] = [
      ...canvasElement.querySelectorAll<HTMLElement>("[data-slot=radio-row]"),
    ];
    if (!chosen || !card) throw new Error("cards not rendered");
    await expect(style(chosen).borderColor).not.toBe(style(card).borderColor);
    await userEvent.click(card);
    await expect(canvas.getByRole("radio", { name: "Pro" })).toHaveAttribute(
      "aria-checked",
      "true",
    );
    await expect(style(canvas.getByRole("radio", { name: "Pro" })).opacity).toBe("1");
  },
};

export const Segmented: Story = {
  render: () => (
    <RadioGroupField
      label="Billing"
      options={billing}
      appearance="segmented"
      orientation="horizontal"
      defaultValue="monthly"
    />
  ),
  play: async ({ canvas }) => {
    const monthly = canvas.getByRole("radio", { name: "Monthly" });
    const yearly = canvas.getByRole("radio", { name: "Yearly" });
    // The checked segment stands out from the track.
    await expect(style(monthly).backgroundColor).not.toBe(style(yearly).backgroundColor);
    await expect(Number.parseFloat(style(yearly).height)).toBeGreaterThanOrEqual(36);
    await userEvent.click(yearly);
    await expect(yearly).toHaveAttribute("aria-checked", "true");
  },
};

function OtherOptionExample() {
  const [value, setValue] = useState<string | null>(null);
  return (
    <div className="flex flex-col gap-3">
      <RadioGroupField
        label="How did you find us?"
        options={sources}
        otherOption={{
          label: "Other",
          inputLabel: "Tell us how you found us",
          placeholder: "A podcast, an event…",
        }}
        value={value}
        onValueChange={setValue}
      />
      <output aria-label="Value" className="font-mono text-xs">
        {JSON.stringify(value)}
      </output>
    </div>
  );
}

export const OtherOption: Story = {
  render: () => <OtherOptionExample />,
  play: async ({ canvas }) => {
    await userEvent.click(canvas.getByRole("radio", { name: "Other" }));
    const input = canvas.getByRole("textbox", { name: "Tell us how you found us" });
    await expect(input).toHaveFocus();
    await userEvent.type(input, "Podcast");
    await expect(canvas.getByRole("status", { name: "Value" })).toHaveTextContent('"Podcast"');
  },
};

export const Deselectable: Story = {
  render: () => (
    <RadioGroupField
      label="Preferred contact time (optional)"
      options={[
        { value: "morning", label: "Morning" },
        { value: "afternoon", label: "Afternoon" },
        { value: "evening", label: "Evening" },
      ]}
      deselectable
      defaultValue="morning"
    />
  ),
  play: async ({ canvas }) => {
    const morning = canvas.getByRole("radio", { name: "Morning" });
    await userEvent.click(morning);
    await expect(morning).toHaveAttribute("aria-checked", "false");
  },
};

export const Keyboard: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <RadioGroupField label="Plan" options={plans} />
      <button type="button" className="self-start text-sm underline">
        After
      </button>
    </div>
  ),
  play: async ({ canvas }) => {
    const radio = (name: string) => canvas.getByRole("radio", { name });
    await userEvent.tab();
    await expect(radio("Free")).toHaveFocus();
    await pressArrow("ArrowDown", radio("Pro"));
    // Enterprise is disabled: the arrow skips it.
    await pressArrow("ArrowDown", radio("Team"));
    await pressArrow("ArrowDown", radio("Free"));
    await userEvent.tab();
    await expect(canvas.getByRole("button", { name: "After" })).toHaveFocus();
    await userEvent.tab({ shift: true });
    await expect(radio("Free")).toHaveFocus();
  },
};

export const States: Story = {
  render: () => (
    <div className="flex flex-col gap-8">
      <RadioGroupField
        infoLabel="More information"
        label="Shipping"
        options={shipping}
        required
        info="Express arrives in 24 hours."
        helperText="Pickup is free."
      />
      <RadioGroupField
        label="Plan"
        options={plans.slice(0, 2)}
        error
        errorMessage="Choose a plan."
      />
      <RadioGroupField
        loadingLabel="Loading"
        label="Billing (loading)"
        options={billing}
        loading
        defaultValue="yearly"
      />
      <RadioGroupField
        label="Billing (disabled)"
        options={billing}
        appearance="segmented"
        orientation="horizontal"
        disabled
        defaultValue="monthly"
      />
    </div>
  ),
  play: async ({ canvas }) => {
    await expect(canvas.getByRole("radiogroup", { name: "Shipping" })).toHaveAttribute(
      "aria-required",
      "true",
    );
    await expect(canvas.getByRole("alert")).toHaveTextContent("Choose a plan.");
    await expect(canvas.getByRole("radiogroup", { name: "Plan" })).toHaveAttribute(
      "aria-invalid",
      "true",
    );
    await expect(canvas.getByRole("radiogroup", { name: "Billing (loading)" })).toHaveAttribute(
      "aria-busy",
      "true",
    );
  },
};

/** Right to left: each radio moves to the inline start, on the right of its option. */
export const Rtl: Story = {
  render: () => (
    <div dir="rtl">
      <RadioGroupField label="Plan" options={plans} orientation="horizontal" />
    </div>
  ),
  play: async ({ canvas }) => {
    const first = plans[0] as { label: string };
    const text = canvas.getByText(first.label);
    const row = text.closest("[data-slot=radio-row]") as HTMLElement;
    const radio = row.querySelector("[data-slot=radio-box-slot]") as HTMLElement;
    await expect(radio.getBoundingClientRect().left).toBeGreaterThanOrEqual(
      text.getBoundingClientRect().left,
    );
    // In a horizontal group, arrow keys follow the reading direction: ArrowLeft moves to the next option.
    await userEvent.click(canvas.getByRole("radio", { name: first.label }));
    const second = plans[1] as { label: string };
    await pressArrow("ArrowLeft", canvas.getByRole("radio", { name: second.label }));
    await expect(canvas.getByRole("radio", { name: second.label })).toHaveAttribute(
      "aria-checked",
      "true",
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
    <div className="flex flex-col gap-6">
      <RadioGroupField
        label="Delivery"
        options={[
          { value: "home", label: "Deliver to my home address during business hours" },
          { value: "locker", label: "Leave it in the nearest parcel locker" },
        ]}
      />
      <RadioGroupField
        label="Billing"
        options={[
          { value: "monthly", label: "Monthly" },
          { value: "yearly", label: "Yearly (two months free)" },
        ]}
        appearance="segmented"
        orientation="horizontal"
      />
    </div>
  ),
  play: async ({ canvasElement }) => {
    for (const field of canvasElement.querySelectorAll<HTMLElement>("[data-slot=field]")) {
      await expect(field.scrollWidth).toBeLessThanOrEqual(field.clientWidth);
    }
  },
};
