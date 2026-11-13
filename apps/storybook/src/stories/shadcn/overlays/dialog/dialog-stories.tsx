import { Button } from "@aureus-core/ui/shadcn/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@aureus-core/ui/shadcn/dialog";
import { Field, FieldGroup, FieldLabel } from "@aureus-core/ui/shadcn/field";
import { Input } from "@aureus-core/ui/shadcn/input";
import { expectClosed, expectFocusTrapped, screen } from "@sb/testing/overlay";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { expect, fn, userEvent } from "storybook/test";
import { docs } from "./dialog-docs";

interface DialogArgs {
  modal: boolean;
  showCloseButton: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: Record<string, FormDataEntryValue>) => void;
}

function ProfileDialog({ modal, showCloseButton, onOpenChange, onSubmit }: DialogArgs) {
  const [open, setOpen] = useState(false);
  return (
    <Dialog
      modal={modal}
      open={open}
      onOpenChange={(value) => {
        setOpen(value);
        onOpenChange(value);
      }}
    >
      <DialogTrigger asChild>
        <Button variant="outline">Edit profile</Button>
      </DialogTrigger>
      <DialogContent showCloseButton={showCloseButton}>
        <form
          className="grid gap-4"
          onSubmit={(event) => {
            event.preventDefault();
            onSubmit(Object.fromEntries(new FormData(event.currentTarget)));
            setOpen(false);
          }}
        >
          <DialogHeader>
            <DialogTitle>Edit profile</DialogTitle>
            <DialogDescription>Make changes to your profile, then save.</DialogDescription>
          </DialogHeader>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="dialog-name">Name</FieldLabel>
              <Input id="dialog-name" name="name" defaultValue="Ada Lovelace" />
            </Field>
            <Field>
              <FieldLabel htmlFor="dialog-username">Username</FieldLabel>
              <Input id="dialog-username" name="username" defaultValue="@ada" />
            </Field>
          </FieldGroup>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline" type="button">
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit">Save changes</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

const meta = {
  title: "shadcn/Overlays/Dialog",
  parameters: { aureusDocs: docs },
  args: { modal: true, showCloseButton: true, onOpenChange: fn(), onSubmit: fn() },
  argTypes: {
    modal: { control: "boolean", table: { category: "Behavior" } },
    showCloseButton: { control: "boolean", table: { category: "Appearance" } },
    onOpenChange: { table: { category: "Events" } },
    onSubmit: { table: { category: "Events" } },
  },
  render: (args) => <ProfileDialog {...args} />,
} satisfies Meta<DialogArgs>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Enter opens the dialog and focus moves inside; Tab stays in the dialog; Esc closes it and focus
 * returns to the trigger.
 */
export const Playground: Story = {
  play: async ({ args, canvas }) => {
    const trigger = canvas.getByRole("button", { name: "Edit profile" });
    trigger.focus();
    await userEvent.keyboard("{Enter}");
    const dialog = await screen().findByRole("dialog", { name: "Edit profile" });
    await expect(args.onOpenChange).toHaveBeenLastCalledWith(true);
    await expect(dialog).toHaveAccessibleDescription("Make changes to your profile, then save.");
    await expect(dialog).toContainElement(document.activeElement as HTMLElement);
    await expectFocusTrapped(dialog);
    await userEvent.keyboard("{Escape}");
    await expectClosed();
    await expect(args.onOpenChange).toHaveBeenLastCalledWith(false);
    await expect(trigger).toHaveFocus();
  },
};

/** Submitting the form passes its values to `onSubmit` and closes the dialog. */
export const WithForm: Story = {
  play: async ({ args, canvas }) => {
    await userEvent.click(canvas.getByRole("button", { name: "Edit profile" }));
    const dialog = await screen().findByRole("dialog");
    const name = await screen().findByLabelText("Name");
    await expect(name).toHaveFocus();
    await userEvent.clear(name);
    await userEvent.type(name, "Grace Hopper");
    await userEvent.click(screen().getByRole("button", { name: "Save changes" }));
    await expect(args.onSubmit).toHaveBeenCalledWith({ name: "Grace Hopper", username: "@ada" });
    await expectClosed();
    await expect(dialog).not.toBeInTheDocument();
  },
};

const termsClauses = Array.from({ length: 12 }, (_, index) => index + 1);

export const ScrollableBody: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Read the terms</Button>
      </DialogTrigger>
      <DialogContent className="flex max-h-[min(32rem,80vh)] flex-col">
        <DialogHeader>
          <DialogTitle>Terms of service</DialogTitle>
          <DialogDescription>Last updated on June 1, 2025.</DialogDescription>
        </DialogHeader>
        <section
          className="-mx-4 overflow-y-auto px-4 text-sm"
          // biome-ignore lint/a11y/noNoninteractiveTabindex: a scrollable region must be focusable (axe scrollable-region-focusable).
          tabIndex={0}
          aria-label="Terms text"
        >
          {termsClauses.map((clause) => (
            <p key={clause} className="mb-3">
              {clause}. These terms describe how you may use the service. Read them carefully; they
              are long on purpose so the body of this dialog scrolls.
            </p>
          ))}
        </section>
        <DialogFooter showCloseButton />
      </DialogContent>
    </Dialog>
  ),
  play: async ({ canvas }) => {
    await userEvent.click(canvas.getByRole("button", { name: "Read the terms" }));
    const region = await screen().findByLabelText("Terms text");
    await expect(region.scrollHeight).toBeGreaterThan(region.clientHeight);
    await userEvent.click(screen().getAllByRole("button", { name: "Close" }).at(-1) as HTMLElement);
    await expectClosed();
  },
};

/** Without the × button, the footer must offer a way out; Esc still closes the dialog. */
export const NoCloseButton: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Share link</Button>
      </DialogTrigger>
      <DialogContent showCloseButton={false}>
        <DialogHeader>
          <DialogTitle>Share link</DialogTitle>
          <DialogDescription>Anyone with this link can view the document.</DialogDescription>
        </DialogHeader>
        <Input aria-label="Link" readOnly defaultValue="https://aureus.dev/d/7f3a" />
        <DialogFooter showCloseButton />
      </DialogContent>
    </Dialog>
  ),
  play: async ({ canvas }) => {
    await userEvent.click(canvas.getByRole("button", { name: "Share link" }));
    const dialog = await screen().findByRole("dialog");
    await expect(screen().getAllByRole("button", { name: "Close" })).toHaveLength(1);
    await expect(dialog).toBeInTheDocument();
    await userEvent.keyboard("{Escape}");
    await expectClosed();
  },
};

function ControlledExample() {
  const [open, setOpen] = useState(false);
  return (
    <div className="flex items-center gap-4">
      <Button onClick={() => setOpen(true)}>Open from outside</Button>
      <span className="text-muted-foreground text-sm">open: {String(open)}</span>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Controlled dialog</DialogTitle>
            <DialogDescription>Its open state lives in the parent component.</DialogDescription>
          </DialogHeader>
          <DialogFooter showCloseButton />
        </DialogContent>
      </Dialog>
    </div>
  );
}

export const Controlled: Story = {
  render: () => <ControlledExample />,
  play: async ({ canvas }) => {
    await userEvent.click(canvas.getByRole("button", { name: "Open from outside" }));
    await screen().findByRole("dialog", { name: "Controlled dialog" });
    await expect(canvas.getByText("open: true")).toBeInTheDocument();
    await userEvent.keyboard("{Escape}");
    await expectClosed();
    await expect(canvas.getByText("open: false")).toBeVisible();
  },
};
