import { useId, useLayoutEffect, useRef, useState } from "react";
import type { AppLayoutBreadcrumbItem, UseAppLayoutBreadcrumbResult } from "../types";
import { useAppLayoutBreadcrumbContext } from "./use-app-layout-context";

/**
 * The breadcrumb trail of the surrounding `AppLayout`, with functions to change it. They act on the
 * trail currently shown.
 *
 * ```tsx
 * const { update } = useAppLayoutBreadcrumb();
 *
 * useEffect(() => {
 *   if (invoice) update("invoice", { label: invoice.number });
 * }, [invoice, update]);
 * ```
 */
export function useAppLayoutBreadcrumb(): UseAppLayoutBreadcrumbResult {
  const { items, setItems, push, pop, update, clear } =
    useAppLayoutBreadcrumbContext("useAppLayoutBreadcrumb");
  return { items, setItems, push, pop, update, clear };
}

/** What identifies a trail's content without comparing React nodes. */
function trailKey(items: readonly AppLayoutBreadcrumbItem[]): string {
  return items
    .map((item) =>
      [item.id ?? "", typeof item.label === "string" ? item.label : "", item.href ?? ""].join(
        "\u0000",
      ),
    )
    .join("\u0001");
}

/** Counts the callers of `useAppLayoutBreadcrumbItems`, to order their layers. */
let callers = 0;

/**
 * Shows `items` as the breadcrumb while the calling component is mounted, and restores the trail
 * that was shown before when it unmounts. The trail is updated when an item's `id`, text label or
 * `href` changes, so an inline array does not cause extra renders; change `id` to refresh a label
 * that is a React node, an `icon` or an `onSelect`. Of several callers, the one that first
 * rendered last is shown: a page over its section, even when both mount together.
 *
 * ```tsx
 * useAppLayoutBreadcrumbItems([
 *   { label: t("nav.invoices"), href: "/invoices" },
 *   { id: "invoice", label: invoice.number },
 * ]);
 * ```
 */
export function useAppLayoutBreadcrumbItems(items: readonly AppLayoutBreadcrumbItem[]) {
  const { pushLayer, updateLayer, removeLayer } = useAppLayoutBreadcrumbContext(
    "useAppLayoutBreadcrumbItems",
  );
  const token = useId();
  // Taken on the first render. React renders a parent before its children, so a nested caller
  // always ranks above the outer one, although its effects run first.
  const [order] = useState(() => ++callers);
  const itemsRef = useRef(items);
  itemsRef.current = items;
  const key = trailKey(items);

  useLayoutEffect(() => {
    pushLayer(token, order, itemsRef.current);
    return () => removeLayer(token);
  }, [token, order, pushLayer, removeLayer]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: `key` stands for the items' content.
  useLayoutEffect(() => {
    updateLayer(token, itemsRef.current);
  }, [key, token, updateLayer]);
}
