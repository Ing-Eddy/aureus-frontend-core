import { cn } from "cn";
import { Slot } from "radix-ui";
import {
  type ComponentPropsWithRef,
  type MouseEvent,
  type ReactElement,
  type ReactNode,
  useContext,
  useState,
} from "react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/shadcn/ui/tooltip";
import { SidebarPresentationContext, useAppLayoutContext } from "../hooks";
import {
  menuButtonClassName,
  menuButtonCollapsedClassName,
  menuSubButtonClassName,
  oppositeSide,
  rowLabelClassName,
} from "../utils";
import { AppLayoutLink } from "./app-layout-link";
import { AppLayoutNavIcon } from "./app-layout-nav-icon";

/** Whether a row is the current page: its `active` prop, or the layout's `isActive(href)`. */
export function useResolvedActive(active: boolean | undefined, href: string | undefined): boolean {
  const { isActive } = useAppLayoutContext("AppLayoutNavItem");
  if (active !== undefined) return active;
  return href !== undefined && isActive !== undefined ? isActive(href) : false;
}

/** Closes the mobile sheet after a choice, when the layout asks for it. */
export function useCloseSheetOnNavigate(): () => void {
  const { closeMobileOnNavigate, setMobileOpen } = useAppLayoutContext("AppLayoutNavItem");
  const { mobile } = useContext(SidebarPresentationContext);
  return () => {
    if (mobile && closeMobileOnNavigate) setMobileOpen(false);
  };
}

/**
 * Props of the control of a row. Other button attributes, handlers and the ref a tooltip trigger
 * adds are passed to whichever element is rendered.
 */
export interface AppLayoutNavControlProps
  extends Omit<ComponentPropsWithRef<"button">, "onSelect" | "children"> {
  /** The visible text and the accessible name. */
  label: string;
  /** Decorative icon before the label. */
  icon?: ReactNode;
  /** Renders a link with the layout's `renderLink`, unless `disabled`. */
  href?: string;
  /** Called when the row is chosen. */
  onSelect?: () => void;
  /** Whether the row is the current page, already resolved. */
  active: boolean;
  /** Renders a disabled button, also when there is an `href`. Not applied with `asChild`. */
  disabled?: boolean;
  /** With `asChild`, the consumer's element that becomes the control. */
  asChild?: boolean;
  /** With `asChild`, the element to render as the control. */
  children?: ReactNode;
  /** Whether the row is a top-level item or a sub-item, which picks its look and slot name. */
  kind: "item" | "sub";
  /** Shows only the icon or letter; the label is kept for readers. */
  collapsed: boolean;
}

/**
 * The control of a row: a link (`href`), a button, or the consumer's element (`asChild`), with the
 * icon (or letter) and the label. Choosing it calls `onSelect` and may close the sheet, unless the
 * consumer's `onClick` prevented the default.
 */
export function AppLayoutNavControl({
  label,
  icon,
  href,
  onSelect,
  active,
  disabled,
  asChild,
  children,
  kind,
  collapsed,
  className,
  onClick,
  ...rest
}: AppLayoutNavControlProps) {
  const closeSheet = useCloseSheetOnNavigate();
  const handleClick = (event: MouseEvent<HTMLElement>) => {
    (onClick as ((event: MouseEvent<HTMLElement>) => void) | undefined)?.(event);
    if (event.defaultPrevented) return;
    onSelect?.();
    closeSheet();
  };
  const shared = {
    "data-slot": kind === "item" ? "app-layout-nav-button" : "app-layout-nav-sub-button",
    "data-active": active,
    className: cn(
      kind === "item" ? menuButtonClassName : menuSubButtonClassName,
      collapsed && menuButtonCollapsedClassName,
      className,
    ),
    onClick: handleClick,
  };
  const labelNode = (
    <span data-slot="app-layout-nav-label" className={collapsed ? "sr-only" : rowLabelClassName}>
      {label}
    </span>
  );
  const iconNode = <AppLayoutNavIcon icon={icon} label={label} collapsed={collapsed} />;

  if (asChild) {
    return (
      <Slot.Root {...rest} {...shared} aria-current={active ? "page" : undefined}>
        {iconNode}
        <Slot.Slottable>{children}</Slot.Slottable>
        {labelNode}
      </Slot.Root>
    );
  }
  if (href !== undefined && !disabled) {
    const { type: _type, ...linkRest } = rest;
    return (
      <AppLayoutLink
        {...(linkRest as Omit<ComponentPropsWithRef<"a">, "href">)}
        {...shared}
        href={href}
        aria-current={active ? "page" : undefined}
      >
        {iconNode}
        {labelNode}
      </AppLayoutLink>
    );
  }
  return (
    <button type="button" disabled={disabled} {...rest} {...shared}>
      {iconNode}
      {labelNode}
    </button>
  );
}

/**
 * The tooltip of a row: the label (or `tooltip`), shown on hover and focus only while the sidebar
 * is collapsed. `tooltip={false}` removes it.
 */
export function AppLayoutNavTooltip({
  label,
  tooltip,
  children,
}: {
  /** The row's label, shown when there is no `tooltip`. */
  label: string;
  /** Replaces the label as content; `false` renders the row without a tooltip. */
  tooltip?: ReactNode | false;
  /** The row's control, which becomes the tooltip's trigger. */
  children: ReactElement;
}) {
  const { physicalSide } = useAppLayoutContext("AppLayoutNavItem");
  const { collapsed } = useContext(SidebarPresentationContext);
  const [open, setOpen] = useState(false);
  if (tooltip === false) return children;
  return (
    <Tooltip open={collapsed && open} onOpenChange={setOpen}>
      <TooltipTrigger asChild>{children}</TooltipTrigger>
      <TooltipContent side={oppositeSide(physicalSide)} align="center">
        {tooltip ?? label}
      </TooltipContent>
    </Tooltip>
  );
}
