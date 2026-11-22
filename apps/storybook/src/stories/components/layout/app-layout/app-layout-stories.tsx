import {
  AppLayout,
  type AppLayoutCollapsible,
  AppLayoutInset,
  type AppLayoutLinkProps,
  AppLayoutMain,
  type AppLayoutMainProps,
  type AppLayoutMaxWidth,
  AppLayoutNav,
  type AppLayoutNavEntry,
  AppLayoutNavGroup,
  AppLayoutNavItem,
  AppLayoutNavSeparator,
  AppLayoutNavSkeleton,
  AppLayoutNavSubItem,
  AppLayoutNavSubmenu,
  type AppLayoutProps,
  type AppLayoutSide,
  AppLayoutSidebar,
  AppLayoutSidebarContent,
  AppLayoutSidebarFooter,
  AppLayoutSidebarHeader,
  type AppLayoutSidebarProps,
  type AppLayoutSidebarVariant,
  AppLayoutTopbar,
  AppLayoutTopbarActions,
  type AppLayoutTopbarProps,
  useAppLayoutBreadcrumb,
  useAppLayoutBreadcrumbItems,
  useAppLayoutSidebar,
} from "@aureus-core/ui/components/app-layout";
import { Button } from "@aureus-core/ui/shadcn/button";
import {
  deepTrail,
  footerEntries,
  invoiceTrail,
  longNavEntries,
  longParagraphs,
  navEntries,
} from "@fixtures/app-layout";
import { expectClosed, screen } from "@sb/testing/overlay";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { FolderIcon, ShoppingCartIcon } from "lucide-react";
import { type ReactNode, useState } from "react";
import {
  createMemoryRouter,
  Link,
  matchPath,
  Outlet,
  RouterProvider,
  useLocation,
  useMatches,
} from "react-router";
import { expect, fn, userEvent, waitFor, within } from "storybook/test";
import { docs } from "./app-layout-docs";

/**
 * The stories' links behave like a router's: they never reload the page (a real app passes its
 * router's link, see `WithReactRouter`).
 */
const renderDemoLink = ({ href, onClick, ...props }: AppLayoutLinkProps) => (
  <a
    {...props}
    href={href}
    onClick={(event) => {
      onClick?.(event);
      event.preventDefault();
    }}
  />
);

/** Records the row actions chosen in the stories. */
const actionSpy = fn();

/** A frame that fills the canvas but stays readable inside the docs page. */
const frame = "h-svh max-h-[44rem]";

/** The brand in the sidebar header. Its text hides while the sidebar is collapsed to icons. */
function Brand() {
  return (
    <div className="flex items-center gap-2 px-1 py-1.5 group-data-[collapsible=icon]/app-layout-sidebar:px-0">
      <div className="flex size-8 shrink-0 items-center justify-center rounded-md bg-primary text-sm font-semibold text-primary-foreground">
        A
      </div>
      <div className="grid min-w-0 text-sm leading-tight group-data-[collapsible=icon]/app-layout-sidebar:hidden">
        <span className="truncate font-semibold">Acme Inc</span>
        <span className="truncate text-xs text-muted-foreground">Enterprise</span>
      </div>
    </div>
  );
}

/** A page: sets its breadcrumb and shows a heading and some text. */
function Page({
  title = "INV-0042",
  trail = invoiceTrail,
  paragraphs = longParagraphs.slice(0, 3),
  children,
}: {
  title?: string;
  trail?: typeof invoiceTrail;
  paragraphs?: string[];
  children?: ReactNode;
}) {
  useAppLayoutBreadcrumbItems(trail);
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-semibold">{title}</h1>
      {children}
      {paragraphs.map((text) => (
        <p key={text} className="max-w-prose text-sm text-muted-foreground">
          {text}
        </p>
      ))}
    </div>
  );
}

interface ShellProps {
  layout?: Omit<AppLayoutProps, "children">;
  sidebar?: Partial<AppLayoutSidebarProps>;
  topbar?: Partial<AppLayoutTopbarProps>;
  main?: Omit<AppLayoutMainProps, "children">;
  nav?: ReactNode;
  children?: ReactNode;
}

