import { Badge } from "@aureus-core/ui/shadcn/badge";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { BadgeCheckIcon, CircleAlertIcon } from "lucide-react";
import { expect } from "storybook/test";
import { docs } from "./badge-docs";

const variants = ["default", "secondary", "destructive", "outline", "ghost", "link"] as const;

const meta = {
  title: "shadcn/Data Display/Badge",
  component: Badge,
  parameters: { aureusDocs: docs },
  args: { children: "Badge", variant: "default" },
  argTypes: {
    children: { control: "text", table: { category: "Content" } },
    variant: { control: "select", options: variants, table: { category: "Appearance" } },
    asChild: { control: false, table: { category: "Behavior" } },
  },
} satisfies Meta<typeof Badge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Variants: Story = {
  render: (args) => (
    <div className="flex flex-wrap gap-2">
      {variants.map((variant) => (
        <Badge key={variant} {...args} variant={variant}>
          {variant}
        </Badge>
      ))}
    </div>
  ),
};

export const WithIcon: Story = {
  render: () => (
    <div className="flex gap-2">
      <Badge variant="secondary">
        <BadgeCheckIcon aria-hidden />
        Verified
      </Badge>
      <Badge variant="destructive">
        <CircleAlertIcon aria-hidden />
        Payment failed
      </Badge>
    </div>
  ),
};

export const AsLink: Story = {
  render: () => (
    <Badge asChild variant="outline">
      <a href="#tag-design">#design</a>
    </Badge>
  ),
  play: async ({ canvas }) => {
    await expect(canvas.getByRole("link", { name: "#design" })).toHaveAttribute(
      "data-slot",
      "badge",
    );
  },
};

export const Counter: Story = {
  render: () => (
    <p className="flex items-center gap-2 text-sm">
      Inbox
      <Badge className="tabular-nums">
        8<span className="sr-only"> unread messages</span>
      </Badge>
    </p>
  ),
};
