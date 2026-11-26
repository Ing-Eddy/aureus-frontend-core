import type { ComponentPropsWithoutRef, HTMLAttributes, ReactNode } from "react";

/** One entry of an item's "more actions" menu. */
export interface AppLayoutNavAction {
  /** Unique within the menu. */
  id: string;
  /** The entry's text. */
  label: ReactNode;
  /** Decorative icon before the text. */
  icon?: ReactNode;
  /** `"default"` (default) or `"destructive"`. */
  variant?: "default" | "destructive";
  /** The entry is shown but cannot be chosen. */
  disabled?: boolean;
  /** Leaves the action out of the menu. With every action hidden, no menu button is shown. */
  hidden?: boolean;
  /** Called when the entry is chosen. */
  onSelect: () => void;
}

/** The "more actions" (⋯) menu of an item, a submenu or a sub-item. */
export interface AppLayoutNavActions {
  /** Accessible name of the menu button. Required: there is no default. */
  label: string;
  /** The menu's entries, in order. */
  items: readonly AppLayoutNavAction[];
}

/** What every navigation row shares: items, submenus and sub-items. */
interface AppLayoutNavRowOptions {
  /**
   * The row's text. Required: it is the accessible name, the tooltip while the sidebar is
   * collapsed, and the source of the letter shown when there is no `icon`.
   */
  label: string;
  /** Decorative icon. Without it, the collapsed sidebar shows the first letter of `label`. */
  icon?: ReactNode;
  /** Small content at the end of the row, such as a count. Hidden while collapsed. */
  badge?: ReactNode;
  /** A separate "more actions" button with a menu. It does not change the row's own link. */
  actions?: AppLayoutNavActions;
  /** Shows the actions button only on hover or focus, on devices that can hover. `false` by default. */
  showActionsOnHover?: boolean;
}

/** Options of a simple item and a sub-item. */
export interface AppLayoutNavLinkOptions extends AppLayoutNavRowOptions {
  /** Makes the row a link, rendered with the layout's `renderLink`. */
  href?: string;
  /** Called when the row is chosen. Without `href`, the row is a button. */
  onSelect?: () => void;
  /** Marks the row as the current page. When unset, the layout's `isActive(href)` decides. */
  active?: boolean;
  /** The row cannot be chosen. */
  disabled?: boolean;
}

/** Options of a simple item. */
export interface AppLayoutNavItemOptions extends AppLayoutNavLinkOptions {
  /**
   * Tooltip shown while the sidebar is collapsed. Defaults to `label`; `false` removes it.
   */
  tooltip?: ReactNode | false;
}

/** Options of a submenu: a row that shows or hides its sub-items. */
export interface AppLayoutNavSubmenuOptions extends AppLayoutNavRowOptions {
  /** Controlled open state. */
  open?: boolean;
  /**
   * Initial open state when uncontrolled. Defaults to `false`. An uncontrolled submenu also opens
   * when one of its sub-items becomes active.
   */
  defaultOpen?: boolean;
  /** Called when the submenu opens or closes. */
  onOpenChange?: (open: boolean) => void;
  /** Tooltip shown while the sidebar is collapsed. Defaults to `label`; `false` removes it. */
  tooltip?: ReactNode | false;
}

/** Element attributes of a row. `children` and `onSelect` are redefined by each part. */
type LiProps = Omit<ComponentPropsWithoutRef<"li">, "children" | "onSelect">;

/** Props of `AppLayoutNavItem`. */
export interface AppLayoutNavItemProps extends AppLayoutNavItemOptions, LiProps {
  /**
   * Renders the consumer's element (its only child, such as a router link) as the row's control,
   * filled with the icon and the label.
   */
  asChild?: boolean;
  /** With `asChild`, the element to render as the control. */
  children?: ReactNode;
}

/** Props of `AppLayoutNavSubItem`. */
export interface AppLayoutNavSubItemProps extends AppLayoutNavLinkOptions, LiProps {
  /** See `AppLayoutNavItemProps.asChild`. */
  asChild?: boolean;
  /** With `asChild`, the element to render as the control. */
  children?: ReactNode;
}

