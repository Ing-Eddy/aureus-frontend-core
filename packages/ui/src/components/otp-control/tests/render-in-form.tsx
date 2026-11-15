import { zodResolver } from "@hookform/resolvers/zod";
import { type RenderResult, render } from "@testing-library/react";
import type { ReactNode } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { type Mock, vi } from "vitest";
import { z } from "zod";
import { TooltipProvider } from "@/shadcn/ui/tooltip";

export const verifySchema = z.object({
  code: z.string().length(6, "Enter the 6 digits."),
  pin: z.string().regex(/^\d{4}$/, "Enter a 4-digit PIN."),
});

/** Accepts any value, to observe what react-hook-form submits for disabled or loading fields. */
export const lenientSchema = z.object({ code: z.unknown(), pin: z.unknown() });

export type Verify = { code: string; pin: string };
type Schema = typeof verifySchema | typeof lenientSchema;

function Harness({
  children,
  defaultValues,
  schema,
  onSubmit,
}: {
  children: ReactNode;
  defaultValues: Partial<Verify>;
  schema: Schema;
  onSubmit: (values: Verify) => void;
}) {
  const form = useForm<Verify>({
    resolver: zodResolver(schema as unknown as typeof lenientSchema) as never,
    defaultValues,
  });
  return (
    <TooltipProvider>
      <FormProvider {...form}>
        <form noValidate onSubmit={form.handleSubmit((values) => onSubmit(values))}>
          {children}
          <button type="submit">Save</button>
        </form>
      </FormProvider>
    </TooltipProvider>
  );
}

/** Renders `children` inside a schema-driven form, the way consumers use controls. */
export function renderInForm(
  children: ReactNode,
  defaultValues: Partial<Verify> = { code: "", pin: "" },
  schema: Schema = verifySchema,
): RenderResult & { onSubmit: Mock<(values: Verify) => void> } {
  const onSubmit = vi.fn<(values: Verify) => void>();
  const result = render(
    <Harness defaultValues={defaultValues} schema={schema} onSubmit={onSubmit}>
      {children}
    </Harness>,
  );
  return { ...result, onSubmit };
}
