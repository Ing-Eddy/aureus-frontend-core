import { Button } from "@aureus-core/ui/shadcn/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@aureus-core/ui/shadcn/drawer";
import { Field, FieldLabel } from "@aureus-core/ui/shadcn/field";
import { Input } from "@aureus-core/ui/shadcn/input";
import { expectClosed, expectFocusTrapped, screen } from "@sb/testing/overlay";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { expect, fn, userEvent } from "storybook/test";
import { docs } from "./drawer-docs";

type Direction = "top" | "right" | "bottom" | "left";

interface DrawerArgs {
  direction: Direction;
  dismissible: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: () => void;
}

function GoalDrawer({ direction, dismissible, onOpenChange, onSubmit }: DrawerArgs) {
  const [goal, setGoal] = useState(350);
  return (
    <Drawer direction={direction} dismissible={dismissible} onOpenChange={onOpenChange}>
      <DrawerTrigger asChild>
        <Button variant="outline">Set goal</Button>
      </DrawerTrigger>
      <DrawerContent>
        <div className="mx-auto w-full max-w-sm">
          <DrawerHeader>
            <DrawerTitle>Move goal</DrawerTitle>
            <DrawerDescription>Set your daily activity goal.</DrawerDescription>
          </DrawerHeader>
          <div className="flex items-center justify-center gap-4 p-4">
            <Button
              variant="outline"
              size="icon"
              aria-label="Decrease goal"
              onClick={() => setGoal((value) => value - 10)}
            >
              −
            </Button>
            <output className="text-4xl font-bold tabular-nums" aria-live="polite">
              {goal}
              <span className="sr-only"> calories per day</span>
            </output>
            <Button
              variant="outline"
              size="icon"
              aria-label="Increase goal"
              onClick={() => setGoal((value) => value + 10)}
            >
              +
            </Button>
          </div>
          <DrawerFooter>
            <DrawerClose asChild>
              <Button onClick={onSubmit}>Submit</Button>
            </DrawerClose>
            <DrawerClose asChild>
              <Button variant="outline">Cancel</Button>
            </DrawerClose>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
}

const meta = {
  title: "shadcn/Overlays/Drawer",
  parameters: { aureusDocs: docs },
  args: { direction: "bottom", dismissible: true, onOpenChange: fn(), onSubmit: fn() },
  argTypes: {
    direction: {
      control: "inline-radio",
      options: ["top", "right", "bottom", "left"],
      table: { category: "Appearance" },
    },
    dismissible: { control: "boolean", table: { category: "Behavior" } },
    onOpenChange: { table: { category: "Events" } },
    onSubmit: { table: { category: "Events" } },
  },
  render: (args) => <GoalDrawer {...args} />,
} satisfies Meta<DrawerArgs>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Focus moves inside and stays there; Esc closes and returns focus to the trigger. */
export const Playground: Story = {
  play: async ({ args, canvas }) => {
    const trigger = canvas.getByRole("button", { name: "Set goal" });
    await userEvent.click(trigger);
    const drawer = await screen().findByRole("dialog", { name: "Move goal" });
    await expect(args.onOpenChange).toHaveBeenLastCalledWith(true);
    await userEvent.click(screen().getByRole("button", { name: "Increase goal" }));
    await expect(drawer).toHaveTextContent("360");
    await expectFocusTrapped(drawer, 5);
    await userEvent.keyboard("{Escape}");
    await expectClosed();
    await expect(args.onOpenChange).toHaveBeenLastCalledWith(false);
    await expect(trigger).toHaveFocus();
  },
};

const directions: Direction[] = ["top", "right", "bottom", "left"];

export const Directions: Story = {
  render: () => (
    <div className="grid grid-cols-2 gap-2">
      {directions.map((direction) => (
        <Drawer key={direction} direction={direction}>
          <DrawerTrigger asChild>
            <Button variant="outline">{direction}</Button>
          </DrawerTrigger>
          <DrawerContent>
            <DrawerHeader>
              <DrawerTitle>Drawer from the {direction}</DrawerTitle>
              <DrawerDescription>direction="{direction}"</DrawerDescription>
            </DrawerHeader>
            <DrawerFooter>
              <DrawerClose asChild>
                <Button variant="outline">Close</Button>
              </DrawerClose>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      ))}
    </div>
  ),
  play: async ({ canvas }) => {
    await userEvent.click(canvas.getByRole("button", { name: "right" }));
    const drawer = await screen().findByRole("dialog", { name: "Drawer from the right" });
    await expect(drawer).toHaveAttribute("data-vaul-drawer-direction", "right");
    await userEvent.click(screen().getByRole("button", { name: "Close" }));
    await expectClosed();
  },
};

function SnapExample() {
  const [snap, setSnap] = useState<number | string | null>(0.4);
  return (
    <Drawer snapPoints={[0.4, 1]} activeSnapPoint={snap} setActiveSnapPoint={setSnap}>
      <DrawerTrigger asChild>
        <Button variant="outline">Open snapping drawer</Button>
      </DrawerTrigger>
      <DrawerContent className="h-full max-h-[96vh]">
        <DrawerHeader>
          <DrawerTitle>Snap points</DrawerTitle>
          <DrawerDescription>
            Drag the handle up to expand. Current: {String(snap)}
          </DrawerDescription>
        </DrawerHeader>
      </DrawerContent>
    </Drawer>
  );
}

export const SnapPoints: Story = {
  render: () => <SnapExample />,
  play: async ({ canvas }) => {
    await userEvent.click(canvas.getByRole("button", { name: "Open snapping drawer" }));
    const drawer = await screen().findByRole("dialog", { name: "Snap points" });
    await expect(drawer).toHaveAccessibleDescription(/Current: 0\.4/);
    await userEvent.keyboard("{Escape}");
    await expectClosed();
  },
};

/** Submitting runs the handler and closes the drawer. */
export const WithForm: Story = {
  render: ({ onSubmit }) => (
    <Drawer>
      <DrawerTrigger asChild>
        <Button variant="outline">Rename file</Button>
      </DrawerTrigger>
      <DrawerContent>
        <form
          className="mx-auto grid w-full max-w-sm gap-4"
          onSubmit={(event) => {
            event.preventDefault();
            onSubmit();
          }}
        >
          <DrawerHeader>
            <DrawerTitle>Rename file</DrawerTitle>
            <DrawerDescription>The new name is visible to collaborators.</DrawerDescription>
          </DrawerHeader>
          <Field className="px-4">
            <FieldLabel htmlFor="drawer-file">File name</FieldLabel>
            <Input id="drawer-file" defaultValue="report.pdf" />
          </Field>
          <DrawerFooter>
            <Button type="submit">Save</Button>
            <DrawerClose asChild>
              <Button variant="outline" type="button">
                Cancel
              </Button>
            </DrawerClose>
          </DrawerFooter>
        </form>
      </DrawerContent>
    </Drawer>
  ),
  play: async ({ args, canvas }) => {
    await userEvent.click(canvas.getByRole("button", { name: "Rename file" }));
    await screen().findByRole("dialog");
    await userEvent.click(screen().getByRole("button", { name: "Save" }));
    await expect(args.onSubmit).toHaveBeenCalledTimes(1);
    await userEvent.click(screen().getByRole("button", { name: "Cancel" }));
    await expectClosed();
  },
};

export const Mobile: Story = {
  globals: { viewport: { value: "mobile1", isRotated: false } },
};
