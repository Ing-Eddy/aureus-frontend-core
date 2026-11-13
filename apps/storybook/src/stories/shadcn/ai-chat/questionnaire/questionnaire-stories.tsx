import {
  Questionnaire,
  QuestionnaireActions,
  QuestionnaireChoice,
  QuestionnaireChoiceDescription,
  QuestionnaireChoices,
  QuestionnaireDescription,
  QuestionnaireError,
  QuestionnaireInput,
  QuestionnaireItem,
  QuestionnaireNext,
  QuestionnairePrevious,
  QuestionnaireProgress,
  QuestionnaireSkip,
  QuestionnaireSubmit,
  QuestionnaireTitle,
} from "@aureus-core/ui/shadcn/questionnaire";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { type FormEvent, useState } from "react";
import { expect, fn, userEvent, waitFor } from "storybook/test";
import { docs } from "./questionnaire-docs";

type Answers = Record<string, string | string[]>;

/** Collects the answers from the form: repeated names (checkbox items) become arrays. */
function readAnswers(form: HTMLFormElement): Answers {
  const answers: Answers = {};
  for (const [key, value] of new FormData(form)) {
    const text = String(value);
    const previous = answers[key];
    answers[key] = previous === undefined ? text : [...[previous].flat(), text];
  }
  return answers;
}

interface QuestionnaireArgs {
  shortcuts: "letters" | "numbers" | undefined;
  onComplete: (answers: Answers) => void;
  onItemChange: (item: string) => void;
}

function Survey({ shortcuts, onComplete, onItemChange }: QuestionnaireArgs) {
  const [done, setDone] = useState(false);
  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onComplete(readAnswers(event.currentTarget));
    setDone(true);
  };
  if (done) {
    return (
      <p role="status" className="text-sm">
        Thanks! Your answers were sent.
      </p>
    );
  }
  return (
    <Questionnaire
      shortcuts={shortcuts}
      onItemChange={onItemChange}
      onSubmit={submit}
      className="w-[28rem]"
      aria-label="Onboarding survey"
    >
      <QuestionnaireProgress />
      <QuestionnaireItem name="role" required>
        <QuestionnaireTitle>What is your role?</QuestionnaireTitle>
        <QuestionnaireDescription>Pick the one that fits best.</QuestionnaireDescription>
        <QuestionnaireChoices>
          <QuestionnaireChoice value="design">Designer</QuestionnaireChoice>
          <QuestionnaireChoice value="engineering">Engineer</QuestionnaireChoice>
          <QuestionnaireChoice value="product">
            Product manager
            <QuestionnaireChoiceDescription>
              Roadmaps, specs and research.
            </QuestionnaireChoiceDescription>
          </QuestionnaireChoice>
        </QuestionnaireChoices>
        <QuestionnaireError>Choose a role to continue.</QuestionnaireError>
      </QuestionnaireItem>
      <QuestionnaireItem name="tools" multiple>
        <QuestionnaireTitle>Which tools do you use?</QuestionnaireTitle>
        <QuestionnaireDescription>Select all that apply.</QuestionnaireDescription>
        <QuestionnaireChoices>
          <QuestionnaireChoice value="figma">Figma</QuestionnaireChoice>
          <QuestionnaireChoice value="storybook">Storybook</QuestionnaireChoice>
          <QuestionnaireChoice value="linear">Linear</QuestionnaireChoice>
        </QuestionnaireChoices>
      </QuestionnaireItem>
      <QuestionnaireItem name="team">
        <QuestionnaireTitle>What is your team called?</QuestionnaireTitle>
        <QuestionnaireInput placeholder="Design systems" aria-label="Team name" />
      </QuestionnaireItem>
      <QuestionnaireActions>
        <QuestionnairePrevious />
        <QuestionnaireSkip />
        <QuestionnaireNext />
        <QuestionnaireSubmit />
      </QuestionnaireActions>
    </Questionnaire>
  );
}

const meta = {
  title: "shadcn/AI & Chat/Questionnaire",
  parameters: { aureusDocs: docs },
  args: { shortcuts: "numbers", onComplete: fn(), onItemChange: fn() },
  argTypes: {
    shortcuts: {
      control: "inline-radio",
      options: [undefined, "letters", "numbers"],
      table: { category: "Behavior" },
    },
    onComplete: { table: { category: "Events" } },
    onItemChange: { table: { category: "Events" } },
  },
  render: (args) => <Survey key={String(args.shortcuts)} {...args} />,
} satisfies Meta<QuestionnaireArgs>;

export default meta;
type Story = StoryObj<typeof meta>;

const progress = (canvas: { getByRole: (role: string) => HTMLElement }) =>
  canvas.getByRole("progressbar");

/**
 * Answering advances the progress counter; Previous goes back; submitting the last question calls
 * `onComplete` with every answer.
 */
export const Playground: Story = {
  play: async ({ args, canvas }) => {
    await expect(progress(canvas)).toHaveTextContent("Question 1 of 3");
    await userEvent.click(canvas.getByRole("radio", { name: "Engineer" }));
    await userEvent.click(canvas.getByRole("button", { name: /^Next/ }));
    await waitFor(() => expect(progress(canvas)).toHaveTextContent("Question 2 of 3"));
    await expect(args.onItemChange).toHaveBeenLastCalledWith("tools");

    await userEvent.click(canvas.getByRole("checkbox", { name: "Figma" }));
    await userEvent.click(canvas.getByRole("checkbox", { name: "Storybook" }));
    await userEvent.click(canvas.getByRole("button", { name: /^Previous/ }));
    await waitFor(() => expect(progress(canvas)).toHaveTextContent("Question 1 of 3"));
    await expect(canvas.getByRole("radio", { name: "Engineer" })).toBeChecked();
    await userEvent.click(canvas.getByRole("button", { name: /^Next/ }));
    await userEvent.click(canvas.getByRole("button", { name: /^Next/ }));
    await waitFor(() => expect(progress(canvas)).toHaveTextContent("Question 3 of 3"));

    await userEvent.type(canvas.getByRole("textbox", { name: "Team name" }), "Aureus");
    await userEvent.click(canvas.getByRole("button", { name: /^Submit/ }));
    await expect(args.onComplete).toHaveBeenCalledWith({
      role: "engineering",
      tools: ["figma", "storybook"],
      team: "Aureus",
    });
    await expect(await canvas.findByRole("status")).toHaveTextContent("Thanks!");
  },
};

/** The first question is single choice: radios with number shortcuts. */
export const SingleChoice: Story = {
  play: async ({ canvas }) => {
    await expect(canvas.getAllByRole("radio")).toHaveLength(3);
    await expect(canvas.getByRole("group", { name: "What is your role?" })).toBeInTheDocument();
  },
};

/** Skip moves past an optional question without answering it. */
export const SkipOptional: Story = {
  play: async ({ canvas }) => {
    await userEvent.click(canvas.getByRole("radio", { name: "Designer" }));
    await userEvent.click(canvas.getByRole("button", { name: /^Next/ }));
    await waitFor(() => expect(progress(canvas)).toHaveTextContent("Question 2 of 3"));
    await userEvent.click(canvas.getByRole("button", { name: /^Skip/ }));
    await waitFor(() => expect(progress(canvas)).toHaveTextContent("Question 3 of 3"));
  },
};

export const LetterShortcuts: Story = { args: { shortcuts: "letters" } };
