import { CheckboxGroupField } from "@aureus-core/ui/components/checkbox-group-field";
import { channels, permissions, sizes, weekdays } from "@fixtures/checkbox-options";
import type { Meta, StoryObj } from "@storybook/react-vite";
import type { ComponentType } from "react";
import { expect, fn, userEvent, within } from "storybook/test";
import { infoTexts, loadingTexts } from "../story-args";
import { docs } from "./checkbox-group-field-docs";

/** Flat, story-only args; the render builds `selectAll` from its label. */
interface PlaygroundArgs {
  label: string;
  helperText: string;
  info: string;
  infoLabel: string;
  errorMessage: string;
  selectAllLabel: string;
  maxSelected?: number;
  maxSelectedMessage: string;
  orientation: "vertical" | "horizontal";
  columns?: 2 | 3 | 4;
  appearance: "plain" | "card";
  checkboxPosition: "start" | "end";
  required: boolean;
  loading: boolean;
  loadingLabel: string;
  disabled: boolean;
  error: boolean;
  onValueChange: (value: string[]) => void;
}

const text = (value: string) => (value === "" ? undefined : value);

const content = { table: { category: "Content" } };
const behavior = { table: { category: "Behavior" } };
const layout = { table: { category: "Layout" } };
const state = { table: { category: "State" } };

/** Waits for nothing: the computed style of an element, for real-style assertions. */
const style = (element: Element, pseudo?: string) => getComputedStyle(element, pseudo);

const meta = {
  title: "components/Forms/Checkbox Group Field",
  component: CheckboxGroupField as unknown as ComponentType<PlaygroundArgs>,
  parameters: { aureusDocs: docs },
  decorators: [
    (Story) => (
      <div className="w-full max-w-sm">
        <Story />
      </div>
    ),
  ],
  render: (args) => (
    <CheckboxGroupField
      label={text(args.label)}
      helperText={text(args.helperText)}
      {...infoTexts(args.info, args.infoLabel)}
      errorMessage={text(args.errorMessage)}
      options={channels}
      selectAll={args.selectAllLabel ? { label: args.selectAllLabel } : undefined}
      maxSelected={args.maxSelected}
      maxSelectedMessage={text(args.maxSelectedMessage)}
      orientation={args.orientation}
      columns={args.columns}
      appearance={args.appearance}
      checkboxPosition={args.checkboxPosition}
      required={args.required}
      {...loadingTexts(args.loading, args.loadingLabel)}
      disabled={args.disabled}
      error={args.error}
      onValueChange={args.onValueChange}
    />
  ),
  args: {
    label: "Notification channels",
    helperText: "",
    info: "",
    infoLabel: "More information",
    errorMessage: "",
    selectAllLabel: "",
    maxSelectedMessage: "",
    orientation: "vertical",
    appearance: "plain",
    checkboxPosition: "start",
    required: false,
    loading: false,
    loadingLabel: "Loading",
    disabled: false,
    error: false,
    onValueChange: fn(),
  },
  argTypes: {
    label: { control: "text", ...content },
    helperText: { control: "text", ...content },
    info: { control: "text", ...content },
    infoLabel: { control: "text", ...content },
    errorMessage: { control: "text", ...content },
    selectAllLabel: { control: "text", name: "selectAll.label", ...behavior },
    maxSelected: { control: { type: "number", min: 1 }, ...behavior },
    maxSelectedMessage: { control: "text", ...behavior },
    orientation: { control: "inline-radio", options: ["vertical", "horizontal"], ...layout },
    columns: { control: "inline-radio", options: [undefined, 2, 3, 4], ...layout },
    appearance: { control: "inline-radio", options: ["plain", "card"], ...layout },
    checkboxPosition: { control: "inline-radio", options: ["start", "end"], ...layout },
    required: { control: "boolean", ...state },
    loading: { control: "boolean", ...state },
    loadingLabel: { control: "text", ...content },
    disabled: { control: "boolean", ...state },
    error: { control: "boolean", ...state },
    onValueChange: { table: { category: "Events" } },
  },
} satisfies Meta<PlaygroundArgs>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Every extra has a control; texts start empty to show that nothing appears without them. */
export const Playground: Story = {
  play: async ({ args, canvas }) => {
    await userEvent.click(canvas.getByRole("checkbox", { name: "Slack" }));
    await userEvent.click(canvas.getByRole("checkbox", { name: "Email" }));
    await expect(args.onValueChange).toHaveBeenLastCalledWith(["email", "slack"]);
  },
};

