import type { Locale } from "@sb/i18n/locale-types";

/**
 * Texts of the schema-form examples: labels, buttons and the schema's validation messages. They play
 * the role of an app's i18next resources. Spanish is typed from the English keys.
 */
const en = {
  email: "Email",
  password: "Password",
  showPassword: "Show password",
  hidePassword: "Hide password",
  companyName: "Company name",
  city: "City",
  taxId: "Tax ID",
  age: "Age",
  required: "This field is required.",
  invalidEmail: "Enter a valid email address.",
  wholeNumber: "Enter a whole number.",
  save: "Save",
  submitted: "Submitted data",
  loadCompany: "Load the company (edit mode)",
  loading: "Loading…",
  simulateServer: "Simulate server errors",
  simulateLaravel: "Simulate a Laravel response",
  serverTaken: "This email is already registered.",
  serverDomain: "This domain is not allowed.",
  serverRoot: "We could not create the account. Check the fields below.",
  serverPassword: "This password is too common.",
  editMode: "Edit mode",
  editHelper: "In edit mode the tax ID cannot change, so the schema does not require it.",
  formLanguage: "Form language",
  english: "English",
  spanish: "Español",
};

const es: Record<keyof typeof en, string> = {
  email: "Correo electrónico",
  password: "Contraseña",
  showPassword: "Mostrar contraseña",
  hidePassword: "Ocultar contraseña",
  companyName: "Nombre de la empresa",
  city: "Ciudad",
  taxId: "Identificación fiscal",
  age: "Edad",
  required: "Este campo es obligatorio.",
  invalidEmail: "Introduce un correo electrónico válido.",
  wholeNumber: "Introduce un número entero.",
  save: "Guardar",
  submitted: "Datos enviados",
  loadCompany: "Cargar la empresa (modo edición)",
  loading: "Cargando…",
  simulateServer: "Simular errores del servidor",
  simulateLaravel: "Simular una respuesta de Laravel",
  serverTaken: "Este correo ya está registrado.",
  serverDomain: "Este dominio no está permitido.",
  serverRoot: "No pudimos crear la cuenta. Revisa los campos de abajo.",
  serverPassword: "Esta contraseña es demasiado común.",
  editMode: "Modo edición",
  editHelper:
    "En modo edición la identificación fiscal no puede cambiar, así que el schema no la exige.",
  formLanguage: "Idioma del formulario",
  english: "English",
  spanish: "Español",
};

export type SchemaFormStringKey = keyof typeof en;

export const schemaFormStrings: Record<Locale, typeof en> = { en, es };
