import { useCallback, useMemo, useState } from "react";
import type { AppLayoutBreadcrumbItem } from "../types";
import type { AppLayoutBreadcrumbContextValue } from "./use-app-layout-context";

/** The trail one caller wants shown. */
interface Layer {
  /** Identifies the caller, so it can update and remove its own layer. */
  token: string;
  /** Where the layer sits in the stack: the higher, the closer to the top. The base layer is 0. */
  order: number;
  /** That caller's trail. */
  items: readonly AppLayoutBreadcrumbItem[];
}

/** Token of the bottom layer, which is never removed. */
const BASE = "base";

/**
 * The breadcrumb trail as a stack of layers. The base layer starts with `defaultBreadcrumb`; each
 * `useAppLayoutBreadcrumbItems` caller adds a layer while mounted. Layers are stacked by their
 * `order`, not by the order of effects, which run children first. The trail shown is the top layer,
 * and the imperative functions change the top layer.
 */
export function useBreadcrumbState(
  defaultBreadcrumb: readonly AppLayoutBreadcrumbItem[] = [],
): AppLayoutBreadcrumbContextValue {
  const [layers, setLayers] = useState<readonly Layer[]>(() => [
    { token: BASE, order: 0, items: defaultBreadcrumb },
  ]);

  const changeTop = useCallback(
    (change: (items: readonly AppLayoutBreadcrumbItem[]) => readonly AppLayoutBreadcrumbItem[]) =>
      setLayers((current) => {
        const top = current[current.length - 1];
        if (!top) return current;
        return [...current.slice(0, -1), { ...top, items: change(top.items) }];
      }),
    [],
  );

  const setItems = useCallback(
    (items: readonly AppLayoutBreadcrumbItem[]) => changeTop(() => items),
    [changeTop],
  );
  const push = useCallback(
    (item: AppLayoutBreadcrumbItem) => changeTop((items) => [...items, item]),
    [changeTop],
  );
  const pop = useCallback(() => changeTop((items) => items.slice(0, -1)), [changeTop]);
  const update = useCallback(
    (id: string, patch: Partial<AppLayoutBreadcrumbItem>) =>
      changeTop((items) => items.map((item) => (item.id === id ? { ...item, ...patch } : item))),
    [changeTop],
  );
  const clear = useCallback(() => changeTop(() => []), [changeTop]);

  const pushLayer = useCallback(
    (token: string, order: number, items: readonly AppLayoutBreadcrumbItem[]) =>
      setLayers((current) =>
        [...current.filter((layer) => layer.token !== token), { token, order, items }].sort(
          (a, b) => a.order - b.order,
        ),
      ),
    [],
  );
  const updateLayer = useCallback(
    (token: string, items: readonly AppLayoutBreadcrumbItem[]) =>
      setLayers((current) =>
        current.map((layer) => (layer.token === token ? { ...layer, items } : layer)),
      ),
    [],
  );
  const removeLayer = useCallback(
    (token: string) => setLayers((current) => current.filter((layer) => layer.token !== token)),
    [],
  );

  const items = layers[layers.length - 1]?.items ?? [];

  return useMemo(
    () => ({ items, setItems, push, pop, update, clear, pushLayer, updateLayer, removeLayer }),
    [items, setItems, push, pop, update, clear, pushLayer, updateLayer, removeLayer],
  );
}
