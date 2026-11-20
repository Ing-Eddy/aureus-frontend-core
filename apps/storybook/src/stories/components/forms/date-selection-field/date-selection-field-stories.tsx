import {
  type DateRangeValue,
  DateSelectionField,
  type DateSelectionFieldProps,
} from "@aureus-core/ui/components/date-selection-field";
import { addDaysIso, toDate } from "@aureus-core/ui/components/date-time-field";
import {
  dayName,
  monthTexts,
  rangeTexts,
  segmentsOf,
  segmentTexts,
  typeInto,
} from "@fixtures/date-fields";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { type ComponentType, useState } from "react";
import { expect, fn, userEvent, waitFor, within } from "storybook/test";
import { infoTexts, loadingTexts } from "../story-args";
import { docs } from "./date-selection-field-docs";

/** Flat, story-only args; the render builds the selection props from them. */
interface PlaygroundArgs {
  label: string;
  helperText: string;
  info: string;
  infoLabel: string;
  errorMessage: string;
  selection: "range" | "multiple";
  locale: string;
  min: string;
  max: string;
  minDays: number;
  maxDays: number;
  excludeDisabled: boolean;
  maxSelected: number;
  placeholder: string;
  openCalendarLabel: string;
  previousMonthLabel: string;
  nextMonthLabel: string;
  startLabel: string;
  endLabel: string;
  required: boolean;
  loading: boolean;
  loadingLabel: string;
  disabled: boolean;
  error: boolean;
  onValueChange: (value: DateRangeValue | null | string[]) => void;
}

const text = (value: string) => (value === "" ? undefined : value);
const count = (value: number) => (value > 0 ? value : undefined);

const content = { table: { category: "Content" } };
const behavior = { table: { category: "Behavior" } };
const state = { table: { category: "State" } };
const events = { table: { category: "Events" } };

const isWeekend = (date: string) => [0, 6].includes(toDate(date)?.getDay() ?? -1);

/** The open calendar dialog. */
const dialog = () => within(document.body).findByRole("dialog");

const meta = {
  title: "components/Forms/Date Selection Field",
  component: DateSelectionField as unknown as ComponentType<PlaygroundArgs>,
  parameters: { aureusDocs: docs },
  decorators: [
    (Story) => (
      <div className="w-full max-w-sm">
        <Story />
      </div>
    ),
  ],
  render: (args) => {
    const selection =
      args.selection === "range"
        ? {
            selection: "range" as const,
            openCalendarLabel: args.openCalendarLabel,
            startLabel: args.startLabel,
            endLabel: args.endLabel,
            minDays: count(args.minDays),
            maxDays: count(args.maxDays),
            excludeDisabled: args.excludeDisabled,
            defaultValue: { from: "2026-08-01", to: null },
          }
        : {
            selection: "multiple" as const,
            maxSelected: count(args.maxSelected),
            placeholder: text(args.placeholder),
            defaultValue: ["2026-08-03"],
          };
    const props = {
      label: text(args.label),
      helperText: text(args.helperText),
      ...infoTexts(args.info, args.infoLabel),
      errorMessage: text(args.errorMessage),
      ...selection,
      locale: text(args.locale),
      min: text(args.min),
      max: text(args.max),
      previousMonthLabel: args.previousMonthLabel,
      nextMonthLabel: args.nextMonthLabel,
      required: args.required,
      ...loadingTexts(args.loading, args.loadingLabel),
      disabled: args.disabled,
      error: args.error,
      onValueChange: args.onValueChange,
    } as DateSelectionFieldProps;
    // Remount when the selection changes: the value changes shape.
    return <DateSelectionField key={args.selection} {...props} />;
  },
  args: {
    label: "Stay",
    helperText: "",
    info: "",
    infoLabel: "More information",
    errorMessage: "",
    selection: "range",
    locale: "en-US",
    min: "",
    max: "",
    minDays: 0,
    maxDays: 0,
    excludeDisabled: false,
    maxSelected: 0,
    placeholder: "Pick days",
    ...rangeTexts,
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
    placeholder: { control: "text", ...content },
    openCalendarLabel: { control: "text", ...content },
    previousMonthLabel: { control: "text", ...content },
    nextMonthLabel: { control: "text", ...content },
    startLabel: { control: "text", ...content },
    endLabel: { control: "text", ...content },
    loadingLabel: { control: "text", ...content },
    selection: { control: "inline-radio", options: ["range", "multiple"], ...behavior },
    locale: { control: "text", ...behavior },
    min: { control: "text", ...behavior },
    max: { control: "text", ...behavior },
    minDays: { control: "number", ...behavior },
    maxDays: { control: "number", ...behavior },
    excludeDisabled: { control: "boolean", ...behavior },
    maxSelected: { control: "number", ...behavior },
    required: { control: "boolean", ...state },
    loading: { control: "boolean", ...state },
    disabled: { control: "boolean", ...state },
    error: { control: "boolean", ...state },
    onValueChange: events,
  },
} satisfies Meta<PlaygroundArgs>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Every option has a control; the range texts are used while `selection` is `"range"`. */
export const Playground: Story = {
  play: async ({ args, canvas }) => {
    await userEvent.click(canvas.getByRole("button", { name: "Open calendar" }));
    const calendar = await dialog();
    await userEvent.click(within(calendar).getByRole("button", { name: dayName("2026-08-05") }));
    await expect(args.onValueChange).toHaveBeenLastCalledWith({
      from: "2026-08-01",
      to: "2026-08-05",
    });
  },
};

