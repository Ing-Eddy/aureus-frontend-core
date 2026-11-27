import {
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  ModalTitle,
  ModalTrigger,
} from "@aureus-core/ui/components/modal";
import { RadioGroupControl } from "@aureus-core/ui/components/radio-group-control";
import { TextControl } from "@aureus-core/ui/components/text-control";
import {
  type ToastAppearance,
  Toaster,
  type ToasterProps,
  type ToastPosition,
  type ToastStatus,
  toast,
} from "@aureus-core/ui/components/toast";
import { Button } from "@aureus-core/ui/shadcn/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { screen } from "@sb/testing/overlay";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { PhoneIcon } from "lucide-react";
import { type ReactNode, useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { expect, fn, userEvent, waitFor, within } from "storybook/test";
import { z } from "zod";
import { docs } from "./toast-docs";

type PlaygroundArgs = {
  label: string;
  position: ToastPosition;
  duration: number;
  limit: number;
  appearance: ToastAppearance;
  closeButton: boolean;
  closeLabel: string;
  status: ToastStatus;
  title: string;
  description: string;
  expandable: boolean;
  priority: "low" | "high";
  onClick: () => void;
};

const longText =
  "The export finished with warnings. 3 invoices had no tax identifier, 2 customers have an " +
  "outdated address and 1 payment could not be matched with any invoice. Review them before " +
  "closing the period, because closed periods cannot be edited and the tax report is generated " +
  "from them.";

const expandTexts = { expandLabel: "Show more", collapseLabel: "Show less" };

/** A story: its Toaster and the buttons that show toasts. */
function Demo({ toaster, children }: { toaster?: Partial<ToasterProps>; children: ReactNode }) {
  return (
    <div className="flex min-h-64 flex-wrap content-start items-start gap-2">
      <Toaster {...({ label: "Notifications", closeLabel: "Close", ...toaster } as ToasterProps)} />
      {children}
    </div>
  );
}

/** A button that shows a toast. */
function Show({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <Button variant="outline" onClick={onClick}>
      {label}
    </Button>
  );
}

const region = () => screen().findByRole("region", { name: "Notifications" });

/** Waits until a toast with this text is on screen, and returns its element. */
async function findToast(text: string) {
  const title = await within(await region()).findByText(text);
  return title.closest<HTMLElement>('[data-slot="toast"]') as HTMLElement;
}

const toastCount = () =>
  document.body.querySelectorAll('[data-slot="toast"]:not([data-ending-style])').length;

function PlaygroundToaster({
  label,
  position,
  duration,
  limit,
  appearance,
  closeButton,
  closeLabel,
  status,
  title,
  description,
  expandable,
  priority,
  onClick,
}: PlaygroundArgs) {
  return (
    <Demo
      toaster={{
        label,
        position,
        duration,
        limit,
        appearance,
        closeButton,
        closeLabel,
        expandable: expandable ? expandTexts : undefined,
      }}
    >
      <Show
        label="Show toast"
        onClick={() =>
          toast[status](title, { description, priority, onClick, keepOpenOnClick: true })
        }
      />
    </Demo>
  );
}

const meta = {
  title: "components/Feedback/Toast",
  parameters: {
    aureusDocs: docs,
    // Each story mounts its own Toaster, and all of them would show every toast: each one renders
    // in its own frame on the docs page.
    docs: { story: { inline: false, iframeHeight: 360 } },
  },
  args: {
    label: "Notifications",
    position: "bottom-end",
    duration: 5000,
    limit: 3,
    appearance: "card",
    closeButton: true,
    closeLabel: "Close",
    status: "success",
    title: "Invoice saved",
    description: "A copy was sent to the customer.",
    expandable: false,
    priority: "low",
    onClick: fn(),
  },
  argTypes: {
    label: { control: "text", table: { category: "Content" } },
    title: { control: "text", table: { category: "Content" } },
    description: { control: "text", table: { category: "Content" } },
    closeLabel: { control: "text", table: { category: "Content" } },
    status: {
      control: "inline-radio",
      options: ["neutral", "success", "info", "warning", "danger", "loading"],
      table: { category: "Appearance" },
    },
    appearance: {
      control: "inline-radio",
      options: ["card", "tinted"],
      table: { category: "Appearance" },
    },
    position: {
      control: "select",
      options: [
        "top-start",
        "top-center",
        "top-end",
        "bottom-start",
        "bottom-center",
        "bottom-end",
      ],
      table: { category: "Appearance" },
    },
    closeButton: { control: "boolean", table: { category: "Appearance" } },
    duration: { control: { type: "number", min: 1, step: 500 }, table: { category: "Behavior" } },
    limit: { control: { type: "number", min: 1, step: 1 }, table: { category: "Behavior" } },
    expandable: { control: "boolean", table: { category: "Behavior" } },
    priority: {
      control: "inline-radio",
      options: ["low", "high"],
      table: { category: "Behavior" },
    },
    onClick: { table: { category: "Events" } },
  },
  render: (args) => <PlaygroundToaster {...args} />,
} satisfies Meta<PlaygroundArgs>;

export default meta;
type Story = StoryObj<typeof meta>;

/** A click on the card runs `onClick`; F6 reaches the toasts and Escape closes one. */
export const Playground: Story = {
  play: async ({ args, canvas }) => {
    await userEvent.click(canvas.getByRole("button", { name: "Show toast" }));
    const shown = await findToast("Invoice saved");
    await expect(shown).toHaveAttribute("data-type", "success");
    await expect(shown).toHaveAccessibleDescription("A copy was sent to the customer.");
    await userEvent.click(within(shown).getByText("A copy was sent to the customer."));
    await expect(args.onClick).toHaveBeenCalledTimes(1);
    await userEvent.keyboard("{F6}");
    await expect(await region()).toHaveFocus();
    await userEvent.tab();
    await expect(shown).toHaveFocus();
    await userEvent.keyboard("{Escape}");
    // Wait until the toast has left the DOM, not just started its exit: after F6 the viewport keeps
    // focus guards (aria-hidden, tabindex 0) while any toast remains, and the axe check that runs
    // after the play function flags them when the exit is still in progress (slow CI runners).
    await waitFor(() => expect(shown).not.toBeInTheDocument());
  },
};

const statuses = [
  ["neutral", "Draft restored"],
  ["success", "Invoice saved"],
  ["info", "A new version is available"],
  ["warning", "Your quota is almost full"],
  ["danger", "The payment failed"],
  ["loading", "Importing contacts"],
] as const;

function showStatuses(appearance?: ToastAppearance) {
  for (const [status, title] of statuses) {
    toast[status](title, {
      description: "A short explanation of what happened.",
      duration: Number.POSITIVE_INFINITY,
      appearance,
    });
  }
}

export const Statuses: Story = {
  render: () => (
    <Demo toaster={{ limit: 6, closeButton: true }}>
      <Show label="Show every status" onClick={() => showStatuses()} />
    </Demo>
  ),
  play: async ({ canvas }) => {
    await userEvent.click(canvas.getByRole("button", { name: "Show every status" }));
    await userEvent.hover(await findToast("Importing contacts"));
    for (const [status, title] of statuses) {
      await expect(await findToast(title)).toHaveAttribute("data-type", status);
    }
  },
};

export const Appearances: Story = {
  render: () => (
    <Demo toaster={{ limit: 6 }}>
      <Show label="Cards" onClick={() => showStatuses("card")} />
      <Show label="Tinted" onClick={() => showStatuses("tinted")} />
    </Demo>
  ),
  play: async ({ canvas }) => {
    await userEvent.click(canvas.getByRole("button", { name: "Tinted" }));
    await userEvent.hover(await findToast("Importing contacts"));
    await expect(await findToast("Invoice saved")).toHaveAttribute("data-appearance", "tinted");
  },
};

const positions: ToastPosition[] = [
  "top-start",
  "top-center",
  "top-end",
  "bottom-start",
  "bottom-center",
  "bottom-end",
];

function PositionsExample() {
  const [position, setPosition] = useState<ToastPosition>("bottom-end");
  return (
    <Demo toaster={{ position }}>
      {positions.map((entry) => (
        <Show
          key={entry}
          label={entry}
          onClick={() => {
            setPosition(entry);
            toast.info(`Shown at ${entry}`, { id: "position" });
          }}
        />
      ))}
    </Demo>
  );
}

export const Positions: Story = {
  render: () => <PositionsExample />,
  play: async ({ canvas }) => {
    await userEvent.click(canvas.getByRole("button", { name: "top-start" }));
    await findToast("Shown at top-start");
    const box = (await region()).getBoundingClientRect();
    await expect(box.top).toBeLessThan(window.innerHeight / 2);
    await expect(box.left).toBeLessThan(window.innerWidth / 2);
  },
};

const openInbox = fn();

export const ClickToAct: Story = {
  render: () => (
    <Demo>
      <Show
        label="New message"
        onClick={() =>
          toast.info("New message from Ada", {
            description: "Press anywhere to open it.",
            onClick: openInbox,
          })
        }
      />
    </Demo>
  ),
  play: async ({ canvas }) => {
    openInbox.mockClear();
    await userEvent.click(canvas.getByRole("button", { name: "New message" }));
    const shown = await findToast("New message from Ada");
    within(shown).getByRole("button", { name: "New message from Ada" }).focus();
    await userEvent.keyboard("{Enter}");
    await expect(openInbox).toHaveBeenCalledTimes(1);
    await waitFor(() => expect(toastCount()).toBe(0));
  },
};

export const Actions: Story = {
  render: () => (
    <Demo>
      <Show
        label="Delete item"
        onClick={() =>
          toast.neutral("Item deleted", {
            description: "You can still bring it back.",
            actions: [
              {
                label: "Undo",
                variant: "default",
                keepOpen: true,
                onClick: ({ id }) => toast.success("Item restored", { id }),
              },
              { label: "Dismiss", variant: "ghost" },
            ],
          })
        }
      />
    </Demo>
  ),
  play: async ({ canvas }) => {
    await userEvent.click(canvas.getByRole("button", { name: "Delete item" }));
    const shown = await findToast("Item deleted");
    await userEvent.click(within(shown).getByRole("button", { name: "Undo" }));
    await findToast("Item restored");
    await expect(toastCount()).toBe(1);
  },
};

const surveySchema = z.object({
  rating: z.string({ error: "Choose an answer." }),
  comment: z.string(),
});

/** A form inside a toast. Sending it replaces the same toast with a thank you. */
function Survey({ toastId }: { toastId: string }) {
  const form = useForm<{ rating: string | null; comment: string }>({
    resolver: zodResolver(surveySchema) as never,
    defaultValues: { rating: null, comment: "" },
  });
  return (
    <FormProvider {...form}>
      <form
        noValidate
        className="flex flex-col gap-3"
        onSubmit={form.handleSubmit(() => toast.success("Thanks for your answer", { id: toastId }))}
      >
        <RadioGroupControl
          name="rating"
          label="Was the import easy?"
          orientation="horizontal"
          options={[
            { value: "yes", label: "Yes" },
            { value: "no", label: "No" },
          ]}
        />
        <TextControl name="comment" label="Comment" />
        <Button type="submit" size="sm" className="self-start">
          Send
        </Button>
      </form>
    </FormProvider>
  );
}

export const Questionnaire: Story = {
  parameters: { docs: { story: { inline: false, iframeHeight: 460 } } },
  render: () => (
    <div className="min-h-96">
      <Demo>
        <Show
          label="Ask for feedback"
          onClick={() =>
            toast.info("One quick question", {
              duration: Number.POSITIVE_INFINITY,
              closeButton: true,
              content: ({ id }) => <Survey toastId={id} />,
            })
          }
        />
      </Demo>
    </div>
  ),
  play: async ({ canvas }) => {
    await userEvent.click(canvas.getByRole("button", { name: "Ask for feedback" }));
    const shown = await findToast("One quick question");
    await userEvent.click(within(shown).getByRole("radio", { name: "Yes" }));
    await userEvent.type(within(shown).getByRole("textbox", { name: "Comment" }), "Very clear");
    await userEvent.click(within(shown).getByRole("button", { name: "Send" }));
    await findToast("Thanks for your answer");
    await expect(toastCount()).toBe(1);
  },
};

export const LongText: Story = {
  parameters: { docs: { story: { inline: false, iframeHeight: 460 } } },
  render: () => (
    <div className="min-h-96">
      <Demo toaster={{ expandable: expandTexts, closeButton: true }}>
        <Show
          label="Show a long text"
          onClick={() => {
            toast.info("Older notice", { duration: Number.POSITIVE_INFINITY });
            toast.warning("Export finished", {
              description: longText,
              duration: Number.POSITIVE_INFINITY,
            });
          }}
        />
      </Demo>
    </div>
  ),
  play: async ({ canvas }) => {
    await userEvent.click(canvas.getByRole("button", { name: "Show a long text" }));
    const shown = await findToast("Export finished");
    await userEvent.hover(shown);
    const collapsed = shown.offsetHeight;
    const older = await findToast("Older notice");
    const olderTop = older.getBoundingClientRect().top;
    await userEvent.click(await within(shown).findByRole("button", { name: "Show more" }));
    await waitFor(() => expect(shown.offsetHeight).toBeGreaterThan(collapsed + 20));
    // The stack is laid out again: the older toast moves away from the taller one.
    await waitFor(() => expect(older.getBoundingClientRect().top).toBeLessThan(olderTop - 20));
    await userEvent.click(within(shown).getByRole("button", { name: "Show less" }));
    await waitFor(() => expect(shown.offsetHeight).toBeLessThan(collapsed + 2));
  },
};

export const Custom: Story = {
  render: () => (
    <Demo>
      <Show
        label="Incoming call"
        onClick={() =>
          toast.custom(
            ({ dismiss }) => (
              <div className="flex items-center gap-3 p-4">
                <PhoneIcon aria-hidden="true" className="size-5 text-success" />
                <p className="typography-label flex-1">Grace Hopper is calling</p>
                <Button size="sm" variant="destructive" onClick={dismiss}>
                  Reject
                </Button>
              </div>
            ),
            { "aria-label": "Incoming call" },
          )
        }
      />
    </Demo>
  ),
  play: async ({ canvas }) => {
    await userEvent.click(canvas.getByRole("button", { name: "Incoming call" }));
    const call = await screen().findByRole("dialog", { name: "Incoming call" });
    await userEvent.click(within(call).getByRole("button", { name: "Reject" }));
    await waitFor(() => expect(toastCount()).toBe(0));
  },
};

/** A request that takes a moment and then resolves or rejects. */
const request = (succeeds: boolean) =>
  new Promise<string>((resolve, reject) => {
    setTimeout(
      () => (succeeds ? resolve("F-2031") : reject(new Error("The server did not answer."))),
      300,
    );
  });

function save(succeeds: boolean) {
  toast.promise(request(succeeds), {
    loading: "Saving the invoice",
    success: (number) => ({ title: "Invoice saved", description: number }),
    danger: (error) => ({
      title: "The invoice was not saved",
      description: (error as Error).message,
    }),
  });
}

export const PromiseFlow: Story = {
  render: () => (
    <Demo>
      <Show label="Save" onClick={() => save(true)} />
      <Show label="Save and fail" onClick={() => save(false)} />
    </Demo>
  ),
  play: async ({ canvas }) => {
    await userEvent.click(canvas.getByRole("button", { name: "Save" }));
    await findToast("Saving the invoice");
    await findToast("Invoice saved");
    await expect(toastCount()).toBe(1);
  },
};

function upload() {
  const id = toast.loading("Uploading", { description: "0%" });
  let done = 0;
  const timer = setInterval(() => {
    done += 25;
    if (done < 100) {
      toast.update(id, { description: `${done}%` });
      return;
    }
    clearInterval(timer);
    toast.success("Upload complete", { id });
  }, 150);
}

export const Progress: Story = {
  render: () => (
    <Demo>
      <Show label="Upload" onClick={upload} />
    </Demo>
  ),
  play: async ({ canvas }) => {
    await userEvent.click(canvas.getByRole("button", { name: "Upload" }));
    await findToast("Uploading");
    await findToast("Upload complete");
    await expect(toastCount()).toBe(1);
  },
};

/** Calls `toast` from its first effect, before the Toaster after it has mounted. */
function EarlyCaller() {
  useEffect(() => {
    toast.info("Welcome back", { id: "welcome" });
  }, []);
  return null;
}

export const Queue: Story = {
  render: () => (
    <div className="min-h-48">
      <EarlyCaller />
      <Toaster label="Notifications" />
    </div>
  ),
  play: async () => {
    await findToast("Welcome back");
  },
};

const undo = fn();

export const WithModal: Story = {
  parameters: { docs: { story: { inline: false, iframeHeight: 520 } } },
  render: () => (
    <div className="min-h-96">
      <Demo>
        <Modal mode="dialog">
          <ModalTrigger asChild>
            <Button variant="outline">Open editor</Button>
          </ModalTrigger>
          <ModalContent closeButton closeLabel="Close editor">
            <ModalHeader>
              <ModalTitle>Editor</ModalTitle>
            </ModalHeader>
            <ModalBody>
              <Button
                onClick={() =>
                  toast.success("Changes saved", {
                    duration: Number.POSITIVE_INFINITY,
                    actions: [{ label: "Undo", onClick: undo }],
                  })
                }
              >
                Save
              </Button>
            </ModalBody>
          </ModalContent>
        </Modal>
      </Demo>
    </div>
  ),
  play: async ({ canvas }) => {
    undo.mockClear();
    await userEvent.click(canvas.getByRole("button", { name: "Open editor" }));
    const panel = await screen().findByRole("dialog", { name: "Editor" });
    await userEvent.click(within(panel).getByRole("button", { name: "Save" }));
    const shown = await findToast("Changes saved");
    await userEvent.click(within(shown).getByRole("button", { name: "Undo", hidden: true }), {
      pointerEventsCheck: 0,
    });
    await expect(undo).toHaveBeenCalledTimes(1);
    await expect(panel).toBeInTheDocument();
  },
};

export const Rtl: Story = {
  globals: { direction: "rtl" },
  render: () => (
    <Demo toaster={{ label: "Notifications", closeButton: true, closeLabel: "إغلاق" }}>
      <Show
        label="عرض إشعار"
        onClick={() =>
          toast.success("تم حفظ الفاتورة", {
            description: "أُرسلت نسخة إلى العميل.",
            duration: Number.POSITIVE_INFINITY,
          })
        }
      />
    </Demo>
  ),
  play: async ({ canvas }) => {
    await userEvent.click(canvas.getByRole("button", { name: "عرض إشعار" }));
    await findToast("تم حفظ الفاتورة");
    const box = (await region()).getBoundingClientRect();
    // `end` is the left side in right-to-left pages.
    await expect(box.left).toBeLessThan(window.innerWidth / 2);
  },
};
