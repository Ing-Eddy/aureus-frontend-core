import { OtpField } from "@aureus-core/ui/components/otp-field";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { type ComponentType, useEffect, useState } from "react";
import { expect, fn, userEvent, waitFor } from "storybook/test";
import { type ActionArgs, actionArgs, actionArgTypes, splitActionArgs } from "../field-action-args";
import { infoTexts, loadingTexts } from "../story-args";
import { docs } from "./otp-field-docs";

/** Flat, story-only args; the render builds `groups` and `reveal` from them. */
interface PlaygroundArgs extends ActionArgs {
  label: string;
  helperText: string;
  info: string;
  infoLabel: string;
  errorMessage: string;
  length: number;
  charset: "digits" | "letters" | "alphanumeric";
  uppercase: boolean;
  groups: "none" | "3-3" | "2-2-2";
  masked: boolean;
  showLabel: string;
  hideLabel: string;
  required: boolean;
  loading: boolean;
  loadingLabel: string;
  disabled: boolean;
  error: boolean;
  onValueChange: (value: string) => void;
  onComplete: (code: string) => void;
}

const text = (value: string) => (value === "" ? undefined : value);
const style = (element: Element) => getComputedStyle(element);
const slotsOf = (root: Element) => [...root.querySelectorAll("[data-slot=input-otp-slot]")];
const slotTexts = (root: Element) => slotsOf(root).map((slot) => slot.textContent ?? "");
const groupOptions = { none: undefined, "3-3": [3, 3], "2-2-2": [2, 2, 2] } as const;

const content = { table: { category: "Content" } };
const behavior = { table: { category: "Behavior" } };
const state = { table: { category: "State" } };

const meta = {
  title: "components/Forms/OTP Field",
  component: OtpField as unknown as ComponentType<PlaygroundArgs>,
  parameters: { aureusDocs: docs },
  decorators: [
    (Story) => (
      <div className="w-full max-w-sm">
        <Story />
      </div>
    ),
  ],
  render: (args) => {
    const [base, action] = splitActionArgs(args);
    return (
      <OtpField
        label={text(base.label)}
        helperText={text(base.helperText)}
        {...infoTexts(base.info, base.infoLabel)}
        errorMessage={text(base.errorMessage)}
        length={base.length}
        charset={base.charset}
        uppercase={base.uppercase}
        groups={groupOptions[base.groups]}
        masked={base.masked}
        reveal={
          base.showLabel && base.hideLabel
            ? { showLabel: base.showLabel, hideLabel: base.hideLabel }
            : undefined
        }
        required={base.required}
        {...loadingTexts(base.loading, base.loadingLabel)}
        disabled={base.disabled}
        error={base.error}
        action={action}
        onValueChange={base.onValueChange}
        onComplete={base.onComplete}
      />
    );
  },
  args: {
    label: "Verification code",
    helperText: "",
    info: "",
    infoLabel: "More information",
    errorMessage: "",
    length: 6,
    charset: "digits",
    uppercase: false,
    groups: "none",
    masked: false,
    showLabel: "",
    hideLabel: "",
    required: false,
    loading: false,
    loadingLabel: "Loading",
    disabled: false,
    error: false,
    onValueChange: fn(),
    onComplete: fn(),
    ...actionArgs,
    showAction: false,
  },
  argTypes: {
    label: { control: "text", ...content },
    helperText: { control: "text", ...content },
    info: { control: "text", ...content },
    infoLabel: { control: "text", ...content },
    errorMessage: { control: "text", ...content },
    length: { control: { type: "number", min: 1, max: 10 }, ...behavior },
    charset: {
      control: "inline-radio",
      options: ["digits", "letters", "alphanumeric"],
      ...behavior,
    },
    uppercase: { control: "boolean", ...behavior },
    groups: { control: "inline-radio", options: ["none", "3-3", "2-2-2"], ...behavior },
    masked: { control: "boolean", ...behavior },
    showLabel: { control: "text", name: "reveal.showLabel", ...behavior },
    hideLabel: { control: "text", name: "reveal.hideLabel", ...behavior },
    required: { control: "boolean", ...state },
    loading: { control: "boolean", ...state },
    loadingLabel: { control: "text", ...content },
    disabled: { control: "boolean", ...state },
    error: { control: "boolean", ...state },
    ...actionArgTypes,
    onValueChange: { table: { category: "Events" } },
    onComplete: { table: { category: "Events" } },
  },
} satisfies Meta<PlaygroundArgs>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Every option has a control; the reveal texts start empty, so no toggle is shown. */
export const Playground: Story = {
  play: async ({ args, canvas }) => {
    await userEvent.click(canvas.getByRole("textbox", { name: "Verification code" }));
    await userEvent.keyboard("123456");
    await expect(args.onComplete).toHaveBeenCalledWith("123456");
  },
};