/** A stay from 1 to 27 August, chosen with the pointer, then with the keyboard. */
export const Range: Story = {
  render: function Render() {
    const [value, setValue] = useState<DateRangeValue | null>(null);
    return (
      <div className="flex flex-col gap-3">
        <DateSelectionField
          label="Stay"
          selection="range"
          locale="en-US"
          min="2026-08-01"
          max="2026-08-31"
          value={value}
          onValueChange={setValue}
          {...rangeTexts}
        />
        <output data-testid="value" className="font-mono text-xs">
          {JSON.stringify(value)}
        </output>
      </div>
    );
  },
  play: async ({ canvas, canvasElement }) => {
    const button = canvas.getByRole("button", { name: "Open calendar" });
    await userEvent.click(button);
    let calendar = await dialog();
    await userEvent.click(within(calendar).getByRole("button", { name: dayName("2026-08-01") }));
    await expect(canvas.getByTestId("value")).toHaveTextContent('{"from":"2026-08-01","to":null}');
    await userEvent.hover(within(calendar).getByRole("button", { name: dayName("2026-08-27") }));
    await userEvent.click(within(calendar).getByRole("button", { name: dayName("2026-08-27") }));
    await waitFor(() => expect(within(document.body).queryByRole("dialog")).toBeNull());
    await expect(canvas.getByTestId("value")).toHaveTextContent(
      '{"from":"2026-08-01","to":"2026-08-27"}',
    );
    await expect(
      segmentTexts(segmentsOf(canvasElement, "Check-out")[0]?.closest("[role=group]") as Element),
    ).toEqual(["08", "27", "2026"]);

    // With the keyboard: a new range from the 3rd to the 5th.
    button.focus();
    await userEvent.keyboard("{Enter}");
    calendar = await dialog();
    await waitFor(() =>
      expect(within(calendar).getByRole("button", { name: dayName("2026-08-01") })).toHaveFocus(),
    );
    await userEvent.keyboard("{ArrowRight}{ArrowRight}{Enter}{ArrowRight}{ArrowRight}{Enter}");
    await waitFor(() =>
      expect(canvas.getByTestId("value")).toHaveTextContent(
        '{"from":"2026-08-03","to":"2026-08-05"}',
      ),
    );
  },
};

/** Separate days: the summary lists them with `Intl.ListFormat`, and `maxSelected` caps them. */
export const Multiple: Story = {
  render: () => (
    <div className="flex flex-col gap-6">
      <DateSelectionField
        label="Days off"
        selection="multiple"
        locale="en-US"
        defaultValue={["2026-08-09"]}
        placeholder="Pick days"
        {...monthTexts}
      />
      <DateSelectionField
        label="Two training days"
        selection="multiple"
        locale="en-US"
        maxSelected={2}
        defaultValue={["2026-08-03", "2026-08-04"]}
        {...monthTexts}
      />
    </div>
  ),
  play: async ({ canvas }) => {
    const summary = canvas.getByRole("button", { name: /^Days off/ });
    await userEvent.click(summary);
    const calendar = await dialog();
    for (const day of ["2026-08-01", "2026-08-05"]) {
      await userEvent.click(within(calendar).getByRole("button", { name: dayName(day) }));
    }
    await expect(summary).toHaveTextContent("Aug 1, 2026, Aug 5, 2026, and Aug 9, 2026");
    await userEvent.keyboard("{Escape}");
    await waitFor(() => expect(within(document.body).queryByRole("dialog")).toBeNull());

    await userEvent.click(canvas.getByRole("button", { name: /^Two training days/ }));
    const capped = await dialog();
    await expect(
      within(capped).getByRole("button", { name: dayName("2026-08-06") }),
    ).toBeDisabled();
    await expect(within(capped).getByRole("button", { name: dayName("2026-08-03") })).toBeEnabled();
    await userEvent.keyboard("{Escape}");
  },
};

