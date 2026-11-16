import { SwitchField } from "@aureus-core/ui/components/switch-field";
import { Switch } from "@aureus-core/ui/shadcn/switch";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { CheckIcon, XIcon } from "lucide-react";
import { type ComponentType, type MouseEvent, useState } from "react";
import { expect, fn, userEvent, waitFor, within } from "storybook/test";
import { type ActionArgs, actionArgs, actionArgTypes, splitActionArgs } from "../field-action-args";
import { infoTexts } from "../story-args";
import { docs } from "./switch-field-docs";

/** Flat, story-only args; the render builds the value and async props from the modes. */
interface PlaygroundArgs extends ActionArgs {
  label: string;
  switchLabel: string;
  helperText: string;
  info: string;
  infoLabel: string;
  errorMessage: string;
  stateOn: string;
  stateOff: string;
  valueMode: "boolean" | "public / private";
  asyncMode: "off" | "confirm after 800 ms" | "reject after 800 ms";
  switchPosition: "start" | "end";
  appearance: "plain" | "card";
  size: "default" | "sm";
  thumbIcons: boolean;
  required: boolean;
  loading: boolean;
  disabled: boolean;
  error: boolean;
  onValueChange: (value: unknown) => void;
}

const text = (value: string) => (value === "" ? undefined : value);
const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
const style = (element: Element) => getComputedStyle(element);
const stayOnPage = (event: MouseEvent) => event.preventDefault();

function PlaygroundRender(args: PlaygroundArgs) {
  const [base, action] = splitActionArgs(args);
  const guard =
    base.asyncMode === "off"
      ? undefined
      : async () => {
          await wait(800);
          return base.asyncMode === "confirm after 800 ms";
        };
  const common = {
    label: text(base.label),
    switchLabel: text(base.switchLabel),
    helperText: text(base.helperText),
    ...infoTexts(base.info, base.infoLabel),
    errorMessage: text(base.errorMessage),
    stateLabels:
      base.stateOn && base.stateOff ? { on: base.stateOn, off: base.stateOff } : undefined,
    thumbIcons: base.thumbIcons ? { on: <CheckIcon />, off: <XIcon /> } : undefined,
    switchPosition: base.switchPosition,
    appearance: base.appearance,
    size: base.size,
    required: base.required,
    loading: base.loading,
    disabled: base.disabled,
    error: base.error,
    action,
    onBeforeChange: guard,
  };
  return base.valueMode === "boolean" ? (
    <SwitchField {...common} onValueChange={base.onValueChange} />
  ) : (
    <SwitchField
      {...common}
      checkedValue="public"
      uncheckedValue="private"
      onValueChange={base.onValueChange}
    />
  );
}

const content = { table: { category: "Content" } };
const behavior = { table: { category: "Behavior" } };
const layout = { table: { category: "Appearance" } };
const state = { table: { category: "State" } };

