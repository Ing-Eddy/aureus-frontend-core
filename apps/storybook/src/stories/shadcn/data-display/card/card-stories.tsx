import { Badge } from "@aureus-core/ui/shadcn/badge";
import { Button } from "@aureus-core/ui/shadcn/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@aureus-core/ui/shadcn/card";
import { Field, FieldGroup, FieldLabel } from "@aureus-core/ui/shadcn/field";
import { Input } from "@aureus-core/ui/shadcn/input";
import { asset } from "@fixtures/asset";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { TrendingUpIcon } from "lucide-react";
import { expect } from "storybook/test";
import { docs } from "./card-docs";

interface CardArgs {
  size: "default" | "sm";
  title: string;
  description: string;
}

const meta = {
  title: "shadcn/Data Display/Card",
  parameters: { aureusDocs: docs },
  args: { size: "default", title: "Notifications", description: "You have 3 unread messages." },
  argTypes: {
    size: {
      control: "inline-radio",
      options: ["default", "sm"],
      table: { category: "Appearance" },
    },
    title: { control: "text", table: { category: "Content" } },
    description: { control: "text", table: { category: "Content" } },
  },
  render: ({ size, title, description }) => (
    <Card size={size} className="w-80">
      <CardHeader>
        <CardTitle>
          <h3>{title}</h3>
        </CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="text-sm">Push notifications are on for this device.</CardContent>
      <CardFooter>
        <Button className="w-full">Mark all as read</Button>
      </CardFooter>
    </Card>
  ),
} satisfies Meta<CardArgs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  play: async ({ canvas }) => {
    await expect(canvas.getByRole("heading", { name: "Notifications" })).toBeInTheDocument();
  },
};

export const LoginForm: Story = {
  render: () => (
    <Card className="w-96">
      <CardHeader>
        <CardTitle>
          <h3>Log in to your account</h3>
        </CardTitle>
        <CardDescription>Enter your email below to log in.</CardDescription>
        <CardAction>
          <Button variant="link" asChild>
            <a href="#signup">Sign up</a>
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent>
        <form id="card-login">
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="card-email">Email</FieldLabel>
              <Input id="card-email" type="email" placeholder="you@example.com" />
            </Field>
            <Field>
              <FieldLabel htmlFor="card-password">Password</FieldLabel>
              <Input id="card-password" type="password" />
            </Field>
          </FieldGroup>
        </form>
      </CardContent>
      <CardFooter className="flex-col gap-2">
        <Button type="submit" form="card-login" className="w-full">
          Log in
        </Button>
        <Button variant="outline" className="w-full">
          Log in with Google
        </Button>
      </CardFooter>
    </Card>
  ),
};

export const Small: Story = { args: { size: "sm" } };

export const WithImage: Story = {
  render: () => (
    <Card className="w-80 pt-0">
      <img
        src={asset("/images/mountains.svg")}
        alt="Snowy mountains at sunrise"
        className="aspect-video w-full rounded-t-xl object-cover"
      />
      <CardHeader>
        <CardTitle>
          <h3>Alpine retreat</h3>
        </CardTitle>
        <CardDescription>3 nights · from $420</CardDescription>
      </CardHeader>
      <CardFooter>
        <Button className="w-full">Book now</Button>
      </CardFooter>
    </Card>
  ),
};

export const Stat: Story = {
  render: () => (
    <Card className="w-72">
      <CardHeader>
        <CardDescription>Total revenue</CardDescription>
        <CardTitle className="font-semibold text-2xl tabular-nums">$15,231.89</CardTitle>
        <CardAction>
          <Badge variant="outline">
            <TrendingUpIcon aria-hidden />
            +20.1%
          </Badge>
        </CardAction>
      </CardHeader>
      <CardFooter className="text-muted-foreground text-sm">Compared with last month</CardFooter>
    </Card>
  ),
};
