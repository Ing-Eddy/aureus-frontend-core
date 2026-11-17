import {
  SliderField,
  type SliderFieldProps,
  type SliderMark,
} from "@aureus-core/ui/components/slider-field";
import {
  centre,
  dragThumb,
  euros,
  priceMarks,
  quarterMarks,
  trackPoint,
} from "@fixtures/slider-field";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { type ComponentType, useState } from "react";
import { expect, fn, userEvent, waitFor } from "storybook/test";
import { infoTexts, loadingTexts } from "../story-args";
import { docs } from "./slider-field-docs";

/** Flat, story-only args; the render builds the range, input and format props from them. */
interface PlaygroundArgs {
  label: string;
  helperText: string;
  info: string;
  infoLabel: string;
  errorMessage: string;
  min: number;
  max: number;
  step: number;
  range: boolean;
  lowThumbLabel: string;
  highThumbLabel: string;
  minDistance: number;
  format: "number" | "percent" | "currency";
  locale: string;
  showValue: "none" | "header" | "tooltip";
  marks: boolean;
  snapToMarks: boolean;
  withInput: boolean;
  inputLabel: string;
  lowInputLabel: string;
  highInputLabel: string;
  orientation: "horizontal" | "vertical";
  required: boolean;
  loading: boolean;
  loadingLabel: string;
  disabled: boolean;
  error: boolean;
  onValueChange: (value: number | [number, number]) => void;
  onValueCommit: (value: number | [number, number]) => void;
}

const text = (value: string) => (value === "" ? undefined : value);

const formats: Record<PlaygroundArgs["format"], Intl.NumberFormatOptions | undefined> = {
  number: undefined,
  percent: { style: "percent", maximumFractionDigits: 0 },
  currency: euros,
};

/** Marks every quarter of the playground's range. */
function playgroundMarks(min: number, max: number): SliderMark[] {
  return [0, 0.25, 0.5, 0.75, 1].map((part, index) => {
    const value = min + (max - min) * part;
    return index % 2 === 0 ? { value, label: String(value) } : { value };
  });
}

/** The value of a thumb. */
const thumbValue = (thumb: HTMLElement) => Number(thumb.getAttribute("aria-valuenow"));

/** Moves a 0–100 thumb (step 1) to `value` with the keyboard: Home, PageUp by tens, ArrowUp. */
async function moveTo(thumb: HTMLElement, value: number) {
  thumb.focus();
  await userEvent.keyboard("{Home}");
  const keys = "{PageUp}".repeat(Math.floor(value / 10)) + "{ArrowUp}".repeat(value % 10);
  if (keys) await userEvent.keyboard(keys);
  await waitFor(() => expect(thumbValue(thumb)).toBe(value));
}

/** Within one CSS pixel. */
const near = (a: number, b: number) => expect(Math.abs(a - b)).toBeLessThanOrEqual(1);

const content = { table: { category: "Content" } };
const behavior = { table: { category: "Behavior" } };
const layout = { table: { category: "Layout" } };
const state = { table: { category: "State" } };
const events = { table: { category: "Events" } };

