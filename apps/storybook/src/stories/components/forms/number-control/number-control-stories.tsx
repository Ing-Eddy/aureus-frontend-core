import { NumberControl, type NumberControlProps } from "@aureus-core/ui/components/number-control";
import { NumberField } from "@aureus-core/ui/components/number-field";
import { Button } from "@aureus-core/ui/shadcn/button";
import { zodResolver } from "@hookform/resolvers/zod";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { type ReactNode, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { expect, fn, userEvent, waitFor } from "storybook/test";
import { z } from "zod";
import { type ActionArgs, actionArgs, actionArgTypes, splitActionArgs } from "../field-action-args";
import { docs } from "./number-control-docs";

const schema = z.object({
  amount: z
    .number({ error: "Enter an amount." })
    .min(1, "The amount must be at least 1.")
    .max(10000, "The amount cannot exceed 10,000."),
  rate: z.number().nullable(),
  units: z.number().nullable(),
});

type Order = { amount: number | null; rate: number | null; units: number | null };

/**
 * The form every story renders into: one `useForm` with a schema resolver, a `FormProvider` and a
 * submit button. The last submitted payload is printed below, to show that numbers are submitted.
 */
function DemoForm({ children }: { children: ReactNode }) {
  const form = useForm<Order>({
    resolver: zodResolver(schema) as never,
    defaultValues: { amount: null, rate: 17.12, units: 3 },
    mode: "onTouched",
  });
  const [payload, setPayload] = useState<string>();

  return (
    <FormProvider {...form}>
      <form
        noValidate
        className="flex w-full max-w-sm flex-col gap-6"
        onSubmit={form.handleSubmit((values) => setPayload(JSON.stringify(values)))}
      >
        {children}
        <Button type="submit" className="self-start">
          Save
        </Button>
        {payload ? (
          <output aria-label="Submitted data" className="font-mono text-xs break-all">
            {payload}
          </output>
        ) : null}
      </form>
    </FormProvider>
  );
}

type NumberControlStoryArgs = NumberControlProps & ActionArgs;

const meta = {
  title: "components/Forms/Number Control",
  component: NumberControl,
  parameters: { aureusDocs: docs },
  decorators: [
    (Story) => (
      <DemoForm>
        <Story />
      </DemoForm>
    ),
  ],
  render: (args) => {
    const [props, action] = splitActionArgs(args);
    return <NumberControl {...props} action={action} />;
  },
  args: {
    name: "amount",
    label: "Amount",
    helperText: "Between 1 and 10,000.",
    required: true,
    currency: "USD",
    grouping: true,
    decimals: 2,
    padDecimals: true,
    stepperLayout: "stacked",
    onValueChange: fn(),
    ...actionArgs,
    showAction: false,
  },
  argTypes: {
    name: { control: false, table: { category: "Behavior" } },
    label: { control: "text", table: { category: "Content" } },
    helperText: { control: "text", table: { category: "Content" } },
    currency: {
      control: "select",
      options: [undefined, "USD", "EUR", "MXN"],
      table: { category: "Format" },
    },
    grouping: { control: "boolean", table: { category: "Format" } },
    decimals: { control: { type: "number", min: 0, max: 6 }, table: { category: "Format" } },
    padDecimals: { control: "boolean", table: { category: "Format" } },
    stepper: { control: "boolean", table: { category: "Stepper" } },
    stepperLayout: {
      control: "inline-radio",
      options: ["stacked", "split"],
      table: { category: "Stepper" },
    },
    shorthand: { control: "boolean", table: { category: "Behavior" } },
    expressions: { control: "boolean", table: { category: "Behavior" } },
    required: { control: "boolean", table: { category: "State" } },
    loading: { control: "boolean", table: { category: "State" } },
    disabled: { control: "boolean", table: { category: "State" } },
    ...actionArgTypes,
    onValueChange: { table: { category: "Events" } },
  },
} satisfies Meta<NumberControlStoryArgs>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Bound to `amount` (1 to 10,000). The submitted value is always a number. */
export const Playground: Story = {
  play: async ({ canvas }) => {
    const field = canvas.getByRole("spinbutton", { name: /^Amount/ });
    await userEvent.type(field, "1250.5");
    await userEvent.click(canvas.getByRole("button", { name: "Save" }));
    const payload = await canvas.findByRole("status", { name: "Submitted data" });
    await expect(payload).toHaveTextContent('"amount":1250.5');
  },
};

export const WithSchema: Story = {
  render: () => (
    <NumberControl
      name="amount"
      label="Amount"
      required
      currency="USD"
      grouping
      decimals={2}
      padDecimals
      helperText="Between 1 and 10,000."
    />
  ),
  play: async ({ canvas }) => {
    const field = canvas.getByRole("spinbutton", { name: /^Amount/ });
    await userEvent.type(field, "0");
    await userEvent.click(canvas.getByRole("button", { name: "Save" }));
    await waitFor(() =>
      expect(canvas.getByRole("alert")).toHaveTextContent("The amount must be at least 1."),
    );
    await expect(field).toHaveAttribute("aria-invalid", "true");
    await expect(field).toHaveFocus();
  },
};

export const DisabledVsLoading: Story = {
  render: () => (
    <>
      <NumberControl name="amount" label="Amount" currency="USD" />
      <NumberControl
        name="rate"
        label="Exchange rate (loading)"
        loading
        helperText="Still submitted."
      />
      <NumberControl name="units" label="Units (disabled)" disabled helperText="Left out." />
    </>
  ),
  play: async ({ canvas }) => {
    await userEvent.type(canvas.getByRole("spinbutton", { name: "Amount" }), "250");
    await userEvent.click(canvas.getByRole("button", { name: "Save" }));
    const payload = await canvas.findByRole("status", { name: "Submitted data" });
    await expect(payload).toHaveTextContent('"rate":17.12');
    await expect(payload).not.toHaveTextContent("units");
  },
};

const shared = {
  label: "Amount",
  required: true,
  currency: "USD",
  grouping: true,
  decimals: 2,
  padDecimals: true,
  helperText: "Between 1 and 10,000.",
} as const;

export const Parity: Story = {
  render: () => (
    <div className="grid gap-6 sm:grid-cols-2">
      <div className="flex flex-col gap-2">
        <span className="text-xs font-medium text-muted-foreground">NumberField</span>
        <NumberField {...shared} id="parity-field" name="amount" defaultValue={null} />
      </div>
      <div className="flex flex-col gap-2">
        <span className="text-xs font-medium text-muted-foreground">NumberControl</span>
        <NumberControl {...shared} id="parity-control" name="amount" />
      </div>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const [field, control] = [...canvasElement.querySelectorAll("[data-slot=field]")];
    const normalize = (element: Element | undefined, id: string) =>
      element?.outerHTML.split(id).join("ID");
    await expect(normalize(control, "parity-control")).toBe(normalize(field, "parity-field"));
  },
};
