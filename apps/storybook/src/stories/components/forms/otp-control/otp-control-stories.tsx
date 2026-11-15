import { OtpControl } from "@aureus-core/ui/components/otp-control";
import { OtpField } from "@aureus-core/ui/components/otp-field";
import { Button } from "@aureus-core/ui/shadcn/button";
import { zodResolver } from "@hookform/resolvers/zod";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { type ComponentType, type ReactNode, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { expect, fn, userEvent, waitFor } from "storybook/test";
import { z } from "zod";
import { docs } from "./otp-control-docs";

const schema = z.object({
  code: z.string().length(6, "Enter the 6 digits."),
  pin: z.string(),
  backup: z.string(),
});

/** Every story except `WithSchema` accepts an incomplete code. */
const lenientSchema = schema.extend({ code: z.string() });

type Verify = z.infer<typeof schema>;

/**
 * The form every story renders into: one `useForm` with a schema resolver, a `FormProvider` and a
 * submit button. The last submitted payload is printed below, to show what the form stores.
 */
function DemoForm({ children, strict }: { children: ReactNode; strict?: boolean }) {
  const form = useForm<Verify>({
    resolver: zodResolver(strict ? schema : lenientSchema) as never,
    defaultValues: { code: "", pin: "2468", backup: "AB12CD" },
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
          Verify
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

/** Flat args for the Playground, bound to `code`. */
type StoryArgs = {
  name: "code";
  label: string;
  helperText?: string;
  length: number;
  submitOnComplete: boolean;
  required?: boolean;
  loading?: boolean;
  disabled?: boolean;
  onValueChange: (value: string) => void;
};

const meta = {
  title: "components/Forms/OTP Control",
  component: OtpControl as unknown as ComponentType<StoryArgs>,
  parameters: { aureusDocs: docs },
  decorators: [
    (Story, { parameters }) => (
      <DemoForm strict={parameters.strictSchema === true}>
        <Story />
      </DemoForm>
    ),
  ],
  render: (args) => <OtpControl {...args} />,
  args: {
    name: "code",
    label: "Verification code",
    helperText: "We sent it by SMS.",
    length: 6,
    submitOnComplete: false,
    onValueChange: fn(),
  },
  argTypes: {
    name: { control: false, table: { category: "Behavior" } },
    label: { control: "text", table: { category: "Content" } },
    helperText: { control: "text", table: { category: "Content" } },
    length: { control: { type: "number", min: 1, max: 10 }, table: { category: "Behavior" } },
    submitOnComplete: { control: "boolean", table: { category: "Behavior" } },
    required: { control: "boolean", table: { category: "State" } },
    loading: { control: "boolean", table: { category: "State" } },
    disabled: { control: "boolean", table: { category: "State" } },
    onValueChange: { table: { category: "Events" } },
  },
} satisfies Meta<StoryArgs>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Bound to `code`. The submitted value is the code as a string. */
export const Playground: Story = {
  play: async ({ canvas }) => {
    await userEvent.click(canvas.getByRole("textbox", { name: "Verification code" }));
    await userEvent.keyboard("123456");
    await userEvent.click(canvas.getByRole("button", { name: "Verify" }));
    const payload = await canvas.findByRole("status", { name: "Submitted data" });
    await expect(payload).toHaveTextContent('"code":"123456"');
  },
};

export const WithSchema: Story = {
  parameters: { strictSchema: true },
  render: () => <OtpControl name="code" label="Verification code" length={6} required />,
  play: async ({ canvas }) => {
    const input = canvas.getByRole("textbox", { name: /^Verification code/ });
    await userEvent.click(input);
    await userEvent.keyboard("123");
    await userEvent.click(canvas.getByRole("button", { name: "Verify" }));
    await waitFor(() => expect(input).toHaveAttribute("aria-invalid", "true"));
    await expect(canvas.getByRole("alert")).toHaveTextContent("Enter the 6 digits.");
    await expect(input).toHaveFocus();
  },
};

export const SubmitOnComplete: Story = {
  render: () => (
    <OtpControl
      name="code"
      label="Verification code"
      length={6}
      groups={[3, 3]}
      submitOnComplete
      helperText="The form is submitted when the sixth digit is typed."
    />
  ),
  play: async ({ canvas }) => {
    await userEvent.click(canvas.getByRole("textbox", { name: "Verification code" }));
    await userEvent.keyboard("975310");
    const payload = await canvas.findByRole("status", { name: "Submitted data" });
    await expect(payload).toHaveTextContent('"code":"975310"');
  },
};

export const DisabledVsLoading: Story = {
  render: () => (
    <>
      <OtpControl name="code" label="Verification code" length={6} />
      <OtpControl
        name="pin"
        label="PIN (loading)"
        length={4}
        masked
        loading
        helperText="Still submitted."
      />
      <OtpControl
        name="backup"
        label="Backup code (disabled)"
        length={6}
        charset="alphanumeric"
        disabled
        helperText="Left out."
      />
    </>
  ),
  play: async ({ canvas }) => {
    await userEvent.click(canvas.getByRole("button", { name: "Verify" }));
    const payload = await canvas.findByRole("status", { name: "Submitted data" });
    await expect(payload).toHaveTextContent('"pin":"2468"');
    await expect(payload).not.toHaveTextContent("backup");
  },
};

const shared = {
  label: "Verification code",
  length: 6,
  groups: [3, 3],
  helperText: "We sent it by SMS.",
  required: true,
} as const;

export const Parity: Story = {
  render: () => (
    <div className="grid gap-6 sm:grid-cols-2">
      <div className="flex flex-col gap-2">
        <span className="text-xs font-medium text-muted-foreground">OtpField</span>
        <OtpField {...shared} id="parity-field" name="code" value="" />
      </div>
      <div className="flex flex-col gap-2">
        <span className="text-xs font-medium text-muted-foreground">OtpControl</span>
        <OtpControl {...shared} id="parity-control" name="code" />
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
