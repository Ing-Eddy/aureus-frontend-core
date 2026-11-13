import { Card, CardContent, CardHeader } from "@aureus-core/ui/shadcn/card";
import { Skeleton } from "@aureus-core/ui/shadcn/skeleton";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect } from "storybook/test";
import { docs } from "./skeleton-docs";

const meta = {
  title: "shadcn/Feedback/Skeleton",
  component: Skeleton,
  parameters: { aureusDocs: docs },
  args: { className: "h-4 w-48" },
  argTypes: { className: { control: "text", table: { category: "Appearance" } } },
} satisfies Meta<typeof Skeleton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const CardSkeleton: Story = {
  render: () => (
    <Card className="w-72" aria-busy="true" aria-label="Loading article">
      <Skeleton className="mx-4 aspect-video rounded-lg" />
      <CardHeader className="gap-2">
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
      </CardHeader>
      <CardContent>
        <span className="sr-only">Loading…</span>
      </CardContent>
    </Card>
  ),
};

/** The region is marked busy while placeholders show. */
export const ListSkeleton: Story = {
  render: () => (
    <section aria-busy="true" aria-label="Team members" className="grid w-72 gap-4">
      <span className="sr-only">Loading team members…</span>
      {[0, 1, 2].map((row) => (
        <div key={row} className="flex items-center gap-3">
          <Skeleton className="size-10 rounded-full" />
          <div className="grid flex-1 gap-2">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-1/2" />
          </div>
        </div>
      ))}
    </section>
  ),
  play: async ({ canvas }) => {
    await expect(canvas.getByRole("region", { name: "Team members" })).toHaveAttribute(
      "aria-busy",
      "true",
    );
  },
};
