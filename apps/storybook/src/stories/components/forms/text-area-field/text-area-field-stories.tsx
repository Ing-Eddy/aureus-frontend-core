import { TextAreaField, type TextAreaFieldProps } from "@aureus-core/ui/components/text-area-field";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { expect, fn, userEvent, waitFor } from "storybook/test";
import { type ActionArgs, actionArgs, actionArgTypes, splitActionArgs } from "../field-action-args";
import { docs } from "./text-area-field-docs";

type TextAreaFieldStoryArgs = TextAreaFieldProps & ActionArgs;

const meta = {
  title: "components/Forms/Text Area Field",
  component: TextAreaField,
  parameters: { aureusDocs: docs },
  decorators: [
    (Story) => (
      <div className="w-full max-w-md">
        <Story />
      </div>
    ),
  ],
  render: (args) => {
    const [props, action] = splitActionArgs(args);
    return <TextAreaField {...props} action={action} />;
  },
  args: {
    label: "Comment",
    placeholder: "Write a comment…",
    helperText: "Be kind and specific.",
    info: "Comments are visible to everyone in the project.",
    required: false,
    loading: false,
    disabled: false,
    error: false,
    errorMessage: "",
    minRows: 3,
    maxRows: 6,
    resize: true,
    showCount: true,
    maxLength: 280,
    actionShortcut: true,
    onChange: fn(),
    onBlur: fn(),
    ...actionArgs,
    actionText: "Post",
    actionVariant: "default",
    actionTooltip: "Ctrl + Enter",
  },
  argTypes: {
    label: { control: "text", table: { category: "Content" } },
    placeholder: { control: "text", table: { category: "Content" } },
    helperText: { control: "text", table: { category: "Content" } },
    info: { control: "text", table: { category: "Content" } },
    errorMessage: { control: "text", table: { category: "Content" } },
    classNames: { control: "object", table: { category: "Appearance" } },
    className: { control: "text", table: { category: "Appearance" } },
    minRows: { control: { type: "number", min: 1, max: 20 }, table: { category: "Appearance" } },
    maxRows: { control: { type: "number", min: 1, max: 40 }, table: { category: "Appearance" } },
    required: { control: "boolean", table: { category: "State" } },
    loading: { control: "boolean", table: { category: "State" } },
    disabled: { control: "boolean", table: { category: "State" } },
    error: { control: "boolean", table: { category: "State" } },
    resize: { control: "boolean", table: { category: "Behavior" } },
    showCount: { control: "boolean", table: { category: "Behavior" } },
    maxLength: { control: { type: "number", min: 1 }, table: { category: "Behavior" } },
    actionShortcut: { control: "boolean", table: { category: "Behavior" } },
    countLabel: { control: false, table: { category: "Behavior" } },
    ...actionArgTypes,
    onChange: { table: { category: "Events" } },
    onBlur: { table: { category: "Events" } },
  },
} satisfies Meta<TextAreaFieldStoryArgs>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Every prop is wired to a control; the "Action" group adds, removes and changes the button in
 * the footer bar. The play function types, checks the counter and posts with Ctrl+Enter.
 */
export const Playground: Story = {
  play: async ({ args, canvas, canvasElement }) => {
    const field = canvas.getByRole("textbox", { name: "Comment" });
    await userEvent.type(field, "Looks great");
    const counter = canvasElement.querySelector("[data-slot=field-counter]");
    await expect(counter).toHaveTextContent("11/280");
    await userEvent.keyboard("{Control>}{Enter}{/Control}");
    await expect(args.onActionClick).toHaveBeenCalledTimes(1);
    await expect(field).toHaveValue("Looks great");
  },
};

export const States: Story = {
  render: () => (
    <div className="flex flex-col gap-6">
      <TextAreaField label="Description" required info="Shown on the project page." />
      <TextAreaField label="Notes" helperText="Only your team sees them." minRows={2} />
      <TextAreaField
        label="Summary"
        defaultValue="Too short"
        error
        helperText="At least 20 characters."
        errorMessage="Write at least 20 characters."
        minRows={2}
      />
      <TextAreaField
        label="Release notes"
        defaultValue="Generating from the changelog…"
        loading
        minRows={2}
      />
      <TextAreaField
        label="Audit log"
        defaultValue="Created by the system."
        disabled
        helperText="Read only."
        minRows={2}
      />
    </div>
  ),
  play: async ({ canvas }) => {
    await expect(canvas.getByRole("textbox", { name: /^Description/ })).toHaveAttribute(
      "aria-required",
      "true",
    );
    await expect(canvas.getByRole("alert")).toHaveTextContent("Write at least 20 characters.");
    await expect(canvas.getByRole("textbox", { name: "Release notes" })).toBeDisabled();
    await expect(canvas.getByRole("status", { name: "Loading" })).toBeInTheDocument();
    await expect(canvas.getByRole("textbox", { name: "Audit log" })).toBeDisabled();
  },
};

