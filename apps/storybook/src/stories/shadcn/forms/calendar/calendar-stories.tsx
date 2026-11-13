import { Button } from "@aureus-core/ui/shadcn/button";
import { Calendar } from "@aureus-core/ui/shadcn/calendar";
import { Label } from "@aureus-core/ui/shadcn/label";
import { Popover, PopoverContent, PopoverTrigger } from "@aureus-core/ui/shadcn/popover";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { addDays, format } from "date-fns";
import { es } from "date-fns/locale";
import { CalendarIcon } from "lucide-react";
import { type ComponentProps, useState } from "react";
import { expect, fn, userEvent, waitFor, within } from "storybook/test";
import { docs } from "./calendar-docs";

/** react-day-picker types, without depending on it directly (it is a dependency of the package). */
type DateRange = { from: Date | undefined; to?: Date | undefined };
type Modifiers = Record<string, boolean>;
type WeekNumberProps = ComponentProps<"th"> & { week: unknown };

/** Fixed dates keep every story identical from day to day (design D7). */
const today = new Date(2025, 5, 12);
const june = new Date(2025, 5, 1);

/**
 * DayPicker's default day name ("Sunday, June 29th, 2025") does not contain the visible text ("29")
 * as a word, which fails WCAG 2.5.3 Label in Name (axe `label-content-name-mismatch`). A label with
 * the plain day number fixes it; consumers pass the same `labels` prop.
 */
const dayLabel = (pattern: string, locale?: typeof es) => ({
  labelDayButton: (date: Date, modifiers?: Modifiers) =>
    [
      modifiers?.today ? (locale ? "Hoy" : "Today") : "",
      format(date, pattern, { locale }),
      modifiers?.selected ? (locale ? "seleccionado" : "selected") : "",
    ]
      .filter(Boolean)
      .join(", "),
});
const labels = dayLabel("EEEE d MMMM yyyy");

/**
 * The shadcn WeekNumber renders a `<td scope="row">` (invalid: axe `scope-attr-valid`) and spreads
 * the `week` object onto the DOM. DayPicker lets consumers replace it through `components`.
 */
function WeekNumber({ children, week: _week, ...props }: WeekNumberProps) {
  return (
    <th {...props}>
      <div className="flex size-(--cell-size) items-center justify-center text-center">
        {children}
      </div>
    </th>
  );
}
const components = { WeekNumber };

interface PlaygroundArgs {
  numberOfMonths: number;
  showOutsideDays: boolean;
  showWeekNumber: boolean;
  captionLayout: "label" | "dropdown" | "dropdown-months" | "dropdown-years";
  weekStartsOn: 0 | 1;
  onSelect: (date: Date | undefined) => void;
}

const meta = {
  title: "shadcn/Forms/Calendar",
  parameters: { aureusDocs: docs },
  args: {
    numberOfMonths: 1,
    showOutsideDays: true,
    showWeekNumber: false,
    captionLayout: "label",
    weekStartsOn: 0,
    onSelect: fn(),
  },
  argTypes: {
    numberOfMonths: {
      control: { type: "number", min: 1, max: 3 },
      table: { category: "Appearance" },
    },
    showOutsideDays: { control: "boolean", table: { category: "Appearance" } },
    showWeekNumber: { control: "boolean", table: { category: "Appearance" } },
    captionLayout: {
      control: "select",
      options: ["label", "dropdown", "dropdown-months", "dropdown-years"],
      table: { category: "Appearance" },
    },
    weekStartsOn: { control: "inline-radio", options: [0, 1], table: { category: "Behavior" } },
    onSelect: { table: { category: "Events" } },
  },
  render: function Render({ onSelect, ...args }) {
    const [date, setDate] = useState<Date | undefined>(today);
    return (
      <Calendar
        labels={labels}
        components={components}
        {...args}
        mode="single"
        today={today}
        defaultMonth={june}
        startMonth={new Date(2020, 0)}
        endMonth={new Date(2030, 11)}
        selected={date}
        onSelect={(value) => {
          setDate(value);
          onSelect(value);
        }}
        className="rounded-lg border"
      />
    );
  },
} satisfies Meta<PlaygroundArgs>;

export default meta;
type Story = StoryObj<typeof meta>;

const day = (canvas: ReturnType<typeof within>, label: RegExp) =>
  canvas.getByRole("button", { name: label });

/** Arrow keys move between days and Enter selects; `onSelect` receives the new Date. */
export const Playground: Story = {
  play: async ({ args, canvas }) => {
    const selected = day(canvas, /\b12 June 2025/);
    await expect(selected.closest("td")).toHaveAttribute("aria-selected", "true");
    selected.focus();
    await userEvent.keyboard("{ArrowRight}{ArrowDown}");
    await expect(day(canvas, /\b20 June 2025/)).toHaveFocus();
    await userEvent.keyboard("{Enter}");
    const picked = (args.onSelect as ReturnType<typeof fn>).mock.lastCall?.[0] as Date;
    await expect(format(picked, "yyyy-MM-dd")).toBe("2025-06-20");
    await userEvent.keyboard("{PageDown}");
    await expect(day(canvas, /\b20 July 2025/)).toHaveFocus();
  },
};

