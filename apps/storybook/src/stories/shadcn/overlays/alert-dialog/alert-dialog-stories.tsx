import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@aureus-core/ui/shadcn/alert-dialog";
import { Button } from "@aureus-core/ui/shadcn/button";
import { expectClosed, expectFocusTrapped, screen } from "@sb/testing/overlay";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { BluetoothIcon, TrashIcon } from "lucide-react";
import { expect, fn, userEvent } from "storybook/test";
import { docs } from "./alert-dialog-docs";

interface AlertArgs {
  size: "default" | "sm";
  onAction: () => void;
  onOpenChange: (open: boolean) => void;
}

const meta = {
  title: "shadcn/Overlays/Alert Dialog",
  parameters: { aureusDocs: docs },
  args: { size: "default", onAction: fn(), onOpenChange: fn() },
  argTypes: {
    size: {
      control: "inline-radio",
      options: ["default", "sm"],
      table: { category: "Appearance" },
    },
    onAction: { table: { category: "Events" } },
    onOpenChange: { table: { category: "Events" } },
  },
  render: ({ size, onAction, onOpenChange }) => (
    <AlertDialog onOpenChange={onOpenChange}>
      <AlertDialogTrigger asChild>
        <Button variant="outline">Delete project</Button>
      </AlertDialogTrigger>
      <AlertDialogContent size={size}>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete this project?</AlertDialogTitle>
          <AlertDialogDescription>
            This permanently deletes “Aureus” and its 24 deployments. This cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction variant="destructive" onClick={onAction}>
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  ),
} satisfies Meta<AlertArgs>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Focus starts on Cancel and stays inside; clicking the overlay does not close it; Esc does, and
 * focus returns to the trigger.
 */
export const Playground: Story = {
  play: async ({ args, canvas }) => {
    const trigger = canvas.getByRole("button", { name: "Delete project" });
    await userEvent.click(trigger);
    const dialog = await screen().findByRole("alertdialog", { name: "Delete this project?" });
    await expect(screen().getByRole("button", { name: "Cancel" })).toHaveFocus();
    await expectFocusTrapped(dialog, 4);

    const overlay = document.querySelector<HTMLElement>('[data-slot="alert-dialog-overlay"]');
    if (overlay) await userEvent.click(overlay, { pointerEventsCheck: 0 });
    await expect(dialog).toBeInTheDocument();

    await userEvent.keyboard("{Escape}");
    await expectClosed("alertdialog");
    await expect(args.onAction).not.toHaveBeenCalled();
    await expect(trigger).toHaveFocus();
  },
};

/** The destructive Action runs `onAction` and closes the dialog. */
export const Destructive: Story = {
  play: async ({ args, canvas }) => {
    await userEvent.click(canvas.getByRole("button", { name: "Delete project" }));
    await screen().findByRole("alertdialog");
    await userEvent.click(screen().getByRole("button", { name: "Delete" }));
    await expect(args.onAction).toHaveBeenCalledTimes(1);
    await expectClosed("alertdialog");
  },
};

export const Small: Story = {
  args: { size: "sm" },
};

export const WithMedia: Story = {
  render: ({ onAction }) => (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="outline">Connect device</Button>
      </AlertDialogTrigger>
      <AlertDialogContent size="sm">
        <AlertDialogHeader>
          <AlertDialogMedia>
            <BluetoothIcon aria-hidden />
          </AlertDialogMedia>
          <AlertDialogTitle>Allow accessory to connect?</AlertDialogTitle>
          <AlertDialogDescription>
            “Keyboard K3” wants to connect over Bluetooth.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Don't allow</AlertDialogCancel>
          <AlertDialogAction onClick={onAction}>Allow</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  ),
  play: async ({ canvas }) => {
    await userEvent.click(canvas.getByRole("button", { name: "Connect device" }));
    await screen().findByRole("alertdialog", { name: "Allow accessory to connect?" });
    await userEvent.click(screen().getByRole("button", { name: "Don't allow" }));
    await expectClosed("alertdialog");
  },
};

export const IconTrigger: Story = {
  render: ({ onAction }) => (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive" size="icon" aria-label="Delete file">
          <TrashIcon />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete “report.pdf”?</AlertDialogTitle>
          <AlertDialogDescription>The file moves to the trash for 30 days.</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction variant="destructive" onClick={onAction}>
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  ),
};
