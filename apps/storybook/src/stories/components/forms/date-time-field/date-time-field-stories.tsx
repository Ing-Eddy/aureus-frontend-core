import {
  addDaysIso,
  DateTimeField,
  type DateTimeFieldProps,
  toDate,
} from "@aureus-core/ui/components/date-time-field";
import {
  calendarTexts,
  calendarTextsEs,
  dayName,
  segmentTexts,
  typeInto,
  typeLikeAPhone,
} from "@fixtures/date-fields";
import type { Meta, StoryObj } from "@storybook/react-vite";
import type { ComponentType } from "react";
import { expect, fn, userEvent, waitFor, within } from "storybook/test";
import { infoTexts, loadingTexts } from "../story-args";
import { docs } from "./date-time-field-docs";

/** Flat, story-only args; the render builds the mode and texts props from them. */
interface PlaygroundArgs {
  label: string;
  helperText: string;
  info: string;
  infoLabel: string;
  errorMessage: string;
  mode: "date" | "time" | "datetime";
  locale: string;
  hourCycle: "locale" | "12" | "24";
  granularity: "minute" | "second";
  minuteStep: number;
  min: string;
  max: string;
  openCalendarLabel: string;
  previousMonthLabel: string;
  nextMonthLabel: string;
  required: boolean;
  loading: boolean;
  loadingLabel: string;
  disabled: boolean;
  error: boolean;
  onValueChange: (value: string | null) => void;
}

const text = (value: string) => (value === "" ? undefined : value);

const content = { table: { category: "Content" } };
const behavior = { table: { category: "Behavior" } };
const state = { table: { category: "State" } };
const events = { table: { category: "Events" } };

/** Weekends, for the blocked-days examples. */
const isWeekend = (date: string) => [0, 6].includes(toDate(date)?.getDay() ?? -1);

const meta = {
  title: "components/Forms/Date Time Field",
  component: DateTimeField as unknown as ComponentType<PlaygroundArgs>,
  parameters: { aureusDocs: docs },
  decorators: [
    (Story) => (
      <div className="w-full max-w-sm">
        <Story />
      </div>
    ),
  ],
  render: (args) => {
    const time =
      args.mode === "date"
        ? {}
        : {
            hourCycle:
              args.hourCycle === "locale" ? undefined : (Number(args.hourCycle) as 12 | 24),
            granularity: args.granularity,
            minuteStep: args.minuteStep,
          };
    const calendar =
      args.mode === "time"
        ? {}
        : {
            openCalendarLabel: args.openCalendarLabel,
            previousMonthLabel: args.previousMonthLabel,
            nextMonthLabel: args.nextMonthLabel,
          };
    const props = {
      label: text(args.label),
      helperText: text(args.helperText),
      ...infoTexts(args.info, args.infoLabel),
      errorMessage: text(args.errorMessage),
      mode: args.mode,
      locale: text(args.locale),
      min: text(args.min),
      max: text(args.max),
      ...time,
      ...calendar,
      required: args.required,
      ...loadingTexts(args.loading, args.loadingLabel),
      disabled: args.disabled,
      error: args.error,
      onValueChange: args.onValueChange,
    } as DateTimeFieldProps;
    // Remount when the mode changes: the value changes format.
    return <DateTimeField key={args.mode} {...props} />;
  },
  args: {
    label: "Date",
    helperText: "",
    info: "",
    infoLabel: "More information",
    errorMessage: "",
    mode: "date",
    locale: "en-US",
    hourCycle: "locale",
    granularity: "minute",
    minuteStep: 1,
    min: "",
    max: "",
    ...calendarTexts,
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
    openCalendarLabel: { control: "text", ...content },
    previousMonthLabel: { control: "text", ...content },
    nextMonthLabel: { control: "text", ...content },
    loadingLabel: { control: "text", ...content },
    mode: { control: "inline-radio", options: ["date", "time", "datetime"], ...behavior },
    locale: { control: "text", ...behavior },
    hourCycle: { control: "inline-radio", options: ["locale", "12", "24"], ...behavior },
    granularity: { control: "inline-radio", options: ["minute", "second"], ...behavior },
    minuteStep: { control: "number", ...behavior },
    min: { control: "text", ...behavior },
    max: { control: "text", ...behavior },
    required: { control: "boolean", ...state },
    loading: { control: "boolean", ...state },
    disabled: { control: "boolean", ...state },
    error: { control: "boolean", ...state },
    onValueChange: events,
  },
} satisfies Meta<PlaygroundArgs>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Every option has a control; the calendar texts are used by the modes with a date. */
export const Playground: Story = {
  play: async ({ args, canvas }) => {
    await typeInto(canvas.getByRole("spinbutton", { name: "month" }), "08012026");
    await expect(args.onValueChange).toHaveBeenLastCalledWith("2026-08-01");
  },
};