function MultipleExample() {
  const [dates, setDates] = useState<Date[]>([today, addDays(today, 2)]);
  return (
    <div className="grid gap-2">
      <Calendar
        labels={labels}
        mode="multiple"
        today={today}
        defaultMonth={june}
        selected={dates}
        onSelect={(value) => setDates(value ?? [])}
        className="rounded-lg border"
      />
      <p className="text-muted-foreground text-sm">{dates.length} dates selected</p>
    </div>
  );
}

export const Multiple: Story = {
  render: () => <MultipleExample />,
  play: async ({ canvas }) => {
    await userEvent.click(day(canvas, /\b20 June 2025/));
    await expect(canvas.getByText("3 dates selected")).toBeVisible();
    await userEvent.click(day(canvas, /\b12 June 2025/));
    await expect(canvas.getByText("2 dates selected")).toBeVisible();
  },
};

function RangeExample() {
  const [range, setRange] = useState<DateRange | undefined>({
    from: new Date(2025, 5, 24),
    to: new Date(2025, 6, 3),
  });
  return (
    <div className="grid gap-2">
      <Calendar
        labels={labels}
        mode="range"
        today={today}
        defaultMonth={june}
        numberOfMonths={2}
        selected={range}
        onSelect={setRange}
        className="rounded-lg border"
      />
      <p className="text-muted-foreground text-sm">
        {range?.from ? format(range.from, "MMM d") : "…"} –{" "}
        {range?.to ? format(range.to, "MMM d, yyyy") : "…"}
      </p>
    </div>
  );
}

export const Range: Story = {
  render: () => <RangeExample />,
  play: async ({ canvas }) => {
    await expect(canvas.getByText("Jun 24 – Jul 3, 2025")).toBeVisible();
    await userEvent.click(day(canvas, /\b8 July 2025/));
    await expect(canvas.getByText("Jun 24 – Jul 8, 2025")).toBeVisible();
  },
};

/** Past dates and weekends cannot be selected. */
export const DisabledDates: Story = {
  render: ({ onSelect }) => (
    <Calendar
      labels={labels}
      mode="single"
      today={today}
      defaultMonth={june}
      disabled={[{ before: today }, { dayOfWeek: [0, 6] }]}
      onSelect={onSelect}
      className="rounded-lg border"
    />
  ),
  play: async ({ args, canvas }) => {
    const past = day(canvas, /\b10 June 2025/);
    const saturday = day(canvas, /\b14 June 2025/);
    await expect(past).toBeDisabled();
    await expect(saturday).toBeDisabled();
    await userEvent.click(past, { pointerEventsCheck: 0 });
    await expect(args.onSelect).not.toHaveBeenCalled();
  },
};

export const TwoMonths: Story = {
  args: { numberOfMonths: 2, showWeekNumber: true },
};

export const Dropdowns: Story = {
  args: { captionLayout: "dropdown" },
  play: async ({ canvas }) => {
    const year = canvas.getByRole("combobox", { name: /year/i });
    await userEvent.selectOptions(year, "2028");
    await expect(day(canvas, /\b12 June 2028/)).toBeInTheDocument();
  },
};

export const Localized: Story = {
  render: () => (
    <Calendar
      labels={dayLabel("EEEE d 'de' MMMM 'de' yyyy", es)}
      mode="single"
      locale={es}
      today={today}
      defaultMonth={june}
      selected={today}
      className="rounded-lg border"
    />
  ),
  play: async ({ canvas, canvasElement }) => {
    await expect(canvas.getByText(/junio 2025/i)).toBeVisible();
    // Spanish weeks start on Monday ("lu").
    await expect(canvasElement.querySelector(".rdp-weekday")).toHaveTextContent(/^lu/i);
  },
};

function DatePickerExample({ onSelect }: { onSelect: (date: Date | undefined) => void }) {
  const [open, setOpen] = useState(false);
  const [date, setDate] = useState<Date | undefined>();
  return (
    <div className="grid gap-2">
      <Label htmlFor="date-picker">Date of the event</Label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            id="date-picker"
            variant="outline"
            className="w-60 justify-start font-normal data-[empty=true]:text-muted-foreground"
            data-empty={!date}
          >
            <CalendarIcon data-icon="inline-start" />
            {date ? format(date, "PPP") : "Pick a date"}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            labels={labels}
            mode="single"
            today={today}
            defaultMonth={date ?? june}
            selected={date}
            onSelect={(value) => {
              setDate(value);
              setOpen(false);
              onSelect(value);
            }}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}

/** Picking a day closes the popover and the trigger shows the date formatted with `date-fns`. */
export const DatePicker: Story = {
  render: ({ onSelect }) => <DatePickerExample onSelect={onSelect} />,
  play: async ({ args, canvas }) => {
    const trigger = canvas.getByRole("button", { name: "Date of the event" });
    await expect(trigger).toHaveTextContent("Pick a date");
    await userEvent.click(trigger);
    const popover = within(await within(document.body).findByRole("dialog"));
    await userEvent.click(popover.getByRole("button", { name: /\b20 June 2025/ }));
    await expect(args.onSelect).toHaveBeenCalledTimes(1);
    await waitFor(() => expect(within(document.body).queryByRole("dialog")).toBeNull());
    await expect(trigger).toHaveTextContent("June 20th, 2025");
  },
};
