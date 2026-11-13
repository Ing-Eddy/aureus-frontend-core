import { asset } from "./asset";
/** Attachments for Attachment stories. Images point at local SVGs in `public/images/`. */
export interface FileFixture {
  id: string;
  name: string;
  type: string;
  size: number; // bytes
  url?: string;
  status: "uploaded" | "uploading" | "error";
  progress?: number;
}

export const files: readonly FileFixture[] = [
  {
    id: "f1",
    name: "mountains.svg",
    type: "image/svg+xml",
    size: 48_213,
    url: asset("/images/mountains.svg"),
    status: "uploaded",
  },
  { id: "f2", name: "q4-report.pdf", type: "application/pdf", size: 1_284_000, status: "uploaded" },
  {
    id: "f3",
    name: "roadmap.xlsx",
    type: "application/vnd.ms-excel",
    size: 312_400,
    status: "uploading",
    progress: 45,
  },
  { id: "f4", name: "notes.txt", type: "text/plain", size: 2_048, status: "error" },
];

export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export const images = ["mountains", "desert", "forest", "ocean", "dusk"].map((slug) => ({
  src: asset(`images/${slug}.svg`),
  alt: `Illustrated ${slug} landscape`,
}));
