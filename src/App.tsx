import React, { useState } from "react";

enum StepType {
  Content,
  Command,
}

interface Step {
  id: number;
  title: string;
  type: StepType;
  content: string;
  nextSteps: number[];
}

function App() {
  // Create a task made up of steps.
  const [task, setTask] = useState<Step[]>([
    {
      id: 1,
      title: "Step 1",
      type: StepType.Content,
      content: "",
      nextSteps: [2],
    },
    {
      id: 2,
      title: "Step 2",
      type: StepType.Command,
      nextSteps: [3, 5],
      content: "command 2 {}",
    },
    {
      id: 3,
      title: "Step 3",
      type: StepType.Command,
      nextSteps: [4],
      content: "command 3 {}",
    },
    {
      id: 4,
      title: "Step 4",
      type: StepType.Command,
      content: "command 4 {}",
      nextSteps: [],
    },
    {
      id: 5,
      title: "Step 5",
      type: StepType.Command,
      content: "command 5 {}",
      nextSteps: [],
    },
  ]);

  const [taskResults, setTaskResults] = useState<string[]>([]);

  /*
   * Task functions.
   */
  const runTask = (task: Step[]): void => {
    setTaskResults([]);

    if (task.length > 0) {
      runStep(task[0], "step 1", []);
    }
  };

  /*
   * Step functions.
   */
  const runStep = (step: Step, route: string, passedContent: string[]) => {
    console.log("content: ", step.content, "passedContent:", passedContent);

    //* Current step.
    if (step.type === StepType.Content) {
      step.content = prompt(`Enter content for step ${step.title}`) || "";
      passedContent.push(step.content);
    }

    if (step.type === StepType.Command) {
      step.content = runStepCommand(step.content, passedContent);

      passedContent = [step.content];
    }

    //* Next step.
    if (step.nextSteps.length > 0) {
      step.nextSteps.forEach((nextStepId) => {
        runStep(
          task[nextStepId - 1],
          `${route}->step-${nextStepId}`,
          passedContent
        );
      });
    } else {
      // End of flow.
      console.log(route);
      console.log(passedContent);

      setTaskResults((prevResults) => [...prevResults, step.content]);
    }
  };

  const runStepCommand = (command: string, options: string[]): string => {
    return command.replace(/{}/g, () => options.shift() || command);
  };

  /*
   * User interface.
   */
  return (
    <>
      <button onClick={() => runTask(task)}>Run task.</button>

      {taskResults.map((result, index) => (
        <div key={index}>1. {result}</div>
      ))}

      <div>
        <h3>Task Flow:</h3>
        {task.map((step) => (
          <div key={step.id}>
            <h4>{step.title}</h4>
            <p>
              <strong>Type: </strong>
              {step.type === StepType.Content ? "Content" : "Command"}
            </p>
            <p>
              <strong>Content: </strong>
              {step.content}
            </p>
            <p>
              <strong>Next Steps: </strong>
              {step.nextSteps.length > 0
                ? step.nextSteps.map((nextStepId) => `Step ${nextStepId}`)
                : "End of flow"}
            </p>
            <hr />
          </div>
        ))}
      </div>
    </>
  );
}

export default App;
