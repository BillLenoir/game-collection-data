import fs from "fs/promises";
import { logMessage } from "./log-messages";

export async function writeToFile(path: string, data: string): Promise<void> {
  try {
    await fs.writeFile(path, data);
    logMessage("HAPPY", `File written: ${path}`);
  } catch (error) {
    logMessage(
      "ERROR",
      `Failed to write file ${path}`,
      `${error instanceof Error ? error.message : String(error)}`,
    );
  }
}
