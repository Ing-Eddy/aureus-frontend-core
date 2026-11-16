import {
  FileArchiveIcon,
  FileAudioIcon,
  FileIcon,
  FileImageIcon,
  FileTextIcon,
  FileVideoIcon,
} from "lucide-react";

const archive = /zip|rar|7z|tar|gzip|compressed/;
const text = /pdf|text|word|document|sheet|excel|csv|presentation|rtf|json/;

/** A decorative icon for a file's MIME type. */
export function FileTypeIcon({ type, className }: { type?: string; className?: string }) {
  const value = type?.toLowerCase() ?? "";
  const Icon = value.startsWith("image/")
    ? FileImageIcon
    : value.startsWith("audio/")
      ? FileAudioIcon
      : value.startsWith("video/")
        ? FileVideoIcon
        : archive.test(value)
          ? FileArchiveIcon
          : text.test(value)
            ? FileTextIcon
            : FileIcon;
  return <Icon aria-hidden="true" className={className} />;
}
