// The declaration file the plugin generates from `fixtures/app` (kept in sync by a vite test).
// `tsc` includes it for the whole package, so the runtime tests are typed by it too.
/// <reference path="./fixtures/i18next-fixture.d.ts" />
import i18next from "i18next";
import { useTranslation } from "react-i18next";
import { describe, expectTypeOf, it } from "vitest";

// Type-only checks: the hooks are never called here (they are hooks), only type-checked by `tsc`.

describe("generated types for t()", () => {
  it("accepts the keys of a namespace and rejects others", () => {
    const _check = () => {
      const { t } = useTranslation("auth");
      t("login.title");
      t("title");
      // @ts-expect-error: the key does not exist.
      t("login.titel");
      // @ts-expect-error: nested keys need their full path.
      t("submit");
    };
  });

  it("accepts the discovered namespaces only", () => {
    const _check = () => {
      useTranslation("common");
      useTranslation(["auth", "common"]);
      // @ts-expect-error: no such namespace.
      useTranslation("nope");
    };
  });

  it("uses the default namespace when none is given", () => {
    const _check = () => {
      const { t } = useTranslation();
      t("save");
      t("actions.cancel");
      // @ts-expect-error: `login.title` belongs to `auth`, not to the default namespace.
      t("login.title");
    };
  });

  it("accepts keys of another namespace with its prefix", () => {
    const _check = () => {
      const { t } = useTranslation(["auth", "common"]);
      t("common:save");
      t("auth:login.submit");
      // @ts-expect-error: `save` is not an `auth` key.
      t("auth:save");
    };
  });

  it("types interpolation values", () => {
    const _check = () => {
      const { t } = useTranslation("auth");
      t("welcome", { name: "Ana" });
      // @ts-expect-error: `name` is required by "Hola, {{name}}".
      t("welcome");
    };
  });

  it("accepts plural keys by their base key", () => {
    const _check = () => {
      const { t } = useTranslation("auth");
      t("attempts", { count: 2 });
    };
  });

  it("returns the literal text type", () => {
    expectTypeOf(i18next.t("common:save")).toEqualTypeOf<"Guardar">();
  });
});