/** The complete shell every story uses: brand, navigation, account links, top bar and page. */
function Shell({ layout, sidebar, topbar, main, nav, children }: ShellProps) {
  return (
    <AppLayout renderLink={renderDemoLink} {...layout} className={frame}>
      <AppLayoutSidebar {...({ mobileTitle: "Navigation", ...sidebar } as AppLayoutSidebarProps)}>
        <AppLayoutSidebarHeader>
          <Brand />
        </AppLayoutSidebarHeader>
        <AppLayoutSidebarContent>
          {nav ?? <AppLayoutNav aria-label="Main navigation" items={navEntries()} />}
        </AppLayoutSidebarContent>
        <AppLayoutSidebarFooter>
          <AppLayoutNav aria-label="Account" items={footerEntries()} />
        </AppLayoutSidebarFooter>
      </AppLayoutSidebar>
      <AppLayoutInset>
        <AppLayoutTopbar
          {...({
            triggerLabel: "Toggle sidebar",
            breadcrumbLabel: "Breadcrumb",
            ...topbar,
          } as AppLayoutTopbarProps)}
        />
        <AppLayoutMain {...main}>{children ?? <Page />}</AppLayoutMain>
      </AppLayoutInset>
    </AppLayout>
  );
}

/**
 * Collapsed to icons, every row and the brand logo sit in the middle of the sidebar's inner panel:
 * the space on each side differs by at most one pixel.
 */
async function expectCentredIcons() {
  const inner = document.querySelector('[data-slot="app-layout-sidebar-inner"]') as HTMLElement;
  const panel = inner.getBoundingClientRect();
  const squares = inner.querySelectorAll<HTMLElement>(
    '[data-slot="app-layout-nav-button"], [data-slot="app-layout-nav-submenu-trigger"], [data-slot="app-layout-sidebar-header"] .size-8',
  );
  await expect(squares.length).toBeGreaterThan(0);
  for (const square of squares) {
    const box = square.getBoundingClientRect();
    if (box.width === 0) continue;
    const start = box.left - panel.left;
    const end = panel.right - box.right;
    await expect(Math.abs(start - end)).toBeLessThanOrEqual(1);
  }
}

const sidebarElement = () =>
  document.querySelector<HTMLElement>('[data-slot="app-layout-sidebar"]');
const sidebarState = () => sidebarElement()?.getAttribute("data-state");

interface PlaygroundArgs {
  mobileTitle: string;
  triggerLabel: string;
  breadcrumbLabel: string;
  skipLinkLabel: string;
  variant: AppLayoutSidebarVariant;
  collapsible: AppLayoutCollapsible;
  width: string;
  collapsedWidth: string;
  mobileWidth: string;
  divider: boolean;
  maxWidth?: AppLayoutMaxWidth;
  defaultOpen: boolean;
  defaultSide: AppLayoutSide;
  breakpoint: number;
  keyboardShortcut: string;
  closeMobileOnNavigate: boolean;
  onOpenChange: (open: boolean) => void;
  onMobileOpenChange: (open: boolean) => void;
  onSideChange: (side: AppLayoutSide) => void;
}

