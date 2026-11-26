import { createI18n, type I18nResources } from "@aureus-core/i18n/runtime";
import { Button } from "@aureus-core/ui/shadcn/button";
import { ToggleGroup, ToggleGroupItem } from "@aureus-core/ui/shadcn/toggle-group";
import type { Locale } from "@sb/i18n/locale-types";
import { Suspense, useState } from "react";
import { I18nextProvider, useTranslation } from "react-i18next";
import { exampleLanguageNames, exampleLocales } from "./translations-locales";
import { translationsStrings } from "./translations-strings";

export interface TranslationsDemoProps {
  /** The docs locale, for the demo's own labels. */
  locale: Locale;
  /** Artificial latency of each file load, in milliseconds, so lazy loading is visible. */
  delay?: number;
}

/** In-memory resources shaped like `virtual:aureus-i18n`, reporting each load. */
function createExampleResources(delay: number, onLoad: (file: string) => void): I18nResources {
  return {
    languages: Object.keys(exampleLocales).sort(),
    namespaces: ["common", "payments"],
    defaultNamespace: "common",
    load: (language, namespace) =>
      new Promise((resolve) =>
        setTimeout(() => {
          onLoad(`${language}/${namespace}`);
          resolve(exampleLocales[language]?.[namespace] ?? {});
        }, delay),
      ),
    onUpdate: () => () => {},
  };
}

function Greeting() {
  const { t, i18n } = useTranslation();
  return (
    <>
      <p className="text-lg font-medium">{t("greeting", { name: "Ana" })}</p>
      <p className="text-muted-foreground text-sm">{t("direction", { dir: i18n.dir() })}</p>
    </>
  );
}

function PaymentsScreen() {
  const { t } = useTranslation("payments");
  return (
    <section className="rounded-md border p-3">
      <h3 className="font-medium">{t("title")}</h3>
      <p className="text-sm">{t("pending", { count: 3 })}</p>
    </section>
  );
}

/** A small app on its own `createI18n` instance: a language selector and a lazily loaded namespace. */
export function TranslationsDemo({ locale, delay = 400 }: TranslationsDemoProps) {
  const strings = translationsStrings[locale];
  const [loaded, setLoaded] = useState<string[]>([]);
  const [i18n] = useState(() =>
    createI18n({
      resources: createExampleResources(delay, (file) => setLoaded((files) => [...files, file])),
      fallbackLng: "en",
      detection: false,
    }),
  );
  const [language, setLanguage] = useState("en");
  const [showPayments, setShowPayments] = useState(false);

  const changeLanguage = (next: string) => {
    if (!next) return;
    setLanguage(next);
    void i18n.changeLanguage(next);
  };

  return (
    <div className="grid max-w-2xl gap-6">
      <div className="grid gap-2">
        <span id="example-language" className="text-sm font-medium">
          {strings.appLanguage}
        </span>
        <ToggleGroup
          type="single"
          variant="outline"
          value={language}
          onValueChange={changeLanguage}
          aria-labelledby="example-language"
        >
          {Object.entries(exampleLanguageNames).map(([code, name]) => (
            <ToggleGroupItem key={code} value={code} lang={code}>
              {name}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
        <p className="text-muted-foreground text-sm">{strings.appLanguageHelp}</p>
      </div>

      <section
        aria-label={strings.preview}
        lang={language}
        dir={i18n.dir(language)}
        className="grid gap-3 rounded-lg border p-4"
      >
        <I18nextProvider i18n={i18n}>
          <Suspense fallback={<p className="text-sm">{strings.loading}</p>}>
            <Greeting />
          </Suspense>
          {showPayments ? (
            <Suspense fallback={<p className="text-sm">{strings.loadingPayments}</p>}>
              <PaymentsScreen />
            </Suspense>
          ) : (
            <div>
              <Button type="button" variant="outline" onClick={() => setShowPayments(true)}>
                <span lang={locale} dir="ltr">
                  {strings.openPayments}
                </span>
              </Button>
            </div>
          )}
        </I18nextProvider>
      </section>

      <div className="grid gap-2">
        <h3 className="text-sm font-medium">{strings.loadedFiles}</h3>
        {loaded.length === 0 ? (
          <p className="text-sm">{strings.noneLoaded}</p>
        ) : (
          <ol aria-label={strings.loadedFiles} className="list-decimal ps-5 font-mono text-sm">
            {loaded.map((file) => (
              <li key={file}>{file}</li>
            ))}
          </ol>
        )}
        <p className="text-muted-foreground text-sm">{strings.loadedFilesHelp}</p>
      </div>
    </div>
  );
}
