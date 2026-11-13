import { Alert, AlertAction, AlertDescription, AlertTitle } from "@aureus-core/ui/shadcn/alert";
import { Button } from "@aureus-core/ui/shadcn/button";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { CircleAlertIcon, CircleCheckIcon, InfoIcon } from "lucide-react";
import { expect, fn, userEvent } from "storybook/test";
import { docs } from "./alert-docs";

interface AlertArgs {
  variant: "default" | "destructive";
  title: string;
  description: string;
  onUndo: () => void;
}

const meta = {
  title: "shadcn/Feedback/Alert",
  parameters: { aureusDocs: docs },
  args: {
    variant: "default",
    title: "Changes saved",
    description: "Your profile was updated and is now visible to your team.",
    onUndo: fn(),
  },
  argTypes: {
    variant: {
      control: "inline-radio",
      options: ["default", "destructive"],
      table: { category: "Appearance" },
    },
    title: { control: "text", table: { category: "Content" } },
    description: { control: "text", table: { category: "Content" } },
    onUndo: { table: { category: "Events" } },
  },
  render: ({ variant, title, description }) => (
    <Alert variant={variant} className="w-[28rem]">
      {variant === "destructive" ? (
        <CircleAlertIcon aria-hidden />
      ) : (
        <CircleCheckIcon aria-hidden />
      )}
      <AlertTitle>{title}</AlertTitle>
      <AlertDescription>{description}</AlertDescription>
    </Alert>
  ),
} satisfies Meta<AlertArgs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  play: async ({ canvas }) => {
    await expect(canvas.getByRole("alert")).toHaveTextContent("Changes saved");
  },
};

export const Destructive: Story = {
  args: {
    variant: "destructive",
    title: "Payment failed",
    description: "Your card was declined. Update your payment method to keep your plan.",
  },
};

export const WithAction: Story = {
  render: ({ onUndo }) => (
    <Alert className="w-[28rem]">
      <CircleCheckIcon aria-hidden />
      <AlertTitle>Message archived</AlertTitle>
      <AlertDescription>You can find it in the Archive folder.</AlertDescription>
      <AlertAction>
        <Button size="xs" variant="outline" onClick={onUndo}>
          Undo
        </Button>
      </AlertAction>
    </Alert>
  ),
  play: async ({ args, canvas }) => {
    await userEvent.click(canvas.getByRole("button", { name: "Undo" }));
    await expect(args.onUndo).toHaveBeenCalledTimes(1);
  },
};

export const Informational: Story = {
  render: () => (
    <Alert role="status" className="w-[28rem]">
      <InfoIcon aria-hidden />
      <AlertTitle>Scheduled maintenance</AlertTitle>
      <AlertDescription>
        The dashboard will be read-only on Sunday from 02:00 to 04:00 UTC.
      </AlertDescription>
    </Alert>
  ),
  play: async ({ canvas }) => {
    await expect(canvas.getByRole("status")).toHaveTextContent("Scheduled maintenance");
    await expect(canvas.queryByRole("alert")).toBeNull();
  },
};
