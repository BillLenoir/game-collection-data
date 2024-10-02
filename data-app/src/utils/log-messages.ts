import type { LogMessageType } from "./data.types";

export const logMessage = (
  type: LogMessageType,
  message: string,
  errorMessage?: string,
): void => {
  switch (type) {
    case "ERROR":
      console.error("\x1b[31m%s\x1b[0m", message);
      if (errorMessage) {
        console.error("\x1b[31m%s\x1b[0m", errorMessage);
      }
      break;
    case "INFO":
      console.log("\x1b[32m%s\x1b[0m", message);
      if (errorMessage) {
        console.log("\x1b[32m%s\x1b[0m", errorMessage);
      }
      break;
    case "WARNING":
      console.warn("\x1b[33m%s\x1b[0m", message);
      if (errorMessage) {
        console.warn("\x1b[33m%s\x1b[0m", errorMessage);
      }
  }
};
