import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

export const countries = [
  { value: "es", label: "España", group: "Europa" },
  { value: "fr", label: "Francia", group: "Europa" },
  { value: "mx", label: "México", group: "América", description: "Peso mexicano" },
  { value: "cl", label: "Chile", group: "América", disabled: true },
];

export const colors = [
  { value: "red", label: "Rojo" },
  { value: "blue", label: "Azul" },
  { value: "green", label: "Verde" },
  { value: "yellow", label: "Amarillo" },
];

export const trigger = (name: string | RegExp = /^País/) =>
  screen.getByRole("combobox", { name }) as HTMLButtonElement;

/** Opens the list from the keyboard (as a user would with ArrowDown). */
export async function openList(element: HTMLElement = trigger()) {
  element.focus();
  await userEvent.keyboard("{ArrowDown}");
}

export const optionTexts = () =>
  screen.queryAllByRole("option").map((option) => option.textContent);
