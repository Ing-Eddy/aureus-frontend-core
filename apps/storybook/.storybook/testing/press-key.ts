import { userEvent } from "storybook/test";

/**
 * Presses a key and holds it for one task before releasing, like a person does.
 *
 * Radix roving-focus groups (RadioGroup, ToggleGroup, Menubar…) move focus in a `setTimeout`
 * after `keydown`, and RadioGroup only selects the newly focused item while the arrow key is still
 * down. `userEvent.keyboard("{ArrowDown}")` releases the key synchronously, so the selection would
 * never happen in tests. `key` uses user-event names: "ArrowDown", "Home", "End"…
 */
export async function pressKey(key: string, times = 1): Promise<void> {
  for (let index = 0; index < times; index++) {
    await userEvent.keyboard(`{${key}>}`);
    await new Promise((resolve) => setTimeout(resolve, 0));
    await userEvent.keyboard(`{/${key}}`);
  }
}
