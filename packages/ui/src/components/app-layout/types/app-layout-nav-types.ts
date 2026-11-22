import type { ComponentPropsWithoutRef, HTMLAttributes, ReactNode } from "react";

/** One entry of an item's "more actions" menu. */
export interface AppLayoutNavAction {
  id: string;
  label: ReactNode;
  icon?: ReactNode;
  /** `"default"` (default) or `"destructive"`. */
  variant?: "default" | "destructive";
  disabled?: boolean;
  /** Leaves the action out of the menu. With every action hidden, no menu button is shown. */
  hidden?: boolean;
  onSelect: () => void;
}

/** The "more actions" (⋯) menu of an item, a submenu or a sub-item. */
export interface AppLayoutNavActions {
  /** Accessible name of the menu button. Required: there is no default. */
  label: string;
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
  onOpenChange?: (open: boolean) => void;
  /** Tooltip shown while the sidebar is collapsed. Defaults to `label`; `false` removes it. */
  tooltip?: ReactNode | false;
}

type LiProps = Omit<ComponentPropsWithoutRef<"li">, "children" | "onSelect">;

export interface AppLayoutNavItemProps extends AppLayoutNavItemOptions, LiProps {
  /**
   * Renders the consumer's element (its only child, such as a router link) as the row's control,
   * filled with the icon and the label.
   */
  asChild?: boolean;
  /** With `asChild`, the element to render as the control. */
  children?: ReactNode;
}

export interface AppLayoutNavSubItemProps extends AppLayoutNavLinkOptions, LiProps {
  /** See `AppLayoutNavItemProps.asChild`. */
  asChild?: boolean;
  children?: ReactNode;
}

export interface AppLayoutNavSubmenuProps extends AppLayoutNavSubmenuOptions, LiProps {
  /** `AppLayoutNavSubItem`s. A submenu cannot contain another submenu. */
  children?: ReactNode;
}

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

export type AppLayoutNavSeparatorProps = Omit<HTMLAttributes<HTMLElement>, "children">;

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

export interface AppLayoutNavSubItemEntry extends AppLayoutNavEntryBase, AppLayoutNavLinkOptions {}

export interface AppLayoutNavItemEntry extends AppLayoutNavEntryBase, AppLayoutNavItemOptions {
  type: "item";
}

export interface AppLayoutNavSubmenuEntry
  extends AppLayoutNavEntryBase,
    AppLayoutNavSubmenuOptions {
  type: "submenu";
  items: readonly AppLayoutNavSubItemEntry[];
}

export interface AppLayoutNavSeparatorEntry extends AppLayoutNavEntryBase {
  type: "separator";
}

/** What a group can contain. */
export type AppLayoutNavGroupChildEntry =
  | AppLayoutNavItemEntry
  | AppLayoutNavSubmenuEntry
  | AppLayoutNavSeparatorEntry;

export interface AppLayoutNavGroupEntry extends AppLayoutNavEntryBase {
  type: "group";
  label?: ReactNode;
  collapsible?: boolean;
  defaultOpen?: boolean;
  items: readonly AppLayoutNavGroupChildEntry[];
}

/**
 * One entry of `AppLayoutNav items`. Items, submenus and separators outside a group are placed in
 * a group without title.
 */
export type AppLayoutNavEntry = AppLayoutNavGroupEntry | AppLayoutNavGroupChildEntry;

export interface AppLayoutNavProps extends Omit<ComponentPropsWithoutRef<"nav">, "children"> {
  items: readonly AppLayoutNavEntry[];
}
