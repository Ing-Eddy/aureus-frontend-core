import {
  Modal,
  ModalBody,
  ModalClose,
  type ModalCloseButtonTexts,
  ModalContent,
  type ModalContentProps,
  ModalDescription,
  type ModalDrawerDirection,
  ModalFooter,
  ModalHeader,
  type ModalMode,
  type ModalOpenChangeReason,
  type ModalProps,
  type ModalSize,
  type ModalSnapPoint,
  ModalTitle,
  ModalTrigger,
  useModal,
} from "@aureus-core/ui/components/modal";
import { TextControl } from "@aureus-core/ui/components/text-control";
import { Button } from "@aureus-core/ui/shadcn/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { expectClosed, expectFocusTrapped, screen } from "@sb/testing/overlay";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { FormProvider, useForm, useFormContext } from "react-hook-form";
import { expect, fn, userEvent, waitFor } from "storybook/test";
import { z } from "zod";
import { docs } from "./modal-docs";

type PlaygroundArgs = Omit<ModalProps, "children"> &
  Pick<ModalContentProps, "size" | "drawerHandle"> & {
    closeButton: boolean;
    closeLabel: string;
    title: string;
    description: string;
    hideTitle: boolean;
  };

/** Waits for the open panel; overlays render in a portal. */
const findPanel = (name: string) => screen().findByRole("dialog", { name });

/** The mode a responsive modal takes in the current viewport. */
const viewportMode = (breakpoint = 768): ModalMode =>
  window.innerWidth >= breakpoint ? "dialog" : "drawer";

/**
 * Drags an element down by `distance` pixels with pointer events, as a quick swipe. Vaul ignores
 * drags in the first 500 ms after the drawer opens, so the gesture waits for that first.
 */
async function swipeDown(element: HTMLElement, distance: number) {
  await new Promise((resolve) => setTimeout(resolve, 600));
  const { left, top } = element.getBoundingClientRect();
  const x = left + 20;
  const pointer = (type: string, y: number) =>
    element.dispatchEvent(
      new PointerEvent(type, {
        bubbles: true,
        clientX: x,
        clientY: y,
        pointerId: 1,
        pointerType: "touch",
        isPrimary: true,
      }),
    );
  pointer("pointerdown", top + 10);
  for (let step = 1; step <= 5; step++) {
    await new Promise((resolve) => requestAnimationFrame(resolve));
    pointer("pointermove", top + 10 + (distance * step) / 5);
  }
  pointer("pointerup", top + 10 + distance);
}

