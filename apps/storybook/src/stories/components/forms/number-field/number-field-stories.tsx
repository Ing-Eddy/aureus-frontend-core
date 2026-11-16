import { NumberField, type NumberFieldProps } from "@aureus-core/ui/components/number-field";
import type { Meta, StoryObj } from "@storybook/react-vite";
import type { ComponentType } from "react";
import { expect, fn, userEvent } from "storybook/test";
import { type ActionArgs, actionArgs, actionArgTypes, splitActionArgs } from "../field-action-args";
import type { StoryArgs } from "../story-args";
import { docs } from "./number-field-docs";

type NumberFieldStoryArgs = StoryArgs<NumberFieldProps> & ActionArgs;

const format = { table: { category: "Format" } };
const stepper = { table: { category: "Stepper" } };
const behavior = { table: { category: "Behavior" } };

const meta = {
  title: "components/Forms/Number Field",
  component: NumberField as unknown as ComponentType<NumberFieldStoryArgs>,
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
    return <NumberField {...(props as NumberFieldProps)} action={action} />;
  },
  args: {
    label: "Amount",
    helperText: "Before taxes.",
    defaultValue: 1234.5,
    locale: "en-US",
    grouping: false,
    padDecimals: false,
    currencyDisplay: "symbol",
    align: "start",
    negativeFormat: "minus",
    negativeColor: false,
    stepper: true,
    stepperLayout: "stacked",
    step: 1,
    clampOnBlur: true,
    allowNegative: true,
    selectOnFocus: false,
    wheel: false,
    shorthand: false,
    expressions: false,
    required: false,
    loading: false,
    loadingLabel: "Loading",
    incrementLabel: "Increase",
    decrementLabel: "Decrease",
    invalidExpressionLabel: "Invalid expression",
    calculatedFromLabel: (expression: string) => `Calculated from ${expression}`,
    disabled: false,
    error: false,
    onValueChange: fn(),
    ...actionArgs,
    showAction: false,
  },
  argTypes: {
    label: { control: "text", table: { category: "Content" } },
    helperText: { control: "text", table: { category: "Content" } },
    info: { control: "text", table: { category: "Content" } },
    infoLabel: { control: "text", table: { category: "Content" } },
    errorMessage: { control: "text", table: { category: "Content" } },
    placeholder: { control: "text", table: { category: "Content" } },
    locale: {
      control: "select",
      options: ["en-US", "es-ES", "de-DE", "fr-FR", "de-CH"],
      ...format,
    },
    grouping: { control: "boolean", ...format },
    decimals: { control: { type: "number", min: 0, max: 10 }, ...format },
    padDecimals: { control: "boolean", ...format },
    currency: {
      control: "select",
      options: [undefined, "USD", "EUR", "MXN", "JPY", "GBP"],
      ...format,
    },
    currencyDisplay: {
      control: "inline-radio",
      options: ["symbol", "narrowSymbol", "code"],
      ...format,
    },
    prefix: { control: "text", ...format },
    suffix: { control: "text", ...format },
    align: { control: "inline-radio", options: ["start", "end"], ...format },
    negativeFormat: { control: "inline-radio", options: ["minus", "parentheses"], ...format },
    negativeColor: { control: "boolean", ...format },
    stepper: { control: "boolean", ...stepper },
    stepperLayout: { control: "inline-radio", options: ["stacked", "split"], ...stepper },
    incrementLabel: { control: "text", ...stepper },
    decrementLabel: { control: "text", ...stepper },
    min: { control: "number", ...behavior },
    max: { control: "number", ...behavior },
    step: { control: "number", ...behavior },
    largeStep: { control: "number", ...behavior },
    clampOnBlur: { control: "boolean", ...behavior },
    allowNegative: { control: "boolean", ...behavior },
    selectOnFocus: { control: "boolean", ...behavior },
    wheel: { control: "boolean", ...behavior },
    shorthand: { control: "boolean", ...behavior },
    expressions: { control: "boolean", ...behavior },
    invalidExpressionLabel: { control: "text", ...behavior },
    calculatedFromLabel: { control: false, ...behavior },
    required: { control: "boolean", table: { category: "State" } },
    loading: { control: "boolean", table: { category: "State" } },
    loadingLabel: { control: "text", table: { category: "Content" } },
    disabled: { control: "boolean", table: { category: "State" } },
    error: { control: "boolean", table: { category: "State" } },
    value: { control: false, table: { category: "State" } },
    defaultValue: { control: "number", table: { category: "State" } },
    classNames: { control: "object", table: { category: "Appearance" } },
    className: { control: "text", table: { category: "Appearance" } },
    ...actionArgTypes,
    onValueChange: { table: { category: "Events" } },
  },
} satisfies Meta<NumberFieldStoryArgs>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Every number prop has a control. The play function steps with the keyboard and a button. */
export const Playground: Story = {
  play: async ({ args, canvas }) => {
    const field = canvas.getByRole("spinbutton", { name: "Amount" });
    await userEvent.click(field);
    await userEvent.keyboard("{ArrowUp}");
    await expect(args.onValueChange).toHaveBeenLastCalledWith(1235.5);
  },
};

