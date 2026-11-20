import { zodResolver } from "@hookform/resolvers/zod";
import { type RenderResult, render } from "@testing-library/react";
import type { ReactNode } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { type Mock, vi } from "vitest";
import { z } from "zod";
import { isIsoDateTime } from "@/components/date-time-field";
import { TooltipProvider } from "@/shadcn/ui/tooltip";

export const bookingSchema = z.object({
  meeting: z.string().nullable().refine(isIsoDateTime, "Elige fecha y hora."),
  birth: z.string().nullable(),
});

/** Accepts any value, to observe what react-hook-form submits for disabled or loading fields. */
export const lenientSchema = z.object({ meeting: z.unknown(), birth: z.unknown() });

export type Booking = { meeting?: string | null; birth?: string | null };
type Schema = typeof bookingSchema | typeof lenientSchema;

function Harness({
  children,
  defaultValues,
  schema,
  onSubmit,
}: {
  children: ReactNode;
  defaultValues: Booking;
  schema: Schema;
  onSubmit: (values: Booking) => void;
}) {
  const form = useForm<Booking>({
    resolver: zodResolver(schema as unknown as typeof lenientSchema) as never,
    defaultValues,
  });
  return (
    <TooltipProvider>
      <FormProvider {...form}>
        <form noValidate onSubmit={form.handleSubmit((values) => onSubmit(values))}>
          {children}
          <button type="submit">Guardar</button>
        </form>
        <span data-testid="touched">{String(Boolean(form.formState.touchedFields.meeting))}</span>
      </FormProvider>
    </TooltipProvider>
  );
}

/** Renders `children` inside a schema-driven form, the way consumers use controls. */
export function renderInForm(
  children: ReactNode,
  defaultValues: Booking = { meeting: null, birth: null },
  schema: Schema = bookingSchema,
): RenderResult & { onSubmit: Mock<(values: Booking) => void> } {
  const onSubmit = vi.fn<(values: Booking) => void>();
  const result = render(
    <Harness defaultValues={defaultValues} schema={schema} onSubmit={onSubmit}>
      {children}
    </Harness>,
  );
  return { ...result, onSubmit };
}
