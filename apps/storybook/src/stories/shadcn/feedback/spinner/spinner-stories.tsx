import { Badge } from "@aureus-core/ui/shadcn/badge";
import { Button } from "@aureus-core/ui/shadcn/button";
import { Spinner } from "@aureus-core/ui/shadcn/spinner";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect } from "storybook/test";
import { docs } from "./spinner-docs";

const meta = {
  title: "shadcn/Feedback/Spinner",
  component: Spinner,
  parameters: { aureusDocs: docs },
  args: { className: "size-6", "aria-label": "Loading results" },
  argTypes: {
    className: { control: "text", table: { category: "Appearance" } },
    "aria-label": { control: "text", table: { category: "Content" } },
  },
} satisfies Meta<typeof Spinner>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  play: async ({ canvas }) => {
    await expect(canvas.getByRole("status", { name: "Loading results" })).toBeInTheDocument();
  },
};

export const Sizes: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      {["size-3", "size-4", "size-6", "size-8"].map((size) => (
        <Spinner key={size} className={size} aria-label={`Loading (${size})`} />
      ))}
    </div>
  ),
};

export const InButton: Story = {
  render: () => (
    <div className="flex gap-2">
      <Button disabled>
        <Spinner data-icon="inline-start" />
        Saving…
      </Button>
      <Button variant="outline" disabled>
        <Spinner data-icon="inline-start" />
        Uploading
      </Button>
    </div>
  ),
  play: async ({ canvas }) => {
    await expect(canvas.getByRole("button", { name: /Saving/ })).toBeDisabled();
  },
};

export const InBadge: Story = {
  render: () => (
    <Badge variant="secondary">
      <Spinner aria-label="Syncing" />
      Syncing
    </Badge>
  ),
};

export const WithText: Story = {
  render: () => (
    <p className="flex items-center gap-2 text-muted-foreground text-sm">
      <Spinner aria-label="Loading messages" />
      Loading messages…
    </p>
  ),
};
