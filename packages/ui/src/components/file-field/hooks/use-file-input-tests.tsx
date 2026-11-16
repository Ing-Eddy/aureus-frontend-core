import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { type UseFileInputOptions, useFileInput } from "./use-file-input";

function Harness(props: Partial<UseFileInputOptions>) {
  const input = useFileInput({
    multiple: true,
    restrictions: {},
    getCurrent: () => ({ count: 0, totalSize: 0 }),
    onAccept: () => {},
    disabled: false,
    pasteable: false,
    ...props,
  });
  return (
    <div
      data-testid="zone"
      data-dragging={input.dragging || undefined}
      {...input.dropzoneProps}
      onPaste={input.onPaste}
    >
      <input data-testid="input" type="file" multiple onChange={input.onInputChange} />
      <span data-testid="rejections">{input.rejections.map((r) => r.file.name).join(",")}</span>
    </div>
  );
}

const file = (name: string, size = 1, type = "text/plain") =>
  new File([new Uint8Array(size)], name, { type });

describe("useFileInput", () => {
  it("adds picked files and resets the input", async () => {
    const onAccept = vi.fn();
    render(<Harness onAccept={onAccept} />);
    const input = screen.getByTestId("input") as HTMLInputElement;
    await userEvent.upload(input, [file("a.txt"), file("b.txt")]);
    await waitFor(() => expect(onAccept).toHaveBeenCalledTimes(1));
    expect(onAccept.mock.calls[0]?.[0].map((f: File) => f.name)).toEqual(["a.txt", "b.txt"]);
    expect(input.value).toBe("");
  });

  it("checks dropped files and reports the rejections", async () => {
    const onAccept = vi.fn();
    const onReject = vi.fn();
    render(
      <Harness onAccept={onAccept} onReject={onReject} restrictions={{ accept: "image/*" }} />,
    );
    const zone = screen.getByTestId("zone");
    const dataTransfer = {
      files: [file("a.png", 1, "image/png"), file("b.txt")],
      types: ["Files"],
    };
    fireEvent.dragEnter(zone, { dataTransfer });
    expect(zone.hasAttribute("data-dragging")).toBe(true);
    fireEvent.drop(zone, { dataTransfer });
    await waitFor(() => expect(onAccept).toHaveBeenCalled());
    expect(zone.hasAttribute("data-dragging")).toBe(false);
    expect(onAccept.mock.calls[0]?.[0].map((f: File) => f.name)).toEqual(["a.png"]);
    expect(onReject).toHaveBeenCalledWith([{ file: expect.any(File), reasons: ["type"] }]);
    expect(screen.getByTestId("rejections").textContent).toContain("b.txt");
  });

  it("lets only one file in without multiple", async () => {
    const onAccept = vi.fn();
    const onReject = vi.fn();
    render(
      <Harness
        multiple={false}
        onAccept={onAccept}
        onReject={onReject}
        getCurrent={() => ({ count: 5, totalSize: 0 })}
      />,
    );
    fireEvent.drop(screen.getByTestId("zone"), {
      dataTransfer: { files: [file("a"), file("b")], types: ["Files"] },
    });
    await waitFor(() => expect(onAccept).toHaveBeenCalled());
    expect(onAccept.mock.calls[0]?.[0]).toHaveLength(1);
    expect(onReject.mock.calls[0]?.[0][0].reasons).toEqual(["count"]);
  });

  it("transforms accepted files and rejects the ones that fail", async () => {
    const onAccept = vi.fn();
    const onReject = vi.fn();
    const transform = vi.fn(async (f: File) => {
      if (f.name === "bad") throw new Error("no");
      return new File(["small"], `${f.name}.min`);
    });
    render(<Harness onAccept={onAccept} onReject={onReject} transform={transform} />);
    await userEvent.upload(screen.getByTestId("input") as HTMLInputElement, [
      file("good"),
      file("bad"),
    ]);
    await waitFor(() => expect(onAccept).toHaveBeenCalled());
    expect(onAccept.mock.calls[0]?.[0].map((f: File) => f.name)).toEqual(["good.min"]);
    expect(onReject.mock.calls[0]?.[0][0].reasons).toEqual(["transform"]);
  });

  it("adds pasted files only when pasteable", async () => {
    const onAccept = vi.fn();
    const { rerender } = render(<Harness onAccept={onAccept} />);
    const zone = screen.getByTestId("zone");
    fireEvent.paste(zone, { clipboardData: { files: [file("p.png", 1, "image/png")] } });
    expect(onAccept).not.toHaveBeenCalled();
    rerender(<Harness onAccept={onAccept} pasteable />);
    fireEvent.paste(zone, { clipboardData: { files: [file("p.png", 1, "image/png")] } });
    await waitFor(() => expect(onAccept).toHaveBeenCalledTimes(1));
  });

  it("ignores everything while disabled", async () => {
    const onAccept = vi.fn();
    render(<Harness onAccept={onAccept} disabled />);
    fireEvent.drop(screen.getByTestId("zone"), {
      dataTransfer: { files: [file("a")], types: ["Files"] },
    });
    await new Promise((resolve) => setTimeout(resolve, 0));
    expect(onAccept).not.toHaveBeenCalled();
  });
});
