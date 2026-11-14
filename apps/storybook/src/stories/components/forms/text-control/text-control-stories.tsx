import { TextControl, type TextControlProps } from "@aureus-core/ui/components/text-control";
import { TextField } from "@aureus-core/ui/components/text-field";
import { Button } from "@aureus-core/ui/shadcn/button";
import { zodResolver } from "@hookform/resolvers/zod";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { type ReactNode, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { expect, fn, userEvent, waitFor } from "storybook/test";
import { z } from "zod";
import { type ActionArgs, actionArgs, actionArgTypes, splitActionArgs } from "../field-action-args";
import { docs } from "./text-control-docs";

type TextControlStoryArgs = TextControlProps & ActionArgs;

const schema = z.object({
  username: z.string().min(3, "Use at least 3 characters."),
  email: z.email("Enter a valid email address."),
  coupon: z.string(),
  nickname: z.string(),
});

type Profile = z.infer<typeof schema>;

const defaultValues: Profile = { username: "", email: "", coupon: "WELCOME10", nickname: "ada" };

/**
 * The form every story renders into, the way an app does it: one `useForm` with a schema
 * resolver, a `FormProvider`, and a submit button. The last submitted payload is printed below.
 */
function DemoForm({ children }: { children: ReactNode }) {
  const form = useForm<Profile>({
    resolver: zodResolver(schema),
    defaultValues,
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

const meta = {
  title: "components/Forms/Text Control",
  component: TextControl,
  parameters: { aureusDocs: docs },
  decorators: [
    (Story) => (
      <DemoForm>
        <Story />
      </DemoForm>
    ),
  ],
  render: (args) => {
    const [props, action] = splitActionArgs(args);
    return <TextControl {...props} action={action} />;
  },
  args: {
    name: "username",
    label: "Username",
    placeholder: "ada",
    helperText: "Visible to other members.",
    info: "Use letters, numbers and dashes.",
    required: true,
    loading: false,
    disabled: false,
    onChange: fn(),
    onBlur: fn(),
    ...actionArgs,
  },
  argTypes: {
    name: { control: false, table: { category: "Behavior" } },
    label: { control: "text", table: { category: "Content" } },
    placeholder: { control: "text", table: { category: "Content" } },
    helperText: { control: "text", table: { category: "Content" } },
    info: { control: "text", table: { category: "Content" } },
    classNames: { control: "object", table: { category: "Appearance" } },
    className: { control: "text", table: { category: "Appearance" } },
    required: { control: "boolean", table: { category: "State" } },
    loading: { control: "boolean", table: { category: "State" } },
    disabled: { control: "boolean", table: { category: "State" } },
    shouldUnregister: { control: "boolean", table: { category: "Behavior" } },
    ...actionArgTypes,
    onChange: { table: { category: "Events" } },
    onBlur: { table: { category: "Events" } },
  },
} satisfies Meta<TextControlStoryArgs>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Bound to `username` (at least 3 characters). Leaving it too short shows the schema message.
 * The "Action" group adds, removes and changes the integrated button.
 */
export const Playground: Story = {
  play: async ({ args, canvas }) => {
    const input = canvas.getByRole("textbox", { name: "Username" });
    await userEvent.type(input, "ab");
    await userEvent.tab();
    await expect(args.onChange).toHaveBeenCalledTimes(2);
    await expect(args.onBlur).toHaveBeenCalledTimes(1);
    await waitFor(() => expect(input).toHaveAttribute("aria-invalid", "true"));
    await expect(canvas.getByRole("alert")).toHaveTextContent("Use at least 3 characters.");
  },
};

export const WithSchema: Story = {
  render: () => (
    <>
      <TextControl
        name="username"
        label="Username"
        required
        helperText="Visible to other members."
      />
      <TextControl name="email" label="Email" required autoComplete="email" />
      <TextControl name="nickname" label="Nickname" info="Only your team sees it." />
    </>
  ),
  play: async ({ canvas }) => {
    await userEvent.click(canvas.getByRole("button", { name: "Save" }));
    await waitFor(() => expect(canvas.getAllByRole("alert")).toHaveLength(2));
    await expect(canvas.getByText("Use at least 3 characters.")).toBeVisible();
    await expect(canvas.getByText("Enter a valid email address.")).toBeVisible();
    await expect(canvas.getByRole("textbox", { name: "Username" })).toHaveFocus();
    await expect(canvas.queryByRole("status", { name: "Submitted data" })).toBeNull();
  },
};

export const HelperAndValidation: Story = {
  render: () => (
    <TextControl name="username" label="Username" required helperText="Visible to other members." />
  ),
  play: async ({ canvas }) => {
    const input = canvas.getByRole("textbox", { name: "Username" });
    await expect(canvas.getByText("Visible to other members.")).toBeVisible();

    await userEvent.type(input, "ab");
    await userEvent.tab();
    await waitFor(() =>
      expect(canvas.getByRole("alert")).toHaveTextContent("Use at least 3 characters."),
    );
    await expect(canvas.queryByText("Visible to other members.")).toBeNull();

    await userEvent.type(input, "a");
    await waitFor(() => expect(canvas.queryByRole("alert")).toBeNull());
    await expect(canvas.getByText("Visible to other members.")).toBeVisible();
    await expect(input).not.toHaveAttribute("aria-invalid");
  },
};

export const DisabledVsLoading: Story = {
  render: () => (
    <>
      <TextControl name="username" label="Username" />
      <TextControl name="email" label="Email" />
      <TextControl name="coupon" label="Coupon (loading)" loading helperText="Still submitted." />
      <TextControl name="nickname" label="Nickname (disabled)" disabled helperText="Left out." />
    </>
  ),
  play: async ({ canvas }) => {
    await userEvent.type(canvas.getByRole("textbox", { name: "Username" }), "ada");
    await userEvent.type(canvas.getByRole("textbox", { name: "Email" }), "ada@example.com");
    await expect(canvas.getByRole("textbox", { name: "Coupon (loading)" })).toBeDisabled();
    await expect(canvas.getByRole("textbox", { name: "Nickname (disabled)" })).toBeDisabled();

    await userEvent.click(canvas.getByRole("button", { name: "Save" }));

    const payload = await canvas.findByRole("status", { name: "Submitted data" });
    await expect(payload).toHaveTextContent('"coupon":"WELCOME10"');
    await expect(payload).not.toHaveTextContent("nickname");
  },
};

const shared = {
  label: "Username",
  required: true,
  info: "Use letters, numbers and dashes.",
  helperText: "Visible to other members.",
  action: { children: "Check", tooltip: "Check availability" },
};

export const Parity: Story = {
  render: () => (
    <div className="grid gap-6 sm:grid-cols-2">
      <div className="flex flex-col gap-2">
        <span className="text-xs font-medium text-muted-foreground">TextField</span>
        <TextField {...shared} id="parity-field" name="username" defaultValue="" />
      </div>
      <div className="flex flex-col gap-2">
        <span className="text-xs font-medium text-muted-foreground">TextControl</span>
        <TextControl {...shared} id="parity-control" name="username" />
      </div>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const [field, control] = [...canvasElement.querySelectorAll("[data-slot=field]")];
    const normalize = (element: Element | undefined, id: string) =>
      element?.outerHTML
        .split(id)
        .join("ID")
        .replace(/ value=""/g, "");
    await expect(normalize(control, "parity-control")).toBe(normalize(field, "parity-field"));
  },
};