const meta = {
  title: "components/Layout/AppLayout",
  parameters: { aureusDocs: docs, layout: "fullscreen" },
  args: {
    mobileTitle: "Navigation",
    triggerLabel: "Toggle sidebar",
    breadcrumbLabel: "Breadcrumb",
    skipLinkLabel: "",
    variant: "sidebar",
    collapsible: "icon",
    width: "16rem",
    collapsedWidth: "3rem",
    mobileWidth: "18rem",
    divider: false,
    defaultOpen: true,
    defaultSide: "start",
    breakpoint: 768,
    keyboardShortcut: "",
    closeMobileOnNavigate: true,
    onOpenChange: fn(),
    onMobileOpenChange: fn(),
    onSideChange: fn(),
  },
  argTypes: {
    mobileTitle: { control: "text", table: { category: "Content" } },
    triggerLabel: { control: "text", table: { category: "Content" } },
    breadcrumbLabel: { control: "text", table: { category: "Content" } },
    skipLinkLabel: { control: "text", table: { category: "Content" } },
    variant: {
      control: "inline-radio",
      options: ["sidebar", "floating", "inset"],
      table: { category: "Appearance" },
    },
    width: { control: "text", table: { category: "Appearance" } },
    collapsedWidth: { control: "text", table: { category: "Appearance" } },
    mobileWidth: { control: "text", table: { category: "Appearance" } },
    divider: { control: "boolean", table: { category: "Appearance" } },
    maxWidth: {
      control: "select",
      options: [
        undefined,
        "sm",
        "md",
        "lg",
        "xl",
        "2xl",
        "3xl",
        "4xl",
        "5xl",
        "6xl",
        "7xl",
        "full",
      ],
      table: { category: "Appearance" },
    },
    defaultOpen: { control: "boolean", table: { category: "State" } },
    defaultSide: {
      control: "inline-radio",
      options: ["start", "end"],
      table: { category: "State" },
    },
    collapsible: {
      control: "inline-radio",
      options: ["icon", "offcanvas", "none"],
      table: { category: "Behavior" },
    },
    breakpoint: { control: { type: "number", min: 0, step: 1 }, table: { category: "Behavior" } },
    keyboardShortcut: { control: "text", table: { category: "Behavior" } },
    closeMobileOnNavigate: { control: "boolean", table: { category: "Behavior" } },
    onOpenChange: { table: { category: "Events" } },
    onMobileOpenChange: { table: { category: "Events" } },
    onSideChange: { table: { category: "Events" } },
  },
  render: ({
    mobileTitle,
    triggerLabel,
    breadcrumbLabel,
    skipLinkLabel,
    variant,
    collapsible,
    width,
    collapsedWidth,
    mobileWidth,
    divider,
    maxWidth,
    defaultOpen,
    defaultSide,
    keyboardShortcut,
    ...layout
  }) => (
    <Shell
      key={`${defaultOpen}-${defaultSide}`}
      layout={{
        ...layout,
        defaultOpen,
        defaultSide,
        keyboardShortcut: keyboardShortcut || undefined,
        skipLinkLabel: skipLinkLabel || undefined,
      }}
      sidebar={{ mobileTitle, variant, collapsible, width, collapsedWidth, mobileWidth }}
      topbar={{ triggerLabel, breadcrumbLabel, divider }}
      main={{ maxWidth }}
    />
  ),
} satisfies Meta<PlaygroundArgs>;

export default meta;
type Story = StoryObj<typeof meta>;

/** The trigger collapses the sidebar to its icons and expands it again. */
export const Playground: Story = {
  play: async ({ args, canvas }) => {
    const trigger = canvas.getByRole("button", { name: "Toggle sidebar" });
    await expect(sidebarState()).toBe("expanded");
    await expect(trigger).toHaveAttribute("aria-expanded", "true");
    await userEvent.click(trigger);
    await expect(sidebarState()).toBe("collapsed");
    await expect(trigger).toHaveAttribute("aria-expanded", "false");
    await expect(args.onOpenChange).toHaveBeenLastCalledWith(false);
    await userEvent.click(trigger);
    await expect(sidebarState()).toBe("expanded");
    const breadcrumb = canvas.getByRole("navigation", { name: "Breadcrumb" });
    await expect(within(breadcrumb).getByText("INV-0042")).toHaveAttribute("aria-current", "page");
  },
};

/** `variant` only changes the appearance: attached, floating card, or inset content card. */
function VariantsDemo() {
  const [variant, setVariant] = useState<AppLayoutSidebarVariant>("floating");
  return (
    <Shell sidebar={{ variant }}>
      <Page title="Variants">
        <fieldset className="flex flex-wrap gap-4 text-sm">
          <legend className="mb-2 font-medium">Variant</legend>
          {(["sidebar", "floating", "inset"] as const).map((option) => (
            <label key={option} className="flex items-center gap-2">
              <input
                type="radio"
                name="variant"
                checked={variant === option}
                onChange={() => setVariant(option)}
              />
              {option}
            </label>
          ))}
        </fieldset>
      </Page>
    </Shell>
  );
}

export const Variants: Story = {
  render: () => <VariantsDemo />,
  play: async ({ canvas }) => {
    for (const variant of ["sidebar", "inset", "floating"] as const) {
      await userEvent.click(canvas.getByRole("radio", { name: variant }));
      await expect(sidebarElement()).toHaveAttribute("data-variant", variant);
    }
    await userEvent.click(canvas.getByRole("button", { name: "Toggle sidebar" }));
    await expect(sidebarElement()).toHaveAttribute("data-collapsible", "icon");
    // The width animates; the icons are centred once it ends.
    await waitFor(expectCentredIcons);
  },
};

