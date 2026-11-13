import { Avatar, AvatarFallback, AvatarImage } from "@aureus-core/ui/shadcn/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@aureus-core/ui/shadcn/dropdown-menu";
import { Separator } from "@aureus-core/ui/shadcn/separator";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInput,
  SidebarInset,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSkeleton,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarProvider,
  SidebarRail,
  SidebarTrigger,
} from "@aureus-core/ui/shadcn/sidebar";
import { currentUser } from "@fixtures/users";
import { expectClosed, screen } from "@sb/testing/overlay";
import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  FolderIcon,
  HomeIcon,
  InboxIcon,
  MoreHorizontalIcon,
  PlusIcon,
  SettingsIcon,
  SparklesIcon,
} from "lucide-react";
import { useState } from "react";
import { expect, fn, userEvent, waitFor } from "storybook/test";
import { docs } from "./sidebar-docs";

interface ShellArgs {
  side: "left" | "right";
  variant: "sidebar" | "floating" | "inset";
  collapsible: "offcanvas" | "icon" | "none";
  defaultOpen: boolean;
  loading?: boolean;
  onOpenChange: (open: boolean) => void;
}

const main = [
  { title: "Home", icon: HomeIcon, active: true },
  { title: "Inbox", icon: InboxIcon, badge: "24" },
  { title: "Ask AI", icon: SparklesIcon },
] as const;

const projects = ["Design system", "Marketing site", "Mobile app"] as const;

