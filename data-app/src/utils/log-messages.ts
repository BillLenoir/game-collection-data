import { LogMessageType } from "./data.types";

const logWithColor = (
  color: string,
  message: string,
  errorMessage?: string,
): void => {
  try {
    console.log(color, message);
    if (errorMessage) {
      console.log(color, errorMessage);
    }
  } catch (error) {
    throw new Error(`Error Message: ${error}`);
  }
};

export const logMessage = (
  type: LogMessageType,
  message: string,
  errorMessage?: string,
): void => {
  const thisErrorMessage = errorMessage ?? "";
  switch (type) {
    case "ERROR":
      logWithColor("\x1b[31m%s\x1b[0m", message, thisErrorMessage);
      break;
    case "HAPPY":
      logWithColor("\x1b[32m%s\x1b[0m", message, thisErrorMessage);
      break;
    case "INFO":
      console.log(message);
      if (errorMessage) console.log(errorMessage);
      break;
    case "WARNING":
      logWithColor("\x1b[33m%s\x1b[0m", message, thisErrorMessage);
      break;
  }
};
