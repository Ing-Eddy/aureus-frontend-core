import { readFileSync, rmSync } from "node:fs";
import { join } from "node:path";
import { createServer, type ViteDevServer } from "vite";
import { afterEach, describe, expect, it, vi } from "vitest";
import { RESOLVED_VIRTUAL_MODULE_ID } from "@/internal/utils/constants";
import { aureusI18n } from "../vite";
import { createFixtureTree, type FixtureTree, fixtureApp, writeFixtureFiles } from "./helpers";

const cleanups: Array<() => void | Promise<void>> = [];
afterEach(async () => {
  for (const cleanup of cleanups.splice(0).reverse()) await cleanup();
  vi.restoreAllMocks();
});

const inSync: FixtureTree = {
  "src/common/locales/es.json": { save: "Guardar" },
  "src/common/locales/en.json": { save: "Save" },
  "src/features/auth/locales/es.json": { login: { title: "Entrar" } },
  "src/features/auth/locales/en.json": { login: { title: "Sign in" } },
};

async function startDev(files: FixtureTree) {
  const tree = createFixtureTree({ ...fixtureApp, ...files });
  cleanups.push(tree.remove);
  const server: ViteDevServer = await createServer({
    root: tree.root,
    configFile: false,
    logLevel: "silent",
    plugins: [aureusI18n({ typesFrom: "es", defaultNamespace: "common" })],
    server: { middlewareMode: true, ws: false, watch: null },
  });
  cleanups.push(() => server.close());
  const send = vi.spyOn(server.ws, "send");
  const warn = vi.spyOn(server.config.logger, "warn");
  const error = vi.spyOn(server.config.logger, "error");
  const info = vi.spyOn(server.config.logger, "info");
  await server.environments.client.pluginContainer.buildStart({});
  const virtualModule = async () =>
    (await server.environments.client.pluginContainer.load(RESOLVED_VIRTUAL_MODULE_ID)) as string;
  const types = () => readFileSync(join(tree.root, "src/types/i18next.d.ts"), "utf8");
  /** Writes files and tells Vite's watcher, as chokidar would. */
  const write = (event: "add" | "change", changed: FixtureTree) => {
    writeFixtureFiles(tree.root, changed);
    for (const path of Object.keys(changed)) server.watcher.emit(event, join(tree.root, path));
  };
  return { root: tree.root, server, send, warn, error, info, virtualModule, types, write };
}

describe("aureusI18n in the dev server", () => {
  it("serves the virtual module with the HMR listener", async () => {
    const dev = await startDev(inSync);
    const code = await dev.virtualModule();
    expect(code).toContain('"es/auth": () => import(');
    expect(code).toContain('import.meta.hot.on("aureus-i18n:update"');
  });

  it("a new module: rescans, rewrites the types and fully reloads", async () => {
    const dev = await startDev(inSync);
    expect(dev.types()).not.toContain("payments:");
    dev.write("add", {
      "src/features/payments/locales/es.json": { title: "Pagos" },
      "src/features/payments/locales/en.json": { title: "Payments" },
    });
    await vi.waitFor(() => expect(dev.send).toHaveBeenCalledWith({ type: "full-reload" }));
    expect(dev.types()).toContain("payments: {");
    expect(dev.info).toHaveBeenCalledWith(
      '[aureusI18n] Locales changed (added namespace "payments"): types regenerated, reloading the page.',
      expect.anything(),
    );
    expect(await dev.virtualModule()).toContain('"es/payments"');
  });

  it("a removed module: rescans and fully reloads", async () => {
    const dev = await startDev({
      ...inSync,
      "src/features/old/locales/es.json": {},
      "src/features/old/locales/en.json": {},
    });
    rmSync(join(dev.root, "src/features/old"), { recursive: true });
    dev.server.watcher.emit("unlinkDir", join(dev.root, "src/features/old/locales"));
    await vi.waitFor(() => expect(dev.send).toHaveBeenCalledWith({ type: "full-reload" }));
    expect(dev.types()).not.toContain("old:");
    expect(dev.info).toHaveBeenCalledWith(
      expect.stringContaining('removed namespace "old"'),
      expect.anything(),
    );
  });

  it("an unrelated file does not reload", async () => {
    const dev = await startDev(inSync);
    dev.write("add", { "src/components/button.ts": "export {};" });
    await new Promise((done) => setTimeout(done, 50));
    expect(dev.send).not.toHaveBeenCalledWith({ type: "full-reload" });
  });

  it("an edited text: sends the new content without a full reload", async () => {
    const dev = await startDev(inSync);
    dev.write("change", {
      "src/features/auth/locales/es.json": { login: { title: "Iniciar sesión" } },
    });
    await vi.waitFor(() =>
      expect(dev.send).toHaveBeenCalledWith({
        type: "custom",
        event: "aureus-i18n:update",
        data: {
          language: "es",
          namespace: "auth",
          content: { login: { title: "Iniciar sesión" } },
        },
      }),
    );
    expect(dev.send).not.toHaveBeenCalledWith({ type: "full-reload" });
    expect(dev.types()).toContain('title: "Iniciar sesión";');
  });

  it("a removed key: warns once, and not again on an unrelated save", async () => {
    const dev = await startDev(inSync);
    dev.write("change", { "src/features/auth/locales/en.json": { login: {} } });
    await vi.waitFor(() => expect(dev.warn).toHaveBeenCalledTimes(1));
    expect(dev.warn.mock.calls[0]?.[0]).toContain('en: missing "login.title"');

    dev.write("change", { "src/common/locales/en.json": { save: "Save!" } });
    await vi.waitFor(() => expect(dev.send).toHaveBeenCalledTimes(2));
    expect(dev.warn).toHaveBeenCalledTimes(1);
  });

  it("invalid JSON: logs an error and keeps the server running", async () => {
    const dev = await startDev(inSync);
    dev.write("change", { "src/features/auth/locales/en.json": "{ nope" });
    await vi.waitFor(() =>
      expect(dev.error).toHaveBeenCalledWith(
        expect.stringContaining("src/features/auth/locales/en.json is not valid JSON"),
        expect.anything(),
      ),
    );
    dev.write("change", { "src/features/auth/locales/en.json": { login: { title: "Log in" } } });
    await vi.waitFor(() =>
      expect(dev.send).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({ content: { login: { title: "Log in" } } }),
        }),
      ),
    );
  });

  it("a collision created while developing is logged, not thrown", async () => {
    const dev = await startDev(inSync);
    dev.write("add", { "src/features/common/locales/es.json": {} });
    await vi.waitFor(() =>
      expect(dev.error).toHaveBeenCalledWith(
        expect.stringContaining('Two folders give the namespace "common"'),
        expect.anything(),
      ),
    );
    expect(dev.send).not.toHaveBeenCalledWith({ type: "full-reload" });
  });
});