export const Basic: Story = {
  args: { label: "Quantity", defaultValue: null, helperText: undefined, min: 0 },
  play: async ({ canvas }) => {
    const field = canvas.getByRole("spinbutton", { name: "Quantity" });
    await userEvent.type(field, "122345");
    await userEvent.tab();
    await expect(field).toHaveValue("122345");
  },
};

export const Grouping: Story = {
  render: () => (
    <div className="flex flex-col gap-6">
      <NumberField
        incrementLabel="Increase"
        decrementLabel="Decrease"
        label="Without grouping"
        defaultValue={123345}
      />
      <NumberField
        incrementLabel="Increase"
        decrementLabel="Decrease"
        label="With grouping (en-US)"
        defaultValue={1234567.5}
        grouping
      />
      <NumberField
        incrementLabel="Increase"
        decrementLabel="Decrease"
        label="With grouping (es-ES)"
        defaultValue={1234567.5}
        grouping
        locale="es-ES"
      />
    </div>
  ),
  play: async ({ canvas }) => {
    await expect(canvas.getByRole("spinbutton", { name: "Without grouping" })).toHaveValue(
      "123345",
    );
    await expect(canvas.getByRole("spinbutton", { name: "With grouping (en-US)" })).toHaveValue(
      "1,234,567.5",
    );
    await expect(canvas.getByRole("spinbutton", { name: "With grouping (es-ES)" })).toHaveValue(
      "1.234.567,5",
    );
  },
};

export const Decimals: Story = {
  render: () => (
    <div className="flex flex-col gap-6">
      <NumberField
        incrementLabel="Increase"
        decrementLabel="Decrease"
        label="Integers only"
        decimals={0}
        defaultValue={42}
      />
      <NumberField
        incrementLabel="Increase"
        decrementLabel="Decrease"
        label="Two decimals"
        decimals={2}
        defaultValue={12.5}
      />
      <NumberField
        incrementLabel="Increase"
        decrementLabel="Decrease"
        label="Two decimals, padded"
        decimals={2}
        padDecimals
        defaultValue={12.5}
      />
      <NumberField
        incrementLabel="Increase"
        decrementLabel="Decrease"
        label="Three decimals, padded"
        decimals={3}
        padDecimals
        defaultValue={0.5}
      />
    </div>
  ),
  play: async ({ canvas }) => {
    await expect(canvas.getByRole("spinbutton", { name: "Two decimals" })).toHaveValue("12.5");
    await expect(canvas.getByRole("spinbutton", { name: "Two decimals, padded" })).toHaveValue(
      "12.50",
    );
    const integers = canvas.getByRole("spinbutton", { name: "Integers only" });
    await userEvent.clear(integers);
    await userEvent.type(integers, "7.5");
    await expect(integers).toHaveValue("75");
  },
};

