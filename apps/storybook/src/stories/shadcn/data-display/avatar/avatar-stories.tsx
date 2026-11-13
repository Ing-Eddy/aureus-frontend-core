import {
  Avatar,
  AvatarBadge,
  AvatarFallback,
  AvatarGroup,
  AvatarGroupCount,
  AvatarImage,
} from "@aureus-core/ui/shadcn/avatar";
import { asset } from "@fixtures/asset";
import { users } from "@fixtures/users";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { UserIcon } from "lucide-react";
import { expect } from "storybook/test";
import { docs } from "./avatar-docs";

const [ada, grace, alan, linus] = users;

interface AvatarArgs {
  size: "default" | "sm" | "lg";
  src: string;
  initials: string;
}

const meta = {
  title: "shadcn/Data Display/Avatar",
  parameters: { aureusDocs: docs },
  args: { size: "default", src: ada?.avatar ?? "", initials: ada?.initials ?? "" },
  argTypes: {
    size: {
      control: "inline-radio",
      options: ["sm", "default", "lg"],
      table: { category: "Appearance" },
    },
    src: { control: "text", table: { category: "Content" } },
    initials: { control: "text", table: { category: "Content" } },
  },
  render: ({ size, src, initials }) => (
    <Avatar size={size}>
      <AvatarImage src={src} alt="Ada Lovelace" />
      <AvatarFallback>{initials}</AvatarFallback>
    </Avatar>
  ),
} satisfies Meta<AvatarArgs>;

export default meta;
type Story = StoryObj<typeof meta>;

/** The local image loads and replaces the fallback. */
export const Playground: Story = {
  play: async ({ canvas }) => {
    await expect(await canvas.findByRole("img", { name: "Ada Lovelace" })).toBeVisible();
  },
};

export const Sizes: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      {(["sm", "default", "lg"] as const).map((size) => (
        <Avatar key={size} size={size}>
          <AvatarImage src={grace?.avatar} alt={`Grace Hopper (${size})`} />
          <AvatarFallback>{grace?.initials}</AvatarFallback>
        </Avatar>
      ))}
    </div>
  ),
};

/** A missing file falls back to the initials. */
export const Fallback: Story = {
  render: () => (
    <div className="flex gap-4">
      <Avatar>
        <AvatarImage src={asset("/avatars/missing.svg")} alt="Alan Turing" />
        <AvatarFallback>AT</AvatarFallback>
      </Avatar>
      <Avatar>
        <AvatarFallback>
          <UserIcon className="size-4" aria-label="Unknown user" />
        </AvatarFallback>
      </Avatar>
    </div>
  ),
  play: async ({ canvas }) => {
    await expect(await canvas.findByText("AT")).toBeVisible();
    await expect(canvas.queryByRole("img", { name: "Alan Turing" })).toBeNull();
  },
};

export const WithBadge: Story = {
  render: () => (
    <Avatar size="lg">
      <AvatarImage src={linus?.avatar} alt="Linus Torvalds" />
      <AvatarFallback>{linus?.initials}</AvatarFallback>
      <AvatarBadge className="bg-green-600">
        <span className="sr-only">Online</span>
      </AvatarBadge>
    </Avatar>
  ),
};

export const Group: Story = {
  render: () => (
    <AvatarGroup>
      {[ada, grace, alan].map((user) => (
        <Avatar key={user?.id}>
          <AvatarImage src={user?.avatar} alt={user?.name ?? ""} />
          <AvatarFallback>{user?.initials}</AvatarFallback>
        </Avatar>
      ))}
      <AvatarGroupCount>
        +3<span className="sr-only"> more people</span>
      </AvatarGroupCount>
    </AvatarGroup>
  ),
};