const meta = {
  title: "components/Forms/Switch Field",
  component: SwitchField as unknown as ComponentType<PlaygroundArgs>,
  parameters: { aureusDocs: docs },
  decorators: [
    (Story) => (
      <div className="w-full max-w-sm">
        <Story />
      </div>
    ),
  ],
  render: (args) => <PlaygroundRender {...args} />,
  args: {
    label: "",
    switchLabel: "Email notifications",
    helperText: "",
    info: "",
    infoLabel: "More information",
    errorMessage: "",
    stateOn: "",
    stateOff: "",
    valueMode: "boolean",
    asyncMode: "off",
    switchPosition: "start",
    appearance: "plain",
    size: "default",
    thumbIcons: false,
    required: false,
    loading: false,
    disabled: false,
    error: false,
    onValueChange: fn(),
    ...actionArgs,
    showAction: false,
  },
  argTypes: {
    label: { control: "text", ...content },
    switchLabel: { control: "text", ...content },
    helperText: { control: "text", ...content },
    info: { control: "text", ...content },
    infoLabel: { control: "text", ...content },
    errorMessage: { control: "text", ...content },
    stateOn: { control: "text", name: "stateLabels.on", ...layout },
    stateOff: { control: "text", name: "stateLabels.off", ...layout },
    valueMode: { control: "inline-radio", options: ["boolean", "public / private"], ...behavior },
    asyncMode: {
      control: "inline-radio",
      options: ["off", "confirm after 800 ms", "reject after 800 ms"],
      name: "onBeforeChange",
      ...behavior,
    },
    switchPosition: { control: "inline-radio", options: ["start", "end"], ...layout },
    appearance: { control: "inline-radio", options: ["plain", "card"], ...layout },
    size: { control: "inline-radio", options: ["default", "sm"], ...layout },
    thumbIcons: { control: "boolean", ...layout },
    required: { control: "boolean", ...state },
    loading: { control: "boolean", ...state },
    disabled: { control: "boolean", ...state },
    error: { control: "boolean", ...state },
    ...actionArgTypes,
    onValueChange: { table: { category: "Events" } },
  },
} satisfies Meta<PlaygroundArgs>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Every option has a control; the async mode simulates a save that confirms or fails. */
export const Playground: Story = {
  play: async ({ args, canvas }) => {
    await userEvent.click(canvas.getByRole("switch", { name: "Email notifications" }));
    await expect(args.onValueChange).toHaveBeenLastCalledWith(true);
  },
};

export const Basic: Story = {
  render: () => <SwitchField switchLabel="Email notifications" />,
  play: async ({ canvas }) => {
    const sw = canvas.getByRole("switch", { name: "Email notifications" });
    await userEvent.click(canvas.getByText("Email notifications"));
    await expect(sw).toHaveAttribute("aria-checked", "true");
    await expect(style(sw).backgroundColor).not.toBe("rgba(0, 0, 0, 0)");
  },
};

export const LabelAndText: Story = {
  render: () => (
    <SwitchField
      infoLabel="More information"
      label="Notifications"
      switchLabel="Weekly digest by email"
      helperText="Sent on Mondays."
      info="You can unsubscribe from any email."
    />
  ),
  play: async ({ canvas }) => {
    const group = canvas.getByRole("group", { name: "Notifications" });
    await expect(
      within(group).getByRole("switch", { name: "Weekly digest by email" }),
    ).toHaveAccessibleDescription(/Sent on Mondays\./);
  },
};

export const SettingsList: Story = {
  render: () => (
    <div className="flex flex-col divide-y">
      {[
        ["Compact mode", "Reduces the space between rows."],
        ["Show week numbers", undefined],
        ["Play sounds", "For messages and reminders."],
      ].map(([title, help], index) => (
        <SwitchField
          key={title}
          className="py-3"
          switchLabel={title}
          helperText={help}
          switchPosition="end"
          size="sm"
          defaultValue={index === 1}
        />
      ))}
    </div>
  ),
  play: async ({ canvasElement }) => {
    const row = canvasElement.querySelector("[data-slot=switch-row]") as HTMLElement;
    const sw = row.querySelector("[data-slot=switch]") as HTMLElement;
    const label = row.querySelector("[data-slot=switch-label]") as HTMLElement;
    await expect(sw.getBoundingClientRect().left).toBeGreaterThan(
      label.getBoundingClientRect().left,
    );
  },
};

export const Cards: Story = {
  render: () => (
    <div className="flex flex-col gap-3">
      <SwitchField
        switchLabel="Two-factor authentication"
        helperText="Ask for a code on new devices."
        appearance="card"
        defaultValue
      />
      <SwitchField switchLabel="Login alerts" appearance="card" />
    </div>
  ),
  play: async ({ canvasElement, canvas }) => {
    const [on, off] = [...canvasElement.querySelectorAll<HTMLElement>("[data-slot=switch-row]")];
    if (!on || !off) throw new Error("cards not rendered");
    await expect(style(on).borderColor).not.toBe(style(off).borderColor);
    await userEvent.click(off);
    await expect(canvas.getByRole("switch", { name: "Login alerts" })).toHaveAttribute(
      "aria-checked",
      "true",
    );
  },
};

