import { Avatar, AvatarFallback, AvatarImage } from "@aureus-core/ui/shadcn/avatar";
import { Button } from "@aureus-core/ui/shadcn/button";
import { Card } from "@aureus-core/ui/shadcn/card";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@aureus-core/ui/shadcn/empty";
import { users } from "@fixtures/users";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { FolderIcon, SearchXIcon } from "lucide-react";
import { expect, fn, userEvent } from "storybook/test";
import { docs } from "./empty-docs";

interface EmptyArgs {
  title: string;
  description: string;
  mediaVariant: "default" | "icon";
  onCreate: () => void;
}

const meta = {
  title: "shadcn/Data Display/Empty",
  parameters: { aureusDocs: docs },
  args: {
    title: "No projects yet",
    description: "You haven't created any projects. Get started by creating your first one.",
    mediaVariant: "icon",
    onCreate: fn(),
  },
  argTypes: {
    title: { control: "text", table: { category: "Content" } },
    description: { control: "text", table: { category: "Content" } },
    mediaVariant: {
      control: "inline-radio",
      options: ["default", "icon"],
      table: { category: "Appearance" },
    },
    onCreate: { table: { category: "Events" } },
  },
  render: ({ title, description, mediaVariant, onCreate }) => (
    <Empty className="w-[28rem]">
      <EmptyHeader>
        <EmptyMedia variant={mediaVariant}>
          <FolderIcon aria-hidden />
        </EmptyMedia>
        <EmptyTitle>
          <h3>{title}</h3>
        </EmptyTitle>
        <EmptyDescription>{description}</EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <div className="flex gap-2">
          <Button onClick={onCreate}>Create project</Button>
          <Button variant="outline">Import project</Button>
        </div>
        <Button variant="link" asChild>
          <a href="#docs">Read the projects guide</a>
        </Button>
      </EmptyContent>
    </Empty>
  ),
} satisfies Meta<EmptyArgs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  play: async ({ args, canvas }) => {
    await expect(canvas.getByRole("heading", { name: "No projects yet" })).toBeInTheDocument();
    await userEvent.click(canvas.getByRole("button", { name: "Create project" }));
    await expect(args.onCreate).toHaveBeenCalledTimes(1);
  },
};

export const WithAvatar: Story = {
  render: () => (
    <Empty className="w-[28rem]">
      <EmptyHeader>
        <EmptyMedia>
          <div className="flex -space-x-2">
            {users.slice(0, 3).map((user) => (
              <Avatar key={user.id} className="ring-2 ring-background">
                <AvatarImage src={user.avatar} alt="" />
                <AvatarFallback>{user.initials}</AvatarFallback>
              </Avatar>
            ))}
          </div>
        </EmptyMedia>
        <EmptyTitle>
          <h3>No team members</h3>
        </EmptyTitle>
        <EmptyDescription>Invite your team to collaborate on this project.</EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <Button size="sm">Invite members</Button>
      </EmptyContent>
    </Empty>
  ),
};

export const InCard: Story = {
  render: () => (
    <Card className="w-[28rem] border-dashed">
      <Empty>
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <FolderIcon aria-hidden />
          </EmptyMedia>
          <EmptyTitle>
            <h3>No files</h3>
          </EmptyTitle>
          <EmptyDescription>Drop files here or upload them from your computer.</EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <Button variant="outline" size="sm">
            Upload files
          </Button>
        </EmptyContent>
      </Empty>
    </Card>
  ),
};

export const NoResults: Story = {
  render: () => (
    <Empty className="w-[28rem]">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <SearchXIcon aria-hidden />
        </EmptyMedia>
        <EmptyTitle>
          <h3 aria-live="polite">No results for “qwerty”</h3>
        </EmptyTitle>
        <EmptyDescription>
          Check the spelling or try another term. You can also{" "}
          <a href="#browse">browse all components</a>.
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <Button variant="outline" size="sm">
          Clear search
        </Button>
      </EmptyContent>
    </Empty>
  ),
};
