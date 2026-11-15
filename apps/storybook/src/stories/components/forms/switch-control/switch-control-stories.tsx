import { SwitchControl } from "@aureus-core/ui/components/switch-control";
import { SwitchField } from "@aureus-core/ui/components/switch-field";
import { Button } from "@aureus-core/ui/shadcn/button";
import { zodResolver } from "@hookform/resolvers/zod";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { type ComponentType, type ReactNode, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { expect, fn, userEvent, waitFor } from "storybook/test";
import { z } from "zod";
import { docs } from "./switch-control-docs";

const schema = z.object({
  consent: z.literal(true, { error: "Turn on the consent to continue." }),
  alerts: z.boolean(),
  visibility: z.enum(["public", "private"]),
  sync: z.boolean(),
  managed: z.boolean(),
  sounds: z.boolean(),
});

/** Every story except `WithSchema` accepts the consent off. */
const lenientSchema = schema.extend({ consent: z.boolean() });

type Settings = z.infer<typeof lenientSchema>;

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * The form every story renders into: one `useForm` with a schema resolver, a `FormProvider` and a
 * submit button. The last submitted payload is printed below, to show what the form stores.
 */
function DemoForm({ children, strict }: { children: ReactNode; strict?: boolean }) {
  const form = useForm<Settings>({
    resolver: zodResolver(strict ? schema : lenientSchema) as never,
    defaultValues: {
      consent: false,
      alerts: false,
      visibility: "private",
      sync: true,
      managed: true,
      sounds: false,
    },
    mode: "onTouched",
  });
  const [payload, setPayload] = useState<string>();

  return (
    <FormProvider {...form}>
      <form
        noValidate
        className="flex w-full max-w-sm flex-col gap-6"
        onSubmit={form.handleSubmit((values) => setPayload(JSON.stringify(values)))}
      >
        {children}
        <Button type="submit" className="self-start">
          Save
        </Button>
        {payload ? (
          <output aria-label="Submitted data" className="font-mono text-xs break-all">
            {payload}
          </output>
        ) : null}
      </form>
    </FormProvider>
  );
}

/** Flat args for the boolean Playground, bound to `alerts`. */
type StoryArgs = {
  name: "alerts";
  label?: string;
  switchLabel: string;
  helperText?: string;
  switchPosition: "start" | "end";
  appearance: "plain" | "card";
  size: "default" | "sm";
  required?: boolean;
  loading?: boolean;
  disabled?: boolean;
  onValueChange: (value: boolean) => void;
};

const meta = {
  title: "components/Forms/Switch Control",
  component: SwitchControl as unknown as ComponentType<StoryArgs>,
  parameters: { aureusDocs: docs },
  decorators: [
    (Story, { parameters }) => (
      <DemoForm strict={parameters.strictSchema === true}>
        <Story />
      </DemoForm>
    ),
  ],
  render: (args) => <SwitchControl {...args} />,
  args: {
    name: "alerts",
    switchLabel: "Email alerts",
    helperText: "About activity on your account.",
    switchPosition: "start",
    appearance: "plain",
    size: "default",
    onValueChange: fn(),
  },
  argTypes: {
    name: { control: false, table: { category: "Behavior" } },
    label: { control: "text", table: { category: "Content" } },
    switchLabel: { control: "text", table: { category: "Content" } },
    helperText: { control: "text", table: { category: "Content" } },
    switchPosition: {
      control: "inline-radio",
      options: ["start", "end"],
      table: { category: "Appearance" },
    },
    appearance: {
      control: "inline-radio",
      options: ["plain", "card"],
      table: { category: "Appearance" },
    },
    size: {
      control: "inline-radio",
      options: ["default", "sm"],
      table: { category: "Appearance" },
    },
    required: { control: "boolean", table: { category: "State" } },
    loading: { control: "boolean", table: { category: "State" } },
    disabled: { control: "boolean", table: { category: "State" } },
    onValueChange: { table: { category: "Events" } },
  },
} satisfies Meta<StoryArgs>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Bound to `alerts`. The submitted value is a boolean. */
export const Playground: Story = {
  play: async ({ canvas }) => {
    await userEvent.click(canvas.getByRole("switch", { name: "Email alerts" }));
    await userEvent.click(canvas.getByRole("button", { name: "Save" }));
    const payload = await canvas.findByRole("status", { name: "Submitted data" });
    await expect(payload).toHaveTextContent('"alerts":true');
  },
};

export const WithSchema: Story = {
  parameters: { strictSchema: true },
  render: () => (
    <>
      <SwitchControl name="consent" switchLabel="Share anonymous usage data" required />
      <SwitchControl name="alerts" label="Notifications" switchLabel="Email alerts" />
    </>
  ),
  play: async ({ canvas }) => {
    const consent = canvas.getByRole("switch", { name: /^Share anonymous usage data/ });
    await userEvent.click(canvas.getByRole("button", { name: "Save" }));
    await waitFor(() => expect(consent).toHaveAttribute("aria-invalid", "true"));
    await expect(canvas.getByRole("alert")).toHaveTextContent("Turn on the consent to continue.");
    await expect(consent).toHaveFocus();
    await userEvent.keyboard(" ");
    await userEvent.click(canvas.getByRole("button", { name: "Save" }));
    const payload = await canvas.findByRole("status", { name: "Submitted data" });
    await expect(payload).toHaveTextContent('"consent":true');
  },
};

export const CustomValues: Story = {
  render: () => (
    <SwitchControl
      name="visibility"
      label="Visibility"
      switchLabel="Public profile"
      checkedValue="public"
      uncheckedValue="private"
      stateLabels={{ on: "Public", off: "Private" }}
    />
  ),
  play: async ({ canvas }) => {
    await userEvent.click(canvas.getByRole("switch", { name: "Public profile" }));
    await userEvent.click(canvas.getByRole("button", { name: "Save" }));
    const payload = await canvas.findByRole("status", { name: "Submitted data" });
    await expect(payload).toHaveTextContent('"visibility":"public"');
  },
};

export const AsyncSave: Story = {
  render: () => (
    <>
      <SwitchControl
        name="alerts"
        switchLabel="Email alerts (saves)"
        onBeforeChange={async () => {
          await wait(400);
          return true;
        }}
      />
      <SwitchControl
        name="sounds"
        switchLabel="Sounds (save fails)"
        onBeforeChange={async () => {
          await wait(400);
          return false;
        }}
      />
    </>
  ),
  play: async ({ canvas }) => {
    const alerts = canvas.getByRole("switch", { name: "Email alerts (saves)" });
    const sounds = canvas.getByRole("switch", { name: "Sounds (save fails)" });
    await userEvent.click(alerts);
    await waitFor(() => expect(alerts).toHaveAttribute("aria-checked", "true"), { timeout: 3000 });
    await userEvent.click(sounds);
    await waitFor(() => expect(sounds).not.toHaveAttribute("aria-busy"), { timeout: 3000 });
    await userEvent.click(canvas.getByRole("button", { name: "Save" }));
    const payload = await canvas.findByRole("status", { name: "Submitted data" });
    await expect(payload).toHaveTextContent('"alerts":true');
    await expect(payload).toHaveTextContent('"sounds":false');
  },
};

export const DisabledVsLoading: Story = {
  render: () => (
    <>
      <SwitchControl name="alerts" switchLabel="Email alerts" />
      <SwitchControl
        name="sync"
        switchLabel="Sync settings (loading)"
        loading
        helperText="Still submitted."
      />
      <SwitchControl
        name="managed"
        switchLabel="Managed by your organization (disabled)"
        disabled
        helperText="Left out."
      />
    </>
  ),
  play: async ({ canvas }) => {
    await userEvent.click(canvas.getByRole("button", { name: "Save" }));
    const payload = await canvas.findByRole("status", { name: "Submitted data" });
    await expect(payload).toHaveTextContent('"sync":true');
    await expect(payload).not.toHaveTextContent("managed");
  },
};

const shared = {
  label: "Notifications",
  switchLabel: "Email alerts",
  helperText: "About activity on your account.",
  required: true,
  appearance: "card",
} as const;

export const Parity: Story = {
  render: () => (
    <div className="grid gap-6 sm:grid-cols-2">
      <div className="flex flex-col gap-2">
        <span className="text-xs font-medium text-muted-foreground">SwitchField</span>
        <SwitchField {...shared} id="parity-field" name="alerts" value={false} />
      </div>
      <div className="flex flex-col gap-2">
        <span className="text-xs font-medium text-muted-foreground">SwitchControl</span>
        <SwitchControl {...shared} id="parity-control" name="alerts" />
      </div>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const [field, control] = [...canvasElement.querySelectorAll("[data-slot=field]")];
    const normalize = (element: Element | undefined, id: string) =>
      element?.outerHTML.split(id).join("ID");
    await expect(normalize(control, "parity-control")).toBe(normalize(field, "parity-field"));
  },
};
