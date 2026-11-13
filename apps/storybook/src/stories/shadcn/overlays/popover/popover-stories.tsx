import { Button } from "@aureus-core/ui/shadcn/button";
import { Field, FieldGroup, FieldLabel } from "@aureus-core/ui/shadcn/field";
import { Input } from "@aureus-core/ui/shadcn/input";
import {
  Popover,
  PopoverAnchor,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from "@aureus-core/ui/shadcn/popover";
import { expectClosed, screen } from "@sb/testing/overlay";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { InfoIcon } from "lucide-react";
import { expect, fn, userEvent } from "storybook/test";
import { docs } from "./popover-docs";

type Side = "top" | "right" | "bottom" | "left";

interface PopoverArgs {
  side: Side;
  align: "start" | "center" | "end";
  sideOffset: number;
  modal: boolean;
  onOpenChange: (open: boolean) => void;
}

const meta = {
  title: "shadcn/Overlays/Popover",
  parameters: { aureusDocs: docs },
  args: { side: "bottom", align: "center", sideOffset: 4, modal: false, onOpenChange: fn() },
  argTypes: {
    side: {
      control: "inline-radio",
      options: ["top", "right", "bottom", "left"],
      table: { category: "Appearance" },
    },
    align: {
      control: "inline-radio",
      options: ["start", "center", "end"],
      table: { category: "Appearance" },
    },
    sideOffset: { control: { type: "number", min: 0, max: 32 }, table: { category: "Appearance" } },
    modal: { control: "boolean", table: { category: "Behavior" } },
    onOpenChange: { table: { category: "Events" } },
  },
  render: ({ modal, onOpenChange, ...position }) => (
    <Popover modal={modal} onOpenChange={onOpenChange}>
      <PopoverTrigger asChild>
        <Button variant="outline">
          <InfoIcon data-icon="inline-start" />
          About billing
        </Button>
      </PopoverTrigger>
      <PopoverContent {...position} aria-labelledby="popover-title">
        <PopoverHeader>
          <PopoverTitle id="popover-title">Billing cycle</PopoverTitle>
          <PopoverDescription>
            You are billed on the 1st of each month. Changes apply from the next cycle.
          </PopoverDescription>
        </PopoverHeader>
      </PopoverContent>
    </Popover>
  ),
} satisfies Meta<PopoverArgs>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Click opens and Esc closes, returning focus to the trigger; a second click toggles it closed. */
export const Playground: Story = {
  play: async ({ args, canvas }) => {
    const trigger = canvas.getByRole("button", { name: "About billing" });
    await userEvent.click(trigger);
    await screen().findByRole("dialog", { name: "Billing cycle" });
    await expect(trigger).toHaveAttribute("aria-expanded", "true");
    await expect(args.onOpenChange).toHaveBeenLastCalledWith(true);
    await userEvent.keyboard("{Escape}");
    await expectClosed();
    await expect(trigger).toHaveFocus();
    await userEvent.click(trigger);
    await screen().findByRole("dialog");
    await userEvent.click(trigger);
    await expectClosed();
  },
};

const sides: Side[] = ["top", "right", "bottom", "left"];

export const Placement: Story = {
  render: () => (
    <div className="grid grid-cols-2 gap-2 p-24">
      {sides.map((side) => (
        <Popover key={side}>
          <PopoverTrigger asChild>
            <Button variant="outline">{side}</Button>
          </PopoverTrigger>
          <PopoverContent
            side={side}
            align="start"
            sideOffset={12}
            className="w-48"
            aria-label={side}
          >
            side="{side}" align="start" sideOffset=12
          </PopoverContent>
        </Popover>
      ))}
    </div>
  ),
  play: async ({ canvas }) => {
    await userEvent.click(canvas.getByRole("button", { name: "right" }));
    const content = await screen().findByRole("dialog", { name: "right" });
    await expect(content).toHaveAttribute("data-align", "start");
    await userEvent.keyboard("{Escape}");
    await expectClosed();
  },
};

/** Focus moves to the first field on open; Tab moves between the fields. */
export const WithForm: Story = {
  render: () => (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline">Dimensions</Button>
      </PopoverTrigger>
      <PopoverContent className="w-80" aria-labelledby="popover-form-title">
        <PopoverHeader>
          <PopoverTitle id="popover-form-title">Dimensions</PopoverTitle>
          <PopoverDescription>Set the dimensions for the layer.</PopoverDescription>
        </PopoverHeader>
        <FieldGroup className="mt-4 gap-3">
          {[
            { id: "width", label: "Width", value: "100%" },
            { id: "max-width", label: "Max. width", value: "300px" },
            { id: "height", label: "Height", value: "25px" },
          ].map(({ id, label, value }) => (
            <Field key={id} orientation="horizontal">
              <FieldLabel htmlFor={`popover-${id}`} className="w-24">
                {label}
              </FieldLabel>
              <Input id={`popover-${id}`} defaultValue={value} className="h-8" />
            </Field>
          ))}
        </FieldGroup>
      </PopoverContent>
    </Popover>
  ),
  play: async ({ canvas }) => {
    await userEvent.click(canvas.getByRole("button", { name: "Dimensions" }));
    const width = await screen().findByLabelText("Width");
    await expect(width).toHaveFocus();
    await userEvent.tab();
    await expect(screen().getByLabelText("Max. width")).toHaveFocus();
    await userEvent.keyboard("{Escape}");
    await expectClosed();
  },
};

export const WithAnchor: Story = {
  render: () => (
    <Popover>
      <PopoverAnchor asChild>
        <div className="flex w-96 items-center justify-between rounded-lg border p-3">
          <span className="text-sm">API rate limit: 1,000 requests/min</span>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="icon-sm" aria-label="Rate limit details">
              <InfoIcon />
            </Button>
          </PopoverTrigger>
        </div>
      </PopoverAnchor>
      <PopoverContent align="start" className="w-96" aria-label="Rate limit details">
        Limits reset every minute. Contact support to raise them.
      </PopoverContent>
    </Popover>
  ),
};
