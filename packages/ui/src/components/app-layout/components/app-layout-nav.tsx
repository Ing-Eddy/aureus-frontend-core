import type { ReactNode } from "react";
import { duplicateNavIds, useAppLayoutContext, useAppLayoutWarnings } from "../hooks";
import type {
  AppLayoutNavEntry,
  AppLayoutNavGroupChildEntry,
  AppLayoutNavProps,
  AppLayoutNavSubItemEntry,
} from "../types";
import { AppLayoutNavGroup } from "./app-layout-nav-group";
import { AppLayoutNavItem } from "./app-layout-nav-item";
import { AppLayoutNavSeparator } from "./app-layout-nav-separator";
import { AppLayoutNavSubItem } from "./app-layout-nav-sub-item";
import { AppLayoutNavSubmenu } from "./app-layout-nav-submenu";

/** The sub-items without the hidden ones. */
function visibleSubItems(items: readonly AppLayoutNavSubItemEntry[]) {
  return items.filter((item) => !item.hidden);
}

/** The visible children of a group: hidden entries and empty submenus are left out. */
function visibleChildren(items: readonly AppLayoutNavGroupChildEntry[]) {
  return items.filter(
    (entry) =>
      !entry.hidden && (entry.type !== "submenu" || visibleSubItems(entry.items).length > 0),
  );
}

/**
 * The part for a group child: its `id` becomes the React key and its other options become props.
 */
function renderChild(entry: AppLayoutNavGroupChildEntry): ReactNode {
  if (entry.type === "separator") return <AppLayoutNavSeparator key={entry.id} />;
  if (entry.type === "item") {
    const { type: _type, id, hidden: _hidden, ...options } = entry;
    return <AppLayoutNavItem key={id} {...options} />;
  }
  const { type: _type, id, hidden: _hidden, items, ...options } = entry;
  return (
    <AppLayoutNavSubmenu key={id} {...options}>
      {visibleSubItems(items).map(({ id: subId, hidden: _subHidden, ...subOptions }) => (
        <AppLayoutNavSubItem key={subId} {...subOptions} />
      ))}
    </AppLayoutNavSubmenu>
  );
}

/**
 * The navigation's top-level nodes: groups, and separators between them. Consecutive rows outside a
 * group are placed in a group without title, which also keeps the separators that follow its first
 * row.
 */
function blocks(entries: readonly AppLayoutNavEntry[]): ReactNode[] {
  const result: ReactNode[] = [];
  let run: AppLayoutNavGroupChildEntry[] = [];
  const flush = () => {
    const children = visibleChildren(run);
    const first = run[0];
    if (first && children.some((entry) => entry.type !== "separator")) {
      result.push(
        <AppLayoutNavGroup key={first.id}>{children.map(renderChild)}</AppLayoutNavGroup>,
      );
    }
    run = [];
  };
  for (const entry of entries) {
    if (entry.type === "group") {
      flush();
      if (entry.hidden) continue;
      const children = visibleChildren(entry.items);
      if (!children.some((child) => child.type !== "separator")) continue;
      result.push(
        <AppLayoutNavGroup
          key={entry.id}
          label={entry.label}
          collapsible={entry.collapsible}
          defaultOpen={entry.defaultOpen}
        >
          {children.map(renderChild)}
        </AppLayoutNavGroup>,
      );
    } else if (entry.type === "separator" && run.length === 0) {
      if (!entry.hidden) result.push(<AppLayoutNavSeparator key={entry.id} />);
    } else {
      run.push(entry);
    }
  }
  flush();
  return result;
}

/**
 * A navigation built from a configuration array: groups, items, submenus and separators. It renders
 * the same parts as writing them by hand. Entries with `hidden` are left out, and so are groups and
 * submenus left empty. Every `id` must be unique (duplicates log a development warning).
 *
 * ```tsx
 * const items: AppLayoutNavEntry[] = [
 *   { type: "item", id: "home", label: t("nav.home"), href: "/" },
 *   {
 *     type: "group",
 *     id: "admin",
 *     label: t("nav.admin"),
 *     hidden: !isAdmin,
 *     items: [{ type: "item", id: "users", label: t("nav.users"), href: "/users" }],
 *   },
 * ];
 *
 * <AppLayoutNav items={items} aria-label={t("layout.navigation")} />;
 * ```
 */
export function AppLayoutNav({ items, ...rest }: AppLayoutNavProps) {
  useAppLayoutContext("AppLayoutNav");
  const duplicates = duplicateNavIds(items);
  useAppLayoutWarnings([
    [duplicates.length > 0, `AppLayoutNav has duplicate ids: ${duplicates.join(", ")}`],
  ]);
  return (
    <nav data-slot="app-layout-nav" {...rest}>
      {blocks(items)}
    </nav>
  );
}