/** `collapsible`: to icons (default), off the screen, or never. */
function CollapsibleDemo() {
  const [collapsible, setCollapsible] = useState<AppLayoutCollapsible>("offcanvas");
  return (
    <Shell sidebar={{ collapsible }}>
      <Page title="Collapsible modes">
        <fieldset className="flex flex-wrap gap-4 text-sm">
          <legend className="mb-2 font-medium">Collapsible</legend>
          {(["icon", "offcanvas", "none"] as const).map((option) => (
            <label key={option} className="flex items-center gap-2">
              <input
                type="radio"
                name="collapsible"
                checked={collapsible === option}
                onChange={() => setCollapsible(option)}
              />
              {option}
            </label>
          ))}
        </fieldset>
      </Page>
    </Shell>
  );
}

export const CollapsibleModes: Story = {
  render: () => <CollapsibleDemo />,
  play: async ({ canvas }) => {
    const trigger = canvas.getByRole("button", { name: "Toggle sidebar" });
    await userEvent.click(trigger);
    await expect(sidebarElement()).toHaveAttribute("data-collapsible", "offcanvas");
    // Off the screen, the sidebar's links leave the tab order.
    await expect(
      document.querySelector('[data-slot="app-layout-sidebar-container"]'),
    ).toHaveAttribute("inert");
    await userEvent.click(canvas.getByRole("radio", { name: "none" }));
    await expect(sidebarState()).toBe("expanded");
    await userEvent.click(canvas.getByRole("radio", { name: "icon" }));
    await expect(sidebarElement()).toHaveAttribute("data-collapsible", "icon");
    await userEvent.click(trigger);
    await expect(sidebarState()).toBe("expanded");
  },
};

/** Buttons that move the sidebar with `setSide` from the hook. */
function SideButtons() {
  const { side, setSide } = useAppLayoutSidebar();
  return (
    <div className="flex flex-wrap gap-2">
      <Button variant={side === "start" ? "default" : "outline"} onClick={() => setSide("start")}>
        Sidebar at start
      </Button>
      <Button variant={side === "end" ? "default" : "outline"} onClick={() => setSide("end")}>
        Sidebar at end
      </Button>
    </div>
  );
}

function SidesDemo({ onSideChange }: { onSideChange: (side: AppLayoutSide) => void }) {
  const [direction, setDirection] = useState<"ltr" | "rtl">("ltr");
  return (
    <div dir={direction}>
      <Shell layout={{ onSideChange }}>
        <Page title="Sides and right-to-left">
          <SideButtons />
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={direction === "rtl"}
              onChange={(event) => setDirection(event.target.checked ? "rtl" : "ltr")}
            />
            Right-to-left page
          </label>
        </Page>
      </Shell>
    </div>
  );
}

export const SidesAndRtl: Story = {
  render: (args) => <SidesDemo onSideChange={args.onSideChange} />,
  play: async ({ args, canvas }) => {
    const left = () => sidebarElement()?.getBoundingClientRect().left ?? -1;
    await expect(left()).toBe(0);
    await userEvent.click(canvas.getByRole("button", { name: "Sidebar at end" }));
    await expect(args.onSideChange).toHaveBeenLastCalledWith("end");
    await expect(sidebarElement()).toHaveAttribute("data-side", "end");
    await waitFor(() => expect(left()).toBeGreaterThan(0));
    await userEvent.click(canvas.getByRole("button", { name: "Sidebar at start" }));
    await waitFor(() => expect(left()).toBe(0));
  },
};

/** Below the breakpoint the sidebar is a sheet; choosing a link closes it. */
export const MobileSheet: Story = {
  globals: { viewport: { value: "mobile1", isRotated: false } },
  play: async ({ args, canvas }) => {
    await expect(sidebarElement()).toBeNull();
    const trigger = canvas.getByRole("button", { name: "Toggle sidebar" });
    await userEvent.click(trigger);
    const sheet = await screen().findByRole("dialog", { name: "Navigation" });
    await expect(args.onMobileOpenChange).toHaveBeenLastCalledWith(true);
    await userEvent.click(within(sheet).getByRole("link", { name: "Inbox" }));
    await expectClosed();
    await expect(args.onMobileOpenChange).toHaveBeenLastCalledWith(false);
    await waitFor(() => expect(trigger).toHaveFocus());
  },
};

/** The whole navigation from one array, with a collapsible group and row actions. */
function ConfigDemo({ onAction }: { onAction: (id: string) => void }) {
  return <Shell nav={<AppLayoutNav aria-label="Main navigation" items={navEntries(onAction)} />} />;
}