function PlaygroundModal({
  title,
  description,
  hideTitle,
  size,
  closeButton,
  closeLabel,
  drawerHandle,
  ...modal
}: PlaygroundArgs) {
  const closeProps: ModalCloseButtonTexts = closeButton ? { closeButton, closeLabel } : {};
  return (
    <Modal {...modal}>
      <ModalTrigger asChild>
        <Button variant="outline">Edit profile</Button>
      </ModalTrigger>
      <ModalContent size={size} drawerHandle={drawerHandle} {...closeProps}>
        <ModalHeader>
          <ModalTitle visuallyHidden={hideTitle}>{title}</ModalTitle>
          {description ? <ModalDescription>{description}</ModalDescription> : null}
        </ModalHeader>
        <ModalBody>
          <label className="flex flex-col gap-2 text-sm">
            Display name
            <input className="rounded-md border px-3 py-2" defaultValue="Ada Lovelace" />
          </label>
        </ModalBody>
        <ModalFooter>
          <ModalClose asChild>
            <Button variant="outline">Cancel</Button>
          </ModalClose>
          <ModalClose asChild>
            <Button>Save</Button>
          </ModalClose>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

const meta = {
  title: "components/Overlays/Modal",
  parameters: { aureusDocs: docs },
  args: {
    title: "Edit profile",
    description: "Change how your name appears to other people.",
    hideTitle: false,
    mode: "responsive",
    breakpoint: 768,
    lockModeWhileOpen: false,
    closeOnEscape: true,
    closeOnOutsidePress: true,
    closeOnSwipe: true,
    modal: true,
    size: "sm",
    closeButton: true,
    closeLabel: "Close",
    drawerDirection: "bottom",
    drawerHandle: true,
    drawerHandleOnly: false,
    onOpenChange: fn(),
    onOpenChangeComplete: fn(),
    onModeChange: fn(),
  },
  argTypes: {
    title: { control: "text", table: { category: "Content" } },
    description: { control: "text", table: { category: "Content" } },
    closeLabel: { control: "text", table: { category: "Content" } },
    hideTitle: { control: "boolean", table: { category: "Content" } },
    size: {
      control: "inline-radio",
      options: ["sm", "md", "lg", "xl", "full"],
      table: { category: "Appearance" },
    },
    closeButton: { control: "boolean", table: { category: "Appearance" } },
    drawerDirection: {
      control: "inline-radio",
      options: ["bottom", "top", "left", "right"],
      table: { category: "Appearance" },
    },
    drawerHandle: { control: "boolean", table: { category: "Appearance" } },
    open: { control: "boolean", table: { category: "State" } },
    defaultOpen: { control: "boolean", table: { category: "State" } },
    mode: {
      control: "inline-radio",
      options: ["responsive", "dialog", "drawer"],
      table: { category: "Behavior" },
    },
    breakpoint: { control: { type: "number", min: 0, step: 1 }, table: { category: "Behavior" } },
    lockModeWhileOpen: { control: "boolean", table: { category: "Behavior" } },
    closeOnEscape: { control: "boolean", table: { category: "Behavior" } },
    closeOnOutsidePress: { control: "boolean", table: { category: "Behavior" } },
    closeOnSwipe: { control: "boolean", table: { category: "Behavior" } },
    modal: { control: "boolean", table: { category: "Behavior" } },
    drawerHandleOnly: { control: "boolean", table: { category: "Behavior" } },
    onOpenChange: { table: { category: "Events" } },
    onOpenChangeComplete: { table: { category: "Events" } },
    onModeChange: { table: { category: "Events" } },
  },
  render: (args) => <PlaygroundModal {...args} />,
} satisfies Meta<PlaygroundArgs>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Focus moves inside and stays there; Esc closes and returns focus to the trigger. */
export const Playground: Story = {
  play: async ({ args, canvas }) => {
    const trigger = canvas.getByRole("button", { name: "Edit profile" });
    await userEvent.click(trigger);
    const panel = await findPanel("Edit profile");
    await expect(panel).toHaveAttribute("data-mode", viewportMode());
    await expect(panel).toHaveAccessibleDescription(
      "Change how your name appears to other people.",
    );
    await expect(args.onOpenChange).toHaveBeenLastCalledWith(true, { reason: "trigger" });
    await expect(trigger).toHaveAttribute("aria-expanded", "true");
    await expectFocusTrapped(panel, 5);
    await userEvent.keyboard("{Escape}");
    await expectClosed();
    await expect(args.onOpenChange).toHaveBeenLastCalledWith(false, { reason: "escape-key" });
    await waitFor(() => expect(args.onOpenChangeComplete).toHaveBeenLastCalledWith(false));
    await waitFor(() => expect(trigger).toHaveFocus());
  },
};

const sizes: ModalSize[] = ["sm", "md", "lg", "xl", "full"];

export const Sizes: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      {sizes.map((size) => (
        <Modal key={size} mode="dialog">
          <ModalTrigger asChild>
            <Button variant="outline">{size}</Button>
          </ModalTrigger>
          <ModalContent size={size} closeButton closeLabel="Close">
            <ModalHeader>
              <ModalTitle>Size {size}</ModalTitle>
              <ModalDescription>The dialog width for this size.</ModalDescription>
            </ModalHeader>
          </ModalContent>
        </Modal>
      ))}
    </div>
  ),
  play: async ({ canvas }) => {
    await userEvent.click(canvas.getByRole("button", { name: "lg" }));
    const panel = await findPanel("Size lg");
    await expect(panel).toHaveAttribute("data-size", "lg");
    await userEvent.click(screen().getByRole("button", { name: "Close" }));
    await expectClosed();
  },
};