export const PrefixSuffixCurrency: Story = {
  render: () => (
    <div className="flex flex-col gap-6">
      <NumberField
        incrementLabel="Increase"
        decrementLabel="Decrease"
        label="Budget"
        currency="USD"
        decimals={0}
        grouping
        defaultValue={12000}
      />
      <NumberField label="Rate" suffix="%" decimals={3} defaultValue={4.125} stepper={false} />
      <NumberField
        incrementLabel="Increase"
        decrementLabel="Decrease"
        label="Weight"
        suffix="kg"
        decimals={1}
        defaultValue={72.5}
        step={0.5}
      />
      <NumberField
        incrementLabel="Increase"
        decrementLabel="Decrease"
        label="Rent"
        currency="EUR"
        suffix="/month"
        decimals={2}
        padDecimals
        grouping
        locale="es-ES"
        defaultValue={950}
      />
    </div>
  ),
  play: async ({ canvas }) => {
    await expect(canvas.getByRole("spinbutton", { name: "Budget" })).toHaveValue("12,000");
    await expect(canvas.getByRole("spinbutton", { name: "Rate" })).toHaveValue("4.125");
    await expect(canvas.getByRole("spinbutton", { name: "Rent" })).toHaveValue("950,00");
  },
};

export const Accounting: Story = {
  args: {
    label: "Balance",
    helperText: "Try 1.5k, or =120*3.",
    currency: "USD",
    decimals: 2,
    padDecimals: true,
    grouping: true,
    negativeFormat: "parentheses",
    negativeColor: true,
    align: "end",
    shorthand: true,
    expressions: true,
    selectOnFocus: true,
    defaultValue: -1234.5,
  },
  play: async ({ canvas }) => {
    const field = canvas.getByRole("spinbutton", { name: "Balance" });
    await expect(field).toHaveValue("(1,234.50)");
    await expect(field).toHaveAttribute("aria-valuetext", "-$1,234.50");
    await userEvent.click(field);
    await expect(field).toHaveValue("-1,234.50");
    await userEvent.keyboard("1.5k");
    await userEvent.tab();
    await expect(field).toHaveValue("1,500.00");
  },
};

export const Expressions: Story = {
  args: {
    label: "Total",
    helperText: "Type =3+3 and leave the field.",
    defaultValue: null,
    expressions: true,
  },
  play: async ({ canvas }) => {
    const field = canvas.getByRole("spinbutton", { name: "Total" });
    await userEvent.type(field, "=3+3");
    await userEvent.tab();
    await expect(field).toHaveValue("6");
    await userEvent.click(field);
    await expect(field).toHaveValue("=3+3");
    await userEvent.clear(field);
    await userEvent.type(field, "=3+4{Enter}");
    await expect(field).toHaveValue("7");
  },
};

export const StepperLayouts: Story = {
  render: () => (
    <div className="flex flex-col gap-6">
      <NumberField
        incrementLabel="Increase"
        decrementLabel="Decrease"
        label="Stacked"
        defaultValue={5}
        min={0}
        max={10}
      />
      <NumberField
        incrementLabel="Increase"
        decrementLabel="Decrease"
        label="Split"
        defaultValue={5}
        min={0}
        max={10}
        stepperLayout="split"
      />
      <NumberField label="No buttons" defaultValue={5} stepper={false} />
    </div>
  ),
  play: async ({ canvas }) => {
    const increases = canvas.getAllByRole("button", { name: "Increase" });
    await expect(increases).toHaveLength(2);
    await userEvent.click(increases[1] as HTMLElement);
    await expect(canvas.getByRole("spinbutton", { name: "Split" })).toHaveValue("6");
  },
};

export const Keyboard: Story = {
  args: { label: "Seats", defaultValue: 5, min: 1, max: 50, helperText: undefined },
  play: async ({ canvas }) => {
    const field = canvas.getByRole("spinbutton", { name: "Seats" });
    await userEvent.click(field);
    await userEvent.keyboard("{ArrowUp}");
    await expect(field).toHaveValue("6");
    await userEvent.keyboard("{Shift>}{ArrowUp}{/Shift}");
    await expect(field).toHaveValue("16");
    await userEvent.keyboard("{PageUp}");
    await expect(field).toHaveValue("26");
    await userEvent.keyboard("{End}");
    await expect(field).toHaveValue("50");
    await userEvent.keyboard("{Home}");
    await expect(field).toHaveValue("1");
    await userEvent.keyboard("{Escape}");
    await expect(field).toHaveValue("5");
  },
};