/** A date typed in segments, or picked in the calendar. */
export const DateOnly: Story = {
  render: () => (
    <DateTimeField
      label="Delivery date"
      locale="en-US"
      defaultValue="2026-08-10"
      {...calendarTexts}
    />
  ),
  play: async ({ canvas }) => {
    const button = canvas.getByRole("button", { name: "Open calendar" });
    await userEvent.click(button);
    const dialog = await within(document.body).findByRole("dialog", { name: "Delivery date" });
    const chosen = within(dialog).getByRole("button", { name: dayName("2026-08-10") });
    await waitFor(() => expect(chosen).toHaveFocus());
    await userEvent.keyboard("{ArrowRight}{ArrowRight}{Enter}");
    await waitFor(() => expect(within(document.body).queryByRole("dialog")).toBeNull());
    await expect(segmentTexts(canvas.getByRole("group", { name: "Delivery date" }))).toEqual([
      "08",
      "12",
      "2026",
    ]);
    await waitFor(() => expect(button).toHaveFocus());
  },
};

/** A time only: 24 hours, 12 hours with a day period, and seconds. No calendar. */
export const TimeOnly: Story = {
  render: () => (
    <div className="flex flex-col gap-6">
      <DateTimeField label="Opening time" mode="time" locale="es-ES" defaultValue="09:30" />
      <DateTimeField label="Alarm" mode="time" locale="en-US" hourCycle={12} defaultValue="18:45" />
      <DateTimeField
        label="Lap time"
        mode="time"
        locale="en-GB"
        granularity="second"
        defaultValue="00:01:30"
      />
    </div>
  ),
  play: async ({ canvas }) => {
    await expect(canvas.queryByRole("button")).toBeNull();
    const alarm = canvas.getByRole("group", { name: "Alarm" });
    await expect(segmentTexts(alarm)).toEqual(["06", "45", "PM"]);
    const period = alarm.querySelectorAll<HTMLElement>("[role=spinbutton]")[2] as HTMLElement;
    await typeInto(period, "a");
    await expect(segmentTexts(alarm)).toEqual(["06", "45", "AM"]);
    await expect(segmentTexts(canvas.getByRole("group", { name: "Lap time" }))).toEqual([
      "00",
      "01",
      "30",
    ]);
  },
};

/** A date and a time: picking a day keeps the time; with no time yet, focus moves to the hour. */
export const DateAndTime: Story = {
  render: () => (
    <DateTimeField
      label="Meeting"
      mode="datetime"
      locale="en-GB"
      min="2026-08-01T00:00"
      max="2026-08-31T23:59"
      minuteStep={15}
      {...calendarTexts}
    />
  ),
  play: async ({ canvas }) => {
    await userEvent.click(canvas.getByRole("button", { name: "Open calendar" }));
    const dialog = await within(document.body).findByRole("dialog", { name: "Meeting" });
    await userEvent.click(
      within(dialog).getByRole("button", { name: dayName("2026-08-20", "en-GB") }),
    );
    const hour = canvas.getByRole("spinbutton", { name: "hour" });
    await waitFor(() => expect(hour).toHaveFocus());
    await userEvent.keyboard("1430{ArrowUp}");
    await expect(segmentTexts(canvas.getByRole("group", { name: "Meeting" }))).toEqual([
      "20",
      "08",
      "2026",
      "14",
      "45",
    ]);
  },
};

