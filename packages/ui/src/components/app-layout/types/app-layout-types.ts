import type { ComponentPropsWithoutRef, ComponentPropsWithRef, ReactNode, RefObject } from "react";
import type {
  AppLayoutBreadcrumbDisplay,
  AppLayoutBreadcrumbItem,
} from "./app-layout-breadcrumb-types";

/**
 * The layout's texts all come from the consumer: it renders no text of its own, visible or
 * accessible. TypeScript requires each text when the feature that needs it is on.
 */

/**
 * Logical edge of the sidebar: `"start"` is the left edge in left-to-right pages and the right
 * edge in right-to-left pages; `"end"` is the opposite edge.
 */
export type AppLayoutSide = "start" | "end";

/** `"sidebar"` (default) is attached to the edge; `"floating"` and `"inset"` are detached cards. */
export type AppLayoutSidebarVariant = "sidebar" | "floating" | "inset";

/**
 * What collapsing does: `"icon"` (default) narrows the sidebar to its icons, `"offcanvas"` moves
 * it off the screen, and `"none"` keeps it expanded.
 */
export type AppLayoutCollapsible = "icon" | "offcanvas" | "none";

/** How the desktop sidebar is shown. */
export type AppLayoutSidebarState = "expanded" | "collapsed";

/** Maximum width of the main content, centred. */
export type AppLayoutMaxWidth =
  | "sm"
  | "md"
  | "lg"
  | "xl"
  | "2xl"
  | "3xl"
  | "4xl"
  | "5xl"
  | "6xl"
  | "7xl"
  | "full";

/**
 * What `renderLink` receives for each link of the layout (items, sub-items, breadcrumb items).
 * Spread everything onto the router's link: it carries the classes, the accessibility attributes
 * and the event handlers the layout needs.
 */
export type AppLayoutLinkProps = Omit<ComponentPropsWithRef<"a">, "href"> & {
  /** The link's target. */
  href: string;
  [dataAttribute: `data-${string}`]: string | boolean | undefined;
};

/** Props of `AppLayout`, passed on to its root `div`. */
export interface AppLayoutProps extends ComponentPropsWithoutRef<"div"> {
  /** Controlled desktop state: expanded (`true`) or collapsed. */
  open?: boolean;
  /** Initial desktop state when uncontrolled. Defaults to `true`. */
  defaultOpen?: boolean;
  /** Called when the user or `setOpen` changes the desktop state. */
  onOpenChange?: (open: boolean) => void;

  /** Controlled state of the mobile sheet. */
  mobileOpen?: boolean;
  /** Initial state of the mobile sheet when uncontrolled. Defaults to `false`. */
  defaultMobileOpen?: boolean;
  /** Called when the mobile sheet should open or close. */
  onMobileOpenChange?: (open: boolean) => void;

  /** Controlled side of the sidebar. */
  side?: AppLayoutSide;
  /** Initial side when uncontrolled. Defaults to `"start"`. */
  defaultSide?: AppLayoutSide;
  /** Called when `setSide` changes the side. */
  onSideChange?: (side: AppLayoutSide) => void;

  /**
   * Viewport width, in CSS pixels, from which the desktop sidebar is shown. Below it the sidebar
   * is a sheet. Defaults to `768`. Without media queries (server, tests) the layout is desktop.
   */
  breakpoint?: number;
  /** A key that toggles the sidebar with Ctrl or Cmd, such as `"b"`. No shortcut by default. */
  keyboardShortcut?: string;
  /**
   * Saves the desktop state and the side in `localStorage` under this key, and starts from them.
   * Nothing is stored by default.
   */
  persistKey?: string;
  /** Closes the mobile sheet when an item or sub-item is chosen. Defaults to `true`. */
  closeMobileOnNavigate?: boolean;
  /** Renders every link of the layout, such as a router link. Defaults to an `a` element. */
  renderLink?: (props: AppLayoutLinkProps) => ReactNode;
  /** Whether a link is the current page, for items without `active`. */
  isActive?: (href: string) => boolean;
  /** Initial breadcrumb trail. Defaults to empty. */
  defaultBreadcrumb?: readonly AppLayoutBreadcrumbItem[];
  /**
   * Shows a "skip to content" link first on keyboard focus, with this text. No skip link by
   * default.
   */
  skipLinkLabel?: string;
}

/** The rail is opt-in; when on, it needs its accessible name. */
export type AppLayoutRailTexts =
  | { rail?: false; railLabel?: never }
  | {
      /** A thin button on the sidebar's inner edge that toggles it. */
      rail: boolean;
      /** Accessible name of the rail. */
      railLabel: string;
    };

/** The close button inside the mobile sheet is opt-in; when on, it needs its accessible name. */
export type AppLayoutMobileCloseTexts =
  | { mobileCloseButton?: false; mobileCloseLabel?: never }
  | {
      /** A close button inside the mobile sheet. */
      mobileCloseButton: boolean;
      /** Accessible name of the close button of the mobile sheet. */
      mobileCloseLabel: string;
    };

/**
 * The props of `AppLayoutSidebar` that need no text of their own. Other attributes go to the
 * sidebar's container (on mobile, to the panel's content).
 */
