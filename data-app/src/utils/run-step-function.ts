import type { DataResponse, StepFunction } from "./data.types";
import { logMessage } from "./log-messages";

export async function runStepFunction<I>(
  step: string,
  stepFunction: StepFunction<I>,
  input: I,
): Promise<string | void> {
  const response: DataResponse = await stepFunction(input);
  if (response.ok) {
    logMessage("HAPPY", `${step} succeeded: ${response.message}`);
    return response.data;
  } else {
    logMessage("ERROR", `${step} failed: ${response.message}`);
  }
}