export const Basic: Story = {
  render: () => <CheckboxGroupField label="Sizes" options={sizes} />,
  play: async ({ canvas }) => {
    const group = canvas.getByRole("group", { name: "Sizes" });
    await userEvent.click(within(group).getByText("M"));
    const box = canvas.getByRole("checkbox", { name: "M" });
    await expect(box).toHaveAttribute("aria-checked", "true");
    await expect(style(box).backgroundColor).not.toBe("rgba(0, 0, 0, 0)");
  },
};

export const WithDescriptions: Story = {
  render: () => <CheckboxGroupField label="Notification channels" options={channels} />,
  play: async ({ canvas }) => {
    await expect(canvas.getByRole("checkbox", { name: "Email" })).toHaveAccessibleDescription(
      "A daily digest of your activity.",
    );
    await expect(canvas.getByRole("checkbox", { name: "Push notifications" })).toBeDisabled();
  },
};

export const SelectAll: Story = {
  render: () => (
    <CheckboxGroupField
      label="Permissions"
      options={permissions}
      selectAll={{ label: "All permissions" }}
      defaultValue={["read"]}
    />
  ),
  play: async ({ canvas }) => {
    const all = canvas.getByRole("checkbox", { name: "All permissions" });
    await expect(all).toHaveAttribute("aria-checked", "mixed");
    // The mixed state is drawn by our classes on top of shadcn: assert the fill and the dash.
    await expect(style(all).backgroundColor).not.toBe("rgba(0, 0, 0, 0)");
    await expect(style(all, "::before").width).toBe("8px");
    await userEvent.click(all);
    await expect(all).toHaveAttribute("aria-checked", "true");
    await expect(canvas.getByRole("checkbox", { name: "Administer" })).toHaveAttribute(
      "aria-checked",
      "true",
    );
  },
};

export const MaxSelected: Story = {
  render: () => (
    <div className="flex flex-col gap-8">
      <CheckboxGroupField label="Permissions (no message)" options={permissions} maxSelected={3} />
      <CheckboxGroupField
        label="Permissions"
        options={permissions}
        maxSelected={3}
        maxSelectedMessage="You can choose up to 3 permissions."
        defaultValue={["read", "write"]}
      />
    </div>
  ),
  play: async ({ canvas }) => {
    const group = within(canvas.getByRole("group", { name: "Permissions" }));
    await userEvent.click(group.getByRole("checkbox", { name: "Delete" }));
    await expect(group.getByRole("checkbox", { name: "Share" })).toBeDisabled();
    await expect(group.getByRole("status")).toHaveTextContent(
      "You can choose up to 3 permissions.",
    );
    const silent = within(canvas.getByRole("group", { name: "Permissions (no message)" }));
    await expect(silent.getByRole("status")).toHaveTextContent("");
  },
};

export const Horizontal: Story = {
  render: () => <CheckboxGroupField label="Sizes" options={sizes} orientation="horizontal" />,
  play: async ({ canvasElement }) => {
    const [first, second] = [...canvasElement.querySelectorAll("[data-slot=checkbox-row]")];
    if (!first || !second) throw new Error("rows not rendered");
    await expect(first.getBoundingClientRect().top).toBe(second.getBoundingClientRect().top);
  },
};

export const Columns: Story = {
  decorators: [(Story) => <Story />],
  render: () => (
    <div className="flex flex-col gap-8">
      <div data-testid="wide" className="w-[34rem]">
        <CheckboxGroupField label="Working days" options={weekdays} columns={3} />
      </div>
      <div data-testid="narrow" className="w-56 border border-dashed p-2">
        <CheckboxGroupField label="Working days (narrow)" options={weekdays} columns={3} />
      </div>
    </div>
  ),
  play: async ({ canvas }) => {
    const tracks = (testId: string) => {
      const grid = canvas
        .getByTestId(testId)
        .querySelector("[data-slot=checkbox-group-options]") as HTMLElement;
      return style(grid).gridTemplateColumns.split(" ").length;
    };
    await expect(tracks("wide")).toBe(3);
    await expect(tracks("narrow")).toBe(1);
  },
};

