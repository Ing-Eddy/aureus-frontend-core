import { render, screen, waitFor } from "@testing-library/react";
import { useRef } from "react";
import { describe, expect, it } from "vitest";
import { useInheritedDirection } from "./use-inherited-direction";

function Probe() {
  const ref = useRef<HTMLOutputElement>(null);
  const direction = useInheritedDirection(ref);
  return <output ref={ref}>{direction}</output>;
}

/** jsdom does not derive the computed `direction` from `dir`, so both are set, as a browser would. */
function setDirection(element: HTMLElement, direction: "ltr" | "rtl") {
  element.dir = direction;
  element.style.direction = direction;
}

describe("useInheritedDirection", () => {
  it("follows a direction change of an ancestor after mounting", async () => {
    const view = render(
      <div>
        <div>
          <Probe />
        </div>
      </div>,
    );
    const output = screen.getByRole("status");
    expect(output.textContent).toBe("ltr");
    const ancestor = view.container.firstElementChild as HTMLElement;
    for (const direction of ["rtl", "ltr"] as const) {
      setDirection(ancestor, direction);
      await waitFor(() => expect(output.textContent).toBe(direction));
    }
  });

  it("follows a direction change of the whole document", async () => {
    render(<Probe />);
    setDirection(document.documentElement, "rtl");
    await waitFor(() => expect(screen.getByRole("status").textContent).toBe("rtl"));
    document.documentElement.removeAttribute("dir");
    document.documentElement.removeAttribute("style");
  });
});
