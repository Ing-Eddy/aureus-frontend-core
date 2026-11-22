import type {
  AppLayoutBreadcrumbItem,
  AppLayoutNavEntry,
} from "@aureus-core/ui/components/app-layout";
import {
  BarChart3Icon,
  CalendarIcon,
  FileTextIcon,
  FolderIcon,
  InboxIcon,
  LayoutDashboardIcon,
  SettingsIcon,
  ShoppingCartIcon,
  UsersIcon,
} from "lucide-react";
import { createElement, type ReactNode } from "react";

const icon = (component: typeof InboxIcon): ReactNode =>
  createElement(component, { "aria-hidden": true });

/**
 * A navigation with every kind of entry: titled groups, icons, a badge, items without icon (they
 * show a letter when collapsed), submenus with an active candidate, row actions, and a collapsible
 * group. `onAction` receives the id of each chosen action.
 */
export function navEntries(onAction: (id: string) => void = () => {}): AppLayoutNavEntry[] {
  return [
    {
      type: "group",
      id: "platform",
      label: "Platform",
      items: [
        {
          type: "item",
          id: "dashboard",
          label: "Dashboard",
          icon: icon(LayoutDashboardIcon),
          href: "#/",
        },
        {
          type: "item",
          id: "inbox",
          label: "Inbox",
          icon: icon(InboxIcon),
          href: "#/inbox",
          badge: "12",
        },
        {
          type: "item",
          id: "calendar",
          label: "Calendar",
          icon: icon(CalendarIcon),
          href: "#/calendar",
        },
        {
          type: "submenu",
          id: "sales",
          label: "Sales",
          icon: icon(ShoppingCartIcon),
          items: [
            { id: "orders", label: "Orders", href: "#/sales/orders" },
            { id: "invoices", label: "Invoices", href: "#/sales/invoices", badge: "3" },
            { id: "quotes", label: "Quotes", href: "#/sales/quotes" },
          ],
        },
        {
          type: "item",
          id: "reports",
          label: "Reports",
          icon: icon(BarChart3Icon),
          href: "#/reports",
          actions: {
            label: "Report actions",
            items: [
              { id: "share", label: "Share", onSelect: () => onAction("share") },
              { id: "export", label: "Export", onSelect: () => onAction("export") },
              {
                id: "delete",
                label: "Delete",
                variant: "destructive",
                onSelect: () => onAction("delete"),
              },
            ],
          },
        },
      ],
    },
    {
      type: "group",
      id: "projects",
      label: "Projects",
      items: [
        {
          type: "submenu",
          id: "design",
          label: "Design system",
          icon: icon(FolderIcon),
          items: [
            { id: "tokens", label: "Tokens", href: "#/projects/design/tokens" },
            { id: "components", label: "Components", href: "#/projects/design/components" },
          ],
        },
        {
          type: "item",
          id: "marketing",
          label: "Marketing site",
          icon: icon(FileTextIcon),
          href: "#/projects/marketing",
        },
      ],
    },
    {
      type: "group",
      id: "admin",
      label: "Administration",
      collapsible: true,
      items: [
        { type: "item", id: "users", label: "Users", href: "#/admin/users" },
        { type: "item", id: "roles", label: "Roles", href: "#/admin/roles" },
        { type: "item", id: "audit", label: "Audit log", href: "#/admin/audit" },
      ],
    },
  ];
}

/** The footer group: settings and the team. */
export function footerEntries(): AppLayoutNavEntry[] {
  return [
    { type: "item", id: "team", label: "Team", icon: icon(UsersIcon), href: "#/team" },
    {
      type: "item",
      id: "settings",
      label: "Settings",
      icon: icon(SettingsIcon),
      href: "#/settings",
    },
  ];
}

/** Many workspaces, so the sidebar content must scroll on its own. */
export function longNavEntries(count = 30): AppLayoutNavEntry[] {
  return [
    {
      type: "group",
      id: "workspaces",
      label: "Workspaces",
      items: Array.from({ length: count }, (_, index) => ({
        type: "item" as const,
        id: `workspace-${index + 1}`,
        label: `Workspace ${index + 1}`,
        href: `#/workspaces/${index + 1}`,
      })),
    },
  ];
}

export const invoiceTrail: AppLayoutBreadcrumbItem[] = [
  { id: "home", label: "Home", href: "#/" },
  { id: "sales", label: "Sales", href: "#/sales" },
  { id: "invoices", label: "Invoices", href: "#/sales/invoices" },
  { id: "invoice", label: "INV-0042" },
];

export const deepTrail: AppLayoutBreadcrumbItem[] = [
  { id: "home", label: "Home", href: "#/" },
  { id: "org", label: "Organization", href: "#/org" },
  { id: "units", label: "Business units", href: "#/org/units" },
  { id: "north", label: "North region", href: "#/org/units/north" },
  { id: "store", label: "Store 12", href: "#/org/units/north/12" },
  { id: "staff", label: "Staff" },
];

/** Paragraphs for long pages. */
export const longParagraphs = Array.from(
  { length: 24 },
  (_, index) =>
    `Section ${index + 1}. The main area scrolls on its own: the top bar, the sidebar header and the sidebar footer stay where they are, and the page itself never scrolls.`,
);
