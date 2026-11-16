import {
  TextAreaControl,
  type TextAreaControlProps,
} from "@aureus-core/ui/components/text-area-control";
import { TextAreaField } from "@aureus-core/ui/components/text-area-field";
import { Button } from "@aureus-core/ui/shadcn/button";
import { zodResolver } from "@hookform/resolvers/zod";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { type ComponentType, type ReactNode, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { expect, fn, userEvent, waitFor } from "storybook/test";
import { z } from "zod";
import { type ActionArgs, actionArgs, actionArgTypes, splitActionArgs } from "../field-action-args";
import type { StoryArgs } from "../story-args";
import { docs } from "./text-area-control-docs";

const schema = z.object({
  bio: z
    .string()
    .min(20, "Write at least 20 characters.")
    .max(500, "Keep it under 500 characters."),
  notes: z.string(),
  draft: z.string(),
});

type Profile = z.infer<typeof schema>;

/**
 * The form every story renders into: one `useForm` with a schema resolver, a `FormProvider` and a
 * submit button. The last submitted payload is printed below, to show what the form sends.
 */
function DemoForm({ children }: { children: ReactNode }) {
  const form = useForm<Profile>({
    resolver: zodResolver(schema),
    defaultValues: { bio: "", notes: "Only for reviewers.", draft: "Generated summary" },
    mode: "onTouched",
  });
  const [payload, setPayload] = useState<string>();

  return (
    <FormProvider {...form}>
      <form
        noValidate
        className="flex w-full max-w-md flex-col gap-6"
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

type TextAreaControlStoryArgs = StoryArgs<TextAreaControlProps> & ActionArgs;

const meta = {
  title: "components/Forms/Text Area Control",
  component: TextAreaControl as unknown as ComponentType<TextAreaControlStoryArgs>,
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
    return <TextAreaControl {...(props as TextAreaControlProps)} action={action} />;
  },
  args: {
    name: "bio",
    label: "Bio",
    helperText: "Tell us about you.",
    info: "Shown on your public profile.",
    infoLabel: "More information",
    required: true,
    loading: false,
    loadingLabel: "Loading",
    disabled: false,
    minRows: 3,
    maxRows: 8,
    resize: true,
    showCount: true,
    countLabel: (count: number, max?: number) =>
      max === undefined ? `${count} characters` : `${max - count} characters remaining`,
    maxLength: 500,
    actionShortcut: false,
    onChange: fn(),
    onBlur: fn(),
    ...actionArgs,
    showAction: false,
    actionText: "Improve",
  },
  argTypes: {
    name: { control: false, table: { category: "Behavior" } },
    label: { control: "text", table: { category: "Content" } },
    placeholder: { control: "text", table: { category: "Content" } },
    helperText: { control: "text", table: { category: "Content" } },
    info: { control: "text", table: { category: "Content" } },
    infoLabel: { control: "text", table: { category: "Content" } },
    classNames: { control: "object", table: { category: "Appearance" } },
    className: { control: "text", table: { category: "Appearance" } },
    minRows: { control: { type: "number", min: 1, max: 20 }, table: { category: "Appearance" } },
    maxRows: { control: { type: "number", min: 1, max: 40 }, table: { category: "Appearance" } },
    required: { control: "boolean", table: { category: "State" } },
    loading: { control: "boolean", table: { category: "State" } },
    loadingLabel: { control: "text", table: { category: "Content" } },
    disabled: { control: "boolean", table: { category: "State" } },
    resize: { control: "boolean", table: { category: "Behavior" } },
    showCount: { control: "boolean", table: { category: "Behavior" } },
    maxLength: { control: { type: "number", min: 1 }, table: { category: "Behavior" } },
    actionShortcut: { control: "boolean", table: { category: "Behavior" } },
    countLabel: { control: false, table: { category: "Behavior" } },
    shouldUnregister: { control: "boolean", table: { category: "Behavior" } },
    ...actionArgTypes,
    onChange: { table: { category: "Events" } },
    onBlur: { table: { category: "Events" } },
  },
} satisfies Meta<TextAreaControlStoryArgs>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Bound to `bio` (20 to 500 characters). Leaving it too short shows the schema message. The
 * "Action" group adds a button to the footer bar.
 */
export const Playground: Story = {
  play: async ({ canvas }) => {
    const field = canvas.getByRole("textbox", { name: /^Bio/ });
    await userEvent.type(field, "Too short");
    await userEvent.tab();
    await waitFor(() => expect(field).toHaveAttribute("aria-invalid", "true"));
    await expect(canvas.getByRole("alert")).toHaveTextContent("Write at least 20 characters.");
  },
};

export const WithSchema: Story = {
  render: () => (
    <TextAreaControl
      countLabel={(count, max) =>
        max === undefined ? `${count} characters` : `${max - count} characters remaining`
      }
      name="bio"
      label="Bio"
      required
      helperText="Tell us about you."
      showCount
      maxLength={500}
    />
  ),
  play: async ({ canvas, canvasElement }) => {
    const field = canvas.getByRole("textbox", { name: /^Bio/ });
    await userEvent.type(field, "Hi there");
    await userEvent.click(canvas.getByRole("button", { name: "Save" }));

    await waitFor(() =>
      expect(canvas.getByRole("alert")).toHaveTextContent("Write at least 20 characters."),
    );
    await expect(field).toHaveFocus();
    await expect(canvasElement.querySelector("[data-slot=field-counter]")).toHaveTextContent(
      "8/500",
    );
  },
};

export const DisabledVsLoading: Story = {
  render: () => (
    <>
      <TextAreaControl name="bio" label="Bio" minRows={2} />
      <TextAreaControl
        loadingLabel="Loading"
        name="draft"
        label="Summary (loading)"
        loading
        minRows={2}
        helperText="Still submitted."
      />
      <TextAreaControl
        name="notes"
        label="Notes (disabled)"
        disabled
        minRows={2}
        helperText="Left out."
      />
    </>
  ),
  play: async ({ canvas }) => {
    await userEvent.type(
      canvas.getByRole("textbox", { name: "Bio" }),
      "I design and build accessible interfaces.",
    );
    await userEvent.click(canvas.getByRole("button", { name: "Save" }));

    const payload = await canvas.findByRole("status", { name: "Submitted data" });
    await expect(payload).toHaveTextContent('"draft":"Generated summary"');
    await expect(payload).not.toHaveTextContent("Only for reviewers.");
  },
};

const shared = {
  label: "Bio",
  required: true,
  info: "Shown on your public profile.",
  infoLabel: "More information",
  helperText: "Tell us about you.",
  showCount: true,
  countLabel: (count: number, max?: number) =>
    max === undefined ? `${count} characters` : `${max - count} characters remaining`,
  maxLength: 500,
  minRows: 2,
} as const;

export const Parity: Story = {
  render: () => (
    <div className="grid gap-6 sm:grid-cols-2">
      <div className="flex flex-col gap-2">
        <span className="text-xs font-medium text-muted-foreground">TextAreaField</span>
        <TextAreaField {...shared} id="parity-field" name="bio" defaultValue="" />
      </div>
      <div className="flex flex-col gap-2">
        <span className="text-xs font-medium text-muted-foreground">TextAreaControl</span>
        <TextAreaControl {...shared} id="parity-control" name="bio" />
      </div>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const [field, control] = [...canvasElement.querySelectorAll("[data-slot=field]")];
    // Ids generated by useId differ; compare the structure and visible text.
    const normalize = (element: Element | undefined) =>
      element?.outerHTML
        .replace(/ (id|for|aria-describedby)="[^"]*"/g, "")
        .replace(/ style="[^"]*"/g, "");
    await expect(normalize(control)).toBe(normalize(field));
  },
};
