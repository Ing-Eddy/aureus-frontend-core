import { Button } from "@aureus-core/ui/shadcn/button";
import { Checkbox } from "@aureus-core/ui/shadcn/checkbox";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSeparator,
  FieldSet,
  FieldTitle,
} from "@aureus-core/ui/shadcn/field";
import { Input } from "@aureus-core/ui/shadcn/input";
import { RadioGroup, RadioGroupItem } from "@aureus-core/ui/shadcn/radio-group";
import { Switch } from "@aureus-core/ui/shadcn/switch";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent } from "storybook/test";
import { docs } from "./field-docs";

const meta = {
  title: "shadcn/Forms/Field",
  component: Field,
  parameters: { aureusDocs: docs },
  args: { orientation: "vertical" },
  argTypes: {
    orientation: {
      control: "inline-radio",
      options: ["vertical", "horizontal", "responsive"],
      table: { category: "Appearance" },
    },
  },
  render: (args) => (
    <FieldGroup className="w-80">
      <Field {...args}>
        <FieldLabel htmlFor="field-username">Username</FieldLabel>
        <Input id="field-username" placeholder="ada" aria-describedby="field-username-help" />
        <FieldDescription id="field-username-help">
          Choose a unique name. You can change it later.
        </FieldDescription>
      </Field>
    </FieldGroup>
  ),
} satisfies Meta<typeof Field>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Clicking the label focuses the input, and the description is its accessible description. */
export const Playground: Story = {
  play: async ({ canvas }) => {
    await userEvent.click(canvas.getByText("Username"));
    const input = canvas.getByRole("textbox", { name: "Username" });
    await expect(input).toHaveFocus();
    await expect(input).toHaveAccessibleDescription(
      "Choose a unique name. You can change it later.",
    );
  },
};

/** The error is linked to the input through `aria-describedby` and announced as an alert. */
export const WithError: Story = {
  render: (args) => (
    <FieldGroup className="w-80">
      <Field {...args} data-invalid>
        <FieldLabel htmlFor="field-email">Email</FieldLabel>
        <Input
          id="field-email"
          defaultValue="ada@"
          aria-invalid
          aria-describedby="field-email-error"
        />
        <FieldError
          id="field-email-error"
          errors={[{ message: "Enter a complete email address." }]}
        />
      </Field>
    </FieldGroup>
  ),
  play: async ({ canvas }) => {
    const input = canvas.getByRole("textbox", { name: "Email" });
    await expect(input).toHaveAttribute("aria-invalid", "true");
    await expect(input).toHaveAccessibleDescription("Enter a complete email address.");
    await expect(canvas.getByRole("alert")).toHaveTextContent("Enter a complete email address.");
  },
};

export const Horizontal: Story = {
  render: () => (
    <FieldGroup className="w-96">
      <Field orientation="horizontal">
        <FieldContent>
          <FieldLabel htmlFor="field-marketing">Marketing emails</FieldLabel>
          <FieldDescription id="field-marketing-help">
            Product news and offers, once a month.
          </FieldDescription>
        </FieldContent>
        <Switch id="field-marketing" aria-describedby="field-marketing-help" />
      </Field>
      <Field orientation="horizontal">
        <Checkbox id="field-security" defaultChecked />
        <FieldLabel htmlFor="field-security">Security alerts</FieldLabel>
      </Field>
    </FieldGroup>
  ),
  play: async ({ canvas }) => {
    const toggle = canvas.getByRole("switch", { name: "Marketing emails" });
    await userEvent.click(canvas.getByText("Marketing emails"));
    await expect(toggle).toBeChecked();
  },
};

export const FieldSetWithLegend: Story = {
  render: () => (
    <FieldSet className="w-80">
      <FieldLegend>Notifications</FieldLegend>
      <FieldDescription>Choose where we contact you.</FieldDescription>
      <FieldGroup data-slot="checkbox-group">
        {["Email", "SMS", "Push"].map((channel) => (
          <Field key={channel} orientation="horizontal">
            <Checkbox id={`field-channel-${channel}`} defaultChecked={channel === "Email"} />
            <FieldLabel htmlFor={`field-channel-${channel}`}>{channel}</FieldLabel>
          </Field>
        ))}
      </FieldGroup>
    </FieldSet>
  ),
  play: async ({ canvas }) => {
    const group = canvas.getByRole("group", { name: "Notifications" });
    await expect(group.tagName).toBe("FIELDSET");
    await expect(canvas.getByRole("checkbox", { name: "Email" })).toBeChecked();
  },
};

const plans = [
  { value: "starter", title: "Starter", description: "For individuals. Up to 3 projects." },
  { value: "team", title: "Team", description: "For small teams. Unlimited projects." },
] as const;

export const ChoiceCards: Story = {
  render: () => (
    <FieldSet className="w-96">
      <FieldLegend variant="label">Plan</FieldLegend>
      <RadioGroup defaultValue="starter">
        {plans.map((plan) => (
          <FieldLabel key={plan.value} htmlFor={`field-plan-${plan.value}`}>
            <Field orientation="horizontal">
              <FieldContent>
                <FieldTitle id={`field-plan-${plan.value}-title`}>{plan.title}</FieldTitle>
                <FieldDescription id={`field-plan-${plan.value}-help`}>
                  {plan.description}
                </FieldDescription>
              </FieldContent>
              {/* The radio is a <button>; axe does not take a wrapping <label> as its name. */}
              <RadioGroupItem
                value={plan.value}
                id={`field-plan-${plan.value}`}
                aria-labelledby={`field-plan-${plan.value}-title`}
                aria-describedby={`field-plan-${plan.value}-help`}
              />
            </Field>
          </FieldLabel>
        ))}
      </RadioGroup>
    </FieldSet>
  ),
  play: async ({ canvas }) => {
    await userEvent.click(canvas.getByText("For small teams. Unlimited projects."));
    await expect(canvas.getByRole("radio", { name: "Team" })).toBeChecked();
  },
};

export const WithSeparator: Story = {
  render: () => (
    <FieldGroup className="w-80">
      <Field>
        <Button variant="outline" type="button">
          Continue with GitHub
        </Button>
      </Field>
      <FieldSeparator>Or continue with</FieldSeparator>
      <Field>
        <FieldLabel htmlFor="field-sep-email">Email</FieldLabel>
        <Input id="field-sep-email" type="email" placeholder="you@example.com" />
      </Field>
    </FieldGroup>
  ),
};
