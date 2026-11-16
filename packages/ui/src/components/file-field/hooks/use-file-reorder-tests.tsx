import { fireEvent, render, screen } from "@testing-library/react";
import { useRef, useState } from "react";
import { describe, expect, it, vi } from "vitest";
import { useFileReorder } from "./use-file-reorder";

function Harness({
  announce,
  direction,
}: {
  announce: (id: string, position: number, total: number) => void;
  direction?: "ltr" | "rtl";
}) {
  const [ids, setIds] = useState(["a", "b", "c"]);
  const containerRef = useRef<HTMLUListElement>(null);
  const reorder = useFileReorder({
    ids,
    enabled: true,
    containerRef,
    direction,
    announce,
    move: (from, to) =>
      setIds((list) => {
        const next = [...list];
        const [moved] = next.splice(from, 1);
        if (moved) next.splice(to, 0, moved);
        return next;
      }),
  });
  return (
    <ul ref={containerRef} data-testid="list" data-order={ids.join("")}>
      {ids.map((id) => (
        <li key={id} data-file-item-id={id}>
          <button type="button" {...reorder.handleProps(id)}>
            Move {id}
          </button>
        </li>
      ))}
    </ul>
  );
}

const order = () => screen.getByTestId("list").dataset.order;

describe("useFileReorder", () => {
  it("grabs, moves with the arrows, keeps focus, announces and drops", () => {
    const announce = vi.fn();
    render(<Harness announce={announce} />);
    const handle = screen.getByRole("button", { name: "Move a" });
    handle.focus();
    fireEvent.keyDown(handle, { key: " " });
    expect(handle.getAttribute("aria-pressed")).toBe("true");
    fireEvent.keyDown(handle, { key: "ArrowDown" });
    expect(order()).toBe("bac");
    expect(announce).toHaveBeenLastCalledWith("a", 2, 3);
    expect(document.activeElement).toBe(screen.getByRole("button", { name: "Move a" }));
    fireEvent.keyDown(screen.getByRole("button", { name: "Move a" }), { key: " " });
    expect(screen.getByRole("button", { name: "Move a" }).getAttribute("aria-pressed")).toBe(
      "false",
    );
  });

  it("puts the item back with Escape", () => {
    render(<Harness announce={() => {}} />);
    const handle = screen.getByRole("button", { name: "Move a" });
    handle.focus();
    fireEvent.keyDown(handle, { key: "Enter" });
    fireEvent.keyDown(handle, { key: "ArrowRight" });
    fireEvent.keyDown(screen.getByRole("button", { name: "Move a" }), { key: "ArrowRight" });
    expect(order()).toBe("bca");
    fireEvent.keyDown(screen.getByRole("button", { name: "Move a" }), { key: "Escape" });
    expect(order()).toBe("abc");
  });

  it("mirrors the inline arrows in right-to-left pages", () => {
    render(<Harness announce={() => {}} direction="rtl" />);
    const handle = screen.getByRole("button", { name: "Move a" });
    handle.focus();
    fireEvent.keyDown(handle, { key: " " });
    fireEvent.keyDown(handle, { key: "ArrowLeft" });
    expect(order()).toBe("bac");
  });

  it("drops on Tab and does nothing to arrows while not grabbed", () => {
    render(<Harness announce={() => {}} />);
    const handle = screen.getByRole("button", { name: "Move b" });
    fireEvent.keyDown(handle, { key: "ArrowDown" });
    expect(order()).toBe("abc");
    fireEvent.keyDown(handle, { key: " " });
    fireEvent.keyDown(handle, { key: "Tab" });
    expect(handle.getAttribute("aria-pressed")).toBe("false");
  });
});