export const AutoGrow: Story = {
  args: {
    label: "Message",
    placeholder: "Type several lines…",
    helperText: undefined,
    info: undefined,
    minRows: 2,
    maxRows: 5,
    showCount: false,
    maxLength: undefined,
    actionText: "Send",
    actionTooltip: "",
  },
  play: async ({ canvas, canvasElement }) => {
    const field = canvas.getByRole("textbox", { name: "Message" }) as HTMLTextAreaElement;
    const frame = canvasElement.querySelector("[data-slot=input-group]") as HTMLElement;
    const footer = canvasElement.querySelector("[data-align=block-end]") as HTMLElement;
    const initial = field.clientHeight;

    await userEvent.type(field, "one{Enter}two{Enter}three");
    const grown = field.clientHeight;
    await expect(grown).toBeGreaterThan(initial);

    await userEvent.type(field, "{Enter}four{Enter}five{Enter}six{Enter}seven{Enter}eight");
    await waitFor(() => expect(field.scrollHeight).toBeGreaterThan(field.clientHeight));
    const capped = field.clientHeight;
    await userEvent.type(field, "{Enter}nine");
    await expect(field.clientHeight).toBe(capped);

    // The footer bar stays attached to the bottom edge of the frame.
    const gap = frame.getBoundingClientRect().bottom - footer.getBoundingClientRect().bottom;
    await expect(gap).toBeLessThanOrEqual(2);
  },
};

export const CharacterCounter: Story = {
  args: {
    label: "Headline",
    helperText: undefined,
    info: undefined,
    minRows: 2,
    maxLength: 20,
    defaultValue: "Launching Aureus",
    showAction: false,
  },
  play: async ({ canvas, canvasElement }) => {
    const counter = canvasElement.querySelector("[data-slot=field-counter]") as HTMLElement;
    await expect(counter).toHaveTextContent("16/20");
    await userEvent.type(canvas.getByRole("textbox", { name: "Headline" }), " 2.0 now");
    await expect(counter).toHaveTextContent("20/20");
    await expect(counter).toHaveAttribute("data-limit", "true");
  },
};

function Composer() {
  const [draft, setDraft] = useState("");
  const [posted, setPosted] = useState<string[]>([]);
  return (
    <div className="flex flex-col gap-4">
      <ul aria-label="Posted comments" className="flex flex-col gap-2 text-sm">
        {posted.map((comment, index) => (
          // biome-ignore lint/suspicious/noArrayIndexKey: comments are only appended.
          <li key={index} className="rounded-md bg-muted px-3 py-2 whitespace-pre-wrap">
            {comment}
          </li>
        ))}
      </ul>
      <TextAreaField
        label="Add a comment"
        value={draft}
        onChange={(event) => setDraft(event.target.value)}
        minRows={2}
        maxRows={6}
        maxLength={280}
        showCount
        actionShortcut
        action={{
          children: "Post",
          variant: "default",
          disabled: draft.trim() === "",
          onClick: () => {
            setPosted((current) => [...current, draft.trim()]);
            setDraft("");
          },
        }}
      />
    </div>
  );
}

export const CommentComposer: Story = {
  render: () => <Composer />,
  play: async ({ canvas }) => {
    const field = canvas.getByRole("textbox", { name: "Add a comment" });
    const post = canvas.getByRole("button", { name: "Post" });
    await expect(post).toBeDisabled();
    await expect(post).toHaveAttribute("aria-keyshortcuts", "Control+Enter Meta+Enter");

    await userEvent.type(field, "First line{Enter}second line");
    await expect(field).toHaveValue("First line\nsecond line");
    await expect(post).toBeEnabled();

    await userEvent.keyboard("{Control>}{Enter}{/Control}");
    await expect(canvas.getByRole("listitem")).toHaveTextContent("First line second line");
    await expect(field).toHaveValue("");
  },
};

export const NoResize: Story = {
  args: { label: "Feedback", resize: false, showAction: false, showCount: false },
  play: async ({ canvas }) => {
    const field = canvas.getByRole("textbox", { name: "Feedback" });
    await expect(getComputedStyle(field).resize).toBe("none");
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
  args: {
    label: "Describe the problem you found during checkout",
    helperText: "Include the steps to reproduce it.",
    actionContent: "icon",
    actionIcon: "check",
    actionText: "Submit report",
    actionTooltip: "",
  },
  play: async ({ canvas, canvasElement }) => {
    const field = canvasElement.querySelector("[data-slot=field]") as HTMLElement;
    await expect(field.scrollWidth).toBeLessThanOrEqual(field.clientWidth);
    await expect(canvas.getByRole("button", { name: "Submit report" })).toBeVisible();
  },
};
