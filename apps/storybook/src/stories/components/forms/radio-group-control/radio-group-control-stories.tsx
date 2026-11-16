import { RadioGroupControl } from "@aureus-core/ui/components/radio-group-control";
import { RadioGroupField } from "@aureus-core/ui/components/radio-group-field";
import { Button } from "@aureus-core/ui/shadcn/button";
import { billing, plans, shipping, sources } from "@fixtures/radio-options";
import { zodResolver } from "@hookform/resolvers/zod";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { type ComponentType, type ReactNode, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { expect, fn, userEvent, waitFor } from "storybook/test";
import { z } from "zod";
import { loadingTexts } from "../story-args";
import { docs } from "./radio-group-control-docs";

const schema = z.object({
  plan: z.string({ error: "Choose a plan." }),
  source: z.string({ error: "Tell us how you found us." }).min(1, "Tell us how you found us."),
  shipping: z.string().nullable(),
  billing: z.string().nullable(),
});

/** Every story except `WithSchema` accepts an empty choice. */
const lenientSchema = schema.extend({
  plan: z.string().nullable(),
  source: z.string().nullable(),
});

type Signup = {
  plan: string | null;
  source: string | null;
  shipping: string | null;
  billing: string | null;
};

/**
 * The form every story renders into: one `useForm` with a schema resolver, a `FormProvider` and a
 * submit button. The last submitted payload is printed below, to show what the form stores.
 */
function DemoForm({ children, strict }: { children: ReactNode; strict?: boolean }) {
  const form = useForm<Signup>({
    resolver: zodResolver(strict ? schema : lenientSchema) as never,
    defaultValues: { plan: null, source: null, shipping: "express", billing: "yearly" },
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

/** Flat args for the Playground, bound to `plan`. */
type StoryArgs = {
  name: "plan";
  label: string;
  helperText?: string;
  orientation: "vertical" | "horizontal";
  appearance: "plain" | "card" | "segmented";
  deselectable: boolean;
  required?: boolean;
  loading?: boolean;
  loadingLabel?: string;
  disabled?: boolean;
  onValueChange: (value: string | null) => void;
};

const meta = {
  title: "components/Forms/Radio Group Control",
  component: RadioGroupControl as unknown as ComponentType<StoryArgs>,
  parameters: { aureusDocs: docs },
  decorators: [
    (Story, { parameters }) => (
      <DemoForm strict={parameters.strictSchema === true}>
        <Story />
      </DemoForm>
    ),
  ],
  render: ({ loading, loadingLabel, ...args }) => (
    <RadioGroupControl
      {...args}
      {...loadingTexts(Boolean(loading), loadingLabel ?? "")}
      options={plans}
    />
  ),
  args: {
    name: "plan",
    loadingLabel: "Loading",
    label: "Plan",
    helperText: "You can change it later.",
    orientation: "vertical",
    appearance: "plain",
    deselectable: false,
    onValueChange: fn(),
  },
  argTypes: {
    name: { control: false, table: { category: "Behavior" } },
    label: { control: "text", table: { category: "Content" } },
    helperText: { control: "text", table: { category: "Content" } },
    deselectable: { control: "boolean", table: { category: "Behavior" } },
    orientation: {
      control: "inline-radio",
      options: ["vertical", "horizontal"],
      table: { category: "Layout" },
    },
    appearance: {
      control: "inline-radio",
      options: ["plain", "card", "segmented"],
      table: { category: "Layout" },
    },
    required: { control: "boolean", table: { category: "State" } },
    loading: { control: "boolean", table: { category: "State" } },
    loadingLabel: { control: "text", table: { category: "Content" } },
    disabled: { control: "boolean", table: { category: "State" } },
    onValueChange: { table: { category: "Events" } },
  },
} satisfies Meta<StoryArgs>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Bound to `plan`. The submitted value is the chosen option's value. */
export const Playground: Story = {
  play: async ({ canvas }) => {
    await userEvent.click(canvas.getByRole("radio", { name: "Team" }));
    await userEvent.click(canvas.getByRole("button", { name: "Save" }));
    const payload = await canvas.findByRole("status", { name: "Submitted data" });
    await expect(payload).toHaveTextContent('"plan":"team"');
  },
};

export const WithSchema: Story = {
  parameters: { strictSchema: true },
  render: () => (
    <>
      <RadioGroupControl name="plan" label="Plan" required options={plans} appearance="card" />
      <RadioGroupControl
        name="source"
        label="How did you find us?"
        required
        options={sources}
        otherOption={{ label: "Other", inputLabel: "Tell us how you found us" }}
      />
    </>
  ),
  play: async ({ canvas }) => {
    await userEvent.click(canvas.getByRole("button", { name: "Save" }));
    await waitFor(() => expect(canvas.getAllByRole("alert")).toHaveLength(2));
    await expect(canvas.getByRole("radiogroup", { name: "Plan" })).toHaveAttribute(
      "aria-invalid",
      "true",
    );
    await expect(canvas.getByRole("radio", { name: "Free" })).toHaveFocus();

    await userEvent.click(canvas.getByRole("radio", { name: "Pro" }));
    await userEvent.click(canvas.getByRole("radio", { name: "Other" }));
    await userEvent.type(
      canvas.getByRole("textbox", { name: "Tell us how you found us" }),
      "A podcast",
    );
    await userEvent.click(canvas.getByRole("button", { name: "Save" }));
    const payload = await canvas.findByRole("status", { name: "Submitted data" });
    await expect(payload).toHaveTextContent('"plan":"pro","source":"A podcast"');
  },
};

export const DisabledVsLoading: Story = {
  render: () => (
    <>
      <RadioGroupControl name="plan" label="Plan" options={plans} />
      <RadioGroupControl
        loadingLabel="Loading"
        name="shipping"
        label="Shipping (loading)"
        options={shipping}
        loading
        helperText="Still submitted."
      />
      <RadioGroupControl
        name="billing"
        label="Billing (disabled)"
        options={billing}
        appearance="segmented"
        orientation="horizontal"
        disabled
        helperText="Left out."
      />
    </>
  ),
  play: async ({ canvas }) => {
    await userEvent.click(canvas.getByRole("button", { name: "Save" }));
    const payload = await canvas.findByRole("status", { name: "Submitted data" });
    await expect(payload).toHaveTextContent('"shipping":"express"');
    await expect(payload).not.toHaveTextContent("billing");
  },
};

const shared = {
  label: "Plan",
  helperText: "You can change it later.",
  required: true,
  appearance: "card",
} as const;

export const Parity: Story = {
  render: () => (
    <div className="grid gap-6 sm:grid-cols-2">
      <div className="flex flex-col gap-2">
        <span className="text-xs font-medium text-muted-foreground">RadioGroupField</span>
        <RadioGroupField {...shared} id="parity-field" name="plan" options={plans} value={null} />
      </div>
      <div className="flex flex-col gap-2">
        <span className="text-xs font-medium text-muted-foreground">RadioGroupControl</span>
        <RadioGroupControl {...shared} id="parity-control" name="plan" options={plans} />
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