export const NavFromConfig: Story = {
  render: () => <ConfigDemo onAction={actionSpy} />,
  play: async ({ canvas }) => {
    actionSpy.mockClear();
    await userEvent.click(canvas.getByRole("button", { name: "Report actions" }));
    await userEvent.click(await screen().findByRole("menuitem", { name: "Export" }));
    await expect(actionSpy).toHaveBeenCalledWith("export");
    await expectClosed("menu");
    const admin = await canvas.findByRole("button", { name: "Administration" });
    await expect(canvas.getByRole("link", { name: "Users" })).toBeVisible();
    await userEvent.click(admin);
    await expect(admin).toHaveAttribute("aria-expanded", "false");
    await expect(canvas.queryByRole("link", { name: "Users" })).toBeNull();
  },
};

/** The same kinds of rows written with the JSX parts, plus a separator and a skeleton. */
function JsxNav() {
  return (
    <nav aria-label="Main navigation">
      <AppLayoutNavGroup label="Platform">
        <AppLayoutNavItem label="Dashboard" href="#/" />
        <AppLayoutNavItem label="Inbox" href="#/inbox" badge="12" />
        <AppLayoutNavSubmenu label="Sales" icon={<ShoppingCartIcon aria-hidden />}>
          <AppLayoutNavSubItem label="Orders" href="#/sales/orders" />
          <AppLayoutNavSubItem label="Invoices" href="#/sales/invoices" />
        </AppLayoutNavSubmenu>
        <AppLayoutNavSeparator />
        <AppLayoutNavItem label="Archive" onSelect={() => {}} />
      </AppLayoutNavGroup>
      <AppLayoutNavGroup label="Loading">
        <AppLayoutNavSkeleton showIcon />
        <AppLayoutNavSkeleton showIcon width="50%" />
      </AppLayoutNavGroup>
    </nav>
  );
}

export const NavFromJsx: Story = {
  render: () => <Shell nav={<JsxNav />} />,
  play: async ({ canvas }) => {
    const sales = canvas.getByRole("button", { name: "Sales" });
    await expect(sales).toHaveAttribute("aria-expanded", "false");
    await userEvent.click(sales);
    await expect(canvas.getByRole("link", { name: "Orders" })).toBeVisible();
    await expect(canvas.getByRole("list", { name: "Platform" })).toBeVisible();
  },
};

/** Fully clickable rows, rows with a "more actions" menu, and actions shown only on hover. */
function ActionsNav({ onAction }: { onAction: (id: string) => void }) {
  const actions = (name: string) => ({
    label: `${name} actions`,
    items: [
      { id: `${name}-rename`, label: "Rename", onSelect: () => onAction(`${name}:rename`) },
      { id: `${name}-archive`, label: "Archive", onSelect: () => onAction(`${name}:archive`) },
      {
        id: `${name}-delete`,
        label: "Delete",
        variant: "destructive" as const,
        onSelect: () => onAction(`${name}:delete`),
      },
    ],
  });
  return (
    <nav aria-label="Main navigation">
      <AppLayoutNavGroup label="Projects">
        <AppLayoutNavItem label="Only clickable" icon={<FolderIcon aria-hidden />} href="#/p/1" />
        <AppLayoutNavItem
          label="Design system"
          icon={<FolderIcon aria-hidden />}
          href="#/p/2"
          actions={actions("Design system")}
        />
        <AppLayoutNavItem
          label="Marketing site"
          icon={<FolderIcon aria-hidden />}
          href="#/p/3"
          showActionsOnHover
          actions={actions("Marketing site")}
        />
        <AppLayoutNavSubmenu label="Mobile app" icon={<FolderIcon aria-hidden />} defaultOpen>
          <AppLayoutNavSubItem
            label="Releases"
            href="#/p/4/releases"
            actions={actions("Releases")}
          />
          <AppLayoutNavSubItem label="Crashes" href="#/p/4/crashes" badge="7" />
        </AppLayoutNavSubmenu>
      </AppLayoutNavGroup>
    </nav>
  );
}

export const ItemActions: Story = {
  render: () => <Shell nav={<ActionsNav onAction={actionSpy} />} />,
  play: async ({ canvas }) => {
    actionSpy.mockClear();
    await userEvent.click(canvas.getByRole("button", { name: "Design system actions" }));
    await userEvent.click(await screen().findByRole("menuitem", { name: "Rename" }));
    await expect(actionSpy).toHaveBeenCalledWith("Design system:rename");
    await expectClosed("menu");
    await userEvent.click(await canvas.findByRole("button", { name: "Releases actions" }));
    await userEvent.click(await screen().findByRole("menuitem", { name: "Archive" }));
    await expect(actionSpy).toHaveBeenLastCalledWith("Releases:archive");
    await expectClosed("menu");
  },
};