/** Order, separators, digits, captions and names follow the locale. */
export const Locales: Story = {
  render: () => (
    <div className="flex flex-col gap-6">
      <DateTimeField
        label="Fecha (es-ES)"
        locale="es-ES"
        defaultValue="2026-08-01"
        {...calendarTextsEs}
      />
      <DateTimeField
        label="Date (en-US)"
        locale="en-US"
        defaultValue="2026-08-01"
        {...calendarTexts}
      />
      <DateTimeField
        label="日付 (ja-JP)"
        locale="ja-JP"
        defaultValue="2026-08-01"
        {...calendarTexts}
      />
      <DateTimeField
        label="التاريخ (ar-EG)"
        locale="ar-EG"
        defaultValue="2026-08-01"
        {...calendarTexts}
      />
    </div>
  ),
  play: async ({ canvas }) => {
    const names = (group: string) =>
      [...canvas.getByRole("group", { name: group }).querySelectorAll("[role=spinbutton]")].map(
        (segment) => segment.getAttribute("aria-label"),
      );
    await expect(names("Fecha (es-ES)")).toEqual(["día", "mes", "año"]);
    await expect(names("Date (en-US)")).toEqual(["month", "day", "year"]);
    await expect(segmentTexts(canvas.getByRole("group", { name: "日付 (ja-JP)" }))).toEqual([
      "2026",
      "08",
      "01",
    ]);
    await expect(segmentTexts(canvas.getByRole("group", { name: "التاريخ (ar-EG)" }))).toEqual([
      "٠١",
      "٠٨",
      "٢٠٢٦",
    ]);
    const buttons = canvas.getAllByRole("button", { name: /Abrir calendario/ });
    await userEvent.click(buttons[0] as HTMLElement);
    const dialog = await within(document.body).findByRole("dialog");
    await expect(dialog).toHaveTextContent("agosto de 2026");
    await expect(
      within(dialog).getByRole("button", { name: dayName("2026-08-01", "es-ES") }),
    ).toBeTruthy();
    await userEvent.keyboard("{Escape}");
  },
};

/** `min`/`max`, listed days and a matcher: blocked in the calendar, and the arrows stop at the limits. */
export const Limits: Story = {
  render: () => (
    <DateTimeField
      label="Working day"
      locale="en-US"
      defaultValue="2026-08-10"
      min="2026-08-03"
      max="2026-08-28"
      disabledDates={["2026-08-14"]}
      isDateDisabled={isWeekend}
      helperText="Weekdays in August, except the 14th."
      {...calendarTexts}
    />
  ),
  play: async ({ canvas }) => {
    await userEvent.click(canvas.getByRole("button", { name: "Open calendar" }));
    const dialog = await within(document.body).findByRole("dialog");
    for (const day of ["2026-08-01", "2026-08-08", "2026-08-14", "2026-08-31"]) {
      await expect(within(dialog).getByRole("button", { name: dayName(day) })).toBeDisabled();
    }
    await expect(within(dialog).getByRole("button", { name: "Previous month" })).toHaveAttribute(
      "aria-disabled",
      "true",
    );
    await userEvent.keyboard("{Escape}");
    const day = canvas.getByRole("spinbutton", { name: "day" });
    await typeInto(day, "{ArrowDown}".repeat(10));
    await expect(day).toHaveTextContent("03");
  },
};

