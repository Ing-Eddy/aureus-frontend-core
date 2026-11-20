import { DateSelectionControl } from "@aureus-core/ui/components/date-selection-control";
import { DateSelectionField } from "@aureus-core/ui/components/date-selection-field";
import { addDaysIso } from "@aureus-core/ui/components/date-time-field";
import { Button } from "@aureus-core/ui/shadcn/button";
import { dayName, monthTexts, rangeTexts, segmentsOf, typeInto } from "@fixtures/date-fields";
import { zodResolver } from "@hookform/resolvers/zod";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { type ComponentType, type ReactNode, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { expect, fn, userEvent, waitFor, within } from "storybook/test";
import { z } from "zod";
import { loadingTexts } from "../story-args";
import { docs } from "./date-selection-control-docs";

const range = z.object({ from: z.string(), to: z.string().nullable() }).nullable();

const schema = z.object({
  stay: range.refine((value) => value?.to != null, "Elige la fecha de salida."),
  shifts: z.array(z.string()).min(2, "Elige al menos dos turnos."),
  audit: range,
  closed: z.array(z.string()),
});

type Trip = z.infer<typeof schema>;

/** Every story except `WithSchema` accepts any value. */
const lenientSchema = z.object({
  stay: range,
  shifts: z.array(z.string()),
  audit: range,
  closed: z.array(z.string()),
});

/**
 * The form every story renders into: one `useForm` with a schema resolver, a `FormProvider` and a
 * submit button. The last submitted payload is printed below, to show what the form stores.
 */
function DemoForm({ children, strict }: { children: ReactNode; strict?: boolean }) {
  const form = useForm<Trip>({
    resolver: zodResolver(strict ? schema : lenientSchema),
    defaultValues: {
      stay: { from: "2026-08-01", to: null },
      shifts: ["2026-08-03"],
      audit: { from: "2026-08-03", to: "2026-08-07" },
      closed: ["2026-08-15"],
    },
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

/** Flat args for the Playground, bound to `stay`. */
type StoryArgs = {
  name: "stay";
  label: string;
  helperText?: string;
  locale: string;
  maxDays?: number;
  required?: boolean;
  loading?: boolean;
  loadingLabel?: string;
  disabled?: boolean;
  onValueChange: (value: unknown) => void;
};

const meta = {
  title: "components/Forms/Date Selection Control",
  component: DateSelectionControl as unknown as ComponentType<StoryArgs>,
  parameters: { aureusDocs: docs },
  decorators: [
    (Story, { parameters }) => (
      <DemoForm strict={parameters.strictSchema === true}>
        <Story />
      </DemoForm>
    ),
  ],
  render: ({ loading, loadingLabel, onValueChange, ...args }) => (
    <DateSelectionControl
      {...args}
      selection="range"
      onValueChange={onValueChange}
      {...rangeTexts}
      {...loadingTexts(Boolean(loading), loadingLabel ?? "")}
    />
  ),
  args: {
    name: "stay",
    label: "Stay",
    helperText: "Up to 27 days.",
    locale: "en-US",
    maxDays: 27,
    loadingLabel: "Loading",
    onValueChange: fn(),
  },
  argTypes: {
    name: { control: false, table: { category: "Behavior" } },
    label: { control: "text", table: { category: "Content" } },
    helperText: { control: "text", table: { category: "Content" } },
    locale: { control: "text", table: { category: "Behavior" } },
    maxDays: { control: "number", table: { category: "Behavior" } },
    required: { control: "boolean", table: { category: "State" } },
    loading: { control: "boolean", table: { category: "State" } },
    loadingLabel: { control: "text", table: { category: "Content" } },
    disabled: { control: "boolean", table: { category: "State" } },
    onValueChange: { table: { category: "Events" } },
  },
} satisfies Meta<StoryArgs>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Bound to `stay`. The form stores `{ from, to }`. */
export const Playground: Story = {
  play: async ({ args, canvas }) => {
    await userEvent.click(canvas.getByRole("button", { name: "Open calendar" }));
    const calendar = await within(document.body).findByRole("dialog");
    await userEvent.click(within(calendar).getByRole("button", { name: dayName("2026-08-27") }));
    await expect(args.onValueChange).toHaveBeenLastCalledWith({
      from: "2026-08-01",
      to: "2026-08-27",
    });
    await userEvent.click(canvas.getByRole("button", { name: "Save" }));
    const payload = await canvas.findByRole("status", { name: "Submitted data" });
    await expect(payload).toHaveTextContent('"stay":{"from":"2026-08-01","to":"2026-08-27"}');
  },
};

export const WithSchema: Story = {
  parameters: { strictSchema: true },
  render: () => (
    <>
      <DateSelectionControl
        name="stay"
        label="Estancia"
        selection="range"
        locale="es-ES"
        maxDays={27}
        presets={[
          {
            label: "Una semana",
            value: () => ({ from: "2026-08-01", to: addDaysIso("2026-08-01", 6) }),
          },
        ]}
        presetsLabel="Atajos"
        openCalendarLabel="Abrir calendario"
        startLabel="Llegada"
        endLabel="Salida"
        previousMonthLabel="Mes anterior"
        nextMonthLabel="Mes siguiente"
      />
      <DateSelectionControl
        name="shifts"
        label="Turnos"
        selection="multiple"
        locale="es-ES"
        placeholder="Elige días"
        previousMonthLabel="Mes anterior"
        nextMonthLabel="Mes siguiente"
      />
    </>
  ),
  play: async ({ canvas, canvasElement }) => {
    await userEvent.click(canvas.getByRole("button", { name: "Save" }));
    await waitFor(() => expect(canvas.getAllByRole("alert")).toHaveLength(2));
    await expect(canvas.getAllByRole("alert")[0]).toHaveTextContent("Elige la fecha de salida.");
    await expect(canvas.getAllByRole("alert")[1]).toHaveTextContent("Elige al menos dos turnos.");
    const start = segmentsOf(canvasElement, "Llegada");
    await expect(start[0]).toHaveFocus();

    await typeInto(segmentsOf(canvasElement, "Salida")[0] as HTMLElement, "27082026");
    await userEvent.click(canvas.getByRole("button", { name: /^Turnos/ }));
    const calendar = await within(document.body).findByRole("dialog");
    await userEvent.click(
      within(calendar).getByRole("button", { name: dayName("2026-08-04", "es-ES") }),
    );
    await userEvent.keyboard("{Escape}");
    await userEvent.click(canvas.getByRole("button", { name: "Save" }));
    const payload = await canvas.findByRole("status", { name: "Submitted data" });
    await expect(payload).toHaveTextContent(
      '"stay":{"from":"2026-08-01","to":"2026-08-27"},"shifts":["2026-08-03","2026-08-04"]',
    );
  },
};

export const DisabledVsLoading: Story = {
  render: () => (
    <>
      <DateSelectionControl
        name="audit"
        label="Audit (loading)"
        selection="range"
        locale="en-US"
        loading
        loadingLabel="Loading"
        helperText="Still submitted."
        {...rangeTexts}
      />
      <DateSelectionControl
        name="closed"
        label="Closed days (disabled)"
        selection="multiple"
        locale="en-US"
        disabled
        helperText="Left out."
        {...monthTexts}
      />
    </>
  ),
  play: async ({ canvas }) => {
    await userEvent.click(canvas.getByRole("button", { name: "Save" }));
    const payload = await canvas.findByRole("status", { name: "Submitted data" });
    await expect(payload).toHaveTextContent('"audit":{"from":"2026-08-03","to":"2026-08-07"}');
    await expect(payload).not.toHaveTextContent("closed");
  },
};

const shared = {
  label: "Shifts",
  selection: "multiple",
  locale: "en-US",
  helperText: "Pick the days you can work.",
  placeholder: "Pick days",
  ...monthTexts,
} as const;

export const Parity: Story = {
  render: () => (
    <div className="grid gap-6 sm:grid-cols-2">
      <div className="flex flex-col gap-2">
        <span className="text-xs font-medium text-muted-foreground">DateSelectionField</span>
        <DateSelectionField {...shared} id="parity-field" name="shifts" value={["2026-08-03"]} />
      </div>
      <div className="flex flex-col gap-2">
        <span className="text-xs font-medium text-muted-foreground">DateSelectionControl</span>
        <DateSelectionControl {...shared} id="parity-control" name="shifts" />
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
