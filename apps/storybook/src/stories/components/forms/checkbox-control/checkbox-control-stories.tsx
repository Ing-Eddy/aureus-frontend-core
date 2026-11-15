import { CheckboxControl } from "@aureus-core/ui/components/checkbox-control";
import { CheckboxField } from "@aureus-core/ui/components/checkbox-field";
import { Button } from "@aureus-core/ui/shadcn/button";
import { zodResolver } from "@hookform/resolvers/zod";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { type ComponentType, type ReactNode, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { expect, fn, userEvent, waitFor } from "storybook/test";
import { z } from "zod";
import { type ActionArgs, actionArgs, actionArgTypes, splitActionArgs } from "../field-action-args";
import { docs } from "./checkbox-control-docs";

const schema = z.object({
  terms: z.literal(true, { error: "You must accept the terms." }),
  newsletter: z.boolean(),
  active: z.enum(["S", "N"]),
  sync: z.boolean(),
  managed: z.boolean(),
});

/** Every story except `WithSchema` accepts unaccepted terms. */
const lenientSchema = schema.extend({ terms: z.boolean() });

type Settings = {
  terms: boolean;
  newsletter: boolean;
  active: "S" | "N";
  sync: boolean;
  managed: boolean;
};

/**
 * The form every story renders into: one `useForm` with a schema resolver, a `FormProvider` and a
 * submit button. The last submitted payload is printed below, to show what the form stores.
 */
function DemoForm({ children, strict }: { children: ReactNode; strict?: boolean }) {
  const form = useForm<Settings>({
    resolver: zodResolver(strict ? schema : lenientSchema) as never,
    defaultValues: { terms: false, newsletter: false, active: "N", sync: true, managed: true },
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

/** Flat args for the boolean Playground. */
type CheckboxControlStoryArgs = ActionArgs & {
  name: "terms" | "newsletter";
  label?: string;
  checkboxLabel: string;
  helperText?: string;
  checkboxPosition: "start" | "end";
  appearance: "plain" | "card";
  required?: boolean;
  loading?: boolean;
  disabled?: boolean;
  onValueChange: (value: boolean) => void;
};

const meta = {
  title: "components/Forms/Checkbox Control",
  component: CheckboxControl as unknown as ComponentType<CheckboxControlStoryArgs>,
  parameters: { aureusDocs: docs },
  decorators: [
    (Story, { parameters }) => (
      <DemoForm strict={parameters.strictSchema === true}>
        <Story />
      </DemoForm>
    ),
  ],
  render: (args) => {
    const [props, action] = splitActionArgs(args);
    return <CheckboxControl {...props} action={action} />;
  },
  args: {
    name: "newsletter",
    checkboxLabel: "Receive the weekly digest",
    helperText: "Sent on Mondays.",
    checkboxPosition: "start",
    appearance: "plain",
    onValueChange: fn(),
    ...actionArgs,
    showAction: false,
  },
  argTypes: {
    name: { control: false, table: { category: "Behavior" } },
    label: { control: "text", table: { category: "Content" } },
    checkboxLabel: { control: "text", table: { category: "Content" } },
    helperText: { control: "text", table: { category: "Content" } },
    checkboxPosition: {
      control: "inline-radio",
      options: ["start", "end"],
      table: { category: "Behavior" },
    },
    appearance: {
      control: "inline-radio",
      options: ["plain", "card"],
      table: { category: "Behavior" },
    },
    required: { control: "boolean", table: { category: "State" } },
    loading: { control: "boolean", table: { category: "State" } },
    disabled: { control: "boolean", table: { category: "State" } },
    ...actionArgTypes,
    onValueChange: { table: { category: "Events" } },
  },
} satisfies Meta<CheckboxControlStoryArgs>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Bound to `newsletter`. The submitted value is a boolean. */
export const Playground: Story = {
  play: async ({ canvas }) => {
    await userEvent.click(canvas.getByRole("checkbox", { name: "Receive the weekly digest" }));
    await userEvent.click(canvas.getByRole("button", { name: "Save" }));
    const payload = await canvas.findByRole("status", { name: "Submitted data" });
    await expect(payload).toHaveTextContent('"newsletter":true');
  },
};

export const WithSchema: Story = {
  parameters: { strictSchema: true },
  render: () => (
    <>
      <CheckboxControl name="terms" checkboxLabel="I accept the terms and conditions" required />
      <CheckboxControl
        name="newsletter"
        label="Notifications"
        checkboxLabel="Receive the weekly digest"
      />
    </>
  ),
  play: async ({ canvas }) => {
    const terms = canvas.getByRole("checkbox", { name: /^I accept the terms/ });
    await userEvent.click(canvas.getByRole("button", { name: "Save" }));
    await waitFor(() => expect(terms).toHaveAttribute("aria-invalid", "true"));
    await expect(canvas.getByRole("alert")).toHaveTextContent("You must accept the terms.");
    await expect(terms).toHaveFocus();
    await userEvent.keyboard(" ");
    await userEvent.click(canvas.getByRole("button", { name: "Save" }));
    const payload = await canvas.findByRole("status", { name: "Submitted data" });
    await expect(payload).toHaveTextContent('"terms":true,"newsletter":false');
  },
};

export const CustomValues: Story = {
  render: () => (
    <CheckboxControl
      name="active"
      label="Status"
      checkboxLabel="Active"
      checkedValue="S"
      uncheckedValue="N"
    />
  ),
  play: async ({ canvas }) => {
    await userEvent.click(canvas.getByRole("checkbox", { name: "Active" }));
    await userEvent.click(canvas.getByRole("button", { name: "Save" }));
    const payload = await canvas.findByRole("status", { name: "Submitted data" });
    await expect(payload).toHaveTextContent('"active":"S"');
  },
};

export const DisabledVsLoading: Story = {
  render: () => (
    <>
      <CheckboxControl name="newsletter" checkboxLabel="Weekly digest" />
      <CheckboxControl
        name="sync"
        checkboxLabel="Sync preferences (loading)"
        loading
        helperText="Still submitted."
      />
      <CheckboxControl
        name="managed"
        checkboxLabel="Managed by your organization (disabled)"
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
  checkboxLabel: "Receive the weekly digest",
  helperText: "Sent on Mondays.",
  required: true,
} as const;

export const Parity: Story = {
  render: () => (
    <div className="grid gap-6 sm:grid-cols-2">
      <div className="flex flex-col gap-2">
        <span className="text-xs font-medium text-muted-foreground">CheckboxField</span>
        <CheckboxField {...shared} id="parity-field" name="newsletter" value={false} />
      </div>
      <div className="flex flex-col gap-2">
        <span className="text-xs font-medium text-muted-foreground">CheckboxControl</span>
        <CheckboxControl {...shared} id="parity-control" name="newsletter" />
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