const meta = {
  title: "components/Forms/Slider Field",
  component: SliderField as unknown as ComponentType<PlaygroundArgs>,
  parameters: { aureusDocs: docs },
  decorators: [
    (Story) => (
      <div className="w-full max-w-sm">
        <Story />
      </div>
    ),
  ],
  render: (args) => {
    const valueProps = args.range
      ? {
          range: true as const,
          thumbLabels: [args.lowThumbLabel, args.highThumbLabel] as [string, string],
          minDistance: args.minDistance,
          ...(args.withInput
            ? {
                withInput: true,
                inputLabels: [args.lowInputLabel, args.highInputLabel] as [string, string],
              }
            : {}),
        }
      : args.withInput
        ? { withInput: true, inputLabel: args.inputLabel }
        : {};
    const props = {
      label: text(args.label),
      helperText: text(args.helperText),
      ...infoTexts(args.info, args.infoLabel),
      errorMessage: text(args.errorMessage),
      min: args.min,
      max: args.max,
      step: args.step,
      ...valueProps,
      locale: text(args.locale),
      formatOptions: formats[args.format],
      showValue: args.showValue,
      marks: args.marks ? playgroundMarks(args.min, args.max) : undefined,
      snapToMarks: args.snapToMarks,
      orientation: args.orientation,
      required: args.required,
      ...loadingTexts(args.loading, args.loadingLabel),
      disabled: args.disabled,
      error: args.error,
      onValueChange: args.onValueChange,
      onValueCommit: args.onValueCommit,
    } as SliderFieldProps;
    // Remount when switching between single and range: the value changes shape.
    return <SliderField key={String(args.range)} {...props} />;
  },
  args: {
    label: "Volume",
    helperText: "",
    info: "",
    infoLabel: "More information",
    errorMessage: "",
    min: 0,
    max: 100,
    step: 1,
    range: false,
    lowThumbLabel: "Minimum",
    highThumbLabel: "Maximum",
    minDistance: 0,
    format: "number",
    locale: "",
    showValue: "header",
    marks: false,
    snapToMarks: false,
    withInput: false,
    inputLabel: "Exact value",
    lowInputLabel: "From",
    highInputLabel: "To",
    orientation: "horizontal",
    required: false,
    loading: false,
    loadingLabel: "Loading",
    disabled: false,
    error: false,
    onValueChange: fn(),
    onValueCommit: fn(),
  },
  argTypes: {
    label: { control: "text", ...content },
    helperText: { control: "text", ...content },
    info: { control: "text", ...content },
    infoLabel: { control: "text", ...content },
    errorMessage: { control: "text", ...content },
    lowThumbLabel: { control: "text", name: "thumbLabels[0]", ...content },
    highThumbLabel: { control: "text", name: "thumbLabels[1]", ...content },
    inputLabel: { control: "text", ...content },
    lowInputLabel: { control: "text", name: "inputLabels[0]", ...content },
    highInputLabel: { control: "text", name: "inputLabels[1]", ...content },
    loadingLabel: { control: "text", ...content },
    min: { control: "number", ...behavior },
    max: { control: "number", ...behavior },
    step: { control: "number", ...behavior },
    range: { control: "boolean", ...behavior },
    minDistance: { control: "number", ...behavior },
    format: {
      control: "inline-radio",
      options: ["number", "percent", "currency"],
      name: "formatOptions",
      ...behavior,
    },
    locale: { control: "text", ...behavior },
    marks: { control: "boolean", ...behavior },
    snapToMarks: { control: "boolean", ...behavior },
    withInput: { control: "boolean", ...behavior },
    showValue: { control: "inline-radio", options: ["none", "header", "tooltip"], ...layout },
    orientation: { control: "inline-radio", options: ["horizontal", "vertical"], ...layout },
    required: { control: "boolean", ...state },
    loading: { control: "boolean", ...state },
    disabled: { control: "boolean", ...state },
    error: { control: "boolean", ...state },
    onValueChange: events,
    onValueCommit: events,
  },
} satisfies Meta<PlaygroundArgs>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Every option has a control; the range and input texts are used once their feature is on. */
export const Playground: Story = {
  play: async ({ args, canvas }) => {
    const thumb = canvas.getByRole("slider", { name: "Volume" });
    thumb.focus();
    await userEvent.keyboard("{ArrowRight}");
    await expect(args.onValueChange).toHaveBeenLastCalledWith(1);
    await expect(args.onValueCommit).toHaveBeenLastCalledWith(1);
  },
};

export const Basic: Story = {
  render: () => <SliderField label="Volume" defaultValue={30} />,
  play: async ({ canvas }) => {
    const thumb = canvas.getByRole("slider", { name: "Volume" });
    await expect(thumb).toHaveAttribute("aria-valuetext", "30");
    // Clicking the track moves the nearest thumb there.
    const slider = thumb.closest("[data-slot=slider]") as HTMLElement;
    const point = trackPoint(slider, 75);
    await dragThumb(thumb, [point]);
    await waitFor(() => expect(thumbValue(thumb)).toBe(75));
  },
};

