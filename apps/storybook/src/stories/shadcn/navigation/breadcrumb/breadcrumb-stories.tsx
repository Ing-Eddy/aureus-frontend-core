import {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@aureus-core/ui/shadcn/breadcrumb";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@aureus-core/ui/shadcn/dropdown-menu";
import { expectClosed, screen } from "@sb/testing/overlay";
import type { Meta, StoryObj } from "@storybook/react-vite";
import type { ComponentProps } from "react";
import { expect, fn, userEvent } from "storybook/test";
import { docs } from "./breadcrumb-docs";

interface BreadcrumbArgs {
  current: string;
}

const meta = {
  title: "shadcn/Navigation/Breadcrumb",
  parameters: { aureusDocs: docs },
  args: { current: "Members" },
  argTypes: { current: { control: "text", table: { category: "Content" } } },
  render: ({ current }) => (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="#home">Home</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbLink href="#settings">Settings</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbPage>{current}</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  ),
} satisfies Meta<BreadcrumbArgs>;

export default meta;
type Story = StoryObj<typeof meta>;

/** The landmark is named, ancestors are links, and the current page has `aria-current`. */
export const Playground: Story = {
  play: async ({ canvas }) => {
    const nav = canvas.getByRole("navigation", { name: "breadcrumb" });
    await expect(nav).toBeInTheDocument();
    await expect(canvas.getAllByRole("link", { name: /Home|Settings/ })).toHaveLength(2);
    await expect(canvas.getByText("Members")).toHaveAttribute("aria-current", "page");
    await userEvent.tab();
    await userEvent.tab();
    await userEvent.tab();
    await expect(canvas.getByText("Members")).not.toHaveFocus();
  },
};

/** The ellipsis opens a menu with the collapsed levels. */
export const WithEllipsisMenu: Story = {
  args: { onNavigate: fn() } as never,
  render: (args) => {
    const onNavigate = (args as unknown as { onNavigate: (to: string) => void }).onNavigate;
    return (
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="#home">Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <DropdownMenu>
              <DropdownMenuTrigger
                className="flex items-center gap-1 rounded-md"
                aria-label="Show hidden levels"
              >
                <BreadcrumbEllipsis />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                {["Documentation", "Components"].map((level) => (
                  <DropdownMenuItem key={level} onSelect={() => onNavigate(level)}>
                    {level}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Breadcrumb</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    );
  },
  play: async ({ args, canvas }) => {
    await userEvent.click(canvas.getByRole("button", { name: "Show hidden levels" }));
    await userEvent.click(await screen().findByRole("menuitem", { name: "Components" }));
    await expect((args as unknown as { onNavigate: unknown }).onNavigate).toHaveBeenCalledWith(
      "Components",
    );
    await expectClosed("menu");
  },
};

export const CustomSeparator: Story = {
  render: () => (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="#home">Home</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator>/</BreadcrumbSeparator>
        <BreadcrumbItem>
          <BreadcrumbLink href="#projects">Projects</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator>/</BreadcrumbSeparator>
        <BreadcrumbItem>
          <BreadcrumbPage>Aureus</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  ),
};

/** Stand-in for a router `Link` (Next.js, React Router): an anchor with a `to` prop. */
function AppLink({ to, ...props }: ComponentProps<"a"> & { to: string }) {
  return <a href={`#${to}`} data-router-link="" {...props} />;
}

export const RouterLink: Story = {
  render: () => (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <AppLink to="/">Home</AppLink>
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbPage>Profile</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  ),
  play: async ({ canvas }) => {
    await expect(canvas.getByRole("link", { name: "Home" })).toHaveAttribute("data-router-link");
  },
};