function AppShell({ side, variant, collapsible, defaultOpen, loading, onOpenChange }: ShellArgs) {
  const Content = variant === "inset" ? SidebarInset : "main";
  // Passing `onOpenChange` makes SidebarProvider controlled: it stops updating its own state, so
  // `open` must be passed too.
  const [open, setOpen] = useState(defaultOpen);
  return (
    <SidebarProvider
      open={open}
      onOpenChange={(value) => {
        setOpen(value);
        onOpenChange(value);
      }}
    >
      <Sidebar side={side} variant={variant} collapsible={collapsible}>
        <SidebarHeader>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton size="lg" asChild>
                <a href="#workspace">
                  <span className="flex size-8 items-center justify-center rounded-md bg-sidebar-primary font-semibold text-sidebar-primary-foreground">
                    A
                  </span>
                  <span className="grid leading-tight">
                    <span className="font-medium">Aureus</span>
                    <span className="text-xs">Enterprise</span>
                  </span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
          <SidebarInput aria-label="Search the docs" placeholder="Search…" />
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Platform</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {loading
                  ? Array.from({ length: 3 }, (_, index) => (
                      // biome-ignore lint/suspicious/noArrayIndexKey: placeholders have no identity.
                      <SidebarMenuItem key={index}>
                        <SidebarMenuSkeleton showIcon />
                      </SidebarMenuItem>
                    ))
                  : main.map((item) => (
                      <SidebarMenuItem key={item.title}>
                        <SidebarMenuButton asChild isActive={"active" in item} tooltip={item.title}>
                          <a
                            href={`#${item.title.toLowerCase()}`}
                            aria-current={"active" in item ? "page" : undefined}
                          >
                            <item.icon />
                            <span>{item.title}</span>
                          </a>
                        </SidebarMenuButton>
                        {"badge" in item && <SidebarMenuBadge>{item.badge}</SidebarMenuBadge>}
                      </SidebarMenuItem>
                    ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
          <SidebarGroup>
            <SidebarGroupLabel>Projects</SidebarGroupLabel>
            <SidebarGroupAction aria-label="Add project">
              <PlusIcon />
            </SidebarGroupAction>
            <SidebarGroupContent>
              <SidebarMenu>
                {projects.map((project) => (
                  <SidebarMenuItem key={project}>
                    <SidebarMenuButton asChild tooltip={project}>
                      <a href={`#${project}`}>
                        <FolderIcon />
                        <span>{project}</span>
                      </a>
                    </SidebarMenuButton>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <SidebarMenuAction showOnHover aria-label={`${project} actions`}>
                          <MoreHorizontalIcon />
                        </SidebarMenuAction>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent side="right" align="start">
                        <DropdownMenuItem>Open</DropdownMenuItem>
                        <DropdownMenuItem variant="destructive">Delete</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </SidebarMenuItem>
                ))}
                <SidebarMenuItem>
                  <SidebarMenuButton tooltip="Settings">
                    <SettingsIcon />
                    <span>Settings</span>
                  </SidebarMenuButton>
                  <SidebarMenuSub>
                    {["General", "Billing", "Members"].map((sub) => (
                      <SidebarMenuSubItem key={sub}>
                        <SidebarMenuSubButton asChild isActive={sub === "Members"}>
                          <a href={`#settings-${sub.toLowerCase()}`}>{sub}</a>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    ))}
                  </SidebarMenuSub>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton size="lg">
                <Avatar className="size-8 rounded-md">
                  <AvatarImage src={currentUser.avatar} alt="" />
                  <AvatarFallback>{currentUser.initials}</AvatarFallback>
                </Avatar>
                <span className="grid leading-tight">
                  <span className="font-medium">{currentUser.name}</span>
                  <span className="text-xs">{currentUser.email}</span>
                </span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
        <SidebarRail />
      </Sidebar>
      <Content className="flex flex-1 flex-col">
        <header className="flex h-12 items-center gap-2 border-b px-3">
          <SidebarTrigger />
          <Separator orientation="vertical" className="h-4" />
          <h1 className="font-medium text-sm">Home</h1>
        </header>
        <div className="p-4 text-muted-foreground text-sm">Page content.</div>
      </Content>
    </SidebarProvider>
  );
}

const meta = {
  title: "shadcn/Navigation/Sidebar",
  parameters: { aureusDocs: docs, layout: "fullscreen" },
  args: {
    side: "left",
    variant: "sidebar",
    collapsible: "offcanvas",
    defaultOpen: true,
    onOpenChange: fn(),
  },
  argTypes: {
    side: {
      control: "inline-radio",
      options: ["left", "right"],
      table: { category: "Appearance" },
    },
    variant: {
      control: "inline-radio",
      options: ["sidebar", "floating", "inset"],
      table: { category: "Appearance" },
    },
    collapsible: {
      control: "inline-radio",
      options: ["offcanvas", "icon", "none"],
      table: { category: "Behavior" },
    },
    defaultOpen: { control: "boolean", table: { category: "State" } },
    loading: { control: "boolean", table: { category: "State" } },
    onOpenChange: { table: { category: "Events" } },
  },
  render: (args) => <AppShell key={String(args.defaultOpen)} {...args} />,
} satisfies Meta<ShellArgs>;

export default meta;
type Story = StoryObj<typeof meta>;

/** SidebarTrigger and SidebarRail are both named "Toggle Sidebar"; tests use the trigger. */
const trigger = () =>
  document.querySelector<HTMLElement>('[data-slot="sidebar-trigger"]') as HTMLElement;

const sidebarState = () =>
  document.querySelector('[data-slot="sidebar"]')?.getAttribute("data-state");

/** The trigger and ⌘B / Ctrl+B toggle the sidebar; `onOpenChange` receives the new state. */
export const Playground: Story = {
  play: async ({ args, canvas }) => {
    await expect(sidebarState()).toBe("expanded");
    await expect(canvas.getByRole("link", { name: "Home" })).toHaveAttribute(
      "aria-current",
      "page",
    );
    await expect(trigger()).toHaveAccessibleName("Toggle Sidebar");
    await userEvent.click(trigger());
    await expect(sidebarState()).toBe("collapsed");
    await expect(args.onOpenChange).toHaveBeenLastCalledWith(false);
    await userEvent.keyboard("{Control>}b{/Control}");
    await expect(sidebarState()).toBe("expanded");
    await userEvent.keyboard("{Meta>}b{/Meta}");
    await expect(sidebarState()).toBe("collapsed");
    await expect(args.onOpenChange).toHaveBeenCalledTimes(3);
  },
};

/** Collapsed to icons, a focused item shows its name in a tooltip. */
export const IconCollapsible: Story = {
  args: { collapsible: "icon", defaultOpen: false },
  play: async ({ canvas }) => {
    await expect(document.querySelector('[data-slot="sidebar"]')).toHaveAttribute(
      "data-collapsible",
      "icon",
    );
    canvas.getByRole("link", { name: "Inbox" }).focus();
    await expect(await screen().findByRole("tooltip")).toHaveTextContent("Inbox");
    await userEvent.keyboard("{Escape}");
    await expectClosed("tooltip");
  },
};

export const Floating: Story = { args: { variant: "floating" } };

export const Inset: Story = { args: { variant: "inset" } };

export const RightSide: Story = {
  args: { side: "right" },
  play: async () => {
    await expect(document.querySelector('[data-slot="sidebar"]')).toHaveAttribute(
      "data-side",
      "right",
    );
  },
};

export const Loading: Story = { args: { loading: true } };

/** On a phone the sidebar is a Sheet: the trigger opens it, Esc closes it. */
export const Mobile: Story = {
  globals: { viewport: { value: "mobile1", isRotated: false } },
  play: async ({ canvas }) => {
    await expect(screen().queryByRole("dialog")).toBeNull();
    await userEvent.click(canvas.getByRole("button", { name: "Toggle Sidebar" }));
    const sheet = await screen().findByRole("dialog", { name: "Sidebar" });
    await waitFor(() => expect(sheet).toHaveAttribute("data-mobile", "true"));
    await userEvent.keyboard("{Escape}");
    await expectClosed();
  },
};
