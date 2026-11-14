import { zodResolver } from "@hookform/resolvers/zod";
import { type RenderResult, render } from "@testing-library/react";
import type { ReactNode } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { type Mock, vi } from "vitest";
import { z } from "zod";
import { TooltipProvider } from "@/shadcn/ui/tooltip";

export const passwordSchema = z
  .object({
    password: z.string().min(8, "Use at least 8 characters."),
    confirm: z.string(),
  })
  .refine((values) => values.password === values.confirm, {
    message: "The passwords do not match.",
    path: ["confirm"],
  });

export type Passwords = z.infer<typeof passwordSchema>;

/** Accepts any value, to observe what react-hook-form submits for disabled or loading fields. */
export const lenientSchema = z.object({ password: z.unknown(), confirm: z.unknown() });

type Schema = typeof passwordSchema | typeof lenientSchema;

interface HarnessProps {
  children: ReactNode;
  defaultValues: Passwords;
  schema: Schema;
  onSubmit: (values: Passwords) => void;
}

function Harness({ children, defaultValues, schema, onSubmit }: HarnessProps) {
  const form = useForm<Passwords>({
    resolver: zodResolver(schema as typeof passwordSchema),
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
  defaultValues: Passwords,
  schema: Schema = passwordSchema,
): RenderResult & { onSubmit: Mock<(values: Passwords) => void> } {
  const onSubmit = vi.fn<(values: Passwords) => void>();
  const result = render(
    <Harness defaultValues={defaultValues} schema={schema} onSubmit={onSubmit}>
      {children}
    </Harness>,
  );
  return { ...result, onSubmit };
}
