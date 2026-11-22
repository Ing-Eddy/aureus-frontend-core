import {
  applyServerErrors,
  createFormHook,
  type ServerErrors,
} from "@aureus-core/hooks/schema-form";
import { PasswordControl } from "@aureus-core/ui/components/password-control";
import { SwitchField } from "@aureus-core/ui/components/switch-field";
import { TextControl } from "@aureus-core/ui/components/text-control";
import { Button } from "@aureus-core/ui/shadcn/button";
import type { Locale } from "@sb/i18n/locale-types";
import { createContext, type ReactNode, useContext, useEffect, useMemo, useState } from "react";
import { type FieldValues, FormProvider, type UseFormReturn } from "react-hook-form";
import { z } from "zod";
import { type SchemaFormStringKey, schemaFormStrings } from "./schema-form-strings";

// ---------------------------------------------------------------------------------------------
// An i18next stand-in: `useT()` returns a `t` that changes identity when the language changes,
// exactly what `useTranslation()` does in the apps.
// ---------------------------------------------------------------------------------------------

const LanguageContext = createContext<Locale>("en");

function useT() {
  const locale = useContext(LanguageContext);
  return useMemo(() => (key: SchemaFormStringKey) => schemaFormStrings[locale][key], [locale]);
}

// ---------------------------------------------------------------------------------------------
// Schema hooks and form hooks, written the way an app writes them.
// ---------------------------------------------------------------------------------------------

function useLoginSchema() {
  const t = useT();
  return useMemo(
    () =>
      z.object({
        email: z
          .string()
          .trim()
          .min(1, t("required"))
          .pipe(z.email(t("invalidEmail"))),
        password: z.string().min(1, t("required")),
      }),
    [t],
  );
}

const LOGIN_DEFAULTS = { email: "", password: "" };

const useLoginForm = createFormHook({ schema: useLoginSchema, defaultValues: LOGIN_DEFAULTS });

function useCompanySchema({ isEdit }: { isEdit: boolean }) {
  const t = useT();
  return useMemo(
    () =>
      z.object({
        name: z.string().trim().min(1, t("required")),
        city: z.string(),
        taxId: isEdit ? z.string() : z.string().trim().min(1, t("required")),
      }),
    [t, isEdit],
  );
}

const COMPANY_DEFAULTS = { name: "", city: "", taxId: "" };

const useCompanyForm = createFormHook({
  schema: useCompanySchema,
  defaultValues: COMPANY_DEFAULTS,
});

function useAgeSchema() {
  const t = useT();
  return useMemo(
    () => z.object({ age: z.string().regex(/^\d+$/, t("wholeNumber")).transform(Number) }),
    [t],
  );
}

const useAgeForm = createFormHook({ schema: useAgeSchema, defaultValues: { age: "" } });

// ---------------------------------------------------------------------------------------------
// Shared frame: FormProvider, <form>, Save and the submitted payload.
// ---------------------------------------------------------------------------------------------

interface FrameProps<In extends FieldValues> {
  // biome-ignore lint/suspicious/noExplicitAny: any output type.
  form: UseFormReturn<In, any, any>;
  children: ReactNode;
  footer?: ReactNode;
}

function Frame<In extends FieldValues>({ form, children, footer }: FrameProps<In>) {
  const t = useT();
  const [payload, setPayload] = useState<string>();
  const rootMessage = form.formState.errors.root?.message;
  return (
    <FormProvider {...form}>
      <form
        noValidate
        className="flex w-full max-w-sm flex-col gap-6"
        onSubmit={form.handleSubmit((data) => setPayload(JSON.stringify(data)))}
      >
        {rootMessage ? (
          <p role="alert" className="text-destructive text-sm">
            {rootMessage}
          </p>
        ) : null}
        {children}
        <div className="flex flex-wrap gap-2">
          <Button type="submit">{t("save")}</Button>
          {footer}
        </div>
        {payload ? (
          <output aria-label={t("submitted")} className="font-mono text-xs break-all">
            {payload}
          </output>
        ) : null}
      </form>
    </FormProvider>
  );
}

function LoginFields() {
  const t = useT();
  return (
    <>
      <TextControl name="email" inputMode="email" autoComplete="email" label={t("email")} />
      <PasswordControl
        name="password"
        label={t("password")}
        showPasswordLabel={t("showPassword")}
        hidePasswordLabel={t("hidePassword")}
      />
    </>
  );
}

// ---------------------------------------------------------------------------------------------
// Examples
// ---------------------------------------------------------------------------------------------

export type SchemaFormExample =
  | "basic"
  | "createAndEdit"
  | "serverErrors"
  | "multilanguage"
  | "schemaParams"
  | "transforms";

function BasicExample() {
  const form = useLoginForm();
  return (
    <Frame form={form}>
      <LoginFields />
    </Frame>
  );
}

