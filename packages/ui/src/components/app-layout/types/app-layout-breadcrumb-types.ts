import type { ComponentPropsWithoutRef, ReactNode } from "react";

/** One step of the breadcrumb trail. The last step of the trail is the current page. */
export interface AppLayoutBreadcrumbItem {
  /** Identifies the item for `update(id, patch)` and React keys. */
  id?: string;
  /** The consumer's text (or node). The layout renders no text of its own. */
  label: ReactNode;
  /** Makes the item a link, rendered with the layout's `renderLink`. Ignored on the last item. */
  href?: string;
  /** Makes the item a button when it has no `href`. Ignored on the last item. */
  onSelect?: () => void;
  /** Decorative icon shown before the label. */
  icon?: ReactNode;
}

/** Collapsing a long trail: both or neither. `ellipsisLabel` names the menu button. */
export type AppLayoutBreadcrumbCollapse =
  | { maxItems?: undefined; ellipsisLabel?: never }
  | {
      /**
       * Entries visible at most, counting the menu button that lists the hidden middle items.
       * Values below 3 count as 3.
       */
      maxItems: number;
      /** Accessible name of the menu button of hidden items. */
      ellipsisLabel: string;
    };

/** How a breadcrumb is displayed: optional collapsing and separator. */
export type AppLayoutBreadcrumbDisplay = AppLayoutBreadcrumbCollapse & {
  /** Replaces the default decorative chevron between items. */
  separator?: ReactNode;
};

/** Props of `AppLayoutBreadcrumb`. */
export type AppLayoutBreadcrumbProps = Omit<ComponentPropsWithoutRef<"nav">, "children"> &
  AppLayoutBreadcrumbDisplay & {
    /** Accessible name of the breadcrumb navigation landmark. Required: there is no default. */
    label: string;
  };

/** The breadcrumb trail of the surrounding `AppLayout`, and functions to change it. */
export interface UseAppLayoutBreadcrumbResult {
  /** The trail currently shown, from first to last. */
  items: readonly AppLayoutBreadcrumbItem[];
  /** Replaces the trail. */
  setItems: (items: readonly AppLayoutBreadcrumbItem[]) => void;
  /** Adds an item at the end. */
  push: (item: AppLayoutBreadcrumbItem) => void;
  /** Removes the last item. */
  pop: () => void;
  /** Changes the item with that `id`. Other items are kept. */
  update: (id: string, patch: Partial<AppLayoutBreadcrumbItem>) => void;
  /** Empties the trail. */
  clear: () => void;
}
