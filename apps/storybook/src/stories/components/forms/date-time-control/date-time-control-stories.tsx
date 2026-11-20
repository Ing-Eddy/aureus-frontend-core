import { DateTimeControl } from "@aureus-core/ui/components/date-time-control";
import {
  DateTimeField,
  isIsoDate,
  isIsoDateTime,
} from "@aureus-core/ui/components/date-time-field";
import { Button } from "@aureus-core/ui/shadcn/button";
import { calendarTexts, calendarTextsEs, segmentTexts, typeInto } from "@fixtures/date-fields";
import { zodResolver } from "@hookform/resolvers/zod";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { type ComponentType, type ReactNode, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { expect, fn, userEvent, waitFor } from "storybook/test";
import { z } from "zod";
import { loadingTexts } from "../story-args";
import { docs } from "./date-time-control-docs";

const schema = z.object({
  birth: z
    .string()
    .nullable()
    .refine((value) => isIsoDate(value) && value <= "2008-08-01", "Debes tener 18 años o más."),
  meeting: z
    .string()
    .nullable()
    .refine((value) => Boolean(isIsoDateTime(value)), "Elige fecha y hora."),
  review: z.string().nullable(),
  signed: z.string().nullable(),
});

type Booking = z.infer<typeof schema>;

/** Every story except `WithSchema` accepts any value. */
const lenientSchema = z.object({
  birth: z.string().nullable(),
  meeting: z.string().nullable(),
  review: z.string().nullable(),
  signed: z.string().nullable(),
});

/**
 * The form every story renders into: one `useForm` with a schema resolver, a `FormProvider` and a
 * submit button. The last submitted payload is printed below, to show what the form stores.
 */
function DemoForm({ children, strict }: { children: ReactNode; strict?: boolean }) {
  const form = useForm<Booking>({
    resolver: zodResolver(strict ? schema : lenientSchema),
    defaultValues: { birth: null, meeting: null, review: "2026-08-15", signed: "2026-07-30" },
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

/** Flat args for the Playground, bound to `birth`. */
type StoryArgs = {
  name: "birth";
  label: string;
  helperText?: string;
  locale: string;
  required?: boolean;
  loading?: boolean;
  loadingLabel?: string;
  disabled?: boolean;
  onValueChange: (value: string | null) => void;
};

const meta = {
  title: "components/Forms/Date Time Control",
  component: DateTimeControl as unknown as ComponentType<StoryArgs>,
  parameters: { aureusDocs: docs },
  decorators: [
    (Story, { parameters }) => (
      <DemoForm strict={parameters.strictSchema === true}>
        <Story />
      </DemoForm>
    ),
  ],
  render: ({ loading, loadingLabel, ...args }) => (
    <DateTimeControl
      {...args}
      {...calendarTexts}
      {...loadingTexts(Boolean(loading), loadingLabel ?? "")}
    />
  ),
  args: {
    name: "birth",
    label: "Birthday",
    helperText: "MM/DD/YYYY",
    locale: "en-US",
    loadingLabel: "Loading",
    onValueChange: fn(),
  },
  argTypes: {
    name: { control: false, table: { category: "Behavior" } },
    label: { control: "text", table: { category: "Content" } },
    helperText: { control: "text", table: { category: "Content" } },
    locale: { control: "text", table: { category: "Behavior" } },
    required: { control: "boolean", table: { category: "State" } },
    loading: { control: "boolean", table: { category: "State" } },
    loadingLabel: { control: "text", table: { category: "Content" } },
    disabled: { control: "boolean", table: { category: "State" } },
    onValueChange: { table: { category: "Events" } },
  },
} satisfies Meta<StoryArgs>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Bound to `birth`. The form stores the ISO string, or `null` while incomplete. */
export const Playground: Story = {
  play: async ({ args, canvas }) => {
    await typeInto(canvas.getByRole("spinbutton", { name: "month" }), "05011990");
    await expect(args.onValueChange).toHaveBeenLastCalledWith("1990-05-01");
    await userEvent.click(canvas.getByRole("button", { name: "Save" }));
    const payload = await canvas.findByRole("status", { name: "Submitted data" });
    await expect(payload).toHaveTextContent('"birth":"1990-05-01"');
  },
};

export const WithSchema: Story = {
  parameters: { strictSchema: true },
  render: () => (
    <>
      <DateTimeControl
        name="birth"
        label="Nacimiento"
        locale="es-ES"
        max="2008-08-01"
        {...calendarTextsEs}
      />
      <DateTimeControl
        name="meeting"
        label="Reunión"
        mode="datetime"
        locale="es-ES"
        minuteStep={15}
        {...calendarTextsEs}
      />
    </>
  ),
  play: async ({ canvas }) => {
    const birth = canvas.getByRole("group", { name: "Nacimiento" });
    const meeting = canvas.getByRole("group", { name: "Reunión" });
    const [birthDay] = [...birth.querySelectorAll<HTMLElement>("[role=spinbutton]")];
    await typeInto(birthDay as HTMLElement, "01052010");
    const [meetingDay] = [...meeting.querySelectorAll<HTMLElement>("[role=spinbutton]")];
    await typeInto(meetingDay as HTMLElement, "12082026");
    await userEvent.click(canvas.getByRole("button", { name: "Save" }));
    await waitFor(() => expect(canvas.getAllByRole("alert")).toHaveLength(2));
    await expect(canvas.getAllByRole("alert")[0]).toHaveTextContent("Debes tener 18 años o más.");
    await expect(canvas.getAllByRole("alert")[1]).toHaveTextContent("Elige fecha y hora.");
    await expect(birthDay).toHaveAttribute("aria-invalid", "true");
    await expect(birthDay).toHaveFocus();

    await typeInto(birthDay as HTMLElement, "01051990");
    const hour = meeting.querySelectorAll<HTMLElement>("[role=spinbutton]")[3] as HTMLElement;
    await typeInto(hour, "0930");
    await expect(segmentTexts(meeting)).toEqual(["12", "08", "2026", "09", "30"]);
    await userEvent.click(canvas.getByRole("button", { name: "Save" }));
    const payload = await canvas.findByRole("status", { name: "Submitted data" });
    await expect(payload).toHaveTextContent('"birth":"1990-05-01","meeting":"2026-08-12T09:30"');
  },
};

export const DisabledVsLoading: Story = {
  render: () => (
    <>
      <DateTimeControl
        name="review"
        label="Review date (loading)"
        locale="en-US"
        loading
        loadingLabel="Loading"
        helperText="Still submitted."
        {...calendarTexts}
      />
      <DateTimeControl
        name="signed"
        label="Signed on (disabled)"
        locale="en-US"
        disabled
        helperText="Left out."
        {...calendarTexts}
      />
    </>
  ),
  play: async ({ canvas }) => {
    await userEvent.click(canvas.getByRole("button", { name: "Save" }));
    const payload = await canvas.findByRole("status", { name: "Submitted data" });
    await expect(payload).toHaveTextContent('"review":"2026-08-15"');
    await expect(payload).not.toHaveTextContent("signed");
  },
};

const shared = {
  label: "Meeting",
  mode: "datetime",
  locale: "en-US",
  helperText: "Your local time.",
  required: true,
  ...calendarTexts,
} as const;

export const Parity: Story = {
  render: () => (
    <div className="grid gap-6 sm:grid-cols-2">
      <div className="flex flex-col gap-2">
        <span className="text-xs font-medium text-muted-foreground">DateTimeField</span>
        <DateTimeField {...shared} id="parity-field" name="meeting" value={null} />
      </div>
      <div className="flex flex-col gap-2">
        <span className="text-xs font-medium text-muted-foreground">DateTimeControl</span>
        <DateTimeControl {...shared} id="parity-control" name="meeting" />
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