/** Shortcuts beside the calendar (above it on narrow screens); a function is evaluated on click. */
export const Presets: Story = {
  render: () => (
    <DateTimeField
      label="Due date"
      locale="en-US"
      defaultValue="2026-08-10"
      presets={[
        { label: "Today", value: "2026-08-10" },
        { label: "In a week", value: () => addDaysIso("2026-08-10", 7) },
        { label: "In a month", value: () => addDaysIso("2026-08-10", 31) },
      ]}
      presetsLabel="Shortcuts"
      {...calendarTexts}
    />
  ),
  play: async ({ canvas }) => {
    await userEvent.click(canvas.getByRole("button", { name: "Open calendar" }));
    const dialog = await within(document.body).findByRole("dialog");
    const group = within(dialog).getByRole("group", { name: "Shortcuts" });
    await expect(within(group).getByRole("button", { name: "Today" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    await userEvent.click(within(group).getByRole("button", { name: "In a week" }));
    await waitFor(() => expect(within(document.body).queryByRole("dialog")).toBeNull());
    await expect(segmentTexts(canvas.getByRole("group", { name: "Due date" }))).toEqual([
      "08",
      "17",
      "2026",
    ]);
  },
};

/** Minutes in steps of 15 and seconds in steps of 10; typed values are kept as typed. */
export const Steps: Story = {
  render: () => (
    <DateTimeField
      label="Slot"
      mode="time"
      locale="en-GB"
      granularity="second"
      minuteStep={15}
      secondStep={10}
      defaultValue="10:07:00"
    />
  ),
  play: async ({ canvas }) => {
    const minute = canvas.getByRole("spinbutton", { name: "minute" });
    await typeInto(minute, "{ArrowUp}");
    await expect(minute).toHaveTextContent("15");
    const second = canvas.getByRole("spinbutton", { name: "second" });
    await typeInto(second, "{ArrowUp}{ArrowUp}");
    await expect(second).toHaveTextContent("20");
  },
};

/** Typing with auto-advance, arrows, Backspace, separators, phone keyboards and the calendar grid. */
export const Keyboard: Story = {
  render: () => <DateTimeField label="Birthday" locale="en-GB" {...calendarTexts} />,
  play: async ({ canvas }) => {
    const group = canvas.getByRole("group", { name: "Birthday" });
    const [day, month, year] = [...group.querySelectorAll<HTMLElement>("[role=spinbutton]")];
    await typeInto(day as HTMLElement, "4");
    await expect(month).toHaveFocus();
    await userEvent.keyboard("1/");
    await expect(year).toHaveFocus();
    await expect(typeLikeAPhone(year as HTMLElement, "1990")).toBe(true);
    await expect(segmentTexts(group)).toEqual(["04", "01", "1990"]);
    await userEvent.keyboard("{ArrowLeft}{ArrowUp}");
    await expect(month).toHaveTextContent("02");
    await userEvent.keyboard("{Backspace}");
    await expect(month).toHaveTextContent("––");
    await userEvent.keyboard("{Backspace}");
    await expect(day).toHaveFocus();
    // The calendar grid: arrows, Page Up / Page Down for months, Home / End for the week.
    await userEvent.click(canvas.getByRole("button", { name: "Open calendar" }));
    const dialog = await within(document.body).findByRole("dialog");
    await waitFor(() => expect(dialog.contains(document.activeElement)).toBe(true));
    const caption = dialog.querySelector("[role=grid]")?.getAttribute("aria-label");
    await userEvent.keyboard("{PageDown}");
    await waitFor(() =>
      expect(dialog.querySelector("[role=grid]")?.getAttribute("aria-label")).not.toBe(caption),
    );
    await userEvent.keyboard("{Escape}");
    await waitFor(() =>
      expect(canvas.getByRole("button", { name: "Open calendar" })).toHaveFocus(),
    );
  },
};

export const States: Story = {
  render: () => (
    <div className="flex flex-col gap-6">
      <DateTimeField
        label="Start date"
        required
        info="The first day of the contract."
        infoLabel="More information"
        helperText="MM/DD/YYYY"
        locale="en-US"
        {...calendarTexts}
      />
      <DateTimeField
        label="End date"
        error
        errorMessage="The end must be after the start."
        locale="en-US"
        defaultValue="2026-08-01"
        {...calendarTexts}
      />
      <DateTimeField
        label="Review date (loading)"
        loading
        loadingLabel="Loading"
        locale="en-US"
        defaultValue="2026-08-15"
        {...calendarTexts}
      />
      <DateTimeField
        label="Signed on (disabled)"
        disabled
        locale="en-US"
        defaultValue="2026-07-30"
        {...calendarTexts}
      />
    </div>
  ),
  play: async ({ canvas }) => {
    await expect(canvas.getAllByRole("spinbutton", { name: "month" })[0]).toHaveAttribute(
      "aria-required",
      "true",
    );
    await expect(canvas.getByRole("alert")).toHaveTextContent("The end must be after the start.");
    await expect(canvas.getByRole("group", { name: "Review date (loading)" })).toHaveAttribute(
      "aria-busy",
      "true",
    );
    await expect(canvas.getByRole("status", { name: "Loading" })).toBeTruthy();
    const buttons = canvas.getAllByRole("button", { name: "Open calendar" });
    await expect(buttons[2]).toBeDisabled();
    await expect(buttons[3]).toBeDisabled();
  },
};

/** The segments keep the locale's left-to-right order; the frame and the calendar mirror. */
export const Rtl: Story = {
  render: () => (
    <div dir="rtl">
      <DateTimeField label="التاريخ" locale="ar-EG" defaultValue="2026-08-01" {...calendarTexts} />
    </div>
  ),
  play: async ({ canvas }) => {
    const group = canvas.getByRole("group", { name: "التاريخ" });
    await expect(group).toHaveAttribute("dir", "ltr");
    const [day, month] = [...group.querySelectorAll<HTMLElement>("[role=spinbutton]")];
    await expect((day as HTMLElement).getBoundingClientRect().left).toBeLessThan(
      (month as HTMLElement).getBoundingClientRect().left,
    );
    const button = canvas.getByRole("button", { name: "Open calendar" });
    // The calendar button sits at the inline end, which is the left in right-to-left pages.
    await expect(button.getBoundingClientRect().right).toBeLessThan(
      group.getBoundingClientRect().left,
    );
    await userEvent.click(button);
    const dialog = await within(document.body).findByRole("dialog");
    await waitFor(() =>
      expect(dialog.querySelector("[data-slot=calendar]")).toHaveAttribute("dir", "rtl"),
    );
    await userEvent.keyboard("{Escape}");
  },
};

/** At 320 px the segments stay inside the frame, and targets grow on touch screens. */
export const Responsive: Story = {
  decorators: [
    (Story) => (
      <div className="w-[288px] border border-dashed p-2">
        <Story />
      </div>
    ),
  ],
  render: () => (
    <DateTimeField
      label="Departure"
      mode="datetime"
      locale="en-US"
      granularity="second"
      hourCycle={12}
      defaultValue="2026-08-01T14:30:15"
      presets={[{ label: "Now", value: "2026-08-01T14:30:15" }]}
      presetsLabel="Shortcuts"
      action={{ children: "Clear", onClick: () => {} }}
      {...calendarTexts}
    />
  ),
  play: async ({ canvas, canvasElement }) => {
    const field = canvasElement.querySelector("[data-slot=field]") as HTMLElement;
    await expect(field.scrollWidth).toBeLessThanOrEqual(field.clientWidth);
    await expect(document.documentElement.scrollWidth).toBeLessThanOrEqual(window.innerWidth);
    // Every segment is visible: long values wrap inside the frame instead of scrolling away.
    const frame = canvasElement.querySelector("[data-slot=date-time-frame]") as HTMLElement;
    for (const item of canvas.getAllByRole("spinbutton")) {
      await expect(item.getBoundingClientRect().right).toBeLessThanOrEqual(
        frame.getBoundingClientRect().right,
      );
    }
    const segment = canvas.getByRole("spinbutton", { name: "hour" });
    await expect(segment.className).toContain("pointer-coarse:after:-inset-y-2.5");
    await userEvent.click(canvas.getByRole("button", { name: "Open calendar" }));
    const dialog = await within(document.body).findByRole("dialog");
    const box = dialog.getBoundingClientRect();
    await expect(box.left).toBeGreaterThanOrEqual(0);
    await expect(box.right).toBeLessThanOrEqual(window.innerWidth);
    await userEvent.keyboard("{Escape}");
  },
};