/** A stay of 3 to 7 days on weekdays only, which cannot cross a weekend. */
export const Limits: Story = {
  render: () => (
    <DateSelectionField
      label="Workshop"
      selection="range"
      locale="en-US"
      min="2026-08-03"
      max="2026-08-28"
      minDays={3}
      maxDays={7}
      excludeDisabled
      isDateDisabled={isWeekend}
      defaultValue={{ from: "2026-08-04", to: null }}
      helperText="3 to 7 weekdays in August."
      {...rangeTexts}
    />
  ),
  play: async ({ canvas }) => {
    await userEvent.click(canvas.getByRole("button", { name: "Open calendar" }));
    const calendar = await dialog();
    const day = (iso: string) => within(calendar).getByRole("button", { name: dayName(iso) });
    // The start stays enabled; the 5th would make only two days.
    await expect(day("2026-08-04")).toBeEnabled();
    await expect(day("2026-08-05")).toBeDisabled();
    await expect(day("2026-08-06")).toBeEnabled();
    await expect(day("2026-08-08")).toBeDisabled();
    await expect(day("2026-08-11")).toBeDisabled();
    // Beyond the weekend, the range starts over at the clicked day.
    await userEvent.click(day("2026-08-10"));
    await expect(
      segmentTexts(segmentsOf(document.body, "Check-in")[0]?.closest("[role=group]") as Element),
    ).toEqual(["08", "10", "2026"]);
    await userEvent.keyboard("{Escape}");
  },
};

