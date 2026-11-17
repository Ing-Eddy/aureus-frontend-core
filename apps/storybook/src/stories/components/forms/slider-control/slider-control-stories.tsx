import { SliderControl } from "@aureus-core/ui/components/slider-control";
import { SliderField } from "@aureus-core/ui/components/slider-field";
import { Button } from "@aureus-core/ui/shadcn/button";
import { euros, priceMarks } from "@fixtures/slider-field";
import { zodResolver } from "@hookform/resolvers/zod";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { type ComponentType, type ReactNode, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { expect, fn, userEvent, waitFor } from "storybook/test";
import { z } from "zod";
import { loadingTexts } from "../story-args";
import { docs } from "./slider-control-docs";

const schema = z.object({
  volume: z.number().max(80, "Más de 80 puede dañar el oído."),
  price: z
    .tuple([z.number(), z.number()])
    .refine(([low, high]) => high - low >= 100, "El rango debe ser de al menos 100."),
  balance: z.number(),
  bass: z.number(),
});

type Settings = z.infer<typeof schema>;

/** Every story except `WithSchema` accepts any value. */
const lenientSchema = z.object({
  volume: z.number(),
  price: z.tuple([z.number(), z.number()]),
  balance: z.number(),
  bass: z.number(),
});

/**
 * The form every story renders into: one `useForm` with a schema resolver, a `FormProvider` and a
 * submit button. The last submitted payload is printed below, to show what the form stores.
 */
function DemoForm({ children, strict }: { children: ReactNode; strict?: boolean }) {
  const form = useForm<Settings>({
    resolver: zodResolver(strict ? schema : lenientSchema),
    defaultValues: { volume: 40, price: [200, 250], balance: 50, bass: 30 },
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

/** Flat args for the Playground, bound to `volume`. */
type StoryArgs = {
  name: "volume";
  label: string;
  helperText?: string;
  showValue: "none" | "header" | "tooltip";
  step: number;
  required?: boolean;
  loading?: boolean;
  loadingLabel?: string;
  disabled?: boolean;
  onValueChange: (value: number) => void;
};

const meta = {
  title: "components/Forms/Slider Control",
  component: SliderControl as unknown as ComponentType<StoryArgs>,
  parameters: { aureusDocs: docs },
  decorators: [
    (Story, { parameters }) => (
      <DemoForm strict={parameters.strictSchema === true}>
        <Story />
      </DemoForm>
    ),
  ],
  render: ({ loading, loadingLabel, ...args }) => (
    <SliderControl {...args} {...loadingTexts(Boolean(loading), loadingLabel ?? "")} />
  ),
  args: {
    name: "volume",
    label: "Volume",
    helperText: "Applies to every device.",
    showValue: "header",
    step: 1,
    loadingLabel: "Loading",
    onValueChange: fn(),
  },
  argTypes: {
    name: { control: false, table: { category: "Behavior" } },
    label: { control: "text", table: { category: "Content" } },
    helperText: { control: "text", table: { category: "Content" } },
    step: { control: "number", table: { category: "Behavior" } },
    showValue: {
      control: "inline-radio",
      options: ["none", "header", "tooltip"],
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

/** Bound to `volume`. The form stores the number. */
export const Playground: Story = {
  play: async ({ args, canvas }) => {
    canvas.getByRole("slider", { name: "Volume" }).focus();
    await userEvent.keyboard("{PageUp}");
    await expect(args.onValueChange).toHaveBeenLastCalledWith(50);
    await userEvent.click(canvas.getByRole("button", { name: "Save" }));
    const payload = await canvas.findByRole("status", { name: "Submitted data" });
    await expect(payload).toHaveTextContent('"volume":50');
  },
};

export const WithSchema: Story = {
  parameters: { strictSchema: true },
  render: () => (
    <>
      <SliderControl name="volume" label="Volumen" showValue="header" />
      <SliderControl
        name="price"
        label="Precio"
        range
        thumbLabels={["Precio mínimo", "Precio máximo"]}
        min={0}
        max={1000}
        step={10}
        marks={priceMarks}
        locale="es-ES"
        formatOptions={euros}
        showValue="header"
        withInput
        inputLabels={["Desde", "Hasta"]}
      />
    </>
  ),
  play: async ({ canvas }) => {
    await userEvent.click(canvas.getByRole("button", { name: "Save" }));
    await waitFor(() =>
      expect(canvas.getByRole("alert")).toHaveTextContent("El rango debe ser de al menos 100."),
    );
    const low = canvas.getByRole("slider", { name: "Precio mínimo" });
    await expect(low).toHaveAttribute("aria-invalid", "true");
    await expect(canvas.getByRole("slider", { name: "Precio máximo" })).toHaveAttribute(
      "aria-invalid",
      "true",
    );
    await expect(low).toHaveFocus();

    const to = canvas.getByRole("spinbutton", { name: "Hasta" });
    await userEvent.clear(to);
    await userEvent.type(to, "600{Enter}");
    await userEvent.click(canvas.getByRole("button", { name: "Save" }));
    const payload = await canvas.findByRole("status", { name: "Submitted data" });
    await expect(payload).toHaveTextContent('"price":[200,600]');
  },
};

export const DisabledVsLoading: Story = {
  render: () => (
    <>
      <SliderControl
        name="balance"
        label="Balance (loading)"
        loading
        loadingLabel="Loading"
        helperText="Still submitted."
      />
      <SliderControl name="bass" label="Bass (disabled)" disabled helperText="Left out." />
    </>
  ),
  play: async ({ canvas }) => {
    await userEvent.click(canvas.getByRole("button", { name: "Save" }));
    const payload = await canvas.findByRole("status", { name: "Submitted data" });
    await expect(payload).toHaveTextContent('"balance":50');
    await expect(payload).not.toHaveTextContent("bass");
  },
};

const shared = {
  label: "Volume",
  helperText: "Applies to every device.",
  required: true,
  showValue: "header",
  withInput: true,
  inputLabel: "Exact volume",
} as const;

export const Parity: Story = {
  render: () => (
    <div className="grid gap-6 sm:grid-cols-2">
      <div className="flex flex-col gap-2">
        <span className="text-xs font-medium text-muted-foreground">SliderField</span>
        <SliderField {...shared} id="parity-field" name="volume" value={40} />
      </div>
      <div className="flex flex-col gap-2">
        <span className="text-xs font-medium text-muted-foreground">SliderControl</span>
        <SliderControl {...shared} id="parity-control" name="volume" />
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
