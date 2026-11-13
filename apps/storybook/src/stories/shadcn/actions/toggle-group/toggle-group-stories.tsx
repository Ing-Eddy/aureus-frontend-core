import { ToggleGroup, ToggleGroupItem } from "@aureus-core/ui/shadcn/toggle-group";
import { pressKey } from "@sb/testing/press-key";
import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  AlignCenterIcon,
  AlignLeftIcon,
  AlignRightIcon,
  BoldIcon,
  ItalicIcon,
  UnderlineIcon,
} from "lucide-react";
import { expect, fn, userEvent } from "storybook/test";
import { docs } from "./toggle-group-docs";

interface GroupArgs {
  variant: "default" | "outline";
  size: "default" | "sm" | "lg";
  spacing: number;
  orientation: "horizontal" | "vertical";
  disabled: boolean;
  onValueChange: (value: string | string[]) => void;
}

const alignments = [
  { value: "left", label: "Align left", Icon: AlignLeftIcon },
  { value: "center", label: "Align center", Icon: AlignCenterIcon },
  { value: "right", label: "Align right", Icon: AlignRightIcon },
] as const;

const meta = {
  title: "shadcn/Actions/Toggle Group",
  parameters: { aureusDocs: docs },
  args: {
    variant: "default",
    size: "default",
    spacing: 2,
    orientation: "horizontal",
    disabled: false,
    onValueChange: fn(),
  },
  argTypes: {
    variant: {
      control: "inline-radio",
      options: ["default", "outline"],
      table: { category: "Appearance" },
    },
    size: {
      control: "inline-radio",
      options: ["sm", "default", "lg"],
      table: { category: "Appearance" },
    },
    spacing: { control: { type: "number", min: 0, max: 4 }, table: { category: "Appearance" } },
    orientation: {
      control: "inline-radio",
      options: ["horizontal", "vertical"],
      table: { category: "Behavior" },
    },
    disabled: { control: "boolean", table: { category: "State" } },
    onValueChange: { table: { category: "Events" } },
  },
  render: ({ onValueChange, ...args }) => (
    <ToggleGroup
      {...args}
      type="single"
      defaultValue="left"
      aria-label="Text alignment"
      onValueChange={onValueChange}
    >
      {alignments.map(({ value, label, Icon }) => (
        <ToggleGroupItem key={value} value={value} aria-label={label}>
          <Icon />
        </ToggleGroupItem>
      ))}
    </ToggleGroup>
  ),
} satisfies Meta<GroupArgs>;

export default meta;
type Story = StoryObj<typeof meta>;

/** One tab stop; arrows move focus; Space selects and `onValueChange` receives the value. */
export const Playground: Story = {
  play: async ({ args, canvas }) => {
    await userEvent.tab();
    await expect(canvas.getByRole("radio", { name: "Align left" })).toHaveFocus();
    await pressKey("ArrowRight");
    await expect(canvas.getByRole("radio", { name: "Align center" })).toHaveFocus();
    await userEvent.keyboard(" ");
    await expect(canvas.getByRole("radio", { name: "Align center" })).toHaveAttribute(
      "aria-checked",
      "true",
    );
    await expect(args.onValueChange).toHaveBeenLastCalledWith("center");
    await pressKey("End");
    await expect(canvas.getByRole("radio", { name: "Align right" })).toHaveFocus();
    await userEvent.tab();
    await expect(document.activeElement).toBe(document.body);
  },
};

/** In multiple mode each item is a pressed button and the value is an array. */
export const Multiple: Story = {
  render: ({ onValueChange }) => (
    <ToggleGroup
      type="multiple"
      variant="outline"
      aria-label="Text formatting"
      onValueChange={onValueChange}
    >
      <ToggleGroupItem value="bold" aria-label="Bold">
        <BoldIcon />
      </ToggleGroupItem>
      <ToggleGroupItem value="italic" aria-label="Italic">
        <ItalicIcon />
      </ToggleGroupItem>
      <ToggleGroupItem value="underline" aria-label="Underline">
        <UnderlineIcon />
      </ToggleGroupItem>
    </ToggleGroup>
  ),
  play: async ({ args, canvas }) => {
    await userEvent.click(canvas.getByRole("button", { name: "Bold" }));
    await userEvent.click(canvas.getByRole("button", { name: "Underline" }));
    await expect(args.onValueChange).toHaveBeenLastCalledWith(["bold", "underline"]);
    await expect(canvas.getByRole("button", { name: "Bold" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
  },
};

export const Outline: Story = {
  render: () => (
    <ToggleGroup type="single" variant="outline" defaultValue="week" aria-label="Period">
      {["Day", "Week", "Month"].map((period) => (
        <ToggleGroupItem key={period} value={period.toLowerCase()}>
          {period}
        </ToggleGroupItem>
      ))}
    </ToggleGroup>
  ),
};

export const Joined: Story = {
  args: { variant: "outline", spacing: 0 },
};

export const Vertical: Story = {
  args: { orientation: "vertical" },
  play: async ({ canvas }) => {
    await userEvent.tab();
    await pressKey("ArrowDown");
    await expect(canvas.getByRole("radio", { name: "Align center" })).toHaveFocus();
  },
};

/** The disabled item is skipped by the arrow keys. */
export const DisabledItem: Story = {
  render: () => (
    <ToggleGroup type="single" defaultValue="left" aria-label="Text alignment">
      {alignments.map(({ value, label, Icon }) => (
        <ToggleGroupItem key={value} value={value} aria-label={label} disabled={value === "center"}>
          <Icon />
        </ToggleGroupItem>
      ))}
    </ToggleGroup>
  ),
  play: async ({ canvas }) => {
    await userEvent.tab();
    await pressKey("ArrowRight");
    await expect(canvas.getByRole("radio", { name: "Align right" })).toHaveFocus();
  },
};
