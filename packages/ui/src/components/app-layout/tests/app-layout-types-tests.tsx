import { describe, expect, it } from "vitest";
import type {
  AppLayoutBreadcrumbProps,
  AppLayoutNavEntry,
  AppLayoutNavItemProps,
  AppLayoutSidebarProps,
  AppLayoutTopbarProps,
} from "..";

/** Type-level checks: `typecheck` fails if an `@ts-expect-error` below stops being an error. */
describe("AppLayout types", () => {
  const flag = Math.random() > 2;

  it("requires the top bar texts unless the feature is off", () => {
    const cases: AppLayoutTopbarProps[] = [
      { triggerLabel: "t", breadcrumbLabel: "b" },
      { trigger: false, breadcrumb: false },
      { triggerLabel: "t", breadcrumbLabel: "b", breadcrumb: { maxItems: 3, ellipsisLabel: "…" } },
      // @ts-expect-error triggerLabel is required with the trigger
      { breadcrumbLabel: "b" },
      // @ts-expect-error breadcrumbLabel is required with the breadcrumb
      { triggerLabel: "t" },
      // @ts-expect-error triggerLabel is not allowed with trigger={false}
      { trigger: false, triggerLabel: "t", breadcrumb: false },
      // @ts-expect-error maxItems needs ellipsisLabel
      { triggerLabel: "t", breadcrumbLabel: "b", breadcrumb: { maxItems: 3 } },
    ];
    expect(cases).toHaveLength(7);
  });

  it("requires the sidebar texts", () => {
    const cases: AppLayoutSidebarProps[] = [
      { mobileTitle: "m" },
      { mobileTitle: "m", rail: true, railLabel: "r" },
      { mobileTitle: "m", rail: flag, railLabel: "r" },
      { mobileTitle: "m", mobileCloseButton: true, mobileCloseLabel: "c" },
      // @ts-expect-error mobileTitle is required
      {},
      // @ts-expect-error rail needs railLabel
      { mobileTitle: "m", rail: true },
      // @ts-expect-error mobileCloseButton needs mobileCloseLabel
      { mobileTitle: "m", mobileCloseButton: true },
      // @ts-expect-error railLabel only with rail
      { mobileTitle: "m", railLabel: "r" },
    ];
    expect(cases).toHaveLength(8);
  });

  it("requires the breadcrumb texts", () => {
    const cases: AppLayoutBreadcrumbProps[] = [
      { label: "b" },
      { label: "b", maxItems: 4, ellipsisLabel: "…" },
      // @ts-expect-error label is required
      {},
      // @ts-expect-error maxItems needs ellipsisLabel
      { label: "b", maxItems: 4 },
    ];
    expect(cases).toHaveLength(4);
  });

  it("requires item labels and the actions label", () => {
    const cases: AppLayoutNavItemProps[] = [
      { label: "x" },
      { label: "x", actions: { label: "More", items: [] } },
      // @ts-expect-error label is required
      { href: "/" },
      // @ts-expect-error actions need a label
      { label: "x", actions: { items: [] } },
    ];
    expect(cases).toHaveLength(4);
  });

  it("allows two navigation levels only", () => {
    const entries: AppLayoutNavEntry[] = [
      { type: "submenu", id: "s", label: "S", items: [{ id: "a", label: "A", href: "/a" }] },
      {
        type: "submenu",
        id: "t",
        label: "T",
        // @ts-expect-error sub-items cannot be submenus
        items: [{ type: "submenu", id: "deep", label: "Deep", items: [] }],
      },
      // @ts-expect-error every entry needs an id
      { type: "item", label: "No id" },
    ];
    expect(entries).toHaveLength(3);
  });
});
