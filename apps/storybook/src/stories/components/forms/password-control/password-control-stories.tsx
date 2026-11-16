import {
  PasswordControl,
  type PasswordControlProps,
} from "@aureus-core/ui/components/password-control";
import { PasswordField } from "@aureus-core/ui/components/password-field";
import { Button } from "@aureus-core/ui/shadcn/button";
import { zodResolver } from "@hookform/resolvers/zod";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { type ComponentType, type ReactNode, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { expect, fn, userEvent, waitFor } from "storybook/test";
import { z } from "zod";
import type { StoryArgs } from "../story-args";
import { docs } from "./password-control-docs";

const schema = z
  .object({
    password: z.string().min(8, "Use at least 8 characters."),
    confirm: z.string(),
    previous: z.string().optional(),
  })
  .refine((values) => values.password === values.confirm, {
    message: "The passwords do not match.",
    path: ["confirm"],
  });

type Passwords = z.infer<typeof schema>;

/**
 * The form every story renders into: one `useForm` with a schema resolver, a `FormProvider` and a
 * submit button. The last submitted payload is printed below, to show what the form sends.
 */
function DemoForm({ children, defaults }: { children: ReactNode; defaults?: Partial<Passwords> }) {
  const form = useForm<Passwords>({
    resolver: zodResolver(schema),
    defaultValues: { password: "", confirm: "", ...defaults },
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

type PasswordControlStoryArgs = StoryArgs<PasswordControlProps>;

const toggleTexts = { showPasswordLabel: "Show password", hidePasswordLabel: "Hide password" };

const meta = {
  title: "components/Forms/Password Control",
  component: PasswordControl as unknown as ComponentType<PasswordControlStoryArgs>,
  parameters: { aureusDocs: docs },
  decorators: [
    (Story, { parameters }) => (
      <DemoForm defaults={parameters.demoDefaults as Partial<Passwords> | undefined}>
        <Story />
      </DemoForm>
    ),
  ],
  render: (args) => (
    <PasswordControl key={String(args.defaultVisible)} {...(args as PasswordControlProps)} />
  ),
  args: {
    name: "password",
    label: "Password",
    helperText: "At least 8 characters.",
    info: "Use a passphrase: several words are easier to remember and harder to guess.",
    infoLabel: "More information",
    required: true,
    loading: false,
    loadingLabel: "Loading",
    showPasswordLabel: "Show password",
    hidePasswordLabel: "Hide password",
    disabled: false,
    defaultVisible: false,
    autoComplete: "current-password",
    onVisibleChange: fn(),
    onChange: fn(),
    onBlur: fn(),
  },
  argTypes: {
    name: { control: false, table: { category: "Behavior" } },
    label: { control: "text", table: { category: "Content" } },
    placeholder: { control: "text", table: { category: "Content" } },
    helperText: { control: "text", table: { category: "Content" } },
    info: { control: "text", table: { category: "Content" } },
    infoLabel: { control: "text", table: { category: "Content" } },
    showPasswordLabel: { control: "text", table: { category: "Content" } },
    hidePasswordLabel: { control: "text", table: { category: "Content" } },
    classNames: { control: "object", table: { category: "Appearance" } },
    className: { control: "text", table: { category: "Appearance" } },
    required: { control: "boolean", table: { category: "State" } },
    loading: { control: "boolean", table: { category: "State" } },
    loadingLabel: { control: "text", table: { category: "Content" } },
    disabled: { control: "boolean", table: { category: "State" } },
    defaultVisible: { control: "boolean", table: { category: "State" } },
    visible: { control: false, table: { category: "State" } },
    autoComplete: {
      control: "inline-radio",
      options: ["current-password", "new-password", "off"],
      table: { category: "Behavior" },
    },
    shouldUnregister: { control: "boolean", table: { category: "Behavior" } },
    onVisibleChange: { table: { category: "Events" } },
    onChange: { table: { category: "Events" } },
    onBlur: { table: { category: "Events" } },
  },
} satisfies Meta<PasswordControlStoryArgs>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Bound to `password` (at least 8 characters). Leaving it too short shows the schema message. */
export const Playground: Story = {
  play: async ({ canvas }) => {
    const input = canvas.getByLabelText(/^Password/);
    await userEvent.type(input, "short");
    await userEvent.click(canvas.getByRole("button", { name: "Save" }));
    await waitFor(() => expect(input).toHaveAttribute("aria-invalid", "true"));
    await expect(canvas.getByRole("alert")).toHaveTextContent("Use at least 8 characters.");
  },
};

export const WithSchema: Story = {
  render: () => (
    <>
      <PasswordControl
        showPasswordLabel="Show password"
        hidePasswordLabel="Hide password"
        name="password"
        label="New password"
        required
        autoComplete="new-password"
      />
      <PasswordControl
        showPasswordLabel="Show password"
        hidePasswordLabel="Hide password"
        name="confirm"
        label="Repeat password"
        required
        autoComplete="new-password"
        helperText="Type it again to avoid typos."
      />
    </>
  ),
  play: async ({ canvas }) => {
    await userEvent.type(canvas.getByLabelText(/^New password/), "correct horse");
    await userEvent.type(canvas.getByLabelText(/^Repeat password/), "correct hose");
    await userEvent.click(canvas.getByRole("button", { name: "Save" }));

    await waitFor(() =>
      expect(canvas.getByRole("alert")).toHaveTextContent("The passwords do not match."),
    );
    await expect(canvas.getByLabelText(/^Repeat password/)).toHaveAttribute("aria-invalid", "true");
    await expect(canvas.getByLabelText(/^Repeat password/)).toHaveFocus();
    await expect(canvas.queryByText("Type it again to avoid typos.")).toBeNull();
  },
};

/**
 * A loading field keeps its value in the submitted data; a disabled field is left out. The
 * confirmation is loading with a value from the form's defaults, and the old password is disabled.
 */
export const DisabledVsLoading: Story = {
  parameters: { demoDefaults: { confirm: "correct-horse-1", previous: "old-secret" } },
  render: () => (
    <>
      <PasswordControl {...toggleTexts} name="password" label="Password" />
      <PasswordControl
        {...toggleTexts}
        name="confirm"
        label="Confirmation (loading)"
        loading
        loadingLabel="Loading"
        helperText="Still submitted."
      />
      <PasswordControl
        {...toggleTexts}
        name="previous"
        label="Old password (disabled)"
        disabled
        helperText="Left out."
      />
    </>
  ),
  play: async ({ canvas }) => {
    await userEvent.type(canvas.getByLabelText("Password"), "correct-horse-1");
    await expect(canvas.getByLabelText("Confirmation (loading)")).toBeDisabled();
    await expect(canvas.getByRole("status", { name: "Loading" })).toBeInTheDocument();
    await expect(canvas.getByLabelText("Old password (disabled)")).toBeDisabled();

    await userEvent.click(canvas.getByRole("button", { name: "Save" }));

    const payload = await canvas.findByRole("status", { name: "Submitted data" });
    await expect(payload).toHaveTextContent('"confirm":"correct-horse-1"');
    await expect(payload).not.toHaveTextContent("old-secret");
  },
};

export const HidesOnSubmit: Story = {
  render: () => (
    <>
      <PasswordControl
        showPasswordLabel="Show password"
        hidePasswordLabel="Hide password"
        name="password"
        label="Password"
      />
      <PasswordControl
        showPasswordLabel="Show password"
        hidePasswordLabel="Hide password"
        name="confirm"
        label="Repeat password"
      />
    </>
  ),
  play: async ({ canvas }) => {
    const password = canvas.getByLabelText("Password");
    await userEvent.type(password, "correct horse");
    await userEvent.type(canvas.getByLabelText("Repeat password"), "correct horse");
    await userEvent.click(canvas.getAllByRole("button", { name: "Show password" })[0] as Element);
    await expect(password).toHaveAttribute("type", "text");

    await userEvent.click(canvas.getByRole("button", { name: "Save" }));

    const payload = await canvas.findByRole("status", { name: "Submitted data" });
    await expect(payload).toHaveTextContent('"password":"correct horse"');
    await expect(password).toHaveAttribute("type", "password");
  },
};

const shared = {
  label: "Password",
  required: true,
  info: "Use a passphrase.",
  infoLabel: "More information",
  helperText: "At least 8 characters.",
};

export const Parity: Story = {
  render: () => (
    <div className="grid gap-6 sm:grid-cols-2">
      <div className="flex flex-col gap-2">
        <span className="text-xs font-medium text-muted-foreground">PasswordField</span>
        <PasswordField
          showPasswordLabel="Show password"
          hidePasswordLabel="Hide password"
          {...shared}
          id="parity-field"
          name="password"
          defaultValue=""
        />
      </div>
      <div className="flex flex-col gap-2">
        <span className="text-xs font-medium text-muted-foreground">PasswordControl</span>
        <PasswordControl
          showPasswordLabel="Show password"
          hidePasswordLabel="Hide password"
          {...shared}
          id="parity-control"
          name="password"
        />
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