/** Props of `AppLayoutNavSubmenu`. */
export interface AppLayoutNavSubmenuProps extends AppLayoutNavSubmenuOptions, LiProps {
  /** `AppLayoutNavSubItem`s. A submenu cannot contain another submenu. */
  children?: ReactNode;
}

/** Props of `AppLayoutNavGroup`. */
export interface AppLayoutNavGroupProps extends Omit<ComponentPropsWithoutRef<"div">, "children"> {
  /** The group's title. Hidden while the sidebar is collapsed. */
  label?: ReactNode;
  /** Makes the title a button that shows or hides the group. Needs `label`. `false` by default. */
  collapsible?: boolean;
  /** Initial open state of a collapsible group. Defaults to `true`. */
  defaultOpen?: boolean;
  /** Items, submenus, separators and skeletons. */
  children?: ReactNode;
}

/** Props of `AppLayoutNavSeparator`. It is an `li` inside a group and a `div` elsewhere. */
export type AppLayoutNavSeparatorProps = Omit<HTMLAttributes<HTMLElement>, "children">;

/** Props of `AppLayoutNavSkeleton`. It is an `li` inside a group and a `div` elsewhere. */
export interface AppLayoutNavSkeletonProps extends Omit<HTMLAttributes<HTMLElement>, "children"> {
  /** Shows an icon placeholder. `false` by default. */
  showIcon?: boolean;
  /** Width of the text placeholder (CSS). Defaults to `"70%"`. */
  width?: string;
}

/** Fields every configuration entry has. */
interface AppLayoutNavEntryBase {
  /** Unique among all entries, including sub-items. */
  id: string;
  /** Leaves the entry out, for example for a role without access. */
  hidden?: boolean;
}

/** A sub-item of a submenu entry. */
export interface AppLayoutNavSubItemEntry extends AppLayoutNavEntryBase, AppLayoutNavLinkOptions {}

/** A simple row in `AppLayoutNav items`. */
export interface AppLayoutNavItemEntry extends AppLayoutNavEntryBase, AppLayoutNavItemOptions {
  /** Marks the entry as a simple row. */
  type: "item";
}

/** A submenu in `AppLayoutNav items`. */
export interface AppLayoutNavSubmenuEntry
  extends AppLayoutNavEntryBase,
    AppLayoutNavSubmenuOptions {
  /** Marks the entry as a submenu. */
  type: "submenu";
  /** The sub-items, in order. A submenu with none visible is left out. */
  items: readonly AppLayoutNavSubItemEntry[];
}

/** A line in `AppLayoutNav items`. */
export interface AppLayoutNavSeparatorEntry extends AppLayoutNavEntryBase {
  /** Marks the entry as a line. */
  type: "separator";
}

/** What a group can contain. */
export type AppLayoutNavGroupChildEntry =
  | AppLayoutNavItemEntry
  | AppLayoutNavSubmenuEntry
  | AppLayoutNavSeparatorEntry;

/** A group in `AppLayoutNav items`. */
export interface AppLayoutNavGroupEntry extends AppLayoutNavEntryBase {
  /** Marks the entry as a group. */
  type: "group";
  /** The group's title. Hidden while the sidebar is collapsed. */
  label?: ReactNode;
  /** Makes the title a button that shows or hides the group. Needs `label`. `false` by default. */
  collapsible?: boolean;
  /** Initial open state of a collapsible group. Defaults to `true`. */
  defaultOpen?: boolean;
  /** The group's rows and separators. A group with no visible row is left out. */
  items: readonly AppLayoutNavGroupChildEntry[];
}

/**
 * One entry of `AppLayoutNav items`. Items and submenus outside a group are placed in a group
 * without title; a separator that does not follow such a row stands between groups.
 */
export type AppLayoutNavEntry = AppLayoutNavGroupEntry | AppLayoutNavGroupChildEntry;

/** Props of `AppLayoutNav`. */
export interface AppLayoutNavProps extends Omit<ComponentPropsWithoutRef<"nav">, "children"> {
  /** The entries, in order. Their ids must be unique across all levels. */
  items: readonly AppLayoutNavEntry[];
}