function CreateAndEditExample() {
  const t = useT();
  // Stands in for a query: undefined until the record "arrives".
  const [company, setCompany] = useState<{ name: string; city: string }>();
  const [loading, setLoading] = useState(false);
  const form = useCompanyForm({ schemaParams: { isEdit: company !== undefined }, values: company });

  const load = () => {
    setLoading(true);
    setTimeout(() => {
      setCompany({ name: "Acme S.A.", city: "Lima" });
      setLoading(false);
    }, 300);
  };

  return (
    <Frame
      form={form}
      footer={
        <Button type="button" variant="outline" onClick={load} disabled={loading}>
          {loading ? t("loading") : t("loadCompany")}
        </Button>
      }
    >
      <TextControl name="name" label={t("companyName")} />
      <TextControl name="city" label={t("city")} />
      <TextControl name="taxId" label={t("taxId")} disabled={company !== undefined} />
    </Frame>
  );
}

/** A Laravel-style 422 body: the field errors are under `errors`. */
interface LaravelErrorBody {
  message: string;
  errors: Record<string, string[]>;
}

function ServerErrorsExample() {
  const t = useT();
  // A new object per "response", the way a request's error is: each one is applied.
  const [serverErrors, setServerErrors] = useState<ServerErrors<typeof LOGIN_DEFAULTS>>();
  const form = useLoginForm({ serverErrors });

  const simulate = () =>
    setServerErrors({
      email: [t("serverTaken"), t("serverDomain")],
      root: t("serverRoot"),
    });

  // The imperative form, for a request's error callback, with an adapter for the body's shape.
  const simulateLaravel = () => {
    const body: LaravelErrorBody = {
      message: "The given data was invalid.",
      errors: { password: [t("serverPassword")] },
    };
    applyServerErrors(form, body, { parse: (response: LaravelErrorBody) => response.errors });
  };

  return (
    <Frame
      form={form}
      footer={
        <>
          <Button type="button" variant="outline" onClick={simulate}>
            {t("simulateServer")}
          </Button>
          <Button type="button" variant="outline" onClick={simulateLaravel}>
            {t("simulateLaravel")}
          </Button>
        </>
      }
    >
      <LoginFields />
    </Frame>
  );
}

function SchemaParamsExample() {
  const t = useT();
  const [isEdit, setIsEdit] = useState(false);
  const form = useCompanyForm({ schemaParams: { isEdit } });
  return (
    <Frame form={form}>
      <SwitchField
        switchLabel={t("editMode")}
        helperText={t("editHelper")}
        value={isEdit}
        onValueChange={setIsEdit}
      />
      <TextControl name="name" label={t("companyName")} />
      <TextControl name="taxId" label={t("taxId")} />
    </Frame>
  );
}

function TransformsExample() {
  const t = useT();
  const form = useAgeForm();
  return (
    <Frame form={form}>
      <TextControl name="age" label={t("age")} inputMode="numeric" />
    </Frame>
  );
}

function MultilanguageExample({ locale }: { locale: Locale }) {
  const t = useT();
  const form = useLoginForm();
  return (
    <div className="flex flex-col gap-6">
      <fieldset className="flex gap-2">
        <legend className="mb-2 text-sm font-medium">{t("formLanguage")}</legend>
        <LanguageButton locale="en" current={locale} />
        <LanguageButton locale="es" current={locale} />
      </fieldset>
      <Frame form={form}>
        <LoginFields />
      </Frame>
    </div>
  );
}

const SetLanguageContext = createContext<(locale: Locale) => void>(() => {});

function LanguageButton({ locale, current }: { locale: Locale; current: Locale }) {
  const t = useT();
  const setLanguage = useContext(SetLanguageContext);
  return (
    <Button
      type="button"
      size="sm"
      variant={locale === current ? "default" : "outline"}
      aria-pressed={locale === current}
      onClick={() => setLanguage(locale)}
    >
      {t(locale === "en" ? "english" : "spanish")}
    </Button>
  );
}

export interface SchemaFormExamplesProps {
  example: SchemaFormExample;
  /** The toolbar's language. The "multilanguage" example can also change it from the form. */
  locale: Locale;
}

/** Renders one example in the toolbar's language. */
export function SchemaFormExamples({ example, locale }: SchemaFormExamplesProps) {
  // The language the examples use: the toolbar's, or the one picked inside the multilanguage example.
  const [language, setLanguage] = useState(locale);
  useEffect(() => setLanguage(locale), [locale]);

  return (
    <LanguageContext.Provider value={language}>
      <SetLanguageContext.Provider value={setLanguage}>
        {example === "basic" ? <BasicExample /> : null}
        {example === "createAndEdit" ? <CreateAndEditExample /> : null}
        {example === "serverErrors" ? <ServerErrorsExample /> : null}
        {example === "multilanguage" ? <MultilanguageExample locale={language} /> : null}
        {example === "schemaParams" ? <SchemaParamsExample /> : null}
        {example === "transforms" ? <TransformsExample /> : null}
      </SetLanguageContext.Provider>
    </LanguageContext.Provider>
  );
}