export const LiveFormatting: Story = {
  args: { label: "Population", defaultValue: null, grouping: true, helperText: undefined },
  play: async ({ canvas }) => {
    const field = canvas.getByRole("spinbutton", { name: "Population" }) as HTMLInputElement;
    await userEvent.type(field, "1234567");
    await expect(field).toHaveValue("1,234,567");
    field.setSelectionRange(3, 3);
    await userEvent.keyboard("9");
    await expect(field).toHaveValue("12,934,567");
    await expect(field.selectionStart).toBe(4);
  },
};

export const Paste: Story = {
  args: {
    label: "Invoice total",
    defaultValue: null,
    grouping: true,
    decimals: 2,
    helperText: undefined,
  },
  play: async ({ canvas }) => {
    const field = canvas.getByRole("spinbutton", { name: "Invoice total" });
    await userEvent.click(field);
    await userEvent.paste("$1,234.50");
    await expect(field).toHaveValue("1,234.5");
    await userEvent.clear(field);
    await userEvent.paste("(500)");
    await expect(field).toHaveValue("-500");
  },
};

export const States: Story = {
  render: () => (
    <div className="flex flex-col gap-6">
      <NumberField
        infoLabel="More information"
        incrementLabel="Increase"
        decrementLabel="Decrease"
        label="Price"
        required
        info="Before discounts."
        currency="USD"
        decimals={2}
      />
      <NumberField
        incrementLabel="Increase"
        decrementLabel="Decrease"
        label="Discount"
        suffix="%"
        helperText="Between 0 and 100."
        min={0}
        max={100}
      />
      <NumberField
        incrementLabel="Increase"
        decrementLabel="Decrease"
        label="Stock"
        defaultValue={-3}
        error
        errorMessage="Stock cannot be negative."
      />
      <NumberField
        loadingLabel="Loading"
        incrementLabel="Increase"
        decrementLabel="Decrease"
        label="Exchange rate"
        defaultValue={17.12}
        loading
      />
      <NumberField
        incrementLabel="Increase"
        decrementLabel="Decrease"
        label="Tax ID"
        defaultValue={42}
        disabled
        helperText="Set by the system."
      />
    </div>
  ),
  play: async ({ canvas }) => {
    await expect(canvas.getByRole("spinbutton", { name: /^Price/ })).toHaveAttribute(
      "aria-required",
      "true",
    );
    await expect(canvas.getByRole("alert")).toHaveTextContent("Stock cannot be negative.");
    await expect(canvas.getByRole("spinbutton", { name: "Exchange rate" })).toBeDisabled();
    await expect(canvas.getByRole("spinbutton", { name: "Tax ID" })).toBeDisabled();
  },
};

/** Right to left: the step buttons move to the left; the number itself stays left to right. */
export const Rtl: Story = {
  render: () => (
    <div dir="rtl">
      <NumberField
        label="Quantity"
        defaultValue={-1234.5}
        grouping
        incrementLabel="Increase"
        decrementLabel="Decrease"
      />
    </div>
  ),
  play: async ({ canvas, canvasElement }) => {
    const input = canvas.getByRole("spinbutton", { name: "Quantity" });
    const stepper = canvasElement.querySelector("[data-slot=field-stepper]") as HTMLElement;
    await expect(stepper.getBoundingClientRect().right).toBeLessThanOrEqual(
      input.getBoundingClientRect().left + 1,
    );
    await expect(getComputedStyle(input).direction).toBe("ltr");
    await expect(input).toHaveValue("-1,234.5");
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
    label: "Annual budget for the regional office",
    currency: "USD",
    grouping: true,
    decimals: 2,
    padDecimals: true,
    defaultValue: 1250000,
    stepperLayout: "split",
  },
  play: async ({ canvasElement }) => {
    const field = canvasElement.querySelector("[data-slot=field]") as HTMLElement;
    await expect(field.scrollWidth).toBeLessThanOrEqual(field.clientWidth);
  },
};
