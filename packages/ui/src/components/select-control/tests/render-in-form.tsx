import { zodResolver } from "@hookform/resolvers/zod";
import { type RenderResult, render } from "@testing-library/react";
import type { ReactNode } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { type Mock, vi } from "vitest";
import { z } from "zod";
import { TooltipProvider } from "@/shadcn/ui/tooltip";

export const profileSchema = z.object({
  country: z.string({ error: "Choose a country." }),
  tags: z.array(z.string()).min(1, "Choose at least one tag."),
});

/** Accepts any value, to observe what react-hook-form submits for disabled or loading fields. */
export const lenientSchema = z.object({ country: z.unknown(), tags: z.unknown() });

export type Profile = { country: string | null; tags: string[] };
type Schema = typeof profileSchema | typeof lenientSchema;

interface HarnessProps {
  children: ReactNode;
  defaultValues: Profile;
  schema: Schema;
  onSubmit: (values: Profile) => void;
}

function Harness({ children, defaultValues, schema, onSubmit }: HarnessProps) {
  const form = useForm<Profile>({
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
  defaultValues: Profile,
  schema: Schema = profileSchema,
): RenderResult & { onSubmit: Mock<(values: Profile) => void> } {
  const onSubmit = vi.fn<(values: Profile) => void>();
  const result = render(
    <Harness defaultValues={defaultValues} schema={schema} onSubmit={onSubmit}>
      {children}
    </Harness>,
  );
  return { ...result, onSubmit };
}
