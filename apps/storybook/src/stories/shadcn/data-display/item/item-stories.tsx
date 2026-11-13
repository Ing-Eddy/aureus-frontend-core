import { Avatar, AvatarFallback, AvatarImage } from "@aureus-core/ui/shadcn/avatar";
import { Button } from "@aureus-core/ui/shadcn/button";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
  ItemSeparator,
  ItemTitle,
} from "@aureus-core/ui/shadcn/item";
import { asset } from "@fixtures/asset";
import { users } from "@fixtures/users";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { ChevronRightIcon, PlusIcon, ShieldCheckIcon } from "lucide-react";
import { Fragment } from "react";
import { expect } from "storybook/test";
import { docs } from "./item-docs";

interface ItemArgs {
  variant: "default" | "outline" | "muted";
  size: "default" | "sm" | "xs";
  title: string;
  description: string;
}

const meta = {
  title: "shadcn/Data Display/Item",
  parameters: { aureusDocs: docs },
  args: {
    variant: "outline",
    size: "default",
    title: "Two-factor authentication",
    description: "Verify your identity with an app when you sign in.",
  },
  argTypes: {
    variant: {
      control: "inline-radio",
      options: ["default", "outline", "muted"],
      table: { category: "Appearance" },
    },
    size: {
      control: "inline-radio",
      options: ["default", "sm", "xs"],
      table: { category: "Appearance" },
    },
    title: { control: "text", table: { category: "Content" } },
    description: { control: "text", table: { category: "Content" } },
  },
  render: ({ variant, size, title, description }) => (
    <Item variant={variant} size={size} className="w-96">
      <ItemMedia variant="icon">
        <ShieldCheckIcon aria-hidden />
      </ItemMedia>
      <ItemContent>
        <ItemTitle>{title}</ItemTitle>
        <ItemDescription>{description}</ItemDescription>
      </ItemContent>
      <ItemActions>
        <Button size="sm" variant="outline">
          Enable
        </Button>
      </ItemActions>
    </Item>
  ),
} satisfies Meta<ItemArgs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Variants: Story = {
  render: (args) => (
    <div className="grid gap-3">
      {(["default", "outline", "muted"] as const).map((variant) => (
        <Item key={variant} variant={variant} className="w-96">
          <ItemContent>
            <ItemTitle>{variant}</ItemTitle>
            <ItemDescription>{args.description}</ItemDescription>
          </ItemContent>
        </Item>
      ))}
    </div>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div className="grid gap-3">
      {(["default", "sm", "xs"] as const).map((size) => (
        <Item key={size} size={size} variant="outline" className="w-96">
          <ItemContent>
            <ItemTitle>size="{size}"</ItemTitle>
          </ItemContent>
        </Item>
      ))}
    </div>
  ),
};

export const WithMedia: Story = {
  render: () => (
    <div className="grid w-96 gap-3">
      <Item variant="outline">
        <ItemMedia variant="icon">
          <ShieldCheckIcon aria-hidden />
        </ItemMedia>
        <ItemContent>
          <ItemTitle>Icon media</ItemTitle>
        </ItemContent>
      </Item>
      <Item variant="outline">
        <ItemMedia>
          <Avatar>
            <AvatarImage src={users[1]?.avatar} alt="" />
            <AvatarFallback>{users[1]?.initials}</AvatarFallback>
          </Avatar>
        </ItemMedia>
        <ItemContent>
          <ItemTitle>{users[1]?.name}</ItemTitle>
          <ItemDescription>{users[1]?.email}</ItemDescription>
        </ItemContent>
      </Item>
      <Item variant="outline">
        <ItemMedia variant="image">
          <img src={asset("/images/ocean.svg")} alt="" />
        </ItemMedia>
        <ItemContent>
          <ItemTitle>Ocean waves</ItemTitle>
          <ItemDescription>Ambient · 42 min</ItemDescription>
        </ItemContent>
      </Item>
    </div>
  ),
};

/** The group is a list with one list item per person. */
export const List: Story = {
  render: () => (
    <ItemGroup className="w-96 rounded-lg border">
      {users.slice(0, 4).map((user, index) => (
        <Fragment key={user.id}>
          {index > 0 && <ItemSeparator />}
          {/* ItemGroup is role="list" but Item adds no role: give each row role="listitem". */}
          <Item size="sm" role="listitem">
            <ItemMedia>
              <Avatar size="sm">
                <AvatarImage src={user.avatar} alt="" />
                <AvatarFallback>{user.initials}</AvatarFallback>
              </Avatar>
            </ItemMedia>
            <ItemContent>
              <ItemTitle>{user.name}</ItemTitle>
              <ItemDescription>{user.role}</ItemDescription>
            </ItemContent>
            <ItemActions>
              <Button size="icon-sm" variant="ghost" aria-label={`Invite ${user.name}`}>
                <PlusIcon />
              </Button>
            </ItemActions>
          </Item>
        </Fragment>
      ))}
    </ItemGroup>
  ),
  play: async ({ canvas }) => {
    await expect(canvas.getByRole("list")).toBeInTheDocument();
    await expect(canvas.getAllByRole("listitem")).toHaveLength(4);
  },
};

export const AsLink: Story = {
  render: () => (
    <Item asChild variant="outline" className="w-96">
      <a href="#billing">
        <ItemContent>
          <ItemTitle>Billing</ItemTitle>
          <ItemDescription>Invoices, payment methods and plan.</ItemDescription>
        </ItemContent>
        <ItemActions>
          <ChevronRightIcon className="size-4" aria-hidden />
        </ItemActions>
      </a>
    </Item>
  ),
  play: async ({ canvas }) => {
    await expect(canvas.getByRole("link", { name: /Billing/ })).toHaveAttribute(
      "data-slot",
      "item",
    );
  },
};