export interface AppLayoutSidebarBaseProps extends ComponentPropsWithoutRef<"div"> {
  /** Accessible name of the mobile sheet (not visible). Required: there is no default. */
  mobileTitle: string;
  /** Accessible description of the mobile sheet (not visible). */
  mobileDescription?: string;
  /** Defaults to `"sidebar"`. */
  variant?: AppLayoutSidebarVariant;
  /** Defaults to `"icon"`. */
  collapsible?: AppLayoutCollapsible;
  /** Expanded width (CSS). Defaults to `"16rem"`. */
  width?: string;
  /** Width collapsed to icons (CSS). Defaults to `"3rem"`. */
  collapsedWidth?: string;
  /** Width of the mobile sheet (CSS). Defaults to `"18rem"`. */
  mobileWidth?: string;
  /** Classes of the mobile sheet panel. */
  mobileClassName?: string;
}

/** Props of `AppLayoutSidebar`. */
export type AppLayoutSidebarProps = AppLayoutSidebarBaseProps &
  AppLayoutRailTexts &
  AppLayoutMobileCloseTexts;

/** Props of the sidebar's header, content and footer. */
export interface AppLayoutSectionProps extends ComponentPropsWithoutRef<"div"> {
  /** Renders the consumer's element instead of a `div`. */
  asChild?: boolean;
}

/** Props of `AppLayoutSidebarTrigger`. */
export interface AppLayoutSidebarTriggerProps
  extends Omit<ComponentPropsWithoutRef<"button">, "children"> {
  /** Accessible name of the button. Required: there is no default. */
  label: string;
  /** Replaces the default panel icon, which follows the side. */
  icon?: ReactNode;
}

/** The trigger is on by default; when on, it needs its accessible name. */
export type AppLayoutTopbarTriggerTexts =
  | {
      /** Shows the sidebar trigger. Defaults to `true`. */
      trigger?: true;
      /** Accessible name of the sidebar trigger. */
      triggerLabel: string;
    }
  | { trigger: false; triggerLabel?: never };

/** The breadcrumb is on by default; when on, it needs the landmark's name. */
export type AppLayoutTopbarBreadcrumbTexts =
  | {
      /** Shows the breadcrumb, optionally with display options. Defaults to `true`. */
      breadcrumb?: true | AppLayoutBreadcrumbDisplay;
      /** Accessible name of the breadcrumb navigation landmark. */
      breadcrumbLabel: string;
    }
  | { breadcrumb: false; breadcrumbLabel?: never };

/** The props of `AppLayoutTopbar` that need no text of their own. */
export interface AppLayoutTopbarBaseProps extends ComponentPropsWithoutRef<"header"> {
  /** Global actions at the end of the bar, after the actions added by pages. */
  actions?: ReactNode;
  /** A decorative vertical line between the trigger and the breadcrumb. `false` by default. */
  divider?: boolean;
  /** Placed between the breadcrumb and the actions. */
  children?: ReactNode;
}

/** Props of `AppLayoutTopbar`. */
export type AppLayoutTopbarProps = AppLayoutTopbarBaseProps &
  AppLayoutTopbarTriggerTexts &
  AppLayoutTopbarBreadcrumbTexts;

/** Props of `AppLayoutTopbarActions`. */
export interface AppLayoutTopbarActionsProps {
  /** Rendered in the top bar's actions area while this component is mounted. */
  children?: ReactNode;
}

/** Props of `AppLayoutInset`. */
export type AppLayoutInsetProps = ComponentPropsWithoutRef<"div">;

/** Props of `AppLayoutMain`. */
export interface AppLayoutMainProps extends ComponentPropsWithoutRef<"main"> {
  /** Classes of the padded content box, for example to change the padding. */
  contentClassName?: string;
  /** Limits and centres the content width. No limit by default. The padding is kept. */
  maxWidth?: AppLayoutMaxWidth;
  /** When it changes (for example the route path), the main area scrolls to the top. */
  scrollResetKey?: unknown;
}

/** The sidebar of the surrounding `AppLayout`, and functions to change it. */
export interface UseAppLayoutSidebarResult {
  /** The desktop presentation. `"expanded"` when `collapsible` is `"none"`. */
  state: AppLayoutSidebarState;
  /** The desktop open state, as set by the user or the props. */
  open: boolean;
  /** Changes `open`; controlled by `onOpenChange` when `open` is given. */
  setOpen: (open: boolean) => void;
  /** Toggles the sheet in mobile mode and the desktop state otherwise. */
  toggle: () => void;
  /** Whether the viewport is below the breakpoint, so the sidebar is a sheet. */
  isMobile: boolean;
  /** Whether the mobile sheet is open. */
  mobileOpen: boolean;
  /** Opens or closes the mobile sheet. */
  setMobileOpen: (open: boolean) => void;
  /** The logical side of the sidebar. */
  side: AppLayoutSide;
  /** Moves the sidebar to a side. */
  setSide: (side: AppLayoutSide) => void;
  /** The sidebar's collapsing mode. */
  collapsible: AppLayoutCollapsible;
  /** The sidebar's variant. */
  variant: AppLayoutSidebarVariant;
}

/** The main area of the surrounding `AppLayout`. */
export interface UseAppLayoutMainResult {
  /** The scrolling `main` element. */
  scrollRef: RefObject<HTMLElement | null>;
  /** Scrolls the main area to the top at once. */
  scrollToTop: () => void;
}
