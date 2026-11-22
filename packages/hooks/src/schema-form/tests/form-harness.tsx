import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
  Controller,
  type FieldValues,
  FormProvider,
  type UseFormReturn,
  useFormContext,
} from "react-hook-form";

/** A text input bound to the surrounding form, the way a `*-control` is. Its error is in `error-<name>`. */
export function Field({ name, label }: { name: string; label?: string }) {
  const { control } = useFormContext();
  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <div>
          <label>
            {label ?? name}
            <input
              name={field.name}
              value={(field.value as string | number | undefined) ?? ""}
              onChange={(event) => field.onChange(event.target.value)}
              onBlur={field.onBlur}
              ref={field.ref}
            />
          </label>
          {fieldState.error?.message ? (
            <p data-testid={`error-${name}`}>{fieldState.error.message}</p>
          ) : null}
        </div>
      )}
    />
  );
}

interface FormViewProps<In extends FieldValues> {
  // biome-ignore lint/suspicious/noExplicitAny: any output type.
  form: UseFormReturn<In, any, any>;
  fields: string[];
  onSubmit?: (data: unknown) => void;
}

/** Renders `form` with a `FormProvider`, one `Field` per name and a "Save" submit button. */
export function FormView<In extends FieldValues>({ form, fields, onSubmit }: FormViewProps<In>) {
  return (
    <FormProvider {...form}>
      <form noValidate onSubmit={form.handleSubmit((data) => onSubmit?.(data))}>
        {fields.map((name) => (
          <Field key={name} name={name} />
        ))}
        <button type="submit">Save</button>
      </form>
    </FormProvider>
  );
}

export const input = (name: string) => screen.getByRole("textbox", { name }) as HTMLInputElement;
export const errorOf = (name: string) => screen.queryByTestId(`error-${name}`)?.textContent ?? null;
export const save = () => userEvent.click(screen.getByRole("button", { name: "Save" }));