export const ForcedModes: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      {(["dialog", "drawer"] as const).map((mode) => (
        <Modal key={mode} mode={mode}>
          <ModalTrigger asChild>
            <Button variant="outline">Always a {mode}</Button>
          </ModalTrigger>
          <ModalContent>
            <ModalHeader>
              <ModalTitle>Forced {mode}</ModalTitle>
              <ModalDescription>{`mode="${mode}"`}</ModalDescription>
            </ModalHeader>
            <ModalFooter>
              <ModalClose asChild>
                <Button variant="outline">Done</Button>
              </ModalClose>
            </ModalFooter>
          </ModalContent>
        </Modal>
      ))}
    </div>
  ),
  play: async ({ canvas }) => {
    for (const mode of ["dialog", "drawer"] as const) {
      await userEvent.click(canvas.getByRole("button", { name: `Always a ${mode}` }));
      const panel = await findPanel(`Forced ${mode}`);
      await expect(panel).toHaveAttribute("data-mode", mode);
      await userEvent.click(screen().getByRole("button", { name: "Done" }));
      await expectClosed();
    }
  },
};

export const Responsive: Story = {
  globals: { viewport: { value: "mobile1", isRotated: false } },
  play: async ({ args, canvas }) => {
    await userEvent.click(canvas.getByRole("button", { name: "Edit profile" }));
    const panel = await findPanel("Edit profile");
    await expect(panel).toHaveAttribute("data-mode", viewportMode());
    await userEvent.click(screen().getByRole("button", { name: "Close" }));
    await expectClosed();
    await expect(args.onOpenChange).toHaveBeenLastCalledWith(false, { reason: "close-button" });
  },
};

const projectSchema = z.object({ name: z.string().min(2, "Use at least 2 characters.") });
type Project = z.infer<typeof projectSchema>;

/** The form inside the panel: `useModal().close()` closes it after a valid submit. */
function ProjectForm({ onSave }: { onSave: (values: Project) => void }) {
  const { close } = useModal();
  const form = useFormContext<Project>();
  return (
    <form
      noValidate
      className="contents"
      onSubmit={form.handleSubmit((values) => {
        onSave(values);
        close();
      })}
    >
      <ModalBody>
        <TextControl name="name" label="Project name" required />
      </ModalBody>
      <ModalFooter>
        <ModalClose asChild>
          <Button variant="outline" type="button">
            Cancel
          </Button>
        </ModalClose>
        <Button type="submit">Save</Button>
      </ModalFooter>
    </form>
  );
}

function WithFormExample({ onSave }: { onSave: (values: Project) => void }) {
  const form = useForm<Project>({
    resolver: zodResolver(projectSchema),
    defaultValues: { name: "" },
  });
  return (
    <Modal
      lockModeWhileOpen
      closeOnOutsidePress={!form.formState.isDirty}
      onOpenChangeComplete={(open) => {
        if (!open) form.reset();
      }}
    >
      <ModalTrigger asChild>
        <Button variant="outline">Rename project</Button>
      </ModalTrigger>
      <ModalContent closeButton closeLabel="Close">
        <ModalHeader>
          <ModalTitle>Rename project</ModalTitle>
          <ModalDescription>The new name is visible to your team.</ModalDescription>
        </ModalHeader>
        <FormProvider {...form}>
          <ProjectForm onSave={onSave} />
        </FormProvider>
      </ModalContent>
    </Modal>
  );
}

const onSave = fn();

