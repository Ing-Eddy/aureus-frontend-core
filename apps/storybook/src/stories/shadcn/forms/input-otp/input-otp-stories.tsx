import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@aureus-core/ui/shadcn/input-otp";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { type ComponentProps, useState } from "react";
import { expect, fn, userEvent } from "storybook/test";
import { docs } from "./input-otp-docs";

/** Same value as `REGEXP_ONLY_DIGITS` from `input-otp`. */
const digitsOnly = "^\\d+$";

function SixSlots({ invalid }: { invalid?: boolean }) {
  return (
    <>
      <InputOTPGroup>
        {[0, 1, 2].map((index) => (
          <InputOTPSlot key={index} index={index} aria-invalid={invalid || undefined} />
        ))}
      </InputOTPGroup>
      <InputOTPSeparator />
      <InputOTPGroup>
        {[3, 4, 5].map((index) => (
          <InputOTPSlot key={index} index={index} aria-invalid={invalid || undefined} />
        ))}
      </InputOTPGroup>
    </>
  );
}

type OtpArgs = Omit<ComponentProps<typeof InputOTP>, "render">;

const meta = {
  title: "shadcn/Forms/Input OTP",
  component: InputOTP,
  parameters: { aureusDocs: docs },
  args: {
    maxLength: 6,
    disabled: false,
    "aria-label": "Verification code",
    onChange: fn(),
    onComplete: fn(),
    children: null,
  },
  argTypes: {
    maxLength: { control: false, table: { category: "Behavior" } },
    disabled: { control: "boolean", table: { category: "State" } },
    onChange: { table: { category: "Events" } },
    onComplete: { table: { category: "Events" } },
    children: { control: false },
  },
  render: (args) => (
    <InputOTP {...(args as OtpArgs)}>
      <InputOTPGroup>
        {[0, 1, 2, 3, 4, 5].map((index) => (
          <InputOTPSlot key={index} index={index} />
        ))}
      </InputOTPGroup>
    </InputOTP>
  ),
} satisfies Meta<typeof InputOTP>;

export default meta;
type Story = StoryObj<typeof meta>;

const slots = (canvasElement: HTMLElement) =>
  [...canvasElement.querySelectorAll('[data-slot="input-otp-slot"]')].map(
    (slot) => slot.textContent,
  );

/** Typing fills the slots in order and calls `onComplete` with the whole code. */
export const Playground: Story = {
  play: async ({ args, canvas, canvasElement }) => {
    const input = canvas.getByRole("textbox", { name: "Verification code" });
    await userEvent.click(input);
    await userEvent.keyboard("123456");
    await expect(slots(canvasElement)).toEqual(["1", "2", "3", "4", "5", "6"]);
    await expect(args.onComplete).toHaveBeenCalledWith("123456");
    await userEvent.keyboard("{Backspace}");
    await expect(input).toHaveValue("12345");
  },
};

export const WithSeparator: Story = {
  render: (args) => (
    <InputOTP {...(args as OtpArgs)}>
      <SixSlots />
    </InputOTP>
  ),
  play: async ({ canvas }) => {
    await expect(canvas.getByRole("separator")).toBeInTheDocument();
  },
};

/** Letters are rejected by `pattern`; digits are accepted. */
export const DigitsOnly: Story = {
  args: { pattern: digitsOnly, inputMode: "numeric" },
  render: (args) => (
    <InputOTP {...(args as OtpArgs)}>
      <SixSlots />
    </InputOTP>
  ),
  play: async ({ canvas }) => {
    const input = canvas.getByRole("textbox", { name: "Verification code" });
    await userEvent.click(input);
    await userEvent.keyboard("4a2b");
    await expect(input).toHaveValue("42");
  },
};

export const Paste: Story = {
  render: (args) => (
    <InputOTP {...(args as OtpArgs)}>
      <SixSlots />
    </InputOTP>
  ),
  play: async ({ args, canvas, canvasElement }) => {
    await userEvent.click(canvas.getByRole("textbox", { name: "Verification code" }));
    await userEvent.paste("908172");
    await expect(slots(canvasElement)).toEqual(["9", "0", "8", "1", "7", "2"]);
    await expect(args.onComplete).toHaveBeenCalledWith("908172");
  },
};

function ControlledExample() {
  const [value, setValue] = useState("");
  return (
    <div className="grid gap-2">
      <InputOTP maxLength={6} value={value} onChange={setValue} aria-label="Verification code">
        <SixSlots />
      </InputOTP>
      <p className="text-muted-foreground text-sm" aria-live="polite">
        {value.length === 6 ? `Code ${value} entered.` : `${6 - value.length} digits left.`}
      </p>
    </div>
  );
}

export const Controlled: Story = {
  render: () => <ControlledExample />,
  play: async ({ canvas }) => {
    await userEvent.click(canvas.getByRole("textbox", { name: "Verification code" }));
    await userEvent.keyboard("12");
    await expect(canvas.getByText("4 digits left.")).toBeVisible();
  },
};

export const Invalid: Story = {
  args: { defaultValue: "111111", "aria-invalid": true, "aria-describedby": "otp-error" },
  render: (args) => (
    <div className="grid gap-2">
      <InputOTP {...(args as OtpArgs)}>
        <SixSlots invalid />
      </InputOTP>
      <p id="otp-error" className="text-destructive text-sm">
        That code is incorrect or expired.
      </p>
    </div>
  ),
  play: async ({ canvas }) => {
    await expect(
      canvas.getByRole("textbox", { name: "Verification code" }),
    ).toHaveAccessibleDescription("That code is incorrect or expired.");
  },
};

export const Disabled: Story = {
  args: { disabled: true, defaultValue: "123" },
  render: (args) => (
    <InputOTP {...(args as OtpArgs)}>
      <SixSlots />
    </InputOTP>
  ),
  play: async ({ canvas }) => {
    await expect(canvas.getByRole("textbox", { name: "Verification code" })).toBeDisabled();
  },
};