export const StateLabels: Story = {
  render: () => <SwitchField switchLabel="Public profile" stateLabels={{ on: "Yes", off: "No" }} />,
  play: async ({ canvas }) => {
    const sw = canvas.getByRole("switch", { name: "Public profile" });
    await expect(style(canvas.getByText("No")).visibility).toBe("visible");
    await userEvent.click(sw);
    await expect(style(canvas.getByText("Yes")).visibility).toBe("visible");
    await expect(style(canvas.getByText("No")).visibility).toBe("hidden");
  },
};

export const ThumbIcons: Story = {
  render: () => (
    <SwitchField
      switchLabel="Auto-save"
      thumbIcons={{ on: <CheckIcon />, off: <XIcon /> }}
      defaultValue
    />
  ),
};

function CustomValuesExample() {
  const [value, setValue] = useState<"public" | "private">("private");
  return (
    <div className="flex flex-col gap-3">
      <SwitchField
        label="Visibility"
        switchLabel="Public profile"
        checkedValue="public"
        uncheckedValue="private"
        value={value}
        onValueChange={setValue}
      />
      <output aria-label="Stored value" className="font-mono text-xs">
        {JSON.stringify(value)}
      </output>
    </div>
  );
}

export const CustomValues: Story = {
  render: () => <CustomValuesExample />,
  play: async ({ canvas }) => {
    await userEvent.click(canvas.getByRole("switch", { name: "Public profile" }));
    await expect(canvas.getByRole("status", { name: "Stored value" })).toHaveTextContent(
      '"public"',
    );
  },
};

export const AsyncChange: Story = {
  render: () => (
    <div className="flex flex-col gap-6">
      <SwitchField
        switchLabel="Save succeeds"
        helperText="Saved on the server after a short delay."
        onBeforeChange={async () => {
          await wait(600);
          return true;
        }}
      />
      <SwitchField
        switchLabel="Save fails"
        helperText="The server rejects the change; the switch goes back."
        onBeforeChange={async () => {
          await wait(600);
          throw new Error("Network error");
        }}
      />
    </div>
  ),
  play: async ({ canvas, canvasElement }) => {
    const ok = canvas.getByRole("switch", { name: "Save succeeds" });
    await userEvent.click(ok);
    await expect(ok).toHaveAttribute("aria-busy", "true");
    await expect(ok).toHaveAttribute("aria-checked", "false");
    await expect(canvasElement.querySelector("[data-slot=switch-spinner]")).not.toBeNull();
    await waitFor(() => expect(ok).toHaveAttribute("aria-checked", "true"), { timeout: 3000 });
    const fail = canvas.getByRole("switch", { name: "Save fails" });
    await userEvent.click(fail);
    await expect(fail).toHaveAttribute("aria-busy", "true");
    await waitFor(() => expect(fail).not.toHaveAttribute("aria-busy"), { timeout: 3000 });
    await expect(fail).toHaveAttribute("aria-checked", "false");
  },
};

export const Keyboard: Story = {
  render: () => <SwitchField switchLabel="Dark mode" />,
  play: async ({ canvas }) => {
    const sw = canvas.getByRole("switch", { name: "Dark mode" });
    await userEvent.tab();
    await expect(sw).toHaveFocus();
    await userEvent.keyboard(" ");
    await expect(sw).toHaveAttribute("aria-checked", "true");
    await userEvent.keyboard("{Enter}");
    await expect(sw).toHaveAttribute("aria-checked", "false");
  },
};

