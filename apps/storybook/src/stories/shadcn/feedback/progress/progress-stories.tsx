import { Button } from "@aureus-core/ui/shadcn/button";
import { Progress } from "@aureus-core/ui/shadcn/progress";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { expect, userEvent } from "storybook/test";
import { docs } from "./progress-docs";

interface ProgressArgs {
  value: number;
  label: string;
}

const meta = {
  title: "shadcn/Feedback/Progress",
  parameters: { aureusDocs: docs },
  args: { value: 60, label: "Upload progress" },
  argTypes: {
    value: { control: { type: "range", min: 0, max: 100 }, table: { category: "State" } },
    label: { control: "text", table: { category: "Content" } },
  },
  render: ({ value, label }) => (
    // The wrapper does not forward `value` to Radix: `aria-valuenow` exposes it (see docs).
    <Progress value={value} aria-valuenow={value} aria-label={label} className="w-72" />
  ),
} satisfies Meta<ProgressArgs>;

export default meta;
type Story = StoryObj<typeof meta>;

/** The bar is a named progressbar whose `aria-valuenow` matches the value. */
export const Playground: Story = {
  play: async ({ canvas }) => {
    const bar = canvas.getByRole("progressbar", { name: "Upload progress" });
    await expect(bar).toHaveAttribute("aria-valuenow", "60");
    await expect(bar).toHaveAttribute("aria-valuemax", "100");
  },
};

function ControlledExample() {
  const [value, setValue] = useState(20);
  return (
    <div className="grid w-72 gap-3">
      <Progress value={value} aria-valuenow={value} aria-label="Import progress" />
      <div className="flex gap-2">
        <Button size="sm" variant="outline" onClick={() => setValue((v) => Math.max(0, v - 20))}>
          −20
        </Button>
        <Button size="sm" variant="outline" onClick={() => setValue((v) => Math.min(100, v + 20))}>
          +20
        </Button>
      </div>
    </div>
  );
}

export const Controlled: Story = {
  render: () => <ControlledExample />,
  play: async ({ canvas }) => {
    await userEvent.click(canvas.getByRole("button", { name: "+20" }));
    await expect(canvas.getByRole("progressbar", { name: "Import progress" })).toHaveAttribute(
      "aria-valuenow",
      "40",
    );
  },
};

export const Labelled: Story = {
  render: () => (
    <div className="grid w-72 gap-2">
      <div className="flex justify-between text-sm">
        <span id="progress-profile">Profile completion</span>
        <span className="text-muted-foreground tabular-nums">75%</span>
      </div>
      <Progress
        value={75}
        aria-valuenow={75}
        aria-valuetext="75% complete"
        aria-labelledby="progress-profile"
      />
    </div>
  ),
  play: async ({ canvas }) => {
    await expect(canvas.getByRole("progressbar", { name: "Profile completion" })).toHaveAttribute(
      "aria-valuetext",
      "75% complete",
    );
  },
};

export const Indeterminate: Story = {
  render: () => <Progress aria-label="Preparing export" className="w-72" />,
  play: async ({ canvas }) => {
    const bar = canvas.getByRole("progressbar", { name: "Preparing export" });
    await expect(bar).not.toHaveAttribute("aria-valuenow");
    await expect(bar).toHaveAttribute("data-state", "indeterminate");
  },
};