/** Two thumbs. Dragged past the other one, a thumb becomes the other end of the range. */
export const Range: Story = {
  render: function Render() {
    const [committed, setCommitted] = useState<[number, number] | null>(null);
    return (
      <div className="flex flex-col gap-8">
        <SliderField
          label="Price"
          range
          thumbLabels={["Minimum price", "Maximum price"]}
          defaultValue={[20, 80]}
          onValueCommit={setCommitted}
        />
        <SliderField
          label="Spread"
          range
          thumbLabels={["Lower bound", "Upper bound"]}
          defaultValue={[20, 80]}
          minDistance={10}
        />
        <output data-testid="committed">{committed ? committed.join("–") : ""}</output>
      </div>
    );
  },
  play: async ({ canvas }) => {
    const low = canvas.getByRole("slider", { name: "Minimum price" });
    const slider = low.closest("[data-slot=slider]") as HTMLElement;
    await dragThumb(low, [trackPoint(slider, 50), trackPoint(slider, 90)]);
    await waitFor(() => expect(canvas.getByTestId("committed")).toHaveTextContent("80–90"));
    await expect(thumbValue(canvas.getByRole("slider", { name: "Minimum price" }))).toBe(80);
    await expect(thumbValue(canvas.getByRole("slider", { name: "Maximum price" }))).toBe(90);

    // With minDistance the dragged thumb stops at that distance from the other one.
    const lower = canvas.getByRole("slider", { name: "Lower bound" });
    const spread = lower.closest("[data-slot=slider]") as HTMLElement;
    await dragThumb(lower, [trackPoint(spread, 95)]);
    await waitFor(() => expect(thumbValue(lower)).toBe(70));
    await expect(thumbValue(canvas.getByRole("slider", { name: "Upper bound" }))).toBe(80);
  },
};

/** The value in the label row, or over the thumb while it is hovered, focused or dragged. */
export const ShowValue: Story = {
  render: () => (
    <div className="flex flex-col gap-10">
      <SliderField label="Volume" defaultValue={40} showValue="header" />
      <SliderField label="Brightness" defaultValue={70} showValue="tooltip" />
    </div>
  ),
  play: async ({ canvas, canvasElement }) => {
    const header = canvasElement.querySelector("[data-slot=slider-value]") as HTMLElement;
    await expect(header).toHaveTextContent("40");
    await expect(header).toHaveAttribute("aria-hidden", "true");
    const volume = canvas.getByRole("slider", { name: "Volume" });
    volume.focus();
    await userEvent.keyboard("{ArrowRight}");
    await expect(header).toHaveTextContent("41");

    const brightness = canvas.getByRole("slider", { name: "Brightness" });
    const tooltip = brightness.querySelector("[data-slot=slider-tooltip]") as HTMLElement;
    await expect(getComputedStyle(tooltip).opacity).toBe("0");
    await userEvent.tab();
    await expect(brightness).toHaveFocus();
    await waitFor(() => expect(getComputedStyle(tooltip).opacity).toBe("1"));
    // Above the thumb.
    await expect(tooltip.getBoundingClientRect().bottom).toBeLessThanOrEqual(
      brightness.getBoundingClientRect().top,
    );
  },
};

/** Currency, percent and units with `Intl.NumberFormat`; or your own `formatValue`. */
export const Formatting: Story = {
  render: () => (
    <div className="flex flex-col gap-8">
      <SliderField
        label="Budget"
        range
        thumbLabels={["Minimum budget", "Maximum budget"]}
        min={0}
        max={1000}
        step={10}
        defaultValue={[200, 800]}
        locale="es-ES"
        formatOptions={euros}
        showValue="header"
      />
      <SliderField
        label="Opacity"
        max={1}
        step={0.01}
        defaultValue={0.4}
        locale="en-US"
        formatOptions={{ style: "percent" }}
        showValue="header"
      />
      <SliderField
        label="Weight"
        max={50}
        defaultValue={12}
        locale="en-US"
        formatOptions={{ style: "unit", unit: "kilogram" }}
        showValue="header"
      />
      <SliderField
        label="Rating"
        max={5}
        defaultValue={4}
        formatValue={(value) => `${value} of 5`}
        showValue="header"
      />
    </div>
  ),
  play: async ({ canvas }) => {
    const budget = new Intl.NumberFormat("es-ES", euros);
    await expect(canvas.getByRole("slider", { name: "Minimum budget" })).toHaveAttribute(
      "aria-valuetext",
      budget.format(200),
    );
    const header = canvas
      .getByRole("slider", { name: "Minimum budget" })
      .closest("[data-slot=field]")
      ?.querySelector("[data-slot=slider-value]");
    // Compared as is: the formatted text has non-breaking spaces.
    await expect(header?.textContent).toBe(budget.formatRange(200, 800));
    await expect(canvas.getByRole("slider", { name: "Opacity" })).toHaveAttribute(
      "aria-valuetext",
      "40%",
    );
    await expect(canvas.getByRole("slider", { name: "Weight" })).toHaveAttribute(
      "aria-valuetext",
      "12 kg",
    );
    await expect(canvas.getByRole("slider", { name: "Rating" })).toHaveAttribute(
      "aria-valuetext",
      "4 of 5",
    );
  },
};