/** Relative shortcuts for both selections; the matching one is pressed. */
export const Presets: Story = {
  render: () => (
    <div className="flex flex-col gap-6">
      <DateSelectionField
        label="Report period"
        selection="range"
        locale="en-US"
        defaultValue={{ from: "2026-08-01", to: "2026-08-07" }}
        presets={[
          { label: "First week", value: { from: "2026-08-01", to: "2026-08-07" } },
          {
            label: "Next 14 days",
            value: () => ({ from: "2026-08-10", to: addDaysIso("2026-08-10", 13) }),
          },
        ]}
        presetsLabel="Shortcuts"
        {...rangeTexts}
      />
      <DateSelectionField
        label="Weekend shifts"
        selection="multiple"
        locale="en-US"
        presets={[{ label: "First weekend", value: ["2026-08-01", "2026-08-02"] }]}
        presetsLabel="Weekend shortcuts"
        placeholder="Pick days"
        {...monthTexts}
      />
    </div>
  ),
  play: async ({ canvas }) => {
    await userEvent.click(canvas.getByRole("button", { name: "Open calendar" }));
    let calendar = await dialog();
    const group = within(calendar).getByRole("group", { name: "Shortcuts" });
    await expect(within(group).getByRole("button", { name: "First week" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    await userEvent.click(within(group).getByRole("button", { name: "Next 14 days" }));
    await waitFor(() => expect(within(document.body).queryByRole("dialog")).toBeNull());
    await expect(
      segmentTexts(segmentsOf(document.body, "Check-out")[0]?.closest("[role=group]") as Element),
    ).toEqual(["08", "23", "2026"]);

    await userEvent.click(canvas.getByRole("button", { name: /^Weekend shifts/ }));
    calendar = await dialog();
    await userEvent.click(within(calendar).getByRole("button", { name: "First weekend" }));
    await expect(canvas.getByRole("button", { name: /^Weekend shifts/ })).toHaveTextContent(
      "Aug 1, 2026 and Aug 2, 2026",
    );
  },
};

/** Typing a range: each end has its own segments; an end before the start is sorted on leaving. */
export const Keyboard: Story = {
  render: () => (
    <div className="flex flex-col gap-3">
      <DateSelectionField label="Trip" selection="range" locale="en-GB" {...rangeTexts} />
      <button type="button">After</button>
    </div>
  ),
  play: async ({ canvas, canvasElement }) => {
    const start = segmentsOf(canvasElement, "Check-in");
    const end = segmentsOf(canvasElement, "Check-out");
    await typeInto(start[0] as HTMLElement, "20082026");
    await typeInto(end[0] as HTMLElement, "10082026");
    await expect(segmentTexts(start[0]?.closest("[role=group]") as Element)).toEqual([
      "20",
      "08",
      "2026",
    ]);
    await userEvent.click(canvas.getByRole("button", { name: "After" }));
    await waitFor(() =>
      expect(segmentTexts(start[0]?.closest("[role=group]") as Element)).toEqual([
        "10",
        "08",
        "2026",
      ]),
    );
    await expect(segmentTexts(end[0]?.closest("[role=group]") as Element)).toEqual([
      "20",
      "08",
      "2026",
    ]);
  },
};

export const States: Story = {
  render: () => (
    <div className="flex flex-col gap-6">
      <DateSelectionField
        label="Holidays"
        selection="range"
        locale="en-US"
        required
        info="Up to 27 days."
        infoLabel="More information"
        helperText="Pick a start and an end."
        {...rangeTexts}
      />
      <DateSelectionField
        label="Shifts"
        selection="multiple"
        locale="en-US"
        error
        errorMessage="Pick at least two days."
        defaultValue={["2026-08-03"]}
        {...monthTexts}
      />
      <DateSelectionField
        label="Audit (loading)"
        selection="range"
        locale="en-US"
        loading
        loadingLabel="Loading"
        defaultValue={{ from: "2026-08-03", to: "2026-08-07" }}
        {...rangeTexts}
      />
      <DateSelectionField
        label="Closed days (disabled)"
        selection="multiple"
        locale="en-US"
        disabled
        defaultValue={["2026-08-15"]}
        {...monthTexts}
      />
    </div>
  ),
  play: async ({ canvas }) => {
    await expect(canvas.getByRole("group", { name: "Holidays" })).toBeTruthy();
    await expect(canvas.getByRole("alert")).toHaveTextContent("Pick at least two days.");
    await expect(canvas.getByRole("button", { name: /^Shifts/ })).toHaveAttribute(
      "aria-invalid",
      "true",
    );
    await expect(canvas.getByRole("status", { name: "Loading" })).toBeTruthy();
    await expect(canvas.getByRole("button", { name: /^Closed days/ })).toBeDisabled();
  },
};

/** In a right-to-left page each end keeps its left-to-right segments; the frame mirrors. */
export const Rtl: Story = {
  render: () => (
    <div dir="rtl">
      <DateSelectionField
        label="الإقامة"
        selection="range"
        locale="ar-EG"
        defaultValue={{ from: "2026-08-01", to: "2026-08-27" }}
        {...rangeTexts}
      />
    </div>
  ),
  play: async ({ canvas, canvasElement }) => {
    const start = segmentsOf(canvasElement, "Check-in");
    const end = segmentsOf(canvasElement, "Check-out");
    await expect(start[0]?.closest("[role=group]")).toHaveAttribute("dir", "ltr");
    // The start group is on the right, where right-to-left reading begins.
    await expect((start[0] as HTMLElement).getBoundingClientRect().left).toBeGreaterThan(
      (end[0] as HTMLElement).getBoundingClientRect().left,
    );
    await userEvent.click(canvas.getByRole("button", { name: "Open calendar" }));
    const calendar = await dialog();
    await waitFor(() =>
      expect(calendar.querySelector("[data-slot=calendar]")).toHaveAttribute("dir", "rtl"),
    );
    await userEvent.keyboard("{Escape}");
  },
};

/** At 288 px the two ends wrap onto two lines and the summary truncates inside its frame. */
export const Responsive: Story = {
  decorators: [
    (Story) => (
      <div className="w-[288px] border border-dashed p-2">
        <Story />
      </div>
    ),
  ],
  render: () => (
    <div className="flex flex-col gap-6">
      <DateSelectionField
        label="Stay"
        selection="range"
        locale="en-US"
        defaultValue={{ from: "2026-08-01", to: "2026-08-27" }}
        presets={[{ label: "August", value: { from: "2026-08-01", to: "2026-08-31" } }]}
        presetsLabel="Shortcuts"
        {...rangeTexts}
      />
      <DateSelectionField
        label="Days"
        selection="multiple"
        locale="en-US"
        defaultValue={["2026-08-01", "2026-08-05", "2026-08-09", "2026-08-13", "2026-08-17"]}
        {...monthTexts}
      />
    </div>
  ),
  play: async ({ canvas, canvasElement }) => {
    for (const field of canvasElement.querySelectorAll<HTMLElement>("[data-slot=field]")) {
      await expect(field.scrollWidth).toBeLessThanOrEqual(field.clientWidth);
    }
    await expect(document.documentElement.scrollWidth).toBeLessThanOrEqual(window.innerWidth);
    const days = canvas.getByRole("button", { name: /^Days/ });
    await expect(days.getBoundingClientRect().right).toBeLessThanOrEqual(
      (days.closest("[data-slot=field]") as HTMLElement).getBoundingClientRect().right,
    );
    await userEvent.click(canvas.getByRole("button", { name: "Open calendar" }));
    const calendar = await dialog();
    const box = calendar.getBoundingClientRect();
    await expect(box.left).toBeGreaterThanOrEqual(0);
    await expect(box.right).toBeLessThanOrEqual(window.innerWidth);
    await userEvent.keyboard("{Escape}");
  },
};
