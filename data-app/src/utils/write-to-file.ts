import fs from "fs/promises";
import { logMessage } from "./log-messages";

export async function writeToFile(path: string, data: string): Promise<void> {
  try {
    await fs.writeFile(path, data);
    logMessage("HAPPY", `File written: ${path}`);
  } catch (error) {
    throw new Error(
      `Failed to write file ${path} TRY FAILURE MESSAGE: ${error}`,
    );
  }
}