/** An active sub-item opens its submenu; collapsed, a submenu opens a flyout menu. */
export const SubmenusAndFlyout: Story = {
  render: () => <Shell layout={{ isActive: (href) => href === "#/sales/invoices" }} />,
  play: async ({ canvas }) => {
    const nav = canvas.getByRole("navigation", { name: "Main navigation" });
    const sales = within(nav).getByRole("button", { name: "Sales" });
    await expect(sales).toHaveAttribute("aria-expanded", "true");
    await expect(within(nav).getByRole("link", { name: "Invoices" })).toHaveAttribute(
      "aria-current",
      "page",
    );
    await userEvent.click(canvas.getByRole("button", { name: "Toggle sidebar" }));
    await userEvent.click(within(nav).getByRole("button", { name: "Sales" }));
    const flyout = await screen().findByRole("menu");
    await expect(
      within(flyout)
        .getAllByRole("menuitem")
        .map((item) => item.textContent),
    ).toEqual(["Orders", "Invoices", "Quotes"]);
    await userEvent.keyboard("{Escape}");
    await expectClosed("menu");
  },
};

/** Collapsed, rows without an icon show the first letter of their label, and a tooltip. */
export const LetterFallback: Story = {
  args: { defaultOpen: false },
  play: async ({ canvas }) => {
    await waitFor(expectCentredIcons);
    const users = canvas.getByRole("link", { name: "Users" });
    await expect(users.querySelector('[data-slot="app-layout-nav-letter"]')).toHaveTextContent("U");
    await expect(
      canvas
        .getByRole("link", { name: "Audit log" })
        .querySelector('[data-slot="app-layout-nav-letter"]'),
    ).toHaveTextContent("A");
    users.focus();
    await expect(await screen().findByRole("tooltip")).toHaveTextContent("Users");
    await userEvent.keyboard("{Escape}");
    await expectClosed("tooltip");
  },
};

/** A page that changes the trail with `useAppLayoutBreadcrumb`. */
function BreadcrumbControls() {
  const { push, pop, update, items } = useAppLayoutBreadcrumb();
  return (
    <div className="flex flex-wrap gap-2">
      <Button variant="outline" onClick={() => update("staff", { label: "Staff (renamed)" })}>
        Rename last
      </Button>
      <Button
        variant="outline"
        onClick={() => push({ id: `extra-${items.length}`, label: "Extra" })}
      >
        Push
      </Button>
      <Button variant="outline" onClick={() => pop()}>
        Pop
      </Button>
    </div>
  );
}

export const BreadcrumbHook: Story = {
  render: () => (
    <Shell topbar={{ breadcrumb: { maxItems: 4, ellipsisLabel: "Show hidden pages" } }}>
      <Page title="Staff" trail={deepTrail}>
        <BreadcrumbControls />
      </Page>
    </Shell>
  ),
  play: async ({ canvas }) => {
    const breadcrumb = canvas.getByRole("navigation", { name: "Breadcrumb" });
    await userEvent.click(within(breadcrumb).getByRole("button", { name: "Show hidden pages" }));
    const menu = await screen().findByRole("menu");
    await expect(
      within(menu)
        .getAllByRole("menuitem")
        .map((item) => item.textContent),
    ).toEqual(["Organization", "Business units", "North region"]);
    await userEvent.keyboard("{Escape}");
    await expectClosed("menu");
    await userEvent.click(await canvas.findByRole("button", { name: "Rename last" }));
    await expect(within(breadcrumb).getByText("Staff (renamed)")).toHaveAttribute(
      "aria-current",
      "page",
    );
    await userEvent.click(canvas.getByRole("button", { name: "Push" }));
    await expect(within(breadcrumb).getByText("Extra")).toHaveAttribute("aria-current", "page");
    await userEvent.click(canvas.getByRole("button", { name: "Pop" }));
    await expect(within(breadcrumb).queryByText("Extra")).toBeNull();
  },
};

/** A page adds its own top bar actions while it is shown; global actions stay at the end. */
function ActionsPage() {
  const [editing, setEditing] = useState(false);
  return (
    <Page title="Top bar actions">
      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={editing}
          onChange={(event) => setEditing(event.target.checked)}
        />
        Editing mode
      </label>
      <AppLayoutTopbarActions>
        <Button variant="outline" size="sm">
          Export
        </Button>
      </AppLayoutTopbarActions>
      {editing ? (
        <AppLayoutTopbarActions>
          <Button size="sm">Save</Button>
        </AppLayoutTopbarActions>
      ) : null}
    </Page>
  );
}

