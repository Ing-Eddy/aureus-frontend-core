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

/** Groups and separators, with runs of rows outside a group placed in a group without title. */
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
 * A navigation built from a configuration array: groups, items, submenus and separators. It
 * renders the same parts as writing them by hand. Entries with `hidden` are left out, and so are
 * groups and submenus left empty. Every `id` must be unique.
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