export const Basic: Story = {
  render: () => <OtpField label="Verification code" length={6} helperText="We sent it by SMS." />,
  play: async ({ canvas, canvasElement }) => {
    const input = canvas.getByRole("textbox", { name: "Verification code" });
    await userEvent.click(input);
    await userEvent.keyboard("4821");
    await expect(slotTexts(canvasElement)).toEqual(["4", "8", "2", "1", "", ""]);
    // The active box shows the ring (computed style, not just the attribute).
    const active = canvasElement.querySelector("[data-slot=input-otp-slot][data-active=true]");
    if (!active) throw new Error("no active slot");
    await expect(style(active).boxShadow).not.toBe("none");
  },
};

export const Paste: Story = {
  render: () => <OtpField label="Verification code" length={6} />,
  play: async ({ canvas, canvasElement }) => {
    await userEvent.click(canvas.getByRole("textbox", { name: "Verification code" }));
    await userEvent.paste("123 456");
    await expect(slotTexts(canvasElement)).toEqual(["1", "2", "3", "4", "5", "6"]);
  },
};

export const Groups: Story = {
  render: () => <OtpField label="Verification code" length={6} groups={[3, 3]} />,
  play: async ({ canvasElement }) => {
    await expect(canvasElement.querySelectorAll("[data-slot=input-otp-group]")).toHaveLength(2);
    await expect(canvasElement.querySelectorAll("[data-slot=input-otp-separator]")).toHaveLength(1);
  },
};

export const Alphanumeric: Story = {
  render: () => (
    <OtpField label="Recovery code" length={6} groups={[3, 3]} charset="alphanumeric" uppercase />
  ),
  play: async ({ canvas, canvasElement }) => {
    const input = canvas.getByRole("textbox", { name: "Recovery code" });
    await expect(input).toHaveAttribute("inputmode", "text");
    await userEvent.click(input);
    await userEvent.keyboard("ab12cd");
    await expect(slotTexts(canvasElement)).toEqual(["A", "B", "1", "2", "C", "D"]);
  },
};

