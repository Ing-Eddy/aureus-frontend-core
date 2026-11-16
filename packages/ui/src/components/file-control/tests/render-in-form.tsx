import { zodResolver } from "@hookform/resolvers/zod";
import { type RenderResult, render } from "@testing-library/react";
import type { ReactNode } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { type Mock, vi } from "vitest";
import { z } from "zod";
import { type FileItem, hasPendingUploads } from "@/components/file-field";
import { TooltipProvider } from "@/shadcn/ui/tooltip";

export interface Stored {
  id: number;
  filename: string;
  url: string;
}

export const getFileInfo = (data: Stored) => ({ name: data.filename, url: data.url });
export const texts = {
  chooseLabel: "Elegir archivo",
  removeLabel: (name: string) => `Quitar ${name}`,
  getFileInfo,
};

export const filesSchema = z.object({
  contract: z.array(z.any()).min(1, "Adjunta el contrato."),
  photo: z.any(),
  uploads: z
    .array(z.any())
    .refine((files) => !hasPendingUploads(files), "Espera a que terminen las subidas."),
});

export type Files = {
  contract: FileItem<Stored>[];
  photo: FileItem<Stored> | null;
  uploads: FileItem<Stored>[];
};

export const defaults: Files = { contract: [], photo: null, uploads: [] };

function Harness({
  children,
  defaultValues,
  onSubmit,
}: {
  children: ReactNode;
  defaultValues: Partial<Files>;
  onSubmit: (values: Files) => void;
}) {
  const form = useForm<Files>({
    resolver: zodResolver(filesSchema) as never,
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
  defaultValues: Partial<Files> = defaults,
): RenderResult & { onSubmit: Mock<(values: Files) => void> } {
  const onSubmit = vi.fn<(values: Files) => void>();
  const result = render(
    <Harness defaultValues={defaultValues} onSubmit={onSubmit}>
      {children}
    </Harness>,
  );
  return { ...result, onSubmit };
}