export const TopbarActionsPortal: Story = {
  render: () => (
    <Shell
      topbar={{
        actions: (
          <Button variant="ghost" size="sm">
            Account
          </Button>
        ),
      }}
    >
      <ActionsPage />
    </Shell>
  ),
  play: async ({ canvas }) => {
    const banner = canvas.getByRole("banner");
    const names = () =>
      within(banner)
        .getAllByRole("button")
        .map((button) => button.textContent);
    await expect(names()).toEqual(["", "Export", "Account"]);
    await userEvent.click(canvas.getByRole("checkbox", { name: "Editing mode" }));
    await expect(names()).toEqual(["", "Export", "Save", "Account"]);
    await userEvent.click(canvas.getByRole("checkbox", { name: "Editing mode" }));
    await expect(names()).toEqual(["", "Export", "Account"]);
  },
};

/** The sidebar content and the main area scroll on their own; the rest stays in place. */
export const LongContent: Story = {
  render: () => (
    <Shell nav={<AppLayoutNav aria-label="Main navigation" items={longNavEntries()} />}>
      <Page title="Long content" paragraphs={longParagraphs} />
    </Shell>
  ),
  play: async ({ canvas }) => {
    const main = canvas.getByRole("main");
    const topbar = canvas.getByRole("banner");
    const header = document.querySelector('[data-slot="app-layout-sidebar-header"]') as HTMLElement;
    const content = document.querySelector(
      '[data-slot="app-layout-sidebar-content"]',
    ) as HTMLElement;
    const topbarTop = topbar.getBoundingClientRect().top;
    const headerTop = header.getBoundingClientRect().top;
    await expect(main.scrollHeight).toBeGreaterThan(main.clientHeight);
    main.scrollTop = main.scrollHeight;
    await waitFor(() => expect(main.scrollTop).toBeGreaterThan(0));
    await expect(topbar.getBoundingClientRect().top).toBe(topbarTop);
    await expect(content.scrollHeight).toBeGreaterThan(content.clientHeight);
    content.scrollTop = content.scrollHeight;
    await waitFor(() => expect(content.scrollTop).toBeGreaterThan(0));
    await expect(header.getBoundingClientRect().top).toBe(headerTop);
    await expect(document.scrollingElement?.scrollTop ?? 0).toBe(0);
  },
};

const persistKey = "storybook.app-layout";

/** With `persistKey`, the state and the side survive a reload. */
export const Persistence: Story = {
  beforeEach: () => {
    localStorage.removeItem(persistKey);
    return () => localStorage.removeItem(persistKey);
  },
  render: () => (
    <Shell layout={{ persistKey }}>
      <Page title="Persistence">
        <SideButtons />
      </Page>
    </Shell>
  ),
  play: async ({ canvas }) => {
    await userEvent.click(canvas.getByRole("button", { name: "Toggle sidebar" }));
    await userEvent.click(canvas.getByRole("button", { name: "Sidebar at end" }));
    await waitFor(() =>
      expect(JSON.parse(localStorage.getItem(persistKey) ?? "{}")).toEqual({
        open: false,
        side: "end",
      }),
    );
  },
};

/** With `keyboardShortcut="b"`, Ctrl+B or Cmd+B toggles the sidebar, except while typing. */
export const KeyboardShortcut: Story = {
  render: (args) => (
    <Shell layout={{ keyboardShortcut: "b", onOpenChange: args.onOpenChange }}>
      <Page title="Keyboard shortcut">
        <label className="flex max-w-sm flex-col gap-1 text-sm">
          Note
          <input className="rounded-md border px-2 py-1" />
        </label>
      </Page>
    </Shell>
  ),
  play: async ({ args, canvas }) => {
    await userEvent.keyboard("{Control>}b{/Control}");
    await expect(sidebarState()).toBe("collapsed");
    await userEvent.keyboard("{Meta>}b{/Meta}");
    await expect(sidebarState()).toBe("expanded");
    await userEvent.click(canvas.getByRole("textbox", { name: "Note" }));
    await userEvent.keyboard("{Control>}b{/Control}");
    await expect(sidebarState()).toBe("expanded");
    await expect(args.onOpenChange).toHaveBeenCalledTimes(2);
  },
};

