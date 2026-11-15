import { CheckboxGroupControl } from "@aureus-core/ui/components/checkbox-group-control";
import { CheckboxGroupField } from "@aureus-core/ui/components/checkbox-group-field";
import { Button } from "@aureus-core/ui/shadcn/button";
import { channels, permissions, sizes } from "@fixtures/checkbox-options";
import { zodResolver } from "@hookform/resolvers/zod";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { type ComponentType, type ReactNode, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { expect, fn, userEvent, waitFor } from "storybook/test";
import { z } from "zod";
import { docs } from "./checkbox-group-control-docs";

const schema = z.object({
  channels: z.array(z.string()).min(1, "Choose at least one channel."),
  permissions: z.array(z.string()).max(3, "Choose at most three permissions."),
  sizes: z.array(z.string()),
  regions: z.array(z.string()),
});

/** Every story except `WithSchema` accepts any selection. */
const lenientSchema = schema.extend({ channels: z.array(z.string()) });

type Preferences = {
  channels: string[];
  permissions: string[];
  sizes: string[];
  regions: string[];
};

/**
 * The form every story renders into: one `useForm` with a schema resolver, a `FormProvider` and a
 * submit button. The last submitted payload is printed below, to show what the form stores.
 */
function DemoForm({ children, strict }: { children: ReactNode; strict?: boolean }) {
  const form = useForm<Preferences>({
    resolver: zodResolver(strict ? schema : lenientSchema) as never,
    defaultValues: { channels: [], permissions: [], sizes: ["m"], regions: ["eu"] },
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

/** Flat args for the Playground, bound to `channels`. */
type StoryArgs = {
  name: "channels";
  label: string;
  helperText?: string;
  selectAllLabel: string;
  maxSelected?: number;
  orientation: "vertical" | "horizontal";
  appearance: "plain" | "card";
  required?: boolean;
  loading?: boolean;
  disabled?: boolean;
  onValueChange: (value: string[]) => void;
};

const meta = {
  title: "components/Forms/Checkbox Group Control",
  component: CheckboxGroupControl as unknown as ComponentType<StoryArgs>,
  parameters: { aureusDocs: docs },
  decorators: [
    (Story, { parameters }) => (
      <DemoForm strict={parameters.strictSchema === true}>
        <Story />
      </DemoForm>
    ),
  ],
  render: ({ selectAllLabel, ...args }) => (
    <CheckboxGroupControl
      {...args}
      options={channels}
      selectAll={selectAllLabel ? { label: selectAllLabel } : undefined}
    />
  ),
  args: {
    name: "channels",
    label: "Notification channels",
    helperText: "Where we write to you.",
    selectAllLabel: "",
    orientation: "vertical",
    appearance: "plain",
    onValueChange: fn(),
  },
  argTypes: {
    name: { control: false, table: { category: "Behavior" } },
    label: { control: "text", table: { category: "Content" } },
    helperText: { control: "text", table: { category: "Content" } },
    selectAllLabel: { control: "text", name: "selectAll.label", table: { category: "Behavior" } },
    maxSelected: { control: { type: "number", min: 1 }, table: { category: "Behavior" } },
    orientation: {
      control: "inline-radio",
      options: ["vertical", "horizontal"],
      table: { category: "Layout" },
    },
    appearance: {
      control: "inline-radio",
      options: ["plain", "card"],
      table: { category: "Layout" },
    },
    required: { control: "boolean", table: { category: "State" } },
    loading: { control: "boolean", table: { category: "State" } },
    disabled: { control: "boolean", table: { category: "State" } },
    onValueChange: { table: { category: "Events" } },
  },
} satisfies Meta<StoryArgs>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Bound to `channels`. The submitted value is a `string[]` in the options order. */
export const Playground: Story = {
  play: async ({ canvas }) => {
    await userEvent.click(canvas.getByRole("checkbox", { name: "Slack" }));
    await userEvent.click(canvas.getByRole("checkbox", { name: "Email" }));
    await userEvent.click(canvas.getByRole("button", { name: "Save" }));
    const payload = await canvas.findByRole("status", { name: "Submitted data" });
    await expect(payload).toHaveTextContent('"channels":["email","slack"]');
  },
};

export const WithSchema: Story = {
  parameters: { strictSchema: true },
  render: () => (
    <>
      <CheckboxGroupControl
        name="channels"
        label="Notification channels"
        required
        options={channels}
      />
      <CheckboxGroupControl
        name="permissions"
        label="Permissions"
        options={permissions}
        helperText="Up to three."
      />
    </>
  ),
  play: async ({ canvas }) => {
    for (const name of ["Read", "Write", "Delete", "Share"]) {
      await userEvent.click(canvas.getByRole("checkbox", { name }));
    }
    await userEvent.click(canvas.getByRole("button", { name: "Save" }));
    await waitFor(() => expect(canvas.getAllByRole("alert")).toHaveLength(2));
    await expect(canvas.getByText("Choose at least one channel.")).toBeVisible();
    await expect(canvas.getByText("Choose at most three permissions.")).toBeVisible();
    await expect(canvas.getByRole("checkbox", { name: "Email" })).toHaveFocus();
  },
};

export const DisabledVsLoading: Story = {
  render: () => (
    <>
      <CheckboxGroupControl name="channels" label="Notification channels" options={channels} />
      <CheckboxGroupControl
        name="sizes"
        label="Sizes (loading)"
        options={sizes}
        loading
        orientation="horizontal"
        helperText="Still submitted."
      />
      <CheckboxGroupControl
        name="regions"
        label="Regions (disabled)"
        options={[
          { value: "eu", label: "Europe" },
          { value: "us", label: "United States" },
        ]}
        disabled
        helperText="Left out."
      />
    </>
  ),
  play: async ({ canvas }) => {
    await userEvent.click(canvas.getByRole("button", { name: "Save" }));
    const payload = await canvas.findByRole("status", { name: "Submitted data" });
    await expect(payload).toHaveTextContent('"sizes":["m"]');
    await expect(payload).not.toHaveTextContent("regions");
  },
};

const shared = {
  label: "Notification channels",
  helperText: "Where we write to you.",
  required: true,
  selectAll: { label: "All channels" },
} as const;

export const Parity: Story = {
  render: () => (
    <div className="grid gap-6 sm:grid-cols-2">
      <div className="flex flex-col gap-2">
        <span className="text-xs font-medium text-muted-foreground">CheckboxGroupField</span>
        <CheckboxGroupField
          {...shared}
          id="parity-field"
          name="channels"
          options={channels}
          value={[]}
        />
      </div>
      <div className="flex flex-col gap-2">
        <span className="text-xs font-medium text-muted-foreground">CheckboxGroupControl</span>
        <CheckboxGroupControl {...shared} id="parity-control" name="channels" options={channels} />
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