/**
 * Marks on the track with optional labels. Each mark lines up with the thumb's centre at its value,
 * in horizontal, vertical and right-to-left sliders.
 */
export const Marks: Story = {
  render: () => (
    <div className="flex flex-col gap-8">
      <SliderField label="Level" marks={quarterMarks} defaultValue={25} />
      <div dir="rtl">
        <SliderField label="Level (RTL)" marks={quarterMarks} defaultValue={25} />
      </div>
      <SliderField
        label="Level (vertical)"
        orientation="vertical"
        marks={quarterMarks}
        defaultValue={25}
      />
    </div>
  ),
  play: async ({ canvasElement, canvas }) => {
    for (const name of ["Level", "Level (RTL)", "Level (vertical)"]) {
      const thumb = canvas.getByRole("slider", { name });
      const field = thumb.closest("[data-slot=field]") as HTMLElement;
      const vertical = name.includes("vertical");
      for (const value of [0, 25, 50, 75, 100]) {
        await moveTo(thumb, value);
        const tick = field.querySelector(`[data-slot=slider-mark][data-value="${value}"]`);
        const mark = centre(tick as Element);
        const knob = centre(thumb);
        near(vertical ? mark.y : mark.x, vertical ? knob.y : knob.x);
        near(vertical ? mark.x : mark.y, vertical ? knob.x : knob.y);
      }
    }
    // The labels at the ends stay inside the field.
    for (const label of canvasElement.querySelectorAll("[data-slot=slider-mark-label]")) {
      const field = label.closest("[data-slot=field]") as HTMLElement;
      await expect(label.getBoundingClientRect().left).toBeGreaterThanOrEqual(
        field.getBoundingClientRect().left - 1,
      );
      await expect(label.getBoundingClientRect().right).toBeLessThanOrEqual(
        field.getBoundingClientRect().right + 1,
      );
    }
  },
};

/** Only the marks can be chosen: dragging lands on the nearest one and the arrows move by marks. */
export const SnapToMarks: Story = {
  render: () => (
    <SliderField
      label="Price"
      range
      thumbLabels={["Minimum price", "Maximum price"]}
      min={0}
      max={1000}
      defaultValue={[250, 750]}
      marks={priceMarks}
      snapToMarks
      locale="es-ES"
      formatOptions={euros}
      showValue="header"
    />
  ),
  play: async ({ canvas }) => {
    const low = canvas.getByRole("slider", { name: "Minimum price" });
    low.focus();
    await userEvent.keyboard("{ArrowRight}");
    await expect(thumbValue(low)).toBe(500);
    await userEvent.keyboard("{ArrowRight}");
    // The low thumb cannot pass the high one.
    await expect(thumbValue(low)).toBe(750);
    await userEvent.keyboard("{Home}");
    await expect(thumbValue(low)).toBe(0);
    const high = canvas.getByRole("slider", { name: "Maximum price" });
    const slider = high.closest("[data-slot=slider]") as HTMLElement;
    await dragThumb(high, [trackPoint(slider, 60)]);
    await waitFor(() => expect(thumbValue(high)).toBe(500));
  },
};