export const States: Story = {
  render: () => (
    <div className="flex flex-col gap-6">
      <SwitchField
        infoLabel="More information"
        label="Consent"
        switchLabel="Share anonymous usage data"
        required
        info="Helps us improve the product."
        action={{ children: "Details", onClick: fn() }}
      />
      <SwitchField switchLabel="Weekly digest" helperText="Sent on Mondays." />
      <SwitchField
        switchLabel="I accept the terms"
        error
        errorMessage="Turn this on to continue."
      />
      <SwitchField switchLabel="Syncing settings" loading defaultValue />
      <SwitchField switchLabel="Managed by your organization" disabled defaultValue />
    </div>
  ),
  play: async ({ canvas }) => {
    await expect(canvas.getByRole("alert")).toHaveTextContent("Turn this on to continue.");
    await expect(canvas.getByRole("switch", { name: "Syncing settings" })).toHaveAttribute(
      "aria-busy",
      "true",
    );
    // A disabled action next to it must not dim an enabled switch.
    await expect(
      style(canvas.getByRole("switch", { name: /^Share anonymous usage data/ })).opacity,
    ).toBe("1");
  },
};

export const Rtl: Story = {
  render: () => (
    <div dir="rtl" className="flex flex-col gap-4">
      <SwitchField switchLabel="On (RTL)" defaultValue />
      <SwitchField switchLabel="Off (RTL)" />
    </div>
  ),
  play: async ({ canvas }) => {
    const thumbOf = (name: string) =>
      canvas.getByRole("switch", { name }).querySelector("[data-slot=switch-thumb]") as HTMLElement;
    const on = canvas.getByRole("switch", { name: "On (RTL)" });
    // On is at the inline end: the left of the track in RTL.
    const onTrack = on.getBoundingClientRect();
    const onThumb = thumbOf("On (RTL)").getBoundingClientRect();
    await expect(onThumb.left - onTrack.left).toBeLessThan(onTrack.right - onThumb.right);
    const off = canvas.getByRole("switch", { name: "Off (RTL)" }).getBoundingClientRect();
    const offThumb = thumbOf("Off (RTL)").getBoundingClientRect();
    await expect(off.right - offThumb.right).toBeLessThan(offThumb.left - off.left);
  },
};

export const Responsive: Story = {
  decorators: [
    (Story) => (
      <div className="w-56 border border-dashed p-2">
        <Story />
      </div>
    ),
  ],
  render: () => (
    <SwitchField
      switchLabel={
        <>
          Allow partners to contact me about offers (
          <a href="/legal/partners" onClick={stayOnPage} className="underline">
            list
          </a>
          )
        </>
      }
      helperText="You can turn it off at any time."
    />
  ),
  play: async ({ canvas, canvasElement }) => {
    const field = canvasElement.querySelector("[data-slot=field]") as HTMLElement;
    await expect(field.scrollWidth).toBeLessThanOrEqual(field.clientWidth);
    await userEvent.click(canvas.getByRole("link", { name: "list" }));
    await expect(canvas.getByRole("switch")).toHaveAttribute("aria-checked", "false");
  },
};

/** Drift guard: the switch must keep looking like shadcn's `Switch` (sizes and colours). */
export const ShadcnParity: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      {(["default", "sm"] as const).map((size) => (
        <div key={size} className="flex items-center gap-6">
          <Switch aria-label={`shadcn ${size}`} size={size} defaultChecked />
          <SwitchField aria-label={`field ${size}`} size={size} defaultValue />
          <Switch aria-label={`shadcn ${size} off`} size={size} />
          <SwitchField aria-label={`field ${size} off`} size={size} />
        </div>
      ))}
    </div>
  ),
  play: async ({ canvas }) => {
    const props = ["width", "height", "backgroundColor", "borderRadius"] as const;
    for (const suffix of ["default", "sm", "default off", "sm off"]) {
      const shadcn = canvas.getByRole("switch", { name: `shadcn ${suffix}` });
      const field = canvas.getByRole("switch", { name: `field ${suffix}` });
      for (const prop of props) await expect(style(field)[prop]).toBe(style(shadcn)[prop]);
      const thumb = (el: HTMLElement) =>
        el.querySelector("[data-slot=switch-thumb]") as HTMLElement;
      for (const prop of ["width", "height", "transform", "backgroundColor"] as const) {
        await expect(style(thumb(field))[prop]).toBe(style(thumb(shadcn))[prop]);
      }
    }
  },
};