export const MaskedPin: Story = {
  render: () => (
    <div className="flex flex-col gap-6">
      <OtpField label="PIN" length={4} masked defaultValue="1234" />
      <OtpField
        label="PIN with toggle"
        length={4}
        masked
        reveal={{ showLabel: "Show PIN", hideLabel: "Hide PIN" }}
        defaultValue="5678"
      />
      <OtpField label="Plain reference" length={4} defaultValue="1234" />
    </div>
  ),
  play: async ({ canvas, canvasElement }) => {
    const [masked, , plain] = [...canvasElement.querySelectorAll("[data-slot=field]")];
    if (!masked || !plain) throw new Error("fields not rendered");
    await expect(slotTexts(masked)).toEqual(["•", "•", "•", "•"]);
    // The masked input is a password but keeps the one-time-code hint.
    const maskedInput = masked.querySelector("input") as HTMLInputElement;
    await expect(maskedInput).toHaveAttribute("type", "password");
    await expect(maskedInput).toHaveAttribute("autocomplete", "one-time-code");
    // Our masked box keeps shadcn's look.
    const [maskedSlot] = slotsOf(masked);
    const [plainSlot] = slotsOf(plain);
    if (!maskedSlot || !plainSlot) throw new Error("slots not rendered");
    for (const prop of ["width", "height", "borderTopWidth", "borderTopLeftRadius"] as const) {
      await expect(style(maskedSlot)[prop]).toBe(style(plainSlot)[prop]);
    }
    await userEvent.click(canvas.getByRole("button", { name: "Show PIN" }));
    await expect(canvas.getByRole("button", { name: "Hide PIN" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
  },
};

function ResendExample() {
  const [seconds, setSeconds] = useState(30);
  useEffect(() => {
    if (seconds === 0) return;
    const timer = setTimeout(() => setSeconds((value) => value - 1), 1000);
    return () => clearTimeout(timer);
  }, [seconds]);
  return (
    <OtpField
      label="Verification code"
      length={6}
      helperText="We sent it to +34 600 000 000."
      action={{
        children: seconds > 0 ? `Resend in ${seconds}s` : "Resend code",
        disabled: seconds > 0,
        onClick: () => setSeconds(30),
      }}
    />
  );
}

export const ResendAction: Story = {
  render: () => <ResendExample />,
  play: async ({ canvas }) => {
    await expect(canvas.getByRole("button", { name: /^Resend in/ })).toBeDisabled();
  },
};

function VerifyingExample() {
  const [verifying, setVerifying] = useState(false);
  const [error, setError] = useState(false);
  return (
    <OtpField
      loadingLabel="Loading"
      label="Verification code"
      length={6}
      loading={verifying}
      error={error}
      errorMessage="That code is not valid. Try again."
      onValueChange={() => setError(false)}
      onComplete={async (code) => {
        setVerifying(true);
        await new Promise((resolve) => setTimeout(resolve, 600));
        setVerifying(false);
        setError(code !== "246810");
      }}
    />
  );
}

export const Verifying: Story = {
  render: () => <VerifyingExample />,
  play: async ({ canvas }) => {
    const input = canvas.getByRole("textbox", { name: "Verification code" });
    await userEvent.click(input);
    await userEvent.keyboard("111111");
    await expect(input).toHaveAttribute("aria-busy", "true");
    await waitFor(() => expect(canvas.getByRole("alert")).toBeVisible(), { timeout: 3000 });
  },
};

export const Keyboard: Story = {
  render: () => <OtpField label="Verification code" length={6} />,
  play: async ({ canvas, canvasElement }) => {
    await userEvent.click(canvas.getByRole("textbox", { name: "Verification code" }));
    await userEvent.keyboard("1234");
    await userEvent.keyboard("{Backspace}");
    await expect(slotTexts(canvasElement)).toEqual(["1", "2", "3", "", "", ""]);
  },
};

export const States: Story = {
  render: () => (
    <div className="flex flex-col gap-6">
      <OtpField
        infoLabel="More information"
        label="Code"
        length={6}
        required
        info="It expires in 10 minutes."
        helperText="We sent it by email."
      />
      <OtpField
        label="Code (error)"
        length={6}
        defaultValue="1234"
        error
        errorMessage="Enter the 6 digits."
      />
      <OtpField
        loadingLabel="Loading"
        label="Code (verifying)"
        length={6}
        defaultValue="123456"
        loading
      />
      <OtpField label="Code (disabled)" length={6} disabled />
    </div>
  ),
  play: async ({ canvas }) => {
    await expect(canvas.getByRole("alert")).toHaveTextContent("Enter the 6 digits.");
    await expect(canvas.getByRole("textbox", { name: "Code (verifying)" })).toHaveAttribute(
      "aria-busy",
      "true",
    );
  },
};

export const Rtl: Story = {
  render: () => (
    <div dir="rtl">
      <OtpField label="Code (RTL)" length={4} defaultValue="1234" groups={[2, 2]} />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const slots = slotsOf(canvasElement);
    const leftmost = [...slots].sort(
      (a, b) => a.getBoundingClientRect().left - b.getBoundingClientRect().left,
    )[0];
    await expect(leftmost?.textContent).toBe("1");
  },
};

export const Responsive: Story = {
  decorators: [
    (Story) => (
      <div className="w-48 border border-dashed p-2">
        <Story />
      </div>
    ),
  ],
  render: () => (
    <OtpField
      label="Recovery code"
      length={8}
      groups={[4, 4]}
      charset="alphanumeric"
      helperText="Eight characters, as printed on your card."
    />
  ),
  play: async ({ canvasElement }) => {
    const field = canvasElement.querySelector("[data-slot=field]") as HTMLElement;
    await expect(field.scrollWidth).toBeLessThanOrEqual(field.clientWidth);
    const [first, second] = [...canvasElement.querySelectorAll("[data-slot=input-otp-group]")];
    if (!first || !second) throw new Error("groups not rendered");
    // Whole blocks wrap: the second block starts on a new line.
    await expect(second.getBoundingClientRect().top).toBeGreaterThan(
      first.getBoundingClientRect().top,
    );
  },
};