interface Crumb {
  crumb?: { id: string; label: string; href: string };
}

const routerNav: AppLayoutNavEntry[] = [
  {
    type: "group",
    id: "app",
    label: "App",
    items: [
      { type: "item", id: "home", label: "Dashboard", href: "/" },
      {
        type: "submenu",
        id: "sales",
        label: "Sales",
        icon: <ShoppingCartIcon aria-hidden />,
        items: [
          { id: "orders", label: "Orders", href: "/sales/orders" },
          { id: "invoices", label: "Invoices", href: "/sales/invoices" },
        ],
      },
    ],
  },
];

/** Breadcrumb items from the matched routes' `handle.crumb`. */
function RouteCrumbs() {
  const crumbs = useMatches().flatMap((match) => (match.handle as Crumb | undefined)?.crumb ?? []);
  useAppLayoutBreadcrumbItems(crumbs);
  return null;
}

function RoutePage({ title }: { title: string }) {
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-semibold">{title}</h1>
      {longParagraphs.slice(0, 2).map((text) => (
        <p key={text} className="max-w-prose text-sm text-muted-foreground">
          {text}
        </p>
      ))}
    </div>
  );
}

const renderRouterLink = ({ href, ...props }: AppLayoutLinkProps) => <Link to={href} {...props} />;

/** The shell route: links through `Link`, active state from `matchPath`, crumbs from `handle`. */
function RouterShell() {
  const { pathname } = useLocation();
  return (
    <AppLayout
      className={frame}
      renderLink={renderRouterLink}
      isActive={(href) => matchPath({ path: href, end: true }, pathname) !== null}
    >
      <AppLayoutSidebar mobileTitle="Navigation">
        <AppLayoutSidebarHeader>
          <Brand />
        </AppLayoutSidebarHeader>
        <AppLayoutSidebarContent>
          <AppLayoutNav aria-label="Main navigation" items={routerNav} />
        </AppLayoutSidebarContent>
      </AppLayoutSidebar>
      <AppLayoutInset>
        <AppLayoutTopbar triggerLabel="Toggle sidebar" breadcrumbLabel="Breadcrumb" />
        <AppLayoutMain scrollResetKey={pathname}>
          <RouteCrumbs />
          <Outlet />
        </AppLayoutMain>
      </AppLayoutInset>
    </AppLayout>
  );
}

function RouterDemo() {
  const [router] = useState(() =>
    createMemoryRouter([
      {
        path: "/",
        element: <RouterShell />,
        handle: { crumb: { id: "home", label: "Home", href: "/" } },
        children: [
          { index: true, element: <RoutePage title="Dashboard" /> },
          {
            path: "sales",
            handle: { crumb: { id: "sales", label: "Sales", href: "/sales/orders" } },
            children: [
              {
                path: "orders",
                element: <RoutePage title="Orders" />,
                handle: { crumb: { id: "orders", label: "Orders", href: "/sales/orders" } },
              },
              {
                path: "invoices",
                element: <RoutePage title="Invoices" />,
                handle: { crumb: { id: "invoices", label: "Invoices", href: "/sales/invoices" } },
              },
            ],
          },
        ],
      },
    ]),
  );
  return <RouterProvider router={router} />;
}

export const WithReactRouter: Story = {
  render: () => <RouterDemo />,
  play: async ({ canvas }) => {
    await expect(canvas.getByRole("heading", { name: "Dashboard" })).toBeVisible();
    await expect(canvas.getByRole("link", { name: "Dashboard" })).toHaveAttribute(
      "aria-current",
      "page",
    );
    await userEvent.click(canvas.getByRole("button", { name: "Sales" }));
    await userEvent.click(canvas.getByRole("link", { name: "Invoices" }));
    await expect(await canvas.findByRole("heading", { name: "Invoices" })).toBeVisible();
    await expect(canvas.getByRole("link", { name: "Invoices" })).toHaveAttribute(
      "aria-current",
      "page",
    );
    const breadcrumb = canvas.getByRole("navigation", { name: "Breadcrumb" });
    await expect(within(breadcrumb).getByRole("link", { name: "Sales" })).toBeVisible();
    await expect(within(breadcrumb).getByText("Invoices")).toHaveAttribute("aria-current", "page");
    await userEvent.click(within(breadcrumb).getByRole("link", { name: "Home" }));
    await expect(await canvas.findByRole("heading", { name: "Dashboard" })).toBeVisible();
  },
};
