import { Button } from "@aureus-core/ui/shadcn/button";
import { Field, FieldGroup, FieldLabel } from "@aureus-core/ui/shadcn/field";
import { Input } from "@aureus-core/ui/shadcn/input";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@aureus-core/ui/shadcn/sheet";
import { expectClosed, expectFocusTrapped, screen } from "@sb/testing/overlay";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { MenuIcon } from "lucide-react";
import { expect, fn, userEvent } from "storybook/test";
import { docs } from "./sheet-docs";

type Side = "top" | "right" | "bottom" | "left";

interface SheetArgs {
  side: Side;
  showCloseButton: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: () => void;
}

function SettingsSheet({ side, showCloseButton, onOpenChange, onSave }: SheetArgs) {
  return (
    <Sheet onOpenChange={onOpenChange}>
      <SheetTrigger asChild>
        <Button variant="outline">Open settings</Button>
      </SheetTrigger>
      <SheetContent side={side} showCloseButton={showCloseButton}>
        <SheetHeader>
          <SheetTitle>Workspace settings</SheetTitle>
          <SheetDescription>Changes apply to everyone in the workspace.</SheetDescription>
        </SheetHeader>
        <FieldGroup className="px-4">
          <Field>
            <FieldLabel htmlFor="sheet-name">Workspace name</FieldLabel>
            <Input id="sheet-name" defaultValue="Aureus" />
          </Field>
          <Field>
            <FieldLabel htmlFor="sheet-url">URL</FieldLabel>
            <Input id="sheet-url" defaultValue="aureus.dev/acme" />
          </Field>
        </FieldGroup>
        <SheetFooter>
          <SheetClose asChild>
            <Button onClick={onSave}>Save changes</Button>
          </SheetClose>
          <SheetClose asChild>
            <Button variant="outline">Cancel</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

const meta = {
  title: "shadcn/Overlays/Sheet",
  parameters: { aureusDocs: docs },
  args: { side: "right", showCloseButton: true, onOpenChange: fn(), onSave: fn() },
  argTypes: {
    side: {
      control: "inline-radio",
      options: ["top", "right", "bottom", "left"],
      table: { category: "Appearance" },
    },
    showCloseButton: { control: "boolean", table: { category: "Appearance" } },
    onOpenChange: { table: { category: "Events" } },
    onSave: { table: { category: "Events" } },
  },
  render: (args) => <SettingsSheet {...args} />,
} satisfies Meta<SheetArgs>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Opening moves focus inside, Tab stays inside, Esc closes and focus returns to the trigger. */
export const Playground: Story = {
  play: async ({ args, canvas }) => {
    const trigger = canvas.getByRole("button", { name: "Open settings" });
    await userEvent.click(trigger);
    const sheet = await screen().findByRole("dialog", { name: "Workspace settings" });
    await expect(args.onOpenChange).toHaveBeenLastCalledWith(true);
    await expect(sheet).toContainElement(document.activeElement as HTMLElement);
    await expectFocusTrapped(sheet, 6);
    await userEvent.keyboard("{Escape}");
    await expectClosed();
    await expect(trigger).toHaveFocus();
  },
};

const sides: Side[] = ["top", "right", "bottom", "left"];

export const Sides: Story = {
  render: () => (
    <div className="grid grid-cols-2 gap-2">
      {sides.map((side) => (
        <Sheet key={side}>
          <SheetTrigger asChild>
            <Button variant="outline">{side}</Button>
          </SheetTrigger>
          <SheetContent side={side}>
            <SheetHeader>
              <SheetTitle>Sheet from the {side}</SheetTitle>
              <SheetDescription>side="{side}"</SheetDescription>
            </SheetHeader>
          </SheetContent>
        </Sheet>
      ))}
    </div>
  ),
  play: async ({ canvas }) => {
    await userEvent.click(canvas.getByRole("button", { name: "left" }));
    const sheet = await screen().findByRole("dialog", { name: "Sheet from the left" });
    await expect(sheet).toHaveAttribute("data-side", "left");
    await userEvent.keyboard("{Escape}");
    await expectClosed();
  },
};

/** Save runs its handler and closes the sheet through SheetClose. */
export const WithForm: Story = {
  play: async ({ args, canvas }) => {
    await userEvent.click(canvas.getByRole("button", { name: "Open settings" }));
    await screen().findByRole("dialog");
    await userEvent.type(screen().getByLabelText("Workspace name"), " Labs");
    await userEvent.click(screen().getByRole("button", { name: "Save changes" }));
    await expect(args.onSave).toHaveBeenCalledTimes(1);
    await expectClosed();
  },
};

export const Mobile: Story = {
  globals: { viewport: { value: "mobile1", isRotated: false } },
  render: () => (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" aria-label="Open menu">
          <MenuIcon />
        </Button>
      </SheetTrigger>
      <SheetContent side="left">
        <SheetHeader>
          <SheetTitle>Menu</SheetTitle>
          <SheetDescription className="sr-only">Main navigation</SheetDescription>
        </SheetHeader>
        <nav aria-label="Main" className="grid gap-1 px-2">
          {["Dashboard", "Projects", "Team", "Settings"].map((item) => (
            <Button key={item} variant="ghost" className="justify-start" asChild>
              <a href={`#${item.toLowerCase()}`}>{item}</a>
            </Button>
          ))}
        </nav>
      </SheetContent>
    </Sheet>
  ),
  play: async ({ canvas }) => {
    await userEvent.click(canvas.getByRole("button", { name: "Open menu" }));
    const sheet = await screen().findByRole("dialog", { name: "Menu" });
    await expect(sheet).toHaveAttribute("data-side", "left");
    await userEvent.keyboard("{Escape}");
    await expectClosed();
  },
};
