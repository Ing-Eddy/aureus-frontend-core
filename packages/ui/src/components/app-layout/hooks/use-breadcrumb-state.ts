import { useCallback, useMemo, useState } from "react";
import type { AppLayoutBreadcrumbItem } from "../types";
import type { AppLayoutBreadcrumbContextValue } from "./use-app-layout-context";

interface Layer {
  token: string;
  items: readonly AppLayoutBreadcrumbItem[];
}

const BASE = "base";

/**
 * The breadcrumb trail as a stack of layers. The base layer starts with `defaultBreadcrumb`; each
 * `useAppLayoutBreadcrumbItems` caller adds a layer while mounted. The trail shown is the top
 * layer, and the imperative functions change the top layer.
 */
export function useBreadcrumbState(
  defaultBreadcrumb: readonly AppLayoutBreadcrumbItem[] = [],
): AppLayoutBreadcrumbContextValue {
  const [layers, setLayers] = useState<readonly Layer[]>(() => [
    { token: BASE, items: defaultBreadcrumb },
  ]);

  const changeTop = useCallback(
    (change: (items: readonly AppLayoutBreadcrumbItem[]) => readonly AppLayoutBreadcrumbItem[]) =>
      setLayers((current) => {
        const top = current[current.length - 1];
        if (!top) return current;
        return [...current.slice(0, -1), { token: top.token, items: change(top.items) }];
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
    (token: string, items: readonly AppLayoutBreadcrumbItem[]) =>
      setLayers((current) => [
        ...current.filter((layer) => layer.token !== token),
        { token, items },
      ]),
    [],
  );
  const updateLayer = useCallback(
    (token: string, items: readonly AppLayoutBreadcrumbItem[]) =>
      setLayers((current) =>
        current.map((layer) => (layer.token === token ? { token, items } : layer)),
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
