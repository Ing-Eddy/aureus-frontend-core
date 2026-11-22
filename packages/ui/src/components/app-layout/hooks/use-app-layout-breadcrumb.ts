import { useId, useLayoutEffect, useRef } from "react";
import type { AppLayoutBreadcrumbItem, UseAppLayoutBreadcrumbResult } from "../types";
import { useAppLayoutBreadcrumbContext } from "./use-app-layout-context";

/**
 * The breadcrumb trail of the surrounding `AppLayout`, with functions to change it. They act on
 * the trail currently shown.
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

/**
 * Shows `items` as the breadcrumb while the calling component is mounted, and restores the trail
 * that was shown before when it unmounts. The trail is updated when an item's `id`, text label or
 * `href` changes, so an inline array does not cause extra renders; change `id` to refresh a label
 * that is a React node.
 */
export function useAppLayoutBreadcrumbItems(items: readonly AppLayoutBreadcrumbItem[]) {
  const { pushLayer, updateLayer, removeLayer } = useAppLayoutBreadcrumbContext(
    "useAppLayoutBreadcrumbItems",
  );
  const token = useId();
  const itemsRef = useRef(items);
  itemsRef.current = items;
  const key = trailKey(items);

  useLayoutEffect(() => {
    pushLayer(token, itemsRef.current);
    return () => removeLayer(token);
  }, [token, pushLayer, removeLayer]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: `key` stands for the items' content.
  useLayoutEffect(() => {
    updateLayer(token, itemsRef.current);
  }, [key, token, updateLayer]);
}
