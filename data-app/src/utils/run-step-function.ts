import type { DataResponse, StepFunction } from "./data.types";
import { logMessage } from "./log-messages";

export const runStepFunction = async <I, T>(
  step: string,
  stepFunction: StepFunction<I, T>,
  input: I,
): Promise<T | void> => {
  const response: DataResponse<T> = await stepFunction(input);
  if (response.ok) {
    logMessage("HAPPY", `${step} succeeded: ${response.message}`);
    return response.data;
  } else {
    logMessage("ERROR", `${step} failed: ${response.message}`);
  }
};