/** Inputs to type an exact value; the slider moves when Enter is pressed or the input is left. */
export const WithInput: Story = {
  render: () => (
    <div className="flex flex-col gap-8">
      <SliderField label="Volume" step={5} defaultValue={40} withInput inputLabel="Exact volume" />
      <SliderField
        label="Price"
        range
        thumbLabels={["Minimum price", "Maximum price"]}
        max={1000}
        step={10}
        defaultValue={[200, 800]}
        withInput
        inputLabels={["From", "To"]}
      />
    </div>
  ),
  play: async ({ canvas }) => {
    const volume = canvas.getByRole("spinbutton", { name: "Exact volume" });
    await userEvent.clear(volume);
    await userEvent.type(volume, "47");
    await expect(thumbValue(canvas.getByRole("slider", { name: "Volume" }))).toBe(40);
    await userEvent.keyboard("{Enter}");
    await expect(thumbValue(canvas.getByRole("slider", { name: "Volume" }))).toBe(45);
    await expect(volume).toHaveValue("45");

    const to = canvas.getByRole("spinbutton", { name: "To" });
    await userEvent.clear(to);
    await userEvent.type(to, "100");
    await userEvent.tab();
    // It stops at the other thumb.
    await expect(thumbValue(canvas.getByRole("slider", { name: "Maximum price" }))).toBe(200);
    await expect(to).toHaveValue("200");
  },
};

/** Vertical sliders, low values at the bottom; Up increases. */
export const Vertical: Story = {
  render: () => (
    <div className="flex gap-10">
      <SliderField label="Bass" orientation="vertical" defaultValue={0} showValue="tooltip" />
      <SliderField
        label="Band"
        orientation="vertical"
        height="10rem"
        range
        thumbLabels={["Low cut", "High cut"]}
        defaultValue={[20, 80]}
        withInput
        inputLabels={["Low", "High"]}
      />
    </div>
  ),
  play: async ({ canvas }) => {
    const bass = canvas.getByRole("slider", { name: "Bass" });
    await expect(bass).toHaveAttribute("aria-orientation", "vertical");
    const slider = bass.closest("[data-slot=slider]") as HTMLElement;
    // At 0 the thumb sits at the bottom of the track.
    near(bass.getBoundingClientRect().bottom, slider.getBoundingClientRect().bottom);
    bass.focus();
    await userEvent.keyboard("{ArrowUp}");
    await expect(thumbValue(bass)).toBe(1);
    const band = canvas.getByRole("slider", { name: "Low cut" }).closest("[data-slot=slider]");
    await expect((band as HTMLElement).getBoundingClientRect().height).toBeCloseTo(160, 0);
  },
};

/** Every key: steps, large steps, limits, and marks. */
export const Keyboard: Story = {
  render: () => (
    <div className="flex flex-col gap-8">
      <SliderField label="Steps" defaultValue={50} step={5} largeStep={20} />
      <SliderField
        label="Range"
        range
        thumbLabels={["Start", "End"]}
        defaultValue={[30, 40]}
        minDistance={5}
      />
      <SliderField
        label="Vertical"
        orientation="vertical"
        height="6rem"
        marks={quarterMarks}
        snapToMarks
        defaultValue={50}
      />
    </div>
  ),
  play: async ({ canvas }) => {
    const steps = canvas.getByRole("slider", { name: "Steps" });
    await userEvent.tab();
    await expect(steps).toHaveFocus();
    const expectations: [string, number][] = [
      ["{ArrowRight}", 55],
      ["{ArrowUp}", 60],
      ["{ArrowLeft}", 55],
      ["{ArrowDown}", 50],
      ["{PageUp}", 70],
      ["{PageDown}", 50],
      ["{Shift>}{ArrowRight}{/Shift}", 70],
      ["{End}", 100],
      ["{Home}", 0],
    ];
    for (const [keys, value] of expectations) {
      await userEvent.keyboard(keys);
      await expect(thumbValue(steps)).toBe(value);
    }

    await userEvent.tab();
    const start = canvas.getByRole("slider", { name: "Start" });
    await expect(start).toHaveFocus();
    await userEvent.keyboard("{End}");
    await expect(thumbValue(start)).toBe(35);
    await userEvent.tab();
    await userEvent.keyboard("{Home}");
    await expect(thumbValue(canvas.getByRole("slider", { name: "End" }))).toBe(40);

    await userEvent.tab();
    const vertical = canvas.getByRole("slider", { name: "Vertical" });
    await expect(vertical).toHaveFocus();
    await userEvent.keyboard("{ArrowUp}");
    await expect(thumbValue(vertical)).toBe(75);
    await userEvent.keyboard("{PageDown}");
    await expect(thumbValue(vertical)).toBe(25);
    await userEvent.keyboard("{End}");
    await expect(thumbValue(vertical)).toBe(100);
  },
};

