import { Label } from "@aureus-core/ui/shadcn/label";
import { Slider } from "@aureus-core/ui/shadcn/slider";
import { pressKey } from "@sb/testing/press-key";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { expect, fn, userEvent } from "storybook/test";
import { docs } from "./slider-docs";

/**
 * Radix names range thumbs ("Minimum"/"Maximum") but leaves a single thumb unnamed, and the shadcn
 * wrapper does not forward thumb props. A ref on the root names the thumb, as a consumer would.
 */
const nameThumb = (label: string) => (root: HTMLSpanElement | null) =>
  root?.querySelector('[role="slider"]')?.setAttribute("aria-label", label);

const meta = {
  title: "shadcn/Forms/Slider",
  component: Slider,
  parameters: { aureusDocs: docs },
  args: {
    defaultValue: [50],
    min: 0,
    max: 100,
    step: 1,
    orientation: "horizontal",
    inverted: false,
    disabled: false,
    onValueChange: fn(),
    onValueCommit: fn(),
  },
  argTypes: {
    min: { control: "number", table: { category: "Behavior" } },
    max: { control: "number", table: { category: "Behavior" } },
    step: { control: "number", table: { category: "Behavior" } },
    orientation: {
      control: "inline-radio",
      options: ["horizontal", "vertical"],
      table: { category: "Appearance" },
    },
    inverted: { control: "boolean", table: { category: "Appearance" } },
    disabled: { control: "boolean", table: { category: "State" } },
    onValueChange: { table: { category: "Events" } },
    onValueCommit: { table: { category: "Events" } },
  },
  render: (args) => (
    <div className="w-72">
      <Slider {...args} ref={nameThumb("Volume")} />
    </div>
  ),
} satisfies Meta<typeof Slider>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Arrow keys step the value, Home/End jump to the limits, and both callbacks receive arrays. */
export const Playground: Story = {
  play: async ({ args, canvas }) => {
    const thumb = canvas.getByRole("slider", { name: "Volume" });
    await userEvent.tab();
    await expect(thumb).toHaveFocus();
    await pressKey("ArrowRight", 2);
    await expect(thumb).toHaveAttribute("aria-valuenow", "52");
    await expect(args.onValueChange).toHaveBeenLastCalledWith([52]);
    await pressKey("Home");
    await expect(thumb).toHaveAttribute("aria-valuenow", "0");
    await pressKey("End");
    await expect(thumb).toHaveAttribute("aria-valuenow", "100");
    await expect(args.onValueCommit).toHaveBeenLastCalledWith([100]);
  },
};

function RangeExample() {
  const [range, setRange] = useState([20, 80]);
  return (
    <div className="grid w-72 gap-3">
      <div className="flex justify-between text-sm">
        <span id="slider-price-label" className="font-medium">
          Price
        </span>
        <span className="text-muted-foreground">
          ${range[0]} – ${range[1]}
        </span>
      </div>
      <Slider value={range} onValueChange={setRange} minStepsBetweenThumbs={5} />
    </div>
  );
}

export const Range: Story = {
  render: () => <RangeExample />,
  play: async ({ canvas }) => {
    const min = canvas.getByRole("slider", { name: "Minimum" });
    const max = canvas.getByRole("slider", { name: "Maximum" });
    await userEvent.tab();
    await pressKey("ArrowRight");
    await expect(min).toHaveAttribute("aria-valuenow", "21");
    await userEvent.tab();
    await expect(max).toHaveFocus();
    await pressKey("ArrowLeft");
    await expect(canvas.getByText("$21 – $79")).toBeVisible();
  },
};

export const Steps: Story = {
  args: { step: 10, defaultValue: [30] },
  render: (args) => (
    <div className="w-72">
      <Slider {...args} ref={nameThumb("Opacity")} />
    </div>
  ),
  play: async ({ canvas }) => {
    const thumb = canvas.getByRole("slider", { name: "Opacity" });
    await userEvent.tab();
    await pressKey("ArrowRight");
    await expect(thumb).toHaveAttribute("aria-valuenow", "40");
  },
};

export const Vertical: Story = {
  args: { orientation: "vertical", defaultValue: [40] },
  render: (args) => (
    <div className="flex h-48 items-center gap-6">
      <Slider {...args} ref={nameThumb("Bass")} />
      <Label>Bass</Label>
    </div>
  ),
  play: async ({ canvas }) => {
    const thumb = canvas.getByRole("slider", { name: "Bass" });
    await expect(thumb).toHaveAttribute("aria-orientation", "vertical");
    await userEvent.tab();
    await pressKey("ArrowUp");
    await expect(thumb).toHaveAttribute("aria-valuenow", "41");
  },
};

export const Disabled: Story = {
  args: { disabled: true },
  play: async ({ canvas }) => {
    const thumb = canvas.getByRole("slider", { name: "Volume" });
    await userEvent.tab();
    await expect(thumb).not.toHaveFocus();
    await expect(thumb).toHaveAttribute("data-disabled");
  },
};
