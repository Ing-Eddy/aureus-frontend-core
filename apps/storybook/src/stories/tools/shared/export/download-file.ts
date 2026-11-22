/** Saves the CSS through a temporary object URL; nothing is sent anywhere. */
export function downloadCss(css: string, fileName: string) {
  const url = URL.createObjectURL(new Blob([css], { type: "text/css" }));
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  link.rel = "noopener";
  document.body.append(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 0);
}