export const WithForm: Story = {
  render: () => <WithFormExample onSave={onSave} />,
  play: async ({ canvas }) => {
    onSave.mockClear();
    await userEvent.click(canvas.getByRole("button", { name: "Rename project" }));
    await findPanel("Rename project");
    await userEvent.click(screen().getByRole("button", { name: "Save" }));
    const input = await screen().findByRole("textbox", { name: "Project name" });
    await waitFor(() => expect(input).toHaveAttribute("aria-invalid", "true"));
    // The drawer may still be entering: Vaul's animation ignores reduced motion.
    await waitFor(() => expect(screen().getByText("Use at least 2 characters.")).toBeVisible());
    await userEvent.type(input, "Aureus");
    await userEvent.click(screen().getByRole("button", { name: "Save" }));
    await expectClosed();
    await expect(onSave).toHaveBeenCalledWith({ name: "Aureus" });
  },
};

function ControlledExample() {
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState<ModalOpenChangeReason>();
  return (
    <div className="flex flex-col items-start gap-3">
      <Button variant="outline" onClick={() => setOpen(true)}>
        Open from outside
      </Button>
      <output aria-label="Last reason" className="font-mono text-xs">
        {reason ?? "—"}
      </output>
      <Modal
        open={open}
        onOpenChange={(next, details) => {
          setOpen(next);
          setReason(details.reason);
        }}
      >
        <ModalContent closeButton closeLabel="Close">
          <ModalHeader>
            <ModalTitle>Controlled modal</ModalTitle>
            <ModalDescription>The page owns the open state.</ModalDescription>
          </ModalHeader>
          <ModalFooter>
            <ModalClose asChild>
              <Button variant="outline">Done</Button>
            </ModalClose>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
}

export const Controlled: Story = {
  render: () => <ControlledExample />,
  play: async ({ canvas }) => {
    await userEvent.click(canvas.getByRole("button", { name: "Open from outside" }));
    await findPanel("Controlled modal");
    await userEvent.click(screen().getByRole("button", { name: "Done" }));
    await expectClosed();
    await expect(canvas.getByRole("status", { name: "Last reason" })).toHaveTextContent("close");
    await userEvent.click(canvas.getByRole("button", { name: "Open from outside" }));
    await findPanel("Controlled modal");
    await userEvent.keyboard("{Escape}");
    await expectClosed();
    await expect(canvas.getByRole("status", { name: "Last reason" })).toHaveTextContent(
      "escape-key",
    );
  },
};

export const DismissOptions: Story = {
  args: { closeOnEscape: false, closeOnOutsidePress: false, closeOnSwipe: false },
  play: async ({ args, canvas }) => {
    await userEvent.click(canvas.getByRole("button", { name: "Edit profile" }));
    const panel = await findPanel("Edit profile");
    await userEvent.keyboard("{Escape}");
    await expect(panel).toBeInTheDocument();
    const overlay = document.querySelector<HTMLElement>("[data-slot=modal-overlay]");
    if (overlay) await userEvent.click(overlay, { pointerEventsCheck: 0 });
    await expect(screen().getByRole("dialog", { name: "Edit profile" })).toBe(panel);
    await userEvent.click(screen().getByRole("button", { name: "Cancel" }));
    await expectClosed();
    await expect(args.onOpenChange).toHaveBeenLastCalledWith(false, { reason: "close" });
  },
};

const paragraphs = Array.from({ length: 30 }, (_, index) => `Clause ${index + 1}.`);

export const LongContent: Story = {
  render: () => (
    <Modal>
      <ModalTrigger asChild>
        <Button variant="outline">Read terms</Button>
      </ModalTrigger>
      <ModalContent size="md">
        <ModalHeader>
          <ModalTitle>Terms of service</ModalTitle>
          <ModalDescription>Scroll to read every clause.</ModalDescription>
        </ModalHeader>
        <ModalBody tabIndex={0} aria-label="Terms">
          {paragraphs.map((text) => (
            <p key={text} className="py-3">
              {text} Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor.
            </p>
          ))}
        </ModalBody>
        <ModalFooter>
          <ModalClose asChild>
            <Button>Accept</Button>
          </ModalClose>
        </ModalFooter>
      </ModalContent>
    </Modal>
  ),
  play: async ({ canvas }) => {
    await userEvent.click(canvas.getByRole("button", { name: "Read terms" }));
    const panel = await findPanel("Terms of service");
    const body = panel.querySelector<HTMLElement>("[data-slot=modal-body]");
    await expect(body).not.toBeNull();
    if (!body) return;
    await expect(body.scrollHeight).toBeGreaterThan(body.clientHeight);
    // The footer stays inside the viewport once the panel has finished entering.
    const accept = screen().getByRole("button", { name: "Accept" });
    await waitFor(() => expect(accept).toBeVisible());
    await waitFor(() =>
      expect(accept.getBoundingClientRect().bottom).toBeLessThanOrEqual(window.innerHeight + 1),
    );
    await userEvent.click(screen().getByRole("button", { name: "Accept" }));
    await expectClosed();
  },
};

export const Nested: Story = {
  render: () => (
    <Modal>
      <ModalTrigger asChild>
        <Button variant="outline">Open settings</Button>
      </ModalTrigger>
      <ModalContent>
        <ModalHeader>
          <ModalTitle>Settings</ModalTitle>
          <ModalDescription>Manage your account.</ModalDescription>
        </ModalHeader>
        <ModalFooter>
          <Modal>
            <ModalTrigger asChild>
              <Button variant="destructive">Delete account</Button>
            </ModalTrigger>
            <ModalContent>
              <ModalHeader>
                <ModalTitle>Delete account?</ModalTitle>
                <ModalDescription>This cannot be undone.</ModalDescription>
              </ModalHeader>
              <ModalFooter>
                <ModalClose asChild>
                  <Button variant="outline">Keep account</Button>
                </ModalClose>
              </ModalFooter>
            </ModalContent>
          </Modal>
        </ModalFooter>
      </ModalContent>
    </Modal>
  ),
  play: async ({ canvas }) => {
    await userEvent.click(canvas.getByRole("button", { name: "Open settings" }));
    await findPanel("Settings");
    const inner = screen().getByRole("button", { name: "Delete account" });
    await userEvent.click(inner);
    await findPanel("Delete account?");
    await userEvent.keyboard("{Escape}");
    await waitFor(() =>
      expect(screen().queryByRole("dialog", { name: "Delete account?" })).toBeNull(),
    );
    await expect(screen().getByRole("dialog", { name: "Settings" })).toBeInTheDocument();
    await waitFor(() => expect(inner).toHaveFocus());
    await userEvent.keyboard("{Escape}");
    await expectClosed();
  },
};

function SnapPointsExample() {
  const [snap, setSnap] = useState<ModalSnapPoint | null>(0.5);
  return (
    <Modal
      mode="drawer"
      drawerSnapPoints={[0.5, 1]}
      drawerActiveSnapPoint={snap}
      onDrawerActiveSnapPointChange={setSnap}
    >
      <ModalTrigger asChild>
        <Button variant="outline">Open filters</Button>
      </ModalTrigger>
      <ModalContent className="h-full max-h-[96dvh]">
        <ModalHeader>
          <ModalTitle>Filters</ModalTitle>
          <ModalDescription>Drag up to expand. Current: {String(snap)}</ModalDescription>
        </ModalHeader>
      </ModalContent>
    </Modal>
  );
}

export const DrawerSnapPoints: Story = {
  render: () => <SnapPointsExample />,
  play: async ({ canvas }) => {
    await userEvent.click(canvas.getByRole("button", { name: "Open filters" }));
    const panel = await findPanel("Filters");
    await expect(panel).toHaveAccessibleDescription(/Current: 0\.5/);
    await userEvent.keyboard("{Escape}");
    await expectClosed();
  },
};

const directions: ModalDrawerDirection[] = ["bottom", "top", "left", "right"];

export const DrawerDirections: Story = {
  render: () => (
    <div className="grid grid-cols-2 gap-2">
      {directions.map((direction) => (
        <Modal key={direction} mode="drawer" drawerDirection={direction}>
          <ModalTrigger asChild>
            <Button variant="outline">{direction}</Button>
          </ModalTrigger>
          <ModalContent>
            <ModalHeader>
              <ModalTitle>Drawer from the {direction}</ModalTitle>
              <ModalDescription>{`drawerDirection="${direction}"`}</ModalDescription>
            </ModalHeader>
            <ModalFooter>
              <ModalClose asChild>
                <Button variant="outline">Close</Button>
              </ModalClose>
            </ModalFooter>
          </ModalContent>
        </Modal>
      ))}
    </div>
  ),
  play: async ({ canvas }) => {
    await userEvent.click(canvas.getByRole("button", { name: "bottom" }));
    const bottom = await findPanel("Drawer from the bottom");
    await expect(bottom.querySelector("[data-slot=modal-handle]")).not.toBeNull();
    await swipeDown(bottom, 400);
    await expectClosed();

    await userEvent.click(canvas.getByRole("button", { name: "right" }));
    const right = await findPanel("Drawer from the right");
    await expect(right).toHaveAttribute("data-vaul-drawer-direction", "right");
    await expect(right.querySelector("[data-slot=modal-handle]")).toBeNull();
    await userEvent.click(screen().getByRole("button", { name: "Close" }));
    await expectClosed();
  },
};

export const HiddenTitle: Story = {
  render: () => (
    <Modal>
      <ModalTrigger asChild>
        <Button variant="outline">Share</Button>
      </ModalTrigger>
      <ModalContent closeButton closeLabel="Close">
        <ModalHeader>
          <ModalTitle visuallyHidden>Share this page</ModalTitle>
        </ModalHeader>
        <ModalBody>
          <p>Copy the link below to share this page.</p>
        </ModalBody>
      </ModalContent>
    </Modal>
  ),
  play: async ({ canvas }) => {
    await userEvent.click(canvas.getByRole("button", { name: "Share" }));
    const panel = await findPanel("Share this page");
    await expect(panel).not.toHaveAttribute("aria-describedby");
    await expect(screen().getByText("Share this page")).toHaveClass("sr-only");
    await userEvent.click(screen().getByRole("button", { name: "Close" }));
    await expectClosed();
  },
};

/** Any component inside the modal can read its state and close it. */
function ModeBadge() {
  const { open, mode, close } = useModal();
  return (
    <div className="flex items-center gap-2">
      <output aria-label="Modal state" className="font-mono text-xs">
        {`${open ? "open" : "closed"} · ${mode}`}
      </output>
      <Button size="sm" variant="outline" onClick={close}>
        Close from a child
      </Button>
    </div>
  );
}

export const UseModalHook: Story = {
  render: () => (
    <Modal>
      <ModalTrigger asChild>
        <Button variant="outline">Open</Button>
      </ModalTrigger>
      <ModalContent>
        <ModalHeader>
          <ModalTitle>useModal</ModalTitle>
          <ModalDescription>The child below reads the state and closes the modal.</ModalDescription>
        </ModalHeader>
        <ModalBody>
          <ModeBadge />
        </ModalBody>
      </ModalContent>
    </Modal>
  ),
  play: async ({ canvas }) => {
    await userEvent.click(canvas.getByRole("button", { name: "Open" }));
    await findPanel("useModal");
    await expect(screen().getByRole("status", { name: "Modal state" })).toHaveTextContent(
      `open · ${viewportMode()}`,
    );
    await userEvent.click(screen().getByRole("button", { name: "Close from a child" }));
    await expectClosed();
  },
};