export const Cards: Story = {
  render: () => (
    <CheckboxGroupField
      label="Notification channels"
      options={channels}
      appearance="card"
      defaultValue={["email"]}
    />
  ),
  play: async ({ canvasElement, canvas }) => {
    const [checkedCard, card] = [
      ...canvasElement.querySelectorAll<HTMLElement>("[data-slot=checkbox-row]"),
    ];
    if (!checkedCard || !card) throw new Error("cards not rendered");
    await expect(style(checkedCard).borderColor).not.toBe(style(card).borderColor);
    // A disabled option (Push) must not dim the enabled boxes.
    const email = canvas.getByRole("checkbox", { name: "Email" });
    await expect(style(email).opacity).toBe("1");
    await expect(style(canvas.getByRole("checkbox", { name: "Push notifications" })).opacity).toBe(
      "0.5",
    );
    await userEvent.click(card);
    await expect(canvas.getByRole("checkbox", { name: "SMS" })).toHaveAttribute(
      "aria-checked",
      "true",
    );
  },
};

export const Keyboard: Story = {
  render: () => <CheckboxGroupField label="Notification channels" options={channels} />,
  play: async ({ canvas }) => {
    await userEvent.tab();
    await expect(canvas.getByRole("checkbox", { name: "Email" })).toHaveFocus();
    await userEvent.keyboard(" ");
    await userEvent.tab();
    await userEvent.tab();
    // Push notifications is disabled, so Tab goes from SMS to Slack.
    await expect(canvas.getByRole("checkbox", { name: "Slack" })).toHaveFocus();
    await userEvent.keyboard(" ");
    await expect(canvas.getByRole("checkbox", { name: "Email" })).toHaveAttribute(
      "aria-checked",
      "true",
    );
    await expect(canvas.getByRole("checkbox", { name: "Slack" })).toHaveAttribute(
      "aria-checked",
      "true",
    );
  },
};

export const States: Story = {
  render: () => (
    <div className="flex flex-col gap-8">
      <CheckboxGroupField
        infoLabel="More information"
        label="Channels"
        options={channels}
        required
        info="We never share your contact details."
        helperText="Choose at least one."
      />
      <CheckboxGroupField
        label="Permissions"
        options={permissions.slice(0, 3)}
        error
        errorMessage="Choose at least one permission."
      />
      <CheckboxGroupField
        loadingLabel="Loading"
        label="Sizes (loading)"
        options={sizes}
        loading
        defaultValue={["m"]}
      />
      <CheckboxGroupField label="Sizes (disabled)" options={sizes} disabled defaultValue={["l"]} />
    </div>
  ),
  play: async ({ canvas }) => {
    await expect(canvas.getByRole("alert")).toHaveTextContent("Choose at least one permission.");
    await expect(canvas.getByRole("group", { name: "Sizes (loading)" })).toHaveAttribute(
      "aria-busy",
      "true",
    );
    await expect(canvas.getByRole("checkbox", { name: "Read" })).toHaveAttribute(
      "aria-invalid",
      "true",
    );
  },
};

/** Right to left: each box moves to the inline start, on the right of its option. */
export const Rtl: Story = {
  render: () => (
    <div dir="rtl">
      <CheckboxGroupField label="Channels" options={channels} />
    </div>
  ),
  play: async ({ canvas }) => {
    const first = channels[0] as { label: string };
    const box = canvas.getByRole("checkbox", { name: first.label });
    const text = canvas.getByText(first.label);
    await expect(box.getBoundingClientRect().left).toBeGreaterThanOrEqual(
      text.getBoundingClientRect().right - 1,
    );
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
    <CheckboxGroupField
      label="Interests"
      options={[
        { value: "news", label: "Product news and announcements from the team" },
        { value: "events", label: "Invitations to webinars and local events near you" },
        { value: "research", label: "Requests to take part in user research" },
      ]}
      helperText="You can unsubscribe at any time."
    />
  ),
  play: async ({ canvasElement }) => {
    const field = canvasElement.querySelector("[data-slot=field]") as HTMLElement;
    await expect(field.scrollWidth).toBeLessThanOrEqual(field.clientWidth);
  },
};