export const States: Story = {
  render: () => (
    <div className="flex flex-col gap-8">
      <SliderField
        label="Volume"
        required
        info="Applies to every device."
        infoLabel="More information"
        helperText="Up to 80 is safe for headphones."
        defaultValue={40}
      />
      <SliderField label="Gain" error errorMessage="Too high." defaultValue={95} />
      <SliderField
        label="Balance (loading)"
        loading
        loadingLabel="Loading"
        defaultValue={50}
        withInput
        inputLabel="Exact balance"
      />
      <SliderField label="Treble (disabled)" disabled defaultValue={30} />
    </div>
  ),
  play: async ({ canvas }) => {
    await expect(canvas.getByRole("slider", { name: "Volume" })).toHaveAttribute(
      "aria-required",
      "true",
    );
    await expect(canvas.getByRole("alert")).toHaveTextContent("Too high.");
    await expect(canvas.getByRole("slider", { name: "Gain" })).toHaveAttribute(
      "aria-invalid",
      "true",
    );
    await expect(canvas.getByRole("slider", { name: "Balance (loading)" })).toHaveAttribute(
      "aria-busy",
      "true",
    );
    await expect(canvas.getByRole("spinbutton", { name: "Exact balance" })).toBeDisabled();
    await expect(canvas.getByRole("slider", { name: "Treble (disabled)" })).not.toHaveAttribute(
      "tabindex",
    );
  },
};

/** Right to left: the track runs from right to left and ArrowLeft increases; digits stay LTR. */
export const Rtl: Story = {
  render: () => (
    <div dir="rtl">
      <SliderField label="Volume" defaultValue={0} withInput inputLabel="Exact volume" />
    </div>
  ),
  play: async ({ canvas }) => {
    const thumb = canvas.getByRole("slider", { name: "Volume" });
    const slider = thumb.closest("[data-slot=slider]") as HTMLElement;
    await waitFor(() => expect(slider).toHaveAttribute("dir", "rtl"));
    // At 0 the thumb is at the right end of the track.
    near(thumb.getBoundingClientRect().right, slider.getBoundingClientRect().right);
    thumb.focus();
    await userEvent.keyboard("{ArrowLeft}");
    await expect(thumbValue(thumb)).toBe(1);
    await expect(canvas.getByRole("spinbutton", { name: "Exact volume" })).toHaveAttribute(
      "dir",
      "ltr",
    );
  },
};

/** A narrow container: the inputs wrap below the track, which keeps the full width. */
export const Responsive: Story = {
  decorators: [
    (Story) => (
      <div className="w-64 border border-dashed p-2">
        <Story />
      </div>
    ),
  ],
  render: () => (
    <div className="flex flex-col gap-8">
      <SliderField
        label="Price"
        range
        thumbLabels={["Minimum price", "Maximum price"]}
        max={1000}
        defaultValue={[200, 800]}
        marks={priceMarks}
        withInput
        inputLabels={["From", "To"]}
        showValue="header"
        locale="es-ES"
        formatOptions={euros}
      />
      <SliderField label="Volume" defaultValue={40} />
    </div>
  ),
  play: async ({ canvas, canvasElement }) => {
    for (const field of canvasElement.querySelectorAll<HTMLElement>("[data-slot=field]")) {
      await expect(field.scrollWidth).toBeLessThanOrEqual(field.clientWidth);
    }
    // The range's inputs wrap below its track, which keeps the full width.
    const range = canvas.getByRole("slider", { name: "Minimum price" });
    const track = range.closest("[data-slot=slider]") as HTMLElement;
    const field = range.closest("[data-slot=field]") as HTMLElement;
    await expect(track.getBoundingClientRect().width).toBeGreaterThan(
      field.getBoundingClientRect().width * 0.9,
    );
    const from = canvas.getByRole("spinbutton", { name: "From" });
    await expect(from.getBoundingClientRect().top).toBeGreaterThan(
      track.getBoundingClientRect().bottom,
    );
    // Each thumb's hit area (the ring drawn by ::after) is at least 24 px; 44 px on touch screens.
    const thumb = canvas.getByRole("slider", { name: "Volume" });
    const ring = getComputedStyle(thumb, "::after");
    const width = thumb.getBoundingClientRect().width - 2 * Number.parseFloat(ring.left);
    await expect(width).toBeGreaterThanOrEqual(24);
    await expect(thumb.className).toContain("pointer-coarse:after:-inset-3");
  },
};
