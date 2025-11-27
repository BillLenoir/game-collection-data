import type { StepFunction, DataResponse } from "./data.types";
import { logMessage } from "./log-messages";

export const runStepFunction = async <I, T>(
  step: string,
  stepFunction: StepFunction<I, T>,
  input: I,
): Promise<DataResponse<T>> => {
  const response = await stepFunction(input);

  if (response.ok) {
    logMessage("HAPPY", `${step} succeeded: ${response.message}`);
  } else {
    logMessage("ERROR", `${step} failed: ${response.message}`);
  }

  return response;
};
